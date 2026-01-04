import { DASHA_PERIODS, NAKSHATRA_LORDS } from '@/data/dasha-periods';

// Vimshottari Dasha sequence for iteration
const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

// Total cycle = 120 years
const TOTAL_CYCLE_YEARS = 120;

export type DashaPhase = {
    planet: string;
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
    level: 'mahadasha' | 'antardasha' | 'pratyantardasha';
};

export type AntardashaPhase = DashaPhase & {
    parentMahadasha: string;
};

export type PratyantardashaPhase = DashaPhase & {
    parentMahadasha: string;
    parentAntardasha: string;
};

export type FullDashaResult = {
    current: DashaPhase;
    fullPath: DashaPhase[];
    currentAntardasha: AntardashaPhase | null;
    currentPratyantardasha: PratyantardashaPhase | null;
};

/**
 * Get duration in days for a planet's Mahadasha
 */
function getMahadashaDays(planet: string): number {
    // @ts-ignore
    return DASHA_PERIODS[planet]?.years * 365.25 || 0;
}

/**
 * Get the next planet in Vimshottari sequence
 */
function getNextPlanet(planet: string): string {
    const idx = DASHA_SEQUENCE.indexOf(planet);
    return DASHA_SEQUENCE[(idx + 1) % 9];
}

/**
 * Calculate Antardasha periods within a Mahadasha
 * Each Antardasha duration = (Mahadasha years × Antardasha planet years) / 120
 */
export function calculateAntardashas(mahadasha: DashaPhase): AntardashaPhase[] {
    const antardashas: AntardashaPhase[] = [];
    const mahadashaPlanet = mahadasha.planet;
    const mahadashaDays = (mahadasha.endDate.getTime() - mahadasha.startDate.getTime()) / (1000 * 60 * 60 * 24);

    // @ts-ignore
    const mahadashaTotalYears = DASHA_PERIODS[mahadashaPlanet]?.years || 16;

    let runningDate = new Date(mahadasha.startDate);

    // Antardashas start from the Mahadasha lord itself, then follow the sequence
    let currentPlanet = mahadashaPlanet;
    const now = new Date();

    for (let i = 0; i < 9; i++) {
        // @ts-ignore
        const antarPlanetYears = DASHA_PERIODS[currentPlanet]?.years || 0;

        // Antardasha duration = (Mahadasha total days × Antardasha planet years) / 120
        const antarDays = (mahadashaDays * antarPlanetYears) / TOTAL_CYCLE_YEARS;

        const endDate = new Date(runningDate);
        endDate.setTime(endDate.getTime() + antarDays * 24 * 60 * 60 * 1000);

        // Clamp to mahadasha end
        const clampedEnd = endDate > mahadasha.endDate ? new Date(mahadasha.endDate) : endDate;

        const isCurrent = now >= runningDate && now < clampedEnd;

        antardashas.push({
            planet: currentPlanet,
            startDate: new Date(runningDate),
            endDate: clampedEnd,
            isCurrent,
            level: 'antardasha',
            parentMahadasha: mahadashaPlanet
        });

        runningDate = new Date(clampedEnd);
        currentPlanet = getNextPlanet(currentPlanet);

        if (runningDate >= mahadasha.endDate) break;
    }

    return antardashas;
}

/**
 * Calculate Pratyantardasha periods within an Antardasha
 * Each Pratyantardasha = (Antardasha days × Pratyantardasha planet years) / 120
 */
