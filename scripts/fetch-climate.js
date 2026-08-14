#!/usr/bin/env node
// Fetches historical weather for every city in cities.json from the
// Open-Meteo archive API (ERA5 reanalysis) and computes:
//   - monthly climate normals over 1991-2020 (avg high/low °C, avg monthly
//     precipitation mm, avg days/month with ≥1 mm precipitation)
//   - record high / record low with dates, over 1940-2025
// Results are written to scripts/climate-data.json, which is COMMITTED to
// the repo — build-cities.js reads it to render the static climate section
// on each city page. Re-running skips cities already present in the output
// (delete their entry, or pass --force, to refetch).
//
// Run from repo root:  node scripts/fetch-climate.js [--force]
//
// Be a good API citizen: the archive API budgets "API credits" per minute
// and an 86-year daily request costs ~9 credits, so pace to ~24 requests
// per minute (2.5 s apart) and wait out the minutely window on 429. A full
// 157-city run takes ≈ 8-10 minutes and is only needed when cities are
// added (or ~once a decade when the normal period rolls over).

const fs = require('fs');
const path = require('path');

const CITIES_JSON = path.join(__dirname, 'cities.json');
const OUT_JSON = path.join(__dirname, 'climate-data.json');

// Records share the normals fetch window — a longer span (e.g. since 1940)
// costs proportionally more API credits per call and blows through the
// free tier's daily budget after ~10 cities. 35 years is what fits.
const NORMALS_START = 1991, NORMALS_END = 2020;
const RECORDS_START = 1991, RECORDS_END = 2025;
const WET_DAY_MM = 1.0;

const force = process.argv.includes('--force');
const cities = JSON.parse(fs.readFileSync(CITIES_JSON, 'utf8'));
const out = (!force && fs.existsSync(OUT_JSON))
    ? JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'))
    : {};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchArchive(city, attempt = 1) {
    const url = 'https://archive-api.open-meteo.com/v1/archive' +
        `?latitude=${city.lat}&longitude=${city.lon}` +
        `&start_date=${RECORDS_START}-01-01&end_date=${RECORDS_END}-12-31` +
        '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
        '&timezone=auto';
    const res = await fetch(url);
    if (!res.ok) {
        if (res.status === 429) {
            // The response body says which budget window we hit. Wait out
            // exactly that window instead of burning retries — every request
            // against an exhausted daily budget is wasted.
            const body = await res.text().catch(() => '');
            if (/daily/i.test(body)) {
                const now = new Date();
                const reset = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(),
                    now.getUTCDate() + 1, 0, 2); // UTC midnight + 2 min slack
                const waitMs = reset - now.getTime();
                console.log(`Daily budget exhausted — sleeping ${Math.round(waitMs / 60000)} min until the UTC midnight reset...`);
                await sleep(waitMs);
            } else if (/hourly/i.test(body)) {
                console.log('Hourly budget exhausted — sleeping 15 min...');
                await sleep(15 * 60000);
            } else {
                await sleep(65000); // minutely window
            }
            // Budget waits don't count against the retry attempts.
            return fetchArchive(city, attempt);
        }
        if (attempt <= 6 && res.status >= 500) {
            await sleep(3000 * attempt);
            return fetchArchive(city, attempt + 1);
        }
        throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
}

function compute(data) {
    const { time, temperature_2m_max: tmax, temperature_2m_min: tmin,
            precipitation_sum: prcp } = data.daily;

    // Per-month accumulators over the normals window
    const m = Array.from({ length: 12 }, () => ({
        highSum: 0, highN: 0, lowSum: 0, lowN: 0,
        precipSum: 0, wetDays: 0, yearMonths: new Set(),
    }));
    let recordHigh = null, recordLow = null;

    for (let i = 0; i < time.length; i++) {
        const year = +time[i].slice(0, 4);
        const month = +time[i].slice(5, 7) - 1;

        if (tmax[i] != null && (recordHigh === null || tmax[i] > recordHigh.c)) {
            recordHigh = { c: tmax[i], date: time[i] };
        }
        if (tmin[i] != null && (recordLow === null || tmin[i] < recordLow.c)) {
            recordLow = { c: tmin[i], date: time[i] };
        }

        if (year < NORMALS_START || year > NORMALS_END) continue;
        const acc = m[month];
        acc.yearMonths.add(time[i].slice(0, 7));
        if (tmax[i] != null) { acc.highSum += tmax[i]; acc.highN++; }
        if (tmin[i] != null) { acc.lowSum += tmin[i]; acc.lowN++; }
        if (prcp[i] != null) {
            acc.precipSum += prcp[i];
            if (prcp[i] >= WET_DAY_MM) acc.wetDays++;
        }
    }

    const round1 = (v) => Math.round(v * 10) / 10;
    const normals = m.map(acc => {
        const nMonths = acc.yearMonths.size || 1;
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
        recordsSince: RECORDS_START,
    };
}

(async () => {
    let fetched = 0, skipped = 0, failed = 0;
    for (const city of cities) {
        if (out[city.slug]) { skipped++; continue; }
        try {
            const data = await fetchArchive(city);
            out[city.slug] = compute(data);
            fetched++;
            if (fetched % 5 === 0) {
                console.log(`  ${fetched} fetched...`);
                // Checkpoint so an interrupted run keeps its progress
                fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1), 'utf8');
            }
        } catch (e) {
            failed++;
            console.log(`FAILED ${city.slug}: ${e.message}`);
        }
        await sleep(2500);
    }
    fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1), 'utf8');
    console.log(`Done: ${fetched} fetched, ${skipped} already present, ${failed} failed.`);
    console.log(`Wrote ${OUT_JSON} (${Object.keys(out).length} cities).`);
    process.exit(failed ? 1 : 0);
})();
