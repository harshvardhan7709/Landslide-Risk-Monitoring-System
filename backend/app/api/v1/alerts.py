from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.models import Alert
from app.schemas.schemas import AlertItem

router = APIRouter()

@router.get("", response_model=List[AlertItem])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.status == "ACTIVE").order_by(Alert.id.asc()).all()
    results = []
    for a in alerts:
        sev = a.severity.upper()
        if "VERY HIGH" in sev:
            color = "text-red-500"
            bg = "bg-red-50"
            level_str = "VERY HIGH RISK"
        elif "HIGH" in sev:
            color = "text-orange-500"
            bg = "bg-orange-50"
            level_str = "HIGH RISK"
        elif "MODERATE" in sev:
            color = "text-yellow-500"
            bg = "bg-yellow-50"
            level_str = "MODERATE RISK"
        else:
            color = "text-green-500"
            bg = "bg-green-50"
            level_str = "LOW RISK"

        results.append(
            AlertItem(
                id=a.id,
                level=level_str,
                location=a.location_name,
                state_name=a.state_name,
                time=a.time_str,
                date=a.date_str,
                risk_score=a.risk_score,
                message=a.message,
                color=color,
                bg=bg,
                source_type="DEMO"
            )
        )
    return results

@router.post("/{alert_id}/notify")
def send_alert_notification(
    alert_id: int,
    channel: str = "all", # push, sms, email, all
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Multilingual mock templates
    notifications = {
        "en": f"🚨 EMERGENCY ALERT: {alert.severity} Landslide Hazard at {alert.location_name}. Avoid slope base.",
        "hi": f"🚨 आपातकालीन चेतावनी: {alert.location_name} में {alert.severity} भूस्खलन जोखिम। ढलानों से दूर रहें।",
        "as": f"🚨 জৰুৰীকালীন সতৰ্কবাৰ্তা: {alert.location_name} ত ভূমিস্খলনৰ সতৰ্কতা।",
        "ne": f"🚨 आपतकालीन चेतावनी: {alert.location_name} मा पहिरोको उच्च जोखिम।"
    }

    return {
        "status": "dispatched",
        "alert_id": alert.id,
        "location": alert.location_name,
        "channels": ["Push", "SMS (NDMA Gateway - DEMO)", "Email"],
        "languages_sent": list(notifications.keys()),
        "messages": notifications,
        "recipients_count": 14200,
        "source_type": "DEMO"
    }
