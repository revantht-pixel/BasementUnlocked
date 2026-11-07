import { PROPERTIES } from "./data";

export type LookupResult = { scope: "ok"; propertyId: string } | { scope: "outside" } | { scope: "unavailable" };

// Everything below the saved-property match is UNVERIFIED best effort. Not required for the demo.
const TIMEOUT_MS = 6000;
// TODO: unverified service URL for UGRC municipal boundaries. Confirm the layer and the NAME field.
const MUNICIPAL_BOUNDARIES_URL = "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahMunicipalBoundaries/FeatureServer/0/query";
const PARCELS_URL = "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Parcels_SaltLake_LIR/FeatureServer/0/query";
const PARCEL_FIELDS = "PARCEL_ID,PARCEL_ADD,PROP_CLASS,BUILT_YR,BLDG_SQFT,PARCEL_ACRES,HOUSE_CNT";

const NEIGHBORHOODS = ["sugar house", "avenues", "rose park"];

export function matchSaved(address: string): string | null {
  const q = address.toLowerCase();
  for (const p of PROPERTIES) {
    if (q.includes(p.id.toLowerCase())) return p.id;
  }
  for (const n of NEIGHBORHOODS) {
    if (q.includes(n)) {
      const hit = PROPERTIES.find((p) => p.id === n.replace(" ", "-"));
      if (hit) return hit.id;
    }
  }
  return null;
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function lookupAddress(address: string): Promise<LookupResult> {
  const saved = matchSaved(address);
  if (saved) return { scope: "ok", propertyId: saved };

  const key = process.env.UGRC_API_KEY;
  if (!key) return { scope: "unavailable" };

  try {
    // Unverified: UGRC geocode. Street is the part before the first comma, zone is the rest or "SLC".
    const [streetRaw, ...rest] = address.split(",");
    const street = streetRaw.trim();
    const zone = rest.join(" ").trim() || "SLC";
    if (!street) return { scope: "unavailable" };
    const geo = (await getJson(
      `https://api.mapserv.utah.gov/api/v1/geocode/${encodeURIComponent(street)}/${encodeURIComponent(zone)}?apiKey=${encodeURIComponent(key)}&spatialReference=4326`,
    )) as { result?: { location?: { x?: number; y?: number } } };
    const x = geo.result?.location?.x;
    const y = geo.result?.location?.y;
    if (typeof x !== "number" || typeof y !== "number") return { scope: "unavailable" };

    // Unverified: point-in-polygon against municipal boundaries.
    const point = `geometry=${x},${y}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects`;
    const city = (await getJson(`${MUNICIPAL_BOUNDARIES_URL}?where=1%3D1&${point}&outFields=NAME&returnGeometry=false&f=json`)) as {
      features?: { attributes?: { NAME?: string } }[];
    };
    const name = city.features?.[0]?.attributes?.NAME;
    if (!name) return { scope: "unavailable" };
    if (name.trim().toLowerCase() !== "salt lake city") return { scope: "outside" };

    // Unverified: parcel lookup. The result is fetched but not yet used.
    await getJson(`${PARCELS_URL}?where=1%3D1&${point}&outFields=${PARCEL_FIELDS}&returnGeometry=false&f=json`);
    // TODO: map the live parcel into a Property and keep it in an in-memory store, then return { scope: "ok", propertyId }.
    return { scope: "unavailable" };
  } catch {
    return { scope: "unavailable" };
  }
}
