from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import datetime

class LocationBase(BaseModel):
    id: int
    name: str
    state_name: str
    district_name: Optional[str] = None
    latitude: float
    longitude: float
    elevation: float
    slope: float
    aspect: Optional[str] = None
    soil_type: str
    land_cover: str
    soil_moisture: float
    population: int
    current_risk_score: float
    current_risk_level: str
    warning_message: Optional[str] = None
    source_type: str = "DEMO"

    class Config:
        from_attributes = True

class DashboardSummaryResponse(BaseModel):
    rainfall_24h: float
    rainfall_trend_text: str
    high_risk_areas: int
    high_risk_trend_text: str
    people_at_risk: int
    people_at_risk_trend_text: str
    active_alerts: int
    critical_alerts: int
    active_alerts_trend_text: str
    total_incidents: int
    total_incidents_trend_text: str
    source_type: str = "DEMO"

class LocationRiskDetailResponse(BaseModel):
    id: int
    name: str
    state_name: str
    risk_score: float
    risk_level: str
    rainfall_24h: float
    rainfall_7d: float
    slope: float
    elevation: float
    soil_type: str
    land_cover: str
    soil_moisture: float
    warning_message: str
    source_type: str = "DEMO"

class RainfallTrendItem(BaseModel):
    date: str
    h1: float
    h24: float
    d7: float

class RainfallTrendResponse(BaseModel):
    location_id: int
    location_name: str
    unit: str = "mm"
    trends: List[RainfallTrendItem]
    source_type: str = "DEMO"

class IncidentCategoryCount(BaseModel):
    name: str
    value: int
    color: str
    percent: str

class IncidentSummaryResponse(BaseModel):
    total_30d: int
    categories: List[IncidentCategoryCount]
    source_type: str = "DEMO"

class AlertItem(BaseModel):
    id: int
    level: str
    location: str
    state_name: str
    time: str
    date: str
    risk_score: float
    message: str
    color: str
    bg: str
    source_type: str = "DEMO"

class SystemStatusResponse(BaseModel):
    items: List[Dict[str, Any]]
    source_type: str = "DEMO"

class RoadItem(BaseModel):
    id: int
    name: str
    road_number: str
    state_name: str
    status: str # OPEN, RESTRICTED, BLOCKED, UNKNOWN
    start_point: Optional[str] = None
    end_point: Optional[str] = None
    blocked_reason: Optional[str] = None
    latitude_start: float
    longitude_start: float
    latitude_end: float
    longitude_end: float
    source_type: str = "DEMO"

class RoadStatusUpdate(BaseModel):
    status: str
    blocked_reason: Optional[str] = None

class CitizenReportCreate(BaseModel):
    hazard_type: str
    description: str
    location_name: str
    state_name: str
    latitude: float
    longitude: float
    reporter_name: Optional[str] = "Citizen Reporter"
    reporter_phone: Optional[str] = None
    photo_url: Optional[str] = None
    video_url: Optional[str] = None

class CitizenReportResponse(BaseModel):
    id: int
    report_code: str
    hazard_type: str
    description: str
    location_name: str
    state_name: str
    latitude: float
    longitude: float
    status: str
    photo_url: Optional[str] = None
    video_url: Optional[str] = None
    created_at: datetime.datetime
    verified_by: Optional[str] = None
    source_type: str = "DEMO"

    class Config:
        from_attributes = True

class RiskPredictRequest(BaseModel):
    location: Optional[str] = "Gangtok, Sikkim"
    latitude: float
    longitude: float
    rainfall_1h: float
    rainfall_6h: float = 18.0
    rainfall_24h: float
    rainfall_72h: float = 240.0
    soil_moisture: float
    elevation: float
    slope: float
    aspect: Optional[str] = "North-East"
    ndvi: float = 0.65
    land_cover: Optional[str] = "Forest"
    historical_landslide_density: float = 0.45
    distance_to_road: float = 120.0 # meters

class ContributingFactor(BaseModel):
    feature: str
    importance: float # percentage 0 - 100
    description: str

class RiskPredictResponse(BaseModel):
    risk_score: float
    risk_level: str
    confidence: float
    contributing_factors: List[ContributingFactor]
    model_version: str = "XGBoost-NER-v1.2.0-DEMO"
    source_type: str = "DEMO"
