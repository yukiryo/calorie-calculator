# 🥑 卡路里计算器 (Calorie Calculator)

一个现代化的、极简的 Web 应用，用于在 **千焦 (kJ)** 和 **大卡 (kcal)** 之间进行食品热量换算。专为移动端优先设计，采用高级的毛玻璃 (Glassmorphism) UI 风格。

✨ **在线演示**: [https://calorie-calculator-yukiryo.pages.dev/](https://calorie-calculator-yukiryo.pages.dev/)

## 🚀 功能特性

- **双向换算**:
  - 模式 1: 输入 `kJ/100g` 和重量 -> 计算总 `kcal`。
  - 模式 2: 输入 `kcal/100g` 和重量 -> 计算总 `kJ`。
- **一席总计 (Meal Total)**: 支持添加多条记录，自动计算一顿饭的总热量。
- **☁️ 云端同步**: 通过 Supabase 集成，支持多设备同步常用食品库。支持邮箱注册/登录。
- **常用食品库**: 保存常用食品的能量值，一键填充，支持编辑。
- **PWA 支持**: 可作为原生应用安装到 iOS 和 Android 手机，支持离线使用。针对 iOS 进行了深度优化（沉浸式状态栏，原生般的交互体验）。
- **极致 UI**: 深色模式配合毛玻璃磨砂效果，完全自定义的提示/确认弹窗取代了所有浏览器原生弹窗。
- **响应式设计**: 流体排版和布局，完美适配任何屏幕尺寸。
- **隐私优先**: 所有计算均在本地浏览器中完成。云同步为可选功能。

## 🛠️ 技术栈

- **框架**: [Vite](https://vitejs.dev/)
- **语言**: TypeScript
- **样式**: Vanilla CSS (CSS 变量, Flexbox, Grid, Clamp)
- **后端**: [Supabase](https://supabase.com/) (可选，用于云同步)
- **部署**: Cloudflare Pages

## 📦 快速开始

### 前置要求

- Node.js (v18 或更高版本)
- npm

### 安装

```bash
git clone https://github.com/yukiryo/calorie-calculator.git
cd calorie-calculator
npm install
```

### 开发

启动本地开发服务器：

```bash
npm run dev
```

### 构建

构建生产版本：

```bash
npm run build
```

## 🚢 部署

本项目针对 **Cloudflare Pages** 进行了优化。

1. 将你的 GitHub 仓库连接到 Cloudflare Pages。
2. 选择 **Vite** 作为构建框架预设。
3. 点击部署！

## 📄 PWA 说明

本项目使用 `vite-plugin-pwa` 提供离线能力。
- **图标**: `public/` 目录下包含高分辨率自适应图标。
- **Service Worker**: 自动更新 Service Worker 缓存资源。

## 👤 作者

**雪凌Yukiryo**
- Telegram: [@Yukiryo](https://t.me/Yukiryo)

---

Designed & Developed with ❤️ by Yukiryo.
