import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useToast } from '../hooks/useToast.jsx';
import { useClock } from '../hooks/useClock.js';
import PageHeader from '../components/PageHeader.jsx';
import {
  getTimezoneList,
  formatDate,
  formatNumber,
  FIRST_DAY_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
  DATE_FORMAT_OPTIONS
} from '../utils/localeFormat.js';

function SettingsRow({ label, sub, subLink, children }) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
        {subLink && <a className="text-link" href="#" onClick={(e) => e.preventDefault()}>{subLink}</a>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLight, toggleTheme, localization, updateLocalization } = useOutletContext();
  const showToast = useToast();
  const [tab, setTab] = useState('general');
  const timezones = useState(getTimezoneList)[0];
  const previewClock = useClock(localization.timeFormat, localization.timezone);
  const previewDate = formatDate(new Date(), localization.dateFormat);
  const previewNumber = formatNumber(1234.56, localization.numberFormat);

  const [showEntityIds, setShowEntityIds] = useState(false);
  const [alwaysHideSidebar, setAlwaysHideSidebar] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const [suspendConnections, setSuspendConnections] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(false);

  const [tokens, setTokens] = useState([]);
  let nextTokenId = tokens.length + 1;

  function createToken() {
    const token = { id: Date.now(), name: `Token ${nextTokenId}`, created: new Date().toLocaleDateString() };
    setTokens((list) => [...list, token]);
    showToast('Long-lived access token created', 'Security', 'success');
  }

  function deleteToken(id) {
    setTokens((list) => list.filter((t) => t.id !== id));
  }

  function deleteAllTokens() {
    setTokens([]);
    showToast('All refresh tokens deleted', 'Security', 'info');
  }

  return (
    <div className="content">
      <PageHeader title="Profile & Preferences" subtitle="Account, localization, and security settings" backTo="/settings" backLabel="Back to Settings" />

      <nav className="energy-tabs" style={{ padding: 0, marginBottom: 24 }}>
        <button type="button" className={`energy-tab${tab === 'general' ? ' active' : ''}`} onClick={() => setTab('general')}>
          👤 General
        </button>
        <button type="button" className={`energy-tab${tab === 'security' ? ' active' : ''}`} onClick={() => setTab('security')}>
          🔒 Security
        </button>
      </nav>

      {tab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
          <div className="card">
            <h3 className="card-title">{profile.name}</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 8 }}>
              You are currently logged in as {profile.name}. You are an owner.
            </p>
            <button
              type="button"
              className="text-link-danger"
              style={{ marginTop: 14 }}
              onClick={() => showToast('Signed out (demo only)', 'Profile', 'info')}
            >
              Log out
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">User preferences</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 6 }}>
              The following settings are tied to your account and will persist across all sessions and devices.
            </p>

            <SettingsRow label="Language" subLink="Help translating">
              <select className="row-select">
                <option>English</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Theme" subLink="Learn about themes">
              <select className="row-select" value={isLight ? 'light' : 'dark'} onChange={toggleTheme}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Dashboard" sub="Pick a default dashboard to show.">
              <select className="row-select">
                <option>Auto (use system settings)</option>
              </select>
            </SettingsRow>

            <SettingsRow
              label="Change the order and hide items from the sidebar"
              sub="You can also press and hold the header of the sidebar to activate edit mode."
            >
              <button type="button" className="text-link" onClick={() => showToast('Sidebar editor coming soon', 'Profile', 'info')}>
                Edit
              </button>
            </SettingsRow>

            <SettingsRow label="Display entity IDs in picker" sub="Shows the full entity IDs when selecting entities from a menu list.">
              <div className={`toggle-pill${showEntityIds ? ' on' : ''}`} onClick={() => setShowEntityIds((v) => !v)}></div>
            </SettingsRow>
          </div>

          <div className="card">
            <h3 className="card-title">Localization</h3>

            <SettingsRow label="Time zone" sub={`Choose the time zone to use for displaying times. Preview: ${previewClock}`}>
              <select
                className="row-select"
                value={localization.timezone}
                onChange={(e) => updateLocalization({ timezone: e.target.value })}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </SettingsRow>

            <SettingsRow label="Number format" sub={`Choose how numbers are formatted. Preview: ${previewNumber}`}>
              <select
                className="row-select"
                value={localization.numberFormat}
                onChange={(e) => updateLocalization({ numberFormat: e.target.value })}
              >
                {NUMBER_FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </SettingsRow>

            <SettingsRow label="Time format" sub={`Choose how times are formatted. Preview: ${previewClock}`}>
              <select
                className="row-select"
                value={localization.timeFormat}
                onChange={(e) => updateLocalization({ timeFormat: e.target.value })}
              >
                {TIME_FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </SettingsRow>

            <SettingsRow label="Date format" sub={`Choose how dates are formatted. Preview: ${previewDate}`}>
              <select
                className="row-select"
                value={localization.dateFormat}
                onChange={(e) => updateLocalization({ dateFormat: e.target.value })}
              >
                {DATE_FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </SettingsRow>

            <SettingsRow label="First day of the week" sub="Choose the starting day for calendars.">
              <select
                className="row-select"
                value={localization.firstDayOfWeek}
                onChange={(e) => updateLocalization({ firstDayOfWeek: e.target.value })}
              >
                {FIRST_DAY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </SettingsRow>
          </div>

          <div className="card">
            <h3 className="card-title">Browser settings</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 6 }}>
              The following settings are local to this client only, and may reset to defaults on logout or when local data is cleared.
            </p>

            <SettingsRow label="Always hide the sidebar" sub="This will hide the sidebar by default, similar to the mobile experience.">
              <div className={`toggle-pill${alwaysHideSidebar ? ' on' : ''}`} onClick={() => setAlwaysHideSidebar((v) => !v)}></div>
            </SettingsRow>
            <SettingsRow label="Vibrate" sub="Enable or disable vibration on this device when controlling devices.">
              <div className={`toggle-pill${vibrate ? ' on' : ''}`} onClick={() => setVibrate((v) => !v)}></div>
            </SettingsRow>
            <SettingsRow label="Suspend background connections" sub="For hidden windows or background tabs, close the server connection after 5 minutes.">
              <div className={`toggle-pill${suspendConnections ? ' on' : ''}`} onClick={() => setSuspendConnections((v) => !v)}></div>
            </SettingsRow>
            <SettingsRow label="Keyboard shortcuts" sub="Enable or disable keyboard shortcuts for performing various actions in the UI.">
              <div className={`toggle-pill${keyboardShortcuts ? ' on' : ''}`} onClick={() => setKeyboardShortcuts((v) => !v)}></div>
            </SettingsRow>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
          <div className="card">
            <h3 className="card-title">Multi-factor authentication modules</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 8 }}>No MFA modules configured.</p>
          </div>

          <div className="card">
            <h3 className="card-title">Refresh tokens</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 8 }}>
              Each refresh token represents a login session. Refresh tokens will be automatically deleted when you log out.
              Unused refresh tokens will be automatically deleted after 90 days.
            </p>
            <button type="button" className="delete-device-btn" style={{ marginTop: 14 }} onClick={deleteAllTokens}>
              Delete all tokens
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">Long-lived access tokens</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 8 }}>
              Create long-lived access tokens to allow your scripts to interact with your Ferdowsi instance.
              Each token will be valid for 10 years from creation.
            </p>

            {tokens.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 10 }}>You have no long-lived access tokens yet.</p>
            ) : (
              <div style={{ marginTop: 10 }}>
                {tokens.map((t) => (
                  <div className="card-row" key={t.id}>
                    <div className="row-icon">🔑</div>
                    <div className="row-label">{t.name}</div>
                    <div className="row-value">{t.created}</div>
                    <button type="button" className="delete-device-btn" style={{ marginLeft: 10 }} onClick={() => deleteToken(t.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="primary-btn" style={{ marginTop: 14 }} onClick={createToken}>
              Create token
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
