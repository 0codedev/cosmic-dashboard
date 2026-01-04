export const NAKSHATRAS: Record<string, {
    id: string;
    name: string;
    ruler: string;
    deity: string;
    symbol: string;
    description: string;
    qualities: string[];
}> = {
    "Ashwini": {
        id: "ashwini",
        name: "Ashwini",
        ruler: "Ketu",
        deity: "Ashwini Kumaras",
        symbol: "Horse's Head",
        description: "The Star of Transport. Energetic, fast, and pioneers.",
        qualities: ["Healing", "Speed", "Initialization"]
    },
    "Bharani": {
        id: "bharani",
        name: "Bharani",
        ruler: "Venus",
        deity: "Yama",
        symbol: "Yoni",
        description: "The Star of Restraint. Creative, bearing burdens, and transformation.",
        qualities: ["Transformation", "Extremes", "Creativity"]
    },
    "Krittika": {
        id: "krittika",
        name: "Krittika",
        ruler: "Sun",
        deity: "Agni",
        symbol: "Razor",
        description: "The Star of Fire. Sharp, cutting, and purifying.",
        qualities: ["Purification", "Cutting ties", "Digestive power"]
    },
    "Rohini": {
        id: "rohini",
        name: "Rohini",
        ruler: "Moon",
        deity: "Brahma",
        symbol: "Chariot",
        description: "The Star of Ascent. Growth, fertility, and creativity.",
        qualities: ["Growth", "Beauty", "Materialism"]
    },
    "Mrigashira": {
        id: "mrigashira",
        name: "Mrigashira",
        ruler: "Mars",
        deity: "Soma",
        symbol: "Deer's Head",
        description: "The Searching Star. Curious, traveler, and sensitive.",
        qualities: ["Searching", "Tenderness", "Restlessness"]
    },
    "Ardra": {
        id: "ardra",
        name: "Ardra",
        ruler: "Rahu",
        deity: "Rudra",
        symbol: "Teardrop",
        description: "The Star of Sorrow. Storms, destruction, and intense emotion.",
        qualities: ["Destruction", "Effort", "Transformation"]
    },
    "Punarvasu": {
        id: "punarvasu",
        name: "Punarvasu",
        ruler: "Jupiter",
        deity: "Aditi",
        symbol: "Bow and Quiver",
        description: "The Star of Renewal. Return of the light, safety, and abundance.",
        qualities: ["Renewal", "Protection", "Simplicity"]
    },
    "Pushya": {
        id: "pushya",
        name: "Pushya",
        ruler: "Saturn",
        deity: "Brihaspati",
        symbol: "Cow's Udder",
        description: "The Star of Nourishment. Spiritual, caring, and nurturing.",
        qualities: ["Nourishment", "Spirituality", "Reliability"]
    },
    "Ashlesha": {
        id: "ashlesha",
        name: "Ashlesha",
        ruler: "Mercury",
        deity: "Nagas",
        symbol: "Coiled Serpent",
        description: "The Clinging Star. Intense, hypnotizing, and penetrative.",
        qualities: ["Entwinement", "Kundalini", "Insight"]
    },
    "Magha": {
        id: "magha",
        name: "Magha",
        ruler: "Ketu",
        deity: "Pitris",
        symbol: "Royal Throne",
        description: "The Royal Star. Leadership, lineage, and authority.",
        qualities: ["Authority", "Tradition", "Ego"]
    },
    "Purva Phalguni": {
        id: "purvaphalguni",
        name: "Purva Phalguni",
        ruler: "Venus",
        deity: "Bhaga",
        symbol: "Front legs of bed",
        description: "The Star of Fortune. Enjoyment, romance, and creativity.",
        qualities: ["Enjoyment", "Relaxation", "Social"]
    },
    "Uttara Phalguni": {
        id: "uttaraphalguni",
        name: "Uttara Phalguni",
        ruler: "Sun",
        deity: "Aryaman",
        symbol: "Back legs of bed",
        description: "The Star of Patronage. Friendship, helpfulness, and agreements.",
        qualities: ["Friendship", "Commitment", "Support"]
    },
    "Hasta": {
        id: "hasta",
        name: "Hasta",
        ruler: "Moon",
        deity: "Savitr",
        symbol: "Hand",
        description: "The Golden Handed Star. Skill, dexterity, and healing.",
        qualities: ["Skill", "Manifestation", "Comedy"]
    },
    "Chitra": {
        id: "chitra",
        name: "Chitra",
        ruler: "Mars",
        deity: "Vishwakarma",
        symbol: "Pearl / Jewel",
        description: "The Star of Opportunity. Brilliance, design, and aesthetics.",
        qualities: ["Design", "Illusion", "Architecture"]
    },
    "Swati": {
        id: "swati",
        name: "Swati",
        ruler: "Rahu",
        deity: "Vayu",
        symbol: "Coral / Shoot",
        description: "The Self-Going Star. Independence, mobility, and adaptability.",
        qualities: ["Independence", "Movement", "Balance"]
    },
    "Vishakha": {
        id: "vishakha",
        name: "Vishakha",
        ruler: "Jupiter",
        deity: "Indra-Agni",
        symbol: "Triumphal Arch",
        description: "The Star of Purpose. Goal-oriented, competitive, and focused.",
        qualities: ["Goal-oriented", "Fixation", "Triumph"]
    },
    "Anuradha": {
        id: "anuradha",
        name: "Anuradha",
        ruler: "Saturn",
        deity: "Mitra",
        symbol: "Lotus",
        description: "The Star of Success. Friendship, devotion, and travel.",
        qualities: ["Devotion", "Exploration", "Friendship"]
    },
    "Jyeshtha": {
        id: "jyeshtha",
        name: "Jyeshtha",
        ruler: "Mercury",
        deity: "Indra",
        symbol: "Umbrella / Earring",
        description: "The Chief Star. Seniority, protection, and occult power.",
        qualities: ["Seniority", "Control", "Courage"]
    },
    "Mula": {
        id: "mula",
        name: "Mula",
        ruler: "Ketu",
        deity: "Nirriti",
        symbol: "Roots",
        description: "The Root Star. Investigation, calamity, and getting to the bottom.",
        qualities: ["Investigation", "Destruction", "Roots"]
    },
    "Purva Ashadha": {
        id: "purvaashadha",
        name: "Purva Ashadha",
        ruler: "Venus",
        deity: "Apas",
        symbol: "Winnowing Basket",
        description: "The Invincible Star. Optimism, purification, and renewal.",
        qualities: ["Invincibility", "Water", "Purification"]
    },
    "Uttara Ashadha": {
        id: "uttaraashadha",
        name: "Uttara Ashadha",
        ruler: "Sun",
        deity: "Vishwadevas",
        symbol: "Elephant Tusk",
        description: "The Universal Star. Endurance, victory, and integrity.",
        qualities: ["Endurance", "Universality", "Victory"]
    },
    "Shravana": {
        id: "shravana",
        name: "Shravana",
        ruler: "Moon",
        deity: "Vishnu",
        symbol: "Ear",
        description: "The Star of Learning. Listening, education, and knowledge.",
        qualities: ["Listening", "Education", "Travel"]
    },
    "Dhanishta": {
        id: "dhanishta",
        name: "Dhanishta",
        ruler: "Mars",
        deity: "The Vasus",
        symbol: "Drum / Flute",
        description: "The Star of Symphony. Wealth, music, and fame.",
        qualities: ["Wealth", "Music", "Timing"]
    },
    "Shatabhisha": {
        id: "shatabhisha",
        name: "Shatabhisha",
        ruler: "Rahu",
        deity: "Varuna",
        symbol: "Empty Circle",
        description: "The Veiling Star. Healing, secrets, and philosophical.",
        qualities: ["Healing", "Secrets", "Philosophy", "Research"]
    },
    "Purva Bhadrapada": {
        id: "purvabhadrapada",
        name: "Purva Bhadrapada",
        ruler: "Jupiter",
        deity: "Aja Ekapada",
        symbol: "Front of Funeral Cot",
        description: "The Burning Pair. Idealism, intensity, and transformation.",
        qualities: ["Idealism", "Transformation", "Intensity"]
    },
    "Uttara Bhadrapada": {
        id: "uttarabhadrapada",
        name: "Uttara Bhadrapada",
        ruler: "Saturn",
        deity: "Ahir Budhnya",
        symbol: "Back of Funeral Cot",
        description: "The Warrior Star. Deep wisdom, patience, and control.",
        qualities: ["Wisdom", "Patience", "Control"]
    },
    "Revati": {
        id: "revati",
        name: "Revati",
        ruler: "Mercury",
        deity: "Pushan",
        symbol: "Fish",
        description: "The Wealthy Star. Nourishment, journeys, and protection.",
        qualities: ["Nourishment", "Protection", "Guidance"]
    }
}
