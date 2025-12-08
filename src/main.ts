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

// State
let isKjToKcal = true;

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
        // kcal to kJ
        // Formula: (kcal / 100 * weight) * 4.184
        // Wait, usually food lookup is "Energy per 100g", so user inputs kcal/100g.
        // Total kcal = (kcal_per_100g / 100) * weight
        // Total kJ = Total kcal * 4.184

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

        // Recalculate if values exist
        calculate();
    }, 200);
}

// Event Listeners
energyInput.addEventListener('input', calculate);
weightInput.addEventListener('input', calculate);
modeToggleBtn.addEventListener('click', toggleMode);

[energyInput, weightInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === '-') {
            e.preventDefault();
        }
    });
});
