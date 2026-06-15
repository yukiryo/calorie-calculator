# 🥑 Calorie Calculator (卡路里计算器)

[简体中文](./README_zh-CN.md) | [English](./README.md)

A modern, minimalist web application to convert food energy values between **kJ** (Kilojoules) and **kcal** (Calories). Designed with a premium Glassmorphism UI and mobile-first approach.

✨ **Live Demo**: [https://calorie-calculator-yukiryo.pages.dev/](https://calorie-calculator-yukiryo.pages.dev/)

## 🚀 Features

- **Bidirectional Conversion**: 
  - Mode 1: Input `kJ/100g` & Weight -> Calculate Total `kcal`.
  - Mode 2: Input `kcal/100g` & Weight -> Calculate Total `kJ`.
- **Meal Total (Grand Total)**: Add multiple items to a history list to calculate the total calorie intake for a full meal.
- **Custom Food Library**: Save frequently used foods with their energy values. Quick-fill with one tap. Supports editing.
- **PWA Support**: Installable as a native app on iOS and Android. Offline capable. Optimized for iOS with immersive status bar and native-like feel.
- **Premium UI**: Dark mode with Glassmorphism effects. Completely custom alerts and modals (no native browser dialogs).
- **Responsive**: Fluid typography and layout that adapts to any screen size.
- **Privacy Focused**: All calculations happen locally in your browser.

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Grid, Clamp)
- **Deployment**: Cloudflare Pages

## 📦 Getting Started

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

Start the local development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

## 🚢 Deployment

This project is optimized for **Cloudflare Pages**.

1. Connect your GitHub repository to Cloudflare Pages.
2. Select **Vite** as the framework preset.
3. Deploy!

## 📄 PWA

This app uses `vite-plugin-pwa` to provide offline capabilities.
- **Icons**: High-resolution adaptive icons in `public/`.
- **Service Worker**: Auto-updating service worker for caching resources.

## 👤 Author

**雪凌Yukiryo**
- Telegram: [@Yukiryo](https://t.me/Yukiryo)

---

Designed & Developed with ❤️ by Yukiryo.
