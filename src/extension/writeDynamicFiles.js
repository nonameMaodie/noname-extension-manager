import info from './info.js';
import updateHistory from './updateHistory.js';

export default function writeDynamicFiles() {
  // 生成info.json文件
  const content = JSON.stringify(info);

  // 生成README.md文件
  const README = '# README\n\n' + updateHistory.map(item => {
    const changes = item.changes.map((change, index) => `${index + 1}. ${change}`).join('\n');
    return `## ${item.version} (${item.date})\n${changes}`;
  }).join('\n\n');

  return [
    {
      fileName: 'info.json',
      source: content
    },
    {
      fileName: 'README.md',
      source: README
    }
  ]
}
