import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { LinkBtn, Provenance } from "@/components/ui";
import { getProperty } from "@/lib/data";
import { css } from "@/lib/css";
import type { Fact, Provenance as Prov } from "@/lib/types";

type Row = { label: string; value: string; note?: string; provenance: Prov };

function fromFact<T>(label: string, fact: Fact<T>, fmt: (v: T) => string, note?: string): Row {
  if (fact.value === null || fact.value === undefined) {
    return { label, value: "Not on record", note: note ?? "We could not find this. Ask the city.", provenance: "city_must_confirm" };
  }
  return { label, value: fmt(fact.value), note, provenance: fact.provenance };
}

const LEGEND: { kind: Prov; label: string; text: string }[] = [
  { kind: "public_record", label: "Public record", text: "County or city data, with the date we pulled it." },
  { kind: "owner_answer", label: "You told us", text: "Your own answer to one of our questions." },
  { kind: "ai_observation", label: "AI observed", text: "Something AI noticed in a photo. It never changes a result." },
  { kind: "city_must_confirm", label: "Ask the city", text: "Unknown or not yet reviewed. The city confirms it." },
];

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProperty(id);
  if (!p) notFound();

  const rows: Row[] = [
    { label: "Parcel ID", value: p.parcelId, provenance: "public_record" },
    fromFact("Lot size", p.lotAcres, (v) => `${v} acres`),
    fromFact("Year built", p.builtYear, (v) => String(v)),
    fromFact("Building area", p.buildingSqft, (v) => `${v.toLocaleString("en-US")} sq ft`, "May exclude the basement. We will ask you."),
    fromFact("Property type", p.propertyClass, (v) => v),
    fromFact("Zone", p.zone, (v) => v),
    fromFact("Units on record", p.houseCount, (v) => String(v), "More than 1 can mean a second unit already exists."),
    fromFact("City limits", p.jurisdiction, (v) => (v === "Salt Lake City" ? "Inside Salt Lake City" : v), "Checked by parcel location, not mailing address."),
  ];
  const lotLabel = p.lotAcres.value !== null ? `${p.lotAcres.value} acres` : "Lot size not on record";

  return (
    <div style={css("min-height: 100dvh; font-size: 18px; line-height: 1.55; padding-bottom: 96px")}>
      <Header dataNote={p.dataMode === "live" ? "Live data" : "Saved data from Nov 6, 2026"} />
      <main style={css("max-width: 1200px; margin: 0 auto; padding: 48px 32px 0; box-sizing: border-box")}>
        <p style={css("margin: 0 0 14px; font-size: 15px; color: #86A09D")}>Step 1 of 3: Confirm your property</p>
        <h1 className="rise" style={css("margin: 0 0 14px; font-size: 56px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; color: #E8F4F2")}>Is this your property?</h1>
        <p className="rise2" style={css("margin: 0 0 40px; font-size: 22px; color: #A9C0BE; font-variant-numeric: tabular-nums")}>{p.address}</p>
        {p.placeholder && (
          <p role="note" style={css("margin: -16px 0 32px; font-size: 14px; color: #FFB547")}>
            Demo data. Replace with verified parcel records before judging.
          </p>
        )}
        <div style={css("display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start")}>
          <div style={css("flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 24px")}>
            <figure style={css("margin: 0; display: flex; flex-direction: column; gap: 10px")}>
              <svg viewBox="0 0 620 520" width="620" height="520" fill="none" role="img" aria-label="Plan view of the lot. The parcel sits fully inside the Salt Lake City limit line." style={css("max-width: 100%; height: auto; display: block")}>
                <defs>
                  <filter id="pBloom" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="18" />
                  </filter>
                  <filter id="pLineGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                  <pattern id="pGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0 H0 V40" stroke="rgba(255,255,255,0.035)" style={css("stroke-width: 1")} />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="620" height="520" fill="url(#pGrid)" />
                <path d="M24 500 V24 H596 V500" stroke="#9DB4D8" opacity="0.35" filter="url(#pLineGlow)" style={css("stroke-width: 4")} />
                <path d="M24 500 V24 H596 V500" stroke="#9DB4D8" style={css("stroke-width: 1.5; stroke-dasharray: 8 6")} />
                <text x="40" y="52" fontSize="13" fill="#9DB4D8" style={css("font-weight: 500")}>Salt Lake City limit</text>
                <path d="M190 70 H430" stroke="#86A09D" style={css("stroke-width: 1")} />
                <path d="M186 74 L194 66 M426 74 L434 66" stroke="#86A09D" style={css("stroke-width: 1")} />
                <path d="M190 62 V78 M430 62 V78" stroke="#86A09D" style={css("stroke-width: 1")} />
                <text x="310" y="60" fontSize="13" textAnchor="middle" fill="#86A09D" style={css("font-variant-numeric: tabular-nums")}>[62] ft</text>
                <path d="M166 90 V470" stroke="#86A09D" style={css("stroke-width: 1")} />
                <path d="M162 94 L170 86 M162 474 L170 466" stroke="#86A09D" style={css("stroke-width: 1")} />
                <path d="M158 90 H174 M158 470 H174" stroke="#86A09D" style={css("stroke-width: 1")} />
                <text x="152" y="284" fontSize="13" textAnchor="end" fill="#86A09D" style={css("font-variant-numeric: tabular-nums")}>[125] ft</text>
                <rect x="190" y="90" width="240" height="380" stroke="#5C7D82" style={css("stroke-width: 1.5")} />
                <rect x="240" y="200" width="140" height="120" fill="#0A1D20" stroke="#5C7D82" style={css("stroke-width: 1.5")} />
                <rect x="262" y="222" width="96" height="76" fill="#6EE7C8" opacity="0.32" filter="url(#pBloom)" />
                <rect x="256" y="216" width="108" height="88" fill="rgba(255,181,71,0.08)" stroke="#FFB547" opacity="0.7" style={css("stroke-width: 1; stroke-dasharray: 3 4")} />
                <text x="310" y="256" fontSize="14" textAnchor="middle" fill="#E8F4F2" style={css("font-weight: 500")}>House</text>
                <text x="310" y="276" fontSize="12" textAnchor="middle" fill="#6EE7C8">Basement below</text>
                <rect x="262" y="320" width="44" height="150" stroke="#2C4A4F" style={css("stroke-width: 1.25")} />
                <text x="318" y="410" fontSize="13" fill="#86A09D">Driveway</text>
                <path d="M44 488 H576" stroke="#2C4A4F" style={css("stroke-width: 1.5")} />
                <text x="310" y="512" fontSize="13" textAnchor="middle" fill="#86A09D">Street</text>
                <circle cx="530" cy="120" r="18" stroke="#2C4A4F" style={css("stroke-width: 1.25")} />
                <path d="M530 106 L537 130 L530 124 Z" fill="#E8F4F2" />
                <path d="M530 106 L523 130 L530 124 Z" stroke="#E8F4F2" style={css("stroke-width: 1.25; stroke-linejoin: round")} />
                <text x="530" y="94" fontSize="13" textAnchor="middle" fill="#E8F4F2" style={css("font-weight: 500")}>N</text>
              </svg>
              <figcaption style={css("font-size: 14px; color: #86A09D")}>Plan view from county parcel lines. Not to scale. {lotLabel}.</figcaption>
            </figure>
            <section aria-labelledby="legend-heading" style={css("padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06)")}>
              <h2 id="legend-heading" style={css("margin: 0 0 12px; font-size: 15px; font-weight: 600; color: #E8F4F2; letter-spacing: -0.01em")}>How to read the labels</h2>
              <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; font-size: 13px; line-height: 1.45; color: #86A09D")}>
                {LEGEND.map((l) => (
                  <div key={l.kind} style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                    <span style={css("color: #E8F4F2; font-weight: 500")}>
                      <Provenance kind={l.kind} text={l.label} size={14} />
                    </span>
                    <span>{l.text}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div style={css("flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 20px")}>
            <section className="rise3" aria-labelledby="record-heading" style={css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
              <div style={css("border-radius: 22px; padding: 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
                <div style={css("display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding-bottom: 16px")}>
                  <h2 id="record-heading" style={css("margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; color: #E8F4F2")}>Property record</h2>
                  <span style={css("font-size: 14px; color: #86A09D; font-variant-numeric: tabular-nums")}>Parcel {p.parcelId}</span>
                </div>
                <dl style={css("margin: 0")}>
                  {rows.map((r) => (
                    <div key={r.label} style={css("display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 4px 16px; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                      <div style={css("flex: 1 1 180px; min-width: 0")}>
                        <dt style={css("font-size: 14px; color: #86A09D")}>{r.label}</dt>
                        <dd style={css("margin: 2px 0 0; font-size: 20px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.3; color: #E8F4F2; font-variant-numeric: tabular-nums")}>{r.value}</dd>
                        {r.note && <p style={css("margin: 4px 0 0; font-size: 14px; line-height: 1.45; color: #86A09D")}>{r.note}</p>}
                      </div>
                      <span style={css("margin-top: 3px")}>
                        <Provenance kind={r.provenance} size={14} />
                      </span>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
            <p style={css("margin: 0; padding: 0 8px; font-size: 14px; line-height: 1.5; color: #86A09D")}>
              Source: Salt Lake County parcel records via UGRC, and Salt Lake City zoning, retrieved {p.jurisdiction.retrievedAt ?? "[date]"}.
            </p>
            <div style={css("display: flex; flex-wrap: wrap; gap: 12px; padding: 4px 0 0")}>
              <LinkBtn href={`/check/${p.id}`}>This is my property</LinkBtn>
              <LinkBtn href="/" variant="secondary">Not my property</LinkBtn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
