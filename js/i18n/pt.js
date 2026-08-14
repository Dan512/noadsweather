// NoAdsWeather translations — Portuguese (pt).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "pt". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.pt = {
        // UI
        currentConditions: 'Condições atuais',
        hourlyForecast: 'Previsão por hora',
        tenDayForecast: 'Previsão de 10 dias',
        radar: 'Radar',
        pollen: 'Pólen',
        sun: 'Sol',
        moon: 'Lua',
        weatherAlerts: '⚠️ Alertas meteorológicos',
        translateAlert: 'Traduzir',
        searchPlaceholder: 'Digite cidade ou CEP',
        searchButton: 'Buscar',
        back: '← Voltar',
        privacyCookies: 'Privacidade',
        about: 'Sobre',
        supportThisSite: 'Apoie este site',
        showMore: 'Mostrar mais',
        showLess: 'Mostrar menos',
        lockLayout: 'Bloquear layout',
        unlockLayout: 'Desbloquear layout',
        settings: 'Configurações',
        restoreDefaultLayout: 'Restaurar layout padrão',
        seePollenData: 'Ver dados de pólen',
        feelsLike: 'Sensação',
        humidity: 'Umidade',
        dewPoint: 'Ponto de orvalho',
        wind: 'Vento',
        gusts: 'Rajadas',
        airQuality: 'Qualidade do ar',
        uvIndex: 'Índice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Idioma',

        // Style names
        style: 'Estilo',
        styleDefault: 'Padrão',
        styleEditorial: 'Editorial',
        styleBulletin: 'Boletim',
        styleQuiet: 'Tranquilo',

        machineTranslationNotice: 'As traduções da interface são geradas automaticamente e podem não estar perfeitas.',

        // Settings labels
        settingForecastColors: 'Mostrar fundos coloridos na previsão de 10 dias',
        settingSupportBtn: 'Mostrar botão chato de apoio',
        settingWeatherSummary: 'Mostrar resumo do clima',
        settingThemeToggle: 'Mostrar botão Modo claro / Modo escuro',
        settingUnitsBtn: 'Mostrar botão °C / °F',
        settingTimeBtn: 'Mostrar botão 12H / 24H',
        settingLockBtn: 'Mostrar botão Bloquear / Desbloquear',
        settingNwsLink: 'Mostrar link do radar NWS',
        settingShowSectionButtons: 'Mostrar botões "Mostrar seção" quando as seções estiverem ocultas',
        settingTranslateLink: 'Mostrar link de tradução de alertas',
        settingAutoPlayRadar: 'Reproduzir radar automaticamente',
        settingRememberCity: 'Lembrar última cidade',
        cityPageTitle: 'Tempo {city} sem anúncios',
        cityPageSeoBlurb: 'Previsão do tempo para {city} sem publicidade, cookies ou rastreamento. Dados do Open-Meteo, previsão de 10 dias, condições horárias e radar — tudo grátis.',
        cityPageHideBlurb: 'clique aqui para ocultar',
        cities: 'Cidades',
        popularCities: 'Cidades populares',
        nearbyCities: 'Cidades próximas',
        useMyLocation: 'Usar minha localização',
        myLocation: 'Minha localização',
        geoDenied: 'O acesso à localização foi negado — você pode pesquisar sua cidade manualmente.',
        geoFailed: 'Não foi possível determinar sua localização — tente pesquisar sua cidade.',
        settingAutoLocate: 'Usar minha localização automaticamente em cada visita',

        // Weather codes
        wc0: 'Céu limpo',
        wc1: 'Predominantemente claro',
        wc2: 'Parcialmente nublado',
        wc3: 'Encoberto',
        wc45: 'Nevoeiro',
        wc48: 'Nevoeiro com geada',
        wc51: 'Garoa leve',
        wc53: 'Garoa moderada',
        wc55: 'Garoa densa',
        wc61: 'Chuva fraca',
        wc63: 'Chuva moderada',
        wc65: 'Chuva forte',
        wc71: 'Neve fraca',
        wc73: 'Neve moderada',
        wc75: 'Neve forte',
        wc77: 'Grãos de neve',
        wc80: 'Pancadas de chuva leves',
        wc81: 'Pancadas de chuva moderadas',
        wc82: 'Pancadas de chuva violentas',
        wc85: 'Pancadas de neve leves',
        wc86: 'Pancadas de neve fortes',
        wc95: 'Tempestade',
        wc96: 'Tempestade com granizo leve',
        wc99: 'Tempestade com granizo forte',
        wcUnknown: 'Desconhecido',

        // Temp adjectives
        sumTempFreezing: 'Está congelando',
        sumTempCold: 'Está frio',
        sumTempCool: 'Está fresco',
        sumTempMild: 'Está',
        sumTempWarm: 'Está quente ameno',
        sumTempHot: 'Está quente',

        // Opening template
        sumOpeningTemplate: '{tempAdj} a {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (sensação de {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' com tempestades',
        sumConditionSnowing: ' e nevando',
        sumConditionRaining: ' e chovendo',
        sumConditionRainingWithAmount: ' e chovendo ({amount} esperados hoje)',
        sumConditionRainingWithAmountClearingBy: ' e chovendo ({amount} esperados hoje), melhorando por volta das {hour}',
        sumConditionRainSoon: ' com chuva prevista muito em breve',
        sumConditionRainLikelyAround: ' com chuva provável por volta das {hour}',
        sumConditionClearSkies: ' com céu limpo',
        sumConditionCloudy: ' e nublado',

        // Follow-up sentences
        sumTodayHigh: 'Máxima de {high}{unit} hoje',
        sumTomorrowRainWithAmount: 'Chuva prevista amanhã ({amount})',
        sumTomorrowSnowWithAmount: 'Neve prevista amanhã ({amount})',
        sumTomorrowRainNoAmount: 'Chuva prevista amanhã',
        sumTomorrowWarming: 'esquentando até {high}{unit} amanhã',
        sumTomorrowCooling: 'esfriando para {high}{unit} amanhã',

        // UV Index levels
        uvLow: '(Baixo)',
        uvModerate: '(Moderado)',
        uvHigh: '(Alto)',
        uvVeryHigh: '(Muito alto)',
        uvExtreme: '(Extremo)',

        // Loading / unavailable messages
        loading: 'Carregando...',
        loadingRadar: 'Carregando radar...',
        refreshingRadar: 'Atualizando radar...',
        radarUnavailable: 'Radar indisponível',
        pollenDataUnavailable: 'Dados de pólen indisponíveis para esta localização',

        // Astronomy labels
        sunrise: 'Nascer do sol',
        sunset: 'Pôr do sol',
        solarNoon: 'Meio-dia solar',
        moonrise: 'Nascer da lua',
        moonset: 'Pôr da lua',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Lua nova',
        moonPhaseWaxingCrescent: 'Crescente',
        moonPhaseFirstQuarter: 'Quarto crescente',
        moonPhaseWaxingGibbous: 'Gibosa crescente',
        moonPhaseFullMoon: 'Lua cheia',
        moonPhaseWaningGibbous: 'Gibosa minguante',
        moonPhaseLastQuarter: 'Quarto minguante',
        moonPhaseWaningCrescent: 'Minguante',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Sensação',
        chartDewPoint: 'Ponto de orvalho',
        chartCloudCover: 'Nebulosidade',
        chartPrecipChance: 'Prob. precip.',
        chartHumidity: 'Umidade',
        chartPressure: 'Pressão',
        chartPrecipAccum: 'Precip. acum.',
        chartHourlyPrecip: 'Precip. por hora',
        chartWindSpeed: 'Velocidade do vento',
        chartWindGusts: 'Rajadas',

        // Section controls
        dragToReorder: 'Arrastar para reordenar',
        moveUp: 'Mover para cima',
        moveDown: 'Mover para baixo',
        singleColumn: 'Coluna única',
        fullWidth: 'Largura total',
        removeSection: 'Remover seção',
        minimizeSection: 'Minimizar seção',
        hideChart: 'Ocultar gráfico',

        // Radar controls
        refreshRadar: 'Atualizar radar',
        pauseRadar: 'Pausar',
        playRadar: 'Reproduzir',
        // Radar progress / forecast labels
        forecastLabel: 'PREVISÃO',
        radarNow: 'AGORA',
        slowerRadar: 'Mais lento',
        fasterRadar: 'Mais rápido',

        // Show prefix
        showSectionPrefix: 'Mostrar {name}',

        // Tagline
        tagline: 'Clima sem enrolação.',

        // AQI severity
        aqiGood: 'Bom',
        aqiModerate: 'Moderado',
        aqiUnhealthyForSensitive: 'Insalubre para grupos sensíveis',
        aqiUnhealthy: 'Insalubre',
        aqiVeryUnhealthy: 'Muito insalubre',
        aqiHazardous: 'Perigoso',

        // Pollen levels
        pollenLow: 'Baixo',
        pollenLowMed: 'Baixo-Médio',
        pollenMedium: 'Médio',
        pollenHigh: 'Alto',
        pollenVeryHigh: 'Muito alto',

        // Misc
        highTemp: 'Máx',
        lowTemp: 'Mín',

        // Search / errors / aria-labels
        searching: 'Buscando...',
        didYouMean: 'Você quis dizer:',
        locationNotFound: 'Local não encontrado. Tente outra cidade ou CEP.',
        failedToLoadWeather: 'Falha ao carregar os dados do clima. Tente novamente.',
        retry: 'Tentar novamente',
        hide: 'Ocultar',
        close: 'Fechar',
        toggleTheme: 'Alternar modo escuro',
        backToSearch: 'Voltar à busca'
};
