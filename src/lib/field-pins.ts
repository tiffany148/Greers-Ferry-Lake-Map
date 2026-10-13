import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { LAKE_BOUNDS } from "@/lib/places";

export const FIELD_PIN_KINDS = ["depth", "temperature", "hazard", "pin"] as const;
export type FieldPinKind = (typeof FIELD_PIN_KINDS)[number];

export type FieldPinRow = {
  id: number;
  kind: FieldPinKind;
  title: string;
  value: string | null;
  lat: number;
  lon: number;
  note: string | null;
};

const MAX_PINS = 800;

const AddInput = z.object({
  kind: z.enum(FIELD_PIN_KINDS),
  title: z.string(),
  value: z.string().optional(),
  lat: z.number(),
  lon: z.number(),
  note: z.string().optional(),
});

function cleanText(raw: string) {
  return raw.replace(/\s+/g, " ").replace(/[\u0000-\u001f]/g, "").trim();
}

function inLake(lat: number, lon: number) {
  const [[minLat, minLon], [maxLat, maxLon]] = LAKE_BOUNDS;
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

function looksLikeSpam(s: string) {
  return /https?:|www\.|@|\.(com|net|org)\b/i.test(s);
}

function parseDepthFeet(raw: string): string | null {
  const m = raw.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(ft|feet|')?/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 1 || n > 250) return null;
  const rounded = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
  return `${rounded} ft`;
}

function parseTempF(raw: string): string | null {
  const m = raw.replace(/,/g, "").match(/(-?\d+(?:\.\d+)?)\s*(°?F|F|degrees?)?/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 32 || n > 110) return null;
  const rounded = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
  return `${rounded}°F`;
}

export const listFieldPins = createServerFn({ method: "GET" }).handler(
  async (): Promise<FieldPinRow[]> => {
    const sql = await getSql();
    return sql<FieldPinRow>`
      select id, kind, title, value, lat, lon, note
      from field_pins
      order by created_at desc, id desc
    `;
  },
);

export const addFieldPin = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddInput.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; pin: FieldPinRow } | { ok: false; error: string }> => {
      const kind = data.kind;
      const noteRaw = data.note ? cleanText(data.note) : "";
      const note = noteRaw.length > 0 ? noteRaw : null;
      let title = cleanText(data.title);
      let valueText = data.value ? cleanText(data.value) : "";
      let value: string | null = valueText || null;

      if (!inLake(data.lat, data.lon)) {
        return { ok: false, error: "Drop the pin on Greers Ferry Lake." };
      }
      if (note && note.length > 160) {
        return { ok: false, error: "Keep the note under 160 characters." };
      }
      if (
        looksLikeSpam(title) ||
        (note && looksLikeSpam(note)) ||
        (valueText && looksLikeSpam(valueText))
      ) {
        return { ok: false, error: "Leave links and addresses off the pin." };
      }

      if (kind === "depth") {
        const parsed = parseDepthFeet(valueText || title);
        if (!parsed) {
          return { ok: false, error: "Enter a depth between 1 and 250 ft." };
        }
        value = parsed;
        title = title.length >= 2 ? title : parsed;
      } else if (kind === "temperature") {
        const parsed = parseTempF(valueText || title);
        if (!parsed) {
          return { ok: false, error: "Enter a water temperature between 32 and 110°F." };
        }
        value = parsed;
        title = title.length >= 2 ? title : parsed;
      } else if (kind === "hazard") {
        if (title.length < 2 || title.length > 48) {
          return { ok: false, error: "Describe the hazard in 2–48 characters." };
        }
      } else if (title.length < 2 || title.length > 48) {
        return { ok: false, error: "Use a pin name between 2 and 48 characters." };
      }

      if (title.length < 2 || title.length > 48) {
        return { ok: false, error: "Use a title between 2 and 48 characters." };
      }

      const sql = await getSql();
      const [countRow] = await sql<{ n: number }>`
        select count(*)::int as n from field_pins
      `;
      if ((countRow?.n ?? 0) >= MAX_PINS) {
        return { ok: false, error: "The field list is full right now." };
      }

      const [pin] = await sql<FieldPinRow>`
        insert into field_pins (kind, title, value, lat, lon, note)
        values (${kind}, ${title}, ${value}, ${data.lat}, ${data.lon}, ${note})
        returning id, kind, title, value, lat, lon, note
      `;
      if (!pin) return { ok: false, error: "Could not save that pin. Try again." };
      return { ok: true, pin };
    },
  );
