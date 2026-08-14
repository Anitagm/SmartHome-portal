import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ferdowsi-localization';

const DEFAULT_LOCALIZATION = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  numberFormat: 'auto',
  timeFormat: 'auto',
  dateFormat: 'auto',
  firstDayOfWeek: 'auto'
};

function loadLocalization() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...DEFAULT_LOCALIZATION };
  try {
    return { ...DEFAULT_LOCALIZATION, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Error parsing localization settings from localStorage:', e);
    return { ...DEFAULT_LOCALIZATION };
  }
}

export function useLocalization() {
  const [localization, setLocalization] = useState(loadLocalization);

  const updateLocalization = useCallback((changes) => {
    setLocalization((prev) => {
      const next = { ...prev, ...changes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { localization, updateLocalization };
}
