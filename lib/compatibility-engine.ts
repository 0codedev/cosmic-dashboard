// Compatibility Engine - Complete Ashtakoot (36 Guna) Matching System
// Implements traditional Vedic marriage compatibility with nakshatra data

// ============================================
// NAKSHATRA DATA - 27 nakshatras with all attributes
// ============================================

type NakshatraData = {
    name: string;
    lord: string;
    gana: 'Dev' | 'Manush' | 'Rakshas';
    yoni: string;           // Animal symbol
    yoniGender: 'M' | 'F';  // Male or Female yoni
    nadi: 'Adi' | 'Madhya' | 'Antya';
    varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
    vashyaGroup: number;    // 1-5 classification
};

export const NAKSHATRAS: NakshatraData[] = [
    { name: "Ashwini", lord: "Ketu", gana: "Dev", yoni: "Horse", yoniGender: "M", nadi: "Adi", varna: "Vaishya", vashyaGroup: 1 },
    { name: "Bharani", lord: "Venus", gana: "Manush", yoni: "Elephant", yoniGender: "M", nadi: "Madhya", varna: "Shudra", vashyaGroup: 2 },
    { name: "Krittika", lord: "Sun", gana: "Rakshas", yoni: "Goat", yoniGender: "F", nadi: "Antya", varna: "Brahmin", vashyaGroup: 3 },
    { name: "Rohini", lord: "Moon", gana: "Manush", yoni: "Serpent", yoniGender: "M", nadi: "Adi", varna: "Shudra", vashyaGroup: 4 },
    { name: "Mrigashira", lord: "Mars", gana: "Dev", yoni: "Serpent", yoniGender: "F", nadi: "Madhya", varna: "Vaishya", vashyaGroup: 5 },
    { name: "Ardra", lord: "Rahu", gana: "Manush", yoni: "Dog", yoniGender: "F", nadi: "Antya", varna: "Shudra", vashyaGroup: 1 },
    { name: "Punarvasu", lord: "Jupiter", gana: "Dev", yoni: "Cat", yoniGender: "F", nadi: "Adi", varna: "Vaishya", vashyaGroup: 2 },
    { name: "Pushya", lord: "Saturn", gana: "Dev", yoni: "Goat", yoniGender: "M", nadi: "Madhya", varna: "Kshatriya", vashyaGroup: 3 },
    { name: "Ashlesha", lord: "Mercury", gana: "Rakshas", yoni: "Cat", yoniGender: "M", nadi: "Antya", varna: "Shudra", vashyaGroup: 4 },
    { name: "Magha", lord: "Ketu", gana: "Rakshas", yoni: "Rat", yoniGender: "M", nadi: "Adi", varna: "Shudra", vashyaGroup: 5 },
    { name: "PurvaPhalguni", lord: "Venus", gana: "Manush", yoni: "Rat", yoniGender: "F", nadi: "Madhya", varna: "Brahmin", vashyaGroup: 1 },
    { name: "UttaraPhalguni", lord: "Sun", gana: "Manush", yoni: "Cow", yoniGender: "M", nadi: "Antya", varna: "Kshatriya", vashyaGroup: 2 },
    { name: "Hasta", lord: "Moon", gana: "Dev", yoni: "Buffalo", yoniGender: "F", nadi: "Adi", varna: "Vaishya", vashyaGroup: 3 },
    { name: "Chitra", lord: "Mars", gana: "Rakshas", yoni: "Tiger", yoniGender: "F", nadi: "Madhya", varna: "Shudra", vashyaGroup: 4 },
    { name: "Swati", lord: "Rahu", gana: "Dev", yoni: "Buffalo", yoniGender: "M", nadi: "Antya", varna: "Shudra", vashyaGroup: 5 },
    { name: "Vishakha", lord: "Jupiter", gana: "Rakshas", yoni: "Tiger", yoniGender: "M", nadi: "Adi", varna: "Brahmin", vashyaGroup: 1 },
    { name: "Anuradha", lord: "Saturn", gana: "Dev", yoni: "Deer", yoniGender: "F", nadi: "Madhya", varna: "Shudra", vashyaGroup: 2 },
    { name: "Jyeshtha", lord: "Mercury", gana: "Rakshas", yoni: "Deer", yoniGender: "M", nadi: "Antya", varna: "Vaishya", vashyaGroup: 3 },
    { name: "Mula", lord: "Ketu", gana: "Rakshas", yoni: "Dog", yoniGender: "M", nadi: "Adi", varna: "Shudra", vashyaGroup: 4 },
    { name: "PurvaAshadha", lord: "Venus", gana: "Manush", yoni: "Monkey", yoniGender: "M", nadi: "Madhya", varna: "Brahmin", vashyaGroup: 5 },
    { name: "UttaraAshadha", lord: "Sun", gana: "Manush", yoni: "Mongoose", yoniGender: "M", nadi: "Antya", varna: "Kshatriya", vashyaGroup: 1 },
    { name: "Shravana", lord: "Moon", gana: "Dev", yoni: "Monkey", yoniGender: "F", nadi: "Adi", varna: "Shudra", vashyaGroup: 2 },
    { name: "Dhanishta", lord: "Mars", gana: "Rakshas", yoni: "Lion", yoniGender: "F", nadi: "Madhya", varna: "Vaishya", vashyaGroup: 3 },
    { name: "Shatabhisha", lord: "Rahu", gana: "Rakshas", yoni: "Horse", yoniGender: "F", nadi: "Antya", varna: "Shudra", vashyaGroup: 4 },
    { name: "PurvaBhadrapada", lord: "Jupiter", gana: "Manush", yoni: "Lion", yoniGender: "M", nadi: "Adi", varna: "Brahmin", vashyaGroup: 5 },
    { name: "UttaraBhadrapada", lord: "Saturn", gana: "Manush", yoni: "Cow", yoniGender: "F", nadi: "Madhya", varna: "Kshatriya", vashyaGroup: 1 },
    { name: "Revati", lord: "Mercury", gana: "Dev", yoni: "Elephant", yoniGender: "F", nadi: "Antya", varna: "Shudra", vashyaGroup: 2 },
];

