import { useState } from 'react';

export default function ManageDevicesModal({ open, onClose, devices, onDelete, onAdd }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💡');
  const [status, setStatus] = useState('off');
  const [control, setControl] = useState('toggle');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onAdd({
      name: trimmed,
      icon: icon || '💡',
      state: status,
      control,
      dim: control === 'dimmer' ? 80 : null
    });

    setName('');
    setIcon('💡');
    setStatus('off');
    setControl('toggle');
  }

  return (
    <div className={`manage-modal${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="manage-modal-backdrop" onClick={onClose}></div>
      <section className="manage-panel" role="dialog" aria-modal="true" aria-labelledby="manage-title">
        <header className="manage-header">
          <div>
            <h2 id="manage-title">Manage devices</h2>
            <p>Add or remove dashboard devices</p>
          </div>
          <button type="button" className="modal-close" aria-label="Close modal" onClick={onClose}>
            &times;
          </button>
        </header>

        <div className="manage-device-list">
          {devices.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 13 }}>No devices added yet.</p>
          ) : (
            devices.map((d, i) => (
              <div className="manage-device-row" key={d.name}>
                <div className="manage-device-info">
                  <span>{d.icon || '💡'}</span>
                  <span>{d.name}</span>
                </div>
                <button type="button" className="delete-device-btn" onClick={() => onDelete(i)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <form className="add-device-form" onSubmit={handleSubmit}>
          <h3>Add device</h3>
          <label>
            Device name
            <input
              type="text"
              placeholder="e.g. Bedroom Lamp"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Icon (Emoji or single character)
            <input type="text" maxLength={2} value={icon} onChange={(e) => setIcon(e.target.value)} />
          </label>
          <label>
            Initial status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="off">Inactive</option>
              <option value="on">Active</option>
            </select>
          </label>
          <label>
            Control type
            <select value={control} onChange={(e) => setControl(e.target.value)}>
              <option value="toggle">Toggle Pill</option>
              <option value="dimmer">Dimmer Slider</option>
            </select>
          </label>
          <button type="submit" className="primary-btn">Add device</button>
        </form>
      </section>
    </div>
  );
}
