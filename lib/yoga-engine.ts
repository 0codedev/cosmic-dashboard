// Yoga Engine - Comprehensive yoga detection for Vedic astrology
// Detects 15+ classical yogas from BPHS (Brihat Parashara Hora Shastra)

function getSignIndex(lon: number): number {
    return Math.floor(((lon % 360) + 360) % 360 / 30);
}

function getHouseFromPlanet(planetLon: number, referenceLon: number): number {
    const pIndex = getSignIndex(planetLon);
    const rIndex = getSignIndex(referenceLon);
    return ((pIndex - rIndex + 12) % 12) + 1;
}

// Sign names for reference
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// Kendra houses (1, 4, 7, 10)
const KENDRA_HOUSES = [1, 4, 7, 10];

// Own signs for planets
const OWN_SIGNS: Record<string, number[]> = {
    sun: [4],       // Leo
    moon: [3],      // Cancer
    mars: [0, 7],   // Aries, Scorpio
    mercury: [2, 5], // Gemini, Virgo
    jupiter: [8, 11], // Sagittarius, Pisces
    venus: [1, 6],  // Taurus, Libra
    saturn: [9, 10] // Capricorn, Aquarius
};

// Exaltation signs for planets
const EXALTATION_SIGNS: Record<string, number> = {
    sun: 0,     // Aries
    moon: 1,    // Taurus
    mars: 9,    // Capricorn
    mercury: 5, // Virgo
    jupiter: 3, // Cancer
    venus: 11,  // Pisces
    saturn: 6   // Libra
};

// Debilitation signs for planets (Exaltation + 6)
const DEBILITATION_SIGNS: Record<string, number> = {
    sun: 6,     // Libra
    moon: 7,    // Scorpio
    mars: 3,    // Cancer
    mercury: 11,// Pisces
    jupiter: 9, // Capricorn
    venus: 5,   // Virgo
    saturn: 0   // Aries
};

// Planet owners of signs 0 (Aries) to 11 (Pisces)
const SIGN_OWNERS = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
// House groupings
const TRIKONAS = [1, 5, 9];
const UPACHAYAS = [3, 6, 10, 11];

export type YogaResult = {
    name: string;
    description: string;
    strength: "Major" | "Minor";
    category: "Mahapurusha" | "Lunar" | "Wealth" | "Raja" | "Special";
    effects: string[];
};

