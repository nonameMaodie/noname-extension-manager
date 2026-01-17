
# 扩展管家

**原作者：寰宇星城**\
**现更新维护：九个芒果**

## 扩展介绍

> 此扩展用于管理各个扩展的顺序和隐藏、开启状态。（预装扩展无法通过本扩展排序或隐藏，你可以手动隐藏预装扩展）

本人基于寰宇星城大佬的最后一个版本的扩展管家进行开发，在原来的基础上增加搜索、分类、快照等功能，同时兼容移动端和PC端设备。

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite 7.1.7
- **状态管理**: Pinia
- **拖拽功能**: vue-draggable-plus
- **轻提示**: vue3-hot-toast
- **事件总线**: mitt
- **UI框架**: 原生CSS与无名杀游戏UI集成
- **打包压缩**: Terser

## 项目架构

```
noname-extension-manager/
├── extension.js          # 扩展入口文件
├── vite.config.js        # Vite构建配置
├── package.json          # 项目依赖与脚本配置
├── src/
│   ├── App.vue           # 应用根组件
│   ├── main.js           # 应用主入口
│   ├── extension/        # 扩展信息和更新历史
│   ├── components/       # Vue组件目录
│   │   ├── ExtensionManager.vue     # 扩展管理器主界面
│   │   ├── MangerHeader.vue         # 管理器头部组件
│   │   ├── ClassManagement/         # 分类管理组件
│   │   ├── ExtensionManagement/     # 扩展管理组件
│   │   └── GameDataManagement/      # 游戏数据管理组件
│   ├── source/           # 主代码集成
│   ├── stores/           # Pinia状态存储
│   ├── utils/            # 工具函数
│   └── css/              # 样式文件
├── vite-plugins/         # 自定义Vite插件
├── gameData/             # 游戏数据目录
├── gameDataForMobile/    # 移动端游戏数据目录
├── snapshots/            # 快照数据目录
├── audio/                # 音频文件目录
└── image/                # 图片文件目录
```

## 核心功能

1. **扩展管理**：
   - 支持批量控制扩展的开启/关闭状态
   - 支持扩展的快捷隐藏/卸载
   - 支持搜索功能快速定位扩展

2. **分类管理**：
   - 支持扩展顺序调整
   - 支持扩展自定义分类

3. **游戏数据管理**：
   - 管理游戏数据备份与恢复

4. **快照功能**：
   - 扩展状态快照保存与恢复

## 构建与运行

### 环境要求

>建议参考官方文档: [如何运行无名杀（程序员版）](https://github.com/libnoname/noname/wiki/%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E6%97%A0%E5%90%8D%E6%9D%80%EF%BC%88%E7%A8%8B%E5%BA%8F%E5%91%98%E7%89%88%EF%BC%89)

- Node.js ^20.19.0 或 >=22.12.0
- pnpm 包管理器

### 安装依赖

在你的无名杀项目根目录下执行以下命令
```bash
# 进入extension目录
cd extension

# 克隆仓库并将原项目重命名为 “扩展管家”
git clone https://gitee.com/ninemangos/noname-extension-manager.git 扩展管家

# 进入扩展管家目录
cd 扩展管家 

# 安装依赖
pnpm install
```

### 开发模式运行

```bash
# 返回至无名杀项目根目录
cd ../..

# 运行无名杀
pnpm dev
```

### 生产构建
在 扩展管家 的项目根目录下执行以下命令
```bash
# 生产环境构建 - 启用极致压缩优化，输出文件体积更小
pnpm build
```
或者
```bash
# 开发模式构建 - 保留代码格式和换行符，便于调试，输出文件体积较大
pnpm build:dev
```

### 代码检查

```bash
pnpm lint
```

## 开发规范

- 代码压缩：生产环境中使用Terser压缩，移除`console`调用和注释
- CSS处理：通过`css-injected-by-js`插件将 CSS 注入到 JS 中
- 模块化：使用 ES 模块格式
- 类型安全：无特殊类型系统说明，遵循 JavaScript 标准

## 特殊配置

- Vite配置中包含自定义插件`vite-write-file-plugin.js`，用于生产构建环境下`info.json`和`README.md`等动态内容文件的写入操作
- 构建时会将`gameData、gameDataForMobile、snapshots、audio、image`等目录静态复制到输出目录
- 支持移动端自适应，通过`getDevice()`函数检测设备类型并调整UI尺寸
- 使用`MutationObserver API`实时切换背景图片，与无名杀游戏背景保持一致

## 致谢

感谢 **狂神** 大佬对本项目的架构改造与技术指导
