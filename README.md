# Hello by Osonvend - Website BETA

Website + customer web app for **Hello**, an AI smart vending fridge by OOO "OSONVEND", Tashkent. Tagline: **Scan. Take. Go.**

Full spec: [docs/BUILD_SPEC.md](docs/BUILD_SPEC.md)

## Stack
Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion + next-intl (uz, uz-Cyrl, ru, en) + Lucide. Frontend will run on a mock API behind `src/lib/api/*` until the Django endpoints are confirmed.

## Setup
```
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000 -> /uz
npm test         # unit tests (vitest)
npm run build
```

## Routes
`/[locale]` (uz, uz-Cyrl, ru, en): `/`, `/refrigerator/[id]`, `/business`, `/products`, `/locations`, `/how-it-works`, `/about`, branded 404.

## Config flags
`src/config.ts`: `freeForLocation` (default false), `showPartnerLogos` (default false), `loyalty`.

## Mock -> real API
All data access goes through `src/lib/api/index.ts`. Replace the function bodies with fetch() calls to Django (same signatures). Any `W` + 7 digits fridge id renders a mock fridge; other ids show "Muzlatgich topilmadi". In development a DEV panel (bottom right of the fridge page) jumps between flow states.

## i18n
`messages/uz.json` is the source for Uzbek; `npm run i18n:cyrl` regenerates `messages/uz-Cyrl.json` by transliteration (needs native review). ru/en are hand-written.

## Progress
- [x] Design system, i18n (uz, uz-Cyrl, ru, en), real brand colours (#33384B / #393C45 / #3ADC93) and logo
- [x] Home with real hero photo, phone clip, step stills, demo video, gallery (client photos behind `showClientPhotos`)
- [x] Fridge page + unlock flow (login sheet, door open, receipt, nothing taken, error), dev panel
- [x] Account: overview, profile, cards (mock provider page, no card input), purchases + receipt, support tickets, loyalty (config flag), settings
- [x] Business (lead form in hero), products (real photos with SVG fallback), locations (Leaflet map, list sync, mobile toggle), how-it-works, about, privacy/terms drafts
- [x] Favicon + PWA manifest icons
- [ ] Service worker / offline PWA, sitemap + schema.org, Playwright e2e, hreflang per page
- [ ] Real Django endpoints (see `src/lib/api/` and `src/lib/account/api.ts`)

## Performance (Lighthouse mobile, production build)
Home 90-93, business 97, fridge 94, how-it-works 90, about 94, account 93. `/locations` varies (64-99) because the largest paint is a third-party OpenStreetMap tile.
