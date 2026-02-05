<script setup>
  import { onMounted, ref, watchEffect } from "vue";
  import { showModal } from "../../../api/modal.js";
  import { useSnapshotsStore } from "../../../stores/snapshots.js";
  import { getTempId } from "../../../utils/getTempId.js";
  import CustomInputForm from "../../common/CustomInputForm.vue";
  import ShowMore from "../../common/ShowMore.vue";
  import OperationCardArea from "./OperationCardArea.vue";

  const snapshotsStore = useSnapshotsStore();
  const showMore = ref(false);

  onMounted(async () => {
    await snapshotsStore.readAllSnapshots();
  });

  const activeSnapshotName = ref(null);
  function toggleActive(name) {
    activeSnapshotName.value = activeSnapshotName.value === name ? null : name;
    if (activeSnapshotName.value) {
      snapshotsStore.setExtEnabledPreview(name);
    } else {
      snapshotsStore.setExtEnabledPreview(null);
    }
  }
  watchEffect(() => {
    if (!showMore.value) toggleActive(null);
  });

  async function saveSnapshot() {
    const result = await showModal(null, CustomInputForm, {
      title: "快照名称",
      value: getTempId(),
    });
    if (result && result.trim()) {
      snapshotsStore.trySaveSnapshot(result);
    }
  }
</script>

<template>
  <OperationCardArea name="快照：">
    <button type="button" class="save-snapshot" @click="saveSnapshot">
      保存快照
    </button>
    <button type="button" class="restore-snapshot" @click="showMore = true">
      恢复快照
    </button>
    <ShowMore v-model="showMore" :limit="-100">
      <div class="show-more-content">
        <div class="show-more-title">(单击预览，双击删除)</div>
        <div
          class="snapshot-item"
          v-for="item in snapshotsStore.snapshots"
          :key="item.id"
        >
          <div
            class="snapshot-item-main"
            @click="toggleActive(item.name)"
            @dblclick="snapshotsStore.tryDeleteSnapshot(item.name)"
          >
            <div
              class="snapshot-item-name"
              :class="item.name === activeSnapshotName ? 'active' : ''"
            >
              {{ item.name }}
            </div>
            <div class="snapshot-item-time">{{ item.time }}</div>
          </div>
          <div class="snapshot-item-actions">
            <button @click="snapshotsStore.restoreSnapshot(item.name)">
              恢复
            </button>
          </div>
        </div>
      </div>
    </ShowMore>
  </OperationCardArea>
</template>

<style scoped>
  .save-snapshot,
  .restore-snapshot {
    font-size: 14px;
    flex: 1;
    height: 100%;
    font-weight: 500;
  }

  .save-snapshot {
    border-right: 0.6px solid var(--border-muted);
  }

  .restore-snapshot {
    border-left: 0.6px solid var(--border-muted);
  }
  .save-snapshot:hover,
  .restore-snapshot:hover {
    color: var(--theme-dark);
  }
  .show-more-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--text-muted);
  }
  .show-more-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 300px;
    padding: 10px;
  }
  .snapshot-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px;
    border-bottom: 3px dashed var(--border-muted);
  }
  .snapshot-item-main,
  .snapshot-item-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
  }
  .snapshot-item-name {
    font-size: 18px;
    font-weight: 600;
  }
  .snapshot-item-name.active {
    color: var(--theme-dark);
  }
  .snapshot-item-time {
    font-size: 14px;
  }
  .snapshot-item-actions button {
    border: 1.8px solid var(--info);
    padding: 4px 10px;
    border-radius: 4px;
  }
  .snapshot-item-actions button:hover {
    background: var(--info);
    color: var(--text-light);
  }
</style>
