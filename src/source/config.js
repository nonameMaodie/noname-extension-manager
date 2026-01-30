import { game, lib, ui } from "noname";
import { showChangelog } from "../api/changelog.js";
import { useToast } from "../api/toast.js";
import updateHistory from "../extension/updateHistory.js";
import info from "../extension/info.js";
import { openApp } from "../main.js";
import { basic } from "./basic.js";
import { checkForUpdates } from "../api/update.js";

let observed = false;

export const config = {
  updateInfo: {
    name: `版本：${updateHistory[0].version}`,
    unfrequent: true,
    intro: "查看更新内容",
    init: "1",
    item: {
      1: "<font color=#2cb625>更新内容",
    },
    visualBar(node, item, create, switcher) {
      if (observed) return;
      observed = true;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class" &&
            switcher.classList.contains("on")
          ) {
            showChangelog(updateHistory, info.name, () => {
              const popupContainer =
                ui.window.querySelector(".popup-container");
              if (popupContainer) {
                popupContainer.hide();
              }
              switcher.classList.remove("on");
            });
          }
        });
      });
      observer.observe(switcher, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class"],
      });
    },
    visualMenu(node, link, name, config) {
      node.parentElement.style.display = "none";
    },
  },

  compatibility: {
    name: "最低适配：v1.10.10",
    clear: true,
    nopointer: true,
  },

  gzh: {
    name: "公众号",
    init: "1",
    item: {
      1: "点击查看",
    },
    textMenu(node, link) {
      lib.setScroll(node.parentNode);
      node.parentNode.style.width = "320px";
      node.parentNode.style.height = "500px";
      node.parentNode.style.overflowY = "auto";
      node.parentNode.style.transform = "translateY(-100px)";
      switch (link) {
        case "1":
          node.innerHTML = `
                    <img style="
                        width:100%;
                        height:auto;
                        display:block;
                        max-height:calc(100% - 20px);
                    " src="${basic.extensionDirectoryPath}/image/gzh.jpg">
                `;
          break;
      }
    },
    frequent: true,
  },
  shortcut: {
    name: "快捷打开方式",
    init: "draggable_btn",
    item: {
      close: "关闭",
      ui_system: "顶部菜单栏",
      draggable_btn: "悬浮按钮",
    },
    onclick(item) {
      game.saveExtensionConfig("扩展管家", "shortcut", item);
    },
  },
  manager: {
    clear: true,
    name: '<ins style="color:#36C0F5">打开扩展管家</ins>',
    onclick() {
      game.closeMenu();
      openApp();
    },
  },

  uninstall_invalid_exts: {
    clear: true,
    name: `<ins style="color:#ff433f">一键卸载无效扩展</ins>`,
    async onclick() {
      const valid_exts = (await game.promises.getFileList(lib.assetURL + "extension"))[0];
      const invalid_exts = lib.config.extensions.filter(ext => !valid_exts.includes(ext));
      if (invalid_exts.length) {
        if (confirm(`确定要卸载以下无效扩展吗？\n${invalid_exts.join("、")}`)) {
          for (const ext of invalid_exts) {
            try {
              await game.removeExtension(ext);
              await game.delay();
              useToast().success(`卸载${ext}成功`);
            } catch (e) {
              console.error(`卸载${ext}失败`, e);
              useToast().error(`卸载${ext}失败`);
            }
          }
        }
      } else {
        useToast().success("没有无效扩展");
      }
    }
  },

  repository: {
    clear: true,
    name: `<ins style="color:#fe7300">Gitee仓库地址</ins>`,
    async onclick() {
      const toast = useToast();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(info.diskURL);
        toast("复制成功！");
      } else {
        toast("复制失败！");
      }
    }
  },
  repository2: {
    clear: true,
    name: `<ins style="color:#ff79c6">Github仓库地址</ins>`,
    async onclick() {
      const toast = useToast();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(info.forumURL);
        toast("复制成功！");
      } else {
        toast("复制失败！");
      }
    }
  },

  checkForUpdates: {
    clear: true,
    name: '<button>检查更新</button>',
    onclick: checkForUpdates,
  },

  autoCheckForUpdates: {
    name: "自动检查更新",
    intro: "开启后每次启动游戏时检查更新",
    onclick(item) {
      game.saveExtensionConfig("扩展管家", "autoCheckForUpdates", item);
    },
  },

  //来自十周年UI author:点点
  showCiallo: {
    name: '<b><font color="#00FF66">𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★',
    intro: "",
    init: true,
    clear: true,
    onclick() {
      game.playAudio("..", "extension", "扩展管家/audio", "Ciallo");
      const toast = useToast();
      toast("Ciallo～(∠・ω＜)⌒★");
    },
  },
};
