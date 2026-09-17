"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Activity, 
  Map as MapIcon, 
  CloudRain, 
  List, 
  Bell, 
  FileText, 
  TrendingUp, 
  Users, 
  Settings, 
  Info,
  Mountain,
  AlertCircle,
  Siren
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Risk Prediction", href: "/predict", icon: TrendingUp },
  { name: "Citizen Reporting", href: "/report", icon: AlertCircle },
  { name: "Emergency Priority", href: "/emergency-priority", icon: Siren },
  { name: "Landslide Inventory", href: "/landslide-inventory", icon: List },
  { name: "Live Monitoring", href: "/#monitoring", icon: Activity },
  { name: "Alerts", href: "/#alerts", icon: Bell, badge: 5 },
  { name: "Settings", href: "/#settings", icon: Settings },
  { name: "About System", href: "/#about", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-[#06182B] text-white flex flex-col h-full h-screen overflow-y-auto shrink-0">
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-xl flex-shrink-0">
          <Mountain className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xs font-bold leading-tight">
            AI-Based Early Warning & <br />
            Landslide Risk Monitoring System
          </h1>
          <p className="text-[11px] text-blue-300 mt-0.5">North Eastern Region (NER)</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Risk Level Guide */}
      <div className="px-6 py-3 mt-4 bg-white/5 mx-4 rounded-xl border border-white/5">
        <h3 className="text-[10px] font-bold text-slate-400 mb-2.5 uppercase tracking-wider">
          Risk Level Guide
        </h3>
        <div className="space-y-1.5 text-xs text-slate-300 font-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span>Low</span>
            </div>
            <span className="text-[10px] text-slate-400">(0 – 0.25)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15]" />
              <span>Moderate</span>
            </div>
            <span className="text-[10px] text-slate-400">(0.25 – 0.50)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span>High</span>
            </div>
            <span className="text-[10px] text-slate-400">(0.50 – 0.75)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span>Very High</span>
            </div>
            <span className="text-[10px] text-slate-400">(0.75 – 1.00)</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3 mt-4 bg-[#051424]">
        <div className="w-9 h-12 border border-white/20 rounded flex items-center justify-center opacity-80 shrink-0">
          <span className="text-[8px] text-center p-0.5 leading-tight font-bold">GOI<br/>NER</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          <p className="font-bold text-white">Ministry of Development of North Eastern Region (MDoNER)</p>
          <p className="mt-0.5 text-slate-400">Government of India</p>
        </div>
      </div>
    </div>
  );
}
