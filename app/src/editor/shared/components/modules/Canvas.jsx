import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import links from '../../../../links'

import styles from './Canvas.pcss'

const getCanvasPort = ({ params }) => params.find(({ name }) => name === 'canvas')

export default class CanvasModule extends React.Component {
    subscription = React.createRef()

    render() {
        const { className, isActive } = this.props
        const currentCanvasPort = getCanvasPort(this.props.module)

        return (
            <div className={cx(className, styles.SubCanvas)}>
                {isActive && currentCanvasPort && currentCanvasPort.value && (
                    <Link
                        className={styles.link}
                        to={`${links.editor.canvasEditor}/${currentCanvasPort.value}`}
                    >
                        <button
                            type="button"
                            className={styles.button}
                        >
                            View Canvas
                        </button>
                    </Link>
                )}
            </div>
        )
    }
}
