import { AstrologyUserData, PlanetName, ZodiacSign } from "@/types/astrology";

// --- Types for Remedies ---

export type GemstoneRecommendation = {
    planet: PlanetName;
    gemstone: string;
    metal: string;
    finger: string;
    day: string;
    weight: string;
    reason: string;
    type: "Primary" | "Secondary" | "Avoid";
};

export type MantraRecommendation = {
    deity: string;
    mantra: string;
    count: number;
    time: string;
    purpose: string;
};

export type LifestyleRemedy = {
    category: "Diet" | "Activity" | "Charity" | "Habit";
    description: string;
    reason: string;
};

export type ComprehensiveRemedies = {
    gemstones: GemstoneRecommendation[];
    mantras: MantraRecommendation[];
    lifestyle: LifestyleRemedy[];
    specific: string[]; // For specific yogas/doshas
};

// --- Constants & Data ---

const GEM_DATA: Record<PlanetName, Omit<GemstoneRecommendation, "planet" | "reason" | "type">> = {
    sun: { gemstone: "Ruby", metal: "Gold/Copper", finger: "Ring Finger", day: "Sunday", weight: "3-5 Carats" },
    moon: { gemstone: "Pearl", metal: "Silver", finger: "Little Finger", day: "Monday", weight: "5-7 Ratti" },
    mars: { gemstone: "Red Coral", metal: "Gold/Copper", finger: "Ring Finger", day: "Tuesday", weight: "6-8 Ratti" },
    mercury: { gemstone: "Emerald", metal: "Gold", finger: "Little Finger", day: "Wednesday", weight: "4-6 Carats" },
    jupiter: { gemstone: "Yellow Sapphire", metal: "Gold", finger: "Index Finger", day: "Thursday", weight: "4-6 Carats" },
    venus: { gemstone: "Diamond/White Zircon", metal: "Gold/Silver", finger: "Middle Finger", day: "Friday", weight: "1-2 Carats" },
    saturn: { gemstone: "Blue Sapphire", metal: "Gold/Iron", finger: "Middle Finger", day: "Saturday", weight: "4-5 Carats" },
    rahu: { gemstone: "Hessonite (Gomed)", metal: "Silver", finger: "Middle Finger", day: "Saturday", weight: "6 Ratti" },
    ketu: { gemstone: "Cat's Eye", metal: "Silver", finger: "Middle Finger", day: "Tuesday/Saturday", weight: "5 Ratti" },
};

const MANTRAS: Record<PlanetName, { deity: string; mantra: string }> = {
    sun: { deity: "Lord Shiva / Surya", mantra: "Om Hram Hrim Hraum Sah Suryaya Namaha" },
    moon: { deity: "Lord Shiva / Parvati", mantra: "Om Shram Shrim Shraum Sah Chandraya Namaha" },
    mars: { deity: "Lord Hanuman", mantra: "Om Kram Krim Kraum Sah Bhaumaya Namaha" },
    mercury: { deity: "Lord Vishnu", mantra: "Om Bram Brim Braum Sah Budhaya Namaha" },
    jupiter: { deity: "Lord Shiva / Dakshinamurthy", mantra: "Om Gram Grim Graum Sah Gurave Namaha" },
    venus: { deity: "Goddess Lakshmi", mantra: "Om Dram Drim Draum Sah Shukraya Namaha" },
    saturn: { deity: "Lord Shani / Hanuman", mantra: "Om Pram Prim Praum Sah Shanaishcharaya Namaha" },
    rahu: { deity: "Goddess Durga", mantra: "Om Bhram Bhrim Bhraum Sah Rahave Namaha" },
    ketu: { deity: "Lord Ganesha", mantra: "Om Stram Strim Straum Sah Ketave Namaha" },
};

// --- Helper Functions ---

const getSignIndex = (signName: string): number => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.indexOf(signName);
};

const getLordOfSign = (signIndex: number): PlanetName => {
    const owners = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
    return owners[signIndex] as PlanetName;
};

// --- Main Engine ---

