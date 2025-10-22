<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { extensionList } from '../../../stores/libExtensions.js'
import { useExtensionsStore } from '../../../stores/extensions.js'
import OperationCardArea from './OperationCardArea.vue'
import { emitter } from '../../../utils/emitter.js'

/* 这里的逻辑是AI写的，能跑就行 */

const extensionsStore = useExtensionsStore()
const history = ref([]) // 操作历史栈
const historyIndex = ref(-1) // 当前历史位置

// 添加批量操作类型
const OPERATION_TYPES = {
  ENABLE: 'enable',
  DISABLE: 'disable',
  ENABLE_ALL: 'enable_all', // 全部开启
  DISABLE_ALL: 'disable_all', // 全部关闭
  CUSTOM_BATCH: 'custom_batch' // 用于记录任意混合状态的批量操作
}

// 处理批量操作（包括 CUSTOM_BATCH）
function recordOperation(extension, operationType) {
  if (
    operationType === OPERATION_TYPES.ENABLE_ALL ||
    operationType === OPERATION_TYPES.DISABLE_ALL ||
    operationType === OPERATION_TYPES.CUSTOM_BATCH
  ) {
    // 删除当前点之后的历史（如果有重做操作后又进行新操作）
    if (historyIndex.value < history.value.length - 1) {
      history.value.splice(historyIndex.value + 1)
    }

    // 记录当前所有扩展的状态
    const extensionsState = extensionList.value.map((ext) => ({
      name: ext.name,
      enabled: ext.enabled,
    }))

    history.value.push({
      type: operationType,
      extensions: extensionsState,
      timestamp: Date.now(),
    })

    historyIndex.value = history.value.length - 1
    return
  }

  // 原有单个扩展操作逻辑保持不变
  if (historyIndex.value < history.value.length - 1) {
    history.value.splice(historyIndex.value + 1)
  }

  history.value.push({
    extension: extension.name,
    type: operationType,
    timestamp: Date.now(),
  })

  historyIndex.value = history.value.length - 1
}

function undoAction() {
  if (historyIndex.value < 0) return

  const operation = history.value[historyIndex.value]
  historyIndex.value--

  // 处理所有批量操作类型（包括 CUSTOM_BATCH）
  if (
    operation.type === OPERATION_TYPES.ENABLE_ALL ||
    operation.type === OPERATION_TYPES.DISABLE_ALL
  ) {
      operation.extensions.forEach((extState) => {
		const extension = extensionList.value.find((ext) => ext.name === extState.name)
		  if (extension && extension.enabled !== extState.enabled) {
			extensionsStore.toggleExtensionEnabled(extension)
		}
	  })
    return
  }

  if (operation.type === OPERATION_TYPES.CUSTOM_BATCH) {
      operation.extensions.forEach((extState) => {
		const extension = extensionList.value.find((ext) => ext.name === extState.name)
		  if (extension && extension.enabled !== extState.enabled) {
			extState.enabled = extension.enabled;
			extensionsStore.toggleExtensionEnabled(extension)
		}
	  })
    return
  }

  // 原有单个扩展撤销逻辑
  if (operation.type === OPERATION_TYPES.ENABLE) {
    const extension = extensionList.value.find((ext) => ext.name === operation.extension)
    if (extension) {
      extensionsStore.toggleExtensionEnabled(extension)
    }
  } else if (operation.type === OPERATION_TYPES.DISABLE) {
    const extension = extensionList.value.find((ext) => ext.name === operation.extension)
    if (extension) {
      extensionsStore.toggleExtensionEnabled(extension)
    }
  }
}

