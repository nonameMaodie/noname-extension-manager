<script setup>
import ExtensionList from './ExtensionList.vue'
import { useExtensionsStore } from '../../stores/extensions.js'
import { emitter } from '../../utils/emitter.js'

const store = useExtensionsStore()

function handleToggle(ext) {
  store.toggleExtensionEnabled(ext)
  emitter.emit('toggleExtensionEnabled', ext)
}

function handleBatchToggle() {
  emitter.emit('disableAllExtensions')
  store.disableAllExtensions()
}
</script>

<template>
  <ExtensionList
    title="已启用的扩展"
    :extensions="store.enabledExtensions"
    @toggle="handleToggle"
    @batchToggle="handleBatchToggle"
    @showDetail="store.showExtensionDetail"
    @toggleHide="store.toggleExtensionHide"
    @uninstall="store.uninstallExtension"
  />
</template>

<style scoped></style>
