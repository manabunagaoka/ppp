import { NextResponse } from "next/server";
import { buildMarketSnapshot } from "@/lib/metrics";
import { COUNTRIES, type MarketCode } from "@/lib/countries";
import type { PPPApiResponse } from "@/lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("countries");
  const list = requested
    ? (requested.split(",").map((code) => code.trim().toUpperCase()) as MarketCode[])
    : (COUNTRIES.map((country) => country.code) as MarketCode[]);

  try {
    const markets = await buildMarketSnapshot(list);
    const payload: PPPApiResponse = {
      baseCurrency: "USD",
      generatedAt: new Date().toISOString(),
      markets,
    };
    return NextResponse.json(payload, {
      headers: {
        "cache-control": "s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("PPP API error", error);
    return NextResponse.json({ error: "Unable to fetch PPP snapshot" }, { status: 500 });
  }
}
