/* Generated from assets/house-cutaway.svg, with props for the live states. Edit props, not the paths. */
import { css } from "@/lib/css";

export type CalloutStatus = "met" | "not_met" | "unknown" | "not_applicable";
export type Callout = { n: number; status: CalloutStatus };

const POS: Record<number, [number, number, number, number]> = {
  1: [60, 250, 147, 311],
  2: [930, 330, 760, 395],
  3: [690, 120, 600, 268],
  4: [36, 560, 252.8, 523.4],
  5: [930, 250, 601, 366],
  6: [40, 500, 150, 455],
  7: [40, 400, 330, 430],
  8: [840, 200, 780, 297],
  9: [470, 702, 409, 560],
};

function markStyle(status: CalloutStatus) {
  if (status === "met") return { fill: "#6EE7C8", stroke: "#6EE7C8", text: "#052520", dash: undefined, glow: 0.5 };
  if (status === "unknown") return { fill: "#0A1D20", stroke: "#9DB4D8", text: "#9DB4D8", dash: undefined, glow: 0 };
  if (status === "not_met") return { fill: "#0A1D20", stroke: "#FF7A6B", text: "#FF7A6B", dash: "4 3", glow: 0 };
  return { fill: "#0A1D20", stroke: "rgba(255,255,255,0.25)", text: "#86A09D", dash: undefined, glow: 0 };
}

export type HouseSceneProps = {
  label: string;
  /** 0 = basement fully lit, 1 = dark. */
  dim?: number;
  /** Moonlight hatch over the basement for checks that need the city, 0 to 1. */
  hatch?: number;
  /** Coral dashed outline when something needs attention, 0 or 1. */
  alert?: number;
  /** Light spill on the lawn and under the slab, 0 to 1. */
  spill?: number;
  /** Person in the main-floor window, 0 to 1. */
  person?: number;
  /** Car on the driveway, 0 to 1. */
  car?: number;
  callouts?: Callout[];
  /** Mountains and stars behind the house. */
  backdrop?: boolean;
  showDimension?: boolean;
  /** Hero mode: the basement lights switch on after a beat (CSS animation). */
  animate?: boolean;
  lotLabel?: string;
};

