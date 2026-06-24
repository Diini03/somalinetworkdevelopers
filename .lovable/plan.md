
# SND 2026 Redesign Plan

A full visual overhaul of Somali Network Developers. Functionality stays intact (auth, candidates, profiles, admin, edge functions). Only the presentation layer changes.

## Design direction

- **Palette**: monochrome base (near-black `#0A0A0A`, paper white `#FAFAFA`, graphite grays) with a single electric accent — **Electric Lime `#D4FF3A`** (high-energy, current, distinct from the old teal and from typical SaaS blue/purple).
- **Typography**: `Instrument Serif` for oversized display headings paired with `Geist` / `Inter` for UI and body. Tight tracking, large size jumps.
- **Surface language**: heavy glassmorphism — `backdrop-blur-2xl`, low-opacity surfaces, hairline borders (`border-white/10` in dark, `border-black/10` in light), soft inner highlights, grain overlay.
- **Motion**: subtle parallax on hero, fade-in-up on scroll, marquee skill ticker, magnetic-feel hover on cards (scale + translate), animated noise/blur orbs replacing the current spinning SVG.
- **Shape**: larger radii (`rounded-3xl`), more whitespace, asymmetric bento layouts, mixed serif/sans hierarchy.

## Scope of changes (visual only)

```text
src/index.css              → new tokens, palette, fonts, glass/noise utilities
tailwind.config.ts         → font families, extended radii/shadows
index.html                 → load Instrument Serif + Geist
src/components/Navbar.tsx  → floating pill nav, glass, mono links, lime CTA
src/components/Hero.tsx    → editorial split hero, oversized serif, blur orbs,
                             marquee stats, new search bar styling
src/components/CandidateCard.tsx     → bento card, mono, lime hover accent
src/components/CandidateGrid.tsx     → tighter masonry-feel grid
src/components/FilterSidebar.tsx     → glass panel, restyled controls
src/pages/Home.tsx         → layout polish, section dividers, footer band
src/pages/Candidates.tsx   → header restyle to match
src/pages/About.tsx        → editorial sections, large serif headlines
src/pages/Contact.tsx + InlineContactForm.tsx → glass form, lime submit
src/pages/Login.tsx + Signup.tsx     → split-screen glass auth
src/pages/Profile.tsx + ProfileDetail.tsx → restyled, same data/logic
src/components/AdminLayout.tsx + admin pages → mono admin chrome
```

No changes to: Supabase client, types, edge functions, RLS, RPC calls, routing, auth logic, form submission logic.

## Technical notes

- All colors stay as HSL semantic tokens in `index.css`; no hardcoded hex in components.
- New tokens: `--accent-lime`, `--glass-bg`, `--glass-border`, `--noise`, `--shadow-float`, `--gradient-display`.
- Light + dark mode both refreshed; default remains user's current theme.
- Fonts loaded via `<link>` in `index.html`, declared in `tailwind.config.ts` as `font-display` (serif) and `font-sans` (Geist).
- New utility classes: `.glass-panel`, `.glass-pill`, `.noise`, `.display-xl`, `.marquee`.
- Reuse existing shadcn primitives; only restyle via tokens and variants — no component API changes.

## Out of scope

- No backend/schema/security changes.
- No new features, routes, or data fields.
- No copy rewrites beyond minor hero/about headline polish to fit the new type scale.

After your approval I'll implement in one pass: tokens + fonts first, then Navbar/Hero, then cards/grid, then remaining pages.
