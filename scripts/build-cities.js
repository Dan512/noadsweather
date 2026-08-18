#!/usr/bin/env node
// Build script for noadsweather.com SEO city landing pages.
// Reads scripts/cities.json + js/i18n.js TRANSLATIONS and writes static
// HTML files to cities/{slug}/index.html. Also generates sitemap.xml.
//
// Run from repo root:  node scripts/build-cities.js
//
// The script is idempotent — running it twice produces identical output.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://noadsweather.com';
const CITIES_JSON = path.join(__dirname, 'cities.json');
const TEMPLATE_HTML = path.join(ROOT, 'index.html');
const I18N_JS = path.join(ROOT, 'js', 'i18n.js');
const CITIES_DIR = path.join(ROOT, 'cities');
const SITEMAP_XML = path.join(ROOT, 'sitemap.xml');

// --- Load inputs ------------------------------------------------------------

const cities = JSON.parse(fs.readFileSync(CITIES_JSON, 'utf8'));
const templateHtml = fs.readFileSync(TEMPLATE_HTML, 'utf8');
const translations = loadTranslations();

// Climate normals/records computed by scripts/fetch-climate.js. Optional:
// cities without an entry simply render no climate section.
const CLIMATE_JSON = path.join(__dirname, 'climate-data.json');
const climateData = fs.existsSync(CLIMATE_JSON)
    ? JSON.parse(fs.readFileSync(CLIMATE_JSON, 'utf8'))
    : {};

console.log(`Loaded ${cities.length} cities.`);

// --- Generate pages ---------------------------------------------------------

let pagesWritten = 0;
const allPageUrls = [
    { url: SITE_URL + '/',        priority: '1.0' },
    { url: SITE_URL + '/about/',  priority: '0.9' },
    { url: SITE_URL + '/cities/', priority: '0.8' },
];
const variantGroups = []; // for hreflang sitemap entries

for (const city of cities) {
    const native = buildPage(city, city.nativeLang, city.slug);
    pagesWritten += writePage(native);

    if (city.nativeLang !== 'en') {
        const en = buildPage(city, 'en', city.enSlug);
        pagesWritten += writePage(en);
        variantGroups.push({ native, en });
        allPageUrls.push({ url: native.canonical, priority: '0.7' });
        allPageUrls.push({ url: en.canonical,     priority: '0.7' });
    } else {
        allPageUrls.push({ url: native.canonical, priority: '0.7' });
    }
}

console.log(`Wrote ${pagesWritten} pages.`);

writeCitiesIndex();
console.log('Wrote cities/index.html');

// --- Generate sitemap -------------------------------------------------------

writeSitemap(allPageUrls, variantGroups);
console.log('Wrote sitemap.xml');

// === Helpers ================================================================

function loadTranslations() {
    // i18n.js declares `const TRANSLATIONS = { en: {...} }` plus helpers; the
    // other 14 languages each live in js/i18n/{lang}.js and register
    // themselves as `TRANSLATIONS.<lang> = {...}`. Evaluate core + all
    // language files together in a Function wrapper (rather than
    // vm.runInThisContext) to avoid side effects.
    const src = fs.readFileSync(I18N_JS, 'utf8');
    const langDir = path.join(ROOT, 'js', 'i18n');
    const langSrc = fs.readdirSync(langDir)
        .filter(f => f.endsWith('.js'))
        .sort()
        .map(f => fs.readFileSync(path.join(langDir, f), 'utf8'))
        .join('\n');
    const fn = new Function(src + '\n' + langSrc + '; return TRANSLATIONS;');
    return fn();
}

function buildPage(city, lang, slug) {
    const cityName = city.displayName[lang] || city.displayName.en;
    const titleTemplate = translations[lang].cityPageTitle;
    const blurbTemplate = translations[lang].cityPageSeoBlurb;
    const title = titleTemplate.replace('{city}', cityName);
    const description = blurbTemplate.replace(/{city}/g, cityName);
    const canonical = `${SITE_URL}/cities/${slug}/`;

    const seoCity = {
        slug,
        lang,
        lat: city.lat,
        lon: city.lon,
        name: city.displayName.en, // canonical English name for Open-Meteo / NWS lookups
        displayName: cityName,
        country: city.country,
        region: city.region || '',
    };

    return {
        slug,
        lang,
        canonical,
        title,
        description,
        seoCity,
        city, // raw cities.json entry, used for nearby-city links
        // For hreflang we need both URLs (native + en variant). nativeLang
        // is preserved so the alternates on the -en variant page point at
        // the native URL with the *native* hreflang (not "en"), avoiding
        // duplicate hreflang="en" entries that Google treats as invalid.
        nativeUrl: `${SITE_URL}/cities/${city.slug}/`,
        enUrl: city.enSlug ? `${SITE_URL}/cities/${city.enSlug}/` : null,
        isNativeEn: city.nativeLang === 'en',
        nativeLang: city.nativeLang,
    };
}

