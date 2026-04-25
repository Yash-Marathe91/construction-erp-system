import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, ArrowDownRight, CircleDollarSign, CreditCard, Receipt, TrendingUp, TrendingDown, Eye, Download } from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { FinanceActions } from "@/components/FinanceActions";
import { ExportPDFButton } from "@/components/ExportPDFButton";
import { FullReportButton } from "@/components/FullReportButton";
import { createServerSideClient } from "@/lib/supabase-server";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentTab = (await searchParams).tab || "overview";
  const supabase = await createServerSideClient();

  // Fetch real invoices from Supabase
  const { data: dbInvoices } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch real payments from Supabase
  const { data: dbPayments } = await supabase
    .from('payments')
    .select('*')
    .order('payment_date', { ascending: false });

  // Map database fields to the UI format
  const invoices = (dbInvoices || []).map(inv => ({
    id: inv.invoice_number,
    supplier: inv.vendor_name,
    amount: inv.amount,
    status: inv.status,
    date: new Date(inv.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }));

  const payments = (dbPayments || []).map(py => ({
    id: py.id,
    recipient: py.recipient,
    amount: py.amount,
    method: py.method,
    date: new Date(py.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    type: py.type
  }));

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#182232]">Finance</h1>
            <p className="text-sm text-gray-500 font-sans">Invoices & Profitability</p>
          </div>
          <FinanceActions />
        </div>

        {/* Tonal Segmented Control */}
        <div className="flex bg-[#e7eeff] rounded-lg p-1">
          <Link href="/finance?tab=overview" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'overview' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Overview
          </Link>
          <Link href="/finance?tab=invoices" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'invoices' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Invoices
          </Link>
          <Link href="/finance?tab=payments" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'payments' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Payments
          </Link>
        </div>

        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="space-y-4">
              <div className="bg-[#182232] rounded-xl p-5 text-white relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <CircleDollarSign size={120} />
                </div>
                <p className="text-sm font-sans text-gray-400 mb-1">Total Net Profit</p>
                <h2 className="text-4xl font-heading font-bold mb-4">{formatINR(26803000)}</h2>
                
                <div className="flex bg-black/20 rounded-lg p-3 justify-between items-center backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#88f9b0]/20 p-2 rounded">
                      <ArrowUpRight className="w-4 h-4 text-[#88f9b0]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Income</p>
                      <p className="font-heading font-bold">{formatINR(48200000)}</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/20 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#ffdad6]/20 p-2 rounded">
                      <ArrowDownRight className="w-4 h-4 text-[#ffdad6]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Expense</p>
                      <p className="font-heading font-bold">{formatINR(21400000)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Section - Combined */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-[#182232] text-lg">Transaction History</h3>
                <FullReportButton />

              </div>
              <div className="space-y-3">
                {invoices.slice(0, 2).map((inv) => (
                  <Card key={inv.id} className="bg-[#ffffff]">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-heading font-semibold text-[#182232]">{inv.supplier}</h4>
                          <p className="text-xs text-gray-500 font-sans">{inv.id} • Invoice</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold text-[#ba1a1a]">-{formatINR(inv.amount)}</p>
                        <p className="text-[10px] text-gray-400">{inv.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'invoices' && (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <Card key={inv.id} className="bg-[#ffffff]">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#182232]" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-[#182232]">{inv.supplier}</h4>
                      <p className="text-xs text-gray-500 font-sans">{inv.id} • {inv.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-[#182232]">{formatINR(inv.amount)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                      inv.status === 'Paid' ? 'bg-[#88f9b0]/20 text-[#002813]' : 
                      inv.status === 'Overdue' ? 'bg-[#ffdad6] text-[#93000a]' :
                      'bg-[#feda5a]/30 text-[#745f00]'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </CardContent>
                <div className="bg-[#f0f3ff] px-4 py-2 flex justify-between items-center rounded-b-xl border-t border-gray-100">
                  <Link href={`/finance/invoice/${inv.id}`} className="text-[10px] font-bold text-[#182232] flex items-center gap-1 hover:text-[#715c00]">
                    <Eye className="w-3 h-3" /> View Detail
                  </Link>
                  <ExportPDFButton />
                </div>
              </Card>
            ))}
          </div>
        )}

        {currentTab === 'payments' && (
          <div className="space-y-3">
            {payments.map((py) => (
              <Card key={py.id} className="bg-[#ffffff]">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${py.type === 'Incoming' ? 'bg-[#88f9b0]/20' : 'bg-[#ffdad6]/20'}`}>
                      {py.type === 'Incoming' ? <TrendingUp className="w-5 h-5 text-[#002813]" /> : <TrendingDown className="w-5 h-5 text-[#93000a]" />}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-[#182232]">{py.recipient}</h4>
                      <p className="text-xs text-gray-500 font-sans">{py.method} • {py.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-heading font-bold ${py.type === 'Incoming' ? 'text-[#002813]' : 'text-[#ba1a1a]'}`}>
                      {py.type === 'Incoming' ? '+' : '-'}{formatINR(py.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-sans">{py.id}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
