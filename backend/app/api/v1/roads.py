from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Road
from app.schemas.schemas import RoadItem, RoadStatusUpdate

router = APIRouter()

@router.get("", response_model=List[RoadItem])
def get_roads(db: Session = Depends(get_db)):
    roads = db.query(Road).all()
    return roads

@router.patch("/{road_id}/status", response_model=RoadItem)
def update_road_status(road_id: int, update_data: RoadStatusUpdate, db: Session = Depends(get_db)):
    road = db.query(Road).filter(Road.id == road_id).first()
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")
    
    road.status = update_data.status.upper()
    if update_data.blocked_reason is not None:
        road.blocked_reason = update_data.blocked_reason
    
    db.commit()
    db.refresh(road)
    return road
