import './style.css'
import changelogRaw from '../CHANGELOG.md?raw';

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
        label: '每100克能量 (kJ)',
        unit: 'kJ',
        placeholder: '例如: 1800',
        resultUnit: 'kcal',
        formula: '<p class="formula-hint">总大卡 = (每100克千焦含量 × 摄入克数) ÷ 418.4</p>'
    },
    kcalToKj: {
        toggleText: 'kcal ➜ kJ',
        label: '每100克热量 (kcal)',
        unit: 'kcal',
        placeholder: '例如: 400',
        resultUnit: 'kJ',
        formula: '<p class="formula-hint">总千焦 = (每100克大卡含量 × 摄入克数 × 4.184) ÷ 100</p>'
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
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHistoryItem(item.id);
        });
    });

    totalKcalDisplay.textContent = total % 1 === 0 ? total.toString() : total.toFixed(1);
}

function deleteHistoryItem(id: number) {
    history = history.filter(item => item.id !== id);
    renderHistory();
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
    renderSavedFoods();
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
        alert('请先输入有效的能量值');
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
    // Limit to 20 items
    if (savedFoods.length > 20) savedFoods.pop();

    localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
    renderSavedFoods();
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
        chip.innerHTML = `
            <span>${food.name}</span>
            <span class="chip-energy">${food.energy}</span>
            <button class="delete-chip-btn" aria-label="删除食品">×</button>
        `;

        chip.addEventListener('click', () => {
            // If units mismatch, maybe warn or convert? For now we assumes user knows context or inputs raw number
            // But actually isKjToKcal mode might change. 
            // Ideally we should store unit and check against current mode, or just fill the number.
            // Let's just fill the number for simplicity as per plan "Apply energy value".
            energyInput.value = food.energy.toString();
            calculate();
        });

        const deleteBtn = chip.querySelector('.delete-chip-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSavedFood(food.id);
        });

        savedFoodsGrid.appendChild(chip);
    });
}

function deleteSavedFood(id: number) {
    if (confirm('确定要删除这个常用食品吗？')) {
        savedFoods = savedFoods.filter(f => f.id !== id);
        localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
        renderSavedFoods();
    }
}

// Initial render






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

function parseMarkdown(md: string): string {

    const lines = md.split('\n');
    let output = '';
    let inList = false;

    lines.forEach(line => {
        line = line.trim();
        if (!line) {
            if (inList) { output += '</ul>'; inList = false; }
            return;
        }

        if (line.startsWith('# ')) return;

        if (line.startsWith('## ')) {
            if (inList) { output += '</ul>'; inList = false; }
            const content = line.replace('## [', '').replace(']', '');
            output += `<h2>${content.replace(/^#+\s*/, '')}</h2>`;
        } else if (line.startsWith('### ')) {
            if (inList) { output += '</ul>'; inList = false; }
            output += `<h3>${line.replace('### ', '')}</h3>`;
        } else if (line.startsWith('- ')) {
            if (!inList) { output += '<ul>'; inList = true; }
            let content = line.replace('- ', '');
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
            output += `<li>${content}</li>`;
        } else {
            if (inList) { output += '</ul>'; inList = false; }
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
