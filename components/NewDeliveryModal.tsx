"use client";

import { useState } from "react";
import { X, Truck, Calendar, User, Package, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewDeliveryModal({ isOpen, onClose }: NewDeliveryModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [materialName, setMaterialName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [expectedArrival, setExpectedArrival] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("Units");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = async () => {
    if (!materialName.trim() || !supplier.trim()) return alert("Please fill all fields");
    
    setIsSubmitting(true);
    try {
      const deliveryId = "D-" + Math.floor(1000 + Math.random() * 9000);
      const { error } = await supabase.from('deliveries').insert({
        id: deliveryId,
        material_name: materialName,
        supplier: supplier,
        expected_arrival: expectedArrival || "TBD",
        status: 'Pending',
        quantity: quantity
      });

      if (error) throw error;
      
      onClose();
      router.refresh();
      setMaterialName("");
      setSupplier("");
    } catch (err: any) {
      console.error("Schedule Error:", err);
      // Show more detailed error message if available
      const errMsg = err.message || err.details || "Unknown error";
      alert(`Failed to schedule delivery: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#feda5a] text-[#182232]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <h2 className="font-heading font-bold text-lg">Schedule Delivery</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 flex items-center gap-1">
              <Package size={10} /> Material to Order
            </label>
            <input 
              type="text" 
              placeholder="e.g. Portland Cement"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 flex items-center gap-1">
               <User size={10} /> Supplier Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Tata Steel / Local Vendor"
              className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 flex items-center gap-1">
                 Quantity
              </label>
              <input 
                type="number" 
                className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 flex items-center gap-1">
                 Unit
              </label>
              <input 
                type="text" 
                placeholder="Bags, Kg, etc"
                className="w-full bg-[#f0f3ff] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSchedule}
              disabled={isSubmitting}
              className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] text-white font-heading font-bold shadow-lg flex gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Truck className="w-5 h-5" />}
              {isSubmitting ? "Scheduling..." : "Confirm Shipment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
