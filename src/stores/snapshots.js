import { ref } from 'vue'
import { defineStore } from 'pinia'
import { lib, game } from '@noname'
import { extensionList } from './libExtensions.js'
import { basic } from '../source/basic.js'
import { emitter } from '../utils/emitter.js'
import { useToast } from '../api/toast.js'

export const useSnapshotsStore = defineStore('snapshot', () => {
	const toast = useToast()
	async function readSnapshot(fileName) {
		const info = await lib.init.promises.json(`${basic.extensionDirectoryPath}/snapshots/${fileName}`);
		return info;
	}

	const snapshots = ref([]);
	async function readAllSnapshots() {
		const [_, files] = await game.promises.getFileList(`${basic.extensionDirectoryPath}/snapshots`);
		snapshots.value = [];
		for (const file of files) {
			if (file.endsWith('.json')) {
				const info = await readSnapshot(file);
				snapshots.value.push(info);
			}
		}
		snapshots.value.sort((a, b) => new Date(b.time) - new Date(a.time));
		return snapshots.value;
	}

	async function writeSnapshot(info) {
		const fileName = info.name + '.json';
		await game.promises.writeFile(JSON.stringify(info, null, 2), `${basic.extensionDirectoryPath}/snapshots`, fileName);
	}

	async function deleteSnapshot(fileName) {
		await game.promises.removeFile(`${basic.extensionDirectoryPath}/snapshots/${fileName}`);
	}

	let id = 0
	const getOnlyId = () => ++id

	function createSnapshot(name) {
		return {
			name,
			id: new Date().getTime().toString(36) + getOnlyId(),
			data: Object.assign({}, ...extensionList.value.map(ext => ({ [ext.name]: ext.enabled }))),
			time: new Date().toLocaleString('zh-cn', { hour12: false }),
		}
	}
	// 保存快照
	async function trySaveSnapshot(name) {
		try {
			if (snapshots.value.some(info => info.name === name)) {
				toast.error('已存在同名快照')
				return false
			}
			// 正则判断name含有不合法的文件名符号
			if (/[\\/:*?"<>|]/.test(name)) {
				toast.error('名称含有非法字符（\\/:*?"<>|）')
				return false
			}
			const snapshot = createSnapshot(name)
			await writeSnapshot(snapshot)
			snapshots.value.unshift(snapshot)
			toast.success('快照保存成功')
			return true
		}
		catch (error) {
			console.error(error)
			toast.error('保存失败，请查看控制台日志')
			return false
		}
	}
	// 根据id删除快照
	async function tryDeleteSnapshot(name) {
		try {
			const index = snapshots.value.findIndex((item) => item.name === name)
			if (index !== -1) {
				await deleteSnapshot(name + '.json')
				snapshots.value.splice(index, 1)
				toast.success('快照删除成功')
				return true
			}
		} catch (error) {
			console.error(error)
			toast.error('删除失败，请查看控制台日志')
			return false
		}
	}
	function restoreSnapshot(name) {
		const snapshot = snapshots.value.find((item) => item.name === name)
		let emited = false
		extensionList.value.forEach((ext) => {
			if (ext.name in snapshot.data && ext.enabled !== snapshot.data[ext.name]) {
				if (!emited) {
					emitter.emit('customBatchOperation')
					emited = true
				}
				ext.enabled = snapshot.data[ext.name]
				game.saveConfig(`extension_${ext.name}_enable`, ext.enabled)
			}
		})
	}
	function setExtEnabledPreview(name) {
		if (name === null) {
			extensionList.value.forEach((ext) => {
				ext.preview = null
			})
			return
		}
		const snapshot = snapshots.value.find((item) => item.name === name)
		const data = snapshot.data
		extensionList.value.forEach((ext) => {
			if (ext.name in data) {
				ext.preview = data[ext.name]
			}
		})
	}
	return {
		snapshots,
		readAllSnapshots,
		trySaveSnapshot,
		tryDeleteSnapshot,
		restoreSnapshot,
		setExtEnabledPreview
	}
})
