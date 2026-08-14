// js/data/map-data.js

export const homeZone = { lat: 50.1109, lng: 8.6821, radius: 60, name: 'Home' };

export const mapEntities = [
  {
    id: 'light.living_room_lights',
    name: 'Living Room Lights',
    type: 'light',
    lat: 50.11097,
    lng: 8.68185,
    state: 'on',
    icon: '💡',
    description: 'Lutron dimmable ceiling lights'
  },
  {
    id: 'sensor.kitchen_temp',
    name: 'Kitchen Temperature',
    type: 'sensor',
    lat: 50.11103,
    lng: 8.68225,
    state: '22.4°C',
    icon: '🌡️',
    description: 'Xiaomi Aqara temperature sensor'
  },
  {
    id: 'lock.front_door',
    name: 'Front Door Lock',
    type: 'lock',
    lat: 50.11078,
    lng: 8.68195,
    state: 'locked',
    icon: '🔒',
    description: 'Yale Smart Lock (Zigbee)'
  },
  {
    id: 'camera.backyard',
    name: 'Backyard Camera',
    type: 'camera',
    lat: 50.11082,
    lng: 8.68235,
    state: 'idle',
    icon: '📹',
    description: 'Eufy 2K Outdoor Cam'
  }
];

export const mapPersons = [
  {
    id: 'person.anita',
    name: 'Anita',
    lat: 50.11090,
    lng: 8.68210,
    home: true,
    description: 'Home — WiFi presence detected'
  },
  {
    id: 'person.ahmad',
    name: 'Ahmad',
    lat: 50.12300,
    lng: 8.70600,
    home: false,
    description: 'Away — last seen near Downtown'
  }
];
