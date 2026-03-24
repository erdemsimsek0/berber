insert into public.users (id, role, full_name, phone)
values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'business_owner', 'Mehmet Demir', '05551112233'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'customer', 'Ayşe Yılmaz', '05553334455')
on conflict do nothing;

insert into public.businesses (id, owner_user_id, slug, name, description, city, district)
values
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ustura-lounge', 'Ustura Lounge', 'Kadıköy premium barber', 'İstanbul', 'Kadıköy')
on conflict do nothing;

insert into public.branches (id, business_id, name, address, phone)
values
('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'Kadıköy Şubesi', 'Caferağa Mah. Moda Cad.', '02165554433')
on conflict do nothing;

insert into public.services (id, business_id, branch_id, name, duration_min, price_try)
values
('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Saç Kesimi', 45, 450),
('22222222-2222-2222-2222-222222222223', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Sakal Tasarım', 30, 300)
on conflict do nothing;

insert into public.staff (id, business_id, branch_id, full_name, phone)
values
('33333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Emre Usta', '05559998877')
on conflict do nothing;

insert into public.staff_services (staff_id, service_id)
values
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222223')
on conflict do nothing;

insert into public.subscriptions (business_id, plan_code, status, started_at)
values ('10000000-0000-0000-0000-000000000001', 'pro', 'active', now())
on conflict do nothing;