// Yoni compatibility matrix (4 = best, 0 = enemy)
const YONI_COMPATIBILITY: Record<string, Record<string, number>> = {
    Horse: { Horse: 4, Elephant: 2, Goat: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 1, Tiger: 1, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 1 },
    Elephant: { Horse: 2, Elephant: 4, Goat: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 0 },
    Goat: { Horse: 2, Elephant: 2, Goat: 4, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 0, Deer: 2, Monkey: 1, Mongoose: 2, Lion: 2 },
    Serpent: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 4, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 0, Lion: 2 },
    Dog: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 2, Dog: 4, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 0, Monkey: 2, Mongoose: 2, Lion: 2 },
    Cat: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 2, Dog: 2, Cat: 4, Rat: 0, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Rat: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 2, Dog: 2, Cat: 0, Rat: 4, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Cow: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 4, Buffalo: 3, Tiger: 0, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Buffalo: { Horse: 1, Elephant: 2, Goat: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 3, Buffalo: 4, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Tiger: { Horse: 1, Elephant: 2, Goat: 0, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 0, Buffalo: 2, Tiger: 4, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Deer: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 2, Dog: 0, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 4, Monkey: 2, Mongoose: 2, Lion: 2 },
    Monkey: { Horse: 2, Elephant: 2, Goat: 1, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 4, Mongoose: 2, Lion: 2 },
    Mongoose: { Horse: 2, Elephant: 2, Goat: 2, Serpent: 0, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 4, Lion: 2 },
    Lion: { Horse: 1, Elephant: 0, Goat: 2, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 4 },
};

