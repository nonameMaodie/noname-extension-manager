<script setup>
import IconEdit from '../icons/IconEdit.vue'
import IconDelete from '../icons/IconDelete.vue'
import { useExtensionsClassesStore } from '../../stores/extensionsClasses.js'
import { storeToRefs } from '../../external/pinia.js'
import Modal from '../common/Modal.vue'
import CustomInputForm from '../common/CustomInputForm.vue'
import { ref } from '../../external/vue.js'

const store = useExtensionsClassesStore()
const { classes, currentClass } = storeToRefs(store)
const showModal = ref(false)
const name = ref('')
function addClass() {
  const value = name.value.trim()
  if (!value) return
  store.addNewExtensionClass(value)
  name.value = ''
}

const showEditModal = ref(false)
const editedName = ref('')
const editedClass = ref('')

function editClassName() {
  const value = editedName.value.trim()
  if (!value) return
  store.renameExtensionClass(editedClass.value, editedName.value)
}
</script>

<template>
  <form @submit.prevent>
    <div
      class="operation-card"
      v-for="item in classes"
      :key="item.id"
      :class="{ active: item === currentClass }"
    >
      <div class="operation-card-content" @click.self="currentClass = item">
        <span @click="currentClass = item">{{
          item.id === 0 ? item.name + '（自定义排序）' : item.name
        }}</span>
        <div class="operation-card-btns" v-if="item.id !== 0">
          <button>
            <IconEdit
              class="icon-edit"
              @click="
                () => {
                  editedName = item.name
                  editedClass = item
                  showEditModal = true
                }
              "
            />
          </button>
          <button>
            <IconDelete class="icon-delete" @click="store.deleteExtensionClass(item)" />
          </button>
        </div>
      </div>
    </div>
    <div class="operation-card" @click="showModal = true" v-if="classes.length < 9">
      <div class="add-new-item operation-card-content">+</div>
    </div>
    <Modal v-model="showModal">
      <CustomInputForm
        v-model="name"
        title="分类名称"
        v-model:show="showModal"
        @confirm="addClass"
      />
    </Modal>
    <Modal v-model="showEditModal">
      <CustomInputForm
        v-model="editedName"
        title="更改分类名"
        placeholder="请输入新的分类名"
        v-model:show="showEditModal"
        @confirm="editClassName"
      />
    </Modal>
  </form>
</template>

<style scoped>
form {
  display: flex;
  width: 280px;
  height: 100%;
  flex-direction: column;
  justify-content: start;
  align-self: start;
  gap: 10px;
  user-select: none;
  overflow-y: auto;
}
.operation-card {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  gap: 10px;
  padding: 10px 15px;
  align-items: start;
  background: var(--bg);
  border-radius: 8px;
  border: 1px solid var(--border);
  height: 59.8px;
  flex: none;
}
.operation-card.active {
  background: var(--theme);
}
.operation-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: inherit;
  height: 100%;
  width: 100%;
}
.add-new-item {
  cursor: pointer;
  justify-content: center;
  font-size: 30px;
}
.operation-card:has(.add-new-item):hover {
  background: var(--bg-light);
}
.operation-card-btns {
  display: flex;
  gap: 20px;
}
.icon-edit,
.icon-delete {
  opacity: 0.5;
  width: 20px;
  height: 20px;
  fill: var(--text-muted);
  vertical-align: bottom;
  cursor: pointer;
}
.icon-edit:hover,
.icon-delete:hover {
  opacity: 1;
  fill: var(--text-muted);
}
.icon-delete:hover {
  fill: #c00000;
}
</style>
