// CONTRACT: This file must remain top-level side-effect-free. No DOM access,
// no event listeners, no global mutations outside the explicit declarations
// (TRANSLATIONS, LANGUAGE_FLAGS, getCurrentLang, getLocaleForDate, t,
// setLanguage, setLanguageOverride). The build script (scripts/build-cities.js)
// loads this file (plus every js/i18n/*.js language file) in a Node context
// via `new Function(...)` to extract translations at build time. Anything that
// touches `window`, `document`, or `navigator` at top level will throw under Node.
//
// Lazy access inside function bodies (e.g. navigator.language inside
// getCurrentLang) is fine — those functions just aren't called by the build.

// =============================================================================
// NoAdsWeather - i18n.js
// Internationalization core: helpers + English (the permanent fallback).
// The other 14 languages live in js/i18n/{lang}.js — each registers itself as
// TRANSLATIONS.<lang> and is loaded on demand by the inline loader in each
// page's HTML, so visitors download at most one language beyond English.
// =============================================================================

const TRANSLATIONS = {
    en: {
        // UI
        currentConditions: 'Current Conditions',
        hourlyForecast: 'Hourly Forecast',
        tenDayForecast: '10-Day Forecast',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Sun',
        moon: 'Moon',
        weatherAlerts: '⚠️ Weather Alerts',
        translateAlert: 'Translate',
        searchPlaceholder: 'Enter city or zip code',
        searchButton: 'Search',
        back: '← Back',
        privacyCookies: 'Privacy',
        about: 'About',
        supportThisSite: 'Support this site',
        showMore: 'Show more',
        showLess: 'Show less',
        lockLayout: 'Lock layout',
        unlockLayout: 'Unlock layout',
        settings: 'Settings',
        restoreDefaultLayout: 'Restore Default Layout',
        seePollenData: 'See pollen data',
        feelsLike: 'Feels like',
        humidity: 'Humidity',
        dewPoint: 'Dew Point',
        wind: 'Wind',
        gusts: 'Gusts',
        airQuality: 'Air Quality',
        uvIndex: 'UV Index',
        nwsRadarLink: 'NWS radar ↗',
        language: 'Language',

        // Style names
        style: 'Style',
        styleDefault: 'Default',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Quiet',

        machineTranslationNotice: 'UI translations are machine-generated and may not be perfect.',

        // Settings labels
        settingForecastColors: 'Show color backgrounds on 10-day forecast',
        settingSupportBtn: 'Show Annoying Support Button',
        settingWeatherSummary: 'Show weather summary',
        settingThemeToggle: 'Show Light Mode / Dark Mode button',
        settingUnitsBtn: 'Show °C / °F button',
        settingTimeBtn: 'Show 12H / 24H button',
        settingLockBtn: 'Show Lock / Unlock button',
        settingNwsLink: 'Show NWS Radar link',
        settingShowSectionButtons: 'Show "Show section" buttons when sections are hidden',
        settingTranslateLink: 'Show alert translation link',
        settingAlertsMinimized: 'Always show weather alerts minimized',
        dismissAlert: 'Dismiss alert',
        settingAutoPlayRadar: 'Always auto-play radar',
        settingRememberCity: 'Remember last city',
        cityPageTitle: '{city} Weather with No Ads',
        cityPageSeoBlurb: 'Get the {city} weather forecast without ads, cookies, or tracking. Open-Meteo data, 10-day forecast, hourly conditions, and radar — all free.',
        cityPageHideBlurb: 'click here to hide this',
        cities: 'Cities',
        popularCities: 'Popular cities',
        nearbyCities: 'Nearby cities',
        useMyLocation: 'Use my location',
        myLocation: 'My location',
        geoDenied: 'Location access was denied — you can search for your city instead.',
        geoFailed: 'Couldn’t determine your location — try searching for your city.',
        settingAutoLocate: 'Use my location automatically on each visit',

        // Share card
        share: 'Share',
        shareTitle: 'Share forecast',
        share5Day: '5-day forecast',
        share7Day: '7-day forecast',
        shareIncludeCurrent: 'Include current conditions',
        shareIncludePollen: 'Include pollen',
        shareEmoji: 'Add a reaction',
        shareEmojiNone: 'None',
        shareCreate: 'Create image',
        shareShareBtn: 'Share',
        shareDownload: 'Download',
        shareCopyLink: 'Copy link',
        shareLinkCopied: 'Copied!',
        shareGenerating: 'Creating image...',
        shareFailed: 'Could not create the image',
        shareShareFailed: 'Could not share the image',
        shareCopyFailed: 'Could not copy the link',
        settingShareBtn: 'Show Share button',

        refresh: 'Refresh',
        updatedJustNow: 'Updated just now',
        updatedAgo: 'Updated {time}',
        climateHeading: 'Climate in {city}',
        climateMonth: 'Month',
        climateHigh: 'High',
        climateLow: 'Low',
        climatePrecip: 'Precip',
        climateWetDays: 'Wet days',
        climateSummary: '{hotMonth} is the hottest month in {city}, with an average high of {hotTemp}; {coldMonth} is the coldest ({coldTemp}). {wetMonth} is the wettest month, averaging {wetAmount} of precipitation.',
        climateRecords: 'Extremes since {year}: highest {high} ({highDate}), lowest {low} ({lowDate}).',
        climateDaylight: 'Daylight lasts about {long} hours in {longMonth} and {short} hours in {shortMonth}.',
        climateSource: 'Data: Meteostat — {station}, {period} averages.',
        hide: 'Hide',
        settingShowClimate: 'Show climate averages on city pages',
        notFoundTitle: 'Page not found',
        notFoundBlurb: 'That page doesn’t exist — but the weather does. Search for your city:',

        // Weather codes (WMO)
        wc0: 'Clear sky',
        wc1: 'Mainly clear',
        wc2: 'Partly cloudy',
        wc3: 'Overcast',
        wc45: 'Foggy',
        wc48: 'Depositing rime fog',
        wc51: 'Light drizzle',
        wc53: 'Moderate drizzle',
        wc55: 'Dense drizzle',
        wc61: 'Slight rain',
        wc63: 'Moderate rain',
        wc65: 'Heavy rain',
        wc71: 'Slight snow',
        wc73: 'Moderate snow',
        wc75: 'Heavy snow',
        wc77: 'Snow grains',
        wc80: 'Slight rain showers',
        wc81: 'Moderate rain showers',
        wc82: 'Violent rain showers',
        wc85: 'Slight snow showers',
        wc86: 'Heavy snow showers',
        wc95: 'Thunderstorm',
        wc96: 'Thunderstorm with slight hail',
        wc99: 'Thunderstorm with heavy hail',
        wcUnknown: 'Unknown',

        // Weather summary — temp adjectives
        sumTempFreezing: "It's freezing",
        sumTempCold: "It's cold",
        sumTempCool: "It's cool",
        sumTempMild: "It's",
        sumTempWarm: "It's warm",
        sumTempHot: "It's hot",

        // Opening template
        sumOpeningTemplate: '{tempAdj} at {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (feels like {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' with thunderstorms',
        sumConditionSnowing: ' and snowing',
        sumConditionRaining: ' and raining',
        sumConditionRainingWithAmount: ' and raining ({amount} expected today)',
        sumConditionRainingWithAmountClearingBy: ' and raining ({amount} expected today), clearing around {hour}',
        sumConditionRainSoon: ' with rain expected very soon',
        sumConditionRainLikelyAround: ' with rain likely around {hour}',
        sumConditionClearSkies: ' with clear skies',
        sumConditionCloudy: ' and cloudy',

        // Follow-up sentences
        sumTodayHigh: 'High of {high}{unit} today',
        sumTomorrowRainWithAmount: 'Rain expected tomorrow ({amount})',
        sumTomorrowSnowWithAmount: 'Snow expected tomorrow ({amount})',
        sumTomorrowRainNoAmount: 'Rain expected tomorrow',
        sumTomorrowWarming: 'warming up to {high}{unit} tomorrow',
        sumTomorrowCooling: 'cooling to {high}{unit} tomorrow',

        // UV Index levels
        uvLow: '(Low)',
        uvModerate: '(Moderate)',
        uvHigh: '(High)',
        uvVeryHigh: '(Very High)',
        uvExtreme: '(Extreme)',

        // Loading / unavailable messages
        loading: 'Loading...',
        loadingRadar: 'Loading radar...',
        refreshingRadar: 'Refreshing radar...',
        radarUnavailable: 'Radar unavailable',
        pollenDataUnavailable: 'Pollen data unavailable for this location',

        // Astronomy section labels
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        solarNoon: 'Solar Noon',
        moonrise: 'Moonrise',
        moonset: 'Moonset',
        phase: 'Phase',

        // Moon phase names
        moonPhaseNewMoon: 'New Moon',
        moonPhaseWaxingCrescent: 'Waxing Crescent',
        moonPhaseFirstQuarter: 'First Quarter',
        moonPhaseWaxingGibbous: 'Waxing Gibbous',
        moonPhaseFullMoon: 'Full Moon',
        moonPhaseWaningGibbous: 'Waning Gibbous',
        moonPhaseLastQuarter: 'Last Quarter',
        moonPhaseWaningCrescent: 'Waning Crescent',

        // Chart legends (10-day forecast)
        chartTemperature: 'Temperature',
        chartFeelsLike: 'Feels Like',
        chartDewPoint: 'Dew Point',
        chartCloudCover: 'Cloud Cover',
        chartPrecipChance: 'Precip Chance',
        chartHumidity: 'Humidity',
        chartPressure: 'Pressure',
        chartPrecipAccum: 'Precip Accum.',
        chartHourlyPrecip: 'Hourly Precip',
        chartWindSpeed: 'Wind Speed',
        chartWindGusts: 'Wind Gusts',

        // Section controls
        dragToReorder: 'Drag to reorder',
        moveUp: 'Move up',
        moveDown: 'Move down',
        singleColumn: 'Single column',
        fullWidth: 'Full width',
        removeSection: 'Remove section',
        minimizeSection: 'Minimize section',
        hideChart: 'Hide chart',

        // Radar controls
        refreshRadar: 'Refresh radar',
        pauseRadar: 'Pause',
        playRadar: 'Play',
        // Radar progress / forecast labels
        forecastLabel: 'FORECAST',
        radarNow: 'NOW',
        slowerRadar: 'Slower',
        fasterRadar: 'Faster',

        // Show prefix for restoring hidden sections
        showSectionPrefix: 'Show {name}',

        // Home page tagline
        tagline: 'Weather without the clutter.',

        // Air quality severity labels
        aqiGood: 'Good',
        aqiModerate: 'Moderate',
        aqiUnhealthyForSensitive: 'Unhealthy for Sensitive Groups',
        aqiUnhealthy: 'Unhealthy',
        aqiVeryUnhealthy: 'Very Unhealthy',
        aqiHazardous: 'Hazardous',

        // Pollen level labels
        pollenLow: 'Low',
        pollenLowMed: 'Low-Medium',
        pollenMedium: 'Medium',
        pollenHigh: 'High',
        pollenVeryHigh: 'Very High',

        // Misc short labels
        highTemp: 'High',
        lowTemp: 'Low',

        // Search / errors / aria-labels
        searching: 'Searching...',
        didYouMean: 'Did you mean:',
        locationNotFound: 'Location not found. Try a different city or zip code.',
        failedToLoadWeather: 'Failed to load weather data. Please try again.',
        retry: 'Retry',
        hide: 'Hide',
        close: 'Close',
        toggleTheme: 'Toggle dark mode',
        backToSearch: 'Back to search'
    },

};

