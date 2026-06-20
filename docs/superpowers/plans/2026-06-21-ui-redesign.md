# UI 重构实施计划：Liquid Glass 风格

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 calorie-calculator 的 UI 从深紫渐变毛玻璃改为 Apple Liquid Glass 风格，支持日间/夜间双模式。

**Architecture:** CSS 变量驱动配色，`prefers-color-scheme` 自动切换 + `data-theme` 手动覆盖。重写 `style.css` 全部配色，`index.html` 加导航栏结构和模式切换按钮，`main.ts` 加切换逻辑。

**Tech Stack:** 纯 CSS（CSS Variables, Flexbox）、TypeScript、Vite

## Global Constraints

- 字体保持 `Outfit` 不变
- 功能逻辑不动（计算、历史、食品库、BMI、弹窗、路由）
- 响应式适配保持现有断点
- 不引入新依赖

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/style.css` | 重写 | 全部配色改为 CSS 变量，移除渐变/发光/浮动动画 |
| `index.html` | 修改 | 移除 body inline style，导航栏加 `.nav-bar` 结构，加模式切换按钮 |
| `src/main.ts` | 修改 | 添加模式切换逻辑 |
| `src/bmi.ts` | 不动 | |
| `src/ui-utils.ts` | 不动 | |
| `src/router.ts` | 不动 | |

---

### Task 1: CSS 变量体系 + 基础重置

**Files:**
- Modify: `src/style.css:1-10`（替换 `:root` 变量定义）

**说明：** 建立整套 CSS 变量，日间为默认值，`prefers-color-scheme: dark` 覆盖为夜间值，`[data-theme]` 手动覆盖。

- [ ] **Step 1: 替换 `:root` 变量**

将 `src/style.css` 开头的 `:root` 块替换为：

```css
:root {
  --bg: #f2f2f7;
  --card: #ffffff;
  --card-border: rgba(0, 0, 0, 0.04);
  --text-primary: #1d1d1f;
  --text-secondary: #8e8e93;
  --text-placeholder: rgba(148, 163, 184, 0.5);
  --nav-bg: rgba(242, 242, 247, 0.8);
  --nav-border: rgba(0, 0, 0, 0.06);
  --accent: #007aff;
  --accent-hover: rgba(0, 122, 255, 0.85);
  --toggle-bg: #e5e5ea;
  --toggle-active: #ffffff;
  --toggle-text: #8e8e93;
  --toggle-active-text: #1d1d1f;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  --divider: rgba(0, 0, 0, 0.06);
  --danger: #ff3b30;
  --danger-bg: rgba(255, 59, 48, 0.1);
  --success: #34c759;
  --success-bg: rgba(52, 199, 89, 0.15);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --card: #1c1c1e;
    --card-border: rgba(255, 255, 255, 0.05);
    --text-primary: #f5f5f7;
    --text-secondary: #636366;
    --text-placeholder: rgba(148, 163, 184, 0.3);
    --nav-bg: rgba(28, 28, 30, 0.8);
    --nav-border: rgba(255, 255, 255, 0.06);
    --accent: #0a84ff;
    --accent-hover: rgba(10, 132, 255, 0.85);
    --toggle-bg: #2c2c2e;
    --toggle-active: #3a3a3c;
    --toggle-text: #636366;
    --toggle-active-text: #f5f5f7;
    --card-shadow: none;
    --divider: rgba(255, 255, 255, 0.06);
    --danger: #ff453a;
    --danger-bg: rgba(255, 69, 58, 0.15);
    --success: #30d158;
    --success-bg: rgba(48, 209, 88, 0.15);
  }
}

[data-theme="light"] {
  --bg: #f2f2f7;
  --card: #ffffff;
  --card-border: rgba(0, 0, 0, 0.04);
  --text-primary: #1d1d1f;
  --text-secondary: #8e8e93;
  --text-placeholder: rgba(148, 163, 184, 0.5);
  --nav-bg: rgba(242, 242, 247, 0.8);
  --nav-border: rgba(0, 0, 0, 0.06);
  --accent: #007aff;
  --accent-hover: rgba(0, 122, 255, 0.85);
  --toggle-bg: #e5e5ea;
  --toggle-active: #ffffff;
  --toggle-text: #8e8e93;
  --toggle-active-text: #1d1d1f;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  --divider: rgba(0, 0, 0, 0.06);
  --danger: #ff3b30;
  --danger-bg: rgba(255, 59, 48, 0.1);
  --success: #34c759;
  --success-bg: rgba(52, 199, 89, 0.15);
}

