<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
  import { autoZoom } from "../utils/autoZoom.js";
  import { getDevice } from "../utils/getDevice.js";
  import ClassManagement from "./ClassManagement/ClassManagement.vue";
  import ExtensionManagement from "./ExtensionManagement/ExtensionManagement.vue";
  import GameDataManagement from "./GameDataManagement/GameDataManagement.vue";
  import MangerHeader from "./MangerHeader.vue";

  const pageMap = {
    扩展管理: ExtensionManagement,
    分类管理: ClassManagement,
    游戏设置: GameDataManagement,
  };

  const isMobile = getDevice() === "mobile";

  const pages = Object.keys(pageMap);
  const currentPage = ref("扩展管理");
  const currentComponent = computed(() => pageMap[currentPage.value]);

  const inner = ref(null);
  let release = null;
  onMounted(async () => {
    await nextTick();
    release = autoZoom(inner.value, {
      width: isMobile ? 1000 : 1100,
      height: isMobile ? 700 : 750,
    });
  });

  onUnmounted(() => {
    release && release();
  });
</script>

<template>
  <div class="back">
    <div class="inner" ref="inner" :class="{'is-mobile': isMobile}">
      <MangerHeader v-model="currentPage" :pages="pages" />
      <Transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="currentComponent" class="page"></component>
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .back {
    display: flex;
    justify-content: center;
    background: no-repeat center center / cover;
    align-items: center;
  }
  .inner {
    background: var(--bg-dark);
    border-radius: 15px;
    border-top: 1.8px solid var(--border-highlight);
    box-shadow:
      0px 2px 2px rgb(0 0 0 / 20%),
      0px 4px 4px #0000001a;
    height: 700px;
    width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    color: var(--text);
  }
  .inner.is-mobile {
    height: 665px;
    width: 950px;
  }
  .page {
    flex: 1;
    overflow: hidden;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: scale(0.9);
    opacity: 0;
  }
</style>
