import './style.css'

const energyInput = document.getElementById('energy-input') as HTMLInputElement;
const weightInput = document.getElementById('weight-input') as HTMLInputElement;
const resultValue = document.getElementById('result-value') as HTMLElement;
const modeToggleBtn = document.getElementById('mode-toggle') as HTMLButtonElement;
const toggleText = modeToggleBtn.querySelector('.toggle-text') as HTMLElement;

// Text Elements to update
const energyLabel = document.getElementById('energy-label') as HTMLElement;
const energyUnit = document.getElementById('energy-unit') as HTMLElement;
const resultUnit = document.getElementById('result-unit') as HTMLElement;
const formulaContainer = document.getElementById('formula-container') as HTMLElement;

// New elements for History/Meal function
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
const historySection = document.getElementById('history-section') as HTMLDivElement;
const historyList = document.getElementById('history-list') as HTMLUListElement;
const totalKcalDisplay = document.getElementById('total-kcal') as HTMLSpanElement;

// State
let isKjToKcal = true;

interface HistoryEntry {
    id: number;
    energy: number;
    weight: number;
    result: number;
    unit: string;
}

let history: HistoryEntry[] = [];

// Constants
const KJ_TO_KCAL = 4.184;

function calculate() {
    const energy = parseFloat(energyInput.value);
    const weight = parseFloat(weightInput.value);

    if (isNaN(energy) || isNaN(weight)) {
        updateResult(0);
        return;
    }

    let result = 0;

    if (isKjToKcal) {
        // kJ to kcal
        // Formula: (kJ / 100 * weight) / 4.184
        const totalKj = (energy / 100) * weight;
        result = totalKj / KJ_TO_KCAL;
    } else {
        // kcal to kJ output
        const totalKcal = (energy / 100) * weight;
        result = totalKcal * KJ_TO_KCAL;
    }

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

    // Clear inputs on toggle to avoid confusion
    energyInput.value = '';
    weightInput.value = '';
    updateResult(0);

    // Animation for transition
    const inputs = [energyLabel, energyUnit, resultUnit, formulaContainer];
    inputs.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.2s ease';
    });

    setTimeout(() => {
        if (isKjToKcal) {
            // Mode: kJ -> kcal
            toggleText.textContent = "kJ ➜ kcal";
            energyLabel.textContent = "每100克能量 (kJ)";
            energyUnit.textContent = "kJ";
            energyInput.placeholder = "例如: 1800";
            resultUnit.textContent = "kcal";

            formulaContainer.innerHTML = `
        <p class="formula-hint">总千焦 = (输入的千焦 / 100) * 摄入重量(克)</p>
        <p class="formula-hint">总大卡 = 总千焦 / 4.184</p>
      `;
        } else {
            // Mode: kcal -> kJ
            toggleText.textContent = "kcal ➜ kJ";
            energyLabel.textContent = "每100克热量 (kcal)";
            energyUnit.textContent = "kcal";
            energyInput.placeholder = "例如: 400";
            resultUnit.textContent = "kJ";

            formulaContainer.innerHTML = `
        <p class="formula-hint">总大卡 = (输入的大卡 / 100) * 摄入重量(克)</p>
        <p class="formula-hint">总千焦 = 总大卡 * 4.184</p>
      `;
        }

        // Restore opacity
        inputs.forEach(el => el.style.opacity = '1');
    }, 200);
}

// History Functions
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

    // Visual feedback
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 已添加`;
    // We add inline styles for feedback, assuming button is styled in CSS
    addBtn.style.background = 'rgba(34, 197, 94, 0.4)';
    addBtn.style.borderColor = 'rgba(34, 197, 94, 0.6)';

    setTimeout(() => {
        addBtn.innerHTML = originalText;
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

    // Update total unit label if history items are mostly kJ?
    // For now we keep the total label simple.
}

function deleteHistoryItem(id: number) {
    history = history.filter(item => item.id !== id);
    renderHistory();
}

// Event Listeners
energyInput.addEventListener('input', calculate);
weightInput.addEventListener('input', calculate);
modeToggleBtn.addEventListener('click', toggleMode);

addBtn.addEventListener('click', addToHistory);
clearBtn.addEventListener('click', clearHistory);

[energyInput, weightInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === '-') {
            e.preventDefault();
        }
    });
});
