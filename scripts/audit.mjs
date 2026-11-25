// Mobile audit against a running server:  node scripts/audit.mjs   (BASE=http://localhost:3000)
// Checks at 360px and 390px: horizontal scroll, visible text under 14px, sticky button covering content,
// and console errors/warnings (what the Next.js dev "issues" badge reports).
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = [
  "/uz", "/uz/how-it-works", "/uz/products", "/uz/locations", "/uz/business", "/uz/about", "/uz/privacy", "/uz/terms",
  "/uz/xyz", "/uz/refrigerator/W0016188", "/uz/refrigerator/W9999999", "/uz/refrigerator/nope",
];
const ACCOUNT = [
  "/uz/account", "/uz/account/profile", "/uz/account/cards", "/uz/account/purchases", "/uz/account/purchases/P1024",
  "/uz/account/support", "/uz/account/support/new", "/uz/account/loyalty", "/uz/account/settings", "/uz/provider-test/payme",
];

const browser = await chromium.launch();
const problems = [];

async function check(ctx, path, width) {
  const page = await ctx.newPage();
  const logs = [];
  page.on("pageerror", (e) => logs.push(`pageerror: ${e.message.slice(0, 160)}`));
  page.on("console", (m) => {
    const txt = m.text();
    if (["error", "warning"].includes(m.type()) && !/Failed to load resource/.test(txt)) logs.push(`${m.type()}: ${txt.slice(0, 160)}`);
  });
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2200);

  const r = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    const small = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const text = n.textContent.trim();
      if (!text) continue;
      const el = n.parentElement;
      if (!el || el.closest("[aria-hidden='true'], .sr-only, script, style, noscript, svg, .leaflet-control-attribution")) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (parseFloat(cs.fontSize) < 14) {
        const k = `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")} ${cs.fontSize}`;
        if (!small.has(k)) small.set(k, text.slice(0, 40));
      }
    }
    return { overflow, small: [...small.entries()] };
  });
  if (r.overflow > 0) problems.push(`${width}px ${path}: horizontal scroll ${r.overflow}px`);
  for (const [k, text] of r.small) problems.push(`${width}px ${path}: text under 14px -> ${k} "${text}"`);
  for (const l of logs) problems.push(`${width}px ${path}: ${l}`);

  if (path === "/uz/refrigerator/W0016188") {
    // the sticky "Eshikni ochish" bar must never cover content: at the end of the page it sits below the last block
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    const covered = await page.evaluate(() => {
      const bar = [...document.querySelectorAll("div")].find((d) => /sticky/.test(d.className) && d.textContent?.includes("Eshikni ochish"));
      const main = document.querySelector("main");
      if (!bar || !main) return "bar or main not found";
      const last = main.lastElementChild;
      return bar.getBoundingClientRect().top < last.getBoundingClientRect().bottom - 1 ? "bar overlaps last content block" : null;
    });
    if (covered) problems.push(`${width}px ${path}: ${covered}`);
  }
  await page.close();
}

for (const width of [360, 390]) {
  const opts = { viewport: { width, height: 800 }, isMobile: true, hasTouch: true };
  const anon = await browser.newContext(opts);
  const authed = await browser.newContext(opts);
  await authed.addInitScript(() => localStorage.setItem("hello.session", JSON.stringify({ phone: "944031611" })));
  for (const p of PAGES) await check(anon, p, width);
  for (const p of ACCOUNT) await check(authed, p, width);
  await anon.close();
  await authed.close();
}

await browser.close();
console.log(problems.length ? `PROBLEMS (${problems.length}):\n` + [...new Set(problems)].join("\n") : "Mobile audit clean: no overflow, no text under 14px, no console issues, sticky bar OK.");
process.exit(problems.length ? 1 : 0);
