"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ShieldAlert, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Factor {
  feature: string;
  importance: number;
  description: string;
}

interface PredictResult {
  risk_score: number;
  risk_level: string;
  confidence: number;
  contributing_factors: Factor[];
  model_version: string;
  source_type: string;
}

export default function RiskPredictionPage() {
  const [formData, setFormData] = useState({
    location: "Gangtok, Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
    rainfall_1h: 12.5,
    rainfall_6h: 45.0,
    rainfall_24h: 126.4,
    rainfall_72h: 324.8,
    soil_moisture: 82.0,
    elevation: 1650.0,
    slope: 42.0,
    aspect: "South-East",
    ndvi: 0.65,
    land_cover: "Dense Forest",
    historical_landslide_density: 0.68,
    distance_to_road: 85.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/risk/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error contacting ML risk prediction service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            AI Landslide Risk Prediction Engine
          </h1>
          <p className="text-sm text-slate-500">
            Multi-factor machine learning susceptibility model (XGBoost / Gradient Boosting with SHAP feature attribution)
          </p>
        </div>
        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
          DEMO ML PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-slate-800">
                Geological & Meteorological Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Location</label>
                    <Input 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="bg-slate-50 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Latitude</label>
                      <Input 
                        type="number" 
                        step="any"
                        value={formData.latitude} 
                        onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Longitude</label>
                      <Input 
                        type="number" 
                        step="any"
                        value={formData.longitude} 
                        onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Precipitation Accumulation (mm)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Rainfall 1h</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.rainfall_1h} 
                        onChange={e => setFormData({...formData, rainfall_1h: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Rainfall 6h</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.rainfall_6h} 
                        onChange={e => setFormData({...formData, rainfall_6h: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Rainfall 24h</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.rainfall_24h} 
                        onChange={e => setFormData({...formData, rainfall_24h: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Rainfall 72h</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.rainfall_72h} 
                        onChange={e => setFormData({...formData, rainfall_72h: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Terrain & Soil Dynamics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Soil Moisture (%)</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.soil_moisture} 
                        onChange={e => setFormData({...formData, soil_moisture: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Slope Angle (°)</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.slope} 
                        onChange={e => setFormData({...formData, slope: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Elevation (m)</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.elevation} 
                        onChange={e => setFormData({...formData, elevation: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Land Cover & Infrastructure Proximity</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">NDVI Index (0-1)</label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={formData.ndvi} 
                        onChange={e => setFormData({...formData, ndvi: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Historical Density</label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={formData.historical_landslide_density} 
                        onChange={e => setFormData({...formData, historical_landslide_density: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">Road Distance (m)</label>
                      <Input 
                        type="number"
                        step="any"
                        value={formData.distance_to_road} 
                        onChange={e => setFormData({...formData, distance_to_road: parseFloat(e.target.value)})}
                        className="bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Predict Landslide Risk (POST /api/v1/risk/predict)
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Output Column */}
        <div className="lg:col-span-5">
          <Card className="shadow-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-slate-800">
                Inference Result & SHAP Feature Attribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              {result ? (
                <div className="space-y-6">
                  {/* Score Card */}
                  <div className={`p-5 rounded-xl border text-center ${
                    result.risk_level === "VERY HIGH"
                      ? "bg-red-50 border-red-200"
                      : result.risk_level === "HIGH"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Calculated Landslide Probability
                    </span>
                    <div className="text-5xl font-black text-slate-900 my-2">
                      {result.risk_score.toFixed(2)}
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-black text-white bg-red-600 uppercase">
                      {result.risk_level} RISK
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-2">
                      Model Confidence: {(result.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* Contributing Factors */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Contributing Factors (SHAP Feature Importance)
                    </h4>
                    <div className="space-y-3">
                      {result.contributing_factors.map((factor, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{factor.feature}</span>
                            <span>{factor.importance}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${factor.importance}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t pt-3 flex justify-between">
                    <span>Engine: {result.model_version}</span>
                    <span>Source: {result.source_type}</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-sm text-slate-600">Ready to Compute</p>
                  <p className="text-xs max-w-xs mt-1">
                    Fill the terrain, rainfall, and soil parameters on the left and click "Predict Risk".
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
