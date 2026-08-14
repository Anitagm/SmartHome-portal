import { useState } from 'react';
import { presenceMembers } from '../data/presence-data.js';

function confidenceClass(confidence) {
  if (confidence >= 70) return 'high';
  if (confidence >= 30) return 'medium';
  return 'low';
}

function trackerIcon(type) {
  if (type === 'wifi') return '📶';
  if (type === 'gps') return '📍';
  if (type === 'bluetooth') return '🔵';
  return '•';
}

export default function PresenceCard() {
  const [expanded, setExpanded] = useState(() => new Set());

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      {presenceMembers.map((member) => (
        <div
          key={member.id}
          className={`presence-row${expanded.has(member.id) ? ' is-expanded' : ''}`}
          onClick={() => toggle(member.id)}
        >
          <div className="presence-row-main">
            <div className="presence-avatar">{member.name.charAt(0)}</div>
            <div className="presence-info">
              <div className="presence-name">{member.name}</div>
              <div className="presence-note">{member.note}</div>
            </div>
            <div className={`presence-status ${member.home ? 'is-home' : 'is-away'}`}>
              {member.home ? 'Home' : 'Away'}
            </div>
          </div>

          <div className="presence-sources">
            {member.sources.map((s) => (
              <span key={s.type} className={`tracker-chip ${s.detected ? 'detected' : 'not-detected'}`}>
                {trackerIcon(s.type)} {s.label}
              </span>
            ))}
          </div>

          <div className="confidence-bar">
            <div className={`confidence-bar-fill ${confidenceClass(member.confidence)}`} style={{ width: `${member.confidence}%` }}></div>
          </div>
          <div className="confidence-label">{member.confidence}% confidence</div>
        </div>
      ))}
    </div>
  );
}
