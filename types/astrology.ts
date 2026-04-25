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
    verification?: {
        status: 'verified' | 'disputed' | 'unverified'
        source?: string // e.g., "AstroArunPandit Report"
        matchScore?: number // 0-100
        notes?: string
    }
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
    verification?: {
        status: 'verified' | 'disputed' | 'unverified'
        source?: string
    }
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

export type Nakshatra =
    | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini' | 'Mrigashira' | 'Ardra'
    | 'Punarvasu' | 'Pushya' | 'Ashlesha' | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni'
    | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha' | 'Anuradha' | 'Jyeshtha'
    | 'Mula' | 'Purva Ashadha' | 'Uttara Ashadha' | 'Shravana' | 'Dhanishta' | 'Shatabhisha'
    | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati'

// =============================================================================
// HIGH-FIDELITY ASTROLOGY TYPES (RAO/RATH PROTOCOLS)
// =============================================================================

export interface JaiminiKaraka {
    planet: PlanetName
    degree: string
    role: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK'
    description: string
}

export interface ShadbalaMetric {
    planet: PlanetName
    value: number
    ratio: number
    rank: number
    rupa?: number
}

export interface BhavabalaMetric {
    house: string
    value: number
    rank: number
}

export interface BinnashtakvargaTable {
    sun: number[]
    moon: number[]
    mars: number[]
    mercury: number[]
    jupiter: number[]
    venus: number[]
    saturn: number[]
}

export interface KPCuspalRow {
    house: number
    degree: string
    signLord: string
    nakshatraLord: string
    subLord: string
    subSubLord: string
}

export interface DashaLevel {
    lord: PlanetName | string
    start: string
    end: string
    signal?: 'Green' | 'Yellow' | 'Red' | 'Prime' | 'Danger'
    instructions?: string
}

export interface NavataraTier {
    tier: number
    name: string
    nakshatras: Nakshatra[]
    lord: string
    status: 'Mind' | 'Wealth' | 'Danger' | 'Prosperity' | 'Obstacles' | 'Success' | 'Destruction' | 'Friend' | 'Allies'
    description: string
    tradingAction: string
}

export interface DivisionalChart {
    varga: string
    lagna: number
    positions: Record<string, number>
}

export interface TradingLaw {
    id: string
    name: string
    statement: string
    validatedBy: string[]
}

export interface HealthVulnerability {
    zone: string
    rules: string
    risk: 'Low' | 'Moderate' | 'High'
    description: string
}

// =============================================================================
// UPDATED MAIN USER DATA INTERFACE
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
    lagnaLongitude?: number
    moonSign: string
    moonSignLord: string
    nakshatra: string
    nakshatraLord: string
    sunSign: string
    tithi: string
    yoga: string
    karan: string
    paya: string
    varna: string
    yoni: string
    gana: string
    nadi: string

    // Advanced Metrics
    planetaryPositions: PlanetaryPositions
    jaiminiKarakas: JaiminiKaraka[]
    shadbala: ShadbalaMetric[]
    bhavabala: BhavabalaMetric[]
    ashtakvarga: Record<number, number>
    binnashtakvarga: BinnashtakvargaTable
    kpCuspalMatrix: KPCuspalRow[]
    navataraChakra: NavataraTier[]
    divisionalCharts: DivisionalChart[]
    avasthas: Record<string, string[]>
    yogi: PlanetName
    avayogi: PlanetName
    duplicateYogi: PlanetName

    // Dasha Information (Multi-Layer)
    dashaSystem: {
        vimshottari: {
            mahadashas: DashaLevel[]
            antardashas: DashaLevel[]
            pratyantars: DashaLevel[]
        }
        chara: DashaLevel[]
        yogini: DashaLevel[]
        mudda: DashaLevel[]
    }

    // Trading Intelligence
    tradingLaws: TradingLaw[]
    masterChecklist: string[]
    circuitBreakerActive: boolean
    dailyTradeLimit: number

    // Life Analysis
    careerTiers: Array<{ tier: string; fields: string[]; alignment: string }>
    financialTimeline: Array<{ age: string; period: string; phase: string; target: string }>
    healthProtocol: {
        constitution: string
        vulnerabilities: HealthVulnerability[]
        dailyMinimum: string[]
        diet: string[]
        movement: string[]
    }

    // Remedies
    remedies: {
        gemstones: Array<{
            planet: PlanetName
            gemstone: string
            metal: string
            finger: string
            type: "Primary" | "Secondary" | "Avoid"
            reason: string
        }>
        rudraksha: Array<{ type: string; purpose: string }>
        mantras: Array<{ deity: string; mantra: string; purpose: string }>
    }

    // --- Backward Compatibility / UI Fields ---
    sadeSati?: Array<{ phase: string; period: string; status: string; effects: string }>
    annualForecast?: {
        year: number
        muntha: { house: string; effect: string }
        yearLord: string
        summary: string
        quarterly: Array<{ period: string; theme: string; strategy: string }>
        remedies: string[]
    }
    personalityTraits?: string[]
    yogas?: Array<{ name: string; description: string; strength: string; effect: string }>
    lifePredictions?: {
        education: string
        family: string
        marriage: string
        finance: string
        career: string
        health: string
        spirituality: string
    }
    numerology?: {
        lifePathNumber: string
        insights: any
    }
    // Top-level compatibility fields
    lifePathNumber?: string
    currentMahadasha?: string

    // Favorable/Unfavorable recommendations
    favorable?: {
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
    unfavorable?: {
        day: string
        numbers: number[]
        planets: string[]
        nakshatra: string
        lagna: string
        month: string
        tithi: number[]
        colors: string[]
    }

    // Marriage Analysis
    marriageAnalysis?: {
        manglikStatus: string
        kalsarpaStatus: string
        marriageTiming: string
        spouseCharacteristics: string[]
        relationshipChallenges: string[]
    }

    // Health tendencies
    healthTendencies?: string[]

    // Career fields
    careerFields?: Array<{
        field: string
        compatibility: number
        reason: string
    }>

    // Financial Analysis
    financialAnalysis?: {
        wealthPattern: string
        incomePhases: Array<{
            period: string
            range: string
            source: string
        }>
        wealthSources: string[]
    }

    // Added for Mission Control
    strategicProtocol?: {
        currentPhase: string
        primaryLaw: string
        tuesdayLaw: string
        mercuryLaw: string
        financialLadder: Array<{ age: number; netWorth: string; focus: string }>
    }

    // Computed/Contextual
    identityAnchor: string
    age: number
    currentYear: number
}
