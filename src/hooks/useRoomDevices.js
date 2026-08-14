// src/hooks/useRoomDevices.js
import { useCallback, useState } from 'react';
import { rooms as defaultRooms } from '../data/rooms-data.js';

const STORAGE_KEY = 'ferdowsi-room-devices';

function loadRooms() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultRooms;
  try {
    const savedRooms = JSON.parse(saved);
    // Merge onto the shipped room list so newly added rooms/devices in code
    // still show up even if a stale localStorage snapshot exists.
    return defaultRooms.map((room) => {
      const savedRoom = savedRooms.find((r) => r.name === room.name);
      if (!savedRoom) return room;
      return {
        ...room,
        devices: room.devices.map((d) => {
          const savedDevice = savedRoom.devices.find((sd) => sd.label === d.label);
          return savedDevice ? { ...d, on: savedDevice.on } : d;
        })
      };
    });
  } catch (e) {
    console.error('Error parsing room devices from localStorage:', e);
    return defaultRooms;
  }
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useRoomDevices() {
  const [rooms, setRooms] = useState(loadRooms);

  const toggleRoomDevice = useCallback((roomName, deviceLabel) => {
    setRooms((list) => {
      const next = list.map((room) => {
        if (room.name !== roomName) return room;
        return {
          ...room,
          devices: room.devices.map((d) => (d.label === deviceLabel ? { ...d, on: !d.on } : d))
        };
      });
      persist(next);
      return next;
    });
  }, []);

  return { rooms, toggleRoomDevice };
}
