<script setup>
  import { defineEmits, defineProps } from "vue";
  import { useExtensionsClassesStore } from "../../stores/extensionsClasses.js";

  const store = useExtensionsClassesStore();
  const props = defineProps({
    extension: { type: Object, required: true },
  });
  const emit = defineEmits(["toggle"]);
  function handleClickItem(extension) {
    if (store.currentClass.id === 0) {
      return;
    }
    emit("toggle", extension);
  }
</script>

<template>
  <li class="ext-item" @click="handleClickItem(extension)">
    <div class="ext-item-main">
      <span class="ext-name">{{ extension.name }}</span>
    </div>
  </li>
</template>

<style scoped>
  .ext-item {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-light);
    border-radius: 8px;
    border: 1px solid var(--border-muted);
    margin-bottom: 10px;
  }
  .ext-item-main {
    display: flex;
    flex-direction: column;
  }
  .ext-name {
    font-weight: bold;
  }
</style>
