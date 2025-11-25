import { COUNTRIES, COUNTRY_MAP, type CountryConfig, type MarketCode } from "./countries";
import { fetchFxRates } from "./fx";
import { fetchSdmxSeries, pickLatest } from "./sdmx";
import { 
  fetchWorldBankSeries, 
  pickLatestWorldBankPoint, 
  fetchPopulation, 
  fetchInflationRate, 
  fetchUnemploymentRate 
} from "./worldbank";
import type { PPPDatum } from "./types";

const PPP_DATASET = "PPPGDP";
const PPP_INDICATOR = "PPP";
const PPP_FREQUENCY = "A"; // Annual
const GDP_PPP_INDICATOR = "NY.GDP.PCAP.PP.KD"; // World Bank (constant 2017 international $)

export async function buildMarketSnapshot(targets: MarketCode[] = COUNTRIES.map((c) => c.code)) {
  const countries = targets.map((code) => COUNTRY_MAP[code]).filter(Boolean);

  const fxRates = await fetchFxRates(
    countries
      .map((country) => country.currencyCode)
      .filter((code, index, array) => array.indexOf(code) === index)
  );

  const pppSeries = await Promise.all(
    countries.map(async (country) => {
      try {
        return {
          code: country.code,
          points: await fetchSdmxSeries({
            dataset: PPP_DATASET,
            key: `${country.oecdLocation}.${PPP_INDICATOR}.${PPP_FREQUENCY}`,
          }),
        };
      } catch (error) {
        console.error("PPP fetch failed", country.code, error);
        return {
          code: country.code,
          points: {},
        };
      }
    })
  );

  const gdpSeries = await Promise.all(
    countries.map(async (country) => {
      try {
        const series = await fetchWorldBankSeries(country.iso2, GDP_PPP_INDICATOR);
        return { code: country.code, points: series };
      } catch (error) {
        console.error("GDP fetch failed", country.code, error);
        return { code: country.code, points: [] };
      }
    })
  );

  // Fetch additional World Bank metrics in parallel
  const [populationData, inflationData, unemploymentData] = await Promise.all([
    Promise.all(
      countries.map(async (country) => ({
        code: country.code,
        value: await fetchPopulation(country.iso2),
      }))
    ),
    Promise.all(
      countries.map(async (country) => ({
        code: country.code,
        value: await fetchInflationRate(country.iso2),
      }))
    ),
    Promise.all(
      countries.map(async (country) => ({
        code: country.code,
        value: await fetchUnemploymentRate(country.iso2),
      }))
    ),
  ]);

  const populationMap = populationData.reduce<Record<MarketCode, number | null>>(
    (acc, { code, value }) => {
      acc[code] = value;
      return acc;
    },
    {} as Record<MarketCode, number | null>
  );

  const inflationMap = inflationData.reduce<Record<MarketCode, number | null>>(
    (acc, { code, value }) => {
      acc[code] = value;
      return acc;
    },
    {} as Record<MarketCode, number | null>
  );

  const unemploymentMap = unemploymentData.reduce<Record<MarketCode, number | null>>(
    (acc, { code, value }) => {
      acc[code] = value;
      return acc;
    },
    {} as Record<MarketCode, number | null>
  );

  const gdpLatestMap = gdpSeries.reduce<Record<MarketCode, { value: number; period: string }>>(
    (acc, { code, points }) => {
      const latest = pickLatestWorldBankPoint(points);
      if (latest) {
        acc[code] = { value: latest.value, period: latest.period };
      }
      return acc;
    },
    {} as Record<MarketCode, { value: number; period: string }>
  );

  const pppLatestMap = pppSeries.reduce<Record<MarketCode, { value: number; period: string }>>(
    (acc, { code, points }) => {
      const seriesEntry = findTargetSeries(points, countryByCode(code));
      if (!seriesEntry) return acc;
      const latest = pickLatest(seriesEntry);
      if (latest) {
        acc[code] = { value: latest.value, period: latest.period };
      }
      return acc;
    },
    {} as Record<MarketCode, { value: number; period: string }>
  );

  const usaGdp = gdpLatestMap.USA?.value ?? null;

  const snapshots: PPPDatum[] = countries.map((country) => {
    const fx = fxRates[country.currencyCode];
    const ppp = pppLatestMap[country.code];
    const gdp = gdpLatestMap[country.code];
    const multiplier = computeMultiplier(fx?.rate ?? null, ppp?.value ?? null);
    const gdpVsUsa = gdp?.value && usaGdp ? gdp.value / usaGdp : null;

    return {
      countryCode: country.code,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      fxRate: fx?.rate ?? null,
      fxTimestamp: fx?.timestamp ?? null,
      pppConversionRate: ppp?.value ?? null,
      pppYear: ppp?.period ?? null,
      gdpPerCapitaPPP: gdp?.value ?? null,
      gdpYear: gdp?.period ?? null,
      multiplier,
      localPurchasingPower: multiplier,
      gdpVsUsa,
      population: populationMap[country.code] ?? null,
      inflationRate: inflationMap[country.code] ?? null,
      unemploymentRate: unemploymentMap[country.code] ?? null,
    };
  });

  return snapshots;
}

function findTargetSeries(
  seriesMap: Record<string, { period: string; value: number }[]>,
  country: CountryConfig
) {
  const entry = Object.entries(seriesMap).find(([key]) =>
    key.includes(`LOCATION:${country.oecdLocation}`) && key.includes(`INDIC:${PPP_INDICATOR}`)
  );
  return entry?.[1] ?? null;
}

function countryByCode(code: MarketCode) {
  return COUNTRY_MAP[code];
}

function computeMultiplier(marketRate: number | null, pppRate: number | null) {
  if (!marketRate || !pppRate) return null;
  if (pppRate === 0) return null;
  // Market rate / PPP rate = revenue purchasing power multiplier
  // Market rate = actual exchange rate (e.g., 156 JPY per USD)
  // PPP rate = purchasing power rate (e.g., 105 JPY per "PPP dollar")
  // If market rate > PPP rate → consumers spending more → higher revenue value → multiplier > 1
  // If market rate < PPP rate → consumers spending less → lower revenue value → multiplier < 1
  return Number((marketRate / pppRate).toFixed(3));
}
