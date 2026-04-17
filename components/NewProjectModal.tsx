"use client";

import { useState } from "react";
import { X, Plus, FolderPlus, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { formatINR } from "@/lib/utils";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [budget, setBudget] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg">Create New Project</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Project Title</label>
            <input 
              type="text" 
              placeholder="e.g. Skyline residency Phase II"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Client Name</label>
            <input 
              type="text" 
              placeholder="e.g. Al-Futtaim Groups"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Start Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Budget (₹)</label>
              <input 
                type="number" 
                placeholder="Total estimate..."
                className="w-full bg-[#fcfcff] border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/5 transition-all"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] text-white font-heading font-bold shadow-lg flex gap-2">
              <Plus className="w-5 h-5" /> Initialize Project
            </Button>
            <p className="text-center text-[9px] text-gray-400 mt-4 font-sans italic">
              Once created, you can assign site coordinators and materials to this project.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
