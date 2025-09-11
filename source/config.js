import { lib, game, ui, get, ai, _status } from '../../../noname.js'
import { openApp } from '../main.js'
import { basic } from './basic.js'

export const config = {
	compatibility: {
		name: '最低适配：v1.10.10',
		clear: true,
		nopointer: true,
	},
	gzh: {
		name: '公众号',
		init: '1',
		item: {
			'1': '点击查看',
		},
		'textMenu'(node, link) {
			lib.setScroll(node.parentNode);
			node.parentNode.style.width = '320px';
			node.parentNode.style.height = '500px';
			node.parentNode.style.overflowY = 'auto';
			node.parentNode.style.transform = 'translateY(-100px)';
			switch (link) {
				case '1':
					node.innerHTML = `
                    <img style="
                        width:100%; 
                        height:auto; 
                        display:block;
                        max-height:calc(100% - 20px);
                    " src="${basic.extensionDirectoryPath}image/gzh.jpg">
                `;
					break;
			}
		},
		frequent: true,
	},
	shortcut: {
		name: '快捷打开方式',
		init: 'draggable_btn',
		item: {
			'close': '关闭',
			'ui_system': '顶部菜单栏',
			'draggable_btn': '悬浮按钮',
		},
		onclick: function (item) {
			game.saveExtensionConfig('扩展管家', 'shortcut', item)
		},
	},
	"manager": {
		"clear": true,
		name: '<ins style="color:#36C0F5">打开扩展管家</ins>',
		onclick: function () {
			game.closeMenu()
			openApp()
		},
	}
}
