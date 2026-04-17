import AppLayout from "@/components/AppLayout";
import { createServerSideClient } from "@/lib/supabase-server";
import { InventoryDashboard } from "@/components/InventoryDashboard";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentTab = (await searchParams).tab || "stock";
  const supabase = await createServerSideClient();
  
  // Example fetch materials from Supabase
  const { data: materials } = await supabase.from('materials').select('*');

  // Hardcode fallback if DB is empty
  const stockItems = materials && materials.length > 0 ? materials : [
    { id: '1', category: 'Raw Materials', name: 'Portland Cement (Type I)', quantity: 450, unit: 'Bags', low_stock_threshold: 500, restock_needed: true },
    { id: '2', category: 'Raw Materials', name: 'TMT Steel Bars (12mm)', quantity: 2400, unit: 'Kg', low_stock_threshold: 2000, restock_needed: false },
    { id: '3', category: 'Raw Materials', name: 'River Sand', quantity: 180, unit: 'Tons', low_stock_threshold: 100, restock_needed: false },
    { id: '4', category: 'Tools & Equipment', name: 'Core Drill Bits (10mm)', quantity: 15, unit: 'Units', low_stock_threshold: 20, restock_needed: true },
    { id: '5', category: 'Tools & Equipment', name: 'Safety Helmets', quantity: 120, unit: 'Units', low_stock_threshold: 50, restock_needed: false },
    { id: '6', category: 'Electrical & Plumbing', name: 'PVC Pipes (4 inch)', quantity: 300, unit: 'Meters', low_stock_threshold: 100, restock_needed: false },
  ];

  const deliveryItems = [
    { id: 'D-12', name: 'Portland Cement (Type I)', expected: 'Today, 2:00 PM', supplier: 'Jai Mat Cement', status: 'In Transit' },
    { id: 'D-13', name: 'TMT Steel Bars (12mm)', expected: 'Oct 25, Morning', supplier: 'Tata Steel Ltd', status: 'Pending' },
    { id: 'D-14', name: 'Electrical PVC Coils', expected: 'Oct 26, Afternoon', supplier: 'Havells India', status: 'Pending' },
  ];

  const requestItems = [
    { id: 'R-88', name: 'Safety Helmets (Yellow)', requester: 'Noida West Site', priority: 'High', status: 'Awaiting Approval' },
    { id: 'R-89', name: 'Drill Bits (10mm)', requester: 'Gurgaon PH-2', priority: 'Normal', status: 'Approved' },
  ];

  return (
    <AppLayout>
      <InventoryDashboard 
        initialStock={stockItems}
        initialDeliveries={deliveryItems}
        initialRequests={requestItems}
        currentTab={currentTab as string}
      />
    </AppLayout>
  );
}
