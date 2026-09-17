"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Battery, Radio, Gauge, CloudRain, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Sensor {
  id: number;
  sensor_code: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  battery_level: number;
  tilt_angle: number;
  soil_moisture: number;
  rainfall_rate: number;
  last_seen: string;
  source_type: string;
}

export default function LiveMonitoringPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSensors() {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/v1/sensors");
        const data = await res.json();
        setSensors(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSensors();
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
              <Activity className="w-7 h-7 text-blue-600" />
              Real-Time IoT Sensor Telemetry Array
            </h1>
            <p className="text-sm text-slate-500">
              Live monitoring of slope tilt inclinometers, volumetric soil moisture probes, piezometers, and tipping-bucket rain gauges across NER
            </p>
          </div>
          <span className="bg-green-100 text-green-800 border border-green-300 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            TELEMETRY ONLINE
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <span className="text-xs">Polling IoT sensor array telemetry...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sensors.map((s) => (
            <Card key={s.id} className="shadow-sm border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4 bg-slate-50/70 border-b flex flex-row items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                    {s.sensor_code}
                  </span>
                  <CardTitle className="text-sm font-bold text-slate-900 mt-1">{s.name}</CardTitle>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.status === "ONLINE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {s.status}
                </span>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-md">
                    <span className="text-slate-500 text-[10px] block font-medium">Soil Moisture</span>
                    <span className="text-base font-black text-blue-600">{s.soil_moisture}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md">
                    <span className="text-slate-500 text-[10px] block font-medium">Slope Tilt Angle</span>
                    <span className="text-base font-black text-amber-600">{s.tilt_angle}°</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md">
                    <span className="text-slate-500 text-[10px] block font-medium">Rainfall Rate</span>
                    <span className="text-base font-black text-indigo-600">{s.rainfall_rate} mm/hr</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md">
                    <span className="text-slate-500 text-[10px] block font-medium">Battery Level</span>
                    <span className="text-base font-black text-emerald-600">{s.battery_level}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t pt-2">
                  <span>GPS: {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}</span>
                  <span>Last seen: {s.last_seen}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
