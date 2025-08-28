const symbol = Symbol('clickOutsideHandler')

export default {
  mounted(el, binding) {
    el[symbol] = (event) => {
      // 1. 点击的是自身元素 → 忽略
      // 2. 点击的是子元素 → 忽略
      // 3. 其他情况 → 触发回调
      if (!el.contains(event.target)) {
        if (typeof binding.value === 'function') {
          binding.value(event) // 执行绑定的方法
        } else {
          throw new TypeError('clickOutside 指令的值必须是一个函数')
        }
      }
    }
    if (binding.modifiers.passive) {
      setTimeout(() => {
        document.addEventListener('click', el[symbol])
      }, 0)
    } else {
      document.addEventListener('click', el[symbol])
    }
  },
  unmounted(el) {
    document.removeEventListener('click', el[symbol])
    delete el[symbol]
  },
}
