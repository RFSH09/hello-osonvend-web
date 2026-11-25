"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LMap, Marker, Icon } from "leaflet";
import { Info, List, Map as MapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge } from "@/components/fridge/StatusBadge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/primitives";
import type { Fridge, FridgeType } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { FRIDGE_TYPES, hasCoords } from "@/lib/data/fridges";
import { useFridgeLabel } from "@/lib/fridge-label";

const COLORS = { available: "#3ADC93", low: "#F59E0B", offline: "#EF4444" } as const;
const CENTER: [number, number] = [41.3111, 69.2797];

function pinHtml(color: string, active: boolean) {
  const size = active ? 38 : 28;
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:4px solid #33384B;box-shadow:0 2px 8px rgba(0,0,0,.35)${active ? ",0 0 0 6px rgba(58,220,147,.35)" : ""}"></div>`;
}

export function LocationsView({ fridges }: { fridges: Fridge[] }) {
  const t = useTranslations();
  const { label, typeName } = useFridgeLabel();
  const [type, setType] = useState<"all" | FridgeType>("all");
  const [active, setActive] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");
  const [tilesReady, setTilesReady] = useState(false);

  const types = useMemo(() => FRIDGE_TYPES.filter((ty) => fridges.some((f) => f.type === ty)), [fridges]);
  const list = useMemo(() => fridges.filter((f) => type === "all" || f.type === type), [fridges, type]);
  const groups = useMemo(
    () => types.map((ty) => [ty, list.filter((f) => f.type === ty)] as const).filter(([, items]) => items.length > 0),
    [types, list],
  );
  const mappable = useMemo(() => list.filter(hasCoords), [list]);
  const idsKey = mappable.map((f) => f.id).join(",");
  const someMissingCoords = fridges.some((f) => !hasCoords(f));

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const listRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const listBox = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  const select = useCallback((id: string, from: "list" | "pin") => {
    setActive(id);
    if (from === "pin") {
      const el = listRefs.current.get(id);
      const box = listBox.current;
      if (el && box) box.scrollTo({ top: el.offsetTop - box.offsetTop - 8, behavior: "smooth" });
    }
  }, []);

  // 1) Create the map ONCE (empty deps) and keep it in a ref.
  useEffect(() => {
    let cancelled = false;
    let fallback: ReturnType<typeof setTimeout>;
    // The map is not critical content: start it once the page is idle so the list/heading paint first.
    const boot = setTimeout(() => void start(), 1800);
    const start = () =>
      import("leaflet").then((L) => {
        if (cancelled || !mapEl.current || mapRef.current) return;
        leafletRef.current = L;
        const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(CENTER, 11);
        const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
        tiles.on("load", () => setTilesReady(true));
        fallback = setTimeout(() => setTilesReady(true), 6000); // tiles blocked/slow: still show the map frame
        mapRef.current = map;
        setTimeout(() => map.invalidateSize(), 150);
        setMapReady(true);
      });
    const markers = markersRef.current;
    return () => {
      cancelled = true;
      clearTimeout(boot);
      clearTimeout(fallback);
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
      setMapReady(false);
    };
  }, []);

  // 2) Markers: separate effect keyed on the ids of fridges that have coordinates.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    mappable.forEach((f) => {
      const icon = L.divIcon({ className: "", iconSize: [28, 28], iconAnchor: [14, 14], html: pinHtml(COLORS[f.status], false) });
      const m = L.marker([f.lat, f.lng], { icon, title: label(f) }).addTo(map);
      m.on("click", () => select(f.id, "pin"));
      markersRef.current.set(f.id, m);
    });
    if (mappable.length > 1) map.fitBounds(L.latLngBounds(mappable.map((f) => [f.lat, f.lng] as [number, number])), { padding: [40, 40], maxZoom: 13 });
    else if (mappable.length === 1) map.setView([mappable[0].lat, mappable[0].lng], 13);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, idsKey, select]);

  // 3) Highlight the active pin (bigger + ring).
  useEffect(() => {
    const L = leafletRef.current;
    if (!mapReady || !L) return;
    markersRef.current.forEach((m, id) => {
      const f = mappable.find((x) => x.id === id);
      if (!f) return;
      const on = id === active;
      const size = on ? 38 : 28;
      m.setIcon(L.divIcon({ className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2], html: pinHtml(COLORS[f.status], on) }) as Icon);
      m.setZIndexOffset(on ? 1000 : 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mapReady, idsKey]);

  // map becomes visible again after the mobile toggle: re-measure
  useEffect(() => {
    if (view === "map") setTimeout(() => mapRef.current?.invalidateSize(), 50);
  }, [view]);

  function onListClick(f: Fridge) {
    setActive(f.id);
    if (hasCoords(f)) {
      mapRef.current?.flyTo([f.lat, f.lng], 14, { duration: 0.8 });
      if (window.matchMedia("(max-width: 1023px)").matches) setView("map");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t("locationsPage.type")}>
        {(["all", ...types] as const).map((ty) => (
          <button
            key={ty}
            role="tab"
            aria-selected={type === ty}
            onClick={() => setType(ty)}
            className={cn("min-h-11 shrink-0 rounded-full border px-5 font-semibold transition-colors duration-200", type === ty ? "border-navy bg-navy text-white" : "border-border bg-surface hover:bg-background")}
          >
            {ty === "all" ? t("locationsPage.allTypes") : typeName(ty)}
          </button>
        ))}
      </div>

      {/* mobile: Xarita (map on top, list below) / Ro'yxat (list only) */}
      <div className="grid grid-cols-2 gap-1 rounded-full bg-background p-1 lg:hidden" role="group" aria-label={t("locationsPage.view")}>
        {([["map", t("locationsPage.mapTab"), MapIcon], ["list", t("locationsPage.listTab"), List]] as const).map(([k, text, Icon]) => (
          <button key={k} aria-pressed={view === k} onClick={() => setView(k)} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold", view === k ? "bg-navy text-white" : "text-muted")}>
            <Icon size={18} aria-hidden />{text}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div
          ref={listBox}
          className={cn("order-2 flex flex-col gap-5 overflow-y-auto pr-1 lg:order-1 lg:max-h-[560px]", view === "list" ? "" : "max-h-[420px]")}
        >
          {list.length === 0 && <EmptyState title={t("locationsPage.empty")} />}
          {groups.map(([ty, items]) => (
            <section key={ty} aria-label={typeName(ty)}>
              <h2 className="mb-2 font-display text-lg font-bold text-muted">{typeName(ty)}</h2>
              <ul className="flex flex-col gap-3">
                {items.map((f) => (
                  <li key={f.id} ref={(el) => { if (el) listRefs.current.set(f.id, el); else listRefs.current.delete(f.id); }}>
                    <div className={cn("rounded-card border bg-surface p-4 transition-colors duration-200", active === f.id ? "border-accent ring-2 ring-accent/30" : "border-border")}>
                      <button onClick={() => onListClick(f)} className="flex w-full flex-col gap-2 text-left" aria-label={label(f)}>
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-display font-bold">{label(f)}</span>
                          <StatusBadge status={f.status} />
                        </span>
                        {f.address && <span className="text-sm text-muted">{f.address}</span>}
                        <span className="text-sm font-medium">{t("locationsPage.access")}: {t(`access.${f.access}`)}</span>
                      </button>
                      <ButtonLink href={`/refrigerator/${f.id}`} variant="outline" className="mt-3 min-h-11 px-4 text-sm">{t("locationsPage.open")}</ButtonLink>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className={cn("order-1 flex flex-col gap-3 lg:order-2", view === "list" && "hidden lg:flex")}>
          {someMissingCoords && (
            <p role="note" className="flex items-center gap-2 rounded-xl bg-accent/15 px-4 py-3 text-sm font-semibold">
              <Info size={18} className="shrink-0 text-accent-strong" aria-hidden />
              {t("locationsPage.addressesSoon")}
            </p>
          )}
          <div className="relative h-[300px] overflow-hidden rounded-card border border-border bg-[#e8eef5] lg:h-[560px]">
            <div ref={mapEl} className="size-full" role="application" aria-label={t("locationsPage.mapTab")} />
            {!tilesReady && (
              <div className="absolute inset-0 z-[500] animate-pulse bg-border/70" aria-hidden>
                <span className="sr-only">{t("common.loading")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
