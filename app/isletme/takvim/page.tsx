import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { createDashboardAppointmentAction, deleteAppointmentAction, updateAppointmentStatusAction } from "@/lib/actions/dashboard";

export default async function CalendarPage() {
  const businessId = getCurrentBusinessId();
  const supabase = await createClient();

  const [{ data: appointments }, { data: branches }, { data: services }, { data: customers }, { data: staff }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id,start_at,end_at,status,notes,service:services(name),customer:customers(full_name),staff:staff(full_name)")
      .eq("business_id", businessId)
      .order("start_at", { ascending: false })
      .limit(50),
    supabase.from("branches").select("id,name").eq("business_id", businessId),
    supabase.from("services").select("id,name").eq("business_id", businessId).eq("is_active", true),
    supabase.from("customers").select("id,full_name").eq("business_id", businessId).order("full_name"),
    supabase.from("staff").select("id,full_name").eq("business_id", businessId).eq("is_active", true)
  ]);

  return (
    <div className="space-y-4">
      <SectionShell
        title="Takvim ve Randevular"
        description="Randevuları oluşturun, durumlarını güncelleyin ve kayıtları yönetin."
        bullets={["Randevu oluştur", "Durum güncelle", "Kayıt sil"]}
      />

      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] p-4">
        <h2 className="mb-3 text-xl font-semibold">Yeni Randevu</h2>
        <form action={createDashboardAppointmentAction} className="grid gap-3 md:grid-cols-3">
          <select name="branch_id" required>
            <option value="">Şube seçin</option>
            {branches?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select name="service_id" required>
            <option value="">Hizmet seçin</option>
            {services?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select name="customer_id" required>
            <option value="">Müşteri seçin</option>
            {customers?.map((item) => <option key={item.id} value={item.id}>{item.full_name}</option>)}
          </select>
          <select name="staff_id">
            <option value="">Müsait personel</option>
            {staff?.map((item) => <option key={item.id} value={item.id}>{item.full_name}</option>)}
          </select>
          <input type="date" name="date" required />
          <input type="time" name="time" required />
          <input className="md:col-span-2" name="notes" placeholder="Not (opsiyonel)" />
          <Button className="md:col-span-1">Randevu Oluştur</Button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] p-2">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="px-3 py-2">Tarih</th>
              <th className="px-3 py-2">Müşteri</th>
              <th className="px-3 py-2">Hizmet</th>
              <th className="px-3 py-2">Personel</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment) => (
              <tr key={appointment.id} className="border-b border-white/5 align-top">
                <td className="px-3 py-2">{new Date(appointment.start_at).toLocaleString("tr-TR")}</td>
                <td className="px-3 py-2">{(appointment.customer as { full_name?: string } | null)?.full_name ?? "-"}</td>
                <td className="px-3 py-2">{(appointment.service as { name?: string } | null)?.name ?? "-"}</td>
                <td className="px-3 py-2">{(appointment.staff as { full_name?: string } | null)?.full_name ?? "Atanmadı"}</td>
                <td className="px-3 py-2">
                  <form action={updateAppointmentStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={appointment.id} />
                    <select name="status" defaultValue={appointment.status}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="no_show">no_show</option>
                    </select>
                    <Button size="sm">Kaydet</Button>
                  </form>
                </td>
                <td className="px-3 py-2">
                  <form action={async () => { "use server"; await deleteAppointmentAction(appointment.id); }}>
                    <Button variant="ghost" size="sm">Sil</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
