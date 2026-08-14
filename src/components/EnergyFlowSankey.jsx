import { useMemo, useRef, useState } from 'react';

const BAR_W = 14;
const VIEW_W = 1040;
const X_LEFT = 20, X_MID = 430, X_RIGHT = 800;
const H = 480;

function ribbon(x1, y1top, y1bot, x2, y2top, y2bot) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1top} C${mx},${y1top} ${mx},${y2top} ${x2},${y2top} ` +
    `L${x2},${y2bot} C${mx},${y2bot} ${mx},${y1bot} ${x1},${y1bot} Z`;
}

// Stacks a column of nodes top-to-bottom, sized proportionally to each
// node's total value, and returns their y-ranges plus the px-per-unit scale
// used for that column (each column gets its own scale so it always fills
// the available height regardless of how big its total is).
function layoutColumn(order, totals, x, gap) {
  const totalValue = order.reduce((sum, name) => sum + totals[name], 0) || 1;
  const totalGap = gap * (order.length - 1);
  const scale = (H - 40 - totalGap) / totalValue;

  const nodes = {};
  let y = 20;
  order.forEach((name) => {
    const h = Math.max(totals[name] * scale, 6);
    nodes[name] = { x, y0: y, y1: y + h, h };
    y += h + gap;
  });
  return { nodes, scale };
}

// Draws one ribbon per flow, advancing a running cursor on both the source
// and target node so consecutive flows stack without overlapping.
function buildRibbons(flows, leftNodes, rightNodes, prefix) {
  const leftCursor = {};
  const rightCursor = {};
  return flows.map((f, i) => {
    const from = leftNodes[f.from];
    const to = rightNodes[f.to];
    if (leftCursor[f.from] === undefined) leftCursor[f.from] = from.y0;
    if (rightCursor[f.to] === undefined) rightCursor[f.to] = to.y0;

    const ly0 = leftCursor[f.from];
    const ly1 = ly0 + f.value * f.leftScale;
    leftCursor[f.from] = ly1;

    const ry0 = rightCursor[f.to];
    const ry1 = ry0 + f.value * f.rightScale;
    rightCursor[f.to] = ry1;

    return {
      id: `${prefix}-${i}`,
      from: f.from,
      to: f.to,
      value: f.value,
      color: f.color,
      path: ribbon(from.x + BAR_W, ly0, ly1, to.x, ry0, ry1)
    };
  });
}

function formatValue(value, unit) {
  if (unit === 'W') return `${Math.round(value * 1000)} W`;
  return `${value.toFixed(2)} ${unit}`;
}

/**
 * battery/gridImport/solar/solarExport are the instantaneous or daily
 * amounts feeding "Home" (same unit throughout — kWh for a daily summary,
 * kW for a live snapshot). `unit` only controls how values are displayed
 * in the hover tooltip ('kWh', 'kW', or 'W').
 */
export default function EnergyFlowSankey({ battery, gridImport, solar, solarExport, deviceTotals = [], unit = 'kWh' }) {
  const [hoverId, setHoverId] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const wrapRef = useRef(null);

  const layout = useMemo(() => {
    const safeBattery = Math.max(battery, 0.02);
    const safeGridImport = Math.max(gridImport, 0.02);
    const safeSolar = Math.max(solar, 0.02);
    const safeSolarExport = Math.max(Math.min(solarExport, safeSolar), 0.02);
    const solarToHome = Math.max(safeSolar - safeSolarExport, 0.02);
    const homeTotal = safeBattery + safeGridImport + solarToHome;

    // Devices only account for a slice of total home usage — the rest is
    // "Untracked consumption", same as a real Home Assistant energy dashboard.
    const trackedShare = 0.32;
    const deviceValueTotal = deviceTotals.reduce((sum, d) => sum + d.kwh, 0) || 1;
    const devices = deviceTotals.map((d) => ({
      name: d.name,
      value: Math.max((d.kwh / deviceValueTotal) * homeTotal * trackedShare, 0.02)
    }));
    const trackedTotal = devices.reduce((sum, d) => sum + d.value, 0);
    const untracked = Math.max(homeTotal - trackedTotal, 0.02);

    const leftOrder = ['Battery', 'Grid', 'Solar'];
    const leftTotals = { Battery: safeBattery, Grid: safeGridImport, Solar: safeSolar };
    const { nodes: leftNodes, scale: leftScale } = layoutColumn(leftOrder, leftTotals, X_LEFT, 14);

    const midOrder = ['Home', 'GridExport'];
    const midTotals = { Home: homeTotal, GridExport: safeSolarExport };
    const { nodes: midNodes, scale: midScale } = layoutColumn(midOrder, midTotals, X_MID, 14);

    const rightOrder = [...devices.map((d) => d.name), 'Untracked consumption'];
    const rightTotals = { 'Untracked consumption': untracked };
    devices.forEach((d) => { rightTotals[d.name] = d.value; });
    const { nodes: rightNodes, scale: rightScale } = layoutColumn(rightOrder, rightTotals, X_RIGHT, 12);

    const leftToMidFlows = buildRibbons(
      [
        { from: 'Battery', to: 'Home', value: safeBattery, color: '#55d187', leftScale, rightScale: midScale },
        { from: 'Grid', to: 'Home', value: safeGridImport, color: '#6ea8fe', leftScale, rightScale: midScale },
        { from: 'Solar', to: 'Home', value: solarToHome, color: '#f4b942', leftScale, rightScale: midScale },
        { from: 'Solar', to: 'GridExport', value: safeSolarExport, color: '#f4b942', leftScale, rightScale: midScale }
      ],
      leftNodes,
      midNodes,
      'flow-l'
    );

    const midToRightFlows = buildRibbons(
      [
        ...devices.map((d, i) => ({
          from: 'Home', to: d.name, value: d.value,
          color: ['#6ea8fe', '#f4b942', '#f27676', '#55d187', '#a78bfa', '#38c7c2'][i % 6],
          leftScale: midScale, rightScale
        })),
        { from: 'Home', to: 'Untracked consumption', value: untracked, color: '#94a3b8', leftScale: midScale, rightScale }
      ],
      midNodes,
      rightNodes,
      'flow-r'
    );

    const nodeColor = {
      Battery: '#55d187', Grid: '#6ea8fe', Solar: '#f4b942',
      Home: '#38c7c2', GridExport: '#a78bfa',
      'Untracked consumption': '#94a3b8'
    };
    devices.forEach((d, i) => {
      nodeColor[d.name] = ['#6ea8fe', '#f4b942', '#f27676', '#55d187', '#a78bfa', '#38c7c2'][i % 6];
    });

    const nodeLabel = { GridExport: 'Grid' };

    return { leftNodes, midNodes, rightNodes, leftToMidFlows, midToRightFlows, nodeColor, nodeLabel };
  }, [battery, gridImport, solar, solarExport, deviceTotals]);

  const { leftNodes, midNodes, rightNodes, leftToMidFlows, midToRightFlows, nodeColor, nodeLabel } = layout;
  const allFlows = [...leftToMidFlows, ...midToRightFlows];
  const hovered = hoverId ? allFlows.find((f) => f.id === hoverId) : null;
  const activeNodes = hovered ? new Set([hovered.from, hovered.to]) : null;

  function handleEnter(f, e) {
    setHoverId(f.id);
    moveTooltip(e);
  }

  function moveTooltip(e) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleLeave() {
    setHoverId(null);
    setTooltip(null);
  }

  return (
    <div className="flow-sankey-wrap" ref={wrapRef}>
      <svg viewBox={`0 0 ${VIEW_W} ${H}`} className="flow-sankey" preserveAspectRatio="xMidYMid meet">
        <defs>
          {allFlows.map((f) => (
            <linearGradient key={f.id} id={f.id} x1="0" x2="1">
              <stop offset="0%" stopColor={f.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={nodeColor[f.to] || f.color} stopOpacity="0.32" />
            </linearGradient>
          ))}
        </defs>

        {allFlows.map((f) => (
          <path
            key={f.id}
            d={f.path}
            fill={`url(#${f.id})`}
            className={`flow-ribbon${hoverId && hoverId !== f.id ? ' is-dim' : ''}`}
            onMouseEnter={(e) => handleEnter(f, e)}
            onMouseMove={moveTooltip}
            onMouseLeave={handleLeave}
          />
        ))}

        {Object.entries(leftNodes).map(([name, n]) => (
          <g key={`left-${name}`} className={activeNodes && !activeNodes.has(name) ? 'is-dim' : ''}>
            <rect x={n.x} y={n.y0} width={BAR_W} height={n.h} fill={nodeColor[name]} rx="2" />
            <text className="flow-node-label" x={n.x + BAR_W + 8} y={(n.y0 + n.y1) / 2}>{nodeLabel[name] || name}</text>
          </g>
        ))}

        {Object.entries(midNodes).map(([name, n]) => (
          <g key={`mid-${name}`} className={activeNodes && !activeNodes.has(name) ? 'is-dim' : ''}>
            <rect x={n.x} y={n.y0} width={BAR_W} height={n.h} fill={nodeColor[name]} rx="2" />
            <text className="flow-node-label" x={n.x + BAR_W + 8} y={(n.y0 + n.y1) / 2}>{nodeLabel[name] || name}</text>
          </g>
        ))}

        {Object.entries(rightNodes).map(([name, n]) => (
          <g key={`right-${name}`} className={activeNodes && !activeNodes.has(name) ? 'is-dim' : ''}>
            <rect x={n.x} y={n.y0} width={BAR_W} height={n.h} fill={nodeColor[name]} rx="2" />
            <text
              className={`flow-node-label flow-node-label--sm${name === 'Untracked consumption' ? ' flow-node-label--end' : ''}`}
              x={name === 'Untracked consumption' ? n.x - 8 : n.x + BAR_W + 8}
              y={(n.y0 + n.y1) / 2}
            >
              {nodeLabel[name] || name}
            </text>
          </g>
        ))}
      </svg>

      {hovered && tooltip && (
        <div className="flow-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="flow-tooltip-route">{nodeLabel[hovered.from] || hovered.from} → {nodeLabel[hovered.to] || hovered.to}</div>
          <div className="flow-tooltip-value">{formatValue(hovered.value, unit)}</div>
        </div>
      )}
    </div>
  );
}
