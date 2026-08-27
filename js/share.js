// share.js — share-card popover, canvas card renderer, PNG/GIF pipeline.
// Lazy-loaded by ensureShareJs() in app.js the first time the Share button
// is tapped, same pattern as the MapLibre radar loader. Classic script:
// shares app.js globals (t, _lastMeteoData, _lastAirQuality, _lastLat,
// weatherInfo, tempUnit, isImperial, getLocaleForDate, pollenSummary,
// _lastFetchTime — stamped by fetchAllWeatherData() on every successful
// weather load, used here only as a freshness signal, see shareResultIsStale()).
'use strict';

const SHARE_EMOJI = [
    { slug: 'hot', char: '🥵' }, { slug: 'melting', char: '🫠' },
    { slug: 'cold', char: '🥶' }, { slug: 'sun', char: '🌞' },
    { slug: 'cool', char: '😎' }, { slug: 'rain', char: '🌧️' },
    { slug: 'storm', char: '🌩️' }, { slug: 'zap', char: '⚡' },
    { slug: 'snow', char: '❄️' }, { slug: 'rainbow', char: '🌈' },
    { slug: 'tornado', char: '🌪️' }, { slug: 'sneeze', char: '🤧' },
];

let _sharePopover = null;      // DOM node, built once
let _shareState = null;        // { days, includeCurrent, includePollen, emoji, blob, mime, blobUrl, status, dataStamp }

// Monotonic token guarding async image generation, same pattern as
// weatherLoadToken/radarLoadToken in app.js. Bumped whenever the in-flight
// generation's inputs are no longer current (options changed, popover
// reopened) so a superseded generateShareImage() call can detect it lost
// the race and quietly drop its result instead of clobbering newer state.
let _shareGenToken = 0;

// Whether this browser can share files via the Web Share API. Computed once
// and cached — support doesn't change mid-session, so there's no need to
// allocate a throwaway File and call the native canShare() on every popover
// sync. Guarded with try/catch in case File/canShare misbehave or are absent.
let _shareCanShareFiles = null;
function shareCanShareFiles() {
    if (_shareCanShareFiles !== null) return _shareCanShareFiles;
    try {
        _shareCanShareFiles = !!(navigator.canShare &&
            navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] }));
    } catch {
        _shareCanShareFiles = false;
    }
    return _shareCanShareFiles;
}

// Pollen items for the card: EU (Open-Meteo) via pollenSummary(), else
// today's cached Google Pollen data. Both branches drop zero-value entries
// and sort worst-first before keeping the top 4 — so the 4 shown (and fed
// to suggestShareEmoji's very-high check below) are the most severe ones,
// not just whichever 4 happen to come first in pollenSummary()'s fixed
// type order (Grass, Birch, Ragweed, Alder, Olive, Mugwort). Without the
// sort, a city where only Olive/Mugwort spike Very High while the earlier
// types in that order are low/absent would never surface them here.
// Returns [{name, level, color, value}] or null.
function sharePollenItems() {
    const eu = typeof pollenSummary === 'function' ? pollenSummary(_lastAirQuality) : null;
    if (eu && eu.length) {
        const items = eu.filter(p => p.value > 0).sort((a, b) => b.value - a.value);
        return items.length ? items.slice(0, 4) : null;
    }
    if (_lastLat === null) return null;
    try {
        const key = `pollen_${_lastLat.toFixed(2)}_${_lastLon.toFixed(2)}_${new Date().toISOString().slice(0, 10)}`;
        const data = JSON.parse(localStorage.getItem(key));
        const day = data && data.dailyInfo && data.dailyInfo[0];
        if (!day) return null;
        const items = [];
        for (const p of (day.pollenTypeInfo || [])) {
            if (p.indexInfo && p.indexInfo.value > 0) {
                items.push({ name: p.displayName, level: p.indexInfo.category, color: pollenIndexColor(p.indexInfo.value), value: p.indexInfo.value });
            }
        }
        items.sort((a, b) => b.value - a.value);
        return items.length ? items.slice(0, 4) : null;
    } catch { return null; }
}

