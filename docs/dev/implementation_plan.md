# 卡路里计算器实施计划

## 目标描述
在应用内增加"更新日志"入口，点击后展示 `CHANGELOG.md` 的内容。内容需自动同步，无需维护两份。

## 拟议变更
### UI 变更
- **Footer**: 在页脚添加 "更新日志" (Changelog) 链接/按钮。
- **Modal**: 创建一个全屏或弹窗式的 `div` 用于显示日志内容，支持关闭。

### 逻辑变更 (src/main.ts)
- 使用 Vite 的 `?raw`后缀导入 `CHANGELOG.md` 内容: `import changelogRaw from '../CHANGELOG.md?raw'`.
- 编写一个简单的 Markdown 解析器 (Simple Parser) 将 Markdown 转换为 HTML:
  - `## [Version]` -> `<h2>`
  - `### Category` -> `<h3>`
  - `- Item` -> `<li>`
- 处理 Modal 的打开与关闭逻辑。

### 样式变更 (src/style.css)
- 为 Modal 添加 Glassmorphism 样式。
- 适配 Markdown 渲染后的 HTML 样式。

## 验证计划
- 检查点击"更新日志"是否弹出窗口。
- 检查内容是否与 `CHANGELOG.md` 一致。
- 检查 Markdown 渲染格式是否美观 (Heading, List)。
