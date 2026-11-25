"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LMap, Marker, Icon } from "leaflet";
import { Map as MapIcon, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge } from "@/components/fridge/StatusBadge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/primitives";
import type { Fridge } from "@/lib/api/types";
import { cn } from "@/lib/cn";

const COLORS = { available: "#3ADC93", low: "#F59E0B", offline: "#EF4444" } as const;
const CENTER: [number, number] = [41.3111, 69.2797];

function pinHtml(color: string, active: boolean) {
  const size = active ? 38 : 28;
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:4px solid #33384B;box-shadow:0 2px 8px rgba(0,0,0,.35)${active ? ",0 0 0 6px rgba(58,220,147,.35)" : ""}"></div>`;
}

export function LocationsView({ fridges }: { fridges: Fridge[] }) {
  const t = useTranslations();
  const [district, setDistrict] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");
  const [tilesReady, setTilesReady] = useState(false);

  const districts = useMemo(() => Array.from(new Set(fridges.map((f) => f.district))), [fridges]);
  const list = useMemo(() => fridges.filter((f) => district === "all" || f.district === district), [fridges, district]);
  const idsKey = list.map((f) => f.id).join(",");

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const listRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const listBox = useRef<HTMLUListElement>(null);
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
    const start = () => import("leaflet").then((L) => {
      if (cancelled || !mapEl.current || mapRef.current) return;
      leafletRef.current = L;
      const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(CENTER, 11);
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
      tiles.on("load", () => setTilesReady(true));
      fallback = setTimeout(() => setTilesReady(true), 6000); // tiles blocked/slow: still show pins
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 150);
      setMapReady(true);
    });
    return () => {
      cancelled = true;
      clearTimeout(boot);
      clearTimeout(fallback);
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      setMapReady(false);
    };
  }, []);

  // 2) Markers: separate effect keyed on the filtered fridge ids.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    list.forEach((f) => {
      const icon = L.divIcon({ className: "", iconSize: [28, 28], iconAnchor: [14, 14], html: pinHtml(COLORS[f.status], false) });
      const m = L.marker([f.lat, f.lng], { icon, title: f.name }).addTo(map);
      m.on("click", () => select(f.id, "pin"));
      markersRef.current.set(f.id, m);
    });
    if (list.length > 1) map.fitBounds(L.latLngBounds(list.map((f) => [f.lat, f.lng] as [number, number])), { padding: [40, 40], maxZoom: 13 });
    else if (list.length === 1) map.setView([list[0].lat, list[0].lng], 13);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, idsKey, select]);

  // 3) Highlight the active pin (bigger + ring); fly to it when chosen from the list.
  useEffect(() => {
    const L = leafletRef.current;
    if (!mapReady || !L) return;
    markersRef.current.forEach((m, id) => {
      const f = list.find((x) => x.id === id);
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
    mapRef.current?.flyTo([f.lat, f.lng], 14, { duration: 0.8 });
    if (window.matchMedia("(max-width: 1023px)").matches) setView("map");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t("locationsPage.district")}>
        {["all", ...districts].map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={district === d}
            onClick={() => setDistrict(d)}
            className={cn("min-h-11 shrink-0 rounded-full border px-5 font-semibold transition-colors duration-200", district === d ? "border-navy bg-navy text-white" : "border-border bg-surface hover:bg-background")}
          >
            {d === "all" ? t("locationsPage.allDistricts") : t(`districts.${d}`)}
          </button>
        ))}
      </div>

      {/* mobile: Xarita (map on top, list below) / Ro'yxat (list only) */}
      <div className="grid grid-cols-2 gap-1 rounded-full bg-background p-1 lg:hidden" role="group" aria-label={t("locationsPage.view")}>
        {([["map", t("locationsPage.mapTab"), MapIcon], ["list", t("locationsPage.listTab"), List]] as const).map(([k, label, Icon]) => (
          <button key={k} aria-pressed={view === k} onClick={() => setView(k)} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold", view === k ? "bg-navy text-white" : "text-muted")}>
            <Icon size={18} aria-hidden />{label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <ul
          ref={listBox}
          className={cn("order-2 flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1 lg:order-1", view === "list" ? "max-h-none" : "max-h-[420px]", "lg:max-h-[560px]")}
        >
          {list.length === 0 && <EmptyState title={t("locationsPage.empty")} />}
          {list.map((f) => (
            <li key={f.id} ref={(el) => { if (el) listRefs.current.set(f.id, el); else listRefs.current.delete(f.id); }}>
              <div className={cn("rounded-card border bg-surface p-4 transition-colors duration-200", active === f.id ? "border-accent ring-2 ring-accent/30" : "border-border")}>
                <button onClick={() => onListClick(f)} className="flex w-full flex-col gap-2 text-left" aria-label={f.name}>
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display font-bold">{f.name}</span>
                    <StatusBadge status={f.status} />
                  </span>
                  <span className="text-sm text-muted">{t(`districts.${f.district}`)} · {f.address}</span>
                  <span className="text-sm font-medium">{t("locationsPage.access")}: {t(`access.${f.access}`)}</span>
                </button>
                <ButtonLink href={`/refrigerator/${f.id}`} variant="outline" className="mt-3 min-h-11 px-4 text-sm">{t("locationsPage.open")}</ButtonLink>
              </div>
            </li>
          ))}
        </ul>

        <div className={cn("order-1 lg:order-2", view === "list" && "hidden lg:block")}>
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
