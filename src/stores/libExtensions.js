import { game, lib } from "noname";
import { computed, ref } from "vue";

const extensions = lib.config.extensions.slice(0);
if (lib.config.extensionSort && Array.isArray(lib.config.extensionSort)) {
  extensions.sort((a, b) => {
    return (
      lib.config.extensionSort.indexOf("extension_" + a) -
      lib.config.extensionSort.indexOf("extension_" + b)
    );
  });
}

export const extensionList = ref(
  extensions.map((item, index) => {
    return {
      id: index,
      name: item,
      hide: lib.config.hiddenPlayPack.includes(`extension_${item}`),
      enabled: lib.config[`extension_${item}_enable`] === true,
      preview: null,
    };
  })
);

const extensionClasses = ref(
  game.getExtensionConfig("扩展管家", "extensionClasses") || [
    { id: 0, name: "全部", extensions: [] },
    { id: 1, name: "美化", extensions: [] },
    { id: 2, name: "功能", extensions: ["扩展管家"] },
    { id: 3, name: "武将", extensions: [] },
  ]
);
// 将已保存的 recordClasses 记录的扩展名转为扩展对象
extensionClasses.value[0].extensions = extensionList.value;
for (let i = 1; i < extensionClasses.value.length; i++) {
  const classItem = extensionClasses.value[i];
  const extensions = classItem.extensions; // 扩展名列表
  const extObjList = []; // 扩展对象列表
  for (const extName of extensions) {
    const ext = extensionList.value.find((item) => item.name === extName); // 获取扩展对象
    if (ext) {
      extObjList.push(ext);
    }
  }
  classItem.extensions = extObjList; // 将 扩展名 列表替换为 扩展对象 列表
}

// game.saveExtensionConfig('扩展管家', 'extensionClasses') 保存的目标对象列表
export const recordClasses = computed(() => {
  return classes.value.map((item) => {
    const obj = { ...item };
    obj.extensions = item.extensions.map((ext) => ext.name);
    return obj;
  });
});

// 实际操作的对象列表
export const classes = extensionClasses;
