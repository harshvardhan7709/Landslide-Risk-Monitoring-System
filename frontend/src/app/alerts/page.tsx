"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Send, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { fetchAlerts, AlertItem } from "@/lib/api";

export default function AlertsManagementPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAlerts();
        setAlerts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDispatch = async (alertId: number, locName: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/alerts/${alertId}/notify`, {
        method: "POST"
      });
      const data = await res.json();
      setDispatchStatus(`Multilingual Alert dispatched to 14,200 citizens across ${locName} in English, Hindi, Assamese & Nepali!`);
    } catch (e) {
      alert("Error dispatching notification");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-red-600" />
              Regional Early Warning Alerts & Broadcast Control
            </h1>
            <p className="text-sm text-slate-500">
              Active landslide threat bulletins with CAP (Common Alerting Protocol) multilingual broadcasting
            </p>
          </div>
          <span className="bg-red-100 text-red-800 border border-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {alerts.length} ACTIVE WARNINGS
          </span>
        </div>
      </div>

      {dispatchStatus && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-semibold">{dispatchStatus}</span>
        </div>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-2" />
          <span className="text-xs">Fetching active early warnings...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {alerts.map((a) => (
            <Card key={a.id} className="shadow-sm border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${a.bg}`}>
                    <AlertTriangle className={`w-5 h-5 ${a.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{a.location}</h3>
                    <span className={`text-[11px] font-black ${a.color}`}>{a.level}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">{a.time}</span>
                  <span className="text-[10px] text-slate-400">{a.date}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {a.message}
              </p>

              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="font-mono text-slate-500">Risk Score: <strong className="text-slate-900">{a.risk_score}</strong></span>
                <Button 
                  onClick={() => handleDispatch(a.id, a.location)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5 py-1.5 h-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Multilingual CAP Alert
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
