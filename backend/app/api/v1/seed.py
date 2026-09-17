from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.seed_service import seed_database

router = APIRouter()

@router.post("")
def trigger_seed(db: Session = Depends(get_db)):
    result = seed_database(db)
    return result
