import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function Done() {
  return <Card className="mx-auto max-w-lg space-y-3 text-center"><h1 className="text-2xl font-semibold">Kurulum Tamamlandı</h1><p>Panel hazır.</p><Button asChild><Link href="/isletme/panel">Panele Git</Link></Button></Card>;
}