[data-theme="dark"] {
  --bg: #000000;
  --card: #1c1c1e;
  --card-border: rgba(255, 255, 255, 0.05);
  --text-primary: #f5f5f7;
  --text-secondary: #636366;
  --text-placeholder: rgba(148, 163, 184, 0.3);
  --nav-bg: rgba(28, 28, 30, 0.8);
  --nav-border: rgba(255, 255, 255, 0.06);
  --accent: #0a84ff;
  --accent-hover: rgba(10, 132, 255, 0.85);
  --toggle-bg: #2c2c2e;
  --toggle-active: #3a3a3c;
  --toggle-text: #636366;
  --toggle-active-text: #f5f5f7;
  --card-shadow: none;
  --divider: rgba(255, 255, 255, 0.06);
  --danger: #ff453a;
  --danger-bg: rgba(255, 69, 58, 0.15);
  --success: #30d158;
  --success-bg: rgba(48, 209, 88, 0.15);
}
```

- [ ] **Step 2: 验证**

运行 `npm run dev`，打开浏览器。页面应该已经变成浅灰色背景（日间模式默认值生效）。

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): add CSS variable system with light/dark mode tokens"
```

---

### Task 2: 重写全局基础样式

**Files:**
- Modify: `src/style.css`（`body`, `#app`, `.view`, `.back-btn`, `.glass-container` 等基础类）

**说明：** 用 CSS 变量替换所有硬编码颜色，移除深紫渐变背景、毛玻璃效果、浮动动画。

- [ ] **Step 1: 重写 body 和全局重置**

替换 `src/style.css` 中的 `html`、`body`、`#app` 样式：

```css
html {
  overscroll-behavior-y: none;
}

body {
  font-family: 'Outfit', system-ui, -apple-system, sans-serif;
  color: var(--text-primary);
  background: var(--bg);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: max(clamp(1rem, 5vw, 2rem), env(safe-area-inset-top));
  padding-bottom: max(clamp(1rem, 5vw, 2rem), env(safe-area-inset-bottom));
  padding-left: max(clamp(1rem, 5vw, 2rem), env(safe-area-inset-left));
  padding-right: max(clamp(1rem, 5vw, 2rem), env(safe-area-inset-right));
}

#app {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}
```

- [ ] **Step 2: 重写视图系统和玻璃容器**

替换 `.view`、`.back-btn`、`.glass-container`：

```css
.view {
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  width: 100%;
}

.view.active {
  display: block;
  opacity: 1;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--divider);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--card);
  color: var(--text-primary);
}

.glass-container {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: clamp(16px, 5vw, 24px);
  padding: clamp(1.5rem, 5vw, 2.5rem);
  box-shadow: var(--card-shadow);
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  opacity: 1;
  transform: none;
  animation: none;
}
```

- [ ] **Step 3: 验证**

`npm run dev`，确认页面背景为浅灰，容器为白色卡片，无浮动动画。

- [ ] **Step 4: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite global base styles with CSS variables"
```

---

### Task 3: 重写导航栏和标题

**Files:**
- Modify: `src/style.css`（`header`, `.header-content`, `.title-group`, `h1`, `.subtitle`, `.header-actions`, `.icon-btn`）
- Modify: `index.html:25-43`（导航栏结构加 `.nav-bar` 包裹）

**说明：** 导航栏加半透明模糊背景，标题去掉渐变色。

- [ ] **Step 1: 修改 index.html 导航栏结构**

将 `index.html` 中 main-view 的 header 部分改为：

```html
<header class="nav-bar">
  <div class="header-content">
    <div class="title-group">
      <h1>卡路里计算器</h1>
      <p class="subtitle">kJ 和 kcal 之间精准换算</p>
    </div>
    <div class="header-actions">
      <button id="theme-toggle-btn" class="icon-btn" aria-label="切换主题">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="theme-icon-light">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="theme-icon-dark" style="display:none;">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
      <button id="tools-btn" class="icon-btn" aria-label="工具箱">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="9" height="9" rx="2"></rect>
          <rect x="13" y="2" width="9" height="9" rx="2"></rect>
          <rect x="2" y="13" width="9" height="9" rx="2"></rect>
          <rect x="13" y="13" width="9" height="9" rx="2"></rect>
        </svg>
      </button>
    </div>
  </div>
