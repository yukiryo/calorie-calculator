# UI 重构设计文档：Liquid Glass 风格

## 目标

将现有 UI 从"AI 生成的毛玻璃 + 深紫渐变"改为 Apple iOS 26 Liquid Glass 风格，支持日间/夜间双模式。

## 设计原则

1. **内容为主，玻璃为辅** — 玻璃效果只用于系统级 UI 元素（导航栏、底部栏），内容区域用实色卡片
2. **克制** — 去掉渐变文字、发光阴影、浮动动画等花哨效果
3. **系统级配色** — 使用 Apple 系统色（蓝 `#007aff`/`#0a84ff`、灰阶），不自选紫/橙等装饰色
4. **双模式** — 默认跟随系统 `prefers-color-scheme`，提供手动覆盖开关

## 配色方案

### 日间模式

| 元素 | 颜色 |
|------|------|
| 页面背景 | `#f2f2f7` |
| 内容卡片 | `#ffffff` |
| 卡片边框 | `rgba(0,0,0,0.04)` |
| 主文字 | `#1d1d1f` |
| 次要文字 | `#8e8e93` |
| 占位文字 | `#aeaeb2` |
| 导航栏背景 | `rgba(242,242,247,0.8)` + `backdrop-filter: blur(20px) saturate(180%)` |
| 导航栏边框 | `rgba(0,0,0,0.06)` |
| 主按钮 | `#007aff` |
| 次要按钮 | 透明 + `color: #007aff` |
| Toggle 未选 | `#e5e5ea` |
| Toggle 选中 | `#ffffff` + 阴影 |

### 夜间模式

| 元素 | 颜色 |
|------|------|
| 页面背景 | `#000000` |
| 内容卡片 | `#1c1c1e` |
| 卡片边框 | `rgba(255,255,255,0.05)` |
| 主文字 | `#f5f5f7` |
| 次要文字 | `#636366` |
| 占位文字 | `#48484a` |
| 导航栏背景 | `rgba(28,28,30,0.8)` + `backdrop-filter: blur(20px) saturate(180%)` |
| 导航栏边框 | `rgba(255,255,255,0.06)` |
| 主按钮 | `#0a84ff` |
| 次要按钮 | 透明 + `color: #0a84ff` |
| Toggle 未选 | `#2c2c2e` |
| Toggle 选中 | `#3a3a3c` |

## 组件变更

### 1. 页面背景

- 移除 `body` 上的 `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)`
- 移除 `index.html` 中 `body` 的 inline style
- 用 CSS 变量 + `prefers-color-scheme` 实现双模式

### 2. 导航栏（header）

- 新增 `.nav-bar` 容器包裹标题
- 样式：半透明背景 + `backdrop-filter: blur(20px) saturate(180%)` + 底部细边框
- 标题改为纯色（非渐变）
- 移除 `h1` 上的 `background: linear-gradient(...)` 渐变

### 3. 内容卡片

- `.input-row` / `.result-card` 改为实色背景（白/深灰）
- 移除 `box-shadow: 0 8px 32px` 等发光阴影
- 保留微弱阴影 `box-shadow: 0 1px 3px rgba(...)` 用于层次感
- 移除 `::before` 伪元素的顶部光线装饰

### 4. 模式切换

- 在导航栏右侧添加切换按钮（太阳/月亮图标）
- 默认行为：`prefers-color-scheme` media query 自动切换
- 手动切换：点击按钮在 `data-theme="light"` / `data-theme="dark"` / 无（跟随系统）之间循环
- 手动选择保存到 `localStorage`
- 实现：`<html>` 上的 class 或 data 属性控制，CSS 变量覆盖

### 5. Toggle 按钮

- 改为 iOS 风格 segmented control：圆角药丸背景 + 滑动选中态
- 日间：`#e5e5ea` 底色，选中 `#fff` + 阴影
- 夜间：`#2c2c2e` 底色，选中 `#3a3a3c`

### 6. 主按钮

- 移除渐变 `linear-gradient(135deg, ...)` 和 `box-shadow` 发光效果
- 日间：纯色 `#007aff`
- 夜间：纯色 `#0a84ff`
- 保留 hover 微妙变化（opacity 或 brightness）

### 7. 抽屉（Drawer）

- 抽屉内容背景改为实色（白/深灰）
- 遮罩层保持半透明黑色
- 食品 chip 改为实色卡片风格

### 8. 弹窗（Modal）

- 弹窗内容背景改为实色
- 遮罩层保持 `backdrop-filter: blur(4px)`
- 按钮样式跟随主按钮/次要按钮规范

### 9. BMI 视图

- 应用与主视图完全相同的样式变更
- 参考表格保持现有结构，只改配色

### 10. 动画

- 移除 `.glass-container` 上的 `floatIn` 浮入动画
- 移除 `#app` 上的 `perspective: 1000px`
- 保留 `input:focus` 的 `transform: scale(1.02)` 微交互
- 保留 `updateResult` 的数字缩放动画（`scale(1.1)` → `scale(1)`）

### 11. 字体

- 保持 `Outfit` 字体不变
- 但标题不再使用渐变色，改为纯色

## CSS 实现方案

使用 CSS 自定义属性 + `prefers-color-scheme` media query：

```css
:root {
  --bg: #f2f2f7;
  --card: #ffffff;
  --card-border: rgba(0,0,0,0.04);
  --text-primary: #1d1d1f;
  --text-secondary: #8e8e93;
  --text-placeholder: #aeaeb2;
  --nav-bg: rgba(242,242,247,0.8);
  --nav-border: rgba(0,0,0,0.06);
  --accent: #007aff;
  --toggle-bg: #e5e5ea;
  --toggle-active: #ffffff;
  --card-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --card: #1c1c1e;
    --card-border: rgba(255,255,255,0.05);
    --text-primary: #f5f5f7;
    --text-secondary: #636366;
    --text-placeholder: #48484a;
    --nav-bg: rgba(28,28,30,0.8);
    --nav-border: rgba(255,255,255,0.06);
    --accent: #0a84ff;
    --toggle-bg: #2c2c2e;
    --toggle-active: #3a3a3c;
    --card-shadow: none;
  }
}

[data-theme="light"] { /* 覆盖同日间变量 */ }
[data-theme="dark"] { /* 覆盖同夜间变量 */ }
```

## 文件变更清单

| 文件 | 变更内容 |
|------|----------|
| `src/style.css` | 重写所有配色和组件样式，使用 CSS 变量 |
| `index.html` | 导航栏结构微调，加模式切换按钮 |
| `src/main.ts` | 添加模式切换逻辑（读取/保存 localStorage，切换 data-theme） |
| `src/bmi.ts` | 不动 |
| `src/ui-utils.ts` | 不动（弹窗样式由 CSS 变量自动适配） |
| `src/router.ts` | 不动 |

## 验收标准

1. 日间模式：浅灰背景、白色卡片、蓝色按钮，无渐变/发光效果
2. 夜间模式：纯黑背景、深灰卡片、蓝色按钮，无渐变/发光效果
3. 导航栏和底部栏有半透明模糊效果，能透出背景
4. 模式切换：默认跟随系统，点击按钮可手动切换，刷新后保持
5. 所有功能正常：计算、历史记录、食品库、BMI、弹窗、抽屉
6. 响应式适配：手机端和桌面端正常显示
