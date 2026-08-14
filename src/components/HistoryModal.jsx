import { useEffect, useState } from 'react';
import { formatRelativeTime, buildHistoryAxis } from '../utils/relativeTime.js';

export default function HistoryModal({ data, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  if (!data) return null;

  const axis = buildHistoryAxis();

  return (
    <div className={`modal-overlay${visible ? ' is-open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-content history-modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
        <div className="history-modal-header">
          <button className="modal-close" aria-label="Close modal" type="button" onClick={handleClose}>&times;</button>
          <h2 id="modal-title" className="modal-title">{data.title}</h2>
        </div>

        <div className="history-info-row">
          <div className="history-info-icon">{data.icon}</div>
          <div className="history-info-text">
            <div className="history-info-title">{data.title}</div>
            <div className="history-info-time">{formatRelativeTime(data.timestamp)}</div>
          </div>
          <div className="history-info-value">{data.value}</div>
        </div>

        <h3 className="history-section-title">History</h3>

        <div className="history-single-bar" style={{ background: data.color }}>
          <span>{data.value}</span>
        </div>

        <div className="history-axis">
          {axis.map((tick, i) => (
            <span key={i} className={tick.isDate ? 'is-date' : ''}>{tick.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
