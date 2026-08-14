// js/data/presence-data.js

export const presenceMembers = [
  {
    id: "anita",
    name: "Anita",
    home: true,
    sources: [
      { type: "wifi", label: "WiFi Presence", detected: true },
      { type: "gps", label: "GPS Geofence", detected: true },
      { type: "bluetooth", label: "Bluetooth", detected: true }
    ],
    confidence: 96,
    note: "Home since 08:12"
  },
  {
    id: "ahmad",
    name: "Ahmad",
    home: false,
    sources: [
      { type: "wifi", label: "WiFi Presence", detected: false },
      { type: "gps", label: "GPS Geofence", detected: false },
      { type: "bluetooth", label: "Bluetooth", detected: false }
    ],
    confidence: 6,
    note: "Last seen 14:20 near Downtown"
  },
  {
    id: "guest",
    name: "Guest",
    home: true,
    sources: [
      { type: "wifi", label: "WiFi Presence", detected: true },
      { type: "gps", label: "GPS Geofence", detected: false },
      { type: "bluetooth", label: "Bluetooth", detected: true }
    ],
    confidence: 71,
    note: "Home since 12:40"
  }
];