function redoAction() {
  if (historyIndex.value >= history.value.length - 1) return

  historyIndex.value++
  const operation = history.value[historyIndex.value]

  // 处理批量操作恢复
  if (
    operation.type === OPERATION_TYPES.ENABLE_ALL ||
    operation.type === OPERATION_TYPES.DISABLE_ALL ||
    operation.type === OPERATION_TYPES.CUSTOM_BATCH
  ) {
    // CUSTOM_BATCH 重做时恢复操作时的状态
    if (operation.type === OPERATION_TYPES.CUSTOM_BATCH) {
	  operation.extensions.forEach((extState) => {
	    const extension = extensionList.value.find((ext) => ext.name === extState.name)
	      if (extension && extension.enabled !== extState.enabled) {
			extState.enabled = extension.enabled;
		    extensionsStore.toggleExtensionEnabled(extension)
	    }
	  })
	  return
	}

    // 原有的 ENABLE_ALL / DISABLE_ALL 逻辑
    if (operation.type === OPERATION_TYPES.ENABLE_ALL) {
      extensionList.value.forEach((ext) => {
        if (!ext.enabled) {
          extensionsStore.toggleExtensionEnabled(ext)
        }
      })
    } else if (operation.type === OPERATION_TYPES.DISABLE_ALL) {
      extensionList.value.forEach((ext) => {
        if (ext.enabled) {
          extensionsStore.toggleExtensionEnabled(ext)
        }
      })
    }
    return
  }

  // 原有单个扩展恢复逻辑
  if (operation.type === OPERATION_TYPES.ENABLE) {
    const extension = extensionList.value.find((ext) => ext.name === operation.extension)
    if (extension) {
      extensionsStore.toggleExtensionEnabled(extension)
    }
  } else if (operation.type === OPERATION_TYPES.DISABLE) {
    const extension = extensionList.value.find((ext) => ext.name === operation.extension)
    if (extension) {
      extensionsStore.toggleExtensionEnabled(extension)
    }
  }
}

// 监听扩展状态变化并记录到历史
function handleExtensionToggle(extension) {
  const operationType = extension.enabled ? OPERATION_TYPES.ENABLE : OPERATION_TYPES.DISABLE
  recordOperation(extension, operationType)
}
// 记录批量操作历史
function recordBatchOperation(operationType) {
  recordOperation(null, operationType)
}
// 监听扩展状态的全部开启批量变化
function handleEnableAllExtensions() {
  recordBatchOperation(OPERATION_TYPES.ENABLE_ALL)
}
// 监听扩展状态的全部关闭批量变化
function handleDisableAllExtensions() {
  recordBatchOperation(OPERATION_TYPES.DISABLE_ALL)
}

// 监听自定义批量操作
function handleCustomBatchOperation() {
  recordBatchOperation(OPERATION_TYPES.CUSTOM_BATCH)
}

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    undoAction()
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    e.preventDefault()
    redoAction()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  emitter.on('toggleExtensionEnabled', handleExtensionToggle)
  emitter.on('enableAllExtensions', handleEnableAllExtensions)
  emitter.on('disableAllExtensions', handleDisableAllExtensions)
  emitter.on('customBatchOperation', handleCustomBatchOperation)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  emitter.off('toggleExtensionEnabled', handleExtensionToggle)
  emitter.off('enableAllExtensioffs', handleEnableAllExtensions)
  emitter.off('disableAllExtensioffs', handleDisableAllExtensions)
  emitter.off('customBatchOperation', handleCustomBatchOperation)
})
</script>

<template>
  <OperationCardArea name="回溯：">
    <button type="button" @click="undoAction" :disabled="historyIndex < 0" class="undo-action-btn">
      撤销 (Ctrl+Z)
    </button>
    <button
      type="button"
      @click="redoAction"
      :disabled="historyIndex >= history.length - 1"
      class="redo-action-btn"
    >
      恢复 (Ctrl+Y)
    </button>
  </OperationCardArea>
</template>

<style scoped>
.undo-action-btn,
.redo-action-btn {
  font-size: 14px;
  flex: 1;
  font-weight: 500;
  height: 100%;
}

.undo-action-btn {
  border-right: 0.6px solid var(--border-muted);
}

.redo-action-btn {
  border-left: 0.6px solid var(--border-muted);
}

.undo-action-btn:hover:not(:disabled),
.redo-action-btn:hover:not(:disabled) {
  color: var(--theme-dark);
}

/* ---- Disabled state ---- */
.undo-action-btn:disabled,
.redo-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.undo-action-btn {
  border-right: 0.6px solid var(--border-muted);
}

.redo-action-btn {
  border-left: 0.6px solid var(--border-muted);
}

</style>
