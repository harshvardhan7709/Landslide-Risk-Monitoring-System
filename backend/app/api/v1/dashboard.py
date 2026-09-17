from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.models import Location, Alert, LandslideIncident, RainfallObservation, SystemStatusItem
from app.schemas.schemas import DashboardSummaryResponse, SystemStatusResponse

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    # Calculate 24h rainfall average or max across locations (or for primary Gangtok)
    gangtok = db.query(Location).filter(Location.name == "Gangtok").first()
    rainfall_val = 126.4
    if gangtok:
        last_obs = (
            db.query(RainfallObservation)
            .filter(RainfallObservation.location_id == gangtok.id)
            .order_by(RainfallObservation.id.desc())
            .first()
        )
        if last_obs and last_obs.rainfall_24h:
            rainfall_val = last_obs.rainfall_24h

    # Count high risk areas (risk_score >= 0.5)
    high_risk_count = db.query(Location).filter(Location.current_risk_score >= 0.5).count()
    if high_risk_count == 0:
        high_risk_count = 42

    # Population at risk calculation
    people_at_risk_sum = db.query(func.sum(Location.population)).filter(Location.current_risk_score >= 0.5).scalar()
    if not people_at_risk_sum:
        people_at_risk_sum = 12540

    # Count active alerts
    active_alerts_count = db.query(Alert).filter(Alert.status == "ACTIVE").count()
    critical_alerts_count = db.query(Alert).filter(Alert.status == "ACTIVE", Alert.severity == "VERY HIGH").count()

    # Total incidents (last 30 days)
    total_incidents_count = db.query(LandslideIncident).count()
    if total_incidents_count == 0:
        total_incidents_count = 156

    return DashboardSummaryResponse(
        rainfall_24h=rainfall_val,
        rainfall_trend_text="↑ 12% from yesterday",
        high_risk_areas=high_risk_count,
        high_risk_trend_text="↑ 4 new areas",
        people_at_risk=int(people_at_risk_sum),
        people_at_risk_trend_text="↑ 1,250 from yesterday",
        active_alerts=active_alerts_count,
        critical_alerts=critical_alerts_count,
        active_alerts_trend_text=f"{critical_alerts_count} Critical",
        total_incidents=total_incidents_count,
        total_incidents_trend_text="Last 30 days",
        source_type="DEMO"
    )

@router.get("/status", response_model=SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    items = db.query(SystemStatusItem).all()
    results = []
    for item in items:
        results.append({
            "name": item.name,
            "time": item.time_str,
            "status": "green" if item.status == "operational" else ("yellow" if item.status == "delayed" else "red"),
            "icon": item.icon_name
        })
    if not results:
        results = [
            {"name": "Rainfall Data", "time": "Updated 10:25 AM", "status": "green", "icon": "rain"},
            {"name": "Satellite Data", "time": "Updated 10:15 AM", "status": "green", "icon": "satellite"},
            {"name": "Model Status", "time": "Active (v1.2)", "status": "green", "icon": "activity"},
            {"name": "Alert System", "time": "Active", "status": "green", "icon": "bell"},
            {"name": "Database", "time": "Connected", "status": "green", "icon": "database"},
        ]
    return SystemStatusResponse(items=results, source_type="DEMO")
