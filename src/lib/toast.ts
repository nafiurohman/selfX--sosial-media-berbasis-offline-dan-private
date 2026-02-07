// Custom toast utility to replace sonner
let toastCallback: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

export function setToastCallback(callback: (message: string, type: 'success' | 'error' | 'info') => void) {
  toastCallback = callback;
}

export const toast = {
  success: (message: string) => {
    if (toastCallback) toastCallback(message, 'success');
  },
  error: (message: string) => {
    if (toastCallback) toastCallback(message, 'error');
  },
  info: (message: string) => {
    if (toastCallback) toastCallback(message, 'info');
  },
};
