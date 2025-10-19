<script setup>
import ExtensionList from './ExtensionList.vue'
import { useExtensionsClassesStore } from '../../stores/extensionsClasses.js'
const store = useExtensionsClassesStore()
</script>

<template>
  <ExtensionList
    title="未加入分类的扩展"
    :extensions="store.unaddedExtList"
    @toggle="store.toggleExtensionFromClass"
  />
</template>

<style scoped></style>
