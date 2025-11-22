"use client";

import { useState, useEffect } from "react";
import { COUNTRY_MAP } from "@/lib/countries";
import { CountryCard } from "@/components/CountryCard";
import { PPPCalculator } from "@/components/PPPCalculator";
import { formatNumber, formatPercent } from "@/lib/format";
import type { PPPDatum } from "@/lib/types";

type SortOption = "region" | "multiplier" | "gdp";

export default function Home() {
  const [markets, setMarkets] = useState<PPPDatum[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("region");
  const [isLoading, setIsLoading] = useState(true);
  const [insightsEnabled, setInsightsEnabled] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetch("/api/markets")
      .then((res) => res.json())
      .then((data) => {
        setMarkets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load markets:", error);
        setIsLoading(false);
      });
    
    // Check if OpenAI is enabled
    fetch("/api/explain", { method: "HEAD" })
      .then((res) => setInsightsEnabled(res.status !== 500))
      .catch(() => setInsightsEnabled(false));
  }, []);

  const sortedMarkets = [...markets].sort((a, b) => {
    if (sortBy === "region") {
      const regionA = COUNTRY_MAP[a.countryCode]?.region || "";
      const regionB = COUNTRY_MAP[b.countryCode]?.region || "";
      return regionA.localeCompare(regionB);
    }
    if (sortBy === "multiplier") {
      return (b.multiplier || 0) - (a.multiplier || 0);
    }
    if (sortBy === "gdp") {
      return (b.gdpPerCapitaPPP || 0) - (a.gdpPerCapitaPPP || 0);
    }
    return 0;
  });

  if (isLoading) {
    return (
      <main className="app-padding relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <p className="text-white">Loading...</p>
      </main>
    );
  }

  return (
    <main className="app-padding relative mx-auto flex w-full max-w-6xl flex-col gap-10">
      <section className="space-y-6 text-balance">
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-brand-gold">PPP Reality Dashboard</p>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          $1 USD rarely means $1 of earning power overseas.
        </h1>
      </section>

      <PPPCalculator markets={sortedMarkets} />

      <section className="glass-panel space-y-4 p-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Quick compare</p>
            <h3 className="text-lg font-semibold text-white">Where nominal $1 distorts profitability</h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded border border-white/10 bg-night-900/50 px-3 py-1 text-xs text-white focus:border-brand-gold focus:outline-none"
            >
              <option value="region">Region</option>
              <option value="multiplier">PPP Multiplier</option>
              <option value="gdp">GDP per Capita</option>
            </select>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-[0.3em] text-slate-500">
              <tr>
                <th className="pb-2">Country</th>
                <th className="pb-2">$1 USD Buys</th>
                <th className="pb-2">Multiplier</th>
                <th className="pb-2">GDP/cap (PPP)</th>
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((market) => (
                <tr key={`row-${market.countryCode}`} className="border-t border-white/5">
                  <td className="py-3 font-semibold text-white">
                    {COUNTRY_MAP[market.countryCode]?.name ?? market.countryCode}
                  </td>
                  <td className="py-3">
                    {market.multiplier ? (
                      <span className="font-semibold text-brand-gold">
                        ${market.multiplier.toFixed(2)} USD
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3">
                    {market.multiplier ? (
                      <span className="font-semibold text-brand-gold">{market.multiplier.toFixed(2)}×</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3">
                    {market.gdpPerCapitaPPP ? (
                      <>
                        {market.currencySymbol}
                        {formatNumber(market.gdpPerCapitaPPP, { maximumFractionDigits: 0 })}
                        {typeof market.gdpVsUsa === "number" && Number.isFinite(market.gdpVsUsa) && (
                          <span className="text-slate-500"> ({formatPercent(market.gdpVsUsa, 0)} of US)</span>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {sortedMarkets.map((market) => {
          const config = COUNTRY_MAP[market.countryCode];
          return (
            <CountryCard
              key={market.countryCode}
              data={market}
              accent={config?.accent ?? "#f5ba27"}
              insightsEnabled={insightsEnabled}
            />
          );
        })}
      </section>
    </main>
  );
}

