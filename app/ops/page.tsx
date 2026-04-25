"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Clock, AlertTriangle, FileText, ArrowUpRight, DollarSign, TrendingUp, Calendar, Zap, MessageSquare, UserPlus } from "lucide-react";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { PaymentsList } from "@/components/PaymentsList";
import { EndShiftModal } from "@/components/EndShiftModal";
import { AttendanceLogsModal } from "@/components/AttendanceLogsModal";
import { SalaryDetailModal } from "@/components/SalaryDetailModal";
import { AddEmployeeSalaryModal } from "@/components/AddEmployeeSalaryModal";
import { AttendanceSheetModal } from "@/components/AttendanceSheetModal";

export default function OpsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = use(searchParams);
  const currentTab = params.tab || "attendance";
  const [isEndShiftOpen, setIsEndShiftOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isSalaryDetailOpen, setIsSalaryDetailOpen] = useState(false);
  const [isAddSalaryOpen, setIsAddSalaryOpen] = useState(false);
  const [isMarkRollCallOpen, setIsMarkRollCallOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [shiftNotes, setShiftNotes] = useState([
    { id: '1', text: 'Slight delay in steel delivery at Gate 2. Adjusted masonry team schedule accordingly.', time: '10:42 AM' },
  ]);
  const [newNote, setNewNote] = useState("");

  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchWorkers() {
      setIsLoading(true);
      // Fetch site first to get workers for it
      const { data: site } = await supabase.from('sites').select('id').limit(1).single();
      if (!site) {
        setIsLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const { data: dbWorkers } = await supabase
        .from('workers')
        .select(`
          id,
          name,
          role,
          daily_wage,
          attendance (
            status,
            check_in_time,
            date
          )
        `)
        .eq('site_id', site.id);

      if (dbWorkers) {
        setWorkers(dbWorkers.map((w: any) => {
          const todaysAttendance = w.attendance?.find((a: any) => a.date === today);

          return {
            id: w.id,
            name: w.name,
            role: w.role,
            daily_wage: w.daily_wage,
            status: todaysAttendance?.status || 'Absent',
            checkIn: todaysAttendance?.check_in_time?.slice(0, 5) || '-'
          };
        }));
      }
      setIsLoading(false);
    }
    fetchWorkers();
  }, []);

  const markPresent = async (workerId: string) => {
    // 1. Optimistic UI update
    setWorkers(prev => prev.map(w =>
      w.id === workerId
        ? { ...w, status: 'Present', checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        : w
    ));

    const today = new Date().toISOString().split('T')[0];
    const checkInTime = new Date().toLocaleTimeString('en-US', { hour12: false });

    // 2. Upsert to Supabase
    await supabase.from('attendance').upsert({
      worker_id: workerId,
      date: today,
      status: 'Present',
      check_in_time: checkInTime,
      hours_worked: 8
    }, { onConflict: 'worker_id,date' });
  };

  const handleAddWorker = async (data: any) => {
    const { data: site } = await supabase.from('sites').select('id').limit(1).single();
    if (!site) return;

    const dailyWage = Math.round(Number(data.baseSalary) / 30) || 500;

    const { data: newWorker } = await supabase.from('workers').insert({
      name: data.name,
      role: data.role,
      daily_wage: dailyWage,
      site_id: site.id
    }).select().single();

    if (newWorker) {
      setWorkers(prev => [...prev, {
        id: newWorker.id,
        name: newWorker.name,
        role: newWorker.role,
        daily_wage: newWorker.daily_wage,
        status: 'Absent',
        checkIn: '-'
      }]);
    }
  };

  const weeklyPayments = [
    { id: 'WP-104', group: 'Masonry Team A', amount: 125000, period: 'Week 42', status: 'Disbursed', type: 'Outgoing' as const },
    { id: 'WP-105', group: 'Electricians', amount: 82000, period: 'Week 42', status: 'Awaiting Funds', type: 'Outgoing' as const },
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setShiftNotes([{ id: Date.now().toString(), text: newNote, time: now }, ...shiftNotes]);
    setNewNote("");
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">

        {/* Page Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#182232]">Operations</h1>
            <p className="text-sm text-gray-500 font-sans flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Wednesday, Oct 24
            </p>
          </div>
          <Button
            onClick={() => setIsEndShiftOpen(true)}
            className="bg-[#182232] hover:bg-[#2d3748] text-white font-heading font-bold rounded-xl h-11 px-6 shadow-lg shadow-[#182232]/20"
          >
            <Clock className="w-4 h-4 mr-2" />
            End Shift
          </Button>
        </div>

        {/* Tonal Segmented Control */}
        <div className="flex bg-[#e7eeff] rounded-lg p-1">
          <Link href="/ops?tab=attendance" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'attendance' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Attendance
          </Link>
          <Link href="/ops?tab=payroll" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'payroll' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Payroll
          </Link>
          <Link href="/ops?tab=payments" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'payments' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Payments
          </Link>
        </div>

        {/* Dynamic Content Based on Tab */}
        <div className="space-y-6">

          {currentTab === 'attendance' && (
            <div className="space-y-6">
              {/* Operational Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#002813] border-none shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Users size={64} />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-[10px] font-sans text-[#88f9b0] opacity-80 uppercase font-bold tracking-widest mb-1">On-Site Force</p>
                    <div className="flex items-end gap-2">
                      <h2 className="text-4xl font-heading font-bold text-white">200</h2>
                      <span className="text-[10px] text-[#88f9b0] font-bold mb-1.5">+12.4%</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-[10px] font-sans text-gray-400 uppercase font-bold tracking-widest mb-1">Absenteeism</p>
                    <div className="flex items-end gap-2">
                      <h2 className="text-4xl font-heading font-bold text-[#ba1a1a]">08</h2>
                      <span className="text-[10px] text-[#ba1a1a] font-bold mb-1.5">-2.1%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Productivity Spotlight */}
              <Card className="bg-[#fff9ea] border border-[#feda5a]/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#feda5a] flex items-center justify-center shadow-inner">
                      <Zap className="w-5 h-5 text-[#182232]" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-[#182232] text-sm">Site Productivity</h4>
                      <p className="text-[10px] text-gray-500 font-sans">Active throughput is above weekly average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-bold text-[#715c00]">92%</p>
                    <p className="text-[8px] font-bold uppercase text-[#715c00]">Optimal</p>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-[#182232] text-lg">Daily Roster</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-[#182232] rounded-lg"
                      onClick={() => setIsAddSalaryOpen(true)}
                    >
                      <UserPlus className="w-3 h-3 mr-1" /> Add New
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-[#182232]"
                      onClick={() => setIsMarkRollCallOpen(true)}
                    >
                      Mark Roll Call
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-dashed border-blue-200">
                      <div className="animate-spin w-6 h-6 border-2 border-[#182232] border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-sans">Connecting to Site Management API...</p>
                    </div>
                  ) : workers.length > 0 ? (
                    workers.map((worker) => (
                      <Card key={worker.id} className="bg-[#ffffff] border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#182232] font-bold font-heading text-lg">
                              {worker.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-[#182232]">{worker.name}</h4>
                              <p className="text-[10px] text-gray-400 font-sans uppercase font-bold tracking-tighter">{worker.role} • SECTOR 4</p>
                            </div>
                          </div>                          <div className="text-right">
                            {worker.status === 'Present' ? (
                              <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#002813] bg-[#88f9b0]/20 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="w-2.5 h-2.5" /> Present
                                </span>
                                <p className="text-[9px] text-gray-400 font-sans mt-2">Check-in: {worker.checkIn}</p>
                              </div>
                            ) : (
                              <button 
                                onClick={() => markPresent(worker.id)}
                                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                                  worker.status === 'Leave' 
                                    ? 'text-[#715c00] bg-[#feda5a]/30 hover:bg-[#feda5a]/50' 
                                    : 'text-[#ba1a1a] bg-[#ffdad6] hover:bg-green-100 hover:text-green-800'
                                }`}
                                title={worker.status === 'Leave' ? 'Currently on Leave' : 'Click to mark Present'}
                              >
                                {worker.status === 'Leave' && <Clock className="w-2.5 h-2.5" />}
                                {worker.status}
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100 shadow-sm">
                      <UserPlus className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                      <h4 className="font-heading font-bold text-[#182232]">No Workers Registered</h4>
                      <p className="text-xs text-gray-400 font-sans mt-1 max-w-[200px] mx-auto">Start by adding your site staff using the "Add New" button above.</p>
                      <Button
                        onClick={() => setIsAddSalaryOpen(true)}
                        className="mt-6 h-9 bg-[#182232] text-white text-[10px] uppercase tracking-widest font-bold px-6 rounded-lg"
                      >
                        Register First Worker
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Day Notes / Incident Log */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-[#182232] text-lg">Shift Intelligence</h3>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-3">
                      {shiftNotes.map((note) => (
                        <div key={note.id} className="flex gap-4 group">
                          <div className="w-1 h-auto bg-[#182232]/20 group-first:bg-[#182232] rounded-full" />
                          <div className="flex-1 pb-3 border-b border-gray-50 group-last:border-none">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-xs font-bold text-[#182232] group-first:text-[#182232] text-gray-500">Site Observation</h4>
                              <span className="text-[9px] text-gray-400 font-sans">{note.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-sans leading-relaxed italic">
                              "{note.text}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a shift note or incident report..."
                        className="flex-1 bg-[#f0f3ff] rounded-lg px-4 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#182232]/10"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      />
                      <Button
                        onClick={handleAddNote}
                        className="bg-[#182232] hover:bg-[#2d3748] h-9 px-4 rounded-lg text-[10px] font-bold"
                      >
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentTab === 'payroll' && (
            <div className="space-y-6">
              <div className="bg-[#182232] p-4 rounded-xl text-white flex justify-between items-center shadow-lg">
                <div>
                  <h3 className="font-heading font-bold uppercase tracking-widest text-[10px] text-[#feda5a] mb-1">Payroll Pipeline</h3>
                  <h4 className="text-xl font-heading font-bold">Monthly Disbursements</h4>
                  <p className="text-[10px] text-gray-400 font-sans mt-1 italic leading-relaxed">View distribution, PF, medical fund and manage payroll status.</p>
                </div>
                <Button
                  onClick={() => setIsAddSalaryOpen(true)}
                  className="h-10 bg-[#feda5a] text-[#182232] hover:bg-[#ffeb99] font-bold text-[11px] rounded-lg gap-2 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" /> Configure Payroll
                </Button>
              </div>

              <div className="space-y-3">
                {workers.map((worker) => {
                  const projectedMonthly = (worker.daily_wage || 500) * 30; // Estimate monthly from daily wage
                  const pStatus = worker.status === 'Present' ? 'Processed' : 'Pending Review';
                  return (
                    <Card key={worker.id} className="bg-white border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                      setSelectedStaff({ ...worker, baseSalary: projectedMonthly, status: pStatus });
                      setIsSalaryDetailOpen(true);
                    }}>
                      <CardContent className="p-0 flex">
                        <div className={`w-1.5 ${pStatus === 'Processed' ? 'bg-[#88f9b0]' : 'bg-[#feda5a]'}`} />
                        <div className="flex-1 p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center font-heading font-bold text-[#182232]">
                              {worker.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-[#182232]">{worker.name}</h4>
                              <p className="text-[10px] text-gray-400 font-sans uppercase font-bold tracking-tighter">{worker.role} • ID: {worker.id.slice(0, 4)}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <h4 className="font-heading font-bold text-[#182232]">{formatINR(projectedMonthly)}</h4>
                            <span className="text-[9px] text-gray-500 font-sans mt-0.5 inline-block">{pStatus}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {currentTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-heading font-bold text-[#182232] text-lg">Wage Disbursements</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase font-sans">Sorting:</span>
                  <select className="bg-transparent text-[10px] font-bold text-[#182232] font-sans border-none outline-none">
                    <option>Newest First</option>
                    <option>Amount High</option>
                  </select>
                </div>
              </div>
              <PaymentsList payments={weeklyPayments} />

              {/* Financial Footnote */}
              <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex gap-4">
                <AlertTriangle className="w-5 h-5 text-gray-300 shrink-0" />
                <p className="text-[10px] text-gray-400 font-sans leading-normal italic">
                  Wage payments are disbursed weekly on Thursday mornings. Contact finance HQ for discrepancies in 'Awaiting Funds' status.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      <EndShiftModal
        isOpen={isEndShiftOpen}
        onClose={() => setIsEndShiftOpen(false)}
        siteName="Sector 4 Residency HQ"
      />

      <AttendanceLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      <SalaryDetailModal
        isOpen={isSalaryDetailOpen}
        onClose={() => setIsSalaryDetailOpen(false)}
        staff={selectedStaff}
      />

      <AddEmployeeSalaryModal
        isOpen={isAddSalaryOpen}
        onClose={() => setIsAddSalaryOpen(false)}
        onAdd={handleAddWorker}
      />

      <AttendanceSheetModal
        isOpen={isMarkRollCallOpen}
        onClose={() => setIsMarkRollCallOpen(false)}
        workers={workers}
        onAttendanceMarked={(workerId, status) => {
          setWorkers(prev => prev.map(w => w.id === workerId ? {
            ...w,
            status: status,
            checkIn: status === 'Present' ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '-'
          } : w));
        }}
      />
    </AppLayout>
  );
}

// Re-add internal Plus icon for consistency if not imported
function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
