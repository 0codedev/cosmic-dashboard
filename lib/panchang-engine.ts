// Panchang Engine - Daily Auspicious/Inauspicious Timing Calculations
// Implements accurate Vedic timing system based on sunrise and weekday

// ============================================
// TYPES
// ============================================

export type TimePeriod = {
    name: string;
    start: Date;
    end: Date;
    startTime: string;
    endTime: string;
    isActive: boolean;
    description: string;
    color: string;
};

export type HoraPeriod = {
    planet: string;
    planetSymbol: string;
    start: Date;
    end: Date;
    startTime: string;
    endTime: string;
    isActive: boolean;
    activities: string[];
    color: string;
};

export type PanchangTiming = {
    rahukaal: TimePeriod;
    yamagandam: TimePeriod;
    gulikaKalam: TimePeriod;
    abhijitMuhurta: TimePeriod;
    brahmamuhrta: TimePeriod;
};

// ============================================
// CONSTANTS
// ============================================

// Rahukaal order by weekday (0=Sunday, 1=Monday, etc.)
// The number represents which 1/8th of daytime is Rahukaal
const RAHUKAAL_ORDER = [8, 2, 7, 5, 6, 4, 3]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

// Yamagandam order by weekday
const YAMAGANDAM_ORDER = [5, 4, 3, 2, 1, 7, 6]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

// Gulika Kalam order by weekday  
const GULIKA_ORDER = [7, 6, 5, 4, 3, 2, 1]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

// Hora sequence (Chaldean order)
const HORA_PLANETS = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

// Weekday rulers (which planet's hora starts the day)
const WEEKDAY_RULER_INDEX = [0, 3, 6, 2, 5, 1, 4]; // Sun=0, Moon=3, Mars=6, etc.

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽',
    'Mars': '♂',
    'Mercury': '☿',
    'Jupiter': '♃',
    'Venus': '♀',
    'Saturn': '♄'
};

const PLANET_COLORS: Record<string, string> = {
    'Sun': 'orange',
    'Moon': 'blue',
    'Mars': 'red',
    'Mercury': 'green',
    'Jupiter': 'yellow',
    'Venus': 'pink',
    'Saturn': 'purple'
};

const HORA_ACTIVITIES: Record<string, string[]> = {
    'Sun': ['Government work', 'Authority matters', 'Father-related', 'Health decisions'],
    'Moon': ['Travel', 'Public dealings', 'Mother-related', 'Water activities'],
    'Mars': ['Competition', 'Surgery', 'Property deals', 'Mechanical work'],
    'Mercury': ['Communication', 'Business', 'Education', 'Writing', 'Contracts'],
    'Jupiter': ['Spiritual activities', 'Education', 'Marriage', 'Legal matters', 'Finance'],
    'Venus': ['Romance', 'Art', 'Music', 'Luxury purchases', 'Beauty treatments'],
    'Saturn': ['Hard work', 'Real estate', 'Agriculture', 'Iron/steel work', 'Discipline']
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function isNowBetween(start: Date, end: Date): boolean {
    const now = new Date();
    return now >= start && now <= end;
}

function parseTimeToDate(timeStr: string, baseDate: Date): Date {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(baseDate);
    let hour = hours;
    if (period === 'PM' && hours !== 12) hour += 12;
    if (period === 'AM' && hours === 12) hour = 0;
    result.setHours(hour, minutes, 0, 0);
    return result;
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate sunrise and sunset times for a given date and location
 * Uses approximate calculation for Indian Standard Time (Hyderabad: 17.38°N, 78.48°E)
 */
export function getSunriseSunset(date: Date = new Date()): { sunrise: Date; sunset: Date } {
    const dayOfYear = Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Latitude for Hyderabad (can be made configurable)
    const latitude = 17.38;

    // Calculate solar declination
    const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));

    // Calculate hour angle
    const hourAngle = Math.acos(
        -Math.tan(latitude * (Math.PI / 180)) * Math.tan(declination * (Math.PI / 180))
    ) * (180 / Math.PI);

    // Calculate sunrise and sunset (in hours from midnight, local solar time)
    const solarNoon = 12; // Approximate for IST
    const sunriseHour = solarNoon - hourAngle / 15;
    const sunsetHour = solarNoon + hourAngle / 15;

    const sunrise = new Date(date);
    sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0, 0);

    const sunset = new Date(date);
    sunset.setHours(Math.floor(sunsetHour), Math.round((sunsetHour % 1) * 60), 0, 0);

    return { sunrise, sunset };
}

/**
 * Calculate Rahukaal period for the given day
 */
