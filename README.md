# RandevuTR MVP

Türkiye'deki berber, kuaför, güzellik salonu ve nail studio işletmeleri için çok kiracılı randevu SaaS MVP.

## Teknolojiler

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui bileşen yaklaşımı (`components/ui`)
- Supabase (Postgres + Auth + Storage altyapısı)
- React Hook Form + Zod

## Özellik Kapsamı

- **Public sayfalar:** Ana sayfa, işletme listeleme, işletme detay, giriş/kayıt.
- **Randevu akışı:** Şube/hizmet/personel/tarih-saat/müşteri bilgisi adımları + başarı ekranı.
- **Müşteri paneli:** Randevularım (yaklaşan/geçmiş), profil, iptal ve yeniden planlama bağlantısı.
- **İşletme onboarding:** İşletme, şube, hizmet, personel, çalışma saatleri, tamamlandı.
- **İşletme paneli:** Dashboard, takvim, hizmet/personel CRUD modül ekranları, müşteri, yorum, kupon, rapor, ayar, abonelik.
- **Super admin:** İşletmeler, abonelikler, sistem genel bakış.
- **Veri modeli:** Çok kiracılı RLS, çift rezervasyon önleme, durum yönetimi, bloklu zamanlar, çalışma saatleri, tamamlanan randevu sonrası yorum kuralı.

## Kurulum

1. Paketleri yükleyin:
   ```bash
   npm install
   ```
2. `.env.local` oluşturun:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Supabase migration çalıştırın:
   ```bash
   supabase db reset
   ```
4. Geliştirme sunucusu:
   ```bash
   npm run dev
   ```

## Supabase Dosyaları

- Şema ve RLS migration: `supabase/migrations/20260324090000_init.sql`
- Demo seed: `supabase/seed/demo_seed.sql`

## Roller

- `customer`
- `business_owner`
- `business_staff`
- `super_admin`

## TODO (Bilinçli Olarak Sonraya Bırakılanlar)

- Auth sayfalarını Supabase Auth ile gerçek oturum akışına bağlamak.
- İşletme panelindeki CRUD ekranlarını tablo + form + pagination ile tam operasyonel hale getirmek.
- Takvim için sürükle-bırak arayüz ve gerçek zamanlı çakışma geri bildirimi eklemek.
- Ödeme entegrasyonunu (iyzico/PayTR vb.) canlı tahsilat akışıyla tamamlamak.
- Bildirimleri (SMS/e-posta/push) kuyruk tabanlı worker ile asenkron hale getirmek.

## Notlar

- Para birimi `TRY` baz alınmıştır.
- UI dili varsayılan Türkçe'dir.
- Supabase environment değişkenleri yoksa public sayfalarda demo veri fallback'i devreye girer.
