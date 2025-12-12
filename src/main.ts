import './style.css'
import changelogRaw from '../CHANGELOG.md?raw';
import * as Supa from './supabase';
import packageJson from '../package.json';

const energyInput = document.getElementById('energy-input') as HTMLInputElement;
const weightInput = document.getElementById('weight-input') as HTMLInputElement;
const resultValue = document.getElementById('result-value') as HTMLElement;
const modeToggleBtn = document.getElementById('mode-toggle') as HTMLButtonElement;
const toggleText = modeToggleBtn.querySelector('.toggle-text') as HTMLElement;


const energyLabel = document.getElementById('energy-label') as HTMLElement;
const energyUnit = document.getElementById('energy-unit') as HTMLElement;
const resultUnit = document.getElementById('result-unit') as HTMLElement;
const formulaContainer = document.getElementById('formula-container') as HTMLElement;


const saveFoodBtn = document.getElementById('save-food-btn') as HTMLButtonElement;

const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
const historySection = document.getElementById('history-section') as HTMLDivElement;
const historyList = document.getElementById('history-list') as HTMLUListElement;
const totalKcalDisplay = document.getElementById('total-kcal') as HTMLSpanElement;

let isKjToKcal = true;

interface HistoryEntry {
    id: number;
    energy: number;
    weight: number;
    result: number;
    unit: string;
}

interface SavedFood {
    id: number;
    name: string;
    energy: number; // Stored value
    unit: string;   // 'kJ' or 'kcal' depending on mode when saved, though technically we just use the number
}

let history: HistoryEntry[] = [];
let savedFoods: SavedFood[] = JSON.parse(localStorage.getItem('savedFoods') || '[]');

const KJ_TO_KCAL = 4.184;

const MODE_CONFIG = {
    kjToKcal: {
        toggleText: 'kJ ➜ kcal',
        label: '每100g能量 (kJ)',
        unit: 'kJ',
        placeholder: '例如: 1800',
        resultUnit: 'kcal',
        formula: '<p class="formula-hint">Total kcal = (kJ/100g × Weight) ÷ 418.4</p>'
    },
    kcalToKj: {
        toggleText: 'kcal ➜ kJ',
        label: '每100g热量 (kcal)',
        unit: 'kcal',
        placeholder: '例如: 400',
        resultUnit: 'kJ',
        formula: '<p class="formula-hint">Total kJ = (kcal/100g × Weight × 4.184) ÷ 100</p>'
    }
};

const ADD_BTN_HTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            加入记录`;

function calculate() {
    const energy = parseFloat(energyInput.value);
    const weight = parseFloat(weightInput.value);

    if (isNaN(energy) || isNaN(weight)) {
        updateResult(0);
        return;
    }

    const totalEnergy = (energy / 100) * weight;
    const result = isKjToKcal ? totalEnergy / KJ_TO_KCAL : totalEnergy * KJ_TO_KCAL;
    updateResult(result);
}

function updateResult(value: number) {
    const formatted = value === 0 ? '0' : value.toFixed(1);

    resultValue.style.transform = 'scale(1.1)';
    resultValue.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';

    resultValue.textContent = formatted;

    setTimeout(() => {
        resultValue.style.transform = 'scale(1)';
    }, 100);
}

function toggleMode() {
    isKjToKcal = !isKjToKcal;
    energyInput.value = '';
    weightInput.value = '';
    updateResult(0);

    const elements = [energyLabel, energyUnit, resultUnit, formulaContainer];
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.2s ease';
    });

    setTimeout(() => {
        const config = isKjToKcal ? MODE_CONFIG.kjToKcal : MODE_CONFIG.kcalToKj;
        toggleText.textContent = config.toggleText;
        energyLabel.textContent = config.label;
        energyUnit.textContent = config.unit;
        energyInput.placeholder = config.placeholder;
        resultUnit.textContent = config.resultUnit;
        formulaContainer.innerHTML = config.formula;

        elements.forEach(el => el.style.opacity = '1');
    }, 200);
}


function addToHistory() {
    const energy = parseFloat(energyInput.value);
    const weight = parseFloat(weightInput.value);
    const currentResultRaw = resultValue.textContent || '0';
    const currentResult = parseFloat(currentResultRaw);

    if (isNaN(energy) || isNaN(weight) || currentResult === 0) {
        // Shake button to indicate error
        addBtn.classList.add('shake');
        setTimeout(() => addBtn.classList.remove('shake'), 400);
        return;
    }

    const entry: HistoryEntry = {
        id: Date.now(),
        energy,
        weight,
        result: currentResult,
        unit: resultUnit.textContent || 'kcal'
    };

    history.unshift(entry); // Add to top
    renderHistory();

    addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 已添加`;
    addBtn.style.background = 'rgba(34, 197, 94, 0.4)';
    addBtn.style.borderColor = 'rgba(34, 197, 94, 0.6)';

    setTimeout(() => {
        addBtn.innerHTML = ADD_BTN_HTML;
        addBtn.style.background = '';
        addBtn.style.borderColor = '';
    }, 1000);
}