function suggestShareEmoji(days) {
    const d = _lastMeteoData.daily;
    const highs = d.temperature_2m_max.slice(0, days);
    const codes = d.weather_code.slice(0, days);
    const hot2 = isImperial() ? 100 : 38, hot1 = isImperial() ? 95 : 35, freeze = isImperial() ? 32 : 0;
    const maxHigh = Math.max(...highs);
    if (maxHigh >= hot2) return 'melting';
    if (maxHigh >= hot1) return 'hot';
    if (maxHigh <= freeze) return 'cold';
    if (codes.some(c => c === 95 || c === 96 || c === 99)) return 'storm';
    if (codes.some(c => [71, 73, 75, 77, 85, 86].includes(c))) return 'snow';
    if (codes.filter(c => (c >= 51 && c <= 65) || c === 80 || c === 81 || c === 82).length >= 3) return 'rain';
    const pollen = sharePollenItems();
    if (pollen && pollen.some(p => /very\s*high/i.test(p.level) || p.level === t('pollenVeryHigh'))) return 'sneeze';
    if (codes.every(c => c <= 2)) return 'sun';
    return 'cool';
}

function openSharePopover() {
    if (!_lastMeteoData) return; // nothing loaded yet
    if (!_sharePopover) buildSharePopover();
    // Abandon any generation still in flight from a previous session (popover
    // closed mid-generation, then reopened) — without this its eventual
    // result could land in the brand new _shareState below.
    _shareGenToken++;
    if (_shareState && _shareState.blobUrl) URL.revokeObjectURL(_shareState.blobUrl);
    _shareState = {
        days: 7,
        includeCurrent: true,
        includePollen: false,
        emoji: suggestShareEmoji(7),
        blob: null, mime: null, blobUrl: null, status: '', dataStamp: null,
    };
    // A previous session may have left this disabled while a generation was
    // running; a fresh popover must always start with Create clickable.
    _sharePopover.querySelector('[data-act="create"]').disabled = false;
    syncSharePopover();
    _sharePopover.hidden = false;
}

