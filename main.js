import { createApp } from './external/vue.js'
import { createPinia } from './external/pinia.js'
import { lib, ui, game } from './external/noname.js'
import App from './App.vue'

let temp = null
function handleOnOpenApp() {
	// 暂停游戏
	ui.click.pause()
	// 禁止无名杀的自带的点击事件
	temp = window.onkeydown
	window.onkeydown = null
}

function handleOnCloseApp() {
	// 继续游戏
	try {
		const pauseEl = document.querySelector('#window>.pausedbg')
		pauseEl.addEventListener('click', (e) => {
			ui.click.resume.call(pauseEl, e)
		}, { once: true })
		pauseEl.click()
	} catch { }
	// 解禁无名杀的点击事件
	window.onkeydown = temp
}


export function openApp() {
	setTimeout(() => {
		if (document.querySelector('#window>.kzgj-extension-manager-app')) return

		if (!lib.config.kzgj_mentioned) {
			game.alert("此面板的设置均有在重启后才能生效。");
			game.saveConfig('kzgj_mentioned', true);
		}
		handleOnOpenApp()
		const app = createApp(App, {
			onCloseApp() {
				handleOnCloseApp()
				ui.window.removeChild(vm.$el)
				app.unmount()
			},
		})

		app.use(createPinia())
		const vm = app.mount(document.createElement('div'))
		ui.window.appendChild(vm.$el)
	}, 0)
}

