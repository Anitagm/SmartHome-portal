import { useCallback, useState } from 'react';
import { floorplanMarkers as defaultMarkers } from '../data/floorplan-markers.js';

const STORAGE_KEY = 'ferdowsi-floorplan-markers';

function loadMarkers() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [...defaultMarkers];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing floor plan markers from localStorage:', e);
    return [...defaultMarkers];
  }
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let nextId = 1;

export function useFloorplanMarkers() {
  const [markers, setMarkers] = useState(loadMarkers);

  const addMarker = useCallback((type, x, y) => {
    setMarkers((list) => {
      const marker = {
        id: `custom-${Date.now()}-${nextId++}`,
        type,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        ...(type === 'camera' ? { name: 'New Camera', image: '/assets/cameras/new-camera.jpg' } : {}),
        ...(type === 'warning' ? { label: 'New alert' } : {})
      };
      const next = [...list, marker];
      persist(next);
      return next;
    });
  }, []);

  const moveMarker = useCallback((id, x, y) => {
    setMarkers((list) => {
      const next = list.map((m) => (m.id === id ? { ...m, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } : m));
      persist(next);
      return next;
    });
  }, []);

  const removeMarker = useCallback((id) => {
    setMarkers((list) => {
      const next = list.filter((m) => m.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const resetMarkers = useCallback(() => {
    setMarkers([...defaultMarkers]);
    persist(defaultMarkers);
  }, []);

  return { markers, addMarker, moveMarker, removeMarker, resetMarkers };
}
