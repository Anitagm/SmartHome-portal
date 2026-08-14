import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ferdowsi-security';

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { status: 'disarmed', history: [] };
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing security state from localStorage:', e);
    return { status: 'disarmed', history: [] };
  }
}

export function useSecurityState() {
  const [securityState, setSecurityState] = useState(loadState);

  const setStatus = useCallback((status, label) => {
    setSecurityState((prev) => {
      const history = [{ action: label, timestamp: new Date().toISOString() }, ...prev.history].slice(0, 10);
      const next = { status, history };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { securityState, setStatus };
}
