export default function DevicesGrid({ devices, onToggle, onDim }) {
  return (
    <div className="devices-grid">
      {devices.map((d, i) => (
        <div
          key={d.name}
          className={`device-card${d.state === 'on' ? ' is-active on' : ''}`}
          tabIndex={0}
          onClick={(e) => {
            if (e.target.closest('[data-stop-propagation]')) return;
            onToggle(i);
          }}
        >
          <div className="device-ico">{d.icon}</div>
          <div className="device-label device-name">{d.name}</div>
          <div className="device-state">{d.state === 'on' ? 'Active' : 'Inactive'}</div>
          {d.control === 'dimmer' || d.dim != null ? (
            <div className="slider-row" data-stop-propagation="true">
              <input
                type="range"
                min="0"
                max="100"
                value={Number(d.dim ?? 80)}
                onChange={(e) => onDim(i, Number(e.target.value))}
              />
              <span>{Number(d.dim ?? 80)}%</span>
            </div>
          ) : (
            <div className={`toggle-pill${d.state === 'on' ? ' on' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}
