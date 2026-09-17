from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.models import IoTSensor

router = APIRouter()

@router.get("")
def get_iot_sensors(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    sensors = db.query(IoTSensor).all()
    return [
        {
            "id": s.id,
            "sensor_code": s.sensor_code,
            "name": s.name,
            "location_id": s.location_id,
            "latitude": s.latitude,
            "longitude": s.longitude,
            "status": s.status,
            "battery_level": s.battery_level,
            "tilt_angle": s.tilt_angle,
            "soil_moisture": s.soil_moisture,
            "rainfall_rate": s.rainfall_rate,
            "last_seen": s.last_seen.strftime("%H:%M:%S UTC"),
            "source_type": s.source_type
        }
        for s in sensors
    ]
