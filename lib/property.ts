import { getProperty } from "@/lib/data";
import { fetchLiveProperty } from "@/lib/lookup";
import type { Property } from "@/lib/types";

/** Saved examples by id, or a live parcel by "live-<parcel id>". */
export async function getPropertyAny(id: string): Promise<Property | undefined> {
  if (id.startsWith("live-")) {
    return (await fetchLiveProperty(id.slice(5))) ?? undefined;
  }
  return getProperty(id);
}
