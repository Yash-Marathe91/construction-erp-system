"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, Filter, AlertTriangle, Truck, 
  ClipboardList, CheckCircle, Boxes, ArrowUpDown, Calendar,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { InventoryActions } from "./InventoryActions";
import { UpdateStockButton } from "./UpdateStockButton";
import { DeliveriesList } from "./DeliveriesList";
import { RequestsList } from "./RequestsList";
import { PrintLabelModal } from "./PrintLabelModal";
import { Printer } from "lucide-react";

interface InventoryDashboardProps {
  initialStock: any[];
  initialDeliveries: any[];
  initialRequests: any[];
  currentTab: string;
}

export function InventoryDashboard({ 
  initialStock, 
  initialDeliveries, 
  initialRequests,
  currentTab: tabParam
}: InventoryDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  
  // Tabs are managed by URL in the parent, but we can also use state if we want real-time feel.
  // For now let's stick to the URL tabs but keep filtering logic local for speed.

  // Filtering & Sorting Logic
  const filteredStock = useMemo(() => {
    let result = [...initialStock];
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "qty-high") return b.quantity - a.quantity;
      if (sortBy === "qty-low") return a.quantity - b.quantity;
      return 0;
    });
    return result;
  }, [initialStock, searchQuery, sortBy]);

  const filteredDeliveries = useMemo(() => {
    let result = [...initialDeliveries];
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expected.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      // Mock date sorting (assuming string format like "Today" or "Oct 25")
      return 0; 
    });
    return result;
  }, [initialDeliveries, searchQuery, sortBy]);

  const filteredRequests = useMemo(() => {
    let result = [...initialRequests];
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requester.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "priority") return b.priority === 'High' ? 1 : -1;
      return 0;
    });
    return result;
  }, [initialRequests, searchQuery, sortBy]);

  // Grouped Stock
  const stockByCategory = filteredStock.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-4 pb-10">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#182232]">Inventory</h1>
          <p className="text-sm text-gray-500 font-sans">Site Alpha - Sector 2A</p>
        </div>
        <InventoryActions />
      </div>

      {/* Search & Sort Row */}
      <div className="flex space-x-2">
        <div className="flex-1 bg-[#f0f3ff] rounded-2xl border-b-2 border-[#182232]/30 px-4 py-3 flex items-center gap-3 focus-within:bg-[#e7eeff] focus-within:border-[#182232] transition-all shadow-sm">
          <Search className="text-[#182232] w-4 h-4 opacity-50" />
          <input 
            type="text"
            placeholder="Search items, dates (e.g. Oct 25), or suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-sans font-medium placeholder:text-[#182232]/30"
          />
        </div>

        <div className="relative">
          <Button 
            variant="outline" 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={`h-12 w-12 border-none shadow-md rounded-2xl flex items-center justify-center p-0 transition-all ${showSortDropdown ? 'bg-[#182232] text-white' : 'bg-[#ffffff] text-[#182232]'}`}
          >
            <ArrowUpDown className="w-5 h-5" />
          </Button>

          {showSortDropdown && (
            <div className="absolute top-full right-0 z-50 mt-2 min-w-[12rem] bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
               {[
                  { id: 'name-asc', label: 'Name (A-Z)' },
                  { id: 'name-desc', label: 'Name (Z-A)' },
                  { id: 'qty-high', label: 'Highest Stock' },
                  { id: 'qty-low', label: 'Lowest Stock' },
                  { id: 'priority', label: 'High Priority First' },
               ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => {
                       setSortBy(option.id);
                       setShowSortDropdown(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${sortBy === option.id ? 'bg-[#f0f3ff] text-[#182232]' : 'bg-transparent text-gray-500 hover:bg-[#fcfcff]'}`}
                  >
                     {option.label}
                  </button>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e7eeff] rounded-xl p-1.5 shadow-inner">
        <Link href="/inventory?tab=stock" className={`flex-1 text-center font-bold text-xs py-2.5 rounded-lg transition-all font-sans ${tabParam === 'stock' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
          Stock Items
        </Link>
        <Link href="/inventory?tab=deliveries" className={`flex-1 text-center font-bold text-xs py-2.5 rounded-lg transition-all font-sans ${tabParam === 'deliveries' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
          Deliveries
        </Link>
        <Link href="/inventory?tab=requests" className={`flex-1 text-center font-bold text-xs py-2.5 rounded-lg transition-all font-sans ${tabParam === 'requests' ? 'bg-[#ffffff] text-[#182232] shadow-sm' : 'text-gray-500 hover:text-[#182232]'}`}>
          Requests
        </Link>
      </div>

      {/* List Layout */}
      <div className="pt-2">
        
        {tabParam === 'stock' && (
          <div className="space-y-6">
            {(Object.entries(stockByCategory) as [string, any[]][]).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#f9f3e4] flex items-center justify-center">
                    <Boxes className="w-4 h-4 text-[#715c00]" />
                  </div>
                  <h2 className="font-heading font-bold text-md text-[#182232]">{category}</h2>
                  <div className="flex-1 border-b-2 border-dashed border-[#182232]/5 ml-2"></div>
                </div>

                {items.map((item: any) => (
                  <Card key={item.id} className="bg-[#ffffff] border-none shadow-[0_8px_16px_-8px_rgba(45,55,72,0.1)] hover:shadow-md transition-all">
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-heading font-bold text-[#182232] text-lg">{item.name}</h3>
                          <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-widest mt-0.5">Asset ID: MAT-{item.id.substring(0, 4)}</p>
                        </div>
                        {item.restock_needed && (
                          <div className="bg-[#ffdad6] text-[#ba1a1a] text-[9px] font-black px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter">
                            <AlertTriangle className="w-3 h-3" />
                            CRITICAL
                          </div>
                        )}
                      </div>
                      
                        <div className="flex items-end justify-between mt-3">
                          <div>
                            <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-widest mb-1">Inventory Level</p>
                            <p className={`text-2xl font-heading font-bold tracking-tighter ${item.restock_needed ? 'text-[#ba1a1a]' : 'text-[#182232]'}`}>
                              {item.quantity} <span className="text-sm font-sans font-bold text-gray-300 uppercase ml-1">{item.unit}</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                             <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 w-10 p-0 rounded-xl border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#182232]"
                                onClick={() => {
                                   setSelectedMaterial(item);
                                   setIsPrintModalOpen(true);
                                }}
                             >
                                <Printer size={18} />
                             </Button>
                             <UpdateStockButton material={item} />
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        )}

        {tabParam === 'deliveries' && (
          <DeliveriesList deliveries={filteredDeliveries} />
        )}

        {tabParam === 'requests' && (
          <RequestsList requests={filteredRequests} />
        )}
        
      </div>

      <PrintLabelModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        material={selectedMaterial}
      />
    </div>
  );
}
