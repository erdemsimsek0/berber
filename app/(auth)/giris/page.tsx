import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Giriş Yap</h1>
        <form className="space-y-3">
          <Input type="email" placeholder="E-posta" />
          <Input type="password" placeholder="Şifre" />
          <Button className="w-full">Giriş</Button>
        </form>
      </Card>
    </div>
  );
}
