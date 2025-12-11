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
   - 是否自动更新 CHANGELOG (y/n)

## 版本号规则

**每次推送都会在 CHANGELOG 中记录**，但版本号按以下规则升级：

| 更新类型 | 版本号处理 | 示例 |
|---------|----------|------|
| **小改动** (文案调整、样式微调) | 保持版本号，追加到当前版本块 | 继续使用 1.0.7 |
| **累积改动** (修复3-5个bug、多个优化) | PATCH +1 | 1.0.7 → 1.0.8 |
| **新功能** (新增功能模块) | MINOR +1 | 1.0.7 → 1.1.0 |
| **破坏性变更** (API重构) | MAJOR +1 | 1.0.7 → 2.0.0 |

## 变更类型映射

commit type 会自动转换为 CHANGELOG 分类：

| Type | CHANGELOG 分类 |
|------|---------------|
| `feat` | `### ✨ 新增功能 (Features)` |
| `fix` | `### 🐛 问题修复 (Bug Fixes)` |
| `style` | `### 🎨 样式优化 (Styles)` |
| `docs` | `### 📝 文档更新 (Docs)` |
| `refactor` | `### ♻️ 代码优化 (Refactoring)` |
| `perf` | `### ⚡ 性能优化 (Performance)` |
| `test` | `### ✅ 测试 (Tests)` |
| `chore` | `### 🔧 杂项 (Chore)` |

## CHANGELOG 格式

版本块格式：`## [版本号] - 日期`

条目格式：`- **关键词**: 描述 ([hash](GitHub链接))`

示例：
```markdown
## [1.0.8] - 2025-12-11

### 🐛 问题修复 (Bug Fixes)
- **登录流程**: 修复验证邮件跳转错误 ([a1b2c3d](https://github.com/yukiryo/calorie-calculator/commit/a1b2c3d))
- **输入框**: 修复自动填充样式问题 ([e4f5g6h](https://github.com/yukiryo/calorie-calculator/commit/e4f5g6h))

### 🎨 样式优化 (Styles)
- **按钮对齐**: 调整云朵图标居中 ([i7j8k9l](https://github.com/yukiryo/calorie-calculator/commit/i7j8k9l))
```

**注意**：commit hash 链接由脚本自动生成，无需手动编辑。

## 手动步骤 (如果不使用脚本)

1. 更新 `CHANGELOG.md`
2. `git add .`
3. `git commit -m "type: message"`
4. `git push`

## README 更新规则

更新 README 时必须同步更新两个语言版本：
- `README.md` (英文)
- `README_zh-CN.md` (中文)

## CONTEXT.md 更新规则

当以下情况发生时，必须更新 `CONTEXT.md`：
- 新增核心功能
- 技术栈变更
- 版本号变更
- 文件结构调整

保持 CONTEXT.md 与项目实际状态同步，方便在新设备/新会话中快速恢复上下文。
