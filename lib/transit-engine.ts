import { calculatePlanetaryPositions, normalize, getZodiacSign, getNakshatra } from './cosmic-engine';
import * as Astronomy from 'astronomy-engine';

export type DailyCosmicScore = {
    date: Date;
    score: number; // -10 to +10
    color: string; // tailwind class
    summary: string;
    details: string[];
};

export type TransitPosition = {
    planet: string;
    longitude: number;
    sign: string;
    degree: number;
    isRetrograde: boolean;
};

// --- CORE CALCULATION ---

export function calculateTransits(date: Date = new Date()): Record<string, TransitPosition> {
    const positions = calculatePlanetaryPositions(date);
    const result: Record<string, TransitPosition> = {};

    const map = {
        'Sun': positions.sun,
        'Moon': positions.moon,
        'Mars': positions.mars,
        'Mercury': positions.mercury,
        'Jupiter': positions.jupiter,
        'Venus': positions.venus,
        'Saturn': positions.saturn
    };

    // Calculate Retrograde Status (Compare with Position 1 hour ago)
    const prevDate = new Date(date.getTime() - 60 * 60 * 1000);
    const prevPositions = calculatePlanetaryPositions(prevDate);
    const prevMap = {
        'Sun': prevPositions.sun,
        'Moon': prevPositions.moon,
        'Mars': prevPositions.mars,
        'Mercury': prevPositions.mercury,
        'Jupiter': prevPositions.jupiter,
        'Venus': prevPositions.venus,
        'Saturn': prevPositions.saturn
    };

    for (const [planet, lon] of Object.entries(map)) {
        const signInfo = getZodiacSign(lon);
        // Retrograde Check: If Longitude decreased, it's Rx
        // Handle 360 boundary: 0 -> 359 is Rx. 359 -> 0 is Direct.
        // Simple diff: Current - Previous.
        let diff = lon - prevMap[planet as keyof typeof prevMap];
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        result[planet] = {
            planet,
            longitude: lon,
            sign: signInfo.name,
            degree: signInfo.degrees,
            isRetrograde: diff < 0
        };
    }

    // Add Nodes (Simplified, usually Rx)
    result['Rahu'] = { planet: 'Rahu', longitude: 350, sign: 'Pisces', degree: 0, isRetrograde: true }; // Placeholder until engine supports nodes
    result['Ketu'] = { planet: 'Ketu', longitude: 170, sign: 'Virgo', degree: 0, isRetrograde: true };

    return result;
}

// --- HEATMAP ENGINE ---

export function calculateMonthlyTransits(year: number, month: number, natalMoonLon: number, natalNakshatraIndex: number): DailyCosmicScore[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const results: DailyCosmicScore[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d, 12, 0, 0); // Noon
        const transits = calculatePlanetaryPositions(date);

        // --- SCORING LOGIC ---
        let score = 0;
        const details: string[] = [];

        // 1. CHANDRA BALA (Moon relative to Natal Moon)
        const moonSignIndex = Math.floor(normalize(transits.moon) / 30);
        const natalMoonSignIndex = Math.floor(normalize(natalMoonLon) / 30);
        const positionFromMoon = (moonSignIndex - natalMoonSignIndex + 12) % 12 + 1; // 1-12

        const chandrabalaMap: Record<number, number> = {
            1: 0, 2: -1, 3: 1, 4: -1, 5: -1, 6: 1, 7: 1, 8: -2, 9: -1, 10: 1, 11: 1, 12: -1
        };
        const chandraScore = chandrabalaMap[positionFromMoon] || 0;
        score += chandraScore * 2; // Weight Chandrabala heavily

        if (positionFromMoon === 8) details.push("Moon in 8th from Natal (Chandra-Ashtama) - High Caution.");
        if ([3, 6, 10, 11].includes(positionFromMoon)) details.push("Moon in favorable Upachaya house.");

        // 2. TARA BALA (Nakshatra Transit)
        const transitMoonNak = getNakshatra(transits.moon);
        const dist = (transitMoonNak.index - natalNakshatraIndex + 27) % 27 + 1;
        const taraRemainder = (dist - 1) % 9 + 1; // 1-9

        const taraMap: Record<number, number> = {
            1: -1, 2: 2, 3: -2, 4: 2, 5: -1, 6: 2, 7: -3, 8: 2, 9: 3
        };
        const taraScore = taraMap[taraRemainder] || 0;
        score += taraScore;

        if (taraScore > 1) details.push(`Beneficial Star (${transitMoonNak.name})`);
        if (taraScore < 0) details.push(`Challenging Star (${transitMoonNak.name})`);

        // 3. MAJOR TRANSITS (Jupiter/Saturn relative to Natal Moon)
        const jupSignIndex = Math.floor(normalize(transits.jupiter) / 30);
        const jupFromMoon = (jupSignIndex - natalMoonSignIndex + 12) % 12 + 1;
        if ([2, 5, 7, 9, 11].includes(jupFromMoon)) {
            score += 1; // Jupiter support
        }

        const satSignIndex = Math.floor(normalize(transits.saturn) / 30);
        const satFromMoon = (satSignIndex - natalMoonSignIndex + 12) % 12 + 1;
        if ([12, 1, 2].includes(satFromMoon)) {
            score -= 1; // Sade Sati drag
        }

        // --- NORMALIZE & COLOR ---
        let color = "bg-gray-500";
        let summary = "Neutral";

        if (score >= 4) { color = "bg-emerald-500"; summary = "Excellent flow"; }
        else if (score >= 2) { color = "bg-green-500"; summary = "Good day"; }
        else if (score >= 0) { color = "bg-slate-500"; summary = "Average/Mixed"; }
        else if (score >= -2) { color = "bg-amber-500"; summary = "Caution advised"; }
        else { color = "bg-red-600"; summary = "High Stress"; }

        results.push({
            date,
            score,
            color,
            summary,
            details: Array.from(new Set(details))
        });
    }

    return results;
}

// --- LEGACY COMPATIBILITY ---
export const getCurrentPlanetaryPositions = (date: Date): TransitPosition[] => {
    const transits = calculateTransits(date);
    return Object.values(transits);
};

// Re-export specific calculations if needed elsewhere
export const getTransitToNatalAspects = (transitPositions: Record<string, TransitPosition>, natalPositions: Record<string, number>): any[] => {
    const aspects = [];
    const ASPECT_ORB = 3;
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
};
