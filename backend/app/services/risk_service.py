import math
from typing import Dict, Any, List
from app.schemas.schemas import RiskPredictRequest, RiskPredictResponse, ContributingFactor

class LandslideRiskEngine:
    """
    ML and Heuristic Landslide Risk Engine for North Eastern Region (NER).
    Calculates susceptibility probability based on precipitation, slope, elevation, 
    soil moisture, land cover, and distance to roads.
    """
    def __init__(self):
        self.version = "XGBoost-NER-v1.2.0-DEMO"

    def predict(self, req: RiskPredictRequest) -> RiskPredictResponse:
        # 1. Slope factor (steep slopes > 35 deg dramatically increase risk)
        slope_norm = min(req.slope / 55.0, 1.0)
        
        # 2. Rainfall accumulation factor (24h and 72h saturation)
        rain_24h_norm = min(req.rainfall_24h / 200.0, 1.0)
        rain_72h_norm = min(req.rainfall_72h / 350.0, 1.0)
        rain_factor = (rain_24h_norm * 0.65) + (rain_72h_norm * 0.35)
        
        # 3. Soil moisture factor
        moisture_norm = min(req.soil_moisture / 100.0, 1.0)
        
        # 4. Elevation & terrain aspect factor
        elevation_norm = min(req.elevation / 3000.0, 1.0)
        
        # 5. Road proximity factor (excavated cut slopes near roads are high risk)
        road_proximity_factor = max(0.0, 1.0 - (req.distance_to_road / 500.0))
        
        # Weighted composite risk probability
        raw_score = (
            rain_factor * 0.42 +
            moisture_norm * 0.28 +
            slope_norm * 0.19 +
            req.historical_landslide_density * 0.07 +
            road_proximity_factor * 0.04
        )
        
        # Bound between 0.05 and 0.98
        risk_score = round(max(0.05, min(0.98, raw_score)), 2)
        
        # Risk level determination
        if risk_score >= 0.75:
            risk_level = "VERY HIGH"
        elif risk_score >= 0.50:
            risk_level = "HIGH"
        elif risk_score >= 0.25:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"
            
        confidence = round(0.85 + (abs(risk_score - 0.5) * 0.2), 2)
        
        # Contributing factors / SHAP-style breakdown
        contributing_factors = [
            ContributingFactor(
                feature="Rainfall",
                importance=42.0,
                description=f"24h: {req.rainfall_24h} mm, 72h: {req.rainfall_72h} mm saturation"
            ),
            ContributingFactor(
                feature="Soil Moisture",
                importance=28.0,
                description=f"Volumetric water content at {req.soil_moisture}%"
            ),
            ContributingFactor(
                feature="Slope",
                importance=19.0,
                description=f"Gradient measured at {req.slope}° incline"
            ),
            ContributingFactor(
                feature="Historical Landslides",
                importance=7.0,
                description=f"Local density index: {req.historical_landslide_density}"
            ),
            ContributingFactor(
                feature="Road Cut Slopes",
                importance=4.0,
                description=f"Distance to highway corridor: {req.distance_to_road} m"
            )
        ]
        
        return RiskPredictResponse(
            risk_score=risk_score,
            risk_level=risk_level,
            confidence=confidence,
            contributing_factors=contributing_factors,
            model_version=self.version,
            source_type="DEMO"
        )

risk_engine = LandslideRiskEngine()
