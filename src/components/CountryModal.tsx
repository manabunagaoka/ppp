"use client";

import { useState } from "react";
import type { PPPDatum } from "@/lib/types";
import { COUNTRY_MAP } from "@/lib/countries";
import { formatNumber, formatPercent } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";

interface CountryModalProps {
  data: PPPDatum;
  onClose: () => void;
}

type AnalysisMode = "existing" | "entry";

export function CountryModal({ data, onClose }: CountryModalProps) {
  const country = COUNTRY_MAP[data.countryCode];
  const [mode, setMode] = useState<AnalysisMode>("existing");

  if (!country) return null;

  const multiplier = data.multiplier || 1;
  const gdpVsUsa = data.gdpVsUsa || 0;
  const isHighGDP = gdpVsUsa > 0.5; // Above 50% of US
  const isCheaper = multiplier > 1;

  // Interpretation logic
  const getExistingBusinessInsights = () => {
    const insights = [];

    if (isCheaper) {
      insights.push({
        color: "text-green-400",
        text: `$1M in revenue translates to $${formatNumber(1000000 * multiplier, { maximumFractionDigits: 0 })} in purchasing power. The ${multiplier.toFixed(2)}× multiplier means your earnings stretch significantly further here.`,
      });
      insights.push({
        color: "text-green-400",
        text: `Lower operating costs create room for margin improvement. If current margins feel tight, there may be opportunities to optimize your cost structure.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `Revenue potential caps at roughly ${formatPercent(1/multiplier, 0)} of a comparable US market due to lower absolute price points, even at similar unit volumes.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `Plateauing revenue often signals market saturation. Local competitors operate with the same cost advantages, making price-based competition challenging.`,
      });
    } else {
      insights.push({
        color: "text-green-400",
        text: `Success in this premium market is a strong signal. High-cost environments tend to validate operational excellence.`,
      });
      insights.push({
        color: "text-green-400",
        text: `Revenue figures reflect true purchasing power. Unlike lower-cost markets, $1M here represents $1M in real economic value.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `Operating costs run approximately ${(multiplier * 100).toFixed(0)}% of revenue across the board - talent, real estate, and customer acquisition. Margin pressure tends to be structural rather than temporary.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `Slower growth typically reflects the high-cost environment. Consider whether operational efficiency improvements or adjusted positioning might help.`,
      });
    }

    if (isHighGDP) {
      insights.push({
        color: "text-slate-400",
        text: `At ${formatPercent(gdpVsUsa, 0)} of US GDP per capita, this is a mature, high-income market. Flat revenue likely indicates demand saturation rather than insufficient market size.`,
      });
    } else {
      insights.push({
        color: "text-slate-400",
        text: `At ${formatPercent(gdpVsUsa, 0)} of US GDP per capita, there's substantial population with lower average income. Flat revenue may suggest current offerings primarily reach higher-income segments.`,
      });
    }

    return insights;
  };

  const getEntryInsights = () => {
    const insights = [];

    if (isCheaper) {
      insights.push({
        color: "text-green-400",
        text: `Operating costs are ${multiplier.toFixed(2)}× lower, enabling either aggressive pricing (30% below competitors while maintaining margins) or enhanced profitability (${((1 - 1/multiplier) * 100).toFixed(0)}% higher margins at market rates).`,
      });
      insights.push({
        color: "text-green-400",
        text: `Lower input costs across talent, facilities, and operations typically accelerate the path to profitability compared to higher-cost markets.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `$1M in revenue represents approximately $${formatNumber(1000000 / multiplier, { maximumFractionDigits: 0 })} in US-equivalent purchasing power. Absolute revenue figures should be contextualized accordingly.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `Local competitors benefit from identical cost structures. Sustainable competitive advantage typically requires differentiation beyond pricing alone.`,
      });
    } else {
      insights.push({
        color: "text-green-400",
        text: `Consumer purchasing power supports premium pricing. Strong revenue in this market reflects genuine willingness to pay.`,
      });
      insights.push({
        color: "text-green-400",
        text: `High-cost markets test operational resilience. Success here tends to validate scalability in diverse economic environments.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `All operating expenses run approximately ${((multiplier - 1) * 100).toFixed(0)}% above US baseline - from customer acquisition to talent to real estate. Budget planning should reflect these premiums.`,
      });
      insights.push({
        color: "text-yellow-400",
        text: `Success typically requires either exceptional operational efficiency or premium market positioning. Mid-market strategies often struggle in high-cost environments.`,
      });
    }

    if (isHighGDP) {
      insights.push({
        color: "text-slate-400",
        text: `At ${formatPercent(gdpVsUsa, 0)} of US GDP per capita, this represents a mature, affluent market. Competition tends to be sophisticated, favoring well-differentiated offerings.`,
      });
    } else {
      insights.push({
        color: "text-slate-400",
        text: `At ${formatPercent(gdpVsUsa, 0)} of US GDP per capita, this market combines significant population scale with developing purchasing power. Accessible price points can unlock substantial addressable market.`,
      });
    }

    return insights;
  };

  const insights = mode === "existing" ? getExistingBusinessInsights() : getEntryInsights();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="relative flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/10 bg-night-900 shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{country.name}</h2>
            <p className="text-sm text-slate-400">Market Intelligence</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Allow Scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Top Half - Key Metrics */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">PPP Multiplier</p>
                <p className="text-2xl font-bold text-brand-gold">{multiplier.toFixed(2)}×</p>
                <p className="mt-1 text-xs text-slate-400">
                  {isCheaper ? "Cheaper than USA" : "More expensive"}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">GDP per Capita</p>
                <p className="text-2xl font-bold text-white">
                  {data.gdpPerCapitaPPP ? `$${formatNumber(data.gdpPerCapitaPPP / 1000, { maximumFractionDigits: 0 })}k` : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {gdpVsUsa ? `${formatPercent(gdpVsUsa, 0)} of US` : "—"}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Exchange Rate</p>
                <p className="text-2xl font-bold text-white">
                  {data.fxRate ? formatNumber(data.fxRate, { maximumFractionDigits: 2 }) : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">{country.currencyCode} per USD</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Price Level</p>
                <p className="text-2xl font-bold text-white">
                  {isCheaper ? formatPercent(1/multiplier, 0) : formatPercent(multiplier, 0)}
                </p>
                <p className="mt-1 text-xs text-slate-400">vs USA (100%)</p>
              </div>
            </div>

            {/* Additional Market Metrics */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Population</p>
                <p className="text-2xl font-bold text-white">
                  {data.population 
                    ? data.population >= 1e9 
                      ? `${formatNumber(data.population / 1e9, { maximumFractionDigits: 2 })}B`
                      : `${formatNumber(data.population / 1e6, { maximumFractionDigits: 1 })}M`
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">Total population</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Inflation Rate</p>
                <p className="text-2xl font-bold text-white">
                  {data.inflationRate !== null ? `${formatNumber(data.inflationRate, { maximumFractionDigits: 1 })}%` : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">Annual CPI change</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Unemployment</p>
                <p className="text-2xl font-bold text-white">
                  {data.unemploymentRate !== null ? `${formatNumber(data.unemploymentRate, { maximumFractionDigits: 1 })}%` : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">Labor force</p>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => {
                setMode("existing");
                trackEvent("analysis_mode_changed", "Country Modal", "existing");
              }}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                mode === "existing"
                  ? "bg-brand-gold text-night-900"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              Existing Business
            </button>
            <button
              onClick={() => {
                setMode("entry");
                trackEvent("analysis_mode_changed", "Country Modal", "entry");
              }}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                mode === "entry"
                  ? "bg-brand-gold text-night-900"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              New Market Entry
            </button>
          </div>

          {/* Bottom Half - Insights */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              {mode === "existing" ? "What Your Numbers Mean" : "Entry Strategy Implications"}
            </h3>
            <ul className="space-y-3">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${insight.color}`}></span>
                  <span className="text-sm leading-relaxed text-slate-300">{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
