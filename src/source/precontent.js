import { lib, game, ui, get, ai, _status } from '@noname'
import { basic } from './basic.js';
import "../css/main.css";
import "../css/theme.css";

export async function precontent(config, pack) {
  // 动态加载 css
  // const cssPath = `${basic.extensionDirectoryPath}/css`;
  // const [_, files] = await game.promises.getFileList(cssPath);
  // for (const file of files) {
  //   if (!file.endsWith('.css')) continue
  //   lib.init.css(cssPath, file.replace(/\.css$/, ''));
  // }
}
