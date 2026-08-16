// NoAdsWeather translations — Spanish (es).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "es". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.es = {
        // UI
        currentConditions: 'Condiciones actuales',
        hourlyForecast: 'Pronóstico por hora',
        tenDayForecast: 'Pronóstico de 10 días',
        radar: 'Radar',
        pollen: 'Polen',
        sun: 'Sol',
        moon: 'Luna',
        weatherAlerts: '⚠️ Alertas meteorológicas',
        translateAlert: 'Traducir',
        searchPlaceholder: 'Ingresa ciudad o código postal',
        searchButton: 'Buscar',
        back: '← Volver',
        privacyCookies: 'Privacidad',
        about: 'Acerca de',
        supportThisSite: 'Apoya este sitio',
        showMore: 'Mostrar más',
        showLess: 'Mostrar menos',
        lockLayout: 'Bloquear diseño',
        unlockLayout: 'Desbloquear diseño',
        settings: 'Configuración',
        restoreDefaultLayout: 'Restaurar diseño predeterminado',
        seePollenData: 'Ver datos de polen',
        feelsLike: 'Sensación',
        humidity: 'Humedad',
        dewPoint: 'Punto de rocío',
        wind: 'Viento',
        gusts: 'Ráfagas',
        airQuality: 'Calidad del aire',
        uvIndex: 'Índice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Idioma',

        // Style names
        style: 'Estilo',
        styleDefault: 'Predeterminado',
        styleEditorial: 'Editorial',
        styleBulletin: 'Boletín',
        styleQuiet: 'Tranquilo',

        machineTranslationNotice: 'Las traducciones de la interfaz son automáticas y pueden no ser perfectas.',

        // Settings labels
        settingForecastColors: 'Mostrar fondos de color en el pronóstico de 10 días',
        settingSupportBtn: 'Mostrar botón de apoyo molesto',
        settingWeatherSummary: 'Mostrar resumen del clima',
        settingThemeToggle: 'Mostrar botón Modo claro / Modo oscuro',
        settingUnitsBtn: 'Mostrar botón °C / °F',
        settingTimeBtn: 'Mostrar botón 12H / 24H',
        settingLockBtn: 'Mostrar botón Bloquear / Desbloquear',
        settingNwsLink: 'Mostrar enlace al radar NWS',
        settingShowSectionButtons: 'Mostrar botones "Mostrar sección" cuando las secciones están ocultas',
        settingTranslateLink: 'Mostrar enlace de traducción de alertas',
        settingAutoPlayRadar: 'Reproducir radar automáticamente',
        settingRememberCity: 'Recordar última ciudad',
        cityPageTitle: 'Clima {city} sin anuncios',
        cityPageSeoBlurb: 'Consulta el pronóstico del tiempo para {city} sin publicidad, cookies ni rastreamiento. Datos de Open-Meteo, pronóstico de 10 días, condiciones por hora y radar — todo gratis.',
        cityPageHideBlurb: 'haz clic aquí para ocultar',
        cities: 'Ciudades',
        popularCities: 'Ciudades populares',
        nearbyCities: 'Ciudades cercanas',
        useMyLocation: 'Usar mi ubicación',
        myLocation: 'Mi ubicación',
        geoDenied: 'Se denegó el acceso a la ubicación — puedes buscar tu ciudad manualmente.',
        geoFailed: 'No se pudo determinar tu ubicación — intenta buscar tu ciudad.',
        settingAutoLocate: 'Usar mi ubicación automáticamente en cada visita',
        refresh: 'Actualizar',
        updatedJustNow: 'Actualizado ahora mismo',
        updatedAgo: 'Actualizado {time}',
        climateHeading: 'Clima en {city}',
        climateMonth: 'Mes',
        climateHigh: 'Máx.',
        climateLow: 'Mín.',
        climatePrecip: 'Precip.',
        climateWetDays: 'Días de lluvia',
        climateSummary: '{hotMonth} es el mes más caluroso en {city}, con una máxima media de {hotTemp}; {coldMonth} es el más frío ({coldTemp}). {wetMonth} es el mes más lluvioso, con una media de {wetAmount} de precipitación.',
        climateRecords: 'Extremos desde {year}: máxima {high} ({highDate}), mínima {low} ({lowDate}).',
        climateDaylight: 'La luz diurna dura unas {long} horas en {longMonth} y {short} horas en {shortMonth}.',
        climateSource: 'Datos: Meteostat — {station}, medias {period}.',
        hide: 'Ocultar',
        settingShowClimate: 'Mostrar medias climáticas en páginas de ciudad',
        notFoundTitle: 'Página no encontrada',
        notFoundBlurb: 'Esa página no existe — pero el tiempo sí. Busca tu ciudad:',

        // Weather codes
        wc0: 'Cielo despejado',
        wc1: 'Mayormente despejado',
        wc2: 'Parcialmente nublado',
        wc3: 'Nublado',
        wc45: 'Niebla',
        wc48: 'Niebla con escarcha',
        wc51: 'Llovizna ligera',
        wc53: 'Llovizna moderada',
        wc55: 'Llovizna densa',
        wc61: 'Lluvia ligera',
        wc63: 'Lluvia moderada',
        wc65: 'Lluvia fuerte',
        wc71: 'Nieve ligera',
        wc73: 'Nieve moderada',
        wc75: 'Nieve fuerte',
        wc77: 'Granos de nieve',
        wc80: 'Chubascos ligeros',
        wc81: 'Chubascos moderados',
        wc82: 'Chubascos violentos',
        wc85: 'Chubascos de nieve ligeros',
        wc86: 'Chubascos de nieve fuertes',
        wc95: 'Tormenta eléctrica',
        wc96: 'Tormenta con granizo ligero',
        wc99: 'Tormenta con granizo fuerte',
        wcUnknown: 'Desconocido',

        // Temp adjectives
        sumTempFreezing: 'Hace un frío glacial',
        sumTempCold: 'Hace frío',
        sumTempCool: 'Hace fresco',
        sumTempMild: 'Está',
        sumTempWarm: 'Hace calor templado',
        sumTempHot: 'Hace calor',

        // Opening template
        sumOpeningTemplate: '{tempAdj} a {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (sensación térmica {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' con tormentas eléctricas',
        sumConditionSnowing: ' y nevando',
        sumConditionRaining: ' y lloviendo',
        sumConditionRainingWithAmount: ' y lloviendo ({amount} esperados hoy)',
        sumConditionRainingWithAmountClearingBy: ' y lloviendo ({amount} esperados hoy), despejando alrededor de {hour}',
        sumConditionRainSoon: ' con lluvia prevista muy pronto',
        sumConditionRainLikelyAround: ' con lluvia probable alrededor de {hour}',
        sumConditionClearSkies: ' con cielos despejados',
        sumConditionCloudy: ' y nublado',

        // Follow-up sentences
        sumTodayHigh: 'Máxima de {high}{unit} hoy',
        sumTomorrowRainWithAmount: 'Lluvia prevista mañana ({amount})',
        sumTomorrowSnowWithAmount: 'Nieve prevista mañana ({amount})',
        sumTomorrowRainNoAmount: 'Lluvia prevista mañana',
        sumTomorrowWarming: 'subiendo hasta {high}{unit} mañana',
        sumTomorrowCooling: 'bajando a {high}{unit} mañana',

        // UV Index levels
        uvLow: '(Bajo)',
        uvModerate: '(Moderado)',
        uvHigh: '(Alto)',
        uvVeryHigh: '(Muy alto)',
        uvExtreme: '(Extremo)',

        // Loading / unavailable messages
        loading: 'Cargando...',
        loadingRadar: 'Cargando radar...',
        refreshingRadar: 'Actualizando radar...',
        radarUnavailable: 'Radar no disponible',
        pollenDataUnavailable: 'Datos de polen no disponibles para esta ubicación',

        // Astronomy section labels
        sunrise: 'Amanecer',
        sunset: 'Atardecer',
        solarNoon: 'Mediodía solar',
        moonrise: 'Salida de la luna',
        moonset: 'Puesta de la luna',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Luna nueva',
        moonPhaseWaxingCrescent: 'Creciente',
        moonPhaseFirstQuarter: 'Cuarto creciente',
        moonPhaseWaxingGibbous: 'Gibosa creciente',
        moonPhaseFullMoon: 'Luna llena',
        moonPhaseWaningGibbous: 'Gibosa menguante',
        moonPhaseLastQuarter: 'Cuarto menguante',
        moonPhaseWaningCrescent: 'Menguante',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Sensación',
        chartDewPoint: 'Punto de rocío',
        chartCloudCover: 'Nubosidad',
        chartPrecipChance: 'Prob. precip.',
        chartHumidity: 'Humedad',
        chartPressure: 'Presión',
        chartPrecipAccum: 'Precip. acum.',
        chartHourlyPrecip: 'Precip. horaria',
        chartWindSpeed: 'Velocidad del viento',
        chartWindGusts: 'Ráfagas',

        // Section controls
        dragToReorder: 'Arrastrar para reordenar',
        moveUp: 'Mover arriba',
        moveDown: 'Mover abajo',
        singleColumn: 'Columna única',
        fullWidth: 'Ancho completo',
        removeSection: 'Quitar sección',
        minimizeSection: 'Minimizar sección',
        hideChart: 'Ocultar gráfico',

        // Radar controls
        refreshRadar: 'Actualizar radar',
        pauseRadar: 'Pausar',
        playRadar: 'Reproducir',
        // Radar progress / forecast labels
        forecastLabel: 'PRONÓSTICO',
        radarNow: 'AHORA',
        slowerRadar: 'Más lento',
        fasterRadar: 'Más rápido',

        // Show prefix
        showSectionPrefix: 'Mostrar {name}',

        // Tagline
        tagline: 'El clima sin lo superfluo.',

        // AQI severity
        aqiGood: 'Bueno',
        aqiModerate: 'Moderado',
        aqiUnhealthyForSensitive: 'Insalubre para grupos sensibles',
        aqiUnhealthy: 'Insalubre',
        aqiVeryUnhealthy: 'Muy insalubre',
        aqiHazardous: 'Peligroso',

        // Pollen levels
        pollenLow: 'Bajo',
        pollenLowMed: 'Bajo-Medio',
        pollenMedium: 'Medio',
        pollenHigh: 'Alto',
        pollenVeryHigh: 'Muy alto',

        // Misc
        highTemp: 'Máx',
        lowTemp: 'Mín',

        // Search / errors / aria-labels
        searching: 'Buscando...',
        didYouMean: '¿Quisiste decir:',
        locationNotFound: 'Ubicación no encontrada. Prueba con otra ciudad o código postal.',
        failedToLoadWeather: 'No se pudieron cargar los datos del clima. Inténtalo de nuevo.',
        retry: 'Reintentar',
        hide: 'Ocultar',
        close: 'Cerrar',
        toggleTheme: 'Cambiar modo oscuro',
        backToSearch: 'Volver a la búsqueda'
};
