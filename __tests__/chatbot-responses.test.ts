import { describe, it, expect } from 'vitest'
import { getBotResponse, getMoonPhase, QUICK_QUESTIONS } from '@/lib/chatbot-responses'
import { SUDHANSHU_DATA } from '@/data/user-data'

describe('Chatbot Responses', () => {
    describe('getBotResponse', () => {
        it('should respond to Jupiter Mahadasha queries', () => {
            const response = getBotResponse('Tell me about my jupiter period', SUDHANSHU_DATA)
            expect(response).toContain('Jupiter Mahadasha')
            expect(response).toContain('2011-2027')
        })

        it('should respond to love/marriage queries', () => {
            const response = getBotResponse('When will I find my soulmate?', SUDHANSHU_DATA)
            expect(response).toContain('Love')
            expect(response).toContain('Marriage')
        })

        it('should respond to Sade Sati queries', () => {
            const response = getBotResponse('What about my sade sati?', SUDHANSHU_DATA)
            expect(response).toContain('Sade Sati')
            expect(response).toContain('Saturn')
        })

        it('should respond to career queries', () => {
            const response = getBotResponse('Best career for me?', SUDHANSHU_DATA)
            expect(response).toContain('Career')
            expect(response).toContain('Compatibility')
        })

        it('should respond to health queries', () => {
            const response = getBotResponse('What are my health remedies?', SUDHANSHU_DATA)
            expect(response).toContain('Health')
            expect(response).toContain('Remedies')
        })

        it('should respond to spiritual queries', () => {
            const response = getBotResponse('What is my spiritual purpose?', SUDHANSHU_DATA)
            expect(response).toContain('Spiritual')
            expect(response).toContain('Purpose')
        })

        it('should respond to numerology queries', () => {
            const response = getBotResponse('Tell me about my numerology', SUDHANSHU_DATA)
            expect(response).toContain('Numerology')
            expect(response).toContain('13/4')
        })

        it('should provide default response for unrecognized queries', () => {
            const response = getBotResponse('random gibberish xyz123', SUDHANSHU_DATA)
            expect(response).toContain('I\'m here to help')
            expect(response).toContain('Available Insights')
        })
    })

    describe('getMoonPhase', () => {
        it('should return a valid moon phase', () => {
            const phase = getMoonPhase()
            const validPhases = [
                'New Moon',
                'Waxing Crescent',
                'First Quarter',
                'Waxing Gibbous',
                'Full Moon',
                'Waning Gibbous',
                'Last Quarter',
                'Waning Crescent',
            ]
            expect(validPhases).toContain(phase)
        })
    })

    describe('QUICK_QUESTIONS', () => {
        it('should have 6 quick questions', () => {
            expect(QUICK_QUESTIONS).toHaveLength(6)
        })

        it('should have text and icon properties', () => {
            QUICK_QUESTIONS.forEach((question) => {
                expect(question).toHaveProperty('text')
                expect(question).toHaveProperty('icon')
                expect(typeof question.text).toBe('string')
                expect(typeof question.icon).toBe('string')
            })
        })
    })
})
