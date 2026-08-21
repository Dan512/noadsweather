// =============================================================================
// NoAdsWeather - app.js
// =============================================================================

// --- Units system ------------------------------------------------------------

const IMPERIAL_COUNTRIES = ['United States', 'Liberia', 'Myanmar'];

// ISO 3166-1 alpha-2 → full English name. Used to normalize 2-letter codes
// from scripts/cities.json so they match what Open-Meteo's geocoding API
// returns (full names like "United States"). IMPERIAL_COUNTRIES and the
// NWS-routing check in fetchAlerts both rely on full names — keep entries
// here in sync with anything that lands in cities.json.
const COUNTRY_NAMES = {
    US: 'United States', CA: 'Canada', GB: 'United Kingdom', IE: 'Ireland',
    AU: 'Australia', NZ: 'New Zealand', MX: 'Mexico', ES: 'Spain',
    AR: 'Argentina', PE: 'Peru', CO: 'Colombia', PT: 'Portugal',
    BR: 'Brazil', FR: 'France', DE: 'Germany', AT: 'Austria',
    IT: 'Italy', NL: 'Netherlands', PL: 'Poland', SE: 'Sweden',
    RU: 'Russia', JP: 'Japan', CN: 'China', KR: 'South Korea',
    IN: 'India', AE: 'United Arab Emirates', HK: 'Hong Kong',
    SG: 'Singapore', ZA: 'South Africa',
};

function normalizeCountry(c) {
    return COUNTRY_NAMES[c] || c || '';
}

let units = {
    temp: 'fahrenheit',
    wind: 'mph',
    precip: 'inch',
    pressure: 'inHg',
    time24h: false,
};

function isImperial() { return units.temp === 'fahrenheit'; }

function saveUnitsPref() {
    localStorage.setItem('unitsPref', JSON.stringify({ temp: units.temp, time24h: units.time24h }));
}

function loadUnitsPref() {
    try {
        return JSON.parse(localStorage.getItem('unitsPref') || 'null');
    } catch {
        localStorage.removeItem('unitsPref');
        return null;
    }
}

function applyUnitsFromTemp(temp) {
    const imperial = temp === 'fahrenheit';
    units.temp = temp;
    units.wind = imperial ? 'mph' : 'kmh';
    units.precip = imperial ? 'inch' : 'mm';
    units.pressure = imperial ? 'inHg' : 'hPa';
}

// Regions (ISO 3166-1 alpha-2) whose locales imply imperial units — the same
// three countries as IMPERIAL_COUNTRIES, keyed by region subtag instead.
const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM']);

// Fallback unit guess for locations that carry no country — notably a
// geolocated fix, which is just coordinates. Reads the region subtag from the
// browser's language preferences (en-US → US). Falls back to metric, which is
// the right default for most of the world.
function localePrefersImperial() {
    const tags = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || ''];
    for (const tag of tags) {
        const m = /^[A-Za-z]{2,3}[-_]([A-Za-z]{2})\b/.exec(tag || '');
        if (m) return IMPERIAL_REGIONS.has(m[1].toUpperCase());
    }
    // No region subtag anywhere (e.g. plain "en"); try the resolved Intl locale.
    try {
        const m = /^[A-Za-z]{2,3}[-_]([A-Za-z]{2})\b/.exec(
            Intl.DateTimeFormat().resolvedOptions().locale || ''
        );
        if (m) return IMPERIAL_REGIONS.has(m[1].toUpperCase());
    } catch (e) { /* Intl unavailable — fall through to metric */ }
    return false;
}

function setUnitsForCountry(country) {
    const stored = loadUnitsPref();
    if (stored) {
        // User has a stored preference — use it
        applyUnitsFromTemp(stored.temp);
        units.time24h = stored.time24h;
    } else {
        // No stored preference — auto-detect from country, or from the browser
        // locale when the country is unknown (geolocated coordinates have none).
        if (country ? IMPERIAL_COUNTRIES.includes(country) : localePrefersImperial()) {
            units = { temp: 'fahrenheit', wind: 'mph', precip: 'inch', pressure: 'inHg', time24h: false };
        } else {
            units = { temp: 'celsius', wind: 'kmh', precip: 'mm', pressure: 'hPa', time24h: true };
        }
    }
    updateUnitsToggleLabel();
}

function toggleUnits() {
    applyUnitsFromTemp(isImperial() ? 'celsius' : 'fahrenheit');
    updateUnitsToggleLabel();
    saveUnitsPref();
}

function updateUnitsToggleLabel() {
    const btn = document.getElementById('units-toggle');
    if (btn) btn.textContent = isImperial() ? '°F' : '°C';
    const timeBtn = document.getElementById('time-toggle');
    if (timeBtn) timeBtn.textContent = units.time24h ? '24H' : '12H';
}

function tempUnit() { return isImperial() ? '°F' : '°C'; }
function windUnit() { return isImperial() ? 'mph' : 'km/h'; }
function precipUnit() { return isImperial() ? '"' : 'mm'; }

function fmtTimeUnit(date) {
    if (!date || isNaN(date)) return '—';
    if (units.time24h) {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function fmtPrecip(val) {
    if (isImperial()) return val.toFixed(2) + '"';
    return val.toFixed(1) + 'mm';
}

// --- Section Preferences System -----------------------------------------------

const DEFAULT_SECTION_ORDER = [
    'current-section', 'details-section', 'hourly-section', 'daily-section',
    'radar-section', 'sun-section', 'moon-section'
];

// Default layout: ordered list with column assignments
// 'left', 'right', or 'wide'
const DEFAULT_LAYOUT_LIST = [
    { id: 'current-section', col: 'left' },
    { id: 'details-section', col: 'right' },
    { id: 'hourly-section', col: 'wide' },
    { id: 'daily-section', col: 'wide' },
    { id: 'radar-section', col: 'left' },
    { id: 'sun-section', col: 'right' },
    { id: 'moon-section', col: 'right' },
];

const DEFAULT_CHART_ORDER = ['chart-temp', 'chart-atmos', 'chart-precip', 'chart-wind'];
const DEFAULT_WIDE_SECTIONS = ['daily-section', 'hourly-section'];

function sectionName(id) {
    const keyMap = {
        'current-section': 'currentConditions',
        'details-section': 'pollen',
        'hourly-section': 'hourlyForecast',
        'daily-section': 'tenDayForecast',
        'radar-section': 'radar',
        'sun-section': 'sun',
        'moon-section': 'moon'
    };
    return t(keyMap[id] || id);
}

// Sections that always span 2 columns

function loadSectionPrefs() {
    const VALID_SECTION_IDS = new Set(DEFAULT_SECTION_ORDER);
    const VALID_CHART_IDS = new Set(DEFAULT_CHART_ORDER);
    const onlyValid = (arr, set) => Array.isArray(arr) ? arr.filter(id => typeof id === 'string' && set.has(id)) : [];

    let stored = null;
    try {
        stored = JSON.parse(localStorage.getItem('sectionPrefs') || 'null');
    } catch {
        // Corrupt storage — reset
        localStorage.removeItem('sectionPrefs');
    }

    // Validate — if missing layoutList, reset
    if (stored && !stored.layoutList) {
        localStorage.removeItem('sectionPrefs');
        return { layoutList: JSON.parse(JSON.stringify(DEFAULT_LAYOUT_LIST)), hidden: [], minimized: [], chartOrder: [...DEFAULT_CHART_ORDER], hiddenCharts: [] };
    }
    const prefs = stored || {
        order: [...DEFAULT_SECTION_ORDER],
        hidden: [],
        minimized: [],
        chartOrder: [...DEFAULT_CHART_ORDER],
        hiddenCharts: [],
    };
    // Sanitize all id fields against allowlists — defends against tampered storage
    prefs.hidden = onlyValid(prefs.hidden, VALID_SECTION_IDS);
    prefs.minimized = onlyValid(prefs.minimized, VALID_SECTION_IDS);
    prefs.chartOrder = onlyValid(prefs.chartOrder, VALID_CHART_IDS);
    prefs.hiddenCharts = onlyValid(prefs.hiddenCharts || [], VALID_CHART_IDS);
    if (!prefs.layoutList) prefs.layoutList = JSON.parse(JSON.stringify(DEFAULT_LAYOUT_LIST));
    return prefs;
}

function saveSectionPrefs(prefs) {
    localStorage.setItem('sectionPrefs', JSON.stringify(prefs));
}

function saveLayoutFromDOM() {
    const container = document.getElementById('weather-content');
    if (!container) return;
    const prefs = loadSectionPrefs();
    const newList = [];
    for (const child of container.children) {
        if (child.classList && child.classList.contains('columns-row')) {
            const left = child.querySelector('.weather-col:first-child');
            const right = child.querySelector('.weather-col:last-child');
            const leftSections = left ? [...left.querySelectorAll('section')].map(s => s.id) : [];
            const rightSections = right ? [...right.querySelectorAll('section')].map(s => s.id) : [];
            const maxLen = Math.max(leftSections.length, rightSections.length);
            for (let i = 0; i < maxLen; i++) {
                if (i < leftSections.length) newList.push({ id: leftSections[i], col: 'left' });
                if (i < rightSections.length) newList.push({ id: rightSections[i], col: 'right' });
            }
        } else if (child.tagName === 'SECTION' && DEFAULT_SECTION_ORDER.includes(child.id)) {
            newList.push({ id: child.id, col: 'wide' });
        }
    }
    if (newList.length > 0) prefs.layoutList = newList;
    saveSectionPrefs(prefs);
}

function applySectionPreferences() {
    const prefs = loadSectionPrefs();
    const container = document.getElementById('weather-content');
    if (!container) return;

    // Reset all sections
    for (const id of DEFAULT_SECTION_ORDER) {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = '';
            el.classList.remove('section-minimized');
            el.classList.remove('section-wide');
            // Move back to container temporarily
            container.appendChild(el);
        }
    }

    // Remove old layout rows
    container.querySelectorAll('.columns-row').forEach(r => r.remove());

    // Build layout from prefs.layoutList
    // Walk through the list and group consecutive left/right items into columns-rows
    // Wide items break the row
    const spacer = container.querySelector('.bottom-spacer');
    let currentLeft = [];
    let currentRight = [];

    function flushColumns(force) {
        if (!force && currentLeft.length === 0 && currentRight.length === 0) return;
        const row = document.createElement('div');
        row.className = 'columns-row';
        const left = document.createElement('div');
        left.className = 'weather-col';
        const right = document.createElement('div');
        right.className = 'weather-col';
        for (const el of currentLeft) left.appendChild(el);
        for (const el of currentRight) right.appendChild(el);
        row.appendChild(left);
        row.appendChild(right);
        container.insertBefore(row, spacer);
        currentLeft = [];
        currentRight = [];
    }

    for (const item of prefs.layoutList) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        if (item.col === 'wide') {
            flushColumns();
            el.classList.add('section-wide');
            container.insertBefore(el, spacer);
        } else if (item.col === 'left') {
            currentLeft.push(el);
        } else {
            currentRight.push(el);
        }
    }
    flushColumns();
    // Always add an empty drop-target row at the end
    flushColumns(true);

    // Apply hidden
    for (const id of prefs.hidden) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }

    // Apply minimized
    for (const id of prefs.minimized) {
        const el = document.getElementById(id);
        if (el) el.classList.add('section-minimized');
    }

    // Reorder chart rows within the daily forecast
    applyChartOrder(prefs.chartOrder || DEFAULT_CHART_ORDER);

    // Inject controls on each draggable section
    injectSectionControls();
    renderHiddenSectionsBar();
}

function injectSectionControls() {
    for (const id of DEFAULT_SECTION_ORDER) {
        const el = document.getElementById(id);
        if (!el || el.style.display === 'none') continue;
        el.setAttribute('data-section-name', sectionName(id));
        const old = el.querySelector('.section-controls');
        if (old) old.remove();

        const isMin = el.classList.contains('section-minimized');
        const isWide = el.classList.contains('section-wide');

        const controls = document.createElement('div');
        controls.className = 'section-controls';
        controls.innerHTML = `
            <span class="section-drag-handle" title="${t('dragToReorder')}">⠿</span>
            <button class="section-move-up mobile-only" title="${t('moveUp')}">▲</button>
            <button class="section-move-down mobile-only" title="${t('moveDown')}">▼</button>
            <button class="section-width-btn" title="${isWide ? t('singleColumn') : t('fullWidth')}">${isWide ? '▣' : '◫'}</button>
            <button class="section-min-btn" title="${isMin ? t('removeSection') : t('minimizeSection')}">${isMin ? '✕' : '−'}</button>
        `;
        el.prepend(controls);

        // Mobile move up/down — swap in layoutList and re-render
        // On mobile, flatten all items to 'wide' so they stack cleanly in single column
        function mobileMove(direction) {
            const p = loadSectionPrefs();
            const isMobile = window.innerWidth <= 600;

            // On mobile, temporarily set all to 'wide' for clean single-column layout
            if (isMobile) {
                p.layoutList.forEach(item => item.col = 'wide');
            }

            const idx = p.layoutList.findIndex(x => x.id === id);
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (idx >= 0 && swapIdx >= 0 && swapIdx < p.layoutList.length) {
                [p.layoutList[idx], p.layoutList[swapIdx]] = [p.layoutList[swapIdx], p.layoutList[idx]];
            }

            saveSectionPrefs(p);
            applySectionPreferences();
        }

        controls.querySelector('.section-move-up').addEventListener('click', () => mobileMove('up'));
        controls.querySelector('.section-move-down').addEventListener('click', () => mobileMove('down'));

        // Width toggle
        controls.querySelector('.section-width-btn').addEventListener('click', () => {
            const p = loadSectionPrefs();
            const item = p.layoutList.find(x => x.id === id);
            if (!item) return;
            if (item.col === 'wide') {
                item.col = 'left';
            } else {
                item.col = 'wide';
            }
            saveSectionPrefs(p);
            applySectionPreferences();
        });

        // Minimize/hide
        controls.querySelector('.section-min-btn').addEventListener('click', () => {
            const p = loadSectionPrefs();
            if (el.classList.contains('section-minimized')) {
                el.style.display = 'none';
                p.minimized = p.minimized.filter(x => x !== id);
                if (!p.hidden.includes(id)) p.hidden.push(id);
                saveSectionPrefs(p);
                renderHiddenSectionsBar();
            } else {
                el.classList.add('section-minimized');
                if (!p.minimized.includes(id)) p.minimized.push(id);
                saveSectionPrefs(p);
                controls.querySelector('.section-min-btn').textContent = '✕';
                controls.querySelector('.section-min-btn').title = t('removeSection');
            }
        });

        // Click minimized section to expand — only add listener once
        if (!el._expandListenerAdded) {
            el._expandListenerAdded = true;
            el.addEventListener('click', (e) => {
                if (!el.classList.contains('section-minimized')) return;
                if (e.target.closest('.section-controls')) return;
                const p = loadSectionPrefs();
                el.classList.remove('section-minimized');
                p.minimized = p.minimized.filter(x => x !== id);
                saveSectionPrefs(p);
                const btn = el.querySelector('.section-min-btn');
                if (btn) { btn.textContent = '−'; btn.title = t('minimizeSection'); }
            });
        }
    }
}

function renderHiddenSectionsBar() {
    let bar = document.getElementById('hidden-sections-bar');
    const prefs = loadSectionPrefs();

    if (prefs.hidden.length === 0) {
        if (bar) bar.remove();
        return;
    }

    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'hidden-sections-bar';
        const summary = document.getElementById('weather-summary');
        if (summary) summary.parentNode.insertBefore(bar, summary.nextSibling);
    }

    bar.innerHTML = prefs.hidden.map(id =>
        `<button class="show-section-btn" data-id="${id}">${t('showSectionPrefix', { name: sectionName(id) })}</button>`
    ).join(' ');

    bar.querySelectorAll('.show-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const p = loadSectionPrefs();
            p.hidden = p.hidden.filter(h => h !== id);
            saveSectionPrefs(p);
            const el = document.getElementById(id);
            if (el) {
                el.style.display = '';
                el.classList.remove('section-minimized');
            }
            applySectionPreferences();
        });
    });

    // Respect settings — hide the bar if user turned off section buttons
    if (typeof applySettings === 'function') applySettings();
}

// --- Drag-to-Reorder ---------------------------------------------------------

function initSectionDrag() {
    const container = document.getElementById('weather-content');
    if (!container) return;

    let dragEl = null;
    let placeholder = null;
    let offsetY = 0;
    let offsetX = 0;
    let dragActive = false;

    container.addEventListener('pointerdown', (e) => {
        const handle = e.target.closest('.section-drag-handle');
        if (!handle || document.body.classList.contains('layout-locked')) return;

        dragEl = handle.closest('section');
        if (!dragEl || !DEFAULT_SECTION_ORDER.includes(dragEl.id)) return;

        e.preventDefault();
        handle.setPointerCapture(e.pointerId);

        const rect = dragEl.getBoundingClientRect();
        offsetY = e.clientY - rect.top;
        offsetX = e.clientX - rect.left;

        placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = rect.height + 'px';
        dragEl.parentNode.insertBefore(placeholder, dragEl);

        dragEl.classList.add('section-dragging');
        dragEl.style.position = 'fixed';
        dragEl.style.top = (e.clientY - offsetY) + 'px';
        dragEl.style.left = (e.clientX - offsetX) + 'px';
        dragEl.style.width = rect.width + 'px';
        dragEl.style.zIndex = '999';
        dragActive = true;
        document.body.classList.add('is-dragging');
    });

    container.addEventListener('pointermove', (e) => {
        if (!dragActive || !dragEl) return;
        e.preventDefault();

        dragEl.style.top = (e.clientY - offsetY) + 'px';
        dragEl.style.left = (e.clientX - offsetX) + 'px';

        // Find the nearest column to the cursor
        const cols = [...container.querySelectorAll('.weather-col')];
        let targetCol = null;
        let minDist = Infinity;
        for (const col of cols) {
            const r = col.getBoundingClientRect();
            // Distance: 0 if inside, otherwise distance to nearest edge
            const dx = e.clientX < r.left ? r.left - e.clientX : e.clientX > r.right ? e.clientX - r.right : 0;
            const dy = e.clientY < r.top ? r.top - e.clientY : e.clientY > r.bottom ? e.clientY - r.bottom : 0;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                targetCol = col;
            }
        }

        if (targetCol && minDist < 200) {
            if (placeholder.parentNode !== targetCol) targetCol.appendChild(placeholder);
            const siblings = [...targetCol.querySelectorAll('section:not(.section-dragging)')];
            let inserted = false;
            for (const sib of siblings) {
                const r = sib.getBoundingClientRect();
                if (e.clientY < r.top + r.height / 2) {
                    targetCol.insertBefore(placeholder, sib);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) targetCol.appendChild(placeholder);
        }
    });

    const endDrag = () => {
        if (!dragActive || !dragEl) return;

        placeholder.parentNode.insertBefore(dragEl, placeholder);
        placeholder.remove();

        dragEl.classList.remove('section-dragging');
        dragEl.style.position = '';
        dragEl.style.top = '';
        dragEl.style.left = '';
        dragEl.style.width = '';
        dragEl.style.zIndex = '';

        saveLayoutFromDOM();

        dragEl = null;
        placeholder = null;
        dragActive = false;
        document.body.classList.remove('is-dragging');
    };

    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
}

