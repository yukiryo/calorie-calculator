import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const changelogPath = path.join(rootDir, 'CHANGELOG.md');
const packageJsonPath = path.join(rootDir, 'package.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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

        const type = await question('🏷️  请输入变更类型 (feat/fix/docs/style/refactor/perf/test/chore) [默认: chore]: ') || 'chore';

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
            // Get current commit hash (short)
            let commitHash = '';
            try {
                // Stage changes first to get accurate hash after commit
                execSync('git add .', { stdio: 'pipe' });
                // We'll get the hash after commit, for now use placeholder
                commitHash = 'pending';
            } catch (e) {
                console.log('⚠️  无法获取 commit hash');
            }

            let changelogContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : '# 更新日志 (Changelog)\n\n';
            const date = getTodayDate();

            // New format: ## [version]（hash）- date
            // Match existing version header (with or without hash)
            const versionHeaderRegex = new RegExp(`## \\[${version.replace(/\./g, '\\.')}\\](?:（[a-f0-9]+）)?\\s*-\\s*${date}`);

            // Check if this exact message already exists
            if (changelogContent.includes(`- ${message}`)) {
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
                        `## [${version}]（pending）- ${date}`,
                        '',
                        `### ${type}`,
                        `- ${message}`,
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
                        if (lines[i] === `### ${type}`) {
                            typeIndex = i;
                            break;
                        }
                    }

                    if (typeIndex !== -1) {
                        // Add under existing type section
                        lines.splice(typeIndex + 1, 0, `- ${message}`);
                    } else {
                        // Create new type section after version header
                        // Find where to insert (after last item of current version or after header)
                        let insertIndex = existingVersionIndex + 1;
                        for (let i = existingVersionIndex + 1; i < lines.length; i++) {
                            if (lines[i].startsWith('## [')) break;
                            insertIndex = i + 1;
                        }
                        lines.splice(insertIndex, 0, '', `### ${type}`, `- ${message}`);
                    }
                }

                changelogContent = lines.join('\n');
                fs.writeFileSync(changelogPath, changelogContent);
                console.log('✅ CHANGELOG.md 已更新 (commit hash 将在提交后更新)');
            }
        } else {
            console.log('⏩ 跳过 CHANGELOG.md 更新');
        }

        // 4. 执行 Git 命令
        console.log('📦 执行 Git 提交...');
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "${type}: ${message}"`, { stdio: 'inherit' });

        console.log('🚀 推送到 GitHub...');
        execSync('git push', { stdio: 'inherit' });

        console.log('🎉 完成！');

    } catch (error) {
        console.error('❌ 发生错误:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
