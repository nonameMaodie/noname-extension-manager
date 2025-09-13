import { lib, game } from '../external/noname.js'

export function autoZoom(el, options) {
	let { width, height } = options
	if (!width && !height) throw new Error('autoZoom: width or height is required')

	function init() {
		const zoomX = width ? (window.innerWidth / width) : Infinity
		const zoomY = height ? (window.innerHeight / height) : Infinity

		el.style.zoom = Math.min(zoomX, zoomY) / game.documentZoom
	}
	init()

	lib.onresize.push(init)

	const release = () => {
		lib.onresize.remove(init)
	}
	return release
}
