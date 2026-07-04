# SND v2.1 — Talent Discovery Console

Reframe: this is a **hiring tool**, not a magazine. Recruiters land, search, filter, shortlist, and contact. The editorial gold/serif system is dropped. New system is a **calm, dense, workbench UI** — think Linear × Notion People × Vercel Directory × Perplexity, tuned for scanning candidates fast.

---

## The product loop it must serve

1. Land → immediately see "search + filters + result grid" above the fold.
2. Type a query or click a chip → results reflow instantly.
3. Open a candidate → full profile in a **side sheet** (URL updates), grid stays behind. No full-page navigation for browsing.
4. Deep link `/dev/:id` opens the same sheet over the directory.
5. Contact from inside the sheet.

Only 2 public routes: `/` (the console) and `/dev/:id` (same console with sheet open). Admin unchanged.

---

## Layout — one screen, three regions

```text
┌───────────────────────────────────────────────────────────────┐
│  TOP BAR  ── SND logo · ⌘K search ······················ ◐  │
├──────────────┬────────────────────────────────────────────────┤
│  FILTER RAIL │  RESULT HEADER  (count · sort · view toggle)   │
│  (sticky)    ├────────────────────────────────────────────────┤
│              │                                                │
│  Skills      │   CANDIDATE GRID  (cards)  ── or ── TABLE      │
│  Location    │                                                │
│  Seniority   │                                                │
│  Available   │                                                │
│  Score       │                                                │
│              │                                                │
└──────────────┴────────────────────────────────────────────────┘
        Candidate sheet slides in from right on click →
```

- **Top bar**: slim, 56px. Wordmark left. Center: a `⌘K` command-style search that expands with recent queries, suggestions, and skill autocomplete. Right: theme toggle + tiny "Admin" dot (unlabeled, keyboard-only).
- **Filter rail** (left, 260px, sticky, collapsible on mobile → bottom sheet):
  - Full-text search echo
  - Skill multi-select (chips + search inside)
  - Location (chips)
  - Qualification / seniority (segmented)
  - Availability (toggle: Open / Passive / All)
  - AI score slider (min score)
  - "Clear all" caption link
- **Result header**: `247 candidates` · sort (`AI match ↓` / `Recently added` / `A–Z`) · view toggle (`Grid | Table | Compact`).
- **Grid** (default): 3-col responsive cards. Each card = square portrait top, name + role, skill chips (max 4 + "+N"), location, availability dot, **AI match score as a small circular ring** in the top-right corner. Hover = subtle lift + "Open →" affordance. Whole card clickable.
- **Table view**: dense, one row per candidate — portrait avatar, name, role, top skills, location, score, availability. For power users scanning 100+.
- **Compact view**: 2-line list, portrait + name/role only.

## Candidate sheet (the hero interaction)

Sliding right panel, 640px wide desktop / fullscreen mobile. URL becomes `/dev/:id`, `Esc` closes back to `/`.

Contents, top → bottom:
1. **Header block**: portrait (rounded square), name (semibold sans, not serif), role, location, availability pill, AI match ring.
2. **Action row**: primary `Contact` button, secondary `View resume`, icon buttons for LinkedIn / GitHub / Portfolio, `Copy link`.
3. **Tabs**: `Overview` · `Experience` · `Skills` · `Certifications`.
   - Overview: bio, key skills as chips, quick stats (years exp, projects, last updated).
   - Experience: clean timeline with company, role, dates, description.
   - Skills: grouped by category with proficiency bars.
   - Certifications: thumbnail strip, click to enlarge.
4. **Contact form** (inside `Contact` action, opens as an inner drawer): name, email, company, message. Uses existing edge function.

## Empty / loading / error states

- Skeleton cards on first load.
- Empty search: "No candidates match. Try removing filters." with the active filters shown as removable chips.
- Error: quiet inline banner, retry button.

---

## Visual system reset

Drop editorial noir entirely. Adopt a **neutral product-console** system.

### Palette (HSL, semantic tokens in `index.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `0 0% 100%` | `222 20% 7%` | app ground |
| `--surface` | `220 14% 98%` | `222 18% 10%` | rail, cards |
| `--surface-elevated` | `0 0% 100%` | `222 16% 13%` | sheet, popovers |
| `--foreground` | `222 20% 12%` | `210 20% 96%` | text |
| `--muted-foreground` | `220 10% 46%` | `220 10% 65%` | secondary text |
| `--border` | `220 13% 91%` | `222 14% 18%` | hairlines |
| `--primary` | `221 83% 53%` | `217 91% 60%` | actions, focus, score ring |
| `--success` | `142 71% 45%` | `142 70% 50%` | available dot |
| `--warning` | `38 92% 50%` | `38 92% 55%` | passive dot |

