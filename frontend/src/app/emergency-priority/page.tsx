"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertOctagon, ArrowLeft, Loader2, ShieldCheck, Siren } from "lucide-react";
import Link from "next/link";

interface PriorityItem {
  location: string;
  risk_score: number;
  risk_level: string;
  population_exposed: number;
  roads_affected: string;
  critical_infrastructure: string;
  priority: string;
  priority_label: string;
  recommended_action: string;
  source_type: string;
}

export default function EmergencyPriorityPage() {
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/v1/emergency/priority");
        const data = await res.json();
        setPriorities(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
              <Siren className="w-7 h-7 text-red-600" />
              Emergency Response & Resource Prioritization Matrix
            </h1>
            <p className="text-sm text-slate-500">
              Multi-criteria decision support ranking based on AI Landslide Risk Index, Population Exposure, Highway Criticality, and Structural Vulnerability
            </p>
          </div>
          <span className="bg-red-100 text-red-800 border border-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
            DISASTER RESPONSE DIRECTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50 p-4">
          <span className="text-xs font-bold text-red-600 uppercase">Priority P1 (Critical)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {priorities.filter(p => p.priority === "P1").length} Zones
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Immediate NDRF deployment & evacuation</p>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50 p-4">
          <span className="text-xs font-bold text-orange-600 uppercase">Priority P2 (High)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {priorities.filter(p => p.priority === "P2").length} Zones
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Heavy earthmovers staged along transit corridors</p>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50 p-4">
          <span className="text-xs font-bold text-amber-700 uppercase">Priority P3 (Elevated)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {priorities.filter(p => p.priority === "P3").length} Zones
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Intensive sensor polling & traffic advisory</p>
        </Card>
        <Card className="border-green-200 bg-green-50/50 p-4">
          <span className="text-xs font-bold text-green-700 uppercase">Priority P4 (Routine)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {priorities.filter(p => p.priority === "P4").length} Zones
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Baseline monitoring & telemetry logging</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <CardTitle className="text-sm font-bold text-slate-800">
            Ranked Emergency Action Plan (NER Disaster Management Authorities)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-2" />
              <span className="text-xs">Computing multi-criteria response matrix...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Zone Location</th>
                    <th className="p-3.5">Risk Score</th>
                    <th className="p-3.5">Exposed Population</th>
                    <th className="p-3.5">Critical Highway / Roads</th>
                    <th className="p-3.5">Key Assets</th>
                    <th className="p-3.5">Recommended Response Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {priorities.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase text-white ${
                          item.priority === "P1" ? "bg-red-600" :
                          item.priority === "P2" ? "bg-orange-500" :
                          item.priority === "P3" ? "bg-amber-500" :
                          "bg-green-600"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{item.location}</td>
                      <td className="p-3.5 font-black text-slate-900">{item.risk_score.toFixed(2)}</td>
                      <td className="p-3.5 font-semibold">{item.population_exposed.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-800">{item.roads_affected}</td>
                      <td className="p-3.5 text-slate-600">{item.critical_infrastructure}</td>
                      <td className="p-3.5 text-slate-800 font-semibold max-w-xs">{item.recommended_action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
