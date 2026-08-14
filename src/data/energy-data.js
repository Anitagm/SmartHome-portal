// js/data/energy-data.js

export const energySummary = {
  gridConsumptionKWh: 7.42,
  solarProductionKWh: 3.66,
  batteryKWh: 2.54,
  gridReturnedKWh: 1.2,
  netCost: 1.85,
  currency: '$'
};

export const deviceConsumption = [
  { name: 'Bedroom AC', kwh: 3.4 },
  { name: 'Living Light', kwh: 1.2 },
  { name: 'Dishwasher', kwh: 1.1 },
  { name: 'Office Desk', kwh: 0.9 },
  { name: 'Smart TV', kwh: 0.6 },
  { name: 'Coffee Maker', kwh: 0.3 }
];

export const sources = [
  { name: 'Solar total', color: '#f4b942', usage: '3,349.41 kWh', cost: null },
  { name: 'Battery total', color: '#55d187', usage: '0 kWh', cost: null },
  { name: 'Grid total', color: '#6ea8fe', usage: '1,346.42 kWh', cost: '$0.00' },
  { name: 'Gas total', color: '#f27676', usage: '0 m³', cost: null },
  { name: 'Water total', color: '#38c7c2', usage: '0 L', cost: null }
];

export const monthLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export const electricityUsage = {
  consumedSolar: [80, 320, 180, 90, 180, 220, 260, 210, 180, 120, 300, 150],
  consumedBattery: [0, 60, 40, 10, 30, 40, 50, 30, 20, 10, 60, 20],
  combinedFromGrid: [40, 220, 180, 60, 220, 230, 200, 90, 140, 80, 60, 220],
  returnedLowTariff: [-60, -140, -60, -260, -40, -40, -40, -40, -40, -40, -100, -60],
  returnedHighTariff: [-20, -40, -20, -40, -20, -20, -20, -20, -20, -20, -40, -20]
};

export const powerSources = {
  solar: [0, 1.2, 3.8, 5.6, 4.9, 3.1, 1.4, 0.2, 0, 0, 0, 0],
  grid: [1.5, 1.1, 0.8, 0.6, 0.5, 0.7, 1.0, 1.6, 2.2, 2.6, 2.8, 2.1],
  battery: [0.2, 0.2, -0.5, -1.2, -0.9, -0.2, 0.4, 0.6, 0.3, 0.1, 0, 0.1]
};

export const gasConsumptionMonthly = new Array(12).fill(0);
export const waterConsumptionMonthly = [12, 15, 11, 14, 13, 10, 12, 16, 14, 11, 13, 12];

export const solarProductionMonthly = [30, 310, 370, 230, 460, 335, 315, 175, 130, 320, 345, 60];

export const deviceMonthlyUsage = {
  'Electric car': [40, 180, 90, 20, 60, 70, 50, 30, 20, 10, 80, 40],
  'Air conditioning': [10, 30, 20, 10, 15, 40, 60, 90, 70, 30, 15, 10],
  'Washing machine': [5, 12, 8, 6, 9, 10, 11, 9, 7, 6, 10, 8]
};

export const deviceTotalUsage = [
  { name: 'Electric car', kwh: 690 },
  { name: 'Air conditioning', kwh: 410 },
  { name: 'Washing machine', kwh: 101 },
  { name: 'Dryer', kwh: 62 },
  { name: 'Heat pump', kwh: 38 },
  { name: 'Boiler', kwh: 22 }
];

export const gridBalance = {
  importedKWh: 4829.8,
  exportedKWh: 3483.37,
  netKWh: 1346.42
};

export const gauges = {
  netImportedKWh: 1346.42,
  selfConsumedSolarPercent: 13,
  selfSufficiencyPercent: 0
};

export const detailedSources = [
  { name: 'Solar total', color: '#f4b942', usage: '3,349.41 kWh', cost: null, total: true },
  { name: 'Battery total', color: '#55d187', usage: '0 kWh', cost: null, total: true },
  { name: 'sensor.energy_consumption_tarif_1', color: '#6ea8fe', usage: '2,266.87 kWh', cost: '$0.00' },
  { name: 'Returned to grid low tariff', color: '#a78bfa', usage: '-0 kWh', cost: '-$0.00' },
  { name: 'Grid consumption high tariff', color: '#38c7c2', usage: '2,562.93 kWh', cost: '$0.00' },
  { name: 'Returned to grid high tariff', color: '#a78bfa', usage: '-3,483.37 kWh', cost: '-$0.00' },
  { name: 'Grid total', color: '#6ea8fe', usage: '1,346.42 kWh', cost: '$0.00', total: true }
];
