// Generates messages/uz-Cyrl.json from messages/uz.json (Uzbek Latin -> Cyrillic).
// Machine transliteration: have a native speaker review before launch.
import { readFileSync, writeFileSync } from "node:fs";

const PROTECT = ["Hello", "Payme", "Click", "Telegram", "WhatsApp", "Instagram", "QR", "SMS", "AI", "OSONVEND", "OOO", "24/7", "m²", "kg", "km"];
const DIGRAPHS = [["o'", "ў"], ["g'", "ғ"], ["sh", "ш"], ["ch", "ч"], ["yo", "ё"], ["yu", "ю"], ["ya", "я"], ["ye", "е"], ["ng", "нг"]];
const SINGLE = { c: "к", a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з" };

function word(w) {
  let out = "";
  for (let i = 0; i < w.length; ) {
    const lo = w.slice(i, i + 2).toLowerCase().replace(/[‘’ʻ`]/g, "'");
    if (lo === "yo" && /['’ʻ‘]/.test(w[i + 2] ?? "")) {
      out += w[i] === "y" ? "й" : "Й";
      i += 1;
      continue;
    }
    const hit = DIGRAPHS.find(([k]) => k === lo);
    if (hit) {
      let r = hit[1];
      if (w[i] !== w[i].toLowerCase()) r = r[0].toUpperCase() + r.slice(1);
      out += r;
      i += 2;
      continue;
    }
    const c = w[i];
    const l = c.toLowerCase();
    if (c === "'" || c === "’" || c === "ʻ") out += i > 0 && i < w.length - 1 ? "ъ" : "";
    else if (SINGLE[l]) {
      let r = SINGLE[l];
      if (l === "e" && i === 0) r = "э";
      out += c === l ? r : r.toUpperCase();
    } else out += c;
    i++;
  }
  return out;
}

function translit(s) {
  const keep = [];
  // protect ICU placeholders, brand words and numbers-with-units
  let t = s.replace(/\{[^}]+\}/g, (m) => (keep.push(m), `\u0000${keep.length - 1}\u0000`));
  for (const p of PROTECT) t = t.split(p).join((keep.push(p), `\u0000${keep.length - 1}\u0000`));
  t = t.replace(/[A-Za-z'’ʻ‘]+/g, (w) => word(w));
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[+i]);
}

function walk(v) {
  if (typeof v === "string") return translit(v);
  if (Array.isArray(v)) return v.map(walk);
  return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
}

const uz = JSON.parse(readFileSync("messages/uz.json", "utf8"));
writeFileSync("messages/uz-Cyrl.json", JSON.stringify(walk(uz), null, 2) + "\n", "utf8");
console.log("messages/uz-Cyrl.json written");
