// 生成一个临时id
export function getTempId() {
  return Math.random().toString(36).substring(2, 15);
}
