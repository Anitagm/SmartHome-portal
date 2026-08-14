import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ferdowsi-profile';

const DEFAULT_PROFILE = {
  name: 'Anita .G',
  email: 'anita.g@example.com',
  status: 'home', // 'home' | 'away'
  initials: 'AH'
};

function loadProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...DEFAULT_PROFILE };
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Error parsing profile from localStorage:', e);
    return { ...DEFAULT_PROFILE };
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(loadProfile);

  const updateProfile = useCallback((changes) => {
    setProfile((prev) => {
      const next = { ...prev, ...changes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { profile, updateProfile };
}
