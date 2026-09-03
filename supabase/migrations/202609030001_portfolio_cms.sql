begin;

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  professional_title text not null,
  hero_intro text not null,
  biography text not null,
  current_focus text,
  location text,
  education text,
  availability text,
  profile_image_path text,
  resume_path text,
  resume_url text,
  email text not null,
  social_links jsonb not null default '{}'::jsonb,
  hero_stats jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists one_public_profile on public.profiles ((published)) where published;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  subtitle text,
  short_description text not null,
  full_description text not null,
  problem text,
  purpose text,
  cover_image_path text,
  cover_image_alt text not null,
  technologies text[] not null default '{}',
  category text,
  status text not null default 'In Development',
  features text[] not null default '{}',
  frontend_stack text[] not null default '{}',
  backend_stack text[] not null default '{}',
  database_stack text[] not null default '{}',
  github_url text check (github_url is null or github_url ~ '^https://'),
  demo_url text check (demo_url is null or demo_url ~ '^https://'),
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  screenshots jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  project_or_service text not null,
  client_label text not null default 'Anonymous client',
  payment_platform text,
  payment_date date,
  amount numeric(12,2) check (amount is null or amount >= 0),
  currency varchar(3) not null default 'PHP',
  show_amount boolean not null default false,
  description text,
  image_path text not null,
  image_alt text not null,
  published boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.get_published_payment_proofs()
