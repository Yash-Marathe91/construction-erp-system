import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, ArrowDownRight, CircleDollarSign, CreditCard, Receipt, TrendingUp, TrendingDown, Eye, Download } from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { FinanceActions } from "@/components/FinanceActions";
import { ExportPDFButton } from "@/components/ExportPDFButton";
import { FullReportButton } from "@/components/FullReportButton";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentTab = (await searchParams).tab || "overview";

  const invoices = [
    { id: 'INV-4029', supplier: 'Jai Mat Cement', amount: 45000, status: 'Pending', date: 'Oct 24, 2024' },
    { id: 'INV-4028', supplier: 'Tata Steel Ltd', amount: 120000, status: 'Paid', date: 'Oct 20, 2024' },
    { id: 'INV-4027', supplier: 'UltraTech Pro', amount: 35000, status: 'Overdue', date: 'Oct 15, 2024' },
  ];

  const payments = [
    { id: 'PAY-901', recipient: 'Mahindra Logistics', amount: 25000, method: 'Bank Transfer', date: 'Oct 23, 2024', type: 'Outgoing' },
    { id: 'PAY-902', recipient: 'Client: DLF Phase 5', amount: 150000, method: 'Check', date: 'Oct 22, 2024', type: 'Incoming' },
  ];

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
