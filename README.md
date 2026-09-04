# AI-Based Early Warning & Landslide Risk Monitoring System – North Eastern Region (NER), India

A full-stack, production-quality disaster-management decision-support platform for monitoring and predicting landslide risks across all 8 North Eastern Region (NER) states of India: **Sikkim, Arunachal Pradesh, Assam, Meghalaya, Mizoram, Nagaland, Manipur, and Tripura**.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide Icons, Recharts (time-series precipitation & donut incidents), MapLibre GL JS + `react-map-gl` (interactive GIS maps).
- **Backend**: FastAPI, Pydantic, SQLAlchemy, GeoAlchemy2, Uvicorn.
- **Database**: PostgreSQL + PostGIS (via Docker) with automatic SQLite local fallback for zero-dependency local development.
- **ML / Risk Engine**: Multi-factor XGBoost/Gradient Boosting architecture with SHAP-style feature attribution breakdown (precipitation, slope gradient, soil moisture, elevation, road proximity, NDVI).
- **GIS Layers**: GeoJSON FeatureCollections representing risk zones, live sensors, road connectivity corridors, and historical landslide inventory points.

---

## 🚀 Quickstart & How to Run

### 1. Backend (FastAPI + Database Engine)
The backend auto-creates all database tables and seeds realistic demo data across all 8 NER states on startup.
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate      # Windows
# or: source venv/bin/activate # Linux/Mac

# Run FastAPI server on port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Live API Endpoint**: `http://localhost:8000/api/v1`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/v1/health`

### 2. Frontend (Next.js Dashboard)
```bash
cd frontend
npm install
npm run dev
```
- **Web Dashboard**: `http://localhost:3000`

---

## 📡 Implemented REST & GeoJSON Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health, mode, and database connection status |
| `GET` | `/api/v1/dashboard/summary` | Real-time KPI summary (24h rain, high risk areas, people at risk, active alerts, incidents) |
| `GET` | `/api/v1/risk/map` | GeoJSON FeatureCollection of risk zones with popup attributes across NER |
| `GET` | `/api/v1/risk/{location_id}` | Detailed geological, meteorological, and risk gauge metrics for specific location |
| `POST`| `/api/v1/risk/predict` | ML inference engine with SHAP feature importance breakdown |
| `GET` | `/api/v1/locations` | List of all monitored locations across the 8 NER states |
| `GET` | `/api/v1/rainfall/trend` | Time series rainfall observations (1h, 24h, 7d, 30d) |
| `GET` | `/api/v1/landslides/summary` | Donut chart incident severity distribution (Very High, High, Moderate, Low) |
| `GET` | `/api/v1/landslides` | Historical landslide inventory (156 records) with state and severity filters |
| `GET` | `/api/v1/alerts` | Active early warning alerts list |
| `POST`| `/api/v1/alerts/{id}/notify`| Multilingual alert broadcast dispatch (English, Hindi, Assamese, Nepali) |
| `GET` | `/api/v1/roads` | Highway and road corridor connectivity statuses (OPEN, RESTRICTED, BLOCKED) |
| `PATCH`| `/api/v1/roads/{id}/status`| Update highway blockage or single-lane clearance status |
| `GET` | `/api/v1/citizen-reports` | Crowdsourced citizen and field officer hazard incidents |
| `POST`| `/api/v1/citizen-reports` | Submit geo-tagged hazard report (Landslide, Crack, Rockfall, Blocked Road) |
| `PATCH`| `/api/v1/citizen-reports/{id}/verify` | Field officer verification workflow |
| `GET` | `/api/v1/sensors` | IoT sensor telemetry array (tilt angle, soil moisture, battery, rainfall rate) |
| `GET` | `/api/v1/emergency/priority` | Multi-criteria disaster emergency response priority matrix (P1 to P4) |

---

## 🧪 Testing the APIs
Run the automated test script to verify all 12 endpoints:
```bash
cd backend
python tests/test_apis.py
```

---

## 🔄 Transitioning from Demo to Live External Feeds
The backend is architected so that simulated providers can be swapped with live data streams:
- **Rainfall**: Connect NASA GPM IMERG or IMD AWS API via `RainfallDataService`.
- **Soil Moisture**: Connect NASA SMAP or physical IoT RS485/LoRaWAN field sensors via `IoTSensorService`.
- **Satellite**: Ingest Copernicus Sentinel-1 SAR interferometry (InSAR) for slope displacement.
- **Road Connectivity**: Ingest live OpenStreetMap / State Highway PWD feeds.
