// NoAdsWeather translations — Dutch (nl).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "nl". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.nl = {
        // UI
        currentConditions: 'Huidige omstandigheden',
        hourlyForecast: 'Verwachting per uur',
        tenDayForecast: '10-daagse verwachting',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Zon',
        moon: 'Maan',
        weatherAlerts: '⚠️ Weerwaarschuwingen',
        translateAlert: 'Vertalen',
        searchPlaceholder: 'Voer stad of postcode in',
        searchButton: 'Zoeken',
        back: '← Terug',
        privacyCookies: 'Privacy',
        about: 'Over ons',
        supportThisSite: 'Steun deze site',
        showMore: 'Meer tonen',
        showLess: 'Minder tonen',
        lockLayout: 'Layout vergrendelen',
        unlockLayout: 'Layout ontgrendelen',
        settings: 'Instellingen',
        restoreDefaultLayout: 'Standaardlayout herstellen',
        seePollenData: 'Bekijk pollengegevens',
        feelsLike: 'Gevoelstemperatuur',
        humidity: 'Luchtvochtigheid',
        dewPoint: 'Dauwpunt',
        wind: 'Wind',
        gusts: 'Windstoten',
        airQuality: 'Luchtkwaliteit',
        uvIndex: 'UV-index',
        nwsRadarLink: 'NWS-radar ↗',
        language: 'Taal',

        // Style names
        style: 'Stijl',
        styleDefault: 'Standaard',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Rustig',

        machineTranslationNotice: 'UI-vertalingen zijn automatisch gegenereerd en zijn mogelijk niet perfect.',

        // Settings labels
        settingForecastColors: 'Gekleurde achtergronden tonen in 10-daagse verwachting',
        settingSupportBtn: 'Irritante ondersteuningsknop tonen',
        settingWeatherSummary: 'Weeroverzicht tonen',
        settingThemeToggle: 'Lichte / Donkere modus-knop tonen',
        settingUnitsBtn: '°C / °F-knop tonen',
        settingTimeBtn: '12U / 24U-knop tonen',
        settingLockBtn: 'Vergrendel- / Ontgrendelknop tonen',
        settingNwsLink: 'NWS-radarlink tonen',
        settingShowSectionButtons: '"Sectie tonen"-knoppen tonen wanneer secties verborgen zijn',
        settingTranslateLink: 'Vertaallink voor waarschuwingen tonen',
        settingAlertsMinimized: 'Weerwaarschuwingen altijd geminimaliseerd tonen',
        dismissAlert: 'Waarschuwing sluiten',
        settingAutoPlayRadar: 'Radar altijd automatisch afspelen',
        settingRememberCity: 'Laatste stad onthouden',
        cityPageTitle: 'Weer {city} zonder reclame',
        cityPageSeoBlurb: 'Weersverwachting voor {city} zonder reclame, cookies of tracking. Open-Meteo-data, 10-daagse verwachting, uurlijkse omstandigheden en radar — alles gratis.',
        cityPageHideBlurb: 'klik hier om te verbergen',
        cities: 'Steden',
        popularCities: 'Populaire steden',
        appSectionTitle: 'Een weer-app zonder advertenties',
        appSectionBody: 'Niets te downloaden. Voeg NoAdsWeather toe aan je beginscherm en het opent schermvullend met een eigen icoon – geen browserbalk, geen appstore, geen account. Het is dezelfde site, dus nog steeds zonder advertenties en zonder tracking.',
        appIosTitle: 'Op iPhone of iPad',
        appIosStep1: 'Tik op Deel (het vierkantje met de pijl)',
        appIosStep2: 'Tik op “Zet op beginscherm”',
        appIosStep3: 'Tik op Voeg toe',
        appAndroidTitle: 'Op Android',
        appAndroidStep1: 'Tik op het ⋮-menu in Chrome',
        appAndroidStep2: 'Tik op “Toevoegen aan startscherm”',
        appAndroidStep3: 'Tik op Toevoegen',
        appSectionNote: 'Kies je stad één keer en hij opent er elke keer.',
        nearbyCities: 'Steden in de buurt',
        useMyLocation: 'Mijn locatie gebruiken',
        myLocation: 'Mijn locatie',
        geoDenied: 'Locatietoegang geweigerd — je kunt je stad handmatig zoeken.',
        geoFailed: 'Kon je locatie niet bepalen — probeer je stad te zoeken.',
        settingAutoLocate: 'Mijn locatie automatisch gebruiken bij elk bezoek',

        // Share card
        share: 'Delen',
        shareTitle: 'Verwachting delen',
        share5Day: '5-daagse verwachting',
        share7Day: '7-daagse verwachting',
        shareIncludeCurrent: 'Huidige omstandigheden opnemen',
        shareIncludePollen: 'Pollen opnemen',
        shareEmoji: 'Reactie toevoegen',
        shareEmojiNone: 'Geen',
        shareCreate: 'Afbeelding maken',
        shareShareBtn: 'Delen',
        shareDownload: 'Downloaden',
        shareCopyLink: 'Link kopiëren',
        shareLinkCopied: 'Gekopieerd!',
        shareGenerating: 'Afbeelding maken...',
        shareFailed: 'Kon de afbeelding niet maken',
        shareShareFailed: 'Kon de afbeelding niet delen',
        shareCopyFailed: 'Kon de link niet kopiëren',
        settingShareBtn: 'Deelknop tonen',

        refresh: 'Vernieuwen',
        updatedJustNow: 'Zojuist bijgewerkt',
        updatedAgo: 'Bijgewerkt {time}',
        climateHeading: 'Klimaat in {city}',
        climateMonth: 'Maand',
        climateHigh: 'Max.',
        climateLow: 'Min.',
        climatePrecip: 'Neerslag',
        climateWetDays: 'Natte dagen',
        climateSummary: '{hotMonth} is de warmste maand in {city}, met een gemiddeld maximum van {hotTemp}; {coldMonth} is de koudste ({coldTemp}). {wetMonth} is de natste maand, met gemiddeld {wetAmount} neerslag.',
        climateRecords: 'Extremen sinds {year}: hoogste {high} ({highDate}), laagste {low} ({lowDate}).',
        climateDaylight: 'Daglicht duurt ongeveer {long} uur in {longMonth} en {short} uur in {shortMonth}.',
        climateSource: 'Gegevens: Meteostat — {station}, gemiddelden {period}.',
        hide: 'Verbergen',
        settingShowClimate: 'Klimaatgemiddelden tonen op stadspaginas',
        notFoundTitle: 'Pagina niet gevonden',
        notFoundBlurb: 'Die pagina bestaat niet — het weer wel. Zoek je stad:',

        // Weather codes
        wc0: 'Heldere hemel',
        wc1: 'Overwegend helder',
        wc2: 'Gedeeltelijk bewolkt',
        wc3: 'Bewolkt',
        wc45: 'Mistig',
        wc48: 'Aanvriezende mist',
        wc51: 'Lichte motregen',
        wc53: 'Matige motregen',
        wc55: 'Dichte motregen',
        wc61: 'Lichte regen',
        wc63: 'Matige regen',
        wc65: 'Zware regen',
        wc71: 'Lichte sneeuw',
        wc73: 'Matige sneeuw',
        wc75: 'Zware sneeuw',
        wc77: 'Sneeuwkorrels',
        wc80: 'Lichte regenbuien',
        wc81: 'Matige regenbuien',
        wc82: 'Hevige regenbuien',
        wc85: 'Lichte sneeuwbuien',
        wc86: 'Zware sneeuwbuien',
        wc95: 'Onweer',
        wc96: 'Onweer met lichte hagel',
        wc99: 'Onweer met zware hagel',
        wcUnknown: 'Onbekend',

        // Temp adjectives
        sumTempFreezing: 'Het vriest',
        sumTempCold: 'Het is koud',
        sumTempCool: 'Het is fris',
        sumTempMild: 'Het is',
        sumTempWarm: 'Het is warm',
        sumTempHot: 'Het is heet',

        // Opening template
        sumOpeningTemplate: '{tempAdj} bij {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (voelt als {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' met onweer',
        sumConditionSnowing: ' en het sneeuwt',
        sumConditionRaining: ' en het regent',
        sumConditionRainingWithAmount: ' en het regent (vandaag {amount} verwacht)',
        sumConditionRainingWithAmountClearingBy: ' en het regent (vandaag {amount} verwacht), opklaringen rond {hour}',
        sumConditionRainSoon: ' met regen zeer binnenkort verwacht',
        sumConditionRainLikelyAround: ' met regen waarschijnlijk rond {hour}',
        sumConditionClearSkies: ' met heldere hemel',
        sumConditionCloudy: ' en bewolkt',

        // Follow-up sentences
        sumTodayHigh: 'Maximum van {high}{unit} vandaag',
        sumTomorrowRainWithAmount: 'Regen verwacht morgen ({amount})',
        sumTomorrowSnowWithAmount: 'Sneeuw verwacht morgen ({amount})',
        sumTomorrowRainNoAmount: 'Regen verwacht morgen',
        sumTomorrowWarming: 'opwarmend tot {high}{unit} morgen',
        sumTomorrowCooling: 'afkoelend tot {high}{unit} morgen',

        // UV Index levels
        uvLow: '(Laag)',
        uvModerate: '(Gematigd)',
        uvHigh: '(Hoog)',
        uvVeryHigh: '(Zeer hoog)',
        uvExtreme: '(Extreem)',

        // Loading / unavailable messages
        loading: 'Laden...',
        loadingRadar: 'Radar laden...',
        refreshingRadar: 'Radar verversen...',
        radarUnavailable: 'Radar niet beschikbaar',
        pollenDataUnavailable: 'Pollengegevens niet beschikbaar voor deze locatie',

        // Astronomy labels
        sunrise: 'Zonsopkomst',
        sunset: 'Zonsondergang',
        solarNoon: 'Zonnehoogtepunt',
        moonrise: 'Maansopkomst',
        moonset: 'Maansondergang',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Nieuwe maan',
        moonPhaseWaxingCrescent: 'Wassende maansikkel',
        moonPhaseFirstQuarter: 'Eerste kwartier',
        moonPhaseWaxingGibbous: 'Wassende maan',
        moonPhaseFullMoon: 'Volle maan',
        moonPhaseWaningGibbous: 'Afnemende maan',
        moonPhaseLastQuarter: 'Laatste kwartier',
        moonPhaseWaningCrescent: 'Afnemende maansikkel',

        // Chart legends
        chartTemperature: 'Temperatuur',
        chartFeelsLike: 'Gevoelstemperatuur',
        chartDewPoint: 'Dauwpunt',
        chartCloudCover: 'Bewolking',
        chartPrecipChance: 'Neerslagkans',
        chartHumidity: 'Luchtvochtigheid',
        chartPressure: 'Luchtdruk',
        chartPrecipAccum: 'Neerslag totaal',
        chartHourlyPrecip: 'Neerslag per uur',
        chartWindSpeed: 'Windsnelheid',
        chartWindGusts: 'Windstoten',

        // Section controls
        dragToReorder: 'Slepen om te herschikken',
        moveUp: 'Omhoog',
        moveDown: 'Omlaag',
        singleColumn: 'Eén kolom',
        fullWidth: 'Volle breedte',
        removeSection: 'Sectie verwijderen',
        minimizeSection: 'Sectie minimaliseren',
        hideChart: 'Grafiek verbergen',

        // Radar controls
        refreshRadar: 'Radar verversen',
        pauseRadar: 'Pauze',
        playRadar: 'Afspelen',
        // Radar progress / forecast labels
        forecastLabel: 'VOORSPELLING',
        radarNow: 'NU',
        slowerRadar: 'Langzamer',
        fasterRadar: 'Sneller',

        // Show prefix
        showSectionPrefix: '{name} tonen',

        // Tagline
        tagline: 'Weer zonder rommel.',

        // AQI severity
        aqiGood: 'Goed',
        aqiModerate: 'Matig',
        aqiUnhealthyForSensitive: 'Ongezond voor gevoelige groepen',
        aqiUnhealthy: 'Ongezond',
        aqiVeryUnhealthy: 'Zeer ongezond',
        aqiHazardous: 'Gevaarlijk',

        // Pollen levels
        pollenLow: 'Laag',
        pollenLowMed: 'Laag-Middel',
        pollenMedium: 'Middel',
        pollenHigh: 'Hoog',
        pollenVeryHigh: 'Zeer hoog',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Zoeken...',
        didYouMean: 'Bedoelde je:',
        locationNotFound: 'Locatie niet gevonden. Probeer een andere stad of postcode.',
        failedToLoadWeather: 'Kan weergegevens niet laden. Probeer het opnieuw.',
        retry: 'Opnieuw',
        hide: 'Verbergen',
        close: 'Sluiten',
        toggleTheme: 'Donkere modus wisselen',
        backToSearch: 'Terug naar zoeken'
};
