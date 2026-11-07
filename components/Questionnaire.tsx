"use client";

import { useState } from "react";
import HouseScene from "@/components/HouseScene";
import { LinkBtn } from "@/components/ui";
import { css } from "@/lib/css";
import { answersToQuery } from "@/lib/data";
import type { Answers } from "@/lib/types";

type Def = { key: keyof Answers; question: string; help: string; options: [string, string][] };

const DEFS: Def[] = [
  { key: "dwellingType", question: "What kind of home is it?", help: "Basement apartments apply to a single-family house.", options: [["house", "Detached single-family house"], ["other", "Duplex, townhome or other"], ["unknown", "I don't know"]] },
  { key: "existingSecondUnit", question: "Is there already a second unit on the property?", help: "Salt Lake City allows one accessory unit per property.", options: [["no", "No"], ["yes", "Yes"], ["unknown", "I don't know"]] },
  { key: "ownerLivesOnSite", question: "Will you live in the main house while you rent the basement?", help: "Salt Lake City generally requires the owner to live on the property, with some exceptions.", options: [["yes", "Yes"], ["no", "No"], ["unknown", "I don't know"]] },
  { key: "rentalLength", question: "How long would each rental be?", help: "Rentals under 30 days can be banned.", options: [["long", "30 days or more"], ["short", "Less than 30 days"], ["unknown", "I don't know"]] },
  { key: "parkingAvailable", question: "Is there room to park one more car on your property?", help: "The city may require one extra on-site space.", options: [["yes", "Yes"], ["no", "No"], ["unknown", "I don't know"]] },
  { key: "bedrooms", question: "How many bedrooms would the basement unit have?", help: "Used for the rent estimate.", options: [["0", "Studio"], ["1", "1 bedroom"], ["2", "2 bedrooms"], ["unknown", "I don't know"]] },
];

/** Skipped questions count as "I don't know". */
const INITIAL: Answers = {
  dwellingType: "unknown",
  existingSecondUnit: "unknown",
  ownerLivesOnSite: "unknown",
  rentalLength: "unknown",
  parkingAvailable: "unknown",
  bedrooms: "unknown",
};

const OPT_BASE = "display: flex; align-items: center; gap: 16px; width: 100%; min-height: 60px; padding: 0 24px 0 20px; border-radius: 999px; cursor: pointer; font-size: 18px; color: #E8F4F2; box-sizing: border-box; position: relative; ";
const OPT_OFF = OPT_BASE + "border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); font-weight: 400;";
const OPT_ON = OPT_BASE + "border: 1px solid #6EE7C8; background: rgba(110,231,200,0.12); font-weight: 500;";

