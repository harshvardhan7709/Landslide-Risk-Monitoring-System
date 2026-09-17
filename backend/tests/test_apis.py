import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

endpoints = [
    ("/health", "GET", None),
    ("/dashboard/summary", "GET", None),
    ("/locations", "GET", None),
    ("/risk/map", "GET", None),
    ("/risk/1", "GET", None),
    ("/rainfall/trend?location_id=1", "GET", None),
    ("/landslides/summary", "GET", None),
    ("/alerts", "GET", None),
    ("/dashboard/status", "GET", None),
    ("/roads", "GET", None),
    ("/emergency/priority", "GET", None),
    ("/risk/predict", "POST", {
        "location": "Gangtok, Sikkim",
        "latitude": 27.3389,
        "longitude": 88.6065,
        "rainfall_1h": 10.0,
        "rainfall_24h": 126.4,
        "rainfall_72h": 324.8,
        "soil_moisture": 82.0,
        "elevation": 1650.0,
        "slope": 42.0,
        "aspect": "South-East"
    })
]

print("=== RUNNING API TEST SUITE ===")
all_passed = True

for path, method, payload in endpoints:
    url = BASE_URL + path
    try:
        if method == "GET":
            req = urllib.request.Request(url)
        else:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
            
        with urllib.request.urlopen(req, timeout=5) as resp:
            status = resp.status
            body = json.loads(resp.read().decode('utf-8'))
            if status == 200:
                summary = f"{len(body)} items" if isinstance(body, list) else (f"{len(body.get('features', []))} GeoJSON features" if "features" in body else "OK")
                print(f"[PASS] [{method}] {path:32} -> HTTP {status} ({summary})")
            else:
                print(f"[FAIL] [{method}] {path:32} -> HTTP {status}")
                all_passed = False
    except Exception as e:
        print(f"[FAIL] [{method}] {path:32} -> FAILED: {e}")
        all_passed = False

if all_passed:
    print("\nALL 12 API ENDPOINTS VERIFIED AND PASSING!")
    sys.exit(0)
else:
    print("\nSOME TESTS FAILED!")
    sys.exit(1)
