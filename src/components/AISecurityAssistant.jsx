import { useState } from 'react';
import { useToast } from '../hooks/useToast.jsx';
import { useNotifications } from '../hooks/useNotifications.jsx';

const STEP_DELAY_MS = 1100;

export default function AISecurityAssistant({ onArmAway, onLockFrontDoor }) {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const showToast = useToast();
  const { addNotification } = useNotifications();

  function pushStep(text) {
    setLog((prev) => [...prev, text]);
  }

  async function runScenario() {
    if (running) return;
    setRunning(true);
    setLog([]);

    await new Promise((r) => setTimeout(r, 300));
    pushStep('🎥 Motion detected — Backyard camera');

    await new Promise((r) => setTimeout(r, STEP_DELAY_MS));
    pushStep('🤖 Analyzing activity pattern against presence data...');

    await new Promise((r) => setTimeout(r, STEP_DELAY_MS));
    pushStep('🤖 No residents confirmed home — treating as a potential intrusion');
    addNotification('AI Assistant', 'Unusual motion detected while no one is confirmed home.');

    await new Promise((r) => setTimeout(r, STEP_DELAY_MS));
    pushStep('🔒 Locking all doors automatically');
    onLockFrontDoor?.();

    await new Promise((r) => setTimeout(r, STEP_DELAY_MS));
    pushStep('🛡️ Arming security system — Away mode');
    onArmAway?.();
    addNotification('AI Assistant', 'Doors locked and security armed automatically in response to the motion event.');
    showToast('AI Assistant secured the home automatically', 'Security', 'success');

    setRunning(false);
  }

  return (
    <div className="card ai-insights-card">
      <div className="ai-insights-header">
        <h3 className="card-title">
          <span className="ai-badge">🤖 AI</span> Security Assistant
        </h3>
        <span className="ai-insights-sub">Monitors activity and reacts automatically</span>
      </div>

      <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 6 }}>
        Demo: simulates the AI Assistant noticing unusual motion while no one is home, and reacting on its own.
      </p>

      <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={runScenario} disabled={running}>
        {running ? 'AI Assistant responding…' : 'Simulate a break-in scenario'}
      </button>

      {log.length > 0 && (
        <div className="ai-security-log">
          {log.map((line, i) => (
            <div className="ai-security-log-row" key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
