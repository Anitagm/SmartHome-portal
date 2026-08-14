// js/data/dashboard-data.js

export const devices = [
  { name: 'Living Light', icon: '💡', state: 'on', dim: 80 },
  { name: 'Bedroom AC', icon: '❄️', state: 'on', dim: null },
  { name: 'Smart TV', icon: '📺', state: 'on', dim: null },
  { name: 'Coffee Maker', icon: '☕', state: 'off', dim: null },
  { name: 'Robot Vacuum', icon: '🤖', state: 'off', dim: null },
  { name: 'Office Desk', icon: '🖥️', state: 'on', dim: 60 },
  { name: 'Front Lock', icon: '🔐', state: 'on', dim: null },
  { name: 'Ceiling Fan', icon: '🌀', state: 'off', dim: null },
  { name: 'Garden Lights', icon: '🌿', state: 'off', dim: null },
  { name: 'Dishwasher', icon: '🫧', state: 'off', dim: null }
];

export const activities = [
  { icon: '💡', color: 'var(--blue-dim)', title: 'Living Room lights turned on', sub: 'Automation: Sunset trigger', time: '7:42 PM' },
  { icon: '🔐', color: 'var(--green-dim)', title: 'Front door locked', sub: 'Ahmad H. via app', time: '6:15 PM' },
  { icon: '❄️', color: 'var(--teal-dim)', title: 'Bedroom AC activated', sub: 'Temperature reached 25°C', time: '5:30 PM' },
  { icon: '📱', color: 'var(--amber-dim)', title: 'Motion detected — Backyard', sub: 'Camera notification sent', time: '3:12 PM' }
];

export const historyData = {
  'morning-commute': {
    icon: '🚗',
    title: 'Morning commute',
    value: '37',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    color: '#4a63e7'
  },
  'commute-home': {
    icon: '🚗',
    title: 'Commute to home',
    value: '41',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    color: '#f2a93b'
  }
};
