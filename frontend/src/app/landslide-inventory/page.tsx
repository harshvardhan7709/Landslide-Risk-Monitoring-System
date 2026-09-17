"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { List, Search, ArrowLeft, Loader2, Filter } from "lucide-react";
import Link from "next/link";

interface Incident {
  id: number;
  code: string;
  title: string;
  location: string;
  state: string;
  district: string;
  severity: string;
  date: string;
  latitude: number;
  longitude: number;
  road_affected: string;
  status: string;
  source_type: string;
}

export default function LandslideInventoryPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/v1/landslides?limit=156");
        const data = await res.json();
        setIncidents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = incidents.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        item.location.toLowerCase().includes(search.toLowerCase()) ||
                        item.code.toLowerCase().includes(search.toLowerCase());
    const matchState = selectedState === "all" || item.state === selectedState;
    const matchSev = selectedSeverity === "all" || item.severity.toLowerCase() === selectedSeverity.toLowerCase();
    return matchSearch && matchState && matchSev;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <List className="w-7 h-7 text-purple-600" />
              Regional Landslide Inventory (NER)
            </h1>
            <p className="text-sm text-slate-500">
              Comprehensive historical repository of 156 slope displacement events documented across the North Eastern Region
            </p>
          </div>
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {filtered.length} INCIDENTS RECORDED
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by code, road, landmark, or location..."
              className="pl-9 bg-slate-50"
            />
          </div>
          <div className="w-full md:w-56">
            <Select value={selectedState} onValueChange={(val) => val && setSelectedState(val)}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Filter State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All 8 NER States</SelectItem>
                <SelectItem value="Sikkim">Sikkim</SelectItem>
                <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                <SelectItem value="Assam">Assam</SelectItem>
                <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                <SelectItem value="Mizoram">Mizoram</SelectItem>
                <SelectItem value="Nagaland">Nagaland</SelectItem>
                <SelectItem value="Manipur">Manipur</SelectItem>
                <SelectItem value="Tripura">Tripura</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedSeverity} onValueChange={(val) => val && setSelectedSeverity(val)}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Filter Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="very high">Very High (42)</SelectItem>
                <SelectItem value="high">High (58)</SelectItem>
                <SelectItem value="moderate">Moderate (36)</SelectItem>
                <SelectItem value="low">Low (20)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
              <span className="text-xs">Loading geological landslide inventory...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Incident Title</th>
                    <th className="p-3.5">State & Location</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Road Impacted</th>
                    <th className="p-3.5">Coordinates</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">{item.code}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{item.title}</td>
                      <td className="p-3.5">{item.location}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
                          item.severity === "Very High" ? "bg-red-600" :
                          item.severity === "High" ? "bg-orange-500" :
                          item.severity === "Moderate" ? "bg-amber-400 text-slate-900" :
                          "bg-green-600"
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{item.date}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{item.road_affected || "None"}</td>
                      <td className="p-3.5 font-mono text-[10px] text-slate-500">{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "VERIFIED" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
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
