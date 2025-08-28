<script setup>
import ExtensionManger from './components/ExtensionManager.vue'
import { defineProps, onMounted, onUnmounted, ref, nextTick } from './external/vue.js'
import { ui } from './external/noname.js'

const { onCloseApp } = defineProps({
  onCloseApp: {
    type: Function,
    default: () => {},
  },
})

const app = ref(null)
let observer
const oldZIndex = getComputedStyle(ui.menuContainer).zIndex
	
onMounted(async ()=>{
	await nextTick()
	// 更改菜单容器的z-index
	ui.menuContainer.style.zIndex = 10
	// 实时切换背景图片
	const el = app.value.$el
	el.style.backgroundImage = ui.background.style.backgroundImage
	observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'style' && mutation.target === ui.background) {
				el.value.style.backgroundImage = window.getComputedStyle(ui.background).backgroundImage;
			}
		});
	});
	observer.observe(ui.background, {
		attributes: true,
		attributeFilter: ['style']
	})
})

onUnmounted(() => {
	observer?.disconnect?.();
	ui.menuContainer.style.zIndex = oldZIndex
})

</script>

<template>
  <ExtensionManger class="kzgj-extension-manager-app" @click.self="onCloseApp" ref="app"/>
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
