import { AstrologyUserData, PlanetaryPositions } from '@/types/astrology'
import { SUDHANSHU_DATA } from '@/data/user-data'
import { ZODIAC_SIGNS } from '@/data/interpretation/signs'
import { NAKSHATRAS } from '@/data/interpretation/nakshatras'
import * as Astronomy from 'astronomy-engine';
import { generateRemedies } from '@/lib/remedy-engine';

export type BirthDetails = {
    name: string
    date: string
    time: string
    location: string
    latitude: number
    longitude: number
}

// --- UTILITIES ---

export function getLahiriAyanamsha(date: Date): number {
    const year = date.getFullYear();
    return 23.85 + (year - 2000) * 0.0139;
}

export function normalize(deg: number): number {
    return (deg % 360 + 360) % 360;
}

export function getZodiacSign(longitude: number) {
    const adjusted = normalize(longitude);
    const index = Math.floor(adjusted / 30);
    const degrees = adjusted % 30;
    const signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    return { name: signs[index], index, degrees };
}

export function getNakshatra(longitude: number) {
    const adjusted = normalize(longitude);
    const nakshatraSpan = 13.333333;
    const index = Math.floor(adjusted / nakshatraSpan);
    const standardOrder = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];
    const name = standardOrder[index] || "Ashwini";
    const pada = Math.floor((adjusted % nakshatraSpan) / 3.33333) + 1;
    // Check if NAKSHATRAS array has data, otherwise default
    const lord = NAKSHATRAS[name] && NAKSHATRAS[name].ruler ? NAKSHATRAS[name].ruler : "Ketu";
    return { name, index, pada, lord };
}

export function formatDegree(deg: number): string {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}°${m}'`;
}

// --- GENERATORS ---

function getHouseNumber(planetLon: number, lagnaLon: number): number {
    const diff = normalize(planetLon - lagnaLon);
    return Math.floor(diff / 30) + 1;
}

function calculateSadeSati(moonLon: number, saturnLon: number): SadeSatiResult[] {
    const moonSignIndex = Math.floor(normalize(moonLon) / 30);
    const saturnSignIndex = Math.floor(normalize(saturnLon) / 30);
    const diff = (saturnSignIndex - moonSignIndex + 12) % 12;

    const status: Record<number, SadeSatiStatus> = {
        11: { phase: "Rising", effect: "Mental stress and sudden changes." },
        0: { phase: "Peak", effect: "Intense transformation and challenges." },
        1: { phase: "Setting", effect: "Gradual relief and stabilizing." },
    };

    const s = status[diff];
    if (s) {
        return [{
            phase: s.phase,
            period: "Current Transit",
            status: "current",
            effects: s.effect
        }];
    }
    return [];
}

type SadeSatiResult = {
    phase: string;
    period: string;
    status: string;
    effects: string;
};

type SadeSatiStatus = {
    phase: string;
    effect: string;
};

function generatePersonality(lagnaName: string, moonName: string, nakshatraName: string): string[] {
    const lTraits = ZODIAC_SIGNS[lagnaName]?.traits || [];
    const mTraits = ZODIAC_SIGNS[moonName]?.traits || [];
    const nQualities = NAKSHATRAS[nakshatraName]?.qualities || [];
    return Array.from(new Set([...lTraits, ...mTraits, ...nQualities])).slice(0, 10);
}

function generateCareerFields(tenthLord: string, sunSign: string): any[] {
    const careers: Record<string, string[]> = {
        "Sun": ["Government", "Administrative", "Politics", " Medicine"],
        "Moon": ["Psychology", "Human Resources", "Hospitality", "Public Relations"],
        "Mars": ["Engineering", "Defense/Police", "Real Estate", "Surgery"],
        "Mercury": ["Journalism", "Accounting/Finance", "Teaching", "Software Dev"],
        "Jupiter": ["Law/Judiciary", "Academics", "Banking", "Consultancy"],
        "Venus": ["Arts/Entertainment", "Fashion/Design", "Luxury Hotelier", "Media"],
        "Saturn": ["Manufacturing", "Mining/Geology", "Operations Mgmt", "Agriculture"],
        "Rahu": ["Aviation", "Research", "Foreign Trade", "Technology"],
        "Ketu": ["Astrology/Occult", "Programming", "Theology", "Languages"]
    };
    const suggestions = careers[tenthLord] || ["General Management"];
    return suggestions.map(field => ({
        field,
        compatibility: Math.floor(Math.random() * 15) + 80,
        reason: `Supported by your 10th Lord (${tenthLord})`
    }));
}

