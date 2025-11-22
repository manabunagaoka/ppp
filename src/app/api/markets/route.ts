import { NextResponse } from "next/server";
import { buildMarketSnapshot } from "@/lib/metrics";

export async function GET() {
  try {
    const markets = await buildMarketSnapshot();
    return NextResponse.json(markets);
  } catch (error) {
    console.error("Failed to build market snapshot:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
