export type MarketCode = "USA" | "MEX" | "BRA" | "JPN" | "KOR" | "CHN" | "IND" | "GBR" | "DEU" | "POL" | "ZAF";

export type CountryConfig = {
  code: MarketCode;
  iso2: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  accent: string;
  oecdLocation: string;
  region: string;
};

export const COUNTRIES: CountryConfig[] = [
  // Americas
  {
    code: "USA",
    iso2: "US",
    name: "United States",
    currencyCode: "USD",
    currencySymbol: "$",
    accent: "#f5ba27",
    oecdLocation: "USA",
    region: "Americas",
  },
  {
    code: "MEX",
    iso2: "MX",
    name: "Mexico",
    currencyCode: "MXN",
    currencySymbol: "$",
    accent: "#ff5d8f",
    oecdLocation: "MEX",
    region: "Americas",
  },
  {
    code: "BRA",
    iso2: "BR",
    name: "Brazil",
    currencyCode: "BRL",
    currencySymbol: "R$",
    accent: "#ffd93d",
    oecdLocation: "BRA",
    region: "Americas",
  },
  // Asia
  {
    code: "JPN",
    iso2: "JP",
    name: "Japan",
    currencyCode: "JPY",
    currencySymbol: "¥",
    accent: "#69d1ff",
    oecdLocation: "JPN",
    region: "Asia",
  },
  {
    code: "KOR",
    iso2: "KR",
    name: "South Korea",
    currencyCode: "KRW",
    currencySymbol: "₩",
    accent: "#64f5c4",
    oecdLocation: "KOR",
    region: "Asia",
  },
  {
    code: "CHN",
    iso2: "CN",
    name: "China",
    currencyCode: "CNY",
    currencySymbol: "¥",
    accent: "#ff9054",
    oecdLocation: "CHN",
    region: "Asia",
  },
  {
    code: "IND",
    iso2: "IN",
    name: "India",
    currencyCode: "INR",
    currencySymbol: "₹",
    accent: "#ff6b9d",
    oecdLocation: "IND",
    region: "Asia",
  },
  // Europe
  {
    code: "GBR",
    iso2: "GB",
    name: "United Kingdom",
    currencyCode: "GBP",
    currencySymbol: "£",
    accent: "#b794f6",
    oecdLocation: "GBR",
    region: "Europe",
  },
  {
    code: "DEU",
    iso2: "DE",
    name: "Germany",
    currencyCode: "EUR",
    currencySymbol: "€",
    accent: "#9be7ff",
    oecdLocation: "DEU",
    region: "Europe",
  },
  {
    code: "POL",
    iso2: "PL",
    name: "Poland",
    currencyCode: "PLN",
    currencySymbol: "zł",
    accent: "#ff85a1",
    oecdLocation: "POL",
    region: "Europe",
  },
  // Middle East / Africa
  {
    code: "ZAF",
    iso2: "ZA",
    name: "South Africa",
    currencyCode: "ZAR",
    currencySymbol: "R",
    accent: "#74c0fc",
    oecdLocation: "ZAF",
    region: "Africa",
  },
];

export const COUNTRY_MAP: Record<MarketCode, CountryConfig> = COUNTRIES.reduce(
  (acc, country) => {
    acc[country.code] = country;
    return acc;
  },
  {} as Record<MarketCode, CountryConfig>
);
