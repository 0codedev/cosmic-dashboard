import { describe, it, expect } from 'vitest'
import { SUDHANSHU_DATA, getUserAge, getJupiterMahadashaProgress, getMahadashaYearsRemaining } from '@/data/user-data'

describe('User Data Module', () => {
    describe('SUDHANSHU_DATA', () => {
        it('should have all required basic properties', () => {
            expect(SUDHANSHU_DATA).toHaveProperty('name')
            expect(SUDHANSHU_DATA).toHaveProperty('dob')
            expect(SUDHANSHU_DATA).toHaveProperty('nakshatra')
            expect(SUDHANSHU_DATA).toHaveProperty('moonSign')
            expect(SUDHANSHU_DATA).toHaveProperty('sunSign')
            expect(SUDHANSHU_DATA).toHaveProperty('lagna') // ascendant in Vedic is called lagna
        })

        it('should have correct name', () => {
            expect(SUDHANSHU_DATA.name).toBe('Sudhanshu Gaddam')
        })

        it('should have planetary positions object', () => {
            expect(typeof SUDHANSHU_DATA.planetaryPositions).toBe('object')
            expect(SUDHANSHU_DATA.planetaryPositions).toHaveProperty('sun')
            expect(SUDHANSHU_DATA.planetaryPositions).toHaveProperty('moon')
            expect(SUDHANSHU_DATA.planetaryPositions).toHaveProperty('jupiter')
        })

        it('should have yogas array', () => {
            expect(Array.isArray(SUDHANSHU_DATA.yogas)).toBe(true)
            expect(SUDHANSHU_DATA.yogas.length).toBeGreaterThan(0)
        })

        it('should have dasha information', () => {
            expect(SUDHANSHU_DATA).toHaveProperty('currentMahadasha')
            expect(SUDHANSHU_DATA).toHaveProperty('upcomingMahadasha')
            expect(typeof SUDHANSHU_DATA.currentMahadasha).toBe('string')
        })

        it('should have career fields', () => {
            expect(Array.isArray(SUDHANSHU_DATA.careerFields)).toBe(true)
            expect(SUDHANSHU_DATA.careerFields.length).toBeGreaterThan(0)

            SUDHANSHU_DATA.careerFields.forEach((field) => {
                expect(field).toHaveProperty('field')
                expect(field).toHaveProperty('compatibility')
                expect(typeof field.compatibility).toBe('number')
            })
        })

        it('should have sadeSati phases', () => {
            expect(Array.isArray(SUDHANSHU_DATA.sadeSati)).toBe(true)
            expect(SUDHANSHU_DATA.sadeSati.length).toBeGreaterThan(0)
        })

        it('should have numerology insights', () => {
            expect(SUDHANSHU_DATA).toHaveProperty('lifePathNumber')
            expect(SUDHANSHU_DATA).toHaveProperty('numerologyInsights')
        })
    })

    describe('Utility Functions', () => {
        it('getUserAge should return a valid age', () => {
            const age = getUserAge()
            expect(typeof age).toBe('number')
            expect(age).toBeGreaterThan(15)
            expect(age).toBeLessThan(100)
        })

        it('getJupiterMahadashaProgress should return percentage', () => {
            const progress = getJupiterMahadashaProgress()
            expect(typeof progress).toBe('number')
            expect(progress).toBeGreaterThanOrEqual(0)
            expect(progress).toBeLessThanOrEqual(100)
        })

        it('getMahadashaYearsRemaining should return valid years', () => {
            const remaining = getMahadashaYearsRemaining()
            expect(typeof remaining).toBe('number')
            expect(remaining).toBeGreaterThanOrEqual(0)
        })
    })
})
