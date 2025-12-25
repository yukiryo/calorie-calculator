// Custom Prompt Logic
const customPromptModal = document.getElementById('custom-prompt-modal') as HTMLDivElement;
const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
const promptCancelBtn = document.getElementById('prompt-cancel-btn') as HTMLButtonElement;
const promptConfirmBtn = document.getElementById('prompt-confirm-btn') as HTMLButtonElement;

export function showCustomPrompt(): Promise<string | null> {
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

export function showCustomConfirm(message: string): Promise<boolean> {
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
const alertTitle = document.getElementById('alert-title') as HTMLHeadingElement;
const alertMessage = document.getElementById('alert-message') as HTMLParagraphElement;
const alertOkBtn = document.getElementById('alert-ok-btn') as HTMLButtonElement;

export function showCustomAlert(message: string, title = '提示'): Promise<void> {
    return new Promise((resolve) => {
        alertTitle.textContent = title;
        alertMessage.textContent = message;

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
