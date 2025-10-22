import { exec } from "node:child_process";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取项目根目录
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 监听src目录下的文件变化并自动打包
export default function autoRunBuildPlugin() {
  return {
    name: "auto-run-build",
    configureServer(server) {
      server.watcher.on('change', (file) => {
        const absoluteDir = projectRoot.replace(/\\/g, "/");
        const relativePath = file.replace(/\\/g, "/").replace(absoluteDir, "");
        if (relativePath.startsWith("/src/") || ["/index.js"].includes(relativePath)) {
          exec("npm run build:dev", (error, stdout, stderr) => {
            if (error) {
              console.error("❌ 构建失败:", stderr);
            } else {
              console.log("✅ 构建成功:", stdout);
            }
          });
        }
      });
    },
  };
}
