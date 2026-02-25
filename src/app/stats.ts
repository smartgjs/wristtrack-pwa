import type { Records } from "./types";
import { WATCHES } from "./watches";
import { parseISO, isValid, format } from "date-fns";

const round1 = (n: number) => Math.round(n * 10) / 10;

export function getMonthlyStats(records: Records, year: number, month1to12: number) {
  const ym = `${year}-${String(month1to12).padStart(2, "0")}`; // YYYY-MM
  const byWatch: Record<string, number> = Object.fromEntries(WATCHES.map(w => [w.id, 0]));
  let total = 0;

  for (const [d, watchId] of Object.entries(records)) {
    const dt = parseISO(d);
    if (!isValid(dt)) continue;
    if (format(dt, "yyyy-MM") !== ym) continue;
    if (!(watchId in byWatch)) continue;
    byWatch[watchId] += 1;
    total += 1;
  }

  const ratios: Record<string, number> = {};
  for (const w of WATCHES) {
    ratios[w.id] = total === 0 ? 0 : round1((byWatch[w.id] / total) * 100);
  }

  return { year, month: month1to12, total, byWatch, ratios };
}

export function getYearlyStats(records: Records, year: number) {
  const y = String(year);
  const byWatch: Record<string, number> = Object.fromEntries(WATCHES.map(w => [w.id, 0]));
  let total = 0;

  for (const [d, watchId] of Object.entries(records)) {
    const dt = parseISO(d);
    if (!isValid(dt)) continue;
    if (format(dt, "yyyy") !== y) continue;
    if (!(watchId in byWatch)) continue;
    byWatch[watchId] += 1;
    total += 1;
  }

  const ratios: Record<string, number> = {};
  for (const w of WATCHES) {
    ratios[w.id] = total === 0 ? 0 : round1((byWatch[w.id] / total) * 100);
  }

  return { year, total, byWatch, ratios };
}