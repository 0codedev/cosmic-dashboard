import { normalize } from '@/lib/utils/astro-math';
import { calculateAllDivisionalCharts } from './divisional-engine';

// ==========================================
// TYPES
// ==========================================

export type ShadbalaResult = {
    total: number; // In Rupas (e.g. 6.5)
    sthana: number;
    dig: number;
    kala: number;
    cheshta: number;
    naisargika: number;
    drik: number;
    isStrong: boolean;
    strengthPercent: number; // 0-100+ normalized against required strength
};

export type FullShadbalaReport = Record<string, ShadbalaResult>;

// ==========================================
// CONSTANTS
// ==========================================

// Minimum Rupas required for strength
const REQUIRED_STRENGTH: Record<string, number> = {
    'Sun': 6.5,
    'Moon': 6.0,
    'Mars': 5.0,
    'Mercury': 7.0,
    'Jupiter': 6.5,
    'Venus': 5.5,
    'Saturn': 5.0
};

// Natural Strength (Naisargika Bala) - Fixed values in Rupas
// Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn
// Values in Virupas (60 Virupas = 1 Rupa):
// Sun: 60, Moon: 51.43, Ven: 42.85, Jup: 34.28, Mer: 25.70, Mar: 17.14, Sat: 8.57
const NAISARGIKA_BALA: Record<string, number> = {
    'Sun': 1.00,
    'Moon': 0.86,
    'Venus': 0.71,
    'Jupiter': 0.57,
    'Mercury': 0.43,
    'Mars': 0.29,
    'Saturn': 0.14
};

// Directional Strength (Dig Bala) Best Directions (House 1, 4, 7, 10)
// East(1): Mer, Jup. South(10): Sun, Mar. West(7): Sat. North(4): Ven, Moon.
const DIG_BALA_POINT: Record<string, number> = {
    'Sun': 10, 'Mars': 10,
    'Mercury': 1, 'Jupiter': 1,
    'Saturn': 7,
    'Venus': 4, 'Moon': 4
};

// Exaltation Points
const EXALTATION: Record<string, number> = {
    'Sun': 10, 'Moon': 33, 'Mars': 298, 'Mercury': 165,
    'Jupiter': 95, 'Venus': 357, 'Saturn': 200
};

// Friendships (Planet -> Friends)
const FRIENDS: Record<string, string[]> = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus']
};

const ENEMIES: Record<string, string[]> = {
    'Sun': ['Venus', 'Saturn'],
    'Moon': [],
    'Mars': ['Mercury'],
    'Mercury': ['Moon'],
    'Jupiter': ['Mercury', 'Venus'],
    'Venus': ['Sun', 'Moon'],
    'Saturn': ['Sun', 'Moon', 'Mars']
};

// ==========================================
// CALCULATOR
// ==========================================

/**
 * Calculate full Shadbala for all planets
 */
