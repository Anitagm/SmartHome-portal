import { networkStats } from '../data/network-data.js';

export default function NetworkCard() {
  const n = networkStats;
  const storagePercent = Math.round((n.nas.storageUsedGB / n.nas.storageTotalGB) * 100);

  return (
    <div>
      <div className="network-stat-row">
        <span>🛡️ Ads blocked today</span>
        <strong>{n.adsBlockedToday.toLocaleString()}</strong>
      </div>
      <div className="network-bar">
        <div className="network-bar-fill" style={{ width: `${n.adsBlockedPercent}%` }}></div>
      </div>

      <div className="network-stat-row">
        <span><span className={`status-dot ${n.router.status}`}></span> {n.router.name}</span>
        <strong>{n.router.connectedDevices} devices</strong>
      </div>

      {n.accessPoints.map((ap) => (
        <div className="network-stat-row" key={ap.name}>
          <span><span className={`status-dot ${ap.status}`}></span> {ap.name}</span>
          <strong>{ap.status === 'online' ? 'Online' : 'Offline'}</strong>
        </div>
      ))}

      <div className="network-stat-row">
        <span><span className={`status-dot ${n.nas.status}`}></span> {n.nas.name}</span>
        <strong>{storagePercent}% used</strong>
      </div>
      <div className="network-bar">
        <div className="network-bar-fill storage" style={{ width: `${storagePercent}%` }}></div>
      </div>

      <div className="network-stat-row">
        <span>🌐 Internet</span>
        <strong>↓ {n.internet.downMbps} Mbps / ↑ {n.internet.upMbps} Mbps</strong>
      </div>
    </div>
  );
}
