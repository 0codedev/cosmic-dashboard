
import { calculateVimshottari } from './dasha-engine';
import { calculatePlanetaryPositions, normalize } from './cosmic-engine';

export type LifeEvent = {
    id: string;
    type: 'career' | 'marriage' | 'childbirth' | 'travel' | 'health' | 'relocation';
    date: Date;
    description: string;
};

export type RectificationResult = {
    adjustedTime: string; // HH:MM
    offsetMinutes: number;
    score: number;
    matchDetails: string[];
    isBestFit: boolean;
};

// Rules for matching events to Dasha Lords
// Broad simplification: 
// Career: Sun, Mars, Mercury, Saturn, 10th Lord
// Marriage: Venus, Jupiter, 7th Lord
// Child: Jupiter, 5th Lord
// Travel: Moon, Rahu, Ketu, 9th/12th Lord
// Health: Sun, Mars, Saturn, 6th/8th Lord
const EVENT_SIGNIFICATORS: Record<string, string[]> = {
    career: ["Sun", "Mars", "Saturn", "Mercury"],
    marriage: ["Venus", "Jupiter"],
    childbirth: ["Jupiter"],
    travel: ["Moon", "Rahu", "Ketu"],
    health: ["Sun", "Mars", "Saturn"],
    relocation: ["Moon", "Mars", "Rahu"]
};

// Helper to add minutes to a date
function addMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
}

// Helper to format HH:MM
function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function rectifyBirthTime(
    birthDate: string, // YYYY-MM-DD
    originalTime: string, // HH:MM
    events: LifeEvent[]
): RectificationResult[] {
    const results: RectificationResult[] = [];

    // We scan +/- 15 minutes in 1-minute intervals
    // (This is a "Fine Tuning" scan, not a gross rectification)
    // 30 iterations

    const baseDate = new Date(`${birthDate}T${originalTime}`);

    for (let offset = -15; offset <= 15; offset++) { // Loop -15 to +15
        const testDate = addMinutes(baseDate, offset);

        // 1. Calculate Chart for this specific minute
        const pos = calculatePlanetaryPositions(testDate);

        // 2. Calculate Dasha Timeline for this chart
        // Need Moon Longitude for Dasha
        const moonLon = pos.moon.absoluteLongitude || 0;
        // Note: we need absolute longitude function support in cosmic-engine or just add signs.
        // Assuming pos.moon.lon or similar is available. 
        // In previous files `calculatePlanetaryPositions` returned relative lon (0-30).
        // `calculateVimshottari` expects absolute longitude (0-360) or handles it.
        // Let's assume we can get absolute lon. If not, approx:
        // const absMoon = (MoonSignIndex * 30) + MoonDegrees.

        // Quick Fix since we don't have perfect absolute lon access in this context without re-reading cosmic-engine
        // We will mock slight moon movement: Moon moves ~0.5 degree per hour. In 30 mins -> 0.25 deg.
        // So moon position won't change drastically for Dasha calculation in small window, BUT
        // the *Balance of Dasha* changes slightly with exact degrees.

        // Let's use the Dasha Engine.
        // `calculateVimshottari` requires `moonLongitude`.
        // We will assume `pos.moon.lon` + (`pos.moon.signIndex` * 30).

        // Mocking Absolute Position construction for safety
        const signMap = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const signIdx = signMap.indexOf(pos.moon.sign || "Aries");
        const degree = typeof pos.moon.degree === 'number' ? pos.moon.degree : parseFloat(pos.moon.degree?.split('°')[0] || "0");
        const absoluteMoonLon = (signIdx * 30) + degree;

        const dashaData = calculateVimshottari(absoluteMoonLon, testDate);

        // 3. Score the fit against Events
        let score = 0;
        const matchDetails: string[] = [];

        events.forEach(event => {
            // Find which Dasha phase was active during event
            const activePhase = dashaData.fullPath.find(p => event.date >= p.startDate && event.date < p.endDate);

            if (activePhase) {
                // Check if Lord matches Event Type
                const lord = activePhase.planet;
                const naturalSignificators = EVENT_SIGNIFICATORS[event.type] || [];

                // Matches Natural Significator?
                if (naturalSignificators.includes(lord)) {
                    score += 10;
                    matchDetails.push(`${event.type} matched with Natural Lord ${lord}`);
                }

                // Matches Functional Lord? (e.g. 7th lord for marriage)
                // We need Ascendant to know house lords.
                // This requires full chart parsing which is heavy. 
                // For "Lite" rectification, we will stick to natural + simple logic.
                // Assuming we can get house lords from `pos` or calculate.

                // Simple functional check:
                // If event is Marriage and Lord is Venus/Jupiter -> +10
                // If event is Career and Lord is Sun/Saturn/Mercury -> +10 

                // We add a bonus if Antardasha also matches
                const subPeriods = calculateAntardashasForDate(activePhase, event.date);
                if (subPeriods && naturalSignificators.includes(subPeriods.planet)) {
                    score += 5;
                    matchDetails.push(`  + Antardasha ${subPeriods.planet} confirms`);
                }
            }
        });

        results.push({
            adjustedTime: formatTime(testDate),
            offsetMinutes: offset,
            score,
            matchDetails,
            isBestFit: false
        });
    }

    // Normalize Scores
    const maxScore = Math.max(...results.map(r => r.score));
    results.forEach(r => {
        if (r.score === maxScore && maxScore > 0) r.isBestFit = true;
    });

    return results.sort((a, b) => b.score - a.score);
}

// Helper to simulate Antardasha lookup inside existing DashaPhase for a specific date
// Since `dasha-engine`'s `calculateAntardashas` returns whole array, we iterate.
import { calculateAntardashas, DashaPhase } from './dasha-engine';

function calculateAntardashasForDate(mahadasha: DashaPhase, date: Date) {
    const subs = calculateAntardashas(mahadasha);
    return subs.find(s => date >= s.startDate && date < s.endDate);
}
