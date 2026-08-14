import { useRef, useState } from 'react';
import { useFloorplanMarkers } from '../hooks/useFloorplanMarkers.js';
import { useToast } from '../hooks/useToast.jsx';

const MARKER_TYPES = [
  { type: 'camera', label: 'Camera', icon: '📹' },
  { type: 'warning', label: 'Alert', icon: '⚠️' },
  { type: 'light', label: 'Light', icon: '💡' },
  { type: 'garage', label: 'Garage', icon: '🚙' },
  { type: 'doorbell', label: 'Doorbell', icon: '🔔' }
];

function MarkerIcon({ type }) {
  if (type === 'camera') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e5e7eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        <circle cx="12" cy="13" r="3.2" />
      </svg>
    );
  }
  if (type === 'warning') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#f4b942" stroke="#7a5300" strokeWidth="1">
        <path d="M12 2L1 21h22L12 2z" />
        <line x1="12" y1="9" x2="12" y2="14" stroke="#7a5300" strokeWidth="1.8" />
        <circle cx="12" cy="17" r="1" fill="#7a5300" />
      </svg>
    );
  }
  if (type === 'light') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e5e7eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 00-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0012 3z" />
      </svg>
    );
  }
  if (type === 'garage') {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#e5e7eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V10l9-6 9 6v11" />
        <path d="M3 21h18" />
        <path d="M5 11h14M5 14h14M5 17h14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e5e7eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export default function FloorPlanInteractive() {
  const { markers, addMarker, moveMarker, removeMarker, resetMarkers } = useFloorplanMarkers();
  const showToast = useToast();
  const containerRef = useRef(null);

  const [activeCamera, setActiveCamera] = useState(null);
  const [snapshotMissing, setSnapshotMissing] = useState(false);
  const [planMissing, setPlanMissing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState('camera');
  const [draggingId, setDraggingId] = useState(null);

  function clampPercent(v) {
    return Math.min(98, Math.max(2, v));
  }

  function posFromEvent(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = clampPercent(((e.clientX - rect.left) / rect.width) * 100);
    const y = clampPercent(((e.clientY - rect.top) / rect.height) * 100);
    return { x, y };
  }

  function handlePlanClick(e) {
    if (!editMode || draggingId) return;
    const { x, y } = posFromEvent(e);
    addMarker(selectedTool, x, y);
    showToast(`${MARKER_TYPES.find((t) => t.type === selectedTool).label} added`, 'Floor Plan', 'success');
  }

  function startDrag(e, marker) {
    if (!editMode) return;
    e.stopPropagation();
    setDraggingId(marker.id);
  }

  function onPointerMove(e) {
    if (!draggingId) return;
    const { x, y } = posFromEvent(e);
    moveMarker(draggingId, x, y);
  }

  function endDrag() {
    setDraggingId(null);
  }

  return (
    <>
      <div className="section-header">
        <div className="section-title">🏠 Floor Plan</div>
        <button
          type="button"
          className="section-action"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? 'Done ✓' : 'Edit →'}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`floorplan-interactive${editMode ? ' is-editing' : ''}`}
        onClick={handlePlanClick}
        onMouseMove={onPointerMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {planMissing ? (
          <div className="fp-placeholder">
            🏠 Add your floor plan image at<br /><code>public/assets/floorplan.png</code>
          </div>
        ) : (
          <img
            src="/assets/floorplan.png"
            alt="Floor Plan"
            className="fp-plan-img"
            draggable={false}
            onError={() => setPlanMissing(true)}
          />
        )}

        {markers.map((m) => (
          <div
            key={m.id}
            className={`fp-marker fp-marker--${m.type}${m.type === 'camera' ? ' is-active' : ''}`}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            title={m.name || m.label || m.type}
            onMouseDown={(e) => startDrag(e, m)}
            onClick={(e) => {
              if (editMode) return;
              e.stopPropagation();
              if (m.type === 'camera') {
                setSnapshotMissing(false);
                setActiveCamera(m);
              }
            }}
          >
            <MarkerIcon type={m.type} />
            {editMode && (
              <span
                className="fp-marker-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMarker(m.id);
                }}
              >
                &times;
              </span>
            )}
          </div>
        ))}
      </div>

      {editMode ? (
        <div className="fp-editor-bar">
          <span className="fp-editor-hint">Pick a marker, click the plan to place it. Drag to move, × to delete.</span>
          {MARKER_TYPES.map((t) => (
            <button
              key={t.type}
              type="button"
              className={`fp-palette-btn${selectedTool === t.type ? ' is-selected' : ''}`}
              onClick={() => setSelectedTool(t.type)}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <div className="fp-editor-actions">
            <button type="button" className="fp-palette-btn" onClick={resetMarkers}>Reset</button>
          </div>
        </div>
      ) : (
        <div className="floorplan-legend">
          <div className="legend-item"><span className="legend-dot active"></span> Lights ON</div>
          <div className="legend-item"><span className="legend-dot away"></span> Away mode</div>
          <div className="legend-item"><span className="legend-dot security"></span> Camera active</div>
        </div>
      )}

      {activeCamera && (
        <div className="modal-overlay is-open" onClick={(e) => { if (e.target === e.currentTarget) setActiveCamera(null); }}>
          <div className="modal-content camera-lightbox" role="dialog" aria-modal="true">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="modal-title">📹 {activeCamera.name}</h2>
              <button className="modal-close" aria-label="Close" type="button" onClick={() => setActiveCamera(null)}>&times;</button>
            </div>
            {snapshotMissing ? (
              <div className="fp-placeholder fp-placeholder--tall">
                📷 Add this camera's snapshot at<br /><code>public{activeCamera.image}</code>
              </div>
            ) : (
              <img
                src={activeCamera.image}
                alt={activeCamera.name}
                className="camera-lightbox-img"
                onError={() => setSnapshotMissing(true)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
