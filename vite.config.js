import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vueDevTools from "vite-plugin-vue-devtools";
import writeFilePlugin from "./vite-plugins/vite-write-file-plugin.js";

export default defineConfig(({ command, mode }) => {
  const isDev = command === "serve" || mode === "development"; // 判断是否为开发模式
  // isDev = true; // 强制开发模式，方便调试

  return {
    plugins: [
      vue(),
      vueDevTools(),
      writeFilePlugin(),
      viteStaticCopy({
        targets: [
          { src: "gameData", dest: "" },
          { src: "gameDataForMobile", dest: "" },
          { src: "snapshots", dest: "" },
          { src: "audio", dest: "" },
          { src: "image", dest: "" },
          { src: "LICENSE", dest: "" },
        ],
      }),
      cssInjectedByJsPlugin(),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }, // 保证在浏览器环境下运行
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      minify: !isDev && "terser", // 开发环境，禁用压缩，方便调试
      sourcemap: isDev, // source map 生成
      rollupOptions: {
        external: ["vue", "noname"],
        input: "extension.js", // 入口文件
        output: {
          entryFileNames: "extension.js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name][extname]",
          manualChunks: (id) => (id.includes("node_modules") ? "vendor" : null),
          inlineDynamicImports: false,
          preserveModules: false, // 禁止将模块拆分到多个文件[1](@ref)
          format: "es",
        },
      },
      copyPublicDir: false, // 禁止复制 public 目录[1](@ref)
    },
    // css: {
    // 	devSourcemap: isDev, // 映射 CSS 到原始文件
    // },
    terserOptions: {
      compress: {
        drop_console: !isDev, // 删除所有 console.* 调用
        // 添加以下选项以进一步压缩代码
        collapse_vars: true, // 内联定义多次但只赋值一次的变量
        reduce_vars: true, // 优化变量赋值
        // pure_funcs: ['console.log'], // 移除特定函数调用，如 console.log
      },
      format: {
        comments: false, // 删除注释
        beautify: false, // 禁止美化输出（即删除换行符和空格）
      },
      mangle: {
        properties: {
          regex: /^_[a-zA-Z]/, // 混淆私有属性（以 _ 开头）
        },
      },
    },
  };
});
