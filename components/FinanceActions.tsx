"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import { NewInvoiceModal } from "./NewInvoiceModal";

export function FinanceActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        className="bg-[#715c00] hover:bg-[#5a4a00] text-white"
        onClick={() => setIsModalOpen(true)}
      >
        <FileText className="w-4 h-4 mr-2" />
        New Invoice
      </Button>
      <NewInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
