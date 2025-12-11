import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const changelogPath = path.join(rootDir, 'CHANGELOG.md');
const packageJsonPath = path.join(rootDir, 'package.json');
const GITHUB_REPO = 'https://github.com/yukiryo/calorie-calculator';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const TYPE_TO_SECTION = {
    'feat': '### ✨ 新增功能 (Features)',
    'fix': '### 🐛 问题修复 (Bug Fixes)',
    'style': '### 🎨 样式优化 (Styles)',
    'docs': '### 📝 文档更新 (Docs)',
    'refactor': '### ♻️ 代码优化 (Refactoring)',
    'perf': '### ⚡ 性能优化 (Performance)',
    'test': '### ✅ 测试 (Tests)',
    'chore': '### 🔧 杂项 (Chore)'
};

function getTodayDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

async function main() {
    try {
        console.log('🚀 开始自动化推送流程...');

        // 1. 获取 Git 状态，确保有变更
        try {
            const status = execSync('git status --porcelain').toString();
            if (!status) {
                console.log('✨ 没有检测到文件变更，无需提交。');
                process.exit(0);
            }
        } catch (e) {
            console.error('❌ 无法执行 git status');
            process.exit(1);
        }

        // 2. 收集信息
        const message = await question('📝 请输入提交信息 (Commit Message): ');
        if (!message) {
            console.error('❌ 提交信息不能为空');
            process.exit(1);
        }

        let type = '';
        while (!type) {
            const typeInput = (await question('🏷️  请输入变更类型 (feat/fix/docs/style/refactor/perf/test/chore) [默认: chore]: ')).trim() || 'chore';
            if (TYPE_TO_SECTION[typeInput]) {
                type = typeInput;
            } else {
                console.log('❌ 无效的变更类型，请重新输入。');
            }
        }

        const shouldBump = (await question('⬆️  是否升级版本号? (y/n) [默认: n]: ')).toLowerCase() === 'y';

        // 3. 读取并更新数据
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        let version = packageJson.version;

        if (shouldBump) {
            const parts = version.split('.');
            parts[2] = parseInt(parts[2]) + 1; // 简单的 patch 版本升级
            version = parts.join('.');
            packageJson.version = version;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
            console.log(`✅ 版本号已更新为: ${version}`);
        }

        const updateChangelog = (await question('📝 是否自动更新 CHANGELOG.md? (y/n) [默认: y]: ')).toLowerCase() !== 'n';

        if (updateChangelog) {
            let changelogContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : '# 更新日志 (Changelog)\n\n';
            const date = getTodayDate();
            const sectionTitle = TYPE_TO_SECTION[type]; // Guaranteed to exist

            // New format: ## [version] - date (without commit hash)
            const versionHeaderRegex = new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\]\\s*-\\s*${date}`, 'm');

            // Parse message: If "type: subject", strip "type:"
            // Regex to match "type(scope): subject" or "type: subject"
            let keyword = type;
            let description = message;

            const conventionalCommitRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;
            const match = message.match(conventionalCommitRegex);

            if (match) {
                const msgType = match[1];
                const msgScope = match[2]; // Optional scope
                const msgSubject = match[3];

                if (msgType === type) {
                    // Message started with redundant type "feat: ..."
                    keyword = msgScope || msgType; // Use scope as keyword if present, else default to type
                    description = msgSubject;

                    // Optimization: If no scope, try to guess a keyword from subject start?
                    // For now, let's look for "**Keyword**: ..." pattern or just use simple subject
                    if (msgSubject.includes(':')) {
                        const subjectParts = msgSubject.split(':', 2);
                        keyword = subjectParts[0].trim();
                        description = subjectParts[1].trim();
                    } else {
                        // Default keyword: "更新" or something? 
                        // Let's stick to using the commit type or scope as keyword base, 
                        // changing logic to be: 
                        // Entry: - **Keyword/Scope**: Description
                        keyword = msgScope ? msgScope : keyword;
                    }
                }
            } else if (message.includes(':')) {
                // Simple "Keyword: Description" format
                const parts = message.split(':', 2);
                keyword = parts[0].trim();
                description = parts[1].trim();
            }

            const formattedEntryBase = `- **${keyword}**: ${description}`;
            const formattedEntry = formattedEntryBase + ' ([pending](pending))';

            // Check if similar entry exists
            if (changelogContent.includes(formattedEntryBase)) {
                console.log('⚠️  日志中已包含该提交信息，跳过写入。');
            } else {
                const lines = changelogContent.split('\n');
                const existingVersionIndex = lines.findIndex(l => versionHeaderRegex.test(l));

                if (existingVersionIndex === -1) {
                    // No existing version header for today, create new section
                    // Find first version header to insert before
                    const firstVersionIndex = lines.findIndex((l, i) => i > 0 && l.startsWith('## ['));

                    const newSection = [
                        '',
                        `## [${version}] - ${date}`,
                        '',
                        sectionTitle,
                        formattedEntry,
                        ''
                    ];

                    if (firstVersionIndex !== -1) {
                        lines.splice(firstVersionIndex, 0, ...newSection);
                    } else {
                        // No existing versions, append after header
                        lines.push(...newSection);
                    }
                } else {
                    // Existing version header found, add to appropriate section
                    // Find the type section or create one
                    let typeIndex = -1;
                    for (let i = existingVersionIndex + 1; i < lines.length; i++) {
                        if (lines[i].startsWith('## [')) break; // Next version
                        if (lines[i] === sectionTitle) {
                            typeIndex = i;
                            break;
                        }
                    }

                    if (typeIndex !== -1) {
                        // Add under existing type section
                        lines.splice(typeIndex + 1, 0, formattedEntry);
                    } else {
                        // Create new type section after version header
                        // Find where to insert (after last item of current version or after header)
                        let insertIndex = existingVersionIndex + 1;
                        for (let i = existingVersionIndex + 1; i < lines.length; i++) {
                            if (lines[i].startsWith('## [')) break;
                            insertIndex = i + 1;
                        }
                        lines.splice(insertIndex, 0, '', sectionTitle, formattedEntry);
                    }
                }

                changelogContent = lines.join('\n');
                fs.writeFileSync(changelogPath, changelogContent);
                console.log('✅ CHANGELOG.md 已更新 (commit hash 将在提交后填充)');
            }
        } else {
            console.log('⏩ 跳过 CHANGELOG.md 更新');
        }

        // 4. 执行 Git 命令
        console.log('📦 执行 Git 提交...');
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "${type}: ${message}"`, { stdio: 'inherit' });

        // 5. 获取 commit hash 并更新 CHANGELOG
        if (updateChangelog) {
            try {
                const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
                let changelogContent = fs.readFileSync(changelogPath, 'utf-8');
                const commitLink = `[${commitHash}](${GITHUB_REPO}/commit/${commitHash})`;
                changelogContent = changelogContent.replace('([pending](pending))', `(${commitLink})`);
                fs.writeFileSync(changelogPath, changelogContent);

                // Re-add and amend commit
                execSync('git add CHANGELOG.md', { stdio: 'pipe' });
                execSync(`git commit --amend --no-edit`, { stdio: 'pipe' });
                console.log(`✅ CHANGELOG.md 已更新 commit hash: ${commitHash}`);
            } catch (e) {
                console.log('⚠️  无法更新 commit hash');
            }
        }

        console.log('🚀 推送到 GitHub...');
        execSync('git push --force-with-lease', { stdio: 'inherit' });

        console.log('🎉 完成！');

    } catch (error) {
        console.error('❌ 发生错误:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
