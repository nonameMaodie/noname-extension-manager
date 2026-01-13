<script setup>
  import { ref, watch } from "vue";
  import { useExtensionsStore } from "../../../stores/extensions.js";
  import OperationCardArea from "./OperationCardArea.vue";

  const store = useExtensionsStore();
  const search = ref("");

  watch(search, (val) => {
    const text = val.trim();
    if (text) store.searchText = text;
    else store.searchText = "";
  });
</script>

<template>
  <OperationCardArea name="搜索：">
    <input
      id="search-extension"
      class="search-bar-input"
      type="text"
      maxlength="20"
      v-model="search"
      placeholder="搜索扩展..."
    >
  </OperationCardArea>
</template>

<style scoped>
  .search-bar-input {
    padding-left: 6px;
    flex: 1;
    width: 100%;
    height: 100%;
    font-size: 14px;
  }

  .search-bar-input:focus {
    background: transparent;
  }

  .search-bar-input::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
    font-size: 14px;
    font-family: inherit;
  }
</style>
