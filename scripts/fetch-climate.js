#!/usr/bin/env node
// Builds scripts/climate-data.json — the per-city climate normals and records
// rendered as the static "Climate in {city}" section on each city page.
//
// Source: Meteostat bulk data (https://dev.meteostat.net/bulk/) — plain static
// gzipped files, no API key and no rate limits, unlike the metered weather
// APIs the live site uses. Each city is matched to the nearest weather station
// with adequate 1991-2020 coverage; that station's full daily history gives us
// monthly normals, wet-day counts, and all-time records in one download.
//
// Meteostat data is CC BY-NC 4.0 — attribution is rendered on every city page
// via the climateSource i18n string, and the licence is noted on privacy.html.
//
// Run from repo root:  node scripts/fetch-climate.js [--force] [--only=slug]
//
// Downloads are cached in the OS temp dir, so re-runs are cheap and an
// interrupted run resumes for free. Expect ~10 minutes for a cold 157-city run.

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');

const CITIES_JSON = path.join(__dirname, 'cities.json');
const OUT_JSON = path.join(__dirname, 'climate-data.json');
const CACHE_DIR = path.join(os.tmpdir(), 'noadsweather-meteostat-cache');

// The full index carries ~6k more stations than lite.json.gz. Note that some
// stations' stored coordinates are rounded (Key West Airport is ~0.7° off in
// longitude), so distance is a useful ranking signal but not a reliable
// measure of "is this really this city's station" — see STATION_OVERRIDES.
const STATIONS_URL = 'https://bulk.meteostat.net/v2/stations/full.json.gz';
const DAILY_URL = (id) => `https://bulk.meteostat.net/v2/daily/${id}.csv.gz`;

const NORMALS_START = 1991, NORMALS_END = 2020;
const WET_DAY_MM = 1.0;
// A station qualifies if it covers this many of the 360 months in the normals
// window for both temperature and precipitation. 240 ≈ 20 of 30 years.
const MIN_MONTHS = 240;
// Hard floor for the fallback path. Many synoptic stations report temperature
// but little or no precipitation; averaging those would render a confident
// "0 mm" for every month, which is worse than showing nothing. A city that
// can't clear this gets no climate section at all.
const MIN_PRECIP_MONTHS = 120;
const MAX_CANDIDATES = 15;   // nearest stations to try per city
const MAX_DISTANCE_KM = 150; // beyond this a station isn't "this city" anymore

// Cities where automatic nearest-station matching picks a station in a
// materially different climate (wrong elevation, across water, a rural upland
// site standing in for a city). Hand-pinned to the correct station id, or to
// null to publish no climate section at all rather than misleading numbers.
// Populated by reviewing the ">45 km" report the script prints at the end.
const STATION_OVERRIDES = {
    // Automatic matching sent these to a station in a different climate; each
    // is pinned to the city's own station (verified to carry both temperature
    // and precipitation across the normals window).
    'santa-fe-nm': 'KSAF0',      // was Albuquerque, 600 m lower
    'palm-springs-ca': 'KPSP0',  // was Julian, a 1,280 m mountain station
    'wellington': '93439',       // was Paraparaumu, 46 km up the coast
    'myrtle-beach-sc': 'KCRE0',  // was Wilmington NC, 111 km away
    'manchester': '03334',       // was Shawbury, a rural Shropshire site
    'istanbul': '17062',         // was Bursa, across the Sea of Marmara
};

const force = process.argv.includes('--force');
const onlyArg = process.argv.find(a => a.startsWith('--only='));
const only = onlyArg ? onlyArg.slice('--only='.length) : null;

const cities = JSON.parse(fs.readFileSync(CITIES_JSON, 'utf8'));
const out = (!force && fs.existsSync(OUT_JSON))
    ? JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'))
    : {};

