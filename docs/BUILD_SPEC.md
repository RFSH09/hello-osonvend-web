# Hello by Osonvend - Website BETA (v2) - build spec (25 Nov 2026)

Open items before launch: "free for the location" toggle, permission for client names/logos (hidden by default), real Django API endpoints (mock API until then).

## 0. Context
Beta of osonvend.uz: website + customer web app for Hello, an AI smart vending fridge by OOO "OSONVEND", Tashkent. Flow: scan QR -> sign in with phone -> door unlocks -> take items, close door -> cameras + AI recognize items -> charged via Payme or Click; fiscal receipt + video of every purchase.
- Since 22 Aug 2024; ~25 active fridges in Tashkent offices; ~300 orders/day (~400 weekdays); avg ~18,500 so'm; 166,000+ orders; 7,600+ users
- Existing site: Django. Fridge URLs /refrigerator/<ID>/ (e.g. W0016188) must keep working (QR codes printed).
- Retire purple #6B50D6; match machine navy + green. Tagline: "Scan. Take. Go."

## 1. Goals
1. Public site that wins location partners. 2. Fast mobile-first customer web app. 3. Account area (history, receipts, cards, support). Admin + hardware out of scope.

## 2. Tech
Next.js App Router + TypeScript + Tailwind + shadcn/ui + Framer Motion. Django backend behind /lib/api/*; mock API with same interface for beta. PWA. i18n via next-intl: O'zbek Latin (default), Uzbek Cyrillic, Russian, English. Fridge page interactive <1.5 s on mid Android 4G; Lighthouse >=90; WCAG 2.1 AA; 44px tap targets. SEO: hreflang, OG, sitemap, schema.org Organization + LocalBusiness.

## 3. Design system
Navy #0F1E3D, Green #22C55E, Light #F5F7FA, White, Red #EF4444, Amber #F59E0B. Inter/Manrope. Premium-fintech feel, 16px cards, pill buttons, Lucide icons, dark mode, 150-250 ms motion, one memorable "door open" animation. Components: Button, Card, Badge, ProductCard, PriceTag, StepIndicator, BottomSheet, Toast, Skeleton, EmptyState, LanguageSwitcher.

## 4. Public pages
- Home: hero + 2 CTAs; 4-step how it works; stats strip (fridges, orders, since 2024; no revenue); why Hello; for businesses (<1 m2, ~100 kg, 1-day install, online monitoring, "free for location" toggle); popular products carousel; Payme/Click trust; partner logos behind flag; FAQ; footer (Ko'kcha Darvoza 10, Shayxontohur; +998 94 403 16 11; @hello_vending; @Hello_vending_bot; WhatsApp).
- /how-it-works with "what if" answers (AI mistake -> video check; door doesn't open; card declined).
- /business: benefits, ideal location types, lead form (company, contact, +998 phone, type, address, people count, comment).
- /locations: Tashkent map + list, status, access, district filter; only `public: true` fridges.
- /products: grid by category, search, prices (Appendix A).
- /about (roadmap: more of Tashkent -> regions -> nationwide -> cashier-free store; "We use a proven AI recognition system today; our own module is our next goal" - never claim self-built AI), /contact, /privacy (DRAFT, lawyer review), /terms.

## 5. Customer web app
- /refrigerator/[id]: before login show name, location, status, live stock with prices, trust badges, sticky "Eshikni ochish"; login in bottom sheet returns to fridge; offline -> nearest fridges + support.
- Login: single flow, +998 mask, 6-cell SMS code with WebOTP auto-read, auto-register, remember device, resend timer.
- Payment: Payme/Click card linking via provider hosted page only; masked saved cards, default card.
- State machine: idle -> unlocking (10 s timeout) -> door_open (full-screen green, timer, 60 s reminder) -> processing -> receipt | nothing_taken ("pul yechilmadi") | error. Polling/WebSocket on mock; beta dev panel to trigger states.
- Receipt: items, total, method, time, fiscal QR, "Xarid noto'g'ri?", download.
- Report problem: reason + comment + photo -> ticket, "we check the video, reply within 24 h".

## 6. Account
Purchases, cards, loyalty (flag, config rules), tickets, settings (name, language, theme, logout, delete request). Support button everywhere -> Telegram bot, WhatsApp/phone fallback.

## 7. Data models
Fridge, Product (4-language names), FridgeStock, User, Card, Order (processing/paid/canceled/nothing_taken), Ticket, PartnerLead. Money as "18 500 so'm". Display Asia/Tashkent; server is UTC+8.

## 8. Quality
Loading/empty/error states everywhere; no hard-coded strings; test at 360px; unit tests (state machine, price format); Playwright e2e (QR -> login -> open -> receipt; partner form); no fake testimonials; README (setup, env, mock->real API, config flags).

## 9. Order
1 design system + i18n | 2 customer flow | 3 account | 4 public pages | 5 PWA/SEO/tests/README. Pause for feedback after each.

## Appendix A - Prices (so'm)
Drinks: Bonaqua 5,000; Coca-Cola 0.5L 9,000; Fanta 0.5L 9,000; Fuse Tea 9,000; Gorilla 0.45L 14,000; "18+" 14,000; Chortoq 14,000; Moxito 14,000; Montella 14,000; Chernogolovka 14,000; Sochnaya Dolina 1L 15,000; Pulpy Orange 15,000; VIKO 20,000; Adrenaline 20,000; Red Bull 0.25L 22,000; Red Bull 0.3L 30,000
Snacks: Super kontik 10,000; Qurt 12,000; Tuc 14,000; Bruni 16,000; Lays 17,000; Keshyu 18,000; Hazel 18,000; Minikruosan 21,000
Chocolate: Bounty 11,000; KitKat 14,000; Twix 14,000; Snickers 14,000
Popular: Coca-Cola, Snickers, Gorilla, Fanta, Fuse Tea, Bounty, Twix.

## Appendix B - Mock fridges
~10 generic names ("Office Tower - Yunusobod", "University Campus - Mirzo Ulug'bek", etc.), Tashkent coordinates, random stock, one offline.
