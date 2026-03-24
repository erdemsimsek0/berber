import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CustomerProfilePage() {
  return (
    <div className="mx-auto max-w-xl">
      <Card className="space-y-3">
        <h1 className="text-2xl font-semibold">Profilim</h1>
        <Input defaultValue="Ayşe Yılmaz" />
        <Input defaultValue="05551234567" />
        <Input defaultValue="ayse@example.com" />
        <Button>Kaydet</Button>
      </Card>
    </div>
  );
}