function writePage(page) {
    const html = renderTemplate(page);
    const dir = path.join(CITIES_DIR, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    return 1;
}

function renderTemplate(page) {
    let html = templateHtml;

    // 1. html lang attribute
    html = html.replace(/<html\s+lang="[^"]*">/, `<html lang="${escapeAttr(page.lang)}">`);

    // 2. title
    html = html.replace(/<title>[^<]*<\/title>/,
        `<title>${escapeHtml(page.title)} — NoAdsWeather</title>`);

    // 3. meta description
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*">/,
        `<meta name="description" content="${escapeAttr(page.description)}">`);

    // 3b. Canonical + Open Graph tags. The template (index.html) carries the
    //     homepage values; stamp the city-specific ones so a shared city URL
    //     previews with its own title/description. og:image stays the shared
    //     site card.
    html = html.replace(/<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${escapeAttr(page.canonical)}">`);
    html = html.replace(/<meta property="og:title" content="[^"]*">/,
        `<meta property="og:title" content="${escapeAttr(page.title)} — NoAdsWeather">`);
    html = html.replace(/<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${escapeAttr(page.description)}">`);
    html = html.replace(/<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${escapeAttr(page.canonical)}">`);

    // 3c. Swap the homepage's WebSite JSON-LD for a localized breadcrumb
    //     trail (Home > Cities > {city}) so search results can show the
    //     page's place in the site instead of a bare URL.
    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'NoAdsWeather', item: SITE_URL + '/' },
            { '@type': 'ListItem', position: 2, name: tr(page.lang, 'cities'), item: SITE_URL + '/cities/' },
            { '@type': 'ListItem', position: 3, name: page.seoCity.displayName },
        ],
    };
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        '<script type="application/ld+json">\n    ' +
        JSON.stringify(breadcrumb).replace(/</g, '\\u003c') +
        '\n    </script>');

    // 4. Inject hreflang + window._seoCity into <head>, just before the
    //    existing stylesheet link so it appears before app.js loads.
    //    (The canonical is stamped in-place in step 3b, not injected here.)
    const headInjection = buildHeadInjection(page);
    html = html.replace('<link rel="stylesheet" href="css/style.css">',
        headInjection + '\n    <link rel="stylesheet" href="/css/style.css">');

    // 5. (removed) Script paths no longer need rewriting — the loader at the
    //    end of <body> injects them using absolute paths.

    // 6. Pre-fill the H1 so the page has unique body content even before
    //    app.js runs (avoids the doorway-page risk of 77 byte-identical
    //    pages). app.js will overwrite this with the formatted city/region
    //    label once the weather view loads.
    html = html.replace(/<h1 id="location-name"><\/h1>/,
        `<h1 id="location-name">${escapeHtml(page.title)}</h1>`);

    // 7. Pre-fill the SEO blurb section. The hidden attribute is dropped so
    //    the blurb is visible on first paint (app.js still wires up the
    //    dismiss handlers once it boots). The inline head script sets
    //    data-blurb-dismissed on <html> when the user previously hid it.
    const hideLinkText = (translations[page.lang] && translations[page.lang].cityPageHideBlurb)
        || translations.en.cityPageHideBlurb;
    const seoBlurbReplacement =
        `<section id="seo-blurb">\n` +
        `                <button id="seo-blurb-close" aria-label="Hide" type="button">&times;</button>\n` +
        `                <p>\n` +
        `                    <span id="seo-blurb-text">${escapeHtml(page.description)}</span>\n` +
        `                    <a href="#" id="seo-blurb-hide-link">${escapeHtml(hideLinkText)}</a>\n` +
        `                </p>\n` +
        `            </section>`;
    html = html.replace(/<section id="seo-blurb"[\s\S]*?<\/section>/, seoBlurbReplacement);

    // 8. Swap visibility between home-view and weather-view on city pages.
    //    Without this, Google's static-HTML pass sees the home view as the
    //    primary content (since weather-view has `hidden`), making every
    //    city page look like a generic search page with a hidden Auckland
    //    H1 buried inside — triggers "soft 404 / doorway" classification.
    //    Runtime behavior is unchanged: data-seo-city CSS already hides
    //    home-view, and JS bootstraps the weather view as usual.
    html = html.replace(
        '<div id="home-view" class="view">',
        '<div id="home-view" class="view" hidden>'
    );
    html = html.replace(
        '<div id="weather-view" class="view" hidden>',
        '<div id="weather-view" class="view">'
    );

    // 9. Bake the static climate section (if data exists) plus localized
    //    nearby-city links into the bottom-spacer, so every generated page
    //    carries unique crawlable content and cross-links its geographic
    //    neighbours. (The template's placeholder nav — and the comment above
    //    it — is replaced wholesale.)
    const nearbyLabel = (translations[page.lang] && translations[page.lang].nearbyCities)
        || translations.en.nearbyCities;
    const nearbyLinks = nearestCities(page.city, page.lang, 5)
        .map(n => `<a href="/cities/${n.slug}/">${escapeHtml(n.name)}</a>`)
        .join(' · ');
    html = html.replace(/<!-- Populated with per-city links[\s\S]*?<nav id="nearby-cities" hidden><\/nav>/,
        renderClimateBlock(page) +
        `<nav id="nearby-cities" aria-label="${escapeAttr(nearbyLabel)}">${escapeHtml(nearbyLabel)}: ${nearbyLinks}</nav>`);

    return html;
}

