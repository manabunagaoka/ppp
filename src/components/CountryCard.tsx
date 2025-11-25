"use client";

import type { PPPDatum } from "@/lib/types";
import { COUNTRY_MAP } from "@/lib/countries";
import { formatNumber, formatPercent, describeDataLag } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";

interface CountryCardProps {
  data: PPPDatum;
  accent: string;
  onClick: () => void;
}

export function CountryCard({ data, accent, onClick }: CountryCardProps) {
  const country = COUNTRY_MAP[data.countryCode];

  const multiplierLabel = data.multiplier ? `${data.multiplier.toFixed(2)}×` : "—";
  const gdpLabel = data.gdpVsUsa ? formatPercent(data.gdpVsUsa, 0) : "—";
  const fxLabel = data.fxRate ? `${formatNumber(data.fxRate, { maximumFractionDigits: 2 })} ${data.currencyCode}` : "—";
  const pppLabel = data.pppConversionRate
    ? `${formatNumber(data.pppConversionRate, { maximumFractionDigits: 2 })} ${data.currencyCode}`
    : "—";

  function handleCardClick() {
    trackEvent("country_card_clicked", "Country Analysis", data.countryCode);
    onClick();
  }

  return (
    <article 
      onClick={handleCardClick}
      className="glass-panel group flex cursor-pointer flex-col gap-4 p-6 transition-all hover:border-white/20 hover:bg-white/[0.03]" 
      style={{ borderColor: `${accent}33` }}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">
            {data.countryCode}
          </p>
          <h2 className="text-2xl font-semibold text-white">{country?.name ?? data.countryCode}</h2>
          <p className="text-sm text-slate-400">{country?.currencyCode} • {country?.currencySymbol}</p>
        </div>
        <div
          className="rounded-full px-3 py-1 text-xs font-semibold text-night-950"
          style={{ backgroundColor: accent }}
        >
          {multiplierLabel}
        </div>
      </header>

      <dl className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors group-hover:bg-white/[0.04]">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Market FX</dt>
          <dd className="text-lg font-semibold text-white">{fxLabel}</dd>
          <p className="text-xs text-slate-500">{data.fxTimestamp ? `spot ${data.fxTimestamp}` : "live feed"}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors group-hover:bg-white/[0.04]">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">PPP Conversion</dt>
          <dd className="text-lg font-semibold text-white">{pppLabel}</dd>
          <p className="text-xs text-slate-500">{describeDataLag(data.pppYear)}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors group-hover:bg-white/[0.04]">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">PPP Multiplier</dt>
          <dd className="text-lg font-semibold text-white">{multiplierLabel}</dd>
          <p className="text-xs text-slate-500">
            {data.multiplier ? `Real $1 buys ${multiplierLabel} more/less vs USA` : "awaiting PPP feed"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors group-hover:bg-white/[0.04]">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">GDP / Cap PPP</dt>
          <dd className="text-lg font-semibold text-white">
            {data.gdpPerCapitaPPP ?
              `${data.currencySymbol}${formatNumber(data.gdpPerCapitaPPP, { maximumFractionDigits: 0 })}` :
              "—"}
          </dd>
          <p className="text-xs text-slate-500">{gdpLabel !== "—" ? `${gdpLabel} of US` : "World Bank latest"}</p>
        </div>
      </dl>

      <footer className="flex items-center justify-between border-t border-white/5 pt-4 text-sm">
        <p className="text-slate-400">
          {data.multiplier
            ? multiplierCopy(country?.name ?? data.countryCode, data.multiplier)
            : "Awaiting OECD PPP data"}
        </p>
        <svg 
          className="h-5 w-5 text-brand-gold opacity-0 transition-opacity group-hover:opacity-100" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </footer>
    </article>
  );
}

function multiplierCopy(country: string, multiplier: number) {
  if (multiplier > 1) {
    return `$1 buys ${multiplier.toFixed(2)}× more in ${country}`;
  }
  if (multiplier === 1) {
    return `${country} is at parity with US`;
  }
  return `$1 buys ${multiplier.toFixed(2)}× less in ${country}`;
}
