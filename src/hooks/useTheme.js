import { useEffect, useState } from 'react';

export function useTheme() {
  const [isLight, setIsLight] = useState(() => localStorage.getItem('ferdowsi-theme') === 'light');

  useEffect(() => {
    document.body.classList.toggle('light-theme', isLight);
    localStorage.setItem('ferdowsi-theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  const toggleTheme = () => setIsLight((v) => !v);

  return { isLight, toggleTheme };
}
