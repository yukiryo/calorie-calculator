import { router } from './router';

interface BMIHistoryItem {
    id: string;
    date: string;
    bmi: string;
    status: string;
    weight: number;
    height: number;
    statusClass: string;
}

const STORAGE_KEY = 'calorie_calculator_bmi_history';

export class BMICalculator {
    private heightInput: HTMLInputElement;
    private weightInput: HTMLInputElement;
    private saveBtn: HTMLButtonElement;
    private resultValue: HTMLElement;
    private resultStatus: HTMLElement;
    private historyList: HTMLElement;
    private historySection: HTMLElement;
    private clearBtn: HTMLButtonElement;
    private backBtn: HTMLButtonElement;

    constructor() {
        this.heightInput = document.getElementById('bmi-height') as HTMLInputElement;
        this.weightInput = document.getElementById('bmi-weight') as HTMLInputElement;
        this.saveBtn = document.getElementById('bmi-save-btn') as HTMLButtonElement;
        this.resultValue = document.getElementById('bmi-value') as HTMLElement;
        this.resultStatus = document.getElementById('bmi-status') as HTMLElement;
        this.historyList = document.getElementById('bmi-history-list') as HTMLElement;
        this.historySection = document.getElementById('bmi-history-section') as HTMLElement;
        this.clearBtn = document.getElementById('clear-bmi-history-btn') as HTMLButtonElement;
        this.backBtn = document.getElementById('back-btn') as HTMLButtonElement;

        this.init();
    }

    private init() {
        // Real-time calculation on input
        this.heightInput?.addEventListener('input', () => this.calculate());
        this.weightInput?.addEventListener('input', () => this.calculate());

        // Save to history button
        this.saveBtn.addEventListener('click', () => this.saveCurrentToHistory());

        // Clear History
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearHistory());
        }

        // Back button
        this.backBtn.addEventListener('click', () => router.back());

        // Load initial history
        this.renderHistory();
    }

    private calculate() {
        const heightCm = parseFloat(this.heightInput.value);
        const weightKg = parseFloat(this.weightInput.value);

        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
            this.resultValue.innerText = '--.-';
            this.resultStatus.innerText = '--';
            this.resultStatus.className = 'result-unit';
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        const bmiFormatted = bmi.toFixed(1);

        const { status, colorClass } = this.getStatus(bmi);

        // Update UI with animation
        this.resultValue.style.transform = 'scale(1.1)';
        this.resultValue.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
        this.resultValue.innerText = bmiFormatted;
        this.resultStatus.innerText = status;
        this.resultStatus.className = `result-unit ${colorClass}`;

        setTimeout(() => {
            this.resultValue.style.transform = 'scale(1)';
        }, 100);
    }

    private saveCurrentToHistory() {
        const heightCm = parseFloat(this.heightInput.value);
        const weightKg = parseFloat(this.weightInput.value);

        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        const bmiFormatted = bmi.toFixed(1);
        const { status, colorClass } = this.getStatus(bmi);

        this.saveToHistory({
            date: new Date().toLocaleDateString('zh-CN'),
            bmi: bmiFormatted,
            status,
            weight: weightKg,
            height: heightCm,
            statusClass: colorClass
        });
    }

    private getStatus(bmi: number): { status: string, colorClass: string } {
        if (bmi < 18.5) return { status: '偏瘦', colorClass: 'text-thin' };
        if (bmi < 25) return { status: '正常', colorClass: 'text-normal' };
        if (bmi < 30) return { status: '过重', colorClass: 'text-overweight' };
        return { status: '肥胖', colorClass: 'text-obese' };
    }

    private saveToHistory(item: Omit<BMIHistoryItem, 'id'>) {
        let history = this.getHistory();
        const newItem: BMIHistoryItem = { ...item, id: Date.now().toString() };
        history.unshift(newItem);
        if (history.length > 5) {
            history = history.slice(0, 5);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        this.renderHistory();
    }

    private deleteHistoryItem(id: string) {
        let history = this.getHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        this.renderHistory();
    }

    private getHistory(): BMIHistoryItem[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    private clearHistory() {
        localStorage.removeItem(STORAGE_KEY);
        this.renderHistory();
    }

    private renderHistory() {
        const history = this.getHistory();
        this.historyList.innerHTML = '';

        if (history.length === 0) {
            this.historySection.classList.add('hidden');
            return;
        }

        this.historySection.classList.remove('hidden');

        history.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
        <div class="item-info">
          <span class="item-weight">${item.date}</span>
          <span class="item-energy">${item.height}cm / ${item.weight}kg</span>
        </div>
        <div class="item-result">
          <span class="${item.statusClass}" style="font-size: 0.9rem;">${item.status}</span>
          <span style="color: white;">${item.bmi}</span>
          <button class="delete-item-btn" aria-label="删除" data-id="${item.id}">×</button>
        </div>
      `;
            this.historyList.appendChild(li);

            // Add delete event
            const deleteBtn = li.querySelector('.delete-item-btn') as HTMLButtonElement;
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(item.id);
            });
        });
    }
}
