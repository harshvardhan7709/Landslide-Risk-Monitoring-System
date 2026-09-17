"use client";

import { useEffect, useState } from "react";
import { RainfallChart } from "@/components/dashboard/RainfallChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CloudRain, ArrowLeft, Droplets, Wind, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { fetchLocations, LocationItem } from "@/lib/api";

export default function RainfallAnalysisPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocId, setSelectedLocId] = useState<number>(1);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <CloudRain className="w-7 h-7 text-blue-600" />
              Precipitation & Soil Moisture Saturation Analytics
            </h1>
            <p className="text-sm text-slate-500">
              IMD & NASA GPM IMERG 1h, 24h, and 7-day cumulative rainfall thresholds linked to landslide triggering indices
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
            HYDRO-METEOROLOGICAL FEED
          </span>
        </div>
      </div>

      {/* Location Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocId(loc.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedLocId === loc.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {loc.name}, {loc.state_name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-[400px]">
          <RainfallChart locationId={selectedLocId} />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="shadow-sm border-slate-200 p-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-blue-500" />
              Critical Saturation Thresholds
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between border-b pb-1">
                <span>1-Hour Flash Threshold</span>
                <span className="font-bold text-slate-900">&gt; 25.0 mm/hr</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>24-Hour Cumulative Limit</span>
                <span className="font-bold text-slate-900">&gt; 120.0 mm</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>7-Day Antecedent Saturation</span>
                <span className="font-bold text-slate-900">&gt; 300.0 mm</span>
              </div>
              <div className="flex justify-between">
                <span>Volumetric Soil Saturation</span>
                <span className="font-bold text-red-600">&gt; 80% Moisture</span>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm border-slate-200 p-4 bg-amber-50/60 border-amber-200">
            <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Meteorological Advisory (IMD)
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Monsoon trough active across Eastern Himalayas. Sustained squalls expected over Sikkim and Arunachal Pradesh highlands for next 48 hours.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
