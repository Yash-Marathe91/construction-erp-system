"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { NewMaterialModal } from "./NewMaterialModal";

export function InventoryActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        size="icon" 
        className="bg-[#182232] hover:bg-[#2d3748]"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-5 h-5 text-white" />
      </Button>
      <NewMaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
