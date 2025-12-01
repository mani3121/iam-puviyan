// utils/carbon.ts

export type SimplifiedCO2Options = {
  energyPerGB_kWh?: number;      // default 0.405 kWh/GB
  carbonIntensity_gPerkWh?: number; // default 475 g/kWh
};

export type SimplifiedCO2Result = {
  gramsCO2: number;  // g CO2 per view
  kWh: number;       // kWh per view
  pageGB: number;    // GB transferred per view
};

/**
 * Best-effort transferred bytes for this page view.
 * - Prefers transferSize (includes headers)
 * - Falls back to encodedBodySize per entry (cache/TAO/SW)
 * - Includes the main navigation entry (HTML)
 */
export function getTransferredBytes(): number {
  if (typeof performance === 'undefined' || !('getEntriesByType' in performance)) {
    return 0;
  }

  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    let bytes = 0;

    const addEntry = (entry?: PerformanceResourceTiming | PerformanceNavigationTiming) => {
      if (!entry) return;
      const ts = (entry as any).transferSize as number | undefined;
      const ebs = (entry as any).encodedBodySize as number | undefined;
      const ds = (entry as any).decodedBodySize as number | undefined;
      
      if (typeof ts === 'number' && isFinite(ts) && ts > 0) {
        bytes += ts;
      } else if (typeof ebs === 'number' && isFinite(ebs) && ebs > 0) {
        bytes += ebs;
      } else if (typeof ds === 'number' && isFinite(ds) && ds > 0) {
        bytes += ds;
      }
    };

    addEntry(nav);
    for (const r of resources) {
      addEntry(r);
    }

    return bytes;
  } catch (error) {
    console.warn('Error calculating transferred bytes:', error);
    return 0;
  }
}

/**
 * Simplified CO₂ per view:
 * CO2(g) = PageSize(GB) * EnergyPerGB(kWh) * CarbonIntensity(g/kWh)
 */
export function simplifiedCO2PerView(
  pageMB: number,
  opts: SimplifiedCO2Options = {}
): SimplifiedCO2Result {
  const {
    energyPerGB_kWh = 0.405,
    carbonIntensity_gPerkWh = 475,
  } = opts;

  const pageGB = pageMB / 1024;
  const energyUsed = pageGB * energyPerGB_kWh;
  const co2 = energyUsed * carbonIntensity_gPerkWh;

  return {
    gramsCO2: Number(co2.toFixed(3)),
    kWh: Number(energyUsed.toFixed(6)),
    pageGB: Number(pageGB.toFixed(6)),
  };
}

/**
 * Compare against a global-average grams/view for a simple "X% lower" badge.
 */
export function compareToBaseline(current_g: number, baseline_g: number) {
  if (baseline_g <= 0) return { deltaPct: 0, label: '—' };
  const deltaPct = ((baseline_g - current_g) / baseline_g) * 100;
  const label =
    deltaPct >= 0 ? `${Math.round(deltaPct)}% lower than global average`
                  : `${Math.abs(Math.round(deltaPct))}% higher than global average`;
  return { deltaPct, label };
}
