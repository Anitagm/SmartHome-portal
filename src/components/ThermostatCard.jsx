import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../hooks/useToast.jsx';
import { useNotifications } from '../hooks/useNotifications.jsx';

const MIN_TEMP = 15;
const MAX_TEMP = 30;
const CX = 150, CY = 150, R = 110;

// Both arms share one fixed anchor at the bottom of the circle (180°) —
// that's where orange and blue always meet, regardless of the setpoints.
// The heat arm sweeps up the LEFT half (180° -> 360°) as heatTemp rises;
// the cool arm sweeps up the RIGHT half (180° -> 0°) as coolTemp rises.
// Together the two arms always trace a full, unbroken circle.
const ANCHOR_ANGLE = 180;

function polar(angleDeg, radius = R) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.sin(a), y: CY - radius * Math.cos(a) };
}

function heatAngle(t) {
  const percent = (t - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  return ANCHOR_ANGLE + percent * 180; // 180 (bottom) -> 360 (top), via the left side
}

function coolAngle(t) {
  const percent = (t - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  return ANCHOR_ANGLE - percent * 180; // 180 (bottom) -> 0 (top), via the right side
}

// Inverse of heatAngle(): a raw pointer angle (0-360, 0 = top, clockwise)
// only makes sense for the heat arm between 180 and 360. Angles outside
// that range come from dragging past the anchor or the top — snap them
// to whichever end of the arm they're closest to.
function angleToHeatTemp(rawAngle) {
  let a = rawAngle;
  if (a < 180) a = a <= 90 ? 360 : 180;
  const percent = (a - 180) / 180;
  return MIN_TEMP + percent * (MAX_TEMP - MIN_TEMP);
}

function angleToCoolTemp(rawAngle) {
  let a = rawAngle;
  if (a > 180) a = a <= 270 ? 180 : 360;
  if (a === 360) a = 0;
  const percent = (180 - a) / 180;
  return MIN_TEMP + percent * (MAX_TEMP - MIN_TEMP);
}

function describeArc(startAngle, endAngle) {
  const start = polar(startAngle);
  const end = polar(endAngle);
  const sweep = Math.abs(endAngle - startAngle);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M${start.x},${start.y} A${R},${R} 0 ${largeArc} 1 ${end.x},${end.y}`;
}

function pointerAngle(clientX, clientY, rect) {
  const scale = rect.width / 300;
  const x = (clientX - rect.left) / scale - CX;
  const y = (clientY - rect.top) / scale - CY;
  let deg = (Math.atan2(x, -y) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export default function ThermostatCard({ name = 'Upstairs', currentTemp = 22 }) {
  const [heatTemp, setHeatTemp] = useState(20);
  const [coolTemp, setCoolTemp] = useState(24);
  const [selected, setSelected] = useState('cool');
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);
  const heatTempRef = useRef(heatTemp);
  const coolTempRef = useRef(coolTemp);
  const showToast = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => { heatTempRef.current = heatTemp; }, [heatTemp]);
  useEffect(() => { coolTempRef.current = coolTemp; }, [coolTemp]);

  const status = currentTemp < heatTemp ? 'Heating' : currentTemp > coolTemp ? 'Cooling' : 'Idle';

  function notifySetpoint(side, value) {
    addNotification(
      'Thermostat',
      `${name}: ${side === 'heat' ? 'heat' : 'cool'} setpoint changed to ${value.toFixed(1)}°C`
    );
  }

  const startDrag = (side) => (e) => {
    e.preventDefault();
    setSelected(side);
    setDragging(side);
  };

  const onMove = useCallback((e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rawAngle = pointerAngle(clientX, clientY, rect);

    if (dragging === 'heat') {
      const t = Math.round(angleToHeatTemp(rawAngle) * 2) / 2;
      setHeatTemp((prev) => (t < coolTemp - 0.5 ? t : prev));
    } else {
      const t = Math.round(angleToCoolTemp(rawAngle) * 2) / 2;
      setCoolTemp((prev) => (t > heatTemp + 0.5 ? t : prev));
    }
  }, [dragging, coolTemp, heatTemp]);

  const endDrag = useCallback(() => {
    if (dragging === 'heat') {
      notifySetpoint('heat', heatTempRef.current);
    } else if (dragging === 'cool') {
      notifySetpoint('cool', coolTempRef.current);
    }
    setDragging(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', endDrag);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', endDrag);
    };
  }, [dragging, onMove, endDrag]);

  function adjust(delta) {
    if (selected === 'heat') {
      const next = Math.min(coolTemp - 0.5, Math.max(MIN_TEMP, Math.round((heatTemp + delta) * 2) / 2));
      setHeatTemp(next);
      notifySetpoint('heat', next);
    } else {
      const next = Math.max(heatTemp + 0.5, Math.min(MAX_TEMP, Math.round((coolTemp + delta) * 2) / 2));
      setCoolTemp(next);
      notifySetpoint('cool', next);
    }
    showToast(`${name} ${selected === 'heat' ? 'heat' : 'cool'} setpoint adjusted`, 'Thermostat', 'info');
  }

  const heatA = heatAngle(heatTemp);
  const coolA = coolAngle(coolTemp);
  const heatPos = polar(heatA);
  const coolPos = polar(coolA);
  const [heatWhole, heatFrac] = heatTemp.toFixed(1).split('.');
  const [coolWhole, coolFrac] = coolTemp.toFixed(1).split('.');

  const statusIcon = status === 'Heating' ? '🔥' : status === 'Cooling' ? '❄️' : '🟢';

  return (
    <div className="card thermostat-card">
      <div className="thermostat-header">
        <h3 className="card-title">{name}</h3>
        <span className="thermostat-menu">⋮</span>
      </div>

      <div className="thermostat-dial-wrap">
        <svg ref={svgRef} viewBox="0 0 300 300" className="thermostat-dial">
          <defs>
            <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb84d" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>
            <linearGradient id="coolGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6ea8fe" />
              <stop offset="100%" stopColor="#8fd3fe" />
            </linearGradient>
            <filter id="dialGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* full, unbroken background track */}
          <circle cx={CX} cy={CY} r={R} className="dial-track" />

          {/* two arms, both anchored at the fixed bottom meeting point */}
          <path d={describeArc(ANCHOR_ANGLE, heatA)} className="dial-arc dial-arc--heat" filter="url(#dialGlow)" />
          <path d={describeArc(coolA, ANCHOR_ANGLE)} className="dial-arc dial-arc--cool" filter="url(#dialGlow)" />

          <g
            className={`dial-handle-group${dragging === 'heat' ? ' is-dragging' : ''}`}
            onMouseDown={startDrag('heat')}
            onTouchStart={startDrag('heat')}
          >
            <circle cx={heatPos.x} cy={heatPos.y} r="18" className="dial-handle-halo dial-handle-halo--heat" />
            <circle
              cx={heatPos.x}
              cy={heatPos.y}
              r="12"
              className={`dial-handle dial-handle--heat${selected === 'heat' ? ' is-selected' : ''}`}
            />
          </g>
          <g
            className={`dial-handle-group${dragging === 'cool' ? ' is-dragging' : ''}`}
            onMouseDown={startDrag('cool')}
            onTouchStart={startDrag('cool')}
          >
            <circle cx={coolPos.x} cy={coolPos.y} r="18" className="dial-handle-halo dial-handle-halo--cool" />
            <circle
              cx={coolPos.x}
              cy={coolPos.y}
              r="12"
              className={`dial-handle dial-handle--cool${selected === 'cool' ? ' is-selected' : ''}`}
            />
          </g>
        </svg>

        <div className="thermostat-center">
          <div className={`thermostat-status${status === 'Heating' ? ' is-heating' : ''}${status === 'Cooling' ? ' is-cooling' : ''}`}>
            <span className="thermostat-status-icon">{statusIcon}</span> {status}
          </div>
          <div className="thermostat-values">
            <span className={`thermostat-val thermostat-val--heat${selected === 'heat' ? ' is-selected' : ''}`} onClick={() => setSelected('heat')}>
              {heatWhole}<sup>°C</sup><small>.{heatFrac}</small>
            </span>
            <span className={`thermostat-val thermostat-val--cool${selected === 'cool' ? ' is-selected' : ''}`} onClick={() => setSelected('cool')}>
              {coolWhole}<sup>°C</sup><small>.{coolFrac}</small>
            </span>
          </div>
          <div className="thermostat-current">🌡️ {currentTemp} °C now</div>
        </div>
      </div>

      <div className="thermostat-controls">
        <button type="button" className="thermostat-btn" onClick={() => adjust(-0.5)} aria-label="Decrease">−</button>
        <div className="thermostat-controls-label">
          Adjusting <strong>{selected === 'heat' ? 'Heat' : 'Cool'}</strong>
        </div>
        <button type="button" className="thermostat-btn" onClick={() => adjust(0.5)} aria-label="Increase">+</button>
      </div>
    </div>
  );
}
