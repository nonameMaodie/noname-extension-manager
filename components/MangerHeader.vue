<script setup>
import { defineProps, defineModel } from '../external/vue.js'

const model = defineModel({ type: String, required: true }) // 接收一个字符串，作为当前页面的标题
const { pages } = defineProps({
  pages: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="manager-header">
    <div class="title">扩展管家</div>
    <div class="manager-header-tabs">
      <button
        v-for="(p, i) in pages"
        :key="i"
        :class="['manager-header-tab', { active: model === p }]"
        @click="model = p"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 15px;
  border-bottom: 2px solid var(--border);
}
.manager-header > .title {
  font-size: 24px;
  font-weight: bold;
  color: var(--theme-dark);
}
.manager-header-tabs {
  display: flex;
  gap: 12px;
}
.manager-header-tab {
  background: none;
  border: none;
  color: var(--text);
  font-size: 18px;
  padding: 6px 16px;
  border-radius: 6px;
  transition:
    background 0.2s,
    color 0.2s;
}
.manager-header-tab.active {
  background: var(--theme-dark);
  color: var(--text-light);
}
.manager-header-tab:hover:not(.active) {
   background: var(--theme-dark);
   color: var(--text-light);
}
</style>