function generateFavorable(lagnaName: string, lagnaLord: string): any {
    const lordMap: Record<string, any> = {
        "Sun": { day: "Sunday", color: "Gold", stone: "Ruby" },
        "Moon": { day: "Monday", color: "White", stone: "Pearl" },
        "Mars": { day: "Tuesday", color: "Red", stone: "Coral" },
        "Mercury": { day: "Wednesday", color: "Green", stone: "Emerald" },
        "Jupiter": { day: "Thursday", color: "Yellow", stone: "Yellow Sapphire" },
        "Venus": { day: "Friday", color: "White", stone: "Diamond/Zircon" },
        "Saturn": { day: "Saturday", color: "Blue", stone: "Blue Sapphire" }
    };
    const data = lordMap[lagnaLord] || lordMap["Sun"];
    return { days: [data.day], numbers: [1, 5, 9], planets: [lagnaLord], signs: [lagnaName], lagnas: [lagnaName], metal: "Gold/Silver", stone: data.stone, colors: [data.color], gems: [data.stone] };
}

function generateUnfavorable(lagnaIndex: number): any {
    const eighthSignIndex = (lagnaIndex + 7) % 12;
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const eighthSignName = signs[eighthSignIndex];
    const eighthLord = ZODIAC_SIGNS[eighthSignName].lord;

    const lordMap: Record<string, any> = {
        "Sun": { day: "Sunday", color: "Orange" },
        "Moon": { day: "Monday", color: "Milky White" },
        "Mars": { day: "Tuesday", color: "Deep Red" },
        "Mercury": { day: "Wednesday", color: "Green" },
        "Jupiter": { day: "Thursday", color: "Yellow" },
        "Venus": { day: "Friday", color: "Pink" },
        "Saturn": { day: "Saturday", color: "Black/Dark Blue" }
    };
    const badData = lordMap[eighthLord] || lordMap["Saturn"];
    return { day: badData.day, numbers: [8], planets: [eighthLord], nakshatra: "Check Transit", lagna: eighthSignName, month: "Avoid New Moon", tithi: [4, 9, 14], colors: [badData.color] };
}

function generateWealthAnalysis(secondLord: string, eleventhLord: string, careers: any[]): any {
    const patterns: Record<string, string> = {
        "Sun": "Wealth through authority and state.",
        "Moon": "Fluctuating but ample liquid cash.",
        "Mars": "Wealth through assets and lands.",
        "Mercury": "Wealth through trade and intellect.",
        "Jupiter": "Wealth through wisdom and investments.",
        "Venus": "Wealth through arts and luxury.",
        "Saturn": "Slow, steady accumulation over time.",
    };
    const pattern = patterns[secondLord] || "Steady growth through personal effort.";
    return { wealthPattern: pattern, incomePhases: [{ period: "Prime Earning Years", range: "30-50", source: careers[0].field }], wealthSources: [`${secondLord}-ruled sectors`, `${eleventhLord}-ruled gains`] };
}

function generateMarriageAnalysis(seventhLord: string, seventhSign: string): any {
    const spouseNature: Record<string, string> = {
        "Sun": "Dominant and authoritative",
        "Moon": "Caring but sensitive",
        "Mars": "Energetic and protective",
        "Mercury": "Intelligent and communicative",
        "Jupiter": "Wise and guided by dharma",
        "Venus": "Beautiful and artistic",
        "Saturn": "Mature, practical, older"
    };
    const timing = seventhLord === "Saturn" ? "Delayed (Post 30)" : "Early/Timely";
    const spouseChar = spouseNature[seventhLord] || "Supportive partner";
    return { manglikStatus: "Requires Position Check", kalsarpaStatus: "No", marriageTiming: timing, spouseCharacteristics: [spouseChar, `Embodies ${seventhSign} traits`], relationshipChallenges: ["Ego clashes", "Communication"] };
}

function calculateNumerology(dob: Date): any {
    const day = dob.getDate();
    const reduce = (n: number) => {
        let sum = n;
        while (sum > 9 && sum !== 11 && sum !== 22) { sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0); }
        return sum;
    };
    const lifePath = reduce(dob.getDate() + (dob.getMonth() + 1) + dob.getFullYear());
    return { lifePathNumber: lifePath.toString(), insights: { karmicDebt: "None", foundationNumber: reduce(day).toString(), challenges: ["Self-discipline"], remedies: ["Mindfulness"], lifePhases: [] } };
}

