# /public assets

- `brand/`: real Hello logo files (`hello-logo-dark.png` for light backgrounds, `hello-logo-white.png` for dark ones, app icons 32/192/512). Cut from a screenshot: ask the designer for the original SVG.
- `brands/`: `payme.svg`, `click.svg` are neutral PLACEHOLDER wordmarks. Replace them with the official logo files (same names).
- `photos/`: `fridge-hallway` (shown by default), `fridge-office-lobby`, `fridge-bank-branch`, `fridge-university-top` (.jpg + .webp). The last three show clients and stay hidden until `showClientPhotos` is true in `src/config.ts`.
- `video/`: `hello-hero-loop.mp4`, `hello-demo-clean.mp4`, `hello-demo-clean-muted.mp4`, `poster-fridge.jpg`, and the three "how it works" stills.
- `products/`: product photos, `<slug>.webp`, 800x800. The slug of each product is in `src/lib/data/products.ts`. A missing file falls back to the drawn SVG and logs `[products] missing photo: ...` in the dev console.

Never publish `originals/hello-demo-original.mp4` (it shows a customer's phone number and SMS code).
