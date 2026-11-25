/** Four small illustrations for the "how it works" steps. */
export type StepKind = "scan" | "login" | "take" | "pay";

export function StepArt({ kind, className }: { kind: StepKind; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden focusable="false">
      <rect width="160" height="120" rx="20" fill="#E8F8EE" />
      {kind === "scan" && (
        <g>
          <rect x="52" y="14" width="56" height="92" rx="10" fill="#0F1E3D" />
          <rect x="57" y="24" width="46" height="72" rx="5" fill="#fff" />
          <rect x="66" y="40" width="28" height="28" fill="#0F1E3D" />
          <rect x="71" y="45" width="8" height="8" fill="#fff" />
          <rect x="83" y="57" width="6" height="6" fill="#fff" />
          <rect x="60" y="53" width="40" height="2.5" fill="#22C55E" />
          <path d="M28 34v-8h8M132 34v-8h-8M28 86v8h8M132 86v8h-8" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}
      {kind === "login" && (
        <g>
          <rect x="52" y="14" width="56" height="92" rx="10" fill="#0F1E3D" />
          <rect x="57" y="24" width="46" height="72" rx="5" fill="#fff" />
          <text x="80" y="42" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0F1E3D">+998</text>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={67 + c * 13} cy={55 + r * 11} r="4" fill="#E3E8F0" />),
          )}
          <rect x="62" y="86" width="36" height="7" rx="3.5" fill="#22C55E" />
        </g>
      )}
      {kind === "take" && (
        <g>
          <rect x="42" y="10" width="76" height="100" rx="10" fill="#0F1E3D" />
          <path d="M118 10l22 10v84l-22 6z" fill="#22C55E" />
          <rect x="48" y="20" width="64" height="82" rx="4" fill="#DCE6F5" />
          <rect x="56" y="30" width="12" height="26" rx="4" fill="#EF4444" />
          <rect x="74" y="34" width="12" height="22" rx="4" fill="#F59E0B" />
          <rect x="92" y="36" width="14" height="20" rx="3" fill="#1D4ED8" />
          <rect x="56" y="64" width="18" height="12" rx="3" fill="#7C2D12" />
          <rect x="80" y="64" width="24" height="12" rx="3" fill="#FDE047" />
          <rect x="48" y="58" width="64" height="3" fill="#B7C5DC" />
        </g>
      )}
      {kind === "pay" && (
        <g>
          <path d="M48 16h64v90l-8-5-8 5-8-5-8 5-8-5-8 5-8-5-8 5z" fill="#fff" stroke="#0F1E3D" strokeWidth="3" />
          <rect x="58" y="28" width="44" height="4" rx="2" fill="#0F1E3D" />
          <rect x="58" y="40" width="30" height="4" rx="2" fill="#B7C5DC" />
          <rect x="58" y="50" width="36" height="4" rx="2" fill="#B7C5DC" />
          <circle cx="104" cy="82" r="14" fill="#22C55E" />
          <path d="M97 82l5 5 9-10" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}
