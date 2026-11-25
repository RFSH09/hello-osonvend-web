import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// GitHub Pages build (see .github/workflows/pages.yml): static export under /hello-osonvend-web.
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(pages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: process.env.NEXT_PUBLIC_BASE_PATH,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
