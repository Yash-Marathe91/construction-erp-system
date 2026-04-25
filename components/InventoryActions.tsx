"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Truck } from "lucide-react";
import { NewMaterialModal } from "./NewMaterialModal";
import { NewDeliveryModal } from "./NewDeliveryModal";

export function InventoryActions() {
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white border-gray-100 shadow-sm text-[#182232] hover:bg-gray-50 h-10 w-10 p-0 rounded-xl"
        onClick={() => setIsDelModalOpen(true)}
      >
        <Truck className="w-5 h-5 text-[#182232]" />
      </Button>
      <Button 
        variant="default" 
        size="icon" 
        className="bg-[#182232] hover:bg-[#2d3748] h-10 w-10 p-0 rounded-xl shadow-lg shadow-[#182232]/20"
        onClick={() => setIsMatModalOpen(true)}
      >
        <Plus className="w-5 h-5 text-white" />
      </Button>
      
      <NewMaterialModal isOpen={isMatModalOpen} onClose={() => setIsMatModalOpen(false)} />
      <NewDeliveryModal isOpen={isDelModalOpen} onClose={() => setIsDelModalOpen(false)} />
    </div>
  );
}
