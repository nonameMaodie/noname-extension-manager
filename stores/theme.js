import { defineStore } from '../external/pinia.js'
import { ui, game } from '../external/noname.js'

export const useThemeStore = defineStore('theme', () => {
	const themes = ['normal', 'dark']
	function setPreviousTheme() {
		const currentTheme = ui.window.getAttribute('data-kzgj-theme') || 'normal'
		const currentIndex = themes.indexOf(currentTheme)
		const previousIndex = (currentIndex - 1 + themes.length) % themes.length
		const previousTheme = themes[previousIndex]
		game.saveExtensionConfig('扩展管家', 'theme', previousTheme)
		ui.window.setAttribute('data-kzgj-theme', previousTheme)
	}
	function setNextTheme() {
		const currentTheme = ui.window.getAttribute('data-kzgj-theme') || 'normal'
		const currentIndex = themes.indexOf(currentTheme)
		const nextIndex = (currentIndex + 1) % themes.length
		const nextTheme = themes[nextIndex]
		game.saveExtensionConfig('扩展管家', 'theme', nextTheme)
		ui.window.setAttribute('data-kzgj-theme', nextTheme)
	}

	return {
		setPreviousTheme,
		setNextTheme,
	}
})
