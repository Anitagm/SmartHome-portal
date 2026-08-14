export function buildHistoryAxis(steps = 6, stepHours = 4, now = new Date()) {
  const ticks = [];
  for (let i = steps - 1; i >= 0; i--) {
    ticks.push(new Date(now.getTime() - i * stepHours * 60 * 60 * 1000));
  }
  return ticks.map((t) => {
    const isMidnight = t.getHours() === 0 && t.getMinutes() === 0;
    const label = isMidnight
      ? t.toLocaleDateString([], { month: 'short', day: 'numeric' })
      : t.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return { label, isDate: isMidnight };
  });
}

export function formatRelativeTime(timestamp) {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (diffSec < 60) return `${diffSec} second${diffSec === 1 ? '' : 's'} ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
}
