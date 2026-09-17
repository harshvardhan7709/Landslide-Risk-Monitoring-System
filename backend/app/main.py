from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.services.seed_service import seed_database
from app.api.v1 import (
    dashboard,
    locations,
    risk,
    rainfall,
    landslides,
    alerts,
    roads,
    citizen_reports,
    sensors,
    emergency,
    seed
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Auto-seed initial demo dataset if empty
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Based Early Warning & Landslide Risk Monitoring System – North Eastern Region (NER), India",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(locations.router, prefix="/api/v1/locations", tags=["Locations"])
app.include_router(risk.router, prefix="/api/v1/risk", tags=["Risk & GIS"])
app.include_router(rainfall.router, prefix="/api/v1/rainfall", tags=["Rainfall"])
app.include_router(landslides.router, prefix="/api/v1/landslides", tags=["Landslide Inventory"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(roads.router, prefix="/api/v1/roads", tags=["Road Connectivity"])
app.include_router(citizen_reports.router, prefix="/api/v1/citizen-reports", tags=["Citizen Reporting"])
app.include_router(sensors.router, prefix="/api/v1/sensors", tags=["IoT Sensors"])
app.include_router(emergency.router, prefix="/api/v1/emergency", tags=["Emergency Prioritization"])
app.include_router(seed.router, prefix="/api/v1/seed", tags=["Admin & Seed"])

@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "api_v1": "/api/v1",
        "health": "/api/v1/health"
    }

@app.get("/api/v1", tags=["Root"])
def api_v1_root():
    return {
        "message": "AI-Based Landslide Risk Monitoring API v1",
        "endpoints": {
            "health": "/api/v1/health",
            "dashboard_summary": "/api/v1/dashboard/summary",
            "locations": "/api/v1/locations",
            "risk_map_geojson": "/api/v1/risk/map",
            "rainfall_trend": "/api/v1/rainfall/trend",
            "landslides": "/api/v1/landslides",
            "alerts": "/api/v1/alerts",
            "roads": "/api/v1/roads",
            "citizen_reports": "/api/v1/citizen-reports",
            "sensors": "/api/v1/sensors",
            "emergency_priority": "/api/v1/emergency/priority",
            "predict_risk": "/api/v1/risk/predict"
        }
    }

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "AI-Based Early Warning & Landslide Risk Monitoring System (NER)",
        "mode": settings.DATA_MODE,
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
