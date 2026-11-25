/** Keep only the 9 national digits of an Uzbek number (strips +998 / 998 prefix). */
export function nationalDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  return d.slice(0, 9);
}

/** "901234567" -> "90 123 45 67" (mask shown after the fixed +998 prefix). */
export function formatNational(digits: string): string {
  const d = digits.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  return parts.filter(Boolean).join(" ");
}

export function isCompletePhone(digits: string): boolean {
  return digits.length === 9;
}

export function toDisplayPhone(digits: string): string {
  return `+998 ${formatNational(digits)}`;
}
