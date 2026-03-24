-- Subscription model extension for SaaS billing
alter table public.subscriptions
  add column if not exists plan_type text,
  add column if not exists billing_interval text,
  add column if not exists active_until timestamptz,
  add column if not exists is_active boolean not null default false,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_price_id text;

update public.subscriptions
set
  plan_type = coalesce(plan_type, case when plan_code ilike '%pro%' then 'pro' else 'free' end),
  billing_interval = coalesce(billing_interval, 'monthly'),
  active_until = coalesce(active_until, ended_at, started_at + interval '30 day'),
  is_active = coalesce(is_active, status in ('active', 'trialing'));

alter table public.subscriptions
  alter column plan_type set default 'free';

create table if not exists public.billing_history (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  amount_try numeric(10,2) not null,
  currency text not null default 'TRY',
  status text not null,
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.billing_history enable row level security;

create policy billing_history_select_scoped on public.billing_history
for select using (public.can_access_business(business_id));

create policy billing_history_mutate_owner_or_superadmin on public.billing_history
for all using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

create index if not exists billing_history_business_created_idx
  on public.billing_history (business_id, created_at desc);
