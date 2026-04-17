"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { RequestDetailModal } from "./RequestDetailModal";

interface RequestItem {
  id: string;
  name: string;
  requester: string;
  priority: string;
  status: string;
}

interface RequestsListProps {
  requests: RequestItem[];
}

export function RequestsList({ requests }: RequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenRequest = (request: RequestItem) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {requests.map((req) => (
          <Card key={req.id} className="bg-[#ffffff] hover:shadow-md transition-all border-[#f0f3ff]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex justify-center items-center shadow-sm border border-gray-100">
                    <ClipboardList className="w-6 h-6 text-[#45474c]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#182232] text-lg">{req.name}</h3>
                    <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-tighter">Req by: {req.requester} • ID: {req.id}</p>
                  </div>
                </div>
                {req.priority === 'High' && (
                  <span className="bg-[#ffdad6]/40 text-[#ba1a1a] text-[10px] font-bold px-3 py-1 rounded-full border border-[#ffdad6]/60">
                    HIGH PRIORITY
                  </span>
                )}
              </div>
              <div className="mt-5 border-t border-gray-50 pt-4 flex justify-between items-center">
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${req.status === 'Approved' ? 'bg-[#88f9b0]/20 text-[#002813]' : 'bg-[#e7eeff] text-[#182232]'}`}>
                  {req.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5" />}
                  {req.status}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#182232] h-9 font-bold bg-[#f0f3ff] hover:bg-[#e7eeff] px-4 rounded-xl flex gap-2"
                  onClick={() => handleOpenRequest(req)}
                >
                  View Details <ArrowRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RequestDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
      />
    </>
  );
}
