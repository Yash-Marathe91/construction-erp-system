"use client";

import { X, DollarSign, PieChart, ShieldCheck, HeartPulse, Building2, UserMinus, Play, Pause, Save, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { formatINR } from "@/lib/utils";

interface SalaryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

export function SalaryDetailModal({ isOpen, onClose, staff }: SalaryDetailModalProps) {
  const [status, setStatus] = useState(staff?.status || 'Active');
  
  if (!isOpen || !staff) return null;

  // Mock distribution calculation
  const base = staff.baseSalary;
  const pf = base * 0.12;
  const medical = 500;
  const allowance = base * 0.15;
  const net = base + allowance - pf - medical;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                <img src={`https://i.pravatar.cc/100?u=${staff.id}`} alt="avatar" className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="font-heading font-bold">{staff.name}</h2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{staff.role} • ID: {staff.id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-gray-50/50">
           
           {/* Distribution Grid */}
           <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border-none shadow-sm">
                 <CardContent className="p-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">PF Contribution</p>
                        <p className="text-xl font-heading font-bold text-[#182232]">{formatINR(pf)}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans">12% contribution</p>
                 </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm">
                 <CardContent className="p-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Medical Allow.</p>
                        <p className="text-xl font-heading font-bold text-[#182232]">{formatINR(medical)}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans">Fixed plan monthly</p>
                 </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm col-span-2">
                 <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="p-2 rounded bg-[#e7ffec]"><DollarSign className="w-6 h-6 text-[#006e33]" /></div>
                       <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Onetime Allowance</p>
                          <p className="text-xl font-heading font-bold text-[#006e33]">{formatINR(allowance)}</p>
                       </div>
                       <div className="text-right">
                       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Net Payable</p>
                       <p className="text-2xl font-heading font-bold text-[#182232] underline underline-offset-4 decoration-[#feda5a] decoration-4">{formatINR(net)}</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Quick Actions Panel */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Management Controls</h3>
              <div className="flex flex-wrap gap-2">
                 <Button 
                   variant="outline" 
                   className="flex-1 bg-white border-gray-200 h-10 text-[11px] font-bold gap-2 text-[#182232]"
                   onClick={() => console.log('Update Salary')}
                 >
                    <Save className="w-3.5 h-3.5" /> Update Pay
                 </Button>
                 {status === 'Paused' ? (
                   <Button 
                     className="flex-1 bg-[#88f9b0] hover:bg-[#68d78f] h-10 text-[11px] font-bold gap-2 text-[#002813]"
                     onClick={() => setStatus('Active')}
                   >
                      <Play className="w-3.5 h-3.5" /> Resume
                   </Button>
                 ) : (
                   <Button 
                     className="flex-1 bg-[#feda5a] hover:bg-[#eac450] h-10 text-[11px] font-bold gap-2 text-[#182232]"
                     onClick={() => setStatus('Paused')}
                   >
                      <Pause className="w-3.5 h-3.5" /> Pause Salary
                   </Button>
                 )}
                 <Button 
                   className="flex-1 bg-[#ffdad6] hover:bg-[#ffb4ab] h-10 text-[11px] font-bold gap-2 text-[#ba1a1a]"
                   onClick={() => console.log('End Contract')}
                 >
                    <UserMinus className="w-3.5 h-3.5" /> End Contract
                 </Button>
              </div>
           </div>

           {/* Compliance Note */}
           <div className="p-4 rounded-xl border border-[#d9e3f9] bg-[#f0f3ff] flex gap-3">
              <FileText className="w-5 h-5 text-[#182232] shrink-0" />
              <p className="text-[10px] text-gray-600 leading-relaxed font-sans italic">
                 Payroll calculated based on **24 working days** this month. Deductions and allowances are approved per site policy v2.4.
              </p>
           </div>

        </div>

      </div>
    </div>
  );
}