// === Climate section ========================================================

function cToF(c) { return c * 9 / 5 + 32; }
function mmToIn(mm) { return mm / 25.4; }

// Localized month name for index 0-11. Node ships full ICU, so Intl covers
// all 15 UI languages.
function monthName(lang, idx, style) {
    return new Intl.DateTimeFormat(lang, { month: style, timeZone: 'UTC' })
        .format(new Date(Date.UTC(2000, idx, 15)));
}

function formatDate(lang, iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(lang, {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
    }).format(new Date(Date.UTC(y, m - 1, d)));
}

// Day length in hours at solar declination declDeg for latitude latDeg.
// Standard sunrise-equation approximation; clamped for polar latitudes.
function dayLengthHours(latDeg, declDeg) {
    const rad = Math.PI / 180;
    const cosH = -Math.tan(latDeg * rad) * Math.tan(declDeg * rad);
    if (cosH <= -1) return 24;
    if (cosH >= 1) return 0;
    return (2 * (Math.acos(cosH) / rad)) / 15;
}

// Build-time equivalent of the runtime t() helper.
function tr(lang, key, vars) {
    let str = (translations[lang] && translations[lang][key])
        || translations.en[key] || key;
    for (const [k, v] of Object.entries(vars || {})) {
        str = str.replaceAll(`{${k}}`, v);
    }
    return str;
}

