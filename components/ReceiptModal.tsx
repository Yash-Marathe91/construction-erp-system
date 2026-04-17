"use client";

import { X, FileText, Download, Printer, CheckCircle, MapPin, Calendar, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { formatINR } from "@/lib/utils";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

export function ReceiptModal({ isOpen, onClose, payment }: ReceiptModalProps) {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Receipt Header */}
        <div className="bg-[#182232] p-6 text-white text-center relative">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-12 h-12 bg-[#feda5a] rounded-full mx-auto flex items-center justify-center mb-3">
             <FileText className="w-6 h-6 text-[#182232]" />
          </div>
          <h2 className="text-xl font-heading font-bold">Transaction Receipt</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Sitesync Financial Systems</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
             <div className="flex items-center gap-1.5 bg-[#88f9b0]/20 text-[#002813] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                <CheckCircle className="w-3 h-3" />
                Successfully Disbursed
             </div>
          </div>

          {/* Amount Section */}
          <div className="text-center py-4 border-y border-dashed border-gray-200">
             <p className="text-xs text-gray-500 font-sans uppercase mb-1">Total Amount Paid</p>
             <h1 className="text-4xl font-heading font-bold text-[#182232]">{formatINR(payment.amount)}</h1>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Recipient Group</p>
                <p className="text-xs font-semibold text-[#182232]">{payment.group}</p>
             </div>
             <div className="space-y-1 text-right">
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Reference ID</p>
                <p className="text-xs font-semibold text-[#182232] font-mono">{payment.id}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Payment Date</p>
                <div className="flex items-center gap-1 text-[#182232]">
                   <Calendar className="w-3 h-3 opacity-40" />
                   <p className="text-xs font-semibold">Oct 24, 2024</p>
                </div>
             </div>
             <div className="space-y-1 text-right">
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Disbursement Type</p>
                <div className="flex items-center gap-1 justify-end text-[#182232]">
                   <CreditCard className="w-3 h-3 opacity-40" />
                   <p className="text-xs font-semibold">Bank Transfer</p>
                </div>
             </div>
          </div>

          {/* Location / Site */}
          <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
             <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
             <div>
                <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">Authorization Site</p>
                <p className="text-xs text-[#182232] font-medium leading-tight">Sector 4 Residency HQ, Nashik Industrial Hub</p>
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex gap-2">
           <Button variant="outline" className="flex-1 h-11 rounded-xl text-xs font-bold border-gray-200" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" /> Download Ref
           </Button>
           <Button className="flex-1 h-11 bg-[#182232] hover:bg-[#2d3748] rounded-xl text-xs font-bold shadow-lg shadow-[#182232]/20">
              <Printer className="w-4 h-4 mr-2" /> Print PDF
           </Button>
        </div>

        <p className="text-center text-[8px] text-gray-300 font-sans uppercase mb-6 tracking-tighter italic">
          This digital receipt is authenticated by Sitesync Audit Logs
        </p>

      </div>
    </div>
  );
}
