<script setup>
  import { defineEmits, defineProps } from "vue";
  import { useExtensionsClassesStore } from "../../stores/extensionsClasses.js";
  import iconToTop from "../icons/iconToTop.vue";
  import iconToBottom from "../icons/iconToBottom.vue";

  const store = useExtensionsClassesStore();
  const props = defineProps({
    showActions: { type: Boolean},
    extension: { type: Object, required: true },
  });
  const emit = defineEmits(["toggle", "toTop", "toBottom"]);
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
    <div class="action-btns" v-if="showActions">
      <button @click.stop='$emit("toTop", extension)'>
        <iconToTop class="icon-toTop" />
      </button>
      <button @click.stop='$emit("toBottom", extension)'>
        <iconToBottom class="icon-toBottom" />
      </button>
    </div>
  </li>
</template>

<style scoped>
  .ext-item {
    padding: 12px;
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

  .action-btns {
    display: flex;
    gap: 12px;
    cursor: default;
  }

  .action-btns .icon-toTop,
  .action-btns .icon-toBottom {
    opacity: 0.5;
    width: 20px;
    fill: var(--text-muted);
    height: 20px;
    vertical-align: bottom;
    cursor: pointer;
  }
  .action-btns .icon-toTop:hover,
  .action-btns .icon-toBottom:hover {
    opacity: 1;
  }
</style>