returns table (
  id uuid,
  project_or_service text,
  client_label text,
  payment_platform text,
  payment_date date,
  amount numeric,
  currency varchar,
  show_amount boolean,
  description text,
  image_path text,
  image_alt text,
  published boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.project_or_service, p.client_label, p.payment_platform,
    p.payment_date, case when p.show_amount then p.amount else null end,
    p.currency, p.show_amount, p.description, p.image_path, p.image_alt,
    p.published, p.display_order, p.created_at, p.updated_at
  from public.payment_proofs p
  where p.published
  order by p.display_order, p.created_at;
$$;

create or replace function public.is_published_payment_proof(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.payment_proofs where published and image_path = object_name);
$$;

revoke all on function public.get_published_payment_proofs() from public;
revoke all on function public.is_published_payment_proof(text) from public;
grant execute on function public.get_published_payment_proofs() to anon, authenticated;
grant execute on function public.is_published_payment_proof(text) to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists payment_proofs_set_updated_at on public.payment_proofs;
create trigger payment_proofs_set_updated_at before update on public.payment_proofs for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.payment_proofs enable row level security;
alter table public.site_settings enable row level security;

create policy "Admins can view their authorization" on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy "Published profile is public" on public.profiles for select to anon, authenticated using (published or public.is_portfolio_admin());
create policy "Admins manage profile" on public.profiles for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "Published projects are public" on public.projects for select to anon, authenticated using (published or public.is_portfolio_admin());
create policy "Admins manage projects" on public.projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "Admins manage proofs" on public.payment_proofs for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "Settings are public" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins manage settings" on public.site_settings for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('profile-images', 'profile-images', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('project-images', 'project-images', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('payment-proof-images', 'payment-proof-images', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('resume-files', 'resume-files', false, 10485760, array['application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins manage portfolio storage" on storage.objects for all to authenticated
using (bucket_id in ('profile-images','project-images','payment-proof-images','resume-files') and public.is_portfolio_admin())
with check (bucket_id in ('profile-images','project-images','payment-proof-images','resume-files') and public.is_portfolio_admin());

create policy "Published profile media is readable" on storage.objects for select to anon, authenticated using (
  (bucket_id = 'profile-images' and exists (select 1 from public.profiles where published and profile_image_path = name))
  or (bucket_id = 'resume-files' and exists (select 1 from public.profiles where published and resume_path = name))
);
create policy "Published project media is readable" on storage.objects for select to anon, authenticated using (
  bucket_id = 'project-images' and exists (
    select 1 from public.projects
    where published and (cover_image_path = name or screenshots @> jsonb_build_array(jsonb_build_object('path', name)))
  )
);
create policy "Published proof media is readable" on storage.objects for select to anon, authenticated using (
  bucket_id = 'payment-proof-images' and public.is_published_payment_proof(name)
);

grant select on public.profiles, public.projects, public.site_settings to anon, authenticated;
grant select on public.payment_proofs to authenticated;
grant insert, update, delete on public.profiles, public.projects, public.payment_proofs, public.site_settings to authenticated;
grant select on public.admin_users to authenticated;

insert into public.profiles (name, professional_title, hero_intro, biography, current_focus, location, education, availability, resume_url, email, social_links, hero_stats, published)
values (
  'Wilgen Rivas',
  'Full-Stack Developer, UI/UX Designer, and Web Engineer',
  'I design and build reliable web products with thoughtful interfaces, clear architecture, and practical business value.',
  E'I''m a self-driven full-stack developer based in Tanjay City, Philippines, focused on building modern, scalable, and user-centered web applications.\n\nI am pursuing a Bachelor of Science in Information Technology at Negros Oriental State University – Bais Campus, where I continue developing my skills in software engineering, database management, and product design.\n\nBeyond web development, I enjoy music and DJing. That sense of rhythm influences how I approach interface flow, visual hierarchy, and interactive experiences.',
  'Full-stack web development and UI/UX design',
  'Tanjay City, Philippines',
  'BS Information Technology, Negros Oriental State University – Bais Campus',
  'Open to freelance projects and collaborations',
  'https://drive.google.com/uc?export=download&id=1J9sEpN552eImALrfdc2SNC_AgU0je895',
  'wilgenrivas123@gmail.com',
  '{"github":"https://github.com/itswilgen","linkedin":"https://www.linkedin.com/in/rivas-wilgen-21677a393/","facebook":"https://web.facebook.com/wilgen.rivas.16"}'::jsonb,
  '[]'::jsonb,
  true
) on conflict do nothing;

insert into public.projects (slug, title, subtitle, short_description, full_description, cover_image_alt, technologies, category, status, features, frontend_stack, backend_stack, database_stack, github_url, demo_url, featured, published, display_order) values
('aquafill', 'AquaFill', 'Water Refilling Station System', 'Full-stack management system for water refilling businesses. Features a customer portal, billing management, order tracking, Firebase Google Auth, real-time dashboards with Recharts, and a responsive mobile layout.', 'AquaFill is a complete business management solution for water refilling stations. The system includes an admin dashboard for managing orders, tracking deliveries, generating bills, and viewing analytics. The customer portal allows users to place orders, view order history, track bills, and manage their profile. Authentication is handled via Firebase Google OAuth, with JWT tokens securing all API endpoints on the Node.js/Express backend.', 'AquaFill landing page preview', array['React','Vite','Node.js','Express','MariaDB','Firebase'], 'Business system', 'Completed', array['Customer portal with order tracking','Admin dashboard with analytics','Firebase Google OAuth','JWT-secured REST API','Billing and invoice generation','Responsive mobile layout'], array['React 18','Vite','React Router','Axios','Recharts','Firebase Auth'], array['Node.js','Express','OOP Architecture','JWT'], array['MariaDB','phpMyAdmin','XAMPP'], 'https://github.com/itswilgen/AquaFill', 'https://aqua-fill-zeta.vercel.app/', true, true, 0),
('petron-inventory', 'Petron Inventory', 'Gasoline Inventory & Sales System', 'A thesis-level web-based gasoline inventory and sales management system inspired by real Petron station operations, developed using PHP MVC, JavaScript, Tailwind CSS, and MySQL with POS, inventory, delivery, and reporting functionalities.', 'Petron Inventory is a web-based inventory and sales management system designed for gasoline stations, specifically inspired by real-world Petron operations in the Philippines. The system streamlines fuel inventory tracking, POS transactions, delivery monitoring, and sales reporting through a modern and efficient management platform. It includes real-time fuel stock tracking, automatic low stock detection, secure authentication and session handling, organized MVC project architecture, an optimized database structure for scalability, and printable reports with a receipt-ready workflow. This project demonstrates my skills in backend system development, database management, MVC architecture, business logic implementation, and modern frontend design. The system was developed as a thesis-level full-stack project focused on solving real operational challenges in fuel station management.', 'Petron Inventory dashboard preview', array['PHP','MySQL','Tailwind CSS','JavaScript'], 'Inventory system', 'Completed', array['Fuel inventory monitoring','POS transaction system','Fuel delivery management','Daily and monthly sales reports','Low stock warning alerts','Tank capacity validation','Role-based authentication','Dashboard analytics and KPI monitoring','Printable reports and receipt-ready workflow'], array['HTML','JavaScript','Tailwind CSS'], array['PHP','OOP','MVC Architecture','XAMPP'], array['MySQL'], 'https://github.com/itswilgen/petron-system', 'https://petron-inventory.free.nf/', true, true, 1),
('whisper', 'Whisper', 'Anonymous Confession Platform', 'Whisper is a modern anonymous confession platform developed using Laravel, JavaScript, and SQLite, featuring responsive UI/UX, secure backend architecture, and real-time community interaction.', 'Whisper is a modern anonymous confession platform built for the NORSU community, allowing users to freely share thoughts, experiences, and stories in a safe and engaging environment. The platform focuses on clean UI/UX design, smooth user interaction, anonymity, and responsive performance across devices. Whisper showcases my full-stack development skills using Laravel and JavaScript, including backend logic, database management, MVC architecture, and responsive frontend design. The project demonstrates my ability to create modern, scalable, and user-centered web applications.', 'Whisper confession wall preview', array['Laravel','JavaScript','SQLite'], 'Community platform', 'In Development', array['Anonymous posting system','Modern and responsive user interface','Community confession feed','Content moderation system','Secure backend authentication and handling','Lightweight SQLite database integration'], array['JavaScript','HTML','CSS'], array['Laravel Framework','MVC Architecture'], array['SQLite'], 'https://github.com/pinoywebs123/forum', 'https://norsuconfession.com/', true, true, 2)
on conflict (slug) do nothing;

insert into public.site_settings (id, settings) values ('default', '{"siteTitle":"WG.DEV"}'::jsonb) on conflict (id) do nothing;

commit;
