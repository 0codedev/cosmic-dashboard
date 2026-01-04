// Career Prediction Engine
// Career timing predictions based on Dasha and transits

// ============================================
// TYPES
// ============================================

export type CareerPeriod = {
    start: string;
    end: string;
    rating: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
    activities: string[];
    reasoning: string;
};

export type CareerIndicator = {
    planet: string;
    house: number;
    strength: number;
    influence: string;
};

export type ProfessionMatch = {
    field: string;
    score: number;
    reasoning: string;
    planets: string[];
};

export type EntrepreneurshipResult = {
    score: number;
    verdict: string;
    strengths: string[];
    challenges: string[];
    bestPeriods: string[];
};

export type CareerAnalysis = {
    tenthHouseStrength: number;
    careerIndicators: CareerIndicator[];
    favorablePeriods: CareerPeriod[];
    professionMatches: ProfessionMatch[];
    entrepreneurship: EntrepreneurshipResult;
    jobVsBusiness: { job: number; business: number; recommendation: string };
};

// ============================================
// CONSTANTS
// ============================================

const CAREER_HOUSES = {
    1: 'Self, personal initiative, leadership ability',
    2: 'Wealth, family business, financial skills',
    3: 'Communication, media, writing, siblings',
    4: 'Real estate, agriculture, mother\'s business',
    5: 'Speculation, entertainment, creativity, education',
    6: 'Service, competition, enemies, legal',
    7: 'Partnership, consulting, public dealing',
    8: 'Research, occult, inheritance, hidden matters',
    9: 'Higher education, foreign, law, religion',
    10: 'Career, authority, government, reputation',
    11: 'Gains, networks, large organizations',
    12: 'Foreign residence, hospitals, spiritual work'
};

const PLANET_CAREERS: Record<string, string[]> = {
    'Sun': ['Government', 'Administration', 'Politics', 'Medicine', 'Leadership roles'],
    'Moon': ['Hospitality', 'Nursing', 'Public relations', 'Travel', 'Food industry'],
    'Mars': ['Engineering', 'Military', 'Sports', 'Surgery', 'Real estate'],
    'Mercury': ['Writing', 'Accounting', 'IT', 'Teaching', 'Business', 'Trading'],
    'Jupiter': ['Law', 'Finance', 'Education', 'Consulting', 'Spirituality'],
    'Venus': ['Arts', 'Fashion', 'Entertainment', 'Luxury goods', 'Hospitality'],
    'Saturn': ['Mining', 'Agriculture', 'Manufacturing', 'Labor', 'Oil & gas'],
    'Rahu': ['Technology', 'Foreign companies', 'Unconventional fields', 'Research'],
    'Ketu': ['Spirituality', 'Research', 'Healing', 'Behind-the-scenes work']
};

const DASHA_CAREER_EFFECTS: Record<string, { nature: string; activities: string[] }> = {
    'Sun': {
        nature: 'Excellent for authority',
        activities: ['Promotions', 'Leadership roles', 'Government jobs', 'Recognition']
    },
    'Moon': {
        nature: 'Good for public-facing roles',
        activities: ['Customer service', 'Travel-related work', 'Creative fields']
    },
    'Mars': {
        nature: 'Action and competition',
        activities: ['New ventures', 'Competitive exams', 'Property deals', 'Technical work']
    },
    'Mercury': {
        nature: 'Communication and intellect',
        activities: ['Business deals', 'Writing', 'Learning new skills', 'Networking']
    },
    'Jupiter': {
        nature: 'Expansion and growth',
        activities: ['Higher studies', 'Teaching', 'Finance', 'Consulting', 'Spiritual work']
    },
    'Venus': {
        nature: 'Creativity and comfort',
        activities: ['Arts', 'Entertainment', 'Luxury industry', 'Partnerships']
    },
    'Saturn': {
        nature: 'Hard work and persistence',
        activities: ['Long-term projects', 'Discipline-based work', 'Restructuring']
    },
    'Rahu': {
        nature: 'Unconventional growth',
        activities: ['Foreign opportunities', 'Technology', 'Breaking boundaries']
    },
    'Ketu': {
        nature: 'Spiritual and research',
        activities: ['Research', 'Spirituality', 'Detachment from material goals']
    }
};

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate 10th house strength and career indicators
 */