// Planetary friendship for Graha Maitri
const PLANETARY_FRIENDSHIP: Record<string, Record<string, number>> = {
    Sun: { Sun: 5, Moon: 5, Mars: 5, Mercury: 0, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 },
    Moon: { Sun: 5, Moon: 5, Mars: 0, Mercury: 5, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 },
    Mars: { Sun: 5, Moon: 5, Mars: 5, Mercury: 0, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 },
    Mercury: { Sun: 5, Moon: 0, Mars: 0, Mercury: 5, Jupiter: 0, Venus: 5, Saturn: 0, Rahu: 0, Ketu: 0 },
    Jupiter: { Sun: 5, Moon: 5, Mars: 5, Mercury: 0, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0 },
    Venus: { Sun: 0, Moon: 0, Mars: 0, Mercury: 5, Jupiter: 0, Venus: 5, Saturn: 5, Rahu: 0, Ketu: 0 },
    Saturn: { Sun: 0, Moon: 0, Mars: 0, Mercury: 5, Jupiter: 0, Venus: 5, Saturn: 5, Rahu: 0, Ketu: 0 },
    Rahu: { Sun: 0, Moon: 0, Mars: 0, Mercury: 5, Jupiter: 0, Venus: 5, Saturn: 5, Rahu: 5, Ketu: 5 },
    Ketu: { Sun: 5, Moon: 5, Mars: 5, Mercury: 0, Jupiter: 5, Venus: 0, Saturn: 0, Rahu: 5, Ketu: 5 },
};

// ============================================
// ASHTAKOOT RESULT TYPES
// ============================================

export type KootaResult = {
    name: string;
    maxPoints: number;
    score: number;
    description: string;
    details: string;
};

export type AshtakootResult = {
    kootas: KootaResult[];
    totalScore: number;
    maxScore: 36;
    percentage: number;
    verdict: string;
    verdictColor: string;
    manglikMatch: boolean;
    nadiDosha: boolean;
    bhakootDosha: boolean;
    recommendations: string[];
};

// ============================================
// ASHTAKOOT CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate complete Ashtakoot (36 Guna) compatibility
 */
