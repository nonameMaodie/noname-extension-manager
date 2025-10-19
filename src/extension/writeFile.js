import info from './info.js';
import updateHistory from './updateHistory.js';

export default function writeFile(fs, path, projectRoot) {
  const outDir = path.resolve(projectRoot, `../${info.name}`).replace(/\\/g, "/");
  fs.mkdirSync(outDir, { recursive: true });

  // 构建结束时生成版本文件
  const content = JSON.stringify(info);
  fs.writeFileSync(`${outDir}/info.json`, content);
  console.log(`文件已生成：`, `${outDir}/info.json`);

  // 读写协议文件
  const data = fs.readFileSync(path.resolve(projectRoot, 'LICENSE'));
  fs.writeFileSync(`${outDir}/LICENSE`, data);
  console.log(`文件已生成：`, `${outDir}/LICENSE`);

  // 读写README.md文件
  const README = '# 更新内容\n\n' + updateHistory.map(item => {
    const changes = item.changes.map((change, index) => `${index + 1}. ${change}`).join('\n');
    return `## ${item.version} (${item.date})\n${changes}`;
  }).join('\n\n');
  fs.writeFileSync(`${outDir}/README.md`, README);
  console.log(`文件已生成：`, `${outDir}/README.md`);
}
