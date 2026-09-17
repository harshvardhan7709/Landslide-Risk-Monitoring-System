from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.db.session import get_db
from app.models.models import Location, RainfallObservation, Alert
from app.schemas.schemas import LocationRiskDetailResponse, RiskPredictRequest, RiskPredictResponse
from app.services.risk_service import risk_engine

router = APIRouter()

# Realistic NER State Susceptibility Polygons matching the satellite heat map in reference image
NER_RISK_POLYGONS = [
    # Arunachal Pradesh (High / Very High Northern & Western Belts)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [91.6, 27.0], [92.5, 28.0], [94.0, 29.2], [96.0, 29.0], 
                [97.3, 28.2], [96.5, 27.2], [95.0, 27.5], [93.5, 26.9], 
                [92.0, 26.8], [91.6, 27.0]
            ]]
        },
        "properties": {
            "zone_id": "AP-ZONE-01",
            "name": "Arunachal High Altitude Ridge",
            "risk_level": "Very High",
            "fill_color": "#EF4444",
            "fill_opacity": 0.45,
            "stroke_color": "#B91C1C",
            "risk_score": 0.85
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [92.0, 26.8], [93.5, 26.9], [95.0, 27.5], [95.5, 27.0],
                [94.2, 26.5], [93.0, 26.4], [92.0, 26.8]
            ]]
        },
        "properties": {
            "zone_id": "AP-ZONE-02",
            "name": "Sub-Himalayan Foothills",
            "risk_level": "High",
            "fill_color": "#F97316",
            "fill_opacity": 0.45,
            "stroke_color": "#C2410C",
            "risk_score": 0.72
        }
    },
    # Assam (Brahmaputra Valley Low Risk & Karbi Anglong/Dima Hasao Moderate/High)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [89.8, 26.1], [90.8, 26.6], [92.5, 26.8], [94.5, 27.3],
                [95.5, 27.4], [95.2, 26.8], [93.8, 26.3], [92.0, 26.0],
                [90.5, 25.9], [89.8, 26.1]
            ]]
        },
        "properties": {
            "zone_id": "AS-ZONE-01",
            "name": "Brahmaputra Plains Basin",
            "risk_level": "Low",
            "fill_color": "#22C55E",
            "fill_opacity": 0.4,
            "stroke_color": "#15803D",
            "risk_score": 0.18
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [92.6, 25.4], [93.5, 26.2], [93.8, 25.8], [93.2, 25.0], [92.6, 25.4]
            ]]
        },
        "properties": {
            "zone_id": "AS-ZONE-02",
            "name": "Karbi Anglong & Dima Hasao Hills",
            "risk_level": "Moderate",
            "fill_color": "#FACC15",
            "fill_opacity": 0.45,
            "stroke_color": "#CA8A04",
            "risk_score": 0.44
        }
    },
    # Meghalaya (Shillong Plateau & South Escarpment)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [90.0, 25.2], [91.0, 25.7], [92.5, 25.6], [92.8, 25.1],
                [91.5, 25.0], [90.0, 25.2]
            ]]
        },
        "properties": {
            "zone_id": "ML-ZONE-01",
            "name": "East/West Khasi Hills Escarpment",
            "risk_level": "High",
            "fill_color": "#F97316",
            "fill_opacity": 0.45,
            "stroke_color": "#EA580C",
            "risk_score": 0.65
        }
    },
    # Nagaland (High Risk Mountain Corridors)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [93.4, 25.6], [94.2, 26.3], [95.2, 27.0], [95.5, 26.5],
                [94.6, 25.8], [93.8, 25.4], [93.4, 25.6]
            ]]
        },
        "properties": {
            "zone_id": "NL-ZONE-01",
            "name": "Nagaland Ridge & NH-29 Corridor",
            "risk_level": "High",
            "fill_color": "#F97316",
            "fill_opacity": 0.45,
            "stroke_color": "#C2410C",
            "risk_score": 0.74
        }
    },
    # Manipur (Imphal Valley Low / Surrounding Ranges Very High)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [93.1, 24.2], [93.6, 25.3], [94.5, 25.5], [94.7, 24.5],
                [93.9, 23.9], [93.1, 24.2]
            ]]
        },
        "properties": {
            "zone_id": "MN-ZONE-01",
            "name": "Manipur Western & Eastern Ridges",
            "risk_level": "Very High",
            "fill_color": "#EF4444",
            "fill_opacity": 0.45,
            "stroke_color": "#B91C1C",
            "risk_score": 0.81
        }
    },
    # Mizoram (Lushai Hills High Risk)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [92.3, 22.0], [92.6, 24.2], [93.4, 24.1], [93.5, 22.4],
                [92.8, 21.9], [92.3, 22.0]
            ]]
        },
        "properties": {
            "zone_id": "MZ-ZONE-01",
            "name": "Mizoram Longitudinal Ridge Belts",
            "risk_level": "Very High",
            "fill_color": "#EF4444",
            "fill_opacity": 0.45,
            "stroke_color": "#B91C1C",
            "risk_score": 0.78
        }
    },
    # Tripura (Low-Moderate Hills)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [91.1, 23.0], [91.5, 24.5], [92.3, 24.4], [92.2, 23.1], [91.1, 23.0]
            ]]
        },
        "properties": {
            "zone_id": "TR-ZONE-01",
            "name": "Tripura Synclinal Valleys",
            "risk_level": "Low",
            "fill_color": "#22C55E",
            "fill_opacity": 0.4,
            "stroke_color": "#16A34A",
            "risk_score": 0.20
        }
    },
    # Sikkim (Teesta Gorge Critical Belt)
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [88.0, 27.1], [88.2, 28.0], [88.8, 28.1], [88.9, 27.2], [88.0, 27.1]
            ]]
        },
        "properties": {
            "zone_id": "SK-ZONE-01",
            "name": "Sikkim Teesta Alpine Valley",
            "risk_level": "Very High",
            "fill_color": "#EF4444",
            "fill_opacity": 0.5,
            "stroke_color": "#991B1B",
            "risk_score": 0.88
        }
    }
]