function buildSharePopover() {
    const el = document.createElement('div');
    el.className = 'share-popover';
    el.setAttribute('role', 'dialog');
    el.hidden = true;

    // Non-modal by design (no backdrop, page stays interactive — matches
    // the settings popover), so no aria-modal and no focus trap. It still
    // needs an accessible name: aria-labelledby -> the heading below.
    const h = document.createElement('h3');
    h.id = 'share-popover-title';
    h.textContent = t('shareTitle');
    el.appendChild(h);
    el.setAttribute('aria-labelledby', h.id);

    // 5 / 7 day radios
    const fsDays = document.createElement('fieldset');
    for (const n of [5, 7]) {
        const label = document.createElement('label');
        const r = document.createElement('input');
        r.type = 'radio'; r.name = 'share-days'; r.value = String(n);
        r.addEventListener('change', () => { _shareState.days = n; invalidateShareResult(); });
        label.appendChild(r);
        label.appendChild(document.createTextNode(' ' + t(n === 5 ? 'share5Day' : 'share7Day')));
        fsDays.appendChild(label);
    }
    el.appendChild(fsDays);

    // Checkboxes
    const fsOpts = document.createElement('fieldset');
    for (const [key, i18nKey] of [['includeCurrent', 'shareIncludeCurrent'], ['includePollen', 'shareIncludePollen']]) {
        const label = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.shareOpt = key;
        cb.addEventListener('change', () => { _shareState[key] = cb.checked; invalidateShareResult(); });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(' ' + t(i18nKey)));
        fsOpts.appendChild(label);
    }
    el.appendChild(fsOpts);

    // Emoji grid ("none" + 12)
    const gridTitle = document.createElement('div');
    gridTitle.style.cssText = 'font-size:0.85rem;margin-bottom:0.25rem;';
    gridTitle.textContent = t('shareEmoji');
    el.appendChild(gridTitle);
    const grid = document.createElement('div');
    grid.className = 'share-emoji-grid';
    const noneBtn = document.createElement('button');
    noneBtn.type = 'button';
    noneBtn.dataset.emoji = '';
    noneBtn.textContent = '∅';
    noneBtn.title = t('shareEmojiNone');
    grid.appendChild(noneBtn);
    for (const e of SHARE_EMOJI) {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.emoji = e.slug;
        b.textContent = e.char;
        grid.appendChild(b);
    }
    grid.addEventListener('click', (ev) => {
        const b = ev.target.closest('button[data-emoji]');
        if (!b) return;
        _shareState.emoji = b.dataset.emoji || null;
        invalidateShareResult();
        syncSharePopover();
    });
    el.appendChild(grid);

    // Preview + status + actions
    const preview = document.createElement('div');
    preview.className = 'share-preview';
    preview.hidden = true;
    const previewImg = document.createElement('img');
    // Decorative relative to the controls around it (the card's actual
    // content is a generated composite, not something worth describing to
    // a screen reader) — an explicit empty alt is still required, since a
    // missing alt attribute makes some screen readers read out the blob:
    // URL instead of skipping the image.
    previewImg.alt = '';
    preview.appendChild(previewImg);
    el.appendChild(preview);
    const status = document.createElement('div');
    status.className = 'share-status';
    // role="status" (implicit aria-live="polite" + atomic) so the
    // per-frame progress and any failure message are actually announced —
    // this text is otherwise silent to screen readers.
    status.setAttribute('role', 'status');
    el.appendChild(status);

    const actions = document.createElement('div');
    actions.className = 'share-actions';
    const mkBtn = (cls, i18nKey, handler) => {
        const b = document.createElement('button');
        b.type = 'button';
        if (cls) b.className = cls;
        b.dataset.i18nKey = i18nKey;
        b.textContent = t(i18nKey);
        b.addEventListener('click', handler);
        actions.appendChild(b);
        return b;
    };
    mkBtn('share-primary', 'shareCreate', onShareCreate).dataset.act = 'create';
    mkBtn('share-primary', 'shareShareBtn', onShareShare).dataset.act = 'share';
    mkBtn('', 'shareDownload', onShareDownload).dataset.act = 'download';
    mkBtn('', 'shareCopyLink', onShareCopyLink).dataset.act = 'copy';
    el.appendChild(actions);

    document.body.appendChild(el);
    _sharePopover = el;

    // Close on Escape / outside click (same pattern as settings popover).
    // closest('#share-btn'), not e.target.id — a plain id check breaks the
    // moment the button's glyph gets wrapped in a child element (icon,
    // span), since the click target would then be that child, not the
    // button itself.
    const closeSharePopover = () => {
        if (el.hidden) return;
        el.hidden = true;
        // Nobody's looking at the popover anymore — abandon any generation
        // still running rather than let a 16-frame encode keep burning CPU
        // for a closed popover. (openSharePopover() resets state on every
        // open regardless, so this doesn't change what a reopen shows.)
        _shareGenToken++;
    };
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSharePopover();
    });
    document.addEventListener('click', (e) => {
        if (!el.hidden && !el.contains(e.target) && !e.target.closest('#share-btn')) closeSharePopover();
    });
}

// Sets (or clears) the generated image, owning the object-URL lifecycle:
// revokes the previous URL (if any) before minting a fresh one, so there's
// exactly one live URL per state at any time instead of a new one leaking
// out of every syncSharePopover() call.
function setShareBlob(blob, mime) {
    if (_shareState.blobUrl) URL.revokeObjectURL(_shareState.blobUrl);
    _shareState.blob = blob;
    _shareState.mime = mime;
    _shareState.blobUrl = blob ? URL.createObjectURL(blob) : null;
}

// Options changed -> any generated image is stale, and so is any generation
// still running for the old options.
function invalidateShareResult() {
    _shareGenToken++; // the in-flight generation (if any) targeted stale options
    setShareBlob(null, null);
    _shareState.status = '';
    _shareState.dataStamp = null;
    // The abandoned generation's own `finally` won't re-enable this (its
    // token no longer matches), so do it here — otherwise changing an
    // option mid-generation would leave Create permanently disabled.
    _sharePopover.querySelector('[data-act="create"]').disabled = false;
    syncSharePopover();
}

