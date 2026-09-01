// Local dashboard generator for the tally counter. Not deployed (.gcloudignore).
//
// Usage:  node tally/stats.js [--days 30] [--site noadsweather.com] [--open]
//
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
const DAYS = Math.max(1, Math.min(365, parseInt(argValue('--days', '30'), 10) || 30));
const SITE = argValue('--site', 'noadsweather.com');
const OPEN = args.includes('--open');
const DEMO = args.includes('--demo'); // fake data — preview the page without Firestore

function dayString(d) { return d.toISOString().slice(0, 10); }
function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function demoSnapshots(start) {
    // Deterministic fake traffic with a weekly rhythm and a growth trend.
    const days = [], pages = [];
    const paths = ['/', '/cities/austin-tx/', '/cities/london/', '/cities/new-york-ny/',
        '/cities/seattle-wa/', '/cities/tokyo-en/', '/cities/berlin/', '/about/'];
    const refs = { 'google~com': 0, 'bing~com': 0, 'reddit~com': 0, 'news~ycombinator~com': 0 };
    for (let i = 0; i < DAYS; i++) {
        const day = dayString(new Date(start.getTime() + i * 86400000));
        const weekend = [0, 6].includes(new Date(day).getUTCDay());
        const views = Math.round((80 + i * 3) * (weekend ? 0.7 : 1) + 25 * Math.sin(i * 1.7));
        const uniques = Math.round(views * 0.62);
        const referrers = { 'google~com': Math.round(views * 0.4), 'bing~com': Math.round(views * 0.05),
            'reddit~com': i % 7 === 3 ? 30 : 2, 'news~ycombinator~com': i === Math.floor(DAYS / 2) ? 90 : 0 };
        days.push({ id: day, data: () => ({ views, uniques, pwa: Math.round(views * 0.08), referrers }) });
        paths.forEach((p, j) => pages.push({
            id: `${day}_${encodeURIComponent(p)}`,
            data: () => ({ day, path: p, views: Math.max(1, Math.round(views / (j + 1.5))) }),
        }));
    }
    return [{ docs: days }, { docs: pages }];
}

async function main() {
    const start = new Date(Date.now() - (DAYS - 1) * 86400000);
    const startDay = dayString(start);

    let daysSnap, pagesSnap;
    if (DEMO) {
        [daysSnap, pagesSnap] = demoSnapshots(start);
    } else {
        const db = new Firestore({ projectId: PROJECT_ID });
        [daysSnap, pagesSnap] = await Promise.all([
            db.collection(`sites/${SITE}/days`)
                .where(FieldPath.documentId(), '>=', startDay).get(),
            db.collection(`sites/${SITE}/pages`)
                .where(FieldPath.documentId(), '>=', startDay).get(),
        ]);
    }

    // Daily series with zero-filled gaps so the chart doesn't skip quiet days.
    const byDay = new Map();
    for (const doc of daysSnap.docs) byDay.set(doc.id, doc.data());
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

    const pages = new Map();
    for (const doc of pagesSnap.docs) {
        const d = doc.data();
        if (!d.path) continue;
        pages.set(d.path, (pages.get(d.path) || 0) + (d.views || 0));
    }
    const topPages = [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
    const topRefs = [...referrers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);

    const pwaShare = totalViews ? (100 * totalPwa / totalViews) : 0;
    const topRef = topRefs.length ? topRefs[0] : null;

    const data = { site: SITE, days: DAYS, daily, generated: new Date().toLocaleString() };

    const maxPageViews = topPages.length ? topPages[0][1] : 1;
    const pageRows = topPages.map(([p, n]) => `
        <tr><td class="path">${esc(p)}</td><td class="num">${n.toLocaleString()}</td>
        <td class="barcell"><div class="bar" style="width:${Math.max(1, 100 * n / maxPageViews).toFixed(1)}%"></div></td></tr>`).join('');
    const refRows = topRefs.map(([r, n]) => `
        <tr><td class="path">${esc(r)}</td><td class="num">${n.toLocaleString()}</td></tr>`).join('')
        || '<tr><td class="path" colspan="2">No referrers yet (all direct traffic)</td></tr>';
    const dailyRows = daily.slice().reverse().map(d => `
        <tr><td>${d.day}</td><td class="num">${d.views.toLocaleString()}</td>
        <td class="num">${d.uniques.toLocaleString()}</td><td class="num">${d.pwa.toLocaleString()}</td></tr>`).join('');

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(SITE)} — visit tally</title>
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
h1 { font-size: 1.3rem; margin-bottom: 0.25rem; }
.sub { color: var(--text-2); font-size: 0.85rem; margin-bottom: 1.5rem; }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem; margin-bottom: 1.5rem; }
.tile { background: var(--card); border: 1px solid var(--grid); border-radius: 8px;
  padding: 0.9rem 1rem; }
