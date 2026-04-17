"use client";

import { useState } from "react";
import { X, UserPlus, Mail, Shield, Check, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Coordinator");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg">Invite New Staff</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#f0f3ff] p-4 rounded-xl flex items-center gap-3">
             <Shield className="w-6 h-6 text-[#182232]" />
             <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">Security Protocol</p>
                <p className="text-xs text-[#182232] font-sans">Invited users will receive a secure join link via email.</p>
             </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Official Email Address</label>
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                type="email" 
                placeholder="staff.name@sitesync.co"
                className="w-full bg-[#f0f3ff] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
             <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Access Role</label>
             <select 
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans appearance-none mb-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Coordinator</option>
              <option>Accountant</option>
              <option>Site Manager</option>
              <option>Safety Inspector</option>
            </select>
            <div className="flex flex-wrap gap-2">
               <span className="flex items-center gap-1 bg-[#88f9b0]/20 text-[#002813] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tight"><Check className="w-2.5 h-2.5" /> Dashboard Access</span>
               <span className="flex items-center gap-1 bg-[#88f9b0]/20 text-[#002813] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tight"><Check className="w-2.5 h-2.5" /> Logs Visibility</span>
               {role === 'Site Manager' && <span className="flex items-center gap-1 bg-[#88f9b0]/20 text-[#002813] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tight"><Check className="w-2.5 h-2.5" /> Site Registry Add</span>}
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] text-white font-heading font-bold shadow-lg flex gap-2">
               Send Invitation Link
            </Button>
            <p className="text-center text-[9px] text-gray-400 mt-4 font-sans italic lowercase">
               Link expires in 24 hours. Single-use only.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
