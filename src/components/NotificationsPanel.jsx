import { formatRelativeTime } from '../utils/relativeTime.js';

export default function NotificationsPanel({ open, notifications, onDismiss, onClose }) {
  return (
    <>
      <div className={`overlay${open ? ' is-visible' : ''}`} onClick={onClose}></div>

      <aside className={`notifications-panel${open ? ' is-open' : ''}`}>
        <div className="notifications-panel-header">
          <h2>Notifications</h2>
          <button type="button" className="notifications-panel-close" onClick={onClose} aria-label="Close">
            ‹
          </button>
        </div>

        <div className="notifications-panel-body">
          {notifications.length === 0 ? (
            <p className="notifications-empty">No new notifications.</p>
          ) : (
            notifications.map((n) => (
              <div className="notification-card" key={n.id}>
                <h3>{n.title}</h3>
                <p>{n.message}</p>
                <div className="notification-card-footer">
                  <span className="notification-time">{formatRelativeTime(n.timestamp)}</span>
                  <button type="button" className="text-link" onClick={() => onDismiss(n.id)}>
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
