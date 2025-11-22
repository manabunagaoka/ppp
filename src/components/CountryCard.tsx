"use client";

import { useState, useTransition } from "react";
import type { PPPDatum } from "@/lib/types";
import { COUNTRY_MAP } from "@/lib/countries";
import { formatNumber, formatPercent, describeDataLag } from "@/lib/format";
import { trackEvent } from "@/components/GoogleAnalytics";

interface CountryCardProps {
  data: PPPDatum;
  accent: string;
  insightsEnabled: boolean;
}

export function CountryCard({ data, accent, insightsEnabled }: CountryCardProps) {
  const country = COUNTRY_MAP[data.countryCode];
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const multiplierLabel = data.multiplier ? `${data.multiplier.toFixed(2)}×` : "—";
  const gdpLabel = data.gdpVsUsa ? formatPercent(data.gdpVsUsa, 0) : "—";
  const fxLabel = data.fxRate ? `${formatNumber(data.fxRate, { maximumFractionDigits: 2 })} ${data.currencyCode}` : "—";
  const pppLabel = data.pppConversionRate
    ? `${formatNumber(data.pppConversionRate, { maximumFractionDigits: 2 })} ${data.currencyCode}`
    : "—";

  function requestInsight() {
    if (!insightsEnabled) return;
    trackEvent("insights_requested", "Country Insights", data.countryCode);
    startTransition(async () => {
      setMessage(null);
      setError(null);
      try {
        const response = await fetch("/api/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            countryCode: data.countryCode,
            multiplier: data.multiplier,
            fxRate: data.fxRate,
            pppConversionRate: data.pppConversionRate,
            gdpVsUsa: data.gdpVsUsa,
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to fetch explanation");
        }

        const payload = await response.json();
        setMessage(payload.message ?? "No commentary available");
      } catch (err) {
        console.error(err);
        setError("AI commentary is unavailable right now.");
      }
    });
  }

  return (
    <article className="glass-panel flex flex-col gap-4 p-6" style={{ borderColor: `${accent}33` }}>
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
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Market FX</dt>
          <dd className="text-lg font-semibold text-white">{fxLabel}</dd>
          <p className="text-xs text-slate-500">{data.fxTimestamp ? `spot ${data.fxTimestamp}` : "live feed"}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">PPP Conversion</dt>
          <dd className="text-lg font-semibold text-white">{pppLabel}</dd>
          <p className="text-xs text-slate-500">{describeDataLag(data.pppYear)}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">PPP Multiplier</dt>
          <dd className="text-lg font-semibold text-white">{multiplierLabel}</dd>
          <p className="text-xs text-slate-500">
            {data.multiplier ? `Real $1 buys ${multiplierLabel} more/less vs USA` : "awaiting PPP feed"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">GDP / Cap PPP</dt>
          <dd className="text-lg font-semibold text-white">
            {data.gdpPerCapitaPPP ?
              `${data.currencySymbol}${formatNumber(data.gdpPerCapitaPPP, { maximumFractionDigits: 0 })}` :
              "—"}
          </dd>
          <p className="text-xs text-slate-500">{gdpLabel !== "—" ? `${gdpLabel} of US` : "World Bank latest"}</p>
        </div>
      </dl>

      <footer className="flex flex-col gap-3 border-t border-white/5 pt-4 text-sm text-slate-400">
        <p>
          {data.multiplier
            ? multiplierCopy(country?.name ?? data.countryCode, data.multiplier)
            : "We will display the PPP spread as soon as OECD publishes it."}
        </p>
        {insightsEnabled ? (
          <button
            type="button"
            onClick={requestInsight}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/30 disabled:opacity-50"
          >
            {isPending ? "Summarizing…" : "Insights"}
          </button>
        ) : (
          <p className="text-xs text-slate-500">Set OPENAI_API_KEY to unlock commentary.</p>
        )}
        {error && <p className="text-xs text-rose-300">{error}</p>}
        {message && <p className="text-sm text-slate-200">{message}</p>}
      </footer>
    </article>
  );
}

function multiplierCopy(country: string, multiplier: number) {
  if (multiplier > 1) {
    return `$1 USD throws off roughly ${multiplier.toFixed(2)}× the local goods/services in ${country} versus the States.`;
  }
  if (multiplier === 1) {
    return `${country} is effectively parity — nominal dollars travel the same distance as in the US.`;
  }
  return `${country} feels more expensive: $1 USD only stretches ${multiplier.toFixed(2)}× of a US dollar worth of real output.`;
}