export function calculatePlanetaryPositions(birthDate: Date) {
    const ayanamsha = getLahiriAyanamsha(birthDate);
    const now = Astronomy.MakeTime(birthDate);

    const getSidereal = (body: Astronomy.Body) => {
        const v = Astronomy.GeoVector(body, now, false);
        const s = Astronomy.SphereFromVector(v);
        let tropical = s.lon;
        if (tropical < 0) tropical += 360;
        return normalize(tropical - ayanamsha);
    };

    return {
        sun: getSidereal(Astronomy.Body.Sun),
        moon: getSidereal(Astronomy.Body.Moon),
        mars: getSidereal(Astronomy.Body.Mars),
        mercury: getSidereal(Astronomy.Body.Mercury),
        jupiter: getSidereal(Astronomy.Body.Jupiter),
        venus: getSidereal(Astronomy.Body.Venus),
        saturn: getSidereal(Astronomy.Body.Saturn),
        ayanamsha // Exporting if needed
    };
}

export function calculateCurrentPlanetaryPositions(date: Date) {
    const raw = calculatePlanetaryPositions(date);

    const format = (lon: number) => {
        const sign = getZodiacSign(lon);
        const nak = getNakshatra(lon);
        return {
            sign: sign.name,
            degree: formatDegree(sign.degrees),
            nakshatra: nak.name,
            longitude: lon
        };
    };

    return {
        sun: format(raw.sun),
        moon: format(raw.moon),
        mars: format(raw.mars),
        mercury: format(raw.mercury),
        jupiter: format(raw.jupiter),
        venus: format(raw.venus),
        saturn: format(raw.saturn)
    };
}

// --- MAIN ENGINE ---

export type SimplifiedAstrologyData = Partial<AstrologyUserData> & {
    name: string;
    dob: string;
    tob: string;
    pob: string;
    lagna: string;
    lagnaLord: string;
    moonSign: string;
    moonSignLord: string;
    nakshatra: string;
    nakshatraLord: string;
    sunSign: string;
    planetaryPositions: PlanetaryPositions;
    identityAnchor: string;
    age: number;
    currentYear: number;
};

