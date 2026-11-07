import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { css } from "@/lib/css";
import type { CheckStatus, Provenance } from "@/lib/types";

const ARROW = (stroke: string) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 12 L12 4 M6 4 H12 V10" fill="none" stroke={stroke} style={{ strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }} />
  </svg>
);

const BTN_BASE = "display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 8px 0 24px; border-radius: 999px; font-weight: 600; font-size: 16px; text-decoration: none; white-space: nowrap; cursor: pointer; font-family: inherit;";
const PRIMARY = BTN_BASE + " background: #6EE7C8; color: #052520; border: 0; box-shadow: 0 0 32px rgba(110,231,200,0.22);";
const SECONDARY = BTN_BASE + " background: rgba(255,255,255,0.05); color: #E8F4F2; border: 1px solid rgba(255,255,255,0.12);";

function IconCircle({ variant }: { variant: "primary" | "secondary" }) {
  return (
    <span
      className="btn-ic"
      style={css(
        `width: 40px; height: 40px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: ${variant === "primary" ? "rgba(5,37,32,0.14)" : "rgba(255,255,255,0.08)"}`,
      )}
    >
      {ARROW(variant === "primary" ? "#052520" : "#E8F4F2")}
    </span>
  );
}

/** Pill link with a nested arrow circle. */
export function LinkBtn({ href, variant = "primary", children, style }: { href: string; variant?: "primary" | "secondary"; children: ReactNode; style?: CSSProperties }) {
  return (
    <Link href={href} className="btn" style={{ ...css(variant === "primary" ? PRIMARY : SECONDARY), ...style }}>
      {children}
      <IconCircle variant={variant} />
    </Link>
  );
}

/** Pill button with a nested arrow circle. */
export function Btn({ variant = "primary", children, style, ...rest }: { variant?: "primary" | "secondary"; children: ReactNode; style?: CSSProperties } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className="btn" style={{ ...css(variant === "primary" ? PRIMARY : SECONDARY), ...(rest.disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}), ...style }}>
      {children}
      <IconCircle variant={variant} />
    </button>
  );
}

/** Double-bezel glass panel: outer tray plus inner core. */
export function Panel({ children, style, innerStyle }: { children: ReactNode; style?: CSSProperties; innerStyle?: CSSProperties }) {
  return (
    <div style={{ ...css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)"), ...style }}>
      <div
        style={{
          ...css("border-radius: 22px; padding: 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); height: 100%; box-sizing: border-box"),
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const GLYPH_LABEL: Record<Provenance, string> = {
  public_record: "Public record",
  owner_answer: "You told us",
  ai_observation: "AI observed",
  city_must_confirm: "Ask the city",
};

/** Provenance glyph plus text. Never color alone. */
export function Provenance({ kind, text, size = 13 }: { kind: Provenance; text?: string; size?: number }) {
  return (
    <span style={css(`display: inline-flex; align-items: center; gap: 7px; font-size: ${size}px; color: #86A09D; white-space: nowrap`)}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        {kind === "public_record" && <rect width="10" height="10" fill="#E8F4F2" />}
        {kind === "owner_answer" && (
          <>
            <circle cx="5" cy="5" r="4.25" fill="none" stroke="#E8F4F2" style={{ strokeWidth: 1.5 }} />
            <circle cx="5" cy="5" r="1.6" fill="#E8F4F2" />
          </>
        )}
        {kind === "ai_observation" && <path d="M5 0.75 L9.25 5 L5 9.25 L0.75 5 Z" fill="none" stroke="#E8F4F2" style={{ strokeWidth: 1.5 }} />}
        {kind === "city_must_confirm" && (
          <>
            <defs>
              <pattern id="prov-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M0 0 V3" stroke="#9DB4D8" style={{ strokeWidth: 1 }} />
              </pattern>
            </defs>
            <rect x="0.75" y="0.75" width="8.5" height="8.5" fill="url(#prov-hatch)" stroke="#9DB4D8" style={{ strokeWidth: 1.5 }} />
          </>
        )}
      </svg>
      {text ?? GLYPH_LABEL[kind]}
    </span>
  );
}

export const STATUS_LABEL: Record<CheckStatus, string> = {
  met: "Met",
  not_met: "Needs attention",
  unknown: "Ask the city",
  not_applicable: "Doesn't apply",
};

export const STATUS_COLOR: Record<CheckStatus, string> = {
  met: "#6EE7C8",
  not_met: "#FF7A6B",
  unknown: "#9DB4D8",
  not_applicable: "#86A09D",
};

/** Numbered status mark used in the check tiles. */
export function StatusMark({ n, status, size = 34 }: { n: number; status: CheckStatus; size?: number }) {
  const fill = status === "met" ? "#6EE7C8" : "#0A1D20";
  const stroke = status === "met" ? "#6EE7C8" : status === "not_met" ? "#FF7A6B" : status === "unknown" ? "#9DB4D8" : "rgba(255,255,255,0.25)";
  const text = status === "met" ? "#052520" : STATUS_COLOR[status];
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="15" fill={fill} stroke={stroke} style={{ strokeWidth: status === "not_met" ? 2 : 1.5, strokeDasharray: status === "not_met" ? "4 3" : undefined }} />
      <text x="17" y="22" textAnchor="middle" fill={text} style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, fontWeight: 700 }}>
        {n}
      </text>
    </svg>
  );
}
