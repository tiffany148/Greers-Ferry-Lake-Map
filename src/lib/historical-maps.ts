/**
 * Historical USGS topographic overlay for Greers Ferry Lake.
 *
 * Before the dam uses the green woodland / blue-water 7.5′ USGS style
 * (Greers Ferry 1973 and neighbors) — the sheets that print Stark, Higden,
 * Greers Ferry, churches/schools, and section grids on the map itself.
 * Streets / Satellite / Topo stay the main basemap; this stack is opt-in only.
 *
 * Coverage is two Leaflet tile layers so transparent sheet collars cannot blank
 * the lake:
 *   1. Fill — woodland-tint 100k–250k (Mountain View / Searcy / Batesville + 250k)
 *   2. Detail — woodland-tint 24k quads 1970–1982 (Greers Ferry, Fairfield Bay, …)
 *
 * Beige 125k Mountain View / Batesville reprints (Woodland_Tint = N) are excluded.
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

/**
 * Continuous woodland-tint backdrop for overview zooms and sheet collars.
 * 100k Mountain View / Searcy / Batesville + 250k Russellville / Memphis.
 */
export const HISTORICAL_MOSAIC_FILL: HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where:
    "Woodland_Tint = 'Y' AND Map_Scale >= 100000 AND Map_Scale <= 250000 AND DateCurrent <= 1986",
  sortField: "Map_Scale",
  sortValue: "100000",
  ascending: true,
};

/**
 * Green/blue 7.5′ quads covering the lake (Stark printed on Greers Ferry 1973).
 * Prefer earliest DateCurrent so 1973 sheets win over later photorevisions.
 */
export const HISTORICAL_MOSAIC_DETAIL: HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where:
    "Woodland_Tint = 'Y' AND Map_Scale = 24000 AND DateCurrent >= 1970 AND DateCurrent <= 1982",
  sortField: "DateCurrent",
  sortValue: "1973",
  ascending: true,
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
