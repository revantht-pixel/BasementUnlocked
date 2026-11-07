"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Btn, Provenance, STATUS_COLOR, STATUS_LABEL } from "@/components/ui";
import { css } from "@/lib/css";
import { answersToQuery } from "@/lib/data";
import { buildTemplatePlan, emailToPlainText } from "@/lib/plan";
import { screen } from "@/lib/screen";
import type { Answers, CitedSentence, CheckStatus, Property, RentEstimate } from "@/lib/types";

const SUP = "margin-left: 4px; font-size: 12px; font-weight: 600; color: #6EE7C8; font-variant-numeric: tabular-nums";
const H2 = "font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05";
const SECONDARY_BTN =
  "display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 8px 0 24px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #E8F4F2; font-family: inherit; font-weight: 600; font-size: 16px; text-decoration: none; white-space: nowrap; cursor: pointer; box-sizing: border-box";
const ICON = "width: 40px; height: 40px; border-radius: 999px; background: rgba(255,255,255,0.08); display: inline-flex; align-items: center; justify-content: center";

const STEPS = [
  "Send the email to Salt Lake City Planning.",
  "Measure your basement windows, ceiling height and exit path.",
  "Ask about a building permit and the inspections it needs.",
  "Ask about any rental permit or license before you rent.",
];

function Keys({ checks }: { checks: number[] }) {
  return (
    <>
      {checks.map((n) => (
        <sup key={n} aria-label={`Check ${n}`} style={css(SUP)}>
          {n}
        </sup>
      ))}
    </>
  );
}

function KeyMark({ n, status }: { n: number; status: CheckStatus }) {
  const base = "flex: none; width: 28px; height: 28px; box-sizing: border-box; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums;";
  const s =
    status === "met"
      ? "background: #6EE7C8; color: #052520; filter: drop-shadow(0 0 6px rgba(110,231,200,0.6));"
      : status === "unknown"
        ? "border: 1.5px solid #9DB4D8; background: #0A1D20; color: #9DB4D8;"
        : status === "not_met"
          ? "border: 1.5px dashed #FF7A6B; background: #0A1D20; color: #FF7A6B;"
          : "border: 1.5px solid rgba(255,255,255,0.25); color: #86A09D;";
  return (
    <span aria-hidden="true" style={css(base + s)}>
      {n}
    </span>
  );
}

