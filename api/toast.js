import toast, { Toaster } from '../external/vue3-hot-toast.js'
import { createApp } from '../external/vue.js'
import { lib, ui, game } from '../external/noname.js'
import { autoZoom } from '../utils/autoZoom.js'

let inited = false

function init() {
	if (inited) return
	inited = true
	const app = createApp(Toaster, {
		position: "top-center",
		reverseOrder: true,
		class: 'kzgj-div-style'
	});
	const ToasterInstance = app.mount(document.createElement('div'))
	autoZoom(ToasterInstance.$el, {
		width: 1100,
		height: 750,
	})
	ToasterInstance.$el.style.zoom = 1 / game.documentZoom
	ui.window.appendChild(ToasterInstance.$el)
}

export function useToast() {
	init()
	return toast
}


