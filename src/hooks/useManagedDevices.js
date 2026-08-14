import { useCallback, useState } from 'react';
import { devices as defaultDevices } from '../data/dashboard-data.js';

const STORAGE_KEY = 'ferdowsi-devices';

function loadDevices() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [...defaultDevices];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing devices from localStorage:', e);
    return [...defaultDevices];
  }
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useManagedDevices() {
  const [devices, setDevices] = useState(loadDevices);

  const toggleDevice = useCallback((idx) => {
    setDevices((list) => {
      const next = list.map((d, i) => (i === idx ? { ...d, state: d.state === 'on' ? 'off' : 'on' } : d));
      persist(next);
      return next;
    });
  }, []);

  const setDim = useCallback((idx, val) => {
    setDevices((list) => {
      const next = list.map((d, i) => (i === idx ? { ...d, dim: val } : d));
      persist(next);
      return next;
    });
  }, []);

  const addDevice = useCallback((device) => {
    setDevices((list) => {
      const next = [...list, device];
      persist(next);
      return next;
    });
  }, []);

  const deleteDevice = useCallback((idx) => {
    setDevices((list) => {
      const next = list.filter((_, i) => i !== idx);
      persist(next);
      return next;
    });
  }, []);

  const applyChanges = useCallback((changes) => {
    setDevices((list) => {
      const next = list.map((d) => {
        const change = changes.find((c) => c.name === d.name);
        if (!change) return d;
        return { ...d, state: change.state, ...(change.dim !== undefined ? { dim: change.dim } : {}) };
      });
      persist(next);
      return next;
    });
  }, []);

  return { devices, toggleDevice, setDim, addDevice, deleteDevice, applyChanges };
}
