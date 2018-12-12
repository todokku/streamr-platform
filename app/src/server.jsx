import path from 'path'
import express from 'express'
import cors from 'cors'
import React from 'react'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Frontload, frontloadServerRender } from 'react-frontload'
import mapValues from 'lodash/mapValues'
import App from './marketplace/components/App'
import createStore from './store'

const app = express()

const { PLATFORM_BASE_PATH, PORT } = process.env

const basePath = PLATFORM_BASE_PATH || '/'
app.use(cors())
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(basePath, express.static('./dist_browser'))

app.get('*', async (req, res) => { // TODO: error handling
    const { store } = createStore(req.url)

    const markup = await frontloadServerRender(() => (
        renderToString((
            <Provider store={store}>
                <StaticRouter
                    location={req.url}
                    basename={basePath}
                    context={{}} // Don't really know what this is but it has to be there - aapzu
                >
                    <Frontload isServer>
                        <App />
                    </Frontload>
                </StaticRouter>
            </Provider>
        ))
    ))

    const helmet = mapValues(Helmet.renderStatic(), (val) => val.toString())

    res.render('index', {
        cssBundleSrc: path.resolve(basePath, 'main.css'),
        jsBundleSrc: path.resolve(basePath, 'bundle.js'),
        preloadedState: JSON.stringify(store.getState()),
        ...helmet,
        markup,
    })
})

app.listen(PORT, () => {
    console.info(`Server is listening on port: ${PORT}`) // eslint-disable-line no-console
})

app.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`${PORT} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${PORT} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
})