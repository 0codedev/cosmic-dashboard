// Astrology Type Definitions for Cosmic Path Astrology
// Extracted from hardcoded data to enable proper typing and reusability

// =============================================================================
// PLANETARY TYPES
// =============================================================================

export interface PlanetaryPosition {
    sign: string
    house: string
    degree: string
    nakshatra: string
    pada: number
    lord: string
    description: string
    retrograde?: boolean
    absoluteLongitude?: number
}

export type PlanetName =
    | 'sun'
    | 'moon'
    | 'mars'
    | 'mercury'
    | 'jupiter'
    | 'venus'
    | 'saturn'
    | 'rahu'
    | 'ketu'

export type PlanetaryPositions = Record<PlanetName, PlanetaryPosition>

// =============================================================================
// YOGA TYPES
// =============================================================================

export interface Yoga {
    name: string
    description: string
    strength: 'Weak' | 'Moderate' | 'Strong' | 'Excellent'
    effect: string
}

// =============================================================================
// DASHA TYPES
// =============================================================================

export interface SadeSatiPhase {
    phase: string
    period: string
    status: 'completed' | 'current' | 'future'
    effects: string
}

// =============================================================================
// CAREER TYPES
// =============================================================================

export interface CareerField {
    field: string
    compatibility: number
    reason: string
}

export interface IncomePhase {
    period: string
    range: string
    source: string
}

export interface FinancialAnalysis {
    wealthPattern: string
    incomePhases: IncomePhase[]
    wealthSources: string[]
}

// =============================================================================
// MARRIAGE TYPES
// =============================================================================

export interface MarriageAnalysis {
    manglikStatus: string
    kalsarpaStatus: string
    marriageTiming: string
    spouseCharacteristics: string[]
    relationshipChallenges: string[]
}

// =============================================================================
// NUMEROLOGY TYPES
// =============================================================================

export interface NumerologyLifePhase {
    phase: string
    description: string
}

export interface NumerologyInsights {
    karmicDebt: string
    foundationNumber: string
    challenges: string[]
    remedies: string[]
    lifePhases: NumerologyLifePhase[]
}

// =============================================================================
// FAVORABLE/UNFAVORABLE ELEMENTS
// =============================================================================

export interface FavorableElements {
    days: string[]
    numbers: number[]
    planets: string[]
    signs: string[]
    lagnas: string[]
    metal: string
    stone: string
    colors: string[]
    gems: string[]
}

export interface UnfavorableElements {
    day: string
    numbers: number[]
    planets: string[]
    nakshatra: string
    lagna: string
    month: string
    tithi: number[]
    colors: string[]
}

// =============================================================================
// LIFE PREDICTIONS
// =============================================================================

export interface LifePredictions {
    education: string
    family: string
    marriage: string
    finance: string
    career: string
    health: string
    spirituality: string
}

// =============================================================================
// MAIN USER DATA TYPE
// =============================================================================

export interface AstrologyUserData {
    // Basic Details
    name: string
    dob: string
    tob: string
    pob: string
    sex: 'Male' | 'Female' | 'Other'
    dayOfBirth: string
    latitude: string
    longitude: string

    // Astrological Details
    lagna: string
    lagnaLord: string
    lagnaLongitude?: number // Added for D9 calculations
    remedies?: {
        gemstones: Array<{
            planet: PlanetName;
            gemstone: string;
            metal: string;
            finger: string;
            day: string;
            weight: string;
            reason: string;
            type: "Primary" | "Secondary" | "Avoid";
        }>;
        mantras: Array<{
            deity: string;
            mantra: string;
            count: number;
            time: string;
            purpose: string;
        }>;
        lifestyle: Array<{
            category: "Diet" | "Activity" | "Charity" | "Habit";
            description: string;
            reason: string;
        }>;
        specific: string[];
    };
    moonSign: string
    moonSignLord: string
    nakshatra: string
    nakshatraLord: string
    sunSign: string
    tithi: string
    yoga: string
    karan: string

    // Planetary Positions
    planetaryPositions: PlanetaryPositions

    // Dasha Information
    currentMahadasha: string
    previousMahadasha: string
    upcomingMahadasha: string
    nextMahadasha: string
    dashaBalance: string

    // Favorable & Unfavorable
    favorable: FavorableElements
    unfavorable: UnfavorableElements

    // Health
    healthTendencies: string[]

    // Career
    careerFields: CareerField[]

    // Sade Sati
    sadeSati: SadeSatiPhase[]

    // Marriage
    marriageAnalysis: MarriageAnalysis

    // Financial
    financialAnalysis: FinancialAnalysis

    // Personality
    personalityTraits: string[]

    // Yogas
    yogas: Yoga[]

    // Life Predictions
    lifePredictions: LifePredictions

    // Computed/Dynamic
    age: number
    currentYear: number

    // Numerology
    lifePathNumber: string
    numerologyInsights: NumerologyInsights
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type ZodiacSign =
    | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
    | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
    | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces'

export type House = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' |
    '7th' | '8th' | '9th' | '10th' | '11th' | '12th'

export type Nakshatra =
    | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini' | 'Mrigashira' | 'Ardra'
    | 'Punarvasu' | 'Pushya' | 'Ashlesha' | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni'
    | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha' | 'Anuradha' | 'Jyeshtha'
    | 'Mula' | 'Purva Ashadha' | 'Uttara Ashadha' | 'Shravana' | 'Dhanishta' | 'Shatabhisha'
    | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati'