function applyChartOrder(chartOrder) {
    requestAnimationFrame(() => {
        const scroll = document.querySelector('.forecast-scroll');
        if (!scroll) return;
        const prefs = loadSectionPrefs();
        const footer = scroll.querySelector('.forecast-footer');

        for (const chartId of chartOrder) {
            const row = scroll.querySelector(`[data-chart-id="${chartId}"]`);
            if (row && footer) {
                scroll.insertBefore(row, footer);
                // Apply hidden state
                if (prefs.hiddenCharts.includes(chartId)) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            }
        }

        // Add click handlers for chart hide buttons
        scroll.querySelectorAll('.chart-min-btn').forEach(btn => {
            btn.onclick = () => {
                const chartId = btn.dataset.chartId;
                const p = loadSectionPrefs();
                if (!p.hiddenCharts.includes(chartId)) p.hiddenCharts.push(chartId);
                saveSectionPrefs(p);
                const row = btn.closest('.chart-row');
                if (row) row.style.display = 'none';
                renderHiddenChartsBar();
            };
        });

        renderHiddenChartsBar();
    });
}

function chartName(id) {
    const keyMap = {
        'chart-temp': 'chartTemperature',
        'chart-atmos': 'chartCloudCover',
        'chart-precip': 'chartPrecipChance',
        'chart-wind': 'chartWindSpeed'
    };
    return t(keyMap[id] || id);
}

function renderHiddenChartsBar() {
    const section = document.getElementById('daily-section');
    if (!section) return;
    let bar = document.getElementById('hidden-charts-bar');
    const prefs = loadSectionPrefs();

    if (prefs.hiddenCharts.length === 0) {
        if (bar) bar.remove();
        return;
    }

    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'hidden-charts-bar';
        // Insert after the h2
        const h2 = section.querySelector('h2');
        if (h2) h2.parentNode.insertBefore(bar, h2.nextSibling);
        else section.prepend(bar);
    }

    bar.innerHTML = prefs.hiddenCharts.map(id =>
        `<button class="show-section-btn" data-id="${id}">${t('showSectionPrefix', { name: chartName(id) })}</button>`
    ).join(' ');

    bar.querySelectorAll('.show-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const p = loadSectionPrefs();
            p.hiddenCharts = p.hiddenCharts.filter(h => h !== id);
            saveSectionPrefs(p);
            const row = document.querySelector(`[data-chart-id="${id}"]`);
            if (row) row.style.display = '';
            renderHiddenChartsBar();
        });
    });

    // Respect settings — hide the bar if user turned off section buttons
    if (typeof applySettings === 'function') applySettings();
}

function initChartDrag() {
    // Delegate on #daily-section for chart row reordering
    document.addEventListener('pointerdown', (e) => {
        const handle = e.target.closest('.chart-drag-handle');
        if (!handle) return;
        const chartRow = handle.closest('.chart-row');
        const scroll = chartRow ? chartRow.closest('.forecast-scroll') : null;
        if (!chartRow || !scroll) return;

        e.preventDefault();
        handle.setPointerCapture(e.pointerId);

        const rect = chartRow.getBoundingClientRect();
        const scrollRect = scroll.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;

        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = rect.height + 'px';
        scroll.insertBefore(placeholder, chartRow);

        chartRow.classList.add('section-dragging');
        chartRow.style.position = 'fixed';
        chartRow.style.top = (e.clientY - offsetY) + 'px';
        chartRow.style.left = scrollRect.left + 'px';
        chartRow.style.width = scrollRect.width + 'px';
        chartRow.style.zIndex = '999';

        const onMove = (e2) => {
            e2.preventDefault();
            chartRow.style.top = (e2.clientY - offsetY) + 'px';

            const rows = [...scroll.querySelectorAll('.chart-row:not(.section-dragging)')];
            for (const row of rows) {
                const r = row.getBoundingClientRect();
                if (e2.clientY < r.top + r.height / 2) {
                    scroll.insertBefore(placeholder, row);
                    return;
                }
            }
            const footer = scroll.querySelector('.forecast-footer');
            if (footer) scroll.insertBefore(placeholder, footer);
        };

        const onUp = () => {
            scroll.insertBefore(chartRow, placeholder);
            placeholder.remove();

            chartRow.classList.remove('section-dragging');
            chartRow.style.position = '';
            chartRow.style.top = '';
            chartRow.style.left = '';
            chartRow.style.width = '';
            chartRow.style.zIndex = '';

            // Save new chart order
            const newOrder = [...scroll.querySelectorAll('.chart-row')]
                .map(r => r.dataset.chartId)
                .filter(Boolean);
            const prefs = loadSectionPrefs();
            prefs.chartOrder = newOrder;
            saveSectionPrefs(prefs);

            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    });
}

// --- Constants ---------------------------------------------------------------

const WEATHER_ICONS = {
    0: { icon: '☀️', nightIcon: '🌙' },
    1: { icon: '🌤️', nightIcon: '🌙' },
    2: { icon: '⛅', nightIcon: '☁️' },
    3: { icon: '☁️', nightIcon: '☁️' },
    45: { icon: '🌫️', nightIcon: '🌫️' },
    48: { icon: '🌫️', nightIcon: '🌫️' },
    51: { icon: '🌦️', nightIcon: '🌧️' },
    53: { icon: '🌦️', nightIcon: '🌧️' },
    55: { icon: '🌦️', nightIcon: '🌧️' },
    61: { icon: '🌧️', nightIcon: '🌧️' },
    63: { icon: '🌧️', nightIcon: '🌧️' },
    65: { icon: '🌧️', nightIcon: '🌧️' },
    71: { icon: '🌨️', nightIcon: '🌨️' },
    73: { icon: '🌨️', nightIcon: '🌨️' },
    75: { icon: '🌨️', nightIcon: '🌨️' },
    77: { icon: '🌨️', nightIcon: '🌨️' },
    80: { icon: '🌦️', nightIcon: '🌧️' },
    81: { icon: '🌦️', nightIcon: '🌧️' },
    82: { icon: '🌦️', nightIcon: '🌧️' },
    85: { icon: '🌨️', nightIcon: '🌨️' },
    86: { icon: '🌨️', nightIcon: '🌨️' },
    95: { icon: '⛈️', nightIcon: '⛈️' },
    96: { icon: '⛈️', nightIcon: '⛈️' },
    99: { icon: '⛈️', nightIcon: '⛈️' }
};

// --- DOM Refs ----------------------------------------------------------------

const homeView = document.getElementById('home-view');
const weatherView = document.getElementById('weather-view');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchError = document.getElementById('search-error');
const locationName = document.getElementById('location-name');
const backBtn = document.getElementById('back-btn');

// --- Style (visual variant — orthogonal to light/dark theme) -----------------

const SUPPORTED_STYLES = ['default', 'editorial', 'bulletin', 'quiet'];

function getCurrentStyle() {
    const stored = localStorage.getItem('style');
    return SUPPORTED_STYLES.includes(stored) ? stored : 'default';
}

function applyStyle(style) {
    if (!SUPPORTED_STYLES.includes(style)) style = 'default';
    if (style === 'default') {
        document.documentElement.removeAttribute('data-style');
    } else {
        document.documentElement.setAttribute('data-style', style);
    }
    // Web fonts are self-hosted via @font-face in style.css.
    // Browsers fetch them only when a selector references them, so they
    // load lazily based on the active style — no JS needed.

    // Sync the dropdown
    const sel = document.getElementById('setting-style');
    if (sel) sel.value = style;
}

// --- i18n --------------------------------------------------------------------

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const attr = el.dataset.i18nAttr;
        const text = t(key);
        // t() returns the key itself when it's unknown — which happens when a
        // cached older i18n.js is paired with newer HTML (Google's renderer
        // caches JS for weeks). The baked-in text is always correct English,
        // so keep it rather than stamping the raw key over it.
        if (text === key) return;
        if (attr) el.setAttribute(attr, text);
        else el.textContent = text;
    });
    // Secondary aria-label translation — used on elements that already have
    // data-i18n driving textContent (or another attribute) but also need a
    // translated aria-label.
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const label = t(el.dataset.i18nAriaLabel);
        if (label !== el.dataset.i18nAriaLabel) el.setAttribute('aria-label', label);
    });
    const lang = getCurrentLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const disclaimer = document.getElementById('i18n-disclaimer');
    if (disclaimer) disclaimer.hidden = lang === 'en';
}

// --- Utility Functions -------------------------------------------------------

function weatherInfo(code, isNight) {
    const icons = WEATHER_ICONS[code] || { icon: '❓', nightIcon: '❓' };
    const key = `wc${code}`;
    const translated = t(key);
    const text = translated !== key ? translated : t('wcUnknown');
    return { text, icon: isNight ? icons.nightIcon : icons.icon };
}

function windDirection(degrees) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(degrees / 45) % 8];
}

