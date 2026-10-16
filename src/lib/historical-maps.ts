/**
 * Historical USGS topographic overlay for Greers Ferry Lake.
 *
 * Before the dam uses the Mountain View 1:125,000 sheet (1949 reprint of the
 * 1894 survey) — the map that prints Stark, AR in red ink on the sheet itself.
 * Streets / Satellite / Topo stay the main basemap; this stack is opt-in only.
 *
 * Coverage is two Leaflet tile layers so transparent sheet collars cannot blank
 * the lake:
 *   1. Fill — 250k Russellville / Memphis backdrop east of the Mountain View neatline
 *   2. Mountain View 125k (Imprint ≥ 1930, prefer 1949) — Stark + pre-lake valley
 *
 * Tiles use png32 + transparent so collars are real alpha. Opacity is applied
 * on the historical pane (not per layer) so those collars composite.
 */

export const HISTORICAL_IMAGE_SERVER =
  "https://historical1.arcgis.com/arcgis/rest/services/USGS_Historical_Topographic_Maps/ImageServer";

export type HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute";
  mosaicOperation: "MT_FIRST";
  where: string;
  sortField: string;
  sortValue: string;
  ascending: boolean;
};

/** Continuous backdrop for areas outside the Mountain View neatline (east lake / dam). */
export const HISTORICAL_MOSAIC_FILL: HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where: "DateCurrent <= 1963 AND Map_Scale >= 200000",
  sortField: "Map_Scale",
  sortValue: "250000",
  ascending: true,
};

/**
 * Mountain View 125k — the sheet that labels Stark in red.
 * Prefer newest imprint so the 1949 reprint wins over earlier reprints.
 */
export const HISTORICAL_MOSAIC_DETAIL: HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where:
    "Map_Name = 'Mountain View' AND Map_Scale = 125000 AND Imprint_Year >= 1930",
  sortField: "Imprint_Year",
  sortValue: "1949",
  ascending: false,
};

/** @deprecated alias — prefer fill + detail stack. */
export const HISTORICAL_MOSAIC_REGIONAL = HISTORICAL_MOSAIC_DETAIL;

/** @deprecated single-rule callers — prefer the fill + detail stack. */
export const HISTORICAL_MOSAIC_RULE = HISTORICAL_MOSAIC_DETAIL;

export const HISTORICAL_CREDIT = "USGS Historical Topographic Maps";
export const HISTORICAL_DEFAULT_OPACITY = 0.78;

/** Web Mercator half-circumference in meters (EPSG:3857). */
const WEB_MERCATOR_HALF = 20037508.342789244;

export function historicalTileUrl(
  x: number,
  y: number,
  z: number,
  rule: HistoricalMosaicRule = HISTORICAL_MOSAIC_DETAIL,
  tileSize = 256,
): string {
  const n = 2 ** z;
  const size = (2 * WEB_MERCATOR_HALF) / n;
  const xmin = -WEB_MERCATOR_HALF + x * size;
  const ymax = WEB_MERCATOR_HALF - y * size;
  const xmax = xmin + size;
  const ymin = ymax - size;
  const mosaicRule = encodeURIComponent(JSON.stringify(rule));
  // png32 + transparent so sheet collars are alpha (not opaque cream).
  return (
    `${HISTORICAL_IMAGE_SERVER}/exportImage` +
    `?bbox=${xmin},${ymin},${xmax},${ymax}` +
    `&bboxSR=3857&imageSR=3857&size=${tileSize},${tileSize}` +
    `&format=png32&transparent=true&interpolation=RSP_BilinearInterpolation` +
    `&mosaicRule=${mosaicRule}&f=image`
  );
}
