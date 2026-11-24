"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import InfoPanel from "@/components/InfoPanel";
import LayerPanel from "@/components/LayerPanel";
import AboutPanel from "@/components/AboutPanel";
import type { LayersFile, SummaryFile } from "@/lib/types";

// Leaflet needs the browser, so the map is loaded on the client only
const FloodMap = dynamic(() => import("@/components/FloodMap"), { ssr: false });

const DEMO = process.env.NEXT_PUBLIC_DEMO === "true";

export default function Page() {
  const [layers, setLayers] = useState<LayersFile | null>(null);
  const [summary, setSummary] = useState<SummaryFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    fetch("/web_data/layers.json")
      .then((r) => {
        if (!r.ok) throw new Error("layers.json not found in public/web_data");
        return r.json();
      })
      .then((d: LayersFile) => {
        setLayers(d);
        setActiveId(d.layers[0]?.id ?? null);
      })
      .catch((e) => setError(String(e.message ?? e)));
    fetch("/web_data/summary.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSummary(d))
      .catch(() => setSummary(null));
  }, []);

  const active = layers?.layers.find((l) => l.id === activeId) ?? null;

  return (
    <div className="app">
      <aside className="side">
        <h1>Lokoja flood risk map</h1>
        <p className="sub">Lokoja Local Government Area, Kogi State</p>
        {DEMO && (
          <div className="banner">
            Demonstration using past data. The dynamic layers show a past date and are not a real forecast.
          </div>
        )}
        {error && <div className="banner">{error}</div>}
        {layers && (
          <LayerPanel
            layers={layers.layers}
            activeId={activeId}
            onSelect={setActiveId}
            opacity={opacity}
            onOpacity={setOpacity}
          />
        )}
        <InfoPanel summary={summary} />
        <AboutPanel summary={summary} generated={layers?.generated} />
      </aside>
      <main className="mapwrap">
        {layers && (
          <FloodMap center={layers.center} bounds={layers.bounds_wgs84} layer={active} opacity={opacity} version={layers.generated}/>
        )}
      </main>
    </div>
  );
}
