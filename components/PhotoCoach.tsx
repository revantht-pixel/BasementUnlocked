"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "@/lib/css";
import { Btn, Provenance } from "@/components/ui";

type Guide = { visible: string[]; cannotJudge: string[]; measureNext: string[]; concerns: string[]; generatedBy: "ai" | "example" };

const EXAMPLE: Guide = {
  visible: ["One window set high in a concrete foundation wall.", "A metal window well outside the glass, partly visible.", "A sliding window with two panels."],
  cannotJudge: ["How big the opening is when the window is fully open.", "How high the sill is above the finished floor.", "Whether the window well is wide enough to climb out of."],
  measureNext: ["Height of the clear opening with the window fully open.", "Width of the clear opening.", "Sill height from the finished floor.", "Width of the window well and how far it reaches out from the wall."],
  concerns: ["A sliding window often opens to only half its width, so measure the open panel, not the frame."],
  generatedBy: "example",
};

const PANEL = "padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)";
const BACK = "display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-size: 15px; color: #A9C0BE; text-decoration: none";

function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} style={css(BACK)}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M10 3 L5 8 L10 13" fill="none" stroke="#A9C0BE" style={{ strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }} />
      </svg>
      Back to your result
    </Link>
  );
}

const DIMS: [string, string][] = [
  ["A", "Opening height: at least [24] in"],
  ["B", "Opening width: at least [20] in"],
  ["C", "Sill: no higher than [44] in from floor"],
  ["D", "Clear opening: at least [5.7] sq ft"],
];

function Marker({ x, y, t }: { x: number; y: number; t: string }) {
  return (
    <>
      <circle cx={x} cy={y} r="11" fill="#0A1D20" stroke="#86A09D" style={{ strokeWidth: 1.25 }} />
      <text x={x} y={y + 4.5} fill="#E8F4F2" textAnchor="middle" style={{ fontSize: 13, fontWeight: 600 }}>
        {t}
      </text>
    </>
  );
}

function Elevation() {
  return (
    <svg width="460" height="430" viewBox="0 0 460 430" fill="none" role="img" aria-label="Night elevation of a basement egress window in a window well, with four measurements marked A to D" style={css("display: block; width: 100%; max-width: 100%; height: auto; font-family: Manrope, system-ui, sans-serif")}>
      <defs>
        <filter id="pc-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <pattern id="pc-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V8" stroke="#14292E" style={{ strokeWidth: 1 }} />
        </pattern>
        <radialGradient id="pc-spill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#061416" />
          <stop offset="100%" stopColor="#0A1D20" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="460" height="104" fill="url(#pc-sky)" />
      {[[48, 22, 1, 0.4], [112, 48, 0.8, 0.3], [176, 18, 1.1, 0.45], [262, 40, 0.9, 0.3], [318, 16, 1.2, 0.5], [386, 54, 0.8, 0.25], [426, 26, 1, 0.35]].map(([cx, cy, r, o]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#E8F4F2" opacity={o} />
      ))}
      <rect x="20" y="104" width="420" height="276" fill="#0B1D20" />
      <rect x="20" y="104" width="420" height="276" fill="url(#pc-hatch)" />
      <path d="M20 104H440" stroke="#2C4A4F" style={{ strokeWidth: 1.5 }} />
      <text x="24" y="94" fill="#86A09D" style={{ fontSize: 13 }}>Grade outside</text>
      <rect x="90" y="112" width="280" height="180" fill="#0A1D20" stroke="#5C7D82" style={{ strokeWidth: 1.25, strokeDasharray: "6 4" }} />
      <text x="96" y="310" fill="#86A09D" style={{ fontSize: 13 }}>Window well (outside)</text>
      <ellipse cx="250" cy="380" rx="180" ry="34" fill="url(#pc-spill)" />
      <rect x="180" y="170" width="140" height="100" fill="#6EE7C8" opacity="0.55" filter="url(#pc-bloom)" />
      <rect x="180" y="170" width="140" height="100" fill="#6EE7C8" opacity="0.9" />
      <rect x="188" y="178" width="124" height="84" fill="#FFE2B0" opacity="0.85" />
      <rect x="180" y="170" width="140" height="100" stroke="#5C7D82" style={{ strokeWidth: 1.5 }} />
      <path d="M250 170V270" stroke="#5C7D82" style={{ strokeWidth: 1.5 }} />
      <path d="M20 380H440" stroke="#2C4A4F" style={{ strokeWidth: 1.5 }} />
      <text x="24" y="402" fill="#86A09D" style={{ fontSize: 13 }}>Basement floor</text>
      <path d="M155 170V270M149 176l12-12M149 276l12-12M145 170h20M145 270h20" stroke="#86A09D" style={{ strokeWidth: 1 }} />
      <Marker x={130} y={220} t="A" />
      <path d="M180 150H320M174 156l12-12M314 156l12-12M180 140v20M320 140v20" stroke="#86A09D" style={{ strokeWidth: 1 }} />
      <Marker x={250} y={132} t="B" />
      <path d="M345 270V380M339 276l12-12M339 386l12-12M335 270h20M335 380h20" stroke="#86A09D" style={{ strokeWidth: 1 }} />
      <Marker x={372} y={325} t="C" />
      <Marker x={215} y={220} t="D" />
    </svg>
  );
}

