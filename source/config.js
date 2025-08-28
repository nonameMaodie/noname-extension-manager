import { lib, game, ui, get, ai, _status } from '../../../noname.js'
import { openApp } from '../main.js'
export const config = {
	"manager": {
		"clear": true,
		name: '<ins style="color:#36C0F5">打开扩展管家</ins>',
		onclick: function () {
			game.closeMenu()
			openApp()
		},
	}
}