function clearHistory() {
    history = [];
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historySection.classList.add('hidden');
        return;
    }

    historySection.classList.remove('hidden');
    historyList.innerHTML = '';

    let total = 0;

    history.forEach(item => {
        total += item.result;

        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
      <div class="item-info">
        <span class="item-weight">${item.weight}g</span>
        <span class="item-energy text-muted">@ ${item.energy}${item.unit === 'kcal' ? 'kcal' : (isKjToKcal ? 'kJ' : '?')}/100g</span>
      </div>
      <div class="item-result">
        +${item.result} <small>${item.unit}</small>
        <button class="delete-item-btn" aria-label="删除" data-id="${item.id}">×</button>
      </div>
    `;
        historyList.appendChild(li);

        // Add delete event
        const deleteBtn = li.querySelector('.delete-item-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await deleteHistoryItem(item.id);
        });
    });

    totalKcalDisplay.textContent = total % 1 === 0 ? total.toString() : total.toFixed(1);
}

async function deleteHistoryItem(id: number) {
    if (await showCustomConfirm('确定要删除这条记录吗？')) {
        history = history.filter(item => item.id !== id);
        renderHistory();
    }
}

// Custom Prompt Logic
const customPromptModal = document.getElementById('custom-prompt-modal') as HTMLDivElement;
const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
const promptCancelBtn = document.getElementById('prompt-cancel-btn') as HTMLButtonElement;
const promptConfirmBtn = document.getElementById('prompt-confirm-btn') as HTMLButtonElement;

function showCustomPrompt(): Promise<string | null> {
    return new Promise((resolve) => {
        promptInput.value = '';
        customPromptModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            customPromptModal.classList.add('active');
            promptInput.focus();
        });

        const handleConfirm = () => {
            const value = promptInput.value;
            cleanup();
            resolve(value);
        };

        const handleCancel = () => {
            cleanup();
            resolve(null);
        };

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleConfirm();
            if (e.key === 'Escape') handleCancel();
        };

        const cleanup = () => {
            customPromptModal.classList.remove('active');
            setTimeout(() => {
                customPromptModal.classList.add('hidden');
            }, 300); // Wait for transition

            promptConfirmBtn.removeEventListener('click', handleConfirm);
            promptCancelBtn.removeEventListener('click', handleCancel);
            promptInput.removeEventListener('keydown', handleKeydown);
        };

        promptConfirmBtn.addEventListener('click', handleConfirm);
        promptCancelBtn.addEventListener('click', handleCancel);
        promptInput.addEventListener('keydown', handleKeydown);
    });
}


// Custom Confirm Logic
const customConfirmModal = document.getElementById('custom-confirm-modal') as HTMLDivElement;
const confirmMessage = document.getElementById('confirm-message') as HTMLParagraphElement;
const confirmCancelBtn = document.getElementById('confirm-cancel-btn') as HTMLButtonElement;
const confirmYesBtn = document.getElementById('confirm-yes-btn') as HTMLButtonElement;

function showCustomConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        confirmMessage.textContent = message;
        customConfirmModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            customConfirmModal.classList.add('active');
            confirmYesBtn.focus();
        });

        const handleConfirm = () => {
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            cleanup();
            resolve(false);
        };

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleConfirm();
            if (e.key === 'Escape') handleCancel();
        };

        const cleanup = () => {
            customConfirmModal.classList.remove('active');
            setTimeout(() => {
                customConfirmModal.classList.add('hidden');
            }, 300);

            confirmYesBtn.removeEventListener('click', handleConfirm);
            confirmCancelBtn.removeEventListener('click', handleCancel);
            document.removeEventListener('keydown', handleKeydown);
        };

        confirmYesBtn.addEventListener('click', handleConfirm);
        confirmCancelBtn.addEventListener('click', handleCancel);
        document.addEventListener('keydown', handleKeydown);
    });
}

// Custom Alert Logic
const customAlertModal = document.getElementById('custom-alert-modal') as HTMLDivElement;
const alertMessage = document.getElementById('alert-message') as HTMLParagraphElement;
const alertOkBtn = document.getElementById('alert-ok-btn') as HTMLButtonElement;

function showCustomAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
        alertMessage.textContent = message;
        customAlertModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            customAlertModal.classList.add('active');
            alertOkBtn.focus();
        });

        const handleOk = () => {
            cleanup();
            resolve();
        };

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === 'Escape') handleOk();
        };

        const cleanup = () => {
            customAlertModal.classList.remove('active');
            setTimeout(() => {
                customAlertModal.classList.add('hidden');
            }, 300);
            alertOkBtn.removeEventListener('click', handleOk);
            document.removeEventListener('keydown', handleKeydown);
        };

        alertOkBtn.addEventListener('click', handleOk);
        document.addEventListener('keydown', handleKeydown);
    });
}

// Drawer Logic
const foodDrawer = document.getElementById('food-drawer') as HTMLDivElement;
const openDrawerBtn = document.getElementById('open-drawer-btn') as HTMLButtonElement;
const closeDrawerBtn = document.getElementById('close-drawer-btn') as HTMLButtonElement;
const savedFoodsGrid = document.getElementById('saved-foods-grid') as HTMLDivElement;

function openDrawer() {
    foodDrawer.classList.remove('hidden');
    requestAnimationFrame(() => {
        foodDrawer.classList.add('active');
    });

    if (Supa.getSupabase() && Supa.getCurrentUser()) {
        syncFoods();
    } else {
        renderSavedFoods();
    }
}

async function syncFoods() {
    try {
        const remoteFoods = await Supa.fetchRemoteFoods();

        // --- Merge Strategy (Smart Sync) ---
        // 1. Create a Map of existing local foods for easy lookup
        const localMap = new Map(savedFoods.map(f => [f.id, f]));

        // 2. Add/Update logic: Remote data is trusted source for existing IDs (in case of edits)
        //    But we also want to KEEP local items that haven't been synced yet.
        const mergedFoods: SavedFood[] = [];

        // Add all remote foods (they are the "truth" for those IDs)
        remoteFoods.forEach(rf => {
            localMap.delete(rf.id); // Remove from local map so we know it's handled
            mergedFoods.push({
                id: rf.id,
                name: rf.name,
                energy: rf.energy,
                unit: rf.unit
            });
        });

        // 3. Any items remaining in localMap are "Local Only" (Offline created).
        //    We should keep them AND try to push them to cloud.
        for (const localAuthored of localMap.values()) {
            mergedFoods.push(localAuthored);
            // Attempt to push to cloud in background
            Supa.addRemoteFood(localAuthored).catch(console.error);
        }

        // 4. Sort by ID (Timestamp) descending to keep order
        mergedFoods.sort((a, b) => b.id - a.id);

        // 5. Update state
        savedFoods = mergedFoods;
        localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
        renderSavedFoods();

    } catch (e) {
        console.error("Sync failed", e);
        // If sync fails (offline), we just show local data
        renderSavedFoods();
    }
}

function closeDrawer() {
    foodDrawer.classList.remove('active');
    setTimeout(() => {
        foodDrawer.classList.add('hidden');
    }, 300);
}

openDrawerBtn.addEventListener('click', openDrawer);
closeDrawerBtn.addEventListener('click', closeDrawer);
foodDrawer.addEventListener('click', (e) => {
    if (e.target === foodDrawer) closeDrawer();
});

// Saved Foods Functions
async function saveFood() {
    const energy = parseFloat(energyInput.value);
    if (isNaN(energy)) {
        await showCustomAlert('请先输入有效的能量值');
        return;
    }

    const name = await showCustomPrompt();
    if (!name || !name.trim()) return;

    const newFood: SavedFood = {
        id: Date.now(),
        name: name.trim(),
        energy: energy,
        unit: isKjToKcal ? 'kJ' : 'kcal'
    };

    savedFoods.unshift(newFood);
    // Limit to 50 items
    if (savedFoods.length > 50) savedFoods.pop();
    localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
    renderSavedFoods();

    // Sync if online
    if (Supa.getSupabase() && Supa.getCurrentUser()) {
        await Supa.addRemoteFood(newFood);
    }
}

function renderSavedFoods() {
    if (savedFoods.length === 0) {
        savedFoodsGrid.innerHTML = '<div class="empty-state">暂无保存的食品</div>';
        return;
    }

    savedFoodsGrid.innerHTML = '';

    savedFoods.forEach(food => {
        const chip = document.createElement('div');
        chip.className = 'food-chip';
        // Add edit button before delete button
        chip.innerHTML = `
            <span>${food.name}</span>
            <span class="chip-energy">
                ${food.energy}
                <small>${food.unit || (isKjToKcal ? 'kJ' : 'kcal')}</small>
            </span>
            <div style="margin-left: auto; display: flex; align-items: center;">
                 <button class="edit-chip-btn" aria-label="编辑食品">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
                <button class="delete-chip-btn" aria-label="删除食品">×</button>
            </div>
        `;

        chip.addEventListener('click', (e) => {
            // Prevent triggering if clicking buttons
            if ((e.target as HTMLElement).closest('button')) return;

            // Auto-switch mode if unit doesn't match
            // Current Mode: isKjToKcal = true -> input is kJ
            // Food Unit: 'kcal'
            // Need to switch to kcalToKj mode.
            const foodUnit = food.unit || (isKjToKcal ? 'kJ' : 'kcal');
            const currentModeUnit = isKjToKcal ? 'kJ' : 'kcal';

            if (foodUnit !== currentModeUnit) {
                toggleMode();
            }

            energyInput.value = food.energy.toString();
            calculate();
            closeDrawer();
        });

        const editBtn = chip.querySelector('.edit-chip-btn') as HTMLButtonElement;
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEditFoodModal(food);
        });

        const deleteBtn = chip.querySelector('.delete-chip-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await deleteSavedFood(food.id);
        });

        savedFoodsGrid.appendChild(chip);
    });
}

function showEditFoodModal(food: SavedFood) {
    const modal = document.getElementById('custom-edit-modal') as HTMLDivElement;
    const nameInput = document.getElementById('edit-name-input') as HTMLInputElement;
    const energyInput = document.getElementById('edit-energy-input') as HTMLInputElement;
    const cancelBtn = document.getElementById('edit-cancel-btn') as HTMLButtonElement;
    const saveBtn = document.getElementById('edit-save-btn') as HTMLButtonElement;

    nameInput.value = food.name;
    energyInput.value = food.energy.toString();

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.add('active');
        nameInput.focus();
    });

    const handleSave = async () => {
        const newName = nameInput.value.trim();
        const newEnergy = parseFloat(energyInput.value);

        if (!newName) {
            await showCustomAlert('请输入食品名称');
            return;
        }
        if (isNaN(newEnergy)) {
            await showCustomAlert('请输入有效的能量值');
            return;
        }

        // Update food object
        food.name = newName;
        food.energy = newEnergy;

        // Save to local storage
        localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
        renderSavedFoods();
        cleanup();

        // TODO: Handle cloud update for edits (omitted for brevity, requires delete then insert or an update rpc)
    };

    const handleCancel = () => {
        cleanup();
    };

    const cleanup = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
        saveBtn.removeEventListener('click', handleSave);
        cancelBtn.removeEventListener('click', handleCancel);
    };

    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', handleCancel);
}

async function deleteSavedFood(id: number) {
    if (await showCustomConfirm('确定要删除这个常用食品吗？')) {
        savedFoods = savedFoods.filter(f => f.id !== id);
        localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
        renderSavedFoods();

        // Cloud Sync
        if (Supa.getSupabase() && Supa.getCurrentUser()) {
            await Supa.deleteRemoteFood(id);
        }
    }
}

weightInput.addEventListener('input', calculate);
modeToggleBtn.addEventListener('click', toggleMode);

addBtn.addEventListener('click', addToHistory);
clearBtn.addEventListener('click', clearHistory);
saveFoodBtn.addEventListener('click', saveFood);

[energyInput, weightInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

        if (allowedKeys.includes(e.key)) return;
        if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) return;
        if (e.key === '.' && !input.value.includes('.')) return;
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    });

    input.addEventListener('paste', (e) => {
        const pastedData = e.clipboardData?.getData('text') || '';
        if (!/^[0-9.]*$/.test(pastedData) || (pastedData.split('.').length - 1 > 1)) {
            e.preventDefault();
        }
    });
});


const changelogBtn = document.getElementById('changelog-btn') as HTMLButtonElement;
const changelogModal = document.getElementById('changelog-modal') as HTMLDivElement;
const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
const changelogContent = document.getElementById('changelog-content') as HTMLDivElement;

function parseMarkdown(markdown: string): string {
    let output = '';
    let inList = false;

    markdown.split('\n').forEach(line => {
        line = line.trim(); // Helper: handle indentation

        if (!line) return; // Skip empty lines
        if (line.startsWith('# ')) return; // Skip H1 title

        if (line.startsWith('## ')) {
            if (inList) { output += '</ul>'; inList = false; }
            const content = line.replace('## [', '').replace(']', '');
            // Remove version link if present in header (e.g. [1.0.0])
            output += `<h2>${content.replace(/^#+\s*/, '')}</h2>`;
        } else if (line.startsWith('### ')) {
            if (inList) { output += '</ul>'; inList = false; }
            output += `<h3>${line.replace('### ', '')}</h3>`;
        } else if (line.startsWith('- ')) {
            if (!inList) { output += '<ul>'; inList = true; }
            let content = line.substring(2); // Remove "- " safely
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
            // Enhanced link regex: allow spaces, handle standard markdown links
            content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            output += `<li>${content}</li>`;
        } else {
            // Handle content that is not a list item (e.g. wrapped text or paragraphs)
            if (inList) {
                // Option A: Close list. Treat as paragraph.
                output += '</ul>'; inList = false;
                output += `<p>${line}</p>`;
            } else {
                output += `<p>${line}</p>`;
            }
        }
    });
    if (inList) output += '</ul>';

    return output;
}

