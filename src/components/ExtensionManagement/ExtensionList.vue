<script setup>
import { defineProps, defineEmits, computed } from '../../external/vue.js'
import ExtensionItem from './ExtensionItem.vue'

const props = defineProps({
  title: String,
  extensions: { type: Array, default: () => [] },
})
const emits = defineEmits(['toggle', 'batchToggle', 'showDetail', 'toggleHide', 'uninstall'])

const isAllEnabled = computed(
  () => props.extensions.length > 0 && props.extensions.every((e) => e.enabled),
)
</script>

<template>
  <div class="ext-list">
    <div class="list-header">
      <div class="list-name">{{ title }} ({{ extensions.length }})</div>
      <button
        v-if="extensions.length > 0"
        class="batch-btn"
        :data-type="isAllEnabled ? 'closeAll' : 'openAll'"
        @click="$emit('batchToggle')"
      >
        {{ isAllEnabled ? '全部关闭' : '全部开启' }}
      </button>
    </div>
    <TransitionGroup name="list" tag="ul" class="list-items">
      <ExtensionItem
        v-for="ext in extensions"
        :key="ext.id"
        :extension="ext"
        @showDetail="$emit('showDetail', ext)"
        @toggle="$emit('toggle', ext)"
        @toggleHide="$emit('toggleHide', ext)"
        @uninstall="$emit('uninstall', ext)"
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}
.batch-btn[data-type='openAll'] {
  border: 1px solid var(--success);
}
.batch-btn:hover[data-type='openAll'] {
  color: var(--text-light);
  background: var(--success);
}
.batch-btn[data-type='closeAll'] {
  border: 1px solid var(--danger);
}
.batch-btn:hover[data-type='closeAll'] {
  color: var(--text-light);
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
  transition: all 0.23s ease;
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
</style>