export function calculateRahukaal(sunrise: Date, sunset: Date): TimePeriod {
    const dayOfWeek = sunrise.getDay();
    const order = RAHUKAAL_ORDER[dayOfWeek];

    const dayDuration = sunset.getTime() - sunrise.getTime();
    const partDuration = dayDuration / 8;

    const start = new Date(sunrise.getTime() + (order - 1) * partDuration);
    const end = new Date(start.getTime() + partDuration);

    return {
        name: 'Rahukaal',
        start,
        end,
        startTime: formatTime(start),
        endTime: formatTime(end),
        isActive: isNowBetween(start, end),
        description: 'Avoid new beginnings, travel starts, and important decisions',
        color: 'red'
    };
}

/**
 * Calculate Yamagandam period for the given day
 */
export function calculateYamagandam(sunrise: Date, sunset: Date): TimePeriod {
    const dayOfWeek = sunrise.getDay();
    const order = YAMAGANDAM_ORDER[dayOfWeek];

    const dayDuration = sunset.getTime() - sunrise.getTime();
    const partDuration = dayDuration / 8;

    const start = new Date(sunrise.getTime() + (order - 1) * partDuration);
    const end = new Date(start.getTime() + partDuration);

    return {
        name: 'Yamagandam',
        start,
        end,
        startTime: formatTime(start),
        endTime: formatTime(end),
        isActive: isNowBetween(start, end),
        description: 'Inauspicious for all activities, especially travel',
        color: 'orange'
    };
}

/**
 * Calculate Gulika Kalam period for the given day
 */
export function calculateGulikaKalam(sunrise: Date, sunset: Date): TimePeriod {
    const dayOfWeek = sunrise.getDay();
    const order = GULIKA_ORDER[dayOfWeek];

    const dayDuration = sunset.getTime() - sunrise.getTime();
    const partDuration = dayDuration / 8;

    const start = new Date(sunrise.getTime() + (order - 1) * partDuration);
    const end = new Date(start.getTime() + partDuration);

    return {
        name: 'Gulika Kalam',
        start,
        end,
        startTime: formatTime(start),
        endTime: formatTime(end),
        isActive: isNowBetween(start, end),
        description: 'Avoid auspicious activities, ruled by Saturn\'s son Gulika',
        color: 'purple'
    };
}

/**
 * Calculate Abhijit Muhurta (the most auspicious time of day)
 * Abhijit is approximately 24 minutes before and after solar noon
 */
export function calculateAbhijitMuhurta(sunrise: Date, sunset: Date): TimePeriod {
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const solarNoon = new Date(sunrise.getTime() + dayDuration / 2);

    // Abhijit is the 8th muhurta of the day, around solar noon
    // Each muhurta is 1/15th of the daytime (about 48 minutes)
    const muhurtaDuration = dayDuration / 15;

    const start = new Date(solarNoon.getTime() - muhurtaDuration / 2);
    const end = new Date(solarNoon.getTime() + muhurtaDuration / 2);

    return {
        name: 'Abhijit Muhurta',
        start,
        end,
        startTime: formatTime(start),
        endTime: formatTime(end),
        isActive: isNowBetween(start, end),
        description: 'Most auspicious time - excellent for all new beginnings',
        color: 'green'
    };
}

/**
 * Calculate Brahma Muhurta (96 minutes before sunrise)
 */
export function calculateBrahmaMuhurta(sunrise: Date): TimePeriod {
    const start = new Date(sunrise.getTime() - 96 * 60 * 1000); // 96 minutes before sunrise
    const end = new Date(sunrise.getTime() - 48 * 60 * 1000);   // 48 minutes before sunrise

    return {
        name: 'Brahma Muhurta',
        start,
        end,
        startTime: formatTime(start),
        endTime: formatTime(end),
        isActive: isNowBetween(start, end),
        description: 'Best time for meditation, study, and spiritual practices',
        color: 'cyan'
    };
}

/**
 * Get all Panchang timings for the day
 */
export function getPanchangTimings(date: Date = new Date()): PanchangTiming {
    const { sunrise, sunset } = getSunriseSunset(date);

    return {
        rahukaal: calculateRahukaal(sunrise, sunset),
        yamagandam: calculateYamagandam(sunrise, sunset),
        gulikaKalam: calculateGulikaKalam(sunrise, sunset),
        abhijitMuhurta: calculateAbhijitMuhurta(sunrise, sunset),
        brahmamuhrta: calculateBrahmaMuhurta(sunrise)
    };
}

/**
 * Calculate current planetary hora
 */
