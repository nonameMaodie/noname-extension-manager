import { ref } from '../external/vue.js'
import { defineStore } from '../external/pinia.js'
import { lib, game } from '../external/noname.js'
import { basic } from '../source/basic.js'
import { useToast } from '../api/toast.js'
import { getDevice } from '../utils/getDevice.js'

export const useGameDataStore = defineStore('gameData', () => {
	const folderPath = getDevice() !== 'mobile' ? `${basic.extensionDirectoryPath}/gameData` : `${basic.extensionDirectoryPath}/gameDataForMobile`;
	const toast = useToast()
	const gameDataList = ref(Array.from({ length: 16 }, (_, i) => createInitialDataInfo(i + 1)));

	function createDataInfo(id, name, time, initial = false) {
		return {
			id,
			name,
			time: time || new Date().toLocaleString().replace(/\//g, '.').replace(/:/g, '.'),
			get fileName() {
				return `${this.id}-${this.name}-${this.time}`;
			},
			initial,
		}
	}
	function createInitialDataInfo(id) {
		return createDataInfo(id, `存档槽${id}`, '未使用', true)
	}
	async function createData({ id, name }) {
		let data;
		let get_data = (data) => lib.init.encode(JSON.stringify(data))
		if (!lib.db) {
			data = {};
			for (let i in localStorage) {
				if (i.startsWith(lib.configprefix)) {
					data[i] = localStorage[i];
				}
			}
			data = get_data(data);
		} else {
			data = await new Promise(resolve => {
				game.getDB("config", null, function (data1) {
					game.getDB("data", null, function (data2) {
						resolve(get_data({
							config: data1,
							data: data2,
						}));
					});
				});
			})
		}
		return {
			gameData: data,
			info: createDataInfo(id, name),
		}
	}
	async function readGameData({ fileName }) {
		let data = await game.promises.readFileAsText(`${folderPath}/${fileName}`);
		try {
			data = JSON.parse(lib.init.decode(data));
			if (!data || typeof data != "object") {
				throw "err";
			}
			if (lib.db && (!data.config || !data.data)) {
				throw "err";
			}
		} catch (e) {
			toast.error("读取失败，请查看控制台日志");
			console.error(e);
			return;
		}
		toast.success("读取成功");
		if (!lib.db) {
			var noname_inited = localStorage.getItem("noname_inited");
			var onlineKey = localStorage.getItem(lib.configprefix + "key");
			localStorage.clear();
			if (noname_inited) {
				localStorage.setItem("noname_inited", noname_inited);
			}
			if (onlineKey) {
				localStorage.setItem(lib.configprefix + "key", onlineKey);
			}
			for (var i in data) {
				localStorage.setItem(i, data[i]);
			}
		} else {
			for (var i in data.config) {
				game.putDB("config", i, data.config[i]);
				lib.config[i] = data.config[i];
			}
			for (var i in data.data) {
				game.putDB("data", i, data.data[i]);
			}
		}
		lib.init.background();
		game.reload();
	}
	async function readAllGameData() {
		const [_, files] = await game.promises.getFileList(folderPath);
		for (const file of files) {
			const infoList = file.split('-');
			if (file.endsWith('.txt')) continue
			gameDataList.value[infoList[0] - 1] = createDataInfo(...infoList)
		}
		return gameDataList.value;
	}
	async function writeGameData(data) {
		const { gameData, info } = data;
		await game.promises.writeFile(gameData, folderPath, info.fileName);
	}

	async function deleteGameData({ fileName }) {
		await game.promises.removeFile(`${folderPath}/${fileName}`);
	}
	async function trySaveGameData({ id, name }) {
		try {
			// 正则判断name含有不合法的文件名符号
			if (/[\\/:*?"<>|-]/.test(name)) {
				toast.error('名称含有非法字符（\\/:*?"<>|-）')
				return false
			}
			const data = await createData({ id, name })
			await writeGameData(data)
			gameDataList.value[id - 1] = data.info
			toast.success('游戏设置保存成功')
			return true
		}
		catch (error) {
			console.error(error)
			toast.error('保存失败，请查看控制台日志')
			return false
		}
	}
	async function tryDeleteGameData(info) {
		try {
			await deleteGameData(info)
			gameDataList.value[info.id - 1] = createInitialDataInfo(info.id)
			toast.success('游戏设置删除成功')
			return true
		} catch (error) {
			console.error(error)
			toast.error('删除失败，请查看控制台日志')
			return false
		}
	}
	return {
		gameDataList,
		readGameData,
		readAllGameData,
		trySaveGameData,
		tryDeleteGameData,
	}
})