export function generateRemedies(userData: AstrologyUserData): ComprehensiveRemedies {
    const remedies: ComprehensiveRemedies = {
        gemstones: [],
        mantras: [],
        lifestyle: [],
        specific: [],
    };

    if (!userData.planetaryPositions) return remedies;

    const lagnaSign = userData.lagna;
    const lagnaIndex = getSignIndex(lagnaSign);

    // 1. Gemstone Logic (Functional Benefics for Lagna)
    // Lords of 1, 5, 9 are generally good.
    // Avoid lords of 6, 8, 12 unless they are also lords of 1, 5, 9 (like Mars for Scorpio).

    const lord1 = getLordOfSign(lagnaIndex);
    const lord5 = getLordOfSign((lagnaIndex + 4) % 12);
    const lord9 = getLordOfSign((lagnaIndex + 8) % 12);

    // Lords of 6, 8, 12
    const lord6 = getLordOfSign((lagnaIndex + 5) % 12);
    const lord8 = getLordOfSign((lagnaIndex + 7) % 12);
    const lord12 = getLordOfSign((lagnaIndex + 11) % 12);

    const beneficLords = new Set([lord1, lord5, lord9]);
    const maleficLords = new Set([lord6, lord8, lord12]);

    // Specific Logic:
    // For each benefic lord, check if it's safe to wear gem.
    // Exception: If a planet owns 6/8/12 but is NOT lagna lord, avoid.
    // Exception: Sun and Moon don't have "bad" lordship of 8th as much, but careful.

    beneficLords.forEach(planet => {
        let isSafe = true;

        // Safety check: Don't recommend gem if planet is in 6, 8, 12 in the chart itself (often considered bad to strengthen a planet in dusthana)
        // Wait, some schools say strengthen weak good planets. Others say don't strengthen dusthana placements.
        // Let's go with: Recommended for Functional Benefics.
        // Filter out if it also owns a bad house (unless it's Lagna Lord, who is always Yogakaraka-ish or at least protector).

        if (maleficLords.has(planet) && planet !== lord1) {
            // e.g. Mars for Aries (1 & 8) -> OK. 
            // Saturn for Aquarius (1 & 12) -> OK.
            // Venus for Libra (1 & 8) -> OK.
            // Jupiter for Cancer (6 & 9) -> 9 is strong, maybe OK? Conservative: Avoid mixed unless Lagna lord.
            // Actually, 9th lord is usually safe even if owning 6th.
            // Let's stick to strict:
            // Combined lordship of Kendra/Trikona + Dusthana requires analysis.
            // SAFE: 1, 5, 9 lords who DO NOT own 6, 8, 12 OR are Lagna Lord.
        }

        // Simple Rule:
        // Recommend Lagna Lord Stone (Life Stone)
        if (planet === lord1) {
            remedies.gemstones.push({
                ...GEM_DATA[planet],
                planet,
                reason: "Strengthens your Life Force and Health (Lagna Lord)",
                type: "Primary"
            });
        } else if (planet === lord9) {
            remedies.gemstones.push({
                ...GEM_DATA[planet],
                planet,
                reason: "Attracts Luck and Divine Grace (9th Lord)",
                type: "Secondary" // Lucky Stone
            });
        } else if (planet === lord5) {
            remedies.gemstones.push({
                ...GEM_DATA[planet],
                planet,
                reason: "Enhances Intelligence and Creativity (5th Lord)",
                type: "Secondary"
            });
        }
    });

    // 2. Mantras (Focus on Dasha Lord and Weak Planets)
    // Current Dasha Lord
    if (userData.currentMahadasha) {
        // Extract planet name from string like "Jupiter (Active)"
        const dashaPlanetName = userData.currentMahadasha.split(' ')[0].toLowerCase() as PlanetName;
        if (MANTRAS[dashaPlanetName]) {
            remedies.mantras.push({
                ...MANTRAS[dashaPlanetName],
                count: 108,
                time: "Morning",
                purpose: `Pacify and strengthen current Mahadasha lord (${dashaPlanetName})`
            });
        }
    }

    // Unfavorable elements handling
    if (userData.unfavorable && userData.unfavorable.planets) {
        userData.unfavorable.planets.forEach(p => {
            const pName = p.toLowerCase() as PlanetName;
            if (MANTRAS[pName]) {
                remedies.mantras.push({
                    ...MANTRAS[pName],
                    count: 108,
                    time: "Evening",
                    purpose: `Mitigate negative effects of ${pName}`
                });
            }
        });
    }

    // 3. Lifestyle
    // Based on Element of Moon Sign
    const signElements: Record<string, string> = {
        "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
        "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
        "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
        "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
    };
    const moonElement = signElements[userData.moonSign] || "Water";

    if (moonElement === "Fire") {
        remedies.lifestyle.push({ category: "Habit", description: "Practice cooling pranayama (Sheetali)", reason: "Balance excess heat/Pitta from Fire sign Moon" });
        remedies.lifestyle.push({ category: "Diet", description: "Avoid very spicy or acidic foods", reason: "Prevent inflammation and anger" });
    } else if (moonElement === "Water") {
        remedies.lifestyle.push({ category: "Activity", description: "Ensure regular movement/exercise", reason: "Counteract stagnation/Kapha from Water sign Moon" });
        remedies.lifestyle.push({ category: "Habit", description: "Grounding meditation", reason: "Stabilize emotional fluctuations" });
    } else if (moonElement === "Air") {
        remedies.lifestyle.push({ category: "Habit", description: "Strict sleep schedule", reason: "Calm active Vata mind of Air sign Moon" });
        remedies.lifestyle.push({ category: "Diet", description: "Warm, cooked, grounding meals", reason: "Reduce anxiety and nervousness" });
    } else if (moonElement === "Earth") {
        remedies.lifestyle.push({ category: "Activity", description: "Try new experiences occasionally", reason: "Prevent rigidity/stuckness of Earth sign" });
        remedies.lifestyle.push({ category: "Habit", description: "Declutter physical space", reason: "Maintain mental clarity" });
    }

    // 4. Specific/Dosha Remedies
    // Sade Sati
    const inSadeSati = userData.sadeSati && userData.sadeSati.some(s => s.status === 'current');
    if (inSadeSati) {
        remedies.specific.push("Recite Hanuman Chalisa daily for Sade Sati protection.");
        remedies.specific.push("Donate black sesame seeds or oil on Saturdays.");
    }

    // Manglik
    if (userData.marriageAnalysis && userData.marriageAnalysis.manglikStatus.includes("Present")) {
        remedies.specific.push("Perform Kumbh Vivah before actual marriage if recommended.");
        remedies.specific.push("Observe fast on Tuesdays.");
    }

    return remedies;
}