function lonToTile(lon, zoom) {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

function latToTile(lat, zoom) {
    return Math.floor(
        (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) /
            2 *
            Math.pow(2, zoom)
    );
}

function getMoonPhase(date) {
    const knownNew = new Date(2000, 0, 6, 18, 14);
    const synodicMonth = 29.53058867;
    const diff = (date - knownNew) / (1000 * 60 * 60 * 24);
    const phase = ((diff % synodicMonth) + synodicMonth) % synodicMonth;
    const phaseFraction = phase / synodicMonth;

    let name, icon;
    if (phaseFraction < 0.0625) { name = t('moonPhaseNewMoon'); icon = '🌑'; }
    else if (phaseFraction < 0.1875) { name = t('moonPhaseWaxingCrescent'); icon = '🌒'; }
    else if (phaseFraction < 0.3125) { name = t('moonPhaseFirstQuarter'); icon = '🌓'; }
    else if (phaseFraction < 0.4375) { name = t('moonPhaseWaxingGibbous'); icon = '🌔'; }
    else if (phaseFraction < 0.5625) { name = t('moonPhaseFullMoon'); icon = '🌕'; }
    else if (phaseFraction < 0.6875) { name = t('moonPhaseWaningGibbous'); icon = '🌖'; }
    else if (phaseFraction < 0.8125) { name = t('moonPhaseLastQuarter'); icon = '🌗'; }
    else if (phaseFraction < 0.9375) { name = t('moonPhaseWaningCrescent'); icon = '🌘'; }
    else { name = t('moonPhaseNewMoon'); icon = '🌑'; }

    return { name, icon };
}

// Don't colorize the 10-day forecast when the day-to-day temperature range
// is small. Unit-aware: the same physical range is a smaller number in
// Celsius (5°F ≈ 2.8°C), so a fixed threshold would behave differently
// between unit systems.
function tempColorThreshold() { return isImperial() ? 5 : 3; }

// Settings that default to FALSE when not explicitly set. Everything else defaults to true.
const SETTINGS_DEFAULT_FALSE = new Set(['autoPlayRadar', 'autoLocate', 'alertsMinimized']);

function getSettingsBool(key) {
    const v = localStorage.getItem(key);
    if (v === null) return !SETTINGS_DEFAULT_FALSE.has(key);
    return v === 'true';
}

function tempBackground(avg, minAvg, avgRange) {
    if (!getSettingsBool('showForecastColors')) return 'transparent';
    if (avgRange < tempColorThreshold()) return 'transparent';
    const t = (avg - minAvg) / avgRange;
    if (isDarkMode()) {
        const r = Math.round(20 + t * 40);
        const g = Math.round(50 - t * 15);
        const b = Math.round(50 - t * 35);
        return `rgb(${r}, ${g}, ${b})`;
    }
    const r = Math.round(214 + t * 39);
    const g = Math.round(228 - t * 14);
    const b = Math.round(253 - t * 39);
    return `rgb(${r}, ${g}, ${b})`;
}

function updateDayBackgrounds() {
    const avgTemps = window._forecastAvgTemps;
    if (!avgTemps) return;
    const minAvg = Math.min(...avgTemps);
    const avgRange = (Math.max(...avgTemps) - minAvg) || 1;
    document.querySelectorAll('.forecast-day').forEach((el, i) => {
        if (i < avgTemps.length) {
            el.style.background = tempBackground(avgTemps[i], minAvg, avgRange);
        }
    });
}

// --- API Functions -----------------------------------------------------------

async function geocodeFetch(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    return res.json();
}

// Postal code patterns by country (Zippopotam supports 60+ countries)
const POSTAL_PATTERNS = [
    // 5-digit countries (most common — picker shown if ambiguous)
    { regex: /^(\d{5})$/, country: 'us', name: 'United States' },
    { regex: /^(\d{5})$/, country: 'de', name: 'Germany' },
    { regex: /^(\d{5})$/, country: 'fr', name: 'France' },
    { regex: /^(\d{5})$/, country: 'es', name: 'Spain' },
    { regex: /^(\d{5})$/, country: 'it', name: 'Italy' },
    { regex: /^(\d{5})$/, country: 'mx', name: 'Mexico' },
    { regex: /^(\d{5})$/, country: 'fi', name: 'Finland' },
    { regex: /^(\d{5})$/, country: 'se', name: 'Sweden' },
    { regex: /^(\d{5})$/, country: 'hr', name: 'Croatia' },
    { regex: /^(\d{5})$/, country: 'tr', name: 'Turkey' },
    { regex: /^(\d{5})$/, country: 'pk', name: 'Pakistan' },
    { regex: /^(\d{5})$/, country: 'my', name: 'Malaysia' },
    { regex: /^(\d{5})$/, country: 'th', name: 'Thailand' },
    { regex: /^(\d{5})$/, country: 'gt', name: 'Guatemala' },
    { regex: /^(\d{5})$/, country: 'lt', name: 'Lithuania' },
    { regex: /^(\d{5})$/, country: 'do', name: 'Dominican Republic' },
    { regex: /^(\d{5})$/, country: 'mc', name: 'Monaco' },
    { regex: /^(\d{5})$/, country: 'sm', name: 'San Marino' },
    // 4-digit countries
    { regex: /^(\d{4})$/, country: 'au', name: 'Australia' },
    { regex: /^(\d{4})$/, country: 'nz', name: 'New Zealand' },
    { regex: /^(\d{4})$/, country: 'za', name: 'South Africa' },
    { regex: /^(\d{4})$/, country: 'at', name: 'Austria' },
    { regex: /^(\d{4})$/, country: 'be', name: 'Belgium' },
    { regex: /^(\d{4})$/, country: 'ch', name: 'Switzerland' },
    { regex: /^(\d{4})$/, country: 'dk', name: 'Denmark' },
    { regex: /^(\d{4})$/, country: 'no', name: 'Norway' },
    { regex: /^(\d{4})$/, country: 'bg', name: 'Bulgaria' },
    { regex: /^(\d{4})$/, country: 'hu', name: 'Hungary' },
    { regex: /^(\d{4})$/, country: 'si', name: 'Slovenia' },
    { regex: /^(\d{4})$/, country: 'li', name: 'Liechtenstein' },
    { regex: /^(\d{4})$/, country: 'mk', name: 'North Macedonia' },
    { regex: /^(\d{4})$/, country: 'bd', name: 'Bangladesh' },
    { regex: /^(\d{4})$/, country: 'ph', name: 'Philippines' },
    { regex: /^(\d{4})$/, country: 'gl', name: 'Greenland' },
    // 6-digit countries
    { regex: /^(\d{6})$/, country: 'in', name: 'India' },
    { regex: /^(\d{6})$/, country: 'ru', name: 'Russia' },
    // 3-digit countries
    { regex: /^(\d{3})$/, country: 'is', name: 'Iceland' },
    { regex: /^(\d{3})$/, country: 'fo', name: 'Faroe Islands' },
    // Unique formats
    { regex: /^([A-Z]\d[A-Z]\s?\d[A-Z]\d)$/i, country: 'ca', name: 'Canada' },       // K1A 0B1
    { regex: /^([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i, country: 'gb', name: 'United Kingdom' }, // SW1A 1AA
    { regex: /^(\d{4}\s?[A-Z]{2})$/i, country: 'nl', name: 'Netherlands' },           // 1012 AB
    { regex: /^(\d{5}-\d{3})$/, country: 'br', name: 'Brazil' },                      // 01001-000
    { regex: /^(\d{3}-\d{4})$/, country: 'jp', name: 'Japan' },                       // 100-0001
    { regex: /^(\d{2}-\d{3})$/, country: 'pl', name: 'Poland' },                      // 00-001
    { regex: /^(\d{4}-\d{3})$/, country: 'pt', name: 'Portugal' },                    // 1000-001
    { regex: /^(\d{3}\s?\d{2})$/, country: 'cz', name: 'Czech Republic' },            // 100 00
    { regex: /^(AD\d{3})$/i, country: 'ad', name: 'Andorra' },                        // AD100
    { regex: /^([A-Z]\d[\dW]\s?[A-Z\d]{4})$/i, country: 'ie', name: 'Ireland' },     // V94 X293
    // Channel Islands / Crown Dependencies (UK-style short codes)
    { regex: /^(GY\d{1,2})$/i, country: 'gg', name: 'Guernsey' },                    // GY1
    { regex: /^(JE\d{1,2})$/i, country: 'je', name: 'Jersey' },                      // JE1
    { regex: /^(IM\d{1,2})$/i, country: 'im', name: 'Isle of Man' },                  // IM1
];

// Irish Eircode routing keys → city names (for geocoding fallback since Zippopotam doesn't support Ireland)
const EIRCODE_ROUTING = {
    A41:'Letterkenny',A42:'Donegal',A45:'Kells',A63:'Navan',A67:'Navan',A75:'Drogheda',
    A81:'Drogheda',A82:'Dundalk',A83:'Dundalk',A84:'Dundalk',A85:'Dundalk',A86:'Dundalk',
    A91:'Galway',A92:'Drogheda',A94:'Blackrock',A96:'Glenageary',A98:'Bray',
    C15:'Maynooth',D01:'Dublin 1',D02:'Dublin 2',D03:'Dublin 3',D04:'Dublin 4',
    D05:'Dublin 5',D06:'Dublin 6',D06W:'Dublin 6W',D07:'Dublin 7',D08:'Dublin 8',
    D09:'Dublin 9',D10:'Dublin 10',D11:'Dublin 11',D12:'Dublin 12',D13:'Dublin 13',
    D14:'Dublin 14',D15:'Dublin 15',D16:'Dublin 16',D17:'Dublin 17',D18:'Dublin 18',
    D20:'Dublin 20',D22:'Dublin 22',D24:'Dublin 24',E21:'Roscrea',E25:'Thurles',
    E32:'Tipperary',E34:'Cashel',E41:'Portlaoise',E45:'Nenagh',E53:'Birr',
    E91:'Carlow',F12:'Castlebar',F23:'Westport',F26:'Ballina',F28:'Claremorris',
    F31:'Roscommon',F35:'Longford',F42:'Athlone',F45:'Ballinasloe',F52:'Tuam',
    F56:'Clifden',F91:'Galway',F92:'Galway',F93:'Loughrea',F94:'Donegal',
    H12:'Mullingar',H14:'Cavan',H16:'Virginia',H18:'Oldcastle',H23:'Carrickmacross',
    H53:'Monaghan',H54:'Clones',H62:'Edenderry',H65:'Tullamore',H71:'Moate',
    H91:'Galway',K32:'Swords',K34:'Skerries',K36:'Celbridge',K45:'Naas',
    K56:'Athy',K67:'Newbridge',K78:'Kildare',N37:'Athlone',N39:'Moate',
    N41:'Castlepollard',N91:'Longford',P12:'Cork',P14:'Cork',P17:'Cobh',
    P24:'Youghal',P25:'Fermoy',P31:'Cork',P32:'Midleton',P36:'Macroom',
    P43:'Mallow',P47:'Kanturk',P51:'Cork',P56:'Bandon',P61:'Kinsale',
    P67:'Bantry',P72:'Clonakilty',P75:'Skibbereen',P81:'Dunmanway',P85:'Millstreet',
    R14:'Gorey',R21:'Arklow',R32:'Enniscorthy',R35:'Dungarvan',R42:'Wexford',
    R45:'Waterford',R51:'Kilkenny',R56:'New Ross',R65:'Waterford',R93:'Carlow',
    R95:'Kilkenny',T12:'Cork',T23:'Cork',T34:'Mitchelstown',T45:'Charleville',
    T56:'Cahir',V14:'Killorglin',V15:'Tralee',V23:'Tralee',V31:'Killarney',
    V35:'Kenmare',V42:'Newcastle West',V92:'Limerick',V93:'Limerick',V94:'Limerick',
    V95:'Adare',W12:'Wicklow',W23:'Baltinglass',W34:'Blessington',W91:'Clonmel',
    X35:'Dungarvan',X42:'Waterford',X91:'Waterford',Y14:'Enniscorthy',Y21:'Arklow',
    Y25:'Gorey',Y34:'New Ross',Y35:'Wexford',
};

const ALERTS_PROXY_URL = 'https://alerts-proxy-ssdjubgioq-uc.a.run.app/';

async function geocodePostal(code, countryCode, countryName) {
    // Ireland: Zippopotam doesn't support Eircodes — use routing key lookup + Open-Meteo
    if (countryCode === 'ie') {
        const routingKey = code.trim().replace(/\s/g, '').substring(0, 3).toUpperCase();
        const city = EIRCODE_ROUTING[routingKey];
        if (!city) return null;
        const data = await geocodeFetch(city);
        if (!data.results || data.results.length === 0) return null;
        // Filter for Ireland results
        const irish = data.results.find(r => r.country_code === 'IE' || r.country === 'Ireland');
        const r = irish || data.results[0];
        return {
            name: city,
            region: r.admin1 || '',
            country: 'Ireland',
            lat: r.latitude,
            lon: r.longitude,
        };
    }

    // Some countries need code transformation for Zippopotam
    let lookupCode = code.trim();
    if (countryCode === 'gb') {
        // UK: Zippopotam only accepts outcode (first part, e.g. "OX1" not "OX1 1AB")
        lookupCode = lookupCode.split(/\s+/)[0];
    } else if (countryCode === 'ca') {
        // Canada: Zippopotam only accepts FSA (first 3 chars, e.g. "H4N" not "H4N 2E7")
        lookupCode = lookupCode.replace(/\s/g, '').substring(0, 3);
    } else if (countryCode === 'nl') {
        // NL: Zippopotam only accepts the 4-digit numeric prefix (e.g. "1012 AB" → "1012")
        lookupCode = lookupCode.replace(/\s/g, '').substring(0, 4);
    } else if (countryCode === 'cz') {
        // CZ: Zippopotam expects space-separated format (e.g. "10000" → "100 00")
        lookupCode = lookupCode.replace(/\s/g, '');
        if (lookupCode.length === 5) lookupCode = lookupCode.substring(0, 3) + ' ' + lookupCode.substring(3);
    } else if (countryCode === 'gg' || countryCode === 'je' || countryCode === 'im') {
        // Channel Islands: use just the prefix code as-is
        lookupCode = lookupCode.toUpperCase();
    }

    const res = await fetch(`https://api.zippopotam.us/${countryCode}/${encodeURIComponent(lookupCode)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.places || data.places.length === 0) return null;
    // Pick the best place name — prefer a larger/recognizable city if multiple places returned
    // Use the last place (Zippopotam often puts the main city last) or the one matching the postcode area
    const places = data.places;
    const place = places.length > 1 ? places[places.length - 1] : places[0];
    return {
        name: place['place name'],
        region: place['state abbreviation'] || place['state'] || '',
        country: countryName,
        lat: parseFloat(place.latitude),
        lon: parseFloat(place.longitude),
    };
}

async function geocodeZipInner(code) {
    const trimmed = code.trim();

    // Find all matching country patterns for this postal code
    const matchingPatterns = [];
    for (const p of POSTAL_PATTERNS) {
        if (p.regex.test(trimmed)) {
            matchingPatterns.push(p);
        }
    }

    if (matchingPatterns.length === 0) return null;

    // If only one country matches the format, just try it
    if (matchingPatterns.length === 1) {
        return await geocodePostal(trimmed, matchingPatterns[0].country, matchingPatterns[0].name);
    }

    // Multiple countries match — fetch all in parallel and show picker
    const results = await Promise.all(
        matchingPatterns.map(p => geocodePostal(trimmed, p.country, p.name))
    );
    const validResults = results.filter(r => r !== null);

    if (validResults.length === 0) return null;
    if (validResults.length === 1) return validResults[0];

    // Multiple valid results — show picker
    return showLocationPicker(validResults);
}

async function geocodeZip(query) {
    const trimmed = query.trim();

    // Check if user prefixed with country code, e.g. "DE 10115" or "UK SW1A 1AA"
    const prefixMatch = trimmed.match(/^([A-Z]{2})\s+(.+)$/i);
    if (prefixMatch) {
        const cc = prefixMatch[1].toLowerCase();
        const code = prefixMatch[2];
        const pattern = POSTAL_PATTERNS.find(p => p.country === cc);
        if (pattern) {
            const result = await geocodePostal(code, cc, pattern.name);
            if (result) return result;
        }
        // Prefix might be a province/state code (e.g. "QC H4N 2E7") — try the rest as a postal code
        const restResult = await geocodeZipInner(code);
        if (restResult) return restResult;
    }

    return await geocodeZipInner(trimmed);
}

async function geocode(query) {
    // Check if input looks like a postal code
    const postal = await geocodeZip(query);
    if (postal) return postal;

    // Parse city and region filter from input
    // Supports: "Austin, TX", "Austin,TX", "Austin TX", "Austin"
    let searchName, filterRegion;

    if (query.includes(',')) {
        const parts = query.split(',').map(s => s.trim());
        searchName = parts[0];
        filterRegion = parts[1] || '';
    } else {
        // Try splitting on last space: "Austin TX" -> search "Austin", filter "TX"
        const words = query.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        // If last word looks like a state abbreviation (2 letters) or short state name
        if (words.length >= 2 && (lastWord.length <= 3 || STATE_ABBRS[lastWord.toLowerCase()])) {
            searchName = words.slice(0, -1).join(' ');
            filterRegion = lastWord;
        } else {
            searchName = query;
            filterRegion = '';
        }
    }

    // Try searching with the parsed city name
    let data = await geocodeFetch(searchName);

    // If no results and we split on space, try the full query as-is
    if ((!data.results || data.results.length === 0) && filterRegion) {
        data = await geocodeFetch(query);
        filterRegion = ''; // Don't filter since we searched the full string
    }

    if (!data.results || data.results.length === 0) {
        throw new Error(t('locationNotFound'));
    }

    let results = data.results.map(r => ({
        name: r.name,
        region: r.admin1 || '',
        country: r.country || '',
        lat: r.latitude,
        lon: r.longitude,
    }));

    // Filter by region if provided
    if (filterRegion) {
        const filter = filterRegion.toLowerCase();
        const filtered = results.filter(r => {
            const region = r.region.toLowerCase();
            const country = r.country.toLowerCase();
            return region.startsWith(filter) || region.includes(filter)
                || country.startsWith(filter) || country.includes(filter)
                || matchesStateAbbr(filter, region);
        });
        if (filtered.length > 0) results = filtered;
    }

    // If only one result or user already filtered, return it
    if (results.length === 1 || filterRegion) {
        return results[0];
    }

    // Multiple results — show picker
    return showLocationPicker(results);
}

const STATE_ABBRS = {
    al:'alabama',ak:'alaska',az:'arizona',ar:'arkansas',ca:'california',
    co:'colorado',ct:'connecticut',de:'delaware',fl:'florida',ga:'georgia',
    hi:'hawaii',id:'idaho',il:'illinois',in:'indiana',ia:'iowa',ks:'kansas',
    ky:'kentucky',la:'louisiana',me:'maine',md:'maryland',ma:'massachusetts',
    mi:'michigan',mn:'minnesota',ms:'mississippi',mo:'missouri',mt:'montana',
    ne:'nebraska',nv:'nevada',nh:'new hampshire',nj:'new jersey',nm:'new mexico',
    ny:'new york',nc:'north carolina',nd:'north dakota',oh:'ohio',ok:'oklahoma',
    or:'oregon',pa:'pennsylvania',ri:'rhode island',sc:'south carolina',
    sd:'south dakota',tn:'tennessee',tx:'texas',ut:'utah',vt:'vermont',
    va:'virginia',wa:'washington',wv:'west virginia',wi:'wisconsin',wy:'wyoming',
};

function matchesStateAbbr(abbr, fullName) {
    const expanded = STATE_ABBRS[abbr.toLowerCase()];
    return expanded && fullName.toLowerCase().includes(expanded);
}

function showLocationPicker(results) {
    // Reset search button while picker is shown
    const btn = document.querySelector('#search-form button[type="submit"]');
    if (btn) { btn.disabled = false; btn.textContent = t('searchButton'); }

    return new Promise((resolve) => {
        const container = document.getElementById('search-error');
        container.hidden = false;
        container.style.color = '#1a1a1a';

        let html = `<div style="margin-top:0.5rem;">${t('didYouMean')}</div>`;
        html += '<div style="display:flex;flex-direction:column;gap:0.25rem;margin-top:0.5rem;">';
        results.forEach((r, i) => {
            html += `<button class="location-pick" data-idx="${i}" style="
                text-align:left;padding:0.5rem 0.75rem;background:var(--card-bg);color:var(--text);
                border:1px solid var(--border);border-radius:6px;cursor:pointer;
                font-size:0.9rem;transition:background 0.15s;
            ">${escapeHtml(r.name)}, ${escapeHtml(r.region)}, ${escapeHtml(r.country)}</button>`;
        });
        html += '</div>';
        container.innerHTML = html;

        container.addEventListener('click', function handler(e) {
            const btn = e.target.closest('.location-pick');
            if (!btn) return;
            container.removeEventListener('click', handler);
            container.hidden = true;
            container.innerHTML = '';
            container.style.color = '';
            resolve(results[parseInt(btn.dataset.idx)]);
        });
    });
}

async function fetchOpenMeteo(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,apparent_temperature,dew_point_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
        hourly: 'temperature_2m,apparent_temperature,dew_point_2m,relative_humidity_2m,weather_code,cloud_cover,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
        temperature_unit: units.temp,
        wind_speed_unit: units.wind,
        precipitation_unit: units.precip,
        pressure_unit: units.pressure,
        timezone: 'auto',
        forecast_days: 10,
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error('Weather data request failed');
    return res.json();
}

async function fetchAirQuality(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'us_aqi,grass_pollen,birch_pollen,ragweed_pollen,alder_pollen,olive_pollen,mugwort_pollen',
        });
        const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
        if (!res.ok) return null;
        return (await res.json()).current;
    } catch {
        return null;
    }
}

function aqiLabel(aqi) {
    if (aqi <= 50) return { text: t('aqiGood'), color: '#16a34a' };
    if (aqi <= 100) return { text: t('aqiModerate'), color: '#ca8a04' };
    if (aqi <= 150) return { text: t('aqiUnhealthyForSensitive'), color: '#ea580c' };
    if (aqi <= 200) return { text: t('aqiUnhealthy'), color: '#dc2626' };
    if (aqi <= 300) return { text: t('aqiVeryUnhealthy'), color: '#7c3aed' };
    return { text: t('aqiHazardous'), color: '#7f1d1d' };
}

function pollenSummary(aq) {
    if (!aq) return null;
    const types = [
        { name: 'Grass', val: aq.grass_pollen },
        { name: 'Birch', val: aq.birch_pollen },
        { name: 'Ragweed', val: aq.ragweed_pollen },
        { name: 'Alder', val: aq.alder_pollen },
        { name: 'Olive', val: aq.olive_pollen },
        { name: 'Mugwort', val: aq.mugwort_pollen },
    ].filter(t => t.val !== null && t.val !== undefined);
    if (types.length === 0) return null;

    function level(v) {
        if (v <= 10) return t('pollenLow');
        if (v <= 50) return t('pollenMedium');
        if (v <= 100) return t('pollenHigh');
        return t('pollenVeryHigh');
    }
    function levelColor(v) {
        if (v <= 10) return '#16a34a';
        if (v <= 50) return '#ca8a04';
        if (v <= 100) return '#ea580c';
        return '#dc2626';
    }

    return types.map(t => ({
        name: t.name,
        level: level(t.val),
        color: levelColor(t.val),
        value: Math.round(t.val),
    }));
}

