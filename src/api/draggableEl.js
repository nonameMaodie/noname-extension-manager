import DraggableEl from '../components/common/DraggableEl.vue'
import { createApp, h, ref } from 'vue'
import { lib, ui, game } from 'noname'

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