Single accent = **blue**. No gold, no gradients, no glass, no serif display.

### Typography

- **Sans (everything)**: Inter Tight (kept from install).
- **Mono (numbers, IDs, keyboard shortcuts, code)**: JetBrains Mono (kept).
- **Removed**: Instrument Serif — uninstall usage, keep import only if needed by shadcn (it isn't).
- Sizes: display 32/40, h2 22/28, body 14/20, caption 12/16. Tight and consistent.

### Radius & density

- `--radius: 0.5rem` (buttons/inputs/cards). Sheet 0 on the leading edge.
- Card padding 16px. Rail item height 32px. Table row height 44px.

### Motion

- Sheet slide: 220ms cubic-bezier(0.32, 0.72, 0, 1).
- Card hover: 120ms lift + border color shift.
- Filter change: `View Transitions API` if available, else 150ms fade.
- No marquees, no parallax, no drop caps.

---

## File plan

### New
- `src/pages/Console.tsx` — the single directory + sheet page (replaces `Home.tsx` + `Directory.tsx`).
- `src/components/console/TopBar.tsx`
- `src/components/console/CommandSearch.tsx` — ⌘K palette (shadcn `command`).
- `src/components/console/FilterRail.tsx` — desktop sticky rail.
- `src/components/console/FilterSheet.tsx` — mobile bottom sheet wrapper for the rail.
- `src/components/console/ResultHeader.tsx` — count + sort + view toggle.
- `src/components/console/CandidateCard.tsx` — grid card with score ring.
- `src/components/console/CandidateRow.tsx` — table row.
- `src/components/console/CandidateCompact.tsx` — compact list row.
- `src/components/console/ScoreRing.tsx` — small SVG circular score.
- `src/components/console/AvailabilityDot.tsx`.
- `src/components/console/CandidateSheet.tsx` — right-side detail sheet (shadcn `sheet`), URL-synced.
- `src/components/console/SheetHeader.tsx`, `SheetTabs.tsx`, `ContactDrawer.tsx`.
- `src/hooks/useCandidates.ts` — fetch + memo filter/sort.
- `src/hooks/useFilters.ts` — URL-synced filter state (`?q=…&skill=…&sort=…`).

### Rewritten
- `src/index.css` — replace editorial tokens with product-console tokens; drop `dropcap`, `rule-gold`, `marquee`, `caption` utilities; add `.score-ring`, `.rail-item` if needed.
- `tailwind.config.ts` — remove `display` font family, keep sans + mono; add `surface`, `surface-elevated`, `success`, `warning` colors.
- `src/App.tsx` — routes: `/` → `Console`, `/dev/:id` → `Console` (sheet opens via param), keep `/admin/*`, delete redirects to old paths (already handled).
- `src/pages/DevProfile.tsx` — deleted (folded into sheet).
- `src/components/InlineContactForm.tsx` — restyled to match new inputs, moved into `ContactDrawer`.

### Deleted
- `src/pages/Home.tsx`, `src/pages/Directory.tsx`, `src/pages/DevProfile.tsx`.
- `src/components/editorial/*` (all of them).

### Admin
- `AdminLayout.tsx` restyled to match console tokens (same left rail pattern), logic untouched.
- `AdminLogin.tsx` restyled as a plain centered card form.

---

## Behaviour details

- Filters live in the URL so results are shareable.
- Sheet open state also in URL (`/dev/:id`) — deep links open the correct candidate over an empty console on first load; back button closes the sheet without reloading the grid.
- ⌘K opens the command palette from anywhere.
- Keyboard: `/` focus search, `j`/`k` next/prev card, `Enter` open, `Esc` close sheet.
- Mobile: filter rail becomes a `Filters` button that opens a bottom sheet; card grid becomes 1 column; candidate sheet becomes fullscreen.
- All colors are semantic tokens — no hardcoded hex in components.
- Score ring color: blue at ≥80, neutral 60–79, muted <60. Uses HSL tokens only.

## Data / backend

No schema, RPC, or edge-function changes. Same `get_public_candidates` and `get_public_candidate` power everything. Contact still uses `send-candidate-contact-email`.

## Out of scope

Shortlists / saved candidates / recruiter accounts — public auth stays disabled per prior decision. If you later want a "saved" feature, we'd add localStorage-only bookmarks; not in this plan.

---

Approve to build.
