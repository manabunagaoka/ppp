"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { formatNumber } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";
import type { PPPDatum } from "@/lib/types";

interface PPPCalculatorProps {
  markets: PPPDatum[];
}

export function PPPCalculator({ markets }: PPPCalculatorProps) {
  const [usdAmount, setUsdAmount] = useState<string>("100000");
  const [selectedCountry, setSelectedCountry] = useState<string>("MEX");

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
    setSelectedCountry(newCountry);
    trackEvent("calculator_country_selected", "Calculator", newCountry);
  };

  const displayAmount = numericAmount ? formatNumber(numericAmount, { maximumFractionDigits: 0 }) : "";

  return (
    <section className="glass-panel space-y-4 p-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">PPP Calculator</p>
        <h3 className="text-lg font-semibold text-white">Real purchasing power converter</h3>
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
            ? `Your $${formatNumber(numericAmount, { maximumFractionDigits: 0 })} buys what would cost $${formatNumber(realValue, { maximumFractionDigits: 0 })} worth of goods/services in the US.`
            : multiplier < 1
            ? `Your $${formatNumber(numericAmount, { maximumFractionDigits: 0 })} only buys what would cost $${formatNumber(realValue, { maximumFractionDigits: 0 })} in the US - ${country?.name} is more expensive.`
            : `${country?.name} has purchasing power parity with the US.`
          }
        </p>
      </div>
    </section>
  );
}
