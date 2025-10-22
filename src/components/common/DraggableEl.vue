<script setup>
  import { defineEmits, ref } from 'vue'
  import vDrag from '../../utils/drag.js'

  const changed = ref(0)
  const emit = defineEmits(['click'])

  function onClick() {
    if(changed.value >= 5) {
		changed.value = 0
		return
	}
	emit('click')
  }
</script>

<template>
  <div v-drag="{
		onDragEnd: (element, finalPosition) => onClick(),
		onPositionChange: (element, position) => changed++
	}"
	class="draggable-el">
	<slot></slot>
  </div>
</template>

<style scoped>
	.draggable-el{
		position: absolute;
		transform: translateY(100%);
		border-radius: 50%;
		cursor: pointer;
		font-size: 36px !important;
	}
</style>
