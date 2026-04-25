import { X, Truck, Calendar, User, Phone, Mail, MapPin, Package, ShieldAlert, CheckCircle, Trash2, Edit3, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface DeliveryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
}

export function DeliveryDetailModal({ isOpen, onClose, delivery }: DeliveryDetailModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState(delivery?.status || 'Pending');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !delivery) return null;

  const handleMarkReceived = async () => {
    setIsProcessing(true);
    try {
      // 1. Update delivery status
      const { error: delError } = await supabase
        .from('deliveries')
        .update({ status: 'Delivered' })
        .eq('id', delivery.id);

      if (delError) throw delError;

      // 2. Fetch current stock of that material
      const { data: materialData, error: matFetchErr } = await supabase
        .from('materials')
        .select('id, quantity')
        .eq('name', delivery.material_name)
        .single();

      if (matFetchErr) {
        console.warn("Could not find matching material in inventory to update stock automatically.");
      } else {
        // 3. Increment stock
        const newQty = Number(materialData.quantity) + Number(delivery.quantity || 0);
        await supabase
          .from('materials')
          .update({ quantity: newQty, restock_needed: false })
          .eq('id', materialData.id);
      }

      // 4. AUTO-GENERATE INVOICE (New Finance Integration)
      const invoiceNum = "INV-" + Math.floor(100000 + Math.random() * 900000);
      const estimatedPrice = Number(delivery.quantity || 1) * 450; // Mock price: 450 per unit

      await supabase.from('invoices').insert({
        invoice_number: invoiceNum,
        vendor_name: delivery.supplier,
        amount: estimatedPrice,
        status: 'Unpaid',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Due in 7 days
        item_description: `Material Receipt: ${delivery.material_name} (${delivery.quantity || 0} Units)`
      });

      setStatus('Delivered');
      router.refresh();
      setTimeout(onClose, 1000);
    } catch (err) {
      console.error("Mark Received Error:", err);
      alert("Failed to update status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setIsProcessing(true);
    try {
      await supabase.from('deliveries').update({ status: 'Cancelled' }).eq('id', delivery.id);
      setStatus('Cancelled');
      router.refresh();
      setTimeout(onClose, 800);
    } finally {
      setIsProcessing(false);
    }
  };

  const contactDetails = {
    dealer: "Nitin Malhotra",
    company: delivery.supplier,
    phone: "+91 98765-43210",
    email: "contact@buildmat.com",
    address: "Warehouse Block C, Okhla Phase III, Delhi"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header with Background Pattern */}
        <div className="relative p-6 bg-[#182232] text-white overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Truck size={120} />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Truck className="w-8 h-8 text-[#feda5a]" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold">{delivery.material_name}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-0.5">Order ID: {delivery.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 flex gap-3">
             <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight flex items-center gap-1.5 ${
                status === 'In Transit' ? 'bg-[#feda5a] text-[#182232]' : 
                status === 'Pending' ? 'bg-[#e7eeff] text-[#182232]' :
                status === 'Delivered' ? 'bg-[#88f9b0] text-[#002813]' :
                'bg-red-100 text-red-700'
             }`}>
                {status === 'In Transit' ? <ArrowRight className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {status}
             </span>
             <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight bg-white/10 border border-white/20 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> {delivery.expected_arrival}
             </span>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-[#fcfcfc]">
           
           {/* Dealer Information Section */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Supplier Contacts</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-[#f0f3ff] flex items-center justify-center">
                       <User className="w-6 h-6 text-[#182232]" />
                    </div>
                    <div>
                       <h4 className="font-heading font-bold text-[#182232]">{contactDetails.dealer}</h4>
                       <p className="text-xs text-gray-500 font-sans font-medium">{contactDetails.company}</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Phone className="w-4 h-4 text-gray-400" />
                       </div>
                       <p className="text-xs font-bold text-[#182232]">{contactDetails.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Mail className="w-4 h-4 text-gray-400" />
                       </div>
                       <p className="text-xs font-bold text-[#182232] font-sans truncate">{contactDetails.email}</p>
                    </div>
                 </div>

                 <div className="flex gap-3 pt-2">
                    <MapPin className="w-4 h-4 text-gray-300 mt-0.5" />
                    <p className="text-xs text-gray-500 font-sans leading-relaxed italic">{contactDetails.address}</p>
                 </div>
              </div>
           </div>

           {/* Delivery Details Section */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Package Info</h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col gap-1">
                    <Package className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Item Quantity</p>
                    <p className="text-lg font-heading font-bold text-[#182232]">{delivery.quantity || 0} <span className="text-xs font-sans text-gray-500">Units</span></p>
                 </div>
                 <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col gap-1">
                    <ShieldAlert className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Handling</p>
                    <p className="text-lg font-heading font-bold text-[#182232]">High <span className="text-xs font-sans text-gray-500">Priority</span></p>
                 </div>
              </div>
           </div>

           {/* Quick Actions Panel */}
           <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Management Controls</h3>
              <div className="flex flex-col gap-3">
                 <div className="flex gap-3">
                    <Button 
                      className="flex-1 h-12 bg-[#002813] hover:bg-[#004d26] rounded-xl font-heading font-bold gap-2 shadow-lg shadow-[#002813]/20 disabled:opacity-50"
                      onClick={handleMarkReceived}
                      disabled={status === 'Delivered' || status === 'Cancelled' || isProcessing}
                    >
                       {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                       {status === 'Delivered' ? 'Received' : 'Mark as Received'}
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 border-2 border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl font-heading font-bold gap-2 disabled:opacity-30"
                      onClick={handleCancelOrder}
                      disabled={status === 'Delivered' || status === 'Cancelled' || isProcessing}
                    >
                       <Trash2 className="w-4 h-4" /> Cancel Order
                    </Button>
                 </div>
                 <p className="text-[9px] text-center text-gray-400 font-sans italic">
                    Marking as received will automatically update your inventory stock.
                 </p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
