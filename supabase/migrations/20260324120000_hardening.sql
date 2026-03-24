-- Production hardening: tenant integrity, indexes, updated_at, and safer public booking policies.

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at columns
alter table public.users add column if not exists updated_at timestamptz not null default now();
alter table public.businesses add column if not exists updated_at timestamptz not null default now();
alter table public.branches add column if not exists updated_at timestamptz not null default now();
alter table public.staff add column if not exists updated_at timestamptz not null default now();
alter table public.services add column if not exists updated_at timestamptz not null default now();
alter table public.working_hours add column if not exists updated_at timestamptz not null default now();
alter table public.blocked_times add column if not exists updated_at timestamptz not null default now();
alter table public.customers add column if not exists updated_at timestamptz not null default now();
alter table public.appointments add column if not exists updated_at timestamptz not null default now();
alter table public.payments add column if not exists updated_at timestamptz not null default now();
alter table public.reviews add column if not exists updated_at timestamptz not null default now();
alter table public.coupons add column if not exists updated_at timestamptz not null default now();
alter table public.notifications add column if not exists updated_at timestamptz not null default now();
alter table public.subscriptions add column if not exists updated_at timestamptz not null default now();

-- Add update triggers
drop trigger if exists trg_users_updated_at on public.users;
drop trigger if exists trg_businesses_updated_at on public.businesses;
drop trigger if exists trg_branches_updated_at on public.branches;
drop trigger if exists trg_staff_updated_at on public.staff;
drop trigger if exists trg_services_updated_at on public.services;
drop trigger if exists trg_working_hours_updated_at on public.working_hours;
drop trigger if exists trg_blocked_times_updated_at on public.blocked_times;
drop trigger if exists trg_customers_updated_at on public.customers;
drop trigger if exists trg_appointments_updated_at on public.appointments;
drop trigger if exists trg_payments_updated_at on public.payments;
drop trigger if exists trg_reviews_updated_at on public.reviews;
drop trigger if exists trg_coupons_updated_at on public.coupons;
drop trigger if exists trg_notifications_updated_at on public.notifications;
drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;

create trigger trg_users_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger trg_businesses_updated_at before update on public.businesses for each row execute function public.set_updated_at();
create trigger trg_branches_updated_at before update on public.branches for each row execute function public.set_updated_at();
create trigger trg_staff_updated_at before update on public.staff for each row execute function public.set_updated_at();
create trigger trg_services_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger trg_working_hours_updated_at before update on public.working_hours for each row execute function public.set_updated_at();
create trigger trg_blocked_times_updated_at before update on public.blocked_times for each row execute function public.set_updated_at();
create trigger trg_customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger trg_appointments_updated_at before update on public.appointments for each row execute function public.set_updated_at();
create trigger trg_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger trg_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger trg_coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at();
create trigger trg_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();

-- Tenant integrity unique keys for composite FKs
alter table public.branches add constraint branches_id_business_unique unique (id, business_id);
alter table public.staff add constraint staff_id_business_unique unique (id, business_id);
alter table public.services add constraint services_id_business_unique unique (id, business_id);
alter table public.customers add constraint customers_id_business_unique unique (id, business_id);
alter table public.appointments add constraint appointments_id_business_unique unique (id, business_id);

-- Composite foreign keys to enforce same-business relations
alter table public.staff
  add constraint staff_branch_same_business_fk
  foreign key (branch_id, business_id) references public.branches (id, business_id)
  on delete set null;

alter table public.services
  add constraint services_branch_same_business_fk
  foreign key (branch_id, business_id) references public.branches (id, business_id)
  on delete set null;

alter table public.working_hours
  add constraint working_hours_branch_same_business_fk
  foreign key (branch_id, business_id) references public.branches (id, business_id)
  on delete cascade;

alter table public.working_hours
  add constraint working_hours_staff_same_business_fk
  foreign key (staff_id, business_id) references public.staff (id, business_id)
  on delete cascade;

alter table public.blocked_times
  add constraint blocked_times_branch_same_business_fk
  foreign key (branch_id, business_id) references public.branches (id, business_id)
  on delete cascade;

