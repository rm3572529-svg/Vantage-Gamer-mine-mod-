# Vantage Gamer MineHub

A professional Minecraft MOD APK platform for the Vantage Army community — mobile-first, Play Store-style UI with full creator/developer ecosystem, moderation, and admin controls.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/vantage-minehub run dev` — run the frontend (port 23753)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Wouter, TanStack Query, Framer Motion, Lucide React
- API: Express 5 + OpenAPI (Orval codegen)
- DB: PostgreSQL + Drizzle ORM
- Auth: localStorage simulation (Firebase-ready — see src/lib/firebase.ts)
- Validation: Zod (`zod/v4`), `drizzle-zod`

## Where things live

- `artifacts/vantage-minehub/src/` — React frontend
  - `pages/` — all pages/routes
  - `contexts/AuthContext.tsx` — user auth state
  - `contexts/AdminContext.tsx` — admin session state
  - `lib/auth.ts` — localStorage auth simulation
  - `lib/firebase.ts` — Firebase config placeholder (swap in your config)
- `artifacts/api-server/src/routes/` — backend routes (mods, developers, admin, etc.)
- `lib/db/src/schema/` — database schema (Drizzle)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)

## Admin Panel

- URL: `/admin`
- Password: `741222`
- Controls: approve/reject mods, approve/ban developers, manage users, announcements, platform settings

## Firebase Integration

Firebase is set up as a placeholder at `artifacts/vantage-minehub/src/lib/firebase.ts`.
When you have your Firebase config, set these environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_URL`

## Product

- **Homepage**: Hero banner, live stats (downloads/mods/creators), category browser, trending mods, featured developers, announcements, social links (WhatsApp primary), floating WhatsApp button
- **Mods**: Browse/search/filter by category (mod/tool/texture/shader/utility), sort trending/latest/top
- **Mod Detail**: Banner, screenshots carousel, video embeds, download flow (engagement → 5s countdown → CAPTCHA once/day → MediaFire redirect), comments, likes
- **Developers**: Creator directory with follower/upload/like counts, badges (Featured/Verified/VIP), follow system
- **Auth**: Google, Phone OTP, Email/Password, Guest mode. Terms & Conditions with copyright/scam/virus warnings.
- **User Types**: Normal User → can apply to become Extreme User/Developer
- **Developer Dashboard**: Upload mods/tools/textures/shaders, track stats, view pending/approved/rejected status
- **Admin Panel**: Full moderation controls, user management, announcements, platform settings

## Architecture decisions

- OpenAPI-first: all endpoints defined in `lib/api-spec/openapi.yaml`, Orval generates React Query hooks + Zod schemas
- Auth is localStorage-simulated for now; Firebase SDK is installed and configured via env vars
- Admin password is `741222`, stored in sessionStorage after login
- Download tracking: server-side counter + redirect to MediaFire link stored in DB
- Content moderation: all uploads go to `pending` status first, require admin approval

## User preferences

- Mobile-first design (375px base)
- No emojis in UI
- No demo/placeholder content — platform starts completely clean
- Dark theme only (navy/charcoal + green accent)
- Professional Android app-like feel (Play Store / YouTube Mobile style)

## Gotchas

- Firebase config must be provided before real auth works — currently uses localStorage simulation
- GitHub deployment: ask user for GitHub username, repo link, and token before pushing
- After each OpenAPI spec change, run codegen before using updated types
- Wildcard routes in Express 5 use `/{*splat}` not bare `*`
