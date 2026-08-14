import { useCallback, useMemo, useState } from 'react';
import { automations as baseAutomations } from '../data/automations-data.js';

const STORAGE_KEY = 'ferdowsi-automations';

function loadOverrides() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return {};
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing automations state from localStorage:', e);
    return {};
  }
}

export function useAutomationsState() {
  const [overrides, setOverrides] = useState(loadOverrides);

  const automations = useMemo(
    () => baseAutomations.map((a) => ({ ...a, ...(overrides[a.id] || {}) })),
    [overrides]
  );

  const toggleAutomation = useCallback((id) => {
    setOverrides((prev) => {
      const base = baseAutomations.find((a) => a.id === id);
      const current = { ...base, ...(prev[id] || {}) };
      const next = { ...prev, [id]: { ...(prev[id] || {}), enabled: !current.enabled } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { automations, toggleAutomation };
}
