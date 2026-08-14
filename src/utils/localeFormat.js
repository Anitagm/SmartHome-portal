// src/utils/localeFormat.js
// Small formatting helpers driven by the user's Localization preferences.

export function getTimezoneList() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch {
    // fall through to the static list below
  }
  return [
    'UTC', 'Europe/Berlin', 'Europe/London', 'Europe/Paris', 'Europe/Moscow',
    'Asia/Tehran', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo',
    'Australia/Sydney', 'America/New_York', 'America/Chicago', 'America/Denver',
    'America/Los_Angeles', 'America/Sao_Paulo'
  ];
}

export function formatTime(date, timeFormat, timezone) {
  const opts = { hour: '2-digit', minute: '2-digit' };
  if (timezone && timezone !== 'auto') opts.timeZone = timezone;
  if (timeFormat === '12') opts.hour12 = true;
  else if (timeFormat === '24') opts.hour12 = false;
  return date.toLocaleTimeString([], opts);
}

export function formatDate(date, dateFormat) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  switch (dateFormat) {
    case 'DMY': return `${dd}/${mm}/${yyyy}`;
    case 'MDY': return `${mm}/${dd}/${yyyy}`;
    case 'YMD': return `${yyyy}-${mm}-${dd}`;
    default: return date.toLocaleDateString();
  }
}

export function formatNumber(value, numberFormat) {
  switch (numberFormat) {
    case 'comma_decimal':
      return new Intl.NumberFormat('en-US').format(value);
    case 'decimal_comma':
      return new Intl.NumberFormat('de-DE').format(value);
    case 'space_comma':
      return new Intl.NumberFormat('fr-FR').format(value);
    case 'none':
      return String(value);
    default:
      return value.toLocaleString();
  }
}

export const FIRST_DAY_OPTIONS = [
  { value: 'auto', label: 'Auto (use language setting)' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' }
];

export const NUMBER_FORMAT_OPTIONS = [
  { value: 'auto', label: 'Auto (use language setting)' },
  { value: 'comma_decimal', label: '1,234.56' },
  { value: 'decimal_comma', label: '1.234,56' },
  { value: 'space_comma', label: '1 234,56' },
  { value: 'none', label: '1234.56' }
];

export const TIME_FORMAT_OPTIONS = [
  { value: 'auto', label: 'Auto (use language setting)' },
  { value: '12', label: '12-hour (AM/PM)' },
  { value: '24', label: '24-hour' }
];

export const DATE_FORMAT_OPTIONS = [
  { value: 'auto', label: 'Auto (use language setting)' },
  { value: 'DMY', label: 'DD/MM/YYYY' },
  { value: 'MDY', label: 'MM/DD/YYYY' },
  { value: 'YMD', label: 'YYYY-MM-DD' }
];
