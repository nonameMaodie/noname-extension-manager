<script setup>
  import { ui } from "noname";
  import { defineProps, nextTick, onMounted, onUnmounted, ref } from "vue";
  import ExtensionManger from "./components/ExtensionManager.vue";

  const { onCloseApp } = defineProps({
    onCloseApp: {
      type: Function,
      default: () => {},
    },
  });

  const app = ref(null);
  let observer;
  let oldZIndex;

  onMounted(async () => {
    await nextTick();
    // 更改菜单容器的z-index
    oldZIndex = getComputedStyle(ui.menuContainer).zIndex;
    ui.menuContainer.style.zIndex = 10;
    // 实时切换背景图片
    const el = app.value.$el;
    el.style.backgroundImage = ui.background.style.backgroundImage;
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style" &&
          mutation.target === ui.background
        ) {
          el.style.backgroundImage = window.getComputedStyle(
            ui.background
          ).backgroundImage;
        }
      });
    });
    observer.observe(ui.background, {
      attributes: true,
      attributeFilter: ["style"],
    });
  });

  onUnmounted(() => {
    observer?.disconnect?.();
    oldZIndex && (ui.menuContainer.style.zIndex = oldZIndex);
  });
</script>

<template>
  <ExtensionManger
    class="kzgj-extension-manager-app"
    @click.self="onCloseApp"
    ref="app"
  />
</template>

<style scoped>
  .kzgj-extension-manager-app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
  }
</style>
