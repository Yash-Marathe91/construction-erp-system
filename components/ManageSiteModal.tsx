"use client";

import { useState } from "react";
import { X, Settings, Users, ClipboardList, MapPin, Trash2, Archive, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface ManageSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: { name: string; location: string } | null;
}

export function ManageSiteModal({ isOpen, onClose, site }: ManageSiteModalProps) {
  if (!isOpen || !site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg">Manage: {site.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-[#f0f3ff] rounded-xl p-4 flex gap-4 items-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#182232]" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 font-sans uppercase">Hub Location</p>
                <p className="font-heading font-bold text-[#182232]">{site.location}</p>
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">Quick Admin Tools</h4>
             
             <button className="w-full text-left bg-white p-4 rounded-xl flex justify-between items-center border border-[#f0f3ff] hover:bg-[#f9f9ff] transition-all group">
                <div className="flex items-center gap-3">
                   <Users className="w-5 h-5 text-[#715c00]" />
                   <span className="font-heading font-bold text-sm text-[#182232]">Edit User Access</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">CONFIGURE</div>
             </button>

             <button className="w-full text-left bg-white p-4 rounded-xl flex justify-between items-center border border-[#f0f3ff] hover:bg-[#f9f9ff] transition-all group">
                <div className="flex items-center gap-3">
                   <ClipboardList className="w-5 h-5 text-[#182232]" />
                   <span className="font-heading font-bold text-sm text-[#182232]">Export Site Logs</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">DOWNLOAD</div>
             </button>

             <button className="w-full text-left bg-white p-4 rounded-xl flex justify-between items-center border border-[#f0f3ff] hover:bg-[#f9f9ff] transition-all group">
                <div className="flex items-center gap-3">
                   <Archive className="w-5 h-5 text-gray-400" />
                   <span className="font-heading font-bold text-sm text-[#182232]">Archive Site</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">MOVE</div>
             </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
             <button className="w-full text-left bg-[#ffdad6]/20 p-4 rounded-xl flex justify-between border border-[#ffdad6]/40 hover:bg-[#ffdad6]/40 transition-all">
                <div className="flex items-center gap-3">
                   <Trash2 className="w-5 h-5 text-[#ba1a1a]" />
                   <span className="font-heading font-bold text-sm text-[#ba1a1a]">Delete Permanent Registry</span>
                </div>
                <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
             </button>
             <p className="text-center text-[9px] text-[#ba1a1a] mt-4 font-sans italic">
               Warning: This action cannot be undone. All database records for this site will be erased.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
