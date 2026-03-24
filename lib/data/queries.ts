import { createClient } from "@/lib/supabase/server";
import { demoBusinesses, findDemoBusinessBySlug } from "@/lib/data/demo";

function canUseSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getBusinesses() {
  if (!canUseSupabase()) return demoBusinesses;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("id,slug,name,city,district,description,branches(id,name,address,phone),services(id,name,duration_min,price_try)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return demoBusinesses;

  return data.map((business) => ({
    ...business,
    rating: 4.8,
    branches: business.branches ?? [],
    services: business.services ?? []
  }));
}

export async function getBusinessBySlug(slug: string) {
  if (!canUseSupabase()) return findDemoBusinessBySlug(slug);

  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id,slug,name,city,district,description,branches(id,name,address,phone),services(id,name,duration_min,price_try)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !business) return findDemoBusinessBySlug(slug);

  return {
    ...business,
    rating: 4.8,
    branches: business.branches ?? [],
    services: business.services ?? []
  };
}