async function fetchNWSAlerts(lat, lon) {
    try {
        const res = await fetch(
            `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
            { headers: { 'User-Agent': 'NoAdsWeather (noadsweather.com)' } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.features || [];
    } catch {
        return [];
    }
}

async function fetchProxyAlerts(lat, lon, country, region) {
    try {
        const res = await fetch(ALERTS_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon })
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.features || [];
    } catch {
        return [];
    }
}

async function fetchAlerts(lat, lon, country, region) {
    if (country === 'United States') return fetchNWSAlerts(lat, lon);
    return fetchProxyAlerts(lat, lon, country, region);
}

// --- Render Functions --------------------------------------------------------

function generateSummary(current, hourly, daily) {
    const now = new Date();
    const currentTemp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);

    // --- Thresholds (imperial/metric) ---
    const freezing = isImperial() ? 32 : 0;
    const cold = isImperial() ? 50 : 10;
    const cool = isImperial() ? 65 : 18;
    const warm = isImperial() ? 80 : 27;
    const hot = isImperial() ? 95 : 35;

    // --- Temp adjective ---
    const tempAdjKey = currentTemp <= freezing ? 'sumTempFreezing'
                     : currentTemp <= cold ? 'sumTempCold'
                     : currentTemp <= cool ? 'sumTempCool'
                     : currentTemp <= warm ? 'sumTempMild'
                     : currentTemp <= hot ? 'sumTempWarm'
                     : 'sumTempHot';
    const tempAdj = t(tempAdjKey);

    const feelsLikeSuffix = Math.abs(feelsLike - currentTemp) >= 5
        ? t('sumFeelsLikeSuffix', { feelsLike, unit: tempUnit() })
        : '';

    // --- Rain detection over the next 24 hours (preserved verbatim from original) ---
    const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
    let rainStartHour = null;
    let rainEndHour = null;

    if (startIdx !== -1) {
        for (let i = startIdx; i < startIdx + 24 && i < hourly.time.length; i++) {
            const prob = hourly.precipitation_probability[i];
            if (!rainStartHour && prob >= 40) {
                rainStartHour = new Date(hourly.time[i]);
            }
            if (rainStartHour && !rainEndHour && prob < 30) {
                rainEndHour = new Date(hourly.time[i]);
            }
        }
    }

    const hoursUntil = rainStartHour ? (rainStartHour - now) / (1000 * 60 * 60) : null;
    const isSnow = (code) => code >= 71 && code <= 77 || code === 85 || code === 86;

    // --- Condition clause ---
    const code = current.weather_code;
    const todayPrecip = daily.precipitation_sum[0];
    let conditionClause;

    if (code >= 51 && code <= 99) {
        if (code >= 95) {
            conditionClause = t('sumConditionThunderstorms');
        } else if (isSnow(code)) {
            conditionClause = t('sumConditionSnowing');
        } else if (rainEndHour && todayPrecip > 0) {
            conditionClause = t('sumConditionRainingWithAmountClearingBy', { amount: fmtPrecip(todayPrecip), hour: fmtHour(rainEndHour) });
        } else if (todayPrecip > 0) {
            conditionClause = t('sumConditionRainingWithAmount', { amount: fmtPrecip(todayPrecip) });
        } else {
            conditionClause = t('sumConditionRaining');
        }
    } else if (rainStartHour) {
        if (hoursUntil <= 1) conditionClause = t('sumConditionRainSoon');
        else conditionClause = t('sumConditionRainLikelyAround', { hour: fmtHour(rainStartHour) });
    } else {
        const cloudCover = current.cloud_cover;
        conditionClause = cloudCover < 30 ? t('sumConditionClearSkies') : t('sumConditionCloudy');
    }

    const opening = t('sumOpeningTemplate', {
        tempAdj,
        temp: currentTemp,
        unit: tempUnit(),
        feelsLikeSuffix,
        conditionClause
    });

    // --- Follow-up sentences ---
    const todayHigh = Math.round(daily.temperature_2m_max[0]);
    const follow = [t('sumTodayHigh', { high: todayHigh, unit: tempUnit() })];

    const tomorrowHigh = daily.time.length > 1 ? Math.round(daily.temperature_2m_max[1]) : null;
    const tomorrowCode = daily.time.length > 1 ? daily.weather_code[1] : 0;
    const tomorrowPrecip = daily.time.length > 1 ? daily.precipitation_sum[1] : 0;
    const tomorrowRain = tomorrowCode >= 51 && tomorrowCode <= 99 && !isSnow(tomorrowCode);
    const tomorrowSnow = isSnow(tomorrowCode);

    if (tomorrowSnow && tomorrowPrecip > 0) {
        follow.push(t('sumTomorrowSnowWithAmount', { amount: fmtPrecip(tomorrowPrecip) }));
    } else if (tomorrowRain && tomorrowPrecip > 0) {
        follow.push(t('sumTomorrowRainWithAmount', { amount: fmtPrecip(tomorrowPrecip) }));
    } else if (tomorrowRain) {
        follow.push(t('sumTomorrowRainNoAmount'));
    } else if (tomorrowHigh !== null && tomorrowHigh - todayHigh >= 8) {
        follow.push(t('sumTomorrowWarming', { high: tomorrowHigh, unit: tempUnit() }));
    } else if (tomorrowHigh !== null && todayHigh - tomorrowHigh >= 8) {
        follow.push(t('sumTomorrowCooling', { high: tomorrowHigh, unit: tempUnit() }));
    }

    return opening + '. ' + follow.join('. ') + '.';
}

function fmtHour(date) {
    if (units.time24h) {
        return date.getHours().toString().padStart(2, '0') + ':00';
    }
    const h = date.getHours();
    if (h === 0) return '12am';
    if (h < 12) return h + 'am';
    if (h === 12) return '12pm';
    return (h - 12) + 'pm';
}

function renderCurrent(current, airQuality) {
    const info = weatherInfo(current.weather_code, isNightTime());
    const section = document.getElementById('current-section');
    const uvVal = Math.round(current.uv_index);
    const aqi = airQuality ? airQuality.us_aqi : null;
    const aqiInfo = aqi !== null ? aqiLabel(aqi) : null;

    section.innerHTML = `
        <h2>${t('currentConditions')}</h2>
        <div class="current-main">
            <div class="current-icon-block">
                <div class="icon">${info.icon}</div>
                <div class="condition">${info.text}</div>
            </div>
            <div class="current-temp-block">
                <div class="temp">${Math.round(current.temperature_2m)}${tempUnit()}</div>
                <div class="feels-like">${t('feelsLike')} ${Math.round(current.apparent_temperature)}${tempUnit()}</div>
            </div>
        </div>
        <div class="current-details-grid">
            <div class="detail-item">
                <span class="detail-label">${t('humidity')}</span>
                <span class="detail-value">${current.relative_humidity_2m}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${t('dewPoint')}</span>
                <span class="detail-value">${Math.round(current.dew_point_2m)}${tempUnit()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${t('wind')}</span>
                <span class="detail-value">${Math.round(current.wind_speed_10m)} ${windUnit()} ${windDirection(current.wind_direction_10m)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${t('gusts')}</span>
                <span class="detail-value">${Math.round(current.wind_gusts_10m)} ${windUnit()}</span>
            </div>
            ${aqiInfo ? `
            <div class="detail-item">
                <span class="detail-label">${t('airQuality')}</span>
                <span class="detail-value" style="color:${aqiInfo.color};">${aqi} (${aqiInfo.text})</span>
            </div>` : ''}
            <div class="detail-item">
                <span class="detail-label">${t('uvIndex')}</span>
                <span class="detail-value">${uvVal} ${uvVal <= 2 ? t('uvLow') : uvVal <= 5 ? t('uvModerate') : uvVal <= 7 ? t('uvHigh') : uvVal <= 10 ? t('uvVeryHigh') : t('uvExtreme')}</span>
            </div>
        </div>
    `;
}

const POLLEN_PROXY_URL = 'https://pollen-proxy-15838356607.us-central1.run.app';

function renderPollen(airQuality, lat, lon) {
    const section = document.getElementById('details-section');
    const openMeteoPollen = pollenSummary(airQuality);
    const hasFreePollen = openMeteoPollen && openMeteoPollen.length > 0;

    if (hasFreePollen) {
        // European locations — show Open-Meteo pollen directly
        section.innerHTML = `
            <h2>${t('pollen')}</h2>
            <div class="pollen-scroll">
                ${openMeteoPollen.map(p => `
                    <div class="pollen-item">
                        <div class="detail-label">${p.name}</div>
                        <div class="detail-value" style="color:${p.color};">${p.level}</div>
                    </div>`).join('')}
            </div>
        `;
        initDragScroll(section.querySelector('.pollen-scroll'));
    } else {
        // Non-European — check cache first, auto-show if available
        const cacheKey = `pollen_${lat.toFixed(2)}_${lon.toFixed(2)}_${new Date().toISOString().slice(0, 10)}`;
        const cached = localStorage.getItem(cacheKey);

        let cachedData = null;
        if (cached) {
            try {
                cachedData = JSON.parse(cached);
            } catch {
                // Corrupted cache entry — drop it
                localStorage.removeItem(cacheKey);
            }
        }
        if (cachedData) {
            // Auto-show cached data
            section.innerHTML = `
                <h2>${t('pollen')} <span style="text-transform:none;font-weight:400;font-size:0.85rem;color:var(--text-muted);">(${new Date().toLocaleDateString(getLocaleForDate(), { month: 'long', day: 'numeric' })})</span></h2>
                <div id="pollen-content"></div>
            `;
            displayPollenData(cachedData);
        } else {
            section.innerHTML = `
                <h2>${t('pollen')}</h2>
                <div id="pollen-content">
                    <button id="pollen-btn" class="pollen-btn">${t('seePollenData')}</button>
                </div>
            `;
            document.getElementById('pollen-btn').addEventListener('click', () => {
                loadPollenData(lat, lon);
            });
        }
    }
}

function displayPollenData(data) {
    const content = document.getElementById('pollen-content');
    const section = document.getElementById('details-section');

    if (!data || data.error || !data.dailyInfo || data.dailyInfo.length === 0) {
        content.innerHTML = `<span style="color:var(--text-muted);font-size:0.85rem;">${t('pollenDataUnavailable')}</span>`;
        return;
    }

    const day = data.dailyInfo[0];
    const types = day.pollenTypeInfo || [];
    const plants = day.plantInfo || [];

    let items = [];
    for (const t of types) {
        const idx = t.indexInfo;
        if (!idx) continue;
        items.push({ name: t.displayName, category: idx.category || 'None', value: idx.value });
    }
    for (const p of plants) {
        const idx = p.indexInfo;
        if (!idx || idx.value === 0) continue;
        items.push({ name: p.displayName, category: idx.category, value: idx.value });
    }

    if (items.length === 0) {
        content.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem;">No significant pollen detected</span>';
        return;
    }

    // Update header with date
    const h2 = section.querySelector('h2');
    if (h2) {
        h2.innerHTML = `${t('pollen')} <span style="text-transform:none;font-weight:400;font-size:0.85rem;color:var(--text-muted);">(${new Date().toLocaleDateString(getLocaleForDate(), { month: 'long', day: 'numeric' })})</span>`;
    }

    const fewClass = items.length <= 3 ? ' pollen-few' : '';
    content.innerHTML = `
        <div class="pollen-scroll${fewClass}">
            ${items.map(p => `
                <div class="pollen-item">
                    <div class="detail-label">${escapeHtml(p.name)}</div>
                    <div class="detail-value" style="color:${pollenIndexColor(p.value)};">${escapeHtml(p.category)}</div>
                    <div style="font-size:0.7rem;color:var(--text-muted);">${Number(p.value) || 0}/5</div>
                </div>`).join('')}
        </div>
    `;
    initDragScroll(content.querySelector('.pollen-scroll'));
}

async function loadPollenData(lat, lon) {
    const btn = document.getElementById('pollen-btn');
    btn.textContent = t('loading');
    btn.disabled = true;

    const cacheKey = `pollen_${lat.toFixed(2)}_${lon.toFixed(2)}_${new Date().toISOString().slice(0, 10)}`;

    try {
        const res = await fetch(`${POLLEN_PROXY_URL}?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        displayPollenData(data);
    } catch (e) {
        const content = document.getElementById('pollen-content');
        content.innerHTML = `<button id="pollen-btn" class="pollen-btn">${t('retry')}</button>`;
        document.getElementById('pollen-btn').addEventListener('click', () => loadPollenData(lat, lon));
    }
}

function pollenIndexColor(value) {
    if (value <= 1) return '#16a34a';  // Low - green
    if (value <= 2) return '#84cc16';  // Low-Medium - lime
    if (value <= 3) return '#ca8a04';  // Medium - yellow
    if (value <= 4) return '#ea580c';  // High - orange
    return '#dc2626';                   // Very High - red
}

function renderHourly(hourly) {
    const section = document.getElementById('hourly-section');
    const now = new Date();
    const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
    if (startIdx === -1) { section.innerHTML = ''; return; }

    let html = `<h2>${t('hourlyForecast')}</h2><div class="hourly-scroll">`;
    for (let i = startIdx; i < startIdx + 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const hour = time.getHours();
        const label = units.time24h
            ? hour.toString().padStart(2, '0') + ':00'
            : (hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`);
        const info = weatherInfo(hourly.weather_code[i], isHourNight(hourly.time[i]));
        html += `
            <div class="hourly-item">
                <div>${label}</div>
                <div style="font-size:1.3rem;">${info.icon}</div>
                <div style="font-weight:600;">${Math.round(hourly.temperature_2m[i])}°</div>
            </div>
        `;
    }
    html += '</div>';
    section.innerHTML = html;
    initDragScroll(section.querySelector('.hourly-scroll'));
}

// --- 10-Day Forecast: unified scroll with sticky labels ---

const DAY_WIDTH = 100; // px per day column — shared by header + charts

function renderDaily(daily, hourly) {
    const section = document.getElementById('daily-section');
    const days = daily.time.length;
    const innerW = days * DAY_WIDTH;

    // Pre-compute chart ranges so we can build sticky labels
    const totalHours = Math.min(days * 24, hourly.time.length);
    const chartRanges = computeChartRanges(hourly, totalHours);

    // --- Compute temperature color per day ---
    const avgTemps = daily.time.map((_, i) =>
        (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2
    );
    // Store globally so theme toggle can recompute
    window._forecastAvgTemps = avgTemps;
    const tempRange = Math.max(...avgTemps) - Math.min(...avgTemps);
    const showTempColors = tempRange >= tempColorThreshold() && getSettingsBool('showForecastColors');

    // --- Day column header (inside scroll) ---
    let dayHeaderHtml = '';
    for (let i = 0; i < days; i++) {
        const date = new Date(daily.time[i] + 'T00:00:00');
        const dayLabel = date.toLocaleDateString(getLocaleForDate(), { weekday: 'short' });
        const dateLabel = date.toLocaleDateString(getLocaleForDate(), { month: 'numeric', day: 'numeric' });
        const info = weatherInfo(daily.weather_code[i]);
        const precip = daily.precipitation_sum[i];
        const minA = Math.min(...avgTemps);
        const rangeA = (Math.max(...avgTemps) - minA) || 1;
        const bg = tempBackground(avgTemps[i], minA, rangeA);
        dayHeaderHtml += `
            <div class="forecast-day" style="width:${DAY_WIDTH}px;min-width:${DAY_WIDTH}px;background:${bg};">
                <div class="forecast-date">${dayLabel} ${dateLabel}</div>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                    <span class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
                <div class="forecast-icon">${info.icon}</div>
                <div class="forecast-condition">${info.text}</div>
                <div class="forecast-precip">${precip > 0 ? '💧 ' + fmtPrecip(precip) : ''}</div>
            </div>
        `;
    }

    // Build chart rows — each has: sticky left labels | canvas | sticky right labels
    function chartRow(id, height, legendHtml, leftLabels, rightLabels) {
        return `
            <div class="chart-row" data-chart-id="${id}">
                <div class="chart-legend"><span class="chart-drag-handle" title="Drag to reorder">⠿</span>${legendHtml}<button class="chart-min-btn" data-chart-id="${id}" title="Hide chart">✕</button></div>
                <div class="chart-row-inner">
                    <div class="chart-axis chart-axis-left">${leftLabels}</div>
                    <canvas id="${id}" width="${innerW}" height="${height}" style="display:block;width:${innerW}px;height:${height}px;"></canvas>
                    <div class="chart-axis chart-axis-right">${rightLabels}</div>
                </div>
            </div>
        `;
    }

    function makeLabels(min, max, steps, suffix, color) {
        let html = '';
        for (let i = steps; i >= 0; i--) {
            const val = min + ((max - min) / steps) * i;
            const label = Number.isInteger(val) ? val : val.toFixed(1);
            html += `<span style="color:${color}">${label}${suffix}</span>`;
        }
        return html;
    }

    const r = chartRanges;

    const tempLegend = `<span><span style="color:#dc2626;">■</span> ${t('chartTemperature')} (${tempUnit()})</span><span><span style="color:#9333ea;">■</span> ${t('chartFeelsLike')} (${tempUnit()})</span><span><span style="color:#16a34a;">■</span> ${t('chartDewPoint')} (${tempUnit()})</span>`;
    const atmosLegend = `<span><span style="color:#9ca3af;">■</span> ${t('chartCloudCover')} (%)</span><span><span style="color:#3b82f6;">■</span> ${t('chartPrecipChance')} (%)</span><span><span style="color:#84cc16;">■</span> ${t('chartHumidity')} (%)</span><span><span style="color:#1a1a1a;">■</span> ${t('chartPressure')} (inHg)</span>`;
    const precipLegend = `<span><span style="color:#3b82f6;">■</span> ${t('chartPrecipAccum')} (${isImperial() ? 'in' : 'mm'})</span><span><span style="color:#16a34a;">■</span> ${t('chartHourlyPrecip')} (${isImperial() ? 'in' : 'mm'})</span>`;
    const windLegend = `<span><span style="color:#2563eb;">■</span> ${t('chartWindSpeed')} (${windUnit()})</span>`;

    // Axis width must match CSS .chart-axis width
    const AXIS_W = 40;
    const totalScrollW = innerW + AXIS_W * 2;

    section.innerHTML = `
        <h2>${t('tenDayForecast')} ${showTempColors ? '<span style="text-transform:none;font-weight:400;font-size:0.7rem;color:var(--text-muted);">— colors show relative temps: red = warmest, blue = coolest</span>' : ''}</h2>
        <div class="forecast-scroll-outer">
            <div class="forecast-scroll" style="width:${totalScrollW}px;">
                <div class="forecast-header">
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                    ${dayHeaderHtml}
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                </div>
                ${chartRow('chart-temp', 160, tempLegend,
                    makeLabels(r.temp.min, r.temp.max, 4, '°', '#dc2626'),
                    makeLabels(r.temp.min, r.temp.max, 4, '°', '#dc2626'))}
                ${chartRow('chart-atmos', 160, atmosLegend,
                    makeLabels(0, 100, 4, '%', '#84cc16'),
                    makeLabels(0, 100, 4, '%', '#84cc16'))}
                ${chartRow('chart-precip', 100, precipLegend,
                    makeLabels(0, r.precip.maxAccum, 3, precipUnit(), '#3b82f6'),
                    makeLabels(0, r.precip.maxAccum, 3, precipUnit(), '#3b82f6'))}
                ${chartRow('chart-wind', 100, windLegend,
                    makeLabels(0, r.wind.max, 3, '', '#2563eb'),
                    makeLabels(0, r.wind.max, 3, '', '#2563eb'))}
                <div class="forecast-footer">
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                    ${daily.time.map((t, i) => {
                        const date = new Date(t + 'T00:00:00');
                        const dayLabel = date.toLocaleDateString(getLocaleForDate(), { weekday: 'short' });
                        const dateLabel = date.toLocaleDateString(getLocaleForDate(), { month: 'numeric', day: 'numeric' });
                        return `<div class="forecast-footer-day" style="width:${DAY_WIDTH}px;min-width:${DAY_WIDTH}px;">${dayLabel} ${dateLabel}</div>`;
                    }).join('')}
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                </div>
            </div>
        </div>
    `;

    requestAnimationFrame(() => drawAllCharts(hourly, totalHours, chartRanges));

    // Drag-to-scroll
    initDragScroll(document.querySelector('.forecast-scroll-outer'));
}

function initDragScroll(el) {
    if (!el) return;
    let isDown = false;
    let startX, scrollLeft;

    el.style.cursor = 'grab';

    el.addEventListener('mousedown', (e) => {
        isDown = true;
        el.style.cursor = 'grabbing';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = 'grab'; });
    el.addEventListener('mouseup', () => { isDown = false; el.style.cursor = 'grab'; });

    el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = scrollLeft - (x - startX);
    });

    // Touch support (mobile)
    let touchStartX, touchScrollLeft;
    el.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = el.scrollLeft;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        el.scrollLeft = touchScrollLeft - (x - touchStartX);
    }, { passive: true });
}

function computeChartRanges(hourly, hours) {
    const temp = hourly.temperature_2m.slice(0, hours);
    const feels = hourly.apparent_temperature.slice(0, hours);
    const dew = hourly.dew_point_2m.slice(0, hours);
    const allTemps = [...temp, ...feels, ...dew];

    const precip = hourly.precipitation.slice(0, hours);
    let accumTotal = 0;
    for (let i = 0; i < hours; i++) accumTotal += precip[i] || 0;

    const wind = hourly.wind_speed_10m.slice(0, hours);

    return {
        temp: { min: Math.floor(Math.min(...allTemps) - 5), max: Math.ceil(Math.max(...allTemps) + 5) },
        precip: { maxAccum: Math.max(accumTotal, 0.1), maxHourly: Math.max(...precip, 0.01) },
        wind: { max: Math.max(...wind, 5) },
    };
}

// --- Chart drawing helpers ---

function getChartContext(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    return { ctx: canvas.getContext('2d'), w: canvas.width, h: canvas.height };
}

function drawLine(ctx, data, count, color, minVal, maxVal, w, h, pad) {
    const drawH = h - pad * 2;
    const range = maxVal - minVal || 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
        const x = (i / (count - 1)) * w;
        const y = pad + drawH - ((data[i] - minVal) / range) * drawH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawArea(ctx, data, count, color, alpha, minVal, maxVal, w, h, pad) {
    const drawH = h - pad * 2;
    const range = maxVal - minVal || 1;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, h - pad);
    for (let i = 0; i < count; i++) {
        const x = (i / (count - 1)) * w;
        const y = pad + drawH - ((data[i] - minVal) / range) * drawH;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h - pad);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function drawDayDividers(ctx, count, w, h) {
    ctx.strokeStyle = isDarkMode() ? '#374151' : '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 24; i < count; i += 24) {
        const x = (i / (count - 1)) * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
}

function drawNowLine(ctx, hourly, count, w, h) {
    const now = new Date();
    const startTime = new Date(hourly.time[0]);
    const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
    if (hoursElapsed < 0 || hoursElapsed > count) return;
    const x = (hoursElapsed / (count - 1)) * w;
    ctx.strokeStyle = isDarkMode() ? '#9ca3af' : '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.setLineDash([]);
}

// --- Draw all charts ---

function drawAllCharts(hourly, hours, r) {
    // Temperature
    const c1 = getChartContext('chart-temp');
    if (c1) {
        const { ctx, w, h } = c1;
        const pad = 10;
        const temp = hourly.temperature_2m.slice(0, hours);
        const feels = hourly.apparent_temperature.slice(0, hours);
        const dew = hourly.dew_point_2m.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        drawLine(ctx, dew, hours, '#16a34a', r.temp.min, r.temp.max, w, h, pad);
        drawLine(ctx, feels, hours, '#9333ea', r.temp.min, r.temp.max, w, h, pad);
        drawLine(ctx, temp, hours, '#dc2626', r.temp.min, r.temp.max, w, h, pad);
    }

    // Atmospheric
    const c2 = getChartContext('chart-atmos');
    if (c2) {
        const { ctx, w, h } = c2;
        const pad = 10;
        const cloud = hourly.cloud_cover.slice(0, hours);
        const precipChance = hourly.precipitation_probability.slice(0, hours);
        const humidity = hourly.relative_humidity_2m.slice(0, hours);
        const pressure = hourly.surface_pressure.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        drawArea(ctx, cloud, hours, '#9ca3af', 0.3, 0, 100, w, h, pad);
        drawArea(ctx, precipChance, hours, '#3b82f6', 0.3, 0, 100, w, h, pad);
        drawLine(ctx, humidity, hours, '#84cc16', 0, 100, w, h, pad);
        drawLine(ctx, cloud, hours, '#9ca3af', 0, 100, w, h, pad);
        drawLine(ctx, precipChance, hours, '#3b82f6', 0, 100, w, h, pad);
        const pMin = Math.min(...pressure) - 0.1;
        const pMax = Math.max(...pressure) + 0.1;
        drawLine(ctx, pressure, hours, '#1a1a1a', pMin, pMax, w, h, pad);
    }

    // Precipitation
    const c3 = getChartContext('chart-precip');
    if (c3) {
        const { ctx, w, h } = c3;
        const pad = 8;
        const precip = hourly.precipitation.slice(0, hours);
        const accum = [];
        let total = 0;
        for (let i = 0; i < hours; i++) { total += precip[i] || 0; accum.push(total); }
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        const barW = w / hours;
        ctx.fillStyle = '#16a34a';
        for (let i = 0; i < hours; i++) {
            if (precip[i] > 0) {
                const barH = (precip[i] / r.precip.maxHourly) * (h - pad * 2) * 0.4;
                const x = (i / (hours - 1)) * w;
                ctx.fillRect(x - barW / 2, h - pad - barH, barW, barH);
            }
        }
        drawLine(ctx, accum, hours, '#3b82f6', 0, r.precip.maxAccum, w, h, pad);
    }

    // Wind
    const c4 = getChartContext('chart-wind');
    if (c4) {
        const { ctx, w, h } = c4;
        const pad = 8;
        const wind = hourly.wind_speed_10m.slice(0, hours);
        const dirs = hourly.wind_direction_10m.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        drawArea(ctx, wind, hours, '#2563eb', 0.15, 0, r.wind.max, w, h, pad);
        drawLine(ctx, wind, hours, '#2563eb', 0, r.wind.max, w, h, pad);
        ctx.fillStyle = '#2563eb';
        for (let i = 0; i < hours; i += 6) {
            const x = (i / (hours - 1)) * w;
            const y = pad + (h - pad * 2) - (wind[i] / r.wind.max) * (h - pad * 2) - 12;
            const angle = (dirs[i] + 180) * Math.PI / 180;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(-3, 5);
            ctx.lineTo(3, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }
}

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

function buildTranslateLink(text) {
    if (!getSettingsBool('showTranslateLink')) return '';
    if (!text) return '';
    const uiLang = getCurrentLang();
    const url = `https://translate.google.com/?sl=auto&tl=${uiLang}&text=${encodeURIComponent(text)}&op=translate`;
    return ` <a href="${url}" target="_blank" rel="noopener" class="alert-translate-link">${t('translateAlert')}</a>`;
}

// --- Alert dismissal ---------------------------------------------------------
// Dismissals are stored as { alertKey: expiryEpochMs }. Keying on the alert's
// own identity (event + headline + issue time) means a NEW or updated alert
// still shows after an old one was dismissed — important for safety content.
// Entries are pruned once the alert they refer to has expired, so the map
// cannot grow without bound.

const DISMISSED_ALERTS_KEY = 'dismissedAlerts';
const ALERT_FALLBACK_TTL_MS = 24 * 60 * 60 * 1000;

function hashString(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
}

function alertKey(p) {
    // `start` is unix seconds (OWM proxy); onset/effective/sent are ISO (NWS).
    const when = p.start || p.onset || p.effective || p.sent || '';
    return hashString([p.event || '', p.headline || '', String(when)].join('|'));
}

function alertExpiryMs(p) {
    // NWS sends ISO strings (expires/ends); the OWM proxy sends unix seconds (end).
    for (const c of [p.end, p.ends, p.expires]) {
        if (c === null || c === undefined || c === '') continue;
        const ms = typeof c === 'number' ? c * 1000 : Date.parse(c);
        if (Number.isFinite(ms)) return ms;
    }
    return Date.now() + ALERT_FALLBACK_TTL_MS;
}

function loadDismissedAlerts() {
    let raw;
    try { raw = localStorage.getItem(DISMISSED_ALERTS_KEY); } catch (e) { return {}; }
    if (!raw) return {};
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return {}; }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const now = Date.now();
    const kept = {};
    let pruned = false;
    for (const [k, exp] of Object.entries(parsed)) {
        if (typeof exp === 'number' && exp > now) kept[k] = exp;
        else pruned = true;
    }
    if (pruned) saveDismissedAlerts(kept);
    return kept;
}

function saveDismissedAlerts(map) {
    try { localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(map)); }
    catch (e) { /* quota exceeded / private mode — dismissal just won't persist */ }
}

function renderAlerts(alerts) {
    const section = document.getElementById('alerts-section');
    if (!alerts || alerts.length === 0) {
        section.hidden = true;
        return;
    }
    const dismissed = loadDismissedAlerts();
    const visible = alerts.filter(a => !dismissed[alertKey(a.properties || {})]);
    if (visible.length === 0) {
        section.hidden = true;
        return;
    }
    section.hidden = false;
    const minimized = getSettingsBool('alertsMinimized');
    const dismissLabel = escapeHtml(t('dismissAlert'));
    const DESC_PREVIEW_CHARS = 300;
    let html = `<h2>${t('weatherAlerts')}</h2>`;
    for (const alert of visible) {
        const p = alert.properties;
        const event = escapeHtml(p.event);
        const headline = escapeHtml(p.headline || '');
        const descRaw = (p.description || '').trim();
        // Full text to translate = event + headline + description
        const fullText = [p.event, p.headline, descRaw].filter(Boolean).join('\n\n');
        const translateLink = buildTranslateLink(fullText);
        let descHtml = '';
        if (descRaw) {
            const descEsc = escapeHtml(descRaw).replace(/\n/g, '<br>');
            if (descRaw.length > DESC_PREVIEW_CHARS) {
                const previewEsc = escapeHtml(descRaw.slice(0, DESC_PREVIEW_CHARS).trimEnd() + '…').replace(/\n/g, '<br>');
                descHtml = `
                    <details class="alert-desc" style="font-size:0.8rem;margin-top:0.4rem;">
                        <summary style="cursor:pointer;list-style:none;">
                            <span class="alert-desc-preview">${previewEsc}</span>
                            <span class="alert-desc-more" style="text-decoration:underline;"> ${t('showMore')}</span>
                        </summary>
                        <div style="margin-top:0.4rem;white-space:pre-wrap;">${descEsc}</div>
                    </details>`;
            } else {
                descHtml = `<div class="alert-desc" style="font-size:0.8rem;margin-top:0.4rem;white-space:pre-wrap;">${descEsc}</div>`;
            }
        }
        const dismissBtn = `<button class="alert-dismiss" type="button"` +
            ` data-alert-key="${escapeHtml(alertKey(p))}"` +
            ` data-alert-expiry="${alertExpiryMs(p)}"` +
            ` aria-label="${dismissLabel}" title="${dismissLabel}">&times;</button>`;
        const bodyHtml = `
                <div style="font-size:0.85rem;margin-top:0.25rem;">${headline}</div>
                ${descHtml}`;

        if (minimized) {
            // Collapsed to the event name only. The translate link lives in the
            // body rather than the <summary> so clicking it doesn't also toggle.
            html += `
            <div class="alert-item">
                ${dismissBtn}
                <details class="alert-collapsible">
                    <summary><strong>${event}</strong></summary>
                    ${translateLink ? `<div class="alert-translate-row">${translateLink}</div>` : ''}
                    ${bodyHtml}
                </details>
            </div>
        `;
        } else {
            html += `
            <div class="alert-item">
                ${dismissBtn}
                <strong>${event}</strong>${translateLink}
                ${bodyHtml}
            </div>
        `;
        }
    }
    section.innerHTML = html;

    // Hide preview when details is opened (so we don't show both)
    section.querySelectorAll('details.alert-desc').forEach(d => {
        d.addEventListener('toggle', () => {
            const preview = d.querySelector('.alert-desc-preview');
            const more = d.querySelector('.alert-desc-more');
            if (preview) preview.style.display = d.open ? 'none' : '';
            if (more) more.textContent = d.open ? ' ' + t('showLess') : ' ' + t('showMore');
        });
    });

    // Dismiss: remember this alert until it expires, then drop it from the DOM.
    section.querySelectorAll('.alert-dismiss').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.alertKey;
            const expiry = parseInt(btn.dataset.alertExpiry, 10);
            const map = loadDismissedAlerts();
            map[key] = Number.isFinite(expiry) ? expiry : Date.now() + ALERT_FALLBACK_TTL_MS;
            saveDismissedAlerts(map);
            const item = btn.closest('.alert-item');
            if (item) item.remove();
            if (!section.querySelector('.alert-item')) section.hidden = true;
        });
    });
}

