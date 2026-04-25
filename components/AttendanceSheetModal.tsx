"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase";

interface AttendanceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: any[];
  onAttendanceMarked: (workerId: string, status: string) => void;
}

export function AttendanceSheetModal({ isOpen, onClose, workers, onAttendanceMarked }: AttendanceSheetModalProps) {
  const supabase = createClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const markStatus = async (workerId: string, status: string) => {
    setLoadingId(workerId);
    try {
      const today = new Date().toLocaleDateString('en-CA'); 
      const checkInTime = status === 'Present' ? new Date().toLocaleTimeString('en-GB') : null;
      
      const payload = {
        worker_id: workerId,
        date: today,
        status: status,
        check_in_time: checkInTime,
        hours_worked: status === 'Present' ? 8 : 0
      };

      console.log("Saving Attendance Payload:", payload);

      const { error, data } = await supabase.from('attendance').upsert(payload, { onConflict: 'worker_id,date' }).select();

      if (error) {
        console.error("Supabase Save Error Details:", JSON.stringify(error, null, 2));
      } else {
        console.log("Supabase Save Success:", data);
        onAttendanceMarked(workerId, status);
      }
    } catch (err) {
      console.error("Unexpected Backend Error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg bg-[#f9f9ff] h-[85vh] sm:h-[80vh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-heading font-bold text-[#182232] text-lg">Mark Roll Call</h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">Quick mark present, absent, or leave</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Worker List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {workers.filter(w => w.id !== 'loading').map((worker) => (
            <div key={worker.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center font-heading font-bold text-[#182232]">
                  {worker.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[#182232]">{worker.name}</h4>
                  <p className="text-[10px] text-gray-400 font-sans uppercase font-bold tracking-tighter">{worker.role}</p>
                </div>
              </div>
              
              {/* Single Click Actions */}
              <div className="flex gap-2 w-full">
                <Button 
                  onClick={() => markStatus(worker.id, 'Present')}
                  disabled={loadingId === worker.id}
                  className={`flex-1 h-9 rounded-lg font-bold text-xs ${worker.status === 'Present' ? 'bg-[#88f9b0]/20 text-[#002813] border border-[#88f9b0]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <CheckCircle className="w-3 h-3 mr-1.5" /> Present
                </Button>
                <Button 
                  onClick={() => markStatus(worker.id, 'Absent')}
                  disabled={loadingId === worker.id}
                  className={`flex-1 h-9 rounded-lg font-bold text-xs ${worker.status === 'Absent' ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <XCircle className="w-3 h-3 mr-1.5" /> Absent
                </Button>
                <Button 
                  onClick={() => markStatus(worker.id, 'Leave')}
                  disabled={loadingId === worker.id}
                  className={`flex-1 h-9 rounded-lg font-bold text-xs ${worker.status === 'Leave' ? 'bg-[#feda5a]/30 text-[#715c00] border border-[#feda5a]/50' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Clock className="w-3 h-3 mr-1.5" /> Leave
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
           <Button onClick={onClose} className="w-full bg-[#182232] text-white hover:bg-[#2d3748] h-12 rounded-xl font-heading font-bold transition-all">
             Done
           </Button>
        </div>
      </div>
    </div>
  );
}
