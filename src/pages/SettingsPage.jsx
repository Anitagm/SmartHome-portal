import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast.jsx';
import PageHeader from '../components/PageHeader.jsx';

const TOP_ITEMS = [
  {
    icon: '☁️',
    color: 'teal',
    title: 'Ferdowsi Cloud',
    sub: 'Logged in and connected',
    to: null
  },
  {
    icon: '🖥️',
    color: 'blue',
    title: 'Devices & services',
    sub: 'Integrations, devices, entities, and helpers',
    to: null
  },
  {
    icon: '🤖',
    color: 'green',
    title: 'Automations & scenes',
    sub: 'Automations, scenes, scripts, and blueprints',
    to: '/automations'
  },
  {
    icon: '🧩',
    color: 'orange',
    title: 'Apps',
    sub: 'Run extra applications next to Ferdowsi',
    to: null
  },
  {
    icon: '🎙️',
    color: 'indigo',
    title: 'Voice assistants',
    sub: 'Manage your voice assistants',
    to: null
  }
];

const BOTTOM_ITEMS = [
  {
    icon: '👤',
    color: 'blue',
    title: 'People',
    sub: 'Manage who can access your home',
    to: '/profile'
  },
  {
    icon: '⚙️',
    color: 'purple',
    title: 'System',
    sub: 'Create backups, check logs, or reboot your system',
    to: null
  },
  {
    icon: '🛠️',
    color: 'purple',
    title: 'Tools',
    sub: 'Inspect and debug your system',
    to: null
  },
  {
    icon: 'ℹ️',
    color: 'gray',
    title: 'About',
    sub: 'Version information, credit, and more',
    to: null
  }
];

function SettingsGroup({ items, onSelect }) {
  return (
    <div className="settings-nav-card">
      {items.map((item) => (
        <button
          type="button"
          key={item.title}
          className="settings-nav-row"
          onClick={() => onSelect(item)}
        >
          <span className={`settings-nav-icon settings-nav-icon--${item.color}`}>{item.icon}</span>
          <span className="settings-nav-text">
            <span className="settings-nav-title">{item.title}</span>
            <span className="settings-nav-sub">{item.sub}</span>
          </span>
          <svg className="settings-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="9 6 15 12 9 18"></polyline>
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const showToast = useToast();

  function handleSelect(item) {
    if (item.to) {
      navigate(item.to);
    } else {
      showToast(`${item.title} coming soon`, 'Settings', 'info');
    }
  }

  return (
    <div className="content">
      <PageHeader title="Settings" subtitle="Manage your Ferdowsi instance, people, and system tools" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        <SettingsGroup items={TOP_ITEMS} onSelect={handleSelect} />
        <SettingsGroup items={BOTTOM_ITEMS} onSelect={handleSelect} />

        <p className="settings-nav-tip">
          💡 Tip! Join the community on our Forums, Social Media, Chat, Blog or Newsletter
        </p>
      </div>
    </div>
  );
}
