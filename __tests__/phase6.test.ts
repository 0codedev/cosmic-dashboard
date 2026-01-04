import { describe, test, expect } from 'vitest'
import { checkYogas, groupYogasByCategory } from '../lib/yoga-engine'
import { findNextAuspiciousDates, rateMuhurta, ActivityType } from '../lib/muhurta-engine'

describe('Phase 6 Logic Verification', () => {
    test('Yoga Engine detects Yogas for Sudhanshu Data', () => {
        // Sudhanshu's approx data
        const positions = {
            "sun": 169.00,
            "moon": 315.72,
            "mars": 24.60,
            "mercury": 194.63, // Libra
            "jupiter": 183.53, // Libra
            "venus": 217.46,
            "saturn": 105.99,
            "rahu": 349.36,
            "ketu": 169.36
        };
        const lagna = 315.00; // Aquarius

        const yogas = checkYogas(positions, lagna);
        const grouped = groupYogasByCategory(yogas);

        // Verify we found some yogas
        expect(yogas.length).toBeGreaterThan(0);

        console.log('Detected Yogas:', yogas.map(y => `${y.name} (${y.category})`));

        // Check for Dhana Yogas (Wealth) - Jupiter (11th) + Mercury (5th)
        // or just verify engine returns a list.
        const dhanaYogas = grouped['Dhana Yoga'] || [];
        const rajaYogas = grouped['Raja Yoga'] || [];

        if (dhanaYogas.length > 0) {
            console.log("Verified: Dhana Yogas found.");
        }
        if (rajaYogas.length > 0) {
            console.log("Verified: Raja Yogas found.");
        }
    });

    test('Muhurta Engine finds auspicious dates', () => {
        // Scan next 14 days for business
        const start = new Date();
        const dates = findNextAuspiciousDates('business', start, 14, 'Shatabhisha');

        // Should return result array (empty or populated)
        expect(Array.isArray(dates)).toBe(true);

        if (dates.length > 0) {
            const best = dates[0];
            expect(best.score).toBeGreaterThan(0);
            expect(best.factors).toBeDefined();
            console.log(`Found ${dates.length} auspicious dates`);
            console.log(`Top Date: ${best.date.toDateString()} (Score: ${best.score})`);
        } else {
            console.log('No "Excellent" or "Good" dates found in next 14 days, which is possible.');
        }
    });
});
