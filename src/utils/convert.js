/**
 * 将Markdown转换为HTML
 * @param { string } text Markdown字符串
 * @returns { Promise<string> }
 */
export async function convertMarkdownToHTML(text) {
  const response = await fetch("https://gitee.com/api/v5/markdown", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  })
  const html = await response.json();
  return html;
}

/**
 * 同步Base64转ArrayBuffer（内部使用）
 * @param {string} base64String - Base64字符串
 * @returns {ArrayBuffer} 解码后的ArrayBuffer
 */
function syncBase64ToArrayBuffer(base64String) {
  // 处理浏览器兼容性
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * 处理大型Base64字符串（分块解码）
 * @param {string} base64String - Base64字符串
 * @param {number} chunkSize - 分块大小（字节）
 * @returns {Promise<ArrayBuffer>} 解码后的ArrayBuffer
 */
async function processLargeBase64(base64String, chunkSize = 8192) {
  // 计算填充字符数量
  let padding = 0;
  const len = base64String.length;
  if (len > 0 && base64String[len - 1] === '=') {
    padding++;
    if (len > 1 && base64String[len - 2] === '=') padding++;
  }

  // 精确计算字节数: (n * 3)/4 - padding
  const totalBytes = Math.floor((len * 3) / 4) - padding;

  // 创建缓冲区
  const buffer = new ArrayBuffer(totalBytes);
  const bytes = new Uint8Array(buffer);

  // 确保块大小是4的倍数（Base64解码要求）
  const adjustedChunkSize = Math.max(4, chunkSize - (chunkSize % 4));
  let offset = 0;

  // 处理完整块
  for (let i = 0; i < len; i += adjustedChunkSize) {
    const chunkEnd = Math.min(i + adjustedChunkSize, len);
    const chunk = base64String.slice(i, chunkEnd);

    try {
      // 解码当前块
      const chunkBuffer = syncBase64ToArrayBuffer(chunk);
      const chunkBytes = new Uint8Array(chunkBuffer);

      // 复制到目标缓冲区
      bytes.set(chunkBytes, offset);
      offset += chunkBytes.length;
    } catch (e) {
      throw new Error(`Error decoding chunk at position ${i}: ${e.message}`);
    }

    // 定期让出主线程（每4块）
    if (i % (adjustedChunkSize * 4) === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return buffer;
}

/**
 * 高性能Base64转ArrayBuffer（自动选择解码策略）
 * @param {string} base64String - Base64字符串
 * @param {number} [chunkSize=8192] - 分块大小（字节）
 * @returns {Promise<ArrayBuffer>} 解码后的ArrayBuffer
 */
export async function convertBase64ToArrayBuffer(base64String, chunkSize = 8192) {
  return new Promise((resolve, reject) => {
    // 选择合适的调度器
    const scheduleWork = typeof requestIdleCallback === 'function'
      ? (cb) => requestIdleCallback(() => cb())
      : (cb) => setTimeout(cb, 0);

    scheduleWork(async () => {
      try {
        // 小数据直接解码（<80KB）
        if (base64String.length <= chunkSize * 10) {
          resolve(syncBase64ToArrayBuffer(base64String));
        }
        // 大数据分块处理
        else {
          const result = await processLargeBase64(base64String, chunkSize);
          resolve(result);
        }
      } catch (error) {
        reject(new Error(`Base64 conversion failed: ${error.message}`));
      }
    });
  });
}

/**
 * 将文件大小转换为易读的格式
 * @param { number } limit 字节数
 * @returns { string } 转换为“数字 + ("B" | "KB" | "MB" | "GB")”的字符串
 */
export function convertNumToSize(limit) {
  let size = "";
  if (limit < 1 * 1024) {
    // 小于1KB，则转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 1 * 1024 * 1024) {
    // 小于1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 1 * 1024 * 1024 * 1024) {
    // 小于1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  // 转成字符串
  let sizeStr = size + "";
  // 获取小数点处的索引
  let index = sizeStr.indexOf(".");
  // 获取小数点后两位的值
  let dou = sizeStr.slice(index + 1, 2);
  // 判断后两位是否为00，如果是则删除00
  if (dou == "00") {
    return sizeStr.slice(0, index) + sizeStr.slice(index + 3, 2);
  }
  return size;
}