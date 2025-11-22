const WORLD_BANK_BASE = "https://api.worldbank.org/v2";

type WorldBankResponse = [
  {
    page: number;
    pages: number;
    per_page: string;
    total: number;
  },
  Array<{
    country: { id: string; value: string };
    date: string;
    value: number | null;
  }>
];

export type WorldBankPoint = {
  period: string;
  value: number;
};

export async function fetchWorldBankSeries(countryIso2: string, indicator: string) {
  const url = `${WORLD_BANK_BASE}/country/${countryIso2}/indicator/${indicator}?format=json&per_page=60`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!res.ok) {
    throw new Error(`World Bank request failed (${res.status}) for ${url}`);
  }

  const data = (await res.json()) as WorldBankResponse;
  const entries = data?.[1] ?? [];
  return entries
    .filter((entry) => typeof entry.value === "number")
    .map((entry) => ({ period: entry.date, value: entry.value as number }));
}

export function pickLatestWorldBankPoint(points: WorldBankPoint[]) {
  return [...points].sort((a, b) => Number(b.period) - Number(a.period))[0];
}
