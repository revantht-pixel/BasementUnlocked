import Link from "next/link";
import Header from "@/components/Header";
import { Panel, Provenance } from "@/components/ui";
import { css } from "@/lib/css";
import sourcesFile from "@/data/sources.json";
import type { Provenance as Kind, SourceRef } from "@/lib/types";

const SOURCES = sourcesFile as SourceRef[];

const GLYPHS: { kind: Kind; text: string }[] = [
  { kind: "public_record", text: "Read from a public record, such as the county parcel data. Filled square." },
  { kind: "owner_answer", text: "You told us this in the questions. We did not check it. Ring with a dot." },
  { kind: "ai_observation", text: "AI saw this in a photo or drafted it. AI never decides a result. Outlined diamond." },
  { kind: "city_must_confirm", text: "Only the city can confirm this. Hatched square." },
];

export default function SourcesPage() {
  return (
    <div style={{ minHeight: "100dvh", fontSize: 18, lineHeight: 1.55 }}>
      <Header dataNote="Sources" />
      <main style={css("max-width: 1200px; margin: 0 auto; padding: 72px 32px 96px; box-sizing: border-box")}>
        <h1 className="rise" style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0 0 20px; font-size: 72px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; color: #E8F4F2; max-width: 15ch")}>
          Where the rules come from
        </h1>
        <p className="rise2" style={css("margin: 0 0 64px; font-size: 20px; color: #A9C0BE; max-width: 60ch")}>
          Every check links to the source it relies on. Where we only read a secondary source, we say so and ask you to confirm in the ordinance.
        </p>
        <div style={css("display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start")}>
          <section aria-labelledby="src-heading" style={css("flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 20px")}>
            <h2 id="src-heading" style={css("margin: 0; font-size: 36px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05")}>Sources</h2>
            <ul style={css("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 16px")}>
              {SOURCES.map((s) => (
                <li key={s.id}>
                  <Panel innerStyle={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                    <a href={s.url} target="_blank" rel="noreferrer" style={css("font-size: 19px; font-weight: 600; letter-spacing: -0.01em; color: #E8F4F2; text-underline-offset: 3px")}>
                      {s.title}
                    </a>
                    {s.section && <span style={css("font-size: 15px; color: #A9C0BE")}>Section: {s.section}</span>}
                    <span style={css("font-size: 14px; color: #86A09D; word-break: break-all")}>{s.url}</span>
                    <span style={css("display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 14px; color: #A9C0BE")}>
                      <span>{s.review === "verified" ? "Verified" : "Confirm in the ordinance"}</span>
                      <span style={css("color: #86A09D")}>{s.reviewedOn ? `Reviewed ${s.reviewedOn}` : "Not yet reviewed by a person"}</span>
                    </span>
                  </Panel>
                </li>
              ))}
            </ul>
          </section>
          <aside aria-labelledby="glyph-heading" style={css("flex: 1 1 340px; min-width: 0; display: flex; flex-direction: column; gap: 20px")}>
            <h2 id="glyph-heading" style={css("margin: 0; font-size: 36px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05")}>Four marks</h2>
            <Panel>
              <ul style={css("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 18px")}>
                {GLYPHS.map((g) => (
                  <li key={g.kind} style={css("display: flex; flex-direction: column; gap: 6px")}>
                    <span style={css("color: #E8F4F2")}><Provenance kind={g.kind} size={16} /></span>
                    <span style={css("font-size: 15px; color: #A9C0BE")}>{g.text}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Link href="/rules" style={css("font-size: 15px; color: #A9C0BE; min-height: 44px; display: inline-flex; align-items: center")}>How rules are made</Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
