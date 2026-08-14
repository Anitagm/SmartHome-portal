import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { useProfile } from '../hooks/useProfile.js';
import { useLocalization } from '../hooks/useLocalization.js';
import { useNotifications } from '../hooks/useNotifications.jsx';
// NotificationsProvider (mounted in App.jsx) supplies the context this hook reads.
import NotificationsPanel from '../components/NotificationsPanel.jsx';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLight, toggleTheme } = useTheme();
  const { profile, updateProfile } = useProfile();
  const { localization, updateLocalization } = useLocalization();
  const { notifications, dismiss, panelOpen, togglePanel, closePanel } = useNotifications();

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  return (
    <>
      <div
        className={`overlay${sidebarOpen ? ' is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <Sidebar isOpen={sidebarOpen} profile={profile} notificationCount={notifications.length} onNotificationsClick={togglePanel} />

      <NotificationsPanel open={panelOpen} notifications={notifications} onDismiss={dismiss} onClose={closePanel} />

      <main className="main">
        <Outlet context={{ sidebarOpen, setSidebarOpen, isLight, toggleTheme, profile, updateProfile, localization, updateLocalization }} />
      </main>
    </>
  );
}
