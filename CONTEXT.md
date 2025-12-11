# 项目上下文 (Project Context)

## 快速恢复

在新设备或新会话中继续工作时，告诉 Agent：

> 继续 calorie-calculator 项目开发，请先阅读 `CONTEXT.md`、`.agent/workflows/push.md` 和 `.cursorrules`。

---

## 项目概述

**卡路里计算器** - 一个现代化的 PWA 应用，用于 kJ/kcal 热量换算。

- **技术栈**: Vite + TypeScript + Vanilla CSS + Supabase (云同步)
- **部署**: Cloudflare Pages
- **仓库**: https://github.com/yukiryo/calorie-calculator

---

## 核心功能

1. **双向热量换算**: kJ ↔ kcal
2. **一席总计**: 累加多条记录计算总热量
3. **常用食品库**: 保存/编辑常用食品，一键填充
4. **云端同步**: Supabase 集成，多设备同步
5. **PWA**: 离线可用，可安装到桌面

---

## 开发规范

详见 `.agent/workflows/push.md` 和 `.cursorrules`，关键规则：

> **Note**: 所有文档（Plan, Task, Walkthrough）必须使用 **中文** 编写。

| 规则 | 说明 |
|-----|-----|
| **版本号** | 小更新不升版本，中等 patch +1，大更新 minor +1 |
| **Changelog 格式** | `## [版本号]（commit hash）- 日期` |
| **README** | 更新时同步 `README.md` 和 `README_zh-CN.md` |
| **推送脚本** | `node scripts/push.js`，可选跳过自动日志更新 |

---

## 文件结构

```
├── src/
│   ├── main.ts          # 主逻辑
│   ├── style.css        # 样式
│   └── supabase.ts      # Supabase 客户端
├── scripts/
│   └── push.js          # 自动化推送脚本
├── .agent/workflows/
│   └── push.md          # 开发规范
├── CHANGELOG.md         # 更新日志
├── README.md            # 英文文档
└── README_zh-CN.md      # 中文文档
```

---

## 当前版本

**1.0.7** - 详见 `CHANGELOG.md`
