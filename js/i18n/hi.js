// NoAdsWeather translations — Hindi (hi).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "hi". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.hi = {
        // UI
        currentConditions: 'वर्तमान स्थिति',
        hourlyForecast: 'प्रति घंटा पूर्वानुमान',
        tenDayForecast: '10-दिवसीय पूर्वानुमान',
        radar: 'रडार',
        pollen: 'पराग',
        sun: 'सूर्य',
        moon: 'चंद्रमा',
        weatherAlerts: '⚠️ मौसम चेतावनी',
        translateAlert: 'अनुवाद करें',
        searchPlaceholder: 'शहर या पिन कोड दर्ज करें',
        searchButton: 'खोजें',
        back: '← वापस',
        privacyCookies: 'गोपनीयता',
        about: 'परिचय',
        supportThisSite: 'इस साइट का समर्थन करें',
        showMore: 'और देखें',
        showLess: 'कम दिखाएं',
        lockLayout: 'लेआउट लॉक करें',
        unlockLayout: 'लेआउट अनलॉक करें',
        settings: 'सेटिंग्स',
        restoreDefaultLayout: 'डिफ़ॉल्ट लेआउट पुनर्स्थापित करें',
        seePollenData: 'पराग डेटा देखें',
        feelsLike: 'महसूस होता है',
        humidity: 'आर्द्रता',
        dewPoint: 'ओस बिंदु',
        wind: 'हवा',
        gusts: 'झोंके',
        airQuality: 'वायु गुणवत्ता',
        uvIndex: 'यूवी इंडेक्स',
        nwsRadarLink: 'NWS रडार ↗',
        language: 'भाषा',

        // Style names
        style: 'शैली',
        styleDefault: 'डिफ़ॉल्ट',
        styleEditorial: 'संपादकीय',
        styleBulletin: 'बुलेटिन',
        styleQuiet: 'शांत',

        machineTranslationNotice: 'UI अनुवाद मशीन द्वारा उत्पन्न हैं और पूर्ण नहीं हो सकते हैं।',

        // Settings labels
        settingForecastColors: '10-दिवसीय पूर्वानुमान पर रंगीन पृष्ठभूमि दिखाएं',
        settingSupportBtn: 'परेशान करने वाला सहायता बटन दिखाएं',
        settingWeatherSummary: 'मौसम सारांश दिखाएं',
        settingThemeToggle: 'लाइट मोड / डार्क मोड बटन दिखाएं',
        settingUnitsBtn: '°C / °F बटन दिखाएं',
        settingTimeBtn: '12H / 24H बटन दिखाएं',
        settingLockBtn: 'लॉक / अनलॉक बटन दिखाएं',
        settingNwsLink: 'NWS रडार लिंक दिखाएं',
        settingShowSectionButtons: 'जब अनुभाग छिपे हों तो "अनुभाग दिखाएं" बटन दिखाएं',
        settingTranslateLink: 'चेतावनी अनुवाद लिंक दिखाएं',
        settingAutoPlayRadar: 'हमेशा रडार स्वतः चलाएं',
        settingRememberCity: 'अंतिम शहर याद रखें',
        cityPageTitle: '{city} मौसम बिना विज्ञापन',
        cityPageSeoBlurb: '{city} के लिए मौसम पूर्वानुमान, बिना विज्ञापन, कुकीज़ या ट्रैकिंग के। Open-Meteo डेटा, 10-दिन का पूर्वानुमान, घंटे की स्थिति और रडार — सब कुछ मुफ़्त।',
        cityPageHideBlurb: 'छिपाने के लिए यहां क्लिक करें',
        cities: 'शहर',
        popularCities: 'लोकप्रिय शहर',
        nearbyCities: 'आस-पास के शहर',
        useMyLocation: 'मेरा स्थान उपयोग करें',
        myLocation: 'मेरा स्थान',
        geoDenied: 'स्थान की अनुमति अस्वीकृत — आप अपना शहर खोज सकते हैं।',
        geoFailed: 'आपका स्थान निर्धारित नहीं हो सका — अपना शहर खोजने का प्रयास करें।',
        settingAutoLocate: 'हर बार खुलने पर मेरा स्थान अपने आप उपयोग करें',
        refresh: 'रिफ़्रेश',
        updatedJustNow: 'अभी अपडेट हुआ',
        updatedAgo: '{time} अपडेट हुआ',

        // Weather codes
        wc0: 'साफ आसमान',
        wc1: 'मुख्यतः साफ',
        wc2: 'आंशिक रूप से बादल',
        wc3: 'पूर्ण बादल',
        wc45: 'कोहरा',
        wc48: 'बर्फीला कोहरा',
        wc51: 'हल्की बूंदाबांदी',
        wc53: 'मध्यम बूंदाबांदी',
        wc55: 'घनी बूंदाबांदी',
        wc61: 'हल्की बारिश',
        wc63: 'मध्यम बारिश',
        wc65: 'भारी बारिश',
        wc71: 'हल्की बर्फबारी',
        wc73: 'मध्यम बर्फबारी',
        wc75: 'भारी बर्फबारी',
        wc77: 'बर्फ के दाने',
        wc80: 'हल्की बौछारें',
        wc81: 'मध्यम बौछारें',
        wc82: 'तेज बौछारें',
        wc85: 'हल्की बर्फ की बौछारें',
        wc86: 'भारी बर्फ की बौछारें',
        wc95: 'आंधी तूफान',
        wc96: 'हल्के ओलों के साथ आंधी',
        wc99: 'भारी ओलों के साथ आंधी',
        wcUnknown: 'अज्ञात',

        // Temp adjectives
        sumTempFreezing: 'बहुत ठंड है',
        sumTempCold: 'ठंड है',
        sumTempCool: 'ठंडक है',
        sumTempMild: 'तापमान',
        sumTempWarm: 'गर्मी है',
        sumTempHot: 'बहुत गर्मी है',

        // Opening template
        sumOpeningTemplate: '{tempAdj}, {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' ({feelsLike}{unit} जैसा महसूस होता है)',

        // Condition clauses
        sumConditionThunderstorms: ' आंधी तूफान के साथ',
        sumConditionSnowing: ' और बर्फबारी हो रही है',
        sumConditionRaining: ' और बारिश हो रही है',
        sumConditionRainingWithAmount: ' और बारिश हो रही है (आज {amount} की उम्मीद)',
        sumConditionRainingWithAmountClearingBy: ' और बारिश हो रही है (आज {amount} की उम्मीद), {hour} के आसपास साफ हो जाएगा',
        sumConditionRainSoon: ' बहुत जल्द बारिश की संभावना',
        sumConditionRainLikelyAround: ' {hour} के आसपास बारिश की संभावना',
        sumConditionClearSkies: ' साफ आसमान के साथ',
        sumConditionCloudy: ' और बादल छाए हैं',

        // Follow-up sentences
        sumTodayHigh: 'आज अधिकतम {high}{unit}',
        sumTomorrowRainWithAmount: 'कल बारिश की उम्मीद ({amount})',
        sumTomorrowSnowWithAmount: 'कल बर्फबारी की उम्मीद ({amount})',
        sumTomorrowRainNoAmount: 'कल बारिश की उम्मीद',
        sumTomorrowWarming: 'कल {high}{unit} तक गर्मी बढ़ेगी',
        sumTomorrowCooling: 'कल {high}{unit} तक ठंडक होगी',

        // UV Index levels
        uvLow: '(कम)',
        uvModerate: '(मध्यम)',
        uvHigh: '(उच्च)',
        uvVeryHigh: '(बहुत उच्च)',
        uvExtreme: '(अत्यधिक)',

        // Loading / unavailable messages
        loading: 'लोड हो रहा है...',
        loadingRadar: 'रडार लोड हो रहा है...',
        refreshingRadar: 'रडार ताज़ा हो रहा है...',
        radarUnavailable: 'रडार उपलब्ध नहीं',
        pollenDataUnavailable: 'इस स्थान के लिए पराग डेटा उपलब्ध नहीं',

        // Astronomy labels
        sunrise: 'सूर्योदय',
        sunset: 'सूर्यास्त',
        solarNoon: 'सौर मध्याह्न',
        moonrise: 'चंद्रोदय',
        moonset: 'चंद्रास्त',
        phase: 'कला',

        // Moon phase names
        moonPhaseNewMoon: 'अमावस्या',
        moonPhaseWaxingCrescent: 'शुक्ल पक्ष की तृतीया',
        moonPhaseFirstQuarter: 'प्रथम पक्ष',
        moonPhaseWaxingGibbous: 'वर्धमान उभार',
        moonPhaseFullMoon: 'पूर्णिमा',
        moonPhaseWaningGibbous: 'क्षीयमाण उभार',
        moonPhaseLastQuarter: 'अंतिम पक्ष',
        moonPhaseWaningCrescent: 'कृष्ण पक्ष की तृतीया',

        // Chart legends
        chartTemperature: 'तापमान',
        chartFeelsLike: 'महसूस होता है',
        chartDewPoint: 'ओस बिंदु',
        chartCloudCover: 'बादल आवरण',
        chartPrecipChance: 'वर्षा संभावना',
        chartHumidity: 'आर्द्रता',
        chartPressure: 'दबाव',
        chartPrecipAccum: 'वर्षा संचय',
        chartHourlyPrecip: 'घंटेवार वर्षा',
        chartWindSpeed: 'हवा की गति',
        chartWindGusts: 'झोंके',

        // Section controls
        dragToReorder: 'पुनर्व्यवस्थित करने के लिए खींचें',
        moveUp: 'ऊपर ले जाएं',
        moveDown: 'नीचे ले जाएं',
        singleColumn: 'एकल कॉलम',
        fullWidth: 'पूरी चौड़ाई',
        removeSection: 'अनुभाग हटाएं',
        minimizeSection: 'अनुभाग छोटा करें',
        hideChart: 'चार्ट छुपाएं',

        // Radar controls
        refreshRadar: 'रडार ताज़ा करें',
        pauseRadar: 'विराम',
        playRadar: 'चलाएं',
        // Radar progress / forecast labels
        forecastLabel: 'पूर्वानुमान',
        radarNow: 'अभी',
        slowerRadar: 'धीमा',
        fasterRadar: 'तेज़',

        // Show prefix
        showSectionPrefix: '{name} दिखाएं',

        // Tagline
        tagline: 'बिना गड़बड़ी के मौसम।',

        // AQI severity
        aqiGood: 'अच्छा',
        aqiModerate: 'मध्यम',
        aqiUnhealthyForSensitive: 'संवेदनशील समूहों के लिए अस्वस्थ',
        aqiUnhealthy: 'अस्वस्थ',
        aqiVeryUnhealthy: 'बहुत अस्वस्थ',
        aqiHazardous: 'खतरनाक',

        // Pollen levels
        pollenLow: 'कम',
        pollenLowMed: 'कम-मध्यम',
        pollenMedium: 'मध्यम',
        pollenHigh: 'उच्च',
        pollenVeryHigh: 'बहुत उच्च',

        // Misc
        highTemp: 'अधिकतम',
        lowTemp: 'न्यूनतम',

        // Search / errors / aria-labels
        searching: 'खोज रहा है...',
        didYouMean: 'क्या आपका मतलब था:',
        locationNotFound: 'स्थान नहीं मिला। दूसरा शहर या पिन कोड आज़माएँ।',
        failedToLoadWeather: 'मौसम डेटा लोड नहीं हो सका। कृपया फिर से प्रयास करें।',
        retry: 'पुनः प्रयास',
        hide: 'छिपाएँ',
        close: 'बंद करें',
        toggleTheme: 'डार्क मोड टॉगल करें',
        backToSearch: 'खोज पर वापस'
};
