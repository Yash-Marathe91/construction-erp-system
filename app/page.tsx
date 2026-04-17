import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Package, Clock } from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import AIArchitectureDesigner from "@/components/AIArchitectureDesigner";
import { createServerSideClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createServerSideClient();

  // Fetch the latest active project (assuming 1 main active project for demo)
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'Active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Fetch critical/warning alerts
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fallbacks if DB is empty
  const projectName = project?.name || "The Emerald Towers - NCR";
  const totalIncome = project?.total_income || 0;
  const totalExpenses = project?.total_expenses || 0;
  const net = totalIncome - totalExpenses;
  const activeAlerts = alerts || [];

  return (
    <AppLayout>
      <div className="space-y-6 pb-6">
        
        {/* Project Header Widget */}
        <div className="bg-[#f0f3ff] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} />
          </div>
          <div className="relative z-10">
            <h2 className="text-sm font-semibold text-gray-500 font-sans tracking-wide uppercase">Active Project</h2>
            <h1 className="text-3xl font-heading font-bold text-[#182232] mt-1 break-words">{projectName}</h1>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-sans mb-1">Total Income</p>
                <p className="text-2xl font-bold font-heading text-[#002813]">{formatINR(totalIncome)}</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500 font-sans mb-1">Expenses</p>
                  <p className="text-xl font-bold font-heading text-[#ba1a1a]">{formatINR(totalExpenses)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-sans mb-1">Net</p>
                  <p className={`text-lg font-bold font-heading ${net >= 0 ? 'text-[#40b472]' : 'text-[#ba1a1a]'}`}>
                    {net >= 0 ? '+' : ''}{formatINR(net)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Array */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/inventory" className="bg-[#ffffff] rounded-xl p-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 hover:bg-[#f0f3ff] transition-colors">
            <Package className="text-[#182232]" />
            <span className="font-heading font-semibold text-sm">Inventory</span>
          </Link>
          <Link href="/ops" className="bg-[#ffffff] rounded-xl p-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 hover:bg-[#f0f3ff] transition-colors">
            <Clock className="text-[#182232]" />
            <span className="font-heading font-semibold text-sm">Attendance</span>
          </Link>
        </div>

        {/* AI Architecture Designer */}
        <AIArchitectureDesigner />

        {/* Critical Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-lg text-[#182232]">Critical Alerts</h3>
            {activeAlerts.length > 0 && (
              <span className="text-xs bg-[#ffdad6] text-[#93000a] px-2 py-1 rounded-full font-bold">
                {activeAlerts.length} NEW
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${alert.severity === 'critical' ? 'border-[#ba1a1a]' : 'border-[#715c00]'}`}>
                  <CardContent className="p-4 flex gap-4">
                    <AlertCircle className={`${alert.severity === 'critical' ? 'text-[#ba1a1a]' : 'text-[#715c00]'} shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-bold text-sm text-[#121c2c]">{alert.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.description || "No details provided."}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-[#f9f9ff] border-dashed border-2">
                <CardContent className="p-6 text-center text-gray-500 text-sm font-sans">
                  No active alerts. Site is running smoothly.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

      </div>

    </AppLayout>
  );
}
