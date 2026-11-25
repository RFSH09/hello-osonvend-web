// Lists keys that are missing (or extra) between the 4 message files, and keys used in code but absent.
// Usage: npm run i18n:check   (exits with code 1 when anything is missing)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["uz", "uz-Cyrl", "ru", "en"];
const load = (l) => JSON.parse(readFileSync(`messages/${l}.json`, "utf8"));

function flat(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

const keys = Object.fromEntries(LOCALES.map((l) => [l, new Set(flat(load(l)))]));
const all = new Set(LOCALES.flatMap((l) => [...keys[l]]));
let problems = 0;

for (const l of LOCALES) {
  const missing = [...all].filter((k) => !keys[l].has(k)).sort();
  if (missing.length) {
    problems += missing.length;
    console.log(`\n${l}: ${missing.length} missing key(s)\n  ` + missing.join("\n  "));
  }
}

// Empty strings count as missing too.
for (const l of LOCALES) {
  const empty = flat(load(l)).filter((k) => k.split(".").reduce((o, p) => o?.[p], load(l)) === "");
  if (empty.length) {
    problems += empty.length;
    console.log(`\n${l}: ${empty.length} empty value(s)\n  ` + empty.join("\n  "));
  }
}

// Static keys used in code (t("a.b") with a literal) that do not exist in uz.
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|ts)$/.test(f) ? [p] : [];
  });
}
const used = new Set();
for (const file of walk("src")) {
  const src = readFileSync(file, "utf8");
  // namespace per file when useTranslations("ns") / getTranslations("ns") is the only one
  const ns = [...src.matchAll(/(?:useTranslations|getTranslations)\(\s*"([^"]+)"\s*\)/g)].map((m) => m[1]);
  const hasRoot = /(?:useTranslations|getTranslations)\(\s*\)/.test(src);
  for (const m of src.matchAll(/\bt[a-z]?\(\s*"([A-Za-z0-9_.-]+)"/g)) {
    const k = m[1];
    if (hasRoot && keys.uz.has(k)) used.add(k);
    else if (ns.length === 1) used.add(`${ns[0]}.${k}`);
    else if (hasRoot) used.add(k);
  }
}
const undefinedKeys = [...used].filter((k) => !keys.uz.has(k) && ![...keys.uz].some((x) => x.startsWith(`${k}.`))).sort();
if (undefinedKeys.length) {
  console.log(`\nused in code but not in messages/uz.json (check manually, some may belong to another namespace):\n  ` + undefinedKeys.join("\n  "));
}

console.log(problems ? `\n${problems} problem(s).` : "\nAll 4 message files have the same keys.");
process.exit(problems ? 1 : 0);
