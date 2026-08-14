export default function GaugeDonut({ label, value, segments }) {
  let acc = 0;
  const stops = segments
    .map((s) => {
      const start = acc;
      acc += s.value;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(', ');

  return (
    <div className="gauge-card card">
      <div className="gauge-donut" style={{ background: `conic-gradient(${stops})` }}>
        <span>{value}</span>
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}
