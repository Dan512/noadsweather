// NoAdsWeather translations — Polish (pl).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "pl". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.pl = {
        // UI
        currentConditions: 'Aktualne warunki',
        hourlyForecast: 'Prognoza godzinowa',
        tenDayForecast: 'Prognoza 10-dniowa',
        radar: 'Radar',
        pollen: 'Pyłki',
        sun: 'Słońce',
        moon: 'Księżyc',
        weatherAlerts: '⚠️ Ostrzeżenia pogodowe',
        translateAlert: 'Przetłumacz',
        searchPlaceholder: 'Wpisz miasto lub kod pocztowy',
        searchButton: 'Szukaj',
        back: '← Wstecz',
        privacyCookies: 'Prywatność',
        about: 'O nas',
        supportThisSite: 'Wesprzyj tę stronę',
        showMore: 'Pokaż więcej',
        showLess: 'Pokaż mniej',
        lockLayout: 'Zablokuj układ',
        unlockLayout: 'Odblokuj układ',
        settings: 'Ustawienia',
        restoreDefaultLayout: 'Przywróć domyślny układ',
        seePollenData: 'Zobacz dane o pyłkach',
        feelsLike: 'Odczuwalna',
        humidity: 'Wilgotność',
        dewPoint: 'Punkt rosy',
        wind: 'Wiatr',
        gusts: 'Porywy',
        airQuality: 'Jakość powietrza',
        uvIndex: 'Indeks UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Język',

        // Style names
        style: 'Styl',
        styleDefault: 'Domyślny',
        styleEditorial: 'Edytorski',
        styleBulletin: 'Biuletyn',
        styleQuiet: 'Spokojny',

        machineTranslationNotice: 'Tłumaczenia interfejsu są generowane maszynowo i mogą nie być idealne.',

        // Settings labels
        settingForecastColors: 'Pokaż kolorowe tła w prognozie 10-dniowej',
        settingSupportBtn: 'Pokaż irytujący przycisk wsparcia',
        settingWeatherSummary: 'Pokaż podsumowanie pogody',
        settingThemeToggle: 'Pokaż przycisk Tryb jasny / Tryb ciemny',
        settingUnitsBtn: 'Pokaż przycisk °C / °F',
        settingTimeBtn: 'Pokaż przycisk 12H / 24H',
        settingLockBtn: 'Pokaż przycisk Zablokuj / Odblokuj',
        settingNwsLink: 'Pokaż link do radaru NWS',
        settingShowSectionButtons: 'Pokaż przyciski "Pokaż sekcję", gdy sekcje są ukryte',
        settingTranslateLink: 'Pokaż link do tłumaczenia ostrzeżeń',
        settingAutoPlayRadar: 'Zawsze automatycznie odtwarzaj radar',
        settingRememberCity: 'Zapamiętaj ostatnie miasto',
        cityPageTitle: 'Pogoda {city} bez reklam',
        cityPageSeoBlurb: 'Prognoza pogody dla {city} bez reklam, plików cookie ani śledzenia. Dane Open-Meteo, 10-dniowa prognoza, warunki godzinowe i radar — wszystko za darmo.',
        cityPageHideBlurb: 'kliknij tutaj, aby ukryć',
        cities: 'Miasta',
        popularCities: 'Popularne miasta',
        nearbyCities: 'Pobliskie miasta',
        useMyLocation: 'Użyj mojej lokalizacji',
        myLocation: 'Moja lokalizacja',
        geoDenied: 'Odmówiono dostępu do lokalizacji — możesz wyszukać swoje miasto ręcznie.',
        geoFailed: 'Nie udało się ustalić lokalizacji — spróbuj wyszukać swoje miasto.',
        settingAutoLocate: 'Automatycznie używaj mojej lokalizacji przy każdej wizycie',
        refresh: 'Odśwież',
        updatedJustNow: 'Zaktualizowano przed chwilą',
        updatedAgo: 'Zaktualizowano {time}',
        climateHeading: 'Klimat – {city}',
        climateMonth: 'Miesiąc',
        climateHigh: 'Maks.',
        climateLow: 'Min.',
        climatePrecip: 'Opady',
        climateWetDays: 'Dni z opadami',
        climateSummary: '{hotMonth} to najcieplejszy miesiąc ({city}), ze średnią maksymalną {hotTemp}; {coldMonth} jest najzimniejszy ({coldTemp}). {wetMonth} to najbardziej deszczowy miesiąc (średnio {wetAmount} opadów).',
        climateRecords: 'Wartości ekstremalne od {year}: najwyższa {high} ({highDate}), najniższa {low} ({lowDate}).',
        climateDaylight: 'Dzień trwa ok. {long} godz. ({longMonth}) oraz {short} godz. ({shortMonth}).',
        climateSource: 'Dane: Meteostat — {station}, średnie {period}.',
        notFoundTitle: 'Nie znaleziono strony',
        notFoundBlurb: 'Ta strona nie istnieje — ale pogoda tak. Wyszukaj swoje miasto:',

        // Weather codes
        wc0: 'Bezchmurnie',
        wc1: 'Głównie bezchmurnie',
        wc2: 'Częściowe zachmurzenie',
        wc3: 'Zachmurzenie całkowite',
        wc45: 'Mgła',
        wc48: 'Mgła osadzająca szadź',
        wc51: 'Lekka mżawka',
        wc53: 'Umiarkowana mżawka',
        wc55: 'Gęsta mżawka',
        wc61: 'Lekki deszcz',
        wc63: 'Umiarkowany deszcz',
        wc65: 'Silny deszcz',
        wc71: 'Lekki śnieg',
        wc73: 'Umiarkowany śnieg',
        wc75: 'Silny śnieg',
        wc77: 'Krupy śnieżne',
        wc80: 'Lekkie przelotne deszcze',
        wc81: 'Umiarkowane przelotne deszcze',
        wc82: 'Gwałtowne przelotne deszcze',
        wc85: 'Lekkie przelotne opady śniegu',
        wc86: 'Silne przelotne opady śniegu',
        wc95: 'Burza',
        wc96: 'Burza z lekkim gradem',
        wc99: 'Burza z silnym gradem',
        wcUnknown: 'Nieznane',

        // Temp adjectives
        sumTempFreezing: 'Jest mróz',
        sumTempCold: 'Jest zimno',
        sumTempCool: 'Jest chłodno',
        sumTempMild: 'Jest',
        sumTempWarm: 'Jest ciepło',
        sumTempHot: 'Jest gorąco',

        // Opening template
        sumOpeningTemplate: '{tempAdj} przy {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (odczuwalna {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' z burzami',
        sumConditionSnowing: ' i pada śnieg',
        sumConditionRaining: ' i pada deszcz',
        sumConditionRainingWithAmount: ' i pada deszcz (dziś spodziewane {amount})',
        sumConditionRainingWithAmountClearingBy: ' i pada deszcz (dziś spodziewane {amount}), przejaśnienia około {hour}',
        sumConditionRainSoon: ' z deszczem spodziewanym bardzo wkrótce',
        sumConditionRainLikelyAround: ' z prawdopodobnym deszczem około {hour}',
        sumConditionClearSkies: ' z bezchmurnym niebem',
        sumConditionCloudy: ' i pochmurno',

        // Follow-up sentences
        sumTodayHigh: 'Maksymalna dzisiaj {high}{unit}',
        sumTomorrowRainWithAmount: 'Jutro spodziewany deszcz ({amount})',
        sumTomorrowSnowWithAmount: 'Jutro spodziewany śnieg ({amount})',
        sumTomorrowRainNoAmount: 'Jutro spodziewany deszcz',
        sumTomorrowWarming: 'ocieplenie do {high}{unit} jutro',
        sumTomorrowCooling: 'ochłodzenie do {high}{unit} jutro',

        // UV Index levels
        uvLow: '(Niski)',
        uvModerate: '(Umiarkowany)',
        uvHigh: '(Wysoki)',
        uvVeryHigh: '(Bardzo wysoki)',
        uvExtreme: '(Ekstremalny)',

        // Loading / unavailable messages
        loading: 'Ładowanie...',
        loadingRadar: 'Ładowanie radaru...',
        refreshingRadar: 'Odświeżanie radaru...',
        radarUnavailable: 'Radar niedostępny',
        pollenDataUnavailable: 'Dane o pyłkach niedostępne dla tej lokalizacji',

        // Astronomy labels
        sunrise: 'Wschód słońca',
        sunset: 'Zachód słońca',
        solarNoon: 'Południe słoneczne',
        moonrise: 'Wschód księżyca',
        moonset: 'Zachód księżyca',
        phase: 'Faza',

        // Moon phase names
        moonPhaseNewMoon: 'Nów',
        moonPhaseWaxingCrescent: 'Przybywający sierp',
        moonPhaseFirstQuarter: 'Pierwsza kwadra',
        moonPhaseWaxingGibbous: 'Przybywający garb',
        moonPhaseFullMoon: 'Pełnia',
        moonPhaseWaningGibbous: 'Ubywający garb',
        moonPhaseLastQuarter: 'Ostatnia kwadra',
        moonPhaseWaningCrescent: 'Ubywający sierp',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Odczuwalna',
        chartDewPoint: 'Punkt rosy',
        chartCloudCover: 'Zachmurzenie',
        chartPrecipChance: 'Szansa opadów',
        chartHumidity: 'Wilgotność',
        chartPressure: 'Ciśnienie',
        chartPrecipAccum: 'Suma opadów',
        chartHourlyPrecip: 'Opady godz.',
        chartWindSpeed: 'Prędkość wiatru',
        chartWindGusts: 'Porywy',

        // Section controls
        dragToReorder: 'Przeciągnij, aby zmienić kolejność',
        moveUp: 'Przesuń w górę',
        moveDown: 'Przesuń w dół',
        singleColumn: 'Jedna kolumna',
        fullWidth: 'Pełna szerokość',
        removeSection: 'Usuń sekcję',
        minimizeSection: 'Zminimalizuj sekcję',
        hideChart: 'Ukryj wykres',

        // Radar controls
        refreshRadar: 'Odśwież radar',
        pauseRadar: 'Pauza',
        playRadar: 'Odtwórz',
        // Radar progress / forecast labels
        forecastLabel: 'PROGNOZA',
        radarNow: 'TERAZ',
        slowerRadar: 'Wolniej',
        fasterRadar: 'Szybciej',

        // Show prefix
        showSectionPrefix: 'Pokaż {name}',

        // Tagline
        tagline: 'Pogoda bez zbędnego hałasu.',

        // AQI severity
        aqiGood: 'Dobra',
        aqiModerate: 'Umiarkowana',
        aqiUnhealthyForSensitive: 'Niezdrowa dla wrażliwych grup',
        aqiUnhealthy: 'Niezdrowa',
        aqiVeryUnhealthy: 'Bardzo niezdrowa',
        aqiHazardous: 'Niebezpieczna',

        // Pollen levels
        pollenLow: 'Niski',
        pollenLowMed: 'Niski-Średni',
        pollenMedium: 'Średni',
        pollenHigh: 'Wysoki',
        pollenVeryHigh: 'Bardzo wysoki',

        // Misc
        highTemp: 'Maks',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Szukam...',
        didYouMean: 'Czy chodziło Ci o:',
        locationNotFound: 'Nie znaleziono lokalizacji. Spróbuj innego miasta lub kodu pocztowego.',
        failedToLoadWeather: 'Nie udało się załadować danych pogodowych. Spróbuj ponownie.',
        retry: 'Ponów',
        hide: 'Ukryj',
        close: 'Zamknij',
        toggleTheme: 'Przełącz tryb ciemny',
        backToSearch: 'Powrót do wyszukiwania'
};
