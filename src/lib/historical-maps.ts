/**
 * Pre-dam USGS topographic maps, served already-georeferenced in Web Mercator
 * from the Esri / USGS Historical Topographic Maps ImageServer.
 *
 * Mosaic picks the largest-scale sheet whose DateCurrent is 1963 or earlier:
 *   - 1963 7.5′ Heber Springs, Quitman, West Pangburn (lower lake / dam)
 *   - 1961 7.5′ Bee Branch, Morganton (southwest arm)
 *   - 1890s 1:125k over the main pool, which had no 24k sheet until 1973
 *
 * 1973 7.5′ quads (Greers Ferry, Fairfield Bay, …) already show the reservoir
 * and are excluded. Photorevisions of the 1963 sheets (DateCurrent 1975+)
 * are excluded for the same reason.
 */
export const HISTORICAL_IMAGE_SERVER =
  "https://historical1.arcgis.com/arcgis/rest/services/USGS_Historical_Topographic_Maps/ImageServer";

export const HISTORICAL_MOSAIC_RULE = {
  mosaicMethod: "esriMosaicAttribute",
  mosaicOperation: "MT_FIRST",
  where: "DateCurrent <= 1963",
  sortField: "Map_Scale",
  sortValue: "24000",
  ascending: true,
} as const;

export const HISTORICAL_CREDIT = "USGS Historical Topographic Maps";
export const HISTORICAL_DEFAULT_OPACITY = 0.72;

/** Web Mercator half-circumference in meters (EPSG:3857). */
const WEB_MERCATOR_HALF = 20037508.342789244;

export function historicalTileUrl(x: number, y: number, z: number, tileSize = 256): string {
  const n = 2 ** z;
  const size = (2 * WEB_MERCATOR_HALF) / n;
  const xmin = -WEB_MERCATOR_HALF + x * size;
  const ymax = WEB_MERCATOR_HALF - y * size;
  const xmax = xmin + size;
  const ymin = ymax - size;
  const mosaicRule = encodeURIComponent(JSON.stringify(HISTORICAL_MOSAIC_RULE));
  return (
    `${HISTORICAL_IMAGE_SERVER}/exportImage` +
    `?bbox=${xmin},${ymin},${xmax},${ymax}` +
    `&bboxSR=3857&imageSR=3857&size=${tileSize},${tileSize}` +
    `&format=jpg&interpolation=RSP_BilinearInterpolation` +
    `&mosaicRule=${mosaicRule}&f=image`
  );
}
