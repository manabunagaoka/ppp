const FX_ENDPOINT = "https://open.er-api.com/v6/latest/USD";

export type FxRates = Record<string, { rate: number; timestamp: string }>;

export async function fetchFxRates(symbols: string[]) {
  const res = await fetch(FX_ENDPOINT, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60 * 30, // refresh every 30 minutes
    },
  });

  if (!res.ok) {
    throw new Error(`FX feed error (${res.status})`);
  }

  const payload = (await res.json()) as {
    result: string;
    time_last_update_utc: string;
    rates: Record<string, number>;
  };

  if (payload.result !== "success" || !payload.rates) {
    throw new Error("FX feed error (unexpected payload)");
  }

  const timestamp = payload.time_last_update_utc;
  return symbols.reduce<FxRates>((acc, code) => {
    const rate = payload.rates[code];
    if (typeof rate === "number") {
      acc[code] = { rate, timestamp };
    }
    return acc;
  }, {});
}
