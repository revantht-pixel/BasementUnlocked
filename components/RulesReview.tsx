"use client";

import { useState } from "react";
import { css } from "@/lib/css";
import { Btn, Provenance } from "@/components/ui";

type Draft = { id: string; title: string; appliesWhen: string; requirement: string; inputsNeeded: string[]; quote: string };
type Decision = "approved" | "rejected";

const EXAMPLE: Draft[] = [
  { id: "slc-owner-occupancy", title: "Owner lives on the property", appliesWhen: "The owner wants to rent an internal accessory unit.", requirement: "The owner must live on the property to rent the unit, unless an exception in the section applies.", inputsNeeded: ["Owner lives on site", "Exception that applies"], quote: "[Verbatim sentence from the pasted section]" },
  { id: "slc-one-unit", title: "One accessory unit per property", appliesWhen: "Any lot with a single-family home.", requirement: "Only one accessory dwelling unit is allowed on the property.", inputsNeeded: ["Existing second unit"], quote: "[Verbatim sentence from the pasted section]" },
  { id: "slc-parking", title: "Parking for the unit", appliesWhen: "Adding an internal accessory unit.", requirement: "[Parking requirement exactly as the section states it]", inputsNeeded: ["Parking available"], quote: "[Verbatim sentence from the pasted section]" },
];

