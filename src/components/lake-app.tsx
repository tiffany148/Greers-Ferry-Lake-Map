import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Anchor,
  Download,
  Droplets,
  Heart,
  History,
  Info,
  Layers,
  Locate,
  MapPin,
  Mountain,
  Plus,
  Ruler,
  Search,
  Thermometer,
  Trees,
  Upload,
  Waves,
  X,
} from "lucide-react";
import {
  KIND_LABEL,
  KIND_ORDER,
  LAKE_FACTS,
  PLACES,
  REGION_LABEL,
  communityCoveToPlace,
  fieldPinToPlace,
  searchPlaces,
  type Place,
  type PlaceKind,
  type RegionId,
} from "@/lib/places";
import {
  addCommunityCove,
  deleteCommunityCove,
  listCommunityCoves,
  updateCommunityCove,
} from "@/lib/community-coves";
import {
  addFieldPin,
  deleteFieldPin,
  listFieldPins,
  updateFieldPin,
  type FieldPinKind,
} from "@/lib/field-pins";
import {
  buildPersonalExport,
  newPersonalId,
  parsePersonalImport,
  personalPinToPlace,
  type PersonalPin,
  type PersonalPinKind,
} from "@/lib/personal-pins";
import { GEOLOGY_DEFAULT_OPACITY } from "@/lib/geology-maps";
import { HISTORICAL_DEFAULT_OPACITY } from "@/lib/historical-maps";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { useHiddenPins } from "@/hooks/use-hidden-pins";
import { usePersonalPins } from "@/hooks/use-personal-pins";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LakeMap, type AddPinKind, type MapLayerId } from "@/components/lake-map";

const KIND_ICON: Record<PlaceKind, typeof Waves> = {
  island: Mountain,
  cove: Waves,
  park: Trees,
  marina: Anchor,
  point: MapPin,
  town: MapPin,
  landmark: Info,
  depth: Droplets,
  temperature: Thermometer,
  hazard: AlertTriangle,
  pin: MapPin,
};

const ADD_OPTIONS: {
  kind: AddPinKind;
  label: string;
  hint: string;
  Icon: typeof Waves;
}[] = [
  { kind: "cove", label: "Cove name", hint: "Local pocket name", Icon: Waves },
  { kind: "depth", label: "Water depth", hint: "Sounding in feet", Icon: Droplets },
  { kind: "temperature", label: "Temperature", hint: "Surface °F", Icon: Thermometer },
  { kind: "hazard", label: "Hazard", hint: "Stump, rock, shoal…", Icon: AlertTriangle },
  { kind: "pin", label: "Custom pin", hint: "Mark on your map", Icon: MapPin },
];

type KindFilter = "all" | "saved" | "mine" | "community" | "field" | PlaceKind;
type RegionFilter = "all" | RegionId;

function coords(place: Place) {
  return `${place.lat.toFixed(5)}°N  ${Math.abs(place.lon).toFixed(5)}°W`;
}

function parseLocalId(id: string): number | null {
  const m = /^local-(\d+)$/.exec(id);
  return m ? Number(m[1]) : null;
}

function parseFieldId(id: string): { kind: FieldPinKind; id: number } | null {
  const m = /^field-(depth|temperature|hazard|pin)-(\d+)$/.exec(id);
  if (!m) return null;
  return { kind: m[1] as FieldPinKind, id: Number(m[2]) };
}