</header>
```

- [ ] **Step 2: 重写导航栏 CSS**

替换 `src/style.css` 中的 `header`、`.header-content`、`.title-group`、`h1`、`.subtitle`、`.header-actions`、`.icon-btn` 样式：

```css
.nav-bar {
  background: var(--nav-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid var(--nav-border);
  margin: calc(clamp(1rem, 5vw, 2rem) * -1);
  margin-bottom: clamp(1.5rem, 5vw, 2.5rem);
  padding: 0.75rem clamp(1.5rem, 5vw, 2.5rem);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.title-group {
  text-align: left;
}

h1 {
  font-size: clamp(1.5rem, 5vw, 1.8rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  font-weight: 400;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--divider);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: var(--card);
  color: var(--text-primary);
}
```

- [ ] **Step 3: 验证**

`npm run dev`，确认导航栏有半透明模糊效果，标题为纯色，右侧有主题切换和工具箱按钮。

- [ ] **Step 4: Commit**

```bash
git add src/style.css index.html
git commit -m "refactor(css): rewrite nav bar with glass effect and theme toggle"
```

---

### Task 4: 重写输入框和 Toggle 按钮

**Files:**
- Modify: `src/style.css`（`.mode-toggle-wrapper`、`.mode-toggle`、`.input-group`、`label`、`.input-wrapper`、`input`、`.unit`、`.save-btn`、`.drawer-trigger`）

- [ ] **Step 1: 重写 Toggle 按钮**

替换 `.mode-toggle-wrapper`、`.mode-toggle`、`.toggle-icon`：

```css
.mode-toggle-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.mode-toggle {
  background: var(--toggle-bg);
  border: none;
  border-radius: 9px;
  padding: 3px;
  color: var(--toggle-text);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.mode-toggle:hover {
  opacity: 0.85;
}

.toggle-text {
  background: var(--toggle-active);
  color: var(--toggle-active-text);
  padding: 5px 14px;
  border-radius: 7px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.toggle-icon {
  width: 1.1em;
  height: 1.1em;
  opacity: 0.6;
}
```

- [ ] **Step 2: 重写输入框**

替换 `.input-group`、`label`、`.input-wrapper`、`input`、`.unit`、`.save-btn`、`.drawer-trigger`：

```css
.input-group {
  margin-bottom: clamp(0.8rem, 3vw, 1.2rem);
}

label {
  display: block;
  margin-bottom: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.input-wrapper {
  position: relative;
}

.input-wrapper:focus-within {
  /* no scale effect - keep it subtle */
}

input {
  width: 100%;
  padding: 0.85rem 3rem 0.85rem 1rem;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  box-shadow: var(--card-shadow);
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);
}

input::placeholder {
  color: var(--text-placeholder);
}

.unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  pointer-events: none;
}

.save-btn {
  position: absolute;
  right: 2.6rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn:hover {
  color: var(--accent);
}

.drawer-trigger {
  width: 100%;
  margin-top: 0.6rem;
  background: transparent;
  border: 1px dashed var(--divider);
  color: var(--text-secondary);
  padding: 0.55rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-family: inherit;
  transition: all 0.2s;
}

.drawer-trigger:hover {
  background: var(--card);
  color: var(--text-primary);
}
```

- [ ] **Step 3: 验证**

`npm run dev`，确认输入框为白色卡片样式，toggle 为 iOS segmented control 风格，focus 状态有蓝色边框。

- [ ] **Step 4: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite input fields and toggle button"
```

---

### Task 5: 重写结果卡片和操作按钮

**Files:**
- Modify: `src/style.css`（`.result-card`、`.result-label`、`.result-value-wrapper`、`#result-value`、`.result-unit`、`.formula-container`、`.formula-hint`、`.action-buttons`、`.action-btn`、`.add-btn`）

- [ ] **Step 1: 重写结果卡片**

替换 `.result-card`、`.result-card::before`、`.result-label`、`.result-value-wrapper`、`#result-value, #bmi-value`、`.result-unit`、`.formula-container`、`.formula-hint`：

```css
.result-card {
  margin-top: clamp(1rem, 4vw, 1.5rem);
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: clamp(1rem, 4vw, 1.5rem);
  text-align: center;
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
}

.result-card::before {
  display: none;
}

.result-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.result-value-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

#result-value,
#bmi-value {
  font-size: clamp(2.5rem, 10vw, 3.5rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.result-unit {
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: var(--accent);
  font-weight: 600;
}

.formula-container {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.formula-hint {
  font-size: clamp(0.6rem, 2.5vw, 0.7rem);
  color: var(--text-secondary);
  font-family: monospace;
  margin: 0;
  word-break: break-all;
  opacity: 0.7;
}
```

- [ ] **Step 2: 重写操作按钮**

替换 `.action-buttons`、`.action-btn`、`.add-btn`：

```css
.action-buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.action-btn {
  background: var(--accent);
  border: none;
  color: white;
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--accent-hover);
}

.action-btn:active {
  transform: scale(0.97);
}

.add-btn {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  box-shadow: none;
}

.add-btn:hover {
  background: var(--accent);
  color: white;
}
```

- [ ] **Step 3: 验证**

`npm run dev`，确认结果卡片为白色，数字为黑色，按钮为蓝色。

- [ ] **Step 4: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite result card and action buttons"
```

---

### Task 6: 重写历史记录和总计

**Files:**
- Modify: `src/style.css`（`.history-section`、`.history-header`、`.clear-btn`、`.history-list`、`.history-item`、`.item-info`、`.item-weight`、`.item-energy`、`.item-result`、`.delete-item-btn`、`.grand-total`）

- [ ] **Step 1: 重写历史记录样式**

替换所有历史记录相关样式：

```css
.history-section {
  margin-top: 1.5rem;
  border-top: 1px solid var(--divider);
  padding-top: 1.2rem;
}

.history-section.hidden {
  display: none;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.history-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: inherit;
}

.clear-btn:hover {
  color: var(--danger);
  background: var(--danger-bg);
}

.history-list {
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.8rem;
  scrollbar-width: thin;
}

.history-list::-webkit-scrollbar {
  width: 4px;
}

.history-list::-webkit-scrollbar-thumb {
  background: var(--divider);
  border-radius: 4px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.75rem;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  margin-bottom: 0.4rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  text-align: left;
}

.item-weight {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.item-energy {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.item-result {
  font-weight: 700;
  color: var(--accent);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.delete-item-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.2rem;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.delete-item-btn:hover {
  opacity: 1;
  color: var(--danger);
}

.grand-total {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: var(--card-shadow);
}

.grand-total span:nth-child(2) {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--accent);
}
```

- [ ] **Step 2: 验证**

添加几条记录后确认历史项为白色卡片，删除按钮 hover 变红，总计数字为蓝色。

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite history section and grand total"
```

---

### Task 7: 重写抽屉（Drawer）

**Files:**
- Modify: `src/style.css`（`.drawer-overlay`、`.drawer-content`、`.drawer-header`、`.drawer-body`、`.empty-state`、`.food-chip`、`.chip-energy`、`.delete-chip-btn`、`.edit-chip-btn`）

- [ ] **Step 1: 重写抽屉样式**

替换所有抽屉相关样式：

```css
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.drawer-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.drawer-content {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 1.5rem;
  transform: translateX(-50%) translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  animation: none;
  opacity: 1;
}

.drawer-overlay.active .drawer-content {
  transform: translateX(-50%) translateY(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--divider);
}

.drawer-header h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.drawer-body {
  overflow-y: auto;
  padding-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.6rem;
  max-height: 60vh;
}

.empty-state {
  width: 100%;
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem 0;
  font-size: 0.9rem;
}

.food-chip {
  flex: 0 0 auto;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  user-select: none;
}

.food-chip:hover {
  border-color: var(--accent);
}

.food-chip:active {
  transform: scale(0.97);
}

.chip-energy {
  font-weight: 600;
  color: var(--accent);
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.chip-energy small {
  font-size: 0.75em;
  font-weight: 400;
  color: var(--text-secondary);
}

.delete-chip-btn,
.edit-chip-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  opacity: 0.4;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.edit-chip-btn:hover {
  opacity: 1;
  color: var(--accent);
}

.delete-chip-btn:hover {
  opacity: 1;
  color: var(--danger);
}
```

- [ ] **Step 2: 验证**

打开常用食品库抽屉，确认背景为白色，chip 为卡片样式，遮罩为半透明黑色。

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite drawer and food chip styles"
```

---

### Task 8: 重写弹窗（Modal）和自定义对话框

**Files:**
- Modify: `src/style.css`（`.modal`、`.modal-content`、`.modal-header`、`.close-btn`、`.prompt-modal`、`.prompt-title`、`.prompt-input`、`.prompt-actions`、`.prompt-btn`、`#changelog-content`、`.markdown-body`）

- [ ] **Step 1: 重写弹窗样式**

替换所有 modal 和 prompt 相关样式：

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex !important;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0s linear 0.3s;
}

.modal.active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 0.3s ease, visibility 0s linear 0s;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--card-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}

.modal.active .modal-content {
  transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--divider);
}

.modal-header h2,
.modal-header h3 {
  font-size: 1.15rem;
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background: var(--toggle-bg);
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: var(--danger-bg);
  color: var(--danger);
}

.prompt-modal {
  max-width: 350px;
  padding: 1.5rem;
  align-items: center;
  text-align: center;
}

.prompt-title {
  margin: 0 0 1.2rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.prompt-input {
  width: 100%;
  margin-bottom: 1.2rem;
  text-align: center;
  font-size: 1rem;
  padding: 0.85rem;
  background: var(--bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  color: var(--text-primary);
  transition: all 0.2s;
  font-family: inherit;
  outline: none;
}

.prompt-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);
}

.prompt-actions {
  display: flex;
  gap: 0.8rem;
  width: 100%;
}

.prompt-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.prompt-btn.cancel {
  background: var(--toggle-bg);
  color: var(--text-secondary);
}

.prompt-btn.cancel:hover {
  background: var(--divider);
  color: var(--text-primary);
}

.prompt-btn.confirm {
  background: var(--accent);
  color: white;
}

.prompt-btn.confirm:hover {
  background: var(--accent-hover);
}

.prompt-btn.delete-confirm {
  background: var(--danger);
}

.prompt-btn.delete-confirm:hover {
  opacity: 0.85;
}

.prompt-btn:active {
  transform: scale(0.97);
}

#changelog-content {
  overflow-y: auto;
  padding-right: 0.5rem;
  text-align: left;
}

#changelog-content::-webkit-scrollbar {
  width: 4px;
}

#changelog-content::-webkit-scrollbar-thumb {
  background: var(--divider);
  border-radius: 4px;
}

