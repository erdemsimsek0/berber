"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/(auth)/actions";

const initialState = { ok: true, message: "" } as { ok: boolean; message: string };

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-5 p-6 sm:p-7">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Giriş Yap</h1>
          <p className="text-sm">Panelinize erişin ve randevularınızı yönetin.</p>
        </div>
        <form className="space-y-3" action={action}>
          <Input type="email" name="email" placeholder="E-posta" required />
          <Input type="password" name="password" placeholder="Şifre" required />
          {!state.ok ? <p className="text-sm text-rose-300">{state.message}</p> : null}
          <Button className="w-full" disabled={pending}>{pending ? "Giriş yapılıyor..." : "Giriş"}</Button>
        </form>
        <p className="text-sm">
          Hesabın yok mu? <Link className="font-medium text-violet-300 hover:text-violet-200" href="/kayit">Kayıt ol</Link>
        </p>
      </Card>
    </div>
  );
}
