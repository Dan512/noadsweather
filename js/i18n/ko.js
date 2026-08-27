// NoAdsWeather translations — Korean (ko).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "ko". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.ko = {
        // UI
        currentConditions: '현재 날씨',
        hourlyForecast: '시간별 예보',
        tenDayForecast: '10일 예보',
        radar: '레이더',
        pollen: '꽃가루',
        sun: '일출/일몰',
        moon: '달',
        weatherAlerts: '⚠️ 기상 경보',
        translateAlert: '번역',
        searchPlaceholder: '도시 또는 우편번호 입력',
        searchButton: '검색',
        back: '← 뒤로',
        privacyCookies: '개인정보',
        about: '소개',
        supportThisSite: '이 사이트 지원하기',
        showMore: '더 보기',
        showLess: '간략히 보기',
        lockLayout: '레이아웃 잠금',
        unlockLayout: '레이아웃 잠금 해제',
        settings: '설정',
        restoreDefaultLayout: '기본 레이아웃 복원',
        seePollenData: '꽃가루 데이터 보기',
        feelsLike: '체감온도',
        humidity: '습도',
        dewPoint: '이슬점',
        wind: '바람',
        gusts: '돌풍',
        airQuality: '공기질',
        uvIndex: '자외선 지수',
        nwsRadarLink: 'NWS 레이더 ↗',
        language: '언어',

        // Style names
        style: '스타일',
        styleDefault: '기본',
        styleEditorial: '에디토리얼',
        styleBulletin: '회보',
        styleQuiet: '정적',

        machineTranslationNotice: 'UI 번역은 기계 번역으로 생성되어 완벽하지 않을 수 있습니다.',

        // Settings labels
        settingForecastColors: '10일 예보에 색상 배경 표시',
        settingSupportBtn: '귀찮은 후원 버튼 표시',
        settingWeatherSummary: '날씨 요약 표시',
        settingThemeToggle: '라이트 모드 / 다크 모드 버튼 표시',
        settingUnitsBtn: '°C / °F 버튼 표시',
        settingTimeBtn: '12시간 / 24시간 버튼 표시',
        settingLockBtn: '잠금 / 잠금 해제 버튼 표시',
        settingNwsLink: 'NWS 레이더 링크 표시',
        settingShowSectionButtons: '섹션이 숨겨져 있을 때 "섹션 표시" 버튼 표시',
        settingTranslateLink: '경보 번역 링크 표시',
        settingAlertsMinimized: '기상 경보를 항상 최소화하여 표시',
        dismissAlert: '경보 닫기',
        settingAutoPlayRadar: '레이더 자동 재생',
        settingRememberCity: '마지막 도시 기억하기',
        cityPageTitle: '{city} 날씨 광고 없음',
        cityPageSeoBlurb: '{city} 날씨 예보, 광고, 쿠키, 추적 없이. Open-Meteo 데이터, 10일 예보, 시간별 상태 및 레이더 — 모두 무료.',
        cityPageHideBlurb: '여기를 클릭하여 숨기기',
        cities: '도시',
        popularCities: '인기 도시',
        nearbyCities: '주변 도시',
        useMyLocation: '내 위치 사용',
        myLocation: '내 위치',
        geoDenied: '위치 접근이 거부되었습니다 — 도시를 검색해 보세요.',
        geoFailed: '위치를 확인할 수 없습니다 — 도시를 검색해 보세요.',
        settingAutoLocate: '방문할 때마다 자동으로 내 위치 사용',

        // Share card
        share: '공유',
        shareTitle: '예보 공유',
        share5Day: '5일 예보',
        share7Day: '7일 예보',
        shareIncludeCurrent: '현재 날씨 포함',
        shareIncludePollen: '꽃가루 정보 포함',
        shareEmoji: '반응 추가',
        shareEmojiNone: '없음',
        shareCreate: '이미지 만들기',
        shareShareBtn: '공유',
        shareDownload: '다운로드',
        shareCopyLink: '링크 복사',
        shareLinkCopied: '복사됨!',
        shareGenerating: '이미지 생성 중...',
        shareFailed: '이미지를 만들 수 없습니다',
        shareShareFailed: '이미지를 공유할 수 없습니다',
        shareCopyFailed: '링크를 복사할 수 없습니다',
        settingShareBtn: '공유 버튼 표시',

        refresh: '새로고침',
        updatedJustNow: '방금 업데이트됨',
        updatedAgo: '{time} 업데이트됨',
        climateHeading: '{city} 기후',
        climateMonth: '월',
        climateHigh: '최고',
        climateLow: '최저',
        climatePrecip: '강수량',
        climateWetDays: '강수일',
        climateSummary: '{city}에서 가장 더운 달은 {hotMonth}(평균 최고 {hotTemp})이고, 가장 추운 달은 {coldMonth}({coldTemp})입니다. 강수량이 가장 많은 달은 {wetMonth}(평균 {wetAmount})입니다.',
        climateRecords: '{year}년 이후 극값: 최고 {high}({highDate}), 최저 {low}({lowDate}).',
        climateDaylight: '낮의 길이는 {shortMonth} 약 {short}시간에서 {longMonth} 약 {long}시간까지 변합니다.',
        climateSource: '데이터: Meteostat — {station}, {period} 평균.',
        hide: '숨기기',
        settingShowClimate: '도시 페이지에 기후 평년값 표시',
        notFoundTitle: '페이지를 찾을 수 없습니다',
        notFoundBlurb: '이 페이지는 존재하지 않지만 날씨는 있습니다. 도시를 검색해 보세요:',

        // Weather codes
        wc0: '맑음',
        wc1: '대체로 맑음',
        wc2: '부분적으로 흐림',
        wc3: '흐림',
        wc45: '안개',
        wc48: '상고대 안개',
        wc51: '약한 이슬비',
        wc53: '보통 이슬비',
        wc55: '강한 이슬비',
        wc61: '약한 비',
        wc63: '보통 비',
        wc65: '강한 비',
        wc71: '약한 눈',
        wc73: '보통 눈',
        wc75: '강한 눈',
        wc77: '싸락눈',
        wc80: '약한 소나기',
        wc81: '보통 소나기',
        wc82: '강한 소나기',
        wc85: '약한 눈 소나기',
        wc86: '강한 눈 소나기',
        wc95: '뇌우',
        wc96: '약한 우박을 동반한 뇌우',
        wc99: '강한 우박을 동반한 뇌우',
        wcUnknown: '알 수 없음',

        // Temp adjectives
        sumTempFreezing: '매우 춥습니다',
        sumTempCold: '춥습니다',
        sumTempCool: '쌀쌀합니다',
        sumTempMild: '기온은',
        sumTempWarm: '따뜻합니다',
        sumTempHot: '덥습니다',

        // Opening template
        sumOpeningTemplate: '{tempAdj}. {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (체감 {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ', 뇌우가 있습니다',
        sumConditionSnowing: ', 눈이 내립니다',
        sumConditionRaining: ', 비가 내립니다',
        sumConditionRainingWithAmount: ', 비가 내립니다 (오늘 {amount} 예상)',
        sumConditionRainingWithAmountClearingBy: ', 비가 내립니다 (오늘 {amount} 예상), {hour}경 개임',
        sumConditionRainSoon: ', 곧 비가 올 예정입니다',
        sumConditionRainLikelyAround: ', {hour}경 비가 올 가능성이 있습니다',
        sumConditionClearSkies: ', 하늘이 맑습니다',
        sumConditionCloudy: ', 흐립니다',

        // Follow-up sentences
        sumTodayHigh: '오늘 최고 {high}{unit}',
        sumTomorrowRainWithAmount: '내일 비 예상 ({amount})',
        sumTomorrowSnowWithAmount: '내일 눈 예상 ({amount})',
        sumTomorrowRainNoAmount: '내일 비 예상',
        sumTomorrowWarming: '내일 {high}{unit}까지 상승',
        sumTomorrowCooling: '내일 {high}{unit}까지 하강',

        // UV Index levels
        uvLow: '(낮음)',
        uvModerate: '(보통)',
        uvHigh: '(높음)',
        uvVeryHigh: '(매우 높음)',
        uvExtreme: '(극심)',

        // Loading / unavailable messages
        loading: '로드 중...',
        loadingRadar: '레이더 로드 중...',
        refreshingRadar: '레이더 새로 고침 중...',
        radarUnavailable: '레이더 사용 불가',
        pollenDataUnavailable: '이 위치에 대한 꽃가루 데이터를 사용할 수 없습니다',

        // Astronomy labels
        sunrise: '일출',
        sunset: '일몰',
        solarNoon: '태양 남중시',
        moonrise: '월출',
        moonset: '월몰',
        phase: '위상',

        // Moon phase names
        moonPhaseNewMoon: '삭',
        moonPhaseWaxingCrescent: '초승달',
        moonPhaseFirstQuarter: '상현',
        moonPhaseWaxingGibbous: '상현망간',
        moonPhaseFullMoon: '보름달',
        moonPhaseWaningGibbous: '하현망간',
        moonPhaseLastQuarter: '하현',
        moonPhaseWaningCrescent: '그믐달',

        // Chart legends
        chartTemperature: '온도',
        chartFeelsLike: '체감온도',
        chartDewPoint: '이슬점',
        chartCloudCover: '구름량',
        chartPrecipChance: '강수확률',
        chartHumidity: '습도',
        chartPressure: '기압',
        chartPrecipAccum: '누적 강수량',
        chartHourlyPrecip: '시간당 강수량',
        chartWindSpeed: '풍속',
        chartWindGusts: '돌풍',

        // Section controls
        dragToReorder: '드래그하여 재정렬',
        moveUp: '위로 이동',
        moveDown: '아래로 이동',
        singleColumn: '한 열',
        fullWidth: '전체 너비',
        removeSection: '섹션 제거',
        minimizeSection: '섹션 최소화',
        hideChart: '차트 숨기기',

        // Radar controls
        refreshRadar: '레이더 새로고침',
        pauseRadar: '일시정지',
        playRadar: '재생',
        // Radar progress / forecast labels
        forecastLabel: '예보',
        radarNow: '지금',
        slowerRadar: '느리게',
        fasterRadar: '빠르게',

        // Show prefix
        showSectionPrefix: '{name} 표시',

        // Tagline
        tagline: '깔끔한 날씨 예보.',

        // AQI severity
        aqiGood: '좋음',
        aqiModerate: '보통',
        aqiUnhealthyForSensitive: '민감군에 나쁨',
        aqiUnhealthy: '나쁨',
        aqiVeryUnhealthy: '매우 나쁨',
        aqiHazardous: '위험',

        // Pollen levels
        pollenLow: '낮음',
        pollenLowMed: '낮음-중간',
        pollenMedium: '중간',
        pollenHigh: '높음',
        pollenVeryHigh: '매우 높음',

        // Misc
        highTemp: '최고',
        lowTemp: '최저',

        // Search / errors / aria-labels
        searching: '검색 중...',
        didYouMean: '다음을 찾으셨나요:',
        locationNotFound: '위치를 찾을 수 없습니다. 다른 도시나 우편번호를 시도해 보세요.',
        failedToLoadWeather: '날씨 데이터를 불러오지 못했습니다. 다시 시도해 주세요.',
        retry: '다시 시도',
        hide: '숨기기',
        close: '닫기',
        toggleTheme: '다크 모드 전환',
        backToSearch: '검색으로 돌아가기'
};
