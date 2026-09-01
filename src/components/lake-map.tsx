import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker, Polyline, TileLayer } from "leaflet";
import { HISTORICAL_CREDIT, historicalTileUrl } from "@/lib/historical-maps";
import { LAKE_BOUNDS, LAKE_CENTER, REGION_LABELS, type Place } from "@/lib/places";
import { formatMiles, haversineMiles } from "@/lib/utils";

export type MapLayerId = "satellite" | "topo" | "streets";

type LeafletNS = typeof import("leaflet");

type Props = {
  places: Place[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  layer: MapLayerId;
  measure: boolean;
  onMeasure: (label: string | null) => void;
  flyRequest: number;
  fitRequest: number;
  addMode: boolean;
  draftPoint: { lat: number; lon: number } | null;
  onPickPoint: (lat: number, lon: number) => void;
  historical: boolean;
  histOpacity: number;
};

const TILES: Record<MapLayerId, { url: string; attr: string; maxZoom: number }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles © Esri",
    maxZoom: 18,
  },
  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles © Esri",
    maxZoom: 18,
  },
  streets: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attr: "© OpenStreetMap © CARTO",
    maxZoom: 19,
  },
};

const TILE_OPTS = {
  updateWhenZooming: true,
  updateWhenIdle: false,
  keepBuffer: 8,
  detectRetina: false,
} as const;

/** Pin box in CSS pixels. Anchor is the tip, so the lat/lng stays glued while zooming. */
const PIN = 22;

function labeled(place: Place, zoom: number) {
  if (place.community && zoom >= 12.5) return true;
  if (zoom >= 14) return true;
  if (zoom >= 13 && place.importance >= 2) return true;
  if (zoom >= 12.25 && place.importance >= 3 && (place.kind === "island" || place.kind === "landmark"))
    return true;
  return false;
}

