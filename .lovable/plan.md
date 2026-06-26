
# SND v2.0 — Editorial Noir

A full rebuild of the site as a magazine-style developer archive. Inspired by **read.cv**, **Are.na**, **Family New York**, and **The Browser Company** — oversized serif display, generous whitespace, an indexed grid of developers, single muted gold accent on a near-black ground.

## What changes at a glance

- **3 routes only:** `/` (home), `/directory` (the dev index), `/dev/:id` (profile). Plus hidden `/admin/*`.
- **All public auth is removed.** No login, signup, profile, reset-password pages. No nav login button. No “Get Started.”
- **Admin login moves to `/admin/login`** — discreet, unlinked from the public site. Only path in.
- **Visual identity reset:** Editorial Noir palette, Instrument Serif for display, Inter Tight for UI, JetBrains Mono for metadata.

---

## Page architecture

### `/` — Home (editorial cover)
A magazine cover, not a SaaS landing.

- **Masthead bar:** small wordmark left, issue number + date center (`ISSUE 02 — JUN 2026`), single nav link `Directory →` right.
- **Cover headline:** oversized Instrument Serif, multi-line, asymmetric. Example: *"A working index of Somali developers, in practice."*
- **Stat ribbon:** mono, single row — `XX DEVELOPERS · XX DISCIPLINES · EST. 2024`. Auto-counted from DB.
- **Featured trio:** three top-ranked devs (by `ai_score`) presented as editorial entries — large portrait, name in serif, role in mono, one-line bio. No cards, no buttons; whole row links to `/dev/:id`.
- **Manifesto block:** two-column editorial copy explaining the project (replaces /about).
- **Index strip:** A→Z scrollable list of every dev name as a marquee, hover reveals role.
- **Footer:** contact email, socials, colophon (typefaces, year). Replaces /contact.

### `/directory` — The Index
The full searchable archive. This replaces both the old Candidates and Home grid.

- **Sticky filter bar** across the top: search input (name/skill/location), skill chips, qualification chips, sort (AI rank / newest / A–Z), `Clear` link. No sidebar.
- **Index table view (default):** rows like a magazine table of contents — `№ 01 · NAME · ROLE · LOCATION · SKILLS·` with a tiny thumbnail at the far left. Hovering a row reveals a larger portrait floating on the right. Click → profile.
- **Toggle to grid view:** sparse 3-up grid, large square portraits, name + role under each. No buttons, whole tile is the link.
- Result count and active filters render as mono caption above the list.

### `/dev/:id` — Developer profile
Long-form editorial layout, single column max-w-3xl, generous vertical rhythm.

- **Header:** full-width portrait, name in oversized serif underneath, role in mono. Gold rule divider.
- **Meta strip:** mono row of location · availability · qualification · social icons.
- **Bio:** large serif intro paragraph (drop-cap on first letter).
- **Skills:** typeset as a mono inline list separated by `·`, not pills.
- **Experience:** timeline as a numbered list, year range in mono left column, company + description right column.
- **Certifications:** small thumbnail strip, lightbox on click.
- **Resume:** mono `→ View resume` link opening the secure CV viewer (existing edge function).
- **Get in touch:** the inline contact form, restyled as a single textarea with a serif label. Sends via existing edge function.
- **Footer:** `← Back to index` link.

### Removed routes
`/login`, `/signup`, `/profile`, `/profile/:id` (replaced by `/dev/:id`), `/about` (folded into home), `/contact` (folded into home footer + dev profile form).

### Admin (kept, lightly restyled)
- `/admin/login` — discreet sign-in (admin only; signups disabled).
- `/admin` — dashboard.
- `/admin/candidates` — CRUD list + form.
- Restyle in the same Editorial Noir tokens but layout and logic stay as-is.

---

## Visual system

### Palette (HSL tokens in `index.css`)

| Token | Light mode | Dark mode | Use |
|---|---|---|---|
| `--background` | `36 20% 96%` (paper) | `0 0% 6%` (ink) | page ground |
| `--foreground` | `0 0% 8%` | `36 20% 94%` | body text |
| `--primary` | `42 55% 54%` (muted gold) | `42 55% 60%` | single accent only — rules, link hovers, drop caps |
| `--muted-foreground` | `0 0% 38%` | `0 0% 60%` | mono captions |
| `--border` | `0 0% 86%` | `0 0% 16%` | hairlines |

**Dark mode default.** Toggle stays.

