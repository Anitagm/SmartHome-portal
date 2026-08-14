import { useToast } from '../hooks/useToast.jsx';

// Mirrors the sticky date-range control at the bottom of Home Assistant's
// Energy dashboard. The demo data only covers one fixed 12-month window, so
// prev/next just acknowledge the click instead of pretending to load data
// that doesn't exist.
export default function EnergyPeriodBar({ rangeLabel = 'Sep–Aug', yearLabel = '2025–2026' }) {
  const showToast = useToast();

  function notAvailable() {
    showToast('Only the current period is available in this demo', 'Energy', 'info');
  }

  return (
    <div className="energy-period-bar">
      <button type="button" className="energy-period-info" onClick={notAvailable}>
        <span className="energy-period-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="17" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="16" y1="2" x2="16" y2="6"></line>
          </svg>
        </span>
        <span>
          <div className="energy-period-range">{rangeLabel}</div>
          <div className="energy-period-year">{yearLabel}</div>
        </span>
      </button>

      <div className="energy-period-controls">
        <button type="button" className="energy-period-now" aria-pressed="true">Now</button>
        <button type="button" className="energy-period-nav" aria-label="Previous period" onClick={notAvailable}>‹</button>
        <button type="button" className="energy-period-nav" aria-label="Next period" onClick={notAvailable}>›</button>
        <button type="button" className="energy-period-nav" aria-label="More options" onClick={notAvailable}>⋮</button>
      </div>
    </div>
  );
}