export default function PhotoCoach({ propertyId }: { propertyId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Guide>(EXAMPLE);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function check() {
    if (!file) {
      setError("Choose a photo first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch("/api/photo-guide", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "That did not work. Try again.");
      } else {
        setResult(data as Guide);
        setChecked(true);
      }
    } catch {
      setError("That did not work. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const isExample = result.generatedBy === "example";
  const groups = [
    { title: "What AI can see", items: result.visible },
    { title: "What a photo can't tell", items: result.cannotJudge },
    { title: "Measure these next", items: result.measureNext },
    { title: "Concerns to raise with the city", items: result.concerns },
  ].filter((g) => g.items.length > 0);

  let statusText = "Example output. Choose your photo and press Check this photo.";
  if (busy) statusText = "Thinking...";
  else if (error) statusText = error;
  else if (checked) statusText = isExample ? "Example output. Add an Anthropic key to run live AI." : "Checked just now by AI.";

  const h2 = "font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; font-size: 36px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05";

  return (
    <main style={css("max-width: 1200px; margin: 0 auto; padding: 64px 32px 96px; box-sizing: border-box")}>
      <BackLink href={`/result/${propertyId}`} />
      <h1 className="rise" style={css("font-family: 'Space Grotesk', system-ui, sans-serif; margin: 20px 0 20px; font-size: 72px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.98; color: #E8F4F2; max-width: 14ch")}>
        Check a basement window
      </h1>
      <p className="rise2" style={css("margin: 0 0 80px; font-size: 20px; color: #A9C0BE; max-width: 60ch")}>
        Take a photo of the window you would use as an emergency exit. AI tells you what it can see and what to measure. It does not approve anything.
      </p>
      <div style={css("display: flex; flex-wrap: wrap; gap: 64px 56px; align-items: flex-start")}>
        <div className="rise3" style={css("flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 28px")}>
          <label htmlFor="photo" className="drop" style={css(`position: relative; display: block; ${PANEL}; cursor: pointer`)}>
            <span style={css("display: block; border-radius: 22px; padding: 16px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)")}>
              <span className="drop-in" style={css("display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; min-height: 300px; box-sizing: border-box; padding: 28px; border: 1px dashed rgba(255,255,255,0.18); border-radius: 16px; text-align: center; transition: border-color 500ms cubic-bezier(0.32,0.72,0,1)")}>
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Your chosen photo of the basement window" style={css("display: block; max-width: 100%; max-height: 260px; border-radius: 12px; object-fit: contain")} />
                ) : (
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                    <rect x="6" y="15" width="44" height="31" rx="6" stroke="#A9C0BE" style={{ strokeWidth: 1.25 }} />
                    <path d="M20 15 L23.5 9.5 H32.5 L36 15" stroke="#A9C0BE" style={{ strokeWidth: 1.25, strokeLinejoin: "round" }} />
                    <circle cx="28" cy="30" r="8.5" stroke="#A9C0BE" style={{ strokeWidth: 1.25 }} />
                    <circle cx="28" cy="30" r="3" fill="#6EE7C8" />
                    <circle cx="43" cy="21" r="1.2" fill="#A9C0BE" />
                  </svg>
                )}
                <span style={css("font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: #E8F4F2")}>Choose a photo of the window</span>
                <span style={css("font-size: 15px; color: #86A09D; max-width: 44ch")}>Stand inside the basement and include the whole window and the floor below it.</span>
                <span style={css("margin-top: 6px; display: inline-flex; align-items: center; height: 32px; padding: 0 14px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 14px; color: #A9C0BE")}>
                  {file ? `Chosen: ${file.name}` : "No photo chosen yet"}
                </span>
              </span>
            </span>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError("");
              }}
              style={css("position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); border: 0; opacity: 0")}
            />
          </label>
          <div style={css("display: flex; flex-wrap: wrap; gap: 14px 20px; align-items: center")}>
            <Btn type="button" onClick={check} disabled={busy}>
              Check this photo
            </Btn>
            <span role="status" aria-atomic="true" style={css("font-size: 15px; color: #86A09D; max-width: 44ch")}>
              {statusText}
            </span>
          </div>
          <section aria-labelledby="seen-heading" style={css("display: flex; flex-direction: column; gap: 20px; margin-top: 40px")}>
            <h2 id="seen-heading" style={css(h2)}>What the photo shows</h2>
            <div style={css("display: flex; flex-wrap: wrap; gap: 16px")}>
              {groups.map((g) => (
                <div key={g.title} style={css(`flex: 1 1 200px; min-width: 0; ${PANEL}`)}>
                  <div style={css("height: 100%; box-sizing: border-box; border-radius: 22px; padding: 24px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 14px")}>
                    <h3 style={css("margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.3; color: #E8F4F2")}>
                      <Provenance kind="ai_observation" text={g.title} size={17} />
                    </h3>
                    <ul style={css("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; font-size: 15px; line-height: 1.5; color: #A9C0BE")}>
                      {g.items.map((t) => (
                        <li key={t} style={css("padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <p style={css("margin: 0; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #86A09D")}>
              <Provenance kind="ai_observation" text={isExample ? "Example output. Add an Anthropic key to run live AI." : "Written by AI from your photo. It cannot change a result."} size={14} />
            </p>
          </section>
        </div>
        <figure style={css(`flex: 1 1 440px; min-width: 0; margin: 0; ${PANEL}`)}>
          <div style={css("border-radius: 22px; padding: 24px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 20px")}>
            <Elevation />
            <figcaption style={css("display: flex; flex-direction: column; gap: 14px")}>
              <dl style={css("margin: 0; display: flex; flex-direction: column; font-size: 15px; font-variant-numeric: tabular-nums")}>
                {DIMS.map(([k, t], i) => (
                  <div key={k} style={css(`display: flex; align-items: center; gap: 14px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); ${i === DIMS.length - 1 ? "border-bottom: 1px solid rgba(255,255,255,0.06)" : ""}`)}>
                    <dt style={css("flex: none; width: 24px; height: 24px; box-sizing: border-box; border-radius: 999px; border: 1.25px solid #86A09D; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #E8F4F2")}>{k}</dt>
                    <dd style={css("margin: 0; color: #A9C0BE")}>{t}</dd>
                  </div>
                ))}
              </dl>
              <p style={css("margin: 0; font-size: 14px; color: #86A09D")}>Typical residential egress rules (IRC R310). Confirm with Salt Lake City Building Services.</p>
            </figcaption>
          </div>
        </figure>
      </div>
      <p style={css("margin: 96px 0 0; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.07)")}>
        <BackLink href={`/result/${propertyId}`} />
      </p>
    </main>
  );
}
