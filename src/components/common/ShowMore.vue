<script setup>
  import { defineModel, defineProps, nextTick, ref, watch } from "vue";
  import vClickOutside from "../../utils/vClickOutside.js";

  const moreRef = ref(null);
  const isTop = ref(false);
  const { limit } = defineProps({
    limit: {
      // 设置触发位置，一般 0 ~ 1 之间，数字越大，靠近屏幕上边视口的浮窗越倾向于在上方出现
      type: Number,
      default: 0.3,
    },
  });

  // 计算并设置位置
  const updatePosition = async () => {
    await nextTick();

    function getDistanceToViewport(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top, // 元素顶部到视口顶部的距离
        left: rect.left, // 元素左侧到视口左侧的距离
        bottom: window.innerHeight - rect.bottom, // 元素底部到视口底部的距离
        right: window.innerWidth - rect.right, // 元素右侧到视口右侧的距离
      };
    }
    // 设置位置
    const more = moreRef.value;
    const parent = moreRef.value.parentElement;
    if (window.getComputedStyle(parent).position === "static") {
      throw new Error("父元素需要设置position属性，如：relative");
    }
    more.style.position = "absolute";

    more.style.left = "50%";
    const setBottom =
      getDistanceToViewport(parent).bottom / window.innerHeight > limit;
    if (setBottom) {
      more.style.bottom = "-6px"; // 小箭头的一半高度是6px，需要适当偏移
      more.style.transform = "translate( -50%, 100%)";
      isTop.value = false;
    } else {
      more.style.top = "-6px"; // 小箭头的一半高度是6px，需要适当偏移
      more.style.transform = "translate( -50%, -100%)";
      isTop.value = true;
    }
  };
  const model = defineModel({ type: Boolean }); // 接收一个布尔值，作为是否呈现浮窗的开关

  watch(model, (newVal) => {
    if (newVal) updatePosition();
  });
</script>

<template>
  <Transition name="fade">
    <div
      v-if="model"
      ref="moreRef"
      v-click-outside.passive="(e) => (model = false)"
      class="showMore-popup"
      :class="{ 'show-top': isTop }"
    >
      <!-- 添加小箭头 -->
      <div class="arrow"></div>
      <div class="more-content">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .showMore-popup {
    position: absolute;
    z-index: 1000;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }

  .more-content {
    max-height: 80vh;
    overflow-y: auto;
  }

  /* 箭头样式 */
  .arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    transform: rotate(45deg);
    top: -6px; /* 默认在顶部 */
    left: calc(50% - 6px);
    border-bottom: none;
    border-right: none;
  }

  /* 显示在上方时的箭头样式 */
  .show-top .arrow {
    top: auto;
    bottom: -6px;
    border: none;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
