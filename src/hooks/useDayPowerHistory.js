// src/hooks/useDayPowerHistory.js
// Builds a full "today" timeline (00:00 → 23:55 in 5-minute buckets) for the
// Energy → Now power chart, the same way Home Assistant's real Energy "Now"
// card works: the x-axis always spans the whole day, buckets before the
// current time are filled with (simulated) history, the current bucket
// tracks the live reading, and everything after "now" is left blank.
import { useMemo } from 'react';

const STEP_MIN = 5;
const POINTS_PER_DAY = (24 * 60) / STEP_MIN; // 288
export const TICK_INDEXES = [0, 48, 96, 144, 192, 240]; // every 4 hours

function seededNoise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function solarAt(hour) {
  const daylight = Math.max(0, Math.sin(((hour - 6) / 14) * Math.PI));
  return daylight * (3.5 + seededNoise(hour * 3.1) * 1.5);
}

function buildHistoricalBucket(index) {
  const hour = (index * STEP_MIN) / 60;
  const solar = solarAt(hour);
  const isSpike = seededNoise(index * 7.7) > 0.72;
  const home = 4 + (isSpike ? seededNoise(index * 3.3) * 26 : seededNoise(index * 1.9) * 6);
  const battery = (seededNoise(index * 5.5) - 0.4) * 3;
  const grid = home - solar - battery;
  // The "Consumption" line comes from a separate utility-meter-style
  // reading, so it doesn't perfectly reconcile with solar+battery+grid —
  // nudge it a little so the dashed line stays visible above/below the
  // stacked areas instead of tracing exactly on top of them.
  const consumption = Math.max(home * (1 + (seededNoise(index * 9.1) - 0.5) * 0.12), 0.1);
  return { solar: Math.max(solar, 0), battery, grid, home: consumption };
}

export function useDayPowerHistory(now) {
  const dayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Deterministic — computed once so scrolling/re-rendering doesn't make
  // the "historical" part of the line jump around.
  const history = useMemo(
    () => Array.from({ length: POINTS_PER_DAY }, (_, i) => buildHistoricalBucket(i)),
    []
  );

  const timeLabels = useMemo(
    () => Array.from({ length: POINTS_PER_DAY }, (_, i) => {
      const t = new Date(dayStart.getTime() + i * STEP_MIN * 60000);
      return t.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }),
    [dayStart]
  );

  const dayLabel = useMemo(
    () => dayStart.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    [dayStart]
  );

  const nowIndex = Math.min(
    POINTS_PER_DAY - 1,
    Math.max(0, Math.floor((Date.now() - dayStart.getTime()) / (STEP_MIN * 60000)))
  );

  // Everything up to "now" is real (simulated) data, the current bucket
  // mirrors the live reading, and the rest of the day is left blank.
  const buckets = history.map((b, i) => {
    if (i < nowIndex) return b;
    if (i === nowIndex) return { solar: now.solar, battery: now.battery, grid: now.grid, home: now.home };
    return null;
  });

  return { buckets, timeLabels, dayLabel, nowIndex, tickIndexes: TICK_INDEXES };
}
