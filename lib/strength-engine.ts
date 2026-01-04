+import { normalize } from '@/lib/utils/astro-math';
import { ZODIAC_SIGNS } from '@/data/interpretation/signs';

export type PlanetStrength = {
    score: number; // 0 to 100+
    dignity: string; // "Exalted", "Moolatrikona", "Own Sign", "Friend", "Neutral", "Enemy", "Debilitated"
    percent: string; // "85%"
};

// Deep Exaltation Degrees
const EXALTATION_POINTS: Record<string, number> = {
    "Sun": 10,   // Aries 10
    "Moon": 33,  // Taurus 3
    "Mars": 298, // Capricorn 28
    "Mercury": 165, // Virgo 15
    "Jupiter": 95,  // Cancer 5
    "Venus": 357, // Pisces 27
    "Saturn": 200 // Libra 20
};

// Deep Debilitation is Exaltation + 180
const DEBILITATION_POINTS: Record<string, number> = {
    "Sun": 190,   // Libra 10
    "Moon": 213,  // Scorpio 3
    "Mars": 118,  // Cancer 28
    "Mercury": 345, // Pisces 15
    "Jupiter": 275, // Capricorn 5
    "Venus": 177, // Virgo 27
    "Saturn": 20  // Aries 20
};

// Natural Friendships (Simplified)
// 1 = Friend, 0 = Neutral, -1 = Enemy
const FRIENDSHIPS: Record<string, Record<string, number>> = {
    "Sun": { "Moon": 1, "Mars": 1, "Jupiter": 1, "Mercury": 0, "Venus": -1, "Saturn": -1 },
    "Moon": { "Sun": 1, "Mercury": 1, "Mars": 0, "Jupiter": 0, "Venus": 0, "Saturn": 0 },
    "Mars": { "Sun": 1, "Moon": 1, "Jupiter": 1, "Venus": 0, "Saturn": 0, "Mercury": -1 },
    "Mercury": { "Sun": 1, "Venus": 1, "Mars": 0, "Jupiter": 0, "Saturn": 0, "Moon": -1 },
    "Jupiter": { "Sun": 1, "Moon": 1, "Mars": 1, "Saturn": 0, "Mercury": -1, "Venus": -1 },
    "Venus": { "Mercury": 1, "Saturn": 1, "Mars": 0, "Jupiter": 0, "Sun": -1, "Moon": -1 },
    "Saturn": { "Mercury": 1, "Venus": 1, "Jupiter": 0, "Sun": -1, "Moon": -1, "Mars": -1 }
};

export function calculateStrength(planetName: string, planetLon: number, isRetrograde: boolean, isVargottama: boolean, signName: string): PlanetStrength {
    const normLon = normalize(planetLon);
    let score = 50; // Base Score
    let dignity = "Neutral";

    // 1. Exaltation / Debilitation Check (Uchcha Bala)
    const exaltPoint = EXALTATION_POINTS[normalizeName(planetName)];
    const debilPoint = DEBILITATION_POINTS[normalizeName(planetName)];

    if (exaltPoint !== undefined) {
        // Calculate closeness to exaltation (max 60 points)
        // 180 degrees away = 0 points. 0 degrees away = 60 points.
        const dist = Math.abs(normalize(normLon - exaltPoint));
        const effectiveDist = dist > 180 ? 360 - dist : dist;
        const uchchaBala = (180 - effectiveDist) / 3; // Max 60
        score += uchchaBala - 30; // Center around Base

        if (effectiveDist < 10) dignity = "Exalted";
        else if (effectiveDist > 170) dignity = "Debilitated";
    }

    // 2. Sign Placement (Kshetra Bala)
    const signLord = ZODIAC_SIGNS[signName]?.lord;

    if (signLord === normalizeName(planetName)) {
        score += 20;
        dignity = "Own Sign";
    } else if (signLord) {
        // @ts-ignore
        const relation = FRIENDSHIPS[normalizeName(planetName)]?.[signLord] || 0;
        if (relation === 1) {
            score += 10;
            if (dignity === "Neutral") dignity = "Friend's Sign";
        } else if (relation === -1) {
            score -= 10;
            if (dignity === "Neutral") dignity = "Enemy's Sign";
        }
    }

    // 3. Special Strengths
    if (isVargottama) {
        score += 15; // Massive boost
        dignity += " (Vargottama)";
    }

    if (isRetrograde) {
        // Cheshta Bala: Retrograde usually makes planets stronger (brighter) near earth
        score += 15;
    }

    // Cap at 100, min 0
    score = Math.min(100, Math.max(0, Math.floor(score)));

    return {
        score,
        dignity,
        percent: `${score}%`
    };
}

function normalizeName(name: string) {
    // Handle "Sun" vs "sun" etc
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