export function calculatePratyantardashas(antardasha: AntardashaPhase): PratyantardashaPhase[] {
    const pratyantardashas: PratyantardashaPhase[] = [];
    const antarPlanet = antardasha.planet;
    const antarDays = (antardasha.endDate.getTime() - antardasha.startDate.getTime()) / (1000 * 60 * 60 * 24);

    let runningDate = new Date(antardasha.startDate);
    const now = new Date();

    // Pratyantardashas start from the Antardasha lord itself
    let currentPlanet = antarPlanet;

    for (let i = 0; i < 9; i++) {
        // @ts-ignore
        const pratyantarYears = DASHA_PERIODS[currentPlanet]?.years || 0;

        // Pratyantardasha duration
        const pratyantarDays = (antarDays * pratyantarYears) / TOTAL_CYCLE_YEARS;

        const endDate = new Date(runningDate);
        endDate.setTime(endDate.getTime() + pratyantarDays * 24 * 60 * 60 * 1000);

        // Clamp to antardasha end
        const clampedEnd = endDate > antardasha.endDate ? new Date(antardasha.endDate) : endDate;

        const isCurrent = now >= runningDate && now < clampedEnd;

        pratyantardashas.push({
            planet: currentPlanet,
            startDate: new Date(runningDate),
            endDate: clampedEnd,
            isCurrent,
            level: 'pratyantardasha',
            parentMahadasha: antardasha.parentMahadasha,
            parentAntardasha: antarPlanet
        });

        runningDate = new Date(clampedEnd);
        currentPlanet = getNextPlanet(currentPlanet);

        if (runningDate >= antardasha.endDate) break;
    }

    return pratyantardashas;
}

/**
 * Format a date to readable string (e.g., "Jan 15, 2025")
 */
export function formatDashaDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Calculate complete Vimshottari dasha with current Antardasha and Pratyantardasha
 */
export function calculateVimshottari(moonLongitude: number, birthDate: Date): FullDashaResult {
    // 1. Calculate Nakshatra Position
    const normalizedLon = (moonLongitude % 360 + 360) % 360;
    const nakshatraSpan = 13.333333; // 13 degrees 20 minutes

    // Nakshatra Index (0-26)
    const nakshatraIndex = Math.floor(normalizedLon / nakshatraSpan);

    // Degrees traversed within this Nakshatra
    const traversedInNakshatra = normalizedLon % nakshatraSpan;

    // Fraction remaining (Balance of Dasha)
    const fractionRemaining = 1 - (traversedInNakshatra / nakshatraSpan);

    // 2. Identify Ruling Lord at Birth
    const birthLord = NAKSHATRA_LORDS[nakshatraIndex];
    if (!birthLord) throw new Error("Invalid Nakshatra calculation");

    // 3. Calculate Dates
    let runningDate = new Date(birthDate);
    const timeline: DashaPhase[] = [];

    // Add Birth Dasha (Partial)
    // @ts-ignore
    const totalYears = DASHA_PERIODS[birthLord].years;
    const remainingYears = totalYears * fractionRemaining;
    const endDate = new Date(runningDate);
    endDate.setDate(endDate.getDate() + (remainingYears * 365.25));

    timeline.push({
        planet: birthLord,
        startDate: new Date(birthDate),
        endDate: new Date(endDate),
        isCurrent: false,
        level: 'mahadasha'
    });

    runningDate = new Date(endDate);

    // 4. Generate next cycles of Dashas (enough for 100+ years)
    // @ts-ignore
    let currentLordKey = DASHA_PERIODS[birthLord].next;

    for (let i = 0; i < 9; i++) {
        // @ts-ignore
        const periodData = DASHA_PERIODS[currentLordKey];
        const end = new Date(runningDate);
        end.setDate(end.getDate() + (periodData.years * 365.25));

        timeline.push({
            planet: currentLordKey,
            startDate: new Date(runningDate),
            endDate: new Date(end),
            isCurrent: false,
            level: 'mahadasha'
        });

        runningDate = new Date(end);
        currentLordKey = periodData.next;
    }

    // 5. Find Current Mahadasha
    const now = new Date();
    let currentDasha = timeline[0];

    for (const phase of timeline) {
        if (now >= phase.startDate && now < phase.endDate) {
            currentDasha = phase;
            phase.isCurrent = true;
            break;
        }
    }

    // 6. Calculate current Antardasha within current Mahadasha
    const antardashas = calculateAntardashas(currentDasha);
    const currentAntardasha = antardashas.find(a => a.isCurrent) || null;

    // 7. Calculate current Pratyantardasha within current Antardasha
    let currentPratyantardasha: PratyantardashaPhase | null = null;
    if (currentAntardasha) {
        const pratyantardashas = calculatePratyantardashas(currentAntardasha);
        currentPratyantardasha = pratyantardashas.find(p => p.isCurrent) || null;
    }

    return {
        current: currentDasha,
        fullPath: timeline,
        currentAntardasha,
        currentPratyantardasha
    };
}
