import { NextResponse } from "next/server";
import { COUNTRY_MAP, type MarketCode } from "@/lib/countries";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const body = await request.json();
  const { countryCode, multiplier, fxRate, pppConversionRate, gdpVsUsa } = body as {
    countryCode: MarketCode;
    multiplier?: number | null;
    fxRate?: number | null;
    pppConversionRate?: number | null;
    gdpVsUsa?: number | null;
  };

  const country = COUNTRY_MAP[countryCode];
  if (!country) {
    return NextResponse.json({ error: "Unknown country" }, { status: 400 });
  }

  const prompt = buildPrompt({
    country: country.name,
    multiplier,
    fxRate,
    pppConversionRate,
    gdpVsUsa,
  });

  const completion = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content:
            "You're a sharp trader. Give ONE unique tactical insight about this country's purchasing power situation. Focus on what's surprising or actionable. 2 sentences max. No generic explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!completion.ok) {
    const errorText = await completion.text();
    console.error("OpenAI error", errorText);
    return NextResponse.json({ error: "OpenAI completion failed" }, { status: 502 });
  }

  const data = await completion.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ message: content.trim() });
}

type PromptInput = {
  country: string;
  multiplier?: number | null;
  fxRate?: number | null;
  pppConversionRate?: number | null;
  gdpVsUsa?: number | null;
};

function buildPrompt({ country, multiplier, fxRate, pppConversionRate, gdpVsUsa }: PromptInput) {
  const multiplierText = multiplier ? `${multiplier.toFixed(2)}×` : "n/a";
  
  // Generate unique angle based on country characteristics
  let angle = "";
  if (multiplier && multiplier > 1.5) {
    angle = "Where does this arbitrage break down?";
  } else if (multiplier && multiplier < 0.8) {
    angle = "What makes this market worth the premium?";
  } else if (typeof gdpVsUsa === "number" && gdpVsUsa < 0.3) {
    angle = "How does low GDP/capita affect operational leverage?";
  } else {
    angle = "What's the non-obvious risk or opportunity here?";
  }

  return `${country}: PPP multiplier is ${multiplierText}. ${angle} Be specific, not generic.`;
}
