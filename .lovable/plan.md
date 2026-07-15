
# SND v3.0 — Full Reboot

A complete refresh of the Somali Network Developers talent platform. New identity, new information architecture, richer features, seeded sample data.

## Design direction

**Neo Terminal, refined.** Dark-first, mono-accented, technical but warm. Feels like a serious tool for hiring engineers, not a job board.

- **Palette (dark default, light mirrored)**
  - Background `#07090C`, Surface `#0E1116`, Elevated `#151A21`
  - Foreground `#E6EAF0`, Muted `#8A94A3`, Border `#1F2630`
  - Primary accent `#7CFFB2` (mint signal) with `#0EA5E9` secondary for links
  - Warning `#F5B849`, Danger `#FF6B6B`
- **Typography**
  - Display / headings: **Instrument Serif** (editorial weight for hero + section labels)
  - UI / body: **Geist Sans**
  - Mono: **Geist Mono** (metrics, ids, kbd, code)
- **Motion & feel**
  - Micro-transitions only (120–220ms), subtle grid background, hairline dividers, generous whitespace, rounded-lg (10px) surfaces, no gradients except a single soft radial behind the hero.
- **Semantic tokens rebuilt in `index.css` + `tailwind.config.ts`.** All components refactored to use tokens — no hardcoded colors.

## Information architecture

```text
/                → Landing (new)
/talent          → Console (browse + filter + compare)
/talent/:id      → Full profile page (replaces slide-over)
/compare         → Dedicated compare workspace
/admin/*         → Kept as-is (login, dashboard, candidates mgmt)
```

Legacy `/dev/:id` and `/directory` redirect to their new equivalents.

## What ships

### 1. Landing page (`/`)
- Hero: serif headline "Engineering talent from the Horn.", sub, primary CTA → `/talent`, secondary CTA → `/admin/login`.
- Live stats strip (candidates count, stacks, cities) pulled from `get_public_candidates`.
- "How it works" 3-step block, featured candidates carousel (top 4 by aiScore), footer with links.

### 2. Rebuilt Console (`/talent`)
- New topbar: brand mark, global search, command palette hint, theme toggle, "Sign in" link.
- **Left rail** filters, restyled with grouped sections + counts.
- Result header with tabs: **All · Open now · Top ranked · Recently added**.
- Grid + Table + **Compact list** views (new third view).
- Card redesign: photo left, name + title, stack chips (max 4 + "+N"), availability dot, aiScore ring, quick-add-to-compare, quick-open.

### 3. Rich profile page (`/talent/:id`)
Replaces the current sheet with a real route:
- Header: avatar, name, title, location, availability, aiScore ring, actions (Add to compare, Contact, Open CV).
- Two-column: left = bio + experience timeline + certifications; right = skills matrix, links (LinkedIn/GitHub/Portfolio), qualification, meta.
- Sticky action bar on scroll.

### 4. Compare workspace (`/compare`)
- Promote current dialog to a full page. Keep field selector, side-by-side columns, per-candidate remove, clear-with-confirm, open-profile.
- Persist selection in localStorage as today.

### 5. Command palette (⌘K / Ctrl+K)
- Jump to candidates by name, run filters ("open now", "in Nairobi"), toggle theme, open admin.

### 6. Seeded sample data
Wipe existing candidate rows and insert **14 curated sample devs** covering FE/BE/mobile/data/DevOps/design-eng, seniorities junior→staff, cities across Mogadishu / Hargeisa / Nairobi / Addis / remote. Each with realistic skills, 2–3 experience entries, availability, links, and a placeholder avatar. `aiScore` seeded (recomputable later via existing edge function).

### 7. Removed / deprecated
- `Console.tsx` monolith → split into route files.
- Slide-over `CandidateSheet` → replaced by `/talent/:id` route.
- `CompareDialog` modal → replaced by `/compare` route (dialog kept as thin wrapper redirecting for now, then deleted).
- Old redirect routes cleaned up.

## Technical notes

- **New files**
  - `src/pages/Landing.tsx`
  - `src/pages/Talent.tsx` (was `Console.tsx`)
  - `src/pages/CandidateProfile.tsx`
  - `src/pages/Compare.tsx`
  - `src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx`
  - `src/components/CommandPalette.tsx`
  - `src/components/candidate/ProfileHeader.tsx`, `ExperienceTimeline.tsx`, `SkillsMatrix.tsx`
- **Refactored**
  - `src/index.css` — token overhaul, fonts via `@import` (Google Fonts) + `body` stack.
  - `tailwind.config.ts` — new color scale, font families, radii.
  - `src/App.tsx` — new routes, legacy redirects.
  - Existing `console/*` components restyled to tokens and moved under `src/components/talent/`.
- **Data**
  - One migration: `TRUNCATE public.candidates RESTART IDENTITY CASCADE;` then bulk `INSERT` of 14 seed rows. Grants/RLS untouched.
- **Kept as-is**
  - Auth, admin routes, RLS, `get_public_candidates` RPC, edge functions (`batch-score-candidates`, `calculate-candidate-score`, `get-cv-signed-url`, `send-candidate-contact-email`).
  - Supabase client file (auto-gen).

## Out of scope (later)
- Schema changes to `candidates` (tags, saved shortlists table, employer accounts) — flagged for a v3.1 pass.
- Rescoring pipeline changes.
- Email template redesign.

Approve to build.
