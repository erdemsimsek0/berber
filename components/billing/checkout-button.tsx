"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ interval }: { interval: "monthly" | "yearly" }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      onClick={() =>
        startTransition(async () => {
          const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ billingInterval: interval })
          });
          const payload = (await response.json()) as { url?: string; error?: string };
          if (!response.ok || !payload.url) {
            alert(payload.error ?? "Ödeme sayfası başlatılamadı");
            return;
          }
          window.location.href = payload.url;
        })
      }
      className="w-full"
      variant={interval === "yearly" ? "default" : "outline"}
      disabled={pending}
    >
      {pending ? "Yönlendiriliyor..." : interval === "yearly" ? "Yıllık PRO'ya Geç" : "Aylık PRO'ya Geç"}
    </Button>
  );
}
