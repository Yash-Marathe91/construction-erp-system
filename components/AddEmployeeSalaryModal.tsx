"use client";

import { useState } from "react";
import { X, UserPlus, Wallet, BadgePercent, GraduationCap, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { formatINR } from "@/lib/utils";

interface AddEmployeeSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: any) => void;
}

export function AddEmployeeSalaryModal({ isOpen, onClose, onAdd }: AddEmployeeSalaryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    baseSalary: "",
    pfRate: "12",
    allowance: "15",
    medical: "500"
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold">Configure Employee Payroll</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col col-span-2">
                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Employee Name</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Rahul Sharma"
                   className="w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10"
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Site Role</label>
                 <select 
                    className="w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                 >
                    <option value="">Select Role</option>
                    <option value="Mason">Mason</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Foreman">Foreman</option>
                    <option value="Site Manager">Site Manager</option>
                 </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Base Monthly Pay (₹)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><IndianRupee size={16} /></div>
                  <input 
                    type="number"
                    className="w-full bg-[#fcfcff] border border-gray-100 rounded-xl pl-10 pr-4 py-3.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/5 transition-all"
                    placeholder="45,000"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                 <div className="flex items-center gap-2 mb-0.5">
                    <BadgePercent className="w-3 h-3 text-gray-400" />
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">PF Rate (%)</label>
                 </div>
                 <input 
                   type="number" 
                   className="w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10"
                   value={formData.pfRate}
                   onChange={(e) => setFormData({...formData, pfRate: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5 flex flex-col">
                 <div className="flex items-center gap-2 mb-0.5">
                    <GraduationCap className="w-3 h-3 text-gray-400" />
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Site Allowance (%)</label>
                 </div>
                 <input 
                   type="number" 
                   className="w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10"
                   value={formData.allowance}
                   onChange={(e) => setFormData({...formData, allowance: e.target.value})}
                 />
              </div>
           </div>

           <div className="flex justify-between items-center bg-[#182232] p-5 rounded-2xl text-white shadow-xl shadow-[#182232]/20 border border-white/5">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#feda5a] animate-pulse" />
                 <p className="text-[10px] opacity-70 uppercase font-bold tracking-[0.2em]">Estimated Net</p>
              </div>
              <p className="text-2xl font-heading font-bold text-[#feda5a]">
              {Number(formData.baseSalary || 0) > 0 
                 ? formatINR(Number(formData.baseSalary)) 
                 : "₹0"}
              </p>
           </div>

           <Button 
             onClick={() => {
               onAdd?.(formData);
               onClose();
             }}
             className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] rounded-xl font-heading font-bold flex gap-2"
           >
              Register Payroll Record <ArrowRight className="w-4 h-4" />
           </Button>

        </div>

      </div>
    </div>
  );
}