@router.get("/map")
def get_risk_map_geojson(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns complete GeoJSON FeatureCollection for the interactive GIS map.
    Includes both Point locations (sensors/hotspots) and Polygon zones (heat susceptibility).
    """
    locations = db.query(Location).all()
    point_features = []

    for loc in locations:
        if loc.current_risk_score >= 0.75:
            color = "#EF4444"
            level = "Very High"
        elif loc.current_risk_score >= 0.50:
            color = "#F97316"
            level = "High"
        elif loc.current_risk_score >= 0.25:
            color = "#FACC15"
            level = "Moderate"
        else:
            color = "#22C55E"
            level = "Low"

        last_obs = db.query(RainfallObservation).filter(RainfallObservation.location_id == loc.id).order_by(RainfallObservation.id.desc()).first()
        rf_24h = last_obs.rainfall_24h if last_obs else 126.4
        rf_7d = last_obs.rainfall_7d if last_obs else 324.8

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [loc.longitude, loc.latitude]
            },
            "properties": {
                "id": loc.id,
                "name": loc.name,
                "state": loc.state_name,
                "district": loc.district_name or loc.state_name,
                "risk_score": loc.current_risk_score,
                "risk_level": level,
                "color": color,
                "rainfall_24h": rf_24h,
                "rainfall_7d": rf_7d,
                "slope": loc.slope,
                "elevation": loc.elevation,
                "soil_type": loc.soil_type,
                "land_cover": loc.land_cover,
                "soil_moisture": loc.soil_moisture,
                "warning_message": loc.warning_message or f"Landslide susceptibility index: {loc.current_risk_score}",
                "is_hazard_alert": loc.current_risk_score >= 0.60,
                "source_type": "DEMO"
            }
        }
        point_features.append(feature)

    all_features = NER_RISK_POLYGONS + point_features

    return {
        "type": "FeatureCollection",
        "features": all_features,
        "polygons": NER_RISK_POLYGONS,
        "points": point_features,
        "metadata": {
            "region": "North Eastern Region (NER), India",
            "states_count": 8,
            "total_points": len(point_features),
            "total_polygons": len(NER_RISK_POLYGONS),
            "source_type": "DEMO"
        }
    }

@router.get("/{location_id}", response_model=LocationRiskDetailResponse)
def get_location_risk_detail(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    
    last_obs = db.query(RainfallObservation).filter(RainfallObservation.location_id == loc.id).order_by(RainfallObservation.id.desc()).first()
    rf_24h = last_obs.rainfall_24h if last_obs else 126.4
    rf_7d = last_obs.rainfall_7d if last_obs else 324.8

    return LocationRiskDetailResponse(
        id=loc.id,
        name=loc.name,
        state_name=loc.state_name,
        risk_score=loc.current_risk_score,
        risk_level=loc.current_risk_level,
        rainfall_24h=rf_24h,
        rainfall_7d=rf_7d,
        slope=loc.slope,
        elevation=loc.elevation,
        soil_type=loc.soil_type,
        land_cover=loc.land_cover,
        soil_moisture=loc.soil_moisture,
        warning_message=loc.warning_message or "Landslide risk calculated based on live sensors and meteorological models.",
        source_type="DEMO"
    )

@router.post("/predict", response_model=RiskPredictResponse)
def predict_landslide_risk(request: RiskPredictRequest):
    return risk_engine.predict(request)
