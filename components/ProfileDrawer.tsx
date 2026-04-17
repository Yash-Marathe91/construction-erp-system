"use client";

import { useState, useEffect } from "react";
import { X, User, Settings, Shield, LogOut, Bell, FileText, ChevronRight, HardHat, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface ProfileDrawerProps {
   isOpen: boolean;
   onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
   const router = useRouter();
   const supabase = createClient();

   const [profile, setProfile] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function loadProfile() {
         const { data: { user } } = await supabase.auth.getUser();
         if (user) {
            // Priority: Database Table -> Auth Metadata -> Defaults
            const { data: dbProfile } = await supabase
               .from('profiles')
               .select('*')
               .eq('id', user.id)
               .single();

            if (dbProfile) {
               setProfile(dbProfile);
            } else {
               // Fallback to metadata if DB record isn't there yet
               setProfile({
                  full_name: user.user_metadata?.full_name || "New User",
                  role: user.user_metadata?.role || "Site Member",
                  company_name: user.user_metadata?.company_name || "KBT Platform",
                  phone: user.user_metadata?.phone || "N/A",
                  avatar_url: user.user_metadata?.avatar_url,
                  email: user.email
               });
            }
         }
         setLoading(false);
      }

      if (isOpen) {
         loadProfile();
      }
   }, [isOpen, supabase]);

   const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push("/login");
      onClose();
   };

   // Get initials for profile picture fallback
   const getInitials = (name: string) => {
      return name
         .split(' ')
         .map(n => n[0])
         .join('')
         .toUpperCase()
         .substring(0, 2);
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[200] overflow-hidden">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
         />

         {/* Drawer */}
         <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

            {/* Profile Header */}
            <div className="bg-[#182232] p-6 text-white relative overflow-hidden">
               <div className="absolute -right-6 -bottom-6 opacity-10">
                  <HardHat size={120} />
               </div>

               <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#feda5a] text-[#182232] flex items-center justify-center text-2xl font-bold font-heading shadow-xl border-2 border-white/20 overflow-hidden">
                     {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        profile ? getInitials(profile.full_name) : ".."
                     )}
                  </div>
                  <button
                     onClick={onClose}
                     className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div>
                  <h2 className="text-xl font-heading font-bold">{profile?.full_name || "Loading..."}</h2>
                  <p className="text-xs text-gray-400 font-sans mt-1">{profile?.role} • {profile?.company_name}</p>
               </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

               <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3 font-sans mx-2">Staff Profile</h4>
                  <div className="space-y-1">
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all font-sans text-xs">
                         <Mail className="w-4 h-4 text-gray-400" />
                         <div>
                            <p className="text-gray-400 text-[10px] uppercase font-semibold">Email</p>
                            <p className="text-[#182232] font-semibold">{profile?.email || "..."}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all font-sans text-xs">
                         <Phone className="w-4 h-4 text-gray-400" />
                         <div>
                            <p className="text-gray-400 text-[10px] uppercase font-semibold">Direct Line</p>
                            <p className="text-[#182232] font-semibold">{profile?.phone || "N/A"}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all font-sans text-xs">
                         <MapPin className="w-4 h-4 text-gray-400" />
                         <div>
                            <p className="text-gray-400 text-[10px] uppercase font-semibold">Associated Entity</p>
                            <p className="text-[#182232] font-semibold">{profile?.company_name || "..."}</p>
                         </div>
                      </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3 font-sans mx-2">System Controls</h4>
                  <div className="space-y-2">
                     {[
                        { icon: User, label: "Edit Account Detail", desc: "Update phone & photos" },
                        { icon: Bell, label: "Notification Setup", desc: "Site & Stock alerts" },
                        { icon: Shield, label: "Security & Privacy", desc: "Change password & 2FA" },
                        { icon: FileText, label: "Access Permits", desc: "View your site permissions" },
                     ].map((item, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f0f3ff] hover:shadow-sm transition-all group">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                 <item.icon className="w-4 h-4 text-gray-400 group-hover:text-[#182232]" />
                              </div>
                              <div className="text-left">
                                 <p className="text-xs font-bold text-[#182232]">{item.label}</p>
                                 <p className="text-[10px] text-gray-400 font-sans">{item.desc}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-[#182232] transition-colors" />
                        </button>
                     ))}
                  </div>
               </div>

            </div>

            {/* Footer actions */}
            <div className="p-4 pb-20 border-t bg-gray-50">
               <Button
                  onClick={handleSignOut}
                  className="w-full h-11 bg-white border border-[#ffdad6] text-[#ba1a1a] font-heading font-bold shadow-sm hover:bg-[#ffdad6]/20 flex gap-2"
               >
                  <LogOut className="w-4 h-4" /> Sign Out Session
               </Button>

                <p className="text-center text-[9px] text-gray-300 mt-4 font-sans uppercase tracking-tighter">
                   System Instance: KBT-IND-PROD-2024
                </p>
            </div>

         </div>
      </div>
   );
}