// Continental US bounding box — used to gate NoAdsRadar forecast fetch.
// Stricter than the NWS coverage check (which includes AK/HI/PR/Guam);
// NoAdsRadar covers only the lower-48.
function inConusBounds(lat, lon) {
    return lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66;
}

let radarInterval = null;
let radarPreloadTimer = null;
let radarLoadToken = 0;

function renderRadar(lat, lon) {
    if (radarInterval) { clearInterval(radarInterval); radarInterval = null; }
    if (radarPreloadTimer) { clearTimeout(radarPreloadTimer); radarPreloadTimer = null; }

    const section = document.getElementById('radar-section');
    // Check if location is within NWS radar coverage (US territories)
    const inNwsCoverage =
        (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) ||  // CONUS
        (lat >= 51 && lat <= 72 && lon >= -180 && lon <= -130) || // Alaska
        (lat >= 18 && lat <= 23 && lon >= -161 && lon <= -154) || // Hawaii
        (lat >= 17 && lat <= 19 && lon >= -68 && lon <= -64) ||   // Puerto Rico / USVI
        (lat >= 13 && lat <= 14 && lon >= 144 && lon <= 145);     // Guam

    let nwsLink = '';
    if (inNwsCoverage) {
        const settings = {
            agenda: { id: null, center: [lon, lat], location: null, zoom: 8 },
            animating: false,
            base: 'standard',
            artcc: false, county: false, cwa: false, rfc: false, state: true,
            menu: true, shortFusedOnly: false,
            opacity: { alerts: 0.8, local: 0.6, localStations: 0.8, national: 0.6 }
        };
        const url = `https://radar.weather.gov/?settings=v1_${encodeURIComponent(btoa(JSON.stringify(settings)))}`;
        nwsLink = `<a href="${url}" target="_blank" rel="noopener" class="nws-radar-link" title="Open this location on NWS radar">NWS radar ↗</a>`;
    }

    section.innerHTML = `
        <h2>${t('radar')} <button id="radar-refresh" class="radar-refresh-btn" title="${t('refreshRadar')}">↻</button>${nwsLink}</h2>
        <div id="radar-container" style="position:relative;width:100%;aspect-ratio:1;background:#1a1a2e;border-radius:8px;overflow:hidden;">
            <div class="loading" style="color:#9ca3af;">${t('loadingRadar')}</div>
        </div>
            <div id="radar-progress" class="radar-progress" hidden>
                <div class="radar-progress-track">
                    <div class="radar-progress-past"></div>
                    <div class="radar-progress-future"></div>
                </div>
                <div class="radar-progress-marker"></div>
                <div class="radar-progress-now-line"></div>
                <div class="radar-progress-now-label">${t('radarNow')}</div>
            </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-top:0.5rem;">
            <div id="radar-time" style="font-size:0.8rem;color:#6b7280;"></div>
            <div class="radar-controls">
                <button id="radar-pause" class="radar-ctrl-btn" title="${t('pauseRadar')}">⏸</button>
                <button id="radar-slower" class="radar-ctrl-btn" title="${t('slowerRadar')}">−</button>
                <span id="radar-speed-label" style="font-size:0.7rem;color:var(--text-muted);min-width:2.5rem;text-align:center;">1x</span>
                <button id="radar-faster" class="radar-ctrl-btn" title="${t('fasterRadar')}">+</button>
            </div>
        </div>
    `;
    loadRadar(lat, lon);

    document.getElementById('radar-refresh').addEventListener('click', () => {
        if (radarInterval) { clearInterval(radarInterval); radarInterval = null; }
        if (radarPreloadTimer) { clearTimeout(radarPreloadTimer); radarPreloadTimer = null; }
        document.getElementById('radar-container').innerHTML = `<div class="loading" style="color:#9ca3af;">${t('refreshingRadar')}</div>`;
        document.getElementById('radar-time').textContent = '';
        loadRadar(lat, lon);
    });
}

const NOADSRADAR_BASE = 'https://noadsradar-tilesvc-15838356607.us-central1.run.app';

async function fetchRainviewerPast() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', { signal: controller.signal });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        return (data.radar?.past || []).map(f => ({ ...f, source: 'past' }));
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchNoadsradarFuture() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const res = await fetch(`${NOADSRADAR_BASE}/frames.json`, { signal: controller.signal });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        return (data.frames || []).map(f => ({ ...f, source: 'future' }));
    } finally {
        clearTimeout(timeout);
    }
}