function openModal() {
    changelogContent.innerHTML = parseMarkdown(changelogRaw);
    changelogModal.classList.remove('hidden');

    requestAnimationFrame(() => {
        changelogModal.classList.add('active');
    });
}

function closeModal() {
    changelogModal.classList.remove('active');
    setTimeout(() => {
        changelogModal.classList.add('hidden');
    }, 300);
}

changelogBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);


changelogModal.addEventListener('click', (e) => {
    if (e.target === changelogModal) {
        closeModal();
    }
});


// --- Cloud Settings Logic ---
const cloudSettingsBtn = document.getElementById('cloud-settings-btn') as HTMLButtonElement;
const cloudSettingsModal = document.getElementById('cloud-settings-modal') as HTMLDivElement;
const closeCloudSettingsBtn = document.getElementById('close-cloud-settings-btn') as HTMLButtonElement;
const cloudStatusDot = document.getElementById('cloud-status-dot') as HTMLSpanElement;

// Sections (Config removed)
const cloudAuthSection = document.getElementById('cloud-auth-section') as HTMLDivElement;
const cloudGuestSection = document.getElementById('cloud-guest-section') as HTMLDivElement;

const currentUserEmail = document.getElementById('current-user-email') as HTMLSpanElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
const manualSyncBtn = document.getElementById('manual-sync-btn') as HTMLButtonElement;

