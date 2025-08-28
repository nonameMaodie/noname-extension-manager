<script setup>
import ExtensionList from './ExtensionList.vue'
import { useExtensionsClassesStore } from '../../stores/extensionsClasses.js'
const store = useExtensionsClassesStore()
</script>

<template>
  <ExtensionList
    title="已加入分类的扩展"
    :extensions="store.addedExtList"
    @toggle="store.toggleExtensionFromClass"
  />
</template>
