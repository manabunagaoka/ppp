"use client";

import { useState, useEffect } from "react";
import type { PPPDatum } from "@/lib/types";
import { COUNTRY_MAP } from "@/lib/countries";
import { formatNumber, formatPercent } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";

interface CountrySidePanelProps {
  data: PPPDatum;
  onClose: () => void;
}

export function CountrySidePanel({ data, onClose }: CountrySidePanelProps) {
  const country = COUNTRY_MAP[data.countryCode];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!country) return null;

  const multiplier = data.multiplier || 1;
  const gdpVsUsa = data.gdpVsUsa || 0;
  const isCheaper = multiplier > 1;

  // Typing animation effect
  useEffect(() => {
    if (!analysis || !isTyping) return;

    let currentIndex = 0;
    setDisplayedText("");

    const typingInterval = setInterval(() => {
      if (currentIndex < analysis.length) {
        setDisplayedText(analysis.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 15); // 15ms per character for smooth typing

    return () => clearInterval(typingInterval);
  }, [analysis, isTyping]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis("");
    setDisplayedText("");
    trackEvent("market_analysis_requested", "Country Panel", data.countryCode);

    try {
      const res = await fetch("/api/analyze-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: data.countryCode,
          marketData: {
            ppp: multiplier,
            gdp: data.gdpPerCapitaPPP,
            gdpVsUsa,
            population: data.population,
            inflation: data.inflationRate,
            unemployment: data.unemploymentRate,
            fxRate: data.fxRate,
          },
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const result = await res.json();
      setAnalysis(result.insights);
      setIsTyping(true);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("Analysis failed. Please try again.");
      setIsTyping(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden border-l border-white/10 bg-night-900 shadow-2xl lg:w-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{country.name}</h2>
            <p className="text-sm text-slate-400">Market Analysis</p>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Metric Cards - Compact 2-column grid */}
          <div className="mb-6">
            <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">Key Metrics</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">PPP Multiplier</p>
                <p className="text-xl font-bold text-brand-gold">{multiplier.toFixed(2)}×</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {isCheaper ? "Cheaper" : "Expensive"}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">GDP/cap</p>
                <p className="text-xl font-bold text-white">
                  {data.gdpPerCapitaPPP ? `$${formatNumber(data.gdpPerCapitaPPP / 1000, { maximumFractionDigits: 0 })}k` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {gdpVsUsa ? `${formatPercent(gdpVsUsa, 0)} of US` : "—"}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Population</p>
                <p className="text-xl font-bold text-white">
                  {data.population
                    ? data.population >= 1e9
                      ? `${formatNumber(data.population / 1e9, { maximumFractionDigits: 2 })}B`
                      : `${formatNumber(data.population / 1e6, { maximumFractionDigits: 1 })}M`
                    : "—"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Total pop</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Inflation</p>
                <p className="text-xl font-bold text-white">
                  {data.inflationRate !== null ? `${formatNumber(data.inflationRate, { maximumFractionDigits: 1 })}%` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Annual CPI</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Unemployment</p>
                <p className="text-xl font-bold text-white">
                  {data.unemploymentRate !== null ? `${formatNumber(data.unemploymentRate, { maximumFractionDigits: 1 })}%` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Labor force</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">FX Rate</p>
                <p className="text-xl font-bold text-white">
                  {data.fxRate ? formatNumber(data.fxRate, { maximumFractionDigits: 2 }) : "—"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{country.currencyCode}/USD</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Price Level</p>
                <p className="text-xl font-bold text-white">
                  {isCheaper ? formatPercent(1 / multiplier, 0) : formatPercent(multiplier, 0)}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">vs USA</p>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || isTyping}
            className="mb-6 w-full rounded-lg bg-brand-gold px-4 py-3 font-semibold text-night-900 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing Market..." : isTyping ? "Generating Insights..." : "Analyze Market"}
          </button>

          {/* AI Analysis Output */}
          {(displayedText || isAnalyzing) && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">▋</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