export function calculateAshtakoot(
    groomNakshatra: string,
    brideNakshatra: string
): AshtakootResult {
    const groomData = NAKSHATRAS.find(n => n.name === groomNakshatra);
    const brideData = NAKSHATRAS.find(n => n.name === brideNakshatra);

    if (!groomData || !brideData) {
        throw new Error(`Invalid nakshatra: ${groomNakshatra} or ${brideNakshatra}`);
    }

    const groomIdx = NAKSHATRAS.indexOf(groomData);
    const brideIdx = NAKSHATRAS.indexOf(brideData);

    const kootas: KootaResult[] = [];

    // 1. VARNA (1 point) - Spiritual compatibility
    const varnaOrder = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'];
    const groomVarnaIdx = varnaOrder.indexOf(groomData.varna);
    const brideVarnaIdx = varnaOrder.indexOf(brideData.varna);
    const varnaScore = groomVarnaIdx >= brideVarnaIdx ? 1 : 0;
    kootas.push({
        name: "Varna",
        maxPoints: 1,
        score: varnaScore,
        description: "Spiritual and ego compatibility",
        details: `Groom: ${groomData.varna}, Bride: ${brideData.varna}`
    });

    // 2. VASHYA (2 points) - Power dynamics
    const vashyaScore = groomData.vashyaGroup === brideData.vashyaGroup ? 2 :
        Math.abs(groomData.vashyaGroup - brideData.vashyaGroup) <= 1 ? 1 : 0.5;
    kootas.push({
        name: "Vashya",
        maxPoints: 2,
        score: vashyaScore,
        description: "Mutual attraction and control",
        details: `Compatibility group match: ${vashyaScore >= 1.5 ? 'Good' : 'Moderate'}`
    });

    // 3. TARA (3 points) - Destiny compatibility
    const taraDistance = ((brideIdx - groomIdx + 27) % 27) % 9;
    const taraAuspicious = [1, 2, 4, 6, 8];
    const taraScore = taraAuspicious.includes(taraDistance) ? 3 : 1.5;
    kootas.push({
        name: "Tara",
        maxPoints: 3,
        score: taraScore,
        description: "Destiny and luck compatibility",
        details: `Tara position: ${taraDistance + 1} (${taraScore === 3 ? 'Auspicious' : 'Moderate'})`
    });

    // 4. YONI (4 points) - Physical compatibility
    const yoniScore = YONI_COMPATIBILITY[groomData.yoni]?.[brideData.yoni] ?? 2;
    kootas.push({
        name: "Yoni",
        maxPoints: 4,
        score: yoniScore,
        description: "Physical and intimate compatibility",
        details: `${groomData.yoni} (${groomData.yoniGender}) & ${brideData.yoni} (${brideData.yoniGender})`
    });

    // 5. GRAHA MAITRI (5 points) - Mental compatibility
    const maitriPoints = PLANETARY_FRIENDSHIP[groomData.lord]?.[brideData.lord] ?? 2.5;
    kootas.push({
        name: "Graha Maitri",
        maxPoints: 5,
        score: maitriPoints,
        description: "Mental wavelength and friendship",
        details: `${groomData.lord} & ${brideData.lord}: ${maitriPoints === 5 ? 'Friends' : maitriPoints === 0 ? 'Enemies' : 'Neutral'}`
    });

    // 6. GANA (6 points) - Temperament
    let ganaScore = 0;
    if (groomData.gana === brideData.gana) {
        ganaScore = 6;
    } else if ((groomData.gana === 'Dev' && brideData.gana === 'Manush') ||
        (groomData.gana === 'Manush' && brideData.gana === 'Dev')) {
        ganaScore = 5;
    } else if ((groomData.gana === 'Manush' && brideData.gana === 'Rakshas') ||
        (groomData.gana === 'Rakshas' && brideData.gana === 'Manush')) {
        ganaScore = 1;
    } else {
        ganaScore = 0;
    }
    kootas.push({
        name: "Gana",
        maxPoints: 6,
        score: ganaScore,
        description: "Behavioral temperament match",
        details: `Groom: ${groomData.gana}, Bride: ${brideData.gana}`
    });

    // 7. BHAKOOT (7 points) - Emotional and prosperity
    const signDistance = Math.abs(Math.floor(groomIdx / 2.25) - Math.floor(brideIdx / 2.25));
    const bhakootBad = [2, 5, 6, 8, 9, 12].includes(signDistance + 1);
    const bhakootScore = bhakootBad ? 0 : 7;
    kootas.push({
        name: "Bhakoot",
        maxPoints: 7,
        score: bhakootScore,
        description: "Emotional connection and prosperity",
        details: bhakootBad ? "⚠️ Bhakoot Dosha present" : "No Bhakoot Dosha"
    });

    // 8. NADI (8 points) - Health and genes
    const nadiScore = groomData.nadi !== brideData.nadi ? 8 : 0;
    kootas.push({
        name: "Nadi",
        maxPoints: 8,
        score: nadiScore,
        description: "Health and genetic compatibility",
        details: nadiScore === 0 ? `⚠️ Nadi Dosha (both ${groomData.nadi})` :
            `Different Nadis: ${groomData.nadi} & ${brideData.nadi}`
    });

    // Calculate totals
    const totalScore = kootas.reduce((sum, k) => sum + k.score, 0);
    const percentage = Math.round((totalScore / 36) * 100);

    // Determine verdict
    let verdict: string;
    let verdictColor: string;
    let recommendations: string[] = [];

    if (percentage >= 75) {
        verdict = "Excellent Match! 💫";
        verdictColor = "text-green-400";
        recommendations = [
            "Highly auspicious match with strong compatibility",
            "Both partners will complement each other well",
            "Marriage is blessed with happiness and prosperity"
        ];
    } else if (percentage >= 60) {
        verdict = "Good Match 💚";
        verdictColor = "text-cyan-400";
        recommendations = [
            "Good compatibility with minor adjustments needed",
            "Perform recommended remedies for any doshas",
            "Strong communication will enhance the bond"
        ];
    } else if (percentage >= 45) {
        verdict = "Average Match 🧡";
        verdictColor = "text-yellow-400";
        recommendations = [
            "Average compatibility - requires conscious effort",
            "Remedies strongly recommended for doshas",
            "Consider consulting an astrologer for guidance"
        ];
    } else {
        verdict = "Challenging Match ⚠️";
        verdictColor = "text-red-400";
        recommendations = [
            "Significant compatibility challenges present",
            "Professional astrological consultation advised",
            "Strong commitment and remedies essential"
        ];
    }

    // Check for specific doshas
    const nadiDosha = nadiScore === 0;
    const bhakootDosha = bhakootScore === 0;

    if (nadiDosha) {
        recommendations.push("⚠️ Nadi Dosha: Both have same Nadi - remedy recommended");
    }
    if (bhakootDosha) {
        recommendations.push("⚠️ Bhakoot Dosha: May affect mutual prosperity - remedy recommended");
    }

    return {
        kootas,
        totalScore,
        maxScore: 36,
        percentage,
        verdict,
        verdictColor,
        manglikMatch: true, // Will be calculated separately
        nadiDosha,
        bhakootDosha,
        recommendations
    };
}

