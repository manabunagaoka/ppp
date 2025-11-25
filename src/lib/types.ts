import type { MarketCode } from "./countries";

export type PPPDatum = {
  countryCode: MarketCode;
  currencyCode: string;
  currencySymbol: string;
  fxRate: number | null; // local currency per USD
  fxTimestamp: string | null;
  pppConversionRate: number | null; // local currency per USD at PPP
  pppYear: string | null;
  gdpPerCapitaPPP: number | null; // constant 2017 international dollars (World Bank)
  gdpYear: string | null;
  multiplier: number | null;
  localPurchasingPower: number | null;
  gdpVsUsa: number | null;
  population: number | null; // Total population (World Bank)
  inflationRate: number | null; // Annual inflation rate % (World Bank)
  unemploymentRate: number | null; // Unemployment rate % (World Bank)
  notes?: string;
};

export type PPPApiResponse = {
  baseCurrency: string;
  generatedAt: string;
  markets: PPPDatum[];
};
