import { defineStore } from '../external/pinia.js'
import { computed, ref } from '../external/vue.js'
import { lib, game, ui } from '../external/noname.js'
import { extensionList, classes } from './libExtensions.js'
import { showModal } from '../api/modal.js'

export const useExtensionsStore = defineStore('extensions', () => {
	// 扩展管理页，当前下拉菜单已选中的分类列表，对应文本
	const selectedClass = ref('全部')
	const searchText = ref('')
	// 扩展管理页，当前下拉菜单已选中的分类列表，对应数据
	const selectedClassList = computed(() => {
		return classes.value.find((item) => item.name === selectedClass.value)
	})
	// 当前能够展示的已开启扩展列表
	const enabledExtensions = computed(() =>
		extensionList.value.filter(
			(ext) =>
				ext.enabled &&
				selectedClassList.value.extensions.includes(ext) &&
				new RegExp(searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(ext.name),
		),
	)
	// 当前能够展示的已关闭扩展列表
	const disabledExtensions = computed(() =>
		extensionList.value.filter(
			(ext) =>
				!ext.enabled &&
				selectedClassList.value.extensions.includes(ext) &&
				new RegExp(searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(ext.name),
		),
	)

	// 切换扩展状态
	function toggleExtensionEnabled(ext) {
		ext.enabled = !ext.enabled
		game.saveConfig(`extension_${ext.name}_enable`, ext.enabled)
	}

	// 设置扩展状态
	function setExtensionEnabled(ext, enabled) {
		ext.enabled = enabled
		game.saveConfig(`extension_${ext.name}_enable`, ext.enabled)
	}

	// 开启所有扩展
	function enableAllExtensions() {
		for (const ext of disabledExtensions.value) {
			setExtensionEnabled(ext, true)
		}
	}

	// 关闭所有扩展
	function disableAllExtensions() {
		for (const ext of enabledExtensions.value) {
			setExtensionEnabled(ext, false)
		}
	}

	// 显示扩展详情
	function showExtensionDetail(ext) {
		ui.menuContainer.show()
		ui.click.extensionTab(ext.name)

		// 创建一个临时遮罩，防止移动端环境下点击穿透，导致退出页面
		const mask = ui.create.div(document.querySelector('#window>.kzgj-extension-manager-app'))
		mask.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			backdrop-filter: blur(4px);
			background-color: transparent;
			z-index: 10;
		`
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					// 检查 hidden 类是否被移除
					if (!element.classList.contains('hidden')) {
						setTimeout(() => {
							mask.remove()
						}, 300)
						observer.disconnect()
					}
				}
			});
		});

		observer.observe(ui.menuContainer, {
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ['class']
		});

		const element = ui.menuContainer.querySelector(`.menu-content .menubutton.active`)
		if (!element) return;
		element.scrollIntoViewIfNeeded(true);
	}

	// 卸载扩展
	async function uninstallExtension(ext) {
		const result = await showModal({
			title: "注意",
			content: `确定要卸载《${ext.name}》吗？`,
			cancel: '取消'
		})
		if (result) {
			try {
				// 优先模拟点击“删除此扩展”按钮
				const div = ui.create.div('', '<span>确认删除</span>', ui.create.div(ui.create.div()))
				lib.extensionMenu[`extension_${ext.name}`].delete.onclick.call(div);
			} catch {
				if (lib.config.extensions.includes(ext.name)) game.removeExtension(ext.name)
			} finally {
				extensionList.value = extensionList.value.filter((e) => e.name !== ext.name)
			}
		}
	}

	// 扩展隐藏切换
	function toggleExtensionHide(ext) {
		ext.hide = !ext.hide
		if (ext.hide) {
			if (ext.name == '扩展管家') {
				showModal({
					title: "注意",
					content: "隐藏《扩展管家》后，如您需要令其重新显示，请在控制台执行：game.saveConfig\n('hiddenPlayPack',[])",
				})
			}
			lib.config.hiddenPlayPack.add(`extension_${ext.name}`)
		} else {
			lib.config.hiddenPlayPack.remove(`extension_${ext.name}`)
		}
		game.saveConfig('hiddenPlayPack', lib.config.hiddenPlayPack)
	}

	// 更新扩展排序
	function updateExtensionSort() {
		game.saveConfig(
			'extensionSort',
			extensionList.value.map((item) => 'extension_' + item.name),
		)
	}

	return {
		searchText,
		selectedClass,
		enabledExtensions,
		disabledExtensions,
		toggleExtensionEnabled,
		setExtensionEnabled,
		enableAllExtensions,
		disableAllExtensions,
		showExtensionDetail,
		uninstallExtension,
		toggleExtensionHide,
		updateExtensionSort,
	}
})
