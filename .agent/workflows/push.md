---
description: 推送代码时同步更新 CHANGELOG
---

# 推送代码工作流

每次推送代码更改时，必须同步更新 `CHANGELOG.md`：

## 步骤

1. 完成代码更改
2. 更新 `CHANGELOG.md`：
   - 如果是新版本，添加新的版本号（如 `## [1.0.5] - 日期`）
   - 根据更改类型添加内容：
     - `### ✨ 新增功能 (Features)` - 新功能
     - `### 🐛 修复 (Fixes)` - Bug 修复
     - `### 💄 样式优化` - UI/样式更改
     - `### 🧹 代码清理` - 重构/清理
     - `### 🔧 工程化` - 构建/配置更改
3. 提交所有更改（包括 CHANGELOG.md）
4. 推送到远程仓库

## 示例提交命令

```bash
git add .
git commit -m "feat: 新功能描述"
# 或分开提交
git add src/
git commit -m "feat: 新功能描述"
git add CHANGELOG.md
git commit -m "docs: Update CHANGELOG for vX.X.X"
git push
```
