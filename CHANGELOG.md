# 更新日志 (Changelog)

## [1.0.7] - 2025-12-11

### 📝 文档更新 (Docs)
- **CHANGELOG 规则**: 重写 CHANGELOG 并更新推送规则 ([ca450ac](https://github.com/yukiryo/calorie-calculator/commit/ca450ac))
- **副标题**: 更新为"kJ 和 kcal 之间精准换算" ([1319216](https://github.com/yukiryo/calorie-calculator/commit/1319216))

### 🎨 样式优化 (Styles)
- **云朵图标**: 修复按钮内图标不居中问题，使用标准 viewBox ([04ff15d](https://github.com/yukiryo/calorie-calculator/commit/04ff15d))
- **CHANGELOG**: 修正格式为标准规范 ([04ff15d](https://github.com/yukiryo/calorie-calculator/commit/04ff15d))

### ✨ 新增功能 (Features)
- **版本号显示**: 在页面底部 footer 显示当前应用版本号，随 package.json 自动同步 ([9b33a71](https://github.com/yukiryo/calorie-calculator/commit/9b33a71))

### 🐛 问题修复 (Bug Fixes)
- **修复网页端更新日志链接点击问题**: 修复网页端更新日志链接点击问题 ([9e2b65f](https://github.com/yukiryo/calorie-calculator/commit/9e2b65f))
- **弹窗体验**: 修复了登录/注册成功后云同步设置窗口未关闭的问题 ([e64168a](https://github.com/yukiryo/calorie-calculator/commit/e64168a))
- **注销功能**: 修复了注销按钮点击无反应的问题 ([349d2ee](https://github.com/yukiryo/calorie-calculator/commit/349d2ee))
- **输入干扰**: 修复了摄入量输入框被错误识别为密码框的问题 ([e64168a](https://github.com/yukiryo/calorie-calculator/commit/e64168a))
- **邮件验证**: 修正了注册验证邮件的跳转链接 ([e64168a](https://github.com/yukiryo/calorie-calculator/commit/e64168a))
- **弹窗体验**: 调整所有弹窗的关闭按钮位置至右上角 ([e64168a](https://github.com/yukiryo/calorie-calculator/commit/e64168a))
- **UI 统一**: 统一了云同步设置和登录窗口的按钮颜色与输入框样式 ([ff5a64e](https://github.com/yukiryo/calorie-calculator/commit/ff5a64e))
- **弹窗重构**: 全面替换浏览器原生 alert 弹窗为自定义玻璃拟态弹窗 ([51fe262](https://github.com/yukiryo/calorie-calculator/commit/51fe262))

## [1.0.6] - 2025-12-10

### 🔧 临时修复 (Hotfix)
- **版本号修正**: 修正了前次推送的版本号混乱问题 ([08fd3a3](https://github.com/yukiryo/calorie-calculator/commit/08fd3a3))
- **自动填充**: 紧急修复了浏览器自动填充导致的输入框样式异常 ([08fd3a3](https://github.com/yukiryo/calorie-calculator/commit/08fd3a3))

## [1.0.5] - 2025-12-10

### ✨ 新增功能 (Features)
- **云端同步**: 集成 Supabase 实现多设备数据同步 ([857edd7](https://github.com/yukiryo/calorie-calculator/commit/857edd7))
- **用户认证**: 支持邮箱注册/登录，自动保持登录状态 ([857edd7](https://github.com/yukiryo/calorie-calculator/commit/857edd7))
- **智能合并**: 采用"智能合并"策略，自动保留离线添加的数据 ([857edd7](https://github.com/yukiryo/calorie-calculator/commit/857edd7))
- **UI 优化**: 修复了图标对齐和未登录时的显示状态 ([857edd7](https://github.com/yukiryo/calorie-calculator/commit/857edd7))

## [1.0.4] - 2025-12-10

### ✨ 新增功能 (Features)
- **智能食品库**: 食品库显示单位，点击自动切换模式并填充 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **公式标准化**: 优化底部辅助公式为 `Total kcal = (kJ/100g × Weight) ÷ 418.4` ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **食品库编辑**: 支持编辑已保存的常用食品 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **自定义弹窗**: 毛玻璃风格模态框替代原生弹窗 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **输入限制**: 只允许输入数字和小数点 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))

### 🎨 样式优化 (Styles)
- **食品库抽屉**: 改为底部抽屉模式 (Bottom Sheet) ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))

### 🐛 问题修复 (Bug Fixes)
- **单位显示**: 修复 CSS 大写导致单位显示错误 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **PWA 更新**: 优化 iOS 端更新策略 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **抽屉适配**: 限制电脑端抽屉宽度为 480px ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))

### ♻️ 代码优化 (Refactoring)
- **代码清理**: 移除约 45 行冗余代码 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))
- **逻辑重构**: 提取模式配置为 `MODE_CONFIG` 常量 ([cd5f941](https://github.com/yukiryo/calorie-calculator/commit/cd5f941))

## [1.0.3] - 2025-12-09

### ✨ 新增功能 (Features)
- **一席总计**: 新增"加入记录"功能，支持多次计算累加求和 ([6297513](https://github.com/yukiryo/calorie-calculator/commit/6297513))
- **应用内更新日志**: 页面底部新增更新日志入口 ([6297513](https://github.com/yukiryo/calorie-calculator/commit/6297513))
- **PWA 智能滚动**: 优化滚动体验，解决内容被遮挡问题 ([6297513](https://github.com/yukiryo/calorie-calculator/commit/6297513))
- **Favicon**: 添加浏览器标签页图标 ([6297513](https://github.com/yukiryo/calorie-calculator/commit/6297513))

### 🐛 问题修复 (Bug Fixes)
- **TypeScript**: 修复 `*.md?raw` 导入类型报错 ([6297513](https://github.com/yukiryo/calorie-calculator/commit/6297513))
- **Input 样式**: 修复不同浏览器显示兼容性问题 ([6297513](https://github.com/yukiryo/calorie-calculator/commit/6297513))

## [1.0.2] - 2025-12-08

### 🎨 样式优化 (Styles)
- **移动端适配**: 使用 `100dvh` 解决地址栏遮挡问题

## [1.0.1] - 2025-12-08

### 🐛 问题修复 (Bug Fixes)
- **iOS 图标**: 修复添加到主屏幕时图标显示异常
- **全屏显示**: 修复 iOS Safari 白边问题

## [1.0.0] - 2025-12-08

### ✨ 新增功能 (Features)
- **核心计算**: 支持输入食品重量和能量密度，自动计算总热量
- **单位切换**: 支持 kJ ↔ kcal 双向计算
- **PWA 支持**: 可安装到桌面，离线可用
- **深色模式**: 高级毛玻璃 (Glassmorphism) UI 设计

### 🎨 样式优化 (Styles)
- **响应式设计**: 完美适配桌面端、平板和移动端
- **动态交互**: 输入时自动计算，结果带缩放动画
