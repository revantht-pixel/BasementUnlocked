import Link from "next/link";
import Header from "@/components/Header";
import HouseScene from "@/components/HouseScene";
import Mountains from "@/components/Mountains";
import AddressForm from "@/components/AddressForm";
import { LinkBtn, Provenance } from "@/components/ui";
import { css } from "@/lib/css";

const GLYPHS = [
  { kind: "public_record", label: "Public record", text: "County parcel and city zoning data, dated." },
  { kind: "owner_answer", label: "You told us", text: "Your answers. Records can't know who lives there." },
  { kind: "ai_observation", label: "AI observed", text: "What AI noticed. It never changes a result." },
  { kind: "city_must_confirm", label: "Ask the city", text: "Unknown or unreviewed. Marked, never guessed." },
] as const;

export default function Home() {
  return (
    <div style={css("font-size: 18px; line-height: 1.55; min-height: 100dvh")}>
      <section style={css("position: relative; min-height: 860px; overflow: hidden")}>
        <Mountains />
        <div style={css("position: absolute; right: -9%; bottom: 0; width: 58%; min-width: 560px; pointer-events: none")}>
          <HouseScene animate backdrop={false} label="Night drawing of a house with the basement lights switching on." showDimension={false} />
        </div>
        <Header absolute />
        <div style={css("position: relative; max-width: 1200px; margin: 0 auto; padding: 96px 32px 0")}>
          <div style={css("max-width: 580px; display: flex; flex-direction: column; gap: 24px")}>
            <span className="rise" style={css("align-self: flex-start; display: inline-flex; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); font-size: 13px; color: #A9C0BE")}>
              For Salt Lake City homeowners
            </span>
            <h1 className="rise" style={css("margin: 0; font-size: 66px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98")}>
              Unlock the room you already own.
            </h1>
            <p className="rise2" style={css("margin: 0; font-size: 20px; color: #A9C0BE; max-width: 30em")}>
              Type a Salt Lake City address. See which basement-apartment rules you meet, and what to ask the city.
            </p>
            <AddressForm />
            <p className="rise3" style={css("margin: 0; font-size: 15px; color: #86A09D")}>
              Try <Link href="/property/sugar-house">Sugar House</Link>, <Link href="/property/avenues">The Avenues</Link>, <Link href="/property/rose-park">Rose Park</Link>, or{" "}
              <Link href="/out-of-scope">an address outside the city</Link>.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="facts-h" style={css("max-width: 1200px; margin: 0 auto; padding: 96px 32px 72px")}>
        <h2 id="facts-h" style={css("margin: 0; font-size: 40px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; max-width: 16ch")}>
          Every fact shows where it came from.
        </h2>
        <p style={css("margin: 14px 0 40px; color: #A9C0BE; max-width: 46em")}>
          Since 2021, Utah law treats one apartment inside a single-family home as a permitted use in residential zones. We check your house against the rules, and we say what we don&apos;t know.
        </p>
        <div style={css("display: flex; flex-wrap: wrap; gap: 16px")}>
          <div style={css("flex: 999 1 560px; min-width: 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
            <dl style={css("margin: 0; border-radius: 22px; padding: 12px 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 32px")}>
              {GLYPHS.map((g, i) => (
                <div key={g.kind} style={css(`padding: 18px 0; ${i < 2 ? "border-bottom: 1px solid rgba(255,255,255,0.06)" : ""}`)}>
                  <dt style={css("font-weight: 500")}>
                    <span style={css("display: inline-flex; align-items: center; gap: 10px; color: #E8F4F2; font-size: 18px")}>
                      <Provenance kind={g.kind} text={g.label} size={18} />
                    </span>
                  </dt>
                  <dd style={css("margin: 6px 0 0; font-size: 15px; color: #86A09D")}>{g.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div style={css("flex: 1 1 320px; min-width: 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
            <div
              style={css(
                "height: 100%; box-sizing: border-box; border-radius: 22px; padding: 28px; background: radial-gradient(120% 90% at 0% 100%, rgba(110,231,200,0.16) 0%, rgba(110,231,200,0) 60%), rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 14px",
              )}
            >
              <p style={css("font-family: var(--font-space), 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 30px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05")}>Rules decide. AI explains.</p>
              <p style={css("margin: 0; font-size: 15px; color: #A9C0BE")}>
                Results come from reviewed state and city rules. AI writes the summary, answers questions and reads photos, and it can&apos;t change a result.
              </p>
              <LinkBtn href="/rules" variant="secondary" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                How rules are made
              </LinkBtn>
            </div>
          </div>
        </div>
        <p style={css("margin: 64px 0 0; font-size: 14px; color: #86A09D")}>A screening tool, not legal advice. Every result links to the law or ordinance behind it.</p>
      </section>
    </div>
  );
}
