import { SectionShell } from "@/components/dashboard/section-shell";
import { CrudDrawer } from "@/components/dashboard/crud-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteServiceAction, upsertServiceAction } from "@/lib/actions/dashboard";

export default async function ServicesPage() {
  const supabase = await createClient();
  const businessId = getCurrentBusinessId();
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("id,name,duration_min,price_try,is_active,branch_id").eq("business_id", businessId).order("created_at", { ascending: false }),
    supabase.from("branches").select("id,name").eq("business_id", businessId)
  ]);

  return (
    <div className="space-y-4">
      <SectionShell title="Hizmetler" description="Hizmet CRUD yönetimi" bullets={["Ekle", "Düzenle", "Aktif/Pasif"]} />
      <CrudDrawer title="Yeni Hizmet" buttonLabel="Hizmet Ekle">
        <form action={upsertServiceAction} className="grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Hizmet adı" className="h-10 rounded-lg border px-3" required />
          <select name="branch_id" className="h-10 rounded-lg border px-3"><option value="">Tüm Şubeler</option>{branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <input name="duration_min" type="number" min={5} placeholder="Süre (dk)" className="h-10 rounded-lg border px-3" required />
          <input name="price_try" type="number" min={0} step="0.01" placeholder="Fiyat (₺)" className="h-10 rounded-lg border px-3" required />
          <Button className="md:col-span-2">Kaydet</Button>
        </form>
      </CrudDrawer>

      {!services?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz hizmet eklenmemiş.</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b bg-slate-50 text-left"><th className="p-3">Hizmet</th><th className="p-3">Süre</th><th className="p-3">Fiyat</th><th className="p-3">Durum</th><th className="p-3">İşlem</th></tr></thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b align-top">
                  <td className="p-3">
                    <form action={upsertServiceAction} className="space-y-2">
                      <input type="hidden" name="id" value={service.id} />
                      <input name="name" defaultValue={service.name} className="h-9 rounded border px-2" required />
                      <div className="flex gap-2">
                        <input name="duration_min" defaultValue={service.duration_min} type="number" min={5} className="h-9 w-24 rounded border px-2" />
                        <input name="price_try" defaultValue={service.price_try} type="number" min={0} step="0.01" className="h-9 w-24 rounded border px-2" />
                      </div>
                      <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="is_active" defaultChecked={service.is_active} /> Aktif</label>
                      <Button size="sm">Güncelle</Button>
                    </form>
                  </td>
                  <td className="p-3">{service.duration_min} dk</td><td className="p-3">₺{service.price_try}</td><td className="p-3">{service.is_active ? "Aktif" : "Pasif"}</td>
                  <td className="p-3"><form action={async () => { "use server"; await deleteServiceAction(service.id); }}><Button size="sm" variant="ghost">Sil</Button></form></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
