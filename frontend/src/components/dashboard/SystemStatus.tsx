"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Satellite, Activity, Bell, Database } from "lucide-react";
import { fetchSystemStatus, SystemStatusItem } from "@/lib/api";

export function SystemStatus() {
  const [statuses, setStatuses] = useState<SystemStatusItem[]>([
    { name: "Rainfall Data", time: "Updated 10:25 AM", status: "green", icon: "rain" },
    { name: "Satellite Data", time: "Updated 10:15 AM", status: "green", icon: "satellite" },
    { name: "Model Status", time: "Active (v1.2)", status: "green", icon: "activity" },
    { name: "Alert System", time: "Active", status: "green", icon: "bell" },
    { name: "Database", time: "Connected", status: "green", icon: "database" },
  ]);

  useEffect(() => {
    async function loadStatus() {
      try {
        const items = await fetchSystemStatus();
        if (items && items.length > 0) {
          setStatuses(items);
        }
      } catch (e) {
        console.error("Failed to load live system status", e);
      }
    }
    loadStatus();
  }, []);

  const getIcon = (iconName: string, status: string) => {
    const colorClass = status === "green" ? "text-green-500" : status === "yellow" ? "text-amber-500" : "text-red-500";
    switch (iconName.toLowerCase()) {
      case "rain":
        return <CloudRain className={`w-5 h-5 ${colorClass}`} />;
      case "satellite":
        return <Satellite className={`w-5 h-5 ${colorClass}`} />;
      case "activity":
        return <Activity className={`w-5 h-5 ${colorClass}`} />;
      case "bell":
        return <Bell className={`w-5 h-5 ${colorClass}`} />;
      case "database":
        return <Database className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Activity className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <Card className="shadow-sm border-slate-100 flex-1">
      <CardContent className="p-4 flex items-center justify-between h-full">
        <div className="flex items-center gap-2 mr-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider whitespace-nowrap">
            System Status
          </h3>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto">
          {statuses.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              {getIcon(item.icon || item.name, item.status)}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">{item.name}</span>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
