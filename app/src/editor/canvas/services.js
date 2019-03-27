/**
 * Canvas-specific API call wrappers
 */

import axios from 'axios'

import Autosave from '$editor/shared/utils/autosave'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { emptyCanvas } from './state'

export const API = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

const getData = ({ data }) => data

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModulesURL = `${process.env.STREAMR_API_URL}/modules`
const getModuleCategoriesURL = `${process.env.STREAMR_API_URL}/module_categories`
const streamsUrl = `${process.env.STREAMR_API_URL}/streams`

const AUTOSAVE_DELAY = 3000

async function save(canvas) {
    return API.put(`${canvasesUrl}/${canvas.id}`, canvas).then(getData)
}

function autoSaveWithNotification() {
    const autosave = Autosave(save, AUTOSAVE_DELAY)

    autosave.on('fail', () => {
        Notification.push({
            title: 'Autosave failed.',
            icon: NotificationIcon.ERROR,
        })
    })

    return autosave
}

export const autosave = autoSaveWithNotification()

export async function saveNow(canvas, ...args) {
    if (autosave.pending) {
        return autosave.run(canvas, ...args) // do not wait for debounce
    }

    return save(canvas, ...args)
}

async function createCanvas(canvas) {
    return API.post(canvasesUrl, canvas).then(getData)
}

export async function create() {
    return createCanvas(emptyCanvas()) // create new empty
}

export async function moduleHelp({ id }) {
    return API.get(`${process.env.STREAMR_API_URL}/modules/${id}/help`).then(getData)
}

export async function duplicateCanvas(canvas) {
    const savedCanvas = await saveNow(canvas) // ensure canvas saved before duplicating
    return createCanvas(savedCanvas)
}

export async function deleteCanvas({ id } = {}) {
    await autosave.cancel()
    return API.delete(`${canvasesUrl}/${id}`).then(getData)
}

export async function getModuleCategories() {
    return API.get(getModuleCategoriesURL).then(getData)
}

export async function getModules() {
    return API.get(getModulesURL).then(getData)
}

export async function addModule({ id, configuration } = {}) {
    return API.post(`${getModulesURL}/${id}`, configuration).then(getData)
}

export async function loadCanvas({ id } = {}) {
    return API.get(`${canvasesUrl}/${id}`).then(getData)
}

export async function loadCanvases() {
    return API.get(canvasesUrl).then(getData)
}

async function startCanvas(canvas, { clearState }) {
    const savedCanvas = await saveNow(canvas)
    return API.post(`${canvasesUrl}/${savedCanvas.id}/start`, {
        clearState: !!clearState,
    }).then(getData)
}

async function startAdhocCanvas(canvas, options = {}) {
    const savedCanvas = await saveNow(canvas)
    const adhocCanvas = await createCanvas({
        ...savedCanvas,
        adhoc: true,
        settings: {
            ...savedCanvas.settings,
            parentCanvasId: canvas.id, // track parent canvas so can return after end
        },
    })
    return startCanvas(adhocCanvas, options)
}

export async function start(canvas, options = {}) {
    const { adhoc } = options
    if (!adhoc) { return startCanvas(canvas, options) }
    return startAdhocCanvas(canvas, options)
}

export async function stop(canvas) {
    return API.post(`${canvasesUrl}/${canvas.id}/stop`).then(getData)
}

export async function getStreams(params) {
    return API.get(`${streamsUrl}`, { params }).then(getData)
}

export async function deleteAllCanvases() {
    // try do some clean up so we don't fill the server with cruft
    const canvases = await loadCanvases()
    return Promise.all(canvases.map((canvas) => (
        deleteCanvas(canvas)
    )))
}
