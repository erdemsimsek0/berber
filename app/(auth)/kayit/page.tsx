"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/app/(auth)/actions";

const initialState = { ok: true, message: "" } as { ok: boolean; message: string };

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signupAction, initialState);

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-5 p-6 sm:p-7">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Kayıt Ol</h1>
          <p className="text-sm">Dakikalar içinde hesabınızı açın ve işletmenizi dijitale taşıyın.</p>
        </div>
        <form className="space-y-3" action={action}>
          <Input placeholder="Ad Soyad" name="full_name" required />
          <Input type="email" name="email" placeholder="E-posta" required />
          <Input type="password" name="password" placeholder="Şifre" required />
          {!state.ok ? <p className="text-sm text-rose-300">{state.message}</p> : null}
          <Button className="w-full" disabled={pending}>{pending ? "Kayıt oluşturuluyor..." : "Hesap Oluştur"}</Button>
        </form>
        <p className="text-sm">
          Zaten hesabın var mı? <Link className="font-medium text-violet-300 hover:text-violet-200" href="/giris">Giriş yap</Link>
        </p>
      </Card>
    </div>
  );
}
