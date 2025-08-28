import { lib, game } from '../external/noname.js'

export function autoZoom(el, options) {
	let { width, height } = options

	function init() {
		const zoomX = window.innerWidth / width
		const zoomY = window.innerHeight / height

		el.style.zoom = 1 / game.documentZoom * Math.min(zoomX, zoomY)
	}
	init()

	lib.onresize.push(init)

	const release = () => {
		lib.onresize.remove(init)
	}
	return release
}
