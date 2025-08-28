<script setup>
import { ref, onMounted, defineProps, defineModel, defineEmits } from '../../external/vue.js'

const name = defineModel({ type: String })
const show = defineModel('show', { type: Boolean })
const props = defineProps({
  title: { type: String, required: true },
  placeholder: { type: String },
})
const snapshotNameInput = ref(null)
const emits = defineEmits(['cancel', 'confirm'])
function cancel() {
  show.value = false
  emits('cancel')
}
function confirm() {
  show.value = false
  emits('confirm')
}
const handleFocus = (event) => event.target.select()
onMounted(() => {
  snapshotNameInput.value.focus()
})
</script>

<template>
  <div class="save-snapshot-form">
	<!-- <form @submit.prevent> -->
		<label>
		<span>{{ title }}</span>
		<input
			type="text"
			:placeholder="placeholder ?? '请输入' + title"
			ref="snapshotNameInput"
			:value="name"
			@focus="handleFocus"
			spellcheck="false"
			maxlength="10"
			@change="name = $event.target.value"
			@keyup.enter="confirm"
		/>
		</label>
		<div class="save-snapshot-form-actions">
		<button class="save-snapshot-cancel" @click="cancel">取消</button>
		<button @click="confirm">保存</button>
		</div>
	<!-- </form> -->
  </div>
</template>

<style scoped>
.save-snapshot-form {
  background: hsl(208, 45%, 93%);
  border-radius: 15px;
  border: 2.5px solid var(--border);
  padding: 2em;
  display: flex;
  flex-direction: column;
  width: 350px;
  gap: 1em;
}
.save-snapshot-form label {
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.save-snapshot-form label span {
  font-size: 1.2em;
}
.save-snapshot-form input {
  width: 100%;
  padding: 0.6em 1em;
  border: 1px solid var(--border-muted);
  border-radius: 8px;
  font-size: 1em;
  background: #f7fbfc;
  margin-bottom: 1em;
  outline: none;
}
.save-snapshot-form-actions {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
}
.save-snapshot-form-actions button {
  background: var(--theme);
  filter: saturate(2);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 1.2em;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.save-snapshot-form-actions button.save-snapshot-cancel {
  background: var(--danger);
}
</style>
