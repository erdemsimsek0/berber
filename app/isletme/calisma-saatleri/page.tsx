import { SectionShell } from "@/components/dashboard/section-shell";
import { CrudDrawer } from "@/components/dashboard/crud-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteWorkingHoursAction, upsertWorkingHoursAction } from "@/lib/actions/dashboard";

const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default async function WorkingHoursPage() {
  const supabase = await createClient();
  const businessId = getCurrentBusinessId();
  const [{ data: rows }, { data: branches }, { data: staff }] = await Promise.all([
    supabase.from("working_hours").select("id,day_of_week,start_time,end_time,branch_id,staff_id").eq("business_id", businessId).order("day_of_week"),
    supabase.from("branches").select("id,name").eq("business_id", businessId),
    supabase.from("staff").select("id,full_name").eq("business_id", businessId).eq("is_active", true)
  ]);

  return (
    <div className="space-y-4">
      <SectionShell title="Çalışma Saatleri" description="Şube/personel bazlı çalışma saatlerini yönetin" bullets={["Gün", "Saat", "Kapsam"]} />
      <CrudDrawer title="Yeni Çalışma Saati" buttonLabel="Saat Ekle">
        <form action={upsertWorkingHoursAction} className="grid gap-3 md:grid-cols-3">
          <select name="day_of_week" className="h-10 rounded-lg border px-3">{days.map((day, i) => <option key={day} value={i}>{day}</option>)}</select>
          <input name="start_time" type="time" className="h-10 rounded-lg border px-3" required />
          <input name="end_time" type="time" className="h-10 rounded-lg border px-3" required />
          <select name="branch_id" className="h-10 rounded-lg border px-3"><option value="">Tüm Şubeler</option>{branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <select name="staff_id" className="h-10 rounded-lg border px-3"><option value="">Tüm Personel</option>{staff?.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
          <Button>Kaydet</Button>
        </form>
      </CrudDrawer>
      {!rows?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz çalışma saati eklenmedi.</p> : (
        <div className="rounded-xl border bg-white p-3 space-y-2">
          {rows.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 border-b pb-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm">{days[item.day_of_week]} • {item.start_time.slice(0,5)} - {item.end_time.slice(0,5)}</p>
              <form action={async () => { "use server"; await deleteWorkingHoursAction(item.id); }}><Button size="sm" variant="ghost">Sil</Button></form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
