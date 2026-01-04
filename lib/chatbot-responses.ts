// Chatbot Response Handlers
// Extracted from astro-chatbot.tsx for better maintainability

import type { AstrologyUserData } from '@/types/astrology'

/**
 * Get the current moon phase (simplified calculation)
 */
export function getMoonPhase(): string {
    const phases = [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Last Quarter",
        "Waning Crescent",
    ]
    // Simple calculation based on lunar cycle (~29.5 days)
    const lunarCycle = 29.53
    const knownNewMoon = new Date('2024-01-11').getTime()
    const now = new Date().getTime()
    const daysSinceNewMoon = (now - knownNewMoon) / (1000 * 60 * 60 * 24)
    const cyclePosition = (daysSinceNewMoon % lunarCycle) / lunarCycle
    const phaseIndex = Math.floor(cyclePosition * 8) % 8
    return phases[phaseIndex]
}

/**
 * Generate chatbot response based on user query
 */
export function getBotResponse(userMessage: string, userData: AstrologyUserData): string {
    const message = userMessage.toLowerCase()
    const currentYear = new Date().getFullYear()
    const birthYear = 2005 // From userData.dob parsing

    // Jupiter Mahadasha queries
    if (message.includes("jupiter") || message.includes("mahadasha") || message.includes("guru")) {
        return `🪐 **Your Jupiter Mahadasha (2011-2027)** 

You're currently in year ${currentYear - 2011 + 1} of your 16-year Jupiter period! Jupiter in your 9th house (Libra) is bringing:

✨ **Current Benefits:**
• Wisdom and higher learning opportunities
• Teaching and mentoring abilities
• Spiritual growth and dharmic pursuits
• Recognition as a guide/counselor
• Foreign connections and collaborations

📈 **Progress:** ${Math.round(((currentYear - 2011) / 16) * 100)}% complete

⏰ **Remaining Time:** ${16 - (currentYear - 2011)} years until Saturn Mahadasha begins (July 2027)

🎯 **Focus Areas:** Complete your education, establish yourself as a healer/teacher, and prepare for Saturn's disciplinary period ahead.

The final years of Jupiter (2025-2027) are crucial for setting foundations for your Saturn period success!`
    }

    // Love and marriage queries
    if (
        message.includes("love") ||
        message.includes("marriage") ||
        message.includes("soulmate") ||
        message.includes("relationship")
    ) {
        return `💕 **Your Love & Marriage Destiny**

Based on Venus in 10th house (Scorpio) and 7th house analysis:

🌟 **Current Status:** You're in the transformative relationship phase (2024-2026) during Sade Sati peak - perfect for personal growth!

💍 **Marriage Timing:**
• **Avoid:** 2024-2027 (too much Saturn pressure)
• **Optimal:** 2030-2032 (85-90% favorable)
• **Good:** 2027-2029 (70% favorable)

👑 **Your Soulmate Will Be:**
• Generous, caring, and morally strong
• From educated, respected family
• Supportive of your spiritual/career goals
• Possibly foreign connection (Rahu in 2nd)
• Brings financial stability and respect

🔮 **No Mangal Dosha** - clear path to harmonious marriage!

Current phase is about learning emotional maturity. Your soulmate recognition happens around 2028-2030! 💫`
    }

    // Sade Sati queries
    if (message.includes("sade sati") || message.includes("saturn") || message.includes("shani")) {
        return `🌙 **Your Sade Sati Journey - Setting Phase**

**Current Status:** Setting Phase (March 2025 - June 2027)

📊 **Progress:** You've completed the most challenging Peak phase! Now in gradual relief period.

✅ **Completed Phases:**
• Rising (2020-2022): Character building ✓
• Peak (2023-2025): Maximum transformation ✓

🌅 **Current Setting Phase Benefits:**
• Gradual relief from Saturn's pressure
• Stabilization of life circumstances  
• Reaping benefits of your transformation
• Building on lessons learned

⏰ **Complete Relief:** June 2027 (just 2 years left!)

🛡️ **Management Tips:**
• Continue disciplined routines
• Practice patience and humility
• Focus on service and helping others
• Strengthen Saturn with blue sapphire (after consultation)
• Chant "Om Namah Shivaya" daily

You're in the final stretch - the worst is behind you! 💪`
    }

    // Career queries
    if (
        message.includes("career") ||
        message.includes("job") ||
        message.includes("profession") ||
        message.includes("work")
    ) {
        return `💼 **Your Career Destiny Analysis**

Based on your chart, here are your top career paths with compatibility scores:

🏆 **Highest Compatibility (90-95%):**
• Psychology & Touch Therapy (95%) - Shatabhisha healing powers
• Teaching & Writing (90%) - Jupiter-Mercury in 9th house
• Astrology & Occult Sciences (90%) - 8th house Sun-Ketu intuition

🎯 **Excellent Matches (80-85%):**
• Medical Field - Doctor/Surgeon (85%)
• Yoga Training & Spirituality (85%)
• Electrical/Nuclear Physics (80%) - Aquarius technical mind

💰 **Income Timeline:**
• 2024-2027: ₹5-20 Lakhs (Education completion)
• 2027-2032: ₹20-50 Lakhs (Saturn discipline)
• 2032-2040: ₹50L-1.5 Crores (Peak earning)
• 2040+: ₹1.5-3+ Crores (Established practice)

🌟 **Key Insight:** You're destined to be a healer, teacher, and guide. Independent practice will bring maximum success!

Venus in 10th house indicates career recognition and authority position by age 30! 🚀`
    }

    // Health queries
    if (message.includes("health") || message.includes("remedy") || message.includes("healing")) {
        return `🌿 **Your Health & Remedies Guide**

**Vulnerable Areas (from your chart):**
• Circulation & blood issues (Aquarius lagna)
• Heart & hypertension (Saturn influence)
• Nervous system & anxiety (Rahu-Moon)
• Eye strain after age 30
• Digestive issues (Sun in 8th)

💊 **Preventive Remedies:**
• **Saturn Strengthening:** Blue sapphire (after consultation), iron supplements
• **Moon Balancing:** Chant "Om Chandraya Namah" 108x on Mondays
• **Circulation:** Regular cardio, avoid smoking/alcohol
• **Nervous System:** Meditation, pranayama, adequate sleep
• **Digestive:** Avoid spicy food, eat at regular times

🌟 **Natural Healing Abilities:**
Your Shatabhisha nakshatra gives you exceptional healing powers! You can heal others through:
• Touch therapy and energy healing
• Psychological counseling
• Spiritual guidance
• Herbal medicine knowledge

🔮 **Health Timeline:** Major improvements after Sade Sati ends (June 2027). Your healing abilities will be your greatest strength! 💫`
    }

    // Spiritual queries
    if (
        message.includes("spiritual") ||
        message.includes("purpose") ||
        message.includes("moksha") ||
        message.includes("dharma")
    ) {
        return `🕉️ **Your Spiritual Path & Life Purpose**

**Soul Mission:** You have strong Moksha Yoga - destined for spiritual liberation and guiding others!

🌟 **Your Dharma:**
• Healing and serving humanity (Shatabhisha nakshatra)
• Teaching wisdom and higher knowledge (Jupiter in 9th)
• Bridging ancient wisdom with modern science
• Helping others find their spiritual path

🧘 **Spiritual Practices for You:**
• **Daily:** "Om Namah Shivaya" 108 times
• **Mondays:** Moon worship for emotional balance
• **Saturdays:** Saturn prayers for discipline
• **Meditation:** Focus on Ajna chakra (third eye)
• **Service:** Help those in need, especially healing

🔮 **Spiritual Timeline:**
• **Current (2024-2027):** Spiritual awakening intensifies
• **2027-2035:** Establishing as spiritual teacher/healer
• **2035+:** Recognized spiritual guide and wisdom keeper

**Past Life Karma:** 13/4 karmic debt indicates you must overcome laziness through disciplined service. Your spiritual evolution accelerates after age 30!

You're destined to become a bridge between the material and spiritual worlds! 🌈`
    }

    // Numerology queries
    if (message.includes("numerology") || message.includes("13") || message.includes("karmic debt")) {
        return `🔢 **Your Numerology - Life Path 13/4 (Karmic Debt)**

**Karmic Debt 13:** Past life patterns of laziness and procrastination that must be transformed.

**Foundation Number 4:** Building, discipline, hard work, and creating lasting value.

📊 **Life Phases:**
• **Karmic Clearing (0-22):** Confusion, spiritual awakening ✓
• **Dharma Alignment (23-30):** Career clarity, soulmate connections 🔄
• **Success & Impact (30-38):** Peak achievement period 🔮
• **Wisdom & Legacy (39+):** Teacher role, lasting legacy 🔮

⚡ **Current Challenge:** Overcoming procrastination and self-sabotage patterns

🛠️ **Transformation Tools:**
• Daily structured routines
• Service to others without expectation
• Building something of lasting value
• Disciplined spiritual practice
• Taking responsibility for your growth

🌟 **The Gift:** Once you master discipline, you become incredibly successful and help others overcome similar challenges.

Your karmic debt is clearing rapidly during this Sade Sati period! By age 30, you'll have transformed completely! 💫`
    }

    // Yoga and aspects queries
    if (message.includes("yoga") || message.includes("aspect") || message.includes("combination")) {
        return `🎯 **Your Powerful Yogas & Planetary Combinations**

**Major Yogas in Your Chart:**

🏆 **Gajakesari Yoga (85% strength):**
• Jupiter-Moon combination for wisdom & prosperity
• Brings fame, wealth, and respect in society
• Active throughout life, peaks during Jupiter periods

👑 **Raj Yoga (90% strength):**
• 9th and 10th lord conjunction in 9th house
• Authority, recognition, and high status guaranteed
• Manifests strongly after age 25

💰 **Dhana Yoga (78% strength):**
• Multiple wealth combinations
• Self-made prosperity through own efforts
• Foreign wealth connections (Rahu in 2nd)

🧘 **Moksha Yoga (85% strength):**
• Strong spiritual liberation tendencies
• Natural wisdom and teaching abilities
• Destined to guide others spiritually

⚡ **Vipreet Raj Yoga (72% strength):**
• Success after overcoming adversities
• Transforms obstacles into opportunities
• Strongest during challenging periods

**Current Activation:** Your Raj Yoga is activating strongly now (Jupiter period + Saturn maturity). Expect recognition and authority in your field by 2027! 🚀`
    }

    // Daily predictions
    if (message.includes("today") || message.includes("daily") || message.includes("current")) {
        const today = new Date()
        const dayOfWeek = today.getDay()
        let dayAnalysis = ""

        if (dayOfWeek === 6) {
            dayAnalysis =
                "🌟 **Excellent Day!** Saturday is your most favorable day (Saturn's day, your lagna lord). Perfect for important decisions, discipline, and long-term planning."
        } else if (dayOfWeek === 3) {
            dayAnalysis =
                "✨ **Great Day!** Wednesday is favorable (Mercury's day, 9th house lord). Excellent for learning, teaching, communication, and intellectual work."
        } else if (dayOfWeek === 5) {
            dayAnalysis =
                "💫 **Good Day!** Friday is favorable (Venus's day, 10th house lord). Great for creative work, relationships, and career matters."
        } else if (dayOfWeek === 4) {
            dayAnalysis =
                "⚠️ **Challenging Day!** Thursday is unfavorable as per your chart. Avoid important decisions, practice patience, focus on routine tasks."
        } else {
            dayAnalysis =
                "🌙 **Moderate Day!** Mixed planetary influences. Maintain balance and follow your regular routines."
        }

        return `📅 **Today's Cosmic Weather for You**

${dayAnalysis}

🔮 **Current Planetary Influences:**
• **Jupiter Mahadasha:** Wisdom and expansion energy (Year ${currentYear - 2011 + 1}/16)
• **Sade Sati Setting:** Gradual relief and stabilization
• **Moon Phase:** ${getMoonPhase()} - affects your emotional energy

⭐ **Today's Guidance:**
• **Focus:** Learning, teaching, and healing activities
• **Avoid:** Impulsive decisions during Saturn influence
• **Mantra:** "Om Namah Shivaya" for inner strength
• **Color:** Blue or black for Saturn's blessings

🌟 **Opportunity:** Use Jupiter's wisdom energy to help others and expand your knowledge. Your healing abilities are particularly strong right now!

Remember: You're in the final phase of your major transformation period. Stay disciplined and patient! 💪`
    }

    // Default response for unrecognized queries
    return `🌟 **I'm here to help with your cosmic journey!**

I have complete access to your birth chart analysis including:

📊 **Available Insights:**
• Planetary positions and their effects
• Current and upcoming dasha periods  
• Marriage timing and soulmate characteristics
• Career compatibility and income timeline
• Health vulnerabilities and remedies
• Spiritual path and life purpose
• Yogas, aspects, and combinations
• Daily predictions and guidance

💫 **Popular Questions:**
• "What's my Jupiter period bringing?"
• "When will I meet my soulmate?"
• "How to handle Sade Sati?"
• "Best career path for me?"
• "Health remedies needed?"
• "My spiritual purpose?"

Ask me anything specific about your destiny, relationships, career, health, or spiritual growth! I'm powered by your complete Vedic astrology report. 🔮✨`
}

/**
 * Quick question presets for the chatbot
 */
export const QUICK_QUESTIONS = [
    { text: "What's my Jupiter period bringing?", icon: "🪐" },
    { text: "When will I meet my soulmate?", icon: "💕" },
    { text: "How to handle Sade Sati?", icon: "🌙" },
    { text: "Best career path for me?", icon: "💼" },
    { text: "Health remedies needed?", icon: "🌿" },
    { text: "My spiritual purpose?", icon: "🕉️" },
]
