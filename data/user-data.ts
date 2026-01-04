// User Astrology Data - Extracted from hardcoded page.tsx
// This module contains the complete birth chart analysis data

import type { AstrologyUserData } from '@/types/astrology'

/**
 * Complete authentic data extracted from PDF birth chart report.
 * This data structure follows the AstrologyUserData interface for type safety.
 */
export const SUDHANSHU_DATA: AstrologyUserData = {
    // Basic Details (from PDF)
    name: "Sudhanshu Gaddam",
    dob: "14 October 2005",
    tob: "3:33 PM IST (15:33:33)",
    pob: "Hyderabad, Telangana, India",
    sex: "Male",
    dayOfBirth: "Friday",
    latitude: "17:22 N",
    longitude: "78:28 E",

    // Astrological Details (from PDF)
    lagna: "Aquarius (Kumbha)",
    lagnaLord: "Saturn",
    moonSign: "Aquarius",
    moonSignLord: "Saturn",
    nakshatra: "Shatabhisha Nakshatra, Pada 3",
    nakshatraLord: "Rahu",
    sunSign: "Virgo (Indian) / Libra (Western)",
    tithi: "Dvadasi",
    yoga: "Ganda",
    karan: "Baalav",

    // Detailed Planetary Positions (from PDF)
    planetaryPositions: {
        sun: {
            sign: "Virgo",
            house: "8th",
            degree: "27°13'56\"",
            nakshatra: "Chitra",
            pada: 2,
            lord: "Mercury",
            description: "Sun in 8th house indicates transformation, occult knowledge, and research abilities",
            absoluteLongitude: 177.23
        },
        moon: {
            sign: "Aquarius",
            house: "1st",
            degree: "15°43'40\"",
            nakshatra: "Shatabhisha",
            pada: 3,
            lord: "Saturn",
            description: "Moon in Lagna gives emotional expression, humanitarian nature, and healing abilities",
            absoluteLongitude: 315.73
        },
        mars: {
            sign: "Aries",
            house: "3rd",
            degree: "28°15'02\"",
            nakshatra: "Krittika",
            pada: 1,
            retrograde: true,
            lord: "Mars",
            description: "Retrograde Mars in 3rd house gives courage, communication skills, and sibling challenges",
            absoluteLongitude: 28.25
        },
        mercury: {
            sign: "Libra",
            house: "9th",
            degree: "14°38'23\"",
            nakshatra: "Swati",
            pada: 3,
            lord: "Venus",
            description: "Mercury in 9th house indicates higher learning, teaching abilities, and dharmic pursuits",
            absoluteLongitude: 194.64
        },
        jupiter: {
            sign: "Libra",
            house: "9th",
            degree: "03°32'34\"",
            nakshatra: "Chitra",
            pada: 4,
            lord: "Venus",
            description: "Jupiter in 9th house brings wisdom, spiritual growth, and guru-like qualities",
            absoluteLongitude: 183.54
        },
        venus: {
            sign: "Scorpio",
            house: "10th",
            degree: "13°05'43\"",
            nakshatra: "Anuradha",
            pada: 3,
            lord: "Mars",
            description: "Venus in 10th house indicates career in arts, healing, or luxury goods",
            absoluteLongitude: 223.10
        },
        saturn: {
            sign: "Cancer",
            house: "6th",
            degree: "15°59'49\"",
            nakshatra: "Pushya",
            pada: 4,
            lord: "Moon",
            description: "Saturn in 6th house gives ability to overcome obstacles through discipline",
            absoluteLongitude: 106.00
        },
        rahu: {
            sign: "Pisces",
            house: "2nd",
            degree: "19°12'55\"",
            nakshatra: "Revati",
            pada: 1,
            retrograde: true,
            lord: "Jupiter",
            description: "Rahu in 2nd house indicates foreign wealth and unconventional speech",
            absoluteLongitude: 349.21
        },
        ketu: {
            sign: "Virgo",
            house: "8th",
            degree: "19°12'55\"",
            nakshatra: "Hasta",
            pada: 3,
            retrograde: true,
            lord: "Mercury",
            description: "Ketu in 8th house brings mystical experiences and research abilities",
            absoluteLongitude: 169.21
        },
    },

    // Dasha Information (from PDF)
    currentMahadasha: "Jupiter (Jul 21, 2011 - Jul 21, 2027)",
    previousMahadasha: "Rahu (Birth - Jul 21, 2011)",
    upcomingMahadasha: "Saturn (Jul 21, 2027 - Jul 21, 2046)",
    nextMahadasha: "Mercury (Jul 21, 2046 - Jul 21, 2063)",
    dashaBalance: "Rahu 5 Y 9 M 6 D (at birth)",

    // Favorable & Unfavorable (from PDF)
    favorable: {
        days: ["Saturday", "Wednesday", "Friday"],
        numbers: [1, 3, 6, 7, 9],
        planets: ["Saturn", "Mercury", "Venus"],
        signs: ["Virgo", "Gemini", "Aries"],
        lagnas: ["Leo", "Scorpio", "Capricorn", "Pisces"],
        metal: "Iron",
        stone: "Blue Sapphire (after consultation)",
        colors: ["Blue", "Black", "Green"],
        gems: ["Blue Sapphire", "Emerald", "Diamond"],
    },

    unfavorable: {
        day: "Thursday",
        numbers: [5, 8],
        planets: ["Moon", "Mars", "Sun"],
        nakshatra: "Ardra",
        lagna: "Gemini",
        month: "Chaitra",
        tithi: [3, 8, 13],
        colors: ["Red", "Orange", "Yellow"],
    },

    // Health Tendencies (from PDF)
    healthTendencies: [
        "Circulation and blood-related issues due to Aquarius lagna",
        "Hypertension and heart problems from Saturn influence",
        "Nervous disorders and anxiety from Rahu-Moon combination",
        "Eye strain and vision problems after age 30",
        "Insomnia and headaches from mental overwork",
        "Digestive issues from Sun in 8th house",
        "Joint and bone problems from Saturn in Cancer",
    ],

    // Career Fields (from PDF analysis)
    careerFields: [
        { field: "Psychology and Touch Therapy", compatibility: 95, reason: "Shatabhisha nakshatra healing powers" },
        { field: "Astrology and Occult Sciences", compatibility: 90, reason: "8th house Sun-Ketu, intuitive abilities" },
        {
            field: "Medical Field - Doctor/Surgeon",
            compatibility: 85,
            reason: "Natural healing abilities, service orientation",
        },
        {
            field: "Electrical and Nuclear Physics",
            compatibility: 80,
            reason: "Aquarius technical aptitude, research mind",
        },
        { field: "Film/Television and Photography", compatibility: 75, reason: "Venus in 10th house, creative expression" },
        { field: "Teaching and Writing", compatibility: 90, reason: "Jupiter-Mercury in 9th house" },
        { field: "Pharmaceutical Work", compatibility: 70, reason: "Healing and chemistry combination" },
        { field: "Yoga Training and Spirituality", compatibility: 85, reason: "Strong spiritual inclinations" },
    ],

    // Sade Sati Periods (from PDF) - UPDATED FOR CURRENT DATE
    sadeSati: [
        {
            phase: "Rising",
            period: "Jan 24, 2020 - Apr 28, 2022",
            status: "completed",
            effects: "Initial challenges, character building",
        },
        {
            phase: "Peak",
            period: "Jan 18, 2023 - Mar 29, 2025",
            status: "completed",
            effects: "Maximum intensity, transformation completed",
        },
        {
            phase: "Setting",
            period: "Mar 30, 2025 - Jun 02, 2027",
            status: "current",
            effects: "Gradual relief, stabilization, reaping benefits",
        },
        {
            phase: "Next Cycle Rising",
            period: "Feb 25, 2049 - Feb 16, 2052",
            status: "future",
            effects: "New cycle begins",
        },
        {
            phase: "Next Cycle Peak",
            period: "Feb 25, 2052 - May 14, 2054",
            status: "future",
            effects: "Mature handling of challenges",
        },
        {
            phase: "Next Cycle Setting",
            period: "May 15, 2054 - Apr 06, 2057",
            status: "future",
            effects: "Wisdom and completion",
        },
    ],

    // Marriage Analysis (from PDF)
    marriageAnalysis: {
        manglikStatus: "No Mangal Dosha present",
        kalsarpaStatus: "Free from Kalsarpa Yoga",
        marriageTiming: "Favorable after age 24-27, avoid marriage between 24-27 years",
        spouseCharacteristics: [
            "Generous and caring nature (Venus in 10th)",
            "Will bring good fortune and respect",
            "Supportive of spiritual and career goals",
            "Likely from educated family background",
            "May have connection to foreign countries (Rahu in 2nd)",
        ],
        relationshipChallenges: [
            "Need for emotional maturity",
            "Balancing independence with partnership",
            "Communication during Sade Sati period",
        ],
    },

    // Financial Analysis (from PDF)
    financialAnalysis: {
        wealthPattern: "Architect of own fortune - self-made wealth",
        incomePhases: [
            { period: "2024-2027", range: "₹5-20 Lakhs", source: "Education completion, Jupiter Mahadasha benefits" },
            { period: "2027-2032", range: "₹20-50 Lakhs", source: "Saturn period discipline, steady growth" },
            { period: "2032-2040", range: "₹50L-1.5 Crores", source: "Peak earning period, authority positions" },
            { period: "2040-2050", range: "₹1.5-3 Crores", source: "Established practice, multiple income streams" },
            { period: "2050+", range: "₹3+ Crores", source: "Mercury period excellence, legacy wealth" },
        ],
        wealthSources: [
            "Independent professional practice",
            "Foreign connections and collaborations (Rahu in 2nd)",
            "Teaching and consulting income (Jupiter-Mercury in 9th)",
            "Healing and therapy services (Shatabhisha nakshatra)",
            "Writing and intellectual property",
        ],
    },

    // Personality Traits (from PDF)
    personalityTraits: [
        "Humanitarian nature with innovative thinking (Aquarius lagna)",
        "Strong magnetic personality and leadership qualities",
        "Truth-seeking and principled approach to life (Shatabhisha)",
        "Brave and courageous with elevated intentions",
        "Excellent memory and natural literary talent",
        "Prefers working independently rather than in teams",
        "Deep interest in politics, strategy, and social reform",
        "Soft-hearted but can be fierce when principles are challenged",
        "Natural healing abilities and intuitive powers",
        "Strong spiritual inclinations and philosophical mind",
    ],

    // Yogas Present (from detailed analysis)
    yogas: [
        {
            name: "Gajakesari Yoga",
            description: "Jupiter-Moon combination for wisdom and prosperity",
            strength: "Strong",
            effect: "Fame, wealth, and respect in society",
        },
        {
            name: "Vipreet Raj Yoga",
            description: "Success after overcoming adversities",
            strength: "Moderate",
            effect: "Turning obstacles into opportunities",
        },
        {
            name: "Budha-Aditya Yoga",
            description: "Mercury-Sun for sharp intellect",
            strength: "Weak",
            effect: "Research and analytical abilities",
        },
        {
            name: "Dhana Yoga",
            description: "Multiple wealth combinations",
            strength: "Strong",
            effect: "Self-made wealth and prosperity",
        },
        {
            name: "Raj Yoga",
            description: "9th and 10th lord conjunction",
            strength: "Excellent",
            effect: "Authority, recognition, and high status",
        },
        {
            name: "Moksha Yoga",
            description: "Spiritual liberation tendencies",
            strength: "Strong",
            effect: "Deep spiritual inclinations and wisdom",
        },
    ],

    // Life Predictions (from PDF)
    lifePredictions: {
        education: "Capable of highest qualifications, natural expertise in psychology, astrology, and healing arts",
        family: "Complete love and support from parents, possible temporary estrangement with brothers that resolves later",
        marriage: "Highly satisfying married life, spouse will be generous, caring, and bring good fortune",
        finance: "Self-made wealth with periods of abundance and scarcity, ultimate financial success through own efforts",
        career:
            "Exceptional success in teaching, healing, consulting, and advisory roles. Authority and recognition in chosen field",
        health: "Need for preventive care, especially circulation, heart, and nervous system. Good recovery abilities",
        spirituality: "Strong moksha yoga indicates spiritual evolution, likely to become a guide for others",
    },

    // Computed/Dynamic values
    age: new Date().getFullYear() - 2005,
    currentYear: new Date().getFullYear(),

    // Numerology (13/4 Karmic Debt)
    lifePathNumber: "13/4 (Karmic Debt)",
    numerologyInsights: {
        karmicDebt: "Number 13 indicates past life laziness and procrastination that must be overcome",
        foundationNumber: "Number 4 represents building, discipline, and hard work",
        challenges: ["Tendency to procrastinate", "Self-sabotage patterns", "Avoiding responsibility"],
        remedies: ["Daily discipline and structured routines", "Service to others", "Building lasting value"],
        lifePhases: [
            { phase: "Karmic Clearing (0-22)", description: "Confusion and spiritual awakening, clearing past debts" },
            { phase: "Dharma Alignment (23-30)", description: "Soulmate connections, career clarity, dharma manifestation" },
            { phase: "Success & Impact (30-38)", description: "Peak achievement period, worldly success and impact" },
            { phase: "Wisdom & Legacy (39+)", description: "Teacher role, peace, wisdom, and lasting legacy creation" },
        ],
    },
}

/**
 * Get a user's current age dynamically
 */
export function getUserAge(birthYear: number = 2005): number {
    return new Date().getFullYear() - birthYear
}

/**
 * Get Jupiter Mahadasha progress percentage
 */
export function getJupiterMahadashaProgress(startYear: number = 2011, duration: number = 16): number {
    const yearsElapsed = new Date().getFullYear() - startYear
    return Math.min(Math.round((yearsElapsed / duration) * 100), 100)
}

/**
 * Get years remaining in current Mahadasha
 */
export function getMahadashaYearsRemaining(startYear: number = 2011, duration: number = 16): number {
    const yearsElapsed = new Date().getFullYear() - startYear
    return Math.max(duration - yearsElapsed, 0)
}
