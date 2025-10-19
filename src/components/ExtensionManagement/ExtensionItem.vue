<script setup>
import { ref, defineProps, defineEmits } from '../../external/vue.js'
import ShowMore from '../common/ShowMore.vue'

const props = defineProps({
  extension: { type: Object, required: true },
})
const show = ref(false)
const emits = defineEmits(['toggle', 'showDetail', 'toggleHide', 'uninstall'])

function toggleExtensionHide(ext) {
  show.value = false
  emits('toggleHide', ext)
}

function uninstallExtension(ext) {
  show.value = false
  emits('uninstall', ext)
}
</script>

<template>
  <li
    class="ext-item"
	@click.self="$emit('toggle', extension)"
    :data-preview="extension.preview === extension.enabled ? null : extension.preview">
    <div class="ext-item-main" @click="$emit('toggle', extension)">
      <span class="ext-name" :class="{'ext-item-hidden': extension.hide, 'ext-item-primary': extension.name === '扩展管家'}">{{
	   extension.name
      }}</span>
      <!-- <span class="ext-desc">{{ extension.desc }}</span> -->
    </div>
    <div class="ext-item-actions">
      <button @click="$emit('showDetail', extension)">详情</button>
      <button @click="show = true">更多</button>
      <ShowMore v-model="show" :limit="0.25">
        <div class="show-more-content">
          <button @click="toggleExtensionHide(extension)">
            {{ extension.hide ? '取消隐藏' : '隐藏扩展' }}
          </button>
          <button @click="uninstallExtension(extension)" class="danger">卸载扩展</button>
        </div>
      </ShowMore>
    </div>
  </li>
</template>
<style scoped>
.ext-item {
  position: relative;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-muted);
  margin-bottom: 10px;
}
.ext-item[data-preview="true"]{
	background: var(--bg-success);
}
.ext-item[data-preview="false"]{
	background: var(--bg-danger);
}
.ext-item-main {
  display: flex;
  flex-direction: column;
}
.ext-name {
  font-weight: bold;
}
.ext-name.ext-item-hidden{
	opacity: 0.45;
}
.ext-name.ext-item-primary{
	color: var(--theme-dark)
}
.ext-desc {
  font-size: 12px;
  color: var(--text-muted);
}
.ext-item-actions {
  position: relative;
  display: flex;
  gap: 8px;
}
.ext-item-actions button {
  border: 1px solid var(--info);
  padding: 4px 8px;
  /* border: none; */
  border-radius: 4px;
  /* cursor: pointer; */
}
.ext-item-actions button:hover {
  background: var(--info);
  color: var(--text-light);
}
.ext-item-actions button.danger {
  border: 1px solid var(--danger);
}
.ext-item-actions button.danger:hover {
  background: var(--danger);
}
.ext-item-actions button.success {
  border: 1px solid var(--success);
}
.ext-item-actions button.success:hover {
  background: var(--success);
}
.show-more-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}
</style>
