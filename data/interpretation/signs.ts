export const ZODIAC_SIGNS: Record<string, {
    id: string;
    name: string;
    sanskritName: string;
    lord: string;
    element: string;
    quality: string;
    description: string;
    strengths: string[];
    challenges: string[];
    healthTendencies: string[];
    traits: string[];
}> = {
    "Aries": {
        id: "aries",
        name: "Aries",
        sanskritName: "Mesha",
        lord: "Mars",
        element: "Fire",
        quality: "Cardinal",
        description: "The Pioneer. Aries represents new beginnings, courage, and raw energy. You are a natural leader who acts first and thinks later.",
        strengths: ["Courageous", "Determined", "Confident", "Enthusiastic", "Optimistic"],
        challenges: ["Impulsive", "Short-tempered", "Moody", "Aggressive"],
        healthTendencies: ["Headaches", "Migraines", "Eye strain", "Fevers"],
        traits: ["Bold leadership", "Direct communication", "High energy"]
    },
    "Taurus": {
        id: "taurus",
        name: "Taurus",
        sanskritName: "Vrishabha",
        lord: "Venus",
        element: "Earth",
        quality: "Fixed",
        description: "The Builder. Taurus represents stability, luxury, and persistence. You value security and material comforts.",
        strengths: ["Reliable", "Patient", "Practical", "Devoted", "Responsible"],
        challenges: ["Stubborn", "Possessive", "Uncompromising"],
        healthTendencies: ["Throat infections", "Thyroid issues", "Neck pain"],
        traits: ["Love for luxury", "Steady approach", "Artistic appreciation"]
    },
    "Gemini": {
        id: "gemini",
        name: "Gemini",
        sanskritName: "Mithuna",
        lord: "Mercury",
        element: "Air",
        quality: "Mutable",
        description: "The Messenger. Gemini represents duality, communication, and intellect. You are quick-witted and versatile.",
        strengths: ["Gentle", "Affectionate", "Curious", "Adaptable", "Quick learner"],
        challenges: ["Nervous", "Inconsistent", "Indecisive"],
        healthTendencies: ["Lung issues", "Nervous system disorders", "Arm/Shoulder pain"],
        traits: ["Intellectual curiosity", "Social butterfly", "Multitasking"]
    },
    "Cancer": {
        id: "cancer",
        name: "Cancer",
        sanskritName: "Karka",
        lord: "Moon",
        element: "Water",
        quality: "Cardinal",
        description: "The Nurturer. Cancer represents emotion, home, and intuition. You are deeply sensitive and protective of loved ones.",
        strengths: ["Tenacious", "Highly imaginative", "Loyal", "Emotional", "Sympathetic"],
        challenges: ["Moody", "Pessimistic", "Suspicious", "Manipulative"],
        healthTendencies: ["Digestive issues", "Chest/Breast/Rib problems", "Emotional retention"],
        traits: ["Emotional depth", "Protective nature", "Intuitive connection"]
    },
    "Leo": {
        id: "leo",
        name: "Leo",
        sanskritName: "Simha",
        lord: "Sun",
        element: "Fire",
        quality: "Fixed",
        description: "The King. Leo represents creativity, royalty, and self-expression. You have a natural flair for drama and leadership.",
        strengths: ["Creative", "Passionate", "Generous", "Warm-hearted", "Cheerful"],
        challenges: ["Arrogant", "Stubborn", "Self-centered", "Lazy"],
        healthTendencies: ["Heart issues", "Spinal problems", "Blood pressure"],
        traits: ["Natural leadership", "Charismatic presence", "Generosity"]
    },
    "Virgo": {
        id: "virgo",
        name: "Virgo",
        sanskritName: "Kanya",
        lord: "Mercury",
        element: "Earth",
        quality: "Mutable",
        description: "The Analyst. Virgo represents service, perfection, and detail. You have a sharp mind and a desire to help others.",
        strengths: ["Loyal", "Analytical", "Kind", "Hardworking", "Practical"],
        challenges: ["Shyness", "Worry", "Overly critical of self and others"],
        healthTendencies: ["Digestive system", "Nervous system", "Intestines"],
        traits: ["Attention to detail", "Service oriented", "Perfectionism"]
    },
    "Libra": {
        id: "libra",
        name: "Libra",
        sanskritName: "Tula",
        lord: "Venus",
        element: "Air",
        quality: "Cardinal",
        description: "The Diplomat. Libra represents balance, harmony, and relationships. You seek fairness and beauty in all things.",
        strengths: ["Cooperative", "Diplomatic", "Gracious", "Fair-minded", "Social"],
        challenges: ["Indecisive", "Avoids confrontations", "Will carry a grudge"],
        healthTendencies: ["Kidneys", "Lower back pain", "Balance issues"],
        traits: ["Diplomacy", "Aesthetic sense", "Justice seeking"]
    },
    "Scorpio": {
        id: "scorpio",
        name: "Scorpio",
        sanskritName: "Vrischika",
        lord: "Mars",
        element: "Water",
        quality: "Fixed",
        description: "The Mystic. Scorpio represents transformation, intensity, and secrets. You are powerful, passionate, and deeply intuitive.",
        strengths: ["Resourceful", "Brave", "Passionate", "Stubborn", "A true friend"],
        challenges: ["Distrusting", "Jealous", "Secretive", "Violent"],
        healthTendencies: ["Reproductive system", "Excretory system", "Infections"],
        traits: ["Intensity", "Resilience", "Occult interests"]
    },
    "Sagittarius": {
        id: "sagittarius",
        name: "Sagittarius",
        sanskritName: "Dhanu",
        lord: "Jupiter",
        element: "Fire",
        quality: "Mutable",
        description: "The Philosopher. Sagittarius represents expansion, freedom, and higher learning. You are an eternal optimist.",
        strengths: ["Generous", "Idealistic", "Great sense of humor"],
        challenges: ["Promises more than can deliver", "Very impatient", "Will say anything no matter how undiplomatic"],
        healthTendencies: ["Hips/Thighs", "Liver", "Sciatica"],
        traits: ["Optimism", "Love for travel", "Philosophical mind"]
    },
    "Capricorn": {
        id: "capricorn",
        name: "Capricorn",
        sanskritName: "Makara",
        lord: "Saturn",
        element: "Earth",
        quality: "Cardinal",
        description: "The Executive. Capricorn represents career, status, and discipline. You are ambitious and determined to succeed.",
        strengths: ["Responsible", "Disciplined", "Self-control", "Good managers"],
        challenges: ["Know-it-all", "Unforgiving", "Condescending", "Expecting the worst"],
        healthTendencies: ["Bones/Joints", "Knees", "Skin issues"],
        traits: ["Ambition", "Persistence", "Strategic planning"]
    },
    "Aquarius": {
        id: "aquarius",
        name: "Aquarius",
        sanskritName: "Kumbha",
        lord: "Saturn",
        element: "Air",
        quality: "Fixed",
        description: "The Visionary. Aquarius represents innovation, humanity, and future-thinking. You are unique and march to your own beat.",
        strengths: ["Progressive", "Original", "Independent", "Humanitarian"],
        challenges: ["Runs from emotional expression", "Temperamental", "Uncompromising"],
        healthTendencies: ["Circulation", "Ankles", "Nervous disorders"],
        traits: ["Innovation", "Humanitarianism", "Unconventional approach"]
    },
    "Pisces": {
        id: "pisces",
        name: "Pisces",
        sanskritName: "Meena",
        lord: "Jupiter",
        element: "Water",
        quality: "Mutable",
        description: "The Dreamer. Pisces represents spirituality, dreams, and compassion. You are deeply empathetic and artistic.",
        strengths: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise"],
        challenges: ["Fearful", "Overly trusting", "Sad", "Desire to escape reality"],
        healthTendencies: ["Feet", "Immune system", "Lymphatic system"],
        traits: ["Empathy", "Creativity", "Spiritual inclination"]
    }
}
