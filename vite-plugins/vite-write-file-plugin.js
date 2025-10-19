import fs from "fs";
import path from "path";
import writeFile from "../src/extension/writeFile.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取项目根目录
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 构建结束后写入自定义文件
export default function writeFilePlugin() {
  return {
    name: "generate-write-file",
    config(config, { command }) {
      if (command === 'build') {
        writeFile(fs, path, projectRoot);
      }
    }
  };
}
