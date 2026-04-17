"use client";

import { Download } from "lucide-react";

export function ExportPDFButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="text-[10px] font-bold text-gray-500 flex items-center gap-1 hover:text-[#182232]"
    >
      <Download className="w-3 h-3" /> Export PDF
    </button>
  );
}