function renderClimateBlock(page) {
    const clim = climateData[page.city.slug];
    if (!clim) return '';
    const lang = page.lang;
    const us = page.city.country === 'US';

    // US pages lead with imperial, everyone else with metric; both are always
    // shown so the static HTML serves every reader without JS.
    const dualTemp = (c) => us
        ? `${Math.round(cToF(c))}°F / ${Math.round(c)}°C`
        : `${Math.round(c)}°C / ${Math.round(cToF(c))}°F`;
    const dualPrecip = (mm) => us
        ? `${mmToIn(mm).toFixed(1)} in / ${mm} mm`
        : `${mm} mm / ${mmToIn(mm).toFixed(1)} in`;
    const cellTemp = (c) => us
        ? `${Math.round(cToF(c))} / ${Math.round(c)}`
        : `${Math.round(c)} / ${Math.round(cToF(c))}`;
    const cellPrecip = (mm) => us
        ? `${mmToIn(mm).toFixed(1)} / ${mm}`
        : `${mm} / ${mmToIn(mm).toFixed(1)}`;

    const n = clim.normals;
    let hot = 0, cold = 0, wet = 0;
    n.forEach((m, i) => {
        if (m.high > n[hot].high) hot = i;
        if (m.high < n[cold].high) cold = i;
        if (m.precip > n[wet].precip) wet = i;
    });

    const rows = n.map((m, i) =>
        `<tr><th scope="row">${escapeHtml(monthName(lang, i, 'short'))}</th>` +
        `<td>${cellTemp(m.high)}</td><td>${cellTemp(m.low)}</td>` +
        `<td>${cellPrecip(m.precip)}</td><td>${m.rainDays}</td></tr>`
    ).join('\n                            ');

    const tempUnits = us ? '°F / °C' : '°C / °F';
    const precipUnits = us ? 'in / mm' : 'mm / in';

    const north = page.city.lat >= 0;
    const DECL = 23.44; // Earth's axial tilt — declination at the solstices
    const longHours = dayLengthHours(page.city.lat, north ? DECL : -DECL).toFixed(1);
    const shortHours = dayLengthHours(page.city.lat, north ? -DECL : DECL).toFixed(1);
    const longMonthIdx = north ? 5 : 11;  // June for the north, December south
    const shortMonthIdx = north ? 11 : 5;

    const cityName = page.seoCity.displayName;
    const summary = tr(lang, 'climateSummary', {
        city: cityName,
        hotMonth: monthName(lang, hot, 'long'),
        hotTemp: dualTemp(n[hot].high),
        coldMonth: monthName(lang, cold, 'long'),
        coldTemp: dualTemp(n[cold].high),
        wetMonth: monthName(lang, wet, 'long'),
        wetAmount: dualPrecip(n[wet].precip),
    });
    const records = tr(lang, 'climateRecords', {
        year: String(clim.recordsSince),
        high: dualTemp(clim.recordHigh.c),
        highDate: formatDate(lang, clim.recordHigh.date),
        low: dualTemp(clim.recordLow.c),
        lowDate: formatDate(lang, clim.recordLow.date),
    });
    const daylight = tr(lang, 'climateDaylight', {
        long: longHours,
        longMonth: monthName(lang, longMonthIdx, 'long'),
        short: shortHours,
        shortMonth: monthName(lang, shortMonthIdx, 'long'),
    });
    const source = tr(lang, 'climateSource', {
        period: clim.normalsPeriod,
        station: clim.station || '—',
    });

    return `<div class="climate-block">
                    <button id="climate-close" type="button" aria-label="${escapeAttr(tr(lang, 'hide'))}" title="${escapeAttr(tr(lang, 'hide'))}">&times;</button>
                    <h2>${escapeHtml(tr(lang, 'climateHeading', { city: cityName }))}</h2>
                    <p class="climate-summary">${escapeHtml(summary)}</p>
                    <div class="climate-table-wrap">
                        <table>
                            <thead><tr><th>${escapeHtml(tr(lang, 'climateMonth'))}</th><th>${escapeHtml(tr(lang, 'climateHigh'))} ${tempUnits}</th><th>${escapeHtml(tr(lang, 'climateLow'))} ${tempUnits}</th><th>${escapeHtml(tr(lang, 'climatePrecip'))} ${precipUnits}</th><th>${escapeHtml(tr(lang, 'climateWetDays'))}</th></tr></thead>
                            <tbody>
                            ${rows}
                            </tbody>
                        </table>
                    </div>
                    <p class="climate-records">${escapeHtml(records)}</p>
                    <p class="climate-daylight">${escapeHtml(daylight)}</p>
                    <p class="climate-source">${escapeHtml(source)}</p>
                </div>
                `;
}

