import { lookupAddress } from "@/lib/lookup";

export async function GET(req: Request): Promise<Response> {
  const address = new URL(req.url).searchParams.get("address")?.trim() ?? "";
  if (!address) return Response.json({ scope: "unavailable" });
  return Response.json(await lookupAddress(address));
}
