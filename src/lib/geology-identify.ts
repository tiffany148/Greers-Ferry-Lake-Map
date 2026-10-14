/**
 * Macrostrat point-identify for the carto geology overlay.
 * https://macrostrat.org/api/v2/geologic_units/map?lat=&lng=
 */

export const GEOLOGY_IDENTIFY_URL = "https://macrostrat.org/api/v2/geologic_units/map";

export type GeologyUnit = {
  map_id?: number;
  source_id?: number;
  name?: string | null;
  strat_name?: string | null;
  lith?: string | null;
  descrip?: string | null;
  comments?: string | null;
  color?: string | null;
  t_int_name?: string | null;
  b_int_name?: string | null;
  t_age?: number | null;
  b_age?: number | null;
  scale?: string | null;
};

type IdentifyResponse = {
  success?: {
    data?: GeologyUnit[];
    refs?: Record<string, string>;
  };
};

const SCALE_RANK: Record<string, number> = {
  large: 0,
  medium: 1,
  small: 2,
  tiny: 3,
};

function isWater(unit: GeologyUnit): boolean {
  const name = (unit.name || "").trim().toLowerCase();
  return name === "water" || name === "lake" || name === "reservoir";
}

/** Prefer detailed map scales; skip water polygons when something else is present. */
export function pickBestUnit(units: GeologyUnit[]): GeologyUnit | null {
  if (!units.length) return null;
  const land = units.filter((u) => !isWater(u));
  const pool = land.length ? land : units;
  return [...pool].sort((a, b) => {
    const ra = SCALE_RANK[(a.scale || "").toLowerCase()] ?? 9;
    const rb = SCALE_RANK[(b.scale || "").toLowerCase()] ?? 9;
    return ra - rb;
  })[0]!;
}

function tidyLith(lith: string): string {
  return lith
    .replace(/Major:\s*\{([^}]*)\}/gi, (_, inner: string) => inner)
    .replace(/Minor:\s*\{([^}]*)\}/gi, (_, inner: string) => `minor: ${inner}`)
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatAge(unit: GeologyUnit): string | null {
  const top = unit.t_int_name?.trim();
  const bottom = unit.b_int_name?.trim();
  if (top && bottom && top !== bottom) return `${bottom} – ${top}`;
  return top || bottom || null;
}

export type GeologyIdentifyResult = {
  unit: GeologyUnit;
  title: string;
  rockType: string | null;
  age: string | null;
  description: string | null;
  sourceNote: string | null;
  color: string | null;
};

export function summarizeUnit(unit: GeologyUnit, refs?: Record<string, string>): GeologyIdentifyResult {
  const title =
    (unit.name && unit.name.trim()) ||
    (unit.strat_name && unit.strat_name.trim()) ||
    "Unnamed map unit";
  const rockType = unit.lith?.trim() ? tidyLith(unit.lith) : null;
  const age = formatAge(unit);
  const description =
    (unit.descrip && unit.descrip.trim()) ||
    (unit.comments && unit.comments.trim()) ||
    null;
  let sourceNote: string | null = null;
  if (unit.source_id != null && refs?.[String(unit.source_id)]) {
    sourceNote = refs[String(unit.source_id)]!.trim();
  }
  return {
    unit,
    title,
    rockType,
    age,
    description,
    sourceNote,
    color: unit.color?.trim() || null,
  };
}

export async function identifyGeologyAt(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<GeologyIdentifyResult | null> {
  const url = `${GEOLOGY_IDENTIFY_URL}?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Macrostrat identify failed (${res.status})`);
  const body = (await res.json()) as IdentifyResponse;
  const data = body.success?.data ?? [];
  const unit = pickBestUnit(data);
  if (!unit) return null;
  return summarizeUnit(unit, body.success?.refs);
}

export function geologyPopupHtml(result: GeologyIdentifyResult, escapeHtml: (s: string) => string): string {
  const swatch = result.color
    ? `<span class="lf-geo-swatch" style="background:${escapeHtml(result.color)}"></span>`
    : "";
  const rows: string[] = [];
  if (result.rockType) {
    rows.push(
      `<div class="lf-geo-row"><span class="lf-geo-k">Rock type</span><span class="lf-geo-v">${escapeHtml(result.rockType)}</span></div>`,
    );
  }
  if (result.age) {
    rows.push(
      `<div class="lf-geo-row"><span class="lf-geo-k">Age</span><span class="lf-geo-v">${escapeHtml(result.age)}</span></div>`,
    );
  }
  if (result.unit.strat_name?.trim() && result.unit.strat_name.trim() !== result.title) {
    rows.push(
      `<div class="lf-geo-row"><span class="lf-geo-k">Unit</span><span class="lf-geo-v">${escapeHtml(result.unit.strat_name.trim())}</span></div>`,
    );
  }
  const expl =
    result.description ||
    (result.rockType
      ? `Bedrock mapped as ${result.rockType}${result.age ? ` (${result.age})` : ""}.`
      : "Bedrock unit from the Macrostrat / USGS geologic map compilation.");
  const src = result.sourceNote
    ? `<p class="lf-geo-src">${escapeHtml(result.sourceNote.slice(0, 280))}${result.sourceNote.length > 280 ? "…" : ""}</p>`
    : "";
  return `<div class="lf-geo-popup">
    <div class="lf-geo-title">${swatch}<strong>${escapeHtml(result.title)}</strong></div>
    ${rows.join("")}
    <p class="lf-geo-expl">${escapeHtml(expl)}</p>
    ${src}
    <p class="lf-geo-credit">Macrostrat / USGS · tap elsewhere to identify another area</p>
  </div>`;
}