export function checkYogas(positions: Record<string, number>, lagnaLon?: number): YogaResult[] {
    const yogas: YogaResult[] = [];
    const lagna = lagnaLon ?? positions['lagna'] ?? 0;

    const sun = positions['sun'];
    const moon = positions['moon'];
    const mars = positions['mars'];
    const mercury = positions['mercury'];
    const jupiter = positions['jupiter'];
    const venus = positions['venus'];
    const saturn = positions['saturn'];
    const rahu = positions['rahu'];
    const ketu = positions['ketu'];

    // Setup for Lordship Yogas
    const lagnaSignIndex = getSignIndex(lagna);

    // Helper to get lord of a house (1-12)
    const getLord = (house: number) => {
        const sign = (lagnaSignIndex + house - 1) % 12;
        return SIGN_OWNERS[sign];
    };

    // Map for iteration (excluding nodes for lordship)
    const planetsMap = { sun, moon, mars, mercury, jupiter, venus, saturn };
    const planetHouses: Record<string, number> = {};
    const planetSigns: Record<string, number> = {};

    // Pre-calculate houses & signs for all planets
    for (const [p, pos] of Object.entries(planetsMap)) {
        planetHouses[p] = getHouseFromPlanet(pos, lagna);
        planetSigns[p] = getSignIndex(pos);
    }

    // Also store Rahu/Ketu signs
    planetSigns['rahu'] = getSignIndex(rahu);
    planetSigns['ketu'] = getSignIndex(ketu);
    planetHouses['rahu'] = getHouseFromPlanet(rahu, lagna);
    planetHouses['ketu'] = getHouseFromPlanet(ketu, lagna);

    // ============================================
    // 1. PANCH MAHAPURUSHA YOGAS
    // ============================================
    // ... (Existing logic kept, slightly simplified code structure)

    // 1a. RUCHAKA YOGA (Mars)
    if (KENDRA_HOUSES.includes(planetHouses['mars']) &&
        (OWN_SIGNS.mars.includes(planetSigns['mars']) || EXALTATION_SIGNS.mars === planetSigns['mars'])) {
        yogas.push({
            name: "Ruchaka Yoga",
            description: "Mars in Kendra in own/exaltation sign creates powerful warrior energy.",
            strength: "Major",
            category: "Mahapurusha",
            effects: ["Physical strength and courage", "Leadership in military/sports", "Victory over enemies", "Strong willpower"]
        });
    }

    // 1b. BHADRA YOGA (Mercury)
    if (KENDRA_HOUSES.includes(planetHouses['mercury']) &&
        (OWN_SIGNS.mercury.includes(planetSigns['mercury']) || EXALTATION_SIGNS.mercury === planetSigns['mercury'])) {
        yogas.push({
            name: "Bhadra Yoga",
            description: "Mercury in Kendra in own/exaltation creates sharp intellect.",
            strength: "Major",
            category: "Mahapurusha",
            effects: ["Exceptional intelligence", "Success in commerce and communication", "Diplomatic abilities", "Scholarly achievements"]
        });
    }

    // 1c. HAMSA YOGA (Jupiter)
    if (KENDRA_HOUSES.includes(planetHouses['jupiter']) &&
        (OWN_SIGNS.jupiter.includes(planetSigns['jupiter']) || EXALTATION_SIGNS.jupiter === planetSigns['jupiter'])) {
        yogas.push({
            name: "Hamsa Yoga",
            description: "Jupiter in Kendra in own/exaltation grants divine wisdom.",
            strength: "Major",
            category: "Mahapurusha",
            effects: ["Spiritual wisdom", "Teaching and preaching abilities", "Respect in society", "Charitable nature"]
        });
    }

    // 1d. MALAVYA YOGA (Venus)
    if (KENDRA_HOUSES.includes(planetHouses['venus']) &&
        (OWN_SIGNS.venus.includes(planetSigns['venus']) || EXALTATION_SIGNS.venus === planetSigns['venus'])) {
        yogas.push({
            name: "Malavya Yoga",
            description: "Venus in Kendra in own/exaltation creates beauty and luxury.",
            strength: "Major",
            category: "Mahapurusha",
            effects: ["Artistic talents", "Material comforts and luxury", "Beautiful appearance", "Happy married life"]
        });
    }

    // 1e. SHASHA YOGA (Saturn)
    if (KENDRA_HOUSES.includes(planetHouses['saturn']) &&
        (OWN_SIGNS.saturn.includes(planetSigns['saturn']) || EXALTATION_SIGNS.saturn === planetSigns['saturn'])) {
        yogas.push({
            name: "Shasha Yoga",
            description: "Saturn in Kendra in own/exaltation creates disciplined authority.",
            strength: "Major",
            category: "Mahapurusha",
            effects: ["Command over masses", "Political power", "Disciplined nature", "Long-lasting success"]
        });
    }

    // ============================================
    // 2. KALA SARPA & AXIS YOGAS
    // ============================================

    // Check if all planets are hemmed between Rahu and Ketu
    // We need to check the longitudes relative to Rahu
    const nodeAxis1 = planetSigns['rahu'];
    const nodeAxis2 = planetSigns['ketu']; // Should be opposite

    // Simple check: All planets on one side of axis
    // ... (Complex logic usually required for degrees, using signs for stability)
    // Count planets between Rahu -> Ketu vs Ketu -> Rahu
    let countRahuToKetu = 0;
    let countKetuToRahu = 0;

    const majorPlanets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

    for (const p of majorPlanets) {
        // Normalize signs to iterate
        const pSign = planetSigns[p];

        // Count forward from Rahu
        let current = nodeAxis1;
        let isBetween = false;
        for (let i = 0; i < 7; i++) { // roughly half zodiac
            if (current === nodeAxis2) break;
            if (current === pSign) { isBetween = true; break; }
            current = (current + 1) % 12;
        }

        if (isBetween) countRahuToKetu++; // It's in the Rahu->Ketu arc
        else countKetuToRahu++;
    }

    // Kala Sarpa: All 7 planets on one side
    if (countRahuToKetu === 7) {
        yogas.push({
            name: "Kala Sarpa Yoga (Ananta)",
            description: "All planets hemmed between Rahu and Ketu.",
            strength: "Major",
            category: "Special",
            effects: ["Intense life lessons", "Sudden rise and fall", "Struggle in early life", "Great success later"]
        });
    } else if (countKetuToRahu === 7) {
        yogas.push({
            name: "Kala Amrita Yoga",
            description: "All planets hemmed between Ketu and Rahu.",
            strength: "Major",
            category: "Special",
            effects: ["Spiritual liberation focus", "Detachment", "Unconventional success"]
        });
    }

    // ============================================
    // 3. NEECHABHANGA RAJA YOGA (Cancellation of Debilitation)
    // ============================================

    // For each debilitated planet, check NBRY Conditions
    for (const [p, sign] of Object.entries(planetSigns)) {
        if (!DEBILITATION_SIGNS[p]) continue; // Skip nodes if not defined

        if (sign === DEBILITATION_SIGNS[p]) {
            // Planet is debilitated. Check for cancellation.
            let isCancelled = false;

            // 1. Lord of the sign is in Kendra from Lagna or Moon
            const signLord = SIGN_OWNERS[sign];
            const lordHouseLagna = planetHouses[signLord];
            const lordHouseMoon = getHouseFromPlanet(positions[signLord], moon); // Approx check

            if (KENDRA_HOUSES.includes(lordHouseLagna)) isCancelled = true;

            // 2. Planet exalted in that sign is in Kendra from Lagna or Moon
            // e.g. Saturn debilitated in Aries. Exalted planet in Aries is Sun. Check Sun.
            const exaltedPlanetKey = Object.keys(EXALTATION_SIGNS).find(key => EXALTATION_SIGNS[key] === sign);
            if (exaltedPlanetKey) {
                const exP_HouseLagna = planetHouses[exaltedPlanetKey];
                if (KENDRA_HOUSES.includes(exP_HouseLagna)) isCancelled = true;
            }

            if (isCancelled) {
                yogas.push({
                    name: `Neechabhanga Raja Yoga (${p.charAt(0).toUpperCase() + p.slice(1)})`,
                    description: `${p.charAt(0).toUpperCase() + p.slice(1)} debilitation is cancelled, creating powerful results.`,
                    strength: "Major",
                    category: "Raja",
                    effects: ["Rise from humble beginnings", "Great success after struggle", "King-like status"]
                });
            }
        }
    }

    // ============================================
    // 4. PARIVARTANA YOGA (Exchange of Signs)
    // ============================================
    const processedPairs = new Set<string>();

    for (const [p1, pos1] of Object.entries(planetsMap)) {
        for (const [p2, pos2] of Object.entries(planetsMap)) {
            if (p1 === p2) continue;

            // Check if pair already processed
            const pairKey = [p1, p2].sort().join('-');
            if (processedPairs.has(pairKey)) continue;

            // Check exchange
            // Planet 1 is in Sign 2? And Planet 2 in Sign 1?
            // Need to know WHO owns the sign P1 is in.
            const sign1 = planetSigns[p1];
            const sign2 = planetSigns[p2];

            const owner1 = SIGN_OWNERS[sign1];
            const owner2 = SIGN_OWNERS[sign2];

            if (owner1 === p2 && owner2 === p1) {
                // EXCHANGE FOUND
                processedPairs.add(pairKey);

                const h1 = planetHouses[p1];
                const h2 = planetHouses[p2];

                // Classification
                // Maha Yoga: Good houses (1, 2, 4, 5, 7, 9, 10, 11)
                // Dainya Yoga: involves 6, 8, 12
                // Khala Yoga: involves 3

                const badHouses = [6, 8, 12];
                const isDainya = badHouses.includes(h1) || badHouses.includes(h2);
                const isKhala = !isDainya && (h1 === 3 || h2 === 3);

                if (isDainya) {
                    yogas.push({
                        name: `Dainya Parivartana Yoga (${p1}-${p2})`,
                        description: `Exchange involving Dusthana lords (${h1}<->${h2}).`,
                        strength: "Minor",
                        category: "Special",
                        effects: ["Challenges holding wealth", "Success through others' trouble", "Unstable career"]
                    });
                } else if (isKhala) {
                    yogas.push({
                        name: `Khala Parivartana Yoga (${p1}-${p2})`,
                        description: `Exchange involving 3rd house.`,
                        strength: "Major",
                        category: "Special",
                        effects: ["Fluctuating fortunes", "Boldness", "Travel-based success"]
                    });
                } else {
                    yogas.push({
                        name: `Maha Parivartana Yoga (${p1}-${p2})`,
                        description: `Exchange between auspicious houses (${h1}<->${h2}).`,
                        strength: "Major",
                        category: "Raja",
                        effects: ["Great prosperity", "Power and status", "Mutual cooperation", "Success"]
                    });
                }
            }
        }
    }

    // ============================================
    // 5. GURU CHANDALA YOGA
    // ============================================
    // Jupiter + Rahu or Ketu conjunction
    if (planetSigns['jupiter'] === planetSigns['rahu'] || planetSigns['jupiter'] === planetSigns['ketu']) {
        yogas.push({
            name: "Guru Chandala Yoga",
            description: "Jupiter conjunct Rahu or Ketu.",
            strength: "Major", // Often negative but major impact
            category: "Special",
            effects: ["Unconventional wisdom", "Challenge to tradition", "Potential for scandal", "Innovative thinking"]
        });
    }

    // ============================================
    // 6. SHAKATA YOGA
    // ============================================
    // Moon in 6, 8, 12 from Jupiter
    const moonFromJup = getHouseFromPlanet(moon, jupiter);
    if ([6, 8, 12].includes(moonFromJup)) {
        // Cancelled if Moon is in Kendra from Lagna? (Some texts say yes)
        if (!KENDRA_HOUSES.includes(planetHouses['moon'])) {
            yogas.push({
                name: "Shakata Yoga",
                description: "Moon in 6, 8, 12 from Jupiter.",
                strength: "Minor",
                category: "Special",
                effects: ["Fluctuating fortune", "Cycles of success and failure", "Perseverance needed"]
            });
        }
    }

    // ... (Retaining previous important yogas for breadth)

    // Gajakesari (already covered but good to keep basic logic if simpler)
    const jupFromMoon = getHouseFromPlanet(jupiter, moon);
    if (KENDRA_HOUSES.includes(jupFromMoon)) {
        yogas.push({
            name: "Gajakesari Yoga",
            description: "Jupiter in Kendra from Moon grants wisdom and noble reputation.",
            strength: "Major",
            category: "Raja",
            effects: ["Natural wisdom", "Victory over enemies", "Fame and recognition", "Commanding presence"]
        });
    }

    // Budhaditya
    if (planetSigns['sun'] === planetSigns['mercury']) { // using signs is safer
        yogas.push({
            name: "Budhaditya Yoga",
            description: "Sun and Mercury together create high intelligence.",
            strength: "Major",
            category: "Special",
            effects: ["Sharp intellect", "Good reputation", "Success in education", "Administrative abilities"]
        });
    }

    // Chandra Mangala
    if (planetSigns['moon'] === planetSigns['mars']) {
        yogas.push({
            name: "Chandra Mangala Yoga",
            description: "Moon and Mars together indicate wealth through enterprise.",
            strength: "Minor",
            category: "Wealth",
            effects: ["Earnings through business", "Mechanical/engineering skills", "Strong emotions", "Entrepreneurial success"]
        });
    }

    // Kemadruma (Check basic)
    const signBefore = (planetSigns['moon'] + 11) % 12;
    const signAfter = (planetSigns['moon'] + 1) % 12;
    let hasFlank = false;
    for (const p of majorPlanets) {
        if (p === 'moon' || p === 'sun') continue;
        if (planetSigns[p] === signBefore || planetSigns[p] === signAfter) hasFlank = true;
    }

    if (!hasFlank && !KENDRA_HOUSES.includes(jupFromMoon)) {
        yogas.push({
            name: "Kemadruma Yoga (Partial)",
            description: "No planets adjacent to Moon and no benefic support.",
            strength: "Minor",
            category: "Lunar",
            effects: ["Periods of isolation", "Self-reliance needed", "Inner strength development"]
        });
    }

    return yogas;
}

/**
 * Calculate yoga strength based on planetary dignities
 */
export function calculateYogaStrength(yoga: YogaResult, planetStrengths?: Record<string, number>): number {
    let baseStrength = yoga.strength === "Major" ? 75 : 50;

    // Could be enhanced with actual planetary strength data
    if (planetStrengths) {
        // Average the strengths of involved planets
        const values = Object.values(planetStrengths);
        if (values.length > 0) {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            baseStrength = Math.min(100, baseStrength + (avg - 50) / 2);
        }
    }

    return Math.round(baseStrength);
}

/**
 * Group yogas by category for display
 */
export function groupYogasByCategory(yogas: YogaResult[]): Record<string, YogaResult[]> {
    const groups: Record<string, YogaResult[]> = {
        Mahapurusha: [],
        Raja: [],
        Lunar: [],
        Wealth: [],
        Special: []
    };

    for (const yoga of yogas) {
        if (groups[yoga.category]) {
            groups[yoga.category].push(yoga);
        }
    }

    return groups;
}
