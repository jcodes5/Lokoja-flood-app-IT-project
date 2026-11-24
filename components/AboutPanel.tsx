"use client";

import type { SummaryFile } from "@/lib/types";

// Edit this list so that it matches the data you actually used and their licences.
const SOURCES: { what: string; credit: string }[] = [
  { what: "Terrain", credit: "Copernicus DEM GLO-30, produced under Copernicus by the European Union and ESA." },
  { what: "Rainfall history", credit: "CHIRPS, Climate Hazards Center, University of California Santa Barbara." },
  {
    what: "Vegetation and land cover",
    credit: "Contains modified Copernicus Sentinel-2 data; Dynamic World (Google and World Resources Institute, CC BY 4.0); ESA WorldCover.",
  },
  {
    what: "Observed flooding",
    credit: "Contains modified Copernicus Sentinel-1 data, processed in Google Earth Engine; JRC Global Surface Water.",
  },
  { what: "Buildings", credit: "Google Open Buildings (CC BY 4.0)." },
  { what: "Population, roads and health facilities", credit: "See the project documentation for the exact sources and licences." },
  { what: "Live rainfall", credit: "NASA GPM IMERG Early Run, GES DISC." },
  { what: "Rainfall forecast", credit: "Contains ECMWF open data (IFS), licensed under CC BY 4.0. Source: ECMWF." },
  { what: "Soil moisture", credit: "NASA SMAP Level 4, NSIDC DAAC." },
  { what: "Base map", credit: "OpenStreetMap contributors (ODbL)." },
];

export default function AboutPanel({ summary, generated }: { summary: SummaryFile | null; generated?: string }) {
  const issued = summary?.forecast?.issue_date;
  return (
    <section>
      <h2>About this map</h2>
      <p className="note">
        Research prototype developed as an IT (SIWES) research project. It is not an official warning service and
        must not be used alone for emergency decisions. For official flood warnings, follow NIHSA and the emergency
        management agencies.
      </p>
      <p className="note">
        <strong>Static layers</strong> (susceptibility, exposure, risk) describe terrain, drainage, surface and what is
        exposed, and change only when the analysis is re-run. <strong>Dynamic layers</strong> combine recent and
        forecast rainfall with soil wetness and are refreshed by a daily job. They describe local conditions and do
        not include flow from the Niger and Benue rivers.
      </p>
      {(generated || issued) && (
        <p className="note">
          {issued && <>Dynamic layers issued for {issued}. </>}
          {generated && <>Map data built {generated.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2}).*$/, "$1-$2-$3 $4:$5 UTC")}.</>}
        </p>
      )}
      <h2>Data and credits</h2>
      <ul className="caveats">
        {SOURCES.map((s) => (
          <li key={s.what}>
            <strong>{s.what}:</strong> {s.credit}
          </li>
        ))}
      </ul>
    </section>
  );
}
