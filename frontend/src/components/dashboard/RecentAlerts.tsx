"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { fetchAlerts, AlertItem } from "@/lib/api";

interface RecentAlertsProps {
  onSelectLocation?: (id: number) => void;
}

export function RecentAlerts({ onSelectLocation }: RecentAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        const data = await fetchAlerts();
        setAlerts(data);
      } catch (e) {
        console.error("Failed to load alerts", e);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  return (
    <Card className="shadow-sm border-slate-100 flex-1 flex flex-col h-full">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-bold text-slate-800">Recent Alerts</CardTitle>
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {alerts.length} Active
          </span>
        </div>
        <span 
          onClick={() => alert("Viewing all 8 active regional early warnings.")}
          className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          View All
        </span>
      </CardHeader>
      <CardContent className="p-4 pt-1 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => {
                // Focus Gangtok if it's Gangtok or location ID 1
                if (onSelectLocation) onSelectLocation(alert.id <= 2 ? 1 : alert.id);
              }}
              className="flex gap-2.5 items-start border-b border-slate-50 pb-2.5 last:border-0 last:pb-0 hover:bg-slate-50/80 p-1.5 rounded-md cursor-pointer transition-colors"
            >
              <div className={`p-1.5 rounded-md ${alert.bg} mt-0.5 shrink-0`}>
                <AlertTriangle className={`w-3.5 h-3.5 ${alert.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className={`text-[11px] font-extrabold ${alert.color}`}>{alert.level}</span>
                  <div className="text-right flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800">{alert.time}</span>
                    <span className="text-[9px] text-slate-400">{alert.date}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">{alert.location}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{alert.message}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-slate-400 text-center py-6">No active alerts recorded.</div>
        )}
      </CardContent>
    </Card>
  );
}
