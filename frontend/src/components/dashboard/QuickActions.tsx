import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, Download, Map as MapIcon } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex gap-2">
      <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1 flex flex-col h-auto py-2 gap-1">
        <TrendingUp className="w-5 h-5" />
        <span className="text-xs font-semibold">Predict Risk</span>
      </Button>
      <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 flex flex-col h-auto py-2 gap-1">
        <FileText className="w-5 h-5" />
        <span className="text-xs font-semibold">Generate Report</span>
      </Button>
      <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1 flex flex-col h-auto py-2 gap-1">
        <Download className="w-5 h-5" />
        <span className="text-xs font-semibold">Download Data</span>
      </Button>
      <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1 flex flex-col h-auto py-2 gap-1">
        <MapIcon className="w-5 h-5" />
        <span className="text-xs font-semibold">View Map</span>
      </Button>
    </div>
  );
}
