import { cameras } from '../data/security-data.js';
import { useToast } from '../hooks/useToast.jsx';
import { useState } from 'react';

const STATUS_LABELS = {
  disarmed: 'Disarmed',
  'armed-home': 'Armed Home',
  'armed-away': 'Armed Away'
};

export default function SecurityCard({ securityState, setStatus }) {
  const showToast = useToast();
  const [cameraStatus, setCameraStatus] = useState(() => Object.fromEntries(cameras.map((c) => [c.id, 'idle'])));

  function handleSetStatus(status, label) {
    setStatus(status, label);
    showToast(`Security ${label.toLowerCase()}`, 'Security', 'info');
  }

  function toggleCamera(id) {
    setCameraStatus((prev) => ({ ...prev, [id]: prev[id] === 'live' ? 'idle' : 'live' }));
  }

  function formatTimestamp(iso) {
    return new Date(iso).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title">Security & Cameras</h3>
        <div className={`badge-status${securityState.status !== 'disarmed' ? ' armed' : ''}`}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"></path>
          </svg>
          {STATUS_LABELS[securityState.status] || 'Disarmed'}
        </div>
      </div>

      <div className="card-actions" style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="action-btn" type="button" onClick={() => handleSetStatus('armed-home', 'Armed Home')}>Arm home</button>
        <button className="action-btn" type="button" onClick={() => handleSetStatus('armed-away', 'Armed Away')}>Arm away</button>
        <button className="action-btn" type="button" onClick={() => handleSetStatus('disarmed', 'Disarmed')}>Disarm</button>
      </div>

      <div className="camera-grid">
        {cameras.map((cam) => (
          <div key={cam.id} className="camera-tile" style={{ '--cam-color': cam.color }} onClick={() => toggleCamera(cam.id)}>
            <span className={`cam-status-dot ${cameraStatus[cam.id]}`}></span>
            <span className="cam-name">{cam.name}</span>
            <span className="cam-state-label">{cameraStatus[cam.id] === 'live' ? 'Live' : 'Idle'}</span>
          </div>
        ))}
      </div>

      <ul className="arm-history-list">
        {securityState.history.length === 0 ? (
          <li className="arm-history-row empty">No recent activity</li>
        ) : (
          securityState.history.map((entry, i) => (
            <li className="arm-history-row" key={i}>
              <span className="row-label">{entry.action}</span>
              <span className="row-value">{formatTimestamp(entry.timestamp)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
