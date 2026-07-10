// Utility Alerts Helper
function showAlert(message, type) {
    const alertBox = document.getElementById('status-alert');
    alertBox.innerHTML = `
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info'}" class="w-5 h-5 flex-shrink-0"></i>
                <span class="flex-grow">${message}</span>
            `;
    alertBox.classList.remove('hidden', 'bg-emerald-950/40', 'border-emerald-800', 'text-emerald-300', 'bg-red-950/40', 'border-red-800', 'text-red-300', 'bg-slate-800', 'border-slate-700', 'text-slate-200');

    if (type === 'success') {
        alertBox.classList.add('bg-emerald-950/40', 'border-emerald-800', 'text-emerald-300');
    } else if (type === 'error') {
        alertBox.classList.add('bg-red-950/40', 'border-red-800', 'text-red-300');
    } else {
        alertBox.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-200');
    }
    lucide.createIcons();
}

export { showAlert }