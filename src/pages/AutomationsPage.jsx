import PageHeader from '../components/PageHeader.jsx';
import { scenes } from '../data/automations-data.js';
import { useAutomationsState } from '../hooks/useAutomationsState.js';
import { useManagedDevices } from '../hooks/useManagedDevices.js';
import { useToast } from '../hooks/useToast.jsx';

export default function AutomationsPage() {
  const { automations, toggleAutomation } = useAutomationsState();
  const { applyChanges } = useManagedDevices();
  const showToast = useToast();

  function handleToggle(id) {
    const automation = automations.find((a) => a.id === id);
    toggleAutomation(id);
    showToast(`${automation.name} ${!automation.enabled ? 'enabled' : 'disabled'}`, 'Automation', 'info');
  }

  function activateScene(sceneId) {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    applyChanges(scene.deviceChanges);
    showToast(`${scene.name} activated`, 'Scene', 'success');
  }

  return (
    <div className="content">
      <PageHeader title="Automations & Scenes" subtitle="Manage automated routines and activate scenes" />

      <section className="automations-page-content">
        <div className="automations-section">
          <div className="automations-section-header">
            <h3>Automations</h3>
            <p>Rules that run automatically based on triggers</p>
          </div>
          <div className="automations-list">
            {automations.map((a) => (
              <div key={a.id} className={`automation-row${a.enabled ? '' : ' is-disabled'}`}>
                <div className="automation-info">
                  <div className="automation-name">{a.name}</div>
                  <div className="automation-trigger">⚡ {a.trigger}</div>
                  <div className="automation-action">→ {a.action}</div>
                </div>
                <div className="automation-meta">Last run<br />{a.lastTriggered}</div>
                <div
                  className={`toggle-pill${a.enabled ? ' on' : ''}`}
                  onClick={() => handleToggle(a.id)}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="scenes-section">
          <div className="automations-section-header">
            <h3>Scenes</h3>
            <p>Apply a preset of device states with one click</p>
          </div>
          <div className="scenes-grid">
            {scenes.map((s) => (
              <div key={s.id} className="scene-card">
                <div className="scene-icon">{s.icon}</div>
                <div className="scene-name">{s.name}</div>
                <div className="scene-desc">{s.description}</div>
                <button
                  type="button"
                  className="btn btn-primary scene-activate-btn"
                  onClick={() => activateScene(s.id)}
                >
                  Activate
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
