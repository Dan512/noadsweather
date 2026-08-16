// NoAdsWeather translations — Japanese (ja).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "ja". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.ja = {
        // UI
        currentConditions: '現在の状況',
        hourlyForecast: '1時間ごとの予報',
        tenDayForecast: '10日間予報',
        radar: 'レーダー',
        pollen: '花粉',
        sun: '日の出・日の入',
        moon: '月',
        weatherAlerts: '⚠️ 気象警報',
        translateAlert: '翻訳',
        searchPlaceholder: '都市名または郵便番号を入力',
        searchButton: '検索',
        back: '← 戻る',
        privacyCookies: 'プライバシー',
        about: '概要',
        supportThisSite: 'このサイトを応援する',
        showMore: 'もっと見る',
        showLess: '折りたたむ',
        lockLayout: 'レイアウトをロック',
        unlockLayout: 'レイアウトのロック解除',
        settings: '設定',
        restoreDefaultLayout: 'デフォルトのレイアウトに戻す',
        seePollenData: '花粉データを見る',
        feelsLike: '体感温度',
        humidity: '湿度',
        dewPoint: '露点',
        wind: '風',
        gusts: '突風',
        airQuality: '大気質',
        uvIndex: '紫外線指数',
        nwsRadarLink: 'NWSレーダー ↗',
        language: '言語',

        // Style names
        style: 'スタイル',
        styleDefault: 'デフォルト',
        styleEditorial: 'エディトリアル',
        styleBulletin: '速報',
        styleQuiet: '静か',

        machineTranslationNotice: 'UI翻訳は機械生成のため、完璧ではない場合があります。',

        // Settings labels
        settingForecastColors: '10日間予報に色付き背景を表示',
        settingSupportBtn: '目立つ応援ボタンを表示',
        settingWeatherSummary: '天気の概要を表示',
        settingThemeToggle: 'ライトモード / ダークモードのボタンを表示',
        settingUnitsBtn: '°C / °F ボタンを表示',
        settingTimeBtn: '12時間 / 24時間 ボタンを表示',
        settingLockBtn: 'ロック / ロック解除ボタンを表示',
        settingNwsLink: 'NWSレーダーリンクを表示',
        settingShowSectionButtons: 'セクションが非表示のときに「セクションを表示」ボタンを表示',
        settingTranslateLink: '警報の翻訳リンクを表示',
        settingAutoPlayRadar: 'レーダーを常に自動再生',
        settingRememberCity: '前回の都市を記憶',
        cityPageTitle: '{city} 天気 広告なし',
        cityPageSeoBlurb: '{city}の天気予報を広告、Cookie、トラッキングなしで。Open-Meteoデータ、10日間予報、時間ごとの状況、レーダー — すべて無料。',
        cityPageHideBlurb: 'ここをクリックして非表示',
        cities: '都市',
        popularCities: '人気の都市',
        nearbyCities: '近くの都市',
        useMyLocation: '現在地を使用',
        myLocation: '現在地',
        geoDenied: '位置情報へのアクセスが拒否されました。都市名で検索してください。',
        geoFailed: '現在地を特定できませんでした。都市名で検索してください。',
        settingAutoLocate: 'アクセス時に自動的に現在地を使用する',
        refresh: '更新',
        updatedJustNow: 'たった今更新',
        updatedAgo: '{time}に更新',
        climateHeading: '{city}の気候',
        climateMonth: '月',
        climateHigh: '最高',
        climateLow: '最低',
        climatePrecip: '降水量',
        climateWetDays: '雨の日数',
        climateSummary: '{city}では{hotMonth}が最も暑く（平均最高気温{hotTemp}）、{coldMonth}が最も寒い（{coldTemp}）。降水量が最も多いのは{wetMonth}（平均{wetAmount}）。',
        climateRecords: '{year}年以降の極値：最高{high}（{highDate}）、最低{low}（{lowDate}）。',
        climateDaylight: '日照時間は{shortMonth}の約{short}時間から{longMonth}の約{long}時間まで変化します。',
        climateSource: 'データ：Meteostat — {station}、{period}の平均。',
        notFoundTitle: 'ページが見つかりません',
        notFoundBlurb: 'このページは存在しませんが、天気はあります。都市を検索してください：',

        // Weather codes
        wc0: '快晴',
        wc1: 'ほぼ晴れ',
        wc2: '晴れ時々曇り',
        wc3: '曇り',
        wc45: '霧',
        wc48: '樹氷性の霧',
        wc51: '弱い霧雨',
        wc53: '中程度の霧雨',
        wc55: '濃い霧雨',
        wc61: '弱い雨',
        wc63: '中程度の雨',
        wc65: '強い雨',
        wc71: '弱い雪',
        wc73: '中程度の雪',
        wc75: '強い雪',
        wc77: '霧雪',
        wc80: '弱いにわか雨',
        wc81: '中程度のにわか雨',
        wc82: '激しいにわか雨',
        wc85: '弱いにわか雪',
        wc86: '強いにわか雪',
        wc95: '雷雨',
        wc96: '弱いひょうを伴う雷雨',
        wc99: '強いひょうを伴う雷雨',
        wcUnknown: '不明',

        // Temp adjectives
        sumTempFreezing: '凍えるほど寒いです',
        sumTempCold: '寒いです',
        sumTempCool: '涼しいです',
        sumTempMild: '気温は',
        sumTempWarm: '暖かいです',
        sumTempHot: '暑いです',

        // Opening template
        sumOpeningTemplate: '{tempAdj}。気温は{temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: '（体感{feelsLike}{unit}）',

        // Condition clauses
        sumConditionThunderstorms: '、雷雨があります',
        sumConditionSnowing: '、雪が降っています',
        sumConditionRaining: '、雨が降っています',
        sumConditionRainingWithAmount: '、雨が降っています（本日{amount}の予想）',
        sumConditionRainingWithAmountClearingBy: '、雨が降っています（本日{amount}の予想）。{hour}頃に晴れます',
        sumConditionRainSoon: '、まもなく雨が予想されます',
        sumConditionRainLikelyAround: '、{hour}頃に雨の可能性があります',
        sumConditionClearSkies: '、空は晴れています',
        sumConditionCloudy: '、曇っています',

        // Follow-up sentences
        sumTodayHigh: '今日の最高気温は{high}{unit}',
        sumTomorrowRainWithAmount: '明日は雨の予報です（{amount}）',
        sumTomorrowSnowWithAmount: '明日は雪の予報です（{amount}）',
        sumTomorrowRainNoAmount: '明日は雨の予報です',
        sumTomorrowWarming: '明日は{high}{unit}まで上昇',
        sumTomorrowCooling: '明日は{high}{unit}まで低下',

        // UV Index levels
        uvLow: '（弱い）',
        uvModerate: '（中程度）',
        uvHigh: '（強い）',
        uvVeryHigh: '（非常に強い）',
        uvExtreme: '（極端）',

        // Loading / unavailable messages
        loading: '読み込み中...',
        loadingRadar: 'レーダー読み込み中...',
        refreshingRadar: 'レーダー更新中...',
        radarUnavailable: 'レーダー利用不可',
        pollenDataUnavailable: 'この地域の花粉データは利用できません',

        // Astronomy labels
        sunrise: '日の出',
        sunset: '日の入',
        solarNoon: '南中時刻',
        moonrise: '月の出',
        moonset: '月の入',
        phase: '月相',

        // Moon phase names
        moonPhaseNewMoon: '新月',
        moonPhaseWaxingCrescent: '三日月',
        moonPhaseFirstQuarter: '上弦の月',
        moonPhaseWaxingGibbous: '十三夜月',
        moonPhaseFullMoon: '満月',
        moonPhaseWaningGibbous: '十六夜月',
        moonPhaseLastQuarter: '下弦の月',
        moonPhaseWaningCrescent: '有明月',

        // Chart legends
        chartTemperature: '気温',
        chartFeelsLike: '体感温度',
        chartDewPoint: '露点',
        chartCloudCover: '雲量',
        chartPrecipChance: '降水確率',
        chartHumidity: '湿度',
        chartPressure: '気圧',
        chartPrecipAccum: '累積降水量',
        chartHourlyPrecip: '時間降水量',
        chartWindSpeed: '風速',
        chartWindGusts: '突風',

        // Section controls
        dragToReorder: 'ドラッグして並べ替え',
        moveUp: '上へ移動',
        moveDown: '下へ移動',
        singleColumn: '1列',
        fullWidth: '全幅',
        removeSection: 'セクションを削除',
        minimizeSection: 'セクションを最小化',
        hideChart: 'グラフを非表示',

        // Radar controls
        refreshRadar: 'レーダーを更新',
        pauseRadar: '一時停止',
        playRadar: '再生',
        // Radar progress / forecast labels
        forecastLabel: '予測',
        radarNow: '現在',
        slowerRadar: '遅く',
        fasterRadar: '速く',

        // Show prefix
        showSectionPrefix: '{name}を表示',

        // Tagline
        tagline: 'シンプルな天気予報。',

        // AQI severity
        aqiGood: '良好',
        aqiModerate: '普通',
        aqiUnhealthyForSensitive: '敏感な人に不健康',
        aqiUnhealthy: '不健康',
        aqiVeryUnhealthy: '非常に不健康',
        aqiHazardous: '危険',

        // Pollen levels
        pollenLow: '低い',
        pollenLowMed: '低-中',
        pollenMedium: '中程度',
        pollenHigh: '高い',
        pollenVeryHigh: '非常に高い',

        // Misc
        highTemp: '最高',
        lowTemp: '最低',

        // Search / errors / aria-labels
        searching: '検索中...',
        didYouMean: 'もしかして：',
        locationNotFound: '場所が見つかりません。別の都市または郵便番号をお試しください。',
        failedToLoadWeather: '天気データの読み込みに失敗しました。もう一度お試しください。',
        retry: '再試行',
        hide: '非表示',
        close: '閉じる',
        toggleTheme: 'ダークモード切替',
        backToSearch: '検索に戻る'
};
