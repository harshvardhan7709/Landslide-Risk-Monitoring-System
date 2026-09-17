"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchRainfallTrend, RainfallTrendItem } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface RainfallChartProps {
  locationId?: number;
}

export function RainfallChart({ locationId = 1 }: RainfallChartProps) {
  const [data, setData] = useState<RainfallTrendItem[]>([]);
  const [locationName, setLocationName] = useState<string>("Gangtok, Sikkim");
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTrend() {
      try {
        setLoading(true);
        const res = await fetchRainfallTrend(locationId);
        setData(res.trends);
        setLocationName(res.location_name);
      } catch (e) {
        console.error("Failed to load rainfall trend", e);
      } finally {
        setLoading(false);
      }
    }
    loadTrend();
  }, [locationId, period]);

  return (
    <Card className="shadow-sm border-slate-100 h-full flex flex-col">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-800">
          Rainfall Trend ({locationName})
        </CardTitle>
        <div className="flex gap-1 text-[11px] font-semibold bg-slate-100 p-0.5 rounded">
          <button 
            onClick={() => setPeriod("7d")}
            className={`px-2 py-0.5 rounded ${period === "7d" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setPeriod("30d")}
            className={`px-2 py-0.5 rounded ${period === "30d" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"}`}
          >
            30 Days
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="h-full w-full min-h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748B" }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                />
                <Legend iconType="plainline" iconSize={12} wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingTop: '4px' }} />
                <Line type="monotone" name="1 Hour Rainfall (mm)" dataKey="h1" stroke="#1261D6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" name="24 Hour Rainfall (mm)" dataKey="h24" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" name="7 Day Rainfall (mm)" dataKey="d7" stroke="#FACC15" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
