import { SectionShell } from "@/components/dashboard/section-shell";
import { CrudDrawer } from "@/components/dashboard/crud-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteBlockedTimeAction, upsertBlockedTimeAction } from "@/lib/actions/dashboard";

export default async function BlockedTimesPage() {
  const supabase = await createClient();
  const businessId = getCurrentBusinessId();
  const [{ data: blocked }, { data: branches }, { data: staff }] = await Promise.all([
    supabase.from("blocked_times").select("id,start_at,end_at,reason").eq("business_id", businessId).order("start_at", { ascending: true }),
    supabase.from("branches").select("id,name").eq("business_id", businessId),
    supabase.from("staff").select("id,full_name").eq("business_id", businessId).eq("is_active", true)
  ]);

  return (
    <div className="space-y-4">
      <SectionShell title="Bloke Zamanlar" description="Randevuya kapalı zaman aralıklarını yönetin" bullets={["Toplantı", "İzin", "Bakım"]} />
      <CrudDrawer title="Yeni Bloke Zaman" buttonLabel="Bloke Zaman Ekle">
        <form action={upsertBlockedTimeAction} className="grid gap-3 md:grid-cols-2">
          <input name="start_at" type="datetime-local" className="h-10 rounded-lg border px-3" required />
          <input name="end_at" type="datetime-local" className="h-10 rounded-lg border px-3" required />
          <select name="branch_id" className="h-10 rounded-lg border px-3"><option value="">Tüm Şubeler</option>{branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <select name="staff_id" className="h-10 rounded-lg border px-3"><option value="">Tüm Personel</option>{staff?.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
          <input name="reason" placeholder="Sebep" className="h-10 rounded-lg border px-3 md:col-span-2" />
          <Button className="md:col-span-2">Kaydet</Button>
        </form>
      </CrudDrawer>
      {!blocked?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz bloke zaman bulunmuyor.</p> : (
        <div className="rounded-xl border bg-white p-3 space-y-2">
          {blocked.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 border-b pb-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm">{new Date(item.start_at).toLocaleString("tr-TR")} - {new Date(item.end_at).toLocaleString("tr-TR")} ({item.reason || "Sebep yok"})</p>
              <form action={async () => { "use server"; await deleteBlockedTimeAction(item.id); }}><Button size="sm" variant="ghost">Sil</Button></form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
