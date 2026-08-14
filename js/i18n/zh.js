// NoAdsWeather translations — Chinese (zh).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "zh". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.zh = {
        // UI
        currentConditions: '当前天气',
        hourlyForecast: '每小时预报',
        tenDayForecast: '10天预报',
        radar: '雷达',
        pollen: '花粉',
        sun: '日出日落',
        moon: '月相',
        weatherAlerts: '⚠️ 天气警报',
        translateAlert: '翻译',
        searchPlaceholder: '输入城市或邮政编码',
        searchButton: '搜索',
        back: '← 返回',
        privacyCookies: '隐私',
        about: '关于',
        supportThisSite: '支持本站',
        showMore: '显示更多',
        showLess: '收起',
        lockLayout: '锁定布局',
        unlockLayout: '解锁布局',
        settings: '设置',
        restoreDefaultLayout: '恢复默认布局',
        seePollenData: '查看花粉数据',
        feelsLike: '体感温度',
        humidity: '湿度',
        dewPoint: '露点',
        wind: '风',
        gusts: '阵风',
        airQuality: '空气质量',
        uvIndex: '紫外线指数',
        nwsRadarLink: 'NWS雷达 ↗',
        language: '语言',

        // Style names
        style: '样式',
        styleDefault: '默认',
        styleEditorial: '杂志风',
        styleBulletin: '公告',
        styleQuiet: '静谧',

        machineTranslationNotice: '界面翻译由机器生成，可能不完美。',

        // Settings labels
        settingForecastColors: '在10天预报上显示彩色背景',
        settingSupportBtn: '显示烦人的支持按钮',
        settingWeatherSummary: '显示天气摘要',
        settingThemeToggle: '显示浅色 / 深色模式按钮',
        settingUnitsBtn: '显示 °C / °F 按钮',
        settingTimeBtn: '显示 12小时 / 24小时 按钮',
        settingLockBtn: '显示锁定 / 解锁按钮',
        settingNwsLink: '显示NWS雷达链接',
        settingShowSectionButtons: '当部分隐藏时显示"显示部分"按钮',
        settingTranslateLink: '显示警报翻译链接',
        settingAutoPlayRadar: '始终自动播放雷达',
        settingRememberCity: '记住上次城市',
        cityPageTitle: '{city} 天气 无广告',
        cityPageSeoBlurb: '{city}天气预报，无广告、无Cookie、无跟踪。Open-Meteo数据，10天预报，每小时状况和雷达——全部免费。',
        cityPageHideBlurb: '点击此处隐藏',
        cities: '城市',
        popularCities: '热门城市',
        nearbyCities: '附近城市',
        useMyLocation: '使用我的位置',
        myLocation: '我的位置',
        geoDenied: '位置权限被拒绝 — 您可以改为搜索您的城市。',
        geoFailed: '无法确定您的位置 — 请尝试搜索您的城市。',
        settingAutoLocate: '每次访问时自动使用我的位置',
        refresh: '刷新',
        updatedJustNow: '刚刚更新',
        updatedAgo: '{time}更新',
        climateHeading: '{city}气候',
        climateMonth: '月份',
        climateHigh: '最高',
        climateLow: '最低',
        climatePrecip: '降水',
        climateWetDays: '雨日',
        climateSummary: '{city}最热的月份是{hotMonth}（平均最高{hotTemp}），最冷的是{coldMonth}（{coldTemp}）。{wetMonth}降水最多（平均{wetAmount}）。',
        climateRecords: '自{year}年以来的极值：最高{high}（{highDate}），最低{low}（{lowDate}）。',
        climateDaylight: '白昼时长从{shortMonth}的约{short}小时到{longMonth}的约{long}小时。',
        climateSource: '数据：Open-Meteo（ERA5再分析），{period}年平均值。',

        // Weather codes
        wc0: '晴',
        wc1: '大部分晴朗',
        wc2: '局部多云',
        wc3: '阴',
        wc45: '雾',
        wc48: '雾凇',
        wc51: '小毛毛雨',
        wc53: '中等毛毛雨',
        wc55: '大毛毛雨',
        wc61: '小雨',
        wc63: '中雨',
        wc65: '大雨',
        wc71: '小雪',
        wc73: '中雪',
        wc75: '大雪',
        wc77: '米雪',
        wc80: '小阵雨',
        wc81: '中阵雨',
        wc82: '强阵雨',
        wc85: '小阵雪',
        wc86: '大阵雪',
        wc95: '雷暴',
        wc96: '雷暴伴小冰雹',
        wc99: '雷暴伴大冰雹',
        wcUnknown: '未知',

        // Temp adjectives
        sumTempFreezing: '极寒',
        sumTempCold: '寒冷',
        sumTempCool: '凉爽',
        sumTempMild: '气温',
        sumTempWarm: '温暖',
        sumTempHot: '炎热',

        // Opening template
        sumOpeningTemplate: '{tempAdj}，{temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: '（体感{feelsLike}{unit}）',

        // Condition clauses
        sumConditionThunderstorms: '，有雷暴',
        sumConditionSnowing: '，正在下雪',
        sumConditionRaining: '，正在下雨',
        sumConditionRainingWithAmount: '，正在下雨（今日预计{amount}）',
        sumConditionRainingWithAmountClearingBy: '，正在下雨（今日预计{amount}），{hour}前后转晴',
        sumConditionRainSoon: '，即将有雨',
        sumConditionRainLikelyAround: '，{hour}前后可能有雨',
        sumConditionClearSkies: '，天空晴朗',
        sumConditionCloudy: '，多云',

        // Follow-up sentences
        sumTodayHigh: '今日最高{high}{unit}',
        sumTomorrowRainWithAmount: '明天预计有雨（{amount}）',
        sumTomorrowSnowWithAmount: '明天预计有雪（{amount}）',
        sumTomorrowRainNoAmount: '明天预计有雨',
        sumTomorrowWarming: '明天回暖至{high}{unit}',
        sumTomorrowCooling: '明天降至{high}{unit}',

        // UV Index levels
        uvLow: '（低）',
        uvModerate: '（中等）',
        uvHigh: '（高）',
        uvVeryHigh: '（很高）',
        uvExtreme: '（极高）',

        // Loading / unavailable messages
        loading: '加载中...',
        loadingRadar: '雷达加载中...',
        refreshingRadar: '雷达刷新中...',
        radarUnavailable: '雷达不可用',
        pollenDataUnavailable: '该位置花粉数据不可用',

        // Astronomy labels
        sunrise: '日出',
        sunset: '日落',
        solarNoon: '正午',
        moonrise: '月出',
        moonset: '月落',
        phase: '月相',

        // Moon phase names
        moonPhaseNewMoon: '新月',
        moonPhaseWaxingCrescent: '娥眉月',
        moonPhaseFirstQuarter: '上弦月',
        moonPhaseWaxingGibbous: '盈凸月',
        moonPhaseFullMoon: '满月',
        moonPhaseWaningGibbous: '亏凸月',
        moonPhaseLastQuarter: '下弦月',
        moonPhaseWaningCrescent: '残月',

        // Chart legends
        chartTemperature: '温度',
        chartFeelsLike: '体感温度',
        chartDewPoint: '露点',
        chartCloudCover: '云量',
        chartPrecipChance: '降水概率',
        chartHumidity: '湿度',
        chartPressure: '气压',
        chartPrecipAccum: '累积降水',
        chartHourlyPrecip: '每小时降水',
        chartWindSpeed: '风速',
        chartWindGusts: '阵风',

        // Section controls
        dragToReorder: '拖动以重新排序',
        moveUp: '上移',
        moveDown: '下移',
        singleColumn: '单列',
        fullWidth: '全宽',
        removeSection: '移除部分',
        minimizeSection: '最小化部分',
        hideChart: '隐藏图表',

        // Radar controls
        refreshRadar: '刷新雷达',
        pauseRadar: '暂停',
        playRadar: '播放',
        // Radar progress / forecast labels
        forecastLabel: '预报',
        radarNow: '现在',
        slowerRadar: '较慢',
        fasterRadar: '较快',

        // Show prefix
        showSectionPrefix: '显示{name}',

        // Tagline
        tagline: '简洁的天气预报。',

        // AQI severity
        aqiGood: '良好',
        aqiModerate: '中等',
        aqiUnhealthyForSensitive: '对敏感人群不健康',
        aqiUnhealthy: '不健康',
        aqiVeryUnhealthy: '非常不健康',
        aqiHazardous: '危险',

        // Pollen levels
        pollenLow: '低',
        pollenLowMed: '低-中',
        pollenMedium: '中',
        pollenHigh: '高',
        pollenVeryHigh: '很高',

        // Misc
        highTemp: '最高',
        lowTemp: '最低',

        // Search / errors / aria-labels
        searching: '搜索中...',
        didYouMean: '您是不是想找：',
        locationNotFound: '未找到位置。请尝试其他城市或邮政编码。',
        failedToLoadWeather: '加载天气数据失败。请重试。',
        retry: '重试',
        hide: '隐藏',
        close: '关闭',
        toggleTheme: '切换深色模式',
        backToSearch: '返回搜索'
};
