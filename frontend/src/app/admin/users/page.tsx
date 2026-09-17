import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ArrowLeft, Shield, UserCheck } from "lucide-react";
import Link from "next/link";

export default function UserManagementPage() {
  const users = [
    { name: "Dr. Rajesh Sharma", role: "Administrator", email: "admin@ner-disaster.gov.in", status: "Active" },
    { name: "Tashi Dorjee", role: "District Officer (East Sikkim)", email: "tashi.dorjee@sikkim.gov.in", status: "Active" },
    { name: "Ananya Barua", role: "Disaster Management Officer", email: "ananya.barua@assam.gov.in", status: "Active" },
    { name: "Lalmuanpuia", role: "Field Officer (Champhai)", email: "lalmuanpuia@mizoram.gov.in", status: "Active" },
    { name: "Kiren Riba", role: "Field Officer (West Kameng)", email: "kiren.riba@arunachal.gov.in", status: "Active" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" />
          Role-Based Access Control & User Directory
        </h1>
        <p className="text-sm text-slate-500">
          Manage District Magistrates, State Disaster Officers, Field Inspection Crews, and System Administrators
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold text-slate-800">
            Authorized Personnel Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Officer Name</th>
                  <th className="p-3.5">Designation & Role</th>
                  <th className="p-3.5">Official Email</th>
                  <th className="p-3.5">Access Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5">{u.role}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{u.email}</td>
                    <td className="p-3.5">
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