const LANGUAGE_NAMES = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    nl: 'Nederlands',
    pl: 'Polski',
    sv: 'Svenska',
    ru: 'Русский',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी'
};

const LANGUAGE_FLAGS = {
    en: '/img/flags/en.png',
    es: '/img/flags/es.png',
    fr: '/img/flags/fr.png',
    de: '/img/flags/de.png',
    it: '/img/flags/it.png',
    pt: '/img/flags/pt-br.png',
    nl: '/img/flags/nl.png',
    pl: '/img/flags/pl.png',
    sv: '/img/flags/sv.png',
    ru: '/img/flags/ru.png',
    ja: '/img/flags/ja.png',
    zh: '/img/flags/zh.png',
    ko: '/img/flags/ko.png',
    ar: '/img/flags/ar.png',
    hi: '/img/flags/hi.png'
};

// Per-page-load language override. Used by SEO city landing pages to
// force the page's language without writing to localStorage (preserving
// the user's saved preference for their next bare visit).
let _languageOverride = null;

// Languages the site ships translations for. Deliberately derived from the
// static LANGUAGE_NAMES map rather than Object.keys(TRANSLATIONS): only
// English is loaded up front, so TRANSLATIONS can't be used to validate a
// language before its js/i18n/{lang}.js file has been pulled in.
const SUPPORTED_LANGS = Object.keys(LANGUAGE_NAMES);

function setLanguageOverride(lang) {
    if (lang && SUPPORTED_LANGS.includes(lang)) {
        _languageOverride = lang;
    }
}

function getCurrentLang() {
    if (_languageOverride) return _languageOverride;
    const stored = localStorage.getItem('language');
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(browser) ? browser : 'en';
}

// Returns a richer locale tag for date formatting, e.g. en-GB / fr-CA /
// es-MX, when the browser's locale base matches the UI language. Falls
// back to the plain UI language otherwise. This lets a UK English user
// see 15/05 instead of 5/15 without needing to change the UI language.
function getLocaleForDate() {
    const ui = getCurrentLang();
    const nav = navigator.language || '';
    const navBase = nav.slice(0, 2).toLowerCase();
    if (navBase === ui && nav.length > 2) return nav;
    return ui;
}

function t(key, vars) {
    const lang = getCurrentLang();
    let str = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
    if (vars && typeof str === 'string') {
        for (const [k, v] of Object.entries(vars)) {
            str = str.replaceAll(`{${k}}`, v);
        }
    }
    return str;
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    _languageOverride = null;  // user picked explicitly; URL override no longer applies
    location.reload();
}
