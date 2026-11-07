import type { CSSProperties } from "react";

/**
 * Turns an inline CSS string into a React style object, so markup from the design canvas
 * can be pasted in as css("...") with no manual conversion.
 */
export function css(input: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of input.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) continue;
    let key = prop;
    if (!prop.startsWith("--")) {
      key = prop.replace(/^-webkit-/, "webkit-").replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      if (key.startsWith("webkit")) key = "W" + key.slice(1);
    }
    out[key] = val;
  }
  return out as CSSProperties;
}
