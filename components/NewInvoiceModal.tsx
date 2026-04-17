"use client";

import { useState } from "react";
import { X, Save, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { formatINR } from "@/lib/utils";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewInvoiceModal({ isOpen, onClose }: NewInvoiceModalProps) {
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl h-[90vh] sm:h-auto overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold text-lg">Generate New Invoice</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Supplier Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Supplier Name</label>
              <input 
                type="text" 
                placeholder="e.g. BuildMat Corp"
                className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans mb-1">Billing Date</label>
              <input 
                type="date" 
                className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-[#182232]">Line Items</h3>
                <Button variant="ghost" size="sm" onClick={addItem} className="text-[#715c00] hover:text-[#5a4a00]">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
             </div>
             
             <div className="space-y-3">
               {items.map((item, index) => (
                 <Card key={index} className="bg-[#f9f9ff] border-none shadow-none">
                   <CardContent className="p-3 space-y-2">
                     <div className="flex gap-2">
                        <input 
                          placeholder="Description"
                          className="flex-1 bg-white border-none rounded px-2 py-1.5 text-xs font-sans outline-none"
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                        />
                        {items.length > 1 && (
                          <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                     </div>
                     <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[9px] text-gray-400 font-sans block ml-1">Qty</label>
                          <input 
                            type="number"
                            className="w-full bg-white border-none rounded px-2 py-1.5 text-xs font-sans outline-none"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] text-gray-400 font-sans block ml-1">Rate (₹)</label>
                          <input 
                            type="number" 
                            className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#182232]"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                          />
                        </div>
                        <div className="flex-1 bg-white/50 rounded flex items-center justify-end px-2 pt-3">
                          <p className="font-heading font-bold text-[#182232] text-xs">{formatINR(item.quantity * item.rate)}</p>
                        </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </div>

          {/* Totals Section */}
          <div className="bg-[#182232] rounded-xl p-4 text-white">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="flex justify-between items-center bg-[#182232] p-4 rounded-xl">
                <span className="text-sm font-bold text-[#feda5a] uppercase tracking-[0.2em]">Grand Total</span>
                <span className="text-xl font-heading font-bold text-[#feda5a]">{formatINR(total)}</span>
              </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 border-t sm:border-none">
          <Button className="w-full h-12 bg-[#715c00] hover:bg-[#5a4a00] text-white font-heading font-bold shadow-lg shadow-[#715c00]/20 flex gap-2">
            <Save className="w-5 h-5" /> Save & Generate Invoice
          </Button>
          <p className="text-center text-[10px] text-gray-400 mt-4 font-sans italic">
            This will automatically update the Finance ledger and Inventory records if linked to materials.
          </p>
        </div>

      </div>
    </div>
  );
}
