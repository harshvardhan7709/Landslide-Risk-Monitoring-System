from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.models.models import Location, RainfallObservation
from app.schemas.schemas import RainfallTrendResponse, RainfallTrendItem

router = APIRouter()

@router.get("/trend", response_model=RainfallTrendResponse)
def get_rainfall_trend(
    location_id: Optional[int] = None,
    period: str = Query("7d", pattern="^(7d|30d|90d)$"),
    db: Session = Depends(get_db)
):
    if location_id:
        loc = db.query(Location).filter(Location.id == location_id).first()
    else:
        loc = db.query(Location).filter(Location.name == "Gangtok").first()
    
    if not loc:
        loc = db.query(Location).first()
    
    if not loc:
        return RainfallTrendResponse(
            location_id=1,
            location_name="Gangtok, Sikkim",
            unit="mm",
            trends=[
                RainfallTrendItem(date="18 May", h1=10.0, h24=85.0, d7=200.0),
                RainfallTrendItem(date="19 May", h1=12.0, h24=140.0, d7=310.0),
                RainfallTrendItem(date="20 May", h1=5.0, h24=160.0, d7=390.0),
                RainfallTrendItem(date="21 May", h1=8.0, h24=140.0, d7=420.0),
                RainfallTrendItem(date="22 May", h1=15.0, h24=160.0, d7=430.0),
                RainfallTrendItem(date="23 May", h1=18.0, h24=160.0, d7=370.0),
                RainfallTrendItem(date="24 May", h1=10.0, h24=150.0, d7=324.8),
            ],
            source_type="DEMO"
        )

    observations = (
        db.query(RainfallObservation)
        .filter(RainfallObservation.location_id == loc.id)
        .order_by(RainfallObservation.id.asc())
        .limit(7 if period == "7d" else (30 if period == "30d" else 90))
        .all()
    )

    trend_items = []
    for obs in observations:
        trend_items.append(
            RainfallTrendItem(
                date=obs.recorded_date,
                h1=obs.rainfall_1h,
                h24=obs.rainfall_24h,
                d7=obs.rainfall_7d
            )
        )

    return RainfallTrendResponse(
        location_id=loc.id,
        location_name=f"{loc.name}, {loc.state_name}",
        unit="mm",
        trends=trend_items,
        source_type="DEMO"
    )

@router.get("/forecast")
def get_rainfall_forecast(location_id: Optional[int] = None, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return {
        "status": "success",
        "provider": "IMD-WRF (Simulated DEMO)",
        "forecast_period": "72 Hours",
        "intervals": [
            {"day": "Day +1", "expected_rain_mm": 45.0, "risk_impact": "Elevated"},
            {"day": "Day +2", "expected_rain_mm": 68.5, "risk_impact": "Critical"},
            {"day": "Day +3", "expected_rain_mm": 32.0, "risk_impact": "Moderate"}
        ],
        "source_type": "DEMO"
    }
