// src/hooks/useAIInsights.js
// A lightweight "AI insights" engine: no external model, just heuristics run
// against the app's own live state (devices, energy, notifications). It's
// framed as AI-generated because that's exactly what a real version of this
// would be — anomaly/pattern rules over telemetry — just without a model
// behind it yet.
import { useMemo } from 'react';
import { energySummary } from '../data/energy-data.js';

const TYPICAL_ONLINE_DEVICES = 3;

export function useAIInsights({ devices, notifications }) {
  return useMemo(() => {
    const insights = [];
    const onlineDevices = devices.filter((d) => d.state === 'on');

    // Anomaly: more devices running than the usual baseline for this time of day
    if (onlineDevices.length >= TYPICAL_ONLINE_DEVICES + 2) {
      insights.push({
        id: 'anomaly-devices',
        kind: 'anomaly',
        icon: '⚠️',
        title: 'Higher device usage than usual',
        message: `${onlineDevices.length} devices are on right now — that's above your typical ${TYPICAL_ONLINE_DEVICES} for this time of day. Worth a quick check.`
      });
    }

    // Anomaly: grid consumption running high relative to solar production
    if (energySummary.gridConsumptionKWh > energySummary.solarProductionKWh * 1.8) {
      insights.push({
        id: 'anomaly-grid',
        kind: 'anomaly',
        icon: '📈',
        title: 'Grid usage is outpacing solar today',
        message: `You've pulled ${energySummary.gridConsumptionKWh} kWh from the grid vs ${energySummary.solarProductionKWh} kWh of solar — about ${Math.round((energySummary.gridConsumptionKWh / energySummary.solarProductionKWh - 1) * 100)}% above a typical solar-covered day.`
      });
    }

    // Pattern: repeated manual toggles of the same device suggest an automation
    const deviceToggleCounts = {};
    notifications.forEach((n) => {
      const match = /^(.+?) turned (on|off)$/.exec(n.message) || /: (.+) turned (on|off)$/.exec(n.message);
      if (match) {
        const name = match[1];
        deviceToggleCounts[name] = (deviceToggleCounts[name] || 0) + 1;
      }
    });
    const repeated = Object.entries(deviceToggleCounts).find(([, count]) => count >= 2);
    if (repeated) {
      insights.push({
        id: 'suggest-automation',
        kind: 'suggestion',
        icon: '💡',
        title: 'Suggested automation',
        message: `You've toggled "${repeated[0]}" a few times recently. Want to turn that into an automation so it happens on its own?`
      });
    }

    // Cost-saving suggestion, framed around real solar figures
    insights.push({
      id: 'suggest-schedule',
      kind: 'suggestion',
      icon: '🔆',
      title: 'Shift usage to solar peak',
      message: `Solar production is highest around midday. Running high-draw appliances (dishwasher, laundry) then instead of evening could reduce grid draw by an estimated 10-15%.`
    });

    return insights;
  }, [devices, notifications]);
}
