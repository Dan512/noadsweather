// NoAdsWeather translations — Swedish (sv).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "sv". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.sv = {
        // UI
        currentConditions: 'Aktuella förhållanden',
        hourlyForecast: 'Timprognos',
        tenDayForecast: '10-dagarsprognos',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Sol',
        moon: 'Måne',
        weatherAlerts: '⚠️ Vädervarningar',
        translateAlert: 'Översätt',
        searchPlaceholder: 'Ange stad eller postnummer',
        searchButton: 'Sök',
        back: '← Tillbaka',
        privacyCookies: 'Integritet',
        about: 'Om',
        supportThisSite: 'Stöd denna sida',
        showMore: 'Visa mer',
        showLess: 'Visa mindre',
        lockLayout: 'Lås layout',
        unlockLayout: 'Lås upp layout',
        settings: 'Inställningar',
        restoreDefaultLayout: 'Återställ standardlayout',
        seePollenData: 'Se pollendata',
        feelsLike: 'Känns som',
        humidity: 'Luftfuktighet',
        dewPoint: 'Daggpunkt',
        wind: 'Vind',
        gusts: 'Vindbyar',
        airQuality: 'Luftkvalitet',
        uvIndex: 'UV-index',
        nwsRadarLink: 'NWS-radar ↗',
        language: 'Språk',

        // Style names
        style: 'Stil',
        styleDefault: 'Standard',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Lugn',

        machineTranslationNotice: 'Översättningar av gränssnittet är maskingenererade och kanske inte är perfekta.',

        // Settings labels
        settingForecastColors: 'Visa färgbakgrunder i 10-dagarsprognosen',
        settingSupportBtn: 'Visa irriterande stödknapp',
        settingWeatherSummary: 'Visa vädersammanfattning',
        settingThemeToggle: 'Visa knappen Ljust läge / Mörkt läge',
        settingUnitsBtn: 'Visa knappen °C / °F',
        settingTimeBtn: 'Visa knappen 12H / 24H',
        settingLockBtn: 'Visa knappen Lås / Lås upp',
        settingNwsLink: 'Visa länk till NWS-radar',
        settingShowSectionButtons: 'Visa "Visa sektion"-knappar när sektioner är dolda',
        settingTranslateLink: 'Visa översättningslänk för varningar',
        settingAutoPlayRadar: 'Spela alltid upp radar automatiskt',
        settingRememberCity: 'Kom ihåg senaste stad',
        cityPageTitle: 'Väder {city} utan reklam',
        cityPageSeoBlurb: 'Väderprognos för {city} utan reklam, cookies eller spårning. Open-Meteo-data, 10-dagarsprognos, timvis förhållanden och radar — allt gratis.',
        cityPageHideBlurb: 'klicka här för att dölja',
        cities: 'Städer',
        popularCities: 'Populära städer',
        nearbyCities: 'Städer i närheten',
        useMyLocation: 'Använd min plats',
        myLocation: 'Min plats',
        geoDenied: 'Platsåtkomst nekades — du kan söka efter din stad istället.',
        geoFailed: 'Kunde inte fastställa din plats — försök söka efter din stad.',
        settingAutoLocate: 'Använd min plats automatiskt vid varje besök',
        refresh: 'Uppdatera',
        updatedJustNow: 'Uppdaterades nyss',
        updatedAgo: 'Uppdaterades {time}',

        // Weather codes
        wc0: 'Klar himmel',
        wc1: 'Huvudsakligen klart',
        wc2: 'Delvis molnigt',
        wc3: 'Mulet',
        wc45: 'Dimma',
        wc48: 'Dimfrost',
        wc51: 'Lätt duggregn',
        wc53: 'Måttligt duggregn',
        wc55: 'Tätt duggregn',
        wc61: 'Lätt regn',
        wc63: 'Måttligt regn',
        wc65: 'Kraftigt regn',
        wc71: 'Lätt snöfall',
        wc73: 'Måttligt snöfall',
        wc75: 'Kraftigt snöfall',
        wc77: 'Snökorn',
        wc80: 'Lätta regnskurar',
        wc81: 'Måttliga regnskurar',
        wc82: 'Häftiga regnskurar',
        wc85: 'Lätta snöbyar',
        wc86: 'Kraftiga snöbyar',
        wc95: 'Åskväder',
        wc96: 'Åskväder med lätt hagel',
        wc99: 'Åskväder med kraftigt hagel',
        wcUnknown: 'Okänt',

        // Temp adjectives
        sumTempFreezing: 'Det är iskallt',
        sumTempCold: 'Det är kallt',
        sumTempCool: 'Det är svalt',
        sumTempMild: 'Det är',
        sumTempWarm: 'Det är varmt',
        sumTempHot: 'Det är hett',

        // Opening template
        sumOpeningTemplate: '{tempAdj} vid {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (känns som {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' med åskväder',
        sumConditionSnowing: ' och snöar',
        sumConditionRaining: ' och regnar',
        sumConditionRainingWithAmount: ' och regnar ({amount} väntas idag)',
        sumConditionRainingWithAmountClearingBy: ' och regnar ({amount} väntas idag), klarnar upp runt {hour}',
        sumConditionRainSoon: ' med regn väntat mycket snart',
        sumConditionRainLikelyAround: ' med troligt regn runt {hour}',
        sumConditionClearSkies: ' med klar himmel',
        sumConditionCloudy: ' och molnigt',

        // Follow-up sentences
        sumTodayHigh: 'Högsta temperatur {high}{unit} idag',
        sumTomorrowRainWithAmount: 'Regn väntas imorgon ({amount})',
        sumTomorrowSnowWithAmount: 'Snö väntas imorgon ({amount})',
        sumTomorrowRainNoAmount: 'Regn väntas imorgon',
        sumTomorrowWarming: 'stiger till {high}{unit} imorgon',
        sumTomorrowCooling: 'sjunker till {high}{unit} imorgon',

        // UV Index levels
        uvLow: '(Låg)',
        uvModerate: '(Måttlig)',
        uvHigh: '(Hög)',
        uvVeryHigh: '(Mycket hög)',
        uvExtreme: '(Extrem)',

        // Loading / unavailable messages
        loading: 'Laddar...',
        loadingRadar: 'Laddar radar...',
        refreshingRadar: 'Uppdaterar radar...',
        radarUnavailable: 'Radar ej tillgänglig',
        pollenDataUnavailable: 'Pollendata ej tillgänglig för denna plats',

        // Astronomy labels
        sunrise: 'Soluppgång',
        sunset: 'Solnedgång',
        solarNoon: 'Solmiddag',
        moonrise: 'Månuppgång',
        moonset: 'Månnedgång',
        phase: 'Fas',

        // Moon phase names
        moonPhaseNewMoon: 'Nymåne',
        moonPhaseWaxingCrescent: 'Växande skära',
        moonPhaseFirstQuarter: 'Första kvarteret',
        moonPhaseWaxingGibbous: 'Växande måne',
        moonPhaseFullMoon: 'Fullmåne',
        moonPhaseWaningGibbous: 'Avtagande måne',
        moonPhaseLastQuarter: 'Sista kvarteret',
        moonPhaseWaningCrescent: 'Avtagande skära',

        // Chart legends
        chartTemperature: 'Temperatur',
        chartFeelsLike: 'Känns som',
        chartDewPoint: 'Daggpunkt',
        chartCloudCover: 'Molnighet',
        chartPrecipChance: 'Nederbörd. chans',
        chartHumidity: 'Luftfuktighet',
        chartPressure: 'Lufttryck',
        chartPrecipAccum: 'Nederbörd tot.',
        chartHourlyPrecip: 'Nederbörd per timme',
        chartWindSpeed: 'Vindhastighet',
        chartWindGusts: 'Vindbyar',

        // Section controls
        dragToReorder: 'Dra för att ordna om',
        moveUp: 'Flytta upp',
        moveDown: 'Flytta ner',
        singleColumn: 'En kolumn',
        fullWidth: 'Full bredd',
        removeSection: 'Ta bort sektion',
        minimizeSection: 'Minimera sektion',
        hideChart: 'Dölj diagram',

        // Radar controls
        refreshRadar: 'Uppdatera radar',
        pauseRadar: 'Pausa',
        playRadar: 'Spela',
        // Radar progress / forecast labels
        forecastLabel: 'PROGNOS',
        radarNow: 'NU',
        slowerRadar: 'Långsammare',
        fasterRadar: 'Snabbare',

        // Show prefix
        showSectionPrefix: 'Visa {name}',

        // Tagline
        tagline: 'Väder utan krångel.',

        // AQI severity
        aqiGood: 'Bra',
        aqiModerate: 'Måttlig',
        aqiUnhealthyForSensitive: 'Ohälsosam för känsliga grupper',
        aqiUnhealthy: 'Ohälsosam',
        aqiVeryUnhealthy: 'Mycket ohälsosam',
        aqiHazardous: 'Farlig',

        // Pollen levels
        pollenLow: 'Låg',
        pollenLowMed: 'Låg-Medium',
        pollenMedium: 'Medium',
        pollenHigh: 'Hög',
        pollenVeryHigh: 'Mycket hög',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Söker...',
        didYouMean: 'Menade du:',
        locationNotFound: 'Plats hittades inte. Försök med en annan stad eller postnummer.',
        failedToLoadWeather: 'Det gick inte att läsa in väderdata. Försök igen.',
        retry: 'Försök igen',
        hide: 'Dölj',
        close: 'Stäng',
        toggleTheme: 'Växla mörkt läge',
        backToSearch: 'Tillbaka till sökning'
};
