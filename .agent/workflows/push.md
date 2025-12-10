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
