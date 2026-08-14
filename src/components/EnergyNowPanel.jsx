import { Line } from 'react-chartjs-2';
import { useLivePower } from '../hooks/useLivePower.js';
import { useDayPowerHistory } from '../hooks/useDayPowerHistory.js';
import { cssVar } from '../chartSetup.js';
import { deviceTotalUsage } from '../data/energy-data.js';
import EnergyFlowSankey from './EnergyFlowSankey.jsx';
import GaugeDonut from './GaugeDonut.jsx';

const LEGEND = [
  { key: 'solar', label: 'Solar', color: '#f4b942' },
  { key: 'grid', label: 'Grid', color: '#6ea8fe' },
  { key: 'battery', label: 'Battery', color: '#55d187' },
  { key: 'consumption', label: 'Consumption', color: 'var(--text)' }
];

export default function EnergyNowPanel() {
  const { now, tickSeconds } = useLivePower();
  const { buckets, timeLabels, dayLabel, tickIndexes } = useDayPowerHistory(now);

  const text3 = cssVar('--text-3', '#728096');
  const text = cssVar('--text', '#e6edf3');
  const border = cssVar('--border', '#293442');

  // Manually build cumulative bands instead of relying on Chart.js's
  // built-in stacked scale (which gets unreliable once a stack mixes
  // positive and negative values, like Grid import/export does). Each
  // dataset below fills relative to the one before it via `fill: '-1'`,
  // so the math — not Chart.js's sign-handling — controls the shape.
  // `null` buckets are hours later than "now" — Chart.js just leaves a gap,
  // matching the blank rest-of-day area on a real energy dashboard.
  const solarSeries = buckets.map((b) => (b ? Math.max(b.solar, 0) : null));
  const batteryTop = buckets.map((b, i) => (b ? solarSeries[i] + Math.max(b.battery, 0) : null));
  const gridImportTop = buckets.map((b, i) => (b ? batteryTop[i] + Math.max(b.grid, 0) : null));
  const gridExportSeries = buckets.map((b) => (b ? Math.min(b.grid, 0) : null));
  const consumptionSeries = buckets.map((b) => (b ? b.home : null));

  const chartData = {
    labels: timeLabels,
    datasets: [
      { label: 'Solar', data: solarSeries, borderColor: '#f4b942', backgroundColor: 'rgba(244,185,66,0.35)', fill: 'origin', tension: 0.3, pointRadius: 0, borderWidth: 1.5 },
      { label: 'Battery', data: batteryTop, borderColor: '#55d187', backgroundColor: 'rgba(85,209,135,0.3)', fill: '-1', tension: 0.3, pointRadius: 0, borderWidth: 1.5 },
      { label: 'Grid', data: gridImportTop, borderColor: '#6ea8fe', backgroundColor: 'rgba(110,168,254,0.28)', fill: '-1', tension: 0.3, pointRadius: 0, borderWidth: 1.5 },
      { label: 'Grid export', data: gridExportSeries, borderColor: '#6ea8fe', backgroundColor: 'rgba(110,168,254,0.28)', fill: 'origin', tension: 0.3, pointRadius: 0, borderWidth: 1.5 },
      { label: 'Consumption', data: consumptionSeries, borderColor: text, backgroundColor: 'transparent', borderDash: [5, 4], fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2 }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        filter: (item) => item.dataset.label !== 'Grid export',
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} kW`
        }
      }
    },
    scales: {
      x: {
        grid: { color: (ctx) => (tickIndexes.includes(ctx.index) ? border : 'transparent') },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          color: text3,
          font: { size: 10 },
          callback: (val, index) => (tickIndexes.includes(index) ? (index === 0 ? dayLabel : timeLabels[index]) : '')
        }
      },
      y: { grid: { color: border }, ticks: { color: text3, font: { size: 10 }, callback: (v) => `${v} kW` } }
    }
  };

  const gridDependencyPercent = Math.round(Math.min(100, (Math.max(now.grid, 0) / Math.max(now.home, 0.01)) * 100));
  const selfSufficiencyPercent = 100 - gridDependencyPercent;

  return (
    <div className="tab-panel active">
      <div className="energy-now-header">
        <span className="energy-live-badge">
          <span className="energy-live-dot"></span> Live
        </span>
        <span className="energy-now-updated">Updating every {tickSeconds}s (simulated)</span>
      </div>

      <div className="status-bar">
        <div className="stat-card amber">
          <div className="stat-val">{now.solar.toFixed(2)} <span style={{ fontSize: 12 }}>kW</span></div>
          <div className="stat-label">Solar production</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-val">{Math.abs(now.grid).toFixed(2)} <span style={{ fontSize: 12 }}>kW</span></div>
          <div className="stat-label">{now.grid >= 0 ? 'Importing from grid' : 'Exporting to grid'}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-val">{Math.abs(now.battery).toFixed(2)} <span style={{ fontSize: 12 }}>kW</span></div>
          <div className="stat-label">Battery {now.battery >= 0 ? 'discharging' : 'charging'}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-val">{now.home.toFixed(2)} <span style={{ fontSize: 12 }}>kW</span></div>
          <div className="stat-label">Home consumption</div>
        </div>
      </div>

      <div className="energy-usage-pill">
        <span className="energy-usage-pill-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </span>
        <span>
          <div className="energy-usage-pill-label">Power usage</div>
          <div className="energy-usage-pill-value">{Math.round(now.home * 1000)} W</div>
        </span>
      </div>

      <div className="card energy-chart-card energy-chart-card--tall">
        <h3 className="card-title">Power sources</h3>
        <Line data={chartData} options={chartOptions} />
        <div className="chart-legend">
          {LEGEND.map((l) => (
            <span className="chart-legend-item" key={l.key}>
              <span className="chart-legend-check" style={{ background: l.color }}>✓</span>
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="gauge-row">
        <GaugeDonut
          label="Battery charge"
          value={`${now.batterySoC.toFixed(0)}%`}
          segments={[{ value: now.batterySoC, color: '#55d187' }, { value: 100 - now.batterySoC, color: 'var(--surface-3)' }]}
        />
        <GaugeDonut
          label="Self-sufficiency now"
          value={`${selfSufficiencyPercent}%`}
          segments={[{ value: selfSufficiencyPercent, color: '#55d187' }, { value: 100 - selfSufficiencyPercent, color: 'var(--surface-3)' }]}
        />
        <GaugeDonut
          label="Grid dependency now"
          value={`${gridDependencyPercent}%`}
          segments={[{ value: gridDependencyPercent, color: '#6ea8fe' }, { value: 100 - gridDependencyPercent, color: 'var(--surface-3)' }]}
        />
      </div>

      <div className="card">
        <h3 className="card-title">Current power flow</h3>
        <EnergyFlowSankey
          battery={now.battery > 0 ? now.battery : 0}
          gridImport={now.grid > 0 ? now.grid : 0}
          solar={now.solar}
          solarExport={now.grid < 0 ? Math.abs(now.grid) : 0}
          deviceTotals={deviceTotalUsage}
          unit="W"
        />
      </div>
    </div>
  );
}
