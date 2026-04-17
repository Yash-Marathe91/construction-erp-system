"use client";

import { X, Printer, Download, HardHat } from "lucide-react";
import { Button } from "./ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

interface PrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: string;
    name: string;
    category: string;
    unit: string;
  } | null;
}

export function PrintLabelModal({ isOpen, onClose, material }: PrintLabelModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !material) return null;

  const qrValue = `MAT-${material.id}|${material.name}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 print:p-0 print:bg-white print:static">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 print:shadow-none print:rounded-none">
        
        {/* Header - Hidden in Print */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold">Print Material Label</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Label Preview */}
        <div className="p-8 space-y-6 flex flex-col items-center">
          <div 
            ref={printRef}
            className="w-full aspect-[4/3] bg-white border-2 border-[#182232] rounded-xl p-6 flex flex-col items-center justify-center gap-4 shadow-inner print:border-none print:shadow-none print:p-0"
          >
            <div className="flex items-center gap-2 mb-2">
               <HardHat className="w-6 h-6 text-[#182232]" />
               <span className="font-heading font-black text-xl tracking-tighter">KBT<span className="text-gray-400">CONSTRUCT</span></span>
            </div>

            <div className="bg-white p-2 border-2 border-[#182232]/10 rounded-lg">
              <QRCodeSVG 
                value={qrValue} 
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="text-center space-y-1">
               <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-gray-400">Inventory Asset</p>
               <h3 className="font-heading font-bold text-[#182232] text-xl leading-none">{material.name}</h3>
               <p className="font-heading font-black text-[#182232] text-sm opacity-60">MAT-{material.id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="w-full space-y-3 print:hidden">
            <Button 
                onClick={handlePrint}
                className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] rounded-xl font-heading font-bold gap-2 text-white"
            >
                <Printer className="w-4 h-4" /> Print Label
            </Button>
            <p className="text-[10px] text-center text-gray-400 font-sans italic">
                Standard 4x3 Thermal Label Format
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
