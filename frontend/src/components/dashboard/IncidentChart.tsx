"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchIncidentSummary, IncidentCategory } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function IncidentChart() {
  const [categories, setCategories] = useState<IncidentCategory[]>([]);
  const [total, setTotal] = useState<number>(156);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const res = await fetchIncidentSummary();
        setCategories(res.categories);
        setTotal(res.total_30d);
      } catch (e) {
        console.error("Failed to load incident summary", e);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  return (
    <Card className="shadow-sm border-slate-100 h-full flex flex-col">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-bold text-slate-800">
          Landslide Incidents (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1 flex-1 flex items-center justify-between">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="relative w-[135px] h-[135px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Total</span>
                <span className="text-2xl font-black text-slate-900 leading-none">{total}</span>
              </div>
            </div>

            <div className="flex-1 ml-4 space-y-1.5">
              {categories.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{item.value}</span>
                    <span className="text-slate-400 text-[10px] w-7 text-right">({item.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
