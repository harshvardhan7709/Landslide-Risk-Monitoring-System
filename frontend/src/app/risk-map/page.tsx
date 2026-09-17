"use client";

import { RiskMap } from "@/components/dashboard/RiskMap";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import Link from "next/link";

export default function RiskMapPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-blue-600" />
            Full-Screen Interactive GIS Risk Map (NER)
          </h1>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          POSTGIS SPATIAL LAYER
        </span>
      </div>

      <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200">
        <RiskMap />
      </div>
    </div>
  );
}
