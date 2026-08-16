// NoAdsWeather translations — French (fr).
// Loaded on demand by the inline i18n loader in each page's <body> when the
// visitor's language is "fr". Registers into the TRANSLATIONS object
// declared by /js/i18n.js, which must load first. English never has a file
// here — it lives in i18n.js itself as the permanent fallback.
// CONTRACT: top-level side-effect-free apart from this one registration —
// scripts/build-cities.js evaluates this file in Node at build time.

TRANSLATIONS.fr = {
        // UI
        currentConditions: 'Conditions actuelles',
        hourlyForecast: 'Prévisions horaires',
        tenDayForecast: 'Prévisions sur 10 jours',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Soleil',
        moon: 'Lune',
        weatherAlerts: '⚠️ Alertes météo',
        translateAlert: 'Traduire',
        searchPlaceholder: 'Entrez ville ou code postal',
        searchButton: 'Rechercher',
        back: '← Retour',
        privacyCookies: 'Confidentialité',
        about: 'À propos',
        supportThisSite: 'Soutenir ce site',
        showMore: 'Afficher plus',
        showLess: 'Afficher moins',
        lockLayout: 'Verrouiller la mise en page',
        unlockLayout: 'Déverrouiller la mise en page',
        settings: 'Paramètres',
        restoreDefaultLayout: 'Restaurer la mise en page par défaut',
        seePollenData: 'Voir les données du pollen',
        feelsLike: 'Ressenti',
        humidity: 'Humidité',
        dewPoint: 'Point de rosée',
        wind: 'Vent',
        gusts: 'Rafales',
        airQuality: 'Qualité de l\'air',
        uvIndex: 'Indice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Langue',

        // Style names
        style: 'Style',
        styleDefault: 'Par défaut',
        styleEditorial: 'Éditorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Calme',

        machineTranslationNotice: 'Les traductions de l\'interface sont générées automatiquement et peuvent ne pas être parfaites.',

        // Settings labels
        settingForecastColors: 'Afficher les fonds colorés sur les prévisions à 10 jours',
        settingSupportBtn: 'Afficher le bouton de soutien gênant',
        settingWeatherSummary: 'Afficher le résumé météo',
        settingThemeToggle: 'Afficher le bouton Mode clair / Mode sombre',
        settingUnitsBtn: 'Afficher le bouton °C / °F',
        settingTimeBtn: 'Afficher le bouton 12H / 24H',
        settingLockBtn: 'Afficher le bouton Verrouiller / Déverrouiller',
        settingNwsLink: 'Afficher le lien du radar NWS',
        settingShowSectionButtons: 'Afficher les boutons "Afficher la section" lorsque les sections sont masquées',
        settingTranslateLink: 'Afficher le lien de traduction des alertes',
        settingAutoPlayRadar: 'Lire le radar automatiquement',
        settingRememberCity: 'Mémoriser la dernière ville',
        cityPageTitle: 'Météo {city} sans publicité',
        cityPageSeoBlurb: 'Consultez les prévisions météo pour {city} sans publicité, cookies ni suivi. Données Open-Meteo, prévisions sur 10 jours, conditions horaires et radar — tout gratuit.',
        cityPageHideBlurb: 'cliquez ici pour masquer',
        cities: 'Villes',
        popularCities: 'Villes populaires',
        nearbyCities: 'Villes à proximité',
        useMyLocation: 'Utiliser ma position',
        myLocation: 'Ma position',
        geoDenied: 'L’accès à la position a été refusé — vous pouvez rechercher votre ville manuellement.',
        geoFailed: 'Impossible de déterminer votre position — essayez de rechercher votre ville.',
        settingAutoLocate: 'Utiliser ma position automatiquement à chaque visite',
        refresh: 'Actualiser',
        updatedJustNow: 'Mis à jour à l’instant',
        updatedAgo: 'Mis à jour {time}',
        climateHeading: 'Climat à {city}',
        climateMonth: 'Mois',
        climateHigh: 'Max.',
        climateLow: 'Min.',
        climatePrecip: 'Précip.',
        climateWetDays: 'Jours de pluie',
        climateSummary: '{hotMonth} est le mois le plus chaud à {city}, avec une maximale moyenne de {hotTemp} ; {coldMonth} est le plus froid ({coldTemp}). {wetMonth} est le mois le plus pluvieux, avec en moyenne {wetAmount} de précipitations.',
        climateRecords: 'Extrêmes depuis {year} : maximale {high} ({highDate}), minimale {low} ({lowDate}).',
        climateDaylight: 'La durée du jour est d’environ {long} heures en {longMonth} et {short} heures en {shortMonth}.',
        climateSource: 'Données : Meteostat — {station}, moyennes {period}.',
        hide: 'Masquer',
        settingShowClimate: 'Afficher les moyennes climatiques sur les pages de ville',
        notFoundTitle: 'Page introuvable',
        notFoundBlurb: 'Cette page n’existe pas — mais la météo, oui. Recherchez votre ville :',

        // Weather codes
        wc0: 'Ciel dégagé',
        wc1: 'Principalement clair',
        wc2: 'Partiellement nuageux',
        wc3: 'Couvert',
        wc45: 'Brouillard',
        wc48: 'Brouillard givrant',
        wc51: 'Bruine légère',
        wc53: 'Bruine modérée',
        wc55: 'Bruine dense',
        wc61: 'Pluie faible',
        wc63: 'Pluie modérée',
        wc65: 'Forte pluie',
        wc71: 'Neige faible',
        wc73: 'Neige modérée',
        wc75: 'Forte neige',
        wc77: 'Grains de neige',
        wc80: 'Averses de pluie légères',
        wc81: 'Averses de pluie modérées',
        wc82: 'Averses de pluie violentes',
        wc85: 'Averses de neige légères',
        wc86: 'Averses de neige fortes',
        wc95: 'Orage',
        wc96: 'Orage avec grêle légère',
        wc99: 'Orage avec forte grêle',
        wcUnknown: 'Inconnu',

        // Temp adjectives
        sumTempFreezing: 'Il fait un froid glacial',
        sumTempCold: 'Il fait froid',
        sumTempCool: 'Il fait frais',
        sumTempMild: 'Il fait',
        sumTempWarm: 'Il fait doux',
        sumTempHot: 'Il fait chaud',

        // Opening template
        sumOpeningTemplate: '{tempAdj} à {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (ressenti {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' avec des orages',
        sumConditionSnowing: ' et il neige',
        sumConditionRaining: ' et il pleut',
        sumConditionRainingWithAmount: ' et il pleut ({amount} prévus aujourd\'hui)',
        sumConditionRainingWithAmountClearingBy: ' et il pleut ({amount} prévus aujourd\'hui), éclaircies vers {hour}',
        sumConditionRainSoon: ' avec de la pluie prévue très bientôt',
        sumConditionRainLikelyAround: ' avec de la pluie probable vers {hour}',
        sumConditionClearSkies: ' avec un ciel dégagé',
        sumConditionCloudy: ' et nuageux',

        // Follow-up sentences
        sumTodayHigh: 'Maximum de {high}{unit} aujourd\'hui',
        sumTomorrowRainWithAmount: 'Pluie prévue demain ({amount})',
        sumTomorrowSnowWithAmount: 'Neige prévue demain ({amount})',
        sumTomorrowRainNoAmount: 'Pluie prévue demain',
        sumTomorrowWarming: 'se réchauffant jusqu\'à {high}{unit} demain',
        sumTomorrowCooling: 'se refroidissant à {high}{unit} demain',

        // UV Index levels
        uvLow: '(Faible)',
        uvModerate: '(Modéré)',
        uvHigh: '(Élevé)',
        uvVeryHigh: '(Très élevé)',
        uvExtreme: '(Extrême)',

        // Loading / unavailable messages
        loading: 'Chargement...',
        loadingRadar: 'Chargement du radar...',
        refreshingRadar: 'Actualisation du radar...',
        radarUnavailable: 'Radar indisponible',
        pollenDataUnavailable: 'Données de pollen indisponibles pour cet emplacement',

        // Astronomy section labels
        sunrise: 'Lever du soleil',
        sunset: 'Coucher du soleil',
        solarNoon: 'Midi solaire',
        moonrise: 'Lever de la lune',
        moonset: 'Coucher de la lune',
        phase: 'Phase',

        // Moon phase names
        moonPhaseNewMoon: 'Nouvelle lune',
        moonPhaseWaxingCrescent: 'Premier croissant',
        moonPhaseFirstQuarter: 'Premier quartier',
        moonPhaseWaxingGibbous: 'Gibbeuse croissante',
        moonPhaseFullMoon: 'Pleine lune',
        moonPhaseWaningGibbous: 'Gibbeuse décroissante',
        moonPhaseLastQuarter: 'Dernier quartier',
        moonPhaseWaningCrescent: 'Dernier croissant',

        // Chart legends
        chartTemperature: 'Température',
        chartFeelsLike: 'Ressenti',
        chartDewPoint: 'Point de rosée',
        chartCloudCover: 'Nébulosité',
        chartPrecipChance: 'Prob. de précip.',
        chartHumidity: 'Humidité',
        chartPressure: 'Pression',
        chartPrecipAccum: 'Précip. cumul.',
        chartHourlyPrecip: 'Précip. horaire',
        chartWindSpeed: 'Vitesse du vent',
        chartWindGusts: 'Rafales',

        // Section controls
        dragToReorder: 'Faire glisser pour réorganiser',
        moveUp: 'Monter',
        moveDown: 'Descendre',
        singleColumn: 'Colonne unique',
        fullWidth: 'Pleine largeur',
        removeSection: 'Supprimer la section',
        minimizeSection: 'Réduire la section',
        hideChart: 'Masquer le graphique',

        // Radar controls
        refreshRadar: 'Actualiser le radar',
        pauseRadar: 'Pause',
        playRadar: 'Lecture',
        // Radar progress / forecast labels
        forecastLabel: 'PRÉVISION',
        radarNow: 'MAINTENANT',
        slowerRadar: 'Plus lent',
        fasterRadar: 'Plus rapide',

        // Show prefix
        showSectionPrefix: 'Afficher {name}',

        // Tagline
        tagline: 'La météo sans le superflu.',

        // AQI severity
        aqiGood: 'Bon',
        aqiModerate: 'Modéré',
        aqiUnhealthyForSensitive: 'Malsain pour groupes sensibles',
        aqiUnhealthy: 'Malsain',
        aqiVeryUnhealthy: 'Très malsain',
        aqiHazardous: 'Dangereux',

        // Pollen levels
        pollenLow: 'Faible',
        pollenLowMed: 'Faible-Moyen',
        pollenMedium: 'Moyen',
        pollenHigh: 'Élevé',
        pollenVeryHigh: 'Très élevé',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Recherche...',
        didYouMean: 'Vouliez-vous dire :',
        locationNotFound: 'Lieu introuvable. Essayez une autre ville ou un autre code postal.',
        failedToLoadWeather: 'Échec du chargement des données météo. Veuillez réessayer.',
        retry: 'Réessayer',
        hide: 'Masquer',
        close: 'Fermer',
        toggleTheme: 'Basculer le mode sombre',
        backToSearch: 'Retour à la recherche'
};
