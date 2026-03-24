-- RLS hardening for multi-tenant security model.

-- ----------
-- Helper functions
-- ----------
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select coalesce((select u.role from public.users u where u.id = auth.uid()), 'customer'::public.app_role);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'super_admin'::public.app_role;
$$;

create or replace function public.is_business_owner(p_business_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.businesses b
    where b.id = p_business_id
      and b.owner_user_id = auth.uid()
  );
$$;

create or replace function public.is_business_staff(p_business_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.staff s
    where s.business_id = p_business_id
      and s.user_id = auth.uid()
      and s.is_active = true
  );
$$;

create or replace function public.can_access_business(p_business_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_super_admin()
    or public.is_business_owner(p_business_id)
    or public.is_business_staff(p_business_id);
$$;

create or replace function public.can_manage_business(p_business_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_super_admin()
    or public.is_business_owner(p_business_id);
$$;

create or replace function public.can_access_branch(p_business_id uuid, p_branch_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.is_super_admin()
    or public.is_business_owner(p_business_id)
    or exists (
      select 1
      from public.staff s
      where s.business_id = p_business_id
        and s.user_id = auth.uid()
        and s.is_active = true
        and (s.branch_id is null or s.branch_id = p_branch_id)
    );
$$;

create or replace function public.customer_id_for_auth_user(p_business_id uuid)
returns uuid
language sql
stable
as $$
  select c.id
  from public.customers c
  where c.business_id = p_business_id
    and c.user_id = auth.uid()
  limit 1;
$$;

-- ----------
-- Drop existing policies to avoid permissive overlap
-- ----------
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'users','businesses','branches','staff','services','staff_services','working_hours','blocked_times',
        'customers','appointments','payments','reviews','coupons','notifications','subscriptions'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end;
$$;

-- ----------
-- Users
-- ----------
create policy users_select_self_or_superadmin on public.users
for select
using (id = auth.uid() or public.is_super_admin());

create policy users_update_self_or_superadmin on public.users
for update
using (id = auth.uid() or public.is_super_admin())
with check (id = auth.uid() or public.is_super_admin());

create policy users_insert_self_or_superadmin on public.users
for insert
with check (id = auth.uid() or public.is_super_admin());

-- ----------
-- Businesses
-- ----------
create policy businesses_select_scoped on public.businesses
for select
using (public.can_access_business(id));

create policy businesses_insert_owner_or_superadmin on public.businesses
for insert
with check (owner_user_id = auth.uid() or public.is_super_admin());

create policy businesses_update_owner_or_superadmin on public.businesses
for update
using (public.can_manage_business(id))
with check (public.can_manage_business(id));

create policy businesses_delete_owner_or_superadmin on public.businesses
for delete
using (public.can_manage_business(id));

-- ----------
-- Branches
-- ----------
create policy branches_select_scoped on public.branches
for select
using (public.can_access_branch(business_id, id));

create policy branches_mutate_owner_or_superadmin on public.branches
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

-- ----------
-- Staff
-- ----------
create policy staff_select_scoped on public.staff
for select
using (
  case
    when branch_id is null then public.can_access_business(business_id)
    else public.can_access_branch(business_id, branch_id)
  end
);

create policy staff_mutate_owner_or_superadmin on public.staff
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

-- ----------
-- Services
-- ----------
create policy services_select_scoped on public.services
for select
using (
  case
    when branch_id is null then public.can_access_business(business_id)
    else public.can_access_branch(business_id, branch_id)
  end
);

create policy services_mutate_owner_or_superadmin on public.services
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

-- ----------
-- Staff services
-- ----------
create policy staff_services_select_scoped on public.staff_services
for select
using (
  exists (
    select 1
    from public.staff s
    where s.id = staff_services.staff_id
      and public.can_access_business(s.business_id)
  )
);

create policy staff_services_mutate_owner_or_superadmin on public.staff_services
for all
using (
  exists (
    select 1
    from public.staff s
    where s.id = staff_services.staff_id
      and public.can_manage_business(s.business_id)
  )
)
with check (
  exists (
    select 1
    from public.staff s
    where s.id = staff_services.staff_id
      and public.can_manage_business(s.business_id)
  )
);

-- ----------
-- Working hours / blocked times
-- ----------
create policy working_hours_select_scoped on public.working_hours
for select
using (
  case
    when branch_id is null then public.can_access_business(business_id)
    else public.can_access_branch(business_id, branch_id)
  end
);

create policy working_hours_mutate_owner_or_superadmin on public.working_hours
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

create policy blocked_times_select_scoped on public.blocked_times
for select
using (
  case
    when branch_id is null then public.can_access_business(business_id)
    else public.can_access_branch(business_id, branch_id)
  end
);

create policy blocked_times_mutate_owner_or_superadmin on public.blocked_times
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

-- ----------
-- Customers
-- ----------
create policy customers_select_scoped on public.customers
for select
using (
  public.can_access_business(business_id)
  or user_id = auth.uid()
);

create policy customers_insert_scoped on public.customers
for insert
with check (
  public.can_access_business(business_id)
  or (
    auth.uid() is not null
    and user_id = auth.uid()
    and exists (
      select 1
      from public.businesses b
      where b.id = customers.business_id
        and b.is_active = true
    )
  )
  or (
    auth.role() = 'anon'
    and user_id is null
    and exists (
      select 1
      from public.businesses b
      where b.id = customers.business_id
        and b.is_active = true
    )
  )
);

create policy customers_update_scoped on public.customers
for update
using (
  public.can_access_business(business_id)
  or user_id = auth.uid()
)
with check (
  public.can_access_business(business_id)
  or user_id = auth.uid()
);

-- ----------
-- Appointments
-- ----------
create policy appointments_select_scoped on public.appointments
for select
using (
  public.can_access_branch(business_id, branch_id)
  or customer_id = public.customer_id_for_auth_user(business_id)
);

create policy appointments_insert_scoped on public.appointments
for insert
with check (
  -- owner / super admin / scoped staff
  public.can_access_branch(business_id, branch_id)
  -- authenticated customer for own profile
  or (
    auth.uid() is not null
    and customer_id = public.customer_id_for_auth_user(business_id)
    and exists (
      select 1 from public.businesses b where b.id = appointments.business_id and b.is_active = true
    )
  )
  -- anonymous public booking
  or (
    auth.role() = 'anon'
    and exists (
      select 1 from public.businesses b where b.id = appointments.business_id and b.is_active = true
    )
  )
);

create policy appointments_update_scoped on public.appointments
for update
using (
  public.can_access_branch(business_id, branch_id)
  or customer_id = public.customer_id_for_auth_user(business_id)
)
with check (
  public.can_access_branch(business_id, branch_id)
  or customer_id = public.customer_id_for_auth_user(business_id)
);

-- ----------
-- Payments / reviews / coupons / subscriptions / notifications
-- ----------
create policy payments_select_scoped on public.payments
for select
using (public.can_access_business(business_id));

create policy payments_mutate_owner_or_superadmin on public.payments
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

create policy reviews_select_scoped on public.reviews
for select
using (
  public.can_access_business(business_id)
  or customer_id = public.customer_id_for_auth_user(business_id)
);

create policy reviews_insert_customer_or_business on public.reviews
for insert
with check (
  public.can_access_business(business_id)
  or customer_id = public.customer_id_for_auth_user(business_id)
);

create policy reviews_update_owner_or_superadmin on public.reviews
for update
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

create policy coupons_select_scoped on public.coupons
for select
using (public.can_access_business(business_id));

create policy coupons_mutate_owner_or_superadmin on public.coupons
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

create policy subscriptions_select_scoped on public.subscriptions
for select
using (public.can_access_business(business_id));

create policy subscriptions_mutate_owner_or_superadmin on public.subscriptions
for all
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

create policy notifications_select_scoped on public.notifications
for select
using (
  public.is_super_admin()
  or (business_id is not null and public.can_access_business(business_id))
  or user_id = auth.uid()
);

create policy notifications_insert_scoped on public.notifications
for insert
with check (
  public.is_super_admin()
  or (business_id is not null and public.can_manage_business(business_id))
  or user_id = auth.uid()
);

create policy notifications_update_scoped on public.notifications
for update
using (
  public.is_super_admin()
  or (business_id is not null and public.can_manage_business(business_id))
  or user_id = auth.uid()
)
with check (
  public.is_super_admin()
  or (business_id is not null and public.can_manage_business(business_id))
  or user_id = auth.uid()
);
