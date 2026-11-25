// Review screenshots against a running dev server:  node scripts/shots.mjs
// Output: docs/screenshots/desktop (1440px) and docs/screenshots/mobile (390px)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "docs/screenshots";
mkdirSync(`${OUT}/desktop`, { recursive: true });
mkdirSync(`${OUT}/mobile`, { recursive: true });

const PUBLIC = [
  ["home", "/uz"],
  ["how-it-works", "/uz/how-it-works"],
  ["products", "/uz/products"],
  ["locations", "/uz/locations"],
  ["business", "/uz/business"],
  ["about", "/uz/about"],
  ["privacy", "/uz/privacy"],
  ["terms", "/uz/terms"],
  ["404", "/uz/xyz"],
  ["fridge", "/uz/refrigerator/W0016188"],
  ["fridge-offline", "/uz/refrigerator/W0016193"],
  ["fridge-notfound", "/uz/refrigerator/nope"],
];
const ACCOUNT = [
  ["account-overview", "/uz/account"],
  ["account-profile", "/uz/account/profile"],
  ["account-cards", "/uz/account/cards"],
  ["account-purchases", "/uz/account/purchases"],
  ["account-purchase-detail", "/uz/account/purchases/P1024"],
  ["account-support", "/uz/account/support"],
  ["account-support-new", "/uz/account/support/new?purchase=P1024"],
  ["account-loyalty", "/uz/account/loyalty"],
  ["account-settings", "/uz/account/settings"],
  ["provider-test-payme", "/uz/provider-test/payme"],
];

const browser = await chromium.launch();
const problems = [];

async function settle(page, attempt = 0) {
  try {
    await settleOnce(page);
  } catch (e) {
    if (attempt > 2) throw e;
    await page.waitForTimeout(1500); // dev HMR reload mid-capture: try again
    return settle(page, attempt + 1);
  }
}

async function settleOnce(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1600);
  // scroll through so lazy/in-view effects run, then back to top
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

async function run(kind, viewport, mobile) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const logged = await browser.newContext({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  await logged.addInitScript(() => localStorage.setItem("hello.session", JSON.stringify({ phone: "944031611" })));

  for (const [name, path] of [...PUBLIC.map((p) => [...p, ctx]), ...ACCOUNT.map((p) => [...p, logged])].map(([n, p, c]) => [n, p, c])) {
    const c = ACCOUNT.some((a) => a[0] === name) ? logged : ctx;
    const page = await c.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message.slice(0, 200)));
    page.on("console", (m) => {
      if (m.type() === "error" && !/Failed to load resource|404/.test(m.text())) errs.push(m.text().slice(0, 200));
    });
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await settle(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) problems.push(`${kind} ${name}: horizontal overflow ${overflow}px`);
    if (errs.length) problems.push(`${kind} ${name}: console errors: ${errs.join(" | ")}`);
    await page.screenshot({ path: `${OUT}/${kind}/${name}.png`, fullPage: true });
    console.log(kind, name);
    await page.close();
  }

  // interactive account screens
  const page = await logged.newPage();
  await page.goto(BASE + "/uz/account/cards", { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.getByRole("button", { name: "Karta qo'shish" }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${kind}/account-cards-add-sheet.png` });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "O'chirish" }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${kind}/account-cards-remove-sheet.png` });
  await page.keyboard.press("Escape");

  await page.goto(BASE + "/uz/account/profile", { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.getByRole("button", { name: "Raqamni o'zgartirish" }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${kind}/account-profile-change-phone.png` });
  await page.keyboard.press("Escape");

  await page.goto(BASE + "/uz/account/settings", { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.getByRole("button", { name: "Hisobni o'chirish" }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${kind}/account-settings-delete-sheet.png` });
  await page.close();

  // fridge page: login sheet (anonymous) and every flow state (logged in)
  {
    const anon = await ctx.newPage();
    await anon.goto(BASE + "/uz/refrigerator/W0016188", { waitUntil: "domcontentloaded" });
    await settle(anon);
    await anon.getByRole("button", { name: "Eshikni ochish" }).click();
    await anon.waitForTimeout(600);
    await anon.screenshot({ path: `${OUT}/${kind}/fridge-state-login-sheet.png` });
    await anon.close();

    const fp = await logged.newPage();
    await fp.goto(BASE + "/uz/refrigerator/W0016188", { waitUntil: "domcontentloaded" });
    await settle(fp);
    await fp.screenshot({ path: `${OUT}/${kind}/fridge-state-idle.png` });
    await fp.getByRole("button", { name: "Eshikni ochish" }).click();
    await fp.waitForTimeout(700);
    await fp.screenshot({ path: `${OUT}/${kind}/fridge-state-unlocking.png` });
    await fp.waitForSelector("text=ESHIK OCHIQ", { timeout: 8000 });
    await fp.waitForTimeout(1300);
    await fp.screenshot({ path: `${OUT}/${kind}/fridge-state-door-open.png` });
    await fp.getByRole("button", { name: "Eshikni yopdim" }).click();
    await fp.waitForTimeout(700);
    await fp.screenshot({ path: `${OUT}/${kind}/fridge-state-processing.png` });
    await fp.waitForSelector("text=Jami", { timeout: 9000 });
    await fp.waitForTimeout(500);
    await fp.screenshot({ path: `${OUT}/${kind}/fridge-state-receipt.png` });
    for (const st of ["nothing_taken", "error"]) {
      await fp.goto(BASE + "/uz/refrigerator/W0016188", { waitUntil: "domcontentloaded" });
      await settle(fp);
      await fp.getByRole("button", { name: /^DEV/ }).click();
      await fp.getByRole("button", { name: st, exact: true }).click();
      await fp.waitForTimeout(400);
      await fp.screenshot({ path: `${OUT}/${kind}/fridge-state-${st.replace("_", "-")}.png` });
    }
    await fp.close();
  }

  if (!mobile) {
    const p = await logged.newPage();
    await p.goto(BASE + "/uz", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(1500);
    await p.getByRole("button", { name: "Hisob" }).click();
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/desktop/header-avatar-menu.png`, clip: { x: 0, y: 0, width: 1440, height: 420 } });
    await p.close();
  } else {
    const p = await logged.newPage();
    await p.goto(BASE + "/uz", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(1500);
    await p.getByRole("button", { name: "Menyu" }).click();
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/mobile/header-mobile-menu.png` });
    await p.close();
  }

  // locations interactions (desktop): list click flies the map, pin click scrolls the list
  if (!mobile) {
    const p = await ctx.newPage();
    await p.goto(BASE + "/uz/locations", { waitUntil: "domcontentloaded" });
    await settle(p);
    await p.locator("button[aria-label='Telekom ofisi']").first().click();
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUT}/desktop/locations-selected.png` });
    await p.close();
  } else {
    const p = await ctx.newPage();
    await p.goto(BASE + "/uz/locations", { waitUntil: "domcontentloaded" });
    await settle(p);
    await p.getByRole("button", { name: "Ro'yxat" }).click();
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${OUT}/mobile/locations-list-view.png` });
    await p.close();
  }

  await ctx.close();
  await logged.close();
}

await run("desktop", { width: 1440, height: 900 }, false);
await run("mobile", { width: 390, height: 844 }, true);

// 360px overflow sweep (smallest target width)
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => localStorage.setItem("hello.session", JSON.stringify({ phone: "944031611" })));
  for (const [name, path] of [...PUBLIC, ...ACCOUNT]) {
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await settle(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) problems.push(`360px ${name}: horizontal overflow ${overflow}px`);
    await page.close();
  }
  await ctx.close();
}

await browser.close();
console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nNo overflow / console problems found.");
