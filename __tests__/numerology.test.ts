import { describe, it, expect } from 'vitest'

// Numerology calculation utilities (extracted for testing)
function reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
    }
    return num
}

function calculateLifePathNumber(dateStr: string): number {
    const parts = dateStr.split(' ')
    const day = parseInt(parts[0])
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const month = monthNames.indexOf(parts[1]) + 1
    const year = parseInt(parts[2])

    const dayReduced = reduceToSingleDigit(day)
    const monthReduced = reduceToSingleDigit(month)
    const yearReduced = reduceToSingleDigit(year)

    return reduceToSingleDigit(dayReduced + monthReduced + yearReduced)
}

function calculateDestinyNumber(name: string): number {
    const letterValues: { [key: string]: number } = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
        j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
        s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
    }

    const sum = name.toLowerCase()
        .split('')
        .filter(char => letterValues[char])
        .reduce((acc, char) => acc + letterValues[char], 0)

    return reduceToSingleDigit(sum)
}

function calculateBirthDayNumber(dateStr: string): number {
    const day = parseInt(dateStr.split(' ')[0])
    return reduceToSingleDigit(day)
}

describe('Numerology Calculations', () => {
    describe('reduceToSingleDigit', () => {
        it('should reduce multi-digit numbers to single digit', () => {
            expect(reduceToSingleDigit(28)).toBe(1) // 2+8=10, 1+0=1
            expect(reduceToSingleDigit(45)).toBe(9) // 4+5=9
            expect(reduceToSingleDigit(123)).toBe(6) // 1+2+3=6
        })

        it('should preserve master numbers 11, 22, 33', () => {
            expect(reduceToSingleDigit(11)).toBe(11)
            expect(reduceToSingleDigit(22)).toBe(22)
            expect(reduceToSingleDigit(33)).toBe(33)
        })

        it('should return single digit numbers unchanged', () => {
            expect(reduceToSingleDigit(5)).toBe(5)
            expect(reduceToSingleDigit(9)).toBe(9)
            expect(reduceToSingleDigit(1)).toBe(1)
        })
    })

    describe('calculateLifePathNumber', () => {
        it('should calculate correct life path for Sudhanshu (14 October 2005)', () => {
            // 14 = 1+4 = 5
            // October = 10 = 1+0 = 1
            // 2005 = 2+0+0+5 = 7
            // 5+1+7 = 13 = 1+3 = 4
            expect(calculateLifePathNumber('14 October 2005')).toBe(4)
        })

        it('should calculate correct life path for various dates', () => {
            // 1 January 2000: 1 + 1 + 2 = 4
            expect(calculateLifePathNumber('1 January 2000')).toBe(4)

            // 15 August 1947: 6 + 8 + 3 = 17 = 8
            expect(calculateLifePathNumber('15 August 1947')).toBe(8)
        })
    })

    describe('calculateDestinyNumber', () => {
        it('should calculate destiny number from name', () => {
            // SUDHANSHU: S+U+D+H+A+N+S+H+U
            // 1+3+4+8+1+5+1+8+3 = 34 = 7
            expect(calculateDestinyNumber('Sudhanshu')).toBe(7)
        })

        it('should ignore non-letter characters', () => {
            expect(calculateDestinyNumber('John-Doe!')).toBe(calculateDestinyNumber('JohnDoe'))
        })

        it('should be case insensitive', () => {
            expect(calculateDestinyNumber('JOHN')).toBe(calculateDestinyNumber('john'))
        })
    })

    describe('calculateBirthDayNumber', () => {
        it('should extract and reduce day number', () => {
            expect(calculateBirthDayNumber('14 October 2005')).toBe(5) // 1+4
            expect(calculateBirthDayNumber('7 March 1990')).toBe(7)
            expect(calculateBirthDayNumber('29 December 2000')).toBe(11) // Master number
        })
    })
})
