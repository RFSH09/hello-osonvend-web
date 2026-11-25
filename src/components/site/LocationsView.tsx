"use client";

import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { StatusBadge } from "@/components/fridge/StatusBadge";
import { EmptyState } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import type { Fridge } from "@/lib/api/types";
import { cn } from "@/lib/cn";

const COLORS = { available: "#22C55E", low: "#F59E0B", offline: "#EF4444" } as const;

function FridgeMap({ fridges, onPick }: { fridges: Fridge[]; onPick: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    if (!el.current) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false }).setView([41.3111, 69.2797], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      fridges.forEach((f) => {
        const icon = L.divIcon({
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: `<div style="width:28px;height:28px;border-radius:50%;background:${COLORS[f.status]};border:4px solid #0F1E3D;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
        });
        L.marker([f.lat, f.lng], { icon, title: f.name }).addTo(map!).on("click", () => pickRef.current(f.id));
      });
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [fridges]);

  return <div ref={el} className="h-[320px] w-full overflow-hidden rounded-card border border-border lg:h-[560px]" role="application" aria-label="Map" />;
}

export function LocationsView({ fridges }: { fridges: Fridge[] }) {
  const t = useTranslations();
  const [district, setDistrict] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const districts = Array.from(new Set(fridges.map((f) => f.district)));
  const list = fridges.filter((f) => district === "all" || f.district === district);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t("locationsPage.district")}>
        {["all", ...districts].map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={district === d}
            onClick={() => setDistrict(d)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-5 font-semibold transition-colors duration-200",
              district === d ? "border-navy bg-navy text-white" : "border-border bg-surface hover:bg-background",
            )}
          >
            {d === "all" ? t("locationsPage.allDistricts") : t(`districts.${d}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ul className="order-2 flex max-h-[560px] flex-col gap-3 overflow-y-auto lg:order-1">
          {list.length === 0 && <EmptyState title={t("locationsPage.empty")} />}
          {list.map((f) => (
            <li key={f.id}>
              <Link
                href={`/refrigerator/${f.id}`}
                className={cn("flex flex-col gap-2 rounded-card border bg-surface p-4 transition-colors duration-200 hover:border-accent", active === f.id ? "border-accent ring-2 ring-accent/30" : "border-border")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display font-bold">{f.name}</span>
                  <StatusBadge status={f.status} />
                </div>
                <span className="text-sm text-muted">{t(`districts.${f.district}`)} · {f.address}</span>
                <span className="text-sm font-medium">{t("locationsPage.access")}: {t(`access.${f.access}`)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="order-1 lg:order-2">
          <FridgeMap fridges={list} onPick={setActive} />
        </div>
      </div>
    </div>
  );
}
