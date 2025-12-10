import { lib, game, ui, get, ai, _status } from 'noname'
import { openApp } from '../main.js'
import { createDraggableEl } from '../api/draggableEl.js'

export async function content(config, pack) {
  //在这里编写启动阶段执行的代码。

  lib.arenaReady.push(() => {
    const theme = game.getExtensionConfig('扩展管家', 'theme')
    if (theme) {
      ui.window.setAttribute('data-kzgj-theme', theme)
    }
  });

  const shortcut = game.getExtensionConfig('扩展管家', 'shortcut') || 'draggable_btn'
  switch (shortcut) {
    case 'ui_system': {
      const getSystem = setInterval(() => {
        if (ui.system1 || ui.system2) {
          clearInterval(getSystem);
          ui.create.system(`管`, openApp);
        }
      }, 500)
      break;
    }
    case 'draggable_btn': {
      lib.arenaReady.push(() => {
        createDraggableEl('管', openApp)
      });
      break;
    }
  }
}