async function loadRadar(lat, lon) {
    const myToken = ++radarLoadToken;
    try {
        // Fetch RainViewer always; fetch NoAdsRadar only in CONUS bounds.
        // NoAdsRadar failures fall back silently to past-only.
        const fetchFuture = inConusBounds(lat, lon)
            ? fetchNoadsradarFuture().catch(err => {
                console.warn('noadsradar:', err?.message || err);
                return [];
            })
            : Promise.resolve([]);

        const [pastFrames, futureFrames] = await Promise.all([
            fetchRainviewerPast(),
            fetchFuture
        ]);

        // Bail if a newer loadRadar call has superseded us
        if (myToken !== radarLoadToken) return;

        const frames = [...pastFrames, ...futureFrames];
        const nowIndex = Math.max(0, pastFrames.length - 1);

        const container = document.getElementById('radar-container');

        // Guard against both sources returning empty (RainViewer 200 with empty past, no future)
        if (frames.length === 0) {
            container.innerHTML = `<div style="text-align:center;padding:2rem;color:#9ca3af;">${t('radarUnavailable')}</div>`;
            return;
        }

        const zoom = 7;
        const n = Math.pow(2, zoom);

        // Exact fractional tile position for the city
        const exactX = (lon + 180) / 360 * n;
        const exactY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n;

        // Center tile
        const centerTileX = Math.floor(exactX);
        const centerTileY = Math.floor(exactY);

        // Fraction within center tile (0-1)
        const fracX = exactX - centerTileX;
        const fracY = exactY - centerTileY;

        // Use a 5x5 grid so there's always enough tile coverage after centering.
        // The city is at tile (centerTileX + fracX, centerTileY + fracY).
        // In the 5x5 grid, the center tile starts at index 2 (0-indexed), so
        // the city is at grid position (2 + fracX, 2 + fracY) out of 5 tiles.
        // As a percentage of the grid: (2 + frac) / 5 * 100.
        // We want that at 50% of the container, so:
        //   left = 50% - (2 + fracX) / 5 * gridWidth
        // where gridWidth = 500% of container.
        const gridSize = 5;
        const offsetX = 50 - (2 + fracX) / gridSize * 500;
        const offsetY = 50 - (2 + fracY) / gridSize * 500;

        // Build a tile-grid <div> as a real DOM element so URLs from third-party
        // APIs (RainViewer, CartoDB) can never break out of an HTML attribute.
        function buildTileGrid(tileSrcFn, extraStyle, defer) {
            const wrap = document.createElement('div');
            wrap.style.cssText = `position:absolute;left:${offsetX}%;top:${offsetY}%;width:${gridSize * 100}%;height:${gridSize * 100}%;display:grid;grid-template-columns:repeat(${gridSize},1fr);${extraStyle || ''}`;
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const url = tileSrcFn(centerTileX + dx, centerTileY + dy);
                    const img = document.createElement('img');
                    img.alt = '';
                    img.style.cssText = 'width:100%;height:100%;display:block;';
                    img.dataset.retries = '0';
                    if (defer) {
                        img.dataset.src = url; // loaded later by loadFrame
                    } else {
                        img.src = url;
                        img.onerror = function () {
                            const tries = parseInt(this.dataset.retries || '0', 10);
                            if (tries < 3) {
                                this.dataset.retries = String(tries + 1);
                                const sep = url.includes('?') ? '&' : '?';
                                setTimeout(() => { this.src = url + sep + 'r=' + (tries + 1); }, 1000 * (tries + 1));
                            } else {
                                this.style.visibility = 'hidden';
                            }
                        };
                    }
                    wrap.appendChild(img);
                }
            }
            return wrap.outerHTML;
        }

        // Map base layer
        const mapHtml = buildTileGrid(
            (tx, ty) => {
                const style = isDarkMode() ? 'dark_all' : 'rastertiles/voyager';
                return `https://a.basemaps.cartocdn.com/${style}/${zoom}/${tx}/${ty}@2x.png`;
            },
            'opacity:0.7;'
        );

        // Returns the tile-URL builder appropriate for the frame's source.
        function tileSrcFor(frame) {
            if (frame.source === 'future') {
                return (tx, ty) => `${NOADSRADAR_BASE}/tile/${frame.minute}/${zoom}/${tx}/${ty}.png`;
            }
            // RainViewer past
            // Color scheme 2 = Universal Blue, the only scheme RainViewer
            // currently documents at https://www.rainviewer.com/api/color-schemes.html
            return (tx, ty) => `https://tilecache.rainviewer.com${frame.path}/256/${zoom}/${tx}/${ty}/2/1_0.png`;
        }

        // Radar layers — eager-load the "NOW" frame (last past frame).
        // Forecast and older past tiles defer-load until reached by animation.
        let radarHtml = '';
        frames.forEach((frame, i) => {
            const isEager = i === nowIndex;
            radarHtml += buildTileGrid(
                tileSrcFor(frame),
                `opacity:${i === nowIndex ? 1 : 0};transition:opacity 0.3s;`,
                !isEager
            ).replace('<div ', `<div class="radar-frame" data-frame="${i}" data-source="${frame.source}" `);
        });

        // City center marker — simple crosshair
        const markerHtml = `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;">
                <div style="width:12px;height:12px;border:2px solid #2563eb;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,0.8);"></div>
            </div>`;

        container.innerHTML = mapHtml + radarHtml + markerHtml;

        // Attach error/retry handlers to eager-loaded tiles. Inline onerror
        // attributes were removed (CSP-friendly + safer). We do this after
        // innerHTML so newly-parsed <img> elements have the handler.
        container.querySelectorAll('img[src]:not([data-src])').forEach(img => {
            const original = img.src;
            img.onerror = function () {
                const tries = parseInt(this.dataset.retries || '0', 10);
                if (tries < 3) {
                    this.dataset.retries = String(tries + 1);
                    const sep = original.includes('?') ? '&' : '?';
                    setTimeout(() => { this.src = original + sep + 'r=' + (tries + 1); }, 1000 * (tries + 1));
                } else {
                    this.style.visibility = 'hidden';
                }
            };
        });

        // Frame timestamp handles both sources: RainViewer's unix `time` (seconds)
        // and NoAdsRadar's `valid_utc` ISO string.
        function frameTime(frame) {
            const d = frame.source === 'future'
                ? new Date(frame.valid_utc)
                : new Date(frame.time * 1000);
            return Number.isFinite(d.getTime()) ? d : null;
        }

        const timeEl = document.getElementById('radar-time');
        const showFrameTime = (frame) => {
            const d = frameTime(frame);
            const forecastTag = `<strong>(${escapeHtml(t('forecastLabel'))})</strong>`;
            if (!d) {
                // Bad timestamp — show source tag only (or blank)
                timeEl.innerHTML = frame.source === 'future' ? forecastTag : '';
                return;
            }
            const timeStr = d.toLocaleTimeString(getCurrentLang(), { hour: 'numeric', minute: '2-digit' });
            const timeEsc = escapeHtml(timeStr);
            timeEl.innerHTML = frame.source === 'future'
                ? `${timeEsc} ${forecastTag}`
                : timeEsc;
        };
        showFrameTime(frames[nowIndex]);

        // Animate through frames with speed/pause controls.
        // Start at "NOW" (boundary between past and future) so user sees current
        // conditions first, then watches the past → future loop.
        let currentFrame = nowIndex;
        const allFrameEls = container.querySelectorAll('.radar-frame');

        // Wire the progress bar. Always visible when there are frames;
        // the NOW line + label only show when forecast frames exist.
        const hasFuture = futureFrames.length > 0;
        const progressEl = document.getElementById('radar-progress');
        const pastBar = progressEl?.querySelector('.radar-progress-past');
        const futureBar = progressEl?.querySelector('.radar-progress-future');
        const nowLine = progressEl?.querySelector('.radar-progress-now-line');
        const nowLabel = progressEl?.querySelector('.radar-progress-now-label');
        const markerEl = progressEl?.querySelector('.radar-progress-marker');

        if (progressEl) {
            progressEl.hidden = false;
            // Past portion width: 100% if no future frames, else proportion of past.
            const pastPct = hasFuture ? ((nowIndex + 1) / frames.length) * 100 : 100;
            if (pastBar) pastBar.style.width = `${pastPct}%`;
            if (futureBar) futureBar.style.display = hasFuture ? '' : 'none';
            if (nowLine) {
                nowLine.style.display = hasFuture ? '' : 'none';
                nowLine.style.left = `calc(${pastPct}% - 1px)`;
            }
            if (nowLabel) {
                nowLabel.style.display = hasFuture ? '' : 'none';
                nowLabel.style.left = `${pastPct}%`;
            }
        }

        function updateProgressMarker(idx) {
            if (!markerEl) return;
            const pct = ((idx + 0.5) / frames.length) * 100;
            markerEl.style.left = `${pct}%`;
        }
        updateProgressMarker(currentFrame);

        const speeds = [2000, 1000, 500, 250, 125];
        const speedLabels = ['0.25x', '0.5x', '1x', '2x', '4x'];
        let speedIdx = parseInt(localStorage.getItem('radarSpeed') || '2', 10);
        if (speedIdx < 0 || speedIdx >= speeds.length) speedIdx = 2;

        // Auto-play setting (default true). When false, show only the latest
        // frame, don't preload deferred tiles, don't start the animation.
        // User can still click play or scrub manually; tiles load on demand.
        const autoPlay = getSettingsBool('autoPlayRadar');
        let paused = !autoPlay;

        // Load deferred tiles for a frame
        function loadFrame(frameEl) {
            frameEl.querySelectorAll('img[data-src]').forEach(img => {
                const src = img.dataset.src;
                img.src = src;
                img.removeAttribute('data-src');
                img.dataset.retries = '0';
                img.onerror = function () {
                    const tries = parseInt(this.dataset.retries || '0', 10);
                    if (tries < 3) {
                        this.dataset.retries = String(tries + 1);
                        const sep = src.includes('?') ? '&' : '?';
                        setTimeout(() => { this.src = src + sep + 'r=' + (tries + 1); }, 1000 * (tries + 1));
                    } else { this.style.visibility = 'hidden'; }
                };
            });
        }

        // Preload all frames sequentially with a small delay.
        // Track the timer so we can cancel on re-render (avoids leaking
        // detached image loads across location/theme changes).
        let preloadIdx = 0;
        function preloadNext() {
            if (preloadIdx >= allFrameEls.length) return;
            loadFrame(allFrameEls[preloadIdx]);
            preloadIdx++;
            radarPreloadTimer = setTimeout(preloadNext, 300);
        }
        if (autoPlay) preloadNext();

        // Single source of truth for switching to a frame.
        // Used by the animation tick AND the progress-bar scrub handler.
        function setFrame(idx) {
            idx = Math.max(0, Math.min(frames.length - 1, idx));
            if (idx === currentFrame) return;
            allFrameEls[currentFrame].style.opacity = '0';
            currentFrame = idx;
            loadFrame(allFrameEls[currentFrame]);
            allFrameEls[currentFrame].style.opacity = '1';
            showFrameTime(frames[currentFrame]);
            updateProgressMarker(currentFrame);
        }

        let firstLoop = true;

        function startAnimation() {
            if (radarInterval) clearInterval(radarInterval);
            const speed = firstLoop ? speeds[1] : speeds[speedIdx]; // 0.5x on first loop
            radarInterval = setInterval(() => {
                if (paused) return;
                const next = (currentFrame + 1) % frames.length;
                setFrame(next);
                // After completing first loop, switch to user's speed
                if (firstLoop && currentFrame === frames.length - 1) {
                    firstLoop = false;
                    startAnimation();
                }
            }, speed);
        }

        function updateSpeedLabel() {
            const label = document.getElementById('radar-speed-label');
            if (label) label.textContent = speedLabels[speedIdx];
        }

        startAnimation();
        updateSpeedLabel();

        const pauseBtn = document.getElementById('radar-pause');
        // Reflect initial paused state (autoPlay setting may have started us paused).
        if (pauseBtn && paused) {
            pauseBtn.textContent = '▶';
            pauseBtn.title = t('playRadar');
        }
        if (pauseBtn) pauseBtn.addEventListener('click', () => {
            paused = !paused;
            pauseBtn.textContent = paused ? '▶' : '⏸';
            pauseBtn.title = paused ? t('playRadar') : t('pauseRadar');
            // First click of play (preload not yet started): jump to the earliest
            // frame and kick off the deferred preload so the user sees the full
            // past → now → future loop from the beginning.
            if (!paused && preloadIdx === 0 && allFrameEls.length > 0) {
                setFrame(0);
                preloadNext();
            }
        });

        // --- Scrub the progress bar (click or drag to change time) ---
        if (progressEl) {
            let scrubbing = false;

            function frameFromEvent(e) {
                const rect = progressEl.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const fraction = Math.max(0, Math.min(1, x / rect.width));
                return Math.round(fraction * (frames.length - 1));
            }

            function pauseForScrub() {
                paused = true;
                if (pauseBtn) {
                    pauseBtn.textContent = '▶';
                    pauseBtn.title = t('playRadar');
                }
            }

            progressEl.style.cursor = 'pointer';
            progressEl.style.touchAction = 'none'; // prevent page scroll while dragging on mobile

            progressEl.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                scrubbing = true;
                progressEl.setPointerCapture(e.pointerId);
                // Disable marker transition during drag so it tracks the pointer crisply
                if (markerEl) markerEl.style.transition = 'none';
                pauseForScrub();
                setFrame(frameFromEvent(e));
            });

            progressEl.addEventListener('pointermove', (e) => {
                if (!scrubbing) return;
                setFrame(frameFromEvent(e));
            });

            function endScrub(e) {
                if (!scrubbing) return;
                scrubbing = false;
                try { progressEl.releasePointerCapture(e.pointerId); } catch {}
                if (markerEl) markerEl.style.transition = '';
            }

            progressEl.addEventListener('pointerup', endScrub);
            progressEl.addEventListener('pointercancel', endScrub);
        }

        const slowerBtn = document.getElementById('radar-slower');
        if (slowerBtn) slowerBtn.addEventListener('click', () => {
            if (speedIdx > 0) {
                speedIdx--;
                localStorage.setItem('radarSpeed', speedIdx);
                updateSpeedLabel();
                startAnimation();
            }
        });

        const fasterBtn = document.getElementById('radar-faster');
        if (fasterBtn) fasterBtn.addEventListener('click', () => {
            if (speedIdx < speeds.length - 1) {
                speedIdx++;
                localStorage.setItem('radarSpeed', speedIdx);
                updateSpeedLabel();
                startAnimation();
            }
        });

    } catch {
        document.getElementById('radar-container').innerHTML =
            `<div style="text-align:center;padding:2rem;color:#9ca3af;">${t('radarUnavailable')}</div>`;
    }
}

function renderSunMoon(daily, lat, lon, utcOffsetSeconds) {
    const fmtTime = fmtTimeUnit;

    const fmtDate = (d) => {
        if (!d || isNaN(d)) return '';
        return d.toLocaleDateString(getLocaleForDate(), { month: 'long', day: 'numeric' });
    };

    // Sun
    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
    const sunDateLabel = fmtDate(sunrise);

    const sunSection = document.getElementById('sun-section');
    sunSection.innerHTML = `
        <h2>${t('sun')} <span style="text-transform:none;font-weight:400;font-size:0.85rem;color:var(--text-muted);">(${sunDateLabel})</span></h2>
        <div class="astro-grid">
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌅</div>
                <div class="label">${t('sunrise')}</div>
                <div class="value">${fmtTime(sunrise)}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">☀️</div>
                <div class="label">${t('solarNoon')}</div>
                <div class="value">${fmtTime(solarNoon)}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌇</div>
                <div class="label">${t('sunset')}</div>
                <div class="value">${fmtTime(sunset)}</div>
            </div>
        </div>
    `;

    // Moon — calculate in UTC using the searched location's timezone offset
    const utcOffsetMs = (utcOffsetSeconds || 0) * 1000;
    const moon = getMoonPhase(new Date());
    const moonTimes = getMoonTimes(lat, lon, utcOffsetMs);

    const riseDate = moonTimes.rise ? fmtDate(moonTimes.rise) : '';
    const setDate = moonTimes.set ? fmtDate(moonTimes.set) : '';

    const moonSection = document.getElementById('moon-section');

    // If moon is currently up, show Moonset first (next event), then Moonrise (after that)
    const firstItem = moonTimes.moonIsUp
        ? `<div class="astro-item">
                <div style="font-size:1.5rem;">🌘</div>
                <div class="label">${t('moonset')}</div>
                <div class="value">${fmtTime(moonTimes.set)}</div>
                <div class="label">${setDate}</div>
           </div>`
        : `<div class="astro-item">
                <div style="font-size:1.5rem;">🌔</div>
                <div class="label">${t('moonrise')}</div>
                <div class="value">${fmtTime(moonTimes.rise)}</div>
                <div class="label">${riseDate}</div>
           </div>`;

    const lastItem = moonTimes.moonIsUp
        ? `<div class="astro-item">
                <div style="font-size:1.5rem;">🌔</div>
                <div class="label">${t('moonrise')}</div>
                <div class="value">${fmtTime(moonTimes.rise)}</div>
                <div class="label">${riseDate}</div>
           </div>`
        : `<div class="astro-item">
                <div style="font-size:1.5rem;">🌘</div>
                <div class="label">${t('moonset')}</div>
                <div class="value">${fmtTime(moonTimes.set)}</div>
                <div class="label">${setDate}</div>
           </div>`;

    moonSection.innerHTML = `
        <h2>${t('moon')}</h2>
        <div class="astro-grid">
            ${firstItem}
            <div class="astro-item">
                <div style="font-size:1.5rem;">${moon.icon}</div>
                <div class="label">${t('phase')}</div>
                <div class="value">${moon.name}</div>
            </div>
            ${lastItem}
        </div>
    `;
}

// --- Moonrise/Moonset calculation ---
// Simplified algorithm based on Jean Meeus "Astronomical Algorithms"

function getMoonTimes(lat, lon, utcOffsetMs) {
    // Calculate local midnight and "now" at the searched location as UTC timestamps
    const nowUtc = Date.now();
    const localNowMs = nowUtc + utcOffsetMs;
    const localMidnightMs = localNowMs - (localNowMs % 86400000);
    const utcMidnight = localMidnightMs - utcOffsetMs;

    const toLocal = (d) => d ? new Date(d.getTime() + utcOffsetMs + new Date().getTimezoneOffset() * 60000) : null;

    // Check if the moon is currently above the horizon
    const currentAlt = moonAltitude(new Date(nowUtc), lat, lon);
    const moonIsUp = currentAlt > -0.833;

    if (moonIsUp) {
        // Moon is currently up — find next set, then next rise after that
        const set = findMoonEvent(nowUtc, lat, lon, 'set', 1440);
        const riseAfter = findMoonEvent(set ? set.getTime() : nowUtc, lat, lon, 'rise', 1440);
        return { rise: toLocal(riseAfter), set: toLocal(set), moonIsUp: true };
    } else {
        // Moon is currently down — find next rise, then next set after that
        const rise = findMoonEvent(nowUtc, lat, lon, 'rise', 1440);
        const setAfter = findMoonEvent(rise ? rise.getTime() : nowUtc, lat, lon, 'set', 1440);
        return { rise: toLocal(rise), set: toLocal(setAfter), moonIsUp: false };
    }
}

function findMoonEvent(startUtcMs, lat, lon, type, maxMinutes) {
    const startTime = new Date(startUtcMs);
    let prevAlt = moonAltitude(startTime, lat, lon);

    for (let m = 10; m <= maxMinutes; m += 10) {
        const t = new Date(startUtcMs + m * 60000);
        const alt = moonAltitude(t, lat, lon);

        if (type === 'rise' && prevAlt < -0.833 && alt >= -0.833) {
            const frac = (0 - prevAlt) / (alt - prevAlt);
            return new Date(startUtcMs + (m - 10 + frac * 10) * 60000);
        }
        if (type === 'set' && prevAlt >= -0.833 && alt < -0.833) {
            const frac = (0 - prevAlt) / (alt - prevAlt);
            return new Date(startUtcMs + (m - 10 + frac * 10) * 60000);
        }
        prevAlt = alt;
    }
    return null;
}

function moonAltitude(date, lat, lon) {
    const RAD = Math.PI / 180;

    // Julian date
    const JD = dateToJD(date);
    const T = (JD - 2451545.0) / 36525.0;

    // Moon ecliptic longitude (simplified)
    const L0 = 218.3165 + 481267.8813 * T;
    const M = 134.9634 + 477198.8676 * T;  // Moon mean anomaly
    const D = 297.8502 + 445267.1115 * T;  // Mean elongation
    const F = 93.2720 + 483202.0175 * T;   // Argument of latitude

    const Lm = L0 + 6.289 * Math.sin(M * RAD);
    const Bm = 5.128 * Math.sin(F * RAD);

    // Ecliptic to equatorial (simplified obliquity)
    const obliq = 23.439 - 0.0000004 * (JD - 2451545.0);
    const cosObl = Math.cos(obliq * RAD);
    const sinObl = Math.sin(obliq * RAD);

    const lRad = Lm * RAD;
    const bRad = Bm * RAD;

    const RA = Math.atan2(
        Math.sin(lRad) * cosObl - Math.tan(bRad) * sinObl,
        Math.cos(lRad)
    );
    const Dec = Math.asin(
        Math.sin(bRad) * cosObl + Math.cos(bRad) * sinObl * Math.sin(lRad)
    );

    // Hour angle
    const GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0);
    const LST = (GMST + lon) * RAD;
    const HA = LST - RA;

    // Altitude
    const sinAlt = Math.sin(lat * RAD) * Math.sin(Dec) +
                   Math.cos(lat * RAD) * Math.cos(Dec) * Math.cos(HA);

    return Math.asin(sinAlt) / RAD;
}