alter table public.blocked_times
  add constraint blocked_times_staff_same_business_fk
  foreign key (staff_id, business_id) references public.staff (id, business_id)
  on delete cascade;

alter table public.appointments
  add constraint appointments_branch_same_business_fk
  foreign key (branch_id, business_id) references public.branches (id, business_id)
  on delete cascade;

alter table public.appointments
  add constraint appointments_service_same_business_fk
  foreign key (service_id, business_id) references public.services (id, business_id);

alter table public.appointments
  add constraint appointments_customer_same_business_fk
  foreign key (customer_id, business_id) references public.customers (id, business_id);

alter table public.appointments
  add constraint appointments_staff_same_business_fk
  foreign key (staff_id, business_id) references public.staff (id, business_id);

alter table public.payments
  add constraint payments_appointment_same_business_fk
  foreign key (appointment_id, business_id) references public.appointments (id, business_id)
  on delete cascade;

alter table public.reviews
  add constraint reviews_appointment_same_business_fk
  foreign key (appointment_id, business_id) references public.appointments (id, business_id)
  on delete cascade;

alter table public.reviews
  add constraint reviews_customer_same_business_fk
  foreign key (customer_id, business_id) references public.customers (id, business_id)
  on delete cascade;

-- Business rules
alter table public.subscriptions
  add constraint subscriptions_date_range_chk check (ended_at is null or ended_at > started_at);

alter table public.coupons
  add constraint coupons_discount_value_chk check (
    (discount_type = 'percent' and discount_value > 0 and discount_value <= 100)
    or
    (discount_type = 'fixed' and discount_value > 0)
  );

-- Availability and appointment query indexes
create index if not exists appointments_business_start_idx on public.appointments (business_id, start_at desc);
create index if not exists appointments_branch_start_idx on public.appointments (branch_id, start_at);
create index if not exists appointments_staff_start_idx on public.appointments (staff_id, start_at)
  where status in ('pending', 'confirmed', 'completed');
create index if not exists appointments_customer_start_idx on public.appointments (customer_id, start_at desc);
create index if not exists appointments_status_start_idx on public.appointments (status, start_at);

create index if not exists services_business_branch_active_idx on public.services (business_id, branch_id, is_active);
create index if not exists staff_business_branch_active_idx on public.staff (business_id, branch_id, is_active);
create index if not exists working_hours_lookup_idx on public.working_hours (business_id, branch_id, staff_id, day_of_week, start_time);

create index if not exists blocked_times_business_start_idx on public.blocked_times (business_id, start_at, end_at);
create index if not exists blocked_times_staff_range_gist on public.blocked_times using gist (
  staff_id,
  tstzrange(start_at, end_at, '[)')
);

create unique index if not exists customers_business_phone_uniq on public.customers (business_id, phone);
create unique index if not exists customers_business_email_uniq on public.customers (business_id, email)
  where email is not null;

create unique index if not exists subscriptions_one_active_plan_uniq on public.subscriptions (business_id)
  where status in ('trialing', 'active');

-- Tighten public booking policies
drop policy if exists "public can create customers" on public.customers;
drop policy if exists "public can create appointments" on public.appointments;

create policy "public can create customers" on public.customers
for insert
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = customers.business_id
      and b.is_active = true
  )
);

create policy "public can create appointments" on public.appointments
for insert
with check (
  exists (
    select 1 from public.businesses b
    where b.id = appointments.business_id
      and b.is_active = true
  )
  and exists (
    select 1 from public.branches br
    where br.id = appointments.branch_id
      and br.business_id = appointments.business_id
  )
  and exists (
    select 1 from public.services sv
    where sv.id = appointments.service_id
      and sv.business_id = appointments.business_id
      and sv.is_active = true
  )
  and exists (
    select 1 from public.customers c
    where c.id = appointments.customer_id
      and c.business_id = appointments.business_id
  )
  and (
    appointments.staff_id is null
    or exists (
      select 1 from public.staff st
      where st.id = appointments.staff_id
        and st.business_id = appointments.business_id
        and st.is_active = true
    )
  )
);
