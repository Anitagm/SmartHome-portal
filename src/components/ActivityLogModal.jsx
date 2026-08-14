import { useEffect, useState } from 'react';
import { formatRelativeTime } from '../utils/relativeTime.js';
import { useNotifications } from '../hooks/useNotifications.jsx';

export default function ActivityLogModal({ open, onClose, activities }) {
  const [visible, setVisible] = useState(false);
  const { notifications } = useNotifications();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setVisible(true), 10);

    function onKeyDown(e) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  if (!open) return null;

  // Live entries (every device/thermostat/room change pushed via
  // addNotification) plus the curated seed activities, newest first — this
  // is the actual "log" behind the short preview list on the dashboard.
  const liveEntries = notifications.map((n) => ({
    icon: '🔔',
    color: 'var(--accent-dim)',
    title: n.title,
    sub: n.message,
    time: formatRelativeTime(n.timestamp),
    timestamp: n.timestamp
  }));
  const seedEntries = activities.map((a, i) => ({ ...a, timestamp: Date.now() - (i + 1) * 60 * 60 * 1000 }));
  const combined = [...liveEntries, ...seedEntries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className={`modal-overlay${visible ? ' is-open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="activity-log-title" tabIndex={-1}>
        <button className="modal-close" aria-label="Close modal" type="button" onClick={handleClose}>&times;</button>
        <h2 id="activity-log-title" className="modal-title">Activity log</h2>

        <div className="activity-list" style={{ marginTop: 18 }}>
          {combined.length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No activity yet.</p>
          ) : (
            combined.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-avi" style={{ background: a.color }}>
                  <span>{a.icon}</span>
                </div>
                <div className="activity-text">
                  <div className="activity-title">{a.title}</div>
                  <div className="activity-sub">{a.sub}</div>
                </div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