.markdown-body h2 {
  font-size: 1rem;
  color: var(--accent);
  margin-top: 1.2rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid var(--divider);
  padding-bottom: 0.25rem;
}

.markdown-body h2:first-child {
  margin-top: 0;
}

.markdown-body h3 {
  font-size: 0.9rem;
  color: var(--text-primary);
  margin-top: 0.8rem;
  margin-bottom: 0.4rem;
}

.markdown-body ul {
  padding-left: 1.2rem;
  margin-bottom: 0.5rem;
}

.markdown-body li {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.2rem;
  line-height: 1.5;
}

.markdown-body strong {
  color: var(--text-primary);
  font-weight: 600;
}

#changelog-content a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dotted var(--accent);
  transition: all 0.2s;
}

#changelog-content a:hover {
  opacity: 0.8;
  border-bottom-style: solid;
}
```

- [ ] **Step 2: 验证**

打开更新日志弹窗、保存食品弹窗、确认删除弹窗，确认白色背景、蓝色按钮。

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite modals and custom dialogs"
```

---

### Task 9: 重写 BMI 视图样式

**Files:**
- Modify: `src/style.css`（`.bmi-reference-table`、`.bmi-ref-row`、`.bmi-col-status`、`.bmi-col-range`、`.status-indicator`、`.text-thin`、`.text-normal`、`.text-overweight`、`.text-obese`）

