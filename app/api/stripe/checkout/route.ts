import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { createStripeCheckoutSession } from "@/lib/billing/stripe";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { billingInterval?: "monthly" | "yearly" };
    const billingInterval = body.billingInterval === "yearly" ? "yearly" : "monthly";

    const businessId = getCurrentBusinessId();
    const supabase = await createClient();

    const { data: business } = await supabase
      .from("businesses")
      .select("owner_user_id")
      .eq("id", businessId)
      .maybeSingle();

    const { data: owner } = await supabase
      .from("users")
      .select("id")
      .eq("id", business?.owner_user_id ?? "")
      .maybeSingle();

    const email = process.env.DEMO_OWNER_EMAIL || "demo@randevutr.com";

    if (!owner) {
      return NextResponse.json({ error: "İşletme sahibi bulunamadı" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const session = await createStripeCheckoutSession({
      customerEmail: email,
      businessId,
      planType: "pro",
      billingInterval,
      successUrl: `${origin}/isletme/abonelik?checkout=success`,
      cancelUrl: `${origin}/isletme/abonelik?checkout=cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout başlatılamadı" }, { status: 500 });
  }
}
