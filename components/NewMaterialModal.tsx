"use client";

import { useState } from "react";
import { X, Save, Boxes, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface NewMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMaterialModal({ isOpen, onClose }: NewMaterialModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Raw Materials");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("Units");
  const [threshold, setThreshold] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg">Add New Material</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Material Name</label>
            <input 
              type="text" 
              placeholder="e.g. Bricks (Red)"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Category</label>
            <select 
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Raw Materials</option>
              <option>Tools & Equipment</option>
              <option>Electrical & Plumbing</option>
              <option>Safety Gear</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Initial Stock</label>
              <input 
                type="number" 
                className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Unit</label>
              <input 
                type="text" 
                placeholder="Bags, Kg, etc"
                className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Low Stock Threshold</label>
            <div className="flex items-center gap-2">
               <input 
                type="number" 
                className="flex-1 bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
              <AlertCircle className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-[9px] text-gray-400 mt-1 font-sans">You will get a "LOW STOCK" alert when quantity hits this level.</p>
          </div>

          <div className="pt-4">
            <Button className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] text-white font-heading font-bold shadow-lg flex gap-2">
              <Plus className="w-5 h-5" /> Register Material
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
