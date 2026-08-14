import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useClock } from '../hooks/useClock.js';
import { useToast } from '../hooks/useToast.jsx';

const QUICK_ACTIONS = [
  { icon: '▣', label: 'Add device' },
  { icon: '⚙', label: 'Create automation' },
  { icon: '▭', label: 'Create area' },
  { icon: '👤', label: 'Add person' }
];

export default function Topbar() {
  const { setSidebarOpen, isLight, toggleTheme, localization } = useOutletContext();
  const clock = useClock(localization.timeFormat, localization.timezone);
  const showToast = useToast();
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const quickAddRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) {
        setQuickMenuOpen(false);
      }
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  return (
    <div className="topbar">
      <button className="tb-btn" type="button" aria-label="Open menu" onClick={() => setSidebarOpen((v) => !v)}>
        <svg viewBox="0 0 24 24">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div>
        <span className="page-title">Dashboard</span>
        <span className="page-sub">— Good evening, Anita</span>
      </div>

      <div className="topbar-right">
        <div className="weather-chip">☁️ <span>18°C</span> — Frankfurt</div>
        <div className="time-chip">{clock}</div>

        <div className="quick-add" ref={quickAddRef}>
          <button
            className="tb-btn quick-add-btn"
            type="button"
            aria-label="Quick add"
            onClick={() => setQuickMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <div className={`quick-add-menu${quickMenuOpen ? ' is-open' : ''}`}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  showToast(action.label, 'Quick Action', 'info');
                  setQuickMenuOpen(false);
                }}
              >
                <span className="qa-icon">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <button className="tb-btn" type="button" aria-label="Toggle theme" onClick={toggleTheme}>
          <svg viewBox="0 0 24 24">
            {isLight ? (
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            ) : (
              <>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
              </>
            )}
          </svg>
        </button>

        <button
          className="tb-btn"
          type="button"
          aria-label="Refresh data"
          onClick={() => showToast('Dashboard data refreshed', 'Refresh', 'success')}
        >
          <svg viewBox="0 0 24 24">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
