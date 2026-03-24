import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { updateBusinessSettingsAction } from "@/lib/actions/dashboard";

export default async function SettingsPage() {
  const { data: business } = await (await createClient())
    .from("businesses")
    .select("name,description,city,district,is_active")
    .eq("id", getCurrentBusinessId())
    .maybeSingle();

  return (
    <div className="space-y-4">
      <SectionShell title="Ayarlar" description="İşletme profil ayarları" bullets={["İsim", "Konum", "Aktiflik"]} />
      <form action={updateBusinessSettingsAction} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input name="name" defaultValue={business?.name ?? ""} placeholder="İşletme adı" className="h-10 rounded-lg border px-3" required />
        <input name="city" defaultValue={business?.city ?? ""} placeholder="Şehir" className="h-10 rounded-lg border px-3" required />
        <input name="district" defaultValue={business?.district ?? ""} placeholder="İlçe" className="h-10 rounded-lg border px-3" required />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={business?.is_active ?? true} /> İşletme aktif</label>
        <textarea name="description" defaultValue={business?.description ?? ""} placeholder="Açıklama" className="min-h-24 rounded-lg border p-3 md:col-span-2" />
        <Button className="md:col-span-2">Ayarları Kaydet</Button>
      </form>
    </div>
  );
}
