// src/data/notifications-data.js

export const initialNotifications = [
  {
    id: 'motion-backyard',
    title: 'Motion Detected!',
    message: 'There was motion detected in the backyard.',
    timestamp: Date.now() - 9000
  },
  {
    id: 'front-door-unlocked',
    title: 'Front Door Unlocked',
    message: 'Front door was unlocked by Anita via the app.',
    timestamp: Date.now() - 6 * 60 * 1000
  }
];
