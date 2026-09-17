import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    districts = relationship("District", back_populates="state", cascade="all, delete-orphan")
    locations = relationship("Location", back_populates="state")

class District(Base):
    __tablename__ = "districts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    state_id = Column(Integer, ForeignKey("states.id"), nullable=False)
    state = relationship("State", back_populates="districts")
    locations = relationship("Location", back_populates="district")

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    state_name = Column(String(100), nullable=False)
    district_name = Column(String(100), nullable=True)
    state_id = Column(Integer, ForeignKey("states.id"), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=1000.0) # meters
    slope = Column(Float, default=30.0)       # degrees
    aspect = Column(String(50), default="North-East")
    soil_type = Column(String(100), default="Clay Loam")
    land_cover = Column(String(100), default="Dense Forest")
    soil_moisture = Column(Float, default=65.0) # percentage
    population = Column(Integer, default=15000)
    
    # Current risk summary
    current_risk_score = Column(Float, default=0.5)
    current_risk_level = Column(String(50), default="Moderate") # Low, Moderate, High, Very High
    warning_message = Column(Text, nullable=True)
    source_type = Column(String(50), default="DEMO")
    
    state = relationship("State", back_populates="locations")
    district = relationship("District", back_populates="locations")
    rainfall_records = relationship("RainfallObservation", back_populates="location", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="location")
    sensors = relationship("IoTSensor", back_populates="location")

class RainfallObservation(Base):
    __tablename__ = "rainfall_observations"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    recorded_date = Column(String(50), nullable=False) # e.g. "2025-05-24" or "24 May"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    rainfall_1h = Column(Float, default=0.0)  # mm
    rainfall_24h = Column(Float, default=0.0) # mm
    rainfall_7d = Column(Float, default=0.0)  # mm
    rainfall_30d = Column(Float, default=0.0) # mm
    source_type = Column(String(50), default="DEMO")
    
    location = relationship("Location", back_populates="rainfall_records")

class LandslideIncident(Base):
    __tablename__ = "landslide_incidents"
    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(50), unique=True, index=True)
    title = Column(String(200), nullable=False)
    location_name = Column(String(150), nullable=False)
    state_name = Column(String(100), nullable=False)
    district_name = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    incident_date = Column(DateTime, default=datetime.datetime.utcnow)
    severity = Column(String(50), nullable=False) # Low, Moderate, High, Very High
    status = Column(String(50), default="RECORDED") # RECORDED, VERIFIED, RESOLVED
    road_affected = Column(String(150), nullable=True)
    casualties = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    source_type = Column(String(50), default="DEMO")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    location_name = Column(String(150), nullable=False)
    state_name = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False) # VERY HIGH, HIGH, MODERATE, LOW
    risk_score = Column(Float, nullable=False)
    time_str = Column(String(50), nullable=False) # e.g. "10:20 AM"
    date_str = Column(String(50), nullable=False) # e.g. "24 May 2025"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED
    source = Column(String(100), default="AI Early Warning Engine")
    source_type = Column(String(50), default="DEMO")
    
    location = relationship("Location", back_populates="alerts")

class Road(Base):
    __tablename__ = "roads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    road_number = Column(String(50), nullable=False)
    state_name = Column(String(100), nullable=False)
    status = Column(String(50), default="OPEN") # OPEN, RESTRICTED, BLOCKED, UNKNOWN
    start_point = Column(String(100), nullable=True)
    end_point = Column(String(100), nullable=True)
    blocked_reason = Column(Text, nullable=True)
    latitude_start = Column(Float, nullable=False)
    longitude_start = Column(Float, nullable=False)
    latitude_end = Column(Float, nullable=False)
    longitude_end = Column(Float, nullable=False)
    geometry_geojson = Column(JSON, nullable=True)
    source_type = Column(String(50), default="DEMO")

class CitizenReport(Base):
    __tablename__ = "citizen_reports"
    id = Column(Integer, primary_key=True, index=True)
    report_code = Column(String(50), unique=True, index=True)
    hazard_type = Column(String(100), nullable=False) # Landslide, Crack, Slope movement, Falling rocks, Blocked road, Flooding, Other
    description = Column(Text, nullable=False)
    location_name = Column(String(150), nullable=False)
    state_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(50), default="Pending Verification") # Pending Verification, Approved, Rejected, Verified, Resolved
    photo_url = Column(String(255), nullable=True)
    video_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reporter_name = Column(String(100), default="Citizen Reporter")
    reporter_phone = Column(String(50), nullable=True)
    verified_by = Column(String(100), nullable=True)
    source_type = Column(String(50), default="DEMO")

class IoTSensor(Base):
    __tablename__ = "iot_sensors"
    id = Column(Integer, primary_key=True, index=True)
    sensor_code = Column(String(50), unique=True, index=True) # SENSOR-SK-001
    name = Column(String(100), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(50), default="ONLINE") # ONLINE, OFFLINE, MAINTENANCE, ALERT
    battery_level = Column(Float, default=90.0)   # %
    tilt_angle = Column(Float, default=1.2)       # degrees
    soil_moisture = Column(Float, default=70.0)   # %
    rainfall_rate = Column(Float, default=5.0)    # mm/hr
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
    source_type = Column(String(50), default="DEMO")
    
    location = relationship("Location", back_populates="sensors")

class SystemStatusItem(Base):
    __tablename__ = "system_status"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    time_str = Column(String(100), nullable=False) # e.g. "Updated 10:25 AM" or "Active"
    status = Column(String(50), default="operational") # operational, delayed, offline
    icon_name = Column(String(50), default="activity")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    source_type = Column(String(50), default="DEMO")
