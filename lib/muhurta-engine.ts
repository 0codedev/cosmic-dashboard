
import {
    calculatePlanetaryPositions,
    normalize,
    getZodiacSign,
    getNakshatra
} from './cosmic-engine';

export type ActivityType = 'business' | 'marriage' | 'travel' | 'property';

export type MuhurtaResult = {
    date: Date;
    rating: 'Excellent' | 'Good' | 'Average' | 'Avoid';
    score: number; // 0-100
    factors: {
        tithi: string;
        nakshatra: string;
        yoga: string;
        karan: string;
        taraBala: string;
    };
    analysis: string[];
};

// --- PANCHANG UTILS ---

// Simplified calculation for Tithi (Angle between Moon and Sun / 12)
function getTithi(sunLon: number, moonLon: number) {
    const diff = normalize(moonLon - sunLon);
    const tithiIndex = Math.floor(diff / 12) + 1;
    const paksha = tithiIndex <= 15 ? 'Shukla' : 'Krishna';
    const tithiNum = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;

    const tithiNames = [
        "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
        "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
        "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
    ];

    return {
        index: tithiIndex,
        name: `${paksha} ${tithiNames[tithiNum - 1]}`
    };
}

// Logic for Yoga (Sun Lon + Moon Lon)
function getYoga(sunLon: number, moonLon: number) {
    const sum = normalize(sunLon + moonLon);
    const yogaIndex = Math.floor(sum / (360 / 27));
    const yogas = [
        "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Sobhana", "Atiganda",
        "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
        "Vyaghata", "Harshan", "Vajra", "Siddhi", "Vyatipata", "Variyan",
        "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
        "Brahma", "Indra", "Vaidhriti"
    ];
    return yogas[yogaIndex] || "Vishkumbha";
}

// --- ACTIVITY RULES ---

const RULES: Record<ActivityType, {
    goodTithis: number[],
    badTithis: number[],
    goodNakshatras: string[],
    avoidNakshatras: string[],
    goodYogas: string[],
    badYogas: string[]
}> = {
    business: {
        goodTithis: [2, 3, 5, 7, 10, 11, 13], // Shukla typically preferred
        badTithis: [4, 9, 14, 30], // Rikta Tithis + Amavasya
        goodNakshatras: ["Pushya", "Revati", "Anuradha", "Ashwini", "Rohini", "Uttara Phalguni"],
        avoidNakshatras: ["Bharani", "Krittika", "Ardra", "Ashlesha"],
        goodYogas: ["Siddhi", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra"],
        badYogas: ["Vishkumbha", "Atiganda", "Shula", "Ganda", "Vyaghata", "Vajra", "Vyatipata", "Parigha", "Vaidhriti"]
    },
    marriage: {
        goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
        badTithis: [4, 9, 14, 30, 1],
        goodNakshatras: ["Rohini", "Mrigashira", "Magha", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mula", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
        avoidNakshatras: ["Bharani", "Krittika", "Ardra", "Ashlesha"],
        goodYogas: ["Priti", "Ayushman", "Saubhagya", "Sobhana"],
        badYogas: ["Atiganda", "Shula", "Ganda", "Vyaghata", "Vajra", "Vyatipata", "Parigha", "Vaidhriti"]
    },
    travel: {
        goodTithis: [2, 3, 5, 7, 10, 11, 13],
        badTithis: [4, 6, 8, 9, 12, 14, 30],
        goodNakshatras: ["Ashwini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Anuradha", "Shravana", "Dhanishta", "Revati"],
        avoidNakshatras: ["Bharani", "Krittika", "Ardra", "Ashlesha"],
        goodYogas: ["Siddhi", "Sadhya"],
        badYogas: ["Vyatipata", "Vaidhriti"]
    },
    property: {
        goodTithis: [5, 6, 10, 11, 15], // Purnima good for entering
        badTithis: [4, 9, 14, 30],
        goodNakshatras: ["Rohini", "Mrigashira", "Punarvasu", "Pushya", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada"],
        avoidNakshatras: ["Ashlesha", "Jyeshtha", "Revati"], // Gandanta
        goodYogas: ["Sthira Yogas"], // Concept
        badYogas: []
    }
}

export function findNextAuspiciousDates(
    activity: ActivityType,
    startDate: Date,
    daysToScan: number,
    userNakshatraName: string
): MuhurtaResult[] {
    const results: MuhurtaResult[] = [];

    // Find User's Natal Nakshatra Index
    const standardOrder = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];
    const userNakIndex = standardOrder.indexOf(userNakshatraName.split(',')[0]);

    for (let i = 0; i < daysToScan; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        // Standardize time to noon for day-level analysis
        d.setHours(12, 0, 0, 0);

        const pos = calculatePlanetaryPositions(d);
        const tithi = getTithi(pos.sun, pos.moon);
        const nak = getNakshatra(pos.moon);
        const yoga = getYoga(pos.sun, pos.moon);
        const rule = RULES[activity];
        const analysis: string[] = [];
        let score = 50; // Start neutral

        // 1. Tithi Check
        // tithi.index is 1-30.
        if (rule.goodTithis.includes(tithi.index) || rule.goodTithis.includes(tithi.index > 15 ? tithi.index - 15 : tithi.index)) {
            score += 15;
            analysis.push(`Good Tithi: ${tithi.name}`);
        } else if (rule.badTithis.includes(tithi.index) || rule.badTithis.includes(tithi.index > 15 ? tithi.index - 15 : tithi.index)) {
            score -= 20;
            analysis.push(`Avoid Tithi: ${tithi.name} (Rikta/Galagraha)`);
        }

        // 2. Nakshatra Check (General)
        if (rule.goodNakshatras.includes(nak.name)) {
            score += 20;
            analysis.push(`Excellent Star: ${nak.name}`);
        } else if (rule.avoidNakshatras.includes(nak.name)) {
            score -= 20;
            analysis.push(`Avoid Star: ${nak.name}`);
        }

        // 3. Tara Bala (User Specific)
        // Distance from Janma Nakshatra
        if (userNakIndex !== -1) {
            const dist = (nak.index - userNakIndex + 27) % 27 + 1;
            const taraNum = (dist - 1) % 9 + 1;

            // Tara: 1 (Janma), 3 (Vipat), 5 (Pratyak), 7 (Naidhana) are bad
            if ([1, 3, 5, 7].includes(taraNum)) {
                score -= 15;
                analysis.push(`Tara Bala: Negative (Type ${taraNum})`);
            } else {
                score += 10;
            }
        }

        // 4. Yoga Check
        if (rule.badYogas.includes(yoga)) {
            score -= 15;
            analysis.push(`Malefic Yoga: ${yoga}`);
        }

        // Rating
        let rating: MuhurtaResult['rating'] = 'Average';
        if (score >= 80) rating = 'Excellent';
        else if (score >= 60) rating = 'Good';
        else if (score <= 30) rating = 'Avoid';

        if (score > 40) { // Only return viable dates
            results.push({
                date: d,
                rating,
                score,
                factors: {
                    tithi: tithi.name,
                    nakshatra: nak.name,
                    yoga: yoga,
                    karan: "Bava", // Placeholder calculated elsewhere if needed
                    taraBala: score < 50 ? "Caution/Danger" : "Favorable"
                },
                analysis
            });
        }
    }

    // Sort by best score
    return results.sort((a, b) => b.score - a.score);
}
