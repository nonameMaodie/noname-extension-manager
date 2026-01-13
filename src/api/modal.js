import { ui } from "noname";
import { createApp, h, ref } from "vue";
import Modal from "../components/common/Modal.vue";

export function showModal(ModalProps, component, props) {
  return new Promise((resolve) => {
    const open = ref(false);
    const dialog = () =>
      h(
        Modal,
        {
          ...ModalProps,
          modelValue: open.value,
          onCancel: () => {
            unmount();
            resolve(false);
          },
          onConfirm: () => {
            unmount();
            resolve(true);
          },
        },
        {
          default: () => {
            if (
              !(component && ["object", "function"].includes(typeof component))
            )
              return null;
            return h(component, {
              ...props,
              onCancel: () => {
                unmount();
                resolve(false);
              },
              onConfirm: (result) => {
                unmount();
                resolve(result);
              },
            });
          },
        }
      );

    const app = createApp(dialog);
    const div = document.createElement("div");
    app.mount(div);
    ui.window.appendChild(div);
    setTimeout(() => (open.value = true), 0);
    function unmount() {
      open.value = false;
      setTimeout(() => {
        app.unmount();
        ui.window.removeChild(div);
      }, 500);
    }
  });
}
