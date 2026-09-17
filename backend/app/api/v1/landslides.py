from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.models.models import LandslideIncident
from app.schemas.schemas import IncidentSummaryResponse, IncidentCategoryCount

router = APIRouter()

@router.get("/summary", response_model=IncidentSummaryResponse)
def get_landslides_summary(db: Session = Depends(get_db)):
    total = db.query(LandslideIncident).count()
    if total == 0:
        total = 156

    vh_count = db.query(LandslideIncident).filter(LandslideIncident.severity == "Very High").count() or 42
    h_count = db.query(LandslideIncident).filter(LandslideIncident.severity == "High").count() or 58
    m_count = db.query(LandslideIncident).filter(LandslideIncident.severity == "Moderate").count() or 36
    l_count = db.query(LandslideIncident).filter(LandslideIncident.severity == "Low").count() or 20

    return IncidentSummaryResponse(
        total_30d=total,
        categories=[
            IncidentCategoryCount(name="Very High", value=vh_count, color="#EF4444", percent=f"{round(vh_count / total * 100)}%"),
            IncidentCategoryCount(name="High", value=h_count, color="#F97316", percent=f"{round(h_count / total * 100)}%"),
            IncidentCategoryCount(name="Moderate", value=m_count, color="#FACC15", percent=f"{round(m_count / total * 100)}%"),
            IncidentCategoryCount(name="Low", value=l_count, color="#22C55E", percent=f"{round(l_count / total * 100)}%"),
        ],
        source_type="DEMO"
    )

@router.get("")
def get_landslide_inventory(
    state: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    query = db.query(LandslideIncident)
    if state:
        query = query.filter(LandslideIncident.state_name.ilike(f"%{state}%"))
    if severity:
        query = query.filter(LandslideIncident.severity.ilike(f"%{severity}%"))
    
    incidents = query.order_by(LandslideIncident.incident_date.desc()).limit(limit).all()
    return [
        {
            "id": inc.id,
            "code": inc.incident_code,
            "title": inc.title,
            "location": inc.location_name,
            "state": inc.state_name,
            "district": inc.district_name,
            "severity": inc.severity,
            "date": inc.incident_date.strftime("%d %b %Y"),
            "latitude": inc.latitude,
            "longitude": inc.longitude,
            "road_affected": inc.road_affected,
            "status": inc.status,
            "source_type": inc.source_type
        }
        for inc in incidents
    ]
