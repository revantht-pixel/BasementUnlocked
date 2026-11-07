import type { RentEstimate } from "./types";

const FMR_URL = "https://www.huduser.gov/hudapi/public/fmr/data/4903599999?year=2026";

/**
 * Best-effort HUD Fair Market Rent lookup for Salt Lake County.
 * NOTE: the endpoint shape and field names below are unverified against the live API.
 * Any failure (missing token, timeout, unexpected shape) returns null and the UI shows placeholders.
 */
export async function getRent(bedrooms: string): Promise<RentEstimate | null> {
  const token = process.env.HUD_API_TOKEN;
  if (!token) return null;
  const n = bedrooms === "0" ? 0 : bedrooms === "2" ? 2 : 1;
  const field = n === 0 ? "Efficiency" : n === 1 ? "One-Bedroom" : "Two-Bedroom";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(FMR_URL, { headers: { Authorization: `Bearer ${token}` }, signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { basicdata?: unknown } };
    const raw = json?.data?.basicdata;
    const basic = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | undefined;
    if (!basic) return null;
    const low = Number(String(basic[field] ?? "").replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(low) || low <= 0) return null;
    return {
      bedrooms: n,
      low: Math.round(low),
      high: Math.round(low * 1.15),
      area: "Salt Lake County",
      fiscalYear: "2026",
      sourceUrl: "https://www.huduser.gov/portal/datasets/fmr.html",
    };
  } catch {
    return null;
  }
}