const authModal = document.getElementById('auth-modal') as HTMLDivElement;
const closeAuthBtn = document.getElementById('close-auth-btn') as HTMLButtonElement;
const authEmailInput = document.getElementById('auth-email') as HTMLInputElement;
const authPasswordInput = document.getElementById('auth-password') as HTMLInputElement;
const authSubmitBtn = document.getElementById('auth-submit-btn') as HTMLButtonElement;
const authSwitchBtn = document.getElementById('auth-switch-btn') as HTMLButtonElement;
const authSwitchText = document.getElementById('auth-switch-text') as HTMLSpanElement;
const authTitle = document.getElementById('auth-title') as HTMLHeadingElement;

// State needed for UI
let isLoginMode = true;

function initCloudUI() {
    // Config hardcoded, always init
    Supa.initSupabase();

    // Use real-time subscription for Auth State
    Supa.subscribeToAuthChanges((user) => {
        updateCloudUIState(!!user);
        if (user) {
            syncFoods();
        }
    });
}

const guestLoginBtn = document.getElementById('guest-login-btn') as HTMLButtonElement;

// @ts-ignore
// window.updateCloudUIState = updateCloudUIState;

function updateCloudUIState(isLoggedIn: boolean) {
    // console.log('updateCloudUIState', { isLoggedIn, isHelperConnected: Supa.isHelperConnected() });

    // Always connected now
    if (isLoggedIn) {
        cloudStatusDot.classList.remove('hidden');
        cloudAuthSection.classList.remove('hidden');
        cloudGuestSection.classList.add('hidden');
        const user = Supa.getCurrentUser();
        if (user) currentUserEmail.textContent = user.email || 'User';
    } else {
        // Connected to Project, but not User (Guest)
        cloudStatusDot.classList.add('hidden');
        cloudAuthSection.classList.add('hidden');
        cloudGuestSection.classList.remove('hidden');
    }
}

