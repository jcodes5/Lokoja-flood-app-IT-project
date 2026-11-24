"use client";

import type { LayerDef } from "@/lib/types";

interface Props {
  layers: LayerDef[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  opacity: number;
  onOpacity: (v: number) => void;
}

export default function LayerPanel({ layers, activeId, onSelect, opacity, onOpacity }: Props) {
  const groups = Array.from(new Set(layers.map((l) => l.group)));
  const active = layers.find((l) => l.id === activeId) ?? null;

  return (
    <section>
      <h2>Map layers</h2>
      <label className="layer">
        <input type="radio" name="layer" checked={activeId === null} onChange={() => onSelect(null)} />
        <span>None (base map only)</span>
      </label>
      {groups.map((g) => (
        <div className="group" key={g}>
          <div className="group-title">{g}</div>
          {layers
            .filter((l) => l.group === g)
            .map((l) => (
              <label className="layer" key={l.id}>
                <input
                  type="radio"
                  name="layer"
                  checked={activeId === l.id}
                  onChange={() => onSelect(l.id)}
                />
                <span>{l.title}</span>
              </label>
            ))}
        </div>
      ))}

      {active && (
        <>
          <h2>Legend</h2>
          {active.kind === "class" ? (
            <div className="legend">
              {active.legend.map((i) => (
                <div className="swatch-row" key={i.label}>
                  <span className="swatch" style={{ background: i.color }} />
                  {i.label}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div
                className="gradient"
                style={{
                  background: `linear-gradient(to right, ${active.legend.map((i) => i.color).join(",")})`,
                }}
              />
              <div className="gradient-labels">
                <span>{active.legend[0]?.label} (lower)</span>
                <span>{active.legend[active.legend.length - 1]?.label} (higher)</span>
              </div>
            </div>
          )}
          <p className="note">{active.note}</p>
          <label className="note" htmlFor="opacity">
            Layer opacity
          </label>
          <input
            id="opacity"
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(e) => onOpacity(Number(e.target.value))}
          />
        </>
      )}
    </section>
  );
}
