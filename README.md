# Hello by Osonvend - Website BETA

Website + customer web app for **Hello**, an AI smart vending fridge by OOO "OSONVEND", Tashkent. Tagline: **Scan. Take. Go.**

Full spec: [docs/BUILD_SPEC.md](docs/BUILD_SPEC.md) · Media/asset notes: [public/README.md](public/README.md)

## Stack
Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion + next-intl (uz, uz-Cyrl, ru, en) + Lucide + Leaflet. The frontend runs on a mock API behind `src/lib/api/` and `src/lib/account/api.ts` until the Django endpoints are confirmed.

## Setup
```
npm install --legacy-peer-deps
npm run dev          # http://localhost:3000 -> /uz
npm run lint
npm test             # vitest (unit tests)
npm run i18n:check   # lists keys missing between the 4 message files
npm run i18n:cyrl    # regenerates messages/uz-Cyrl.json from uz.json (needs native review)
npm run build
node scripts/shots.mjs   # screenshots -> docs/screenshots (needs `npm run dev`)
node scripts/audit.mjs   # 360/390px audit: overflow, text < 14px, console issues, sticky bar
```

## Routes
All under `/[locale]` (`uz` default, `uz-Cyrl`, `ru`, `en`):

| Route | What |
|---|---|
| `/` | Home: hero photo + clip, stats, how it works, demo video, gallery, popular products, business, FAQ |
| `/refrigerator/[id]` | Fridge page + unlock flow (login sheet, door open, receipt, nothing taken, error) |
| `/products` | 30 products, photos, search, categories |
| `/locations` | Real fridges grouped by type, Leaflet map (pins only for fridges with coordinates) |
| `/business` | Partner page with lead form in the hero |
| `/how-it-works`, `/about`, `/privacy`, `/terms` | Content pages (privacy/terms are DRAFT) |
| `/account` | Overview |
| `/account/profile`, `/cards`, `/purchases`, `/purchases/[id]`, `/support`, `/support/new`, `/loyalty`, `/settings` | Account area (protected: opens the login sheet) |
| `/provider-test/[provider]` | MOCK of the Payme/Click hosted card-linking page (marked TEST, no card input) |

Unknown URLs show the branded 404. Unknown fridge keys show "Muzlatgich topilmadi" (in development, any `W` + 7 digits shows a mock fridge; in production only the 25 real keys work).

## Config flags (`src/config.ts`)
- `showClientNames` (default `false`): client names are not public yet, so fridges show a generic label by type ("Bank ofisi", "Bank ofisi 2", ...). Set `true` to show the real names.
- `showClientPhotos` (default `false`): photos that show a client's branding stay hidden.
- `freeForLocation`, `showPartnerLogos`, `loyalty`, `brandLogos`, `stats`.

## Real data still missing (TODO)
- **Addresses and coordinates** of the 25 fridges: the admin panel has none. Add `address`, `lat`, `lng` in `src/lib/data/fridges.ts`; fridges without them are listed but not on the map.
- **Fridge stock** is deterministic mock data until the backend provides it.
- Official Payme/Click SVG logos (`public/brands/`), then set `config.brandLogos` to `true`.

## Hosting (GitHub Pages)
The site is deployed by `.github/workflows/pages.yml` on every push to `main`: https://rfsh09.github.io/hello-osonvend-web/

GitHub Pages is static hosting, so the workflow builds a **static export** (`GITHUB_PAGES=true`, `NEXT_PUBLIC_BASE_PATH=/hello-osonvend-web`, see `next.config.ts`) and:
- removes `src/proxy.ts` (locale middleware) and the catch-all 404 route, and adds `.github/pages/index.html` (picks the language) and `.github/pages/404.html`;
- pre-renders the 25 real fridges, purchases `P1001-P1025` and the two provider test pages;
- gives the build stand-ins for the git-ignored client photos (they are never shown while `showClientPhotos` is false).

Limits of the static build: there is no server, so the account area runs on browser storage only (as in the mock), purchases recorded during a session have no detail page, and unknown URLs show the static `404.html`. For production use a Node host (Vercel etc.) with the normal `npm run build`.

## Mock -> real API
All data access goes through `src/lib/api/index.ts` and `src/lib/account/api.ts`. Replace the function bodies with `fetch()` calls to Django (same signatures). In development a DEV panel (bottom right of the fridge page) jumps between flow states.

## Progress
- [x] Design system, i18n (4 languages), brand colours and logo
- [x] Home (real photo, clip, stills, demo video, gallery), business, products (30 items with photos), how-it-works, about, privacy/terms drafts
- [x] Real fridges (25, from the admin panel) with generic labels, locations page grouped by type
- [x] Fridge page + unlock flow with every state
- [x] Account: overview, profile, cards (mock provider page), purchases + receipt, support tickets, loyalty, settings; avatar menu, mobile tab bar
- [x] Real numbers from config (25 fridges, 170 000 orders, static year), no revenue shown
- [x] Quality gate: `tsc`, `lint`, `test` (17), `build`, i18n key check, 360/390px audit all green
- [ ] Addresses + coordinates for the real fridges
- [ ] Service worker / offline PWA, sitemap + schema.org, hreflang per page, Playwright e2e
- [ ] Real Django endpoints

## Performance (Lighthouse mobile, production build)
Home 90-93, business 97, fridge 94, how-it-works 90, about 94, account 93. `/locations` varies (64-99) because the largest paint is a third-party OpenStreetMap tile.
