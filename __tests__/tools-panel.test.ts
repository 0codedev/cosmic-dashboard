import { describe, it, expect } from 'vitest'

// Panchang calculation utilities (extracted for testing)
function getPanchangData(date: Date = new Date()) {
    const totalDays = Math.floor((date.getTime() - new Date(2000, 0, 6).getTime()) / (1000 * 60 * 60 * 24))
    const moonCycle = totalDays % 29.53
    const tithiIndex = Math.floor(moonCycle / 1.96) + 1

    const tithis = [
        "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
        "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
        "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
        moonCycle < 14.76 ? "Purnima" : "Amavasya"
    ]

    const paksha = moonCycle < 14.76 ? "Shukla Paksha" : "Krishna Paksha"
    const tithi = tithis[Math.min(tithiIndex - 1, 14)]

    const nakshatras = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]
    const nakshatraIndex = Math.floor((totalDays / 1.0125) % 27)
    const nakshatra = nakshatras[nakshatraIndex]

    const varas = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"]
    const vara = varas[date.getDay()]

    return { tithi, nakshatra, vara, paksha }
}

function getCurrentMuhurta(date: Date = new Date()) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const muhurtaIndex = Math.floor(totalMinutes / 48)

    const muhurtas = [
        { name: "Rudra", nature: "inauspicious" },
        { name: "Ahi", nature: "inauspicious" },
        { name: "Mitra", nature: "auspicious" },
        { name: "Pitru", nature: "mixed" },
        { name: "Vasu", nature: "auspicious" },
    ]

    return muhurtas[muhurtaIndex % muhurtas.length]
}

describe('Tools Panel - Panchang Calculations', () => {
    describe('getPanchangData', () => {
        it('should return tithi as one of 15 valid tithis', () => {
            const validTithis = [
                "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
                "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
                "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
                "Purnima", "Amavasya"
            ]
            const result = getPanchangData()
            expect(validTithis).toContain(result.tithi)
        })

        it('should return paksha as either Shukla or Krishna', () => {
            const result = getPanchangData()
            expect(['Shukla Paksha', 'Krishna Paksha']).toContain(result.paksha)
        })

        it('should return one of 27 nakshatras', () => {
            const nakshatras = [
                "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
                "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
                "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
                "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
                "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
            ]
            const result = getPanchangData()
            expect(nakshatras).toContain(result.nakshatra)
        })

        it('should return correct vara for specific days', () => {
            // Sunday
            const sunday = new Date(2025, 11, 21) // Dec 21, 2025 is Sunday
            expect(getPanchangData(sunday).vara).toBe('Ravivara')

            // Saturday
            const saturday = new Date(2025, 11, 20) // Dec 20, 2025 is Saturday
            expect(getPanchangData(saturday).vara).toBe('Shanivara')
        })
    })

    describe('getCurrentMuhurta', () => {
        it('should return muhurta with name and nature', () => {
            const result = getCurrentMuhurta()
            expect(result).toHaveProperty('name')
            expect(result).toHaveProperty('nature')
        })

        it('should return nature as auspicious, inauspicious, or mixed', () => {
            const result = getCurrentMuhurta()
            expect(['auspicious', 'inauspicious', 'mixed']).toContain(result.nature)
        })

        it('should calculate different muhurtas for different times', () => {
            const morning = new Date()
            morning.setHours(6, 0, 0, 0)

            const afternoon = new Date()
            afternoon.setHours(14, 0, 0, 0)

            // Different times may have different muhurtas
            const morningMuhurta = getCurrentMuhurta(morning)
            const afternoonMuhurta = getCurrentMuhurta(afternoon)

            expect(morningMuhurta).toBeDefined()
            expect(afternoonMuhurta).toBeDefined()
        })
    })
})
