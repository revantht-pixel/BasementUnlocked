/** Full-bleed night mountains and stars for hero sections. Decorative only. */
export default function Mountains() {
  return (
    <svg
      viewBox="0 0 1280 860"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1D20" stopOpacity="0" />
          <stop offset="0.35" stopColor="#071619" />
          <stop offset="1" stopColor="#061416" />
        </linearGradient>
      </defs>
      <g fill="#E8F4F2">
        <circle cx="640" cy="90" r="1" opacity="0.35" />
        <circle cx="702" cy="160" r="0.8" opacity="0.3" />
        <circle cx="760" cy="70" r="1.2" opacity="0.45" />
        <circle cx="840" cy="130" r="0.9" opacity="0.3" />
        <circle cx="905" cy="56" r="1" opacity="0.4" />
        <circle cx="968" cy="190" r="0.8" opacity="0.25" />
        <circle cx="1030" cy="104" r="1.1" opacity="0.4" />
        <circle cx="1096" cy="48" r="0.9" opacity="0.3" />
        <circle cx="1150" cy="150" r="1" opacity="0.35" />
        <circle cx="1214" cy="88" r="1.2" opacity="0.45" />
        <circle cx="120" cy="60" r="0.9" opacity="0.3" />
        <circle cx="300" cy="120" r="0.8" opacity="0.25" />
        <circle cx="470" cy="44" r="1" opacity="0.35" />
      </g>
      <path d="M0 470 L120 400 L210 440 L330 340 L420 390 L540 300 L640 370 L760 280 L880 360 L1000 290 L1120 370 L1280 320 V860 H0 Z" fill="#0B1D20" />
      <path d="M0 540 L160 470 L300 510 L460 440 L600 490 L760 420 L900 480 L1060 430 L1180 470 L1280 450 V860 H0 Z" fill="#0F2428" />
      <path d="M0 610 L220 570 L420 595 L640 560 L860 590 L1080 565 L1280 585 V860 H0 Z" fill="#14292E" />
      <rect x="0" y="600" width="1280" height="260" fill="url(#groundFade)" />
    </svg>
  );
}
