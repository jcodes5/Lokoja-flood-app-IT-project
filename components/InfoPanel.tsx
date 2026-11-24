"use client";

import { useState } from "react";
import type { Row, SummaryFile } from "@/lib/types";

function fmt(v: string | undefined) {
  if (v === undefined || v === "") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return Math.abs(n) >= 100 ? Math.round(n).toLocaleString() : n.toFixed(1);
}

function Table({ rows, cols }: { rows: Row[] | null; cols: [string, string][] }) {
  if (!rows || rows.length === 0) return <p className="note">Not available yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          {cols.map(([, label]) => (
            <th key={label}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {cols.map(([key], j) => (
              <td key={key}>{j === 0 ? r[key] : fmt(r[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const exposureCols: [string, string][] = [
  ["zone", "Class"],
  ["area_km2", "Area km²"],
  ["people", "People"],
  ["buildings", "Buildings"],
  ["road_km", "Roads km"],
];

export default function InfoPanel({ summary }: { summary: SummaryFile | null }) {
  const [tab, setTab] = useState<"susc" | "risk" | "floods" | "valid" | "forecast">("susc");
  if (!summary) return null;
  const tabs: [typeof tab, string][] = [
    ["susc", "By susceptibility"],
    ["risk", "By risk"],
    ["floods", "Observed floods"],
    ["valid", "Validation"],
    ["forecast", "Trigger now/+48 h"],
  ];
  return (
    <section>
      <h2>Key numbers</h2>
      <div className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={"tab" + (tab === id ? " on" : "")} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === "susc" && <Table rows={summary.susceptibility_exposure} cols={exposureCols} />}
      {tab === "risk" && <Table rows={summary.risk_exposure} cols={exposureCols} />}
      {tab === "floods" && (
        <>
          <Table rows={summary.observed_floods_exposure} cols={exposureCols} />
          <p className="note">
            Counts inside observed flood extents are minimums: radar misses flooding among buildings.
          </p>
        </>
      )}
      {tab === "valid" && (
        <>
          <Table
            rows={summary.validation}
            cols={[
              ["event", "Event"],
              ["flooded_percent", "Flooded %"],
              ["auc_thinned", "AUC (thinned)"],
              ["ci_low", "CI low"],
              ["ci_high", "CI high"],
            ]}
          />
          <p className="note">
            AUC compares the susceptibility index with flooding seen by Sentinel-1 radar in 2018 and 2022.
          </p>
        </>
      )}
      {tab === "forecast" &&
        (summary.forecast ? (
          <>
            <p className="note">Issued {summary.forecast.issue_date}</p>
            <table>
              <thead>
                <tr>
                  <th>Valid</th>
                  <th>Rain</th>
                  <th>Soil</th>
                  <th>Trigger</th>
                </tr>
              </thead>
              <tbody>
                {summary.forecast.leads.map((l) => (
                  <tr key={l.lead_days}>
                    <td>{l.valid_date}</td>
                    <td>{l.rain_score_mean.toFixed(2)}</td>
                    <td>{l.soil_score_mean.toFixed(2)}</td>
                    <td>{l.dti_mean.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="note">No dynamic layer has been produced yet.</p>
        ))}

      <h2>Read before using</h2>
      <ul className="caveats">
        {summary.caveats.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}
