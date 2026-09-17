import { Search, CloudRain, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 z-10 shadow-sm">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          type="text" 
          placeholder="Search location..." 
          className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-md"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-8">
        {/* Weather */}
        <div className="flex items-center gap-3 text-slate-700">
          <CloudRain className="w-8 h-8 text-blue-500" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">24°C</span>
            <span className="text-xs text-slate-500 font-medium">Light Rain</span>
          </div>
        </div>

        <div className="w-px h-10 bg-slate-200" />

        {/* Notifications */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            5
          </span>
        </button>

        <div className="w-px h-10 bg-slate-200" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">Admin</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