function dateToJD(date) {
    const Y = date.getUTCFullYear();
    const M = date.getUTCMonth() + 1;
    const D = date.getUTCDate() + date.getUTCHours() / 24 +
              date.getUTCMinutes() / 1440 + date.getUTCSeconds() / 86400;
    let y = Y, m = M;
    if (m <= 2) { y--; m += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + D + B - 1524.5;
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 86400000);
}

// --- Orchestrator ------------------------------------------------------------

let _lastLat = null, _lastLon = null, _lastCountry = null, _lastRegion = null;
// Per-day [sunrise, sunset] windows for the whole fetched forecast (10 days).
// Used for day/night icon selection. A single day's times aren't enough: the
// hourly strip crosses midnight, and comparing tomorrow-noon against today's
// sunset incorrectly flags it as night (moon icons at midday).
let _dailySun = [];

// Race-protection token for fetchAllWeatherData. Each new call increments this;
// in-flight render blocks check their captured token against the latest and bail
// out if a newer call has superseded them, preventing stale data from clobbering
// fresh UI on rapid location changes.
let weatherLoadToken = 0;

// Cached responses from the most recent successful fetch. Used by
// rerenderWeatherFromCache() so presentational toggles (units, 12H/24H, theme)
// can re-render without refetching from the network.
let _lastMeteoData = null;
let _lastAirQuality = null;
let _lastAlerts = null;
let _lastPickedLocation = null; // { lat, lon, country, region }

function isNightTime(date) {
    if (!_dailySun.length) return false;
    const t = date || new Date();
    // Daytime = inside any fetched day's [sunrise, sunset] window.
    // Daylight windows never overlap, and gaps between them are night.
    return !_dailySun.some(d => t >= d.rise && t <= d.set);
}

function isHourNight(hourStr) {
    return isNightTime(new Date(hourStr));
}

async function fetchAllWeatherData(lat, lon, country, region) {
    const myToken = ++weatherLoadToken;
    _lastLat = lat;
    _lastLon = lon;
    _lastCountry = country || _lastCountry || '';
    _lastRegion = region || _lastRegion || '';
    _lastPickedLocation = {
        lat,
        lon,
        country: _lastCountry,
        region: _lastRegion,
    };
    // Invalidate caches so toggles can't re-render with stale data while a
    // fresh fetch is still in flight.
    _lastMeteoData = null;
    _lastAirQuality = null;
    _lastAlerts = null;
    document.getElementById('alerts-section').hidden = true;
    document.getElementById('weather-summary').textContent = '';
    document.getElementById('current-section').innerHTML = `<div class="loading">${t('loading')}</div>`;
    document.getElementById('details-section').innerHTML = '';
    document.getElementById('hourly-section').innerHTML = '';
    document.getElementById('daily-section').innerHTML = '';
    document.getElementById('radar-section').innerHTML = `<h2>${t('radar')}</h2><div class="loading">${t('loading')}</div>`;
    document.getElementById('sun-section').innerHTML = '';
    document.getElementById('moon-section').innerHTML = '';

    // Fire all API calls in parallel, render each section as its data arrives

    // Weather data — renders most of the page
    const meteoPromise = fetchOpenMeteo(lat, lon).then(meteo => {
        // Bail if a newer fetchAllWeatherData call has superseded us
        if (myToken !== weatherLoadToken) return null;
        _lastMeteoData = meteo;
        // Stamp freshness only when the main payload actually landed —
        // a failed refresh keeps showing the honest (old) age.
        _lastFetchTime = Date.now();
        renderFreshness();
        _dailySun = (meteo.daily.sunrise || []).map((rise, i) => ({
            rise: new Date(rise),
            set: new Date(meteo.daily.sunset[i]),
        }));
        document.getElementById('weather-summary').textContent =
            generateSummary(meteo.current, meteo.hourly, meteo.daily);
        renderCurrent(meteo.current, null); // AQI added later when it arrives
        renderHourly(meteo.hourly);
        renderDaily(meteo.daily, meteo.hourly);
        renderSunMoon(meteo.daily, lat, lon, meteo.utc_offset_seconds);
        applySectionPreferences();
        return meteo;
    }).catch(() => {
        if (myToken !== weatherLoadToken) return null;
        document.getElementById('current-section').innerHTML =
            `<p class="error">${t('failedToLoadWeather')}</p>`;
        return null;
    });

    // AQI + Pollen — update current conditions and pollen when ready
    fetchAirQuality(lat, lon).then(airQuality => {
        if (myToken !== weatherLoadToken) return;
        _lastAirQuality = airQuality;
        meteoPromise.then(meteo => {
            if (myToken !== weatherLoadToken) return;
            if (meteo && airQuality) {
                renderCurrent(meteo.current, airQuality);
                applySectionPreferences();
            }
            renderPollen(airQuality, lat, lon);
            applySectionPreferences();
        });
    }).catch(() => {});

    // Alerts — render independently
    fetchAlerts(lat, lon, _lastCountry, _lastRegion).then(alerts => {
        if (myToken !== weatherLoadToken) return;
        _lastAlerts = alerts;
        renderAlerts(alerts);
        applySectionPreferences();
    }).catch(() => {});

    // Radar — render independently (has its own loading state)
    meteoPromise.then(() => {
        if (myToken !== weatherLoadToken) return;
        renderRadar(lat, lon);
        applySectionPreferences();
    });

    // Resolve when the main payload settles (meteoPromise never rejects —
    // its .catch returns null) so callers like the refresh button can tell
    // when the fetch finished. Secondary fetches keep streaming in after.
    await meteoPromise;
}

// Re-render weather UI from the cached responses captured by the most recent
// fetchAllWeatherData call. Used by presentational toggles (units, 12H/24H,
// theme) so they don't trigger redundant API calls. Radar is NOT re-rendered
// here — it has its own state and isn't a function of units/time-format.
function rerenderWeatherFromCache() {
    if (!_lastMeteoData || !_lastPickedLocation) return;
    const meteo = _lastMeteoData;
    const airQuality = _lastAirQuality;
    const alerts = _lastAlerts;
    const { lat, lon } = _lastPickedLocation;

    document.getElementById('weather-summary').textContent =
        generateSummary(meteo.current, meteo.hourly, meteo.daily);
    renderCurrent(meteo.current, airQuality);
    renderHourly(meteo.hourly);
    renderDaily(meteo.daily, meteo.hourly);
    renderSunMoon(meteo.daily, lat, lon, meteo.utc_offset_seconds);
    if (airQuality) {
        renderPollen(airQuality, lat, lon);
    }
    if (alerts !== null && alerts !== undefined) {
        renderAlerts(alerts);
    }
    applySectionPreferences();
}

// --- Navigation & Event Listeners --------------------------------------------

function showHome() {
    // Clear both CSS gates that hide #home-view. Without removing
    // data-seo-city, generated /cities/* pages keep #home-view forced to
    // display:none via CSS, so clicking Back would blank the screen (weather
    // view hidden by JS, home view still hidden by the SEO gate).
    document.documentElement.removeAttribute('data-auto-resume');
    document.documentElement.removeAttribute('data-seo-city');
    weatherView.hidden = true;
    homeView.hidden = false;
    searchInput.value = '';
    searchError.hidden = true;
}

// Show/hide the city-specific content that build-cities.js bakes into each
// generated /cities/* page (climate normals table + nearby-city links). These
// describe one fixed city, so they must be hidden as soon as the user views a
// different location. No-ops on the non-generated pages, which lack them.
function setSeoCityContentVisible(visible) {
    const climate = document.querySelector('.climate-block');
    if (climate) climate.hidden = !visible;
    const nearby = document.getElementById('nearby-cities');
    if (nearby) nearby.hidden = !visible;
}

function showWeather(location, query) {
    homeView.hidden = true;
    weatherView.hidden = false;
    // Hide the SEO blurb by default. On generated /cities/* pages it is
    // server-rendered visible and names a specific city, so it must not
    // survive into a different location the user searches for. initSeoCity()
    // calls this before renderSeoBlurb(), so the SEO path re-shows it.
    const blurb = document.getElementById('seo-blurb');
    if (blurb) blurb.hidden = true;
    // Same for the climate table and nearby-city links: both are baked into
    // the generated page for ONE city, so they'd otherwise linger under a
    // different location's forecast. initSeoCity() re-shows them.
    setSeoCityContentVisible(false);
    // Build location label: "City, Region" or "City, Country" if no region
    const secondary = location.region || location.country || '';
    let label = secondary ? `${location.name}, ${secondary}` : location.name;
    // Append postal code if the query looks like one
    const postalMatch = query && query.trim().match(/^[\dA-Z][\dA-Z\s\-]{2,}$/i);
    if (postalMatch) {
        label += ` (${query.trim()})`;
    }
    locationName.textContent = label;
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchError.hidden = true;
    searchForm.querySelector('button[type="submit"]').disabled = true;
    searchForm.querySelector('button[type="submit"]').textContent = t('searching');

    try {
        const location = await geocode(query);
        _lastLocationGeolocated = false;
        setUnitsForCountry(location.country);
        updateURL(query, location);
        showWeather(location, query);
        fetchAllWeatherData(location.lat, location.lon, location.country, location.region);
        saveLastLocation(query, location);
    } catch (err) {
        searchError.textContent = err.message;
        searchError.hidden = false;
    } finally {
        searchForm.querySelector('button[type="submit"]').disabled = false;
        searchForm.querySelector('button[type="submit"]').textContent = t('searchButton');
    }
});

// --- Geolocation ("Use my location") -----------------------------------------
// Privacy contract: only ever runs from an explicit user action (the pin
// button), or — when the autoLocate setting is on — on visits where the
// browser reports permission is ALREADY granted. It never prompts on page
// load. Coordinates are rounded to 2 decimals (~1.1 km) before leaving this
// function, so precise position is never stored, displayed, or sent anywhere.
const geolocateBtn = document.getElementById('geolocate-btn');

// Whether the location currently shown came from the geolocation API (rather
// than a search, a URL, or a city page). Refreshing a geolocated view re-reads
// the position itself — otherwise "My location" would keep pointing at
// wherever the user first pressed the pin (e.g. after a drive).
let _lastLocationGeolocated = false;

