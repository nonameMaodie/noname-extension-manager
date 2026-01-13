import { lib } from "noname";

const basicPath = lib.init.getCurrentFileLocation(import.meta.url).split("/");

export const basic = {
  /**
   * 扩展目录地址，自动生成。
   */
  extensionDirectoryPath: basicPath
    .slice(0, basicPath.lastIndexOf("extension") + 2)
    .join("/"),
  /**
   * 如果参数是function，返回其结果的promise。如果参数是普通对象，返回Promise.resolve(obj);
   * @param {*} obj
   * @returns
   */
  resolve(obj) {
    if (typeof obj == "function") {
      return Promise.resolve(obj());
    }
    return Promise.resolve(obj);
  },
};