fs.mkdirSync(CACHE_DIR, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// --- Download helpers --------------------------------------------------------

// Fetch a gzipped bulk file and return it as text, caching by filename.
// Returns null when the station has no file (404) — a normal outcome.
async function fetchGz(url, cacheName, attempt = 1) {
    const cached = path.join(CACHE_DIR, cacheName);
    if (fs.existsSync(cached)) return fs.readFileSync(cached, 'utf8');
    let res;
    try {
        res = await fetch(url);
    } catch (e) {
        if (attempt <= 4) { await sleep(2000 * attempt); return fetchGz(url, cacheName, attempt + 1); }
        throw e;
    }
    if (res.status === 404) return null;
    if (!res.ok) {
        if (attempt <= 4) { await sleep(2000 * attempt); return fetchGz(url, cacheName, attempt + 1); }
        throw new Error(`HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const text = zlib.gunzipSync(buf).toString('utf8');
    fs.writeFileSync(cached, text, 'utf8');
    return text;
}

// --- Station selection -------------------------------------------------------

function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(a));
}

async function loadStations() {
    const text = await fetchGz(STATIONS_URL, 'stations.json');
    return JSON.parse(text).filter(s => s.location && s.location.latitude != null);
}

// Parse a Meteostat daily CSV. Columns:
// date,tavg,tmin,tmax,prcp,snow,wdir,wspd,wpgt,pres,tsun
function parseDaily(csv) {
    const rows = [];
    for (const line of csv.split('\n')) {
        if (!line) continue;
        const f = line.split(',');
        const date = f[0];
        if (!date || date.length < 10) continue;
        rows.push({
            date,
            year: +date.slice(0, 4),
            month: +date.slice(5, 7) - 1,
            tmin: f[2] === '' ? null : +f[2],
            tmax: f[3] === '' ? null : +f[3],
            prcp: f[4] === '' ? null : +f[4],
        });
    }
    return rows;
}

// How many of the 360 normals-window months have usable temp / precip data.
function coverage(rows) {
    const tMonths = new Set(), pMonths = new Set();
    for (const r of rows) {
        if (r.year < NORMALS_START || r.year > NORMALS_END) continue;
        const key = r.year * 12 + r.month;
        if (r.tmax != null && r.tmin != null) tMonths.add(key);
        if (r.prcp != null) pMonths.add(key);
    }
    return { temp: tMonths.size, precip: pMonths.size };
}

// --- Climate computation -----------------------------------------------------

function computeClimate(rows) {
    const m = Array.from({ length: 12 }, () => ({
        highSum: 0, highN: 0, lowSum: 0, lowN: 0,
        precipSum: 0, wetDays: 0, precipMonths: new Set(),
    }));
    let recordHigh = null, recordLow = null, firstYear = null;

    for (const r of rows) {
        if (r.tmax != null || r.tmin != null || r.prcp != null) {
            if (firstYear === null || r.year < firstYear) firstYear = r.year;
        }
        if (r.tmax != null && (recordHigh === null || r.tmax > recordHigh.c)) {
            recordHigh = { c: r.tmax, date: r.date };
        }
        if (r.tmin != null && (recordLow === null || r.tmin < recordLow.c)) {
            recordLow = { c: r.tmin, date: r.date };
        }

        if (r.year < NORMALS_START || r.year > NORMALS_END) continue;
        const acc = m[r.month];
        if (r.tmax != null) { acc.highSum += r.tmax; acc.highN++; }
        if (r.tmin != null) { acc.lowSum += r.tmin; acc.lowN++; }
        if (r.prcp != null) {
            acc.precipSum += r.prcp;
            if (r.prcp >= WET_DAY_MM) acc.wetDays++;
            acc.precipMonths.add(r.year * 12 + r.month);
        }
    }

    const round1 = (v) => Math.round(v * 10) / 10;
    const normals = m.map(acc => {
        // Average per calendar month across however many Januaries (etc.)
        // actually reported precipitation — not a fixed 30, so stations with
        // partial coverage don't read as artificially dry.
        const nMonths = acc.precipMonths.size || 1;
        return {
            high: round1(acc.highSum / (acc.highN || 1)),
            low: round1(acc.lowSum / (acc.lowN || 1)),
            precip: Math.round(acc.precipSum / nMonths),
            rainDays: Math.round(acc.wetDays / nMonths),
        };
    });

    return {
        normals,
        recordHigh: { c: round1(recordHigh.c), date: recordHigh.date },
        recordLow: { c: round1(recordLow.c), date: recordLow.date },
        normalsPeriod: `${NORMALS_START}–${NORMALS_END}`,
        recordsSince: firstYear,
    };
}

// --- Main --------------------------------------------------------------------

(async () => {
    console.log('Loading Meteostat station index...');
    const stations = await loadStations();
    console.log(`${stations.length} stations with coordinates.`);

    const targets = only ? cities.filter(c => c.slug === only) : cities;
    let done = 0, skipped = 0, failed = 0;

    for (const city of targets) {
        if (out[city.slug] && !force) { skipped++; continue; }

        // Hand-pinned station (or an explicit "no climate section" null)
        if (Object.prototype.hasOwnProperty.call(STATION_OVERRIDES, city.slug)) {
            const id = STATION_OVERRIDES[city.slug];
            if (id === null) {
                delete out[city.slug];
                console.log(`${city.slug} -> (no suitable station; climate section omitted)`);
                continue;
            }
            const st = stations.find(s => s.id === id);
            const csv = st ? await fetchGz(DAILY_URL(id), `daily-${id}.csv`) : null;
            if (csv) {
                const rows = parseDaily(csv);
                const climate = computeClimate(rows);
                climate.station = st.name.en || id;
                climate.stationKm = Math.round(haversineKm(
                    city.lat, city.lon, st.location.latitude, st.location.longitude));
                out[city.slug] = climate;
                done++;
                console.log(`${city.slug} -> ${climate.station} [pinned]`);
                await sleep(150);
                continue;
            }
            console.log(`OVERRIDE FAILED ${city.slug} (${id}) — falling back to nearest`);
        }

        const candidates = stations
            .map(s => ({ s, km: haversineKm(city.lat, city.lon, s.location.latitude, s.location.longitude) }))
            .filter(c => c.km <= MAX_DISTANCE_KM)
            .sort((a, b) => a.km - b.km)
            .slice(0, MAX_CANDIDATES);

        let picked = null, fallback = null;
        for (const cand of candidates) {
            let csv;
            try {
                csv = await fetchGz(DAILY_URL(cand.s.id), `daily-${cand.s.id}.csv`);
            } catch (e) {
                continue;
            }
            if (!csv) continue;
            const rows = parseDaily(csv);
            const cov = coverage(rows);
            if (cov.temp >= MIN_MONTHS && cov.precip >= MIN_MONTHS) {
                picked = { cand, rows, cov };
                break;
            }
            // Remember the best partial match in case nothing fully qualifies
            const score = Math.min(cov.temp, cov.precip);
            if (!fallback || score > fallback.score) fallback = { cand, rows, cov, score };
            await sleep(150);
        }

        const chosen = picked ||
            (fallback && fallback.cov.precip >= MIN_PRECIP_MONTHS ? fallback : null);
        if (!chosen) {
            failed++;
            delete out[city.slug];
            const why = fallback
                ? `best nearby station has only ${fallback.cov.precip} months of precipitation`
                : 'no station within range';
            console.log(`NO DATA ${city.slug} — ${why}; climate section omitted`);
            continue;
        }

        const climate = computeClimate(chosen.rows);
        climate.station = chosen.cand.s.name.en || chosen.cand.s.id;
        climate.stationKm = Math.round(chosen.cand.km);
        out[city.slug] = climate;
        done++;

        const flag = picked ? '' : `  (partial coverage: ${chosen.cov.temp}/${chosen.cov.precip} months)`;
        console.log(`${city.slug} -> ${climate.station} (${climate.stationKm} km)${flag}`);

        if (done % 10 === 0) fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1), 'utf8');
        await sleep(150);
    }

    fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1), 'utf8');
    console.log(`\nDone: ${done} fetched, ${skipped} already present, ${failed} without a station.`);
    console.log(`${Object.keys(out).length} cities in climate-data.json.`);

    // Review aid: distant matches are where automatic selection most often
    // picks a climatically wrong station. Check these before shipping and
    // pin or drop them via STATION_OVERRIDES.
    const far = Object.entries(out)
        .filter(([, c]) => c.stationKm > 45)
        .sort((a, b) => b[1].stationKm - a[1].stationKm);
    if (far.length) {
        console.log(`\nReview these ${far.length} distant matches:`);
        for (const [slug, c] of far) console.log(`  ${c.stationKm} km  ${slug} -> ${c.station}`);
    }
})();
