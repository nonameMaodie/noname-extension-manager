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
		class: 'kzgj-div-style',
		style: {
			fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
		}
	});
	const ToasterInstance = app.mount(document.createElement('div'))
	autoZoom(ToasterInstance.$el, {
		width: 1440
	})
	ui.window.appendChild(ToasterInstance.$el)
}

export function useToast() {
	init()
	return toast
}