export function LakeApp({ initialShared = [] }: { initialShared?: Place[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layer, setLayer] = useState<MapLayerId>("satellite");
  const [historical, setHistorical] = useState(false);
  const [histOpacity, setHistOpacity] = useState(HISTORICAL_DEFAULT_OPACITY);
  const [geology, setGeology] = useState(false);
  const [geoOpacity, setGeoOpacity] = useState(GEOLOGY_DEFAULT_OPACITY);
  const [measure, setMeasure] = useState(false);
  const [measureLabel, setMeasureLabel] = useState<string | null>(null);
  const [flyRequest, setFlyRequest] = useState(0);
  const [fitRequest, setFitRequest] = useState(0);
  const [about, setAbout] = useState(false);
  const [mobileList, setMobileList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shared, setShared] = useState<Place[]>(initialShared);
  const [addMenu, setAddMenu] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [addKind, setAddKind] = useState<AddPinKind>("cove");
  const [draftPoint, setDraftPoint] = useState<{ lat: number; lon: number } | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const favs = useFavorites();
  const hidden = useHiddenPins();
  const personal = usePersonalPins();
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const refreshShared = useCallback(async () => {
    try {
      const [coves, pins] = await Promise.all([listCommunityCoves(), listFieldPins()]);
      // Shared list only — never clears or replaces personal pins in localStorage.
      setShared([...coves.map(communityCoveToPlace), ...pins.map(fieldPinToPlace)]);
    } catch {
      /* preview may still be migrating */
    }
  }, []);

  useEffect(() => {
    void refreshShared();
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshShared();
    }, 30_000);
    const onVis = () => {
      if (document.visibilityState === "visible") void refreshShared();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refreshShared]);

  const hiddenIds = hidden.ids;
  const personalPins = personal.pins;
  const myMapOnly = personal.myMapOnly;

  const catalog = useMemo(() => {
    const hiddenSet = new Set(hiddenIds);
    const minePlaces = personalPins.map(personalPinToPlace);
    const mineSharedIds = new Set(
      personalPins.map((p) => p.sharedId).filter((id): id is string => !!id),
    );
    const sharedVisible = myMapOnly
      ? []
      : shared.filter((p) => !mineSharedIds.has(p.id));
    return [...PLACES, ...minePlaces, ...sharedVisible].filter((p) => !hiddenSet.has(p.id));
  }, [shared, hiddenIds, personalPins, myMapOnly]);

  const filtered = useMemo(() => {
    let list = searchPlaces(query, catalog);
    if (kind === "saved") list = list.filter((p) => favs.has(p.id));
    else if (kind === "mine") list = list.filter((p) => p.mine);
    else if (kind === "community") list = list.filter((p) => p.community);
    else if (kind === "field") list = list.filter((p) => p.field);
    else if (kind !== "all") list = list.filter((p) => p.kind === kind);
    if (region !== "all") list = list.filter((p) => p.region === region);
    return list;
  }, [query, kind, region, favs, catalog]);

  const visibleIds = useMemo(() => new Set(filtered.map((p) => p.id)), [filtered]);
  const selected = catalog.find((p) => p.id === selectedId) ?? null;

  function selectPlace(id: string | null, fly = true) {
    setSelectedId(id);
    if (id && fly) setFlyRequest((n) => n + 1);
    if (id) setMobileList(false);
  }

  function startAdd(next: AddPinKind) {
    setMeasure(false);
    setSelectedId(null);
    setAddMenu(false);
    setAddKind(next);
    setAddMode(true);
    setDraftPoint(null);
    setDraftName("");
    setDraftValue("");
    setDraftNote("");
    setDraftError(null);
    setMobileList(false);
  }

  function cancelAdd() {
    setAddMode(false);
    setAddMenu(false);
    setDraftPoint(null);
    setDraftName("");
    setDraftValue("");
    setDraftNote("");
    setDraftError(null);
  }

  async function submitAdd() {
    if (!draftPoint) return;
    const name = (draftName || draftValue || "My pin").trim();
    if (!name && addKind !== "depth" && addKind !== "temperature") {
      setDraftError("Give this pin a name.");
      return;
    }
    setSaving(true);
    setDraftError(null);
    const now = Date.now();
    // Write device-local first so the pin survives even if the shared post fails.
    const local: PersonalPin = {
      id: newPersonalId(),
      kind: addKind as PersonalPinKind,
      name: (draftName || draftValue || "My pin").trim().slice(0, 80),
      lat: draftPoint.lat,
      lon: draftPoint.lon,
      createdAt: now,
      updatedAt: now,
    };
    if (draftValue.trim()) local.value = draftValue.trim().slice(0, 40);
    if (draftNote.trim()) local.note = draftNote.trim().slice(0, 280);

    try {
      if (addKind === "cove") {
        personal.upsert(local);
        try {
          const result = await addCommunityCove({
            data: {
              name: local.name,
              lat: local.lat,
              lon: local.lon,
              note: local.note,
            },
          });
          if (result.ok) {
            const place = communityCoveToPlace(result.cove);
            personal.upsert({ ...local, sharedId: place.id, updatedAt: Date.now() });
            setShared((prev) => [place, ...prev.filter((p) => p.id !== place.id)]);
          }
        } catch {
          /* keep local pin */
        }
        cancelAdd();
        setKind("all");
        selectPlace(local.id, true);
        return;
      }

      personal.upsert(local);
      try {
        const result = await addFieldPin({
          data: {
            kind: addKind as FieldPinKind,
            title: local.name,
            value: local.value,
            lat: local.lat,
            lon: local.lon,
            note: local.note,
          },
        });
        if (result.ok) {
          const place = fieldPinToPlace(result.pin);
          personal.upsert({ ...local, sharedId: place.id, updatedAt: Date.now() });
          setShared((prev) => [place, ...prev.filter((p) => p.id !== place.id)]);
        }
      } catch {
        /* keep local pin */
      }
      cancelAdd();
      setKind(addKind);
      selectPlace(local.id, true);
    } catch {
      setDraftError("Could not save that pin. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function exportMyPins() {
    const payload = buildPersonalExport(personal.pins);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `greers-ferry-my-pins-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importMyPins(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result || ""));
        const pins = parsePersonalImport(parsed);
        if (!pins || pins.length === 0) {
          window.alert("That file has no valid personal pins.");
          return;
        }
        const byId = new Map(personal.pins.map((p) => [p.id, p]));
        for (const p of pins) byId.set(p.id, p);
        personal.replaceAll([...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt));
        window.alert(`Imported ${pins.length} pin${pins.length === 1 ? "" : "s"} onto this device.`);
      } catch {
        window.alert("Could not read that JSON file.");
      }
    };
    reader.readAsText(file);
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: catalog.length,
      saved: favs.ids.length,
      mine: personalPins.length,
      community: catalog.filter((p) => p.community).length,
      field: catalog.filter((p) => p.field).length,
    };
    for (const k of KIND_ORDER) c[k] = catalog.filter((p) => p.kind === k).length;
    return c;
  }, [favs.ids.length, catalog, personalPins.length]);

  const addMeta = ADD_OPTIONS.find((o) => o.kind === addKind) ?? ADD_OPTIONS[0]!;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      {mounted ? (
        <LakeMap
          places={catalog}
          visibleIds={visibleIds}
          selectedId={selectedId}
          onSelect={(id) => selectPlace(id, false)}
          layer={layer}
          measure={measure}
          onMeasure={setMeasureLabel}
          flyRequest={flyRequest}
          fitRequest={fitRequest}
          addMode={addMode}
          addKind={addKind}
          draftPoint={draftPoint}
          onPickPoint={(lat, lon) => {
            setDraftPoint({ lat, lon });
            setDraftError(null);
          }}
          historical={historical}
          histOpacity={histOpacity}
          geology={geology}
          geoOpacity={geoOpacity}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-bg" />
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:p-4">
        <div className="pointer-events-auto max-w-[calc(100%-7.5rem)] rounded-xl bg-surface p-3 shadow-panel md:max-w-sm md:p-4">
          <p className="font-sans text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Arkansas Ozarks
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium leading-tight tracking-tight text-fg italic">
            Greers Ferry
          </h1>
          <p className="mt-1 hidden text-sm text-muted md:block">
            Cove & island map · {LAKE_FACTS.acres} acres · two lakes joined by the Narrows
          </p>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Button
              variant={about ? "primary" : "outline"}
              size="iconSm"
              aria-label="About the lake"
              onClick={() => setAbout((v) => !v)}
            >
              <Info className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="iconSm"
              aria-label="Fit the whole lake"
              onClick={() => {
                selectPlace(null, false);
                setFitRequest((n) => n + 1);
              }}
            >
              <Locate className="size-4" />
            </Button>
          </div>
          <LayerSwitch layer={layer} onChange={setLayer} />
          <Button
            variant={historical ? "primary" : "outline"}
            size="sm"
            aria-pressed={historical}
            aria-label={historical ? "Hide the map from before the dam" : "Show the map from before the dam"}
            onClick={() => setHistorical((v) => !v)}
          >
            <History className="size-4" />
            <span className="hidden sm:inline">{historical ? "1963 topo" : "Before the dam"}</span>
          </Button>
          {historical ? (
            <label className="flex w-44 items-center gap-2 rounded-sm bg-surface px-3 py-2 shadow-panel">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">Opacity</span>
              <input
                type="range"
                min={0.15}
                max={1}
                step={0.02}
                value={histOpacity}
                onChange={(e) => setHistOpacity(Number(e.target.value))}
                className="lf-range min-w-0 flex-1"
                aria-label="Before the dam opacity"
              />
              <span className="w-8 text-right text-xs tabular-nums text-muted">
                {Math.round(histOpacity * 100)}
              </span>
            </label>
          ) : null}
          <Button
            variant={geology ? "primary" : "outline"}
            size="sm"
            aria-pressed={geology}
            aria-label={geology ? "Hide geology overlay" : "Show geology overlay"}
            onClick={() => setGeology((v) => !v)}
          >
            <Mountain className="size-4" />
            <span className="hidden sm:inline">Geology</span>
          </Button>
          {geology ? (
            <label className="flex w-44 items-center gap-2 rounded-sm bg-surface px-3 py-2 shadow-panel">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">Opacity</span>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.02}
                value={geoOpacity}
                onChange={(e) => setGeoOpacity(Number(e.target.value))}
                className="lf-range min-w-0 flex-1"
                aria-label="Geology opacity"
              />
              <span className="w-8 text-right text-xs tabular-nums text-muted">
                {Math.round(geoOpacity * 100)}
              </span>
            </label>
          ) : null}
          <Button
            variant={measure ? "primary" : "outline"}
            size="sm"
            aria-pressed={measure}
            onClick={() => {
              cancelAdd();
              setMeasure((v) => !v);
            }}
          >
            <Ruler className="size-4" />
            <span className="hidden sm:inline">{measure ? "Measuring" : "Measure"}</span>
          </Button>
          <div className="relative">
            <Button
              variant={addMode || addMenu ? "primary" : "outline"}
              size="sm"
              aria-pressed={addMode || addMenu}
              aria-expanded={addMenu}
              aria-label={addMode ? "Cancel adding" : "Add a pin"}
              onClick={() => {
                if (addMode) cancelAdd();
                else setAddMenu((v) => !v);
              }}
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">
                {addMode ? `Adding ${addMeta.label.toLowerCase()}` : "Add pin"}
              </span>
            </Button>
            {addMenu ? (
              <div className="absolute top-full right-0 z-40 mt-2 w-56 overflow-hidden rounded-md bg-surface shadow-panel">
                <p className="border-b border-border px-3 py-2 text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                  Drop on the map
                </p>
                <ul>
                  {ADD_OPTIONS.map(({ kind: k, label, hint, Icon }) => (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => startAdd(k)}
                        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-elevated"
                      >
                        <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>
                          <span className="block text-sm font-medium">{label}</span>
                          <span className="block text-xs text-muted">{hint}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          {measure && measureLabel ? (
            <p className="rounded-sm bg-surface px-3 py-1.5 font-mono text-xs tabular-nums text-accent shadow-panel">
              {measureLabel}
            </p>
          ) : null}
          {addMode && !draftPoint ? (
            <p className="max-w-[11rem] rounded-sm bg-surface px-3 py-1.5 text-xs text-fg shadow-panel">
              Tap the map to place {addMeta.label.toLowerCase()}
            </p>
          ) : null}
          {geology && !addMode && !measure ? (
            <p className="max-w-[12rem] rounded-sm bg-surface px-3 py-1.5 text-xs text-fg shadow-panel">
              Tap the map for rock type
            </p>
          ) : null}
        </div>
      </header>

      <aside
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 md:inset-y-0 md:left-0 md:right-auto md:top-0 md:w-80 md:p-4 md:pt-44"
      >
        <div
          className={cn(
            "pointer-events-auto flex max-h-[min(72dvh,40rem)] flex-col rounded-t-xl bg-surface shadow-panel md:max-h-full md:rounded-xl",
            "pb-[env(safe-area-inset-bottom)]",
          )}
        >
          <div className="flex items-center gap-2 border-b border-border p-3 md:hidden">
            <button
              type="button"
              className="flex-1 text-left text-sm font-medium"
              onClick={() => setMobileList((v) => !v)}
            >
              {selected
                ? selected.name
                : addMode && draftPoint
                  ? `Add ${addMeta.label.toLowerCase()}`
                  : `${filtered.length} places`}
            </button>
            <Button
              variant="quiet"
              size="sm"
              onClick={() => setMobileList((v) => !v)}
              aria-expanded={mobileList}
            >
              {mobileList ? "Map" : "List"}
            </Button>
          </div>

          <div
            className={
              mobileList || selected || (addMode && !!draftPoint)
                ? "flex min-h-0 flex-col"
                : "hidden min-h-0 flex-col md:flex"
            }
          >
            <div className="space-y-3 p-3">
              <label className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search coves, depths, hazards…"
                  className="pl-9"
                  aria-label="Search places"
                />
              </label>
              <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
                <button
                  type="button"
                  onClick={() => personal.setMyMapOnly(!myMapOnly)}
                  aria-pressed={myMapOnly}
                  title="Hide community and field pins from other people — keep official catalog pins and yours"
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap",
                    myMapOnly
                      ? "bg-accent text-accent-fg"
                      : "bg-elevated text-muted ring-1 ring-border hover:text-fg",
                  )}
                >
                  My map only
                </button>
                {(
                  [
                    ["all", "All"],
                    ["mine", "My pins"],
                    ["island", "Islands"],
                    ["cove", "Coves"],
                    ["depth", "Depth"],
                    ["temperature", "Temp"],
                    ["hazard", "Hazards"],
                    ["pin", "Pins"],
                    ["community", "Local"],
                    ["field", "Field"],
                    ["park", "Parks"],
                    ["marina", "Marinas"],
                    ["saved", "Saved"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setKind(id)}
                    className={cn(
                      "h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap",
                      kind === id
                        ? "bg-accent text-accent-fg"
                        : "bg-elevated text-muted hover:text-fg",
                    )}
                  >
                    {label}
                    <span className="ml-1 tabular-nums opacity-70">{counts[id] ?? 0}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={exportMyPins}
                  className="inline-flex h-8 items-center gap-1 rounded-sm bg-elevated px-2.5 text-[11px] font-medium text-muted hover:text-fg"
                >
                  <Download className="size-3" />
                  Export my pins
                </button>
                <button
                  type="button"
                  onClick={() => importRef.current?.click()}
                  className="inline-flex h-8 items-center gap-1 rounded-sm bg-elevated px-2.5 text-[11px] font-medium text-muted hover:text-fg"
                >
                  <Upload className="size-3" />
                  Import my pins
                </button>
                <input
                  ref={importRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) importMyPins(file);
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="flex gap-1">
                {(
                  [
                    ["all", "Whole lake"],
                    ["upper", "Upper"],
                    ["narrows", "Narrows"],
                    ["lower", "Lower Lake"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRegion(id)}
                    className={cn(
                      "h-8 flex-1 rounded-sm px-1 text-[11px] font-medium",
                      region === id
                        ? "bg-fg text-bg"
                        : "bg-transparent text-muted hover:text-fg",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {addMode ? (
              <AddPinForm
                addKind={addKind}
                draftPoint={draftPoint}
                name={draftName}
                value={draftValue}
                note={draftNote}
                error={draftError}
                saving={saving}
                onName={setDraftName}
                onValue={setDraftValue}
                onNote={setDraftNote}
                onCancel={cancelAdd}
                onSubmit={() => void submitAdd()}
              />
            ) : null}

            {selected ? (
              <PlaceDetail
                place={selected}
                saved={favs.has(selected.id)}
                personalRecord={personal.get(selected.id)}
                onSave={() => favs.toggle(selected.id)}
                onClose={() => setSelectedId(null)}
                onHide={() => {
                  hidden.hide(selected.id);
                  setSelectedId(null);
                }}
                onPersonalUpsert={(pin) => personal.upsert(pin)}
                onPersonalRemove={(id) => personal.remove(id)}
                onUpdated={(next, previousId) => {
                  setShared((prev) => [next, ...prev.filter((p) => p.id !== previousId && p.id !== next.id)]);
                  setSelectedId(next.id);
                }}
                onDeleted={(id) => {
                  setShared((prev) => prev.filter((p) => p.id !== id));
                  personal.removeBySharedId(id);
                  setSelectedId(null);
                }}
              />
            ) : null}

            <PlaceList
              places={filtered}
              selectedId={selectedId}
              savedIds={favs.ids}
              onPick={(id) => selectPlace(id, true)}
              emptySaved={kind === "saved"}
              emptyMine={kind === "mine"}
              emptyLocal={kind === "community"}
              emptyField={kind === "field" || kind === "depth" || kind === "temperature" || kind === "hazard" || kind === "pin"}
            />
          </div>
        </div>
      </aside>

      {about ? (
        <AboutCard
          onClose={() => setAbout(false)}
          hiddenCount={hidden.count}
          onRestoreHidden={() => hidden.clearAll()}
        />
      ) : null}
    </div>
  );
}

function PlaceList({
  places,
  selectedId,
  savedIds,
  onPick,
  emptySaved,
  emptyMine,
  emptyLocal,
  emptyField,
}: {
  places: Place[];
  selectedId: string | null;
  savedIds: string[];
  onPick: (id: string) => void;
  emptySaved: boolean;
  emptyMine?: boolean;
  emptyLocal?: boolean;
  emptyField?: boolean;
}) {
  const grouped = KIND_ORDER.map((k) => ({
    kind: k,
    items: places.filter((p) => p.kind === k),
  })).filter((g) => g.items.length > 0);

  if (places.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-muted">
        {emptySaved
          ? "Save islands and coves from a place card to build a short list."
          : emptyMine
            ? "No pins on this device yet. Tap Add pin — they stay here until you delete them."
            : emptyLocal
              ? "No local cove names yet. Tap Add pin → Cove name."
              : emptyField
                ? "No field pins yet. Tap Add pin to drop depth, temp, hazards, or custom marks."
                : "No places match that search."}
      </p>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
      {grouped.map((g) => {
        const Icon = KIND_ICON[g.kind];
        return (
          <section key={g.kind} className="mb-2">
            <h2 className="sticky top-0 z-10 flex items-center gap-2 bg-surface px-2 py-2 font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
              <Icon className="size-3.5" />
              {KIND_LABEL[g.kind]}s
              <span className="tabular-nums">{g.items.length}</span>
            </h2>
            <ul>
              {g.items.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onPick(p.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left",
                      selectedId === p.id ? "bg-elevated" : "hover:bg-elevated/70",
                    )}
                  >
                    <span className="mt-0.5 size-2 shrink-0 rounded-full bg-accent" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{p.name}</span>
                        {savedIds.includes(p.id) ? (
                          <Heart className="size-3 fill-accent text-accent" />
                        ) : null}
                      </span>
                      <span className="block text-xs text-muted">
                        {REGION_LABEL[p.region]}
                        {p.fieldValue ? ` · ${p.fieldValue}` : ""}
                        {p.mine
                          ? " · mine"
                          : p.community
                            ? " · local"
                            : p.field
                              ? " · field"
                              : p.approx
                                ? " · approx."
                                : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function noteSeed(place: Place, personalRecord?: PersonalPin) {
  if (personalRecord?.note) return personalRecord.note;
  if (!(place.community || place.field || place.mine)) return "";
  if (
    place.description.startsWith("A locally named") ||
    place.description.startsWith("A shared") ||
    place.description.startsWith("Reported water") ||
    place.description.startsWith("Your ") ||
    place.description.startsWith("A cove name you") ||
    place.description.startsWith("A pin you") ||
    place.description.startsWith("A hazard you")
  ) {
    return "";
  }
  return place.description;
}

function PlaceDetail({
  place,
  saved,
  personalRecord,
  onSave,
  onClose,
  onHide,
  onPersonalUpsert,
  onPersonalRemove,
  onUpdated,
  onDeleted,
}: {
  place: Place;
  saved: boolean;
  personalRecord?: PersonalPin;
  onSave: () => void;
  onClose: () => void;
  onHide: () => void;
  onPersonalUpsert: (pin: PersonalPin) => void;
  onPersonalRemove: (id: string) => void;
  onUpdated: (place: Place, previousId: string) => void;
  onDeleted: (id: string) => void;
}) {
  const Icon = KIND_ICON[place.kind];
  const editable = !!(place.mine || place.community || place.field);
  const official = !editable;
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(place.name);
  const [editValue, setEditValue] = useState(place.fieldValue ?? "");
  const [editNote, setEditNote] = useState(noteSeed(place, personalRecord));
  const [editError, setEditError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEditing(false);
    setEditName(place.name);
    setEditValue(place.fieldValue ?? "");
    setEditNote(noteSeed(place, personalRecord));
    setEditError(null);
  }, [place.id, place.name, place.fieldValue, place.description, place.community, place.field, place.mine, personalRecord]);

  async function saveEdit() {
    setBusy(true);
    setEditError(null);
    try {
      if (place.mine && personalRecord) {
        const next: PersonalPin = {
          ...personalRecord,
          name: (editName || editValue || personalRecord.name).trim().slice(0, 80),
          value: editValue.trim() || undefined,
          note: editNote.trim() || undefined,
          updatedAt: Date.now(),
        };
        onPersonalUpsert(next);
        if (personalRecord.sharedId) {
          const sharedId = personalRecord.sharedId;
          if (personalRecord.kind === "cove") {
            const id = parseLocalId(sharedId);
            if (id != null) {
              const result = await updateCommunityCove({
                data: { id, name: next.name, note: next.note },
              });
              if (result.ok) onUpdated(communityCoveToPlace(result.cove), sharedId);
            }
          } else {
            const parsed = parseFieldId(sharedId);
            if (parsed) {
              const result = await updateFieldPin({
                data: {
                  id: parsed.id,
                  kind: parsed.kind,
                  title: next.name,
                  value: next.value,
                  note: next.note,
                },
              });
              if (result.ok) onUpdated(fieldPinToPlace(result.pin), sharedId);
            }
          }
        }
        setEditing(false);
        return;
      }
      if (place.community) {
        const id = parseLocalId(place.id);
        if (id == null) {
          setEditError("Could not edit that cove.");
          return;
        }
        const result = await updateCommunityCove({
          data: { id, name: editName, note: editNote || undefined },
        });
        if (!result.ok) {
          setEditError(result.error);
          return;
        }
        onUpdated(communityCoveToPlace(result.cove), place.id);
        setEditing(false);
        return;
      }
      if (place.field) {
        const parsed = parseFieldId(place.id);
        if (!parsed) {
          setEditError("Could not edit that pin.");
          return;
        }
        const result = await updateFieldPin({
          data: {
            id: parsed.id,
            kind: parsed.kind,
            title: editName || editValue,
            value: editValue || undefined,
            note: editNote || undefined,
          },
        });
        if (!result.ok) {
          setEditError(result.error);
          return;
        }
        onUpdated(fieldPinToPlace(result.pin), place.id);
        setEditing(false);
      }
    } catch {
      setEditError("Could not save changes. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removePin() {
    if (!editable) return;
    if (place.mine) {
      if (
        !window.confirm(
          `Delete “${place.name}” from this device? This only removes your copy — it will not come back after reload.`,
        )
      ) {
        return;
      }
      setBusy(true);
      setEditError(null);
      try {
        const sharedId = personalRecord?.sharedId;
        onPersonalRemove(place.id);
        if (sharedId) {
          if (personalRecord?.kind === "cove") {
            const id = parseLocalId(sharedId);
            if (id != null) await deleteCommunityCove({ data: { id } });
          } else {
            const parsed = parseFieldId(sharedId);
            if (parsed) await deleteFieldPin({ data: { id: parsed.id } });
          }
          onDeleted(sharedId);
        } else {
          onClose();
        }
      } catch {
        setEditError("Removed from this device. Shared copy may still be on the lake map.");
        onClose();
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!window.confirm(`Delete “${place.name}”? This permanently removes the shared pin.`)) return;
    setBusy(true);
    setEditError(null);
    try {
      if (place.community) {
        const id = parseLocalId(place.id);
        if (id == null) {
          setEditError("Could not delete that cove.");
          return;
        }
        const result = await deleteCommunityCove({ data: { id } });
        if (!result.ok) {
          setEditError(result.error);
          return;
        }
        onDeleted(place.id);
        return;
      }
      if (place.field) {
        const parsed = parseFieldId(place.id);
        if (!parsed) {
          setEditError("Could not delete that pin.");
          return;
        }
        const result = await deleteFieldPin({ data: { id: parsed.id } });
        if (!result.ok) {
          setEditError(result.error);
          return;
        }
        onDeleted(place.id);
      }
    } catch {
      setEditError("Could not delete. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const needsValue = place.kind === "depth" || place.kind === "temperature";

  return (
    <article className="border-b border-border px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] text-accent uppercase">
            <Icon className="size-3.5" />
            {KIND_LABEL[place.kind]} · {REGION_LABEL[place.region]}
            {place.mine ? " · Mine" : place.community ? " · Local" : place.field ? " · Field" : ""}
          </p>
          <h2 className="mt-1 font-display text-xl leading-snug font-medium italic">{place.name}</h2>
        </div>
        <button
          type="button"
          aria-label="Close place"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-fg"
        >
          <X className="size-4" />
        </button>
      </div>

      {editing ? (
        <form
          className="mt-3 space-y-2 rounded-md bg-elevated/60 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void saveEdit();
          }}
        >
          <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">Edit pin</p>
          {needsValue ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={place.kind === "depth" ? "Depth — e.g. 42 ft" : "Temp — e.g. 78°F"}
              maxLength={24}
              required
            />
          ) : null}
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder={place.community ? "Cove name" : "Title"}
            maxLength={48}
            required={!needsValue}
          />
          <Input
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            placeholder="Optional note"
            maxLength={160}
          />
          {editError ? <p className="text-sm text-danger">{editError}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">{place.description}</p>
          {place.address ? (
            <p className="mt-2 text-xs text-fg">
              <span className="text-muted">Address · </span>
              {place.address}
            </p>
          ) : null}
          {place.phone ? (
            <p className="mt-1 text-xs text-fg">
              <span className="text-muted">Phone · </span>
              <a className="text-accent underline-offset-2 hover:underline" href={`tel:${place.phone.replace(/\D/g, "")}`}>
                {place.phone}
              </a>
            </p>
          ) : null}
          {place.access ? (
            <p className="mt-2 text-xs text-fg">
              <span className="text-muted">Access · </span>
              {place.access}
            </p>
          ) : null}
          {place.amenities && place.amenities.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {place.amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full bg-elevated px-2.5 py-1 text-[11px] font-medium text-fg"
                >
                  {a}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      {!editing && official ? (
        <p className="mt-3 text-xs text-muted">
          Official map pin — you can hide it on this device. Pins you add yourself can be edited or
          deleted.
        </p>
      ) : null}
      {!editing && place.mine ? (
        <p className="mt-3 text-xs text-muted">
          Your pin — saved on this device until you delete it. Community sync will not remove it.
        </p>
      ) : null}
      {!editing && editable && !place.mine ? (
        <p className="mt-3 text-xs text-muted">
          Shared pin you (or someone) added — edit or delete it below.
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] tabular-nums text-muted">{coords(place)}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {editable && !editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex h-9 items-center rounded-sm bg-elevated px-3 text-xs font-medium text-fg"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void removePin()}
                disabled={busy}
                className="inline-flex h-9 items-center rounded-sm bg-elevated px-3 text-xs font-medium text-danger"
              >
                Delete pin
              </button>
            </>
          ) : null}
          {official && !editing ? (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `Remove “${place.name}” from your map? It stays on the shared lake map — only hidden on this device.`,
                  )
                ) {
                  onHide();
                }
              }}
              className="inline-flex h-9 items-center rounded-sm bg-elevated px-3 text-xs font-medium text-danger"
            >
              Remove from my map
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-xs font-medium",
              saved ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
            )}
          >
            <Heart className={cn("size-3.5", saved && "fill-current")} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
      {editError && !editing ? <p className="mt-2 text-sm text-danger">{editError}</p> : null}
    </article>
  );
}

function AddPinForm({
  addKind,
  draftPoint,
  name,
  value,
  note,
  error,
  saving,
  onName,
  onValue,
  onNote,
  onCancel,
  onSubmit,
}: {
  addKind: AddPinKind;
  draftPoint: { lat: number; lon: number } | null;
  name: string;
  value: string;
  note: string;
  error: string | null;
  saving: boolean;
  onName: (v: string) => void;
  onValue: (v: string) => void;
  onNote: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const meta = ADD_OPTIONS.find((o) => o.kind === addKind) ?? ADD_OPTIONS[0]!;
  const needsValue = addKind === "depth" || addKind === "temperature";
  const canSubmit =
    !!draftPoint &&
    (needsValue
      ? value.trim().length > 0
      : name.trim().length >= 2);

  return (
    <form
      className="space-y-3 border-b border-border px-3 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">{meta.label}</p>
          <p className="mt-1 text-sm text-muted">
            {draftPoint
              ? addKind === "cove"
                ? "Name the pocket you dropped. It shows up on every device."
                : addKind === "depth"
                  ? "Enter the sounding in feet. Optional label and note."
                  : addKind === "temperature"
                    ? "Enter surface water temp in °F. Optional label and note."
                    : addKind === "hazard"
                      ? "Name the hazard so others can steer clear."
                      : "Name this shared pin."
              : `Tap the map — then fill in ${meta.label.toLowerCase()}.`}
          </p>
        </div>
        <button
          type="button"
          aria-label="Cancel adding"
          onClick={onCancel}
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-fg"
        >
          <X className="size-4" />
        </button>
      </div>
      {draftPoint ? (
        <>
          {needsValue ? (
            <label className="block">
              <span className="sr-only">{addKind === "depth" ? "Depth in feet" : "Temperature °F"}</span>
              <Input
                value={value}
                onChange={(e) => onValue(e.target.value)}
                placeholder={addKind === "depth" ? "Depth — e.g. 42 ft" : "Temp — e.g. 78°F"}
                maxLength={24}
                autoFocus
                required
                inputMode="decimal"
              />
            </label>
          ) : null}
          <label className="block">
            <span className="sr-only">
              {addKind === "cove" ? "Cove name" : addKind === "hazard" ? "Hazard name" : "Title"}
            </span>
            <Input
              value={name}
              onChange={(e) => onName(e.target.value)}
              placeholder={
                addKind === "cove"
                  ? "Cove name"
                  : addKind === "hazard"
                    ? "Hazard — e.g. Stump field"
                    : addKind === "pin"
                      ? "Pin name"
                      : "Optional label"
              }
              maxLength={48}
              autoFocus={!needsValue}
              required={!needsValue}
            />
          </label>
          <label className="block">
            <span className="sr-only">Optional note</span>
            <Input
              value={note}
              onChange={(e) => onNote(e.target.value)}
              placeholder={
                addKind === "cove"
                  ? "Optional — ski pocket, walleye hole…"
                  : addKind === "hazard"
                    ? "Optional — when visible, how bad…"
                    : "Optional note"
              }
              maxLength={160}
            />
          </label>
          <p className="font-mono text-xs tabular-nums text-muted">
            {draftPoint.lat.toFixed(5)}°N  {Math.abs(draftPoint.lon).toFixed(5)}°W
          </p>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" size="sm" disabled={saving || !canSubmit}>
            {saving ? "Saving…" : "Add to the lake"}
          </Button>
        </>
      ) : null}
    </form>
  );
}

function LayerSwitch({
  layer,
  onChange,
}: {
  layer: MapLayerId;
  onChange: (id: MapLayerId) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md bg-surface shadow-panel">
      <span className="flex size-9 items-center justify-center text-muted">
        <Layers className="size-4" />
      </span>
      {(
        [
          ["satellite", "Sat"],
          ["topo", "Topo"],
          ["streets", "Map"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "h-9 px-2.5 text-xs font-medium",
            layer === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function AboutCard({
  onClose,
  hiddenCount,
  onRestoreHidden,
}: {
  onClose: () => void;
  hiddenCount: number;
  onRestoreHidden: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 md:items-center">
      <div className="max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-xl bg-surface p-5 shadow-panel">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-medium italic">Two lakes, one gorge</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-sm text-muted hover:bg-elevated"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Greers Ferry is a Corps of Engineers reservoir on the Little Red River, about an hour
          north of Little Rock. The pool is really two lakes — the Upper Lake around Fairfield Bay
          and Higden, and the Lower Lake (the Big Water) at Heber Springs — joined by a flooded gorge
          called the Narrows.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Surface</dt>
            <dd className="font-display text-lg italic">{LAKE_FACTS.acres} acres</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Shoreline</dt>
            <dd className="font-display text-lg italic">{LAKE_FACTS.shoreline}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Max depth</dt>
            <dd className="font-display text-lg italic">{LAKE_FACTS.depth}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Dedicated</dt>
            <dd className="font-display text-lg italic">{LAKE_FACTS.damYear}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Place names follow USGS GNIS, the Corps lake map, the local visitor guide, and the Greers
          Ferry Lake cove names map. Pins you add are saved on this device (localStorage) and survive
          reload until you delete them — use <b>My map only</b> to hide other people’s shared field
          and cove pins while keeping the official catalog and yours. Export / Import my pins moves
          that JSON between phones; signed-in cross-device sync is not wired yet (Better Auth exists
          but personal pins stay device-local for now). Shared lake marks still post for others when
          the server is up. Saved hearts and hidden official pins also stay on this device. Overlays
          stack: Before the dam and Geology each have their own opacity. With Geology on, tap the map
          for rock type and age.
        </p>
        {hiddenCount > 0 ? (
          <p className="mt-3 text-xs text-muted">
            {hiddenCount} official pin{hiddenCount === 1 ? "" : "s"} hidden on this device.{" "}
            <button
              type="button"
              className="font-medium text-accent hover:underline"
              onClick={() => {
                onRestoreHidden();
                onClose();
              }}
            >
              Restore hidden pins
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}
