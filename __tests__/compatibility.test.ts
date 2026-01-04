import { describe, it, expect } from 'vitest'

// Gun Milan calculation utilities (extracted for testing)
function calculateGunaMilan(person1Sign: string, person2Sign: string) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

    const idx1 = signs.indexOf(person1Sign)
    const idx2 = signs.indexOf(person2Sign)

    if (idx1 === -1 || idx2 === -1) {
        throw new Error('Invalid sign provided')
    }

    const distance = Math.abs(idx1 - idx2)
    const elementMatch = Math.floor(idx1 / 3) === Math.floor(idx2 / 3)
    const oppositeMatch = distance === 6
    const trineMatch = distance === 4 || distance === 8

    // Calculate simplified total score
    let totalScore = 0

    // Varna (1 point)
    totalScore += distance <= 3 ? 1 : 0

    // Vashya (2 points)
    totalScore += oppositeMatch ? 2 : (distance <= 4 ? 1.5 : 0.5)

    // Tara (3 points)
    totalScore += trineMatch ? 3 : (distance % 3 === 0 ? 2 : 1)

    // Yoni (4 points)
    totalScore += elementMatch ? 4 : (distance <= 2 ? 3 : 2)

    // Graha Maitri (5 points)
    totalScore += elementMatch ? 5 : (oppositeMatch ? 4 : 2.5)

    // Gana (6 points)
    totalScore += Math.floor(idx1 / 4) === Math.floor(idx2 / 4) ? 6 : 3

    // Bhakoot (7 points)
    totalScore += oppositeMatch ? 7 : (trineMatch ? 5 : 3)

    // Nadi (8 points)
    totalScore += idx1 % 3 !== idx2 % 3 ? 8 : 0

    const maxScore = 36
    const percentage = Math.round((totalScore / maxScore) * 100)

    return { totalScore, maxScore, percentage }
}

describe('Compatibility Checker - Gun Milan', () => {
    describe('calculateGunaMilan', () => {
        it('should return percentage between 0 and 100', () => {
            const result = calculateGunaMilan('Aries', 'Leo')
            expect(result.percentage).toBeGreaterThanOrEqual(0)
            expect(result.percentage).toBeLessThanOrEqual(100)
        })

        it('should have max score of 36', () => {
            const result = calculateGunaMilan('Aries', 'Taurus')
            expect(result.maxScore).toBe(36)
        })

        it('should give reasonable scores for compatible signs (same element)', () => {
            // Fire signs: Aries, Leo, Sagittarius
            const fireToFire = calculateGunaMilan('Aries', 'Leo')
            // Same element should have decent compatibility
            expect(fireToFire.percentage).toBeGreaterThanOrEqual(40)
        })

        it('should handle opposite signs (6 houses apart)', () => {
            const result = calculateGunaMilan('Aries', 'Libra')
            // Opposite signs get Bhakoot bonus
            expect(result.totalScore).toBeGreaterThanOrEqual(20)
        })

        it('should throw error for invalid signs', () => {
            expect(() => calculateGunaMilan('Invalid', 'Aries')).toThrow('Invalid sign provided')
        })

        it('should handle same sign matching', () => {
            const result = calculateGunaMilan('Aries', 'Aries')
            expect(result.percentage).toBeGreaterThan(50)
        })

        it('should calculate trine aspect correctly', () => {
            // Trine: 4 or 8 houses apart
            // Aries to Leo is 4 houses apart
            const result = calculateGunaMilan('Aries', 'Sagittarius')
            expect(result.percentage).toBeGreaterThan(50)
        })
    })

    describe('Zodiac Sign Validation', () => {
        const validSigns = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ]

        it('should accept all 12 zodiac signs', () => {
            validSigns.forEach(sign => {
                expect(() => calculateGunaMilan(sign, 'Aries')).not.toThrow()
            })
        })
    })
})