function buildHeadInjection(page) {
    const lines = [];
    // hreflang only relevant if there's a sibling variant. Use page.nativeLang
    // (the language of nativeUrl) rather than page.lang (the language of the
    // page being generated) — otherwise the en-variant page emits two
    // hreflang="en" alternates pointing at different URLs.
    if (page.enUrl) {
        lines.push(`    <link rel="alternate" hreflang="${escapeAttr(page.nativeLang)}" href="${escapeAttr(page.nativeUrl)}">`);
        lines.push(`    <link rel="alternate" hreflang="en" href="${escapeAttr(page.enUrl)}">`);
        lines.push(`    <link rel="alternate" hreflang="x-default" href="${escapeAttr(page.enUrl)}">`);
    } else if (page.isNativeEn) {
        lines.push(`    <link rel="alternate" hreflang="en" href="${escapeAttr(page.canonical)}">`);
        lines.push(`    <link rel="alternate" hreflang="x-default" href="${escapeAttr(page.canonical)}">`);
    }
    // Non-English pages need a third script (the language file). Preload it
    // so it downloads alongside i18n.js/app.js instead of after the loader
    // at the end of <body> discovers it.
    if (page.lang !== 'en') {
        lines.push(`    <link rel="preload" as="script" href="/js/i18n/${escapeAttr(page.lang)}.js">`);
    }
    lines.push('    <script>');
    lines.push(`        window._seoCity = ${JSON.stringify(page.seoCity).replace(/</g, '\\u003c')};`);
    // Flash-gate: hide #home-view immediately so generated city pages don't
    // render the home view for one frame before app.js routes to the weather
    // view. Cleared by app.js once the city is loaded.
    lines.push(`        document.documentElement.setAttribute('data-seo-city', 'true');`);
    // If the user previously dismissed the SEO blurb, hide it before paint
    // so it doesn't flash in. Wrapped in try-catch because localStorage can
    // throw in private-mode / disabled-storage contexts.
    lines.push(`        try { if (localStorage.getItem('hideCitySeoBlurb') === 'true') document.documentElement.setAttribute('data-blurb-dismissed', 'true'); } catch (e) {}`);
    // Same pre-paint gate for the climate section: it's baked into the static
    // HTML, so without this it would flash in before app.js could hide it.
    lines.push(`        try { if (localStorage.getItem('showClimate') === 'false') document.documentElement.setAttribute('data-climate-hidden', 'true'); } catch (e) {}`);
    lines.push('    </script>');
    return lines.join('\n');
}

function writeSitemap(urls, variantGroups) {
    // Simple sitemap; hreflang annotations on the variant pages.
    // lastmod is the build date — pages are regenerated together, and it's
    // the one freshness field search engines actually read.
    const lastmod = new Date().toISOString().slice(0, 10);
    const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ];
    for (const u of urls) {
        lines.push('  <url>');
        lines.push(`    <loc>${escapeXml(u.url)}</loc>`);
        // For pages that are part of a variant group, emit alternate links
        const vg = variantGroups.find(g => g.native.canonical === u.url || g.en.canonical === u.url);
        if (vg) {
            lines.push(`    <xhtml:link rel="alternate" hreflang="${escapeAttr(vg.native.lang)}" href="${escapeXml(vg.native.canonical)}"/>`);
            lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(vg.en.canonical)}"/>`);
            lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(vg.en.canonical)}"/>`);
        }
        lines.push(`    <lastmod>${lastmod}</lastmod>`);
        lines.push('    <changefreq>monthly</changefreq>');
        lines.push(`    <priority>${u.priority}</priority>`);
        lines.push('  </url>');
    }
    lines.push('</urlset>');
    fs.writeFileSync(SITEMAP_XML, lines.join('\n') + '\n', 'utf8');
}

// === Nearby cities ==========================================================

function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 × Earth radius (6371 km)
}