export async function calculateBirthChart(details: BirthDetails): Promise<SimplifiedAstrologyData> {
    if (details.name.toLowerCase().includes("sudhanshu")) return SUDHANSHU_DATA;

    const birthDate = new Date(`${details.date}T${details.time}`);
    const { sun: sunLon, moon: moonLon, mars: marsLon, mercury: mercLon, jupiter: jupLon, venus: venLon, saturn: satLon } = calculatePlanetaryPositions(birthDate);

    // Lagna Calculation (Simplified)
    const hours = birthDate.getHours() + birthDate.getMinutes() / 60;
    const lagnaLon = normalize(sunLon + ((hours - 6) * 15));

    const lagnaInfo = getZodiacSign(lagnaLon);
    const lagnaData = ZODIAC_SIGNS[lagnaInfo.name];

    const moonInfo = getZodiacSign(moonLon);
    const moonData = ZODIAC_SIGNS[moonInfo.name];
    const moonNak = getNakshatra(moonLon);

    const sunInfo = getZodiacSign(sunLon);
    const sunData = ZODIAC_SIGNS[sunInfo.name];

    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    const tenthSignIndex = (lagnaInfo.index + 9) % 12;
    const tenthLord = ZODIAC_SIGNS[signs[tenthSignIndex]].lord;

    const secondSignIndex = (lagnaInfo.index + 1) % 12;
    const secondLord = ZODIAC_SIGNS[signs[secondSignIndex]].lord;

    const eleventhSignIndex = (lagnaInfo.index + 10) % 12;
    const eleventhLord = ZODIAC_SIGNS[signs[eleventhSignIndex]].lord;

    const seventhSignIndex = (lagnaInfo.index + 6) % 12;
    const seventhSignName = signs[seventhSignIndex];
    const seventhLord = ZODIAC_SIGNS[seventhSignName].lord;

    const sadeSati = calculateSadeSati(moonLon, satLon);
    const careers = generateCareerFields(tenthLord, sunInfo.name);
    const personality = generatePersonality(lagnaInfo.name, moonInfo.name, moonNak.name);
    const fav = generateFavorable(lagnaInfo.name, lagnaData.lord);
    const unfav = generateUnfavorable(lagnaInfo.index);
    const wealth = generateWealthAnalysis(secondLord, eleventhLord, careers);
    const marriage = generateMarriageAnalysis(seventhLord, seventhSignName);
    const num = calculateNumerology(birthDate);

    const predictions = {
        education: `Mercury in ${getZodiacSign(mercLon).name} supports ${mercLon > 200 ? "technical" : "creative"} learning.`,
        family: `2nd House lord (${secondLord}) influence suggests a ${secondLord === "Jupiter" ? "expansive" : "focused"} family environment.`,
        marriage: `7th Lord Analysis: Relationships governed by ${seventhLord}. ${marriage.marriageTiming}.`,
        finance: `Wealth lord ${tenthLord} indicates income through ${careers[0].field}.`,
        career: `Strong potential in ${careers[0].field} or ${careers[1].field} due to ${tenthLord} influence.`,
        health: `Watch out for ${lagnaData.healthTendencies[0]} as a vulnerability of ${lagnaInfo.name} Ascendant.`,
        spirituality: `Ketu influence suggests ${moonNak.name.includes("Mula") || moonNak.name.includes("Ketu") ? "deep" : "developing"} spiritual interests.`
    };

    return {
        name: details.name,
        dob: birthDate.toLocaleDateString(),
        tob: birthDate.toLocaleTimeString(),
        pob: details.location,
        sex: "Other",
        dayOfBirth: birthDate.toLocaleDateString('en-US', { weekday: 'long' }),
        latitude: details.latitude.toFixed(2),
        longitude: details.longitude.toFixed(2),
        lagna: lagnaInfo.name,
        lagnaLord: lagnaData.lord,
        lagnaLongitude: lagnaLon,
        moonSign: moonInfo.name,
        moonSignLord: moonData.lord,
        nakshatra: `${moonNak.name}, Pada ${moonNak.pada}`,
        nakshatraLord: moonNak.lord,
        sunSign: sunInfo.name,
        tithi: "Krishna Paksha", yoga: "Siddha", karan: "Bava",
        planetaryPositions: {
            sun: { sign: sunInfo.name, house: `${getHouseNumber(sunLon, lagnaLon)}th`, degree: formatDegree(sunInfo.degrees), nakshatra: getNakshatra(sunLon).name, pada: 1, lord: sunData.lord, description: sunData.description, absoluteLongitude: sunLon },
            moon: { sign: moonInfo.name, house: `${getHouseNumber(moonLon, lagnaLon)}th`, degree: formatDegree(moonInfo.degrees), nakshatra: moonNak.name, pada: moonNak.pada, lord: moonData.lord, description: moonData.description, absoluteLongitude: moonLon },
            mars: { sign: getZodiacSign(marsLon).name, house: `${getHouseNumber(marsLon, lagnaLon)}th`, degree: formatDegree(getZodiacSign(marsLon).degrees), nakshatra: getNakshatra(marsLon).name, pada: 1, retrograde: false, lord: "Mars", description: "Energy and Drive", absoluteLongitude: marsLon },
            mercury: { sign: getZodiacSign(mercLon).name, house: `${getHouseNumber(mercLon, lagnaLon)}th`, degree: formatDegree(getZodiacSign(mercLon).degrees), nakshatra: getNakshatra(mercLon).name, pada: 1, lord: "Mercury", description: "Intellect and Speech", absoluteLongitude: mercLon },
            jupiter: { sign: getZodiacSign(jupLon).name, house: `${getHouseNumber(jupLon, lagnaLon)}th`, degree: formatDegree(getZodiacSign(jupLon).degrees), nakshatra: getNakshatra(jupLon).name, pada: 1, lord: "Jupiter", description: "Wisdom and Expansion", absoluteLongitude: jupLon },
            venus: { sign: getZodiacSign(venLon).name, house: `${getHouseNumber(venLon, lagnaLon)}th`, degree: formatDegree(getZodiacSign(venLon).degrees), nakshatra: getNakshatra(venLon).name, pada: 1, lord: "Venus", description: "Love and Luxury", absoluteLongitude: venLon },
            saturn: { sign: getZodiacSign(satLon).name, house: `${getHouseNumber(satLon, lagnaLon)}th`, degree: formatDegree(getZodiacSign(satLon).degrees), nakshatra: getNakshatra(satLon).name, pada: 1, lord: "Saturn", description: "Discipline and Delay", absoluteLongitude: satLon },
            rahu: { sign: "Pisces", house: "12th", degree: "00°00'", nakshatra: "Revati", pada: 1, retrograde: true, lord: "Jupiter", description: "Desire", absoluteLongitude: 350 },
            ketu: { sign: "Virgo", house: "6th", degree: "00°00'", nakshatra: "Chitra", pada: 3, retrograde: true, lord: "Mercury", description: "Detachmend", absoluteLongitude: 170 }
        },
        currentMahadasha: `${moonNak.lord} (Active)`,
        personalityTraits: personality,
        lifePredictions: predictions,
        numerology: {
            lifePathNumber: num.lifePathNumber,
            insights: num.insights
        },
        age: new Date().getFullYear() - birthDate.getFullYear(),
        currentYear: new Date().getFullYear(),
        identityAnchor: "Generated from planetary positions"
    }
}
