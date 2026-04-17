"use client";

import { useState } from "react";
import { X, Search, Filter, CheckCircle, AlertTriangle, Download, Printer, Users } from "lucide-react";
import { Button } from "./ui/button";

interface EmployeeLog {
  id: string;
  name: string;
  role: string;
  status: 'Present' | 'Absent' | 'On Leave';
  checkIn: string;
  checkOut: string;
  site: string;
}

interface AttendanceLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AttendanceLogsModal({ isOpen, onClose }: AttendanceLogsModalProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("serial");
  
  // Generating mock data for 150+ employees for the compact view demo
  const allLogs: EmployeeLog[] = Array.from({ length: 154 }, (_, i) => ({
    id: `EMP-${1000 + i}`,
    name: ['Rahul Sharma', 'Amit Patel', 'Sneha Reddy', 'Vijay Kumar', 'Priya Das', 'Sanjay Gupta', 'Anjali Singh'][i % 7] + ` ${i}`,
    role: ['Mason', 'Carpenter', 'Electrician', 'Labor', 'Foreman', 'Plumber'][i % 6],
    status: i % 15 === 0 ? 'On Leave' : i % 12 === 0 ? 'Absent' : 'Present',
    checkIn: (i % 12 === 0 || i % 15 === 0) ? '-' : '08:00 AM',
    checkOut: (i % 12 === 0 || i % 15 === 0) ? '-' : '05:00 PM',
    site: 'Sector 4 HQ'
  }));

  const filteredLogs = allLogs
    .filter(log => 
      log.name.toLowerCase().includes(search.toLowerCase()) || 
      log.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
       if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
       if (sortBy === 'serial') return a.id.localeCompare(b.id);
       if (sortBy === 'present') return a.status === 'Present' ? -1 : 1;
       if (sortBy === 'absent') return a.status === 'Absent' ? -1 : 1;
       if (sortBy === 'leave') return a.status === 'On Leave' ? -1 : 1;
       return 0;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white h-full sm:h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#182232] text-white shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#feda5a]" />
            <h2 className="font-heading font-bold">Comprehensive Attendance Logs</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3 items-center justify-between shrink-0">
           <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search staff name or ID..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                 <select 
                   className="pl-8 pr-4 h-9 bg-white border border-gray-200 rounded-lg text-[10px] font-bold font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/10 appearance-none min-w-[120px]"
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                 >
                    <option value="serial">Sort: Serial ID</option>
                    <option value="alphabetical">Sort: A-Z Name</option>
                    <option value="present">Sort: Status: Present</option>
                    <option value="absent">Sort: Status: Absent</option>
                    <option value="leave">Sort: Status: On Leave</option>
                 </select>
              </div>
              <Button variant="outline" size="sm" className="h-9 text-[10px] font-bold border-gray-200 gap-2" onClick={() => window.print()}>
                 <Printer className="w-3 h-3" /> Print PDF
              </Button>
           </div>
        </div>

        {/* Compact Table */}
        <div className="flex-1 overflow-auto bg-white">
           <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                 <tr className="border-b border-gray-100 uppercase text-[9px] font-bold text-gray-400 tracking-wider">
                    <th className="py-3 px-4 w-16">ID</th>
                    <th className="py-3 px-4">Staff Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">In/Out</th>
                    <th className="py-3 px-4 text-right">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-1.5 px-4 font-mono text-[10px] text-gray-400">{log.id}</td>
                       <td className="py-1.5 px-4">
                          <p className="text-xs font-bold text-[#182232]">{log.name}</p>
                          <p className="text-[8px] text-gray-400 font-sans">{log.site}</p>
                       </td>
                       <td className="py-1.5 px-4">
                          <span className="text-[10px] font-sans font-medium text-gray-600">{log.role}</span>
                       </td>
                       <td className="py-1.5 px-4 text-center">
                          <p className="text-[9px] font-bold text-gray-500 font-sans">{log.checkIn} - {log.checkOut}</p>
                       </td>
                       <td className="py-1.5 px-4 text-right">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full ${
                             log.status === 'Present' ? 'bg-[#88f9b0]/20 text-[#002813]' : 
                             log.status === 'Absent' ? 'bg-[#ffdad6] text-[#93000a]' :
                             'bg-[#fff7d1] text-[#715c00]'
                          }`}>
                             {log.status === 'Present' ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                             {log.status}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 border-t bg-[#f9fbff] flex justify-between items-center shrink-0">
           <div className="flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#88f9b0]" />
                 <p className="text-[10px] font-bold text-[#182232]">142 Present</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#feda5a]" />
                 <p className="text-[10px] font-bold text-[#182232]">10 On Leave</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                 <p className="text-[10px] font-bold text-[#182232]">11 Absent</p>
              </div>
           </div>
           <Button className="h-9 bg-[#182232] rounded-lg text-[10px] font-bold gap-2">
              <Download className="w-3 h-3" /> Export Logs
           </Button>
        </div>

      </div>
    </div>
  );
}
