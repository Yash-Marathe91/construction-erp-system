"use client";

import { useState } from "react";
import { X, FileSpreadsheet, Download, Printer, Search, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { formatINR } from "@/lib/utils";

interface TransactionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
}

export function TransactionReportModal({ isOpen, onClose, transactions }: TransactionReportModalProps) {
  const [startDate, setStartDate] = useState("2024-10-01");
  const [endDate, setEndDate] = useState("2024-10-31");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-[#182232] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#feda5a] p-2 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-[#182232]" />
             </div>
             <div>
                <h2 className="font-heading font-bold text-xl">Transaction Audit Report</h2>
                <p className="text-xs text-gray-400 font-sans">KBT Construction Group • FY 2024-25</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden sm:flex" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Print PDF
             </Button>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input type="text" placeholder="Filter by ID or Ref..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10" />
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 self-start">
                 <Calendar className="w-3 h-3 text-gray-400" />
                 <input 
                  type="date" 
                  className="text-[10px] font-sans outline-none bg-transparent"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                 />
                 <span className="text-[10px] text-gray-300">to</span>
                 <input 
                  type="date" 
                  className="text-[10px] font-sans outline-none bg-transparent"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                 />
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#002813]"></div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inflow</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#ba1a1a]"></div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outflow</span>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 sm:p-6 bg-white print:p-0">
           <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-white z-10">
                 <tr className="border-b border-gray-100">
                    <th className="py-4 px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date & Ref</th>
                    <th className="py-4 px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Entity / Supplier</th>
                    <th className="py-4 px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Type</th>
                    <th className="py-4 px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider text-right">Debit</th>
                    <th className="py-4 px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider text-right">Credit</th>
                    <th className="py-4 px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider text-right">Balance</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {/* Mock rows for full report */}
                 {[
                   { date: 'Oct 24, 2024', ref: 'INV-4029', entity: 'BuildMat Corp', type: 'Purchase', debit: 45000, credit: 0, balance: 2680300 },
                   { date: 'Oct 23, 2024', ref: 'PAY-901', entity: 'Concrete Logistics', type: 'Freight', debit: 25000, credit: 0, balance: 2725300 },
                   { date: 'Oct 22, 2024', ref: 'PAY-902', entity: 'Client: Sector 4', type: 'Progress Receipt', debit: 0, credit: 150000, balance: 2750300 },
                   { date: 'Oct 20, 2024', ref: 'INV-4028', entity: 'SteelWorks Ltd', type: 'Materials', debit: 120000, credit: 0, balance: 2600300 },
                   { date: 'Oct 18, 2024', ref: 'PAY-899', entity: 'Labor Roster W42', type: 'Payroll', debit: 65000, credit: 0, balance: 2720300 },
                   { date: 'Oct 15, 2024', ref: 'INV-4027', entity: 'Cement Pro', type: 'Purchase', debit: 35000, credit: 0, balance: 2785300 },
                 ].filter(row => {
                    const rowDate = new Date(row.date).getTime();
                    return rowDate >= new Date(startDate).getTime() && rowDate <= new Date(endDate).getTime();
                 }).map((row, i) => (
                   <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                         <p className="text-sm font-sans text-gray-500 font-medium">{row.date}</p>
                         <p className="text-[10px] text-gray-400 font-mono tracking-tighter">REF: {row.ref}</p>
                      </td>
                      <td className="py-4 px-4">
                         <p className="font-heading font-bold text-[#182232] text-sm">{row.entity}</p>
                         <p className="text-[10px] text-gray-400 font-sans italic">{row.type}</p>
                      </td>
                      <td className="py-4 px-4">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${row.credit > 0 ? 'bg-[#88f9b0]/20 text-[#002813]' : 'bg-[#ffdad6]/20 text-[#93000a]'}`}>
                            {row.credit > 0 ? 'Credit' : 'Debit'}
                         </span>
                      </td>
                      <td className={`py-4 px-4 text-right font-heading font-bold ${row.debit > 0 ? 'text-[#ba1a1a]' : 'text-gray-300'}`}>
                         {row.debit > 0 ? `-${formatINR(row.debit)}` : '—'}
                      </td>
                      <td className={`py-4 px-4 text-right font-heading font-bold ${row.credit > 0 ? 'text-[#002813]' : 'text-gray-300'}`}>
                         {row.credit > 0 ? `+${formatINR(row.credit)}` : '—'}
                      </td>
                      <td className="py-4 px-4 text-right font-heading font-bold text-[#182232]">
                         {formatINR(row.balance)}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Footer Sums */}
        <div className="p-6 bg-[#f0f3ff] border-t flex justify-between items-center">
           <div className="flex gap-8">
              <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Debit</p>
                 <p className="font-heading font-bold text-[#ba1a1a] text-lg">{formatINR(2900000)}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Credit</p>
                 <p className="font-heading font-bold text-[#002813] text-lg">{formatINR(1500000)}</p>
              </div>
           </div>
           <Button 
            className="bg-[#182232] hover:bg-[#2d3748] rounded-xl h-11 px-6 font-heading font-bold shadow-lg"
            onClick={() => window.print()}
           >
              <Download className="w-4 h-4 mr-2" /> Export to PDF
           </Button>
        </div>

      </div>
    </div>
  );
}
