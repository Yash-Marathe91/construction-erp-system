"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { UpdateStockModal } from "./UpdateStockModal";

interface UpdateStockButtonProps {
  material: { name: string; quantity: number; unit: string };
}

export function UpdateStockButton({ material }: UpdateStockButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        size="sm" 
        className="bg-[#715c00] hover:bg-[#5a4a00] text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Update
      </Button>
      <UpdateStockModal material={material} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
