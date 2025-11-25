"use client";

import { useState, useEffect } from "react";
import { COUNTRY_MAP } from "@/lib/countries";
import { PPPCalculator } from "@/components/PPPCalculator";
import { FAQ } from "@/components/FAQ";
import { formatNumber, formatPercent } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";
import type { PPPDatum } from "@/lib/types";

type SortOption = "multiplier" | "localPP" | "gdp" | "population" | "unemployment" | "inflation";

export default function Home() {
  const [markets, setMarkets] = useState<PPPDatum[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("multiplier");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("MEX");

  // Load data on mount
  useEffect(() => {
    fetch("/api/markets")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMarkets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load markets:", error);
        setError(error.message || "Failed to load data");
        setIsLoading(false);
      });
  }, []);

  const sortedMarkets = [...markets].sort((a, b) => {
    if (sortBy === "multiplier") {
      return (b.multiplier || 0) - (a.multiplier || 0);
    }
    if (sortBy === "localPP") {
      return (b.localPurchasingPower || 0) - (a.localPurchasingPower || 0);
    }
    if (sortBy === "gdp") {
      return (b.gdpPerCapitaPPP || 0) - (a.gdpPerCapitaPPP || 0);
    }
    if (sortBy === "population") {
      return (b.population || 0) - (a.population || 0);
    }
    if (sortBy === "unemployment") {
      return (b.unemploymentRate || 0) - (a.unemploymentRate || 0);
    }
    if (sortBy === "inflation") {
      return (b.inflationRate || 0) - (a.inflationRate || 0);
    }
    return 0;
  });

  if (isLoading) {
    return (
      <main className="app-padding relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-400">Loading market data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-padding relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-400">Failed to load market data</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-brand-gold px-4 py-2 text-sm font-medium text-night-900 hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app-padding relative mx-auto flex w-full max-w-6xl flex-col gap-10">
      <PPPCalculator 
        markets={sortedMarkets} 
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
      />

      <FAQ selectedCountry={selectedCountry} markets={sortedMarkets} />

      <section className="glass-panel space-y-4 p-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Key Economic Metrics</h3>
            <p className="text-xs text-slate-500 mt-1">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                const newSort = e.target.value as SortOption;
                setSortBy(newSort);
                trackEvent("sort_changed", "Quick Compare", newSort);
              }}
              className="rounded border border-white/10 bg-night-900/50 px-3 py-1 text-xs text-white focus:border-brand-gold focus:outline-none"
            >
              <option value="multiplier">PPP Multiplier</option>
              <option value="localPP">Local Purchasing Power</option>
              <option value="gdp">Per Capita GDP</option>
              <option value="population">Population</option>
              <option value="unemployment">Unemployment Rate</option>
              <option value="inflation">Inflation Rate</option>
            </select>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="pb-3 pr-4">Country</th>
                <th className="pb-3 pr-4">
                  <div className="leading-tight">PPP</div>
                  <div className="leading-tight">Multiplier</div>
                </th>
                <th className="pb-3 pr-4">
                  <div className="leading-tight">Local</div>
                  <div className="leading-tight">Purch. Pwr</div>
                </th>
                <th className="pb-3 pr-4">
                  <div className="leading-tight">FX</div>
                  <div className="leading-tight">Rate</div>
                </th>
                <th className="pb-3 pr-4">
                  <div className="leading-tight">Per Capita</div>
                  <div className="leading-tight">GDP</div>
                </th>
                <th className="pb-3 pr-4">Population</th>
                <th className="pb-3 pr-4">
                  <div className="leading-tight">Unemploy</div>
                  <div className="leading-tight">Rate</div>
                </th>
                <th className="pb-3 pr-4">
                  <div className="leading-tight">Inflation</div>
                  <div className="leading-tight">Rate</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((market) => {
                const config = COUNTRY_MAP[market.countryCode];
                return (
                  <tr key={`row-${market.countryCode}`} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="font-semibold text-white text-sm">{config?.name ?? market.countryCode}</span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {market.multiplier ? (
                        <span className="font-semibold text-base" style={{ color: config?.accent }}>
                          {market.multiplier.toFixed(2)}×
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="text-slate-300 text-sm">
                        {market.localPurchasingPower ? `$${market.localPurchasingPower.toFixed(2)}` : "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="text-slate-300 text-sm">
                        {market.fxRate ? market.fxRate.toFixed(2) : "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {market.gdpPerCapitaPPP ? (
                        <span className="text-slate-300 text-sm">
                          ${formatNumber(market.gdpPerCapitaPPP / 1000, { maximumFractionDigits: 0 })}k
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="text-slate-300 text-sm">
                        {market.population 
                          ? `${(market.population / 1_000_000).toFixed(1)}M`
                          : "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="text-slate-300 text-sm">
                        {market.unemploymentRate 
                          ? `${market.unemploymentRate.toFixed(1)}%`
                          : "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="text-slate-300 text-sm">
                        {market.inflationRate !== null && market.inflationRate !== undefined
                          ? `${market.inflationRate.toFixed(1)}%`
                          : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-20 space-y-8">
        {/* Footer */}
        <div className="border-t border-white/5 py-8 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">Manaboodle</p>
            <p className="text-sm text-slate-500">
              Strategic tools for global business decisions
            </p>
            <p className="text-xs text-slate-600">
              © 2025 Manaboodle. Market data from OECD, World Bank, and open-source APIs.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

