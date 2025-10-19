<script setup>
import { ref, computed, defineEmits, defineModel } from '../../external/vue.js'
import iconArrow from '../icons/iconArrow.vue'
import vClickOutside from '../../utils/vClickOutside.js'

const modelValue = defineModel({ type: [String, Number] })
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true,
  },
})

const isActive = ref(false)
const selectedLabel = computed(() => {
  const option = props.options.find((opt) => opt.value === modelValue.value)
  return option ? option.label : props.options[0].label
})
</script>

<template>
  <div
    :class="{ active: isActive }"
    class="custom-select"
    @click="isActive = !isActive"
    v-click-outside="(e) => (isActive = false)"
  >
    <div class="select-trigger">
      <div class="select-trigger-text">{{ selectedLabel }}</div>
      <iconArrow class="select-trigger-arrow" />
    </div>
    <div class="select-content">
      <div>
        <span
          v-for="option in options"
          :key="option.value"
          :class="{ 'is-selected': option.value === modelValue }"
          @click="modelValue = option.value"
          >{{ option.label }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  min-width: 60px;
  height: 30px;
  line-height: 30px;
}
.custom-select .select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0 5px;
}
.custom-select .select-trigger-arrow {
  width: 17.4px;
  height: 10px;
  fill: var(--text);
  transition: transform 0.3s;
}

.custom-select .select-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s linear;
  box-sizing: border-box;
  border-radius: 8px;
}

.custom-select .select-content > div {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: 8px;
}

.custom-select .select-content > div::after {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: inherit;
  border: 1px solid var(--border);
}

.custom-select .select-content > div > span {
  display: block;
  padding: 3.5px 5px;
  background: var(--bg-secondary);
}

.custom-select .select-content > div > span.is-selected {
  background: var(--theme-dark);
  color: var(--text-light);
}
.custom-select .select-content > div:hover > span.is-selected {
  background: var(--bg-secondary);
  color: var(--text);
}
.custom-select .select-content > div > span:hover,
.custom-select .select-content > div:hover > span.is-selected:hover {
  background: var(--theme-dark);
  color: var(--text-light);
}
.custom-select.active .select-trigger-arrow {
  transform: rotate(-180deg);
}
.custom-select.active .select-content {
  grid-template-rows: 1fr;
}
</style>
