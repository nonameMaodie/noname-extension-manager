import { ui } from "noname";
import { createApp, h } from "vue";
import DraggableEl from "../components/common/DraggableEl.vue";

export function createDraggableEl(textContent, onClick) {
  const vn = h(
    DraggableEl,
    {
      onClick,
      class: "kzgj-div-style roundarenabutton menubutton round",
    },
    {
      default: () => textContent
    }
  );
  const app = createApp(vn);
  const vm = app.mount(document.createElement("div"));
  ui.arena.appendChild(vm.$el);
  return vm.$el;
}
