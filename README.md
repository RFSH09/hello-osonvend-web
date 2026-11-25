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

## Progress
- [x] 1. Design system + i18n (tokens, dark mode, 4 locales, core components, door-open animation, price formatter)
- [ ] 2. Customer flow
- [ ] 3. Account
- [ ] 4. Public pages
- [ ] 5. PWA / SEO / e2e tests / README

The home page currently shows a design-system showcase.
