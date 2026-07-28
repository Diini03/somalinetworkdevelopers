# Somali Network Developers (SND)

> A working web index of Somali's software engineers, designers and data people — vetted, ranked, and reachable in a single click.

![SND preview](./docs/preview.png)

---

## About SND

**SND** is fully open source. The entire source code lives in this repository — anyone can download it, run it locally, fork it, and push improvements back via pull requests.

The aim is to build this as a **community project**:

- Connect Somali developers across Mogadishu, Hargeisa, Nairobi, Addis, and the diaspora.
- Share insights, experience, and opportunities.
- Give employers and collaborators a clean way to discover engineering talent from the Horn.

## Live app

- **Production**: https://somalinetworkdevelopers.lovable.app

## Tech stack!

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Lovable Cloud** for backend (database, auth, storage, edge functions) — powered by **Supabase** under the hood
- **AI ranking** (Google Gemini via Lovable AI Gateway) for candidate scoring

## Backend!

This project runs on **Lovable Cloud**, which is a managed Supabase instance. That means everything you'd expect from Supabase is available: Postgres, Row Level Security, Auth, Storage buckets, and Edge Functions — provisioned automatically.

You have two ways to run the backend for a fork:

1. **Fork on Lovable** — Cloud is provisioned for you and the `.env` values below are generated automatically. Nothing to configure.
2. **Bring your own Supabase project** — create a Supabase project, run the migrations in `supabase/migrations/`, and point the app at it via the env vars below.

### Environment variables

Create a `.env` at the repo root (Lovable Cloud writes these for you automatically):

```
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon/publishable key>"
VITE_SUPABASE_PROJECT_ID="<project-ref>"
```

Server-side secrets used by edge functions (set in the Supabase/Cloud dashboard, never in `.env`):

- `LOVABLE_API_KEY` — Lovable AI Gateway (for candidate scoring)
- `RESEND_API_KEY` — Resend (for contact emails)
- `SUPABASE_SERVICE_ROLE_KEY` — auto-provisioned; used by admin-only functions

### Database tables!

Applied via migrations in `supabase/migrations/`:

| Table                 | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `candidates`          | Public developer profiles (admin write, public read RPC)  |
| `profiles`            | Per-user profile row, auto-created via trigger on sign-up |
| `user_roles`          | Role assignments — `admin` or `user` (see below)          |
| `contact_submissions` | Log of contact-form messages sent to candidates           |

Storage buckets: `candidate-photos` (public), `candidate-cvs` (private, signed URLs).

Edge functions live in `supabase/functions/`: `calculate-candidate-score`, `batch-score-candidates`, `send-candidate-contact-email`, `get-cv-signed-url`.

## Role-based admin access

Admin permission is enforced server-side via the `user_roles` table and a `has_role(user_id, role)` security-definer function. RLS policies on `candidates`, storage buckets, and edge functions all check `has_role(auth.uid(), 'admin')` — the client cannot self-promote.

There is **no shared demo password**. To get admin access on your own instance:

1. Sign up through the normal auth flow (or create a user in the Supabase dashboard).
2. Grant yourself the admin role by inserting into `user_roles`:

   ```sql
   insert into public.user_roles (user_id, role)
   values ('<your-auth-user-id>', 'admin');
   ```

3. Sign in and visit `/admin/login` — you'll be routed to the admin console.

If you're just exploring the UI without touching the database, browse the public site — every non-admin route (`/`, `/talent`, `/talent/:id`, `/compare`) works fully without an account.

## Run locally

Requires Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install
npm install

# 3. Add .env (see Environment variables above)

# 4. Start dev server
npm run dev
```

The app runs at `http://localhost:8080`.

To run the backend against a self-hosted Supabase project instead of Lovable Cloud, install the [Supabase CLI](https://supabase.com/docs/guides/cli), then:

```sh
supabase link --project-ref <your-ref>
supabase db push          # applies supabase/migrations/
supabase functions deploy # deploys edge functions
```

## Project structure

```
src/
  pages/           # Landing, Talent console, Profile, Compare, Admin
  components/      # UI, console, layout, candidate components
  integrations/    # Auto-generated backend client
supabase/
  functions/       # Edge functions (AI scoring, CV signed URLs, email)
  migrations/      # Database schema history
docs/              # Screenshots and assets used by the README
```

## Contributing

1. **Fork** this repository on GitHub.
2. Create a branch: `git checkout -b feat/your-idea`.
3. Commit your changes with a clear message.
4. Push and open a **Pull Request** describing what you changed and why.

You can also contribute without cloning — open the project in [Lovable](https://lovable.dev) and edit visually. Changes sync back to GitHub automatically.

Ideas that are always appreciated:

- New candidate profiles (real Somali developers who want to be listed).
- UI/UX polish and accessibility fixes.
- Documentation and translations (Somali, Arabic, English).
- New features: shortlists, messaging, employer accounts, events board.

## Issues & discussions

Found a bug or have an idea? Open a GitHub Issue. For bigger conversations (roadmap, community, design direction), start a Discussion.

## License

Open source. Free to use, learn from, and build on.
