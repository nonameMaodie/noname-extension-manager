import extensionInfo from "./extension/info.js";
import { basic } from "./source/basic.js";
import { config } from "./source/config.js";
import { content } from "./source/content.js";
import { help } from "./source/help.js";
import { precontent } from "./source/precontent.js";

export const type = "extension";

export default async function () {
  const extension = {
    name: extensionInfo.name,
    content,
    precontent,
    config: await basic.resolve(config),
    help: await basic.resolve(help),
    package: {},
    files: { character: [], card: [], skill: [], audio: [] },
  };
  Object.keys(extensionInfo)
    .filter((key) => key != "name")
    .forEach((key) => (extension.package[key] = extensionInfo[key]));
  return extension;
}
