"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
// Leaflet ships this stylesheet without TypeScript declarations.
// @ts-ignore -- the CSS import is handled by the Next.js bundler.
import "leaflet/dist/leaflet.css";
import type { LayerDef } from "@/lib/types";

const BLANK =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

   interface Props {
     center: [number, number];
     bounds: [number, number, number, number];
     layer: LayerDef | null;
     opacity: number;
     version?: string;
   }
export default function FloodMap({ center, bounds, layer, opacity, version }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const overlay = useRef<L.TileLayer | null>(null);

  // create the map once
  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current).setView(center, 10);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(m);
    m.fitBounds([
      [bounds[1], bounds[0]],
      [bounds[3], bounds[2]],
    ]);
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      overlay.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap the data layer when the selection changes
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (overlay.current) {
      m.removeLayer(overlay.current);
      overlay.current = null;
    }
    if (!layer) return;
    const b = layer.bounds_wgs84;
    const t = L.tileLayer(`/web_data/${layer.tiles}${version ? `?v=${encodeURIComponent(version)}` : ""}`, {
      minZoom: layer.minzoom,
      maxNativeZoom: layer.maxzoom,
      maxZoom: 19,
      opacity,
      errorTileUrl: BLANK,
      bounds: L.latLngBounds([b[1], b[0]], [b[3], b[2]]),
    });
    t.addTo(m);
    overlay.current = t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, version]);

  useEffect(() => {
    overlay.current?.setOpacity(opacity);
  }, [opacity]);

  return <div ref={el} className="map" />;
}
