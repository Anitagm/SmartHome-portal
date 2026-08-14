import { useEffect, useState } from 'react';
import { formatTime } from '../utils/localeFormat.js';

export function useClock(timeFormat = 'auto', timezone = 'auto') {
  const [time, setTime] = useState(() => formatTime(new Date(), timeFormat, timezone));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date(), timeFormat, timezone)), 1000);
    return () => clearInterval(id);
  }, [timeFormat, timezone]);

  return time;
}
