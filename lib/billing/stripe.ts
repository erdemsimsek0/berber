const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getSecret() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY tanımlı değil");
  return key;
}

async function stripeRequest(path: string, params: URLSearchParams) {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecret()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe isteği başarısız: ${text}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}

export async function createStripeCheckoutSession(input: {
  customerEmail: string;
  businessId: string;
  planType: "pro";
  billingInterval: "monthly" | "yearly";
  successUrl: string;
  cancelUrl: string;
}) {
  const priceId =
    input.billingInterval === "yearly"
      ? process.env.STRIPE_PRICE_PRO_YEARLY
      : process.env.STRIPE_PRICE_PRO_MONTHLY;

  if (!priceId) throw new Error("Stripe fiyat kimliği tanımlı değil");

  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("customer_email", input.customerEmail);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);
  params.set("metadata[business_id]", input.businessId);
  params.set("metadata[plan_type]", input.planType);
  params.set("metadata[billing_interval]", input.billingInterval);

  return stripeRequest("/checkout/sessions", params);
}

export function verifyWebhookSignature() {
  // TODO: Stripe SDK olmadan ham signature doğrulaması bu MVP aşamada yapılmıyor.
  // Production'da Stripe webhook signing secret ile doğrulama zorunludur.
  return true;
}
