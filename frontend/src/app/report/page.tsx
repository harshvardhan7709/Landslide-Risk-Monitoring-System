"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Camera, MapPin, Send, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Report {
  id: number;
  report_code: string;
  hazard_type: string;
  description: string;
  location_name: string;
  state_name: string;
  status: string;
  created_at: string;
  verified_by?: string;
}

export default function CitizenReportingPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [hazardType, setHazardType] = useState("Landslide");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("Gangtok - Rongli Road");
  const [stateName, setStateName] = useState("Sikkim");
  const [latitude, setLatitude] = useState(27.3389);
  const [longitude, setLongitude] = useState(88.6065);
  const [reporterName, setReporterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/citizen-reports");
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGeoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(4)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(4)));
          alert(`GPS Location Acquired: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => alert("GPS permission denied. Using default NER coordinates.")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/citizen-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hazard_type: hazardType,
          description,
          location_name: locationName,
          state_name: stateName,
          latitude,
          longitude,
          reporter_name: reporterName || "Local Citizen"
        })
      });
      if (res.ok) {
        setSuccessMsg("Hazard report submitted successfully! Status: Pending Verification by Field Officer.");
        setDescription("");
        loadReports();
      }
    } catch (e) {
      alert("Error submitting report.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (reportId: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/citizen-reports/${reportId}/verify?status=Verified&verified_by=District%20Officer`, {
        method: "PATCH"
      });
      loadReports();
    } catch (e) {
      alert("Verification failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <AlertCircle className="w-7 h-7 text-amber-500" />
          Citizen & Field Officer Hazard Reporting
        </h1>
        <p className="text-sm text-slate-500">
          Crowdsourced geo-tagged slope movement, crack discovery, rockfall, and road blockage reports for NER
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submit Form */}
        <div className="lg:col-span-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-slate-800">
                Submit New Geo-Tagged Hazard Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hazard Category</label>
                  <Select value={hazardType} onValueChange={(val) => val && setHazardType(val)}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Landslide">Landslide / Mudslide</SelectItem>
                      <SelectItem value="Crack">Slope / Road Tension Crack</SelectItem>
                      <SelectItem value="Slope movement">Active Slope Creep</SelectItem>
                      <SelectItem value="Falling rocks">Falling Rocks / Boulder Debris</SelectItem>
                      <SelectItem value="Blocked road">Highway / Road Blocked</SelectItem>
                      <SelectItem value="Flooding">Flash Flooding / Debris Flow</SelectItem>
                      <SelectItem value="Other">Other Geological Anomaly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Location / Landmark</label>
                    <Input 
                      value={locationName} 
                      onChange={e => setLocationName(e.target.value)}
                      placeholder="e.g. NH-10 29th Mile"
                      className="bg-slate-50 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                    <Select value={stateName} onValueChange={(val) => val && setStateName(val)}>
                      <SelectTrigger className="bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sikkim">Sikkim</SelectItem>
                        <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                        <SelectItem value="Assam">Assam</SelectItem>
                        <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="Mizoram">Mizoram</SelectItem>
                        <SelectItem value="Nagaland">Nagaland</SelectItem>
                        <SelectItem value="Manipur">Manipur</SelectItem>
                        <SelectItem value="Tripura">Tripura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Latitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      value={latitude} 
                      onChange={e => setLatitude(parseFloat(e.target.value))}
                      className="bg-slate-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Longitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      value={longitude} 
                      onChange={e => setLongitude(parseFloat(e.target.value))}
                      className="bg-slate-50 text-sm"
                    />
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGeoLocate}
                  className="w-full text-xs font-semibold gap-2 border-slate-300"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Auto-Capture Current GPS Coordinates
                </Button>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description & Field Observations</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe crack length, mud runoff, structural damage, or traffic blockage..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-sm focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="border border-dashed border-slate-300 p-4 rounded-lg text-center bg-slate-50/50">
                  <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium block">
                    Upload Geo-Tagged Photo / Video (Mock Storage)
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, MP4 up to 50MB</span>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Hazard Incident
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports List */}
        <div className="lg:col-span-6">
          <Card className="shadow-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-800">
                Incident Reports Stream ({reports.length})
              </CardTitle>
              <span className="text-xs text-slate-500 font-medium">Field Officer Mode</span>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{r.hazard_type}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {r.report_code}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === "Verified" 
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{r.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t">
                    <span>📍 {r.location_name}, {r.state_name}</span>
                    {r.status === "Pending Verification" && (
                      <button 
                        onClick={() => handleVerify(r.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded"
                      >
                        ✓ Mark Verified
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
