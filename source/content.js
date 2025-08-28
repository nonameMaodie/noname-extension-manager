import { lib, game, ui, get, ai, _status } from '../../../noname.js'
import { openApp } from '../main.js'

export async function content(config, pack) {
	//在这里编写启动阶段执行的代码。
	const getSystem = setInterval(() => {
		if (ui.system1 || ui.system2) {
			clearInterval(getSystem);
			ui.create.system(`管家`, openApp);
		}
	}, 500);
}
