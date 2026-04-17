"use client";

import { X, ClipboardList, User, Building, MapPin, CheckCircle, Clock, AlertTriangle, ArrowRight, ShieldCheck, FileText, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
}

export function RequestDetailModal({ isOpen, onClose, request }: RequestDetailModalProps) {
  const [status, setStatus] = useState(request?.status || 'Awaiting Approval');

  if (!isOpen || !request) return null;

  const requestDetails = {
    requesterName: "Arjun Verma",
    position: "Junior Engineer",
    siteLocation: request.requester,
    reason: "Critical shortage of safety gear for new batch of labor starting Wednesday.",
    timestamp: "Oct 24, 10:15 AM",
    items: [
      { name: request.name, qty: "45 Units", spec: "ISI Standard - Yellow" },
      { name: "Safety Gloves", qty: "12 pairs", spec: "Heavy Duty leather" }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-[#182232] text-white flex justify-between items-start">
           <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                 <ClipboardList className="w-6 h-6 text-[#feda5a]" />
              </div>
              <div>
                 <h2 className="text-xl font-heading font-bold">{request.name}</h2>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Request ID: {request.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-6 space-y-6 bg-gray-50/30 overflow-y-auto max-h-[75vh]">
           
           {/* Request Status Banner */}
           <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex gap-3 items-center">
                 <div className={`p-2 rounded-full ${status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {status === 'Approved' ? <ShieldCheck size={20} /> : <Clock size={20} />}
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Current Status</p>
                    <p className={`text-sm font-bold ${status === 'Approved' ? 'text-green-700' : 'text-orange-700'}`}>{status}</p>
                 </div>
              </div>
              {request.priority === 'High' && (
                 <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle size={12} /> HIGH PRIORITY
                 </span>
              )}
           </div>

           {/* Requester Info */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Requester Profile</h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 col-span-2">
                    <User className="w-8 h-8 text-gray-300" />
                    <div>
                       <h4 className="font-heading font-bold text-[#182232]">{requestDetails.requesterName}</h4>
                       <p className="text-xs text-gray-400 font-sans font-medium">{requestDetails.position}</p>
                    </div>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-[11px] font-bold text-[#182232]">{requestDetails.siteLocation}</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-[11px] font-bold text-[#182232] font-sans">{requestDetails.timestamp}</p>
                 </div>
              </div>
           </div>

           {/* Request Items */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Requested Resources</h3>
              <div className="bg-[#182232] rounded-2xl p-5 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 opacity-10 pointer-events-none -mt-4 -mr-4">
                    <FileText size={100} />
                 </div>
                 <div className="space-y-4">
                    {requestDetails.items.map((item, i) => (
                       <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                          <div>
                             <p className="text-sm font-bold font-heading">{item.name}</p>
                             <p className="text-[10px] text-gray-400 uppercase font-sans tracking-widest mt-0.5">{item.spec}</p>
                          </div>
                          <p className="text-lg font-heading font-bold text-[#feda5a]">{item.qty}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Reasoning */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Justification</h3>
              <div className="p-4 bg-white rounded-2xl border border-gray-100 italic shadow-sm">
                 <p className="text-xs text-gray-600 leading-relaxed font-sans line-clamp-3">"{requestDetails.reason}"</p>
              </div>
           </div>

           {/* Actions */}
           <div className="pt-2">
              <div className="flex gap-3">
                 <Button 
                   className="flex-1 h-12 bg-[#182232] hover:bg-[#2d3748] rounded-xl font-heading font-bold gap-2 text-white"
                   onClick={() => setStatus('Approved')}
                 >
                    <Send className="w-4 h-4" /> Approve Request
                 </Button>
                 <Button 
                   variant="outline"
                   className="flex-1 h-12 border-2 border-gray-200 rounded-xl font-heading font-bold"
                   onClick={onClose}
                 >
                    Reject Order
                 </Button>
              </div>
              <p className="text-[9px] text-center text-gray-400 font-sans mt-3">Approval will trigger internal procurement notice.</p>
           </div>

        </div>

      </div>
    </div>
  );
}
