## Update README + confirm sample data

### 1. Rewrite `README.md`
Replace the current Lovable-boilerplate README with a project-focused one:

- **Title**: Somali Network Developers (SND)
- **Tagline**: A collaborative, open-source platform where Somali developers connect and share insights.
- **Preview image**: embed the uploaded `screencapture-londonjuniordevelopers-2025-10-11-14_31_29.png` at the top (upload via `lovable-assets` → CDN URL, reference with a standard `![preview](...)` markdown tag so it renders on GitHub).
- **About** section: explains this is open source — anyone can clone, fork, download, and push updates. Aim: build together as collaborators, connect Somali devs, share insights, showcase talent.
- **How to contribute**: fork → branch → PR flow, plus link to editing via Lovable for non-technical contributors.
- **Run locally**: `npm i` / `npm run dev` (Node + npm required).
- **Tech stack**: React 18, Vite, TypeScript, Tailwind, shadcn/ui, Lovable Cloud (backend/auth/storage).
- **Project structure**: brief listing of `src/pages`, `src/components`, `supabase/`.
- **License / community note**: encourage PRs, issues, and discussions.

### 2. Sample data — no action needed
Verified the `candidates` table already contains only the 14 seeded sample profiles from the v3.0 reboot (Ayaan Mohamed, Ibrahim Yusuf, Fadumo Ali, Hassan Farah, Naima Warsame, Abdi Jama, Sagal Osman, Mohamed Barre, Khadija Hussein, Yusuf Aden, Amina Abdi, Ali Mohamud, Halima Guled, Omar Elmi). No rows named "Diini" or "Abdikarim" exist — likely a cached/older preview view. The plan will note this in the reply so you can hard-refresh; no DB change required.

### Technical notes
- Upload the preview screenshot to Lovable Assets CDN so the image URL is stable and works on GitHub (raw markdown `<img>`), not tied to `user-uploads://`.
- No code, routing, or DB migration changes.

### Files touched
- `README.md` (rewritten)
- `public/preview.png.asset.json` (or similar) — pointer for the CDN-hosted preview image
