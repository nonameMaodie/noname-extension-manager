<script setup>
import OperationCardArea from './OperationCardArea.vue'
import { useThemeStore } from'../../../stores/theme.js'

const store = useThemeStore()
</script>

<template>
  <OperationCardArea name="主题：">
    <button type="button" class="previous-theme" @click="store.setPreviousTheme">上一个</button>
    <button type="button" class="next-theme" @click="store.setNextTheme">下一个</button>
  </OperationCardArea>
</template>

<style scoped>
.previous-theme,
.next-theme {
  font-size: 14px;
  flex: 1;
  height: 100%;
  font-weight: 500;
}

.previous-theme {
  border-right: 0.6px solid var(--border-muted);
}

.next-theme {
  border-left: 0.6px solid var(--border-muted);
}
.previous-theme:hover,
.next-theme:hover {
  color: var(--theme-dark);
}
</style>
