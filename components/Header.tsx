import Link from "next/link";
import { css } from "@/lib/css";

/** Floating island header, shared by every screen. */
export default function Header({ dataNote = "Saved data from Nov 6, 2026", absolute = false }: { dataNote?: string; absolute?: boolean }) {
  return (
    <header style={css(`padding: 16px 24px 0; display: flex; justify-content: center; ${absolute ? "position: relative; z-index: 2;" : ""}`)}>
      <div
        style={css(
          "display: flex; align-items: center; gap: 20px; height: 52px; padding: 0 8px 0 18px; border-radius: 999px; background: rgba(10,29,32,0.72); border: 1px solid rgba(255,255,255,0.08); box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)",
        )}
      >
        <Link href="/" style={css("display: flex; align-items: center; gap: 10px; text-decoration: none; color: #E8F4F2; font-weight: 600; font-size: 15px; letter-spacing: -0.01em")}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 9 L10 3 L17 9 V17 H3 Z" fill="none" stroke="#E8F4F2" style={{ strokeWidth: 1.5, strokeLinejoin: "round" }} />
            <rect x="6" y="12" width="8" height="5" fill="#FFB547" />
          </svg>
          Basement Unlock
        </Link>
        <span style={css("width: 1px; height: 20px; background: rgba(255,255,255,0.1)")} />
        <span style={css("font-size: 13px; color: #86A09D; white-space: nowrap")}>{dataNote}</span>
        <Link
          href="/rules"
          style={css("height: 36px; padding: 0 14px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 13px; color: #E8F4F2; text-decoration: none; background: rgba(255,255,255,0.06)")}
        >
          How rules are made
        </Link>
      </div>
    </header>
  );
}
