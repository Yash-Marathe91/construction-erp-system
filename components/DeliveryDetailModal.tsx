"use client";

import { X, Truck, Calendar, User, Phone, Mail, MapPin, Package, ShieldAlert, CheckCircle, Trash2, Edit3, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface DeliveryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
}

export function DeliveryDetailModal({ isOpen, onClose, delivery }: DeliveryDetailModalProps) {
  const [status, setStatus] = useState(delivery?.status || 'Pending');

  if (!isOpen || !delivery) return null;

  const contactDetails = {
    dealer: "Nitin Malhotra",
    company: delivery.supplier,
    phone: "+91 98765-43210",
    email: "contact@buildmat.com",
    address: "Warehouse Block C, Okhla Phase III, Delhi"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header with Background Pattern */}
        <div className="relative p-6 bg-[#182232] text-white overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Truck size={120} />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Truck className="w-8 h-8 text-[#feda5a]" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold">{delivery.name}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-0.5">Order ID: {delivery.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 flex gap-3">
             <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight flex items-center gap-1.5 ${
                status === 'In Transit' ? 'bg-[#feda5a] text-[#182232]' : 
                status === 'Pending' ? 'bg-[#e7eeff] text-[#182232]' :
                'bg-[#88f9b0] text-[#002813]'
             }`}>
                {status === 'In Transit' ? <ArrowRight className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {status}
             </span>
             <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight bg-white/10 border border-white/20 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> {delivery.expected}
             </span>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-[#fcfcfc]">
           
           {/* Dealer Information Section */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Supplier Contacts</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-[#f0f3ff] flex items-center justify-center">
                       <User className="w-6 h-6 text-[#182232]" />
                    </div>
                    <div>
                       <h4 className="font-heading font-bold text-[#182232]">{contactDetails.dealer}</h4>
                       <p className="text-xs text-gray-500 font-sans font-medium">{contactDetails.company}</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Phone className="w-4 h-4 text-gray-400" />
                       </div>
                       <p className="text-xs font-bold text-[#182232]">{contactDetails.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Mail className="w-4 h-4 text-gray-400" />
                       </div>
                       <p className="text-xs font-bold text-[#182232] font-sans truncate">{contactDetails.email}</p>
                    </div>
                 </div>

                 <div className="flex gap-3 pt-2">
                    <MapPin className="w-4 h-4 text-gray-300 mt-0.5" />
                    <p className="text-xs text-gray-500 font-sans leading-relaxed italic">{contactDetails.address}</p>
                 </div>
              </div>
           </div>

           {/* Delivery Details Section */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Package Info</h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col gap-1">
                    <Package className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Item Quantity</p>
                    <p className="text-lg font-heading font-bold text-[#182232]">22.5 <span className="text-xs font-sans text-gray-500">Tons</span></p>
                 </div>
                 <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col gap-1">
                    <ShieldAlert className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Handling</p>
                    <p className="text-lg font-heading font-bold text-[#182232]">High <span className="text-xs font-sans text-gray-500">Priority</span></p>
                 </div>
              </div>
           </div>

           {/* Quick Actions Panel */}
           <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Management Controls</h3>
              <div className="flex flex-col gap-3">
                 <div className="flex gap-3">
                    <Button 
                      className="flex-1 h-12 bg-[#182232] hover:bg-[#2d3748] rounded-xl font-heading font-bold gap-2 shadow-lg shadow-[#182232]/10"
                      onClick={() => setStatus('Delivered')}
                    >
                       <Edit3 className="w-4 h-4" /> Update Delivery
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 border-2 border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl font-heading font-bold gap-2"
                      onClick={() => console.log('Cancel Order')}
                    >
                       <Trash2 className="w-4 h-4" /> Cancel Order
                    </Button>
                 </div>
                 <p className="text-[9px] text-center text-gray-400 font-sans italic">
                    All actions are logged in the transaction audit ledger.
                 </p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