// Nearest `count` cities to `city`, with slug + display name resolved for the
// language of the page being generated: same-language variant when one
// exists, otherwise the English variant, otherwise the native page.
function nearestCities(city, lang, count) {
    return cities
        .filter(c => c.slug !== city.slug)
        .map(c => ({ c, km: haversineKm(city.lat, city.lon, c.lat, c.lon) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, count)
        .map(({ c }) => ({
            slug: c.nativeLang === lang ? c.slug : (c.enSlug || c.slug),
            name: c.displayName[lang] || c.displayName.en,
        }));
}

// === Cities index page ======================================================

// Standalone English-language page at /cities/ listing every city page, so no
// city page is ever orphaned. Modeled on about/index.html conventions (theme
// bootstrap, self-hosted CSS vars, i18n'd nav row).
function writeCitiesIndex() {
    const byName = (a, b) => a.displayName.en.localeCompare(b.displayName.en);
    const us = cities.filter(c => c.country === 'US').sort(byName);
    const intl = cities.filter(c => c.country !== 'US').sort(byName);
    const li = c => {
        const slug = c.nativeLang === 'en' ? c.slug : (c.enSlug || c.slug);
        return `            <li><a href="/cities/${slug}/">${escapeHtml(c.displayName.en)}</a></li>`;
    };
    // Reuse the template's CSP so the two stay in sync.
    const cspMeta = (templateHtml.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/) || [''])[0];
    const title = 'Weather by City — NoAdsWeather';
    const description = 'Ad-free weather forecasts for cities around the world. Current conditions, hourly and 10-day forecasts, and radar — no ads, no tracking, no cookies.';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${cspMeta}
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <link rel="canonical" href="${SITE_URL}/cities/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="NoAdsWeather">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${SITE_URL}/cities/">
    <meta property="og:image" content="${SITE_URL}/img/social-card.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="NoAdsWeather — Weather without the clutter. No ads, no tracking, no cookies.">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"NoAdsWeather","item":"${SITE_URL}/"},{"@type":"ListItem","position":2,"name":"Cities"}]}
    </script>
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="theme-color" content="#111827">
    <link rel="stylesheet" href="/css/style.css">
    <script>
        // Theme + visual-style bootstrap. Runs synchronously in <head> so
        // data-theme / data-style are set BEFORE first paint — prevents the
        // white-to-dark flash on cold loads for dark-mode users.
        (function () {
            try {
                var theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
                var style = localStorage.getItem('style');
                if (style && style !== 'default') {
                    document.documentElement.setAttribute('data-style', style);
                }
            } catch (e) { /* private mode — defaults apply */ }
        })();
    </script>
    <style>
        .cities-page {
            max-width: 720px;
            margin: 2rem auto;
            padding: 0 1rem 3rem;
            font-size: 1rem;
            line-height: 1.6;
            color: var(--text);
        }
        .cities-page h1 {
            font-size: 1.85rem;
            margin: 0 0 0.5rem;
            color: var(--accent);
        }
        .cities-page .tagline {
            font-size: 1.05rem;
            color: var(--text-muted);
            margin: 0 0 2rem;
        }
        .cities-page h2 {
            font-size: 1.25rem;
            margin: 2rem 0 0.75rem;
            color: var(--text);
        }
        .cities-page a { color: var(--accent); }
        .nav-row {
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        .nav-row a {
            color: var(--text-muted);
            text-decoration: none;
        }
        .nav-row a:hover { color: var(--text); }
        .nav-row .sep {
            margin: 0 0.5rem;
            color: var(--text-muted);
        }
        .cities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.5rem 1rem;
            margin: 0.5rem 0 1.5rem;
            padding: 0;
            list-style: none;
        }
        .cities-grid li { margin: 0; }
        .cities-grid a {
            display: inline-block;
            padding: 0.15rem 0;
        }
    </style>
</head>
<body>
    <div class="cities-page">
        <p class="nav-row">
            <a href="/" data-i18n="back">&larr; Back to NoAdsWeather</a>
            <span class="sep">·</span>
            <a href="/about/" data-i18n="about">About</a>
            <span class="sep">·</span>
            <a href="/privacy.html" data-i18n="privacyCookies">Privacy</a>
        </p>

        <h1>Weather by City</h1>
        <p class="tagline">Ad-free forecasts for cities around the world — no tracking, no cookies, no clutter. Don't see your city? <a href="/">Search for it</a>.</p>

        <h2>United States</h2>
        <ul class="cities-grid">
${us.map(li).join('\n')}
        </ul>

        <h2>International</h2>
        <ul class="cities-grid">
${intl.map(li).join('\n')}
        </ul>
    </div>
    <script src="/js/i18n.js"></script>
    <script>
        // i18n: translate the data-i18n elements. Non-English visitors get
        // their language file injected (async=false, so it never blocks the
        // parser like the old document.write loader did) and are translated
        // once it arrives; English translates immediately.
        (function () {
            function translate() {
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.dataset.i18n;
                    const attr = el.dataset.i18nAttr;
                    const text = t(key);
                    if (attr) el.setAttribute(attr, text);
                    else el.textContent = text;
                });
                document.documentElement.lang = getCurrentLang();
                document.documentElement.dir = getCurrentLang() === 'ar' ? 'rtl' : 'ltr';
            }
            var lang = getCurrentLang();
            if (lang === 'en') { translate(); return; }
            var el = document.createElement('script');
            el.src = '/js/i18n/' + lang + '.js';
            el.async = false;
            el.onload = translate;
            el.onerror = translate; // language file unavailable - English fallback
            document.head.appendChild(el);
        })();
    </script>
</body>
</html>
`;
    fs.writeFileSync(path.join(CITIES_DIR, 'index.html'), html, 'utf8');
}

// === Tiny escape helpers ====================================================

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
}

function escapeAttr(s) { return escapeHtml(s); }
function escapeXml(s) { return escapeHtml(s); }
