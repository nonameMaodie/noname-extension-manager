<script setup>
import UnaddedExtList from './UnaddedExtList.vue'
import AddedExtList from './AddedExtList.vue'
import ClassOperation from './ClassOperation.vue'
</script>

<template>
  <div class="ext-list-container">
    <div class="ext-list-content">
      <UnaddedExtList />
      <AddedExtList />
    </div>
    <ClassOperation />
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
