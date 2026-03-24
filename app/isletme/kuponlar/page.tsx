import { SectionShell } from "@/components/dashboard/section-shell";
import { CrudDrawer } from "@/components/dashboard/crud-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteCouponAction, upsertCouponAction } from "@/lib/actions/dashboard";

export default async function CouponsPage() {
  const { data: coupons } = await (await createClient())
    .from("coupons")
    .select("id,code,discount_type,discount_value,expires_at,active")
    .eq("business_id", getCurrentBusinessId())
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <SectionShell title="Kuponlar" description="Kupon oluşturun ve yönetin" bullets={["Kod", "İndirim", "Aktif/Pasif"]} />
      <CrudDrawer title="Yeni Kupon" buttonLabel="Kupon Ekle">
        <form action={upsertCouponAction} className="grid gap-3 md:grid-cols-2">
          <input name="code" placeholder="Kampanya kodu" className="h-10 rounded-lg border px-3" required />
          <select name="discount_type" className="h-10 rounded-lg border px-3"><option value="percent">Yüzde</option><option value="fixed">Sabit</option></select>
          <input name="discount_value" type="number" min={1} step="0.01" placeholder="İndirim" className="h-10 rounded-lg border px-3" required />
          <input name="expires_at" type="date" className="h-10 rounded-lg border px-3" />
          <Button className="md:col-span-2">Kaydet</Button>
        </form>
      </CrudDrawer>

      {!coupons?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz kupon bulunmuyor.</p> : (
        <div className="grid gap-3 md:grid-cols-2">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-xl border bg-white p-4">
              <form action={upsertCouponAction} className="space-y-2">
                <input type="hidden" name="id" value={coupon.id} />
                <input name="code" defaultValue={coupon.code} className="h-9 w-full rounded border px-2" />
                <div className="grid grid-cols-2 gap-2">
                  <select name="discount_type" defaultValue={coupon.discount_type} className="h-9 rounded border px-2"><option value="percent">Yüzde</option><option value="fixed">Sabit</option></select>
                  <input name="discount_value" type="number" defaultValue={coupon.discount_value} className="h-9 rounded border px-2" />
                </div>
                <input name="expires_at" type="date" defaultValue={coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 10) : ""} className="h-9 w-full rounded border px-2" />
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="active" defaultChecked={coupon.active} /> Aktif</label>
                <div className="flex gap-2"><Button size="sm">Güncelle</Button></div>
              </form>
              <form action={async () => { "use server"; await deleteCouponAction(coupon.id); }} className="mt-2"><Button size="sm" variant="ghost">Sil</Button></form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
