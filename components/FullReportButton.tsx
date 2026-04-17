"use client";

import { useState } from "react";
import { TransactionReportModal } from "./TransactionReportModal";

export function FullReportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-sm text-[#182232] font-semibold hover:underline"
      >
        Full Report
      </button>
      <TransactionReportModal transactions={[]} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
