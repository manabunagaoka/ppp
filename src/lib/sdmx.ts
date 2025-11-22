const OECD_BASE_URL = "https://stats.oecd.org/SDMX-JSON/data";

type Observation = [number | null, ...unknown[]];

type SdmxDimension = {
  id: string;
  values: Array<{
    id: string;
    name?: string;
  }>;
};

type SdmxSeries = {
  observations: Record<string, Observation>;
};

type SdmxResponse = {
  data: {
    dataSets: Array<{
      series: Record<string, SdmxSeries>;
    }>;
    structures: Array<{
      dimensions: {
        series: SdmxDimension[];
        observation: SdmxDimension[];
      };
    }>;
  };
};

type FetchSeriesOptions = {
  dataset: string;
  key: string;
  params?: Record<string, string | number>;
};

export type SdmxPoint = {
  period: string;
  value: number;
};

const defaultParams = {
  contentType: "application/json",
  detail: "dataonly",
};

export async function fetchSdmxSeries({ dataset, key, params = {} }: FetchSeriesOptions) {
  const searchParams = new URLSearchParams({
    ...defaultParams,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${OECD_BASE_URL}/${dataset}/${key}?${searchParams.toString()}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
    },
    redirect: "follow",
    next: {
      revalidate: 60 * 60 * 12, // refresh twice a day
    },
  });

  if (!res.ok) {
    throw new Error(`OECD request failed (${res.status}) for ${url}`);
  }

  const body = (await res.json()) as SdmxResponse;
  const dataSet = body.data?.dataSets?.[0];
  const structure = body.data?.structures?.[0];

  if (!dataSet || !structure) {
    throw new Error("Malformed SDMX response");
  }

  const seriesDimensions = structure.dimensions.series;
  const observationDimensions = structure.dimensions.observation;
  const points: Record<string, SdmxPoint[]> = {};

  for (const [seriesKey, seriesValue] of Object.entries(dataSet.series ?? {})) {
    const dimensionValues = resolveSeriesKey(seriesKey, seriesDimensions);
    const observationPoints = toObservationPoints(
      seriesValue.observations,
      observationDimensions
    );
    const compoundKey = Object.entries(dimensionValues)
      .map(([id, value]) => `${id}:${value}`)
      .join("|");
    points[compoundKey] = observationPoints;
  }

  return points;
}

function resolveSeriesKey(key: string, dimensions: SdmxDimension[]) {
  const indexes = key.split(":").map((segment) => parseInt(segment, 10));
  return dimensions.reduce<Record<string, string>>((acc, dimension, idx) => {
    const valueIndex = indexes[idx];
    const value = dimension.values[valueIndex];
    if (value) {
      acc[dimension.id] = value.id;
    }
    return acc;
  }, {});
}

function toObservationPoints(
  observations: Record<string, Observation>,
  observationDimensions: SdmxDimension[]
): SdmxPoint[] {
  const timeDimension = observationDimensions.find((dim) => dim.id === "TIME_PERIOD")
    ?? observationDimensions[0];

  return Object.entries(observations ?? {})
    .map(([index, [value]]) => {
      if (typeof value !== "number" || Number.isNaN(value)) {
        return null;
      }
      const timeValue = timeDimension?.values?.[Number(index)]?.id ?? index;
      return { period: timeValue, value } as SdmxPoint;
    })
    .filter(Boolean) as SdmxPoint[];
}

export function pickLatest(points: SdmxPoint[]) {
  return [...points].sort((a, b) => toSortable(b.period) - toSortable(a.period))[0];
}

function toSortable(period: string) {
  if (/^\d{4}$/.test(period)) {
    return Number(period);
  }
  if (/^(\d{4})-Q(\d)$/.test(period)) {
    const [, year, quarter] = period.match(/^(\d{4})-Q(\d)$/)!;
    return Number(year) + Number(quarter) / 10;
  }
  if (/^(\d{4})-(\d{2})$/.test(period)) {
    const [, year, month] = period.match(/^(\d{4})-(\d{2})$/)!;
    return Number(year) + Number(month) / 100;
  }
  return Number(new Date(period).getTime());
}
