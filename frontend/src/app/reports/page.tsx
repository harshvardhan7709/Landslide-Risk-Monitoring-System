"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const reports = [
    { title: "Daily NER Landslide Susceptibility Bulletin", date: "24 May 2025", type: "PDF", size: "2.4 MB" },
    { title: "Weekly Meteorological Saturation & Slope Analysis", date: "22 May 2025", type: "PDF", size: "4.1 MB" },
    { title: "East Sikkim Highway Corridor Vulnerability Assessment", date: "20 May 2025", type: "CSV", size: "850 KB" },
    { title: "Quarterly Historical Landslide Incident Inventory", date: "15 May 2025", type: "JSON", size: "1.2 MB" },
    { title: "Trans-Arunachal Highway Connectivity Status Report", date: "10 May 2025", type: "PDF", size: "3.0 MB" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-green-600" />
              Disaster Management Reports & Data Export
            </h1>
            <p className="text-sm text-slate-500">
              Generate and download situational intelligence summaries for NDMA, SDMA, and District Magistrates
            </p>
          </div>
          <Button 
            onClick={() => alert("Generating Real-time Regional Situation PDF Report...")}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold gap-2"
          >
            <Printer className="w-4 h-4" />
            Generate Instant Daily Summary
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold text-slate-800">
            Available Official Bulletins & Geological Assessments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {reports.map((r, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                  <span className="text-xs text-slate-500">{r.date} • {r.type} • {r.size}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => alert(`Downloading ${r.title} (${r.type})`)}
                className="text-xs font-bold gap-1.5 border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
