import { calculateTransits } from './transit-engine';

// Helper: Normalize 0-360
const normalize = (deg: number) => (deg % 360 + 360) % 360;

export const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
    "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
    "Trayodashi", "Chaturdashi", "Purnima", "Pratipada", "Dwitiya", "Tritiya",
    "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami",
    "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

export const YOGAS = [
    "Vishkumbha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
    "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
    "Brahma", "Indra", "Vaidhriti"
];

export type ActivityType = 'marriage' | 'business' | 'travel' | 'property';

export const ACTIVITY_RULES = {
    marriage: {
        favorableNakshatras: ["Rohini", "Mrigashira", "Magha", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mula", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
        favorableTithis: [2, 3, 5, 7, 10, 11, 13],
        avoidWeekdays: [2, 6], // Tue, Sat
        avoidYogas: ["Vyatipata", "Vaidhriti"]
    },
    business: {
        favorableNakshatras: ["Ashwini", "Pushya", "Chitra", "Revati", "Anuradha", "Hasta", "Shravana"],
        favorableTithis: [2, 3, 5, 7, 10, 11, 13],
        avoidWeekdays: [2], // Tue
        avoidYogas: ["Vyatipata", "Vaidhriti"]
    },
    travel: {
        favorableNakshatras: ["Ashwini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Anuradha", "Shravana", "Dhanishta", "Revati"],
        favorableTithis: [2, 3, 5, 7, 10, 11, 13],
        avoidWeekdays: [2],
        avoidYogas: ["Shula", "Vyatipata", "Vaidhriti"]
    },
    property: {
        favorableNakshatras: ["Mrigashira", "Punarvasu", "Ashlesha", "Magha", "Purva Phalguni", "Visakha", "Mula", "Revati"],
        favorableTithis: [2, 5, 7, 10, 11, 13],
        avoidWeekdays: [0, 2], // Sun, Tue
        avoidYogas: ["Vyatipata", "Vaidhriti"]
    }
};

export interface MuhurtaFactors {
    tithi: string;
    tithiIndex: number;
    nakshatra: string;
    yoga: string;
    weekday: string;
    taraBala: string;
}

export interface MuhurtaResult {
    date: Date;
    score: number;
    rating: 'Excellent' | 'Good' | 'Average' | 'Avoid';
    factors: MuhurtaFactors;
    analysis: string[];
}

// Tara Bala Types
const TARA_TYPES = [
    "Janma (Danger/Body)",
    "Sampat (Wealth)",
    "Vipat (Danger)",
    "Kshema (Well-being)",
    "Pratyak (Obstacles)",
    "Sadhana (Achievement)",
    "Naidhana (Danger/Death)",
    "Mitra (Friend)",
    "Param Mitra (Best Friend)"
];

// 0-indexed Tara Strength (0=Janma...8=Param Mitra)
// Good: 1, 3, 5, 7, 8
// Bad: 0, 2, 4, 6
const TARA_SCORES = [0, 10, -10, 10, -5, 10, -20, 10, 10];

export function calculateTaraBala(dayNakshatra: string, userNakshatra: string): { type: string, score: number } {
    const dayIndex = NAKSHATRAS.indexOf(dayNakshatra);
    const userIndex = NAKSHATRAS.indexOf(userNakshatra);

    if (dayIndex === -1 || userIndex === -1) return { type: "Unknown", score: 0 };

    // Calculate distance from user nakshatra to day nakshatra
    const dist = (dayIndex - userIndex + 27) % 27;
    const typeIndex = dist % 9;

    return {
        type: TARA_TYPES[typeIndex],
        score: TARA_SCORES[typeIndex]
    };
}

export function checkPanchang(date: Date): MuhurtaFactors {
    // 1. Calculate Positions (using Transit Engine)
    // Warning: Transit Engine uses simplified 2024 Epoch. Error margin exists.
    const positions = calculateTransits(date);
    const sunLon = positions['Sun'].longitude;
    const moonLon = positions['Moon'].longitude;

    // 2. Tithi Calculation
    // Tithi = (Moon - Sun) / 12
    const angle = normalize(moonLon - sunLon);
    const tithiNum = Math.floor(angle / 12) + 1; // 1-30
    const tithiIndex = tithiNum - 1;

    // 3. Nakshatra Calculation
    // Moon Longitude / 13.3333
    const nakshatraIndex = Math.floor(moonLon / 13.333333);
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    // 4. Yoga Calculation (Nithya Yoga)
    // (Sun + Moon) / 13.3333
    const sumLon = normalize(sunLon + moonLon);
    const yogaIndex = Math.floor(sumLon / 13.333333);
    const yoga = YOGAS[yogaIndex];

    // 5. Weekday
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[date.getDay()];

    return {
        tithi: TITHIS[tithiIndex] || `Tithi ${tithiNum}`,
        tithiIndex: tithiNum,
        nakshatra,
        yoga,
        weekday,
        taraBala: "Calculated with User Data"
    };
}

export function rateMuhurta(activity: ActivityType, date: Date, userNakshatra: string): MuhurtaResult {
    const panchang = checkPanchang(date);
    const userTara = calculateTaraBala(panchang.nakshatra, userNakshatra);

    // Enrich Factors
    panchang.taraBala = userTara.type;

    let score = 50; // Base score
    const analysis: string[] = [];
    const rules = ACTIVITY_RULES[activity];

    // 1. Weekday Check
    if (rules.avoidWeekdays.includes(date.getDay())) {
        score -= 20;
        analysis.push(`Avoid: ${panchang.weekday} is generally not suitable for ${activity}.`);
    } else {
        score += 5;
    }

    // 2. Tithi Check
    // Get Tithi Number (1-30). Convert 16-30 to 1-15 (Krishna) for matching Rule array? 
    // Usually rules specify "2, 3, 5..." which applies to both Shukla and Krishna unless specified.
    // However, Rikta tithis (4, 9, 14) are bad in both.
    // Our Tithi Index is 1-30.
    const tithiVal = panchang.tithiIndex > 15 ? panchang.tithiIndex - 15 : panchang.tithiIndex;

    // Check Amavasya (30) -> Bad
    if (panchang.tithiIndex === 30) {
        score -= 30;
        analysis.push("Avoid: Amavasya (New Moon) is generally inauspicious.");
    } else if (rules.favorableTithis.includes(tithiVal)) {
        score += 15;
        analysis.push(`Good: ${panchang.tithi} is favorable.`);
    } else {
        // Check Rikta
        if ([4, 9, 14].includes(tithiVal)) {
            score -= 15;
            analysis.push(`Avoid: ${panchang.tithi} is a Rikta (Empty) Tithi.`);
        }
    }

    // 3. Nakshatra Check
    if (rules.favorableNakshatras.includes(panchang.nakshatra)) {
        score += 20;
        analysis.push(`Excellent: ${panchang.nakshatra} is highly recommended for ${activity}.`);
    } else {
        score -= 5;
    }

    // 4. Yoga Check
    if (rules.avoidYogas.includes(panchang.yoga)) {
        score -= 20;
        analysis.push(`Avoid: ${panchang.yoga} Yoga is inauspicious.`);
    }

    // 5. Tara Bala Check (User Specific)
    if (userTara.score < 0) {
        score += userTara.score; // Subtracts
        analysis.push(`Personal: Your Tara Bala is ${userTara.type} (Inauspicious).`);
    } else {
        score += userTara.score;
        analysis.push(`Personal: Your Tara Bala is ${userTara.type} (Auspicious).`);
    }

    // Rating
    let rating: MuhurtaResult['rating'] = 'Average';
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score < 40) rating = 'Avoid';

    return {
        date,
        score: Math.max(0, Math.min(100, score)),
        rating,
        factors: panchang,
        analysis
    };
}

export function findNextAuspiciousDates(
    activity: ActivityType,
    startDate: Date,
    daysToCheck: number,
    userNakshatra: string
): MuhurtaResult[] {
    const results: MuhurtaResult[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < daysToCheck; i++) {
        // Clone date
        const date = new Date(current);
        const result = rateMuhurta(activity, date, userNakshatra);

        if (result.score >= 60) {
            results.push(result);
        }

        // Next Day
        current.setDate(current.getDate() + 1);
    }

    // Sort by score desc
    return results.sort((a, b) => b.score - a.score);
}
