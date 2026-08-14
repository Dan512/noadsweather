# NoAdsWeather

**Weather without the clutter.** [noadsweather.com](https://noadsweather.com)

A fast, ad-free, privacy-respecting weather website. No tracking, no cookies, no bloat. Just weather.

## Why?

Weather websites are some of the most bloated pages on the internet. A typical weather page loads 6-12MB of JavaScript, tracking scripts, and ads just to show you the temperature. NoAdsWeather loads in under 530KB total — that's 10-20x lighter.

## Features

- Current conditions with feels-like, humidity, dew point, wind, gusts, UV index, and air quality
- Pollen data (Google Pollen API for non-European locations, Open-Meteo for Europe)
- 24-hour hourly forecast
- 10-day forecast with interactive charts (temperature, humidity/cloud/pressure, precipitation, wind)
- Animated weather radar with play/pause and speed controls
- Sunrise, sunset, solar noon, moonrise, moonset, and moon phase
- NWS severe weather alerts (US)
- Weather summary sentence generated from forecast data
- Dark mode (auto-detects OS preference, manual toggle)
- Fahrenheit/Celsius and 12H/24H toggles (auto-detects from country)
- Customizable layout — drag to reorder sections, resize, minimize, or hide any section
- Bookmarkable URLs with direct lat/lon for instant loading
- Installable as a PWA (Progressive Web App)
- International postal code support (60+ countries)
- Zero cookies, zero tracking, zero analytics

## Tech Stack

- **Frontend:** Plain HTML, CSS, vanilla JavaScript — no frameworks, no bundler, no npm dependencies at runtime
- **Hosting:** GitHub Pages (free)
- **Weather data:** [Open-Meteo API](https://open-meteo.com/) (free, no API key)
- **Radar:** [RainViewer API](https://www.rainviewer.com/api.html) (free) + [CartoDB](https://carto.com/basemaps/) map tiles
- **Alerts:** [NWS API](https://www.weather.gov/documentation/services-web-api) (free, US only)
- **Air quality:** [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (free)
- **Pollen:** [Google Pollen API](https://developers.google.com/maps/documentation/pollen) via Cloud Run proxy
- **Postal codes:** [Zippopotam](https://api.zippopotam.us/) (free, 60+ countries)

## Running Locally

No build step is required to serve the site. Just serve the files:

```bash
npx http-server . -p 8080
```

Then open `http://localhost:8080`.

### Regenerating city pages

There are two build scripts:

**`scripts/build-cities.js`** regenerates the static city pages under `cities/`, the `/cities/` index page, and `sitemap.xml`. Re-run it when you edit:

- `scripts/cities.json` (the city list),
- `scripts/climate-data.json` (per-city climate normals, see below),
- the city-page i18n keys in `js/i18n.js` / `js/i18n/*.js` (`cityPage*`, `nearbyCities`, `climate*`), or
- the `<head>` metadata in `index.html` (it's the template the city pages are generated from).

**`scripts/fetch-climate.js`** computes each city's climate normals (1991–2020 monthly averages) and temperature records (since 1940) from the Open-Meteo historical archive (ERA5) and writes `scripts/climate-data.json`, which is committed. Only re-run it after adding cities — it skips cities already present, paces requests to respect Open-Meteo's rate limits (a full run takes ~10 minutes), and `build-cities.js` renders whatever it finds.

```bash
node scripts/build-cities.js
```

The generated `cities/` directory is committed to the repo so GitHub Pages can serve it directly.

## Project Structure

```
index.html          — Single-page app entry; also the template used by build-cities.js
privacy.html        — Standalone privacy page
about/              — Standalone about page
css/style.css       — All styles with CSS custom properties for theming
js/app.js           — All application logic (~3362 lines)
js/i18n.js          — i18n core: helpers + English translations (the fallback)
js/i18n/            — Per-language translation files (14), loaded on demand
fonts/, img/        — Static assets
scripts/            — build-cities.js, fetch-climate.js, cities.json, climate-data.json
cities/             — generated city pages (committed)
alerts-proxy/       — Cloud Run proxy for NWS alerts
pollen-proxy/       — Cloud Run proxy for Google Pollen API
robots.txt, sitemap.xml
CNAME               — Custom domain config for GitHub Pages
LICENSE             — MIT License
```

## How It Works

1. User searches a city name or postal code
2. Geocoding converts the search to lat/lon coordinates (Open-Meteo for cities, Zippopotam for postal codes)
3. All weather APIs are called in parallel from the browser — no backend needed
4. Sections render progressively as each API responds
5. User preferences (layout, units, theme) are saved in localStorage
6. Pollen data is fetched on-demand through a Cloud Run proxy to keep the API key private

## Cost

- **Domain:** ~$10/year
- **Hosting:** Free (GitHub Pages)
- **APIs:** Free (Open-Meteo, RainViewer, NWS, Zippopotam)
- **Pollen proxy:** Free tier (Google Cloud Run)
- **Total:** ~$10/year

## License

MIT — see [LICENSE](LICENSE)

## Support

If you find this useful, consider [supporting us on Ko-fi](https://ko-fi.com/noadsdude).
