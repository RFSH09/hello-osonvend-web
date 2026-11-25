// Takes review screenshots against a running dev server: node scripts/shots.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const out = "docs/screenshots";
const browser = await chromium.launch();

async function shot(page, name, full = true) {
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full });
  console.log("saved", name);
}

// Desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const [name, path] of [["home-desktop", "/uz"], ["business-desktop", "/uz/business"], ["products-desktop", "/uz/products"], ["locations-desktop", "/uz/locations"], ["how-desktop", "/uz/how-it-works"], ["about-desktop", "/uz/about"], ["notfound-desktop", "/uz/xyz"]]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    if (name === "home-desktop") await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 1800)); });
    await shot(page, name);
  }
  await ctx.close();
}

// Mobile 360px
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/uz", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await shot(page, "home-mobile");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log("home horizontal overflow px:", overflow);

  await page.goto(BASE + "/uz/refrigerator/W0016188", { waitUntil: "networkidle" });
  await shot(page, "fridge-idle", false);
  await shot(page, "fridge-idle-full");
  // real flow: tap open -> login sheet
  await page.getByRole("button", { name: "Eshikni ochish" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/fridge-login-phone.png` });
  await page.getByPlaceholder("90 123 45 67").fill("944031611");
  await page.getByRole("button", { name: "Kod yuborish" }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/fridge-login-code.png` });
  await page.keyboard.type("123456");
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/fridge-state-unlocking.png` });
  await page.waitForSelector("text=ESHIK OCHIQ", { timeout: 6000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/fridge-state-door_open.png` });
  await page.getByRole("button", { name: "Eshikni yopdim" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/fridge-state-processing.png` });
  await page.waitForSelector("text=Jami", { timeout: 8000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/fridge-state-receipt.png`, fullPage: false });

  // dev panel jumps for the other states
  for (const st of ["nothing_taken", "error"]) {
    await page.goto(BASE + "/uz/refrigerator/W0016188", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^DEV/ }).click();
    await page.getByRole("button", { name: st, exact: true }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/fridge-state-${st}.png` });
  }
  await page.goto(BASE + "/uz/refrigerator/W0016193", { waitUntil: "networkidle" });
  await shot(page, "fridge-offline", false);
  await page.goto(BASE + "/uz/refrigerator/nope", { waitUntil: "networkidle" });
  await shot(page, "fridge-notfound", false);
  for (const p of ["/uz/business", "/uz/products", "/uz/locations", "/uz/how-it-works", "/uz/about"]) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    console.log(p, "overflow px:", await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
  }
  await ctx.close();
}
await browser.close();
