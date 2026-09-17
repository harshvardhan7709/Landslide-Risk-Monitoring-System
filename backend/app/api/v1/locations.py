from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.models import Location, State
from app.schemas.schemas import LocationBase

router = APIRouter()

@router.get("", response_model=List[LocationBase])
def get_locations(
    state: Optional[str] = None,
    min_risk: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Location)
    if state:
        query = query.filter(Location.state_name.ilike(f"%{state}%"))
    if min_risk is not None:
        query = query.filter(Location.current_risk_score >= min_risk)
    
    locations = query.order_by(Location.current_risk_score.desc()).all()
    return locations

@router.get("/{location_id}", response_model=LocationBase)
def get_location_by_id(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return loc
