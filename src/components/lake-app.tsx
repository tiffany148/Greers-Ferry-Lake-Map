import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Anchor,
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
  Trees,
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
  searchPlaces,
  type Place,
  type PlaceKind,
  type RegionId,
} from "@/lib/places";
import { addCommunityCove, listCommunityCoves } from "@/lib/community-coves";
import { HISTORICAL_DEFAULT_OPACITY } from "@/lib/historical-maps";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LakeMap, type MapLayerId } from "@/components/lake-map";

const KIND_ICON: Record<PlaceKind, typeof Waves> = {
  island: Mountain,
  cove: Waves,
  park: Trees,
  marina: Anchor,
  point: MapPin,
  town: MapPin,
  landmark: Info,
};

type KindFilter = "all" | "saved" | "community" | PlaceKind;
type RegionFilter = "all" | RegionId;

function coords(place: Place) {
  return `${place.lat.toFixed(5)}°N  ${Math.abs(place.lon).toFixed(5)}°W`;
}

export function LakeApp({ initialCommunity = [] }: { initialCommunity?: Place[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layer, setLayer] = useState<MapLayerId>("satellite");
  const [historical, setHistorical] = useState(false);
  const [histOpacity, setHistOpacity] = useState(HISTORICAL_DEFAULT_OPACITY);
  const [measure, setMeasure] = useState(false);
  const [measureLabel, setMeasureLabel] = useState<string | null>(null);
  const [flyRequest, setFlyRequest] = useState(0);
  const [fitRequest, setFitRequest] = useState(0);
  const [about, setAbout] = useState(false);
  const [mobileList, setMobileList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [community, setCommunity] = useState<Place[]>(initialCommunity);
  const [addMode, setAddMode] = useState(false);
  const [draftPoint, setDraftPoint] = useState<{ lat: number; lon: number } | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const favs = useFavorites();

  useEffect(() => setMounted(true), []);

  const refreshCommunity = useCallback(async () => {
    try {
      const rows = await listCommunityCoves();
      setCommunity(rows.map(communityCoveToPlace));
    } catch {
      /* preview may still be migrating */
    }
  }, []);

  useEffect(() => {
    void refreshCommunity();
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshCommunity();
    }, 30_000);
    const onVis = () => {
      if (document.visibilityState === "visible") void refreshCommunity();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refreshCommunity]);

  const catalog = useMemo(() => [...PLACES, ...community], [community]);

  const filtered = useMemo(() => {
    let list = searchPlaces(query, catalog);
    if (kind === "saved") list = list.filter((p) => favs.has(p.id));
    else if (kind === "community") list = list.filter((p) => p.community);
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

  function startAddCove() {
    setMeasure(false);
    setSelectedId(null);
    setAddMode(true);
    setDraftPoint(null);
    setDraftName("");
    setDraftNote("");
    setDraftError(null);
    setMobileList(false);
  }

  function cancelAddCove() {
    setAddMode(false);
    setDraftPoint(null);
    setDraftName("");
    setDraftNote("");
    setDraftError(null);
  }

  async function submitCove() {
    if (!draftPoint) return;
    setSaving(true);
    setDraftError(null);
    try {
      const result = await addCommunityCove({
        data: {
          name: draftName,
          lat: draftPoint.lat,
          lon: draftPoint.lon,
          note: draftNote || undefined,
        },
      });
      if (!result.ok) {
        setDraftError(result.error);
        return;
      }
      const place = communityCoveToPlace(result.cove);
      setCommunity((prev) => [place, ...prev.filter((p) => p.id !== place.id)]);
      cancelAddCove();
      setKind("all");
      selectPlace(place.id, true);
    } catch {
      setDraftError("Could not save that cove. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: catalog.length,
      saved: favs.ids.length,
      community: community.length,
    };
    for (const k of KIND_ORDER) c[k] = catalog.filter((p) => p.kind === k).length;
    return c;
  }, [favs.ids.length, catalog, community.length]);

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
          draftPoint={draftPoint}
          onPickPoint={(lat, lon) => {
            setDraftPoint({ lat, lon });
            setDraftError(null);
          }}
          historical={historical}
          histOpacity={histOpacity}
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
            <label className="flex w-40 items-center gap-2 rounded-sm bg-surface px-3 py-2 shadow-panel">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">Fade</span>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.02}
                value={histOpacity}
                onChange={(e) => setHistOpacity(Number(e.target.value))}
                className="lf-range min-w-0 flex-1"
                aria-label="Historical map strength"
              />
            </label>
          ) : null}
          <Button
            variant={measure ? "primary" : "outline"}
            size="sm"
            aria-pressed={measure}
            onClick={() => {
              cancelAddCove();
              setMeasure((v) => !v);
            }}
          >
            <Ruler className="size-4" />
            <span className="hidden sm:inline">{measure ? "Measuring" : "Measure"}</span>
          </Button>
          <Button
            variant={addMode ? "primary" : "outline"}
            size="sm"
            aria-pressed={addMode}
            aria-label={addMode ? "Cancel naming" : "Name a cove"}
            onClick={() => {
              if (addMode) cancelAddCove();
              else startAddCove();
            }}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{addMode ? "Naming" : "Name a cove"}</span>
          </Button>
          {measure && measureLabel ? (
            <p className="rounded-sm bg-surface px-3 py-1.5 font-mono text-xs tabular-nums text-accent shadow-panel">
              {measureLabel}
            </p>
          ) : null}
          {addMode && !draftPoint ? (
            <p className="max-w-[10rem] rounded-sm bg-surface px-3 py-1.5 text-xs text-fg shadow-panel">
              Tap the cove on the map
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
              {selected ? selected.name : addMode && draftPoint ? "Name this cove" : `${filtered.length} places`}
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
                  placeholder="Search coves, islands, parks…"
                  className="pl-9"
                  aria-label="Search places"
                />
              </label>
              <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
                {(
                  [
                    ["all", "All"],
                    ["island", "Islands"],
                    ["cove", "Coves"],
                    ["community", "Local"],
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
              <AddCoveForm
                draftPoint={draftPoint}
                name={draftName}
                note={draftNote}
                error={draftError}
                saving={saving}
                onName={setDraftName}
                onNote={setDraftNote}
                onCancel={cancelAddCove}
                onSubmit={() => void submitCove()}
              />
            ) : null}

            {selected ? (
              <PlaceDetail
                place={selected}
                saved={favs.has(selected.id)}
                onSave={() => favs.toggle(selected.id)}
                onClose={() => setSelectedId(null)}
              />
            ) : null}

            <PlaceList
              places={filtered}
              selectedId={selectedId}
              savedIds={favs.ids}
              onPick={(id) => selectPlace(id, true)}
              emptySaved={kind === "saved"}
              emptyLocal={kind === "community"}
            />
          </div>
        </div>
      </aside>

      {about ? <AboutCard onClose={() => setAbout(false)} /> : null}
    </div>
  );
}

function PlaceList({
  places,
  selectedId,
  savedIds,
  onPick,
  emptySaved,
  emptyLocal,
}: {
  places: Place[];
  selectedId: string | null;
  savedIds: string[];
  onPick: (id: string) => void;
  emptySaved: boolean;
  emptyLocal?: boolean;
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
          : emptyLocal
            ? "No local names yet. Tap Name a cove, then drop a pin on the pocket you know."
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
                        {p.community ? " · local" : p.approx ? " · approx." : ""}
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

function PlaceDetail({
  place,
  saved,
  onSave,
  onClose,
}: {
  place: Place;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const Icon = KIND_ICON[place.kind];
  return (
    <article className="border-b border-border px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] text-accent uppercase">
            <Icon className="size-3.5" />
            {KIND_LABEL[place.kind]} · {REGION_LABEL[place.region]}
            {place.community ? " · Local" : ""}
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
      <p className="mt-2 text-sm leading-relaxed text-muted">{place.description}</p>
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
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] tabular-nums text-muted">{coords(place)}</p>
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
    </article>
  );
}

function AddCoveForm({
  draftPoint,
  name,
  note,
  error,
  saving,
  onName,
  onNote,
  onCancel,
  onSubmit,
}: {
  draftPoint: { lat: number; lon: number } | null;
  name: string;
  note: string;
  error: string | null;
  saving: boolean;
  onName: (v: string) => void;
  onNote: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
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
          <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">Local name</p>
          <p className="mt-1 text-sm text-muted">
            {draftPoint
              ? "Name the pocket you dropped. It shows up on every device."
              : "Tap the map on the cove — then name it."}
          </p>
        </div>
        <button
          type="button"
          aria-label="Cancel naming"
          onClick={onCancel}
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-fg"
        >
          <X className="size-4" />
        </button>
      </div>
      {draftPoint ? (
        <>
          <label className="block">
            <span className="sr-only">Cove name</span>
            <Input
              value={name}
              onChange={(e) => onName(e.target.value)}
              placeholder="Cove name"
              maxLength={48}
              autoFocus
              required
            />
          </label>
          <label className="block">
            <span className="sr-only">Optional note</span>
            <Input
              value={note}
              onChange={(e) => onNote(e.target.value)}
              placeholder="Optional — ski pocket, walleye hole…"
              maxLength={160}
            />
          </label>
          <p className="font-mono text-xs tabular-nums text-muted">
            {draftPoint.lat.toFixed(5)}°N  {Math.abs(draftPoint.lon).toFixed(5)}°W
          </p>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" size="sm" disabled={saving || name.trim().length < 2}>
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

function AboutCard({ onClose }: { onClose: () => void }) {
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
          Place names follow USGS GNIS, the Corps lake map, and the local visitor guide. Pins marked
          approximate are locally used names without a surveyed point. Anyone can add a cove name —
          those local pins are shared across every device. Saved hearts stay on this device. Turn on
          Before the dam to overlay USGS topographic maps from 1963 and earlier — the Little Red
          River valley, georeferenced to this map, as it looked before the reservoir filled.
        </p>
      </div>
    </div>
  );
}
