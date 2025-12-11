---
description: 推送代码时同步更新 CHANGELOG
---

# 推送代码工作流

推荐使用自动化脚本进行推送，它会自动处理 CHANGELOG 和版本号。

## 自动化步骤

1. 在终端运行：
   ```bash
   node scripts/push.js
   ```
2. 按照提示输入：
   - 提交信息 (Commit Message)
   - 变更类型 (Type)
   - 是否升级版本号 (y/n)
   - **(新)** 是否自动更新 CHANGELOG (y/n) - *如果手动编辑过日志，请选 n*

## 手动步骤 (如果不使用脚本)

1. 更新 `CHANGELOG.md`
2. `git add .`
3. `git commit -m "type: message"`
4. `git push`

## 版本号规则

根据更新大小自动判断是否升级版本号：

| 更新类型 | 处理方式 | 示例 |
|---------|---------|------|
| **小更新** (样式微调、typo修复) | 只记录 commit hash，不升版本 | `1.0.7（e64168a）` |
| **中等更新** (bug 修复、小功能增强) | patch 版本 +1 | `1.0.7 → 1.0.8` |
| **大更新** (新功能) | minor 版本 +1 | `1.0.7 → 1.1.0` |

## 更新日志格式

版本标题格式：`## [版本号]（commit hash）- 日期`

示例：`## [1.0.7]（e64168a）- 2025-12-11`

## README 更新规则

更新 README 时必须同步更新两个语言版本：
- `README.md` (英文)
- `README_zh-CN.md` (中文)
