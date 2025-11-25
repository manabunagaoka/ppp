import { NextResponse } from "next/server";
import { buildMarketSnapshot } from "@/lib/metrics";

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30 second timeout

export async function GET() {
  try {
    const markets = await buildMarketSnapshot();
    return NextResponse.json(markets, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error("Failed to build market snapshot:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
