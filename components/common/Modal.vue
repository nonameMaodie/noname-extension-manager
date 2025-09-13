<script setup>
import {
  defineProps,
  defineModel,
  toRefs,
  nextTick,
  ref,
  watch,
  defineEmits,
} from '../../external/vue.js'
import { autoZoom } from '../../utils/autoZoom.js'
import { getDevice } from '../../utils/getDevice.js'

const props = defineProps({
  title: { type: String },
  content: { type: String },
  cancel: { type: String },
  confirm: { type: String , default: '确定'},
})

const { title, content, cancel, confirm } = toRefs(props)
const showModal = defineModel()

const modal = ref(null)
let telShow = ref(false)
let release = null
watch(showModal, async (visible) => {
  if (visible) {
    telShow.value = true
    await nextTick()
    release = autoZoom(modal.value, {
      width: 1100,
      height: 750,
    })
  } else {
    release?.()
  }
})

const emit = defineEmits(['cancel', 'confirm'])
function onCancel() {
  showModal.value = false
  emit('cancel', false)
}
function onConfirm() {
  showModal.value = false
  emit('confirm', true)
}
</script>

<template>
  <Teleport to="#window" v-if="telShow">
    <Transition name="slide-fade" appear>
      <div class="kzgj-modal kzgj-div-style" ref="modal" v-if="showModal" :class="{ 'center-show': getDevice() !== 'mobile' }">
        <div class="modal-content" v-if="title && content && confirm">
          <div class="modal-title" v-if="title">{{ title }}</div>
          <div class="modal-body" v-if="content">{{ content }}</div>
          <div class="modal-footer" v-if="cancel || confirm">
            <button class="close-button" v-if="cancel" @click="onCancel">
              {{ cancel }}
            </button>
            <button class="confirm-button" v-if="confirm" @click="onConfirm">
              {{ confirm }}
            </button>
          </div>
        </div>
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kzgj-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}
.kzgj-modal.center-show{
  align-items: center;
}
.modal-content {
  background: var(--bg-secondary);
  border-radius: 15px;
  border: 3px solid var(--border);
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 1.3em;
  color: var(--text);
}
.modal-content>.modal-title {
  font-size: 26px;
  font-weight: 700;
}
.modal-content>.modal-body {
  font-size: 20px;
  font-weight: 500;
}
.modal-content>.modal-footer {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
}
.modal-footer>.close-button,
.modal-footer>.confirm-button{
  background: var(--info);
  /* filter: saturate(2); */
  color: var(--text-light);
  border: none;
  border-radius: 8px;
  padding: 0.4em 1.2em;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-footer>.close-button{
  background: var(--danger);
}
/* 添加过渡动画样式 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  /* transform: scale(0.6); */
  opacity: 0;
}

.slide-fade-leave-to {
  /* transform: scale(0.6); */
  opacity: 0;
}
</style>
