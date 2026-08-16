// NoAdsWeather translations — Italian (it).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "it". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.it = {
        // UI
        currentConditions: 'Condizioni attuali',
        hourlyForecast: 'Previsioni orarie',
        tenDayForecast: 'Previsioni a 10 giorni',
        radar: 'Radar',
        pollen: 'Polline',
        sun: 'Sole',
        moon: 'Luna',
        weatherAlerts: '⚠️ Allerte meteo',
        translateAlert: 'Traduci',
        searchPlaceholder: 'Inserisci città o CAP',
        searchButton: 'Cerca',
        back: '← Indietro',
        privacyCookies: 'Privacy',
        about: 'Informazioni',
        supportThisSite: 'Sostieni questo sito',
        showMore: 'Mostra di più',
        showLess: 'Mostra meno',
        lockLayout: 'Blocca layout',
        unlockLayout: 'Sblocca layout',
        settings: 'Impostazioni',
        restoreDefaultLayout: 'Ripristina layout predefinito',
        seePollenData: 'Vedi dati del polline',
        feelsLike: 'Percepita',
        humidity: 'Umidità',
        dewPoint: 'Punto di rugiada',
        wind: 'Vento',
        gusts: 'Raffiche',
        airQuality: 'Qualità dell\'aria',
        uvIndex: 'Indice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Lingua',

        // Style names
        style: 'Stile',
        styleDefault: 'Predefinito',
        styleEditorial: 'Editoriale',
        styleBulletin: 'Bollettino',
        styleQuiet: 'Sobrio',

        machineTranslationNotice: 'Le traduzioni dell\'interfaccia sono generate automaticamente e potrebbero non essere perfette.',

        // Settings labels
        settingForecastColors: 'Mostra sfondi colorati nelle previsioni a 10 giorni',
        settingSupportBtn: 'Mostra fastidioso pulsante di supporto',
        settingWeatherSummary: 'Mostra riepilogo meteo',
        settingThemeToggle: 'Mostra pulsante Modalità chiara / Modalità scura',
        settingUnitsBtn: 'Mostra pulsante °C / °F',
        settingTimeBtn: 'Mostra pulsante 12H / 24H',
        settingLockBtn: 'Mostra pulsante Blocca / Sblocca',
        settingNwsLink: 'Mostra link radar NWS',
        settingShowSectionButtons: 'Mostra i pulsanti "Mostra sezione" quando le sezioni sono nascoste',
        settingTranslateLink: 'Mostra link di traduzione delle allerte',
        settingAutoPlayRadar: 'Riproduci sempre il radar automaticamente',
        settingRememberCity: 'Ricorda ultima città',
        cityPageTitle: 'Meteo {city} senza pubblicità',
        cityPageSeoBlurb: 'Previsioni meteo per {city} senza pubblicità, cookie o tracciamento. Dati Open-Meteo, previsioni a 10 giorni, condizioni orarie e radar — tutto gratis.',
        cityPageHideBlurb: 'clicca qui per nascondere',
        cities: 'Città',
        popularCities: 'Città popolari',
        nearbyCities: 'Città vicine',
        useMyLocation: 'Usa la mia posizione',
        myLocation: 'La mia posizione',
        geoDenied: 'Accesso alla posizione negato — puoi cercare la tua città manualmente.',
        geoFailed: 'Impossibile determinare la tua posizione — prova a cercare la tua città.',
        settingAutoLocate: 'Usa automaticamente la mia posizione a ogni visita',
        refresh: 'Aggiorna',
        updatedJustNow: 'Aggiornato proprio ora',
        updatedAgo: 'Aggiornato {time}',
        climateHeading: 'Clima a {city}',
        climateMonth: 'Mese',
        climateHigh: 'Max',
        climateLow: 'Min',
        climatePrecip: 'Precip.',
        climateWetDays: 'Giorni di pioggia',
        climateSummary: '{hotMonth} è il mese più caldo a {city}, con una massima media di {hotTemp}; {coldMonth} è il più freddo ({coldTemp}). {wetMonth} è il mese più piovoso, con una media di {wetAmount} di precipitazioni.',
        climateRecords: 'Estremi dal {year}: massima {high} ({highDate}), minima {low} ({lowDate}).',
        climateDaylight: 'La luce del giorno dura circa {long} ore a {longMonth} e {short} ore a {shortMonth}.',
        climateSource: 'Dati: Meteostat — {station}, medie {period}.',
        notFoundTitle: 'Pagina non trovata',
        notFoundBlurb: 'Questa pagina non esiste — ma il meteo sì. Cerca la tua città:',

        // Weather codes
        wc0: 'Cielo sereno',
        wc1: 'Prevalentemente sereno',
        wc2: 'Parzialmente nuvoloso',
        wc3: 'Coperto',
        wc45: 'Nebbia',
        wc48: 'Nebbia con brina',
        wc51: 'Pioggerella leggera',
        wc53: 'Pioggerella moderata',
        wc55: 'Pioggerella fitta',
        wc61: 'Pioggia leggera',
        wc63: 'Pioggia moderata',
        wc65: 'Pioggia intensa',
        wc71: 'Neve leggera',
        wc73: 'Neve moderata',
        wc75: 'Neve intensa',
        wc77: 'Granelli di neve',
        wc80: 'Rovesci di pioggia leggeri',
        wc81: 'Rovesci di pioggia moderati',
        wc82: 'Rovesci di pioggia violenti',
        wc85: 'Rovesci di neve leggeri',
        wc86: 'Rovesci di neve intensi',
        wc95: 'Temporale',
        wc96: 'Temporale con grandine leggera',
        wc99: 'Temporale con grandine intensa',
        wcUnknown: 'Sconosciuto',

        // Temp adjectives
        sumTempFreezing: 'Fa un freddo gelido',
        sumTempCold: 'Fa freddo',
        sumTempCool: 'Fa fresco',
        sumTempMild: 'È',
        sumTempWarm: 'Fa caldo mite',
        sumTempHot: 'Fa caldo',

        // Opening template
        sumOpeningTemplate: '{tempAdj} a {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (percepita {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' con temporali',
        sumConditionSnowing: ' e sta nevicando',
        sumConditionRaining: ' e sta piovendo',
        sumConditionRainingWithAmount: ' e sta piovendo ({amount} previsti oggi)',
        sumConditionRainingWithAmountClearingBy: ' e sta piovendo ({amount} previsti oggi), schiarite intorno alle {hour}',
        sumConditionRainSoon: ' con pioggia prevista a breve',
        sumConditionRainLikelyAround: ' con pioggia probabile intorno alle {hour}',
        sumConditionClearSkies: ' con cieli sereni',
        sumConditionCloudy: ' e nuvoloso',

        // Follow-up sentences
        sumTodayHigh: 'Massima di {high}{unit} oggi',
        sumTomorrowRainWithAmount: 'Pioggia prevista domani ({amount})',
        sumTomorrowSnowWithAmount: 'Neve prevista domani ({amount})',
        sumTomorrowRainNoAmount: 'Pioggia prevista domani',
        sumTomorrowWarming: 'riscaldamento fino a {high}{unit} domani',
        sumTomorrowCooling: 'raffreddamento a {high}{unit} domani',

        // UV Index levels
        uvLow: '(Basso)',
        uvModerate: '(Moderato)',
        uvHigh: '(Alto)',
        uvVeryHigh: '(Molto alto)',
        uvExtreme: '(Estremo)',

        // Loading / unavailable messages
        loading: 'Caricamento...',
        loadingRadar: 'Caricamento radar...',
        refreshingRadar: 'Aggiornamento radar...',
        radarUnavailable: 'Radar non disponibile',
        pollenDataUnavailable: 'Dati polline non disponibili per questa località',

        // Astronomy labels
        sunrise: 'Alba',
        sunset: 'Tramonto',
        solarNoon: 'Mezzogiorno solare',
        moonrise: 'Sorgere della luna',
        moonset: 'Tramonto della luna',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Luna nuova',
        moonPhaseWaxingCrescent: 'Luna crescente',
        moonPhaseFirstQuarter: 'Primo quarto',
        moonPhaseWaxingGibbous: 'Gibbosa crescente',
        moonPhaseFullMoon: 'Luna piena',
        moonPhaseWaningGibbous: 'Gibbosa calante',
        moonPhaseLastQuarter: 'Ultimo quarto',
        moonPhaseWaningCrescent: 'Luna calante',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Percepita',
        chartDewPoint: 'Punto di rugiada',
        chartCloudCover: 'Nuvolosità',
        chartPrecipChance: 'Prob. precip.',
        chartHumidity: 'Umidità',
        chartPressure: 'Pressione',
        chartPrecipAccum: 'Precip. cumul.',
        chartHourlyPrecip: 'Precip. oraria',
        chartWindSpeed: 'Velocità vento',
        chartWindGusts: 'Raffiche',

        // Section controls
        dragToReorder: 'Trascina per riordinare',
        moveUp: 'Sposta su',
        moveDown: 'Sposta giù',
        singleColumn: 'Colonna singola',
        fullWidth: 'Larghezza piena',
        removeSection: 'Rimuovi sezione',
        minimizeSection: 'Minimizza sezione',
        hideChart: 'Nascondi grafico',

        // Radar controls
        refreshRadar: 'Aggiorna radar',
        pauseRadar: 'Pausa',
        playRadar: 'Riproduci',
        // Radar progress / forecast labels
        forecastLabel: 'PREVISIONE',
        radarNow: 'ORA',
        slowerRadar: 'Più lento',
        fasterRadar: 'Più veloce',

        // Show prefix
        showSectionPrefix: 'Mostra {name}',

        // Tagline
        tagline: 'Il meteo senza fronzoli.',

        // AQI severity
        aqiGood: 'Buona',
        aqiModerate: 'Moderata',
        aqiUnhealthyForSensitive: 'Malsana per gruppi sensibili',
        aqiUnhealthy: 'Malsana',
        aqiVeryUnhealthy: 'Molto malsana',
        aqiHazardous: 'Pericolosa',

        // Pollen levels
        pollenLow: 'Basso',
        pollenLowMed: 'Basso-Medio',
        pollenMedium: 'Medio',
        pollenHigh: 'Alto',
        pollenVeryHigh: 'Molto alto',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Ricerca...',
        didYouMean: 'Forse cercavi:',
        locationNotFound: 'Posizione non trovata. Prova con un\'altra città o CAP.',
        failedToLoadWeather: 'Impossibile caricare i dati meteo. Riprova.',
        retry: 'Riprova',
        hide: 'Nascondi',
        close: 'Chiudi',
        toggleTheme: 'Attiva/disattiva modalità scura',
        backToSearch: 'Torna alla ricerca'
};
