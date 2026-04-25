import { DASHA_PERIODS, NAKSHATRA_LORDS } from '@/data/dasha-periods';

const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
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

function getMahadashaDays(planet: string): number {
    const dashaData = DASHA_PERIODS[planet as keyof typeof DASHA_PERIODS];
    return (dashaData?.years || 0) * 365.25;
}

function getNextPlanet(planet: string): string {
    const idx = DASHA_SEQUENCE.indexOf(planet);
    return DASHA_SEQUENCE[(idx + 1) % 9];
}

export function calculateAntardashas(mahadasha: DashaPhase): AntardashaPhase[] {
    const antardashas: AntardashaPhase[] = [];
    const mahadashaPlanet = mahadasha.planet;
    const mahadashaDays = (mahadasha.endDate.getTime() - mahadasha.startDate.getTime()) / (1000 * 60 * 60 * 24);

    const dashaData = DASHA_PERIODS[mahadashaPlanet as keyof typeof DASHA_PERIODS];
    const mahadashaTotalYears = dashaData?.years || 16;

    let runningDate = new Date(mahadasha.startDate);
    let currentPlanet = mahadashaPlanet;
    const now = new Date();

    for (let i = 0; i < 9; i++) {
        const antarData = DASHA_PERIODS[currentPlanet as keyof typeof DASHA_PERIODS];
        const antarPlanetYears = antarData?.years || 0;

        const antarDays = (mahadashaDays * antarPlanetYears) / TOTAL_CYCLE_YEARS;

        const endDate = new Date(runningDate);
        endDate.setTime(endDate.getTime() + antarDays * 24 * 60 * 60 * 1000);

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

export function calculatePratyantardashas(antardasha: AntardashaPhase): PratyantardashaPhase[] {
    const pratyantardashas: PratyantardashaPhase[] = [];
    const antarPlanet = antardasha.planet;
    const antarDays = (antardasha.endDate.getTime() - antardasha.startDate.getTime()) / (1000 * 60 * 60 * 24);

    let runningDate = new Date(antardasha.startDate);
    const now = new Date();
    let currentPlanet = antarPlanet;

    for (let i = 0; i < 9; i++) {
        const pratData = DASHA_PERIODS[currentPlanet as keyof typeof DASHA_PERIODS];
        const pratyantarYears = pratData?.years || 0;

        const pratyantarDays = (antarDays * pratyantarYears) / TOTAL_CYCLE_YEARS;

        const endDate = new Date(runningDate);
        endDate.setTime(endDate.getTime() + pratyantarDays * 24 * 60 * 60 * 1000);

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

export function formatDashaDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export function calculateVimshottari(moonLongitude: number, birthDate: Date): FullDashaResult {
    const normalizedLon = (moonLongitude % 360 + 360) % 360;
    const nakshatraSpan = 13.333333;

    const nakshatraIndex = Math.floor(normalizedLon / nakshatraSpan);
    const traversedInNakshatra = normalizedLon % nakshatraSpan;
    const fractionRemaining = 1 - (traversedInNakshatra / nakshatraSpan);

    const birthLord = NAKSHATRA_LORDS[nakshatraIndex];
    if (!birthLord) throw new Error("Invalid Nakshatra calculation");

    let runningDate = new Date(birthDate);
    const timeline: DashaPhase[] = [];

    const birthDashaData = DASHA_PERIODS[birthLord as keyof typeof DASHA_PERIODS];
    const totalYears = birthDashaData?.years || 16;
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

    let currentLordKey = birthDashaData?.next || "Venus";

    for (let i = 0; i < 9; i++) {
        const periodData = DASHA_PERIODS[currentLordKey as keyof typeof DASHA_PERIODS];
        if (!periodData) break;
        
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

    const now = new Date();
    let currentDasha = timeline[0];

    for (const phase of timeline) {
        if (now >= phase.startDate && now < phase.endDate) {
            currentDasha = phase;
            phase.isCurrent = true;
            break;
        }
    }

    const antardashas = calculateAntardashas(currentDasha);
    const currentAntardasha = antardashas.find(a => a.isCurrent) || null;

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