// NoAdsWeather translations — German (de).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "de". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.de = {
        // UI
        currentConditions: 'Aktuelle Bedingungen',
        hourlyForecast: 'Stündliche Vorhersage',
        tenDayForecast: '10-Tage-Vorhersage',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Sonne',
        moon: 'Mond',
        weatherAlerts: '⚠️ Wetterwarnungen',
        translateAlert: 'Übersetzen',
        searchPlaceholder: 'Stadt oder Postleitzahl eingeben',
        searchButton: 'Suchen',
        back: '← Zurück',
        privacyCookies: 'Datenschutz',
        about: 'Über uns',
        supportThisSite: 'Diese Seite unterstützen',
        showMore: 'Mehr anzeigen',
        showLess: 'Weniger anzeigen',
        lockLayout: 'Layout sperren',
        unlockLayout: 'Layout entsperren',
        settings: 'Einstellungen',
        restoreDefaultLayout: 'Standardlayout wiederherstellen',
        seePollenData: 'Pollendaten anzeigen',
        feelsLike: 'Gefühlt',
        humidity: 'Luftfeuchtigkeit',
        dewPoint: 'Taupunkt',
        wind: 'Wind',
        gusts: 'Böen',
        airQuality: 'Luftqualität',
        uvIndex: 'UV-Index',
        nwsRadarLink: 'NWS-Radar ↗',
        language: 'Sprache',

        // Style names
        style: 'Stil',
        styleDefault: 'Standard',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Ruhig',

        machineTranslationNotice: 'Die Übersetzungen der Benutzeroberfläche sind maschinell erstellt und möglicherweise nicht perfekt.',

        // Settings labels
        settingForecastColors: 'Farbige Hintergründe in der 10-Tage-Vorhersage anzeigen',
        settingSupportBtn: 'Nervigen Unterstützungsbutton anzeigen',
        settingWeatherSummary: 'Wetterzusammenfassung anzeigen',
        settingThemeToggle: 'Hell-/Dunkelmodus-Schaltfläche anzeigen',
        settingUnitsBtn: '°C / °F-Schaltfläche anzeigen',
        settingTimeBtn: '12H / 24H-Schaltfläche anzeigen',
        settingLockBtn: 'Sperren/Entsperren-Schaltfläche anzeigen',
        settingNwsLink: 'NWS-Radar-Link anzeigen',
        settingShowSectionButtons: '"Bereich anzeigen"-Schaltflächen anzeigen, wenn Bereiche ausgeblendet sind',
        settingTranslateLink: 'Übersetzungslink für Warnungen anzeigen',
        settingAlertsMinimized: 'Wetterwarnungen immer minimiert anzeigen',
        dismissAlert: 'Warnung ausblenden',
        settingAutoPlayRadar: 'Radar automatisch abspielen',
        settingRememberCity: 'Letzte Stadt merken',
        cityPageTitle: 'Wetter {city} ohne Werbung',
        cityPageSeoBlurb: 'Wettervorhersage für {city} ohne Werbung, Cookies oder Tracking. Open-Meteo-Daten, 10-Tage-Vorhersage, stündliche Bedingungen und Radar — alles kostenlos.',
        cityPageHideBlurb: 'hier klicken zum Ausblenden',
        cities: 'Städte',
        popularCities: 'Beliebte Städte',
        nearbyCities: 'Städte in der Nähe',
        useMyLocation: 'Meinen Standort verwenden',
        myLocation: 'Mein Standort',
        geoDenied: 'Standortzugriff wurde verweigert — Sie können stattdessen Ihre Stadt suchen.',
        geoFailed: 'Standort konnte nicht ermittelt werden — versuchen Sie, Ihre Stadt zu suchen.',
        settingAutoLocate: 'Meinen Standort bei jedem Besuch automatisch verwenden',
        refresh: 'Aktualisieren',
        updatedJustNow: 'Gerade aktualisiert',
        updatedAgo: 'Aktualisiert {time}',
        climateHeading: 'Klima in {city}',
        climateMonth: 'Monat',
        climateHigh: 'Max.',
        climateLow: 'Min.',
        climatePrecip: 'Niederschlag',
        climateWetDays: 'Regentage',
        climateSummary: '{hotMonth} ist der wärmste Monat in {city} mit einer durchschnittlichen Höchsttemperatur von {hotTemp}; {coldMonth} ist der kälteste ({coldTemp}). {wetMonth} ist der niederschlagsreichste Monat (durchschnittlich {wetAmount}).',
        climateRecords: 'Extremwerte seit {year}: Höchstwert {high} ({highDate}), Tiefstwert {low} ({lowDate}).',
        climateDaylight: 'Die Tageslänge beträgt etwa {long} Stunden im {longMonth} und {short} Stunden im {shortMonth}.',
        climateSource: 'Daten: Meteostat — {station}, Mittelwerte {period}.',
        hide: 'Ausblenden',
        settingShowClimate: 'Klimamittelwerte auf Stadtseiten anzeigen',
        notFoundTitle: 'Seite nicht gefunden',
        notFoundBlurb: 'Diese Seite existiert nicht — das Wetter schon. Suchen Sie Ihre Stadt:',

        // Weather codes
        wc0: 'Klarer Himmel',
        wc1: 'Überwiegend klar',
        wc2: 'Teilweise bewölkt',
        wc3: 'Bedeckt',
        wc45: 'Neblig',
        wc48: 'Gefrierender Nebel',
        wc51: 'Leichter Nieselregen',
        wc53: 'Mäßiger Nieselregen',
        wc55: 'Dichter Nieselregen',
        wc61: 'Leichter Regen',
        wc63: 'Mäßiger Regen',
        wc65: 'Starker Regen',
        wc71: 'Leichter Schneefall',
        wc73: 'Mäßiger Schneefall',
        wc75: 'Starker Schneefall',
        wc77: 'Schneegriesel',
        wc80: 'Leichte Regenschauer',
        wc81: 'Mäßige Regenschauer',
        wc82: 'Heftige Regenschauer',
        wc85: 'Leichte Schneeschauer',
        wc86: 'Starke Schneeschauer',
        wc95: 'Gewitter',
        wc96: 'Gewitter mit leichtem Hagel',
        wc99: 'Gewitter mit starkem Hagel',
        wcUnknown: 'Unbekannt',

        // Temp adjectives
        sumTempFreezing: 'Es ist eiskalt',
        sumTempCold: 'Es ist kalt',
        sumTempCool: 'Es ist kühl',
        sumTempMild: 'Es ist',
        sumTempWarm: 'Es ist warm',
        sumTempHot: 'Es ist heiß',

        // Opening template
        sumOpeningTemplate: '{tempAdj} bei {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (gefühlt {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' mit Gewittern',
        sumConditionSnowing: ' und es schneit',
        sumConditionRaining: ' und es regnet',
        sumConditionRainingWithAmount: ' und es regnet (heute {amount} erwartet)',
        sumConditionRainingWithAmountClearingBy: ' und es regnet (heute {amount} erwartet), klart gegen {hour} auf',
        sumConditionRainSoon: ' mit Regen in Kürze',
        sumConditionRainLikelyAround: ' mit Regen wahrscheinlich gegen {hour}',
        sumConditionClearSkies: ' mit klarem Himmel',
        sumConditionCloudy: ' und bewölkt',

        // Follow-up sentences
        sumTodayHigh: 'Höchsttemperatur heute {high}{unit}',
        sumTomorrowRainWithAmount: 'Regen morgen erwartet ({amount})',
        sumTomorrowSnowWithAmount: 'Schnee morgen erwartet ({amount})',
        sumTomorrowRainNoAmount: 'Regen morgen erwartet',
        sumTomorrowWarming: 'Erwärmung auf {high}{unit} morgen',
        sumTomorrowCooling: 'Abkühlung auf {high}{unit} morgen',

        // UV Index levels
        uvLow: '(Niedrig)',
        uvModerate: '(Mäßig)',
        uvHigh: '(Hoch)',
        uvVeryHigh: '(Sehr hoch)',
        uvExtreme: '(Extrem)',

        // Loading / unavailable messages
        loading: 'Wird geladen...',
        loadingRadar: 'Radar wird geladen...',
        refreshingRadar: 'Radar wird aktualisiert...',
        radarUnavailable: 'Radar nicht verfügbar',
        pollenDataUnavailable: 'Pollendaten für diesen Ort nicht verfügbar',

        // Astronomy labels
        sunrise: 'Sonnenaufgang',
        sunset: 'Sonnenuntergang',
        solarNoon: 'Sonnenhöchststand',
        moonrise: 'Mondaufgang',
        moonset: 'Monduntergang',
        phase: 'Phase',

        // Moon phase names
        moonPhaseNewMoon: 'Neumond',
        moonPhaseWaxingCrescent: 'Zunehmende Sichel',
        moonPhaseFirstQuarter: 'Erstes Viertel',
        moonPhaseWaxingGibbous: 'Zunehmender Mond',
        moonPhaseFullMoon: 'Vollmond',
        moonPhaseWaningGibbous: 'Abnehmender Mond',
        moonPhaseLastQuarter: 'Letztes Viertel',
        moonPhaseWaningCrescent: 'Abnehmende Sichel',

        // Chart legends
        chartTemperature: 'Temperatur',
        chartFeelsLike: 'Gefühlt',
        chartDewPoint: 'Taupunkt',
        chartCloudCover: 'Bewölkung',
        chartPrecipChance: 'Niederschlagschance',
        chartHumidity: 'Luftfeuchtigkeit',
        chartPressure: 'Luftdruck',
        chartPrecipAccum: 'Niederschlag gesamt',
        chartHourlyPrecip: 'Stündl. Niederschlag',
        chartWindSpeed: 'Windgeschw.',
        chartWindGusts: 'Böen',

        // Section controls
        dragToReorder: 'Zum Neuanordnen ziehen',
        moveUp: 'Nach oben',
        moveDown: 'Nach unten',
        singleColumn: 'Einspaltig',
        fullWidth: 'Volle Breite',
        removeSection: 'Bereich entfernen',
        minimizeSection: 'Bereich minimieren',
        hideChart: 'Diagramm ausblenden',

        // Radar controls
        refreshRadar: 'Radar aktualisieren',
        pauseRadar: 'Pause',
        playRadar: 'Abspielen',
        // Radar progress / forecast labels
        forecastLabel: 'VORHERSAGE',
        radarNow: 'JETZT',
        slowerRadar: 'Langsamer',
        fasterRadar: 'Schneller',

        // Show prefix
        showSectionPrefix: '{name} anzeigen',

        // Tagline
        tagline: 'Wetter ohne Schnickschnack.',

        // AQI severity
        aqiGood: 'Gut',
        aqiModerate: 'Mäßig',
        aqiUnhealthyForSensitive: 'Ungesund für empfindliche Gruppen',
        aqiUnhealthy: 'Ungesund',
        aqiVeryUnhealthy: 'Sehr ungesund',
        aqiHazardous: 'Gesundheitsgefährdend',

        // Pollen levels
        pollenLow: 'Niedrig',
        pollenLowMed: 'Niedrig-Mittel',
        pollenMedium: 'Mittel',
        pollenHigh: 'Hoch',
        pollenVeryHigh: 'Sehr hoch',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Suche...',
        didYouMean: 'Meintest du:',
        locationNotFound: 'Standort nicht gefunden. Versuche eine andere Stadt oder Postleitzahl.',
        failedToLoadWeather: 'Wetterdaten konnten nicht geladen werden. Bitte erneut versuchen.',
        retry: 'Erneut versuchen',
        hide: 'Ausblenden',
        close: 'Schließen',
        toggleTheme: 'Dunkelmodus umschalten',
        backToSearch: 'Zurück zur Suche'
};
