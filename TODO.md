# TODO before presenting

Nothing here is guessed silently. Each item is something the app currently shows as a placeholder or an unverified assumption.

## Must do before the demo

- [ ] **Rules owner reads Salt Lake City 21A.40.200** in a browser (the code site blocks automated fetches) and updates `data/rules.json` and the `review` level in `data/sources.json` from `secondary` to `verified`. Check in particular: owner occupancy and its exceptions, the parking requirement, the one-unit rule, and whether there is any minimum lot size.
- [x] **Saved properties are real parcels, verified on 2026-11-06.** Parcel fields come from the Salt Lake County parcel service (`Parcels_SaltLake_LIR`), the city from the UGRC municipal boundary layer (queried by parcel location, not mailing address), and the zone from the city's own zoning layer (`maps.slc.gov` Hosted/Zoning layer 5). Zones found: R-1-5000 (Sugar House), SR-1A (Avenues), R-1-7000 (Rose Park). Addresses are shown at block level to keep residents' house numbers out of a public repo; the parcel IDs are public record. To use a different house, repeat the three queries described in `lib/lookup.ts` and edit `data/properties.json`.
- [ ] Re-run those three queries right before judging if you change a property, and update `retrievedAt`.
- [ ] Add `ANTHROPIC_API_KEY` to `.env.local` and test the plan email, the ask box and the photo coach with a real key.
- [ ] Rehearse with Wi-Fi off (saved data and template text should still work).

## Unverified assumptions in code

- [ ] HUD Fair Market Rents endpoint shape in `lib/rent.ts` (Salt Lake County entity `4903599999`) is best effort. Without `HUD_API_TOKEN` the UI shows `[$X] to [$Y]`.
- [ ] UGRC geocoder and municipal boundary URLs in `lib/lookup.ts` are best effort. Live address lookup stops at "unavailable" for addresses that are not a saved example.
- [ ] Mapping a live parcel from `Parcels_SaltLake_LIR` into the `Property` type is not implemented yet.
- [ ] The `PARCEL_CITY` field is often the mailing city. Jurisdiction must come from the boundary layer, never from that field.
- [ ] Egress window figures on the photo screen come from the typical IRC R310 rule and must be confirmed with Salt Lake City Building Services.

## Nice to have

- [ ] Persist approved rules from `/rules` to `data/rules.json`.
- [ ] Add more Wasatch Front cities by reviewing each ordinance.
- [ ] Replace the vector hero with a rendered image (see `docs/image-generation-prompts.md`).
