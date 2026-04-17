import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, ArrowDownRight, CircleDollarSign, CreditCard, Receipt, TrendingUp, TrendingDown, Eye, Download, Search, Filter, Plus, Users, MapPin, Building, ArrowRight, ShieldCheck, UserPlus, MoreHorizontal, CheckCircle2, Settings, LogOut, Bell, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createServerSideClient } from "@/lib/supabase-server";
import { AdminActions } from "@/components/AdminActions";
import { ManageSiteButton } from "@/components/ManageSiteButton";
import { UserActions } from "@/components/UserActions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentTab = (await searchParams).tab || "projects";
  const supabase = await createServerSideClient();
  
  // Example fetch projects from Supabase
  const { data: projects } = await supabase.from('projects').select('*');

  const sites = [
    { id: '1', name: 'Skyline Residency', location: 'Sector 2A', status: 'Active' },
    { id: '2', name: 'Metro Plaza', location: 'Downtown', status: 'Planning' },
  ];

  const adminUsers = [
    { id: 'U-1', name: 'Sarah Ahmed', role: 'Site Manager', email: 'sarah@example.com', access: 'All Sites' },
    { id: 'U-2', name: 'John Peterson', role: 'Accountant', email: 'john@example.com', access: 'Finance Only' },
    { id: 'U-3', name: 'Zaid Khan', role: 'Coordinator', email: 'zaid@example.com', access: 'Site Alpha' },
  ];

  const settingsItems = [
    { id: 'S-1', label: 'Organization Details', icon: ShieldCheck, desc: 'Manage logo, company name, and industry' },
    { id: 'S-2', label: 'Push Notifications', icon: Bell, desc: 'Configure alerts for stock and attendance' },
    { id: 'S-3', label: 'Account Security', icon: ShieldCheck, desc: 'Update passwords and 2FA settings' },
    { id: 'S-4', label: 'Log Out', icon: LogOut, desc: 'Safely exit the management session', color: 'text-[#ba1a1a]' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#182232]">Admin Panel</h1>
            <p className="text-sm text-gray-500 font-sans">Projects, Users & Control</p>
          </div>
          <div className="w-10 h-10 bg-[#f0f3ff] rounded-full flex items-center justify-center text-[#182232]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Tonal Segmented Control */}
        <div className="flex bg-[#e7eeff] rounded-lg p-1">
          <Link href="/admin?tab=projects" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'projects' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Projects
          </Link>
          <Link href="/admin?tab=users" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'users' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Users
          </Link>
          <Link href="/admin?tab=settings" className={`flex-1 text-center font-semibold text-sm py-2 rounded transition-all font-sans ${currentTab === 'settings' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
            Settings
          </Link>
        </div>

        {currentTab === 'projects' && (
          <div className="space-y-6">
            {/* Admin Quick Actions */}
            <AdminActions />

            {/* Projects & Sites List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-[#182232] text-lg">Active Sites</h3>
                <button className="text-sm text-[#182232] font-semibold hover:underline">View Archive</button>
              </div>
              
              <div className="space-y-3">
                {sites.map((site) => (
                  <Card key={site.id} className="bg-[#ffffff]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-heading font-bold text-[#182232] text-lg">{site.name}</h4>
                          <p className="text-sm text-gray-500 font-sans mt-0.5">{site.location}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
                          site.status === 'Active' ? 'bg-[#88f9b0]/20 text-[#002813]' : 'bg-[#e7eeff] text-[#182232]'
                        }`}>
                          {site.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                          {site.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex -space-x-2">
                           <img className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 shadow-sm" src={`https://i.pravatar.cc/100?u=${site.id}`} alt="avatar" />
                           <img className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 shadow-sm" src={`https://i.pravatar.cc/100?u=${site.id}1`} alt="avatar" />
                           <div className="w-6 h-6 rounded-full border-2 border-white bg-[#f0f3ff] text-[#182232] flex items-center justify-center text-[8px] font-bold shadow-sm">+2</div>
                        </div>
                        <ManageSiteButton site={site} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#182232] rounded-xl p-4 text-white">
               <div>
                  <h3 className="font-heading font-bold">Team Management</h3>
                  <p className="text-[10px] text-gray-400 font-sans">Active staff & site permissions</p>
               </div>
                <UserActions />
            </div>

            <div className="space-y-3">
              {adminUsers.map((user) => (
                <Card key={user.id} className="bg-[#ffffff]">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center font-heading font-bold text-[#182232]">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-[#182232]">{user.name}</h4>
                        <p className="text-[10px] text-gray-500 font-sans">{user.role} • {user.access}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#182232]">
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-[#f0f3ff] p-4 rounded-xl flex items-center gap-4 border border-[#d9e3f9]">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-[#182232]" />
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest font-sans">System Access</p>
                 <h3 className="font-heading font-bold text-[#182232]">Organization Level Control</h3>
               </div>
            </div>

            <div className="space-y-2">
              {settingsItems.map((item) => (
                <button 
                  key={item.id} 
                  className="w-full text-left bg-white p-4 rounded-xl flex justify-between items-center shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)] border border-[#f0f3ff] hover:bg-[#f9f9ff] transition-colors"
                >
                  <div className="flex items-center gap-3">
                     <item.icon className={`w-5 h-5 ${item.color || 'text-gray-400'}`} />
                     <div>
                       <h4 className={`font-heading font-semibold text-sm ${item.color || 'text-[#182232]'}`}>{item.label}</h4>
                       <p className="text-[10px] text-gray-400 font-sans">{item.desc}</p>
                     </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-300" />
                </button>
              ))}
            </div>

            <div className="p-8 text-center bg-[#f9fbff] rounded-2xl border-2 border-dashed border-[#d9e3f9]">
               <p className="text-xs text-gray-400 font-sans">Sitesync v1.2.4 (Enterprise Edition)</p>
               <p className="text-[8px] text-gray-300 font-sans uppercase mt-1">Licensed to KBT Construction group</p>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
