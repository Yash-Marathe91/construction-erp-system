"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Hammer, Box, CircleDollarSign, ShieldHalf, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingAssistant } from "./FloatingAssistant";
import { useState } from "react";
import { ProfileDrawer } from "./ProfileDrawer";
import { QRScannerModal } from "./QRScannerModal";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Ops", href: "/ops", icon: Hammer },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "Finance", href: "/finance", icon: CircleDollarSign },
  { name: "Admin", href: "/admin", icon: ShieldHalf },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      {/* Top Header Placeholder */}
      <header className="sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-primary">Sitesync</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsQrOpen(true)}
            className="w-8 h-8 rounded-full text-gray-500 hover:text-primary transition-colors flex items-center justify-center bg-gray-100 hover:bg-primary/10"
          >
            <QrCode size={18} />
          </button>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase hover:ring-2 hover:ring-primary/20 transition-all"
          >
            ME
          </button>
        </div>
      </header>

      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />


      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto">{children}</main>

      {/* Global Modals */}
      {isQrOpen && (
        <QRScannerModal 
          isOpen={isQrOpen} 
          onClose={() => setIsQrOpen(false)} 
        />
      )}

      <FloatingAssistant />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] pb-safe-area">
        <ul className="flex items-center justify-around h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
                    isActive ? "text-primary font-bold shadow-[inset_0_3px_0_var(--primary)]" : "text-gray-400 font-medium hover:text-gray-600"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "fill-primary/10 stroke-[2.5]" : "stroke-2")} />
                  <span className="text-[10px] tracking-wide font-sans">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
