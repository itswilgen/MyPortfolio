begin;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title varchar(160) not null check (char_length(trim(title)) between 2 and 160),
  issuer varchar(160) not null check (char_length(trim(issuer)) between 2 and 160),
  category varchar(80) not null check (char_length(trim(category)) between 2 and 80),
  description text check (description is null or char_length(description) <= 1200),
  issue_date date not null,
  expiration_date date,
  does_not_expire boolean not null default true,
  credential_id varchar(200),
  verification_url text check (verification_url is null or verification_url ~ '^https://'),
  skills text[] not null default '{}',
  image_url text check (image_url is null or image_url ~ '^https://'),
  image_path text,
  pdf_url text check (pdf_url is null or pdf_url ~ '^https://'),
  pdf_path text,
  image_alt varchar(300),
  allow_download boolean not null default false,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certificate_expiration_valid check (
    expiration_date is null or expiration_date >= issue_date
  ),
  constraint certificate_expiration_mode_valid check (
    not does_not_expire or expiration_date is null
  ),
  constraint certificate_media_required check (
    image_path is not null or image_url is not null or pdf_path is not null or pdf_url is not null
  ),
  constraint certificate_image_alt_required check (
    (image_path is null and image_url is null) or nullif(trim(image_alt), '') is not null
  ),
  constraint certificate_download_requires_pdf check (
    not allow_download or pdf_path is not null or pdf_url is not null
  )
);

create index if not exists certificates_public_order_idx
  on public.certificates (is_published, is_featured desc, display_order, issue_date desc);
create index if not exists certificates_category_idx on public.certificates (category);
create index if not exists certificates_updated_at_idx on public.certificates (updated_at desc);

create or replace function public.set_certificate_slug()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  base_slug text;
  candidate text;
  suffix integer := 2;
begin
  if nullif(trim(new.slug), '') is not null then
    return new;
  end if;

  base_slug := trim(both '-' from regexp_replace(lower(new.title), '[^a-z0-9]+', '-', 'g'));
  base_slug := left(coalesce(nullif(base_slug, ''), 'certificate'), 100);
  candidate := base_slug;

  while exists (select 1 from public.certificates where slug = candidate) loop
    candidate := left(base_slug, 94) || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists certificates_set_slug on public.certificates;
create trigger certificates_set_slug
before insert on public.certificates
for each row execute function public.set_certificate_slug();

drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at
before update on public.certificates
for each row execute function public.set_updated_at();

alter table public.certificates enable row level security;

create policy "Published certificates are public"
on public.certificates for select to anon, authenticated
using (is_published or public.is_portfolio_admin());

create policy "Admins manage certificates"
on public.certificates for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

grant select on public.certificates to anon, authenticated;
grant insert, update, delete on public.certificates to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'certificate-files',
  'certificate-files',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins manage certificate files"
on storage.objects for all to authenticated
using (bucket_id = 'certificate-files' and public.is_portfolio_admin())
with check (bucket_id = 'certificate-files' and public.is_portfolio_admin());

create policy "Published certificate files are readable"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'certificate-files'
  and exists (
    select 1
    from public.certificates certificate
    where certificate.is_published
      and (
        certificate.image_path = name
        or (
          certificate.pdf_path = name
          and (
            certificate.allow_download
            or (certificate.image_path is null and certificate.image_url is null)
          )
        )
      )
  )
);

create or replace function public.reorder_certificates(ordered_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_portfolio_admin() then
    raise exception 'Not authorized';
  end if;

  if coalesce(array_length(ordered_ids, 1), 0) <> (
    select count(*) from public.certificates where id = any(ordered_ids)
  ) then
    raise exception 'Certificate ordering contains an unknown or duplicate ID';
  end if;

  update public.certificates certificate
  set display_order = ordering.position - 1
  from unnest(ordered_ids) with ordinality as ordering(id, position)
  where certificate.id = ordering.id;
end;
$$;

revoke all on function public.reorder_certificates(uuid[]) from public;
grant execute on function public.reorder_certificates(uuid[]) to authenticated;

commit;
