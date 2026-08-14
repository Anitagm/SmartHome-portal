// src/hooks/useNotifications.js
import { createContext, useCallback, useContext, useState } from 'react';
import { initialNotifications } from '../data/notifications-data.js';

const STORAGE_KEY = 'ferdowsi-dismissed-notifications';
const NotificationsContext = createContext(null);

let nextId = 1;

function loadDismissedIds() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing dismissed notifications from localStorage:', e);
    return [];
  }
}

export function NotificationsProvider({ children }) {
  const [dismissedIds, setDismissedIds] = useState(loadDismissedIds);
  const [customNotifications, setCustomNotifications] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const seedNotifications = initialNotifications.filter((n) => !dismissedIds.includes(n.id));
  const notifications = [...customNotifications, ...seedNotifications].sort((a, b) => b.timestamp - a.timestamp);

  // Call from anywhere in the app to record "X changed" as a real notification,
  // not just a transient toast.
  const addNotification = useCallback((title, message) => {
    const id = `note-${Date.now()}-${nextId++}`;
    setCustomNotifications((prev) => [{ id, title, message, timestamp: Date.now() }, ...prev]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setCustomNotifications((prev) => {
      const isCustom = prev.some((n) => n.id === id);
      if (isCustom) return prev.filter((n) => n.id !== id);

      setDismissedIds((ids) => {
        const next = [...ids, id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return prev;
    });
  }, []);

  const togglePanel = useCallback(() => setPanelOpen((v) => !v), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const value = { notifications, addNotification, dismiss, panelOpen, togglePanel, closePanel };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
}