// True once the forecast underneath a generated image has changed since it
// was created — most commonly the page's own silent refetch on tab return
// (maybeAutoRefresh() -> refreshWeather() in app.js, wired to
// visibilitychange) replacing _lastMeteoData/_lastFetchTime while the
// popover sat open. _lastFetchTime is stamped alongside _lastMeteoData in
// the same fetchAllWeatherData() callback, so comparing it is equivalent to
// comparing the data itself without needing to diff the payload. A stale
// result must never be shareable/downloadable as if it were still current —
// see the guards at the top of onShareShare()/onShareDownload().
function shareResultIsStale() {
    if (!_shareState.blob) return false;
    // A refetch nulls _lastMeteoData before it restamps _lastFetchTime, so
    // for that sub-second window the stamp still matches and a card would
    // sail through. Treat "data is currently being replaced" as stale too.
    if (!_lastMeteoData) return true;
    return _shareState.dataStamp !== _lastFetchTime;
}

// Reflect _shareState into the DOM.
function syncSharePopover() {
    if (shareResultIsStale()) {
        // Self-heal on every render: drop back to Create rather than let a
        // stale forecast keep showing as a ready-to-share image.
        setShareBlob(null, null);
        _shareState.dataStamp = null;
        _shareState.status = '';
    }
    const el = _sharePopover;
    el.querySelectorAll('input[name="share-days"]').forEach(r => { r.checked = Number(r.value) === _shareState.days; });
    el.querySelector('input[data-share-opt="includeCurrent"]').checked = _shareState.includeCurrent;
    const pollenCb = el.querySelector('input[data-share-opt="includePollen"]');
    const pollenAvailable = !!sharePollenItems();
    pollenCb.disabled = !pollenAvailable;
    if (!pollenAvailable) _shareState.includePollen = false;
    pollenCb.checked = _shareState.includePollen;
    el.querySelectorAll('.share-emoji-grid button').forEach(b => {
        b.setAttribute('aria-pressed', String((b.dataset.emoji || null) === _shareState.emoji || (b.dataset.emoji === '' && _shareState.emoji === null)));
    });
    const ready = !!_shareState.blob;
    el.querySelector('[data-act="create"]').hidden = ready;
    const shareBtn = el.querySelector('[data-act="share"]');
    shareBtn.hidden = !ready || !shareCanShareFiles();
    const dlBtn = el.querySelector('[data-act="download"]');
    dlBtn.hidden = !ready;
    // No native file-share on this browser (e.g. desktop Chrome, where
    // shareCanShareFiles() is false) -> Download is the only export path,
    // so give it the same visual weight the Share button would have had.
    dlBtn.classList.toggle('share-primary', !shareCanShareFiles());
    const prev = el.querySelector('.share-preview');
    prev.hidden = !ready;
    if (ready) prev.querySelector('img').src = _shareState.blobUrl;
    // Render the current status rather than clearing it — onShareCreate
    // (via shareStatus()) is what owns this text now; syncSharePopover()
    // runs far more often (every option change) and must not blank a
    // message ("Creating image…", a failure, …) still meant to be visible.
    el.querySelector('.share-status').textContent = _shareState.status || '';
}

// --- Card renderer -----------------------------------------------------------
// Fixed light palette on purpose: a shared image should look the same
// no matter which theme the sender uses.
const CARD_W = 480;
const CARD_COLORS = {
    bg: '#ffffff', text: '#1a1a2e', muted: '#6b7280',
    accent: '#2563eb', row: '#f3f4f6', line: '#e5e7eb',
};
const CARD_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// The H1 differs by page type: the SPA sets "City, Region", but a generated
// /cities/* page overwrites it with the translated SEO title
// ("{city} Weather with No Ads"), which reads badly on a card and repeats
// the footer branding. Use the bare city name only when the H1 still matches
// that title for the baked city — a search for a different city replaces the
// H1 while window._seoCity keeps pointing at the baked one.
function shareCityLabel() {
    const seo = window._seoCity;
    if (seo) {
        const cityName = seo.displayName || seo.name;
        if (cityName && locationName.textContent === t('cityPageTitle', { city: cityName })) {
            return cityName;
        }
    }
    return locationName.textContent || 'Forecast';
}

