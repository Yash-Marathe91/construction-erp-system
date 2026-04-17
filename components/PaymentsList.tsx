"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { DollarSign, CheckCircle } from "lucide-react";
import { ReceiptModal } from "./ReceiptModal";
import { formatINR } from "@/lib/utils";

interface Payment {
  id: string;
  group: string;
  amount: number;
  period: string;
  status: string;
  type: string;
}

interface PaymentsListProps {
  payments: Payment[];
}

export function PaymentsList({ payments }: PaymentsListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {payments.map((payment) => (
          <Card key={payment.id} className="bg-[#ffffff]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <DollarSign className="w-6 h-6 text-[#715c00]" />
                  <div>
                    <h3 className="font-heading font-semibold text-[#182232]">{payment.group}</h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">ID: {payment.id} • {payment.period}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
                  payment.status === 'Disbursed' ? 'bg-[#88f9b0]/20 text-[#002813]' : 'bg-[#ffdad6] text-[#93000a]'
                }`}>
                  {payment.status === 'Disbursed' && <CheckCircle className="w-3 h-3" />}
                  {payment.status}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{payment.type}</p>
                 <p className="text-xl font-heading font-bold text-[#182232]">{formatINR(payment.amount)}</p>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 font-semibold text-[#182232]"
                    onClick={() => handleOpenReceipt(payment)}
                 >
                   View Receipt
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ReceiptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        payment={selectedPayment} 
      />
    </>
  );
}
