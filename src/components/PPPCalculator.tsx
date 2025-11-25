"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { formatNumber } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";
import type { PPPDatum } from "@/lib/types";

interface PPPCalculatorProps {
  markets: PPPDatum[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export function PPPCalculator({ markets, selectedCountry, onCountryChange }: PPPCalculatorProps) {
  const [usdAmount, setUsdAmount] = useState<string>("1000000");

  const market = markets.find((m) => m.countryCode === selectedCountry);
  const multiplier = market?.multiplier || 1;
  const numericAmount = parseFloat(usdAmount.replace(/,/g, "") || "0");
  const realValue = numericAmount * multiplier;
  const country = COUNTRIES.find((c) => c.code === selectedCountry);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || !isNaN(Number(value))) {
      setUsdAmount(value);
      if (value && !isNaN(Number(value))) {
        trackEvent("calculator_amount_entered", "Calculator", selectedCountry, Number(value));
      }
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    onCountryChange(newCountry);
    trackEvent("calculator_country_selected", "Calculator", newCountry);
  };

  const displayAmount = numericAmount ? formatNumber(numericAmount, { maximumFractionDigits: 0 }) : "";

  return (
    <section className="glass-panel space-y-4 p-6">
      <header>
        <h3 className="text-lg font-semibold text-white">Real Purchasing Power Converter</h3>
        <p className="text-sm text-slate-400 mt-1">Compare purchasing power across 11 global markets against USD</p>
      </header>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            USD Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="text"
              value={displayAmount}
              onChange={handleAmountChange}
              className="w-full rounded-lg border border-white/10 bg-night-900/50 py-3 pl-8 pr-4 text-white placeholder-slate-500 focus:border-brand-gold focus:outline-none"
              placeholder="100,000"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full rounded-lg border border-white/10 bg-night-900/50 px-4 py-3 text-white focus:border-brand-gold focus:outline-none"
          >
            {COUNTRIES.filter((c) => c.code !== "USA").map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/10 to-brand-pink/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          Real Purchasing Power in {country?.name}
        </p>
        <p className="text-4xl font-bold text-white">
          ${formatNumber(realValue, { maximumFractionDigits: 0 })} USD
        </p>
        <p className="mt-2 text-sm text-slate-300">
          ${formatNumber(numericAmount, { maximumFractionDigits: 0 })} USD ×{" "}
          <span className="font-semibold text-brand-gold">{multiplier.toFixed(2)}×</span> multiplier
        </p>
        <p className="mt-3 text-xs text-slate-400">
          {multiplier > 1 
            ? `PPP multiplier higher than 1 means lower local costs. $${formatNumber(numericAmount, { maximumFractionDigits: 0 })} USD has purchasing power equivalent to $${formatNumber(realValue, { maximumFractionDigits: 0 })} in the US market.`
            : multiplier < 1
            ? `PPP multiplier below 1 means higher local costs. $${formatNumber(numericAmount, { maximumFractionDigits: 0 })} USD has purchasing power equivalent to only $${formatNumber(realValue, { maximumFractionDigits: 0 })} in the US market.`
            : `PPP multiplier at 1 means equal purchasing power with the US market.`
          }
        </p>
      </div>
    </section>
  );
}
