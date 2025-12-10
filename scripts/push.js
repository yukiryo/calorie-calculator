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
            // 更新 CHANGELOG.md
            let changelogContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : '# 更新日志 (Changelog)\n\n';

            const date = getTodayDate();
            const header = `## [${version}] - ${date}`;

            // Check if message already exists to verify duplicates
            if (changelogContent.includes(message)) {
                console.log('⚠️  日志中已包含该提交信息，跳过写入。');
            } else {
                if (!changelogContent.includes(header)) {
                    let newEntry = `\n${header}\n\n### ${type}\n- ${message}\n`;
                    // 找到第一个 '## [' 之前插入，或者直接追加到文件头（跳过第一行标题）
                    const lines = changelogContent.split('\n');
                    const versionLineIndex = lines.findIndex((l, i) => i > 0 && l.startsWith('## ['));

                    if (versionLineIndex !== -1) {
                        lines.splice(versionLineIndex, 0, newEntry.trim() + '\n');
                        changelogContent = lines.join('\n');
                    } else {
                        changelogContent += newEntry;
                    }
                } else {
                    // 已存在今天的版本头，尝试追加到对应类型
                    // 简单追加到该版本区块紧接着的一行
                    const regex = new RegExp(`(## \\[${version}\\] - ${date}[\\s\\S]*?)(\\n## \\[|$)`);
                    changelogContent = changelogContent.replace(regex, (match, p1, p2) => {
                        // Check if the type section exists
                        if (p1.includes(`### ${type}`)) {
                            return p1.replace(`### ${type}`, `### ${type}\n- ${message}`) + (p2 || '');
                        } else {
                            // add new type section
                            return `${p1.trim()}\n\n### ${type}\n- ${message}\n\n${p2 || ''}`;
                        }
                    });
                }
                fs.writeFileSync(changelogPath, changelogContent);
                console.log('✅ CHANGELOG.md 已更新');
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