export default function PlanView({ property, answers, rent }: { property: Property; answers: Answers; rent: RentEstimate | null }) {
  const report = useMemo(() => screen(property, answers, rent), [property, answers, rent]);
  const template = useMemo(() => buildTemplatePlan(report), [report]);
  const [summary, setSummary] = useState<CitedSentence[]>(template.summary);
  const [email, setEmail] = useState<CitedSentence[]>(template.email);
  const [mode, setMode] = useState<"example" | "thinking" | "ai" | "template" | "error">("example");
  const [copied, setCopied] = useState(false);

  const busy = mode === "thinking";
  const subject = `Questions about a basement apartment at ${property.address}`;
  const plain = emailToPlainText(email, property.address);
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}`;
  const query = answersToQuery(answers);

  async function write() {
    setMode("thinking");
    setCopied(false);
    try {
      const res = await fetch("/api/explain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report }) });
      if (!res.ok) throw new Error("bad");
      const data = (await res.json()) as { summary: CitedSentence[]; email: CitedSentence[]; generatedBy: "ai" | "template" };
      if (!data.email?.length) throw new Error("empty");
      setSummary(data.summary);
      setEmail(data.email);
      setMode(data.generatedBy);
    } catch {
      setMode("error");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  let statusText = "Example output built from your checks. Press Write the email to have AI write it.";
  if (mode === "thinking") statusText = "Thinking...";
  else if (mode === "error") statusText = "That did not work. Try again.";
  else if (mode === "ai") statusText = "Written just now by AI from your 9 checks.";
  else if (mode === "template") statusText = "Example output. Add an Anthropic key to run live AI.";

  const secondaryIcon = (
    <span className="btn-ic" style={css(ICON)}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 12 L12 4 M6 4 H12 V10" fill="none" stroke="#E8F4F2" style={{ strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }} />
      </svg>
    </span>
  );

  return (
    <main className="plan-root" style={css("max-width: 1200px; margin: 0 auto; padding: 64px 32px 96px; box-sizing: border-box")}>
      <style>{`@media print{.plan-root,.plan-root *{color:#000 !important;background:transparent !important;border-color:#999 !important;box-shadow:none !important;filter:none !important}.plan-root{padding:0 !important}}`}</style>
      <Link href={`/result/${property.id}?${query}`} className="no-print" style={css("display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-size: 15px; color: #A9C0BE; text-decoration: none")}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 3 L5 8 L10 13" fill="none" stroke="#A9C0BE" style={{ strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }} />
        </svg>
        Back to your result
      </Link>
      <h1 className="rise" style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 20px 0 20px; font-size: 72px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; color: #E8F4F2; max-width: 14ch")}>
        Your basement plan
      </h1>
      <p className="rise2" style={css("margin: 0 0 88px; font-size: 20px; color: #A9C0BE; max-width: 60ch")}>
        For {property.address}. Built from your 9 checks. Numbers after each sentence point to the check it comes from.
      </p>
      <div style={css("display: flex; flex-wrap: wrap; gap: 64px 56px; align-items: flex-start")}>
        <div className="rise3" style={css("flex: 999 1 600px; min-width: 0; display: flex; flex-direction: column; gap: 28px")}>
          <div style={css("display: flex; flex-direction: column; gap: 10px")}>
            <h2 id="email-heading" style={css(H2 + "; font-size: 36px")}>
              Your email to Salt Lake City Planning
            </h2>
            <p style={css("margin: 0; font-size: 15px; color: #86A09D")}>A starting point you can edit before you send it.</p>
          </div>
          <div className="no-print" style={css("display: flex; flex-wrap: wrap; gap: 14px 20px; align-items: center")}>
            <Btn type="button" onClick={write} disabled={busy}>
              Write the email
            </Btn>
            <span role="status" aria-atomic="true" style={css("font-size: 15px; color: #86A09D; max-width: 46ch")}>
              {statusText}
            </span>
          </div>
          <section aria-labelledby="email-heading" style={css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
            <div style={css("position: relative; overflow: hidden; border-radius: 22px; padding: 36px 40px 40px; background: radial-gradient(120% 60% at 0% 0%, rgba(110,231,200,0.06) 0%, rgba(110,231,200,0) 60%), rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
              <dl style={css("margin: 0 0 28px; display: flex; flex-direction: column; font-size: 16px")}>
                {[
                  ["To", "[Salt Lake City Planning contact]"],
                  ["Subject", subject],
                ].map(([dt, dd]) => (
                  <div key={dt} style={css("display: flex; flex-wrap: wrap; gap: 4px 20px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.07)")}>
                    <dt style={css("width: 72px; color: #86A09D; font-size: 14px; line-height: 1.7")}>{dt}</dt>
                    <dd style={css("margin: 0; flex: 1 1 280px; min-width: 0; color: #E8F4F2; font-weight: 500")}>{dd}</dd>
                  </div>
                ))}
              </dl>
              <div style={css("display: flex; flex-direction: column; gap: 18px; font-size: 18px; color: #A9C0BE; line-height: 1.6")}>
                <p style={{ margin: 0 }}>Hello,</p>
                {email.map((e, i) => (
                  <p key={i} style={css("margin: 0; max-width: 60ch")}>
                    {e.text.replace(/\[Street address\]/g, property.address)}
                    <Keys checks={e.checks} />
                  </p>
                ))}
                <p style={css("margin: 8px 0 0")}>Thank you,</p>
                <p style={css("margin: 0; color: #E8F4F2")}>[Your name]</p>
              </div>
            </div>
          </section>
          <div className="no-print" style={css("display: flex; flex-wrap: wrap; gap: 12px; align-items: center")}>
            <button type="button" className="btn" onClick={copy} style={css(SECONDARY_BTN)}>
              Copy email
              <span className="btn-ic" style={css(ICON)}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="5.5" y="5.5" width="7" height="7" rx="1.5" fill="none" stroke="#E8F4F2" style={{ strokeWidth: 1.5 }} />
                  <path d="M3.5 10.5 V4.5 C3.5 3.95 3.95 3.5 4.5 3.5 H10.5" fill="none" stroke="#E8F4F2" style={{ strokeWidth: 1.5, strokeLinecap: "round" }} />
                </svg>
              </span>
            </button>
            <a href={mailto} className="btn" style={css(SECONDARY_BTN)}>
              Open in mail app
              {secondaryIcon}
            </a>
            <button type="button" className="btn" onClick={() => window.print()} style={css(SECONDARY_BTN)}>
              Print one page
              {secondaryIcon}
            </button>
            <span role="status" aria-atomic="true" style={css("font-size: 15px; font-weight: 500; color: #6EE7C8")}>
              {copied ? "Email copied" : ""}
            </span>
          </div>
          <p className="no-print" style={css("margin: 0; font-size: 14px; color: #86A09D")}>
            The keynote numbers are left out when you copy the email.
          </p>
          <section aria-labelledby="plain-heading" style={css("display: flex; flex-direction: column; gap: 16px; margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.07)")}>
            <h2 id="plain-heading" style={css(H2 + "; margin: 0 0 4px; font-size: 34px")}>
              In plain English
            </h2>
            {summary.map((s, i) => (
              <p key={i} style={css("margin: 0; font-size: 18px; color: #A9C0BE; max-width: 60ch")}>
                {s.text}
                <Keys checks={s.checks} />
              </p>
            ))}
          </section>
        </div>
        <aside style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 72px")}>
          <section aria-labelledby="keys-heading" style={css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
            <div style={css("border-radius: 22px; padding: 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
              <h2 id="keys-heading" style={css("margin: 0 0 6px; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1")}>
                Keynotes
              </h2>
              <p style={css("margin: 0 0 18px; font-size: 14px; color: #86A09D")}>Your 9 checks, by number.</p>
              <ol style={css("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column")}>
                {report.results.map((c) => (
                  <li key={c.n} style={css("display: flex; gap: 14px; align-items: center; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                    <KeyMark n={c.n} status={c.status} />
                    <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                      <span style={css("font-size: 16px; font-weight: 500; line-height: 1.3; color: #E8F4F2")}>{c.title}</span>
                      <span style={css(`font-size: 14px; color: ${STATUS_COLOR[c.status]}`)}>{STATUS_LABEL[c.status]}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section aria-labelledby="next-heading">
            <h2 id="next-heading" style={css(H2 + "; margin: 0 0 20px; font-size: 34px")}>
              Next steps
            </h2>
            <ol style={css("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column")}>
              {STEPS.map((t, i) => (
                <li key={t} style={css(`display: flex; gap: 20px; align-items: baseline; padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.07);${i === STEPS.length - 1 ? " border-bottom: 1px solid rgba(255,255,255,0.07);" : ""}`)}>
                  <span aria-hidden="true" style={css(`font-family: 'Space Grotesk', system-ui, sans-serif; flex: none; width: 40px; font-size: 44px; font-weight: 300; letter-spacing: -0.04em; line-height: 1; color: ${i === 0 ? "#6EE7C8" : "#86A09D"}; font-variant-numeric: tabular-nums`)}>{i + 1}</span>
                  <span style={css("font-size: 17px; color: #A9C0BE")}>{t}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
      <p style={css("margin: 96px 0 0; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.07)")}>
        <Provenance kind="ai_observation" text="Written by AI from your checks. It cannot change a result." size={14} />
      </p>
    </main>
  );
}
