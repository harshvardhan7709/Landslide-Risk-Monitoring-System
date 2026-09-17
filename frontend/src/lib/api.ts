const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface DashboardSummary {
  rainfall_24h: number;
  rainfall_trend_text: string;
  high_risk_areas: number;
  high_risk_trend_text: string;
  people_at_risk: number;
  people_at_risk_trend_text: string;
  active_alerts: number;
  critical_alerts: number;
  active_alerts_trend_text: string;
  total_incidents: number;
  total_incidents_trend_text: string;
  source_type: string;
}

export interface LocationItem {
  id: number;
  name: string;
  state_name: string;
  district_name?: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slope: number;
  soil_type: string;
  land_cover: string;
  soil_moisture: number;
  population: number;
  current_risk_score: number;
  current_risk_level: string;
  warning_message?: string;
  source_type: string;
}

export interface LocationRiskDetail {
  id: number;
  name: string;
  state_name: string;
  risk_score: number;
  risk_level: string;
  rainfall_24h: number;
  rainfall_7d: number;
  slope: number;
  elevation: number;
  soil_type: string;
  land_cover: string;
  soil_moisture: number;
  warning_message: string;
  source_type: string;
}

export interface RainfallTrendItem {
  date: string;
  h1: number;
  h24: number;
  d7: number;
}

export interface RainfallTrendResponse {
  location_id: number;
  location_name: string;
  unit: string;
  trends: RainfallTrendItem[];
  source_type: string;
}

export interface IncidentCategory {
  name: string;
  value: number;
  color: string;
  percent: string;
}

export interface IncidentSummaryResponse {
  total_30d: number;
  categories: IncidentCategory[];
  source_type: string;
}

export interface AlertItem {
  id: number;
  level: string;
  location: string;
  state_name: string;
  time: string;
  date: string;
  risk_score: number;
  message: string;
  color: string;
  bg: string;
  source_type: string;
}

export interface SystemStatusItem {
  name: string;
  time: string;
  status: "green" | "yellow" | "red";
  icon: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "Polygon";
    coordinates: any;
  };
  properties: {
    id?: number;
    zone_id?: string;
    name: string;
    state?: string;
    district?: string;
    risk_score: number;
    risk_level: string;
    color?: string;
    fill_color?: string;
    fill_opacity?: number;
    stroke_color?: string;
    rainfall_24h?: number;
    rainfall_7d?: number;
    slope?: number;
    elevation?: number;
    soil_type?: string;
    land_cover?: string;
    soil_moisture?: number;
    warning_message?: string;
    is_hazard_alert?: boolean;
    source_type?: string;
  };
}

export interface RiskMapGeoJSON {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  metadata: {
    region: string;
    states_count: number;
    total_points: number;
    source_type: string;
  };
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}

export async function fetchLocations(): Promise<LocationItem[]> {
  const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function fetchLocationRisk(locationId: number): Promise<LocationRiskDetail> {
  const res = await fetch(`${API_BASE_URL}/risk/${locationId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch location risk");
  return res.json();
}

export async function fetchRiskMapGeoJSON(): Promise<RiskMapGeoJSON> {
  const res = await fetch(`${API_BASE_URL}/risk/map`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch risk map GeoJSON");
  return res.json();
}

export async function fetchRainfallTrend(locationId?: number): Promise<RainfallTrendResponse> {
  const url = locationId 
    ? `${API_BASE_URL}/rainfall/trend?location_id=${locationId}` 
    : `${API_BASE_URL}/rainfall/trend`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch rainfall trend");
  return res.json();
}

export async function fetchIncidentSummary(): Promise<IncidentSummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/landslides/summary`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch landslide summary");
  return res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE_URL}/alerts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function fetchSystemStatus(): Promise<SystemStatusItem[]> {
  const res = await fetch(`${API_BASE_URL}/dashboard/status`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch system status");
  const data = await res.json();
  return data.items;
}