// ============================================
// MANGLIK DOSHA CALCULATION
// ============================================

export type ManglikResult = {
    isManglik: boolean;
    intensity: 'None' | 'Low' | 'Medium' | 'High';
    affectedHouses: number[];
    cancellations: string[];
    isCancelled: boolean;
    remedies: string[];
};

/**
 * Check Manglik Dosha from Mars house position
 */
export function checkManglikDosha(
    marsHouse: number,
    marsSign: string,
    jupiterAspectsMars: boolean = false,
    venusWithMars: boolean = false,
    saturnAspectsMars: boolean = false,
    moonInKendraFromMars: boolean = false
): ManglikResult {
    const manglikHouses = [1, 4, 7, 8, 12];
    const isManglik = manglikHouses.includes(marsHouse);

    if (!isManglik) {
        return {
            isManglik: false,
            intensity: 'None',
            affectedHouses: [],
            cancellations: [],
            isCancelled: false,
            remedies: []
        };
    }

    const cancellations: string[] = [];

    // Check cancellation factors
    // 1. Mars in own sign
    if (marsSign === 'Aries' || marsSign === 'Scorpio') {
        cancellations.push("Mars in own sign (Aries/Scorpio)");
    }

    // 2. Mars in exaltation
    if (marsSign === 'Capricorn') {
        cancellations.push("Mars in exaltation (Capricorn)");
    }

    // 3. Jupiter aspects Mars
    if (jupiterAspectsMars) {
        cancellations.push("Jupiter aspects Mars");
    }

    // 4. Venus conjunct Mars
    if (venusWithMars) {
        cancellations.push("Venus conjunct Mars");
    }

    // 5. Saturn aspects Mars
    if (saturnAspectsMars) {
        cancellations.push("Saturn aspects Mars");
    }

    // 6. Moon in Kendra from Mars
    if (moonInKendraFromMars) {
        cancellations.push("Moon in Kendra from Mars");
    }

    // 7. Mars in movable sign in 1st house
    const movableSigns = ['Aries', 'Cancer', 'Libra', 'Capricorn'];
    if (marsHouse === 1 && movableSigns.includes(marsSign)) {
        cancellations.push("Mars in movable sign in 1st house");
    }

    // 8. Mars in Cancer (debilitation) - reduces malefic effect
    if (marsSign === 'Cancer') {
        cancellations.push("Mars debilitated (low strength to cause harm)");
    }

    const isCancelled = cancellations.length >= 2;

    // Determine intensity
    let intensity: 'Low' | 'Medium' | 'High';
    if (isCancelled) {
        intensity = 'Low';
    } else if (marsHouse === 7 || marsHouse === 8) {
        intensity = 'High';
    } else if (marsHouse === 1 || marsHouse === 4) {
        intensity = 'Medium';
    } else {
        intensity = 'Low';
    }

    const remedies: string[] = [];
    if (!isCancelled) {
        remedies.push("Chant Mangal mantra 'Om Kram Kreem Kroum Sah Bhaumaya Namah' 108 times daily");
        remedies.push("Marry a Manglik partner or perform Kumbh Vivah");
        remedies.push("Donate red lentils and red cloth on Tuesdays");
        remedies.push("Worship Lord Hanuman regularly");
        remedies.push("Fast on Tuesdays and offer red flowers to Hanuman");
    }

    return {
        isManglik,
        intensity: cancellations.length >= 2 ? 'Low' : intensity,
        affectedHouses: [marsHouse],
        cancellations,
        isCancelled,
        remedies
    };
}

