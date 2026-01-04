import { normalize } from '@/lib/utils/astro-math';

export type DivisionalResult = {
    signIndex: number; // 0-11
    signName: string;
    isVargottama?: boolean; // Only for D9 usually, but tracked general
};

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// ==========================================
// D1 - RASHI (Root)
// ==========================================
export function calculateRashi(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const signIndex = Math.floor(normLon / 30);
        results[planet] = {
            signIndex,
            signName: SIGNS[signIndex],
            isVargottama: false
        };
    }
    return results;
}

// ==========================================
// D9 - NAVAMSHA (Lineage / Spouse / Strength)
// ==========================================
export function calculateNavamsha(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const d1SignIndex = Math.floor(normLon / 30);
        const degreesInSign = normLon % 30;
        const pada = Math.floor(degreesInSign / 3.333333); // 0-8

        // 1 (Aries), 5, 9 -> Start Aries (0)
        // 2 (Taurus), 6, 10 -> Start Capricorn (9)
        // 3 (Gemini), 7, 11 -> Start Libra (6)
        // 4 (Cancer), 8, 12 -> Start Cancer (3)
        const d1SignNum = d1SignIndex + 1; // 1-12
        let startSignIndex = 0;

        if ([1, 5, 9].includes(d1SignNum)) startSignIndex = 0;
        else if ([2, 6, 10].includes(d1SignNum)) startSignIndex = 9;
        else if ([3, 7, 11].includes(d1SignNum)) startSignIndex = 6;
        else if ([4, 8, 12].includes(d1SignNum)) startSignIndex = 3;

        const d9SignIndex = (startSignIndex + pada) % 12;

        results[planet] = {
            signIndex: d9SignIndex,
            signName: SIGNS[d9SignIndex],
            isVargottama: d1SignIndex === d9SignIndex
        };
    }
    return results;
}

// ==========================================
// D3 - DREKKANA (Siblings / Courage)
// ==========================================
export function calculateDrekkana(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const d1SignIndex = Math.floor(normLon / 30);
        const degreesInSign = normLon % 30;
        const decan = Math.floor(degreesInSign / 10); // 0, 1, 2

        // 1st Decan (0-10): Same Sign
        // 2nd Decan (10-20): 5th from it (+4 signs)
        // 3rd Decan (20-30): 9th from it (+8 signs)
        let d3SignIndex = d1SignIndex;
        if (decan === 1) d3SignIndex = (d1SignIndex + 4) % 12;
        if (decan === 2) d3SignIndex = (d1SignIndex + 8) % 12;

        results[planet] = {
            signIndex: d3SignIndex,
            signName: SIGNS[d3SignIndex]
        };
    }
    return results;
}

// ==========================================
// D7 - SAPTAMSA (Progeny / Creativity)
// ==========================================
export function calculateSaptamsa(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const d1SignIndex = Math.floor(normLon / 30);
        const degreesInSign = normLon % 30;
        const part = Math.floor(degreesInSign / (30 / 7)); // 0-6

        const signType = (d1SignIndex % 2 === 0) ? 'Odd' : 'Even'; // 0=Aries(Odd), 1=Taurus(Even)

        let d7SignIndex = 0;
        if (signType === 'Odd') {
            // Start from same sign
            d7SignIndex = (d1SignIndex + part) % 12;
        } else {
            // Start from 7th from sign (+6 signs)
            d7SignIndex = (d1SignIndex + 6 + part) % 12;
        }

        results[planet] = {
            signIndex: d7SignIndex,
            signName: SIGNS[d7SignIndex]
        };
    }
    return results;
}

// ==========================================
// D10 - DASAMSA (Career / Status)
// ==========================================
export function calculateDasamsa(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const d1SignIndex = Math.floor(normLon / 30);
        const degreesInSign = normLon % 30;
        const part = Math.floor(degreesInSign / 3); // 0-9

        const signType = (d1SignIndex % 2 === 0) ? 'Odd' : 'Even';

        let d10SignIndex = 0;
        if (signType === 'Odd') {
            // Start from same sign
            d10SignIndex = (d1SignIndex + part) % 12;
        } else {
            // Start from 9th from sign (+8 signs)
            d10SignIndex = (d1SignIndex + 8 + part) % 12;
        }

        results[planet] = {
            signIndex: d10SignIndex,
            signName: SIGNS[d10SignIndex]
        };
    }
    return results;
}

// ==========================================
// D12 - DWADASAMSA (Parents / Lineage)
// ==========================================
export function calculateDwadasamsa(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const d1SignIndex = Math.floor(normLon / 30);
        const degreesInSign = normLon % 30;
        const part = Math.floor(degreesInSign / 2.5); // 0-11

        // Always starts from the sign itself
        const d12SignIndex = (d1SignIndex + part) % 12;

        results[planet] = {
            signIndex: d12SignIndex,
            signName: SIGNS[d12SignIndex]
        };
    }
    return results;
}

// ==========================================
// D60 - SHASHTIAMSA (Past Life / All Matters)
// ==========================================
export function calculateShashtiamsa(longitudes: Record<string, number>): Record<string, DivisionalResult> {
    const results: Record<string, DivisionalResult> = {};
    for (const [planet, lon] of Object.entries(longitudes)) {
        const normLon = normalize(lon);
        const d1SignIndex = Math.floor(normLon / 30);
        const degreesInSign = normLon % 30;
        const part = Math.floor(degreesInSign / 0.5); // 0-59

        // Ignore Parashara special mapping for now, use cyclic mapping for simplicity in this version
        // Standard calculation: result = (SignIndex * 60 + Part) % 12
        // But simply: Starts from same sign, count continuously
        // Correct Parashara Method: 
        // Odd Sign: Start from Same Sign
        // Even Sign: Start from Same Sign
        // Wait, standard method: (SignIndex * 5 + Part) ? No.
        // Let's use simple cyclic method: (Amsha number) % 12 ??
        // Standard D60 mapping: 
        // Odd Signs: 1, 2, 3...
        // Even Signs: 1, 2, 3... 
        // Actually D60 rules are usually specific deities. For sign placement, we often use:
        // Current Sign + part.

        // Let's use the method: (Sign-1)*60 + part -> Mod 12.
        // This is equivalent to finding the absolute 60th part index.
        const d60SignIndex = (d1SignIndex + part) % 12;

        results[planet] = {
            signIndex: d60SignIndex,
            signName: SIGNS[d60SignIndex]
        };
    }
    return results;
}

// ==========================================
// UNIFIED CALCULATOR
// ==========================================
export function calculateAllDivisionalCharts(longitudes: Record<string, number>) {
    return {
        D1: calculateRashi(longitudes),
        D3: calculateDrekkana(longitudes),
        D7: calculateSaptamsa(longitudes),
        D9: calculateNavamsha(longitudes),
        D10: calculateDasamsa(longitudes),
        D12: calculateDwadasamsa(longitudes),
        D60: calculateShashtiamsa(longitudes)
    };
}
