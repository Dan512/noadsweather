const functions = require('@google-cloud/functions-framework');
const { Firestore, FieldValue } = require('@google-cloud/firestore');

// Anonymous page-view tally. The beacon payload is the entire transmission:
//   { site, path, ref, pwa, unique }
// No cookies, no identifiers, and nothing here reads or stores the caller's
// IP or user agent (the UA is *checked* against the bot list, never kept).
// The privacy page publishes this exact contract — keep them in sync.

const db = new Firestore();

// Origin/Referer gate — same reasoning as alerts-proxy/pollen-proxy: CORS only
// protects browsers, and an open endpoint invites junk inflation from
// server-side callers.
const ALLOWED_HOSTS = new Set([
    'noadsweather.com', 'www.noadsweather.com',
    'z64central.com', 'www.z64central.com',
    'noadstools.com', 'www.noadstools.com',
    'noadssports.com', 'www.noadssports.com',
]);

// Sites the `site` field may name. Add future sites here AND to
// ALLOWED_HOSTS above.
const ALLOWED_SITES = new Set(['noadsweather.com', 'z64central.com', 'noadstools.com', 'noadssports.com']);

// Crawlers that execute JS (Googlebot renders pages) would otherwise inflate
// the very pages they re-crawl most. Checked, never stored.
const BOT_RE = /bot|spider|crawl|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|bingpreview|facebookexternalhit|whatsapp|telegram|discordbot|preview|python|curl|wget|axios|go-http|node-fetch/i;

function isAllowedRequest(req) {
    const origin = req.headers.origin || '';
    const referer = req.headers.referer || '';
    try {
        if (origin && ALLOWED_HOSTS.has(new URL(origin).hostname)) return true;
        if (referer && ALLOWED_HOSTS.has(new URL(referer).hostname)) return true;
    } catch (e) { /* malformed URL — fall through to deny */ }
    return false;
}

// Firestore doc IDs cannot contain '/', and map field keys with '.' are
// ambiguous between SDK call styles. Encode both ways deterministically so
// stats.js can reverse them.
function encodePath(path) {
    return encodeURIComponent(path);
}
function encodeDomainKey(domain) {
    return domain.replace(/\./g, '~');
}

function parsePayload(req) {
    // sendBeacon posts text/plain (string body); curl tests may post JSON.
    let data = req.body;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { return null; }
    } else if (Buffer.isBuffer(data)) {
        try { data = JSON.parse(data.toString('utf8')); } catch (e) { return null; }
    }
    if (!data || typeof data !== 'object') return null;

    if (!ALLOWED_SITES.has(data.site)) return null;

    let path = typeof data.path === 'string' ? data.path : '';
    path = path.split('?')[0].split('#')[0];
    if (!path.startsWith('/') || path.length > 120) return null;
    // Junk-cardinality guard: anything outside the site's real URL shapes gets
    // bucketed rather than minting a document per garbage path.
    if (!/^\/[a-zA-Z0-9\-_./]*$/.test(path)) path = '/other';

    let ref = typeof data.ref === 'string' ? data.ref.toLowerCase().slice(0, 64) : '';
    if (!/^[a-z0-9.-]*$/.test(ref)) ref = '';

    return { site: data.site, path, ref, pwa: !!data.pwa, unique: !!data.unique };
}

functions.http('tally', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://noadsweather.com');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).send(''); return; }
    if (!isAllowedRequest(req)) { res.status(403).send(''); return; }

    // Bots get the same 204 as everyone — no need to advertise the filter.
    if (BOT_RE.test(req.headers['user-agent'] || '')) { res.status(204).send(''); return; }

    const p = parsePayload(req);
    if (!p) { res.status(204).send(''); return; }

    // Bucketed by server UTC day. The client's "unique today" flag uses its
    // local day, so the two roll over at different moments — fine for tallies.
    const day = new Date().toISOString().slice(0, 10);

    const dayRef = db.doc(`sites/${p.site}/days/${day}`);
    const pageRef = db.doc(`sites/${p.site}/pages/${day}_${encodePath(p.path)}`);

    const hour = String(new Date().getUTCHours()).padStart(2, '0');

    const dayUpdate = { views: FieldValue.increment(1) };
    // Hour-of-day map (UTC, "00".."23") on the same doc — hourly resolution
    // for free: same write, same doc, at most 24 extra keys per day.
    dayUpdate.hours = { [hour]: FieldValue.increment(1) };
    if (p.unique) {
        dayUpdate.uniques = FieldValue.increment(1);
        // Arrival-hour map for uniques: "first visit of the day, by hour".
        // (True per-hour uniqueness would need a payload change — see the
        // privacy-copy rule at the top before ever doing that.)
        dayUpdate.hoursU = { [hour]: FieldValue.increment(1) };
    }
    if (p.pwa) dayUpdate.pwa = FieldValue.increment(1);
    if (p.ref) dayUpdate.referrers = { [encodeDomainKey(p.ref)]: FieldValue.increment(1) };

    try {
        const batch = db.batch();
        batch.set(dayRef, dayUpdate, { merge: true });
        batch.set(pageRef, { day, path: p.path, views: FieldValue.increment(1) }, { merge: true });
        await batch.commit();
    } catch (err) {
        // Approximate counting: a dropped write is acceptable, a stack of
        // payload data in the logs is not.
        console.error('tally: write failed:', err?.code, err?.message);
    }
    res.status(204).send('');
});
