import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { CrudDrawer } from "@/components/dashboard/crud-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteStaffAction, upsertStaffAction, upsertStaffServicesAction } from "@/lib/actions/dashboard";

export default async function StaffPage() {
  const supabase = await createClient();
  const businessId = getCurrentBusinessId();
  const [{ data: staff }, { data: branches }, { data: services }, { data: staffServices }] = await Promise.all([
    supabase.from("staff").select("id,full_name,phone,is_active,branch_id").eq("business_id", businessId).order("created_at", { ascending: false }),
    supabase.from("branches").select("id,name").eq("business_id", businessId),
    supabase.from("services").select("id,name").eq("business_id", businessId).eq("is_active", true),
    supabase.from("staff_services").select("staff_id,service_id")
  ]);

  const staffServicesMap = new Map<string, string[]>();
  for (const row of staffServices ?? []) {
    const list = staffServicesMap.get(row.staff_id) ?? [];
    list.push(row.service_id);
    staffServicesMap.set(row.staff_id, list);
  }

  return (
    <div className="space-y-4">
      <SectionShell title="Personel" description="Personel CRUD, hizmet atama ve çalışma saatleri yönetimi" bullets={["Personel ekle", "Hizmet ata", "Çalışma saatleri"]} />
      <CrudDrawer title="Yeni Personel" buttonLabel="Personel Ekle">
        <form action={upsertStaffAction} className="grid gap-3 md:grid-cols-2">
          <input name="full_name" placeholder="Ad Soyad" className="h-10 rounded-lg border px-3" required />
          <input name="phone" placeholder="Telefon" className="h-10 rounded-lg border px-3" />
          <select name="branch_id" className="h-10 rounded-lg border px-3 md:col-span-2"><option value="">Tüm Şubeler</option>{branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <Button className="md:col-span-2">Kaydet</Button>
        </form>
      </CrudDrawer>

      {!staff?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz personel eklenmemiş.</p> : (
        <div className="grid gap-3 md:grid-cols-2">
          {staff.map((person) => (
            <div key={person.id} className="rounded-xl border bg-white p-4">
              <form action={upsertStaffAction} className="space-y-2">
                <input type="hidden" name="id" value={person.id} />
                <input name="full_name" defaultValue={person.full_name} className="h-9 w-full rounded border px-2" required />
                <input name="phone" defaultValue={person.phone ?? ""} className="h-9 w-full rounded border px-2" />
                <select name="branch_id" defaultValue={person.branch_id ?? ""} className="h-9 w-full rounded border px-2"><option value="">Tüm Şubeler</option>{branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="is_active" defaultChecked={person.is_active} /> Aktif</label>
                <div className="flex gap-2"><Button size="sm">Güncelle</Button></div>
              </form>

              <form action={upsertStaffServicesAction} className="mt-3 space-y-2">
                <input type="hidden" name="staff_id" value={person.id} />
                <input
                  name="service_ids"
                  defaultValue={(staffServicesMap.get(person.id) ?? []).join(",")}
                  placeholder="Hizmet ID'lerini virgülle girin"
                  className="h-9 w-full rounded border px-2"
                />
                <Button size="sm" variant="outline">Hizmet Atamalarını Kaydet</Button>
              </form>

              <div className="mt-3 flex gap-2">
                <form action={async () => { "use server"; await deleteStaffAction(person.id); }}><Button size="sm" variant="ghost">Sil</Button></form>
                <Button asChild size="sm" variant="outline"><Link href="/isletme/calisma-saatleri">Çalışma Saatleri</Link></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
        <p className="mb-1 font-semibold text-slate-200">Kullanılabilir Hizmet ID'leri</p>
        <ul className="space-y-1">
          {services?.map((service) => (
            <li key={service.id}>{service.name}: <code>{service.id}</code></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
