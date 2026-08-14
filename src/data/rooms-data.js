// src/data/rooms-data.js

export const rooms = [
  {
    name: 'Living Room',
    bg: 'var(--accent)',
    iconBg: 'var(--blue-dim)',
    icon: '🛋️',
    temp: '22°C',
    rh: '45% RH',
    devices: [
      { label: 'Lights', on: true },
      { label: 'TV', on: true },
      { label: 'AC', on: false }
    ]
  },
  {
    name: 'Bedroom',
    bg: 'var(--purple)',
    iconBg: 'var(--purple-dim)',
    icon: '🛏️',
    temp: '20°C',
    rh: '52% RH',
    devices: [
      { label: 'AC', on: true },
      { label: 'Lights', on: false }
    ]
  },
  {
    name: 'Kitchen',
    bg: 'var(--amber)',
    iconBg: 'var(--amber-dim)',
    icon: '🍳',
    temp: '24°C',
    rh: '38% RH',
    devices: [
      { label: 'Lights', on: true },
      { label: 'Oven', on: false }
    ]
  },
  {
    name: 'Bathroom',
    bg: 'var(--teal)',
    iconBg: 'var(--teal-dim)',
    icon: '🚿',
    temp: '23°C',
    rh: '65% RH',
    devices: [
      { label: 'Lights', on: false },
      { label: 'Fan', on: false }
    ]
  },
  {
    name: 'Office',
    bg: 'var(--green)',
    iconBg: 'var(--green-dim)',
    icon: '💻',
    temp: '21°C',
    rh: '48% RH',
    devices: [
      { label: 'Lights', on: true },
      { label: 'PC', on: true }
    ]
  },
  {
    name: 'Garage',
    bg: 'var(--text3)',
    iconBg: 'var(--surface3)',
    icon: '🚗',
    temp: '16°C',
    rh: '55% RH',
    devices: [
      { label: 'Light', on: false },
      { label: 'Sensor', on: true }
    ]
  }
];
