import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const removingRef = useRef(new Set());

  const removeToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    removingRef.current.delete(id);
  }, []);

  const showToast = useCallback((msg, title, type = 'info') => {
    const id = nextId++;
    setToasts((list) => [...list, { id, msg, title, type, leaving: false }]);

    setTimeout(() => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => removeToast(id), 350);
    }, 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} style={t.leaving ? { opacity: 0 } : undefined}>
            <div className="toast-icon">{t.type === 'success' ? '✓' : 'ℹ️'}</div>
            <div>
              <div className="toast-title">{t.title}</div>
              <div className="toast-msg">{t.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