.tile .v { font-size: 1.5rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.tile .l { color: var(--text-2); font-size: 0.78rem; }
.card { background: var(--card); border: 1px solid var(--grid); border-radius: 8px;
  padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
h2 { font-size: 0.95rem; margin-bottom: 0.75rem; }
.legend { display: flex; gap: 1.25rem; font-size: 0.8rem; color: var(--text-2);
  margin-bottom: 0.5rem; }
.legend span::before { content: ''; display: inline-block; width: 10px; height: 10px;
  border-radius: 2px; margin-right: 5px; vertical-align: -1px; }
.legend .k1::before { background: var(--s1); } .legend .k2::before { background: var(--s2); }
#chartbox { position: relative; }
#tip { position: absolute; pointer-events: none; background: var(--card);
  border: 1px solid var(--grid); border-radius: 6px; padding: 5px 9px;
  font-size: 0.78rem; display: none; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
#tip b { font-variant-numeric: tabular-nums; }
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
  <h1>${esc(SITE)}</h1>
  <p class="sub">Last ${DAYS} days · generated ${esc(data.generated)} · anonymous tallies, nothing else</p>

  <div class="tiles">
    <div class="tile"><div class="v">${totalViews.toLocaleString()}</div><div class="l">Page views</div></div>
    <div class="tile"><div class="v">${totalUniques.toLocaleString()}</div><div class="l">Daily uniques (sum)</div></div>
    <div class="tile"><div class="v">${pwaShare.toFixed(1)}%</div><div class="l">Views from installed app</div></div>
    <div class="tile"><div class="v">${topRef ? esc(topRef[0]) : '—'}</div><div class="l">Top referrer${topRef ? ' (' + topRef[1].toLocaleString() + ')' : ''}</div></div>
  </div>

  <div class="card">
    <h2>Views and uniques per day</h2>
    <div class="legend"><span class="k1">Views</span><span class="k2">Uniques</span></div>
    <div id="chartbox"><svg id="chart" width="100%" height="220" role="img"
      aria-label="Daily views and uniques line chart; the table below holds the same data"></svg>
      <div id="tip"></div></div>
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
</div>

<script>
var DATA = ${JSON.stringify(data.daily)};
(function () {
  var svg = document.getElementById('chart');
  var tip = document.getElementById('tip');
  var css = getComputedStyle(document.documentElement);
  function draw() {
    var W = svg.clientWidth, H = 220, padL = 42, padR = 14, padT = 12, padB = 24;
    var iw = W - padL - padR, ih = H - padT - padB;
    var max = 1;
    DATA.forEach(function (d) { max = Math.max(max, d.views); });
    max = Math.ceil(max * 1.1) || 1;
    var x = function (i) { return padL + (DATA.length < 2 ? iw / 2 : i * iw / (DATA.length - 1)); };
    var y = function (v) { return padT + ih - v * ih / max; };
    var grid = css.getPropertyValue('--grid').trim();
    var t2 = css.getPropertyValue('--text-2').trim();
    var s1 = css.getPropertyValue('--s1').trim(), s2 = css.getPropertyValue('--s2').trim();
    var out = '';
    [0, 0.5, 1].forEach(function (f) {
      var v = Math.round(max * f), yy = y(v);
      out += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy +
        '" stroke="' + grid + '" stroke-width="1"/>' +
        '<text x="' + (padL - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="10" fill="' + t2 + '">' + v + '</text>';
    });
    [0, Math.floor(DATA.length / 2), DATA.length - 1].forEach(function (i) {
      if (i < 0 || !DATA[i]) return;
      out += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" fill="' + t2 + '">' +
        DATA[i].day.slice(5) + '</text>';
    });
    function line(key, color) {
      var pts = DATA.map(function (d, i) { return x(i).toFixed(1) + ',' + y(d[key]).toFixed(1); }).join(' ');
      return '<polyline points="' + pts + '" fill="none" stroke="' + color +
        '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    out += line('views', s1) + line('uniques', s2);
    out += '<line id="cross" y1="' + padT + '" y2="' + (padT + ih) + '" stroke="' + t2 +
      '" stroke-width="1" stroke-dasharray="3,3" style="display:none"/>';
    svg.innerHTML = out;
    svg.onmousemove = function (e) {
      var r = svg.getBoundingClientRect();
      var i = Math.round((e.clientX - r.left - padL) / (iw / Math.max(1, DATA.length - 1)));
      i = Math.max(0, Math.min(DATA.length - 1, i));
      var d = DATA[i], cx = x(i);
      document.getElementById('cross').setAttribute('x1', cx);
      document.getElementById('cross').setAttribute('x2', cx);
      document.getElementById('cross').style.display = '';
      tip.style.display = 'block';
      tip.innerHTML = d.day + '<br>Views <b>' + d.views + '</b> · Uniques <b>' + d.uniques +
        '</b> · PWA <b>' + d.pwa + '</b>';
      var left = cx + 12;
      if (left + tip.offsetWidth > W) left = cx - tip.offsetWidth - 12;
      tip.style.left = left + 'px';
      tip.style.top = (e.clientY - r.top - 30) + 'px';
    };
    svg.onmouseleave = function () {
      tip.style.display = 'none';
      var c = document.getElementById('cross');
      if (c) c.style.display = 'none';
    };
  }
  draw();
  window.addEventListener('resize', draw);
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  }
})();
</script>
</body>
</html>`;

    const out = path.join(__dirname, '..', 'stats.html');
    fs.writeFileSync(out, html, 'utf8');
    console.log(`Wrote ${out}`);
    console.log(`  ${totalViews.toLocaleString()} views, ${totalUniques.toLocaleString()} uniques, ` +
        `${pwaShare.toFixed(1)}% PWA over ${DAYS} days`);
    if (OPEN) require('child_process').exec(`start "" "${out}"`);
}

main().catch(err => {
    if (/could not load the default credentials|unauthenticated/i.test(String(err))) {
        console.error('Auth needed. Run once:  gcloud auth application-default login');
    }
    console.error(err.message || err);
    process.exit(1);
});