export default function Questionnaire({ id }: { id: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const [touched, setTouched] = useState<Set<keyof Answers>>(new Set());

  const q = DEFS[step];
  const isFirst = step === 0;
  const isLast = step === DEFS.length - 1;
  const pct = Math.round(((step + 1) / DEFS.length) * 100);
  const answered = touched.size;
  const known = DEFS.filter((d) => touched.has(d.key) && answers[d.key] !== "unknown").length;
  const progress = known / DEFS.length;

  const oc = touched.has("ownerLivesOnSite") ? answers.ownerLivesOnSite : "unknown";
  const pk = touched.has("parkingAvailable") ? answers.parkingAvailable : "unknown";
  const person = oc === "yes" ? 1 : oc === "unknown" ? 0.35 : 0;
  const car = pk === "yes" ? 1 : pk === "unknown" ? 0.35 : 0.08;

  function pick(value: string) {
    setAnswers((a) => ({ ...a, [q.key]: value }) as Answers);
    setTouched((t) => new Set(t).add(q.key));
  }

  return (
    <main style={css("max-width: 1200px; margin: 0 auto; padding: 56px 32px 0; box-sizing: border-box")}>
      <div style={css("display: flex; flex-wrap: wrap; gap: 64px; align-items: flex-start")}>
        <div style={css("flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 28px")}>
          <div style={css("display: flex; flex-direction: column; gap: 12px")}>
            <div style={css("display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 8px 16px")}>
              <p style={css("margin: 0; font-size: 15px; color: #86A09D")}>Step 2 of 3: Tell us about your plans</p>
              <p role="status" aria-atomic="true" style={css("margin: 0; font-size: 15px; font-weight: 500; color: #E8F4F2; font-variant-numeric: tabular-nums")}>
                Question {step + 1} of {DEFS.length}
              </p>
            </div>
            <div aria-hidden="true" style={css("position: relative; height: 2px; border-radius: 999px; background: rgba(255,255,255,0.08)")}>
              <div className="fade" style={css(`position: absolute; left: 0; top: 0; height: 2px; border-radius: 999px; background: #6EE7C8; box-shadow: 0 0 12px rgba(110,231,200,0.6); width: ${pct}%; transition: width 700ms cubic-bezier(0.32,0.72,0,1)`)} />
            </div>
          </div>
          <fieldset key={q.key} style={css("margin: 0; padding: 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 0")}>
            <legend className="rise" style={css("font-family: var(--font-space), 'Space Grotesk', system-ui, sans-serif; padding: 0; margin-bottom: 16px; font-size: 48px; font-weight: 600; letter-spacing: -0.04em; line-height: 1.02; color: #E8F4F2")}>
              {q.question}
            </legend>
            <p className="rise2" style={css("margin: 0 0 28px; font-size: 18px; color: #A9C0BE; max-width: 60ch")}>{q.help}</p>
            <div className="rise3" style={css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
              <div style={css("border-radius: 22px; padding: 28px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px")}>
                {q.options.map(([value, label]) => {
                  const selected = touched.has(q.key) && answers[q.key] === value;
                  return (
                    <label key={value} className="opt" htmlFor={`${q.key}-${value}`} style={css(selected ? OPT_ON : OPT_OFF)}>
                      <input type="radio" id={`${q.key}-${value}`} name={q.key} checked={selected} onChange={() => pick(value)} />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </fieldset>
          <div style={css("display: flex; flex-wrap: wrap; gap: 12px")}>
            <button
              type="button"
              className="btn"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={isFirst}
              style={css(
                `display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 24px 0 8px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #E8F4F2; font-family: inherit; font-weight: 600; font-size: 16px; white-space: nowrap; box-sizing: border-box; ${isFirst ? "opacity: 0.4; cursor: not-allowed;" : "cursor: pointer;"}`,
              )}
            >
              <span className="btn-ic" style={css("width: 40px; height: 40px; border-radius: 999px; background: rgba(255,255,255,0.08); display: inline-flex; align-items: center; justify-content: center")}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M12 8 H4 M7.5 4.5 L4 8 L7.5 11.5" fill="none" stroke="#E8F4F2" style={css("stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round")} />
                </svg>
              </span>
              Back
            </button>
            {isLast ? (
              <LinkBtn href={`/result/${id}?${answersToQuery(answers)}`}>See my result</LinkBtn>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={() => setStep((s) => Math.min(DEFS.length - 1, s + 1))}
                style={css(
                  "display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 8px 0 24px; border-radius: 999px; background: #6EE7C8; color: #052520; font-family: inherit; font-weight: 600; font-size: 16px; border: 0; white-space: nowrap; cursor: pointer; box-shadow: 0 0 32px rgba(110,231,200,0.22)",
                )}
              >
                Continue
                <span className="btn-ic" style={css("width: 40px; height: 40px; border-radius: 999px; background: rgba(5,37,32,0.14); display: inline-flex; align-items: center; justify-content: center")}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4 12 L12 4 M6 4 H12 V10" fill="none" stroke="#052520" style={css("stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round")} />
                  </svg>
                </span>
              </button>
            )}
          </div>
          <p style={css("margin: 0; font-size: 14px; color: #86A09D")}>Skipped questions count as I don&apos;t know. Nothing you answer is saved.</p>
        </div>
        <figure style={css("flex: 1 1 440px; min-width: 0; margin: 0; display: flex; flex-direction: column; gap: 14px")}>
          <div style={css("padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}>
            <div style={css("border-radius: 22px; overflow: hidden; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
              <HouseScene
                label={`Night drawing of your house, updated from ${answered} of ${DEFS.length} answers. Lit parts are what you told us. Dashed parts are unknown.`}
                dim={0.88 * (1 - progress)}
                spill={0.2 + 0.8 * progress}
                person={person}
                car={car}
                showDimension={false}
              />
            </div>
          </div>
          <figcaption style={css("font-size: 14px; color: #86A09D; padding: 0 8px")}>The basement lights up as you answer. Faded parts are things you were not sure about.</figcaption>
        </figure>
      </div>
    </main>
  );
}
