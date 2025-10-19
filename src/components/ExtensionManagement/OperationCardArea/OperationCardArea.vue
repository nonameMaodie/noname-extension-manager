<script setup>
import { defineProps } from '../../../external/vue.js'
defineProps({
  name: String,
})
</script>

<template>
  <div class="operation-card-area">
    <span>{{ name }}</span>
    <div class="operation-card">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.operation-card-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  align-items: start;
  background: var(--bg);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.operation-card-area span {
  font-size: 16px;
}

.operation-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  background: var(--bg-light);
  border-radius: 6px;
  padding: 6px 6px;
  height: 36px;
  width: 100%;
  border: 1px solid var(--border-muted);
}
</style>
