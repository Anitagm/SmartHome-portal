// src/data/floorplan-markers.js
//
// x/y are percentages (0-100) relative to the floor plan image's
// top-left corner — tweak these once the real floor plan image is in
// place so the icons line up with the actual rooms/corners.
//
// type: 'camera' | 'warning' | 'light' | 'garage' | 'doorbell'
// for type 'camera', `image` is the snapshot shown when the marker is clicked
// (see public/assets/cameras/).

export const floorplanMarkers = [
  { id: 'cam-top-left', type: 'camera', x: 6, y: 17, name: 'Backyard Camera', image: '/assets/cameras/backyard.jpg' },
  { id: 'cam-top-right', type: 'camera', x: 92, y: 17, name: 'Side Yard Camera', image: '/assets/cameras/side-yard.jpg' },
  { id: 'cam-bottom-left', type: 'camera', x: 6, y: 91, name: 'Front Door Camera', image: '/assets/cameras/front-door.jpg' },
  { id: 'cam-bottom-right', type: 'camera', x: 92, y: 86, name: 'Driveway Camera', image: '/assets/cameras/driveway.jpg' },

  { id: 'warn-1', type: 'warning', x: 15, y: 19, label: 'Motion detected' },
  { id: 'warn-2', type: 'warning', x: 49, y: 28, label: 'Window open' },
  { id: 'warn-3', type: 'warning', x: 83, y: 28, label: 'Sensor offline' },
  { id: 'warn-4', type: 'warning', x: 49, y: 44, label: 'Smoke detector' },
  { id: 'warn-5', type: 'warning', x: 55, y: 64, label: 'Water leak sensor' },
  { id: 'warn-6', type: 'warning', x: 31, y: 88, label: 'Door ajar' },
  { id: 'warn-7', type: 'warning', x: 31, y: 95, label: 'Low battery' },

  { id: 'light-1', type: 'light', x: 10, y: 41 },
  { id: 'light-2', type: 'light', x: 49, y: 35 },
  { id: 'light-3', type: 'light', x: 76, y: 61 },
  { id: 'light-4', type: 'light', x: 20, y: 90 },

  { id: 'garage', type: 'garage', x: 76, y: 73 },
  { id: 'doorbell', type: 'doorbell', x: 80, y: 84 }
];
