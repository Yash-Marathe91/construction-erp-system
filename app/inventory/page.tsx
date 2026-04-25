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
  
  // Fetch dynamic data from Supabase
  const { data: materials } = await supabase.from('materials').select('*').order('name');
  const { data: deliveries } = await supabase.from('deliveries').select('*').order('created_at', { ascending: false });
  const { data: requests } = await supabase.from('material_requests').select('*').order('created_at', { ascending: false });

  return (
    <AppLayout>
      <InventoryDashboard 
        initialStock={materials || []}
        initialDeliveries={deliveries || []}
        initialRequests={requests || []}
        currentTab={currentTab as string}
      />
    </AppLayout>
  );
}