- [ ] **Step 1: 重写 BMI 样式**

替换 BMI 相关样式：

```css
.bmi-reference-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-size: 0.85rem;
  background: var(--card);
  border: 1px solid var(--card-border);
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.bmi-ref-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--divider);
}

.bmi-ref-row:last-child {
  border-bottom: none;
}

.bmi-ref-row.header {
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1.5px solid var(--divider);
  padding-bottom: 0.5rem;
  margin-bottom: 0.15rem;
}

.bmi-col-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 70px;
}

.bmi-col-range {
  text-align: right;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.thin { background-color: #5ac8fa; }
.status-indicator.normal { background-color: #34c759; }
.status-indicator.overweight { background-color: #ff9500; }
.status-indicator.obese { background-color: #ff3b30; }

.text-thin { color: #5ac8fa !important; }
.text-normal { color: #34c759 !important; }
.text-overweight { color: #ff9500 !important; }
.text-obese { color: #ff3b30 !important; }
```

- [ ] **Step 2: 验证**

切换到 BMI 视图，确认参考表格为白色卡片，状态指示器颜色正确。

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite BMI view styles"
```

---

### Task 10: 重写 Footer 和动画

**Files:**
- Modify: `src/style.css`（`footer`、`.footer-links`、`.app-version`、`.text-btn`、`.divider`、`.author-name`、`.shake`、`@keyframes shake`、`@keyframes floatIn`、响应式媒体查询、PWA standalone 模式）

- [ ] **Step 1: 重写 Footer**

替换 footer 相关样式：

```css
footer {
  margin-top: clamp(1.2rem, 3vw, 1.5rem);
  border-top: 1px solid var(--divider);
  padding-top: clamp(0.8rem, 2vw, 1rem);
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.app-version {
  color: var(--text-secondary);
  font-size: 0.7rem;
  opacity: 0.6;
  font-weight: 500;
}

.text-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  font-family: inherit;
}

