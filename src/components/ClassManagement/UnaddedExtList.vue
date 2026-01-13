<script setup>
  import { useExtensionsClassesStore } from "../../stores/extensionsClasses.js";
  import ExtensionList from "./ExtensionList.vue";

  const store = useExtensionsClassesStore();
</script>

<template>
  <ExtensionList
    title="未加入分类的扩展"
    :extensions="store.unaddedExtList"
    @toggle="store.toggleExtensionFromClass"
  />
</template>

<style scoped></style>
