from sqlalchemy.orm import Session
from app.models.models import (
    State, District, Location, RainfallObservation,
    LandslideIncident, Alert, Road, CitizenReport,
    IoTSensor, SystemStatusItem
)
import datetime

def seed_database(db: Session):
    # Check if already seeded
    if db.query(State).count() > 0:
        return {"status": "already_seeded", "message": "Database already contains seed data."}

    # 1. Seed 8 NER States
    states_data = [
        {"name": "Sikkim", "code": "SK", "center_lat": 27.5330, "center_lon": 88.5122},
        {"name": "Arunachal Pradesh", "code": "AR", "center_lat": 28.2180, "center_lon": 94.7278},
        {"name": "Assam", "code": "AS", "center_lat": 26.2006, "center_lon": 92.9376},
        {"name": "Meghalaya", "code": "ML", "center_lat": 25.4670, "center_lon": 91.3662},
        {"name": "Mizoram", "code": "MZ", "center_lat": 23.1645, "center_lon": 92.9376},
        {"name": "Nagaland", "code": "NL", "center_lat": 26.1584, "center_lon": 94.5624},
        {"name": "Manipur", "code": "MN", "center_lat": 24.6637, "center_lon": 93.9063},
        {"name": "Tripura", "code": "TR", "center_lat": 23.9408, "center_lon": 91.9882},
    ]

    state_objs = {}
    for s_info in states_data:
        st = State(**s_info)
        db.add(st)
        state_objs[s_info["name"]] = st
    db.commit()

    # 2. Seed Key Districts
    districts_data = [
        {"name": "East Sikkim", "state_name": "Sikkim"},
        {"name": "North Sikkim", "state_name": "Sikkim"},
        {"name": "West Kameng", "state_name": "Arunachal Pradesh"},
        {"name": "Tawang", "state_name": "Arunachal Pradesh"},
        {"name": "Papum Pare", "state_name": "Arunachal Pradesh"},
        {"name": "Kamrup Metropolitan", "state_name": "Assam"},
        {"name": "Karbi Anglong", "state_name": "Assam"},
        {"name": "Dima Hasao", "state_name": "Assam"},
        {"name": "East Khasi Hills", "state_name": "Meghalaya"},
        {"name": "Champhai", "state_name": "Mizoram"},
        {"name": "Aizawl", "state_name": "Mizoram"},
        {"name": "Kohima", "state_name": "Nagaland"},
        {"name": "Imphal West", "state_name": "Manipur"},
        {"name": "West Tripura", "state_name": "Tripura"},
    ]

    district_objs = {}
    for d_info in districts_data:
        st = state_objs[d_info["state_name"]]
        dist = District(name=d_info["name"], state_id=st.id)
        db.add(dist)
        district_objs[f"{d_info['name']}, {d_info['state_name']}"] = dist
    db.commit()

    # 3. Seed Key Locations with realistic landslide factors
    locations_data = [
        {
            "name": "Gangtok",
            "state_name": "Sikkim",
            "district_name": "East Sikkim",
            "latitude": 27.3389,
            "longitude": 88.6065,
            "elevation": 1650.0,
            "slope": 42.0,
            "aspect": "South-East",
            "soil_type": "Clay Loam",
            "land_cover": "Forest",
            "soil_moisture": 82.0,
            "population": 100000,
            "current_risk_score": 0.82,
            "current_risk_level": "Very High",
            "warning_message": "Very high landslide susceptibility due to heavy rainfall and steep slope."
        },
        {
            "name": "Mangan",
            "state_name": "Sikkim",
            "district_name": "North Sikkim",
            "latitude": 27.5085,
            "longitude": 88.5283,
            "elevation": 1310.0,
            "slope": 48.0,
            "aspect": "North",
            "soil_type": "Gravelly Sandy Loam",
            "land_cover": "Dense Forest",
            "soil_moisture": 85.0,
            "population": 25000,
            "current_risk_score": 0.78,
            "current_risk_level": "Very High",
            "warning_message": "High water saturation in steep cut slopes along North Sikkim Highway."
        },
        {
            "name": "West Kameng",
            "state_name": "Arunachal Pradesh",
            "district_name": "West Kameng",
            "latitude": 27.2645,
            "longitude": 92.4159,
            "elevation": 1780.0,
            "slope": 39.0,
            "aspect": "South",
            "soil_type": "Sandy Clay Loam",
            "land_cover": "Evergreen Forest",
            "soil_moisture": 76.0,
            "population": 48000,
            "current_risk_score": 0.71,
            "current_risk_level": "High",
            "warning_message": "Heavy 24h precipitation causing mud debris runoff along mountain passes."
        },
        {
            "name": "Itanagar",
            "state_name": "Arunachal Pradesh",
            "district_name": "Papum Pare",
            "latitude": 27.0844,
            "longitude": 93.6053,
            "elevation": 320.0,
            "slope": 28.0,
            "aspect": "East",
            "soil_type": "Alluvial Loam",
            "land_cover": "Urban & Secondary Forest",
            "soil_moisture": 68.0,
            "population": 60000,
            "current_risk_score": 0.58,
            "current_risk_level": "High",
            "warning_message": "Moderate to high vulnerability on newly excavated cut slopes."
        },
        {
            "name": "Champhai",
            "state_name": "Mizoram",
            "district_name": "Champhai",
            "latitude": 23.4735,
            "longitude": 93.3282,
            "elevation": 1390.0,
            "slope": 36.0,
            "aspect": "South-West",
            "soil_type": "Red Silty Loam",
            "land_cover": "Bamboo Forest",
            "soil_moisture": 74.0,
            "population": 35000,
            "current_risk_score": 0.68,
            "current_risk_level": "High",
            "warning_message": "High soil saturation across eastern ridge lines."
        },
        {
            "name": "Aizawl",
            "state_name": "Mizoram",
            "district_name": "Aizawl",
            "latitude": 23.7307,
            "longitude": 92.7173,
            "elevation": 1132.0,
            "slope": 34.0,
            "aspect": "North-West",
            "soil_type": "Shale & Siltstone",
            "land_cover": "Urban Ridge",
            "soil_moisture": 70.0,
            "population": 293000,
            "current_risk_score": 0.62,
            "current_risk_level": "High",
            "warning_message": "Risk of localized slope slips in densely built ridge settlements."
        },
        {
            "name": "Karbi Anglong",
            "state_name": "Assam",
            "district_name": "Karbi Anglong",
            "latitude": 26.0028,
            "longitude": 93.4383,
            "elevation": 450.0,
            "slope": 22.0,
            "aspect": "East",
            "soil_type": "Red Loam",
            "land_cover": "Hilly Shrubland",
            "soil_moisture": 58.0,
            "population": 120000,
            "current_risk_score": 0.44,
            "current_risk_level": "Moderate",
            "warning_message": "Moderate risk of surface erosion and minor boulder displacement."
        },
        {
            "name": "Guwahati",
            "state_name": "Assam",
            "district_name": "Kamrup Metropolitan",
            "latitude": 26.1445,
            "longitude": 91.7362,
            "elevation": 55.0,
            "slope": 18.0,
            "aspect": "South",
            "soil_type": "Alluvial Clay",
            "land_cover": "Urban & Degraded Forest",
            "soil_moisture": 52.0,
            "population": 1116000,
            "current_risk_score": 0.35,
            "current_risk_level": "Moderate",
            "warning_message": "Low to moderate susceptibility in peripheral hillock settlements."
        },
        {
            "name": "Shillong",
            "state_name": "Meghalaya",
            "district_name": "East Khasi Hills",
            "latitude": 25.5788,
            "longitude": 91.8933,
            "elevation": 1525.0,
            "slope": 31.0,
            "aspect": "South-East",
            "soil_type": "Laterite Loam",
            "land_cover": "Pine Forest & Grassland",
            "soil_moisture": 66.0,
            "population": 143000,
            "current_risk_score": 0.54,
            "current_risk_level": "High",
            "warning_message": "Heavy monsoon showers causing softening of upper soil stratum."
        },
        {
            "name": "Kohima",
            "state_name": "Nagaland",
            "district_name": "Kohima",
            "latitude": 25.6751,
            "longitude": 94.1086,
            "elevation": 1444.0,
            "slope": 37.0,
            "aspect": "North-East",
            "soil_type": "Disang Shale",
            "land_cover": "Mixed Forest",
            "soil_moisture": 72.0,
            "population": 100000,
            "current_risk_score": 0.65,
            "current_risk_level": "High",
            "warning_message": "Structural cracks observed on National Highway slope embankments."
        },
        {
            "name": "Imphal",
            "state_name": "Manipur",
            "district_name": "Imphal West",
            "latitude": 24.8170,
            "longitude": 93.9368,
            "elevation": 786.0,
            "slope": 20.0,
            "aspect": "South",
            "soil_type": "Clayey Alluvium",
            "land_cover": "Valley Plains",
            "soil_moisture": 48.0,
            "population": 268000,
            "current_risk_score": 0.22,
            "current_risk_level": "Low",
            "warning_message": "Low risk in valley floor; surrounding hills under continuous monitoring."
        },
        {
            "name": "Agartala",
            "state_name": "Tripura",
            "district_name": "West Tripura",
            "latitude": 23.8315,
            "longitude": 91.2868,
            "elevation": 15.0,
            "slope": 12.0,
            "aspect": "West",
            "soil_type": "Sandy Clay Loam",
            "land_cover": "Plains & Riverine",
            "soil_moisture": 42.0,
            "population": 400000,
            "current_risk_score": 0.15,
            "current_risk_level": "Low",
            "warning_message": "Normal conditions; no immediate slope instability warnings."
        }
    ]

    location_objs = {}
    for loc_data in locations_data:
        st = state_objs.get(loc_data["state_name"])
        loc = Location(
            **loc_data,
            state_id=st.id if st else None
        )
        db.add(loc)
        location_objs[loc.name] = loc
    db.commit()

    # 4. Seed Rainfall Trend Observations for Gangtok (matching exact reference numbers)
    gangtok = location_objs["Gangtok"]
    rainfall_series = [
        {"date": "18 May", "h1": 10.0, "h24": 85.0, "d7": 200.0, "d30": 410.0},
        {"date": "19 May", "h1": 12.0, "h24": 140.0, "d7": 310.0, "d30": 460.0},
        {"date": "20 May", "h1": 5.0, "h24": 160.0, "d7": 390.0, "d30": 510.0},
        {"date": "21 May", "h1": 8.0, "h24": 140.0, "d7": 420.0, "d30": 530.0},
        {"date": "22 May", "h1": 15.0, "h24": 160.0, "d7": 430.0, "d30": 560.0},
        {"date": "23 May", "h1": 18.0, "h24": 160.0, "d7": 370.0, "d30": 580.0},
        {"date": "24 May", "h1": 10.0, "h24": 150.0, "d7": 324.8, "d30": 610.0},
    ]
    for r_entry in rainfall_series:
        ro = RainfallObservation(
            location_id=gangtok.id,
            recorded_date=r_entry["date"],
            rainfall_1h=r_entry["h1"],
            rainfall_24h=r_entry["h24"],
            rainfall_7d=r_entry["d7"],
            rainfall_30d=r_entry["d30"],
            source_type="DEMO"
        )
        db.add(ro)

    # Seed observations for other locations
    for loc_name, loc in location_objs.items():
        if loc_name != "Gangtok":
            factor = loc.current_risk_score
            for day_idx, day_name in enumerate(["18 May", "19 May", "20 May", "21 May", "22 May", "23 May", "24 May"]):
                ro = RainfallObservation(
                    location_id=loc.id,
                    recorded_date=day_name,
                    rainfall_1h=round(5.0 * factor + (day_idx % 3) * 2, 1),
                    rainfall_24h=round(100.0 * factor + day_idx * 5, 1),
                    rainfall_7d=round(240.0 * factor + day_idx * 15, 1),
                    rainfall_30d=round(400.0 * factor + day_idx * 20, 1),
                    source_type="DEMO"
                )
                db.add(ro)
    db.commit()

    # 5. Seed Alerts (Matching exact reference image)
    alerts_data = [
        {
            "location_name": "Gangtok, Sikkim",
            "state_name": "Sikkim",
            "severity": "VERY HIGH",
            "risk_score": 0.82,
            "time_str": "10:20 AM",
            "date_str": "24 May 2025",
            "message": "Critical slope saturation threshold breached in East Sikkim hillslopes. Evacuate active debris paths."
        },
        {
            "location_name": "West Kameng, Arunachal Pradesh",
            "state_name": "Arunachal Pradesh",
            "severity": "HIGH",
            "risk_score": 0.71,
            "time_str": "09:45 AM",
            "date_str": "24 May 2025",
            "message": "High landslide probability on Bhalukpong-Bomdila highway corridor. Commuters advised extreme caution."
        },
        {
            "location_name": "Champhai, Mizoram",
            "state_name": "Mizoram",
            "severity": "HIGH",
            "risk_score": 0.68,
            "time_str": "09:10 AM",
            "date_str": "24 May 2025",
            "message": "Heavy rainfall-triggered slope displacement detected near village approach roads."
        },
        {
            "location_name": "Karbi Anglong, Assam",
            "state_name": "Assam",
            "severity": "MODERATE",
            "risk_score": 0.44,
            "time_str": "08:30 AM",
            "date_str": "24 May 2025",
            "message": "Moderate hazard level recorded due to continuous drizzle and soil loosening."
        },
        {
            "location_name": "Mangan, Sikkim",
            "state_name": "Sikkim",
            "severity": "VERY HIGH",
            "risk_score": 0.78,
            "time_str": "07:15 AM",
            "date_str": "24 May 2025",
            "message": "Debris flow alert triggered along Teesta Valley riverbank slopes."
        }
    ]

    for a_entry in alerts_data:
        al = Alert(
            location_id=gangtok.id if "Gangtok" in a_entry["location_name"] else None,
            location_name=a_entry["location_name"],
            state_name=a_entry["state_name"],
            severity=a_entry["severity"],
            risk_score=a_entry["risk_score"],
            time_str=a_entry["time_str"],
            date_str=a_entry["date_str"],
            message=a_entry["message"],
            status="ACTIVE",
            source="AI Early Warning Engine",
            source_type="DEMO"
        )
        db.add(al)
    db.commit()

    # 6. Seed Landslide Incidents (Total 156 matching reference breakdown: 42 Very High, 58 High, 36 Moderate, 20 Low)
    incidents_spec = [
        ("Very High", 42),
        ("High", 58),
        ("Moderate", 36),
        ("Low", 20)
    ]
    incident_counter = 1
    for severity_label, count in incidents_spec:
        for i in range(count):
            loc_choice = list(location_objs.values())[(incident_counter + i) % len(location_objs)]
            # Spread coordinates slightly around location
            offset_lat = ((i * 17) % 30 - 15) * 0.015
            offset_lon = ((i * 23) % 30 - 15) * 0.015
            
            inc = LandslideIncident(
                incident_code=f"LS-NER-2025-{incident_counter:04d}",
                title=f"{severity_label} landslide incident near {loc_choice.name}",
                location_name=f"{loc_choice.name}, {loc_choice.state_name}",
                state_name=loc_choice.state_name,
                district_name=loc_choice.district_name,
                latitude=loc_choice.latitude + offset_lat,
                longitude=loc_choice.longitude + offset_lon,
                incident_date=datetime.datetime.utcnow() - datetime.timedelta(days=(i % 28)),
                severity=severity_label,
                status="VERIFIED" if i % 2 == 0 else "RESOLVED",
                road_affected="NH-10" if "Sikkim" in loc_choice.state_name else "State Highway",
                casualties=1 if severity_label == "Very High" and i % 5 == 0 else 0,
                description=f"Slope failure of magnitude {severity_label} documented during monsoon precipitation.",
                source_type="DEMO"
            )
            db.add(inc)
            incident_counter += 1
    db.commit()

    # 7. Seed Strategic Roads
    roads_data = [
        {
            "name": "NH-10 (Sevoke - Gangtok Highway)",
            "road_number": "NH-10",
            "state_name": "Sikkim",
            "status": "RESTRICTED",
            "start_point": "Sevoke",
            "end_point": "Gangtok",
            "blocked_reason": "Single-lane traffic movement due to debris clearance at 29th Mile",
            "latitude_start": 26.8833,
            "longitude_start": 88.4667,
            "latitude_end": 27.3389,
            "longitude_end": 88.6065,
        },
        {
            "name": "NH-29 (Dimapur - Kohima Corridor)",
            "road_number": "NH-29",
            "state_name": "Nagaland",
            "status": "OPEN",
            "start_point": "Dimapur",
            "end_point": "Kohima",
            "blocked_reason": None,
            "latitude_start": 25.9044,
            "longitude_start": 93.7259,
            "latitude_end": 25.6751,
            "longitude_end": 94.1086,
        },
        {
            "name": "NH-13 (Trans-Arunachal Highway)",
            "road_number": "NH-13",
            "state_name": "Arunachal Pradesh",
            "status": "BLOCKED",
            "start_point": "Bhalukpong",
            "end_point": "Bomdila",
            "blocked_reason": "Heavy mudslide blocking both lanes at Mile 44",
            "latitude_start": 27.0145,
            "longitude_start": 92.6500,
            "latitude_end": 27.2645,
            "longitude_end": 92.4159,
        },
        {
            "name": "NH-6 (Shillong - Silchar Route)",
            "road_number": "NH-6",
            "state_name": "Meghalaya",
            "status": "OPEN",
            "start_point": "Shillong",
            "end_point": "Jowai",
            "blocked_reason": None,
            "latitude_start": 25.5788,
            "longitude_start": 91.8933,
            "latitude_end": 25.4497,
            "longitude_end": 92.2014,
        },
        {
            "name": "NH-2 (Aizawl - Tuipang Corridor)",
            "road_number": "NH-2",
            "state_name": "Mizoram",
            "status": "RESTRICTED",
            "start_point": "Aizawl",
            "end_point": "Champhai",
            "blocked_reason": "Rockfall protection installation in progress",
            "latitude_start": 23.7307,
            "longitude_start": 92.7173,
            "latitude_end": 23.4735,
            "longitude_end": 93.3282,
        }
    ]
    for r_entry in roads_data:
        rd = Road(**r_entry, source_type="DEMO")
        db.add(rd)
    db.commit()

    # 8. Seed IoT Sensors
    sensors_data = [
        {"sensor_code": "SENSOR-SK-001", "name": "Gangtok Ridge Tilt & Moisture Sensor", "location_name": "Gangtok", "lat": 27.3389, "lon": 88.6065, "status": "ONLINE", "batt": 87.0, "tilt": 2.4, "sm": 82.0, "rain": 14.2},
        {"sensor_code": "SENSOR-AR-004", "name": "West Kameng Slope Inclinometer", "location_name": "West Kameng", "lat": 27.2645, "lon": 92.4159, "status": "ONLINE", "batt": 92.0, "tilt": 1.8, "sm": 76.0, "rain": 11.5},
        {"sensor_code": "SENSOR-MZ-002", "name": "Champhai Geophone & Moisture Unit", "location_name": "Champhai", "lat": 23.4735, "lon": 93.3282, "status": "ONLINE", "batt": 78.0, "tilt": 1.1, "sm": 74.0, "rain": 8.0},
        {"sensor_code": "SENSOR-ML-003", "name": "East Khasi Hills Rain Gauge & Tilt", "location_name": "Shillong", "lat": 25.5788, "lon": 91.8933, "status": "ONLINE", "batt": 95.0, "tilt": 0.9, "sm": 66.0, "rain": 6.5},
        {"sensor_code": "SENSOR-NL-007", "name": "Kohima By-Pass Piezometer", "location_name": "Kohima", "lat": 25.6751, "lon": 94.1086, "status": "ALERT", "batt": 64.0, "tilt": 3.7, "sm": 79.0, "rain": 16.0},
    ]
    for s_entry in sensors_data:
        loc = location_objs.get(s_entry["location_name"], gangtok)
        sensor = IoTSensor(
            sensor_code=s_entry["sensor_code"],
            name=s_entry["name"],
            location_id=loc.id,
            latitude=s_entry["lat"],
            longitude=s_entry["lon"],
            status=s_entry["status"],
            battery_level=s_entry["batt"],
            tilt_angle=s_entry["tilt"],
            soil_moisture=s_entry["sm"],
            rainfall_rate=s_entry["rain"],
            source_type="DEMO"
        )
        db.add(sensor)
    db.commit()

    # 9. Seed System Status Items
    status_items = [
        {"name": "Rainfall Data", "time_str": "Updated 10:25 AM", "status": "operational", "icon_name": "rain"},
        {"name": "Satellite Data", "time_str": "Updated 10:15 AM", "status": "operational", "icon_name": "satellite"},
        {"name": "Model Status", "time_str": "Active (v1.2)", "status": "operational", "icon_name": "activity"},
        {"name": "Alert System", "time_str": "Active", "status": "operational", "icon_name": "bell"},
        {"name": "Database", "time_str": "Connected", "status": "operational", "icon_name": "database"},
    ]
    for st_entry in status_items:
        db.add(SystemStatusItem(**st_entry, source_type="DEMO"))
    db.commit()

    # 10. Seed Demo Citizen Reports
    reports_data = [
        {
            "report_code": "CR-NER-2025-001",
            "hazard_type": "Crack",
            "description": "5cm tension crack developing across upper boundary of hillside settlement road.",
            "location_name": "Upper Sichey, Gangtok",
            "state_name": "Sikkim",
            "latitude": 27.3412,
            "longitude": 88.6105,
            "status": "Verified",
            "reporter_name": "Tashi Bhutia"
        },
        {
            "report_code": "CR-NER-2025-002",
            "hazard_type": "Blocked road",
            "description": "Loose boulder rockfall on NH-10 near 29th Mile, blocking outbound lane.",
            "location_name": "Sevoke-Gangtok Route",
            "state_name": "Sikkim",
            "latitude": 27.0512,
            "longitude": 88.4900,
            "status": "Pending Verification",
            "reporter_name": "Sonam Lepcha"
        }
    ]
    for r_entry in reports_data:
        db.add(CitizenReport(**r_entry, source_type="DEMO"))
    db.commit()

    return {"status": "success", "message": "NER database seeded with 8 states, locations, rainfall trends, 156 incidents, alerts, sensors, and status records."}
