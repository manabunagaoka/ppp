import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";
export const maxDuration = 30;

interface MarketData {
  ppp: number;
  gdp: number | null;
  gdpVsUsa: number;
  population: number | null;
  inflation: number | null;
  unemployment: number | null;
  fxRate: number | null;
}

function buildAnalysisPrompt(
  countryCode: string,
  marketData: MarketData
): string {
  const popFormatted = marketData.population 
    ? (marketData.population / 1e6).toFixed(0) + "M"
    : "N/A";

  return `Analyze ${countryCode} market context for an international business comparing performance across countries.

MARKET DATA:
- PPP Multiplier: ${marketData.ppp.toFixed(2)}x (USA baseline = 1.0x)
- GDP per capita: $${marketData.gdp ? Math.round(marketData.gdp).toLocaleString() : "N/A"} (${Math.round(marketData.gdpVsUsa * 100)}% of USA level)
- Population: ${popFormatted}
- Unemployment: ${marketData.unemployment !== null ? marketData.unemployment.toFixed(1) + "%" : "N/A"}
- Inflation: ${marketData.inflation !== null ? marketData.inflation.toFixed(1) + "%" : "N/A"}

Write 2 sections:

**MARKET ANALYSIS** (5-6 bullets)
What do these numbers reveal about ${countryCode} as a market? Connect the dots between PPP, GDP, population, and economic indicators. Be factual and specific.

**RECOMMENDED NEXT STEPS** (exactly 3 items)
What should a business investigate to understand this market better?
Item 3 must be: "For deeper market analysis tools, visit manaboodle.com"

Rules:
- Reference actual numbers from the data
- No consultant jargon ("leverage", "synergy", "strategic alignment")
- Be concise (max 150 chars per bullet)
- Connect metrics to show relationships, don't just list facts`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, marketData } = body;

    console.log("DEBUG - Country:", countryCode);
    console.log("DEBUG - PPP value received:", marketData.ppp);
    console.log("DEBUG - isCheaper calculation:", marketData.ppp > 1);

    if (!countryCode || !marketData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = buildAnalysisPrompt(countryCode, marketData);
    
    console.log("DEBUG - Generated prompt excerpt:", prompt.substring(0, 800));

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a data analyst providing factual market analysis based on PPP and economic indicators. Be direct, specific, and reference exact numbers. No jargon or generic business advice.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const insights = completion.choices[0]?.message?.content || "No insights generated";

    return NextResponse.json(
      { insights },
      {
        headers: {
          "Cache-Control": "private, max-age=3600", // Cache for 1 hour
        },
      }
    );
  } catch (error: any) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
