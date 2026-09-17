"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, ArrowLeft, Save, BellRing, Database } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-slate-700" />
          System Settings & Risk Threshold Configuration
        </h1>
        <p className="text-sm text-slate-500">
          Configure telemetry polling frequencies, threshold triggers, and CAP notification endpoints
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold text-slate-800">
            Automated Alert Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Very High Risk Threshold</label>
              <Input defaultValue="0.75" className="bg-slate-50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">High Risk Threshold</label>
              <Input defaultValue="0.50" className="bg-slate-50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Extreme 24h Rainfall Trigger (mm)</label>
              <Input defaultValue="120.0" className="bg-slate-50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Sensor Inclinometer Tilt Trigger (°)</label>
              <Input defaultValue="3.5" className="bg-slate-50 text-sm" />
            </div>
          </div>

          <div className="border-t pt-4 flex justify-end">
            <Button 
              onClick={() => alert("Risk Threshold Settings Saved.")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
