'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const TOAST_STYLES: Record<ToastType, string> = {
  success: 'bg-green-900/90 border-green-400/50 text-green-100',
  error: 'bg-red-900/90 border-red-400/50 text-red-100',
  info: 'bg-[#C9A962]/90 border-[#C9A962]/50 text-[#0D0D0F]',
  warning: 'bg-amber-900/90 border-amber-400/50 text-amber-100',
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✗',
  info: 'i',
  warning: '!',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-lg border shadow-lg
              flex items-center gap-3 min-w-[280px] max-w-md
              animate-slide-up backdrop-blur-sm
              ${TOAST_STYLES[toast.type]}
            `}
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current/20 text-xs font-bold">
              {TOAST_ICONS[toast.type]}
            </span>
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-50 hover:opacity-100 transition text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Add CSS animation for slide-up
// This should be added to globals.css:
// @keyframes slide-up {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-slide-up { animation: slide-up 0.2s ease-out; }
