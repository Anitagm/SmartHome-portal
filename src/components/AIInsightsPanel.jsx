import { useState } from 'react';
import { useAIInsights } from '../hooks/useAIInsights.js';

export default function AIInsightsPanel({ devices, notifications }) {
  const insights = useAIInsights({ devices, notifications });
  const [dismissed, setDismissed] = useState(() => new Set());

  const visible = insights.filter((i) => !dismissed.has(i.id));

  function dismiss(id) {
    setDismissed((prev) => new Set(prev).add(id));
  }

  return (
    <div className="card ai-insights-card">
      <div className="ai-insights-header">
        <h3 className="card-title">
          <span className="ai-badge">🤖 AI</span> Insights
        </h3>
        <span className="ai-insights-sub">Patterns detected from your live activity</span>
      </div>

      {visible.length === 0 ? (
        <p className="ai-insights-empty">No new insights — everything looks normal.</p>
      ) : (
        <div className="ai-insights-list">
          {visible.map((insight) => (
            <div className={`ai-insight-row ai-insight--${insight.kind}`} key={insight.id}>
              <span className="ai-insight-icon">{insight.icon}</span>
              <div className="ai-insight-text">
                <div className="ai-insight-title">{insight.title}</div>
                <div className="ai-insight-message">{insight.message}</div>
              </div>
              <button type="button" className="ai-insight-dismiss" aria-label="Dismiss insight" onClick={() => dismiss(insight.id)}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
