// 基于https://github.com/sunzsh/vue-el-demo/blob/master/src/main.js的拖拽代码改造
import { game, lib } from '@noname'

function getZoomLevel() {
	return game.documentZoom || 1;
}

// 拖拽api
export function initDrag(el, options = {}) {
	if (!el) {
		console.error('拖拽功能初始化失败：元素不存在');
		return;
	}

	const oDiv = el;
	const minTop = options.minTop || parseInt(oDiv.getAttribute('drag-min-top')) || 0;
	const ifMoveSizeArea = options.ifMoveSizeArea || 20;
	const onDragStart = options.onDragStart || (() => { });
	const onDragEnd = options.onDragEnd || (() => { });
	const onPositionChange = options.onPositionChange || (() => { });

	// 确保元素是绝对定位
	if (window.getComputedStyle(oDiv).position !== 'absolute') {
		oDiv.style.position = 'absolute';
	}

	// 判断是否为触屏模式
	const isTouchscreen = lib.config.touchscreen;

	if (isTouchscreen) {
		oDiv.addEventListener('touchstart', dragStart);
	} else {
		oDiv.addEventListener('mousedown', dragStart);
	}

	function dragStart(e) {
		let target = oDiv;

		// 查找最近的绝对定位父元素
		while (window.getComputedStyle(target).position !== 'absolute' && target !== document.body) {
			target = target.parentElement;
		}

		// 防止文本选择
		document.onselectstart = () => false;

		// 保存初始位置
		if (!target.getAttribute('init_x')) {
			target.setAttribute('init_x', target.offsetLeft);
			target.setAttribute('init_y', target.offsetTop);
		}

		const initX = parseInt(target.getAttribute('init_x'));
		const initY = parseInt(target.getAttribute('init_y'));

		// 获取当前缩放比例
		const zoomLevel = getZoomLevel();

		// 计算触摸点与元素左上角的偏移（考虑缩放）
		let disX, disY;
		if (isTouchscreen) {
			const touch = e.touches[0];
			disX = (touch.clientX / zoomLevel) - target.offsetLeft;
			disY = (touch.clientY / zoomLevel) - target.offsetTop;
		} else {
			disX = (e.clientX / zoomLevel) - target.offsetLeft;
			disY = (e.clientY / zoomLevel) - target.offsetTop;
		}

		onDragStart(target, { x: initX, y: initY });

		if (isTouchscreen) {
			document.addEventListener('touchmove', dragMove);
			document.addEventListener('touchend', dragEnd);
		} else {
			document.addEventListener('mousemove', dragMove);
			document.addEventListener('mouseup', dragEnd);
		}

		function dragMove(e) {
			// 阻止页面滚动
			if (isTouchscreen) {
				e.preventDefault();
			}

			// 获取当前缩放比例
			const zoomLevel = getZoomLevel();

			// 计算新位置（考虑缩放）
			let l, t;
			if (isTouchscreen) {
				const touch = e.touches[0];
				l = (touch.clientX / zoomLevel) - disX;
				t = (touch.clientY / zoomLevel) - disY;
			} else {
				l = (e.clientX / zoomLevel) - disX;
				t = (e.clientY / zoomLevel) - disY;
			}

			// 获取margin值，确保不是NaN
			const style = window.getComputedStyle(target);
			const ml = parseInt(style.marginLeft) || 0;
			const mt = parseInt(style.marginTop) || 0;

			// 应用新位置（遵守最小顶部限制）
			target.style.left = Math.max(0, l - ml) + 'px';
			target.style.top = Math.max(minTop, t - mt) + 'px';

			// 检测是否移动超过容差范围
			if (Math.abs(l - initX) > ifMoveSizeArea || Math.abs(t - initY) > ifMoveSizeArea) {
				target.setAttribute('dragged', '');
			} else {
				target.removeAttribute('dragged');
			}

			// 触发位置变化回调
			onPositionChange(target, {
				x: parseInt(target.style.left) || 0,
				y: parseInt(target.style.top) || 0
			});
		}

		function dragEnd() {
			if (isTouchscreen) {
				document.removeEventListener('touchmove', dragMove);
				document.removeEventListener('touchend', dragEnd);
			} else {
				document.removeEventListener('mousemove', dragMove);
				document.removeEventListener('mouseup', dragEnd);
			}
			document.onselectstart = null;

			onDragEnd(target, {
				x: parseInt(target.style.left) || 0,
				y: parseInt(target.style.top) || 0
			});
		}

		// 阻止默认行为和事件冒泡
		e.preventDefault();
		e.stopPropagation();
	}

	// 返回销毁函数
	return () => {
		if (isTouchscreen) {
			oDiv.removeEventListener('touchstart', dragStart);
		} else {
			oDiv.removeEventListener('mousedown', dragStart);
		}
	};
}

/* ---------------------------------- */
// 使用方法
// 初始化拖拽
/* const destroyDrag = initDrag(element, {
	minTop: 50, // 最小顶部距离
	ifMoveSizeArea: 20, // 移动容差
	onDragStart: (element, initPosition) => {}, // 拖拽开始回调
	onDragEnd: (element, finalPosition) => {}, // 拖拽结束回调
	onPositionChange: (element, position) => {} // 位置变化回调
}); */

// 销毁拖拽功能
/* destroyDrag(); */
/* ---------------------------------- */

// Vue指令定义
const dragSymbol = Symbol('destroyDrag');
export default {
	mounted(el, binding) {
		const options = binding.value || {};

		// 如果指令有参数，初始化拖拽功能
		if (binding.value !== false) {
			const destroyDrag = initDrag(el, options);

			// 将销毁函数保存在元素上，以便后续清理
			el[dragSymbol] = destroyDrag;
		}
	},

	updated(el, binding) {
		// 处理指令参数更新的情况
		if (binding.value !== binding.oldValue) {
			// 如果之前有拖拽功能，先销毁
			if (el[dragSymbol]) {
				el[dragSymbol]();
				el[dragSymbol] = null;
			}

			// 如果新值不是false，重新初始化
			if (binding.value !== false) {
				const options = binding.value || {};
				const destroyDrag = initDrag(el, options);
				el[dragSymbol] = destroyDrag;
			}
		}
	},

	unmounted(el) {
		// 组件销毁时清理拖拽功能
		if (el[dragSymbol]) {
			el[dragSymbol]();
			el[dragSymbol] = null;
		}
	}
}

/* ---------------------------------- */
// 使用方法：
// 在Vue组件中注册指令:
// import vDrag from './utils/drag.js'
// 
// 在模板中使用:
// <div v-drag="{ minTop: 50, ifMoveSizeArea: 20 }"></div>
// <div v-drag="{ 
//   onDragStart: (element, initPosition) => {},
//   onDragEnd: (element, finalPosition) => {},
//   onPositionChange: (element, position) => {}
// }"></div>
/* ---------------------------------- */
