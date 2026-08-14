// src/hooks/useLivePower.js
// Simulates a live power feed (kW) for the Energy "Now" view, the way a real
// Home Assistant instance would stream sensor updates. There's no backend
// here, so values do a small bounded random walk every tick instead.
import { useEffect, useRef, useState } from 'react';

const HISTORY_LENGTH = 30;
const TICK_MS = 2000;

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function jitter(value, delta, min, max) {
  return clamp(value + (Math.random() - 0.5) * delta, min, max);
}

function buildSeed() {
  // solar: generation (>=0). battery: +discharging / -charging.
  // grid: +importing / -exporting. home: total demand (>=0).
  return { solar: 2.4, battery: -0.6, batterySoC: 62, grid: 0.9, home: 2.7 };
}

export function useLivePower() {
  const [now, setNow] = useState(buildSeed);
  const [history, setHistory] = useState(() => {
    const seed = buildSeed();
    return Array.from({ length: HISTORY_LENGTH }, (_, i) => ({ tick: i - HISTORY_LENGTH + 1, ...seed }));
  });
  const stateRef = useRef(now);
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const prev = stateRef.current;
      const solar = jitter(prev.solar, 0.6, 0, 5.5);
      const battery = jitter(prev.battery, 0.35, -2, 2);
      const batterySoC = clamp(prev.batterySoC + (battery > 0 ? -0.15 : 0.1), 5, 100);
      const home = jitter(prev.home, 0.5, 0.8, 4.5);
      const grid = clamp(home - solar - battery, -3, 4);

      const next = { solar, battery, batterySoC, grid, home };
      stateRef.current = next;
      tickRef.current += 1;
      setNow(next);
      setHistory((h) => [...h.slice(1), { tick: tickRef.current, ...next }]);
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  return { now, history, tickSeconds: TICK_MS / 1000 };
}
