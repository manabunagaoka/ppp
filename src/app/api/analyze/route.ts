import { NextRequest } from "next/server";
import { COUNTRY_MAP } from "@/lib/countries";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return Response.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { countryCode, question, tab, context, businessContext } = body;

    const country = COUNTRY_MAP[countryCode as keyof typeof COUNTRY_MAP];
    if (!country) {
      return Response.json(
        { error: "Country not found" },
        { status: 404 }
      );
    }

    const systemPrompt = businessContext 
      ? buildBusinessPrompt(country.name, context, businessContext)
      : buildSystemPrompt(tab, country.name, context);

    const userMessage = businessContext 
      ? `Analyze this business for ${country.name}: ${businessContext}`
      : question;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: businessContext ? 500 : 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return Response.json(
        { error: "Failed to generate analysis" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response generated.";

    return Response.json({ answer });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(tab: string, countryName: string, context: any): string {
  const { multiplier, gdpVsUsa, fxRate, pppConversionRate } = context;

  const baseContext = `You are a strategic business analyst providing HBS-style case analysis for ${countryName}.
  
Context:
- PPP Multiplier: ${multiplier?.toFixed(2)}× (${multiplier > 1 ? "goods/services cost less" : "more expensive"} than USA)
- GDP per capita: ${gdpVsUsa ? `${(gdpVsUsa * 100).toFixed(0)}% of US level` : "data pending"}
- FX Rate: ${fxRate?.toFixed(2)} ${countryName} currency per USD
- PPP Conversion: ${pppConversionRate?.toFixed(2)}

Provide tactical, data-driven insights in 2-3 sentences. Be specific and actionable.`;

  const tabPrompts = {
    market: `${baseContext}

Focus: Market Size & Opportunity
Consider: Population, GDP, purchasing power, market maturity, growth trends, addressable market.`,
    
    win: `${baseContext}

Focus: Competitive Positioning & Winning Strategy
Consider: Local competitors, foreign competitors, competitive advantages, barriers to entry, differentiation opportunities.`,
    
    operate: `${baseContext}

Focus: Operational Feasibility
Consider: Infrastructure, talent availability, regulatory environment, supply chain, real estate costs, logistics.`,
    
    profit: `${baseContext}

Focus: Profitability & Unit Economics
Consider: Cost structure impact of PPP, pricing power, margin implications, break-even timeline, ROI drivers.`,
  };

  return tabPrompts[tab as keyof typeof tabPrompts] || baseContext;
}

function buildBusinessPrompt(countryName: string, context: any, businessContext: string): string {
  const { multiplier, gdpVsUsa } = context;

  return `You are a strategic business consultant analyzing market entry opportunities for ${countryName}.

Market Context:
- PPP Multiplier: ${multiplier?.toFixed(2)}× (cost advantage: ${multiplier > 1 ? `${((1 - 1/multiplier) * 100).toFixed(0)}% cheaper` : `${((multiplier - 1) * 100).toFixed(0)}% more expensive`})
- GDP per Capita: ${gdpVsUsa ? `${(gdpVsUsa * 100).toFixed(0)}% of US level` : "data pending"}

Business Description:
${businessContext}

Provide a focused analysis in 4-5 sentences covering:
1. How PPP dynamics affect this specific business model
2. Key opportunities given the multiplier and market context
3. Critical risks or challenges to address
4. One concrete next step to validate the opportunity

Be specific to their business. No generic platitudes.`;
}
