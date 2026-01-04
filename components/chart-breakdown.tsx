"use client"

import { useState, useMemo, memo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PDFExportButton from "@/components/pdf-export-button"
import AshtakvargaAnalysis from "@/components/ashtakvarga-analysis"
import VarshphalChart from "@/components/varshphal-chart"
import NorthIndianChart from "@/components/north-indian-chart"
import { calculateAllDivisionalCharts, DivisionalResult } from "@/lib/divisional-engine"
import { calculateFullShadbala, ShadbalaResult } from "@/lib/shadbala-engine"
import { calculateTransits, calculateTransitToNatalAspects } from "@/lib/transit-engine"
import { checkYogas, groupYogasByCategory } from "@/lib/yoga-engine"
import { useAstrologyStore } from "@/stores/astrology-store"
import { Sparkles, Gem, Activity, Heart, Shield } from "lucide-react"

function ChartBreakdown() {
  const { userData } = useAstrologyStore()
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const [activeChart, setActiveChart] = useState("d1")

  // Reconstruct planetary data from the hardcoded analysis for dynamic calculation
  // Base Longitudes (Sudhanshu's Chart Data)
  const planetaryLongitudes = useMemo(() => ({
    "Ascendant": 315.00, // Aquarius Lagna (Approx)
    "Sun": 169.00,       // Virgo ~19 deg (conjunct Ketu)
    "Moon": 315.72,      // Aquarius 15°43'
    "Mars": 24.60,       // Aries 24°36'
    "Mercury": 194.63,   // Libra 14°38'
    "Jupiter": 183.53,   // Libra 3°32'
    "Venus": 217.46,     // Scorpio 7°28'
    "Saturn": 105.99,    // Cancer 15°59'
    "Rahu": 349.36,      // Pisces 19°22'
    "Ketu": 169.36       // Virgo 19°22'
  }), []);

  // Calculate All Divisional Charts
  const divisionalCharts = useMemo(() => {
    return calculateAllDivisionalCharts(planetaryLongitudes);
  }, [planetaryLongitudes]);

  // Calculate Full Shadbala
  const shadbala = useMemo(() => {
    return calculateFullShadbala(
      planetaryLongitudes,
      { "Saturn": true, "Mercury": false, "Jupiter": false, "Venus": false, "Mars": false },
      planetaryLongitudes.Ascendant,
      true,
      10
    );
  }, [planetaryLongitudes]);

  // Calculate Transits
  const transits = useMemo(() => {
    const currentTransits = calculateTransits(new Date());
    const aspects = calculateTransitToNatalAspects(currentTransits, planetaryLongitudes);
    return { positions: currentTransits, aspects };
  }, [planetaryLongitudes]);

  // Calculate Yogas
  const yogaResults = useMemo(() => {
    // Convert keys to lowercase for engine
    const positions: Record<string, number> = {};
    Object.entries(planetaryLongitudes).forEach(([k, v]) => {
      positions[k.toLowerCase()] = v;
    });
    // Add lagna
    const lagna = 314.55; // Sudhanshu's Lagna (Aquarius ~14 deg)
    const yogas = checkYogas(positions, lagna);
    return groupYogasByCategory(yogas);
  }, [planetaryLongitudes]);

  // Helper to convert engine result to component format
  const getChartData = (vargaResult: Record<string, DivisionalResult>) => {
    // Short names map
    const shortNames: Record<string, string> = {
      "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
      "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke",
      "Ascendant": "Asc"
    };

    // 1. Determine Ascendant Sign for the Varga
    // In engine, "Ascendant" is just another point.
    // Result gives signIndex for every point including Ascendant.
    const ascSignIndex = vargaResult["Ascendant"]?.signIndex || 0;

    // 2. Map Houses relative to Ascendant
    // house 1 = ascSignIndex
    const houses: Record<number, { sign: string, planets: string[] }> = {};
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    // Initialize 12 houses
    for (let i = 1; i <= 12; i++) {
      const currentSignIndex = (ascSignIndex + (i - 1)) % 12;
      houses[i] = {
        sign: signs[currentSignIndex],
        planets: []
      };
    }

    // 3. Place Planets
    Object.entries(vargaResult).forEach(([planet, data]) => {
      if (planet === "Ascendant") return;

      // Find which house this planet falls in relative to Ascendant
      // House # = (PlanetSign - AscSign + 12) % 12 + 1
      const planetSignIndex = data.signIndex;
      const houseNum = ((planetSignIndex - ascSignIndex + 12) % 12) + 1;

      if (houses[houseNum]) {
        houses[houseNum].planets.push(shortNames[planet] || planet.substring(0, 2));
      }
    });

    return {
      name: "Divisional Chart",
      houses
    };
  };


  // Complete house-by-house data from PDF analysis with enhanced details
  const houseData = {
    1: {
      sign: "Aquarius",
      planets: ["Moon"],
      ruler: "Saturn",
      strength: "strong",
      nakshatra: "Shatabhisha (Ruled by Rahu)",
      meaning: "Self, Identity, Physical Body, Personality, Overall Life Direction",
      houseRepresents: "Mind, Physical Appearance, Health, Personality, Life Path, First Impressions",
      planetaryAnalysis:
        "Moon in 1st house Aquarius at 15°43'40\" in Shatabhisha nakshatra creates a unique personality blend. This placement makes you highly intuitive and emotionally sensitive, yet intellectually detached. The Moon in Aquarius gives humanitarian instincts and innovative thinking. Being in Shatabhisha nakshatra (ruled by Rahu), you possess natural healing abilities and mystical insights. This combination creates a personality that appears calm and logical on the surface but has deep emotional currents underneath. You're naturally drawn to helping others and have an innate understanding of human psychology.",
      interpretation: {
        signMeaning:
          "Aquarius rising makes you intelligent, analytical, and independent-minded. You have humanitarian instincts and are naturally drawn to progressive causes. Your approach to life is scientific yet spiritual, often questioning conventional wisdom. You possess natural leadership qualities but prefer to lead through innovation rather than authority. There's an inherent rebellious streak that drives you to challenge outdated systems and create positive change in society.",
        planetEffect:
          "Moon in the 1st house makes you highly sensitive to your environment and the emotions of others. You have a changeable nature and your moods can shift like the lunar phases. This placement gives you strong intuitive abilities and makes you naturally empathetic. You tend to absorb the energy around you, which can be both a gift and a challenge. Your emotional well-being is closely tied to your sense of identity and how others perceive you.",
        nakshatraEffect:
          "Shatabhisha nakshatra, known as the 'Hundred Healers,' grants you natural healing abilities and a deep interest in mystical sciences. You have an innate understanding of energy healing, astrology, and alternative medicine. This nakshatra makes you secretive about your true abilities and gives you a scientific approach to spirituality. You're naturally drawn to research and investigation, especially in fields that bridge science and spirituality.",
        pastLife:
          "In early life, you may have felt different from your peers, often misunderstood by family members who couldn't grasp your unique perspective. You likely showed early signs of psychic sensitivity and humanitarian concerns that seemed beyond your years.",
        present:
          "You're currently in a phase of emotional transformation and identity evolution. Learning to balance your logical mind with your intuitive heart is a key theme. You're becoming more confident in expressing your uniqueness and standing up for your beliefs.",
        future:
          "Your spiritual and intellectual powers will continue to strengthen, potentially leading to recognition as a healer, guide, or innovator. There's strong potential for fame in fields related to technology, healing, or humanitarian work. Your unique perspective will eventually be valued by society.",
      },
      remedies: [
        "Chant 'Om Chandraya Namah' 108 times on Mondays to strengthen Moon",
        "Donate white items like rice, milk, or silver on Mondays",
        "Practice moon gazing and connect with water bodies for emotional balance",
        "Wear pearl or moonstone to enhance lunar energy",
        "Study healing sciences like Ayurveda, astrology, or psychology",
      ],
      aspects: [
        "Saturn's 3rd aspect from 6th house brings mental discipline but can create self-criticism",
        "Jupiter's 5th aspect from 9th house provides divine protection and wisdom",
        "Mars' 8th aspect from 3rd house gives courage but can create emotional intensity",
      ],
    },
    2: {
      sign: "Pisces",
      planets: ["Rahu"],
      ruler: "Jupiter",
      strength: "moderate",
      nakshatra: "Purva Bhadrapada/Uttara Bhadrapada",
      meaning: "Wealth, Speech, Family, Food, Values, Early Childhood",
      houseRepresents: "Money, Family Relationships, Speech, Food Habits, Values, Self-Worth",
      planetaryAnalysis:
        "Rahu in 2nd house Pisces at 19°12'55\" creates intense desires around wealth and family matters. This placement indicates unconventional sources of income and a unique relationship with family values. Rahu in Pisces amplifies spiritual and mystical tendencies in speech and values. You may have unusual food preferences and a tendency to speak about metaphysical subjects. This position can create sudden gains through creative or spiritual pursuits, but also indicates karmic lessons around materialism versus spirituality.",
      interpretation: {
        signMeaning:
          "Pisces in the 2nd house brings a mystical and intuitive approach to wealth and family matters. You have deep emotional connections to your values and may find that your spiritual beliefs strongly influence your financial decisions. There's a tendency to be generous, sometimes to a fault, and you may struggle with practical money management due to your idealistic nature.",
        planetEffect:
          "Rahu creates intense cravings around money, leading to unconventional earning methods. Your speech may be unusually persuasive or mystical in nature. Family relationships can be complex, with karmic patterns that need resolution. You may experience sudden gains and losses in wealth, teaching you detachment from material possessions.",
        nakshatraEffect:
          "The influence of Purva/Uttara Bhadrapada brings transformative energy to your values and wealth. You're likely to earn through spiritual or healing work, and your speech has the power to transform others. There's a natural inclination toward charitable activities and using wealth for higher purposes.",
        pastLife:
          "Early family dynamics may have felt confusing or emotionally intense. You might have experienced feelings of not quite fitting in with family values or traditions, leading to a search for your own spiritual path.",
        present:
          "You're learning to balance material needs with spiritual values. Your relationship with money is evolving, and you're discovering new ways to earn that align with your higher purpose. Family relationships are undergoing transformation.",
        future:
          "Strong financial growth is possible through spiritual or creative endeavors. Your unique perspective on values and wealth will eventually lead to prosperity. Public speaking or writing about mystical subjects could become a significant source of income.",
      },
      remedies: [
        "Chant 'Om Raam Rahave Namah' 108 times daily",
        "Donate coconut, black sesame, or mustard oil on Saturdays",
        "Maintain a sattvic diet and avoid excessive spices or intoxicants",
        "Resolve family karma through forgiveness and understanding",
        "Strengthen Jupiter through charity and teaching",
      ],
      aspects: [
        "Moon from 1st house creates emotional influence on speech and values",
        "Saturn's 9th aspect brings discipline to financial matters",
      ],
    },
    3: {
      sign: "Aries",
      planets: ["Mars (Retrograde)"],
      ruler: "Mars",
      strength: "excellent",
      nakshatra: "Krittika",
      meaning: "Courage, Siblings, Communication, Effort, Short Journeys",
      houseRepresents: "Brothers/Sisters, Courage, Communication Skills, Writing, Media, Sports",
      planetaryAnalysis:
        "Mars retrograde in its own sign Aries at 28°15'02\" in Krittika nakshatra is an exceptionally powerful placement. Mars being retrograde adds depth and introspection to your natural courage and communication abilities. This placement makes you a fearless communicator with the ability to cut through illusions and speak truth directly. The retrograde motion indicates that you've mastered courage in past lives and now use it more wisely. Krittika nakshatra, ruled by the Sun, gives you sharp, precise communication skills and the ability to purify situations through direct action.",
      interpretation: {
        signMeaning:
          "Mars in its own sign Aries gives you exceptional physical and mental strength. You have natural leadership abilities and aren't afraid to take initiative. Your approach to communication is direct and honest, sometimes brutally so. You have strong competitive instincts and excel in situations that require quick thinking and bold action.",
        planetEffect:
          "Mars retrograde in the 3rd house makes you a powerful communicator with deep insights. You have excellent relationships with siblings and are often seen as their protector. Your writing and speaking abilities are exceptional, with the power to inspire and motivate others. The retrograde aspect adds wisdom to your courage, making you choose your battles carefully.",
        nakshatraEffect:
          "Krittika nakshatra grants you the ability to cut through deception and reveal truth. Your communication style is sharp and precise, like a surgeon's knife. You have natural abilities in fields requiring precision and skill. This nakshatra also gives you purifying energy - your presence and words can cleanse negative situations.",
        pastLife:
          "You may have been overly aggressive or dominant in past lives, and now you're learning to use your power more constructively. Your relationship with siblings carries karmic significance, often involving protection or guidance.",
        present:
          "This is a time to harness your communication powers for positive change. You have the ability to start new projects and take calculated risks. Your courage is your greatest asset, but learning to temper it with wisdom is important.",
        future:
          "Success in leadership roles, entrepreneurship, or media is highly likely. Your ability to communicate with passion and precision will open many doors. You may become known for your bold initiatives and fearless approach to challenges.",
      },
      remedies: [
        "Chant 'Om Mangalaya Namah' 108 times on Tuesdays",
        "Engage in regular physical exercise, martial arts, or sports",
        "Donate red items or sponsor sports activities",
        "Practice anger management and conflict resolution",
        "Support younger siblings or mentor young people",
      ],
      aspects: [
        "Mars aspects 6th house, giving fighting spirit to overcome enemies",
        "Mars aspects 9th house, bringing courage to your belief system",
        "Mars aspects 10th house, creating strong career drive but potential authority conflicts",
      ],
    },
    4: {
      sign: "Taurus",
      planets: [],
      ruler: "Venus",
      strength: "moderate",
      nakshatra: "Krittika/Rohini influence",
      meaning: "Home, Mind, Comforts, Mother, Education, Inner Peace",
      houseRepresents: "Mother, Home Environment, Emotional Security, Education, Property, Vehicles",
      planetaryAnalysis:
        "The 4th house being empty but ruled by Venus in the 10th house creates an interesting dynamic. Your emotional fulfillment comes through career achievements rather than traditional home comforts. Venus in Scorpio in the 10th house suggests that your mother may have been a strong, transformative influence who encouraged your professional ambitions. The Taurus influence seeks stability and beauty in the home environment, but with Venus placed in the career house, you may find that your work becomes your emotional sanctuary.",
      interpretation: {
        signMeaning:
          "Taurus in the 4th house creates a deep need for emotional and material security. You seek comfort through beautiful, stable surroundings and have a strong connection to nature. Your approach to home and family is practical and grounded, with an appreciation for luxury and comfort.",
        planetEffect:
          "With no planets in the 4th house, the influence comes through Venus in the 10th house. This suggests that your emotional needs are fulfilled through career success and public recognition. Your relationship with your mother may be complex, involving themes of transformation and empowerment.",
        nakshatraEffect:
          "The influence of Krittika and Rohini brings a desire for both precision and beauty in your home environment. You have good taste in interior decoration and may be drawn to artistic or luxurious home furnishings.",
        pastLife:
          "There may have been emotional instability or intensity in early home life. Your relationship with your mother carries deep karmic significance, possibly involving themes of sacrifice or transformation.",
        present:
          "You're learning to balance your need for emotional security with your professional ambitions. Creating a harmonious home environment while pursuing career goals is a key challenge.",
        future:
          "Success in real estate or home-related businesses is possible. Your emotional fulfillment will increasingly come through finding the right balance between career achievements and personal comfort.",
      },
      remedies: [
        "Chant 'Om Shukraya Namah' 108 times on Fridays",
        "Create a beautiful, harmonious home environment",
        "Honor and serve your mother or maternal figures",
        "Donate to women's causes or feed cows on Fridays",
        "Practice gratitude for your home and family blessings",
      ],
      aspects: ["Mars from 3rd house influences through Venus connection, bringing energy to home matters"],
    },
    5: {
      sign: "Gemini",
      planets: [],
      ruler: "Mercury",
      strength: "moderate",
      nakshatra: "Mrigashira/Ardra themes",
      meaning: "Intelligence, Creativity, Romance, Children, Past Life Karma",
      houseRepresents: "Children, Creativity, Intelligence, Romance, Speculation, Education, Mantras",
      planetaryAnalysis:
        "The 5th house being empty but ruled by Mercury in the 9th house creates a powerful connection between creativity and higher wisdom. Mercury in Libra with Jupiter forms a Raj Yoga, indicating that your creative intelligence is blessed with divine wisdom. This placement suggests that your children (if any) will be highly intelligent and spiritually inclined. Your creative expression is likely to involve teaching, writing, or philosophical subjects. The Gemini influence makes you versatile in creative pursuits with multiple interests and talents.",
      interpretation: {
        signMeaning:
          "Gemini in the 5th house gives you a quick, versatile intelligence with multiple creative interests. You have a youthful approach to romance and creativity, often maintaining childlike curiosity throughout life. Your learning style is diverse, and you excel in subjects requiring communication skills.",
        planetEffect:
          "Mercury in the 9th house directing the 5th house creates a connection between creativity and higher learning. Your intelligence is philosophical and ethical in nature. Any children you have will likely be highly intelligent and may become teachers or spiritual guides.",
        nakshatraEffect:
          "Mrigashira brings a searching, curious nature to your creative and romantic life. You're always seeking new experiences and knowledge. Ardra adds depth and transformation to your creative expression.",
        pastLife:
          "Your childhood was likely marked by quick learning and creative hobbies. You may have felt emotionally detached in early romantic relationships, preferring intellectual connections.",
        present:
          "Creative ideas are flowing toward writing, media, technology, or spiritual subjects. You're attracting romantic connections with intellectual or spiritual depth. Your approach to creativity is becoming more philosophical.",
        future:
          "Intelligent children are likely if you choose to have them. Success in education, writing, or spiritual teaching is highly probable. Your creative works may gain recognition for their wisdom and insight.",
      },
      remedies: [
        "Chant 'Om Budhaya Namah' 108 times on Wednesdays",
        "Study sacred texts like Bhagavad Gita or Vedas",
        "Support children's education or mentor young people",
        "Practice creative writing or journaling",
        "Maintain integrity and clarity in romantic relationships",
      ],
      aspects: ["Jupiter-Mercury conjunction in 9th house blesses creativity with wisdom and dharma"],
    },
    6: {
      sign: "Cancer",
      planets: ["Saturn"],
      ruler: "Moon",
      strength: "challenging",
      nakshatra: "Pushya",
      meaning: "Health, Enemies, Service, Daily Work, Obstacles",
      houseRepresents: "Health, Diseases, Enemies, Debts, Service, Daily Routine, Pets",
      planetaryAnalysis:
        "Saturn in Cancer at 15°59'49\" in Pushya nakshatra creates a complex karmic situation. Saturn, being a cold, dry planet in the emotional, nurturing sign of Cancer, creates internal tension between duty and emotion. This placement often indicates emotional burdens related to work and service. However, Saturn in Pushya nakshatra (ruled by Saturn itself) is well-placed for overcoming obstacles through patient, nurturing service. You have the ability to transform emotional pain into wisdom and help others through similar struggles. This placement makes you a karmic warrior who gains strength through overcoming challenges.",
      interpretation: {
        signMeaning:
          "Cancer in the 6th house brings an emotional approach to service and health matters. You may experience psychosomatic health issues related to emotional stress. Your approach to overcoming obstacles is nurturing and protective, often helping others while dealing with your own challenges.",
        planetEffect:
          "Saturn in the 6th house creates the ability to overcome any enemy or obstacle through persistent effort. You have strong work ethics but may feel emotionally burdened by responsibilities. Health issues, if any, are likely to be chronic but manageable through discipline and proper care.",
        nakshatraEffect:
          "Pushya nakshatra gives nourishing, protective qualities to your service. You have natural healing abilities and can help others overcome their difficulties. This nakshatra makes you a spiritual warrior who fights for justice and protection of the vulnerable.",
        pastLife:
          "You may have experienced emotional or health problems from early life. There's a karmic pattern of taking on others' burdens and learning to maintain emotional boundaries while serving.",
        present:
          "You may feel burdened by work stress or unresolved emotional issues. However, this is also a time of building inner strength and developing mastery over your challenges. Your greatest growth comes through service to others.",
        future:
          "You will rise above all enemies and obstacles through spiritual discipline and service. Mastery in healing or helping professions is likely. Your ability to overcome chronic problems will inspire others.",
      },
      remedies: [
        "Chant 'Om Sham Shanicharaya Namah' 108 times on Saturdays",
        "Chant 'Om Chandraya Namah' 108 times on Mondays",
        "Donate black sesame, mustard oil, or iron items on Saturdays",
        "Serve elderly people or those with disabilities",
        "Practice yoga, meditation, and maintain a sattvic lifestyle",
      ],
      aspects: [
        "Saturn aspects 8th house, connecting karma to transformation",
        "Saturn aspects 12th house, requiring financial discipline",
        "Saturn aspects 3rd house, bringing discipline to communication and effort",
      ],
    },
    7: {
      sign: "Leo",
      planets: [],
      ruler: "Sun",
      strength: "moderate",
      nakshatra: "Magha/Purva Phalguni themes",
      meaning: "Marriage, Partnerships, Business, Public Relations",
      houseRepresents: "Spouse, Marriage, Business Partners, Public Image, Legal Matters",
      planetaryAnalysis:
        "The 7th house being empty but ruled by the Sun in the 8th house creates deep, transformative partnerships. Your relationships are likely to be intense and karmic rather than light-hearted. The Sun in Virgo in the 8th house suggests that your spouse will be analytical, detail-oriented, and may bring transformation into your life. Leo on the 7th house cusp indicates attraction to confident, royal-natured partners who have strong personalities. However, the Sun's placement in the 8th house suggests that marriage may be delayed until emotional maturity is achieved.",
      interpretation: {
        signMeaning:
          "Leo in the 7th house attracts bold, confident, and charismatic partners. You seek relationships that enhance your social status and bring excitement into your life. There's a tendency to be dramatic in relationships and expect loyalty and admiration from partners.",
        planetEffect:
          "The Sun in the 8th house creates karmic, intense partnerships. Your relationships undergo deep transformations, and you may be attracted to mysterious or powerful individuals. Marriage brings psychological transformation and may involve shared resources or inheritance.",
        nakshatraEffect:
          "Magha brings royal, ancestral themes to partnerships, while Purva Phalguni adds creativity and pleasure-seeking. Your relationships may have connections to past lives or family lineage.",
        pastLife:
          "There may have been difficulties or delays in close partnerships in past lives. Relationships were likely mysterious, hidden, or involved power struggles that needed resolution.",
        present:
          "You're being cautious about relationships due to fear of vulnerability or loss of independence. There's a need to balance ego with genuine partnership. Deep emotional healing in relationships is occurring.",
        future:
          "Your spouse will likely be intelligent, transformative, and emotionally mature. Strong partnerships will develop after you've done inner work on yourself. Marriage will bring profound personal growth.",
      },
      remedies: [
        "Chant 'Om Ghrini Suryaya Namah' 108 times before sunrise",
        "Recite Aditya Hridayam to strengthen the Sun",
        "Honor your father and male mentors",
        "Offer water to the rising Sun daily (Surya Arghya)",
        "Practice humility and avoid ego conflicts in relationships",
      ],
      aspects: ["Saturn from 6th house creates challenges in partnerships but builds strong karmic bonds"],
    },
    8: {
      sign: "Virgo",
      planets: ["Sun", "Ketu"],
      ruler: "Mercury",
      strength: "challenging",
      nakshatra: "Hasta/Chitra",
      meaning: "Transformation, Mysticism, Hidden Knowledge, Longevity",
      houseRepresents: "Transformation, Occult, Death/Rebirth, Inheritance, Research, Mysteries",
      planetaryAnalysis:
        "The Sun at 27°13'56\" and Ketu at 19°12'55\" in Virgo creates a powerful combination for spiritual transformation and mystical abilities. The Sun in the 8th house indicates ego death and rebirth through intense experiences. Ketu adds detachment from worldly desires and mastery of hidden knowledge from past lives. This conjunction in Virgo gives analytical approach to mysticism and natural healing abilities. The Sun in Chitra nakshatra grants creative and architectural abilities, while Ketu brings intuitive understanding of energy and healing. This placement often indicates inheritance of mystical knowledge or abilities.",
      interpretation: {
        signMeaning:
          "Virgo in the 8th house brings analytical power to mystical and transformative experiences. You have a scientific approach to spirituality and natural abilities in healing and research. Your transformation process is methodical and detail-oriented.",
        planetEffect:
          "The Sun-Ketu conjunction creates powerful spiritual awakening through ego dissolution. You have natural psychic abilities and deep understanding of life's mysteries. This placement can bring sudden insights and transformative experiences that change your entire worldview.",
        nakshatraEffect:
          "Hasta brings hands-on healing abilities and skill in crafts or detailed work. Chitra grants aesthetic spiritual insight and creative transformation abilities. You may have talents in sacred geometry or spiritual architecture.",
        pastLife:
          "You experienced early spiritual disturbances, mysterious emotional crises, or hidden betrayals. There's karmic mastery of occult sciences that you're now integrating into this lifetime.",
        present:
          "You're undergoing powerful internal awakening and may be practicing astrology, tantra, psychology, or healing arts. This is a phase of spiritual transformation and developing psychic abilities.",
        future:
          "Immense spiritual growth awaits, with potential to help others through counseling, occult sciences, or mystical arts. Financial breakthroughs through inheritance, insurance, or metaphysical work are possible.",
      },
      remedies: [
        "Chant 'Om Ghrini Suryaya Namah' daily during sunrise",
        "Chant 'Om Ketave Namah' on Tuesdays and during eclipses",
        "Recite Navagraha Stotra to balance planetary energies",
        "Donate dark-colored items or coconuts on eclipse days",
        "Engage in spiritual service helping those in grief or transformation",
      ],
      aspects: [
        "Saturn aspects 8th house bringing heavy karmic lessons and spiritual tests",
        "Mars aspects 8th house bringing sudden energy and potential for healing abilities",
      ],
    },
    9: {
      sign: "Libra",
      planets: ["Jupiter", "Mercury"],
      ruler: "Venus",
      strength: "excellent",
      nakshatra: "Swati/Vishakha",
      meaning: "Dharma, Higher Learning, Fortune, Father, Spirituality",
      houseRepresents: "Father, Guru, Higher Education, Philosophy, Religion, Long Journeys, Luck",
      planetaryAnalysis:
        "Jupiter at 03°32'34\" and Mercury at 14°38'23\" in Libra create one of the most auspicious combinations in your chart. This Guru-Budha Yoga in the 9th house of dharma creates exceptional wisdom, teaching abilities, and spiritual authority. Jupiter in Libra seeks balance and harmony in spiritual matters, while Mercury adds intellectual brilliance to philosophical understanding. This conjunction in Swati nakshatra (ruled by Rahu) gives independence in spiritual beliefs, while Vishakha adds determination and goal-oriented spirituality. This placement indicates that you're destined to become a spiritual teacher or guide, with the ability to communicate complex philosophical concepts in an accessible way.",
      interpretation: {
        signMeaning:
          "Libra in the 9th house brings balance, diplomacy, and harmony to spiritual matters. You have a deep sense of justice in religious and philosophical matters and prefer elegant, balanced approaches to spirituality. Your spiritual path involves relationships and partnerships.",
        planetEffect:
          "The Jupiter-Mercury conjunction creates exceptional Raj Yoga, granting wisdom through balanced thinking and ethical communication. You have natural teaching abilities and can explain complex spiritual concepts clearly. This placement brings good fortune through education, publishing, and spiritual pursuits.",
        nakshatraEffect:
          "Swati brings independence and flexibility in spiritual beliefs, allowing you to create your own unique spiritual path. Vishakha adds determination and the ability to achieve spiritual goals through persistent effort.",
        pastLife:
          "You had a strong intellectual and spiritual background, possibly born into a family with moral and spiritual leanings. Early education was intense but formative for your spiritual development.",
        present:
          "You're developing into a wise communicator and spiritual teacher. Mentors and foreign connections are entering your life. You feel called to share your knowledge and guide others on their spiritual journey.",
        future:
          "You're destined to become a spiritual authority, teacher, or published author. Long-distance travel and pilgrimage will increase. Your dharmic service will bring recognition and respect in spiritual communities.",
      },
      remedies: [
        "Worship Lord Vishnu or Goddess Lakshmi regularly",
        "Read and study sacred texts like Bhagavad Gita",
        "Feed Brahmins, teachers, or support educational causes",
        "Teach or share knowledge with others freely",
        "Fast on Thursdays (Jupiter) and maintain ethical conduct",
      ],
      aspects: [
        "Jupiter aspects 1st house providing divine protection and wisdom to personality",
        "Jupiter aspects 3rd house blessing communication with dharmic purpose",
        "Jupiter aspects 5th house bringing wisdom to creativity and children",
      ],
    },
    10: {
      sign: "Scorpio",
      planets: ["Venus"],
      ruler: "Mars",
      strength: "good",
      nakshatra: "Anuradha",
      meaning: "Career, Karma, Public Life, Fame, Authority",
      houseRepresents: "Career, Reputation, Authority, Public Image, Government, Father's Influence",
      planetaryAnalysis:
        "Venus at 13°05'43\" in Scorpio in Anuradha nakshatra creates a unique career profile involving transformation, healing, and deep psychological work. Venus in Scorpio brings intensity and depth to your public image, making you magnetic and mysterious in professional settings. Anuradha nakshatra, ruled by Saturn, adds devotion and success through partnerships to your career. This placement suggests success in fields involving psychology, healing, finance, research, or transformational work. Your career will likely involve helping others through deep, meaningful change rather than superficial services.",
      interpretation: {
        signMeaning:
          "Scorpio in the 10th house brings depth, mystery, and transformation to your career. You have a magnetic public presence and the ability to influence others through behind-the-scenes power. Your professional life involves research, investigation, or transformational work.",
        planetEffect:
          "Venus in the 10th house brings grace, diplomacy, and artistic sensibilities to your career. You're likely to succeed in fields involving beauty, relationships, finance, or healing. Your public image is attractive and harmonious, drawing people to you naturally.",
        nakshatraEffect:
          "Anuradha nakshatra brings devotion and success through partnerships to your career. You work well in teams and can build lasting professional relationships. This nakshatra gives you the ability to achieve success through persistent, devoted effort.",
        pastLife:
          "You may have struggled with expressing power publicly or had karmic challenges with authority figures. There was confusion about your true calling and life purpose in earlier years.",
        present:
          "You're evolving into a career involving depth, influence, and transformational work. Your professional life is undergoing intense changes that will ultimately lead to greater authenticity and power.",
        future:
          "Rising influence and recognition await you. You will gain authority, public respect, or spiritual fame through teaching, healing, or reform work. Your career will become a vehicle for serving others' transformation.",
      },
      remedies: [
        "Chant 'Om Angarakaya Namah' on Tuesdays to strengthen Mars",
        "Worship Goddess Durga or Lord Hanuman for inner strength",
        "Fast on Fridays (Venus) and Tuesdays (Mars) alternately",
        "Wear Rudraksha beads (3 Mukhi or 10 Mukhi) for spiritual power",
        "Be authentic and courageous in your professional life",
      ],
      aspects: [
        "Saturn aspects 10th house bringing delayed but lasting success",
        "Jupiter blesses career with wisdom and dharmic purpose",
        "Mars aspects 10th house with powerful drive and ambition",
      ],
    },
    11: {
      sign: "Sagittarius",
      planets: [],
      ruler: "Jupiter",
      strength: "moderate",
      nakshatra: "Mula/Purva Ashadha",
      meaning: "Gains, Income, Social Network, Desires, Elder Siblings",
      houseRepresents: "Income, Gains, Friends, Social Network, Hopes, Wishes, Elder Siblings",
      planetaryAnalysis:
        "The 11th house being empty but ruled by Jupiter in the 9th house creates powerful Dhana Yoga for wealth through dharmic means. Jupiter's influence on the 11th house from the 9th house indicates gains through higher knowledge, teaching, publishing, or spiritual work. Sagittarius on the 11th house cusp attracts spiritually-minded friends and mentors who support your growth. Your social network will include teachers, philosophers, and people from different cultures. Income is likely to come through education, travel, publishing, or spiritual services rather than conventional business.",
      interpretation: {
        signMeaning:
          "Sagittarius in the 11th house brings expansion and higher knowledge to your gains and social network. You attract friends who are spiritually inclined, well-educated, or from foreign cultures. Your desires are philosophical and aimed at higher purposes rather than mere material accumulation.",
        planetEffect:
          "Jupiter ruling the 11th house from the 9th house creates powerful wealth yoga through dharmic activities. Your gains come through teaching, writing, spiritual work, or foreign connections. Friends and mentors play a crucial role in your success.",
        nakshatraEffect:
          "Mula brings deep research and investigation to your goals, while Purva Ashadha adds invincible determination in achieving your desires. You have the ability to get to the root of any matter and achieve victory through persistent effort.",
        pastLife:
          "Your desires were idealistic and spiritually oriented. Early friend circles may not have matched your spiritual depth, leading to some disappointment but eventual finding of like-minded souls.",
        present:
          "You're entering a phase of conscious networking with spiritually and intellectually rich people. Your career and spiritual practices are beginning to bring real financial returns.",
        future:
          "Significant spiritual and financial gains are coming, especially after age 28. You may become well-known in wisdom or spiritual circles. Your desires will be fulfilled through grace rather than struggle.",
      },
      remedies: [
        "Worship Brihaspati (Jupiter) on Thursdays to enhance opportunities",
        "Donate yellow items like turmeric, gold, or books on Thursdays",
        "Maintain a gratitude journal for fulfilled desires",
        "Share knowledge freely through teaching or writing",
        "Chant 'Om Brim Brihaspataye Namah' daily for Jupiter's blessings",
      ],
      aspects: [
        "Saturn aspects 11th house bringing delayed but stable gains",
        "Mars aspects 11th house bringing gains through action and courage",
      ],
    },
    12: {
      sign: "Capricorn",
      planets: ["Neptune"],
      ruler: "Saturn",
      strength: "moderate",
      nakshatra: "Uttara Ashadha/Shravana",
      meaning: "Moksha, Foreign Lands, Spiritual Liberation, Losses",
      houseRepresents: "Spirituality, Foreign Lands, Isolation, Subconscious, Dreams, Liberation",
      planetaryAnalysis:
        "Neptune in Capricorn in the 12th house creates a unique spiritual profile combining mystical sensitivity with practical discipline. Neptune enhances your psychic abilities, dream life, and connection to the collective unconscious. In Capricorn, this mystical energy is grounded and structured, making you a practical mystic who can organize spiritual knowledge systematically. Saturn ruling this house from the 6th house connects your spiritual liberation to service and overcoming obstacles. This placement indicates potential for foreign residence, ashram life, or deep spiritual practice in later life.",
      interpretation: {
        signMeaning:
          "Capricorn in the 12th house brings a structured, disciplined approach to spirituality and liberation. You seek moksha through patient, persistent spiritual practice rather than sudden enlightenment. Your spiritual path is methodical and well-organized.",
        planetEffect:
          "Neptune greatly enhances your spiritual sensitivity, giving you vivid dreams, psychic visions, and natural mystical connections. You may have experiences of divine communion or cosmic consciousness. This placement can also create confusion about practical matters if not properly grounded.",
        nakshatraEffect:
          "Uttara Ashadha brings final victory through persistence in spiritual matters, while Shravana adds deep listening abilities and learning from spiritual teachers. You have natural capacity for meditation and inner listening.",
        pastLife:
          "There were tendencies to escape reality or remain emotionally detached from worldly responsibilities. Foreign or spiritual influences were strong from early life, creating a sense of not quite belonging to ordinary world.",
        present:
          "Your inner world is opening through mysticism, meditation, and service work. Karmic challenges are pushing you toward deeper introspection and spiritual understanding. You may feel called to periods of solitude or retreat.",
        future:
          "Foreign relocation, ashram life, or deep spiritual practice (sadhana) is likely after age 35. You're moving toward moksha and may become a spiritual guide for others seeking liberation. Your spiritual insights will help many souls.",
      },
      remedies: [
        "Worship Lord Shiva or Hanuman for Saturn's discipline and spiritual strength",
        "Donate black items like sesame oil or iron on Saturdays",
        "Practice daily meditation during Brahma Muhurat (4-6 AM)",
        "Chant 'Om Namo Bhagavate Vasudevaya' for karmic release",
        "Keep a dream journal and pay attention to spiritual insights",
      ],
      aspects: [
        "Saturn aspects 12th house creating self-imposed spiritual discipline",
      ],
    },
  }

  // Computed Dynamic Charts
  const charts = useMemo(() => ({
    d1: { ...getChartData(divisionalCharts.D1), name: "Lagna Chart (D1) - Self" },
    d9: { ...getChartData(divisionalCharts.D9), name: "Navamsha (D9) - Destiny/Spouse" },
    d10: { ...getChartData(divisionalCharts.D10), name: "Dasamsa (D10) - Career" },
    d3: { ...getChartData(divisionalCharts.D3), name: "Drekkana (D3) - Siblings" },
    d7: { ...getChartData(divisionalCharts.D7), name: "Saptamsa (D7) - Progeny" },
    d12: { ...getChartData(divisionalCharts.D12), name: "Dwadasamsa (D12) - Parents" },
    d60: { ...getChartData(divisionalCharts.D60), name: "Shashtiamsa (D60) - Past Karma" },
    shadbala: { name: "Shadbala Strength Analysis" },
    transits: { name: "Live Planetary Transits" }
  }), [divisionalCharts]);

  const houseDescriptions = {
    1: "Self, personality, physical appearance, overall life direction",
    2: "Wealth, family, speech, values, early childhood",
    3: "Siblings, courage, communication, short journeys, skills",
    4: "Mother, home, emotions, education, inner peace",
    5: "Children, creativity, romance, intelligence, past life karma",
    6: "Health, enemies, daily routine, service, obstacles",
    7: "Marriage, partnerships, business, public relations",
    8: "Transformation, occult, longevity, inheritance, mysteries",
    9: "Father, dharma, higher learning, spirituality, luck",
    10: "Career, reputation, authority, public image, achievements",
    11: "Gains, friends, hopes, elder siblings, income",
    12: "Losses, spirituality, foreign lands, subconscious, moksha",
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "excellent":
        return "emerald"
      case "strong":
        return "green"
      case "good":
        return "blue"
      case "moderate":
        return "yellow"
      case "weak":
        return "orange"
      case "challenging":
        return "red"
      default:
        return "gray"
    }
  }

  const currentChart = activeChart === 'houses' ? null : charts[activeChart as keyof typeof charts] || charts.d1;

  // ... (in component)
  const { setChatOpen } = useAstrologyStore()

  return (
    <div className="space-y-6">
      <Card id="vedic-chart-content" className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-400">Sudhanshu's Vedic Chart Analysis</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              onClick={() => setChatOpen(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
            <PDFExportButton
              targetId="vedic-chart-content"
              filename="vedic-chart-analysis"
              title="Export Chart"
            />
          </div>
        </div>

        <Tabs value={activeChart} onValueChange={setActiveChart} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-slate-800/50 border border-purple-500/30 p-2">
            <TabsTrigger className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400" value="d1">D1 (Lagna)</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400" value="d9">D9 (Navamsha)</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400" value="d10">D10 (Dasamsa)</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400" value="d3">D3 (Drekkana)</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400" value="d7">D7 (Saptamsa)</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400" value="d12">D12 (Dwadasamsa)</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-slate-500/20 data-[state=active]:text-slate-400" value="d60">D60</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400" value="shadbala">Shadbala</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400" value="transits">Transits</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400" value="yogas">Yogas</TabsTrigger>
            <TabsTrigger value="remedies" className="text-indigo-400 data-[state=active]:bg-indigo-900/50">Remedies</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400" value="houses">Houses</TabsTrigger>
          </TabsList>

          <TabsContent value={activeChart} className="space-y-6">
            {activeChart === "shadbala" ? (
              <Card className="p-6 bg-slate-900/50 border-purple-500/30">
                <h3 className="text-xl font-bold text-center text-purple-400 mb-6">Shadbala Strength Analysis (Rupas)</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-purple-300">Planet</TableHead>
                        <TableHead className="text-purple-300">Total</TableHead>
                        <TableHead className="text-purple-300">Sthana (Positional)</TableHead>
                        <TableHead className="text-purple-300">Dig (Direction)</TableHead>
                        <TableHead className="text-purple-300">Kala (Time)</TableHead>
                        <TableHead className="text-purple-300">Cheshta (Motion)</TableHead>
                        <TableHead className="text-purple-300">Naisargika (Natural)</TableHead>
                        <TableHead className="text-purple-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(shadbala).map(([planet, data]) => (
                        <TableRow key={planet} className="border-b border-purple-500/10">
                          <TableCell className="font-medium text-white">{planet}</TableCell>
                          <TableCell className="font-bold text-yellow-400">{data.total} Ru</TableCell>
                          <TableCell className="text-gray-300">{data.sthana}</TableCell>
                          <TableCell className="text-gray-300">{data.dig}</TableCell>
                          <TableCell className="text-gray-300">{data.kala}</TableCell>
                          <TableCell className="text-gray-300">{data.cheshta}</TableCell>
                          <TableCell className="text-gray-300">{data.naisargika}</TableCell>
                          <TableCell>
                            <Badge className={data.isStrong ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                              {data.isStrong ? "Strong" : "Weak"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ) : activeChart === "transits" ? (
              <div className="space-y-6">
                <Card className="p-6 bg-slate-900/50 border-purple-500/30">
                  <h3 className="text-xl font-bold text-center text-purple-400 mb-6">Current Planetary Transits ({new Date().toLocaleDateString()})</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-4">Current Positions</h4>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-purple-500/30">
                            <TableHead className="text-purple-300">Planet</TableHead>
                            <TableHead className="text-purple-300">Sign</TableHead>
                            <TableHead className="text-purple-300">Degree</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.values(transits.positions).map((pos: any) => (
                            <TableRow key={pos.planet} className="border-b border-purple-500/10">
                              <TableCell className="font-medium text-white">{pos.planet}</TableCell>
                              <TableCell className="text-gray-300">{pos.sign}</TableCell>
                              <TableCell className="text-yellow-400">{pos.degree.toFixed(2)}°</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400 mb-4">Active Aspects to Natal Chart</h4>
                      <div className="space-y-2">
                        {transits.aspects.length > 0 ? (
                          transits.aspects.map((aspect: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-800/50 rounded border border-purple-500/20 flex justify-between items-center">
                              <span className="text-sm text-gray-300">
                                <span className="text-cyan-400 font-bold">Tr. {aspect.aspectingPlanet}</span>
                                <span className="px-2 text-gray-500">{aspect.aspectType}</span>
                                <span className="text-purple-400 font-bold">Nat. {aspect.planet}</span>
                              </span>
                              <Badge variant="outline" className="text-xs border-gray-600">Orb: {aspect.orb}°</Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No major exact aspects currently active (Orb 3°).</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : activeChart === "yogas" ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(yogaResults).map(([category, yogas]) => (
                    yogas.length > 0 && (
                      <Card key={category} className="p-6 bg-slate-900/50 border-purple-500/30">
                        <h4 className="text-lg font-bold text-cyan-400 mb-4 border-b border-gray-700 pb-2">{category} Yogas</h4>
                        <div className="space-y-4">
                          {yogas.map((yoga, i) => (
                            <div key={i} className="p-3 bg-slate-800/40 rounded border border-gray-700 hover:border-purple-500/50 transition-colors">
                              <div className="flex justify-between items-start">
                                <h5 className="font-semibold text-white">{yoga.name}</h5>
                                <Badge variant="outline" className={yoga.strength === 'Major' ? "text-yellow-400 border-yellow-500/30" : "text-gray-400 border-gray-600"}>{yoga.strength}</Badge>
                              </div>
                              <p className="text-sm text-gray-300 mt-1 italic">{yoga.description}</p>
                              <div className="mt-2 text-xs text-gray-400">
                                <span className="text-purple-400 font-semibold">Effects: </span>
                                {yoga.effects.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )
                  ))}
                  {Object.values(yogaResults).every(arr => arr.length === 0) && (
                    <div className="col-span-2 text-center text-gray-400 py-10">No specific yogas detected.</div>
                  )}
                </div>
              </div>
            ) : activeChart !== "houses" && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{currentChart?.name}</h3>
                  <p className="text-gray-400">
                    {activeChart === "d1" && "Main birth chart showing overall life themes"}
                    {activeChart === "d9" && "Marriage and dharma chart"}
                    {activeChart === "d10" && "Career and profession chart"}
                  </p>
                </div>

                {/* Square Vedic Chart Layout */}
                {/* Square Vedic Chart Layout with Insights Below */}
                <div className="flex flex-col gap-10 items-center">
                  <div className="relative w-full flex justify-center">
                    <TooltipProvider>
                      <NorthIndianChart
                        key={activeChart}
                        houses={(currentChart as any)?.houses}
                        theme="dark"
                        onHouseClick={setSelectedHouse}
                        className="w-full max-w-[650px] shadow-2xl"
                      />
                    </TooltipProvider>
                  </div>

                  {/* Chart Analysis */}
                  <div className="w-full space-y-6">
                    <h4 className="text-xl font-bold text-cyan-400 text-center">Key Insights</h4>

                    {activeChart === "d1" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-cyan-500/30">
                          <h5 className="font-semibold text-cyan-400">Aquarius Lagna with Moon (Shatabhisha)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Double Aquarian energy creates humanitarian nature, innovative thinking, and healing
                            abilities. Shatabhisha nakshatra grants natural medical and research talents. Moon in lagna
                            makes you emotionally expressive and intuitive.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-yellow-500/30">
                          <h5 className="font-semibold text-yellow-400">
                            Jupiter-Mercury Conjunction in 9th House (Libra)
                          </h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Exceptional combination for higher learning, teaching, and spiritual pursuits. Jupiter at
                            3°32' and Mercury at 14°38' create Raj Yoga for authority and wisdom. This grants success in
                            education, publishing, and dharmic activities.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-red-500/30">
                          <h5 className="font-semibold text-red-400">Mars Retrograde in 3rd House (Aries)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Mars in own sign at 28°15' gives exceptional courage and communication skills. Retrograde
                            motion adds depth and introspection. Excellent for siblings, writing, and independent
                            ventures. Krittika nakshatra adds sharp, cutting-edge abilities.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/30">
                          <h5 className="font-semibold text-purple-400">Venus in 10th House (Scorpio)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Career success through transformation, healing, and creative fields. Venus at 13°05' in
                            Anuradha nakshatra brings devotion and success in partnerships. Excellent for psychology,
                            therapy, and transformational work.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-orange-500/30">
                          <h5 className="font-semibold text-orange-400">Sun-Ketu in 8th House (Virgo)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Hidden talents in research, occult, and healing. Sun at 27°13' in Chitra nakshatra grants
                            creative and architectural abilities. Ketu adds spiritual depth and intuitive powers.
                            Challenges require transformation through service.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeChart === "d9" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-green-500/30">
                          <h5 className="font-semibold text-green-400">Scorpio Navamsha Lagna</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Deep, transformative approach to marriage and dharma. Intense emotional connections in
                            relationships.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-pink-500/30">
                          <h5 className="font-semibold text-pink-400">Venus in 7th House (Taurus)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Excellent placement for marriage. Indicates a beautiful, loyal, and stable partner. Marriage
                            brings prosperity.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-yellow-500/30">
                          <h5 className="font-semibold text-yellow-400">Jupiter in 5th House (Pisces)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Divine wisdom in romance and creativity. Blessings through children and spiritual practices.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeChart === "d10" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/30">
                          <h5 className="font-semibold text-blue-400">Gemini Dashamsha Lagna</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Communicative and intellectual approach to career. Success in fields requiring versatility and
                            skills.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-orange-500/30">
                          <h5 className="font-semibold text-orange-400">Sun in 3rd House (Leo)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Strong leadership in communication-based career. Self-made success through courage and
                            initiative.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/30">
                          <h5 className="font-semibold text-purple-400">Mercury Exalted in 4th House (Virgo)</h5>
                          <p className="text-sm text-gray-300 mt-1">
                            Bhadra Yoga in career chart. Exceptional analytical skills and success in education or
                            counseling.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* House Analysis Tab */}
            {activeChart === "houses" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Complete House-by-House Analysis</h3>
                  <p className="text-gray-400">Click on any house below for detailed interpretation</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(houseData).map(([houseNum, data]) => (
                    <Card
                      key={houseNum}
                      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedHouse === Number.parseInt(houseNum)
                        ? `bg-gradient-to-br from-${getStrengthColor(data.strength)}-900/30 to-slate-900/50 border-${getStrengthColor(data.strength)}-500/50 ring-2 ring-${getStrengthColor(data.strength)}-400`
                        : `bg-gradient-to-br from-slate-800/30 to-${getStrengthColor(data.strength)}-900/20 border-${getStrengthColor(data.strength)}-500/30`
                        }`}
                      onClick={() =>
                        setSelectedHouse(selectedHouse === Number.parseInt(houseNum) ? null : Number.parseInt(houseNum))
                      }
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className={`font-bold text-${getStrengthColor(data.strength)}-400`}>
                            {houseNum}. {data.sign}
                          </h4>
                          <Badge
                            className={`bg-${getStrengthColor(data.strength)}-500/20 text-${getStrengthColor(data.strength)}-400 border-${getStrengthColor(data.strength)}-500/30 text-xs`}
                          >
                            {data.strength}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{data.meaning}</p>
                        <div className="flex flex-wrap gap-1">
                          {data.planets.map((planet, idx) => (
                            <Badge
                              key={idx}
                              className={`text-xs bg-${getStrengthColor(data.strength)}-500/20 text-${getStrengthColor(data.strength)}-400 border-${getStrengthColor(data.strength)}-500/30`}
                            >
                              {planet}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-cyan-400">Nakshatra: {data.nakshatra}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>


          {/* Detailed House Analysis */}
          {/* Detailed House Analysis */}
          {selectedHouse && houseData[selectedHouse as keyof typeof houseData] && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-bold text-indigo-400">
                    House {selectedHouse} - {houseData[selectedHouse as keyof typeof houseData].sign}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHouse(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-semibold text-cyan-400">Basic Details</h5>
                      <div className="text-sm space-y-1 text-white">
                        <div>Sign: {houseData[selectedHouse as keyof typeof houseData].sign}</div>
                        <div>Ruler: {houseData[selectedHouse as keyof typeof houseData].ruler}</div>
                        <div>Strength: {houseData[selectedHouse as keyof typeof houseData].strength}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-semibold text-purple-400">Planets Present</h5>
                      <div className="flex flex-wrap gap-2">
                        {houseData[selectedHouse as keyof typeof houseData].planets.length > 0 ? (
                          houseData[selectedHouse as keyof typeof houseData].planets.map((planet: string, idx: number) => (
                            <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {planet}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No planets</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-semibold text-yellow-400">Nakshatra</h5>
                      <div className="text-sm text-white">{houseData[selectedHouse as keyof typeof houseData].nakshatra}</div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-semibold text-green-400">House Represents</h5>
                      <div className="text-sm text-gray-300">{houseData[selectedHouse as keyof typeof houseData].houseRepresents}</div>
                    </div>
                  </div>

                  {/* Planetary Analysis */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-indigo-400">Planetary Analysis</h5>
                    <p className="text-gray-300 leading-relaxed">{houseData[selectedHouse as keyof typeof houseData].planetaryAnalysis}</p>
                  </div>

                  {/* Detailed Interpretation */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-indigo-400">Detailed Interpretation</h5>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-cyan-500/30">
                          <h6 className="font-semibold text-cyan-400 mb-2">Sign Meaning</h6>
                          <p className="text-sm text-gray-300">
                            {houseData[selectedHouse as keyof typeof houseData].interpretation.signMeaning}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/30">
                          <h6 className="font-semibold text-purple-400 mb-2">Planet Effect</h6>
                          <p className="text-sm text-gray-300">
                            {houseData[selectedHouse as keyof typeof houseData].interpretation.planetEffect}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-yellow-500/30">
                          <h6 className="font-semibold text-yellow-400 mb-2">Nakshatra Effect</h6>
                          <p className="text-sm text-gray-300">
                            {houseData[selectedHouse as keyof typeof houseData].interpretation.nakshatraEffect}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-orange-500/30">
                          <h6 className="font-semibold text-orange-400 mb-2">Past Life</h6>
                          <p className="text-sm text-gray-300">
                            {houseData[selectedHouse as keyof typeof houseData].interpretation.pastLife}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-green-500/30">
                          <h6 className="font-semibold text-green-400 mb-2">Present</h6>
                          <p className="text-sm text-gray-300">
                            {houseData[selectedHouse as keyof typeof houseData].interpretation.present}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/30">
                          <h6 className="font-semibold text-blue-400 mb-2">Future</h6>
                          <p className="text-sm text-gray-300">
                            {houseData[selectedHouse as keyof typeof houseData].interpretation.future}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remedies */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-indigo-400">Remedies & Recommendations</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h6 className="font-semibold text-green-400">Spiritual Remedies</h6>
                        <ul className="space-y-1">
                          {houseData[selectedHouse as keyof typeof houseData].remedies.map((remedy: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {remedy}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h6 className="font-semibold text-cyan-400">Planetary Aspects</h6>
                        <ul className="space-y-1">
                          {houseData[selectedHouse as keyof typeof houseData].aspects.map((aspect: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start">
                              <span className="text-cyan-400 mr-2">•</span>
                              {aspect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}



          <TabsContent value="remedies">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gemstones */}
              <Card className="p-6 bg-slate-900/50 border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Gem className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-semibold text-white">Gemstone Recommendations</h3>
                </div>
                <div className="space-y-4">
                  {userData?.remedies?.gemstones.map((gem, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                      <div className="font-medium text-pink-300">{gem.gemstone}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Wear on {gem.finger} in {gem.metal} on {gem.day}.
                      </div>
                      <div className="text-sm text-gray-300 mt-2 italic">"{gem.reason}"</div>
                    </div>
                  ))}
                  {(!userData?.remedies?.gemstones?.length) && <div className="text-gray-500 italic">No specific gemstones recommended.</div>}
                </div>
              </Card>

              {/* Mantras */}
              <Card className="p-6 bg-slate-900/50 border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Vedic Mantras</h3>
                </div>
                <div className="space-y-4">
                  {userData?.remedies?.mantras.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                      <div className="font-semibold text-yellow-200">{m.deity}</div>
                      <div className="text-sm font-mono bg-slate-900 p-2 rounded mt-1 text-yellow-100">{m.mantra}</div>
                      <div className="text-xs text-gray-400 mt-1">Recite {m.count} times in the {m.time.toLowerCase()}.</div>
                      <div className="text-xs text-gray-500 mt-1">{m.purpose}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Lifestyle */}
              <Card className="p-6 bg-slate-900/50 border-slate-700 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Lifestyle & Habits</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {userData?.remedies?.lifestyle.map((l, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 bg-slate-800/50 rounded">
                      <Heart className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <div>
                        <div className="font-medium text-gray-200">{l.description}</div>
                        <div className="text-sm text-gray-400">{l.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

        </Tabs >
      </Card >

      {/* Ashtakvarga Analysis */}
      < AshtakvargaAnalysis />
    </div >
  )
}

// Export with React.memo for performance optimization
export default memo(ChartBreakdown)