export function calculateFullShadbala(
    longitudes: Record<string, number>,
    isRetrograde: Record<string, boolean>,
    ascendantLon: number,
    isDayBirth: boolean,
    moonPhase: number // 0-14 (0=New, 14=Full)
): FullShadbalaReport {
    const results: FullShadbalaReport = {};
    const divisionalCharts = calculateAllDivisionalCharts(longitudes);

    for (const planet of Object.keys(longitudes)) {
        if (planet === 'Rahu' || planet === 'Ketu' || planet === 'Ascendant') continue;

        const lon = longitudes[planet];

        // 1. STHANA BALA (Positional)
        let sthana = 0;

        // Uchcha Bala (Exaltation) - Max 1.0 Rupa (60 Virupas)
        const exaltPoint = EXALTATION[planet] || 0;
        const dist = Math.abs(normalize(lon - exaltPoint));
        const effectiveDist = dist > 180 ? 360 - dist : dist;
        const uchchaBala = (180 - effectiveDist) / 180; // 0 to 1.0
        sthana += uchchaBala;

        // Saptavargiya Bala (7 Divisional Charts)
        // Simplified: Check placement in D1, D9, D3, D7, D10, D12, D60
        // Friend=45/60, Own=60/60, Exalted=60/60, Enemy=15/60
        // We'll approximate this with D1 & D9 heavily weighted
        // TODO: Full matrix lookup implementation
        let vargaScore = 0;
        // D1 Check
        const d1Sign = divisionalCharts.D1[planet].signIndex;
        // Basic check purely on sign ownership for now
        // This is a placeholder for the full matrix calculation
        sthana += 1.5; // Average placeholder for Saptavargiya + others

        // Kendradi Bala (Angle strength)
        // Kendra (1,4,7,10) = 60, Panapara (2,5,8,11) = 30, Apoklima (3,6,9,12) = 15
        // Relative to Ascendant Sign
        const ascSign = Math.floor(ascendantLon / 30);
        const planetSign = Math.floor(lon / 30);
        const houseNum = ((planetSign - ascSign + 12) % 12) + 1;

        if ([1, 4, 7, 10].includes(houseNum)) sthana += 1.0; // 60 Virupas
        else if ([2, 5, 8, 11].includes(houseNum)) sthana += 0.5; // 30 Virupas
        else sthana += 0.25; // 15 Virupas


        // 2. DIG BALA (Directional)
        // Max 1.0 Rupa (60 Virupas) if at best point
        // Calculate distance from strongest house cusp
        const bestHouse = DIG_BALA_POINT[planet];
        let bestHouseLon = 0;
        if (bestHouse === 1) bestHouseLon = ascendantLon;
        if (bestHouse === 4) bestHouseLon = normalize(ascendantLon + 90);
        if (bestHouse === 7) bestHouseLon = normalize(ascendantLon + 180);
        if (bestHouse === 10) bestHouseLon = normalize(ascendantLon + 270);

        const digDist = Math.abs(normalize(lon - bestHouseLon));
        const effectiveDigDist = digDist > 180 ? 360 - digDist : digDist;
        const digBala = (180 - effectiveDigDist) / 180;


        // 3. KALA BALA (Temporal)
        // Natonal (Day/Night)
        // Moon, Mars, Venus strong at Night. Sun, Jup, Sat strong at Day. Mercury always strong.
        let natonal = 0;
        if (['Moon', 'Mars', 'Venus'].includes(planet)) natonal = isDayBirth ? 0 : 0.5;
        else if (['Sun', 'Jupiter', 'Saturn'].includes(planet)) natonal = isDayBirth ? 0.5 : 0;
        else if (planet === 'Mercury') natonal = 0.5;

        // Paksha Bala (Lunar Phase)
        // Benefics get strength in bright half, Malefics in dark half
        // Simplified
        let paksha = 0.5; // Average

        const kalaBala = natonal + paksha + 0.5; // Adding avg for Year/Month lord


        // 4. CHESHTA BALA (Motional)
        // Retrograde = Full strength (60 Virupas = 1.0 Rupa)
        // Sun/Moon: based on declination (Uttarayana) - simplified here
        let cheshta = 0.5; // Average
        if (isRetrograde[planet]) cheshta = 1.0;
        if (planet === 'Sun' || planet === 'Moon') cheshta = 0.8; // Luminaries don't retrograde


        // 5. NAISARGIKA BALA (Natural)
        const naisargika = NAISARGIKA_BALA[planet] || 0.5;


        // 6. DRIK BALA (Aspectual)
        // Simplified: +0.25 for benefic aspect, -0.25 for malefic
        // This requires full aspect matrix. Using average for now.
        const drik = 0.2;


        // TOTAL
        const total = sthana + digBala + kalaBala + cheshta + naisargika + drik;
        const required = REQUIRED_STRENGTH[planet] || 6.0;
        const strengthPercent = Math.round((total / required) * 100);

        results[planet] = {
            total: Number(total.toFixed(2)),
            sthana: Number(sthana.toFixed(2)),
            dig: Number(digBala.toFixed(2)),
            kala: Number(kalaBala.toFixed(2)),
            cheshta: Number(cheshta.toFixed(2)),
            naisargika: Number(naisargika.toFixed(2)),
            drik: Number(drik.toFixed(2)),
            isStrong: total >= required,
            strengthPercent
        };
    }

    return results;
}
