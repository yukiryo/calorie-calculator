# 🥑 卡路里计算器

[简体中文](./README_zh-CN.md) | [English](./README.md)

一个极简、现代的卡路里换算 PWA 应用，专注于 **kJ** 和 **kcal** 之间的精准转换。

✨ **在线演示**: [https://calorie-calculator-yukiryo.pages.dev/](https://calorie-calculator-yukiryo.pages.dev/)

## 🚀 功能特性

### 核心功能
- **双向换算**: kJ/100g → kcal 或 kcal/100g → kJ，根据摄入重量自动计算总热量
- **餐食总计**: 支持添加多条记录，自动计算一顿饭的总热量摄入
- **常用食品库**: 保存常用食品的能量值，一键填充，支持编辑和删除

### 工具箱
- **BMI 计算器**: 输入身高体重，计算身体质量指数，提供 WHO 标准参考
- **BMI 历史记录**: 保存最近的 BMI 测量记录

### 用户体验
- **PWA 支持**: 可作为原生应用安装到 iOS 和 Android，支持离线使用
- **极致 UI**: 深色模式配合毛玻璃磨砂效果
- **完全自定义弹窗**: 取代所有浏览器原生对话框
- **响应式设计**: 流体排版和布局，完美适配任何屏幕尺寸
- **隐私优先**: 所有计算均在本地浏览器中完成，无任何后端依赖

## 🛠️ 技术栈

- **构建工具**: [Vite](https://vitejs.dev/)
- **开发语言**: TypeScript
- **样式方案**: 纯 CSS（CSS 变量、Flexbox、Grid、Clamp）
- **存储方式**: localStorage 本地存储
- **PWA 支持**: vite-plugin-pwa
- **部署平台**: Cloudflare Pages

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

### 预览

预览生产构建：

```bash
npm run preview
```

## 🚢 部署

本项目针对 **Cloudflare Pages** 进行了优化。

1. 将你的 GitHub 仓库连接到 Cloudflare Pages
2. 选择 **Vite** 作为构建框架预设
3. 点击部署！

## 📱 PWA 功能

- **安装**: 在移动端浏览器中点击"添加到主屏幕"即可安装
- **离线支持**: Service Worker 自动缓存资源，无网络也能使用
- **图标**: `public/` 目录下包含高分辨率自适应图标

## 🎨 设计特点

- **毛玻璃效果**: 半透明背景配合模糊滤镜，营造现代感
- **深色主题**: 专为夜间使用优化，减少眼睛疲劳
- **流畅动画**: 所有交互都带有平滑的过渡效果
- **自定义弹窗**: 完全重写的提示、确认、输入弹窗

## 📁 项目结构

```
calorie-calculator/
├── public/              # 静态资源（图标等）
├── src/
│   ├── main.ts         # 主应用逻辑
│   ├── bmi.ts          # BMI 计算器功能
│   ├── router.ts       # 页面路由
│   ├── style.css       # 全局样式
│   └── ui-utils.ts     # 自定义弹窗工具
├── index.html          # 入口 HTML
├── package.json        # 项目配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript 配置
```

## 👤 作者

**雪凌Yukiryo**
- Telegram: [@Yukiryo](https://t.me/Yukiryo)

## 📄 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

---

Designed & Developed with ❤️ by Yukiryo.
