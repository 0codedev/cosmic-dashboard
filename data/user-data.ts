import { AstrologyUserData } from "../types/astrology";

/**
 * SUDHANSHU_DATA
 * Complete Cosmic Operating System Dataset
 * Sources: Rao_Protocol_Ultimate, Cosmic_Alchemy_Guide, Life_Report_Task1
 */
export const SUDHANSHU_DATA: AstrologyUserData = {
    // Basic Details (From Rao_Protocol_Ultimate 1.1)
    name: "Sudhanshu Gaddam",
    dob: "14/10/2005",
    tob: "15:33:33",
    pob: "Hyderabad",
    sex: "Male",
    dayOfBirth: "Friday",
    latitude: "17:22: N",
    longitude: "78:28: E",

    // Astrological Details (From Rao_Protocol_Ultimate 1.1 & 1.3)
    lagna: "Aquarius",
    lagnaLord: "Saturn",
    moonSign: "Aquarius",
    moonSignLord: "Saturn",
    nakshatra: "Shatabhisha",
    nakshatraLord: "Rahu",
    sunSign: "Virgo",
    tithi: "Dvadasi",
    yoga: "Ganda",
    karan: "Baalav",
    paya: "Copper",
    varna: "Sudra",
    yoni: "Ashva",
    gana: "Rakshas",
    nadi: "Adi",

    // Advanced Metrics (From Rao_Protocol_Ultimate 1.2)
    planetaryPositions: {
        sun: {
            sign: "Virgo",
            house: "8th",
            degree: "27° 13' 56\"",
            nakshatra: "Chitra",
            pada: 2,
            lord: "Mars",
            description: "Neutral - AmK (Career)",
            absoluteLongitude: 177.23
        },
        moon: {
            sign: "Aquarius",
            house: "1st",
            degree: "15° 43' 40\"",
            nakshatra: "Shatabhisha",
            pada: 3,
            lord: "Rahu",
            description: "Neutral - MK (Emotional)",
            absoluteLongitude: 315.72
        },
        mars: {
            sign: "Aries",
            house: "3rd",
            degree: "28° 15' 02\"",
            nakshatra: "Krittika",
            pada: 1,
            lord: "Sun",
            description: "Retrograde - AK (Soul)",
            retrograde: true,
            absoluteLongitude: 28.25
        },
        mercury: {
            sign: "Libra",
            house: "9th",
            degree: "14° 38' 23\"",
            nakshatra: "Swati",
            pada: 3,
            lord: "Rahu",
            description: "Friendly - PK (Intellect) - YOGI",
            absoluteLongitude: 194.63
        },
        jupiter: {
            sign: "Libra",
            house: "9th",
            degree: "03° 32' 34\"",
            nakshatra: "Chitra",
            pada: 4,
            lord: "Mars",
            description: "Enemy - DK (Partner)",
            absoluteLongitude: 183.54
        },
        venus: {
            sign: "Scorpio",
            house: "10th",
            degree: "13° 05' 43\"",
            nakshatra: "Anuradha",
            pada: 3,
            lord: "Saturn",
            description: "Neutral - GK (Rivals) - DUPLICATE YOGI",
            absoluteLongitude: 223.09
        },
        saturn: {
            sign: "Cancer",
            house: "6th",
            degree: "15° 59' 49\"",
            nakshatra: "Pashyami",
            pada: 4,
            lord: "Saturn",
            description: "Enemy - BK (Guru)",
            absoluteLongitude: 105.99
        },
        rahu: {
            sign: "Pisces",
            house: "2nd",
            degree: "19° 12' 55\"",
            nakshatra: "Revati",
            pada: 1,
            lord: "Mercury",
            description: "Retrograde",
            retrograde: true,
            absoluteLongitude: 349.21
        },
        ketu: {
            sign: "Virgo",
            house: "8th",
            degree: "19° 12' 55\"",
            nakshatra: "Hasta",
            pada: 3,
            lord: "Moon",
            description: "Retrograde",
            retrograde: true,
            absoluteLongitude: 169.21
        }
    },

    jaiminiKarakas: [
        { planet: "mars", degree: "28° 15'", role: "AK", description: "Atmakaraka - Soul's mission (Courage/Battle)" },
        { planet: "sun", degree: "27° 13'", role: "AmK", description: "Amatyakaraka - Career and profession (Authority/Research)" },
        { planet: "saturn", degree: "15° 59'", role: "BK", description: "Bhratrukaraka - Guru and siblings (Discipline)" },
        { planet: "moon", degree: "15° 43'", role: "MK", description: "Matrukaraka - Emotional foundation" },
        { planet: "mercury", degree: "14° 38'", role: "PK", description: "Putrakaraka - Intelligence and children (YOGI)" },
        { planet: "venus", degree: "13° 05'", role: "GK", description: "Gnatikaraka - Rivals and obstacles" },
        { planet: "jupiter", degree: "03° 32'", role: "DK", description: "Darakaraka - Spouse and partnerships" }
    ],

    shadbala: [
        { planet: "mercury", value: 461.77, ratio: 1.10, rank: 1, rupa: 7.70 },
        { planet: "moon", value: 409.93, ratio: 1.14, rank: 2, rupa: 6.83 },
        { planet: "sun", value: 389.20, ratio: 1.30, rank: 3, rupa: 6.49 },
        { planet: "venus", value: 371.60, ratio: 1.13, rank: 4, rupa: 6.19 },
        { planet: "jupiter", value: 348.92, ratio: 0.89, rank: 5, rupa: 5.82 },
        { planet: "saturn", value: 322.40, ratio: 1.07, rank: 6, rupa: 5.37 },
        { planet: "mars", value: 301.90, ratio: 1.01, rank: 7, rupa: 5.03 }
    ],

    bhavabala: [
        { house: "5th", value: 9.55, rank: 1 },
        { house: "6th", value: 7.84, rank: 2 },
        { house: "4th", value: 7.79, rank: 3 },
        { house: "10th", value: 5.40, rank: 12 }
    ],

    ashtakvarga: {
        1: 33, 2: 30, 3: 30, 4: 29, 5: 23, 6: 38, 7: 27, 8: 27, 9: 23, 10: 24, 11: 33, 12: 20
    },

    binnashtakvarga: {
        sun: [6, 5, 3, 6, 3, 2, 4, 3, 5, 3, 4, 4],
        moon: [5, 5, 2, 6, 5, 4, 2, 4, 5, 4, 5, 2],
        mars: [5, 2, 2, 6, 2, 2, 3, 3, 3, 3, 5, 3],
        mercury: [2, 6, 2, 7, 4, 5, 3, 4, 5, 4, 6, 6],
        jupiter: [4, 4, 5, 6, 5, 3, 6, 6, 6, 3, 3, 5],
        venus: [4, 4, 6, 3, 5, 5, 3, 2, 5, 2, 7, 6],
        saturn: [4, 3, 3, 4, 3, 6, 2, 2, 4, 1, 3, 4]
    },

    kpCuspalMatrix: [
        { house: 1, degree: "314° 12' 04\"", signLord: "Saturn", nakshatraLord: "Rahu", subLord: "Mercury", subSubLord: "Saturn" },
        { house: 2, degree: "350° 57' 00\"", signLord: "Jupiter", nakshatraLord: "Mercury", subLord: "Venus", subSubLord: "Saturn" },
        { house: 3, degree: "022° 49' 53\"", signLord: "Mars", nakshatraLord: "Venus", subLord: "Saturn", subSubLord: "Venus" },
        { house: 4, degree: "049° 55' 37\"", signLord: "Venus", nakshatraLord: "Moon", subLord: "Ketu", subSubLord: "Moon" },
        { house: 5, degree: "075° 11' 49\"", signLord: "Mercury", nakshatraLord: "Rahu", subLord: "Ketu", subSubLord: "Mercury" },
        { house: 6, degree: "102° 06' 26\"", signLord: "Moon", nakshatraLord: "Saturn", subLord: "Moon", subSubLord: "Sun" },
        { house: 7, degree: "134° 12' 04\"", signLord: "Sun", nakshatraLord: "Venus", subLord: "Venus", subSubLord: "Rahu" },
        { house: 8, degree: "170° 57' 00\"", signLord: "Mercury", nakshatraLord: "Moon", subLord: "Venus", subSubLord: "Moon" },
        { house: 9, degree: "202° 49' 53\"", signLord: "Venus", nakshatraLord: "Jupiter", subLord: "Saturn", subSubLord: "Venus" },
        { house: 10, degree: "229° 55' 37\"", signLord: "Mars", nakshatraLord: "Mercury", subLord: "Venus", subSubLord: "Moon" },
        { house: 11, degree: "255° 11' 49\"", signLord: "Jupiter", nakshatraLord: "Venus", subLord: "Venus", subSubLord: "Mercury" },
        { house: 12, degree: "282° 06' 26\"", signLord: "Saturn", nakshatraLord: "Moon", subLord: "Rahu", subSubLord: "Rahu" }
    ],

    navataraChakra: [
        { tier: 1, name: "Janma", nakshatras: ["Shatabhisha", "Ardra", "Swati"], lord: "Rahu", status: "Mind", description: "Birth/Mind", tradingAction: "Neutral - Normal limits" },
        { tier: 2, name: "Sampat", nakshatras: ["Purva Bhadrapada", "Punarvasu", "Vishakha"], lord: "Jupiter", status: "Wealth", description: "Wealth/Assets", tradingAction: "Green - Opportunity window" },
        { tier: 3, name: "Vipat", nakshatras: ["Uttara Bhadrapada", "Pushya", "Anuradha"], lord: "Saturn", status: "Danger", description: "Danger/Loss", tradingAction: "Yellow - CAUTION, reduce size" },
        { tier: 4, name: "Kshema", nakshatras: ["Revati", "Ashlesha", "Jyeshtha"], lord: "Mercury", status: "Prosperity", description: "Prosperity/Safety", tradingAction: "Green - PRIME wealth window" },
        { tier: 5, name: "Pratyari", nakshatras: ["Ashwini", "Magha", "Mula"], lord: "Ketu", status: "Obstacles", description: "Obstacles/Enemies", tradingAction: "Yellow - Obstacles likely" },
        { tier: 6, name: "Sadhaka", nakshatras: ["Bharani", "Purva Phalguni", "Purva Ashadha"], lord: "Venus", status: "Success", description: "Achievement/Success", tradingAction: "Green - High probability success" },
        { tier: 7, name: "Naidhana", nakshatras: ["Krittika", "Uttara Phalguni", "Uttara Ashadha"], lord: "Sun", status: "Destruction", description: "Destruction/Transformation", tradingAction: "Red - DANGER, NO TRADE" },
        { tier: 8, name: "Mitra", nakshatras: ["Rohini", "Hasta", "Shravana"], lord: "Moon", status: "Friend", description: "Friendship/Support", tradingAction: "Green - Supportive window" },
        { tier: 9, name: "Ati-Mitra", nakshatras: ["Mrigashira", "Chitra", "Dhanishta"], lord: "Mars", status: "Allies", description: "Deep Allies", tradingAction: "Green - Power window" }
    ],

    divisionalCharts: [
        { varga: "D1", lagna: 11, positions: { sun: 6, moon: 11, mars: 1, mercury: 7, jupiter: 7, venus: 8, saturn: 4, rahu: 12, ketu: 6 } },
        { varga: "D9", lagna: 11, positions: { sun: 6, moon: 11, mars: 9, mercury: 11, jupiter: 8, venus: 7, saturn: 8, rahu: 9, ketu: 3 } },
        { varga: "D10", lagna: 3, positions: { sun: 11, moon: 4, mars: 10, mercury: 11, jupiter: 8, venus: 8, saturn: 5, rahu: 2, ketu: 8 } }
    ],

    avasthas: {
        sun: ["Jaagrat (Awake)", "Bala (Infant)"],
        moon: ["Swapna (Dreaming)", "Yuva (Youth)"],
        mars: ["Susupta (Sleeping)", "Mrat (Dead)"],
        mercury: ["Swapna (Dreaming)", "Yuva (Youth)"],
        jupiter: ["Jaagrat (Awake)", "Bala (Infant)"],
        venus: ["Swapna (Dreaming)", "Yuva (Youth)"],
        saturn: ["Swapna (Dreaming)", "Yuva (Youth)"]
    },

    yogi: "mercury",
    avayogi: "mars",
    duplicateYogi: "venus",

    dashaSystem: {
        vimshottari: {
            mahadashas: [
                { lord: "rahu", start: "14/10/2005", end: "21/07/2011" },
                { lord: "jupiter", start: "21/07/2011", end: "21/07/2027" },
                { lord: "saturn", start: "21/07/2027", end: "21/07/2046" },
                { lord: "mercury", start: "21/07/2046", end: "21/07/2063" }
            ],
            antardashas: [
                { lord: "venus", start: "21/03/2020", end: "21/11/2022" },
                { lord: "sun", start: "21/11/2022", end: "09/09/2023" },
                { lord: "moon", start: "09/09/2023", end: "09/01/2025" },
                { lord: "mars", start: "09/01/2025", end: "15/12/2025" },
                { lord: "rahu", start: "15/12/2025", end: "21/07/2027", signal: "Danger", instructions: "Triple Rahu window active Dec 2025 - Apr 2026. High volatility." }
            ],
            pratyantars: [
                { lord: "rahu", start: "15/12/2025", end: "25/04/2026", signal: "Danger", instructions: "TRIPLE RAHU - Maximum caution. Compulsion peaks here." },
                { lord: "jupiter", start: "25/04/2026", end: "20/08/2026", signal: "Green", instructions: "Wisdom returns. Strategic recovery window." },
                { lord: "saturn", start: "20/08/2026", end: "06/01/2027", signal: "Yellow", instructions: "Structure and discipline required." },
                { lord: "mercury", start: "06/01/2027", end: "09/05/2027", signal: "Prime", instructions: "PEAK FORTUNE window. Yogi active." }
            ]
        },
        chara: [
            { lord: "aries", start: "14/10/2021", end: "14/10/2033" },
            { lord: "virgo", start: "14/10/2025", end: "14/10/2026", instructions: "Current AD: Career karma and deep research focus." }
        ],
        yogini: [
            { lord: "siddha", start: "30/09/2021", end: "30/09/2028" },
            { lord: "siddha", start: "24/01/2026", end: "05/05/2026", signal: "Green" }
        ],
        mudda: [
            { lord: "mercury", start: "15/10/2025", end: "05/12/2025", signal: "Prime" },
            { lord: "ketu", start: "05/12/2025", end: "27/12/2025", signal: "Yellow" },
            { lord: "venus", start: "27/12/2025", end: "25/02/2026", signal: "Prime" },
            { lord: "sun", start: "25/02/2026", end: "16/03/2026", signal: "Yellow" },
            { lord: "moon", start: "16/03/2026", end: "15/04/2026", signal: "Red" },
            { lord: "mars", start: "15/04/2026", end: "06/05/2026", signal: "Danger", instructions: "CURRENT: Avayogi active. Max 3 trades/day." },
            { lord: "rahu", start: "06/05/2026", end: "30/06/2026", signal: "Yellow" },
            { lord: "jupiter", start: "30/06/2026", end: "18/08/2026", signal: "Green" },
            { lord: "saturn", start: "18/08/2026", end: "14/10/2026", signal: "Green" }
        ]
    },

    tradingLaws: [
        { id: "law-1", name: "The Mercury Law", statement: "I only enter markets when Mercury's logic — not Mars's impulse — is speaking.", validatedBy: ["Yogi planet", "Shadbala Rank 1", "D10 Sun+Mercury"] },
        { id: "law-2", name: "The Venus Law", statement: "My wealth-building actions happen on Venus days, in Venus transits, and never when Venus is in Scorpio or Capricorn.", validatedBy: ["Yogakaraka", "Duplicate Yogi", "Wealth Sub-Lord"] },
        { id: "law-3", name: "The Ketu Law", statement: "My 5th house (speculation) opens only when I am emotionally detached from the outcome.", validatedBy: ["H5 Sub-Lord Ketu", "D9 Mars+Rahu", "Mrat Avastha Mars"] },
        { id: "law-4", name: "The Saturn Law", statement: "My discipline is encoded in the app. I do not rely on in-the-moment willpower — I obey the system.", validatedBy: ["Saturn weak natural discipline", "Vimala Yoga", "Pashyami energy"] },
        { id: "law-5", name: "The Mars Law", statement: "On Tuesdays, during Mars Mudda, and when Mars is active, I reduce trade count by 50% minimum.", validatedBy: ["Avayogi", "Shadbala Rank 7", "Naidhana natal nakshatra"] }
    ],

    masterChecklist: [
        "CALENDAR: Check Moon Nakshatra (Naidhana/Vipat = NO TRADE)",
        "TRANSIT: Check Mercury/Venus strength (Score <= 3 = Reduce size)",
        "SYSTEM: Check Circuit Breaker & Trade Count limits",
        "SETUP: Write rationale in 2 sentences. 3+ confluences required.",
        "COMMIT: Set Stop Loss BEFORE entry. Log mood immediately."
    ],

    circuitBreakerActive: false,
    dailyTradeLimit: 3, // Current limit due to Mars Mudda

    careerTiers: [
        { tier: "Tier 1 — Highest Alignment", fields: ["Algorithmic Trading & Quantitative Finance", "Technology Product Building (Founder)", "AI-ML Research"], alignment: "All systems agree (Yogi Mercury, D10 Exalted Mars, 5th House Strength)" },
        { tier: "Tier 2 — Strong Alignment", fields: ["Financial Research / Equity Analysis", "Materials Informatics (NIT Bridge)", "Knowledge Products"], alignment: "Strong (Dhana Yoga, AmK Sun in 8th)" }
    ],

    financialTimeline: [
        { age: "20–22", period: "Jup-Rah AD", phase: "Turbulent Learning", target: "Protect capital, build systems" },
        { age: "22–25", period: "Sat-Sat AD", phase: "Foundation Building", target: "First professional income, SIPs" },
        { age: "25–28", period: "Sat-Mer AD", phase: "Peak Intelligence-Wealth", target: "Breakthrough returns, ₹50L milestone" },
        { age: "31–34", period: "Sat-Ven AD", phase: "Major Wealth Milestone", target: "Peak recognition, ₹1-5Cr milestone" }
    ],

    healthProtocol: {
        constitution: "Vata-Pitta (Air-Fire) with strong mind-body feedback loop.",
        vulnerabilities: [
            { zone: "Nervous System", rules: "Aquarius/Rahu", risk: "High", description: "Anxiety, mental exhaustion, overthinking" },
            { zone: "Digestive/Gut", rules: "Ketu/Virgo", risk: "High", description: "IBS tendencies, stress-linked distress" },
            { zone: "Sleep", rules: "Rahu/12th", risk: "High", description: "Insomnia, vivid active dreams" }
        ],
        dailyMinimum: [
            "7-8 hours fixed sleep",
            "20 min morning walk",
            "No phone for 30 mins after waking",
            "5 min journaling"
        ],
        diet: ["Warm cooked foods", "Avoid cold/raw when stressed", "Ghee, turmeric, ginger"],
        movement: ["Moderate activity > intense bursts", "Swimming", "Yoga/Pranayama"]
    },

    remedies: {
        gemstones: [
            { planet: "venus", gemstone: "Diamond", metal: "Gold", finger: "Ring", type: "Primary", reason: "Activates Yogakaraka and Wealth Lord" },
            { planet: "mercury", gemstone: "Emerald", metal: "Gold", finger: "Little", type: "Primary", reason: "Activates Yogi and 5th Lord" },
            { planet: "saturn", gemstone: "Blue Sapphire", metal: "None", finger: "None", type: "Avoid", reason: "Saturn in 6th - amplifies enemies/debts" }
        ],
        rudraksha: [
            { type: "8 Mukhi", purpose: "Master Rahu's energy (Shatabhisha)" },
            { type: "3 Mukhi", purpose: "Ignite Mars (AK logic/courage)" }
        ],
        mantras: [
            { deity: "Ganesha", mantra: "Om Vakratundaya Hum", purpose: "Primary focus / Ishtdev" },
            { deity: "Vishnu", mantra: "Vishnu Sahasranamam", purpose: "Mercury-Jupiter yoga activation" }
        ]
    },

    identityAnchor: "I am an Aquarian Architect (Saturn-Rahu). I move from the shadow of impulse to the structure of architecture. I trade the system, not the hope.",
    age: 20,
    currentYear: 2026,

    // --- Backward Compatibility / UI Data ---
    sadeSati: [
        { phase: "Peak", period: "2023-2025", status: "current", effects: "Intense pressure, restructuring of self-image and career foundations." }
    ],
    annualForecast: {
        year: 2026,
        muntha: { house: "5th House", effect: "Focus on Intellect (Buddhi), Education, and Creative projects." },
        yearLord: "Mercury",
        summary: "A 'Hinge Year' shifting from the clouded identity of Rahu in Lagna to structured reality.",
        quarterly: [
            { period: "Q1", theme: "Intellectual Spark", strategy: "Plan silently." },
            { period: "Q2", theme: "Academic Offensive", strategy: "Launch projects." },
            { period: "Q3", theme: "Consolidation", strategy: "Review finances." },
            { period: "Q4", theme: "Transformation", strategy: "New 9-year cycle begins." }
        ],
        remedies: ["Service to laborers", "Vishnu Sahasranamam"]
    },
    strategicProtocol: {
        currentPhase: "Hinge Year (Jupiter -> Saturn Prep)",
        primaryLaw: "System over Willpower",
        tuesdayLaw: "Mars-Rahu Lock: Maximum 5 trades/actions on Tuesdays.",
        mercuryLaw: "Intelligence Over Impulse: Mandatory written thesis for every critical move.",
        financialLadder: [
            { age: 18, netWorth: "₹5-20L", focus: "Foundation & Skills" },
            { age: 23, netWorth: "₹20-50L", focus: "Dharma Alignment" },
            { age: 30, netWorth: "₹50L-1.5Cr", focus: "Algorithmic Dominance" },
            { age: 39, netWorth: "₹3Cr+", focus: "Legacy Wealth" },
        ]
    },
    lifePredictions: {
        education: "Strong academic background from NIT. Focus on quantitative and architectural sciences.",
        family: "Supportive foundation, though your path requires independence and non-traditional moves.",
        marriage: "Delayed or structured marriage. Partner likely shares intellectual or technical interests.",
        finance: "Wealth through systems (Venus-Saturn). Legacy wealth ₹3Cr+ achievable through discipline.",
        career: "Tier 1: Algorithmic Trading & Quant Finance. Success through architecture over willpower.",
        health: "Vata constitution. High risk of sleep and nerve-related issues due to active mind.",
        spirituality: "Moksha path through knowledge. Jupiter-Saturn phase brings deep philosophical shifts."
    },
    lifePathNumber: "7",
    currentMahadasha: "Jupiter",
    numerology: {
        lifePathNumber: "7",
        insights: {}
    }
};

/**
 * Get a user's current age dynamically
 */
export function getUserAge(birthYear: number = 2005): number {
    return new Date().getFullYear() - birthYear;
}

/**
 * Get Jupiter Mahadasha progress percentage
 */
export function getJupiterMahadashaProgress(startYear: number = 2011, duration: number = 16): number {
    const yearsElapsed = new Date().getFullYear() - startYear;
    return Math.min(100, Math.max(0, (yearsElapsed / duration) * 100));
}
