"use client";

import { useMemo, useState } from "react";
import HouseScene from "@/components/HouseScene";
import { Btn, LinkBtn, Provenance, STATUS_COLOR, STATUS_LABEL, StatusMark } from "@/components/ui";
import { css } from "@/lib/css";
import { answersToQuery } from "@/lib/data";
import { screen, sourceById } from "@/lib/screen";
import type { Answers, Property, RentEstimate, ScreeningReport } from "@/lib/types";

const SECTION_H = "font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 40px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05";
const TILE_BASE =
  "flex: 1 1 330px; min-width: 0; box-sizing: border-box; padding: 24px; border-radius: 24px; display: flex; flex-direction: column; gap: 12px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); ";
const OPT_BASE =
  "position: relative; flex: 1 1 0; display: flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 16px; border-radius: 999px; cursor: pointer; font-size: 16px; font-weight: 500; white-space: nowrap; ";

const OCC_OPTIONS: { v: Answers["ownerLivesOnSite"]; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "no", label: "No" },
  { v: "unknown", label: "I don't know" },
];

export default function ResultView({ property, initialAnswers, rent }: { property: Property; initialAnswers: Answers; rent: RentEstimate | null }) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatedBy, setGeneratedBy] = useState<"ai" | "template" | null>(null);
  const [asking, setAsking] = useState(false);
  const [askErr, setAskErr] = useState("");

  const report: ScreeningReport = useMemo(() => screen(property, answers, rent), [property, answers, rent]);
  const query = answersToQuery(answers);

  const applicable = report.metCount + report.unknownCount + report.notMetCount;
  const metFrac = applicable ? report.metCount / applicable : 0;
  const hatch = applicable ? (report.unknownCount / applicable) * 0.5 : 0;

  function pickOcc(v: Answers["ownerLivesOnSite"]) {
    const next = { ...answers, ownerLivesOnSite: v };
    setAnswers(next);
    setTouched(true);
    try {
      window.history.replaceState(null, "", `?${answersToQuery(next)}`);
    } catch {
      /* URL sync is a convenience only */
    }
  }

  async function onAsk() {
    const question = q.trim();
    if (!question) {
      setAskErr("Type a question, or pick one on the left.");
      return;
    }
    setAsking(true);
    setAskErr("");
    setAnswer("Thinking...");
    setGeneratedBy(null);
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report, question }) });
      if (!res.ok) throw new Error("bad");
      const data = (await res.json()) as { answer: string; generatedBy: "ai" | "template" };
      setAnswer(data.answer);
      setGeneratedBy(data.generatedBy);
    } catch {
      setAnswer("");
      setAskErr("That did not work. Try again.");
    } finally {
      setAsking(false);
    }
  }

  const answerNote =
    generatedBy === "template"
      ? "Example answer. Add an Anthropic key to run live AI."
      : "Written by AI from your checks. It cannot change a result.";

  const rentLine = rent
    ? `Per month, ${rent.bedrooms === 0 ? "efficiency" : `${rent.bedrooms}-bedroom`}, ${rent.area} area estimate`
    : `Per month, ${answers.bedrooms === "0" ? "efficiency" : `${answers.bedrooms === "2" ? "2" : "1"}-bedroom`}, Salt Lake City area`;

  return (
    <main style={css("max-width: 1200px; margin: 0 auto; padding: 72px 32px 96px")}>
      <p className="rise" style={css("margin: 0 0 14px; font-size: 15px; color: #86A09D")}>
        Step 3 of 3. {property.address}
      </p>
      <h1 className="rise" style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 64px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; max-width: 14ch")}>
        {report.outcomeTitle}
      </h1>
      <p className="rise2" style={css("margin: 18px 0 0; font-size: 20px; color: #A9C0BE; max-width: 40em")}>
        {report.outcomeLine}
      </p>

      <figure className="rise3" style={css("margin: 48px 0 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
        <div style={css("border-radius: 22px; overflow: hidden; background: linear-gradient(180deg, #051113 0%, #0A1D20 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
          <HouseScene
            label={`Night section drawing of the house. ${report.metCount} checks met light the basement, ${report.unknownCount} are hatched for the city to confirm, ${report.notMetCount} need attention.`}
            dim={(1 - metFrac) * 0.8}
            hatch={hatch}
            alert={report.notMetCount > 0 ? 1 : 0}
            spill={0.3 + 0.7 * metFrac}
            person={answers.ownerLivesOnSite === "yes" ? 1 : answers.ownerLivesOnSite === "unknown" ? 0.25 : 0}
            car={1}
            callouts={report.results.map((r) => ({ n: r.n, status: r.status }))}
          />
        </div>
      </figure>

      <div style={css("display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px")}>
        <fieldset style={css("flex: 2 1 420px; min-width: 0; margin: 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(110,231,200,0.35)")}>
          <legend style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>Change an answer</legend>
          <div style={css("height: 100%; box-sizing: border-box; border-radius: 22px; padding: 26px 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 16px")}>
            <p style={css("margin: 0; font-size: 14px; color: #86A09D")}>Change an answer and watch check 5</p>
            <p style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.15")}>Will you live in the main house?</p>
            <div role="radiogroup" aria-label="Will you live in the main house?" style={css("display: flex; gap: 6px; padding: 6px; border-radius: 999px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08)")}>
              {OCC_OPTIONS.map((o) => {
                const selected = answers.ownerLivesOnSite === o.v;
                return (
                  <label
                    key={o.v}
                    className="opt"
                    htmlFor={`occ-${o.v}`}
                    style={css(OPT_BASE + (selected ? "background: #6EE7C8; color: #052520; box-shadow: 0 0 24px rgba(110,231,200,0.3);" : "background: transparent; color: #A9C0BE;"))}
                  >
                    <input type="radio" id={`occ-${o.v}`} name="occ" checked={selected} onChange={() => pickOcc(o.v)} />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </div>
        </fieldset>

        <div style={css("flex: 1 1 260px; min-width: 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
          <p role="status" aria-atomic="true" style={css("margin: 0; height: 100%; box-sizing: border-box; border-radius: 22px; padding: 26px 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; justify-content: space-between; gap: 10px")}>
            <span style={css("font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 88px; font-weight: 300; letter-spacing: -0.05em; line-height: 0.9; font-variant-numeric: tabular-nums")}>
              <span style={{ color: "#9DB4D8" }}>{report.unknownCount}</span>
              <span style={css("font-family: 'Space Grotesk', system-ui, sans-serif; color: #86A09D; font-size: 40px; letter-spacing: -0.02em")}> of 9</span>
            </span>
            <span style={css("font-size: 15px; color: #A9C0BE")}>checks need the city. Marked, never guessed.</span>
          </p>
        </div>

        <section aria-labelledby="rent-h" style={css("flex: 1 1 300px; min-width: 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
          <div style={css("height: 100%; box-sizing: border-box; border-radius: 22px; padding: 26px 28px; background: radial-gradient(120% 100% at 100% 0%, rgba(110,231,200,0.14) 0%, rgba(110,231,200,0) 55%), rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px")}>
            <h2 id="rent-h" style={css("margin: 0; font-size: 14px; font-weight: 400; color: #86A09D")}>What it could rent for</h2>
            <p style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 44px; font-weight: 300; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums")}>
              {rent ? `$${rent.low.toLocaleString("en-US")} to $${rent.high.toLocaleString("en-US")}` : "[$X] to [$Y]"}
            </p>
            <p style={css("margin: 0; font-size: 15px; color: #A9C0BE")}>{rentLine}</p>
            {!rent && <p style={css("margin: 0; font-size: 14px; color: #86A09D")}>Add a HUD token to show the area range.</p>}
            <span style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #86A09D")}>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <rect width="10" height="10" fill="#E8F4F2" />
              </svg>
              HUD Fair Market Rents, FY{rent ? rent.fiscalYear : "2026"}. Not an appraisal.
            </span>
          </div>
        </section>
      </div>

      <section aria-labelledby="ask-h" style={css("margin-top: 96px; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
        <div style={css("border-radius: 22px; padding: 40px; background: radial-gradient(80% 120% at 0% 0%, rgba(110,231,200,0.10) 0%, rgba(110,231,200,0) 50%), rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-wrap: wrap; gap: 32px 56px")}>
          <div style={css("flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; gap: 14px")}>
            <h2 id="ask-h" style={css(SECTION_H)}>Ask about your result</h2>
            <p style={css("margin: 0; font-size: 16px; color: #A9C0BE")}>AI answers from your nine checks only and points to the check it used. It can&apos;t change a result.</p>
            <div style={css("display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px")}>
              {["Why do I need to ask the city about parking?", "What changes if I don't live in the main house?"].map((text, i) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => {
                    setQ(text);
                    setAskErr("");
                  }}
                  style={css("min-height: 44px; padding: 8px 16px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #E8F4F2; font: inherit; font-size: 14px; cursor: pointer; text-align: left")}
                >
                  {i === 0 ? "Why ask the city about parking?" : "What if I don't live in the main house?"}
                </button>
              ))}
            </div>
          </div>
          <div style={css("flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 14px")}>
            <label htmlFor="q" style={css("font-size: 14px; font-weight: 500; color: #A9C0BE")}>
              Your question
            </label>
            <div style={css("display: flex; flex-wrap: wrap; gap: 10px")}>
              <input
                id="q"
                type="text"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setAskErr("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !asking) onAsk();
                }}
                style={css("flex: 1 1 240px; min-width: 0; height: 56px; padding: 0 22px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #E8F4F2; font: inherit; font-size: 17px; box-sizing: border-box")}
              />
              <Btn type="button" onClick={onAsk} disabled={asking}>
                Ask
              </Btn>
            </div>
            {askErr && <p style={css("margin: 0; font-size: 15px; color: #FF7A6B")}>{askErr}</p>}
            <div aria-live="polite" style={css("min-height: 140px; padding: 22px 24px; border-radius: 18px; background: rgba(0,0,0,0.22); border: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 14px")}>
              <p style={css("margin: 0; font-size: 19px; line-height: 1.55; color: #E8F4F2; white-space: pre-line")}>{answer || "Your answer appears here, with the check numbers it used."}</p>
              <Provenance kind="ai_observation" text={answerNote} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="checks-h" style={css("margin-top: 96px")}>
        <h2 id="checks-h" style={css(SECTION_H + "; margin-bottom: 28px")}>The nine checks</h2>
        <div style={css("display: flex; flex-wrap: wrap; gap: 16px")}>
          {report.results.map((c) => {
            const isOpen = open === c.n;
            const flash = c.n === 5 && touched;
            return (
              <article
                key={c.ruleId}
                className="tile"
                style={css(TILE_BASE + (flash ? "background: rgba(110,231,200,0.08); border: 1px solid rgba(110,231,200,0.5);" : "background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07);"))}
              >
                <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
                  <StatusMark n={c.n} status={c.status} />
                  <span style={css(`font-size: 13px; font-weight: 600; white-space: nowrap; color: ${STATUS_COLOR[c.status]}`)}>{STATUS_LABEL[c.status]}</span>
                </div>
                <h3 style={css("margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.3")}>{c.title}</h3>
                <p style={css("margin: 0; font-size: 15px; color: #A9C0BE")}>{c.explanation}</p>
                <div style={css("display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: auto")}>
                  {c.inputs.map((g, i) => (
                    <Provenance key={i} kind={g.provenance} text={`${g.label}: ${g.text}`} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : c.n)}
                  aria-expanded={isOpen}
                  style={css("align-self: flex-start; min-height: 40px; padding: 0 14px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #E8F4F2; font: inherit; font-size: 13px; cursor: pointer")}
                >
                  {isOpen ? "Hide source" : "Show source"}
                </button>
                {isOpen && (
                  <div style={css("padding: 14px 16px; border-radius: 14px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); font-size: 14px; display: flex; flex-direction: column; gap: 10px")}>
                    {c.sourceIds.map((sid) => {
                      const s = sourceById(sid);
                      if (!s) return null;
                      return (
                        <div key={sid} style={css("display: flex; flex-direction: column; gap: 4px")}>
                          <span style={{ fontWeight: 600 }}>{s.title}</span>
                          <span style={{ color: "#86A09D" }}>{s.review === "verified" ? "Verified" : "Confirm in the ordinance"}</span>
                          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#6EE7C8" }}>
                            Open the source
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div style={css("display: flex; flex-wrap: wrap; gap: 12px; margin-top: 64px; align-items: center")}>
        <LinkBtn href={`/plan/${property.id}?${query}`}>See your plan</LinkBtn>
        <LinkBtn href={`/photo/${property.id}?${query}`} variant="secondary">
          Check a window photo
        </LinkBtn>
        <span style={css("font-size: 14px; color: #86A09D; margin-left: 8px")}>A screening tool, not legal advice. Rules reviewed [date].</span>
      </div>
    </main>
  );
}
