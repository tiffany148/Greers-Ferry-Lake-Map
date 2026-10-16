/**
 * Pre-dam USGS topographic maps, served already-georeferenced in Web Mercator
 * from the Esri / USGS Historical Topographic Maps ImageServer.
 *
 * Coverage is stacked as two Leaflet tile layers (not one mosaic) so transparent
 * sheet collars cannot blank out the lake:
 *   1. Fill (250k) — continuous Russellville / Memphis backdrop
 *   2. Regional (125k) — Mountain View / Batesville 1930+ reprints (Stark, roads, railway)
 *
 * A single mosaic with MT_FIRST lets Mountain View’s empty collar south of its
 * neatline “win” and hide Russellville underneath — that showed up as a sharp
 * horizontal cutoff on the live map. Tiles use png32 + transparent so collars
 * are real alpha. Opacity is applied on the historical pane (not per layer) so
 * those collars composite. (A ≤62.5k detail layer punched through to the basemap
 * in Chromium when stacked on top of fill, so it is omitted from the stack.)
 *
 * 1973+ 7.5′ quads (Greers Ferry, Fairfield Bay, …) already show the reservoir
 * and stay excluded. Photorevisions of the 1963 sheets (DateCurrent 1975+)
 * are excluded for the same reason.
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

/** Continuous pre-dam backdrop — 1:250k sheets only. */
export const HISTORICAL_MOSAIC_FILL: HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where: "DateCurrent <= 1963 AND Map_Scale >= 200000",
  sortField: "Map_Scale",
  sortValue: "250000",
  ascending: true,
};

/** Mid-scale cultural detail (Stark, roads, dismantled railway). */
export const HISTORICAL_MOSAIC_REGIONAL: HistoricalMosaicRule = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where:
    "DateCurrent <= 1963 AND Map_Scale > 62500 AND Map_Scale < 200000 AND Imprint_Year >= 1930",
  sortField: "Map_Scale",
  sortValue: "125000",
  ascending: true,
};

/** @deprecated single-rule callers — prefer the fill + regional stack. */
export const HISTORICAL_MOSAIC_RULE = HISTORICAL_MOSAIC_REGIONAL;

export const HISTORICAL_CREDIT = "USGS Historical Topographic Maps";
export const HISTORICAL_DEFAULT_OPACITY = 0.78;

/** Web Mercator half-circumference in meters (EPSG:3857). */
const WEB_MERCATOR_HALF = 20037508.342789244;

export function historicalTileUrl(
  x: number,
  y: number,
  z: number,
  rule: HistoricalMosaicRule = HISTORICAL_MOSAIC_REGIONAL,
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