.text-btn:hover {
  color: var(--accent);
}

.divider {
  opacity: 0.3;
}

.author-name {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.3s ease;
  display: inline-block;
}

.author-name:hover {
  opacity: 0.8;
}
```

- [ ] **Step 2: 清理动画和响应式**

删除 `.shake` 动画和 `@keyframes shake`，删除 `@keyframes floatIn`，更新响应式和 PWA standalone 样式：

```css
/* 移除 floatIn 和 shake 动画定义 */
/* 保留 shake class 但改为简单实现 */
.shake {
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

/* Number input reset */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Extra small devices */
@media (max-width: 350px) {
  body { padding: 10px; }
  .glass-container { padding: 1rem; }
  input { padding: 0.7rem 2.5rem 0.7rem 0.7rem; font-size: 0.95rem; }
}

/* PWA standalone mode */
@media all and (display-mode: standalone) {
  html, body {
    overflow: hidden;
    overscroll-behavior: none;
    height: 100%;
    height: -webkit-fill-available;
  }

  html { background: var(--bg); }

  body { background: transparent; }

  #app {
    height: 100%;
    height: -webkit-fill-available;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1rem, env(safe-area-inset-top));
    padding-bottom: 0;
  }

  #app::after {
    content: '';
    display: block;
    height: max(2rem, env(safe-area-inset-bottom));
    width: 100%;
    flex-shrink: 0;
  }

  body { background: transparent; padding: 0; }
}
```

- [ ] **Step 3: 删除残留的旧样式**

确保 `style.css` 中没有残留的旧样式（紫色渐变 `#6366f1`、`#a855f7`、`rgba(99, 102, 241, ...)` 等）。

- [ ] **Step 4: 验证**

`npm run dev`，完整浏览所有页面，确认无残留旧样式。

- [ ] **Step 5: Commit**

```bash
git add src/style.css
git commit -m "refactor(css): rewrite footer, cleanup animations, update responsive styles"
```

---

### Task 11: 实现主题切换逻辑

**Files:**
- Modify: `src/main.ts`（添加主题切换模块）
- Modify: `index.html:20`（移除 body 的 inline style）

**说明：** 读取 localStorage 中保存的主题偏好，切换 `<html>` 的 `data-theme` 属性。

- [ ] **Step 1: 移除 index.html body inline style**

将 `index.html` 第 20 行的：
```html
<body style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); background-attachment: fixed;">
```
改为：
```html
<body>
```

- [ ] **Step 2: 添加主题切换逻辑到 main.ts**

在 `src/main.ts` 的 imports 之后、`new BMICalculator()` 之前，添加：

