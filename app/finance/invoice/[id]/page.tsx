"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, HardHat, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const invoice = {
    id: id,
    supplier: 'BuildMat Corp',
    date: 'Oct 24, 2024',
    dueDate: 'Nov 24, 2024',
    items: [
      { desc: 'Portland Cement (Type I)', qty: 200, rate: 12.50, amount: 2500 },
      { desc: 'Steel Bars 12mm', qty: 50, rate: 85.00, amount: 4250 },
    ],
    total: 6750,
    status: 'Pending'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation - Hidden in Print */}
        <div className="flex justify-between items-center print:hidden">
          <Link href="/finance?tab=invoices">
            <Button variant="ghost" className="text-[#182232]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <Button onClick={() => window.print()} className="bg-[#182232] text-white">
            <Printer className="w-4 h-4 mr-2" /> Print to PDF
          </Button>
        </div>

        {/* Invoice Container */}
        <Card className="bg-white shadow-xl border-none overflow-hidden rounded-none sm:rounded-2xl print:shadow-none print:m-0 print:w-full">
          <CardContent className="p-0">
            
            {/* Invoice Header */}
            <div className="bg-[#182232] p-8 text-white flex flex-col sm:flex-row justify-between gap-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <HardHat className="w-8 h-8 text-[#feda5a]" />
                     <h1 className="text-2xl font-heading font-bold">SITE<span className="text-[#feda5a]">SYNC</span></h1>
                  </div>
                  <div className="text-sm opacity-60 space-y-1">
                     <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> 122 Industrial Zone, Dubai UAE</p>
                     <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> billing@sitesync.co</p>
                  </div>
               </div>
               <div className="text-right flex flex-col justify-end">
                  <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">Invoice Number</p>
                  <p className="text-3xl font-heading font-bold">#{id}</p>
               </div>
            </div>

            {/* Billing Info */}
            <div className="p-8 grid grid-cols-2 gap-8 border-b border-gray-100">
               <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Billed From</p>
                  <h4 className="font-heading font-bold text-[#182232] mb-1">{invoice.supplier}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                     Registered Supplier ID: SUP-9021<br/>
                     Primary Logistics Hub, Building 4<br/>
                     tax-id: DE-90210022
                  </p>
               </div>
               <div className="text-right">
                  <div className="mb-4">
                     <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Issue Date</p>
                     <p className="text-sm font-bold text-[#182232]">{invoice.date}</p>
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Status</p>
                     <span className="bg-[#feda5a]/30 text-[#745f00] px-3 py-1 rounded-full text-[10px] font-bold inline-block">{invoice.status}</span>
                  </div>
               </div>
            </div>

            {/* Invoice Items Table */}
            <div className="p-8">
               <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 font-sans">Description</th>
                      <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 font-sans text-center">Qty</th>
                      <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 font-sans text-right">Rate</th>
                      <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 font-sans text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item, i) => (
                      <tr key={i} className="text-sm">
                        <td className="py-5 font-semibold text-[#182232]">{item.desc}</td>
                        <td className="py-5 text-gray-500 text-center font-sans">{item.qty}</td>
                        <td className="py-5 text-right font-sans">{formatINR(item.rate)}</td>
                        <td className="py-5 font-heading font-bold text-[#182232] text-right">{formatINR(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            {/* Summary & Footer */}
            <div className="p-8 bg-gray-50 flex justify-end">
               <div className="w-full max-w-[240px] space-y-3">
                  <div className="flex justify-between text-xs text-gray-500">
                     <span>Subtotal</span>
                     <span>{formatINR(invoice.total)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                     <span>Tax (0%)</span>
                     <span>{formatINR(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                     <span className="font-heading font-bold text-[#182232]">Grand Total</span>
                     <span className="text-2xl font-heading font-bold text-[#182232]">{formatINR(invoice.total)}</span>
                  </div>
               </div>
            </div>

            <div className="p-8 text-center border-t border-gray-100">
               <p className="text-[10px] text-gray-400 font-sans">Thank you for choosing Sitesync. This is a computer-generated invoice and doesn't require a signature.</p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