function markerHtml(place: Place) {
  const local = place.community ? " lf-marker--community" : "";
  return `<div class="lf-marker lf-marker--${place.kind}${local}" data-place="${place.id}">
    <span class="lf-pin"></span>
    <span class="lf-name">${escapeHtml(place.name)}</span>
  </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => {
    if (ch === "&") return "\u0026amp;";
    if (ch === "<") return "\u0026lt;";
    if (ch === ">") return "\u0026gt;";
    if (ch === '"') return "\u0026quot;";
    return "\u0026#39;";
  });
}

function pinIcon(L: LeafletNS, html: string) {
  return L.divIcon({
    className: "lf-divicon",
    html,
    iconSize: [PIN, PIN],
    iconAnchor: [PIN / 2, PIN - 1],
  });
}

function paintMarker(mk: Marker, place: Place, selected: boolean, zoom: number) {
  const root = mk.getElement()?.querySelector(".lf-marker");
  if (!root) return;
  const show = selected || labeled(place, zoom);
  root.classList.toggle("is-selected", selected);
  root.classList.toggle("is-labeled", show);
  mk.setZIndexOffset(selected ? 1000 : place.importance * 10);
}

function bindPlaceMarker(
  L: LeafletNS,
  m: Marker,
  placeId: string,
  addModeRef: { current: boolean },
  measureRef: { current: boolean },
  onSelectRef: { current: (id: string | null) => void },
  onPickPointRef: { current: (lat: number, lon: number) => void },
) {
  m.on("click", (ev) => {
    L.DomEvent.stopPropagation(ev);
    if (addModeRef.current) {
      onPickPointRef.current(ev.latlng.lat, ev.latlng.lng);
      return;
    }
    if (measureRef.current) return;
    onSelectRef.current(placeId);
  });
}

function createHistoricalLayer(L: LeafletNS, opacity: number): TileLayer {
  const layer = L.tileLayer("https://historical1.arcgis.com/{z}/{x}/{y}", {
    opacity,
    pane: "historical",
    attribution: HISTORICAL_CREDIT,
    minZoom: 10,
    maxZoom: 18,
    maxNativeZoom: 16,
    tileSize: 256,
    updateWhenZooming: false,
    updateWhenIdle: true,
    keepBuffer: 2,
    detectRetina: false,
    className: "lf-historical-sheet",
  });
  layer.getTileUrl = (coords) => historicalTileUrl(coords.x, coords.y, coords.z);
  return layer;
}

export function LakeMap({
  places,
  visibleIds,
  selectedId,
  onSelect,
  layer,
  measure,
  onMeasure,
  flyRequest,
  fitRequest,
  addMode,
  draftPoint,
  onPickPoint,
  historical,
  histOpacity,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<LeafletNS | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const markerGroupRef = useRef<LayerGroup | null>(null);
  const regionGroupRef = useRef<LayerGroup | null>(null);
  const baseLayerRef = useRef<TileLayer | null>(null);
  const histLayerRef = useRef<TileLayer | null>(null);
  const draftRef = useRef<Marker | null>(null);
  const measurePts = useRef<{ lat: number; lon: number }[]>([]);
  const measureLine = useRef<Polyline | null>(null);
  const onSelectRef = useRef(onSelect);
  const onMeasureRef = useRef(onMeasure);
  const onPickPointRef = useRef(onPickPoint);
  const visibleRef = useRef(visibleIds);
  const selectedRef = useRef(selectedId);
  const measureRef = useRef(measure);
  const addModeRef = useRef(addMode);
  const placesRef = useRef(places);
  const [mapReady, setMapReady] = useState(false);

  onSelectRef.current = onSelect;
  onMeasureRef.current = onMeasure;
  onPickPointRef.current = onPickPoint;
  visibleRef.current = visibleIds;
  selectedRef.current = selectedId;
  measureRef.current = measure;
  addModeRef.current = addMode;
  placesRef.current = places;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    void import("leaflet").then((mod) => {
      if (cancelled || !containerRef.current) return;
      const L = mod.default;
      LRef.current = L;

      const map = L.map(containerRef.current, {
        center: [LAKE_CENTER.lat, LAKE_CENTER.lon],
        zoom: 11,
        minZoom: 10,
        maxZoom: 18,
        zoomSnap: 1,
        zoomDelta: 1,
        wheelPxPerZoomLevel: 80,
        zoomControl: true,
        attributionControl: true,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: false,
        maxBounds: L.latLngBounds(LAKE_BOUNDS).pad(0.18),
        maxBoundsViscosity: 0.7,
      });
      map.zoomControl.setPosition("bottomright");
      mapRef.current = map;

      const histPane = map.createPane("historical");
      histPane.style.zIndex = "350";
      histPane.style.pointerEvents = "none";

      const spec = TILES.satellite;
      baseLayerRef.current = L.tileLayer(spec.url, {
        attribution: spec.attr,
        maxZoom: spec.maxZoom,
        ...TILE_OPTS,
      }).addTo(map);

      const markers = L.layerGroup().addTo(map);
      markerGroupRef.current = markers;
      const regions = L.layerGroup().addTo(map);
      regionGroupRef.current = regions;

      histLayerRef.current = createHistoricalLayer(L, 0.72);

      for (const r of REGION_LABELS) {
        const icon = L.divIcon({
          className: "lf-divicon lf-divicon--region",
          html: `<div class="lf-region">${escapeHtml(r.name)}</div>`,
          iconSize: [160, 28],
          iconAnchor: [80, 14],
        });
        L.marker([r.lat, r.lon], { icon, interactive: false, keyboard: false }).addTo(regions);
      }

      for (const place of placesRef.current) {
        const m = L.marker([place.lat, place.lon], {
          icon: pinIcon(L, markerHtml(place)),
          keyboard: true,
          title: place.name,
          riseOnHover: true,
        });
        bindPlaceMarker(L, m, place.id, addModeRef, measureRef, onSelectRef, onPickPointRef);
        markersRef.current.set(place.id, m);
        if (visibleRef.current.has(place.id)) m.addTo(markers);
      }

      const syncChrome = () => {
        const z = map.getZoom();
        if (regions) {
          if (z < 13) regions.addTo(map);
          else map.removeLayer(regions);
        }
        for (const place of placesRef.current) {
          const mk = markersRef.current.get(place.id);
          if (!mk) continue;
          paintMarker(mk, place, selectedRef.current === place.id, z);
        }
      };
      map.on("zoomend", syncChrome);
      requestAnimationFrame(() => {
        map.invalidateSize();
        syncChrome();
      });

      map.on("click", (e) => {
        if (addModeRef.current) {
          onPickPointRef.current(e.latlng.lat, e.latlng.lng);
          return;
        }
        if (!measureRef.current) {
          onSelectRef.current(null);
          return;
        }
        const pt = { lat: e.latlng.lat, lon: e.latlng.lng };
        const pts = measurePts.current;
        if (pts.length >= 2) {
          pts.length = 0;
          measureLine.current?.remove();
          measureLine.current = null;
        }
        pts.push(pt);
        if (pts.length === 1) {
          onMeasureRef.current("Tap a second point");
        } else if (pts.length === 2) {
          const miles = haversineMiles(pts[0]!, pts[1]!);
          measureLine.current?.remove();
          measureLine.current = L.polyline(
            [
              [pts[0]!.lat, pts[0]!.lon],
              [pts[1]!.lat, pts[1]!.lon],
            ],
            { color: "#7eaea6", weight: 2, dashArray: "6 5", opacity: 0.95 },
          ).addTo(map);
          onMeasureRef.current(formatMiles(miles));
        }
      });

      if (!cancelled) setMapReady(true);
    });

    return () => {
      cancelled = true;
      setMapReady(false);
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      draftRef.current = null;
      baseLayerRef.current = null;
      histLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const group = markerGroupRef.current;
    const map = mapRef.current;
    const L = LRef.current;
    if (!group || !map || !L) return;
    const ids = new Set(places.map((p) => p.id));
    for (const [id, mk] of markersRef.current) {
      if (ids.has(id)) continue;
      group.removeLayer(mk);
      markersRef.current.delete(id);
    }
    const z = map.getZoom();
    for (const place of places) {
      const existing = markersRef.current.get(place.id);
      if (existing) {
        const ll = existing.getLatLng();
        if (ll.lat !== place.lat || ll.lng !== place.lon) {
          existing.setLatLng([place.lat, place.lon]);
        }
        continue;
      }
      const m = L.marker([place.lat, place.lon], {
        icon: pinIcon(L, markerHtml(place)),
        keyboard: true,
        title: place.name,
        riseOnHover: true,
      });
      bindPlaceMarker(L, m, place.id, addModeRef, measureRef, onSelectRef, onPickPointRef);
      markersRef.current.set(place.id, m);
      if (visibleRef.current.has(place.id)) m.addTo(group);
      requestAnimationFrame(() => paintMarker(m, place, selectedRef.current === place.id, z));
    }
  }, [places, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    const spec = TILES[layer];
    const current = baseLayerRef.current as (TileLayer & { _url?: string }) | null;
    if (current?._url === spec.url) return;
    const next = L.tileLayer(spec.url, {
      attribution: spec.attr,
      maxZoom: spec.maxZoom,
      ...TILE_OPTS,
    });
    next.once("load", () => {
      if (baseLayerRef.current && baseLayerRef.current !== next) {
        map.removeLayer(baseLayerRef.current);
      }
    });
    next.addTo(map);
    const prev = baseLayerRef.current;
    baseLayerRef.current = next;
    window.setTimeout(() => {
      if (prev && prev !== next && map.hasLayer(prev)) map.removeLayer(prev);
    }, 1200);
  }, [layer, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const hist = histLayerRef.current;
    if (!map || !hist) return;
    hist.setOpacity(histOpacity);
    if (historical) {
      if (!map.hasLayer(hist)) hist.addTo(map);
    } else if (map.hasLayer(hist)) {
      map.removeLayer(hist);
    }
  }, [historical, histOpacity, mapReady]);

  useEffect(() => {
    const group = markerGroupRef.current;
    if (!group) return;
    for (const [id, mk] of markersRef.current) {
      const show = visibleIds.has(id);
      const onMap = group.hasLayer(mk);
      if (show && !onMap) group.addLayer(mk);
      if (!show && onMap) group.removeLayer(mk);
    }
  }, [visibleIds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const z = map.getZoom();
    for (const place of placesRef.current) {
      const mk = markersRef.current.get(place.id);
      if (!mk) continue;
      paintMarker(mk, place, selectedId === place.id, z);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!flyRequest || !selectedId) return;
    const map = mapRef.current;
    const place = placesRef.current.find((p) => p.id === selectedId);
    if (!map || !place) return;
    const targetZoom = Math.max(map.getZoom(), 14);
    map.flyTo([place.lat, place.lon], targetZoom, { duration: 0.55 });
  }, [flyRequest, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitRequest === 0) return;
    map.fitBounds(LAKE_BOUNDS, { padding: [36, 36], maxZoom: 11, animate: true });
  }, [fitRequest]);

  useEffect(() => {
    if (measure) return;
    measurePts.current = [];
    measureLine.current?.remove();
    measureLine.current = null;
    onMeasureRef.current(null);
  }, [measure]);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    draftRef.current?.remove();
    draftRef.current = null;
    if (!draftPoint) return;
    const m = L.marker([draftPoint.lat, draftPoint.lon], {
      icon: pinIcon(
        L,
        `<div class="lf-marker lf-marker--cove lf-marker--community is-selected is-labeled">
            <span class="lf-pin"></span>
            <span class="lf-name">New cove</span>
          </div>`,
      ),
      draggable: true,
      autoPan: true,
      zIndexOffset: 2000,
      title: "Drag to adjust",
    });
    m.on("dragend", () => {
      const ll = m.getLatLng();
      onPickPointRef.current(ll.lat, ll.lng);
    });
    m.addTo(map);
    draftRef.current = m;
  }, [draftPoint]);

  return (
    <div
      className={`absolute inset-0 z-0 h-full w-full${measure || addMode ? " is-measuring" : ""}`}
    >
      <div
        ref={containerRef}
        className="leaflet-container h-full w-full"
        role="application"
        aria-label="Greers Ferry Lake map"
      />
    </div>
  );
}