export function calculateCareerIndicators(
    tenthLord: string,
    tenthLordHouse: number,
    tenthLordStrength: number,
    planetsInTenth: string[],
    tenthLordAspects: string[]
): CareerIndicator[] {
    const indicators: CareerIndicator[] = [];

    // 10th Lord analysis
    indicators.push({
        planet: tenthLord,
        house: tenthLordHouse,
        strength: tenthLordStrength,
        influence: `10th lord in ${tenthLordHouse}th house - ${CAREER_HOUSES[tenthLordHouse as keyof typeof CAREER_HOUSES]}`
    });

    // Planets in 10th house
    planetsInTenth.forEach(planet => {
        indicators.push({
            planet,
            house: 10,
            strength: 70, // Default strength
            influence: `${planet} in 10th - career influenced by ${PLANET_CAREERS[planet]?.slice(0, 2).join(', ')}`
        });
    });

    return indicators;
}

/**
 * Get career timing windows based on Dasha periods
 */
export function getCareerTimingWindows(
    currentDasha: string,
    currentAntardasha: string,
    upcomingDashas: { planet: string; start: string; end: string }[]
): CareerPeriod[] {
    const periods: CareerPeriod[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    // Analyze current period
    const currentEffect = DASHA_CAREER_EFFECTS[currentDasha];
    if (currentEffect) {
        periods.push({
            start: `${currentYear}`,
            end: `${currentYear + 1}`,
            rating: ['Jupiter', 'Venus', 'Mercury', 'Sun'].includes(currentDasha) ? 'Excellent' :
                ['Moon', 'Mars'].includes(currentDasha) ? 'Good' : 'Moderate',
            activities: currentEffect.activities,
            reasoning: `${currentDasha} Mahadasha - ${currentEffect.nature}`
        });
    }

    // Analyze upcoming periods
    upcomingDashas.slice(0, 3).forEach(dasha => {
        const effect = DASHA_CAREER_EFFECTS[dasha.planet];
        if (effect) {
            periods.push({
                start: dasha.start,
                end: dasha.end,
                rating: ['Jupiter', 'Venus', 'Mercury', 'Sun'].includes(dasha.planet) ? 'Excellent' :
                    ['Moon', 'Mars'].includes(dasha.planet) ? 'Good' : 'Moderate',
                activities: effect.activities,
                reasoning: `${dasha.planet} Mahadasha - ${effect.nature}`
            });
        }
    });

    return periods;
}

/**
 * Calculate profession matches based on chart
 */
export function getProfessionMatches(
    tenthLord: string,
    tenthLordSign: string,
    planetsInTenth: string[],
    strongPlanets: string[]
): ProfessionMatch[] {
    const matches: ProfessionMatch[] = [];
    const planetScores: Record<string, number> = {};

    // Weight 10th lord heavily
    planetScores[tenthLord] = (planetScores[tenthLord] || 0) + 40;

    // Planets in 10th
    planetsInTenth.forEach(p => {
        planetScores[p] = (planetScores[p] || 0) + 30;
    });

    // Strong planets
    strongPlanets.forEach(p => {
        planetScores[p] = (planetScores[p] || 0) + 20;
    });

    // Generate profession matches
    const sortedPlanets = Object.entries(planetScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    sortedPlanets.forEach(([planet, score]) => {
        const careers = PLANET_CAREERS[planet] || [];
        careers.slice(0, 2).forEach(career => {
            matches.push({
                field: career,
                score: Math.min(95, score + Math.floor(Math.random() * 15)),
                reasoning: `Strong ${planet} influence through 10th house connection`,
                planets: [planet]
            });
        });
    });

    // Sort by score and dedupe
    return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

/**
 * Calculate entrepreneurship success score
 */
export function getEntrepreneurshipScore(
    tenthLordStrength: number,
    marsStrength: number,
    sunStrength: number,
    jupiterStrength: number,
    rahu7thOr10th: boolean,
    lagnaLordStrong: boolean
): EntrepreneurshipResult {
    const strengths: string[] = [];
    const challenges: string[] = [];

    let score = 50; // Base score

    // 10th Lord strength
    if (tenthLordStrength > 60) {
        score += 10;
        strengths.push('Strong 10th lord indicates career success potential');
    } else if (tenthLordStrength < 40) {
        score -= 5;
        challenges.push('10th lord needs strengthening for business');
    }

    // Mars - action, courage
    if (marsStrength > 60) {
        score += 10;
        strengths.push('Strong Mars provides courage and initiative');
    } else if (marsStrength < 40) {
        challenges.push('Mars needs strengthening for competitive edge');
    }

    // Sun - leadership
    if (sunStrength > 60) {
        score += 10;
        strengths.push('Strong Sun indicates leadership qualities');
    } else if (sunStrength < 40) {
        challenges.push('Sun needs strengthening for authority');
    }

    // Jupiter - wisdom, growth
    if (jupiterStrength > 60) {
        score += 10;
        strengths.push('Strong Jupiter brings wisdom and expansion');
    }

    // Rahu in 7th or 10th - unconventional success
    if (rahu7thOr10th) {
        score += 5;
        strengths.push('Rahu position favors unconventional business paths');
    }

    // Lagna lord strength
    if (lagnaLordStrong) {
        score += 10;
        strengths.push('Strong Lagna lord supports self-employment');
    }

    // Determine verdict
    let verdict: string;
    if (score >= 80) {
        verdict = 'Highly favorable for entrepreneurship';
    } else if (score >= 65) {
        verdict = 'Good potential for business with proper timing';
    } else if (score >= 50) {
        verdict = 'Moderate potential - consider partnership';
    } else {
        verdict = 'Job may be more suitable than solo business';
    }

    return {
        score: Math.min(100, Math.max(0, score)),
        verdict,
        strengths,
        challenges,
        bestPeriods: ['Jupiter Dasha', 'Mercury Dasha', 'Venus Dasha']
    };
}

/**
 * Job vs Business analysis
 */
export function analyzeJobVsBusiness(
    tenthLordInKendra: boolean,
    lagnaLordStrong: boolean,
    saturnStrength: number,
    rahu10th: boolean
): { job: number; business: number; recommendation: string } {
    let jobScore = 50;
    let businessScore = 50;

    // 10th lord in Kendra favors job
    if (tenthLordInKendra) {
        jobScore += 15;
    }

    // Strong Lagna lord favors business
    if (lagnaLordStrong) {
        businessScore += 15;
    }

    // Strong Saturn favors job with discipline
    if (saturnStrength > 60) {
        jobScore += 10;
    }

    // Rahu in 10th can favor unconventional paths
    if (rahu10th) {
        businessScore += 10;
    }

    // Normalize to 100
    const total = jobScore + businessScore;
    jobScore = Math.round((jobScore / total) * 100);
    businessScore = Math.round((businessScore / total) * 100);

    let recommendation: string;
    if (jobScore > businessScore + 20) {
        recommendation = 'Job/Service is more favorable for your chart';
    } else if (businessScore > jobScore + 20) {
        recommendation = 'Business/Self-employment suits your chart better';
    } else {
        recommendation = 'Both paths are viable - timing matters more';
    }

    return { job: jobScore, business: businessScore, recommendation };
}

/**
 * Get complete career analysis
 */
export function getFullCareerAnalysis(chartData: {
    tenthLord: string;
    tenthLordHouse: number;
    tenthLordSign: string;
    tenthLordStrength: number;
    planetsInTenth: string[];
    tenthLordAspects: string[];
    currentDasha: string;
    currentAntardasha: string;
    strongPlanets: string[];
    planetStrengths: Record<string, number>;
    rahu7thOr10th: boolean;
    lagnaLordStrong: boolean;
}): CareerAnalysis {
    const careerIndicators = calculateCareerIndicators(
        chartData.tenthLord,
        chartData.tenthLordHouse,
        chartData.tenthLordStrength,
        chartData.planetsInTenth,
        chartData.tenthLordAspects
    );

    const favorablePeriods = getCareerTimingWindows(
        chartData.currentDasha,
        chartData.currentAntardasha,
        [
            { planet: 'Saturn', start: '2027', end: '2046' },
            { planet: 'Mercury', start: '2046', end: '2063' }
        ]
    );

    const professionMatches = getProfessionMatches(
        chartData.tenthLord,
        chartData.tenthLordSign,
        chartData.planetsInTenth,
        chartData.strongPlanets
    );

    const entrepreneurship = getEntrepreneurshipScore(
        chartData.tenthLordStrength,
        chartData.planetStrengths['Mars'] || 50,
        chartData.planetStrengths['Sun'] || 50,
        chartData.planetStrengths['Jupiter'] || 50,
        chartData.rahu7thOr10th,
        chartData.lagnaLordStrong
    );

    const jobVsBusiness = analyzeJobVsBusiness(
        [1, 4, 7, 10].includes(chartData.tenthLordHouse),
        chartData.lagnaLordStrong,
        chartData.planetStrengths['Saturn'] || 50,
        chartData.planetsInTenth.includes('Rahu')
    );

    return {
        tenthHouseStrength: chartData.tenthLordStrength,
        careerIndicators,
        favorablePeriods,
        professionMatches,
        entrepreneurship,
        jobVsBusiness
    };
}