// Open Settings
cloudSettingsBtn.addEventListener('click', async () => {
    cloudSettingsModal.classList.remove('hidden');
    requestAnimationFrame(() => cloudSettingsModal.classList.add('active'));
    // No inputs to fill
});

// Guest Section Listeners
guestLoginBtn.addEventListener('click', () => {
    // Usually close it to focus on auth
    closeCloudSettings();
    openAuthModal();
});

// Guest Reset Config Removed

function closeCloudSettings() {
    cloudSettingsModal.classList.remove('active');
    setTimeout(() => cloudSettingsModal.classList.add('hidden'), 300);
}

closeCloudSettingsBtn.addEventListener('click', closeCloudSettings);
cloudSettingsModal.addEventListener('click', (e) => {
    if (e.target === cloudSettingsModal) closeCloudSettings();
});

// Save Config Listener Removed
// Reset Config Listener Removed

// Auth Modal
function openAuthModal() {
    authModal.classList.remove('hidden');
    requestAnimationFrame(() => authModal.classList.add('active'));
    authEmailInput.focus();
}

function closeAuthModal() {
    authModal.classList.remove('active');
    setTimeout(() => authModal.classList.add('hidden'), 300);
}

closeAuthBtn.addEventListener('click', closeAuthModal);

authSwitchBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        authTitle.textContent = '登录';
        authSubmitBtn.textContent = '登录';
        authSwitchText.textContent = '还没有账号？';
        authSwitchBtn.textContent = '去注册';
    } else {
        authTitle.textContent = '注册账号';
        authSubmitBtn.textContent = '注册';
        authSwitchText.textContent = '已有账号？';
        authSwitchBtn.textContent = '去登录';
    }
});

