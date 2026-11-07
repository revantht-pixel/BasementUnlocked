import { ask, noDashes, parseJson } from "@/lib/ai";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type MediaType = (typeof TYPES)[number];

type Guide = { visible: string[]; cannotJudge: string[]; measureNext: string[]; concerns: string[] };

const EXAMPLE: Guide = {
  visible: [
    "One window set high in a concrete foundation wall.",
    "A metal window well outside the glass, partly visible.",
    "A sliding window with two panels.",
  ],
  cannotJudge: [
    "How big the opening is when the window is fully open.",
    "How high the sill is above the finished floor.",
    "Whether the window well is wide enough to climb out of.",
  ],
  measureNext: [
    "Height of the clear opening with the window fully open.",
    "Width of the clear opening.",
    "Sill height from the finished floor.",
    "Width of the window well and how far it reaches out from the wall.",
  ],
  concerns: ["A sliding window often opens to only half its width, so measure the open panel, not the frame."],
};

// A number followed by a unit, or the inch and foot symbols after a digit.
const MEASUREMENT = /\d+(\.\d+)?\s*(in\b|inch|inches|ft\b|feet|foot|cm\b|mm\b|m\b|sq\b|square|["'”’])/i;
// Anything that sounds like a verdict. Matches whole words and phrases.
const VERDICT = /\b(complies|comply|complying|compliant|compliance|meets? (the )?(code|requirements?|standards?)|passes|passed|pass|approved|approve|legal|legally|illegal|code[- ]compliant|up to code)\b/i;

function clean(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .filter((s) => !MEASUREMENT.test(s) && !VERDICT.test(s))
    .map((s) => noDashes(s))
    .filter(Boolean)
    .slice(0, 6);
}

const PROMPT = `This is a homeowner's photo of a basement window they might use as an emergency exit (egress). Describe only what is visible in the photo.

Rules you must follow:
- Never say whether anything passes, meets code, complies, is legal or is approved. Give no verdict of any kind.
- Never invent or estimate a dimension, distance, size or number. Do not write any measurement.
- Use short plain sentences and no dashes as punctuation.

Reply with only JSON of this shape:
{"visible":["..."],"cannotJudge":["..."],"measureNext":["..."],"concerns":["..."]}
visible: 2 to 5 things you can see. cannotJudge: 2 to 4 things a photo cannot tell. measureNext: 2 to 5 things to measure with a tape measure, named without any numbers. concerns: 0 to 3 things worth raising with the city. If the photo does not show a window, say so in visible and leave the other lists empty.`;

export async function POST(req: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Send the photo as multipart form data." }, { status: 400 });
  }
  const file = form.get("photo");
  if (!(file instanceof File)) return Response.json({ error: "Choose a photo first." }, { status: 400 });
  if (!(TYPES as readonly string[]).includes(file.type)) {
    return Response.json({ error: "Use a JPEG, PNG, WebP or GIF photo." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) return Response.json({ error: "That photo is over 5 MB. Choose a smaller one." }, { status: 413 });

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const text = await ask(PROMPT, { image: { mediaType: file.type as MediaType, base64 }, maxTokens: 900 });
  const parsed = parseJson<Partial<Guide>>(text);
  if (parsed) {
    const result: Guide = {
      visible: clean(parsed.visible),
      cannotJudge: clean(parsed.cannotJudge),
      measureNext: clean(parsed.measureNext),
      concerns: clean(parsed.concerns),
    };
    if (result.visible.length > 0) return Response.json({ ...result, generatedBy: "ai" });
  }
  return Response.json({ ...EXAMPLE, generatedBy: "example" });
}

/** Claude calls can take longer than the default serverless limit. */
export const maxDuration = 30;
