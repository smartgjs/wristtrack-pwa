import type { Records, ISODate } from "./types";

const KEY = "wristtrack.v1.records";

export function loadRecords(): Records {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Records;
    return {};
  } catch {
    return {};
  }
}

export function saveRecords(records: Records) {
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function setRecord(date: ISODate, watchId: string, records: Records): Records {
  return { ...records, [date]: watchId };
}

export function deleteRecord(date: ISODate, records: Records): Records {
  const next = { ...records };
  delete next[date];
  return next;
}