// Custom Alert Logic
const customAlertModal = document.getElementById('custom-alert-modal') as HTMLDivElement;
const alertTitle = document.getElementById('alert-title') as HTMLHeadingElement;
const alertMessage = document.getElementById('alert-message') as HTMLParagraphElement;
const alertOkBtn = document.getElementById('alert-ok-btn') as HTMLButtonElement;

function showCustomAlert(message: string, title = '提示'): Promise<void> {
    return new Promise((resolve) => {
        alertTitle.textContent = title;
        alertMessage.textContent = message;

        customAlertModal.classList.remove('hidden');
        requestAnimationFrame(() => customAlertModal.classList.add('active'));

        const handleOk = () => {
            customAlertModal.classList.remove('active');
            setTimeout(() => {
                customAlertModal.classList.add('hidden');
                alertOkBtn.removeEventListener('click', handleOk);
                resolve();
            }, 300);
        };

        alertOkBtn.addEventListener('click', handleOk);
    });
}

authSubmitBtn.addEventListener('click', async () => {
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!email || !password) return;

    authSubmitBtn.textContent = '处理中...';
    authSubmitBtn.disabled = true;

    try {
        if (isLoginMode) {
            await Supa.login(email, password);
            // Verify this modal exists in HTML before calling
            await showCustomAlert('登录成功！');
            closeAuthModal();
            closeCloudSettings(); // Close the settings modal too
            // UI update handled by subscription
        } else {
            const data = await Supa.signUp(email, password);
            if (data.user && !data.session) {
                await showCustomAlert('注册成功！\n请务必查收邮件并点击验证链接，否则无法登录。', '注册成功');
                closeAuthModal();
                closeCloudSettings(); // Close the settings modal too
            } else {
                await showCustomAlert('注册并登录成功！');
                closeAuthModal();
                closeCloudSettings(); // Close the settings modal too
            }
        }
    } catch (e: any) {
        await showCustomAlert('操作失败: ' + (e.message || '未知错误'), '错误');
        console.error(e);
    } finally {
        authSubmitBtn.textContent = isLoginMode ? '登录' : '注册';
        authSubmitBtn.disabled = false;
    }
});

// Logout
// Logout
logoutBtn.addEventListener('click', async () => {
    logoutBtn.disabled = true;
    logoutBtn.textContent = '注销中...';
    try {
        await Supa.logout();
        updateCloudUIState(false); // Force UI update immediately
    } catch (e: any) {
        console.error(e);
        await showCustomAlert('注销失败，请重试');
    } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = '注销登录';
    }
});

manualSyncBtn.addEventListener('click', async () => {
    manualSyncBtn.disabled = true;
    manualSyncBtn.textContent = '同步中...';
    await syncFoods();
    manualSyncBtn.textContent = '同步完成';
    setTimeout(() => {
        manualSyncBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg> 立即同步`;
        manualSyncBtn.disabled = false;
    }, 1500);
});

// Init on load
initCloudUI();

// Display app version
const appVersionEl = document.getElementById('app-version') as HTMLSpanElement;
if (appVersionEl) {
    appVersionEl.textContent = `v${packageJson.version}`;
}