function locateAndLoad(opts) {
    opts = opts || {};
    return new Promise((resolve) => {
        const fallback = () => {
            // Refresh path: position unavailable right now — still give the
            // user fresh data for the last known spot rather than an error.
            if (opts.fallbackToLastCoords && _lastLat !== null) {
                resolve(fetchAllWeatherData(_lastLat, _lastLon, _lastCountry, _lastRegion));
            } else {
                resolve();
            }
        };
        if (!navigator.geolocation) {
            if (!opts.fallbackToLastCoords) {
                searchError.textContent = t('geoFailed');
                searchError.hidden = false;
            }
            fallback();
            return;
        }
        searchError.hidden = true;
        if (geolocateBtn) {
            geolocateBtn.disabled = true;
            geolocateBtn.classList.add('locating');
        }
        const done = () => {
            if (!geolocateBtn) return;
            geolocateBtn.disabled = false;
            geolocateBtn.classList.remove('locating');
        };
        navigator.geolocation.getCurrentPosition((pos) => {
            done();
            const lat = Math.round(pos.coords.latitude * 100) / 100;
            const lon = Math.round(pos.coords.longitude * 100) / 100;
            const location = { name: t('myLocation'), region: '', country: '', lat, lon, geolocated: true };
            _lastLocationGeolocated = true;
            // A geolocated fix has no country, so resolve units the same way a
            // later reload of this URL will (stored pref, else browser locale).
            // Without this the first locate keeps whatever units were already
            // active and a refresh could silently flip them.
            setUnitsForCountry('');
            updateURL('', location);
            showWeather(location, '');
            saveLastLocation('', location);
            resolve(fetchAllWeatherData(lat, lon, '', ''));
        }, (err) => {
            done();
            if (opts.fallbackToLastCoords) {
                fallback();
                return;
            }
            searchError.textContent = t(err.code === 1 ? 'geoDenied' : 'geoFailed');
            searchError.hidden = false;
            resolve();
        }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
    });
}

if (geolocateBtn) geolocateBtn.addEventListener('click', () => { locateAndLoad(); });

// Climate section dismiss (X). Writes the same showClimate setting the
// settings checkbox uses, so hiding it here leaves an obvious way to bring
// it back — unlike a one-way dismissal.
(function initClimateDismiss() {
    const btn = document.getElementById('climate-close');
    if (!btn) return; // not a generated city page, or no climate data
    btn.addEventListener('click', () => {
        try { localStorage.setItem('showClimate', 'false'); } catch (e) { /* private mode */ }
        applySettings();
    });
})();

// --- Data freshness ("Updated X ago" + refresh) -------------------------------
// _lastFetchTime is stamped inside fetchAllWeatherData when the main payload
// lands. The label re-renders every minute and on tab return; it turns amber
// (.stale) past 1 hour and red (.very-stale) past 6. Returning to the tab
// with data ≥30 min old triggers a silent refetch of the same location.
let _lastFetchTime = null;
const AUTO_REFRESH_AGE_MS = 30 * 60 * 1000;
const freshnessEl = document.getElementById('data-freshness');
const freshnessText = document.getElementById('freshness-text');
const refreshBtn = document.getElementById('refresh-btn');

function renderFreshness() {
    if (!freshnessEl || _lastFetchTime === null) return;
    const mins = Math.floor((Date.now() - _lastFetchTime) / 60000);
    let label;
    if (mins < 1) {
        label = t('updatedJustNow');
    } else {
        let rel;
        try {
            const rtf = new Intl.RelativeTimeFormat(getLocaleForDate(), { numeric: 'always' });
            rel = mins < 60 ? rtf.format(-mins, 'minute') : rtf.format(-Math.floor(mins / 60), 'hour');
        } catch (e) {
            rel = mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h`;
        }
        label = t('updatedAgo', { time: rel });
    }
    freshnessText.textContent = label;
    freshnessEl.classList.toggle('stale', mins >= 60 && mins < 360);
    freshnessEl.classList.toggle('very-stale', mins >= 360);
    freshnessEl.hidden = false;
}

function refreshWeather(opts) {
    opts = opts || {};
    if (_lastLat === null) return;
    if (refreshBtn) refreshBtn.classList.add('refreshing');
    const clear = () => { if (refreshBtn) refreshBtn.classList.remove('refreshing'); };
    if (_lastLocationGeolocated) {
        if (opts.userInitiated) {
            // Explicit refresh of "My location" re-reads the position — the
            // user may have moved since the pin was pressed.
            locateAndLoad({ fallbackToLastCoords: true }).finally(clear);
            return;
        }
        // Automatic refresh (tab return): only re-geolocate when the grant
        // already exists, so this path can never surface a permission prompt.
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then((status) => {
                if (status.state === 'granted') return locateAndLoad({ fallbackToLastCoords: true });
                return fetchAllWeatherData(_lastLat, _lastLon, _lastCountry, _lastRegion);
            }).catch(() => fetchAllWeatherData(_lastLat, _lastLon, _lastCountry, _lastRegion))
                .finally(clear);
            return;
        }
        // No Permissions API — fall through to a plain refetch rather than
        // risk prompting without a user action.
    }
    Promise.resolve(fetchAllWeatherData(_lastLat, _lastLon, _lastCountry, _lastRegion))
        .finally(clear);
}

if (refreshBtn) refreshBtn.addEventListener('click', () => refreshWeather({ userInitiated: true }));

function maybeAutoRefresh() {
    renderFreshness();
    if (_lastFetchTime !== null && _lastLat !== null &&
        Date.now() - _lastFetchTime >= AUTO_REFRESH_AGE_MS) {
        refreshWeather();
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') maybeAutoRefresh();
});

// Keep the "X ago" label current while the page sits open. Background tabs
// throttle timers, but the visibilitychange handler above catches up on return.
setInterval(renderFreshness, 60000);

// Auto-locate on bare visits — opt-in via the autoLocate setting, and only
// when the Permissions API confirms the grant already exists (so this path
// can never surface a permission prompt). Browsers without the Permissions
// API skip auto-locate entirely rather than risk prompting.
async function maybeAutoLocate() {
    if (!getSettingsBool('autoLocate')) return false;
    if (!geolocateBtn || !navigator.geolocation ||
        !navigator.permissions || !navigator.permissions.query) return false;
    let status;
    try {
        status = await navigator.permissions.query({ name: 'geolocation' });
    } catch (e) {
        return false;
    }
    if (status.state !== 'granted') return false;
    locateAndLoad();
    return true;
}

backBtn.addEventListener('click', () => {
    showHome();
    // Always return to the site root. Keeping location.pathname would leave a
    // /cities/<slug>/ URL in the bar while showing the search screen, so a
    // refresh would bounce back into that city page.
    history.pushState(null, '', '/');
});

document.getElementById('units-toggle').addEventListener('click', () => {
    toggleUnits();
    // Units are NOT purely presentational: Open-Meteo returns data in the
    // requested units (temperature_unit/wind_speed_unit/precipitation_unit),
    // so cached data is baked in the old units and must be refetched.
    // Re-rendering from cache would relabel 24°C as 24°F without converting.
    if (_lastPickedLocation) {
        const { lat, lon, country, region } = _lastPickedLocation;
        fetchAllWeatherData(lat, lon, country, region);
    }
});

document.getElementById('time-toggle').addEventListener('click', () => {
    units.time24h = !units.time24h;
    updateUnitsToggleLabel();
    saveUnitsPref();
    // Time format is presentational — re-render from cached data instead of refetching.
    rerenderWeatherFromCache();
});

// --- Layout Lock -------------------------------------------------------------

function applyLayoutLock() {
    const locked = localStorage.getItem('layoutLocked') === 'true';
    document.body.classList.toggle('layout-locked', locked);
    const btn = document.getElementById('lock-toggle');
    if (btn) {
        btn.textContent = locked ? '🔒' : '🔓';
        btn.title = locked ? t('unlockLayout') : t('lockLayout');
    }
}

document.getElementById('lock-toggle').addEventListener('click', () => {
    const locked = localStorage.getItem('layoutLocked') === 'true';
    localStorage.setItem('layoutLocked', !locked);
    applyLayoutLock();
});

applyLayoutLock();

// --- Settings Popover --------------------------------------------------------

function applySettings() {
    const showColors = getSettingsBool('showForecastColors');
    const showSupport = getSettingsBool('showSupportBtn');
    const showSummary = getSettingsBool('showWeatherSummary');

    // Forecast colors
    if (showColors) {
        updateDayBackgrounds();
    } else {
        document.querySelectorAll('.forecast-day').forEach(el => {
            el.style.background = 'transparent';
        });
    }

    // Support button
    const donateBtn = document.getElementById('donate-btn');
    if (donateBtn) donateBtn.style.display = showSupport ? '' : 'none';

    // Weather summary
    const summary = document.getElementById('weather-summary');
    if (summary) summary.style.display = showSummary ? '' : 'none';

    // Climate section (generated city pages only). Toggled via the <html>
    // attribute rather than an inline style so it matches the pre-paint gate
    // the city page's inline <head> script sets — one source of truth.
    document.documentElement.toggleAttribute('data-climate-hidden', !getSettingsBool('showClimate'));

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.style.display = getSettingsBool('showThemeToggle') ? '' : 'none';

    // Header toggle buttons
    const unitsBtn = document.getElementById('units-toggle');
    if (unitsBtn) unitsBtn.style.display = getSettingsBool('showUnitsBtn') ? '' : 'none';
    const timeBtn = document.getElementById('time-toggle');
    if (timeBtn) timeBtn.style.display = getSettingsBool('showTimeBtn') ? '' : 'none';
    const lockBtn = document.getElementById('lock-toggle');
    if (lockBtn) lockBtn.style.display = getSettingsBool('showLockBtn') ? '' : 'none';

    // NWS radar link
    const nwsLink = document.querySelector('.nws-radar-link');
    if (nwsLink) nwsLink.style.display = getSettingsBool('showNwsLink') ? '' : 'none';

    // "Show section" buttons bars
    const showSectionBtns = getSettingsBool('showSectionButtons');
    const sectionsBar = document.getElementById('hidden-sections-bar');
    if (sectionsBar) sectionsBar.style.display = showSectionBtns ? '' : 'none';
    const chartsBar = document.getElementById('hidden-charts-bar');
    if (chartsBar) chartsBar.style.display = showSectionBtns ? '' : 'none';

    // Re-render alerts from cache so toggling "always minimized" (or the
    // translate-link setting, which alerts also use) applies immediately
    // without waiting for the next fetch.
    if (_lastAlerts) renderAlerts(_lastAlerts);

    // Sync checkboxes
    document.querySelectorAll('#settings-popover input[data-setting]').forEach(cb => {
        cb.checked = getSettingsBool(cb.dataset.setting);
    });
}

// Toggle popover
document.getElementById('settings-toggle').addEventListener('click', () => {
    const popover = document.getElementById('settings-popover');
    popover.hidden = !popover.hidden;
});

// Close on outside click
document.addEventListener('click', (e) => {
    const popover = document.getElementById('settings-popover');
    if (!popover.hidden &&
        !popover.contains(e.target) &&
        e.target.id !== 'settings-toggle') {
        popover.hidden = true;
    }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('settings-popover').hidden = true;
});

// Checkbox handlers
document.querySelectorAll('#settings-popover input[data-setting]').forEach(cb => {
    cb.addEventListener('change', (e) => {
        localStorage.setItem(e.target.dataset.setting, e.target.checked);
        applySettings();
    });
});

// Revert to defaults
document.getElementById('settings-revert').addEventListener('click', () => {
    localStorage.setItem('showForecastColors', 'true');
    localStorage.setItem('showSupportBtn', 'true');
    localStorage.setItem('showWeatherSummary', 'true');
    localStorage.setItem('showThemeToggle', 'true');
    localStorage.setItem('showUnitsBtn', 'true');
    localStorage.setItem('showTimeBtn', 'true');
    localStorage.setItem('showLockBtn', 'true');
    localStorage.setItem('showNwsLink', 'true');
    localStorage.setItem('showSectionButtons', 'true');
    localStorage.setItem('showTranslateLink', 'true');
    localStorage.setItem('autoPlayRadar', 'false');
    localStorage.setItem('autoLocate', 'false');
    localStorage.setItem('showClimate', 'true');
    localStorage.setItem('rememberLastCity', 'true');
    localStorage.setItem('alertsMinimized', 'false');
    localStorage.removeItem('sectionPrefs');
    // Also un-dismiss any alerts the user hid — this is the escape hatch for
    // getting a dismissed alert back before it expires on its own.
    localStorage.removeItem(DISMISSED_ALERTS_KEY);
    applySettings();
    if (_lastLat !== null) {
        fetchAllWeatherData(_lastLat, _lastLon, _lastCountry, _lastRegion);
    }
});

// Apply on page load
applySettings();

// --- URL State ---------------------------------------------------------------

function updateURL(query, location) {
    const params = new URLSearchParams({ q: query });
    if (location) {
        params.set('lat', location.lat.toFixed(4));
        params.set('lon', location.lon.toFixed(4));
        params.set('name', location.name);
        params.set('region', location.region || '');
        params.set('country', location.country || '');
        if (location.geolocated) params.set('geo', '1');
    }
    // Push to the site root, not a bare `?…` (which resolves relative to the
    // current path). On a generated /cities/<slug>/ page a relative push would
    // produce /cities/los-angeles-ca/?lat=<somewhere-else>, so a refresh would
    // reload that city's page and its baked-in window._seoCity would drag the
    // user back to the wrong city.
    history.pushState(null, '', `/?${params}`);
}

function getLocationFromURL() {
    const params = new URLSearchParams(window.location.search);
    // If lat/lon are in the URL, use them directly (skip geocoding/picker)
    if (params.get('lat') && params.get('lon')) {
        const lat = parseFloat(params.get('lat'));
        const lon = parseFloat(params.get('lon'));
        // Validate range — reject NaN, infinity, or out-of-bounds coords
        if (Number.isFinite(lat) && Number.isFinite(lon) &&
            lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            return {
                query: params.get('q') || '',
                location: {
                    name: params.get('name') || '',
                    region: params.get('region') || '',
                    country: params.get('country') || '',
                    lat,
                    lon,
                    geolocated: params.get('geo') === '1',
                }
            };
        }
        // Fall through to query/hash handling on invalid coords
    }
    // Fallback to just query string
    if (params.get('q')) return { query: params.get('q'), location: null };
    if (window.location.hash.length > 1) return { query: decodeURIComponent(window.location.hash.slice(1)), location: null };
    return null;
}

// "Remember last city" — persists the last successfully loaded location and
// rehydrates it on bare visits to noadsweather.com. Uses the same shape as
// getLocationFromURL so loadFromURL can consume it without branching.
function saveLastLocation(query, location) {
    if (!location || !Number.isFinite(location.lat) || !Number.isFinite(location.lon)) return;
    try {
        localStorage.setItem('lastLocation', JSON.stringify({
            query: query || '',
            name: location.name || '',
            region: location.region || '',
            country: location.country || '',
            lat: location.lat,
            lon: location.lon,
            geolocated: location.geolocated === true,
        }));
    } catch (e) { /* quota / private mode — ignore */ }
}

function getLocationFromStorage() {
    let raw;
    try { raw = localStorage.getItem('lastLocation'); } catch (e) { return null; }
    if (!raw) return null;
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return null; }
    if (!parsed || typeof parsed !== 'object') return null;
    const lat = parseFloat(parsed.lat);
    const lon = parseFloat(parsed.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
    return {
        query: typeof parsed.query === 'string' ? parsed.query : '',
        location: {
            name: typeof parsed.name === 'string' ? parsed.name : '',
            region: typeof parsed.region === 'string' ? parsed.region : '',
            country: typeof parsed.country === 'string' ? parsed.country : '',
            lat,
            lon,
            geolocated: parsed.geolocated === true,
        }
    };
}

// SEO city landing page bootstrap. Generated /cities/* pages include an
// inline <script> setting window._seoCity = { lang, lat, lon, name, ... }.
// When present, we:
//   1. Force the UI language to the page's language IF the user has no
//      explicit language preference saved. Returning users with a preference
//      keep theirs (so the language picker works on city pages, and a
//      French-speaking user landing on /cities/lisboa/ from search isn't
//      forced into Portuguese on every visit).
//   2. Bootstrap directly into the weather view (skip home view).
//   3. Override the H1 with the translated city-page title.
//   4. Show the dismissible SEO blurb (unless already hidden).
//   5. Save lastLocation so auto-resume returns the user to this city.
// Returns true if SEO mode was activated, false otherwise.
function initSeoCity() {
    const seo = window._seoCity;
    if (!seo || typeof seo !== 'object') return false;
    // Validate the required fields. Bail silently if malformed.
    if (!seo.lang || !Number.isFinite(seo.lat) || !Number.isFinite(seo.lon) || !seo.name) {
        return false;
    }

    // 1. Language override (in-memory only — does not write to localStorage).
    //    Only applies if the user has no explicit preference. This makes the
    //    in-app language picker effective on city pages (after the picker
    //    writes to localStorage and reloads, hasExplicitPref is true, the
    //    override is skipped, and the user's pick wins). The HTML <title>
    //    and <meta description> are baked in at build time in the URL's
    //    language regardless — that's what Google indexes.
    const hasExplicitPref = !!localStorage.getItem('language');
    if (!hasExplicitPref && typeof setLanguageOverride === 'function') {
        setLanguageOverride(seo.lang);
    }

    // Re-run translations now that the language is set
    applyTranslations();

    // 2. Bootstrap weather view directly.
    //    Normalize the country code: cities.json uses ISO codes ("US"), but
    //    setUnitsForCountry and fetchAlerts compare against full names
    //    ("United States") to match what geocoding returns. Without this,
    //    every US SEO landing page would default to metric and route US
    //    alerts through OWM instead of NWS.
    const location = {
        name: seo.name,
        region: seo.region || '',
        country: normalizeCountry(seo.country),
        lat: seo.lat,
        lon: seo.lon,
    };
    setUnitsForCountry(location.country);
    showWeather(location, '');
    fetchAllWeatherData(location.lat, location.lon, location.country, location.region);
    saveLastLocation('', location);

    // 3. Override the H1 with translated city-page title
    const cityName = seo.displayName || seo.name;
    locationName.textContent = t('cityPageTitle', { city: cityName });

    // 4. Render the SEO blurb unless dismissed, and restore the baked-in
    //    climate + nearby-city blocks that showWeather() hides by default
    //    (they belong to exactly this city).
    renderSeoBlurb(cityName);
    setSeoCityContentVisible(true);

    // 5. Release the auto-resume gate (the inline <head> script may have set it)
    document.documentElement.removeAttribute('data-auto-resume');

    return true;
}

function renderSeoBlurb(cityName) {
    if (localStorage.getItem('hideCitySeoBlurb') === 'true') return;
    const el = document.getElementById('seo-blurb');
    const textEl = document.getElementById('seo-blurb-text');
    const linkEl = document.getElementById('seo-blurb-hide-link');
    const closeBtn = document.getElementById('seo-blurb-close');
    if (!el || !textEl || !linkEl || !closeBtn) return;

    textEl.textContent = t('cityPageSeoBlurb', { city: cityName });
    linkEl.textContent = t('cityPageHideBlurb');
    el.hidden = false;

    const dismiss = (e) => {
        if (e) e.preventDefault();
        localStorage.setItem('hideCitySeoBlurb', 'true');
        el.hidden = true;
    };
    closeBtn.addEventListener('click', dismiss);
    linkEl.addEventListener('click', dismiss);
}

async function loadFromURL() {
    let urlData = getLocationFromURL();
    // No URL params? Try the saved "last city" if the setting allows it.
    if (!urlData && getSettingsBool('rememberLastCity')) {
        urlData = getLocationFromStorage();
    }
    // Whether we resumed or not, the inline gate in <head> can now release.
    document.documentElement.removeAttribute('data-auto-resume');
    if (!urlData) return;

    if (urlData.location) {
        // Direct lat/lon — skip geocoding entirely
        _lastLocationGeolocated = urlData.location.geolocated === true;
        setUnitsForCountry(urlData.location.country);
        showWeather(urlData.location, urlData.query);
        fetchAllWeatherData(urlData.location.lat, urlData.location.lon, urlData.location.country, urlData.location.region);
        saveLastLocation(urlData.query, urlData.location);
    } else if (urlData.query) {
        searchInput.value = urlData.query;
        searchForm.dispatchEvent(new Event('submit'));
    }
}

window.addEventListener('popstate', () => {
    const urlData = getLocationFromURL();
    if (urlData) {
        loadFromURL();
    } else {
        showHome();
    }
});

// Apply visual style and translations before any rendering
applyStyle(getCurrentStyle());
applyTranslations();

// Wire up the Style dropdown in the settings popover
(function initStyleSelector() {
    const sel = document.getElementById('setting-style');
    if (!sel) return;
    sel.value = getCurrentStyle();
    sel.addEventListener('change', () => {
        const newStyle = sel.value;
        localStorage.setItem('style', newStyle);
        applyStyle(newStyle);
    });
})();

// Load from URL on page load.
// An explicit location in the URL (?lat/?lon or ?q) always wins — including on
// a generated /cities/* page, where the baked-in window._seoCity would
// otherwise override a link the user actually followed. Otherwise: SEO landing
// page, then opt-in auto-locate (permission already granted), then last city.
if (getLocationFromURL()) {
    loadFromURL();
} else if (!initSeoCity()) {
    (async () => {
        if (await maybeAutoLocate()) {
            // Auto-locating — release the <head> auto-resume gate ourselves
            // since loadFromURL (which normally does it) won't run.
            document.documentElement.removeAttribute('data-auto-resume');
            return;
        }
        loadFromURL();
    })();
}

// Init drag-to-reorder (event delegation, works across re-renders)
initSectionDrag();
initChartDrag();

// --- Language UI -------------------------------------------------------------

(function initLanguageUI() {
    const langBtn = document.getElementById('language-btn');
    const langPopover = document.getElementById('language-popover');
    const langList = document.getElementById('language-list');
    const settingsPopover = document.getElementById('settings-popover');
    if (!langBtn || !langPopover || !langList) return;

    const curLang = getCurrentLang();

    // Button text: "Language: [flag(s)] <lang name>"
    let btnFlagHtml;
    if (curLang === 'en') {
        btnFlagHtml = `<img src="/img/flags/en.png" class="lang-btn-flag" alt="US"><img src="/img/flags/gb.png" class="lang-btn-flag" alt="UK">`;
    } else if (curLang === 'pt') {
        btnFlagHtml = `<img src="/img/flags/pt-br.png" class="lang-btn-flag" alt="BR"><img src="/img/flags/pt-eu.png" class="lang-btn-flag" alt="PT">`;
    } else {
        btnFlagHtml = `<img src="${LANGUAGE_FLAGS[curLang]}" class="lang-btn-flag" alt="">`;
    }
    langBtn.innerHTML = `${t('language')}: ${btnFlagHtml} ${LANGUAGE_NAMES[curLang] || 'English'}`;

    // Radio list with flags
    langList.innerHTML = Object.entries(LANGUAGE_NAMES).map(([code, name]) => {
        const checked = code === curLang ? 'checked' : '';
        let flagHtml;
        if (code === 'en') {
            flagHtml = `<span class="lang-flags"><img src="/img/flags/en.png" alt="US"><img src="/img/flags/gb.png" alt="UK"></span>`;
        } else if (code === 'pt') {
            flagHtml = `<span class="lang-flags"><img src="/img/flags/pt-br.png" alt="BR"><img src="/img/flags/pt-eu.png" alt="PT"></span>`;
        } else {
            flagHtml = `<img class="lang-flag" src="${LANGUAGE_FLAGS[code]}" alt="">`;
        }
        return `<label class="language-option">
            <input type="radio" name="language" value="${code}" ${checked}>
            ${flagHtml}
            <span class="lang-name">${name}</span>
        </label>`;
    }).join('');

    // Open language popover (close settings popover)
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (settingsPopover) settingsPopover.hidden = true;
        langPopover.hidden = !langPopover.hidden;
    });

    document.addEventListener('click', (e) => {
        if (!langPopover.hidden && !langPopover.contains(e.target) && e.target !== langBtn) {
            langPopover.hidden = true;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !langPopover.hidden) langPopover.hidden = true;
    });

    langList.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) setLanguage(radio.value);
        });
    });
})();

// --- PWA Manifest (dynamic start_url) ----------------------------------------

(function () {
    const manifest = {
        name: 'NoAdsWeather',
        short_name: 'Weather',
        description: t('tagline'),
        start_url: window.location.href,
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
    };
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = URL.createObjectURL(blob);
    document.head.appendChild(link);
})();

// --- Dark Mode ---------------------------------------------------------------

(function () {
    const toggle = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('theme');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
        updateDayBackgrounds();
        applySettings();
        // Re-render weather from cache so any theme-dependent rendering (e.g.
        // colors in renderDaily) refreshes without a network refetch.
        rerenderWeatherFromCache();
        // NOTE: We intentionally do NOT call renderRadar here. The radar's
        // CartoDB basemap will keep its previous theme until the next manual
        // refresh or location change. Accepted trade-off — avoids a full
        // radar API refetch (RainViewer + NoAdsRadar) on every theme toggle.
    }

    // Initialize: use stored preference, fall back to OS preference
    if (stored) {
        setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
})();

// --- Privacy Panel -----------------------------------------------------------

function togglePrivacy() {
    const panel = document.getElementById('privacy-panel');
    panel.hidden = !panel.hidden;
}

document.getElementById('privacy-toggle-home').addEventListener('click', togglePrivacy);
document.getElementById('privacy-toggle-weather').addEventListener('click', togglePrivacy);
document.getElementById('privacy-close').addEventListener('click', () => {
    document.getElementById('privacy-panel').hidden = true;
});

document.addEventListener('click', (e) => {
    const panel = document.getElementById('privacy-panel');
    if (!panel.hidden &&
        !panel.contains(e.target) &&
        e.target.id !== 'privacy-toggle-home' &&
        e.target.id !== 'privacy-toggle-weather') {
        panel.hidden = true;
    }
});
