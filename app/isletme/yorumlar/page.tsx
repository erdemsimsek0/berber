import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { deleteReviewAction } from "@/lib/actions/dashboard";

export default async function ReviewsPage() {
  const { data: reviews } = await (await createClient())
    .from("reviews")
    .select("id,rating,comment,created_at,customers(full_name),appointments(status)")
    .eq("business_id", getCurrentBusinessId())
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <SectionShell title="Yorum Moderasyonu" description="Yorumları inceleyin, uygunsuz içerikleri kaldırın" bullets={["Puan", "Yorum", "Moderasyon"]} />
      {!reviews?.length ? <p className="rounded-xl border bg-white p-4 text-sm">Henüz yorum bulunmuyor.</p> : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-white p-4">
              <p className="font-medium">⭐ {review.rating} - {(review.customers as { full_name?: string } | null)?.full_name ?? "Müşteri"}</p>
              <p className="mt-1 text-sm text-slate-700">{review.comment || "Yorum metni yok."}</p>
              <p className="mt-2 text-xs text-slate-500">Randevu durumu: {(review.appointments as { status?: string } | null)?.status ?? "-"}</p>
              <form action={async () => { "use server"; await deleteReviewAction(review.id); }} className="mt-3">
                <Button size="sm" variant="ghost">Yorumu Kaldır</Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