export function getCurrentHora(date: Date = new Date()): HoraPeriod {
    const { sunrise, sunset } = getSunriseSunset(date);
    const dayOfWeek = date.getDay();

    const now = date.getTime();
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const nightDuration = 24 * 60 * 60 * 1000 - dayDuration;

    let horaIndex: number;
    let horaStart: Date;
    let horaEnd: Date;
    let horaDuration: number;

    if (now >= sunrise.getTime() && now < sunset.getTime()) {
        // Daytime hora
        horaDuration = dayDuration / 12;
        const elapsedSinceSunrise = now - sunrise.getTime();
        const horaNumber = Math.floor(elapsedSinceSunrise / horaDuration);

        // Starting planet based on weekday + hora number
        const startingPlanetIndex = WEEKDAY_RULER_INDEX[dayOfWeek];
        horaIndex = (startingPlanetIndex + horaNumber) % 7;

        horaStart = new Date(sunrise.getTime() + horaNumber * horaDuration);
        horaEnd = new Date(horaStart.getTime() + horaDuration);
    } else {
        // Nighttime hora
        horaDuration = nightDuration / 12;

        let nightStart: Date;
        if (now >= sunset.getTime()) {
            nightStart = sunset;
        } else {
            // Before sunrise, night started previous day
            const prevSunset = new Date(sunset);
            prevSunset.setDate(prevSunset.getDate() - 1);
            nightStart = prevSunset;
        }

        const elapsedSinceSunset = now - nightStart.getTime();
        const horaNumber = Math.floor(elapsedSinceSunset / horaDuration) + 12; // +12 for night hours

        const startingPlanetIndex = WEEKDAY_RULER_INDEX[dayOfWeek];
        horaIndex = (startingPlanetIndex + horaNumber) % 7;

        horaStart = new Date(nightStart.getTime() + (horaNumber - 12) * horaDuration);
        horaEnd = new Date(horaStart.getTime() + horaDuration);
    }

    const planet = HORA_PLANETS[horaIndex];

    return {
        planet,
        planetSymbol: PLANET_SYMBOLS[planet],
        start: horaStart,
        end: horaEnd,
        startTime: formatTime(horaStart),
        endTime: formatTime(horaEnd),
        isActive: true,
        activities: HORA_ACTIVITIES[planet],
        color: PLANET_COLORS[planet]
    };
}

/**
 * Get full hora sequence for the day (24 hours)
 */
export function getHoraSequence(date: Date = new Date()): HoraPeriod[] {
    const { sunrise, sunset } = getSunriseSunset(date);
    const dayOfWeek = date.getDay();
    const now = new Date();

    const dayDuration = sunset.getTime() - sunrise.getTime();
    const dayHoraDuration = dayDuration / 12;
    const nightDuration = 24 * 60 * 60 * 1000 - dayDuration;
    const nightHoraDuration = nightDuration / 12;

    const startingPlanetIndex = WEEKDAY_RULER_INDEX[dayOfWeek];
    const horas: HoraPeriod[] = [];

    // Daytime horas (12)
    for (let i = 0; i < 12; i++) {
        const planetIndex = (startingPlanetIndex + i) % 7;
        const planet = HORA_PLANETS[planetIndex];
        const start = new Date(sunrise.getTime() + i * dayHoraDuration);
        const end = new Date(start.getTime() + dayHoraDuration);

        horas.push({
            planet,
            planetSymbol: PLANET_SYMBOLS[planet],
            start,
            end,
            startTime: formatTime(start),
            endTime: formatTime(end),
            isActive: isNowBetween(start, end),
            activities: HORA_ACTIVITIES[planet],
            color: PLANET_COLORS[planet]
        });
    }

    // Nighttime horas (12)
    for (let i = 0; i < 12; i++) {
        const planetIndex = (startingPlanetIndex + 12 + i) % 7;
        const planet = HORA_PLANETS[planetIndex];
        const start = new Date(sunset.getTime() + i * nightHoraDuration);
        const end = new Date(start.getTime() + nightHoraDuration);

        horas.push({
            planet,
            planetSymbol: PLANET_SYMBOLS[planet],
            start,
            end,
            startTime: formatTime(start),
            endTime: formatTime(end),
            isActive: isNowBetween(start, end),
            activities: HORA_ACTIVITIES[planet],
            color: PLANET_COLORS[planet]
        });
    }

    return horas;
}

/**
 * Get inauspicious periods as a sorted timeline
 */
export function getInauspiciousTimeline(date: Date = new Date()): TimePeriod[] {
    const timings = getPanchangTimings(date);

    const periods = [
        timings.rahukaal,
        timings.yamagandam,
        timings.gulikaKalam
    ];

    // Sort by start time
    return periods.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Check if current time is in any inauspicious period
 */
export function isInauspiciousNow(date: Date = new Date()): { isInauspicious: boolean; period: TimePeriod | null } {
    const timings = getPanchangTimings(date);

    if (timings.rahukaal.isActive) {
        return { isInauspicious: true, period: timings.rahukaal };
    }
    if (timings.yamagandam.isActive) {
        return { isInauspicious: true, period: timings.yamagandam };
    }
    if (timings.gulikaKalam.isActive) {
        return { isInauspicious: true, period: timings.gulikaKalam };
    }

    return { isInauspicious: false, period: null };
}
