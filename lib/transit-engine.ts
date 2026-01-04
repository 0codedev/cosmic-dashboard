import { normalize } from '@/lib/utils/astro-math';

export type TransitPosition = {
    planet: string;
    longitude: number;
    sign: string;
    degree: number; // 0-30
    isRetrograde: boolean;
};

// Epoch: Jan 1, 2024 00:00 UTC (Approximate Positions)
const EPOCH_DATE = new Date('2024-01-01T00:00:00Z');

const EPOCH_POSITIONS: Record<string, number> = {
    'Sun': 256.5, // Sagittarius 16
    'Moon': 135.0, // Leo 15 (varies fast)
    'Mars': 267.0, // Sagittarius 27
    'Mercury': 230.0, // Scorpio 20
    'Jupiter': 11.0, // Aries 11
    'Venus': 228.0, // Scorpio 18
    'Saturn': 309.0, // Aquarius 9
    'Rahu': 355.0, // Pisces 25 (Mean)
    'Ketu': 175.0  // Virgo 25
};

const DAILY_SPEEDS: Record<string, number> = {
    'Sun': 0.9856,
    'Moon': 13.176,
    'Mars': 0.524,
    'Mercury': 1.383, // Highly variable
    'Jupiter': 0.083,
    'Venus': 1.602, // Highly variable
    'Saturn': 0.033,
    'Rahu': -0.053,
    'Ketu': -0.053
};

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export function calculateTransits(date: Date = new Date()): Record<string, TransitPosition> {
    const daysSinceEpoch = (date.getTime() - EPOCH_DATE.getTime()) / (1000 * 60 * 60 * 24);

    const positions: Record<string, TransitPosition> = {};

    for (const [planet, startLon] of Object.entries(EPOCH_POSITIONS)) {
        const speed = DAILY_SPEEDS[planet];
        const movement = daysSinceEpoch * speed;
        const currentLon = normalize(startLon + movement);

        const signIndex = Math.floor(currentLon / 30);
        const sign = SIGNS[signIndex];
        const degree = currentLon % 30;

        positions[planet] = {
            planet,
            longitude: currentLon,
            sign,
            degree,
            isRetrograde: false // Simplified: Need complex logic for retro
        };
    }

    // Refinement for Mercury/Venus relative to Sun (Simplified)
    // Ensure Mercury is within +/- 28 deg of Sun
    const sunLon = positions['Sun'].longitude;
    let mercLon = positions['Mercury'].longitude;
    let venusLon = positions['Venus'].longitude;

    if (Math.abs(normalize(mercLon - sunLon)) > 28) {
        // Simple clamp placeholder - real retro logic needed
    }

    return positions;
}

export type AspectResult = {
    planet: string;
    aspectingPlanet: string;
    aspectType: string; // "Conjunction", "Opposition", "Trine", "Square"
    orb: number;
    isApplying: boolean;
};

export function calculateTransitToNatalAspects(
    transitPositions: Record<string, TransitPosition>,
    natalPositions: Record<string, number>
): AspectResult[] {
    const aspects: AspectResult[] = [];
    const ASPECT_ORB = 3; // 3 degree orb

    for (const [tPlanet, tData] of Object.entries(transitPositions)) {
        for (const [nPlanet, nLon] of Object.entries(natalPositions)) {
            const diff = Math.abs(normalize(tData.longitude - nLon));
            const angle = diff > 180 ? 360 - diff : diff;

            let type = "";
            if (angle < ASPECT_ORB) type = "Conjunction";
            else if (Math.abs(angle - 180) < ASPECT_ORB) type = "Opposition";
            else if (Math.abs(angle - 120) < ASPECT_ORB) type = "Trine";
            else if (Math.abs(angle - 90) < ASPECT_ORB) type = "Square";

            if (type) {
                aspects.push({
                    planet: nPlanet,
                    aspectingPlanet: tPlanet,
                    aspectType: type,
                    orb: Number((angle % 1).toFixed(2)),
                    isApplying: true
                });
            }
        }
    }
    return aspects;
    return aspects;
}

// --- Legacy Exports for TransitForecast ---
export const getCurrentPlanetaryPositions = (date: Date) => {
    const transits = calculateTransits(date);
    return Object.values(transits).map(t => ({
        name: t.planet,
        sign: t.sign,
        degree: t.degree,
        isRetrograde: t.isRetrograde
    }));
};

export const getTransitToNatalAspects = calculateTransitToNatalAspects;

export type PlanetPosition = {
    name: string;
    sign: string;
    degree: number;
    isRetrograde: boolean;
};

export type TransitAspect = AspectResult;
