<script setup>
import OperationCardArea from './OperationCardArea.vue'
import CustomSelect from '../../common/CustomSelect.vue'
import { useExtensionsStore } from '../../../stores/extensions.js'
import { useExtensionsClassesStore } from '../../../stores/extensionsClasses.js'
import { computed } from 'vue'

const store = useExtensionsStore()
const classesStore = useExtensionsClassesStore()
const classOptions = computed(() =>
  classesStore.classes.map((extClass) => {
    return {
      label: extClass.name,
      value: extClass.name,
    }
  }),
)
</script>

<template>
  <OperationCardArea name="分类：">
    <CustomSelect v-model="store.selectedClass" :options="classOptions" class="class-select" />
  </OperationCardArea>
</template>

<style scoped>
.class-select {
  background: var(--bg-light);
  font-size: 14px;
  width: 100%;
  max-width: 100%;
  user-select: none;
  background: transparent;
}
</style>
