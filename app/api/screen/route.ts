import { parseAnswers, getProperty } from "@/lib/data";
import { screen } from "@/lib/screen";

export async function POST(req: Request) {
  let body: { propertyId?: string; answers?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const property = body.propertyId ? getProperty(body.propertyId) : undefined;
  if (!property) return Response.json({ error: "Unknown property" }, { status: 404 });
  return Response.json(screen(property, parseAnswers(body.answers ?? {})));
}
