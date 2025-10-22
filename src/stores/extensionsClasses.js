import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { extensionList, classes, recordClasses } from './libExtensions.js'
import { game } from '@noname'
import { useToast } from '../api/toast.js'

export const useExtensionsClassesStore = defineStore('extensionsClasses', () => {
	const toast = useToast()
	// 分类管理页的当前分类
	const currentClass = ref(classes.value[0])
	// 当前分类已添加的扩展列表
	const addedExtList = computed(() => {
		return currentClass.value.extensions
	})
	// 当前分类未添加的扩展列表
	const unaddedExtList = computed(() => {
		return extensionList.value.filter((ext) => !currentClass.value.extensions.includes(ext))
	})
	// 添加新的扩展分类
	function addNewExtensionClass(name) {
		if (classes.value.some((item) => item.name === name)) {
			toast.error('已存在同名分类!')
			return
		}
		const newClass = {
			id: classes.value.length,
			name,
			extensions: [],
		}
		classes.value.push(newClass)
		game.saveExtensionConfig('扩展管家', 'extensionClasses', recordClasses.value)
		return newClass
	}
	// 从当前分类添加/移除某个扩展
	function toggleExtensionFromClass(ext) {
		if (currentClass.value.extensions.includes(ext)) {
			currentClass.value.extensions.remove(ext)
		} else {
			currentClass.value.extensions.push(ext)
		}
		game.saveExtensionConfig('扩展管家', 'extensionClasses', recordClasses.value)
	}

	// 重命名分类名
	function renameExtensionClass(extClass, newName) {
		if (extClass.name === newName) return
		if (classes.value.some((item) => item != extClass && item.name === newName)) {
			toast.error('已存在同名分类!')
			return
		}
		extClass.name = newName
		game.saveExtensionConfig('扩展管家', 'extensionClasses', recordClasses.value)
	}
	// 删除分类
	function deleteExtensionClass(extClass) {
		const index = classes.value.findIndex((item) => item === extClass)
		if (index >= 0) {
			if (classes.value[index] === currentClass.value) {
				currentClass.value = classes.value[index - 1] || classes.value[index + 1] || classes.value[0]
			}
			classes.value.splice(index, 1)
			game.saveExtensionConfig('扩展管家', 'extensionClasses', recordClasses.value)
		}
	}
	return {
		classes,
		currentClass,
		addedExtList,
		unaddedExtList,
		renameExtensionClass,
		deleteExtensionClass,
		addNewExtensionClass,
		toggleExtensionFromClass,
	}
})
