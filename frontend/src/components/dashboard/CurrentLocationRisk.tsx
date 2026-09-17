"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertTriangle, CloudRain, Mountain, Wind, Map as MapIcon, Loader2 } from "lucide-react";
import { fetchLocations, fetchLocationRisk, LocationItem, LocationRiskDetail } from "@/lib/api";

interface CurrentLocationRiskProps {
  selectedLocationId: number;
  onSelectLocation: (id: number) => void;
}

export function CurrentLocationRisk({ selectedLocationId, onSelectLocation }: CurrentLocationRiskProps) {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [riskDetail, setRiskDetail] = useState<LocationRiskDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load locations on mount
  useEffect(() => {
    async function loadLocs() {
      try {
        const locs = await fetchLocations();
        setLocations(locs);
      } catch (e) {
        console.error("Failed to load locations", e);
      }
    }
    loadLocs();
  }, []);

  // Load risk details when selected location changes
  useEffect(() => {
    async function loadRisk() {
      try {
        setLoading(true);
        const detail = await fetchLocationRisk(selectedLocationId);
        setRiskDetail(detail);
      } catch (e) {
        console.error("Failed to load location risk", e);
      } finally {
        setLoading(false);
      }
    }
    if (selectedLocationId) {
      loadRisk();
    }
  }, [selectedLocationId]);

  const score = riskDetail?.risk_score ?? 0.82;
  const level = riskDetail?.risk_level ?? "Very High";
  
  // Calculate gauge dashoffset based on score (0 to 1)
  // Total arc circumference is ~125
  const strokeOffset = Math.max(0, 125 - (score * 125));
  
  // Color based on risk level
  const riskColor = score >= 0.75 ? "#EF4444" : score >= 0.50 ? "#F97316" : score >= 0.25 ? "#FACC15" : "#22C55E";
  const textColorClass = score >= 0.75 ? "text-red-500" : score >= 0.50 ? "text-orange-500" : score >= 0.25 ? "text-yellow-600" : "text-green-600";

  return (
    <Card className="shadow-sm border-slate-100 h-full flex flex-col">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base font-bold text-slate-800">Current Location Risk</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-1 flex flex-col">
        <div className="mb-4">
          <Select 
            value={selectedLocationId.toString()} 
            onValueChange={(val) => {
              if (val) onSelectLocation(parseInt(val, 10));
            }}
          >
            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-blue-500">
              <div className="flex items-center gap-2 text-slate-700 font-semibold truncate">
                <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                <SelectValue placeholder="Select location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>
                    {loc.name}, {loc.state_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="1">Gangtok, Sikkim</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <span className="text-xs">Fetching sensor & ML risk data...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6 mb-4">
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke={riskColor} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    strokeDasharray="125" 
                    strokeDashoffset={strokeOffset} 
                    style={{ transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center top-12">
                  <span className="text-3xl font-extrabold text-slate-800 leading-none">{score.toFixed(2)}</span>
                  <span className={`text-xs font-bold mt-1 ${textColorClass}`}>{level} Risk</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" /> <span>Rainfall (24h)</span>
                  </div>
                  <span className="font-semibold text-slate-800">{riskDetail?.rainfall_24h} mm</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CloudRain className="w-3.5 h-3.5 text-blue-600" /> <span>Rainfall (7 days)</span>
                  </div>
                  <span className="font-semibold text-slate-800">{riskDetail?.rainfall_7d} mm</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mountain className="w-3.5 h-3.5 text-amber-600" /> <span>Slope</span>
                  </div>
                  <span className="font-semibold text-slate-800">{riskDetail?.slope}°</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapIcon className="w-3.5 h-3.5 text-indigo-500" /> <span>Elevation</span>
                  </div>
                  <span className="font-semibold text-slate-800">{riskDetail?.elevation.toLocaleString()} m</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Wind className="w-3.5 h-3.5 text-orange-500" /> <span>Soil Type</span>
                  </div>
                  <span className="font-semibold text-slate-800 truncate max-w-[90px]">{riskDetail?.soil_type}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapIcon className="w-3.5 h-3.5 text-emerald-600" /> <span>Land Cover</span>
                  </div>
                  <span className="font-semibold text-slate-800 truncate max-w-[90px]">{riskDetail?.land_cover}</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-start gap-2.5 mb-4 ${
              score >= 0.75 
                ? "bg-red-50 border-red-200 text-red-800" 
                : score >= 0.50 
                ? "bg-orange-50 border-orange-200 text-orange-800"
                : score >= 0.25
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-green-50 border-green-200 text-green-800"
            }`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                {riskDetail?.warning_message}
              </p>
            </div>

            <div className="flex gap-2 mt-auto">
              <Button 
                onClick={() => alert(`Detailed Geological Report Generated for ${riskDetail?.name}, ${riskDetail?.state_name}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 h-auto"
              >
                View Detailed Report
              </Button>
              <Button 
                onClick={() => alert(`Early warning broadcast dispatched for ${riskDetail?.name} zone.`)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs py-2 h-auto"
              >
                Get Early Warning
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