```typescript
// Theme Toggle
const THEME_KEY = 'calorie-calculator-theme';
type ThemePreference = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(preference: ThemePreference) {
  const html = document.documentElement;
  if (preference === 'system') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', preference);
  }
  updateThemeIcon(preference === 'system' ? getSystemTheme() : preference);
}

function updateThemeIcon(resolvedTheme: 'light' | 'dark') {
  const lightIcon = document.querySelector('.theme-icon-light') as HTMLElement;
  const darkIcon = document.querySelector('.theme-icon-dark') as HTMLElement;
  if (lightIcon && darkIcon) {
    lightIcon.style.display = resolvedTheme === 'light' ? 'block' : 'none';
    darkIcon.style.display = resolvedTheme === 'dark' ? 'block' : 'none';
  }
}

function cycleTheme() {
  const current = (localStorage.getItem(THEME_KEY) as ThemePreference) || 'system';
  const cycle: ThemePreference[] = ['system', 'light', 'dark'];
  const nextIndex = (cycle.indexOf(current) + 1) % cycle.length;
  const next = cycle[nextIndex];
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// Initialize theme
const savedTheme = (localStorage.getItem(THEME_KEY) as ThemePreference) || 'system';
applyTheme(savedTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const saved = localStorage.getItem(THEME_KEY) as ThemePreference;
  if (!saved || saved === 'system') {
    updateThemeIcon(getSystemTheme());
  }
});

// Theme toggle button
const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', cycleTheme);
}
```

- [ ] **Step 3: 验证**

1. `npm run dev`，确认页面默认跟随系统主题
2. 点击太阳/月亮图标，确认切换为日间 → 夜间 → 跟随系统
3. 刷新页面，确认上次选择的主题被保留
4. 检查 `<html>` 的 `data-theme` 属性是否正确切换

- [ ] **Step 4: Commit**

```bash
git add src/main.ts index.html
git commit -m "feat: add theme toggle with system preference + manual override"
```

---

### Task 12: BMI 视图导航栏适配

**Files:**
- Modify: `index.html:144-160`（BMI view header 结构）

**说明：** BMI 视图的 header 也需要用 `.nav-bar` 包裹，保持一致的半透明导航栏效果。

- [ ] **Step 1: 修改 BMI view header**

将 BMI view 的 header 改为：

```html
<header class="nav-bar">
  <div class="header-content">
    <button id="back-btn" class="back-btn" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      返回
    </button>
    <div class="title-group" style="text-align: center; flex: 1;">
      <h1 style="font-size: 1.3rem;">BMI 计算器</h1>
      <p class="subtitle">身体质量指数计算</p>
    </div>
    <div style="width: 40px;"></div>
  </div>
</header>
```

- [ ] **Step 2: 验证**

切换到 BMI 视图，确认导航栏有半透明模糊效果，返回按钮正常工作。

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "refactor(html): apply nav-bar structure to BMI view"
```

---

### Task 13: 最终验证和清理

**Files:**
- Modify: `src/style.css`（清理任何残留）
- Modify: `index.html`（检查完整性）

**说明：** 完整走一遍所有功能，确保没有遗漏。

- [ ] **Step 1: 功能走查**

按以下清单逐项验证：

1. ☐ 日间模式下，页面背景为浅灰 `#f2f2f7`
2. ☐ 夜间模式下，页面背景为纯黑
3. ☐ 导航栏有半透明模糊效果
4. ☐ 输入框为白色/深灰卡片，focus 有蓝色边框
5. ☐ Toggle 按钮为 iOS segmented control 风格
6. ☐ 结果卡片为实色，数字无渐变
7. ☐ 主按钮为蓝色（无渐变/发光）
8. ☐ 历史记录项为白色/深灰卡片
9. ☐ 抽屉背景为白色/深灰
10. ☐ 弹窗背景为白色/深灰
11. ☐ BMI 参考表格为白色/深灰卡片
12. ☐ Footer 链接为蓝色
13. ☐ 模式切换：点击图标循环 system → light → dark → system
14. ☐ 刷新后主题偏好保持
15. ☐ 所有功能正常：计算、加入记录、清空、保存食品、编辑食品、删除食品、BMI 计算、保存 BMI

- [ ] **Step 2: 搜索残留旧样式**

在 `src/style.css` 中搜索以下关键词，确保全部清除：
- `#6366f1`
- `#a855f7`
- `linear-gradient(135deg`
- `text-shadow`
- `perspective: 1000px`
- `floatIn`

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "refactor(ui): complete Liquid Glass redesign with light/dark mode

- Replace dark purple gradient with system-adaptive color scheme
- Add CSS variable system with prefers-color-scheme + data-theme override
- Glass effect only on nav bar and bottom bar (content uses solid cards)
- Apple system colors: #007aff/#0a84ff for accent
- Remove all AI-generated effects: gradients, glow, float animations
- Add theme toggle button with 3-state cycle (system/light/dark)"
```
