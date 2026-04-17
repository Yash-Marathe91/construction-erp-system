"use client";

import { useState } from "react";
import { X, Save, Boxes, Plus, Minus, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: { name: string; quantity: number; unit: string } | null;
}

export function UpdateStockModal({ isOpen, onClose, material }: UpdateStockModalProps) {
  const [adjustment, setAdjustment] = useState(0);

  if (!isOpen || !material) return null;

  const newTotal = material.quantity + adjustment;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#715c00] text-white">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg">Update Stock Ledger</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Editing Material</p>
            <h3 className="text-2xl font-heading font-bold text-[#182232]">{material.name}</h3>
          </div>

          <div className="bg-[#f0f3ff] rounded-xl p-6 flex flex-col items-center">
            <p className="text-xs text-gray-500 font-sans mb-2 font-semibold">Current Quantity: {material.quantity} {material.unit}</p>
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 rounded-full border-2 border-[#d9e3f9] text-[#182232] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all"
                onClick={() => setAdjustment(prev => prev - 1)}
              >
                <Minus className="w-6 h-6" />
              </Button>
              <div className="text-center">
                <p className="text-4xl font-heading font-bold text-[#182232]">{adjustment > 0 ? `+${adjustment}` : adjustment}</p>
                <p className="text-[10px] text-gray-400 font-sans uppercase mt-1">Adjustment</p>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 rounded-full border-2 border-[#d9e3f9] text-[#182232] hover:bg-[#88f9b0]/20 hover:text-[#002813] transition-all"
                onClick={() => setAdjustment(prev => prev + 1)}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {adjustment !== 0 && (
            <div className="flex justify-between items-center bg-[#f9f9ff] p-4 rounded-lg border-2 border-dashed border-[#d9e3f9]">
               <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#715c00]" />
                  <p className="text-xs font-bold text-gray-600 font-sans">New Final Stock</p>
               </div>
               <p className="text-xl font-heading font-bold text-[#182232]">{newTotal} <span className="text-sm font-normal text-gray-400">{material.unit}</span></p>
            </div>
          )}

          <div className="pt-2">
            <Button className="w-full h-12 bg-[#715c00] hover:bg-[#5a4a00] text-white font-heading font-bold shadow-lg flex gap-2">
              <Save className="w-5 h-5" /> Confirm Update
            </Button>
            <p className="text-center text-[9px] text-gray-300 mt-4 font-sans italic lowercase">All stock adjustments are logged for audit transparency.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
