<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, default: '' },
  placeholder: { type: String },
})
const input = ref(null)
const emits = defineEmits(['cancel', 'confirm'])
function cancel() {
  emits('cancel')
}
function confirm() {
  emits('confirm', input.value.value)
}
const handleFocus = (event) => event.target.select()
onMounted(() => {
  input.value.focus()
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
			:value="value"
			ref="input"
			@focus="handleFocus"
			spellcheck="false"
			maxlength="10"
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
  background: var(--bg-secondary);
  border-radius: 15px;
  border: 2.5px solid var(--border);
  padding: 2em;
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 1em;
  color: var(--text);
}
.save-snapshot-form label {
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}
.save-snapshot-form label span {
  font-size: 1.4em;
}
.save-snapshot-form input {
  width: 100%;
  padding: 0.6em 1em;
  border: 2px solid var(--border-muted);
  border-radius: 8px;
  font-size: 1em;
  background: var(--bg-light);
  margin-bottom: 1em;
  outline: none;
  width: calc(100% - 2em);
  color: var(--text);
}
.save-snapshot-form input::placeholder {
  color: var(--text-muted);
}
.save-snapshot-form-actions {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
}
.save-snapshot-form-actions button {
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
.save-snapshot-form-actions button.save-snapshot-cancel {
  background: var(--danger);
}
</style>
