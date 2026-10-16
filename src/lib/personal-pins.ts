import { regionFromPoint, type Place, type PlaceKind } from "@/lib/places";

/** Device-local personal pins — never wiped by community sync. */
export const PERSONAL_PINS_KEY = "gfl-personal-pins-v1";
export const PERSONAL_PINS_BACKUP_KEY = "gfl-personal-pins-v1-bak";
export const MY_MAP_ONLY_KEY = "gfl-my-map-only-v1";

export type PersonalPinKind = "cove" | "depth" | "temperature" | "hazard" | "pin";

export type PersonalPin = {
  id: string;
  kind: PersonalPinKind;
  name: string;
  lat: number;
  lon: number;
  value?: string;
  note?: string;
  /** Matching shared/community id when also posted to the lake map. */
  sharedId?: string;
  createdAt: number;
  updatedAt: number;
};

export type PersonalPinsExport = {
  version: 1;
  exportedAt: string;
  pins: PersonalPin[];
};

const KINDS = new Set<PersonalPinKind>(["cove", "depth", "temperature", "hazard", "pin"]);

export function newPersonalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `mine-${crypto.randomUUID()}`;
  }
  return `mine-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isPersonalPinId(id: string): boolean {
  return id.startsWith("mine-");
}

function isFiniteCoord(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function sanitizePersonalPin(raw: unknown): PersonalPin | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id.startsWith("mine-")) return null;
  if (typeof o.kind !== "string" || !KINDS.has(o.kind as PersonalPinKind)) return null;
  if (typeof o.name !== "string" || !o.name.trim()) return null;
  if (!isFiniteCoord(o.lat) || !isFiniteCoord(o.lon)) return null;
  const createdAt = typeof o.createdAt === "number" && Number.isFinite(o.createdAt) ? o.createdAt : Date.now();
  const updatedAt = typeof o.updatedAt === "number" && Number.isFinite(o.updatedAt) ? o.updatedAt : createdAt;
  const pin: PersonalPin = {
    id: o.id,
    kind: o.kind as PersonalPinKind,
    name: o.name.trim().slice(0, 80),
    lat: o.lat,
    lon: o.lon,
    createdAt,
    updatedAt,
  };
  if (typeof o.value === "string" && o.value.trim()) pin.value = o.value.trim().slice(0, 40);
  if (typeof o.note === "string" && o.note.trim()) pin.note = o.note.trim().slice(0, 280);
  if (typeof o.sharedId === "string" && o.sharedId.trim()) pin.sharedId = o.sharedId.trim();
  return pin;
}

export function loadPersonalPinsFromStorage(): PersonalPin[] {
  if (typeof localStorage === "undefined") return [];
  const tryParse = (key: string): PersonalPin[] | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed.map(sanitizePersonalPin).filter((p): p is PersonalPin => !!p);
    } catch {
      return null;
    }
  };
  return tryParse(PERSONAL_PINS_KEY) ?? tryParse(PERSONAL_PINS_BACKUP_KEY) ?? [];
}

/** Persist pins. Never clears storage on malformed input — caller must pass an array. */
export function savePersonalPinsToStorage(pins: PersonalPin[]): void {
  if (typeof localStorage === "undefined") return;
  if (!Array.isArray(pins)) return;
  const clean = pins.map(sanitizePersonalPin).filter((p): p is PersonalPin => !!p);
  const json = JSON.stringify(clean);
  localStorage.setItem(PERSONAL_PINS_KEY, json);
  try {
    localStorage.setItem(PERSONAL_PINS_BACKUP_KEY, json);
  } catch {
    /* quota — primary write already succeeded */
  }
}

export function personalPinToPlace(pin: PersonalPin): Place {
  const region = regionFromPoint(pin.lat, pin.lon);
  const note = pin.note?.trim();
  const value = pin.value?.trim();
  const kind = pin.kind as PlaceKind;
  let description: string;
  if (note) description = note;
  else if (pin.kind === "depth" && value) description = `Your depth reading: ${value}. Saved on this device.`;
  else if (pin.kind === "temperature" && value) description = `Your temperature reading: ${value}. Saved on this device.`;
  else if (pin.kind === "hazard") description = "A hazard you marked. Saved on this device until you delete it.";
  else if (pin.kind === "cove") description = "A cove name you added. Saved on this device until you delete it.";
  else description = "A pin you added. Saved on this device until you delete it.";

  return {
    id: pin.id,
    name: pin.name,
    kind,
    lat: pin.lat,
    lon: pin.lon,
    region,
    description,
    access: "Your pin — stays on this device until you delete it",
    importance: 2,
    fieldValue: value,
    mine: true,
    community: pin.kind === "cove" ? true : undefined,
    field: pin.kind !== "cove" ? true : undefined,
  };
}

export function buildPersonalExport(pins: PersonalPin[]): PersonalPinsExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    pins: pins.map(sanitizePersonalPin).filter((p): p is PersonalPin => !!p),
  };
}

export function parsePersonalImport(raw: unknown): PersonalPin[] | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const list = Array.isArray(o) ? o : Array.isArray(o.pins) ? o.pins : null;
  if (!list) return null;
  const pins = list.map(sanitizePersonalPin).filter((p): p is PersonalPin => !!p);
  return pins;
}

export function loadMyMapOnlyPref(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(MY_MAP_ONLY_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveMyMapOnlyPref(on: boolean): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(MY_MAP_ONLY_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}
