// NoAdsWeather translations — Russian (ru).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "ru". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.ru = {
        // UI
        currentConditions: 'Текущие условия',
        hourlyForecast: 'Почасовой прогноз',
        tenDayForecast: 'Прогноз на 10 дней',
        radar: 'Радар',
        pollen: 'Пыльца',
        sun: 'Солнце',
        moon: 'Луна',
        weatherAlerts: '⚠️ Погодные предупреждения',
        translateAlert: 'Перевести',
        searchPlaceholder: 'Введите город или почтовый индекс',
        searchButton: 'Поиск',
        back: '← Назад',
        privacyCookies: 'Конфиденциальность',
        about: 'О сайте',
        supportThisSite: 'Поддержать сайт',
        showMore: 'Показать больше',
        showLess: 'Показать меньше',
        lockLayout: 'Заблокировать макет',
        unlockLayout: 'Разблокировать макет',
        settings: 'Настройки',
        restoreDefaultLayout: 'Восстановить макет по умолчанию',
        seePollenData: 'Посмотреть данные о пыльце',
        feelsLike: 'Ощущается как',
        humidity: 'Влажность',
        dewPoint: 'Точка росы',
        wind: 'Ветер',
        gusts: 'Порывы',
        airQuality: 'Качество воздуха',
        uvIndex: 'УФ-индекс',
        nwsRadarLink: 'Радар NWS ↗',
        language: 'Язык',

        // Style names
        style: 'Стиль',
        styleDefault: 'По умолчанию',
        styleEditorial: 'Журнальный',
        styleBulletin: 'Бюллетень',
        styleQuiet: 'Тихий',

        machineTranslationNotice: 'Переводы интерфейса сгенерированы автоматически и могут быть неидеальными.',

        // Settings labels
        settingForecastColors: 'Показывать цветной фон в 10-дневном прогнозе',
        settingSupportBtn: 'Показывать назойливую кнопку поддержки',
        settingWeatherSummary: 'Показывать сводку погоды',
        settingThemeToggle: 'Показывать кнопку Светлый / Тёмный режим',
        settingUnitsBtn: 'Показывать кнопку °C / °F',
        settingTimeBtn: 'Показывать кнопку 12H / 24H',
        settingLockBtn: 'Показывать кнопку Заблокировать / Разблокировать',
        settingNwsLink: 'Показывать ссылку на радар NWS',
        settingShowSectionButtons: 'Показывать кнопки "Показать раздел", когда разделы скрыты',
        settingTranslateLink: 'Показывать ссылку для перевода предупреждений',
        settingAlertsMinimized: 'Всегда показывать предупреждения свёрнутыми',
        dismissAlert: 'Скрыть предупреждение',
        settingAutoPlayRadar: 'Всегда воспроизводить радар автоматически',
        settingRememberCity: 'Запомнить последний город',
        cityPageTitle: 'Погода {city} без рекламы',
        cityPageSeoBlurb: 'Прогноз погоды для {city} без рекламы, cookies и отслеживания. Данные Open-Meteo, прогноз на 10 дней, почасовые условия и радар — всё бесплатно.',
        cityPageHideBlurb: 'нажмите здесь, чтобы скрыть',
        cities: 'Города',
        popularCities: 'Популярные города',
        appSectionTitle: 'Приложение погоды без рекламы',
        appSectionBody: 'Ничего скачивать не нужно. Добавьте NoAdsWeather на главный экран — сайт откроется в полноэкранном режиме со своим значком: без адресной строки, без магазина приложений, без аккаунта. Это тот же сайт, поэтому по-прежнему без рекламы и без слежки.',
        appIosTitle: 'На iPhone или iPad',
        appIosStep1: 'Нажмите «Поделиться» (квадрат со стрелкой)',
        appIosStep2: 'Нажмите «На экран Домой»',
        appIosStep3: 'Нажмите «Добавить»',
        appAndroidTitle: 'На Android',
        appAndroidStep1: 'Нажмите меню ⋮ в Chrome',
        appAndroidStep2: 'Нажмите «Добавить на главный экран»',
        appAndroidStep3: 'Нажмите «Добавить»',
        appSectionNote: 'Выберите город один раз — он будет открываться всегда.',
        nearbyCities: 'Города поблизости',
        useMyLocation: 'Использовать моё местоположение',
        myLocation: 'Моё местоположение',
        geoDenied: 'Доступ к местоположению запрещён — вы можете найти свой город вручную.',
        geoFailed: 'Не удалось определить местоположение — попробуйте найти свой город.',
        settingAutoLocate: 'Автоматически использовать моё местоположение при каждом посещении',

        // Share card
        share: 'Поделиться',
        shareTitle: 'Поделиться прогнозом',
        share5Day: 'Прогноз на 5 дней',
        share7Day: 'Прогноз на 7 дней',
        shareIncludeCurrent: 'Включить текущие условия',
        shareIncludePollen: 'Включить данные о пыльце',
        shareEmoji: 'Добавить реакцию',
        shareEmojiNone: 'Нет',
        shareCreate: 'Создать изображение',
        shareShareBtn: 'Поделиться',
        shareDownload: 'Скачать',
        shareCopyLink: 'Скопировать ссылку',
        shareLinkCopied: 'Скопировано!',
        shareGenerating: 'Создание изображения...',
        shareFailed: 'Не удалось создать изображение',
        shareShareFailed: 'Не удалось поделиться изображением',
        shareCopyFailed: 'Не удалось скопировать ссылку',
        settingShareBtn: 'Показывать кнопку "Поделиться"',

        refresh: 'Обновить',
        updatedJustNow: 'Обновлено только что',
        updatedAgo: 'Обновлено {time}',
        climateHeading: 'Климат — {city}',
        climateMonth: 'Месяц',
        climateHigh: 'Макс.',
        climateLow: 'Мин.',
        climatePrecip: 'Осадки',
        climateWetDays: 'Дни с осадками',
        climateSummary: '{hotMonth} — самый тёплый месяц ({city}): средний максимум {hotTemp}; {coldMonth} — самый холодный ({coldTemp}). {wetMonth} — самый дождливый месяц (в среднем {wetAmount} осадков).',
        climateRecords: 'Экстремумы с {year} года: максимум {high} ({highDate}), минимум {low} ({lowDate}).',
        climateDaylight: 'Световой день: около {long} ч ({longMonth}) и {short} ч ({shortMonth}).',
        climateSource: 'Данные: Meteostat — {station}, средние за {period}.',
        hide: 'Скрыть',
        settingShowClimate: 'Показывать климатические средние на страницах городов',
        notFoundTitle: 'Страница не найдена',
        notFoundBlurb: 'Такой страницы нет — а погода есть. Найдите свой город:',

        // Weather codes
        wc0: 'Ясное небо',
        wc1: 'Преимущественно ясно',
        wc2: 'Переменная облачность',
        wc3: 'Пасмурно',
        wc45: 'Туман',
        wc48: 'Изморозь',
        wc51: 'Лёгкая морось',
        wc53: 'Умеренная морось',
        wc55: 'Сильная морось',
        wc61: 'Слабый дождь',
        wc63: 'Умеренный дождь',
        wc65: 'Сильный дождь',
        wc71: 'Слабый снег',
        wc73: 'Умеренный снег',
        wc75: 'Сильный снег',
        wc77: 'Снежная крупа',
        wc80: 'Слабые ливни',
        wc81: 'Умеренные ливни',
        wc82: 'Сильные ливни',
        wc85: 'Слабые снежные заряды',
        wc86: 'Сильные снежные заряды',
        wc95: 'Гроза',
        wc96: 'Гроза с мелким градом',
        wc99: 'Гроза с крупным градом',
        wcUnknown: 'Неизвестно',

        // Temp adjectives
        sumTempFreezing: 'Морозно',
        sumTempCold: 'Холодно',
        sumTempCool: 'Прохладно',
        sumTempMild: 'Сейчас',
        sumTempWarm: 'Тепло',
        sumTempHot: 'Жарко',

        // Opening template
        sumOpeningTemplate: '{tempAdj} при {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (ощущается как {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' с грозами',
        sumConditionSnowing: ' и идёт снег',
        sumConditionRaining: ' и идёт дождь',
        sumConditionRainingWithAmount: ' и идёт дождь (сегодня ожидается {amount})',
        sumConditionRainingWithAmountClearingBy: ' и идёт дождь (сегодня ожидается {amount}), прояснение около {hour}',
        sumConditionRainSoon: ' с дождём, ожидаемым очень скоро',
        sumConditionRainLikelyAround: ' с вероятным дождём около {hour}',
        sumConditionClearSkies: ' с ясным небом',
        sumConditionCloudy: ' и облачно',

        // Follow-up sentences
        sumTodayHigh: 'Максимум {high}{unit} сегодня',
        sumTomorrowRainWithAmount: 'Завтра ожидается дождь ({amount})',
        sumTomorrowSnowWithAmount: 'Завтра ожидается снег ({amount})',
        sumTomorrowRainNoAmount: 'Завтра ожидается дождь',
        sumTomorrowWarming: 'потепление до {high}{unit} завтра',
        sumTomorrowCooling: 'похолодание до {high}{unit} завтра',

        // UV Index levels
        uvLow: '(Низкий)',
        uvModerate: '(Умеренный)',
        uvHigh: '(Высокий)',
        uvVeryHigh: '(Очень высокий)',
        uvExtreme: '(Экстремальный)',

        // Loading / unavailable messages
        loading: 'Загрузка...',
        loadingRadar: 'Загрузка радара...',
        refreshingRadar: 'Обновление радара...',
        radarUnavailable: 'Радар недоступен',
        pollenDataUnavailable: 'Данные о пыльце недоступны для этого места',

        // Astronomy labels
        sunrise: 'Восход',
        sunset: 'Закат',
        solarNoon: 'Солнечный полдень',
        moonrise: 'Восход луны',
        moonset: 'Заход луны',
        phase: 'Фаза',

        // Moon phase names
        moonPhaseNewMoon: 'Новолуние',
        moonPhaseWaxingCrescent: 'Молодая луна',
        moonPhaseFirstQuarter: 'Первая четверть',
        moonPhaseWaxingGibbous: 'Растущая луна',
        moonPhaseFullMoon: 'Полнолуние',
        moonPhaseWaningGibbous: 'Убывающая луна',
        moonPhaseLastQuarter: 'Последняя четверть',
        moonPhaseWaningCrescent: 'Старая луна',

        // Chart legends
        chartTemperature: 'Температура',
        chartFeelsLike: 'Ощущается',
        chartDewPoint: 'Точка росы',
        chartCloudCover: 'Облачность',
        chartPrecipChance: 'Вероятн. осадков',
        chartHumidity: 'Влажность',
        chartPressure: 'Давление',
        chartPrecipAccum: 'Сумма осадков',
        chartHourlyPrecip: 'Осадки за час',
        chartWindSpeed: 'Скорость ветра',
        chartWindGusts: 'Порывы',

        // Section controls
        dragToReorder: 'Перетащите для перестановки',
        moveUp: 'Переместить вверх',
        moveDown: 'Переместить вниз',
        singleColumn: 'Одна колонка',
        fullWidth: 'На всю ширину',
        removeSection: 'Удалить раздел',
        minimizeSection: 'Свернуть раздел',
        hideChart: 'Скрыть график',

        // Radar controls
        refreshRadar: 'Обновить радар',
        pauseRadar: 'Пауза',
        playRadar: 'Воспроизвести',
        // Radar progress / forecast labels
        forecastLabel: 'ПРОГНОЗ',
        radarNow: 'СЕЙЧАС',
        slowerRadar: 'Медленнее',
        fasterRadar: 'Быстрее',

        // Show prefix
        showSectionPrefix: 'Показать {name}',

        // Tagline
        tagline: 'Погода без лишнего шума.',

        // AQI severity
        aqiGood: 'Хорошее',
        aqiModerate: 'Умеренное',
        aqiUnhealthyForSensitive: 'Нездоровое для чувствительных групп',
        aqiUnhealthy: 'Нездоровое',
        aqiVeryUnhealthy: 'Очень нездоровое',
        aqiHazardous: 'Опасное',

        // Pollen levels
        pollenLow: 'Низкий',
        pollenLowMed: 'Низкий-Средний',
        pollenMedium: 'Средний',
        pollenHigh: 'Высокий',
        pollenVeryHigh: 'Очень высокий',

        // Misc
        highTemp: 'Макс',
        lowTemp: 'Мин',

        // Search / errors / aria-labels
        searching: 'Поиск...',
        didYouMean: 'Возможно, вы имели в виду:',
        locationNotFound: 'Местоположение не найдено. Попробуйте другой город или почтовый индекс.',
        failedToLoadWeather: 'Не удалось загрузить данные о погоде. Попробуйте снова.',
        retry: 'Повторить',
        hide: 'Скрыть',
        close: 'Закрыть',
        toggleTheme: 'Переключить тёмный режим',
        backToSearch: 'Назад к поиску'
};
