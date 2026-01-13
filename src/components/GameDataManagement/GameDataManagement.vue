<script setup>
  import { onMounted, ref } from "vue";
  import { showModal } from "../../api/modal.js";
  import { useGameDataStore } from "../../stores/gameData.js";
  import CustomInputForm from "../common/CustomInputForm.vue";

  const store = useGameDataStore();
  onMounted(() => {
    store.readAllGameData();
  });

  const activeDrawerId = ref(null);

  function toggleDrawer(id) {
    if (!id || activeDrawerId.value === id) {
      activeDrawerId.value = null;
    } else {
      activeDrawerId.value = id;
    }
  }

  async function handleClickItem(info) {
    if (info.initial) {
      toggleDrawer(null);
      const result = await showModal(null, CustomInputForm, {
        title: info.name,
        placeholder: "请输入新的存档名",
        value: "无名杀设置",
      });
      if (result && result.trim()) {
        store.trySaveGameData({ id: info.id, name: result.trim() });
      }
    } else {
      toggleDrawer(info.id);
    }
  }

  async function saveGameData(info) {
    const result = await showModal(null, CustomInputForm, {
      title: "覆盖存档",
      placeholder: "请输入新的存档名",
      value: info.name,
    });
    if (result && result.trim()) {
      await store.tryDeleteGameData(info);
      store.trySaveGameData({ id: info.id, name: result.trim() });
    }
    toggleDrawer(null);
  }

  async function deleteGameData(info) {
    await store.tryDeleteGameData(info);
    toggleDrawer(null);
  }
</script>

<template>
  <div class="game-data-container">
    <div
      class="game-data-item"
      v-for="info in store.gameDataList"
      :key="info.id"
      @click="handleClickItem(info)"
    >
      <div class="game-data-item-content" :class="{ initial: info.initial }">
        <div class="item-content-name">{{ info.name }}</div>
        <div class="item-content-text">{{ info.time }}</div>
      </div>
      <div
        class="item-drawer"
        :class="[activeDrawerId === info.id ? 'item-drawer-open' : '']"
      >
        <div class="item-drawer-content">
          <button @click.stop="store.readGameData(info)">读取</button>
          <button @click.stop="saveGameData(info)">覆盖</button>
          <button @click.stop="deleteGameData(info)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .game-data-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 0 auto;
    height: 100%;
    padding: 15px;
    width: 100%;
  }

  .game-data-item {
    position: relative;
    background: var(--bg-light);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    position: relative;
    cursor: pointer;
    border-top: 1.5px solid var(--border-highlight);
  }

  .game-data-item .game-data-item-content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
  }
  .game-data-item .game-data-item-content.initial {
    opacity: 0.5;
  }
  .game-data-item .item-content-name {
    font-size: 28px;
    font-weight: bold;
    color: var(--text);
    margin-bottom: 10px;
  }

  .game-data-item .item-content-text {
    font-size: 17px;
    color: var(--text-muted);
  }
  .item-drawer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    overflow: hidden;
    background: var(--bg-secondary);
    transition: height 0.3s ease;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 12px 12px;
  }
  /* 抽屉打开状态 */
  .item-drawer-open {
    border-top: 1px solid var(--border);
    height: 40%;
  }
  .item-drawer-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: var(--text);
  }
  .item-drawer-content button {
    flex: 1;
    font-size: 16px;
  }
  .item-drawer-content button:hover {
    color: var(--theme-dark);
  }
  .item-drawer-content button:nth-child(2) {
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }
</style>
