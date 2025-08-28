<script setup>
import ClosedExtList from './ClosedExtList.vue'
import OpenExtList from './OpenExtList.vue'
import ExtListOperation from './ExtListOperation.vue'
</script>

<template>
  <div class="ext-list-container">
    <div class="ext-list-content">
      <ClosedExtList />
      <OpenExtList />
    </div>
    <ExtListOperation />
  </div>
</template>

<style scoped>
.ext-list-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 15px;
  gap: 15px;
}
.ext-list-content {
  display: flex;
  height: 100%;
  gap: 15px;
  flex: 1;
}
</style>