// Lays out and draws everything except the animated emoji cell; returns
// {canvas, emojiSlot:{x,y,size}, height} so the GIF pipeline can stamp
// sprite frames into the slot.
//
// Coordinate space: canvas.width/height are the 2x backing-store pixel
// dimensions (CARD_W*2 wide), but every coordinate used while drawing —
// and everything in the returned emojiSlot and height — is in CSS/1x
// pixels (0..CARD_W wide), because ctx.scale(2,2) already doubles them
// for the backing store. Task 7's GIF pipeline composes at 1x (480px
// wide), so emojiSlot.x/y/size apply directly with no further scaling;
// do not multiply or divide them by 2 again.
function drawShareCard(state) {
    const daily = _lastMeteoData.daily;
    const current = _lastMeteoData.current;
    // Clamp to what the API actually returned. The app requests 10 days and
    // the popover only offers 5 or 7, so this is unreachable today — but an
    // underfilled response would otherwise draw "Invalid Date" / "NaN°" rows
    // straight into a shared image, where nobody can correct them.
    const days = Math.min(state.days, daily.time.length);
    const pollen = state.includePollen ? sharePollenItems() : null;

    const PAD = 24, HEADER_H = 58, CURRENT_H = state.includeCurrent ? 72 : 0,
        ROW_H = 40, POLLEN_H = pollen ? 46 : 0, FOOTER_H = 140;
    const H = PAD + HEADER_H + CURRENT_H + days * ROW_H + POLLEN_H + FOOTER_H;

    const canvas = document.createElement('canvas');
    canvas.width = CARD_W * 2; canvas.height = H * 2; // 2x for crispness
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    ctx.fillStyle = CARD_COLORS.bg;
    ctx.fillRect(0, 0, CARD_W, H);
    let y = PAD;

    // Header: city + date range
    ctx.fillStyle = CARD_COLORS.text;
    ctx.font = `700 24px ${CARD_FONT}`;
    ctx.textBaseline = 'top';
    let city = shareCityLabel();
    while (ctx.measureText(city).width > CARD_W - PAD * 2 && city.length > 4) city = city.slice(0, -2).trimEnd() + '…';
    ctx.fillText(city, PAD, y);
    const d0 = new Date(daily.time[0] + 'T00:00:00');
    const dN = new Date(daily.time[days - 1] + 'T00:00:00');
    const fmt = (d) => d.toLocaleDateString(getLocaleForDate(), { month: 'short', day: 'numeric' });
    ctx.font = `400 13px ${CARD_FONT}`;
    ctx.fillStyle = CARD_COLORS.muted;
    ctx.fillText(`${fmt(d0)} – ${fmt(dN)}`, PAD, y + 32);
    y += HEADER_H;

    // Current conditions
    if (state.includeCurrent) {
        const info = weatherInfo(current.weather_code);
        ctx.font = `300 44px ${CARD_FONT}`;
        ctx.fillStyle = CARD_COLORS.text;
        ctx.fillText(`${Math.round(current.temperature_2m)}${tempUnit()}`, PAD, y + 6);
        ctx.font = `28px ${CARD_FONT}`;
        ctx.fillText(info.icon, PAD + 130, y + 14);
        ctx.font = `400 15px ${CARD_FONT}`;
        ctx.fillStyle = CARD_COLORS.muted;
        ctx.fillText(info.text, PAD + 170, y + 22);
        y += CURRENT_H;
    }

    // Forecast rows
    for (let i = 0; i < days; i++) {
        if (i % 2 === 1) {
            ctx.fillStyle = CARD_COLORS.row;
            ctx.fillRect(PAD - 8, y, CARD_W - (PAD - 8) * 2, ROW_H);
        }
        const date = new Date(daily.time[i] + 'T00:00:00');
        const info = weatherInfo(daily.weather_code[i]);
        ctx.textBaseline = 'middle';
        const cy = y + ROW_H / 2;
        ctx.font = `600 15px ${CARD_FONT}`;
        ctx.fillStyle = CARD_COLORS.text;
        ctx.fillText(date.toLocaleDateString(getLocaleForDate(), { weekday: 'short' }), PAD, cy);
        ctx.font = `20px ${CARD_FONT}`;
        ctx.fillText(info.icon, PAD + 78, cy);
        ctx.font = `600 16px ${CARD_FONT}`;
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(daily.temperature_2m_max[i])}°`, CARD_W - PAD - 52, cy);
        ctx.font = `400 16px ${CARD_FONT}`;
        ctx.fillStyle = CARD_COLORS.muted;
        ctx.fillText(`${Math.round(daily.temperature_2m_min[i])}°`, CARD_W - PAD, cy);
        ctx.textAlign = 'left';
        y += ROW_H;
    }
    ctx.textBaseline = 'top';

    // Pollen line. Measure each item's full width (name + level) BEFORE
    // drawing and skip it if it would run past the card's right padding —
    // a long name (Google Pollen displayNames like "Common Ragweed
    // (Ambrosia artemisiifolia)" run 250px+) can by itself push the next
    // item's end position well past CARD_W, so checking x only *after*
    // drawing (against a flat CARD_W-100 threshold) lets that next item
    // get drawn already hanging off the right edge. Checking before drawing
    // means an item that doesn't fit is simply omitted, never clipped.
    if (pollen) {
        y += 8;
        let x = PAD;
        ctx.font = `600 13px ${CARD_FONT}`;
        for (const p of pollen) {
            const w1 = ctx.measureText(p.name).width;
            const w2 = ctx.measureText(' ' + p.level).width;
            if (x + w1 + w2 > CARD_W - PAD) break;
            ctx.fillStyle = CARD_COLORS.text;
            ctx.fillText(p.name, x, y);
            ctx.fillStyle = p.color;
            ctx.fillText(' ' + p.level, x + w1, y);
            x += w1 + w2 + 16;
        }
        y += POLLEN_H - 8;
    }

    // Footer: brand left, emoji slot right
    ctx.strokeStyle = CARD_COLORS.line;
    ctx.beginPath(); ctx.moveTo(PAD, y + 4); ctx.lineTo(CARD_W - PAD, y + 4); ctx.stroke();
    const slotSize = 112;
    const slot = { x: CARD_W - PAD - slotSize, y: y + 16, size: slotSize };
    ctx.font = `700 16px ${CARD_FONT}`;
    ctx.fillStyle = CARD_COLORS.accent;
    ctx.fillText('noadsweather.com', PAD, y + 58);
    ctx.font = `400 11px ${CARD_FONT}`;
    ctx.fillStyle = CARD_COLORS.muted;
    ctx.fillText(t('tagline') !== 'tagline' ? t('tagline') : 'No ads. No tracking.', PAD, y + 80);

    return { canvas, emojiSlot: slot, height: H };
}

// --- Generation + share actions ----------------------------------------------

function loadShareSprite(slug) {
    return fetch('/img/emoji/manifest.json')
        .then(r => { if (!r.ok) throw new Error(`manifest ${r.status}`); return r.json(); })
        .then(manifest => new Promise((resolve, reject) => {
            const meta = manifest[slug];
            if (!meta) return reject(new Error(`no sprite: ${slug}`));
            const img = new Image();
            img.onload = () => resolve({ img, meta });
            img.onerror = () => reject(new Error(`sprite load failed: ${slug}`));
            img.src = `/img/emoji/${meta.file}`;
        }));
}

// Generates the PNG (no emoji) or animated GIF (emoji picked) for the given
// state. `token` is this attempt's _shareGenToken snapshot: checked after
// every await so a generation that's been superseded (options changed, or
// the popover was closed and reopened) stops early instead of burning
// battery computing frames nobody will see. Returns null when superseded —
// the caller (onShareCreate) treats that identically to a fresh token
// mismatch of its own, so either check alone would be correct; this one is
// just what lets a slow GIF bail out mid-loop rather than after it.
async function generateShareImage(state, token) {
    const { canvas, emojiSlot } = drawShareCard(state);
    if (!state.emoji) {
        const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        // toBlob() can legitimately resolve with null (e.g. a tainted or
        // zero-size canvas). Treat that as a failure so it takes the same
        // shareFailed / re-enable-Create path as every other error here,
        // instead of silently "succeeding" with a null blob that then
        // clears the status and shows nothing.
        if (!blob) throw new Error('canvas.toBlob() returned null');
        return { blob, mime: 'image/png' };
    }
    const { img, meta } = await loadShareSprite(state.emoji);
    if (token !== _shareGenToken) return null; // superseded while the sprite was loading

    const { GIFEncoder, quantize, applyPalette } = window.gifenc;
    const gif = GIFEncoder();
    // Compose at 1x (CARD_W wide) — GIF at 2x would be ~4x the bytes.
    const w = CARD_W, h = canvas.height / 2;
    const frame = document.createElement('canvas');
    frame.width = w; frame.height = h;
    const fctx = frame.getContext('2d', { willReadFrequently: true });
    for (let i = 0; i < meta.frames; i++) {
        if (token !== _shareGenToken) return null; // superseded mid-encode
        shareStatus(`${t('shareGenerating')} ${i + 1}/${meta.frames}`);
        // Card is fully opaque (drawShareCard fills a white background), so
        // this drawImage overwrites every pixel from the previous
        // iteration — no explicit clearRect needed. The sprite frame is
        // then alpha-composited on top by the canvas itself: 2D drawImage
        // always does a proper "source-over" blend, so a semi-transparent
        // emoji edge blends smoothly into the opaque card colour beneath
        // it and the result is fully opaque again. That means the pixels
        // handed to quantize() below never carry meaningful alpha — a
        // measured check (decoding real output frames) confirmed no black
        // fringing/halo around emoji edges, so no rgba-aware palette
        // format or GIF transparency index is needed here.
        fctx.drawImage(canvas, 0, 0, w, h);
        const sx = (i % meta.cols) * meta.cell, sy = Math.floor(i / meta.cols) * meta.cell;
        fctx.drawImage(img, sx, sy, meta.cell, meta.cell, emojiSlot.x, emojiSlot.y, emojiSlot.size, emojiSlot.size);
        const { data } = fctx.getImageData(0, 0, w, h);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, w, h, { palette, delay: meta.delayMs });
        // Yield so a slow phone doesn't freeze the popover. Measured this
        // against requestAnimationFrame first, since rAF ties the pause to
        // the actual paint cycle and in principle guarantees the
        // frame-progress status text lands on screen. In practice rAF
        // callbacks are suspended while the tab/window isn't visible
        // (backgrounded, minimized, switched away from on mobile) — a real
        // run in this environment hung indefinitely at "1/16" with
        // document.hidden === true once the pane lost focus, because the
        // rAF it was awaiting simply never fired. A user backgrounding the
        // app mid-generation is a completely ordinary thing to do, so
        // setTimeout(0) is the correct choice here: it still fires while
        // hidden (browsers throttle, but don't suspend, background timers),
        // so generation always finishes instead of possibly stalling forever.
        await new Promise(r => setTimeout(r, 0));
    }
    gif.finish();
    return { blob: new Blob([gif.bytes()], { type: 'image/gif' }), mime: 'image/gif' };
}

function shareStatus(msg) {
    _shareState.status = msg || '';
    _sharePopover.querySelector('.share-status').textContent = _shareState.status;
}

async function onShareCreate() {
    const token = ++_shareGenToken;
    // Captured now, before any await — see shareResultIsStale(). Reading
    // _lastFetchTime only after generation finishes would be wrong: if a
    // refetch lands mid-generation, drawShareCard() already read the OLD
    // _lastMeteoData synchronously at the start of generateShareImage(), so
    // the card reflects the old data even though _lastFetchTime has since
    // moved on — stamping the post-await value would falsely mark that
    // (actually stale) card as fresh.
    const dataStampAtStart = _lastFetchTime;
    const btn = _sharePopover.querySelector('[data-act="create"]');
    btn.disabled = true;
    shareStatus(t('shareGenerating'));
    try {
        const result = await generateShareImage(_shareState, token);
        if (token !== _shareGenToken) return; // a newer attempt now owns the UI
        setShareBlob(result.blob, result.mime);
        _shareState.dataStamp = dataStampAtStart;
        shareStatus('');
        syncSharePopover();
        // Best-effort: after a successful create, the preview can push the
        // action row (Share/Download/Copy) down far enough to land below
        // the fold on a short or landscape phone viewport. 'nearest' only
        // scrolls if it isn't already in view, so this doesn't fight normal
        // layouts where everything already fits.
        //
        // Must wait for the preview <img> to actually lay out. Scrolling
        // straight after syncSharePopover() is a no-op precisely when it is
        // needed: the freshly-assigned blob has not loaded yet, the popover
        // has not grown, and 'nearest' correctly concludes the row is still
        // visible. Measured in landscape: scrollTop stayed 0 with the row
        // 166px below the fold.
        const previewImg = _sharePopover.querySelector('.share-preview img');
        const scrollActionsIntoView = () => {
            const actions = _sharePopover.querySelector('.share-actions');
            if (actions) actions.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        };
        if (previewImg && !previewImg.complete) {
            previewImg.addEventListener('load', scrollActionsIntoView, { once: true });
            previewImg.addEventListener('error', scrollActionsIntoView, { once: true });
        } else {
            scrollActionsIntoView();
        }
    } catch (err) {
        if (token !== _shareGenToken) return; // ditto — don't show a stale error
        console.warn('share generate:', err?.message || err);
        shareStatus(t('shareFailed'));
    } finally {
        // Only the still-current attempt owns the button. A superseded one's
        // token mismatches here too — invalidateShareResult()/openSharePopover()
        // already re-enabled the button for whoever is current, and this call
        // touching it after the fact could stomp a fresh generation already
        // running under a newer token.
        if (token === _shareGenToken) btn.disabled = false;
    }
}

function shareFile() {
    const ext = _shareState.mime === 'image/gif' ? 'gif' : 'png';
    return new File([_shareState.blob], `noadsweather-forecast.${ext}`, { type: _shareState.mime });
}

function onShareShare() {
    // Last-line-of-defense staleness gate: syncSharePopover() self-heals
    // whenever it happens to run, but nothing guarantees it ran between the
    // forecast changing and this tap (e.g. a silent refetch completed while
    // the user was looking at the popover, untouched, then hit Share) — so
    // check again right here, at the one place a stale forecast could
    // actually leave the device. Drop back to Create instead of sharing it.
    if (shareResultIsStale()) { invalidateShareResult(); return; }
    // Called directly from the tap so iOS's user-activation rule is satisfied.
    // The button is only shown when shareCanShareFiles() passed, so
    // navigator.share should always exist here — but that's a click handler
    // wired straight to a DOM button, and a synchronous throw (e.g. a
    // browser exposing canShare but not share, or share() itself throwing
    // rather than rejecting) shouldn't be able to silently break the popover.
    try {
        navigator.share({ files: [shareFile()] }).catch(err => {
            if (err && err.name === 'AbortError') return; // user cancelled — not a failure
            console.warn('share:', err?.message || err);
            // Lost activation (NotAllowedError), a target app rejecting the
            // file, etc. — the tap visibly did nothing otherwise, which reads
            // as broken. The image was created fine, so this is deliberately
            // not shareFailed.
            shareStatus(t('shareShareFailed'));
        });
    } catch (err) {
        console.warn('share:', err?.message || err);
        shareStatus(t('shareShareFailed'));
    }
}

function onShareDownload() {
    // Same staleness gate as onShareShare() — see the comment there.
    if (shareResultIsStale()) { invalidateShareResult(); return; }
    const a = document.createElement('a');
    a.href = _shareState.blobUrl; // reuse the cached URL — see setShareBlob()
    a.download = shareFile().name;
    document.body.appendChild(a); // some browsers only fire the download if the anchor is attached
    a.click();
    a.remove();
}

function onShareCopyLink() {
    const btn = _sharePopover.querySelector('[data-act="copy"]');
    const flash = (key) => {
        btn.textContent = t(key);
        setTimeout(() => { btn.textContent = t('shareCopyLink'); }, 1500);
    };
    // navigator.clipboard requires a secure context and can also be denied
    // by the browser; fall back to the old execCommand trick before giving
    // up, and only then leave the user with silent nothing.
    const legacyCopy = () => {
        const ta = document.createElement('textarea');
        ta.value = location.href;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
        return ok;
    };
    const onFail = () => {
        if (legacyCopy()) { flash('shareLinkCopied'); return; }
        shareStatus(t('shareCopyFailed'));
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).then(() => flash('shareLinkCopied')).catch(onFail);
    } else {
        onFail();
    }
}
