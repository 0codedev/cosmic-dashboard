export const DASHA_PERIODS = {
    // Standard Vimshottari Dasha Sequence and Duration (Years)
    // Order: Sun (6) -> Moon (10) -> Mars (7) -> Rahu (18) -> Jupiter (16) -> Saturn (19) -> Mercury (17) -> Ketu (7) -> Venus (20)
    // Total Cycle: 120 Years
    "Ketu": { years: 7, next: "Venus" },
    "Venus": { years: 20, next: "Sun" },
    "Sun": { years: 6, next: "Moon" },
    "Moon": { years: 10, next: "Mars" },
    "Mars": { years: 7, next: "Rahu" },
    "Rahu": { years: 18, next: "Jupiter" },
    "Jupiter": { years: 16, next: "Saturn" },
    "Saturn": { years: 19, next: "Mercury" },
    "Mercury": { years: 17, next: "Ketu" }
};

export const NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", // 1-9 (Ashwini to Ashlesha)
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", // 10-18 (Magha to Jyeshtha)
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"  // 19-27 (Mula to Revati)
];
