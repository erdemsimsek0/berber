import type { BusinessListItem } from "@/lib/data/types";
import { createClient } from "@/lib/supabase/server";
import { demoBusinesses, findDemoBusinessBySlug } from "@/lib/data/demo";

function canUseSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type SupabaseBusinessRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  description: string | null;
  branches: BusinessListItem["branches"] | null;
  services: BusinessListItem["services"] | null;
  staff: BusinessListItem["staff"] | null;
};

export async function getBusinesses(): Promise<BusinessListItem[]> {
  if (!canUseSupabase()) return demoBusinesses;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("id,slug,name,city,district,description,branches(id,name,address,phone),services(id,name,duration_min,price_try),staff(id,full_name,branch_id,is_active)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return demoBusinesses;

  return (data as SupabaseBusinessRow[]).map((business) => ({
    ...business,
    rating: 4.8,
    branches: business.branches ?? [],
    services: business.services ?? [],
    staff: (business.staff ?? []).filter((item) => item.is_active)
  }));
}

export async function getBusinessBySlug(slug: string): Promise<BusinessListItem | null> {
  if (!canUseSupabase()) return findDemoBusinessBySlug(slug);

  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id,slug,name,city,district,description,branches(id,name,address,phone),services(id,name,duration_min,price_try),staff(id,full_name,branch_id,is_active)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !business) return findDemoBusinessBySlug(slug);

  const typedBusiness = business as SupabaseBusinessRow;
  return {
    ...typedBusiness,
    rating: 4.8,
    branches: typedBusiness.branches ?? [],
    services: typedBusiness.services ?? [],
    staff: (typedBusiness.staff ?? []).filter((item) => item.is_active)
  };
}
