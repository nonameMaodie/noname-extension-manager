<script setup>
import { defineProps, ref, watch } from '../../external/vue.js'
import ExtensionItem from './ExtensionItem.vue'
import { useDraggable } from '../../external/vue-draggable-plus.js'
import { useExtensionsClassesStore } from '../../stores/extensionsClasses.js'
import { useExtensionsStore } from '../../stores/extensions.js'

const store = useExtensionsClassesStore()
const extsStore = useExtensionsStore()
const props = defineProps({
  title: String,
  extensions: { type: Array, default: () => [] },
})
const el = ref(null)
const draggable = useDraggable(el, props.extensions, {
  onUpdate() {
    extsStore.updateExtensionSort()
  },
})
const itemDraggable = ref(store.currentClass.id === 0)
watch(
  () => store.currentClass,
  (val) => {
    if (val.id === 0) {
      draggable?.start?.()
      itemDraggable.value = true
    } else {
      draggable?.pause?.()
      itemDraggable.value = false
    }
  },
)
</script>

<template>
  <div class="ext-list">
    <div class="list-header">
      <div class="list-name">{{ title }} ({{ extensions.length }})</div>
    </div>
    <ul
      v-if="store.currentClass.id === 0 && !extensions.length"
      class="list-items"
      style="display: flex; justify-content: center; align-items: center; font-size: 22px"
    >
      拖拽右边的扩展卡片排序
    </ul>
    <TransitionGroup name="list" tag="ul" class="list-items" ref="el">
      <ExtensionItem
        v-for="ext in extensions"
        :key="ext.id"
        :extension="ext"
        @toggle="$emit('toggle', ext)"
        :class="{ 'list-item-draggable': itemDraggable }"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
div.ext-list {
  flex: 1;
  background: var(--bg);
  border-radius: 8px;
  border: 1px solid var(--border);
  height: 100%;
}
div.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  height: 50px;
}
div.list-name {
  font-size: 18px;
  font-weight: 500;
}
.batch-btn {
  border: 1.5px solid var(--border);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 15px;
}
.batch-btn:hover[data-type='openAll'] {
  background: var(--success);
}
.batch-btn:hover[data-type='closeAll'] {
  background: var(--danger);
}
ul.list-items {
  position: relative;
  list-style: none;
  padding: 0 10px;
  margin: 0;
  height: calc(100% - 50px);
  overflow: auto;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
/* 确保离开的项目不会影响布局 */
.list-leave-active {
  position: absolute;
  width: calc(100% - 20px);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
/* 添加 move 过渡 */
.list-move {
  transition: transform 0.23s ease;
}
.list-items li {
  cursor: pointer;
}
.list-items li.list-item-draggable {
  cursor: move;
}
</style>
