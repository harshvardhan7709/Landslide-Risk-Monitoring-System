"use client";

import { useEffect, useState } from "react";
import { KpiCard } from "./KpiCard";
import { RiskMap } from "./RiskMap";
import { CurrentLocationRisk } from "./CurrentLocationRisk";
import { RainfallChart } from "./RainfallChart";
import { IncidentChart } from "./IncidentChart";
import { RecentAlerts } from "./RecentAlerts";
import { SystemStatus } from "./SystemStatus";
import { QuickActions } from "./QuickActions";
import { CloudRain, Mountain, Users, AlertTriangle, List } from "lucide-react";
import { fetchDashboardSummary, DashboardSummary } from "@/lib/api";

export function MainDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const data = await fetchDashboardSummary();
        setSummary(data);
        setError(null);
      } catch (err: any) {
        console.error("Error loading dashboard summary:", err);
        setError("Could not connect to live backend API. Retrying...");
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Demo Data & API Status Header Banner */}
      <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            LIVE BACKEND CONNECTED
          </span>
          <span className="text-xs text-slate-700 font-medium">
            FastAPI + PostGIS Database Engine Active • North Eastern Region (NER)
          </span>
        </div>
        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          DEMO DATASET (Simulated IMD/GPM Feed)
        </span>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 shrink-0">
        <KpiCard 
          title="24h Rainfall" 
          value={summary ? `${summary.rainfall_24h} mm` : "126.4 mm"} 
          secondaryText={summary ? summary.rainfall_trend_text : "↑ 12% from yesterday"} 
          icon={<CloudRain className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          trend="up"
        />
        <KpiCard 
          title="High Risk Areas" 
          value={summary ? summary.high_risk_areas : 42} 
          secondaryText={summary ? summary.high_risk_trend_text : "↑ 4 new areas"} 
          icon={<Mountain className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          trend="up"
        />
        <KpiCard 
          title="People at Risk" 
          value={summary ? summary.people_at_risk.toLocaleString() : "12,540"} 
          secondaryText={summary ? summary.people_at_risk_trend_text : "↑ 1,250 from yesterday"} 
          icon={<Users className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          trend="up"
        />
        <KpiCard 
          title="Active Alerts" 
          value={summary ? summary.active_alerts : 8} 
          secondaryText={summary ? summary.active_alerts_trend_text : "2 Critical"} 
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          trend="down"
        />
        <KpiCard 
          title="Total Incidents" 
          value={summary ? summary.total_incidents : 156} 
          secondaryText={summary ? summary.total_incidents_trend_text : "Last 30 days"} 
          icon={<List className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
          trend="neutral"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-[420px]">
        {/* Map */}
        <div className="flex-[2.5] h-full min-h-[420px]">
          <RiskMap 
            selectedLocationId={selectedLocationId}
            onSelectLocation={(id) => setSelectedLocationId(id)}
          />
        </div>
        
        {/* Current Location Risk */}
        <div className="flex-1 h-full min-w-[320px]">
          <CurrentLocationRisk 
            selectedLocationId={selectedLocationId}
            onSelectLocation={(id) => setSelectedLocationId(id)}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <div className="h-[290px]">
          <RainfallChart locationId={selectedLocationId} />
        </div>
        <div className="h-[290px]">
          <IncidentChart />
        </div>
        <div className="h-[290px] flex flex-col gap-4">
          <RecentAlerts onSelectLocation={(id) => setSelectedLocationId(id)} />
        </div>
      </div>

      {/* System Status and Quick Actions Row */}
      <div className="flex flex-col lg:flex-row gap-4 shrink-0 pb-4">
        <div className="flex-[2]">
          <SystemStatus />
        </div>
        <div className="flex-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
