export default function GridBalanceBar({ importedKWh, exportedKWh, netKWh }) {
  const total = importedKWh + exportedKWh;

  const headroomLeft = 15;
  const headroomRight = 8;
  const fillable = 100 - headroomLeft - headroomRight;
  const exportedPct = (exportedKWh / total) * fillable;
  const importedPct = fillable - exportedPct;
  const importedCorePct = importedPct * 0.68;
  const importedTailPct = importedPct * 0.32;
  const markerPos = headroomLeft + exportedPct;

  return (
    <div className="card">
      <h3 className="card-title grid-balance-title">
        <svg className="pylon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 2l-5 8h3l-4 8h4l2-4 2 4h4l-4-8h3z"></path>
          <path d="M5 22l4-12M19 22l-4-12"></path>
        </svg>
        Grid energy balance
      </h3>

      <div className="grid-balance-summary">
        <strong>{importedKWh.toLocaleString()} kWh</strong> - <strong>{exportedKWh.toLocaleString()} kWh</strong> = <strong>{netKWh.toLocaleString()} kWh</strong>
      </div>

      <div className="grid-balance-bar">
        <div className="grid-balance-segment headroom" style={{ width: `${headroomLeft}%` }}></div>
        <div className="grid-balance-segment exported" style={{ width: `${exportedPct}%` }}></div>
        <div className="grid-balance-segment imported" style={{ width: `${importedCorePct}%` }}></div>
        <div className="grid-balance-segment headroom" style={{ width: `${importedTailPct + headroomRight}%` }}></div>
        <div className="grid-balance-marker" style={{ left: `${markerPos}%` }}></div>
      </div>
    </div>
  );
}
