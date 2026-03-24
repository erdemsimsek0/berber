import { SectionShell } from "@/components/dashboard/section-shell";
import { CrudDrawer } from "@/components/dashboard/crud-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteStaffAction, upsertStaffAction } from "@/lib/actions/dashboard";

export default async function StaffPage() {
  const supabase = await createClient();
  const businessId = getCurrentBusinessId();
  const [{ data: staff }, { data: branches }] = await Promise.all([
    supabase.from("staff").select("id,full_name,phone,is_active,branch_id").eq("business_id", businessId).order("created_at", { ascending: false }),
    supabase.from("branches").select("id,name").eq("business_id", businessId)
  ]);

  return (
    <div className="space-y-4">
      <SectionShell title="Personel" description="Personel CRUD" bullets={["Personel ekle", "Şube ata", "Aktif/Pasif"]} />
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
              <form action={async () => { "use server"; await deleteStaffAction(person.id); }} className="mt-2"><Button size="sm" variant="ghost">Sil</Button></form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