// ============================================
// D9 SPOUSE PREDICTION
// ============================================

export type SpousePrediction = {
    physicalTraits: string[];
    personality: string[];
    profession: string[];
    background: string[];
    marriageTiming: string;
};

/**
 * Predict spouse characteristics from D9 (Navamsha) chart
 */
export function predictSpouseFromD9(
    d9SeventhSign: string,
    d9SeventhLord: string,
    d9VenusSign: string,
    d9JupiterSign: string,
    userGender: 'Male' | 'Female'
): SpousePrediction {
    const signTraits: Record<string, { physical: string; personality: string; profession: string }> = {
        'Aries': { physical: 'Athletic build, sharp features', personality: 'Bold, independent, pioneering', profession: 'Military, sports, leadership' },
        'Taurus': { physical: 'Well-built, attractive, pleasant voice', personality: 'Stable, loyal, artistic', profession: 'Finance, arts, agriculture' },
        'Gemini': { physical: 'Youthful, expressive, quick movements', personality: 'Communicative, intellectual, versatile', profession: 'Writing, teaching, business' },
        'Cancer': { physical: 'Round face, nurturing appearance', personality: 'Caring, emotional, protective', profession: 'Healthcare, hospitality, real estate' },
        'Leo': { physical: 'Dignified appearance, commanding presence', personality: 'Confident, generous, dramatic', profession: 'Entertainment, politics, management' },
        'Virgo': { physical: 'Delicate features, neat appearance', personality: 'Analytical, helpful, perfectionist', profession: 'Healthcare, accounting, service' },
        'Libra': { physical: 'Graceful, beautiful, balanced features', personality: 'Diplomatic, charming, fair-minded', profession: 'Law, arts, diplomacy' },
        'Scorpio': { physical: 'Intense gaze, magnetic appearance', personality: 'Passionate, mysterious, transformative', profession: 'Research, healing, occult' },
        'Sagittarius': { physical: 'Tall, athletic, optimistic expression', personality: 'Philosophical, adventurous, honest', profession: 'Higher education, travel, spirituality' },
        'Capricorn': { physical: 'Mature appearance, structured features', personality: 'Ambitious, disciplined, responsible', profession: 'Government, construction, business' },
        'Aquarius': { physical: 'Unique features, modern appearance', personality: 'Humanitarian, innovative, independent', profession: 'Technology, social work, science' },
        'Pisces': { physical: 'Dreamy eyes, gentle appearance', personality: 'Compassionate, intuitive, artistic', profession: 'Music, healing, spirituality' },
    };

    const seventhSignData = signTraits[d9SeventhSign] || signTraits['Libra'];
    const venusSignData = signTraits[d9VenusSign] || signTraits['Libra'];
    const keyPlanetSign = userGender === 'Male' ? d9VenusSign : d9JupiterSign;
    const keyPlanetData = signTraits[keyPlanetSign] || signTraits['Libra'];

    return {
        physicalTraits: [
            seventhSignData.physical,
            `Influenced by ${d9SeventhLord}: ${signTraits[d9SeventhSign]?.physical || 'Pleasant appearance'}`,
        ],
        personality: [
            seventhSignData.personality,
            keyPlanetData.personality,
            "Spouse will be supportive of your life goals"
        ],
        profession: [
            seventhSignData.profession,
            `May work in ${keyPlanetData.profession} related fields`,
        ],
        background: [
            `Likely from ${d9SeventhSign}-influenced family background`,
            `Education and values aligned with ${d9SeventhLord} qualities`,
        ],
        marriageTiming: "Marriage favorable during Dasha of 7th lord or Venus"
    };
}

/**
 * Get nakshatra name from index
 */
export function getNakshatraName(index: number): string {
    return NAKSHATRAS[index % 27]?.name || 'Unknown';
}

/**
 * Get all nakshatra names for dropdown
 */
export function getAllNakshatras(): string[] {
    return NAKSHATRAS.map(n => n.name);
}
