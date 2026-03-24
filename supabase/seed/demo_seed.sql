-- Demo seed for multi-tenant appointment platform.
-- Creates auth users, profile users, businesses, branches, staff, services, availability, and appointments.

-- 1) Auth users (required by public.users FK -> auth.users)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'authenticated', 'authenticated', 'owner1@randevutr.demo', '$2a$10$demo', now(), '{"provider":"email"}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'authenticated', 'authenticated', 'owner2@randevutr.demo', '$2a$10$demo', now(), '{"provider":"email"}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'authenticated', 'authenticated', 'customer1@randevutr.demo', '$2a$10$demo', now(), '{"provider":"email"}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'authenticated', 'authenticated', 'staff1@randevutr.demo', '$2a$10$demo', now(), '{"provider":"email"}', '{}', now(), now())
on conflict (id) do nothing;

-- 2) App users
insert into public.users (id, role, full_name, phone)
values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'business_owner', 'Mehmet Demir', '05551112233'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'business_owner', 'Elif Kaya', '05554443322'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'customer', 'Ayşe Yılmaz', '05553334455'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'business_staff', 'Emre Usta', '05559998877')
on conflict (id) do nothing;

-- 3) Businesses
insert into public.businesses (id, owner_user_id, slug, name, description, city, district)
values
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ustura-lounge', 'Ustura Lounge', 'Kadıköy premium barber', 'İstanbul', 'Kadıköy'),
('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'nail-lab-ankara', 'Nail Lab Ankara', 'Merkezi konumda nail studio', 'Ankara', 'Çankaya')
on conflict (id) do nothing;

-- 4) Branches
insert into public.branches (id, business_id, name, address, phone)
values
('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'Kadıköy Şubesi', 'Caferağa Mah. Moda Cad.', '02165554433'),
('11111111-1111-1111-1111-111111111112', '10000000-0000-0000-0000-000000000001', 'Ataşehir Şubesi', 'Ataşehir Atatürk Mah.', '02165554434'),
('11111111-1111-1111-1111-111111111113', '10000000-0000-0000-0000-000000000002', 'Çankaya Şubesi', 'Kızılay Mah. İzmir Cad.', '03123332211')
on conflict (id) do nothing;

-- 5) Staff
insert into public.staff (id, business_id, branch_id, user_id, full_name, phone)
values
('33333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'Emre Usta', '05559998877'),
('33333333-3333-3333-3333-333333333334', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111112', null, 'Baran Usta', '05558887766'),
('33333333-3333-3333-3333-333333333335', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', null, 'Derya Nail Artist', '05557776655')
on conflict (id) do nothing;

-- 6) Services
insert into public.services (id, business_id, branch_id, name, duration_min, price_try)
values
('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Saç Kesimi', 45, 450),
('22222222-2222-2222-2222-222222222223', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Sakal Tasarım', 30, 300),
('22222222-2222-2222-2222-222222222224', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111112', 'Cilt Bakımı', 60, 700),
('22222222-2222-2222-2222-222222222225', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', 'Manikür', 50, 500),
('22222222-2222-2222-2222-222222222226', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', 'Kalıcı Oje', 60, 650)
on conflict (id) do nothing;

-- 7) Staff-service mapping
insert into public.staff_services (staff_id, service_id)
values
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222223'),
('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222224'),
('33333333-3333-3333-3333-333333333335', '22222222-2222-2222-2222-222222222225'),
('33333333-3333-3333-3333-333333333335', '22222222-2222-2222-2222-222222222226')
on conflict do nothing;

-- 8) Working hours (Mon-Sat)
insert into public.working_hours (id, business_id, branch_id, staff_id, day_of_week, start_time, end_time)
values
('44444444-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 1, '09:00', '19:00'),
('44444444-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111112', '33333333-3333-3333-3333-333333333334', 1, '10:00', '20:00'),
('44444444-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', '33333333-3333-3333-3333-333333333335', 1, '10:00', '19:00')
on conflict (id) do nothing;

-- 9) Blocked times
insert into public.blocked_times (id, business_id, branch_id, staff_id, start_at, end_at, reason)
values
('55555555-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', now() + interval '2 day 12 hours', now() + interval '2 day 13 hours', 'Ekip toplantısı')
on conflict (id) do nothing;

-- 10) Customers
insert into public.customers (id, business_id, user_id, full_name, phone, email)
values
('66666666-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ayşe Yılmaz', '05553334455', 'customer1@randevutr.demo'),
('66666666-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', null, 'Can Koç', '05551239876', 'can.koc@example.com'),
('66666666-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', null, 'Selin Aras', '05550001122', 'selin.aras@example.com')
on conflict (id) do nothing;

-- 11) Appointments (past/upcoming, multiple statuses)
insert into public.appointments (id, business_id, branch_id, service_id, staff_id, customer_id, start_at, end_at, status, notes)
values
('77777777-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000001', now() - interval '8 day', now() - interval '8 day' + interval '45 minute', 'completed', 'Düzenli müşteri'),
('77777777-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000002', now() + interval '1 day', now() + interval '1 day 30 minute', 'confirmed', null),
('77777777-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222225', '33333333-3333-3333-3333-333333333335', '66666666-0000-0000-0000-000000000003', now() + interval '2 day', now() + interval '2 day 50 minute', 'pending', null)
on conflict (id) do nothing;

-- 12) Payments
insert into public.payments (id, appointment_id, business_id, amount_try, status, provider, provider_ref)
values
('88888888-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 450, 'paid', 'cash', 'CASH-001')
on conflict (id) do nothing;

-- 13) Reviews (allowed only after completed appointment)
insert into public.reviews (id, business_id, appointment_id, customer_id, rating, comment)
values
('99999999-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', 5, 'Hızlı ve kaliteli hizmet')
on conflict (id) do nothing;

-- 14) Coupons
insert into public.coupons (id, business_id, code, discount_type, discount_value, expires_at, active)
values
('aaaaaaaa-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'HOSGELDIN10', 'percent', 10, now() + interval '30 day', true),
('aaaaaaaa-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'NAIL50', 'fixed', 50, now() + interval '15 day', true)
on conflict (id) do nothing;

-- 15) Subscriptions
insert into public.subscriptions (id, business_id, plan_code, status, started_at)
values
('bbbbbbbb-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'pro', 'active', now() - interval '45 day'),
('bbbbbbbb-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'starter', 'trialing', now() - interval '7 day')
on conflict (id) do nothing;
