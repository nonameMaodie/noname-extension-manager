import DraggableEl from '../components/common/DraggableEl.vue'
import { createApp, h, ref } from '../external/vue.js'
import { lib, ui, game } from '../external/noname.js'

export function createDraggableEl(textContent, onClick) {
	const vn = h(DraggableEl, {
		onClick,
		class: 'kzgj-div-style roundarenabutton menubutton round'
	}, textContent)
	const app = createApp(vn);
	const vm = app.mount(document.createElement('div'))
	ui.arena.appendChild(vm.$el)
	return vm.$el
}
