
# WG.DEV Portfolio

Wilgen Rivas’ React 18 + Vite portfolio and private Supabase-backed content manager. The public site remains usable without Supabase by reading the preserved local profile and AquaFill, Petron Inventory, and Whisper records. Admin features require Supabase.

## Local development

Requirements: Node.js 18+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Available checks:

```bash
npm run lint
npm run build
npm run preview
```

## Supabase setup

1. Create a Supabase project.
2. Open the SQL Editor and run the migrations in order:
   - [`supabase/migrations/202609030001_portfolio_cms.sql`](supabase/migrations/202609030001_portfolio_cms.sql)
   - [`supabase/migrations/202609040001_certificates.sql`](supabase/migrations/202609040001_certificates.sql)

   These create the content tables, private media buckets, seed profile/projects, update triggers, grants, and Row Level Security policies. No certificates or payment proofs are seeded.
3. In Authentication settings, disable public sign-ups. Keep email/password authentication enabled for the administrator.
4. Create the first administrator from **Authentication → Users → Add user**. Use the real admin email and a strong password; mark the email confirmed.
5. Copy that user’s UUID and run the following in the SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('PASTE_AUTH_USER_UUID_HERE');
```

6. Add the project URL and anon key to `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Only the publishable key (or legacy anon key) belongs in the frontend. Never add a secret or service-role key to a Vite environment variable or commit it.

The migration creates private `profile-images`, `project-images`, `payment-proof-images`, and `resume-files` buckets. Public visitors receive short-lived signed URLs only for media referenced by published rows. Admin uploads are limited by MIME type and bucket size limits; the UI also validates image type, file size, safe generated names, and required alternative text.

The certificates migration creates the private `certificate-files` bucket. Certificate images use `certificates/images/` paths and PDF documents use `certificates/documents/` paths. Public access is limited to files referenced by published certificate records.

The three existing project images stay bundled as reliable fallbacks. After Supabase is configured, an administrator can upload replacements from each project edit screen. No payment-proof records are seeded.

## Admin routes

- `/admin/login`
- `/admin`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/:id/edit`
- `/admin/projects/:id/preview`
- `/admin/certificates`
- `/admin/certificates/new`
- `/admin/certificates/:id/edit`
- `/admin/profile`
- `/admin/payment-proofs`
- `/admin/settings`

Authentication alone is not enough: protected pages verify membership in `admin_users`, and database/storage writes are independently enforced by RLS.

## Vercel deployment

1. Import the repository into Vercel.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development as appropriate. The legacy `VITE_SUPABASE_ANON_KEY` name remains supported.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy. The existing `vercel.json` rewrite keeps React Router deep links working.

Before production, set the Supabase Site URL to the deployed domain and add local/preview domains to Authentication redirect URLs. Review every payment-proof image for private information before publishing it.

## Data and security notes

- Public queries return only published projects, profile content, and payment proofs.
- Draft media remains in private buckets and cannot be signed by anonymous visitors.
- Admin registration is intentionally absent.
- Deletes remove database records but retain uploaded files for manual recovery/cleanup.
- Certificate replacement and deletion attempt to clean up superseded files through the authenticated Storage API. Any cleanup failure is reported to the administrator for manual follow-up.
- The direct email contact flow avoids exposing third-party form secrets or reporting false success.
- Admin-entered content is rendered as plain React text; the app does not use `dangerouslySetInnerHTML`.
