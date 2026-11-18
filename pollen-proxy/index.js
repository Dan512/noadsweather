const functions = require('@google-cloud/functions-framework');

const CACHE = new Map(); // key: "lat,lon" (2 decimals) → { at, data }
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour (pollen data is daily; longer cache is fine)
const MAX_CACHE_ENTRIES = 1000; // prevent unbounded growth on long-lived instances

// Origin/Referer gate — CORS only protects browsers. Without this, any
// server-side caller can drain the metered Google Pollen API quota tied to
// our API key. OPTIONS preflight is whitelisted earlier (browsers may
// omit Origin on preflight).
const ALLOWED_HOSTS = new Set(['noadsweather.com', 'www.noadsweather.com']);

function isAllowedRequest(req) {
    const origin = req.headers.origin || '';
    const referer = req.headers.referer || '';
    try {
        if (origin) {
            const host = new URL(origin).hostname;
            if (ALLOWED_HOSTS.has(host)) return true;
        }
        if (referer) {
            const host = new URL(referer).hostname;
            if (ALLOWED_HOSTS.has(host)) return true;
        }
    } catch (e) { /* malformed URL — fall through to deny */ }
    return false;
}

function cacheSet(key, data) {
    // Evict oldest (insertion order) if at capacity
    if (CACHE.size >= MAX_CACHE_ENTRIES && !CACHE.has(key)) {
        CACHE.delete(CACHE.keys().next().value);
    }
    CACHE.set(key, { at: Date.now(), data });
}

functions.http('pollenProxy', async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', 'https://noadsweather.com');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (!isAllowedRequest(req)) { res.status(403).json({ error: 'Forbidden' }); return; }
    if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

    // Backup route for the main forecast: Open-Meteo blocks some VPN servers,
    // so the browser asks us to make the identical request from here.
    if (req.query.type === 'forecast') {
        const params = new URL(req.originalUrl || req.url, 'http://localhost').searchParams;
        params.delete('type');
        try {
            const upstream = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`,
                { signal: AbortSignal.timeout(10000) });
            if (!upstream.ok) console.error(`pollen-proxy: open-meteo status ${upstream.status}`);
            res.status(upstream.status).type('application/json').send(await upstream.text());
        } catch (err) {
            console.error('pollen-proxy: open-meteo error:', err?.name, err?.message);
            res.status(502).json({ error: 'Failed to fetch forecast' });
        }
        return;
    }

    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        res.status(400).json({ error: 'valid lat/lon required' });
        return;
    }

    const cacheKey = `pollen:${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cached = CACHE.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        res.json(cached.data);
        return;
    }

    const apiKey = process.env.POLLEN_API_KEY;
    if (!apiKey) {
        console.error('pollen-proxy: POLLEN_API_KEY not set');
        res.status(500).json({ error: 'API key not configured' });
        return;
    }

    const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&days=1`;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const upstream = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!upstream.ok) {
            // Note: deliberately omit lat/lon so coordinates aren't persisted
            // alongside Cloud Run's auto-captured remoteIp.
            console.error(`pollen-proxy: upstream status ${upstream.status}`);
            if (cached) { res.json(cached.data); return; }
            res.status(502).json({ error: 'Failed to fetch pollen data' });
            return;
        }

        const data = await upstream.json();
        cacheSet(cacheKey, data);
        res.json(data);
    } catch (err) {
        console.error('pollen-proxy: upstream error:', err?.name, err?.message);
        if (cached) { res.json(cached.data); return; }
        res.status(500).json({ error: 'Failed to fetch pollen data' });
    }
});
