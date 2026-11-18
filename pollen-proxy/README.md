# pollen-proxy

Cloud Run function that proxies Google Pollen API requests for noadsweather.com.

## Why this exists

- **Hides the Google Pollen API key** from the browser (where it would be exposed to scraping and abuse).
- **Enforces an Origin/Referer check** so only requests from noadsweather.com can drain the metered API quota.
- **Caches responses for 1 hour** to reduce API quota usage (pollen data is daily, so even longer would be fine; client-side localStorage already does per-day caching).
- **Does not log IPs or coordinates** in application code — and the project's GCP logging exclusions strip platform-level request logs as well.

## Contract

```
GET pollen-proxy-<HASH>.run.app/?lat=<float>&lon=<float>
```

Returns the Google Pollen API response shape (`{ dailyInfo: [...] }`), passed through.

| Status | Meaning |
|---|---|
| `200` | Success — pollen forecast in body |
| `400` | Invalid or missing `lat` / `lon` |
| `403` | Origin/Referer not noadsweather.com |
| `405` | Method other than GET (after OPTIONS preflight) |
| `500` | API key not configured, or upstream failure with no cached response |
| `502` | Upstream Google Pollen API returned a non-OK status |

### Forecast fallback

```
GET pollen-proxy-<HASH>.run.app/?type=forecast&<Open-Meteo forecast query>
```

Makes the same `api.open-meteo.com/v1/forecast` request from Cloud Run and passes the status and body through unchanged (`502` if Open-Meteo can't be reached). The browser uses it only when it can't reach Open-Meteo directly, which happens on some VPN servers. Same Origin/Referer gate; no API key involved.

## Environment variables

| Name | Required | Purpose |
|---|---|---|
| `POLLEN_API_KEY` | Yes | Google Pollen API key (Cloud Run env var or Secret Manager) |

## Deploy

```bash
gcloud run deploy pollen-proxy \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --function pollenProxy
```

The `--function pollenProxy` flag matches the `functions.http('pollenProxy', ...)` registration in `index.js`. Required by recent Cloud Native Buildpacks for Functions Framework deployments.

`POLLEN_API_KEY` is preserved across redeploys as long as you don't pass `--set-env-vars` or `--clear-env-vars`.

## Privacy

Application code does not log IPs or coordinates. The project also configures Cloud Logging exclusions for this service to prevent platform-level access-log retention. See `privacy.html` in the parent repo for the full disclosure.
