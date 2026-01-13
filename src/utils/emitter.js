// 引入mitt
import mitt from "mitt";

// 创建并暴露mitt
export const emitter = mitt();

// 绑定事件
// emitter.on('abc',(value)=>{
//   console.log('abc事件被触发',value)
// })

// 解绑事件
// emitter.off('someEvent', handleSomeEvent)

// 触发事件
// setInterval(() => {
//   emitter.emit('abc',666)
//   emitter.emit('xyz',777)
// }, 1000);

// 清理事件
// setTimeout(() => {
//   emitter.all.clear()
// }, 3000);
