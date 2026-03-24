import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteCustomerAction, updateCustomerAction } from "@/lib/actions/dashboard";

export default async function CustomersPage() {
  const { data: customers } = await (await createClient())
    .from("customers")
    .select("id,full_name,phone,email,created_at,appointments(id)")
    .eq("business_id", getCurrentBusinessId())
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <SectionShell title="Müşteriler" description="Müşteri bilgilerini güncelleyin" bullets={["Liste", "Düzenleme", "Silme"]} />
      {!customers?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz müşteri bulunmuyor.</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b bg-slate-50 text-left"><th className="p-3">Müşteri</th><th className="p-3">İletişim</th><th className="p-3">İşlem</th></tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b align-top">
                  <td className="p-3">
                    {customer.full_name}
                    <p className="text-xs text-slate-500">{new Date(customer.created_at).toLocaleDateString("tr-TR")}</p>
                    <p className="text-xs text-slate-500">Randevu sayısı: {(customer.appointments as { id: string }[] | null)?.length ?? 0}</p>
                  </td>
                  <td className="p-3">
                    <form action={updateCustomerAction} className="space-y-2">
                      <input type="hidden" name="id" value={customer.id} />
                      <input name="full_name" defaultValue={customer.full_name} className="h-9 rounded border px-2" />
                      <input name="phone" defaultValue={customer.phone} className="h-9 rounded border px-2" />
                      <input name="email" defaultValue={customer.email ?? ""} className="h-9 rounded border px-2" />
                      <div><Button size="sm">Güncelle</Button></div>
                    </form>
                  </td>
                  <td className="p-3"><form action={async () => { "use server"; await deleteCustomerAction(customer.id); }}><Button size="sm" variant="ghost">Sil</Button></form></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