const PANEL = "padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)";
const FIELD = "box-sizing: border-box; font-family: inherit; font-size: 16px; color: #E8F4F2; border: 1px solid rgba(255,255,255,0.1)";
const NUM = "font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 52px; font-weight: 300; letter-spacing: -0.04em; line-height: 1";
const UNDO = "min-height: 44px; padding: 0 16px; background: none; border: 0; border-radius: 999px; font-family: inherit; font-size: 14px; font-weight: 500; color: #E8F4F2; text-decoration: underline; text-underline-offset: 3px; cursor: pointer";
export default function RulesReview() {
  const [text, setText] = useState("");
  const [section, setSection] = useState("21A.40.200");
  const [link, setLink] = useState("https://codelibrary.amlegal.com/codes/saltlakecityut/latest/saltlakecity_ut/0-0-0-68737");
  const [drafts, setDrafts] = useState<Draft[]>(EXAMPLE);
  const [isExample, setIsExample] = useState(true);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState("");

  const decide = (id: string, v: Decision | null) =>
    setDecisions((d) => {
      const next = { ...d };
      if (v) next[id] = v;
      else delete next[id];
      return next;
    });

  async function draft() {
    if (!text.trim()) {
      setNote("Paste real ordinance text first.");
      return;
    }
    setBusy(true);
    setNote("Thinking...");
    try {
      const res = await fetch("/api/rules/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionLabel: section, sourceUrl: link, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNote(typeof data?.error === "string" ? data.error : "That did not work. Try again.");
        return;
      }
      const list: Draft[] = Array.isArray(data.drafts) ? data.drafts : [];
      const dropped: number = typeof data.dropped === "number" ? data.dropped : 0;
      setDrafts(list);
      setDecisions({});
      setIsExample(data.generatedBy === "example");
      if (data.generatedBy === "example") setNote("Example drafts shown. Add an Anthropic key to run live AI.");
      else if (list.length === 0) setNote("No rules found that quote the text exactly.");
      else if (dropped > 0) setNote(`Dropped ${dropped} draft${dropped === 1 ? "" : "s"} whose quote was not found in the text.`);
      else setNote("Drafted just now by AI. Review each one.");
    } catch {
      setNote("That did not work. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const a = drafts.filter((d) => decisions[d.id] === "approved").length;
  const r = drafts.filter((d) => decisions[d.id] === "rejected").length;
  const w = drafts.length - a - r;

  async function copyApproved() {
    const reviewedOn = new Date().toISOString().slice(0, 10);
    const approved = drafts.filter((d) => decisions[d.id] === "approved").map((d) => ({ ...d, section, sourceUrl: link, reviewedOn }));
    try {
      await navigator.clipboard.writeText(JSON.stringify(approved, null, 2));
      setCopied(`Copied ${approved.length} approved rule${approved.length === 1 ? "" : "s"}.`);
    } catch {
      setCopied("Could not copy. Select the text and copy it yourself.");
    }
  }

  const statusText = note || "Paste a section, then press Draft rules from this text.";

  return (
    <main style={css("max-width: 1200px; margin: 0 auto; padding: 72px 32px 96px; box-sizing: border-box")}>
      <h1 className="rise" style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0 0 20px; font-size: 72px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; color: #E8F4F2; max-width: 15ch")}>
        Turn an ordinance into reviewed rules
      </h1>
      <p className="rise2" style={css("margin: 0 0 80px; font-size: 20px; color: #A9C0BE; max-width: 60ch")}>AI drafts. A person approves. Only approved rules ever decide a result.</p>
      <div style={css("display: flex; flex-wrap: wrap; gap: 64px 48px; align-items: flex-start")}>
        <form onSubmit={(e) => e.preventDefault()} style={css(`flex: 1 1 400px; min-width: 0; margin: 0; ${PANEL}`)}>
          <div style={css("border-radius: 22px; padding: 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 24px")}>
            <div style={css("display: flex; flex-direction: column; gap: 10px")}>
              <label htmlFor="ord-text" style={css("font-size: 15px; font-weight: 500; color: #E8F4F2")}>Ordinance text</label>
              <textarea id="ord-text" className="field" rows={12} value={text} onChange={(e) => setText(e.target.value)} aria-describedby="ord-help" style={css(`${FIELD}; width: 100%; padding: 16px 18px; line-height: 1.55; background: rgba(7,9,12,0.6); border-radius: 16px; resize: vertical`)} />
              <span id="ord-help" style={css("font-size: 14px; color: #86A09D")}>Paste one section at a time. AI only uses what you paste here.</span>
            </div>
            <div style={css("display: flex; flex-direction: column; gap: 10px")}>
              <label htmlFor="ord-section" style={css("font-size: 15px; font-weight: 500; color: #E8F4F2")}>Section</label>
              <input id="ord-section" className="field" type="text" value={section} onChange={(e) => setSection(e.target.value)} style={css(`${FIELD}; height: 56px; padding: 0 22px; background: rgba(255,255,255,0.05); border-radius: 999px; font-variant-numeric: tabular-nums`)} />
            </div>
            <div style={css("display: flex; flex-direction: column; gap: 10px")}>
              <label htmlFor="ord-link" style={css("font-size: 15px; font-weight: 500; color: #E8F4F2")}>Source link</label>
              <input id="ord-link" className="field" type="url" value={link} onChange={(e) => setLink(e.target.value)} style={css(`${FIELD}; height: 56px; padding: 0 22px; background: rgba(255,255,255,0.05); border-radius: 999px`)} />
            </div>
            <div style={css("display: flex; flex-direction: column; gap: 14px; padding-top: 4px")}>
              <Btn type="button" onClick={draft} disabled={busy} style={{ alignSelf: "flex-start" }}>
                Draft rules from this text
              </Btn>
              <span role="status" aria-atomic="true" style={css("font-size: 15px; color: #86A09D; max-width: 44ch")}>{statusText}</span>
            </div>
          </div>
        </form>
        <section className="rise3" aria-labelledby="drafts-heading" style={css("flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 20px; position: relative")}>
          <div style={css("display: flex; flex-wrap: wrap; gap: 16px 32px; align-items: flex-end; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.07)")}>
            <h2 id="drafts-heading" style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 36px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05")}>Draft rules</h2>
            <div aria-hidden="true" style={css("display: flex; gap: 28px; align-items: baseline; font-variant-numeric: tabular-nums")}>
              {([[a, "approved", "#6EE7C8"], [r, "rejected", "#E8F4F2"], [w, "waiting", "#86A09D"]] as const).map(([n, label, color]) => (
                <span key={label} style={css("display: inline-flex; align-items: baseline; gap: 8px")}>
                  <span style={css(`${NUM}; color: ${color}`)}>{n}</span>
                  <span style={css("font-size: 14px; color: #86A09D")}>{label}</span>
                </span>
              ))}
            </div>
            <span role="status" aria-atomic="true" style={css("position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0")}>
              {`${a} approved, ${r} rejected, ${w} waiting`}
            </span>
          </div>
          {isExample && (
            <p style={css("margin: 0; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #86A09D")}>
              <Provenance kind="ai_observation" text="Example drafts. Paste real ordinance text to draft your own." size={14} />
            </p>
          )}
          {drafts.map((d) => {
            const s = (decisions[d.id] as Decision | undefined) ?? "waiting";
            if (s === "rejected") {
              return (
                <div key={d.id} style={css("display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; justify-content: space-between; min-height: 56px; box-sizing: border-box; padding: 6px 8px 6px 24px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); color: #86A09D; font-size: 15px")}>
                  <span style={css("display: inline-flex; align-items: center; gap: 10px; min-width: 0")}>
                    <span aria-hidden="true" style={css("flex: none; width: 10px; height: 10px; box-sizing: border-box; border-radius: 999px; border: 1.5px solid rgba(255,255,255,0.25)")} />
                    Rejected: {d.title}
                  </span>
                  <button type="button" onClick={() => decide(d.id, null)} style={css(UNDO)}>Undo</button>
                </div>
              );
            }
            const cardStyle =
              "margin: 0; padding: 6px; border-radius: 28px; transition: border-color 500ms cubic-bezier(0.32,0.72,0,1), box-shadow 500ms cubic-bezier(0.32,0.72,0,1); " +
              (s === "approved" ? "background: rgba(110,231,200,0.05); border: 1px solid rgba(110,231,200,0.4); box-shadow: 0 0 40px rgba(110,231,200,0.12);" : "background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);");
            return (
              <article key={d.id} style={css(cardStyle)}>
                <div style={css("border-radius: 22px; padding: 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 18px")}>
                  <div style={css("display: flex; flex-wrap: wrap; gap: 6px 16px; align-items: baseline; justify-content: space-between")}>
                    <h3 style={css("margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: #E8F4F2")}>{d.title}</h3>
                    <span style={css("font-size: 13px; color: #86A09D; font-variant-numeric: tabular-nums")}>{d.id}</span>
                  </div>
                  <p style={css("margin: 0; font-size: 17px; color: #A9C0BE; max-width: 60ch")}>{d.requirement}</p>
                  <dl style={css("margin: 0; display: flex; flex-direction: column; font-size: 15px")}>
                    <div style={css("display: flex; flex-wrap: wrap; gap: 4px 16px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                      <dt style={css("width: 120px; color: #86A09D")}>Applies when</dt>
                      <dd style={css("margin: 0; flex: 1 1 260px; min-width: 0; color: #E8F4F2")}>{d.appliesWhen || "Not stated in the text."}</dd>
                    </div>
                    <div style={css("display: flex; flex-wrap: wrap; gap: 4px 16px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06)")}>
                      <dt style={css("width: 120px; color: #86A09D")}>Inputs needed</dt>
                      <dd style={css("margin: 0; flex: 1 1 260px; min-width: 0; color: #E8F4F2")}>{d.inputsNeeded.length ? d.inputsNeeded.join(", ") : "None"}</dd>
                    </div>
                  </dl>
                  <blockquote style={css("margin: 0; padding: 4px 0 4px 18px; border-left: 2px solid #6EE7C8; font-size: 16px; font-style: italic; line-height: 1.6; color: #A9C0BE")}>{d.quote}</blockquote>
                  {s === "waiting" && (
                    <div style={css("display: flex; flex-wrap: wrap; gap: 12px; padding-top: 4px")}>
                      <Btn type="button" onClick={() => decide(d.id, "approved")}>Approve</Btn>
                      <Btn type="button" variant="secondary" onClick={() => decide(d.id, "rejected")}>Reject</Btn>
                    </div>
                  )}
                  {s === "approved" && (
                    <div style={css("display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding-top: 4px")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; color: #6EE7C8")}>
                        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" style={css("filter: drop-shadow(0 0 6px rgba(110,231,200,0.6))")}>
                          <circle cx="11" cy="11" r="10" fill="#6EE7C8" />
                          <path d="M6.8 11.3 L9.7 14.2 L15.4 8" fill="none" stroke="#052520" style={{ strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }} />
                        </svg>
                        Approved by reviewer
                      </span>
                      <button type="button" onClick={() => decide(d.id, null)} style={css(UNDO)}>Undo</button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          <div style={css("display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center")}>
            <Btn type="button" variant="secondary" onClick={copyApproved} disabled={a === 0}>Copy approved rules</Btn>
            <span role="status" aria-atomic="true" style={css("font-size: 15px; color: #86A09D")}>{copied}</span>
          </div>
          <p style={css("margin: 12px 0 0; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); font-size: 14px; color: #86A09D")}>Approved rules are saved with the section, link and review date.</p>
        </section>
      </div>
    </main>
  );
}
