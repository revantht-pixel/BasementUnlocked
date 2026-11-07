"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { css } from "@/lib/css";
import { Btn } from "@/components/ui";

type LookupResponse = { scope: "ok"; propertyId: string } | { scope: "outside" } | { scope: "unavailable" };

export default function AddressForm() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const value = address.trim();
    if (!value) {
      setMessage("Type a Salt Lake City address to check.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/lookup?address=" + encodeURIComponent(value));
      const data = (await res.json()) as LookupResponse;
      if (data.scope === "ok") {
        router.push(`/property/${data.propertyId}`);
        return;
      }
      if (data.scope === "outside") {
        router.push("/out-of-scope");
        return;
      }
      setMessage("Live lookup is not available right now. Try one of the saved examples below.");
    } catch {
      setMessage("Live lookup is not available right now. Try one of the saved examples below.");
    }
    setLoading(false);
  }

  return (
    <form
      className="rise3"
      onSubmit={onSubmit}
      style={css("margin: 8px 0 0; padding: 6px; border-radius: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)")}
    >
      <div style={css("border-radius: 22px; padding: 20px; background: rgba(255,255,255,0.045); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px")}>
        <label htmlFor="address" style={css("font-size: 14px; font-weight: 500; color: #A9C0BE")}>
          Property address
        </label>
        <div style={css("display: flex; flex-wrap: wrap; gap: 10px")}>
          <input
            id="address"
            type="text"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-describedby="address-help address-msg"
            style={css("flex: 1 1 240px; min-width: 0; height: 56px; padding: 0 22px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #E8F4F2; font: inherit; font-size: 17px; box-sizing: border-box")}
          />
          <Btn type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Checking..." : "Check address"}
          </Btn>
        </div>
        <p id="address-help" style={css("margin: 0; font-size: 14px; color: #86A09D")}>
          We check the real city boundary first, not the mailing address.
        </p>
        <p id="address-msg" role="status" style={css("margin: 0; font-size: 14px; color: #FFB547")}>
          {message}
        </p>
      </div>
    </form>
  );
}
