import type { MarketCode } from "./countries";

export interface CountryInsight {
  marketReality: string[];
  operationalGotchas: string[];
  competitionLandscape: string[];
  hiddenCosts: string[];
}

export const COUNTRY_INSIGHTS: Record<MarketCode, CountryInsight> = {
  USA: {
    marketReality: [
      "Home market advantage - you understand the customer intuitively",
      "Hyper-competitive across all sectors; differentiation is hard",
      "Litigious culture - legal costs are real and constant",
    ],
    operationalGotchas: [
      "Healthcare costs for employees are a major budget line ($15k-20k/year per person)",
      "State-by-state regulatory complexity adds overhead",
      "Talent expects high salaries and equity; retention is expensive",
    ],
    competitionLandscape: [
      "VC-funded competitors burn cash to acquire customers",
      "Big tech dominates infrastructure and distribution",
      "Brand loyalty is weak; customers switch for price or features",
    ],
    hiddenCosts: [
      "Sales & marketing CAC is highest globally - paid ads saturated",
      "Office space in major cities: $50-100/sq ft annually",
      "Legal, insurance, compliance: 15-20% of operating budget",
    ],
  },
  MEX: {
    marketReality: [
      "130M population, young demographic (median age 29), growing middle class",
      "Regional inequality - Mexico City/Monterrey ≠ rural areas",
      "Cash still dominant; digital payments growing but not universal",
    ],
    operationalGotchas: [
      "Bureaucracy and permits take 2-3x longer than expected",
      "Corruption tax is real - factor in 'facilitation payments'",
      "Labor laws heavily favor employees; firing is difficult and costly",
    ],
    competitionLandscape: [
      "Local incumbents have government relationships and distribution",
      "US brands have trust advantage, but locals compete on price",
      "E-commerce growing fast but logistics infrastructure is weak",
    ],
    hiddenCosts: [
      "Security costs for offices/staff in certain regions",
      "Currency volatility - hedge or accept 10-15% swings",
      "Dual-language operations add 20-30% to content/support costs",
    ],
  },
  BRA: {
    marketReality: [
      "215M population, massive domestic market but income inequality is extreme",
      "Regional differences are huge - treat as multiple markets",
      "Price sensitivity is high; payment plans (boleto) are standard",
    ],
    operationalGotchas: [
      "Tax system is notoriously complex - 'custo Brasil' adds 30-40% overhead",
      "Labor laws are rigid; social costs add 80-100% to base salary",
      "Import tariffs make hardware/equipment 2-3x US prices",
    ],
    competitionLandscape: [
      "Local champions (MercadoLibre, Nubank) dominate; hard to compete",
      "Fintech is hot but regulated; banking licenses take years",
      "B2B sales require relationships; cold outreach doesn't work",
    ],
    hiddenCosts: [
      "Legal entity setup: 3-6 months, multiple registrations required",
      "Logistics/shipping is slow and expensive due to infrastructure",
      "Customer support must be Portuguese; English won't cut it",
    ],
  },
  JPN: {
    marketReality: [
      "Aging population (29% over 65) - B2C needs senior-friendly approach",
      "Quality obsession - 'good enough' doesn't exist; perfectionism drives costs up",
      "Loyalty matters - first mover advantage is huge; switching costs are cultural",
    ],
    operationalGotchas: [
      "Labor shortage crisis - unemployment at 2.4%, talent war is brutal",
      "Compliance is extensive - 3-6 months for business registration, endless paperwork",
      "Work culture: consensus-driven = slow decisions; hierarchy = bottlenecks",
    ],
    competitionLandscape: [
      "Domestic giants (Rakuten, Line, SoftBank) have distribution locked down",
      "Risk-averse consumers prefer proven brands; startups struggle for trust",
      "Local partnerships required - foreigner status is a barrier without Japanese face",
    ],
    hiddenCosts: [
      "Translation/localization is not just language - UX, marketing, everything needs rework",
      "Customer acquisition - digital ads expensive; traditional media still matters",
      "Relationship building - sales cycles 2-3x longer; drinks/dinners are business expenses",
    ],
  },
  KOR: {
    marketReality: [
      "52M population, highly urbanized (Seoul metro = 50% of population)",
      "Tech-savvy early adopters; mobile-first market (smartphone penetration 95%)",
      "Fast-follower culture - trends spread quickly but competition is fierce",
    ],
    operationalGotchas: [
      "Chaebol (Samsung, Hyundai, etc.) dominate economy; hard to compete in their verticals",
      "Work culture is intense - 'ppalli ppalli' (hurry hurry) but also hierarchical",
      "Business relationships matter - need local partners for credibility",
    ],
    competitionLandscape: [
      "Naver and Kakao control digital ecosystem - distribution requires their platforms",
      "Local brands have home advantage; foreign = premium positioning required",
      "Copy-cat risk is high - protect IP aggressively or move fast",
    ],
    hiddenCosts: [
      "Marketing requires influencer/celebrity endorsements - expensive but necessary",
      "Customer service expectations are sky-high - 24/7 support expected",
      "Localization beyond translation - cultural nuances matter in every interaction",
    ],
  },
  CHN: {
    marketReality: [
      "1.4B population but fragmented - tier 1/2/3 cities are different markets",
      "Mobile payments (Alipay, WeChat Pay) are universal - cash is dead",
      "Government policy shifts can make/break sectors overnight",
    ],
    operationalGotchas: [
      "Foreign companies face restrictions - many sectors require local JV partner",
      "Great Firewall requires China-specific tech stack (no Google, AWS, etc.)",
      "Data localization laws - must store Chinese customer data in China",
    ],
    competitionLandscape: [
      "Local competitors move at 'China speed' - 10x faster iteration than West",
      "BAT (Baidu, Alibaba, Tencent) control distribution - must play in their ecosystem",
      "Intellectual property protection is weak - expect copycats immediately",
    ],
    hiddenCosts: [
      "Relationship building (guanxi) requires time and investment - 6-12 months minimum",
      "On-the-ground presence required - remote management doesn't work",
      "Regulatory compliance is opaque - legal costs are 2-3x budget estimates",
    ],
  },
  IND: {
    marketReality: [
      "1.4B population, young (median age 28), but income levels vary wildly",
      "Urban vs rural divide - 65% rural but wealth concentrated in cities",
      "Price sensitivity extreme - must have low-cost entry points",
    ],
    operationalGotchas: [
      "Infrastructure gaps - power outages, internet reliability issues outside tier 1 cities",
      "Fragmented market - 28 states, 22 languages, different regulations",
      "Payment infrastructure improving but cash-on-delivery still 30% of e-commerce",
    ],
    competitionLandscape: [
      "Jio/Reliance dominates; local champions (Flipkart, Ola) have massive advantages",
      "Western brands face 'tax' - perceived as expensive regardless of actual pricing",
      "Jugaad culture - locals innovate on shoestring budgets; hard to compete on cost",
    ],
    hiddenCosts: [
      "Multi-language support required - Hindi + English minimum, regional languages for scale",
      "Distribution logistics are complex - last-mile delivery is a major challenge",
      "Corruption and bureaucracy - factor in 'speed money' and delays",
    ],
  },
  GBR: {
    marketReality: [
      "68M population, mature market, high purchasing power in London/Southeast",
      "Brexit creates regulatory divergence from EU - separate compliance needed",
      "Class consciousness affects brand positioning - know your audience",
    ],
    operationalGotchas: [
      "Talent costs in London rival Silicon Valley - £80-120k for senior roles",
      "Post-Brexit visa restrictions make hiring non-UK talent harder",
      "Regional differences - Scotland, Wales, Northern Ireland have distinct dynamics",
    ],
    competitionLandscape: [
      "Crowded market - UK is testing ground for EU expansion, lots of competition",
      "American brands have cultural advantage - English language, similar business culture",
      "Loyalty to local brands is moderate - consumers switch for value",
    ],
    hiddenCosts: [
      "VAT complexity - 20% standard rate plus various exemptions to navigate",
      "Office space in London: £60-100/sq ft - rivals NYC",
      "Marketing requires local nuance - US messaging doesn't translate directly",
    ],
  },
  DEU: {
    marketReality: [
      "84M population, wealthiest EU market, but risk-averse consumers",
      "Privacy-conscious - GDPR compliance is table stakes, trust must be earned",
      "B2B powerhouse - Mittelstand (medium-sized enterprises) drive economy",
    ],
    operationalGotchas: [
      "Labor protections are strong - firing is difficult, works councils have power",
      "Bureaucracy is real - 'Ordnung muss sein' (there must be order) affects everything",
      "Business culture is formal - relationships take time, contracts are detailed",
    ],
    competitionLandscape: [
      "Local incumbents (SAP, Siemens, Deutsche Telekom) dominate B2B",
      "German brands have quality reputation - foreign = prove yourself first",
      "Regulatory compliance is strict - non-compliance = market exit",
    ],
    hiddenCosts: [
      "German-language requirement is non-negotiable - machine translation won't work",
      "Employee benefits are expensive - social contributions add 40% to salary",
      "Product certifications (TÜV, CE marks, etc.) add time and cost",
    ],
  },
  POL: {
    marketReality: [
      "38M population, fastest-growing EU economy, young workforce",
      "Increasing purchasing power - middle class expanding rapidly",
      "EU membership = access to single market but local competition is fierce",
    ],
    operationalGotchas: [
      "Warsaw is expensive - talent costs approaching Western Europe levels",
      "Outside major cities, infrastructure and logistics are still developing",
      "Business culture mix of Western efficiency and Eastern relationship focus",
    ],
    competitionLandscape: [
      "Local tech scene is strong - Allegro, InPost compete with Western giants",
      "Western European brands have prestige advantage but price sensitivity remains",
      "Talent shortage in tech - developers get multiple offers, retention is hard",
    ],
    hiddenCosts: [
      "Polish language required for consumer-facing businesses - 98% speak Polish at home",
      "VAT/tax compliance is complex - local accountant is mandatory",
      "Seasonal workforce migration to Western Europe affects availability",
    ],
  },
  ZAF: {
    marketReality: [
      "60M population, extreme inequality - target affluent minority or mass market, not both",
      "Infrastructure challenges - power outages (load shedding) are routine",
      "Mobile-first market - smartphone penetration high even at lower income levels",
    ],
    operationalGotchas: [
      "Currency volatility - rand swings 15-20% annually, hedge or price in dollars",
      "Crime/security is real - factor in physical security costs for offices/staff",
      "BEE (Black Economic Empowerment) requirements for government/corporate contracts",
    ],
    competitionLandscape: [
      "Local champions (Shoprite, Capitec, Naspers) dominate consumer markets",
      "Fragmented market - English, Afrikaans, plus 9 official African languages",
      "Fintech is hot but regulated - partnerships with banks required",
    ],
    hiddenCosts: [
      "Logistics are challenging - rail infrastructure weak, roads have issues",
      "Talent retention is hard - skilled workers emigrate to UK/Australia/US",
      "Payment infrastructure - credit card penetration low, mobile money growing",
    ],
  },
};
