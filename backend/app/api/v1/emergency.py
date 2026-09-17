from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.models import Location, Road

router = APIRouter()

@router.get("/priority")
def get_emergency_priorities(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    locations = db.query(Location).order_by(Location.current_risk_score.desc()).all()
    priorities = []

    for loc in locations:
        score = loc.current_risk_score
        pop = loc.population
        
        # Priority logic
        if score >= 0.75 and pop > 50000:
            p_code = "P1"
            p_label = "Priority 1 (Critical Emergency)"
            p_action = "Deploy SDRF/NDRF, activate evacuation corridors, restrict highway transit."
        elif score >= 0.60 or (score >= 0.50 and pop > 80000):
            p_code = "P2"
            p_label = "Priority 2 (High Readiness)"
            p_action = "Stage earthmoving equipment, issue targeted cell broadcast, monitor culverts."
        elif score >= 0.35:
            p_code = "P3"
            p_label = "Priority 3 (Elevated Vigilance)"
            p_action = "Continuous sensor polling, notify district disaster control room."
        else:
            p_code = "P4"
            p_label = "Priority 4 (Standard Monitoring)"
            p_action = "Routine data collection and rain gauge logging."

        priorities.append({
            "location": f"{loc.name}, {loc.state_name}",
            "risk_score": loc.current_risk_score,
            "risk_level": loc.current_risk_level,
            "population_exposed": loc.population,
            "roads_affected": "NH-10 Highway Corridor" if "Sikkim" in loc.state_name else "Inter-District Arterial",
            "critical_infrastructure": "Substation, District Hospital, Ridge Bridge",
            "priority": p_code,
            "priority_label": p_label,
            "recommended_action": p_action,
            "source_type": "DEMO"
        })

    return priorities
