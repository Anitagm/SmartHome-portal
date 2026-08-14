// js/data/automations-data.js

export const automations = [
  {
    id: 'auto-sunset-lights',
    name: 'Sunset Lights',
    trigger: 'Sun elevation drops below -4°',
    action: 'Turn on Living Light at 60%',
    enabled: true,
    lastTriggered: 'Today 19:42'
  },
  {
    id: 'auto-morning-routine',
    name: 'Morning Routine',
    trigger: 'Time reaches 07:00 on weekdays',
    action: 'Turn on Coffee Maker, open Bedroom AC',
    enabled: true,
    lastTriggered: 'Today 07:00'
  },
  {
    id: 'auto-away-lock',
    name: 'Away Auto-Lock',
    trigger: 'Presence changes to Away for all members',
    action: 'Lock Front Lock, arm security away',
    enabled: true,
    lastTriggered: 'Yesterday 09:15'
  },
  {
    id: 'auto-motion-porch',
    name: 'Motion — Backyard Camera',
    trigger: 'Backyard Camera detects motion',
    action: 'Send notification, log activity',
    enabled: true,
    lastTriggered: 'Today 15:03'
  },
  {
    id: 'auto-doorbell-notify',
    name: 'Doorbell Notification',
    trigger: 'Front Door doorbell pressed',
    action: 'Notify household, flash Living Light',
    enabled: false,
    lastTriggered: 'Aug 1, 18:20'
  },
  {
    id: 'auto-vacuum-schedule',
    name: 'Daily Vacuum',
    trigger: 'Time reaches 10:30 and nobody home',
    action: 'Start Robot Vacuum',
    enabled: true,
    lastTriggered: 'Today 10:30'
  }
];

export const scenes = [
  {
    id: 'scene-movie-night',
    name: 'Movie Night',
    icon: '🎬',
    description: 'Dim the lights and fire up the TV',
    deviceChanges: [
      { name: 'Living Light', state: 'on', dim: 15 },
      { name: 'Smart TV', state: 'on' },
      { name: 'Ceiling Fan', state: 'off' },
      { name: 'Garden Lights', state: 'off' }
    ]
  },
  {
    id: 'scene-good-morning',
    name: 'Good Morning',
    icon: '🌅',
    description: 'Bright lights, coffee brewing, desk ready',
    deviceChanges: [
      { name: 'Living Light', state: 'on', dim: 80 },
      { name: 'Coffee Maker', state: 'on' },
      { name: 'Office Desk', state: 'on', dim: 70 },
      { name: 'Bedroom AC', state: 'off' },
      { name: 'Garden Lights', state: 'off' }
    ]
  },
  {
    id: 'scene-away-mode',
    name: 'Away Mode',
    icon: '🚪',
    description: 'Lock up and power down while nobody is home',
    deviceChanges: [
      { name: 'Living Light', state: 'off' },
      { name: 'Bedroom AC', state: 'off' },
      { name: 'Smart TV', state: 'off' },
      { name: 'Coffee Maker', state: 'off' },
      { name: 'Office Desk', state: 'off' },
      { name: 'Front Lock', state: 'on' },
      { name: 'Garden Lights', state: 'on' },
      { name: 'Robot Vacuum', state: 'on' }
    ]
  },
  {
    id: 'scene-bedtime',
    name: 'Bedtime',
    icon: '🌙',
    description: 'Wind everything down for the night',
    deviceChanges: [
      { name: 'Living Light', state: 'off' },
      { name: 'Smart TV', state: 'off' },
      { name: 'Robot Vacuum', state: 'off' },
      { name: 'Front Lock', state: 'on' },
      { name: 'Ceiling Fan', state: 'on', dim: 30 },
      { name: 'Garden Lights', state: 'on' }
    ]
  }
];
