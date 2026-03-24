import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Kayıt Ol</h1>
        <form className="space-y-3">
          <Input placeholder="Ad Soyad" required />
          <Input type="email" placeholder="E-posta" required />
          <Input type="password" placeholder="Şifre" required />
          <Button className="w-full">Hesap Oluştur</Button>
        </form>
        <p className="text-sm text-slate-600">
          Zaten hesabın var mı? <Link className="text-blue-600" href="/giris">Giriş yap</Link>
        </p>
      </Card>
    </div>
  );
}
