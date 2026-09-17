import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mountain, ArrowLeft, Shield, Cpu, Database, Satellite } from "lucide-react";
import Link from "next/link";

export default function AboutSystemPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Mountain className="w-7 h-7 text-blue-600" />
          About the NER Landslide Early Warning System
        </h1>
        <p className="text-sm text-slate-500">
          State-of-the-art AI and spatial decision-support platform designed for the Ministry of Development of North Eastern Region (MDoNER)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-sm border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Cpu className="w-5 h-5 text-blue-600" /> AI/ML Susceptibility Architecture
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Combines XGBoost gradient boosted decision trees with SHAP explainability. Integrates multi-temporal precipitation indices, topographic wetness index, digital elevation models (DEM), slope aspect, and geological lithology.
          </p>
        </Card>

        <Card className="shadow-sm border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Satellite className="w-5 h-5 text-indigo-600" /> Multi-Source Earth Observation
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ingests NASA GPM IMERG precipitation, Sentinel-1 InSAR surface deformation, Sentinel-2 NDVI vegetative health, and ground IoT geotechnical inclinometers across all 8 North Eastern states.
          </p>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 p-6 bg-slate-900 text-white">
        <h3 className="font-bold text-base mb-2">Government of India • Disaster Resilience Mission</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Engineered to provide actionable, low-latency early warning advisories to National Disaster Response Force (NDRF), State Disaster Management Authorities (SDMA), and remote mountain communities across Sikkim, Arunachal Pradesh, Assam, Meghalaya, Mizoram, Nagaland, Manipur, and Tripura.
        </p>
      </Card>
    </div>
  );
}
