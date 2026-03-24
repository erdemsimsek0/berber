# RandevuTR MVP

Türkiye'deki berber, kuaför, güzellik salonu ve nail studio işletmeleri için çok kiracılı randevu SaaS MVP.

## Teknoloji Yığını

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Supabase (Postgres + Auth)

## Özellik Kapsamı

- **Public:** Ana sayfa, işletme listeleme/detay, randevu akışı.
- **Müşteri:** Profil ve randevu geçmişi.
- **İşletme:** Dashboard, hizmet/personel/müşteri/kupon/yorum/ayar ekranları.
- **Admin:** Sistem, işletmeler, abonelikler.
- **Veri modeli:** Çok kiracılı RLS, çakışma önleyen randevu kurgusu, bloklu zaman ve çalışma saatleri.

---

## Hızlı Başlangıç

### 1) Gereksinimler

- Node.js `>=20`
- npm `>=10`
- (Opsiyonel) Supabase CLI

### 2) Kurulum

```bash
npm install
```

### 3) Ortam değişkenleri

Proje kökünde `.env.local` oluşturun:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DEMO_MODE=true

# Stripe (abonelik için zorunlu)
STRIPE_SECRET_KEY=...
STRIPE_PRICE_PRO_MONTHLY=...
STRIPE_PRICE_PRO_YEARLY=...
DEMO_OWNER_EMAIL=demo@randevutr.com
```

> Bu değişkenler yoksa public sayfalarda demo veri fallback'i devreye girer.

### 4) Veritabanı (Supabase kullanıyorsanız)

```bash
supabase db reset
```

Bu komut migration + seed dosyalarını uygular.

### 5) Çalıştırma

```bash
npm run dev
```

Uygulama: `http://localhost:3000`

---

## Scriptler

```bash
npm run dev        # geliştirme
npm run build      # production build
npm run start      # production server
npm run lint       # Next lint
npm run typecheck  # TypeScript kontrolü
```

## Supabase Dosyaları

- Şema + RLS: `supabase/migrations/`
- Demo seed: `supabase/seed/demo_seed.sql`

## Roller

- `customer`
- `business_owner`
- `business_staff`
- `super_admin`

## Vercel Notu

`vercel.json` içinde Next.js framework ayarı mevcut. Vercel panelinde yanlışlıkla `Output Directory = public` verilmişse temizleyin veya `.next` kullanın.

## Üretim Öncesi Kontrol Önerisi

- `npm run typecheck`
- `npm run build`
- Supabase ortam değişkenlerini doğrulama
- RLS politikalarını staging veritabanında test etme
- Stripe checkout + webhook endpointlerini test etme (`/api/stripe/checkout`, `/api/stripe/webhook`)
