// NoAdsWeather translations — Arabic (ar).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "ar". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.ar = {
        // UI
        currentConditions: 'الأحوال الحالية',
        hourlyForecast: 'التوقعات بالساعة',
        tenDayForecast: 'توقعات 10 أيام',
        radar: 'الرادار',
        pollen: 'حبوب اللقاح',
        sun: 'الشمس',
        moon: 'القمر',
        weatherAlerts: '⚠️ تنبيهات الطقس',
        translateAlert: 'ترجمة',
        searchPlaceholder: 'أدخل المدينة أو الرمز البريدي',
        searchButton: 'بحث',
        back: '← رجوع',
        privacyCookies: 'الخصوصية',
        about: 'حول',
        supportThisSite: 'ادعم هذا الموقع',
        showMore: 'عرض المزيد',
        showLess: 'عرض أقل',
        lockLayout: 'قفل التخطيط',
        unlockLayout: 'إلغاء قفل التخطيط',
        settings: 'الإعدادات',
        restoreDefaultLayout: 'استعادة التخطيط الافتراضي',
        seePollenData: 'عرض بيانات حبوب اللقاح',
        feelsLike: 'درجة الإحساس',
        humidity: 'الرطوبة',
        dewPoint: 'نقطة الندى',
        wind: 'الرياح',
        gusts: 'العواصف',
        airQuality: 'جودة الهواء',
        uvIndex: 'مؤشر الأشعة فوق البنفسجية',
        nwsRadarLink: 'رادار NWS ↗',
        language: 'اللغة',

        // Style names
        style: 'النمط',
        styleDefault: 'افتراضي',
        styleEditorial: 'تحريري',
        styleBulletin: 'نشرة',
        styleQuiet: 'هادئ',

        machineTranslationNotice: 'ترجمات واجهة المستخدم مُولَّدة آليًا وقد لا تكون مثالية.',

        // Settings labels
        settingForecastColors: 'عرض خلفيات ملونة في توقعات 10 أيام',
        settingSupportBtn: 'عرض زر الدعم المزعج',
        settingWeatherSummary: 'عرض ملخص الطقس',
        settingThemeToggle: 'عرض زر الوضع الفاتح / الوضع الداكن',
        settingUnitsBtn: 'عرض زر °C / °F',
        settingTimeBtn: 'عرض زر 12 ساعة / 24 ساعة',
        settingLockBtn: 'عرض زر القفل / إلغاء القفل',
        settingNwsLink: 'عرض رابط رادار NWS',
        settingShowSectionButtons: 'عرض أزرار "إظهار القسم" عندما تكون الأقسام مخفية',
        settingTranslateLink: 'عرض رابط ترجمة التنبيهات',
        settingAlertsMinimized: 'إظهار تنبيهات الطقس مصغرة دائمًا',
        dismissAlert: 'إخفاء التنبيه',
        settingAutoPlayRadar: 'تشغيل الرادار تلقائيًا دائمًا',
        settingRememberCity: 'تذكر آخر مدينة',
        cityPageTitle: 'طقس {city} بدون إعلانات',
        cityPageSeoBlurb: 'توقعات الطقس لـ {city} بدون إعلانات أو ملفات تعريف الارتباط أو التتبع. بيانات Open-Meteo، توقعات لمدة 10 أيام، حالة كل ساعة، ورادار — كل ذلك مجاناً.',
        cityPageHideBlurb: 'انقر هنا للإخفاء',
        cities: 'المدن',
        popularCities: 'مدن شائعة',
        nearbyCities: 'مدن قريبة',
        useMyLocation: 'استخدام موقعي',
        myLocation: 'موقعي',
        geoDenied: 'تم رفض الوصول إلى الموقع — يمكنك البحث عن مدينتك بدلاً من ذلك.',
        geoFailed: 'تعذر تحديد موقعك — حاول البحث عن مدينتك.',
        settingAutoLocate: 'استخدام موقعي تلقائيًا في كل زيارة',
        refresh: 'تحديث',
        updatedJustNow: 'تم التحديث للتو',
        updatedAgo: 'تم التحديث {time}',
        climateHeading: 'المناخ في {city}',
        climateMonth: 'الشهر',
        climateHigh: 'العظمى',
        climateLow: 'الصغرى',
        climatePrecip: 'الهطول',
        climateWetDays: 'أيام المطر',
        climateSummary: '{hotMonth} هو أحر شهر في {city} بمتوسط عظمى {hotTemp}؛ و{coldMonth} هو الأبرد ({coldTemp}). {wetMonth} هو الشهر الأكثر مطرًا بمتوسط {wetAmount}.',
        climateRecords: 'القيم القصوى منذ {year}: أعلى {high} ({highDate})، وأدنى {low} ({lowDate}).',
        climateDaylight: 'يتراوح ضوء النهار من نحو {short} ساعات في {shortMonth} إلى نحو {long} ساعة في {longMonth}.',
        climateSource: 'البيانات: Meteostat — {station}، متوسطات {period}.',
        hide: 'إخفاء',
        settingShowClimate: 'عرض المعدلات المناخية في صفحات المدن',
        notFoundTitle: 'الصفحة غير موجودة',
        notFoundBlurb: 'هذه الصفحة غير موجودة — لكن الطقس موجود. ابحث عن مدينتك:',

        // Weather codes
        wc0: 'سماء صافية',
        wc1: 'صافية في الغالب',
        wc2: 'غائمة جزئيًا',
        wc3: 'غائم',
        wc45: 'ضباب',
        wc48: 'ضباب متجمد',
        wc51: 'رذاذ خفيف',
        wc53: 'رذاذ معتدل',
        wc55: 'رذاذ كثيف',
        wc61: 'مطر خفيف',
        wc63: 'مطر معتدل',
        wc65: 'مطر غزير',
        wc71: 'ثلج خفيف',
        wc73: 'ثلج معتدل',
        wc75: 'ثلج غزير',
        wc77: 'حبيبات ثلجية',
        wc80: 'زخات مطر خفيفة',
        wc81: 'زخات مطر معتدلة',
        wc82: 'زخات مطر عنيفة',
        wc85: 'زخات ثلج خفيفة',
        wc86: 'زخات ثلج كثيفة',
        wc95: 'عاصفة رعدية',
        wc96: 'عاصفة رعدية مع برد خفيف',
        wc99: 'عاصفة رعدية مع برد غزير',
        wcUnknown: 'غير معروف',

        // Temp adjectives
        sumTempFreezing: 'الجو متجمد',
        sumTempCold: 'الجو بارد',
        sumTempCool: 'الجو منعش',
        sumTempMild: 'الجو',
        sumTempWarm: 'الجو دافئ',
        sumTempHot: 'الجو حار',

        // Opening template
        sumOpeningTemplate: '{tempAdj} عند {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (يُحس بها {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' مع عواصف رعدية',
        sumConditionSnowing: ' وتساقط للثلج',
        sumConditionRaining: ' وتساقط للمطر',
        sumConditionRainingWithAmount: ' وتساقط للمطر ({amount} متوقعة اليوم)',
        sumConditionRainingWithAmountClearingBy: ' وتساقط للمطر ({amount} متوقعة اليوم)، تتحسن الحالة حوالي {hour}',
        sumConditionRainSoon: ' مع توقع هطول مطر قريبًا جدًا',
        sumConditionRainLikelyAround: ' مع احتمال هطول مطر حوالي {hour}',
        sumConditionClearSkies: ' مع سماء صافية',
        sumConditionCloudy: ' وغائم',

        // Follow-up sentences
        sumTodayHigh: 'درجة الحرارة العظمى اليوم {high}{unit}',
        sumTomorrowRainWithAmount: 'يُتوقع هطول مطر غدًا ({amount})',
        sumTomorrowSnowWithAmount: 'يُتوقع تساقط ثلج غدًا ({amount})',
        sumTomorrowRainNoAmount: 'يُتوقع هطول مطر غدًا',
        sumTomorrowWarming: 'ارتفاع إلى {high}{unit} غدًا',
        sumTomorrowCooling: 'انخفاض إلى {high}{unit} غدًا',

        // UV Index levels
        uvLow: '(منخفض)',
        uvModerate: '(معتدل)',
        uvHigh: '(مرتفع)',
        uvVeryHigh: '(مرتفع جدًا)',
        uvExtreme: '(شديد)',

        // Loading / unavailable messages
        loading: 'جاري التحميل...',
        loadingRadar: 'جاري تحميل الرادار...',
        refreshingRadar: 'جاري تحديث الرادار...',
        radarUnavailable: 'الرادار غير متاح',
        pollenDataUnavailable: 'بيانات حبوب اللقاح غير متاحة لهذا الموقع',

        // Astronomy labels
        sunrise: 'شروق الشمس',
        sunset: 'غروب الشمس',
        solarNoon: 'الظهر الشمسي',
        moonrise: 'شروق القمر',
        moonset: 'غروب القمر',
        phase: 'الطور',

        // Moon phase names
        moonPhaseNewMoon: 'محاق',
        moonPhaseWaxingCrescent: 'هلال أول',
        moonPhaseFirstQuarter: 'تربيع أول',
        moonPhaseWaxingGibbous: 'أحدب متزايد',
        moonPhaseFullMoon: 'بدر',
        moonPhaseWaningGibbous: 'أحدب متناقص',
        moonPhaseLastQuarter: 'تربيع ثانٍ',
        moonPhaseWaningCrescent: 'هلال أخير',

        // Chart legends
        chartTemperature: 'درجة الحرارة',
        chartFeelsLike: 'درجة الإحساس',
        chartDewPoint: 'نقطة الندى',
        chartCloudCover: 'الغيوم',
        chartPrecipChance: 'احتمال الهطول',
        chartHumidity: 'الرطوبة',
        chartPressure: 'الضغط',
        chartPrecipAccum: 'الهطول المتراكم',
        chartHourlyPrecip: 'الهطول الساعي',
        chartWindSpeed: 'سرعة الرياح',
        chartWindGusts: 'هبات الرياح',

        // Section controls
        dragToReorder: 'اسحب لإعادة الترتيب',
        moveUp: 'نقل لأعلى',
        moveDown: 'نقل لأسفل',
        singleColumn: 'عمود واحد',
        fullWidth: 'عرض كامل',
        removeSection: 'إزالة القسم',
        minimizeSection: 'تصغير القسم',
        hideChart: 'إخفاء الرسم',

        // Radar controls
        refreshRadar: 'تحديث الرادار',
        pauseRadar: 'إيقاف مؤقت',
        playRadar: 'تشغيل',
        // Radar progress / forecast labels
        forecastLabel: 'توقعات',
        radarNow: 'الآن',
        slowerRadar: 'أبطأ',
        fasterRadar: 'أسرع',

        // Show prefix
        showSectionPrefix: 'عرض {name}',

        // Tagline
        tagline: 'الطقس بدون فوضى.',

        // AQI severity
        aqiGood: 'جيد',
        aqiModerate: 'معتدل',
        aqiUnhealthyForSensitive: 'غير صحي للفئات الحساسة',
        aqiUnhealthy: 'غير صحي',
        aqiVeryUnhealthy: 'غير صحي جدًا',
        aqiHazardous: 'خطير',

        // Pollen levels
        pollenLow: 'منخفض',
        pollenLowMed: 'منخفض-متوسط',
        pollenMedium: 'متوسط',
        pollenHigh: 'مرتفع',
        pollenVeryHigh: 'مرتفع جدًا',

        // Misc
        highTemp: 'العظمى',
        lowTemp: 'الصغرى',

        // Search / errors / aria-labels
        searching: 'جارٍ البحث...',
        didYouMean: 'هل تقصد:',
        locationNotFound: 'لم يتم العثور على الموقع. جرّب مدينة أو رمزًا بريديًا آخر.',
        failedToLoadWeather: 'فشل تحميل بيانات الطقس. حاول مرة أخرى.',
        retry: 'إعادة المحاولة',
        hide: 'إخفاء',
        close: 'إغلاق',
        toggleTheme: 'تبديل الوضع الداكن',
        backToSearch: 'العودة إلى البحث'
};
