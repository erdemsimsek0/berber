-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists btree_gist;

-- Enum types
create type public.app_role as enum ('customer', 'business_owner', 'business_staff', 'super_admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'cancelled');
create type public.discount_type as enum ('percent', 'fixed');

-- Tables
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'customer',
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_user_id uuid not null references public.users(id),
  slug text not null unique,
  name text not null,
  description text,
  city text not null,
  district text not null,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  address text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table public.staff (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  user_id uuid references public.users(id),
  full_name text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  name text not null,
  duration_min int not null check (duration_min > 0),
  price_try numeric(12,2) not null check (price_try >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.staff_services (
  staff_id uuid not null references public.staff(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (staff_id, service_id)
);

create table public.working_hours (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table public.blocked_times (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid references public.users(id),
  full_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  service_id uuid not null references public.services(id),
  staff_id uuid references public.staff(id),
  customer_id uuid not null references public.customers(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status appointment_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  amount_try numeric(12,2) not null,
  status payment_status not null default 'pending',
  provider text,
  provider_ref text,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  appointment_id uuid not null unique references public.appointments(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null,
  discount_type discount_type not null,
  discount_value numeric(12,2) not null,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, code)
);

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  channel text not null default 'in_app',
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  plan_code text not null,
  status subscription_status not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

-- Prevent double booking on same staff timeslot except cancelled/no_show
create index appointments_staff_time_idx on public.appointments using gist (
  staff_id,
  tstzrange(start_at, end_at, '[)')
);

create unique index unique_staff_booking_active on public.appointments (
  staff_id,
  start_at,
  end_at
)
where staff_id is not null and status in ('pending', 'confirmed', 'completed');

-- Helper function to get active business IDs for current auth user
create or replace function public.current_user_business_ids()
returns setof uuid
language sql
stable
as $$
  select b.id
  from public.businesses b
  where b.owner_user_id = auth.uid()
  union
  select s.business_id
  from public.staff s
  where s.user_id = auth.uid();
$$;

-- Reviews only after completed appointment
create or replace function public.enforce_review_after_completion()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.appointments a
    where a.id = new.appointment_id
      and a.customer_id = new.customer_id
      and a.status = 'completed'
  ) then
    raise exception 'Review yalnızca tamamlanmış randevu sonrası oluşturulabilir';
  end if;
  return new;
end;
$$;

create trigger trg_reviews_completed_only
before insert on public.reviews
for each row execute function public.enforce_review_after_completion();

-- RLS
alter table public.users enable row level security;
alter table public.businesses enable row level security;
alter table public.branches enable row level security;
alter table public.staff enable row level security;
alter table public.services enable row level security;
alter table public.staff_services enable row level security;
alter table public.working_hours enable row level security;
alter table public.blocked_times enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;

-- Owner/staff can read own business data
create policy "business scoped read businesses" on public.businesses for select using (id in (select * from public.current_user_business_ids()) or owner_user_id = auth.uid());
create policy "business scoped mutate businesses" on public.businesses for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "business scoped branches" on public.branches for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped staff" on public.staff for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped services" on public.services for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped working_hours" on public.working_hours for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped blocked_times" on public.blocked_times for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped customers" on public.customers for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped appointments" on public.appointments for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped payments" on public.payments for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped reviews" on public.reviews for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped coupons" on public.coupons for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));
create policy "business scoped notifications" on public.notifications for all using (business_id in (select * from public.current_user_business_ids()) or user_id = auth.uid()) with check (business_id in (select * from public.current_user_business_ids()) or user_id = auth.uid());
create policy "business scoped subscriptions" on public.subscriptions for all using (business_id in (select * from public.current_user_business_ids())) with check (business_id in (select * from public.current_user_business_ids()));

-- Public listing and booking availability
create policy "public can list active businesses" on public.businesses for select using (is_active = true);
create policy "public can view active branches" on public.branches for select using (business_id in (select id from public.businesses where is_active = true));
create policy "public can view active services" on public.services for select using (is_active = true);
create policy "public can create customers" on public.customers for insert with check (true);
create policy "public can create appointments" on public.appointments for insert with check (true);