No purple/indigo, no gradients, no glass, no blur orbs — those get removed. Surfaces are flat paper/ink with hairline rules.

### Typography

- **Display:** `Instrument Serif` (already loaded) — used at very large sizes (clamp 56–144px).
- **UI / body:** swap Inter → `Inter Tight` — tighter editorial feel. Install via `@fontsource/inter-tight`.
- **Mono:** `JetBrains Mono` for all metadata, numbers, captions, nav labels. Install via `@fontsource/jetbrains-mono`.
- Drop caps via `::first-letter` on bio paragraphs.

### Motion

- Page transitions: subtle 200ms fade only.
- Hover on dev rows: portrait fades in to the right at 300ms ease-out.
- Marquee on the A–Z index strip (existing utility).
- No floating orbs, no parallax, no 3D.

---

## Database / backend changes

- **No schema changes required.** Existing `candidates`, `user_roles`, `profiles`, RPC functions, edge functions all stay.
- **Auth config:** call `configure_auth` with `disable_signup: true` so the public can no longer create accounts. Admin user already exists.
- **Cleanup migration (optional, low risk):** keep `profiles` table since admin user references it via trigger.

---

## File-level change plan

### New files
- `src/pages/Directory.tsx` — the index page (replaces `Candidates.tsx`).
- `src/pages/DevProfile.tsx` — restyled profile (replaces `ProfileDetail.tsx`).
- `src/components/editorial/Masthead.tsx` — top bar for home.
- `src/components/editorial/IndexRow.tsx` — single row in the directory table view.
- `src/components/editorial/DevTile.tsx` — grid tile variant.
- `src/components/editorial/DirectoryFilters.tsx` — sticky horizontal filter bar.
- `src/components/editorial/Footer.tsx` — shared colophon footer.
- `src/components/editorial/AZIndex.tsx` — A–Z marquee strip.

### Rewritten
- `src/index.css` — palette, fonts, drop cap utility, hairline rules; drop glass/orb utilities.
- `tailwind.config.ts` — fontFamily `display`/`sans`/`mono` updated.
- `src/main.tsx` — import new fontsource packages.
- `src/App.tsx` — route table reduced to `/`, `/directory`, `/dev/:id`, `/admin/*`.
- `src/components/Navbar.tsx` → replaced by `Masthead` on home; `/directory` and `/dev/:id` use a slim top bar component instead.
- `src/pages/Home.tsx` — full rewrite as editorial cover.
- `src/components/CandidateCard.tsx` — repurposed or removed in favor of `IndexRow` + `DevTile`.
- `src/components/Hero.tsx`, `FilterSidebar.tsx`, `HorizontalFilters.tsx`, `CandidateGrid.tsx`, `ContactForm.tsx` — deleted, logic moved into editorial components.

### Deleted pages/components
- `src/pages/Login.tsx`, `Signup.tsx`, `Profile.tsx`, `ProfileDetail.tsx`, `About.tsx`, `Contact.tsx`, `Index.tsx`.
- Any auth-related links/buttons in remaining UI.

### Admin (light touch)
- `src/components/AdminLayout.tsx` — restyle to editorial tokens, keep structure.
- `src/pages/admin/*` — keep logic, restyle headings/buttons to serif + mono.
- New `src/pages/admin/AdminLogin.tsx` mounted at `/admin/login` (since old `/login` is gone).

### Dependencies to add
```
@fontsource/inter-tight
@fontsource/jetbrains-mono
```
(Instrument Serif already present.)

---

## Technical details

- Routing redirects: any hit on `/login`, `/signup`, `/profile*`, `/about`, `/contact` → 301 to `/` (handled in `App.tsx` route table with `<Navigate replace />`).
- Admin protection unchanged (`ProtectedAdminRoute`).
- Data fetching unchanged — `get_public_candidates` RPC powers `/` and `/directory`, `get_public_candidate` powers `/dev/:id`.
- Theme toggle preserved (moved into footer colophon as a small mono `[ dark / light ]` link).
- SEO: update `index.html` title to `SND — Somali Network Developers · Issue 02`, meta description, single H1 per page, JSON-LD `ItemList` on `/directory`.

---

## Open scope decisions I'm making for you

- Auth disabled at the provider level (`disable_signup: true`) — existing admin still works.
- Light mode kept but dark is default; toggle lives in the footer colophon, not the masthead.
- Existing AI ranking, CV viewer, contact email function — all kept untouched.
- No new edge functions, no DB schema migrations beyond the auth config flip.

Approve to start building.
