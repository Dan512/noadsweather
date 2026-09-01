// Local dashboard generator for the tally counter. Not deployed (.gcloudignore).
//
// Usage:  node tally/stats.js [--days 30] [--hours 48] [--site <only-this-site>] [--open] [--demo]
//
// Discovers every site that has tally data and renders one section per site.
// Reads Firestore with your gcloud application-default credentials
// (one-time setup: `gcloud auth application-default login`) and writes
// stats.html at the repo root — gitignored, purely local.

const fs = require('fs');
const path = require('path');
const { Firestore, FieldPath } = require('@google-cloud/firestore');

const PROJECT_ID = 'pollen-api-492014';

const args = process.argv.slice(2);
function argValue(name, fallback) {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const DAYS = Math.max(3, Math.min(365, parseInt(argValue('--days', '30'), 10) || 30));
const HOURS = Math.max(24, Math.min(168, parseInt(argValue('--hours', '48'), 10) || 48));
const ONLY_SITE = argValue('--site', null);
const OPEN = args.includes('--open');
const DEMO = args.includes('--demo'); // fake data — preview the page without Firestore

function dayString(d) { return d.toISOString().slice(0, 10); }
function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------- demo data

function demoDayDocs(start, seed) {
    const days = [], pages = [];
    const paths = ['/', '/cities/austin-tx/', '/cities/london/', '/cities/new-york-ny/',
        '/cities/seattle-wa/', '/cities/tokyo-en/', '/about/'];
    for (let i = 0; i < DAYS; i++) {
        const day = dayString(new Date(start.getTime() + i * 86400000));
        const weekend = [0, 6].includes(new Date(day).getUTCDay());
        const views = Math.round((60 + seed * 40 + i * 3) * (weekend ? 0.7 : 1) + 25 * Math.sin(i * 1.7 + seed));
        const hours = {};
        for (let h = 0; h < 24; h++) {
            // Diurnal curve peaking mid-day US time (~18 UTC)
            hours[String(h).padStart(2, '0')] =
                Math.max(0, Math.round(views / 24 + (views / 30) * Math.sin((h - 12 + seed) / 24 * 2 * Math.PI)));
        }
        const referrers = { 'google~com': Math.round(views * 0.4), 'bing~com': Math.round(views * 0.05),
            'reddit~com': i % 7 === 3 ? 30 : 2 };
        days.push({ id: day, data: () => ({ views, uniques: Math.round(views * 0.62), pwa: Math.round(views * 0.08), hours, referrers }) });
        paths.forEach((p, j) => pages.push({
            id: `${day}_${encodeURIComponent(p)}`,
            data: () => ({ day, path: p, views: Math.max(1, Math.round(views / (j + 1.5))) }),
        }));
    }
    return [{ docs: days }, { docs: pages }];
}

// ---------------------------------------------------------------- fetching

async function fetchSite(db, site, seed) {
    const start = new Date(Date.now() - (DAYS - 1) * 86400000);
    const startDay = dayString(start);

    let daysSnap, pagesSnap;
    if (DEMO) {
        [daysSnap, pagesSnap] = demoDayDocs(start, seed);
    } else {
        [daysSnap, pagesSnap] = await Promise.all([
            db.collection(`sites/${site}/days`)
                .where(FieldPath.documentId(), '>=', startDay).get(),
            db.collection(`sites/${site}/pages`)
                .where(FieldPath.documentId(), '>=', startDay).get(),
        ]);
    }

    const byDay = new Map();
    for (const doc of daysSnap.docs) byDay.set(doc.id, doc.data());

    // Daily series, zero-filled so quiet days don't vanish from the chart.
    const daily = [];
    const referrers = new Map();
    let totalViews = 0, totalUniques = 0, totalPwa = 0;
    for (let i = 0; i < DAYS; i++) {
        const day = dayString(new Date(start.getTime() + i * 86400000));
        const d = byDay.get(day) || {};
        const views = d.views || 0, uniques = d.uniques || 0, pwa = d.pwa || 0;
        daily.push({ day, views, uniques, pwa });
        totalViews += views; totalUniques += uniques; totalPwa += pwa;
        for (const [key, n] of Object.entries(d.referrers || {})) {
            const domain = key.replace(/~/g, '.');
            referrers.set(domain, (referrers.get(domain) || 0) + n);
        }
    }

    // Hourly series for the trailing window, read out of the day docs' hours
    // maps. Buckets are UTC on the server; we bake the epoch ms and let the
    // page label them in the viewer's local time.
    const hourly = [];
    const nowHour = Math.floor(Date.now() / 3600000) * 3600000;
    for (let i = HOURS - 1; i >= 0; i--) {
        const ts = new Date(nowHour - i * 3600000);
        const d = byDay.get(dayString(ts)) || {};
        const hh = String(ts.getUTCHours()).padStart(2, '0');
        hourly.push({ t: ts.getTime(), v: (d.hours || {})[hh] || 0 });
    }
    const last24 = hourly.slice(-24).reduce((a, b) => a + b.v, 0);

    const pages = new Map();
    for (const doc of pagesSnap.docs) {
        const d = doc.data();
        if (!d.path) continue;
        pages.set(d.path, (pages.get(d.path) || 0) + (d.views || 0));
    }

    return {
        site, daily, hourly, last24,
        totalViews, totalUniques, totalPwa,
        topPages: [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40),
        topRefs: [...referrers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25),
    };
}

// ---------------------------------------------------------------- rendering

function renderSite(d, idx) {
    const pwaShare = d.totalViews ? (100 * d.totalPwa / d.totalViews) : 0;
    const topRef = d.topRefs.length ? d.topRefs[0] : null;
    const maxPageViews = d.topPages.length ? d.topPages[0][1] : 1;

    const pageRows = d.topPages.map(([p, n]) => `
        <tr><td class="path">${esc(p)}</td><td class="num">${n.toLocaleString()}</td>
        <td class="barcell"><div class="bar" style="width:${Math.max(1, 100 * n / maxPageViews).toFixed(1)}%"></div></td></tr>`).join('');
    const refRows = d.topRefs.map(([r, n]) => `
        <tr><td class="path">${esc(r)}</td><td class="num">${n.toLocaleString()}</td></tr>`).join('')
        || '<tr><td class="path" colspan="2">No referrers yet (all direct traffic)</td></tr>';
    const dailyRows = d.daily.slice().reverse().map(x => `
        <tr><td>${x.day}</td><td class="num">${x.views.toLocaleString()}</td>
        <td class="num">${x.uniques.toLocaleString()}</td><td class="num">${x.pwa.toLocaleString()}</td></tr>`).join('');

    return `
<section class="site">
  <h1>${esc(d.site)}</h1>
  <div class="tiles">
    <div class="tile"><div class="v">${d.last24.toLocaleString()}</div><div class="l">Views, last 24 h</div></div>
    <div class="tile"><div class="v">${d.totalViews.toLocaleString()}</div><div class="l">Views, ${DAYS} days</div></div>
    <div class="tile"><div class="v">${d.totalUniques.toLocaleString()}</div><div class="l">Daily uniques (sum)</div></div>
    <div class="tile"><div class="v">${pwaShare.toFixed(1)}%</div><div class="l">Views from installed app</div></div>
    <div class="tile"><div class="v">${topRef ? esc(topRef[0]) : '—'}</div><div class="l">Top referrer${topRef ? ' (' + topRef[1].toLocaleString() + ')' : ''}</div></div>
  </div>

  <div class="card">
    <h2>Views per hour (last ${HOURS} h, your local time)</h2>
    <div class="chartbox"><svg id="hourly-${idx}" width="100%" height="170" role="img"
      aria-label="Hourly views bar chart"></svg><div class="tip"></div></div>
  </div>

  <div class="card">
    <h2>Views and uniques per day</h2>
    <div class="legend"><span class="k1">Views</span><span class="k2">Uniques</span></div>
    <div class="chartbox"><svg id="daily-${idx}" width="100%" height="220" role="img"
      aria-label="Daily views and uniques line chart; the daily table below holds the same data"></svg>
      <div class="tip"></div></div>
  </div>

  <div class="card">
    <h2>Pages (${DAYS} days)</h2>
    <table><tr><th>Path</th><th class="num">Views</th><th></th></tr>${pageRows}</table>
  </div>

  <div class="card">
    <h2>Referrers</h2>
    <table><tr><th>Domain</th><th class="num">Views</th></tr>${refRows}</table>
  </div>

  <div class="card">
    <h2>Daily table</h2>
    <table><tr><th>Day</th><th class="num">Views</th><th class="num">Uniques</th><th class="num">PWA</th></tr>${dailyRows}</table>
  </div>
</section>`;
}

function renderPage(sites) {
    const generated = new Date().toLocaleString();
    const chartData = sites.map((d, i) => ({
        idx: i, daily: d.daily, hourly: d.hourly,
    }));

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NoAds tally</title>
<style>
:root {
  color-scheme: light;
  --surface: #fcfcfb; --card: #ffffff; --text: #0b0b0b; --text-2: #52514e;
  --grid: #e7e6e2; --s1: #2a78d6; --s2: #eb6834;
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --surface: #1a1a19; --card: #232322; --text: #ffffff; --text-2: #c3c2b7;
    --grid: #3a3a38; --s1: #3987e5; --s2: #d95926;
  }
}
* { box-sizing: border-box; margin: 0; }
body { background: var(--surface); color: var(--text);
  font: 15px/1.5 system-ui, "Segoe UI", sans-serif; padding: 2rem 1rem 4rem; }
.wrap { max-width: 860px; margin: 0 auto; }
.sub { color: var(--text-2); font-size: 0.85rem; margin-bottom: 1.5rem; }
.site { margin-bottom: 3rem; }
.site + .site { border-top: 2px solid var(--grid); padding-top: 2rem; }
h1 { font-size: 1.3rem; margin-bottom: 0.75rem; }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem; margin-bottom: 1.5rem; }
.tile { background: var(--card); border: 1px solid var(--grid); border-radius: 8px;
  padding: 0.9rem 1rem; }
