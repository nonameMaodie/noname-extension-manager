import writeDynamicFiles from "../src/extension/writeDynamicFiles.js";

// 构建结束后写入自定义文件
export default function writeFilePlugin() {
  return {
    name: "generate-write-file",
    // 生成bundle钩子 - 创建文件
    generateBundle() {
      const dynamicList = writeDynamicFiles();
      for (const {fileName, source} of dynamicList) {
        // 使用emitFile API输出文件
        this.emitFile({
          type: 'asset',
          fileName, // 输出文件名
          source, // 文件内容
        });
      }
    },
  };
}
