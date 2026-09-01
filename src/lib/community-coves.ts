import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { LAKE_BOUNDS, PLACES } from "@/lib/places";
import { haversineMiles } from "@/lib/utils";

export type CommunityCoveRow = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  note: string | null;
};

const MAX_COVES = 400;
const MIN_SEPARATION_MI = 0.12;

const AddInput = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  note: z.string().optional(),
});

function cleanName(raw: string) {
  return raw.replace(/\s+/g, " ").replace(/[\u0000-\u001f]/g, "").trim();
}

function inLake(lat: number, lon: number) {
  const [[minLat, minLon], [maxLat, maxLon]] = LAKE_BOUNDS;
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

function looksLikeSpam(s: string) {
  return /https?:|www\.|@|\.(com|net|org)\b/i.test(s);
}

export const listCommunityCoves = createServerFn({ method: "GET" }).handler(
  async (): Promise<CommunityCoveRow[]> => {
    const sql = await getSql();
    return sql<CommunityCoveRow>`
      select id, name, lat, lon, note
      from community_coves
      order by created_at desc, id desc
    `;
  },
);

export const addCommunityCove = createServerFn({ method: "POST" })
  .validator((data: unknown) => AddInput.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; cove: CommunityCoveRow } | { ok: false; error: string }> => {
      const name = cleanName(data.name);
      const noteRaw = data.note ? cleanName(data.note) : "";
      const note = noteRaw.length > 0 ? noteRaw : null;

      if (name.length < 2 || name.length > 48) {
        return { ok: false, error: "Use a cove name between 2 and 48 characters." };
      }
      if (note && note.length > 160) {
        return { ok: false, error: "Keep the note under 160 characters." };
      }
      if (looksLikeSpam(name) || (note && looksLikeSpam(note))) {
        return { ok: false, error: "Leave links and addresses off the pin." };
      }
      if (!inLake(data.lat, data.lon)) {
        return { ok: false, error: "Drop the pin on Greers Ferry Lake." };
      }

      const sql = await getSql();
      const [countRow] = await sql<{ n: number }>`
        select count(*)::int as n from community_coves
      `;
      if ((countRow?.n ?? 0) >= MAX_COVES) {
        return { ok: false, error: "The local list is full right now." };
      }

      const existing = await sql<{ id: number; name: string; lat: number; lon: number }>`
        select id, name, lat, lon from community_coves
      `;
      const key = name.toLowerCase();
      if (PLACES.some((p) => p.name.toLowerCase() === key)) {
        return { ok: false, error: "That name is already on the official map." };
      }
      for (const row of existing) {
        if (row.name.toLowerCase() === key) {
          return { ok: false, error: "Someone already added that cove name." };
        }
        if (
          haversineMiles({ lat: data.lat, lon: data.lon }, { lat: row.lat, lon: row.lon }) <
          MIN_SEPARATION_MI
        ) {
          return {
            ok: false,
            error: `That's right next to \u201c${row.name}\u201d. Zoom or move the pin a little.`,
          };
        }
      }

      const [cove] = await sql<CommunityCoveRow>`
        insert into community_coves (name, lat, lon, note)
        values (${name}, ${data.lat}, ${data.lon}, ${note})
        returning id, name, lat, lon, note
      `;
      if (!cove) return { ok: false, error: "Could not save that cove. Try again." };
      return { ok: true, cove };
    },
  );
