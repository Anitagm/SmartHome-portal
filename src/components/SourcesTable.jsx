export default function SourcesTable({ sources, detailed = false, showHeader = false }) {
  return (
    <div className={`sources-table${detailed ? ' sources-table--detailed' : ''}`}>
      {showHeader && (
        <div className="sources-row sources-header">
          <span className="sources-swatch" aria-hidden="true"></span>
          <span className="sources-name">Source</span>
          <span className="sources-usage">Energy</span>
          <span className="sources-cost">Cost</span>
        </div>
      )}
      {sources.map((s, i) => (
        <div key={i} className={`sources-row${s.total ? ' is-total' : ''}`}>
          <span className="sources-swatch" style={{ background: s.color }}></span>
          <span className="sources-name">{s.name}</span>
          <span className="sources-usage">{s.usage}</span>
          <span className="sources-cost">{s.cost || ''}</span>
        </div>
      ))}
    </div>
  );
}
