"use client";

import { useState } from "react";
import { X, Plus, MapPin, Building, Flag, Users } from "lucide-react";
import { Button } from "./ui/button";

interface NewSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewSiteModal({ isOpen, onClose }: NewSiteModalProps) {
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#715c00] text-white">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg text-white">Register New Site</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 outline-none" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Site Name</label>
            <input 
              type="text" 
              placeholder="e.g. Metro Plaza - Tower A"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#715c00] font-sans"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Geographic Location</label>
            <input 
              type="text" 
              placeholder="e.g. Sector 2A, Dubai South"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#715c00] font-sans"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Assign Site Manager</label>
             <select 
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#715c00] font-sans appearance-none"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            >
              <option value="">Select Manager</option>
              <option value="Sarah Ahmed">Sarah Ahmed (Senior Lead)</option>
              <option value="David Lee">David Lee (Foreman)</option>
              <option value="M. Garcia">M. Garcia (Safety Supervisor)</option>
            </select>
          </div>

          <div className="pt-4">
            <Button className="w-full h-12 bg-[#715c00] hover:bg-[#5a4a00] text-white font-heading font-bold shadow-lg flex gap-2">
              <Flag className="w-5 h-5" /> Launch Site
            </Button>
            <p className="text-center text-[9px] text-gray-300 mt-4 font-sans italic">
              Attendance and inventory logs will be reachable once the site status is 'Active'.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
