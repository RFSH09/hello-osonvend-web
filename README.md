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
- [x] Design system, i18n, home, fridge page + unlock flow, business, products, locations, how-it-works, about
- [ ] Account area (purchases, cards, tickets, settings)
- [ ] Report-problem form, PWA, SEO (sitemap, schema.org), Playwright e2e, privacy/terms/contact pages