export default function HouseScene({
  label,
  dim = 0,
  hatch = 0,
  alert = 0,
  spill = 1,
  person = 1,
  car = 1,
  callouts,
  backdrop = true,
  showDimension = true,
  animate = false,
  lotLabel = "Lot [0.00] acres",
}: HouseSceneProps) {
  return (
    <svg viewBox="0 0 980 740" width="100%" role="img" aria-label={label} style={{ display: "block" }}>
      <defs>
<filter id="bl28" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="28" /></filter>
<filter id="bl12" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12" /></filter>
<filter id="bl5" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" /></filter>
<linearGradient id="grass" gradientUnits="userSpaceOnUse" x1="420" y1="170" x2="508" y2="566"><stop offset="0" stopColor="#173028" /><stop offset="1" stopColor="#0E211D" /></linearGradient>
<linearGradient id="soilL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2B1E" /><stop offset="0.55" stopColor="#1F160F" /><stop offset="1" stopColor="#0D0907" /></linearGradient>
<linearGradient id="soilR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52402D" /><stop offset="0.55" stopColor="#2B1F15" /><stop offset="1" stopColor="#120D09" /></linearGradient>
<radialGradient id="roomGlow" cx="0.5" cy="0.62" r="0.78"><stop offset="0" stopColor="#FFDC90" /><stop offset="0.5" stopColor="#F9A941" /><stop offset="1" stopColor="#A8581B" /></radialGradient>
<linearGradient id="ceilShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A0C03" stopOpacity="0.75" /><stop offset="1" stopColor="#1A0C03" stopOpacity="0" /></linearGradient>
<linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1A0C03" stopOpacity="0.6" /><stop offset="0.12" stopColor="#1A0C03" stopOpacity="0" /><stop offset="0.88" stopColor="#1A0C03" stopOpacity="0" /><stop offset="1" stopColor="#1A0C03" stopOpacity="0.6" /></linearGradient>
<radialGradient id="lampGlow"><stop offset="0" stopColor="#FFF0C2" stopOpacity="0.95" /><stop offset="0.4" stopColor="#FFD27A" stopOpacity="0.45" /><stop offset="1" stopColor="#FFB547" stopOpacity="0" /></radialGradient>
<linearGradient id="wallR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3E5C64" /><stop offset="1" stopColor="#1D3238" /></linearGradient>
<linearGradient id="wallL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#274047" /><stop offset="1" stopColor="#15262B" /></linearGradient>
<linearGradient id="roof" gradientUnits="userSpaceOnUse" x1="420" y1="110" x2="420" y2="392"><stop offset="0" stopColor="#33505A" /><stop offset="1" stopColor="#162A30" /></linearGradient>
<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD98A" /><stop offset="1" stopColor="#E8963A" /></linearGradient>
<linearGradient id="nightWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2C4572" /><stop offset="1" stopColor="#0F182B" /></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5E8A92" /><stop offset="1" stopColor="#1C343B" /></linearGradient>
        <filter id="dotglow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" /></filter>
        <pattern id="moonP" width="0.14" height="0.14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="0.14" height="0.14" fill="#0A1D20" fillOpacity="0.55" />
          <path d="M0 0 V0.14" stroke="#9DB4D8" style={{ strokeWidth: 0.028 }} />
        </pattern>
      </defs>
      {backdrop && (
        <>
<g fill="#E8F4F2"><circle cx="90" cy="60" r="1" opacity="0.3" /><circle cx="210" cy="120" r="0.8" opacity="0.25" /><circle cx="330" cy="46" r="1.1" opacity="0.4" /><circle cx="560" cy="70" r="0.9" opacity="0.3" /><circle cx="780" cy="40" r="1.2" opacity="0.45" /><circle cx="880" cy="110" r="0.8" opacity="0.25" /><circle cx="940" cy="60" r="1" opacity="0.35" /></g>
<path d="M0 340 L110 280 L215 318 L330 226 L430 276 L545 200 L660 262 L780 190 L890 252 L980 222 V740 H0 Z" fill="#0B1D20" /><path d="M0 430 L150 380 L300 408 L460 356 L610 398 L770 352 L900 392 L980 372 V740 H0 Z" fill="#0E2226" />
        </>
      )}
<g id="scene">
<g id="spill" className={animate ? "spillAnim" : "seg"} opacity={spill}>
<polygon points="112,383.3 464,559.3 464,646 112,470" fill="#FFB547" opacity="0.5" filter="url(#bl28)" />
<ellipse cx="288" cy="598" rx="250" ry="24" transform="rotate(26.57 288 598)" fill="#FFB547" opacity="0.3" filter="url(#bl12)" />
</g>
<g id="earth">
<g transform="matrix(-44 22 0 -34 860 390)">
<rect x="0" y="-3.4" width="8" height="3.4" fill="url(#soilR)" />
<path d="M0 -0.9 C1.5 -1.0 3 -0.8 4.5 -0.92 S7 -1.0 8 -0.85 M0 -1.7 C2 -1.6 3.5 -1.8 5 -1.68 S7.5 -1.7 8 -1.75 M0 -2.5 C2 -2.6 4 -2.4 6 -2.52 S7.6 -2.5 8 -2.45" fill="none" stroke="#FFFFFF" opacity="0.06" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="0" y="-3.4" width="8" height="0.26" fill="#FFFFFF" opacity="0.04" />
<ellipse cx="0.7" cy="-1.3" rx="0.1" ry="0.07" fill="#FFFFFF" opacity="0.1" /><ellipse cx="2.6" cy="-2.1" rx="0.12" ry="0.08" fill="#FFFFFF" opacity="0.08" /><ellipse cx="5.4" cy="-1.1" rx="0.08" ry="0.06" fill="#FFFFFF" opacity="0.1" /><ellipse cx="6.8" cy="-2.7" rx="0.1" ry="0.07" fill="#FFFFFF" opacity="0.08" /><ellipse cx="3.9" cy="-2.9" rx="0.09" ry="0.06" fill="#FFFFFF" opacity="0.07" />
<path d="M1.2 0 C1.15 -0.25 1.3 -0.45 1.22 -0.7 M4.4 0 C4.45 -0.3 4.3 -0.5 4.38 -0.85 M6.6 0 C6.55 -0.2 6.7 -0.4 6.62 -0.6" fill="none" stroke="#6B4E33" opacity="0.7" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1.2")} />
</g>
<g transform="matrix(44 22 0 -34 68 346)">
<rect x="0" y="-3.4" width="10" height="3.4" fill="url(#soilL)" />
<path d="M0 -0.9 C2 -1.0 4 -0.75 6 -0.9 S9 -1.0 10 -0.85 M0 -1.6 C2.5 -1.5 4 -1.75 6.5 -1.6 S9 -1.55 10 -1.7 M0 -2.4 C2 -2.5 5 -2.3 7 -2.45 S9.5 -2.4 10 -2.35" fill="none" stroke="#FFFFFF" opacity="0.05" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="0" y="-3.4" width="10" height="0.26" fill="#FFFFFF" opacity="0.03" />
<ellipse cx="0.45" cy="-1.2" rx="0.09" ry="0.07" fill="#FFFFFF" opacity="0.09" /><ellipse cx="9.5" cy="-2.0" rx="0.1" ry="0.07" fill="#FFFFFF" opacity="0.09" /><ellipse cx="9.3" cy="-0.7" rx="0.07" ry="0.05" fill="#FFFFFF" opacity="0.1" /><ellipse cx="0.4" cy="-2.8" rx="0.08" ry="0.06" fill="#FFFFFF" opacity="0.08" /><ellipse cx="5" cy="-3.25" rx="0.1" ry="0.06" fill="#FFFFFF" opacity="0.07" />
<path d="M0.3 0 C0.28 -0.3 0.4 -0.5 0.34 -0.8 M9.6 0 C9.62 -0.25 9.5 -0.45 9.56 -0.7" fill="none" stroke="#6B4E33" opacity="0.7" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1.2")} />
</g>
<polygon points="420,170 860,390 508,566 68,346" fill="url(#grass)" />
<g opacity="0.05" fill="#FFFFFF">
<polygon points="420,170 475,197.5 123,373.5 68,346" />
<polygon points="530,225 585,252.5 233,428.5 178,401" />
<polygon points="640,280 695,307.5 343,483.5 288,456" />
<polygon points="750,335 805,362.5 453,538.5 398,511" />
</g>
<polygon points="332,390 490.4,469.2 433.2,497.8 274.8,418.6" fill="#FFB547" opacity="0.17" filter="url(#bl12)" />
<polygon points="644.4,409.8 556.4,453.8 618,484.6 706,440.6" fill="#FFB547" opacity="0.14" filter="url(#bl12)" />
<polyline points="68,346 508,566 860,390" fill="none" stroke="#5FA99A" opacity="0.35" style={css("stroke-width: 1.5")} />
<polyline points="508,566 508,681.6" fill="none" stroke="#000000" opacity="0.35" style={css("stroke-width: 1.5")} />
</g>
<g id="section">
<g transform="matrix(44 22 0 -34 68 346)">
<rect x="0.78" y="-3.18" width="8.44" height="2.9" fill="#0A0705" />
<rect x="1" y="-3" width="8" height="2.55" fill="url(#roomGlow)" />
<path d="M1 -1.9 H9 M1 -2.25 H9" fill="none" stroke="#FFFFFF" opacity="0.1" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="1" y="-3" width="8" height="0.12" fill="#4A2C14" />
<rect x="1" y="-0.58" width="8" height="0.13" fill="#5A3517" />
<polygon points="2.75,-2.88 2.75,-2.62 2.45,-2.62 2.45,-2.36 2.15,-2.36 2.15,-2.1 1.85,-2.1 1.85,-1.84 1.55,-1.84 1.55,-1.58 1.25,-1.58 1.25,-1.32 1,-1.32 1,-2.88" fill="#4A2A12" opacity="0.94" />
<path d="M2.6 -2.0 L1.0 -0.75" fill="none" stroke="#2B1608" vectorEffect="non-scaling-stroke" style={css("stroke-width: 2; stroke-linecap: round")} />
<rect x="3.6" y="-1.55" width="1.1" height="0.6" fill="#6B4423" />
<rect x="3.66" y="-1.49" width="0.98" height="0.48" fill="#1F2B46" />
<polygon points="3.66,-1.49 3.95,-1.1 4.1,-1.28 4.3,-1.05 4.64,-1.49" fill="#0C1322" />
<circle cx="4.5" cy="-1.14" r="0.05" fill="#E8EEF8" opacity="0.9" />
<rect x="3.02" y="-2.88" width="0.14" height="1.0" fill="#5B3A1E" />
<rect x="3.1" y="-2.88" width="2.3" height="0.28" fill="#6B4423" />
<rect x="3.15" y="-2.6" width="2.2" height="0.3" fill="#F1DFC0" />
<rect x="3.95" y="-2.6" width="1.4" height="0.34" fill="#3F6E78" />
<rect x="3.2" y="-2.42" width="0.6" height="0.2" fill="#FFF2D8" />
<rect x="5.5" y="-2.88" width="0.5" height="0.55" fill="#6B4423" />
<path d="M5.5 -2.6 H6.0" fill="none" stroke="#2B1608" opacity="0.6" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="5.68" y="-2.33" width="0.14" height="0.12" fill="#3A2210" />
<circle cx="5.75" cy="-2.0" r="0.6" fill="url(#lampGlow)" />
<polygon points="5.6,-2.21 5.9,-2.21 5.84,-1.88 5.66,-1.88" fill="#FFE5A8" />
<path d="M4.2 -0.45 V-0.95" fill="none" stroke="#3A2210" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<circle cx="4.2" cy="-1.1" r="0.55" fill="url(#lampGlow)" opacity="0.9" />
<polygon points="3.92,-1.05 4.48,-1.05 4.38,-0.88 4.02,-0.88" fill="#FFE5A8" />
<rect x="6.3" y="-2.88" width="1.95" height="0.88" fill="#5A3A22" />
<path d="M6.95 -2.88 V-2.0 M7.6 -2.88 V-2.0" fill="none" stroke="#2B1608" opacity="0.7" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="6.88" y="-2.5" width="0.04" height="0.18" fill="#E2D2B0" /><rect x="7.64" y="-2.5" width="0.04" height="0.18" fill="#E2D2B0" />
<rect x="6.25" y="-2.0" width="2.05" height="0.08" fill="#E2D2B0" />
<path d="M6.8 -2.0 V-1.66 H6.95" fill="none" stroke="#C9CED2" vectorEffect="non-scaling-stroke" style={css("stroke-width: 2; stroke-linecap: round")} />
<rect x="6.3" y="-1.05" width="0.8" height="0.5" fill="#5A3A22" />
<rect x="7.26" y="-1.74" width="0.98" height="0.93" fill="#3A2210" />
<rect x="7.3" y="-1.7" width="0.9" height="0.85" fill="url(#nightWin)" />
<circle cx="7.95" cy="-1.12" r="0.06" fill="#CFE0F5" />
<rect x="7.73" y="-1.7" width="0.04" height="0.85" fill="#3A2210" />
<rect x="7.3" y="-1.3" width="0.9" height="0.04" fill="#3A2210" />
<rect x="6.4" y="-1.92" width="0.16" height="0.14" fill="#B5653A" />
<polygon points="6.48,-1.78 6.35,-1.5 6.5,-1.62" fill="#4F8F5B" />
<polygon points="6.48,-1.78 6.62,-1.48 6.55,-1.64" fill="#3F7A4B" />
<rect x="7.0" y="-1.92" width="0.1" height="0.1" fill="#F1DFC0" />
<rect x="8.3" y="-2.88" width="0.55" height="1.75" fill="#CFC6B4" />
<path d="M8.3 -2.0 H8.85" fill="none" stroke="#7A6E5A" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="8.4" y="-2.1" width="0.04" height="0.36" fill="#8C8270" />
<rect x="1" y="-3" width="8" height="2.55" fill="url(#ceilShade)" />
<rect x="1" y="-3" width="8" height="2.55" fill="url(#sideShade)" />
</g>
</g>
<g transform="matrix(44 22 0 -34 68 346)">
<rect className={animate ? "dimmer" : "seg"} x="1" y="-3" width="8" height="2.55" fill="#0A0705" opacity={dim} />
<rect  className="seg" x="1" y="-3" width="8" height="2.55" fill="url(#moonP)" opacity={hatch} />
<rect  className="seg" x="0.9" y="-3.1" width="8.2" height="2.75" fill="none" stroke="#FF7A6B" opacity={alert} vectorEffect="non-scaling-stroke" style={css("stroke-width: 2; stroke-dasharray: 7 5")} />
</g>
<g id="outdoor">
<polygon points="340.8,394.4 428.8,438.4 340.8,482.4 252.8,438.4" fill="#1B2C30" />
<polyline points="340.8,394.4 428.8,438.4 340.8,482.4 252.8,438.4 340.8,394.4" fill="none" stroke="#FFFFFF" opacity="0.05" style={css("stroke-width: 1")} />
<g transform="matrix(44 22 0 -34 103.2 328.4)">
<rect x="0.45" y="0" width="0.08" height="1.15" fill="#243A40" />
<rect x="0.1" y="0.85" width="1.7" height="0.6" fill="#15564B" />
<rect x="0.1" y="0.85" width="1.7" height="0.6" fill="none" stroke="#DDE6E0" opacity="0.8" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} />
<rect x="0.25" y="1.22" width="1.4" height="0.07" fill="#DDE6E0" opacity="0.85" />
<rect x="0.25" y="1.02" width="1.0" height="0.07" fill="#DDE6E0" opacity="0.85" />
</g>
<g id="treesBack">
<g transform="translate(772 390)"><rect x="-4" y="-14" width="8" height="14" fill="#061210" /><polygon points="-34,-10 34,-10 0,-72" fill="#0A1D1C" /><polygon points="-28,-46 28,-46 0,-102" fill="#0C2423" /><polygon points="-20,-82 20,-82 0,-128" fill="#0F2A29" /></g>
<g transform="translate(420 214)"><rect x="-4" y="-14" width="8" height="14" fill="#061210" /><polygon points="-30,-10 30,-10 0,-66" fill="#0A1D1C" /><polygon points="-24,-42 24,-42 0,-92" fill="#0C2423" /><polygon points="-17,-74 17,-74 0,-114" fill="#0F2A29" /></g>
</g>
<g id="car"  className="seg" opacity={car}>
<ellipse cx="333" cy="452" rx="64" ry="18" fill="#000000" opacity="0.35" filter="url(#bl5)" />
<polygon points="345.2,398.9 389.2,420.9 327.6,451.7 283.6,429.7" fill="#2E4A52" />
<polygon points="389.2,436.2 327.6,467 327.6,451.7 389.2,420.9" fill="#1D3138" />
<polygon points="283.6,445 327.6,467 327.6,451.7 283.6,429.7" fill="#13232A" />
<polygon points="329.8,395.2 369.4,415.0 338.6,430.4 299,410.6" fill="#3A5A63" />
<polygon points="369.4,428.6 338.6,444.0 338.6,430.4 369.4,415.0" fill="url(#glass)" />
<polygon points="299,424.2 338.6,444.0 338.6,430.4 299,410.6" fill="url(#glass)" />
<g transform="matrix(44 22 0 -34 76.8 341.6)"><rect x="4.78" y="0.14" width="0.2" height="0.12" fill="#FFEAB5" /><rect x="5.42" y="0.14" width="0.2" height="0.12" fill="#FFEAB5" /><ellipse cx="4.88" cy="0.2" rx="0.3" ry="0.2" fill="url(#lampGlow)" opacity="0.7" /><ellipse cx="5.52" cy="0.2" rx="0.3" ry="0.2" fill="url(#lampGlow)" opacity="0.7" /></g>
<g transform="matrix(-44 22 0 -34 670.8 295.4)"><circle cx="6.75" cy="0.12" r="0.14" fill="#080B10" /><circle cx="7.45" cy="0.12" r="0.14" fill="#080B10" /><circle cx="6.75" cy="0.12" r="0.06" fill="#5C6672" /><circle cx="7.45" cy="0.12" r="0.06" fill="#5C6672" /></g>
</g>
</g>
<g id="house">
<polygon points="684,390 508,478 508,369.2 684,281.2" fill="url(#wallR)" />
<polygon points="684,281.2 508,369.2 596,250.4" fill="url(#wallR)" />
<polygon points="244,346 508,478 508,369.2 244,237.2" fill="url(#wallL)" />
<g transform="matrix(-44 22 0 -34 772 346)" fill="none" stroke="#FFFFFF" opacity="0.05" vectorEffect="non-scaling-stroke"><path d="M2 .4H6M2 .8H6M2 1.2H6M2 1.6H6M2 2.0H6M2 2.4H6M2 2.8H6" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} /></g>
<g transform="matrix(44 22 0 -34 156 302)" fill="none" stroke="#FFFFFF" opacity="0.045"><path d="M2 .4H8M2 .8H8M2 1.2H8M2 1.6H8M2 2.0H8M2 2.4H8M2 2.8H8" vectorEffect="non-scaling-stroke" style={css("stroke-width: 1")} /></g>
<g filter="url(#bl12)" opacity="0.55">
<g transform="matrix(44 22 0 -34 156 302)"><rect x="4.2" y="1.0" width="1.4" height="1.4" fill="#FFC15E" /><rect x="6.2" y="1.0" width="1.4" height="1.4" fill="#FFC15E" /><rect x="2.68" y="0.1" width="0.74" height="2.1" fill="#FFC15E" /></g>
<g transform="matrix(-44 22 0 -34 772 346)"><rect x="2.9" y="1.0" width="2.0" height="1.4" fill="#FFC15E" /></g>
</g>
<g transform="matrix(44 22 0 -34 156 302)">
<rect x="2.6" y="0" width="0.9" height="2.3" fill="#1B120B" />
<rect x="2.68" y="0.1" width="0.74" height="2.1" fill="url(#win)" opacity="0.7" />
<circle cx="3.36" cy="1.1" r="0.04" fill="#F4D28A" />
<rect x="4.2" y="1.0" width="1.4" height="1.4" fill="url(#win)" /><rect x="4.88" y="1.0" width="0.04" height="1.4" fill="#1A1209" /><rect x="4.2" y="1.68" width="1.4" height="0.04" fill="#1A1209" /><rect x="4.1" y="0.92" width="1.6" height="0.08" fill="#1A1209" />
<rect x="6.2" y="1.0" width="1.4" height="1.4" fill="url(#win)" /><rect x="6.88" y="1.0" width="0.04" height="1.4" fill="#1A1209" /><rect x="6.2" y="1.68" width="1.4" height="0.04" fill="#1A1209" /><rect x="6.1" y="0.92" width="1.6" height="0.08" fill="#1A1209" />
</g>
<g transform="matrix(-44 22 0 -34 772 346)">
<rect x="2.9" y="1.0" width="2.0" height="1.4" fill="url(#win)" />
<g  className="seg" opacity={person}><circle cx="3.9" cy="1.98" r="0.2" fill="#3A2210" opacity="0.88" />
<path d="M3.5 1.0 C3.5 1.45 3.68 1.72 3.9 1.74 C4.12 1.72 4.3 1.45 4.3 1.0 Z" fill="#3A2210" opacity="0.88" /></g>
<rect x="2.8" y="0.92" width="2.2" height="0.08" fill="#1A1209" />
<circle cx="4" cy="3.9" r="0.3" fill="url(#win)" />
</g>
<polygon points="217.6,250.1 499.2,390.9 604.8,253.1 323.2,112.3" fill="url(#roof)" />
<g fill="none" stroke="#0A0D12" opacity="0.4" style={css("stroke-width: 1.2")}>
<line x1="238.7" y1="222.5" x2="520.3" y2="363.3" /><line x1="259.8" y1="194.9" x2="541.4" y2="335.8" /><line x1="281" y1="167.4" x2="562.6" y2="308.2" /><line x1="302.1" y1="139.8" x2="583.7" y2="280.7" />
</g>
<polyline points="217.6,250.1 323.2,112.3 604.8,253.1" fill="none" stroke="#7FA3AB" opacity="0.55" style={css("stroke-width: 1.5; stroke-linejoin: round")} />
<polyline points="217.6,250.1 499.2,390.9" fill="none" stroke="#0A0D12" opacity="0.6" style={css("stroke-width: 3")} />
<polyline points="499.2,390.9 604.8,253.1" fill="none" stroke="#5F8890" opacity="0.45" style={css("stroke-width: 1.5")} />
</g>
<g id="front">
{showDimension && (
<>
<g id="dim" opacity="0.9">
<line x1="472.8" y1="143.6" x2="912.8" y2="363.6" stroke="#86A09D" style={css("stroke-width: 1")} />
<line x1="455.2" y1="152.4" x2="490.4" y2="134.8" stroke="#86A09D" style={css("stroke-width: 1")} />
<line x1="895.2" y1="372.4" x2="930.4" y2="354.8" stroke="#86A09D" style={css("stroke-width: 1")} />
<line x1="466" y1="153" x2="480" y2="134" stroke="#86A09D" style={css("stroke-width: 1")} />
<text transform="translate(692.8 253.6) rotate(26.57)" x="0" y="-9" textAnchor="middle" fill="#86A09D" style={css("font-family: Manrope, sans-serif; font-size: 14px")}>{lotLabel}</text>
</g>
</>
)}
<g transform="translate(538.8 515.4)"><rect x="-4" y="-14" width="8" height="14" fill="#061210" /><polygon points="-34,-10 34,-10 0,-72" fill="#0A1D1C" /><polygon points="-28,-46 28,-46 0,-102" fill="#0C2423" /><polygon points="-20,-82 20,-82 0,-128" fill="#0F2A29" /></g>
</g>
</g>

      {callouts && (
        <g>
          <g stroke="#86A09D" style={{ strokeWidth: 1 }} opacity={0.8}>
            {callouts.map((c) => (
              <line key={c.n} x1={POS[c.n][0]} y1={POS[c.n][1]} x2={POS[c.n][2]} y2={POS[c.n][3]} />
            ))}
          </g>
          {callouts.map((c) => {
            const [cx, cy] = POS[c.n];
            const m = markStyle(c.status);
            return (
              <g key={c.n}>
                {m.glow > 0 && <circle cx={cx} cy={cy} r={15} fill="#6EE7C8" opacity={m.glow} filter="url(#dotglow)" />}
                <circle cx={cx} cy={cy} r={15} fill={m.fill} stroke={m.stroke} style={{ strokeWidth: m.dash ? 2 : 1.5, strokeDasharray: m.dash }} />
                <text x={cx} y={cy + 5} textAnchor="middle" fill={m.text} style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, fontWeight: 700 }}>
                  {c.n}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
