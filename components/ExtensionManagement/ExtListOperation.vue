<script setup>
import CLassSelectBar from './OperationCardArea/CLassSelectBar.vue'
import SearchBarArea from './OperationCardArea/SearchBarArea.vue'
import SnapshotGroupArea from './OperationCardArea/SnapshotGroupArea.vue'
import OperationCardArea from './OperationCardArea/OperationCardArea.vue'
import OperatedHistoryArea from './OperationCardArea/OperatedHistoryArea.vue'
import { game } from '../../external/noname.js'
</script>

<template>
  <form @submit.prevent>
	<SearchBarArea />
    <CLassSelectBar />
    <SnapshotGroupArea />
    <OperatedHistoryArea />
    <OperationCardArea name="待定："
      ><span style="color: var(--text-muted)">（功能待完善）</span>
    </OperationCardArea>
    <button class="reload-game" @click="game.reload()">重启游戏</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  width: 230px;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-self: start;
  gap: 10px;
  user-select: none;
}
.reload-game {
  height: 16%;
  background: var(--theme-dark);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 22px;
  color: var(--text-light);
}
</style>
