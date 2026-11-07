import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-sonnet-5-5";

export function aiAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

type ImageInput = { mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"; base64: string };

/**
 * One-shot call to Claude. Returns null when no API key is set or the call fails,
 * so every caller must have a template fallback.
 */
export async function ask(prompt: string, opts: { image?: ImageInput; maxTokens?: number } = {}): Promise<string | null> {
  if (!aiAvailable()) return null;
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const content: Anthropic.ContentBlockParam[] = [];
    if (opts.image) {
      content.push({ type: "image", source: { type: "base64", media_type: opts.image.mediaType, data: opts.image.base64 } });
    }
    content.push({ type: "text", text: prompt });
    const res = await Promise.race([
      client.messages.create({ model: MODEL, max_tokens: opts.maxTokens ?? 700, messages: [{ role: "user", content }] }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 20000)),
    ]);
    const block = res.content.find((b) => b.type === "text");
    return block && block.type === "text" ? block.text : null;
  } catch {
    return null;
  }
}

/** Pulls the first JSON value out of a model reply. */
export function parseJson<T>(text: string | null): T | null {
  if (!text) return null;
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fence ? fence[1] : text;
  const start = body.search(/[\[{]/);
  const end = Math.max(body.lastIndexOf("}"), body.lastIndexOf("]"));
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(body.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

/** Removes dash characters the design forbids in visible text. */
export function noDashes(s: string): string {
  return s.replace(/\s*[–—]\s*/g, ", ").trim();
}
