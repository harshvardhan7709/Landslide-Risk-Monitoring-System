import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  secondaryText: string;
  icon: ReactNode;
  iconBgColor?: string;
  trend?: "up" | "down" | "neutral";
}

export function KpiCard({ title, value, secondaryText, icon, iconBgColor = "bg-blue-100", trend }: KpiCardProps) {
  return (
    <Card className="shadow-sm border-slate-100 overflow-hidden">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">{title}</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 leading-none">{value}</span>
          <span className={`text-xs mt-1 font-medium ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-slate-500"
          }`}>
            {secondaryText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