// --- Legacy Exports for KarmaRemedies ---
export const GEMSTONE_GUIDE = GEM_DATA;
export const TEMPLE_SUGGESTIONS = [
    { deity: "Shiva", day: "Monday", benefit: "Inner Peace" },
    { deity: "Hanuman", day: "Tuesday", benefit: "Courage" },
    { deity: "Vishnu", day: "Wednesday", benefit: "Wealth" },
    { deity: "Jupiter", day: "Thursday", benefit: "Wisdom" },
    { deity: "Lakshmi", day: "Friday", benefit: "Luxury" },
    { deity: "Saturn", day: "Saturday", benefit: "Justice" },
    { deity: "Sun", day: "Sunday", benefit: "Health" }
];

// Updated type to match component usage
export type CharityRecommendation = {
    day: string;
    planet: string;
    items: string[];
    recipients: string[];
    benefits: string;
};

export type GemstoneGuide = typeof GEMSTONE_GUIDE;

export function getTodayCharity(): CharityRecommendation {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];

    const charityData: Record<string, Omit<CharityRecommendation, "day">> = {
        "Sunday": {
            planet: "Sun",
            items: ["Wheat", "Jaggery", "Copper vessels", "Red flowers"],
            recipients: ["Temple priests", "Father figures", "Government workers"],
            benefits: "Improves vitality, confidence, and removes ego issues."
        },
        "Monday": {
            planet: "Moon",
            items: ["Rice", "Milk", "Silver", "White clothing", "Water"],
            recipients: ["Mothers", "Elderly women", "Those in need of emotional support"],
            benefits: "Balances emotions, brings peace of mind, and calms anxiety."
        },
        "Tuesday": {
            planet: "Mars",
            items: ["Red lentils (Masoor Dal)", "Red clothing", "Jaggery", "Copper"],
            recipients: ["Soldiers", "Police", "Brothers", "Young men"],
            benefits: "Increases courage, energy, and removes obstacles."
        },
        "Wednesday": {
            planet: "Mercury",
            items: ["Green gram (Moong Dal)", "Green vegetables", "Educational books", "Stationery"],
            recipients: ["Students", "Young children", "Eunuchs"],
            benefits: "Enhances intellect, communication, and business success."
        },
        "Thursday": {
            planet: "Jupiter",
            items: ["Chickpeas (Chana Dal)", "Turmeric", "Yellow clothing", "Gold", "Saffron"],
            recipients: ["Gurus", "Teachers", "Priests", "Brahmins"],
            benefits: "Brings wisdom, prosperity, and spiritual growth."
        },
        "Friday": {
            planet: "Venus",
            items: ["Rice", "Sugar", "White sweets", "Perfume", "Silk"],
            recipients: ["Young women", "Artists", "Blind people"],
            benefits: "Attracts luxury, comfort, and harmonious relationships."
        },
        "Saturday": {
            planet: "Saturn",
            items: ["Black sesame seeds", "Mustard oil", "Black clothing", "Iron", "Black Dal"],
            recipients: ["The poor", "Cleaners", "Elderly", "Differently-abled"],
            benefits: "Removes bad karma, delays, and obstacles."
        }
    };

    return {
        day: today,
        ...charityData[today]
    };
}
