import Header from "@/components/Header";
import { LinkBtn, Provenance } from "@/components/ui";
import { css } from "@/lib/css";

export default function OutOfScopePage() {
  return (
    <div style={css("min-height: 100dvh; font-size: 18px; line-height: 1.55; padding-bottom: 96px")}>
      <Header />
      <main style={css("max-width: 1200px; margin: 0 auto; padding: 72px 32px 0; box-sizing: border-box")}>
        <div style={css("display: flex; flex-wrap: wrap; gap: 64px; align-items: center")}>
          <figure className="rise3" style={css("flex: 1 1 440px; min-width: 0; margin: 0")}>
            <div style={css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
              <div style={css("border-radius: 22px; overflow: hidden; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
                <svg viewBox="0 0 540 460" width="540" height="460" fill="none" role="img" aria-label="Boundary map. The parcel sits just on the Millcreek side of the Salt Lake City line." style={css("max-width: 100%; height: auto; display: block")}>
                  <defs>
                    <filter id="oBloom" x="-200%" y="-200%" width="500%" height="500%">
                      <feGaussianBlur stdDeviation="10" />
                    </filter>
                    <filter id="oLineGlow" x="-20%" y="-10%" width="140%" height="120%">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                  </defs>
                  <path d="M0 0 H306 C 284 120, 338 230, 298 460 H0 Z" fill="#0B1D20" />
                  <path d="M306 0 H540 V460 H298 C 338 230, 284 120, 306 0 Z" fill="#0F2428" />
                  <path d="M0 120 H540 M0 200 H540 M0 280 H540 M0 360 H540 M90 0 V460 M180 0 V460 M400 0 V460 M470 0 V460" stroke="#14292E" style={css("stroke-width: 1")} />
                  <path d="M306 0 C 284 120, 338 230, 298 460" stroke="#9DB4D8" opacity="0.35" filter="url(#oLineGlow)" style={css("stroke-width: 6")} />
                  <path d="M306 0 C 284 120, 338 230, 298 460" stroke="#9DB4D8" style={css("stroke-width: 1.5; stroke-dasharray: 10 7")} />
                  <text x="32" y="56" fontSize="18" fill="#E8F4F2" style={css("font-weight: 600; letter-spacing: -0.02em")}>Salt Lake City</text>
                  <text x="344" y="56" fontSize="18" fill="#A9C0BE" style={css("font-weight: 600; letter-spacing: -0.02em")}>[Millcreek]</text>
                  <rect x="314" y="190" width="32" height="32" fill="#6EE7C8" opacity="0.6" filter="url(#oBloom)" />
                  <rect x="322" y="198" width="16" height="16" fill="#6EE7C8" stroke="#FFE2B0" style={css("stroke-width: 1")} />
                  <path d="M340 202 L418 150" stroke="#86A09D" style={css("stroke-width: 1")} />
                  <circle cx="418" cy="150" r="2" fill="#86A09D" />
                  <text x="426" y="146" fontSize="14" fill="#E8F4F2" style={css("font-weight: 500")}>Your parcel</text>
                  <text x="32" y="436" fontSize="13" fill="#86A09D">City line from UGRC municipal boundaries</text>
                </svg>
              </div>
            </div>
          </figure>
          <div style={css("flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 20px")}>
            <h1 className="rise" style={css("margin: 0; font-size: 56px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; color: #E8F4F2; max-width: 14ch")}>This address is outside Salt Lake City</h1>
            <p className="rise2" style={css("margin: 0; font-size: 20px; line-height: 1.5; color: #E8F4F2; max-width: 46ch")}>
              [Street address] has a Salt Lake City mailing address, but the parcel is inside [Millcreek] city limits.
            </p>
            <p style={css("margin: 0; font-size: 18px; color: #A9C0BE; max-width: 52ch")}>
              Each city writes its own basement-apartment rules. We have only reviewed Salt Lake City&apos;s, so we won&apos;t guess.
            </p>
            <Provenance kind="public_record" text="Public record: checked against UGRC city boundaries, [date]" size={14} />
            <div style={css("display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px")}>
              <LinkBtn href="/">Check a different address</LinkBtn>
              <a
                className="btn"
                href="https://www.millcreek.us/"
                target="_blank"
                rel="noopener noreferrer"
                style={css(
                  "display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 8px 0 24px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #E8F4F2; font-weight: 600; font-size: 16px; text-decoration: none; white-space: nowrap; box-sizing: border-box",
                )}
              >
                Contact [Millcreek] planning
                <span className="btn-ic" style={css("width: 40px; height: 40px; border-radius: 999px; background: rgba(255,255,255,0.08); display: inline-flex; align-items: center; justify-content: center")}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4 12 L12 4 M6 4 H12 V10" fill="none" stroke="#E8F4F2" style={css("stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round")} />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
