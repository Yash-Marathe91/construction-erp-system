"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Truck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { DeliveryDetailModal } from "./DeliveryDetailModal";

interface Delivery {
  id: string;
  material_name: string;
  expected_arrival: string;
  supplier: string;
  status: string;
  quantity?: number;
}

interface DeliveriesListProps {
  deliveries: Delivery[];
}

export function DeliveriesList({ deliveries }: DeliveriesListProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <Card 
            key={delivery.id} 
            className="bg-[#ffffff] group hover:shadow-lg transition-all cursor-pointer border-none shadow-sm overflow-hidden"
            onClick={() => handleOpenDelivery(delivery)}
          >
            <CardContent className="p-0 flex">
                <div className={`w-1.5 ${
                  delivery.status === 'In Transit' ? 'bg-[#feda5a]' : 
                  delivery.status === 'Delivered' ? 'bg-[#88f9b0]' :
                  'bg-[#e7eeff]'
                }`} />
                <div className="flex-1 p-4">
                   <div className="flex justify-between items-start">
                     <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-[#f0f3ff] group-hover:bg-[#182232] rounded-2xl flex justify-center items-center transition-colors shadow-sm">
                         <Truck className="w-6 h-6 text-[#182232] group-hover:text-[#feda5a]" />
                       </div>
                       <div>
                         <h3 className="font-heading font-bold text-[#182232] text-lg">{delivery.material_name}</h3>
                         <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-tighter">Supplier: {delivery.supplier} • ID: {delivery.id}</p>
                       </div>
                     </div>
                     <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#182232] transition-colors" />
                   </div>
                   
                   <div className="mt-5 flex items-end justify-between border-t border-gray-50 pt-3">
                     <div>
                       <p className="text-[10px] uppercase font-bold text-gray-400 font-sans tracking-widest mb-0.5">Expected Arrival</p>
                       <p className="font-heading font-bold text-[#182232] text-sm">{delivery.expected_arrival}</p>
                     </div>
                     <span className={`text-[10px] font-bold px-3 py-1 flex items-center gap-2 rounded-full shadow-sm ${
                       delivery.status === 'In Transit' ? 'bg-[#feda5a] text-[#182232]' : 
                       delivery.status === 'Delivered' ? 'bg-[#88f9b0] text-[#002813]' :
                       'bg-[#f0f3ff] text-[#182232]'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          delivery.status === 'In Transit' ? 'bg-[#182232] animate-pulse' : 
                          delivery.status === 'Delivered' ? 'bg-[#002813]' :
                          'bg-[#182232]'
                        }`} />
                        {delivery.status}
                     </span>
                   </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeliveryDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        delivery={selectedDelivery}
      />
    </>
  );
}
