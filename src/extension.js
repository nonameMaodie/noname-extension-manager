import { lib, game, ui, get, ai, _status } from 'noname'
import { content } from './source/content.js'
import { precontent } from './source/precontent.js'
import { config } from './source/config.js'
import { help } from './source/help.js'
import { basic } from './source/basic.js'
import extensionInfo from './extension/info.js'

export let type = 'extension';

export default async function () {
  let extension = {
    name: extensionInfo.name,
    editable: false,
    content,
    precontent,
    config: await basic.resolve(config),
    help: await basic.resolve(help),
    package: {},
    files: { "character": [], "card": [], "skill": [], "audio": [] }
  };
  Object.keys(extensionInfo)
    .filter(key => key != 'name')
    .forEach(key => extension.package[key] = extensionInfo[key]);
  return extension;
}
