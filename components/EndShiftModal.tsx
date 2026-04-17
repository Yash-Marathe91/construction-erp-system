"use client";

import { useState } from "react";
import { X, Clock, CheckCircle, AlertCircle, FileSpreadsheet, Lock, Users, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface EndShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
}

export function EndShiftModal({ isOpen, onClose, siteName }: EndShiftModalProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProcess = () => {
     setIsProcessing(true);
     setTimeout(() => {
        setIsProcessing(false);
        setStep(2);
     }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold">End Operational Shift</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
           
           {step === 1 ? (
              <div className="space-y-6">
                 <div className="bg-[#f0f3ff] p-4 rounded-xl border border-[#d9e3f9]">
                    <div className="flex gap-4 items-start">
                       <MapPin className="w-5 h-5 text-[#182232] mt-1" />
                       <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Current Site</p>
                          <h4 className="font-heading font-bold text-[#182232]">{siteName}</h4>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Pre-Closing Checklist</h3>
                    <div className="space-y-2">
                       {[
                         { icon: Users, label: "Automatic Check-out", desc: "Clock out 142 active workers" },
                         { icon: FileSpreadsheet, label: "Daily Summary", desc: "Generate shift efficiency report" },
                         { icon: Lock, label: "Attendance Freeze", desc: "Lock historical edits for this date" },
                       ].map((item, i) => (
                         <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                               <item.icon className="w-4 h-4 text-[#182232]" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-[#182232]">{item.label}</p>
                               <p className="text-[10px] text-gray-400 font-sans">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-4 bg-[#fff9ea] rounded-xl border border-[#feda5a]/30 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-[#715c00] shrink-0" />
                    <p className="text-[10px] text-[#715c00] leading-relaxed font-sans">
                       **Note:** Ending the shift will notify the Admin Panel. You won't be able to log more attendance for this site until tomorrow morning.
                    </p>
                 </div>

                 <Button 
                   onClick={handleProcess}
                   disabled={isProcessing}
                   className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] rounded-xl font-heading font-bold shadow-lg flex gap-2"
                 >
                    {isProcessing ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                       <>Confirm & Close Shift <ArrowRight className="w-4 h-4" /></>
                    )}
                 </Button>
              </div>
           ) : (
              <div className="text-center py-8 space-y-6">
                 <div className="w-20 h-20 bg-[#88f9b0]/20 rounded-full flex items-center justify-center mx-auto scale-110 animate-in zoom-in duration-500">
                    <ShieldCheck className="w-10 h-10 text-[#002813]" />
                 </div>
                 
                 <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-[#182232]">Shift Secured</h2>
                    <p className="text-sm text-gray-500 font-sans max-w-[80%] mx-auto">
                       Today's operational logs have been verified and locked. The site is now officially closed.
                    </p>
                 </div>

                 <div className="bg-[#f0f3ff] p-4 rounded-xl text-left border border-[#d9e3f9] divide-y divide-[#d9e3f9]">
                    <div className="pb-2 flex justify-between items-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Total Workforce</span>
                       <span className="text-sm font-bold text-[#182232]">142 Logs</span>
                    </div>
                    <div className="py-2 flex justify-between items-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Efficiency Score</span>
                       <span className="text-sm font-bold text-[#002813]">94.2%</span>
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Reports Sent</span>
                       <span className="text-[10px] bg-[#182232] text-white px-2 py-0.5 rounded font-bold">SUCCESS</span>
                    </div>
                 </div>

                 <Button 
                   onClick={onClose}
                   className="w-full h-12 bg-[#182232] rounded-xl font-heading font-bold"
                 >
                    Return to Operations
                 </Button>
              </div>
           )}

        </div>

      </div>
    </div>
  );
}
