/**
 * Live address lookup. Needs no API key.
 *
 * 1. Parcel: search Salt Lake County parcel records by street address (Parcels_SaltLake_LIR).
 * 2. City: query the UGRC municipal boundary layer at the parcel's location. The parcel's own
 *    PARCEL_CITY field is the mailing city and is never used for jurisdiction.
 * 3. Zone: query the Salt Lake City zoning layer at the same location.
 *
 * All three services were queried successfully on 2026-11-06. Property ids for live results are
 * "live-<parcel id>", so pages can rebuild the record on demand (no database).
 */
import { PROPERTIES } from "@/lib/data";
import type { Property } from "@/lib/types";

const PARCELS = "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Parcels_SaltLake_LIR/FeatureServer/0/query";
const BOUNDARIES = "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/UtahMunicipalBoundaries/FeatureServer/0/query";
const ZONING = "https://maps.slc.gov/server/rest/services/Hosted/Zoning/FeatureServer/5/query";
const TIMEOUT_MS = 8000;

export type LookupResult =
  | { scope: "ok"; propertyId: string }
  | { scope: "outside"; city: string | null }
  | { scope: "notfound" }
  | { scope: "not_residential"; propertyClass: string | null }
  | { scope: "unavailable" };

const DIRECTIONS: Record<string, string> = { NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W" };
const SUFFIXES: Record<string, string> = {
  STREET: "ST", AVENUE: "AVE", ROAD: "RD", DRIVE: "DR", COURT: "CT", LANE: "LN", BOULEVARD: "BLVD",
  CIRCLE: "CIR", PLACE: "PL", TERRACE: "TER", PARKWAY: "PKWY", HIGHWAY: "HWY", TRAIL: "TRL",
};

/** "1216 East Driggs Avenue, Salt Lake City, UT 84106" becomes "1216 E DRIGGS AVE", the county's format. */
export function normalizeStreet(input: string): string {
  let s = input.split(",")[0].toUpperCase().replace(/[.#]/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/\b(APT|UNIT|STE|SUITE)\b.*$/, "").trim();
  return s
    .split(" ")
    .map((t) => DIRECTIONS[t] ?? SUFFIXES[t] ?? t)
    .join(" ");
}

function titleAddress(s: string): string {
  return s
    .split(" ")
    .map((t) => {
      if (t.length === 1) return t;
      if (/^\d+(ST|ND|RD|TH)$/.test(t)) return t.toLowerCase();
      if (/^\d+$/.test(t)) return t;
      return t.charAt(0) + t.slice(1).toLowerCase();
    })
    .join(" ");
}

async function arcgis(url: string, params: Record<string, string>): Promise<{ features?: Array<{ attributes: Record<string, unknown>; geometry?: { rings?: number[][][] } }> } | null> {
  try {
    const qs = new URLSearchParams({ f: "json", ...params });
    const res = await fetch(`${url}?${qs.toString()}`, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.error ? null : data;
  } catch {
    return null;
  }
}

function centroid(rings?: number[][][]): { x: number; y: number } | null {
  const ring = rings?.[0];
  if (!ring?.length) return null;
  const x = ring.reduce((sum, p) => sum + p[0], 0) / ring.length;
  const y = ring.reduce((sum, p) => sum + p[1], 0) / ring.length;
  return { x, y };
}

type ParcelRow = { attributes: Record<string, unknown>; geometry?: { rings?: number[][][] } };

async function findParcels(where: string): Promise<ParcelRow[] | null> {
  const data = await arcgis(PARCELS, {
    where,
    outFields: "PARCEL_ID,PARCEL_ADD,PROP_CLASS,BUILT_YR,BLDG_SQFT,PARCEL_ACRES,HOUSE_CNT",
    outSR: "4326",
    returnGeometry: "true",
    resultRecordCount: "10",
  });
  return data?.features ?? null;
}

async function cityAt(pt: { x: number; y: number }): Promise<string | null | undefined> {
  const data = await arcgis(BOUNDARIES, {
    geometry: `${pt.x},${pt.y}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "NAME",
    returnGeometry: "false",
  });
  if (!data) return undefined; // service failed
  return (data.features?.[0]?.attributes.NAME as string | undefined) ?? null; // null: unincorporated
}

async function zoneAt(pt: { x: number; y: number }): Promise<string | null> {
  const data = await arcgis(ZONING, {
    geometry: `${pt.x},${pt.y}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "zoning",
    returnGeometry: "false",
  });
  return (data?.features?.[0]?.attributes.zoning as string | undefined) ?? null;
}

function pickBest(rows: ParcelRow[]): ParcelRow {
  const residential = rows.filter((r) => String(r.attributes.PROP_CLASS ?? "").startsWith("Residential"));
  return (residential.length ? residential : rows)[0];
}

export async function lookupAddress(text: string): Promise<LookupResult> {
  const lower = text.toLowerCase();
  const saved = PROPERTIES.find((p) => lower.includes(p.id.replace("-", " ")) || lower.includes(p.id));
  if (saved) return { scope: "ok", propertyId: saved.id };

  const street = normalizeStreet(text);
  if (!/^\d+\s+\S+/.test(street) || !/^[A-Z0-9 '\-/]+$/.test(street)) return { scope: "notfound" };
  const safe = street.replace(/'/g, "''");

  let rows = await findParcels(`PARCEL_ADD = '${safe}'`);
  if (rows === null) return { scope: "unavailable" };
  if (!rows.length) {
    rows = await findParcels(`PARCEL_ADD LIKE '${safe}%'`);
    if (rows === null) return { scope: "unavailable" };
  }
  if (!rows.length) return { scope: "notfound" };

  const best = pickBest(rows);
  const pt = centroid(best.geometry?.rings);
  if (!pt) return { scope: "unavailable" };
  const city = await cityAt(pt);
  if (city === undefined) return { scope: "unavailable" };
  if (city !== "Salt Lake City") return { scope: "outside", city };

  const cls = (best.attributes.PROP_CLASS as string | null) ?? null;
  if (!cls || !cls.startsWith("Residential")) return { scope: "not_residential", propertyClass: cls };
  return { scope: "ok", propertyId: `live-${best.attributes.PARCEL_ID}` };
}

/** Rebuilds a live property from its parcel id. Returns null when it cannot be read. */
export async function fetchLiveProperty(parcelId: string): Promise<Property | null> {
  if (!/^[0-9A-Za-z-]{6,30}$/.test(parcelId)) return null;
  const rows = await findParcels(`PARCEL_ID = '${parcelId}'`);
  const row = rows?.[0];
  if (!row) return null;
  const pt = centroid(row.geometry?.rings);
  if (!pt) return null;
  const [city, zone] = await Promise.all([cityAt(pt), zoneAt(pt)]);
  const today = new Date().toISOString().slice(0, 10);
  const a = row.attributes;
  const num = (v: unknown): number | null => {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : null;
  };
  return {
    id: `live-${parcelId}`,
    address: `${titleAddress(String(a.PARCEL_ADD ?? "Unknown address"))}, Salt Lake City, UT`,
    parcelId,
    jurisdiction: { value: city ?? null, provenance: "public_record", sourceId: "ugrc-boundaries", retrievedAt: today },
    zone: { value: zone, provenance: zone ? "public_record" : "city_must_confirm", sourceId: "slc-zoning-layer", retrievedAt: today },
    lotAcres: { value: num(a.PARCEL_ACRES), provenance: "public_record", sourceId: "ugrc-parcels-slc", retrievedAt: today },
    builtYear: { value: num(a.BUILT_YR), provenance: "public_record", sourceId: "ugrc-parcels-slc", retrievedAt: today },
    buildingSqft: { value: num(a.BLDG_SQFT), provenance: "public_record", sourceId: "ugrc-parcels-slc", retrievedAt: today },
    propertyClass: { value: (a.PROP_CLASS as string | null) ?? null, provenance: "public_record", sourceId: "ugrc-parcels-slc", retrievedAt: today },
    houseCount: { value: num(a.HOUSE_CNT), provenance: "public_record", sourceId: "ugrc-parcels-slc", retrievedAt: today },
    dataMode: "live",
    placeholder: false,
  };
}
