# 🥑 Calorie Calculator

[简体中文](./README_zh-CN.md) | [English](./README.md)

A minimal, modern PWA for precise conversion between **kJ** and **kcal**.

✨ **Live Demo**: [https://calorie-calculator-yukiryo.pages.dev/](https://calorie-calculator-yukiryo.pages.dev/)

## 🚀 Features

### Core
- **Two-way Conversion**: kJ/100g → kcal or kcal/100g → kJ, with automatic total calorie calculation based on intake weight
- **Meal Total**: Add multiple entries to calculate total calorie intake for a meal
- **Food Library**: Save frequently used food energy values for quick access, with edit and delete support

### Tools
- **BMI Calculator**: Enter height and weight to calculate Body Mass Index with WHO standard reference
- **BMI History**: Save recent BMI measurements

### User Experience
- **PWA Support**: Install as a native app on iOS and Android, works offline
- **Light/Dark Mode**: Auto follows system theme, manual toggle available
- **Liquid Glass Design**: Apple-inspired clean UI with translucent nav bar blur
- **Custom Dialogs**: All browser native dialogs replaced with custom modals
- **Responsive Design**: Fluid typography and layout, adapts perfectly to any screen size
- **Privacy First**: All calculations run locally in your browser, no backend dependencies

## 🛠️ Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Pure CSS (CSS Variables, Flexbox, Grid, Clamp)
- **Storage**: localStorage
- **PWA**: vite-plugin-pwa
- **Deployment**: Cloudflare Pages

## 📦 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
git clone https://github.com/yukiryo/calorie-calculator.git
cd calorie-calculator
npm install
```

### Development

Start local development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview production build:

```bash
npm run preview
```

## 🚢 Deployment

This project is optimized for **Cloudflare Pages**.

1. Connect your GitHub repository to Cloudflare Pages
2. Select **Vite** as the build framework preset
3. Deploy!

## 📱 PWA Features

- **Install**: Tap "Add to Home Screen" in your mobile browser to install
- **Offline Support**: Service Worker automatically caches resources, works without network
- **Icons**: High-resolution adaptive icons included in `public/` directory

## 🎨 Design

- **Liquid Glass Design**: Inspired by Apple iOS 26, clean and minimal system-level design language
- **Light/Dark Mode**: Auto-follows system preference with manual toggle
- **Nav Bar Glass Effect**: Translucent blur only on navigation bar, content stays crisp
- **Unified Colors**: Apple system blue (#007aff), consistent border-radius throughout
- **Smooth Animations**: Page transitions, theme switching, sliding toggle controls

## 📁 Project Structure

```
calorie-calculator/
├── public/              # Static assets (icons, etc.)
├── src/
│   ├── main.ts         # Main application logic
│   ├── bmi.ts          # BMI calculator functionality
│   ├── router.ts       # Page routing
│   ├── style.css       # Global styles
│   └── ui-utils.ts     # Custom dialog utilities
├── index.html          # Entry HTML
├── package.json        # Project configuration
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## 👤 Author

**雪凌Yukiryo**
- Telegram: [@Yukiryo](https://t.me/Yukiryo)

## 📄 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

Designed & Developed with ❤️ by Yukiryo.
