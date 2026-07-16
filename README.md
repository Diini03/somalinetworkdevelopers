# Somali Network Developers (SND)

> A working index of Somali software engineers, designers and data people — vetted, ranked, and reachable in a single click.

![SND preview](./docs/preview.png)

---

## About

**SND** is fully open source. The entire source code lives in this repository — anyone can download it, run it locally, fork it, and push improvements back via pull requests.

The aim is to build this as a **community project**:

- Connect Somali developers across Mogadishu, Hargeisa, Nairobi, Addis, and the diaspora.
- Share insights, experience, and opportunities.
- Give employers and collaborators a clean way to discover engineering talent from the Horn.

If you're a Somali developer (or someone who wants to help the community), you are welcome to contribute — code, design, content, or ideas.

## Live app

- **Production**: https://somalinetworkdevelopers.lovable.app

## Tech stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Lovable Cloud** for backend (database, auth, storage, edge functions) — powered by Supabase under the hood
- **AI ranking** (Google Gemini via Lovable AI Gateway) for candidate scoring

## Backend

This project runs on **Lovable Cloud**. Lovable Cloud is a managed backend that uses **Supabase** as its underlying engine — so everything you'd expect from Supabase is there: Postgres database, Row Level Security, Auth, Storage buckets, and Edge Functions.

Practically that means:

- If you fork and run this locally, the client is already wired to the Cloud backend via `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` (auto-generated).
- To run your own independent backend, create a new Supabase project (or enable Cloud on your own Lovable fork), then replace the two env vars and re-run the migrations in `supabase/migrations/`.

## Admin access (demo)

The live demo has a shared admin account so anyone exploring the project can see the full admin console:

- **URL**: `/admin/login`
- **Email**: `asad@gmail.com`
- **Password**: `111222`

> These credentials are for the public demo only. If you deploy your own instance, create a fresh admin user and remove this account.

## Run locally

Requires Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install
npm install

# 3. Start dev server
npm run dev
```

The app runs at `http://localhost:8080`.

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

Contributions are very welcome. The typical flow:

1. **Fork** this repository on GitHub.
2. Create a branch: `git checkout -b feat/your-idea`.
3. Commit your changes with a clear message.
4. Push and open a **Pull Request** describing what you changed and why.

You can also contribute without cloning the repo — open the project in [Lovable](https://lovable.dev) and edit visually. Changes sync back to GitHub automatically.

Ideas that are always appreciated:

- New candidate profiles (real Somali developers who want to be listed).
- UI/UX polish and accessibility fixes.
- Documentation and translations (Somali, Arabic, English).
- New features: shortlists, messaging, employer accounts, events board.

## Issues & discussions

Found a bug or have an idea? Open a GitHub Issue. For bigger conversations (roadmap, community, design direction), start a Discussion.

## License

Open source. Free to use, learn from, and build on.
