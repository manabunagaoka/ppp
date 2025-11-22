## PPP Reality Dashboard

Translate a headline USD figure into on-the-ground profitability for the US, Mexico, Japan, South Korea, China, Taiwan, and Germany. The app overlays live FX, OECD PPP conversion rates, and World Bank GDP-per-capita data with optional OpenAI commentary so you can explain real purchasing power to stakeholders.

### Highlights

- **Data backbone**: live FX via open.er-api.com, PPP conversion via OECD SDMX (dataset `PPPGDP`, indicator `PPP`), GDP/capita PPP via World Bank (`NY.GDP.PCAP.PP.KD`).
- **Wall Street UI**: dark glass panels, summary callouts, and AI explainers styled after the `unicorn` reference app.
- **API-first**: `/api/ppp` returns the blended dataset for reuse; `/api/explain` sends a structured prompt to OpenAI for narrative context.

### Environment variables

```
OPENAI_API_KEY=your_key_here   # optional but required for AI commentary
OPENAI_MODEL=gpt-4.1-mini      # optional override
```

Without `OPENAI_API_KEY` the dashboard loads metrics but disables the “Explain with AI” button.

### Development

```
npm install
npm run dev
```

Open `http://localhost:3000` to view the dashboard. The landing page (`src/app/page.tsx`) is server-rendered and pulls data directly from the helper in `src/lib/metrics.ts`, so hot reloads automatically refresh the figures.

### Production build

```
npm run build
npm start
```

### API surface

- `GET /api/ppp?countries=USA,MEX,...` → blended PPP snapshot (USD base).
- `POST /api/explain` → OpenAI-backed paragraph describing a country’s multiplier (requires API key).

### Data considerations

- OECD PPP data updates annually; we cache responses for 12h. FX refreshes every 30 minutes.
- Taiwan PPP data may lag behind other markets and will render as “awaiting PPP feed” until OECD publishes it.
- World Bank GDP-per-capita PPP series is reported in constant 2017 international dollars, which is ideal for relative comparisons across markets.
