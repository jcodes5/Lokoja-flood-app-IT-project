export interface LegendItem {
  label: string;
  color: string;
}

export interface LayerDef {
  id: string;
  title: string;
  group: string;
  kind: "class" | "continuous";
  legend: LegendItem[];
  note: string;
  tiles: string; // relative to /web_data, for example tiles/risk_class/{z}/{x}/{y}.png
  minzoom: number;
  maxzoom: number;
  bounds_wgs84: [number, number, number, number]; // west, south, east, north
}

export interface LayersFile {
  generated?: string;
  bounds_wgs84: [number, number, number, number];
  center: [number, number]; // lat, lon
  layers: LayerDef[];
}

export type Row = Record<string, string>;

export interface ForecastLead {
  lead_days: number;
  valid_date: string;
  rain_score_mean: number;
  soil_score_mean: number;
  dti_mean: number;
  fri_mean: number;
  fri_max: number;
}

export interface SummaryFile {
  susceptibility_exposure: Row[] | null;
  risk_exposure: Row[] | null;
  observed_floods_exposure: Row[] | null;
  validation: Row[] | null;
  forecast: { issue_date: string; leads: ForecastLead[] } | null;
  caveats: string[];
}