.tile .v { font-size: 1.4rem; font-weight: 600; font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere; }
.tile .l { color: var(--text-2); font-size: 0.78rem; }
.card { background: var(--card); border: 1px solid var(--grid); border-radius: 8px;
  padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
h2 { font-size: 0.95rem; margin-bottom: 0.75rem; }
.legend { display: flex; gap: 1.25rem; font-size: 0.8rem; color: var(--text-2);
  margin-bottom: 0.5rem; }
.legend span::before { content: ''; display: inline-block; width: 10px; height: 10px;
  border-radius: 2px; margin-right: 5px; vertical-align: -1px; }
.legend .k1::before { background: var(--s1); } .legend .k2::before { background: var(--s2); }
.chartbox { position: relative; }
.tip { position: absolute; pointer-events: none; background: var(--card);
  border: 1px solid var(--grid); border-radius: 6px; padding: 5px 9px;
  font-size: 0.78rem; display: none; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
.tip b { font-variant-numeric: tabular-nums; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { text-align: left; color: var(--text-2); font-weight: 500; font-size: 0.75rem;
  padding: 0.25rem 0.5rem; border-bottom: 1px solid var(--grid); }
td { padding: 0.3rem 0.5rem; border-bottom: 1px solid var(--grid); }
td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
td.path { font-family: Consolas, monospace; font-size: 0.8rem; word-break: break-all; }
td.barcell { width: 40%; }
.bar { height: 10px; background: var(--s1); border-radius: 0 4px 4px 0; min-width: 2px; }
</style>
</head>
<body>
<div class="wrap">
  <p class="sub">NoAds tally · generated ${esc(generated)} · anonymous tallies, nothing else · rerun tally/stats.js to refresh</p>
  ${sites.map((d, i) => renderSite(d, i)).join('\n')}
</div>

<script>
var SITES = ${JSON.stringify(chartData)};
(function () {
  var css = getComputedStyle(document.documentElement);
  function color(name) { return css.getPropertyValue(name).trim(); }
  function hourLabel(t) {
    var d = new Date(t);
    return d.toLocaleDateString(undefined, { weekday: 'short' }) + ' ' +
      d.toLocaleTimeString(undefined, { hour: 'numeric' });
  }

  function attachHover(svg, tip, positions, htmlFor, crossId) {
    svg.onmousemove = function (e) {
      var r = svg.getBoundingClientRect();
      var best = 0, bd = 1e9;
      for (var i = 0; i < positions.length; i++) {
        var d = Math.abs(e.clientX - r.left - positions[i]);
        if (d < bd) { bd = d; best = i; }
      }
      if (crossId) {
        var c = document.getElementById(crossId);
        c.setAttribute('x1', positions[best]); c.setAttribute('x2', positions[best]);
        c.style.display = '';
      }
      tip.style.display = 'block';
      tip.innerHTML = htmlFor(best);
      var left = positions[best] + 12;
      if (left + tip.offsetWidth > svg.clientWidth) left = positions[best] - tip.offsetWidth - 12;
      tip.style.left = Math.max(0, left) + 'px';
      tip.style.top = (e.clientY - r.top - 30) + 'px';
    };
    svg.onmouseleave = function () {
      tip.style.display = 'none';
      if (crossId) { var c = document.getElementById(crossId); if (c) c.style.display = 'none'; }
    };
  }

  function drawBars(svg, tip, rows) {
    var W = svg.clientWidth, H = 170, padL = 38, padR = 10, padT = 10, padB = 22;
    var iw = W - padL - padR, ih = H - padT - padB;
    var max = 1;
    rows.forEach(function (r) { max = Math.max(max, r.v); });
    var grid = color('--grid'), t2 = color('--text-2'), s1 = color('--s1'), surface = color('--card');
    var step = iw / rows.length, bw = Math.max(1, step - 2); // 2px surface gap
    var out = '';
    [0, 0.5, 1].forEach(function (f) {
      var v = Math.round(max * f), yy = padT + ih - f * ih;
      out += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy +
        '" stroke="' + grid + '" stroke-width="1"/>' +
        '<text x="' + (padL - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="10" fill="' + t2 + '">' + v + '</text>';
    });
    var positions = [];
    rows.forEach(function (r, i) {
      var x = padL + i * step + 1, h = r.v / max * ih;
      positions.push(padL + i * step + step / 2);
      if (r.v > 0) out += '<rect x="' + x.toFixed(1) + '" y="' + (padT + ih - h).toFixed(1) +
        '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" fill="' + s1 + '"/>';
    });
    // x labels every 6 buckets
    for (var i = 0; i < rows.length; i += 6) {
      out += '<text x="' + positions[i] + '" y="' + (H - 6) + '" text-anchor="middle" font-size="9" fill="' + t2 + '">' +
        new Date(rows[i].t).toLocaleTimeString(undefined, { hour: 'numeric' }) + '</text>';
    }
    svg.innerHTML = out;
    attachHover(svg, tip, positions, function (i) {
      return hourLabel(rows[i].t) + ' · <b>' + rows[i].v + '</b> views';
    }, null);
  }

  function drawLines(svg, tip, rows, crossId) {
    var W = svg.clientWidth, H = 220, padL = 42, padR = 14, padT = 12, padB = 24;
    var iw = W - padL - padR, ih = H - padT - padB;
    var max = 1;
    rows.forEach(function (d) { max = Math.max(max, d.views); });
    max = Math.ceil(max * 1.1) || 1;
    var x = function (i) { return padL + (rows.length < 2 ? iw / 2 : i * iw / (rows.length - 1)); };
    var y = function (v) { return padT + ih - v * ih / max; };
    var grid = color('--grid'), t2 = color('--text-2');
    var out = '';
    [0, 0.5, 1].forEach(function (f) {
      var v = Math.round(max * f), yy = y(v);
      out += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy +
        '" stroke="' + grid + '" stroke-width="1"/>' +
        '<text x="' + (padL - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="10" fill="' + t2 + '">' + v + '</text>';
    });
    [0, Math.floor(rows.length / 2), rows.length - 1].forEach(function (i) {
      if (i < 0 || !rows[i]) return;
      out += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" fill="' + t2 + '">' +
        rows[i].day.slice(5) + '</text>';
    });
    function line(key, c) {
      var pts = rows.map(function (d, i) { return x(i).toFixed(1) + ',' + y(d[key]).toFixed(1); }).join(' ');
      return '<polyline points="' + pts + '" fill="none" stroke="' + c +
        '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    out += line('views', color('--s1')) + line('uniques', color('--s2'));
    out += '<line id="' + crossId + '" y1="' + padT + '" y2="' + (padT + ih) + '" stroke="' + t2 +
      '" stroke-width="1" stroke-dasharray="3,3" style="display:none"/>';
    svg.innerHTML = out;
    var positions = rows.map(function (d, i) { return x(i); });
    attachHover(svg, tip, positions, function (i) {
      var d = rows[i];
      return d.day + '<br>Views <b>' + d.views + '</b> · Uniques <b>' + d.uniques +
        '</b> · PWA <b>' + d.pwa + '</b>';
    }, crossId);
  }

  function drawAll() {
    SITES.forEach(function (s) {
      var hs = document.getElementById('hourly-' + s.idx);
      drawBars(hs, hs.parentNode.querySelector('.tip'), s.hourly);
      var ds = document.getElementById('daily-' + s.idx);
      drawLines(ds, ds.parentNode.querySelector('.tip'), s.daily, 'cross-' + s.idx);
    });
  }
  drawAll();
  window.addEventListener('resize', drawAll);
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', drawAll);
  }
})();
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------- main

async function main() {
    let siteIds;
    let db = null;
    if (DEMO) {
        siteIds = ['noadsweather.com', 'noadstools.com'];
    } else {
        db = new Firestore({ projectId: PROJECT_ID });
        // Parent docs are never written, only their subcollections —
        // listDocuments() still returns these "missing" parents.
        const refs = await db.collection('sites').listDocuments();
        siteIds = refs.map(r => r.id).sort();
    }
    if (ONLY_SITE) siteIds = siteIds.filter(s => s === ONLY_SITE);
    if (!siteIds.length) {
        console.error(ONLY_SITE ? `No data for site "${ONLY_SITE}".` : 'No sites with tally data yet.');
        process.exit(1);
    }

    const sites = await Promise.all(siteIds.map((s, i) => fetchSite(db, s, i)));
    const html = renderPage(sites);

    const out = path.join(__dirname, '..', 'stats.html');
    fs.writeFileSync(out, html, 'utf8');
    console.log(`Wrote ${out}`);
    for (const d of sites) {
        console.log(`  ${d.site}: ${d.totalViews.toLocaleString()} views / ` +
            `${d.totalUniques.toLocaleString()} uniques over ${DAYS} days, ${d.last24.toLocaleString()} in last 24 h`);
    }
    if (OPEN) require('child_process').exec(`start "" "${out}"`);
}

main().catch(err => {
    if (/could not load the default credentials|unauthenticated/i.test(String(err))) {
        console.error('Auth needed. Run once:  gcloud auth application-default login');
    }
    console.error(err.message || err);
    process.exit(1);
});
