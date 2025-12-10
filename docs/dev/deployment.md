# 🚀 部署指南: GitHub & Cloudflare Pages

您的代码已经准备就绪，并且我已经为您在本地初始化了 Git 仓库。
现在，请按照以下步骤将项目上线。

## 第一步：推送到 GitHub

1. **创建仓库**:
   - 登录 [GitHub](https://github.com)。
   - 点击右上角 **+** -> **New repository**。
   - Repository name 输入: `calorie-calculator` (或者您喜欢的名字)。
   - 保持 Public 或 Private 均可。
   - **不要** 勾选 "Add a README file" 或 .gitignore (我们已经有了)。
   - 点击 **Create repository**。

2. **推送代码**:
   在您的电脑终端（Terminal）或 VS Code 终端中运行以下命令（替换 `your-username` 为您的 GitHub 用户名）：

   ```bash
   # 关联远程仓库
   git remote add origin https://github.com/your-username/calorie-calculator.git
   
   # 推送代码
   git branch -M main
   git push -u origin main
   ```

## 第二步：在 Cloudflare Pages 部署

1. **登录 Cloudflare**:
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录。

2. **创建项目**:
   - 点击左侧菜单的 **Workers & Pages**。
   - 点击 **Create application** -> **Pages** -> **Connect to Git**。

3. **配置构建**:
   - 选择您刚才创建的 GitHub 仓库 (`calorie-calculator`)。
   - 点击 **Begin setup**。
   - 在 **Build settings** 中，Cloudflare 通常会自动检测，但请确认以下设置：
     - **Framework preset**: `Vite`
     - **Build command**: `npm run build`
     - **Output directory**: `dist`
   
4. **完成部署**:
   - 点击 **Save and Deploy**。
   - 等待约 1 分钟，Cloudflare 会自动安装依赖并构建。
   - 构建完成后，您将获得一个类似 `https://calorie-calculator.pages.dev` 的永久访问链接！

## 后续更新
以后如果您修改了代码，只需运行：
```bash
git add .
git commit -m "更新描述"
git push
```
Cloudflare Pages 会自动检测到 GitHub 的变动并自动重新部署，无需手动操作。
