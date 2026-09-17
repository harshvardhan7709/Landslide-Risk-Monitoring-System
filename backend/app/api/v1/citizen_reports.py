from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from app.db.session import get_db
from app.models.models import CitizenReport
from app.schemas.schemas import CitizenReportCreate, CitizenReportResponse

router = APIRouter()

@router.get("", response_model=List[CitizenReportResponse])
def get_citizen_reports(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CitizenReport)
    if status:
        query = query.filter(CitizenReport.status.ilike(f"%{status}%"))
    return query.order_by(CitizenReport.created_at.desc()).all()

@router.post("", response_model=CitizenReportResponse)
def submit_citizen_report(report_in: CitizenReportCreate, db: Session = Depends(get_db)):
    count = db.query(CitizenReport).count() + 1
    code = f"CR-NER-2025-{count:03d}"
    
    report = CitizenReport(
        report_code=code,
        hazard_type=report_in.hazard_type,
        description=report_in.description,
        location_name=report_in.location_name,
        state_name=report_in.state_name,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        reporter_name=report_in.reporter_name,
        reporter_phone=report_in.reporter_phone,
        photo_url=report_in.photo_url,
        video_url=report_in.video_url,
        status="Pending Verification",
        source_type="DEMO"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.patch("/{report_id}/verify", response_model=CitizenReportResponse)
def verify_citizen_report(
    report_id: int, 
    status: str = "Verified", 
    verified_by: str = "Field Officer", 
    db: Session = Depends(get_db)
):
    report = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.status = status
    report.verified_by = verified_by
    db.commit()
    db.refresh(report)
    return report
