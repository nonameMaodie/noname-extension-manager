<script setup>
  import { defineProps, onMounted, onUnmounted, ref, watch } from "vue";
  import { useDraggable } from "vue-draggable-plus";
  import { useExtensionsStore } from "../../stores/extensions.js";
  import { useExtensionsClassesStore } from "../../stores/extensionsClasses.js";
  import { getDevice } from "../../utils/getDevice.js";
  import ExtensionItem from "./ExtensionItem.vue";

  const store = useExtensionsClassesStore();
  const extsStore = useExtensionsStore();

  const el = ref(null);
  const itemDraggable = ref(false);
  const noAnimations = ref(false);
  const introText = ref("点击交换右边的扩展卡片排序");
  const props = defineProps({
    title: String,
    extensions: { type: Array, default: () => [] },
  });

  // 以下是排序相关
  let swapItem = () => {};
  if (getDevice() !== "mobile") {
    itemDraggable.value = store.currentClass.id === 0;
    noAnimations.value = itemDraggable.value;
    introText.value = "拖拽右边的扩展卡片排序";
    const draggable = useDraggable(el, props.extensions, {
      onUpdate() {
        extsStore.updateExtensionSort();
      },
      animation: 200,
      ghostClass: "draggable-ghost",
      chosenClass: "draggable-chosen",
      dragClass: "draggable-drag",
      direction: "vertical",
    });

    // 动态设置是否可拖拽
    watch(
      () => store.currentClass,
      (val) => {
        if (val.id === 0) {
          draggable?.start?.();
          itemDraggable.value = true;
          setTimeout(() => {
            noAnimations.value = true;
          }, 200);
        } else {
          draggable?.pause?.();
          itemDraggable.value = false;
          noAnimations.value = false;
        }
      }
    );
  } else {
    let firstClick = null;
    swapItem = (ext, e) => {
      if (store.currentClass.id !== 0) return;
      const extEl = e.target.closest("ul.list-items > li");
      if (!firstClick) {
        firstClick = [ext, extEl];
        extEl.classList.add("draggable-chosen");
        return;
      }
      if (firstClick[1] === extEl) {
        firstClick[1].classList.remove("draggable-chosen");
        firstClick = null;
        return;
      }
      firstClick[1].classList.remove("draggable-chosen");
      let valList = props.extensions;
      const index1 = valList.indexOf(firstClick[0]);
      const index2 = valList.indexOf(ext);
      [valList[index1], valList[index2]] = [valList[index2], valList[index1]];
      extsStore.updateExtensionSort();
      firstClick = null;
    };
    // 点击外部处取消选中
    const clickItemOutside = (e) => {
      if (!firstClick || e.target.closest("ul.list-items > li")) return;
      firstClick[1].classList.remove("draggable-chosen");
      firstClick = null;
    };
    onMounted(() => {
      document.addEventListener("click", clickItemOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", clickItemOutside);
    });
  }
</script>

<template>
  <div class="ext-list">
    <div class="list-header">
      <div class="list-name">{{ title }} ({{ extensions.length }})</div>
    </div>
    <ul
      v-if="store.currentClass.id === 0 && !extensions.length"
      class="list-items"
      style="position: absolute; width: 100%; display: flex; justify-content: center; align-items: center; font-size: 22px"
    >
      "{{ introText }}"
    </ul>
    <TransitionGroup
      name="list"
      tag="ul"
      class="list-items"
      :class="{ 'no-animation': noAnimations }"
      ref="el"
    >
      <ExtensionItem
        v-for="ext in extensions"
        :key="ext.id"
        :extension="ext"
        @toggle="$emit('toggle', ext)"
        @click="swapItem(ext, $event)"
        :class="{ 'list-item-draggable': itemDraggable }"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
  div.ext-list {
    position: relative;
    flex: 1;
    background: var(--bg);
    border-radius: 8px;
    border: 1px solid var(--border);
    height: 100%;
  }
  div.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    height: 50px;
  }
  div.list-name {
    font-size: 18px;
    font-weight: 500;
  }
  .batch-btn {
    border: 1.5px solid var(--border);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 15px;
  }
  .batch-btn:hover[data-type="openAll"] {
    background: var(--success);
  }
  .batch-btn:hover[data-type="closeAll"] {
    background: var(--danger);
  }
  ul.list-items {
    position: relative;
    list-style: none;
    padding: 0 10px;
    margin: 0;
    height: calc(100% - 50px);
    overflow: auto;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  /* 确保离开的项目不会影响布局 */
  .list-leave-active {
    position: absolute;
    width: calc(100% - 20px);
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
  /* 添加 move 过渡 */
  .list-move {
    transition: transform 0.23s ease;
  }
  .list-items li {
    cursor: pointer;
  }
  .list-items li.list-item-draggable {
    cursor: move;
  }

  .draggable-chosen {
    background: var(--theme);
  }
  .draggable-drag {
    opacity: 1;
  }

  .no-animation .list-enter-active,
  .no-animation .list-leave-active,
  .no-animation .list-move {
    transition: none !important;
  }
</style>
