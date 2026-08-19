/**
 * AstroLens — Cosmic Compatibility Engine (Phase 4A)
 *
 * Provides deterministic, explainable mathematical compatibility calculations
 * between a user's biometric palm profile and a partner's zodiac sign.
 *
 * The same inputs will ALWAYS yield the exact same deterministic results.
 */

export const ZODIAC_SIGNS = [
  { id: 'aries',       name: 'Aries',       symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire',  modality: 'Cardinal', color: '#EF4444', ruler: 'Mars' },
  { id: 'taurus',      name: 'Taurus',      symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth', modality: 'Fixed',    color: '#10B981', ruler: 'Venus' },
  { id: 'gemini',      name: 'Gemini',      symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air',   modality: 'Mutable',  color: '#FBBF24', ruler: 'Mercury' },
  { id: 'cancer',      name: 'Cancer',      symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Water', modality: 'Cardinal', color: '#38BDF8', ruler: 'Moon' },
  { id: 'leo',         name: 'Leo',         symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire',  modality: 'Fixed',    color: '#F59E0B', ruler: 'Sun' },
  { id: 'virgo',       name: 'Virgo',       symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth', modality: 'Mutable',  color: '#34D399', ruler: 'Mercury' },
  { id: 'libra',       name: 'Libra',       symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air',   modality: 'Cardinal', color: '#FB7185', ruler: 'Venus' },
  { id: 'scorpio',     name: 'Scorpio',     symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water', modality: 'Fixed',    color: '#A855F7', ruler: 'Pluto & Mars' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire',  modality: 'Mutable',  color: '#EC4899', ruler: 'Jupiter' },
  { id: 'capricorn',   name: 'Capricorn',   symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth', modality: 'Cardinal', color: '#64748B', ruler: 'Saturn' },
  { id: 'aquarius',    name: 'Aquarius',    symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air',   modality: 'Fixed',    color: '#06B6D4', ruler: 'Uranus' },
  { id: 'pisces',      name: 'Pisces',      symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water', modality: 'Mutable',  color: '#818CF8', ruler: 'Neptune' },
];

/**
 * Elemental base affinity table (0.0 to 1.0)
 */
const ELEMENT_AFFINITY = {
  Fire:  { Fire: 0.88, Earth: 0.72, Air: 0.94, Water: 0.68, Ether: 0.85 },
  Earth: { Fire: 0.72, Earth: 0.90, Air: 0.70, Water: 0.92, Ether: 0.82 },
  Air:   { Fire: 0.94, Earth: 0.70, Air: 0.88, Water: 0.74, Ether: 0.86 },
  Water: { Fire: 0.68, Earth: 0.92, Air: 0.74, Water: 0.90, Ether: 0.84 },
  Ether: { Fire: 0.85, Earth: 0.82, Air: 0.86, Water: 0.84, Ether: 0.92 },
};

/**
 * Modality compatibility factor (0.0 to 1.0)
 */
const MODALITY_AFFINITY = {
  Cardinal: { Cardinal: 0.82, Fixed: 0.78, Mutable: 0.90 },
  Fixed:    { Cardinal: 0.78, Fixed: 0.84, Mutable: 0.88 },
  Mutable:  { Cardinal: 0.90, Fixed: 0.88, Mutable: 0.86 },
};

/**
 * Deterministic pseudo-random offset based on partner's name string.
 * Ensures "Sarah" and "Alex" with the same zodiac get subtly tailored, persistent scores.
 */
function hashStringSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 10); // 0 to 9
}

/**
 * Calculates a complete deterministic compatibility report between user profile and partner.
 *
 * @param {object} userProfile - Current user profile from getProfile()
 * @param {object} partnerInput - { name: string, zodiacId: string }
 * @returns {object} Full deterministic compatibility report
 */
export function calculateCosmicCompatibility(userProfile, partnerInput) {
  const partnerZodiac = ZODIAC_SIGNS.find(z => z.id === partnerInput.zodiacId) || ZODIAC_SIGNS[0];
  const partnerName = (partnerInput.name || '').trim() || 'Your Partner';
  const nameSeed = hashStringSeed(partnerName);

  // 1. Resolve User Element & Archetype
  const userElement = userProfile?.luckyElement || 'Fire';
  const userEnergy = userProfile?.energyScore ?? 78;
  const userFocus = userProfile?.focusScore ?? 72;
  const userEmotion = userProfile?.emotionScore ?? 68;
  const userArchetype = userProfile?.archetype || 'Cosmic Trailblazer';
  const userName = userProfile?.name || 'Seeker';

  // 2. Base Element Affinity
  const baseElemAffinity = ELEMENT_AFFINITY[userElement]?.[partnerZodiac.element] ?? 0.82;
  const modalityBonus = MODALITY_AFFINITY['Cardinal']?.[partnerZodiac.modality] ?? 0.85;

  // 3. Sub-Scores (0 to 100)
  // Sub-score 1: Energy Resonance (Life line vitality + Elemental synergy)
  const rawEnergy = Math.round(
    userEnergy * 0.45 + baseElemAffinity * 100 * 0.45 + (nameSeed % 5) + 5
  );
  const energyScore = Math.min(99, Math.max(62, rawEnergy));

  // Sub-score 2: Mind & Communication (Head line focus + Air/Mercury influence)
  const isAirOrMercury = partnerZodiac.element === 'Air' || partnerZodiac.ruler.includes('Mercury');
  const mindModifier = isAirOrMercury ? 6 : -2;
  const rawMind = Math.round(
    userFocus * 0.45 + modalityBonus * 100 * 0.45 + mindModifier + ((nameSeed * 3) % 6)
  );
  const mindScore = Math.min(98, Math.max(64, rawMind));

  // Sub-score 3: Emotional & Love Bond (Heart line depth + Water/Venus influence)
  const isWaterOrVenus = partnerZodiac.element === 'Water' || partnerZodiac.ruler.includes('Venus');
  const loveModifier = isWaterOrVenus ? 7 : 0;
  const rawHeart = Math.round(
    userEmotion * 0.48 + baseElemAffinity * 100 * 0.42 + loveModifier + ((nameSeed * 7) % 6)
  );
  const heartScore = Math.min(99, Math.max(60, rawHeart));

  // Sub-score 4: Spiritual Understanding (Archetypal synergy)
  const rawSpiritual = Math.round(
    (energyScore * 0.3 + mindScore * 0.35 + heartScore * 0.35) + ((nameSeed % 4) - 1)
  );
  const spiritualScore = Math.min(98, Math.max(65, rawSpiritual));

  // 4. Overall Compatibility Score
  const overallScore = Math.round(
    energyScore * 0.28 + mindScore * 0.26 + heartScore * 0.26 + spiritualScore * 0.20
  );

  // 5. Deterministic Bond Title & Cosmic Narrative
  const bondInfo = generateBondNarrative(
    userName,
    userArchetype,
    userElement,
    partnerName,
    partnerZodiac,
    overallScore
  );

  return {
    overallScore,
    subScores: {
      energy: {
        label: 'Energy & Vitality',
        score: energyScore,
        desc: `${userElement} meets ${partnerZodiac.element}: dynamic physical & creative resonance.`,
        color: '#38BDF8',
      },
      mind: {
        label: 'Mind & Communication',
        score: mindScore,
        desc: `Intellectual harmony guided by ${partnerZodiac.ruler}.`,
        color: '#FDE68A',
      },
      heart: {
        label: 'Emotional & Love Bond',
        score: heartScore,
        desc: `Depth of mutual empathy and romantic frequency.`,
        color: '#F472B6',
      },
      understanding: {
        label: 'Spiritual Understanding',
        score: spiritualScore,
        desc: `Intuitive connection across life paths and cosmic destiny.`,
        color: '#C084FC',
      },
    },
    bondTitle: bondInfo.title,
    narrative: bondInfo.narrative,
    sparkTip: bondInfo.sparkTip,
    partner: {
      name: partnerName,
      zodiac: partnerZodiac,
    },
    user: {
      name: userName,
      archetype: userArchetype,
      element: userElement,
      auraColor: userProfile?.auraColor || '#7B2FFF',
    },
  };
}

/**
 * Deterministic Cosmic Narrative Generator
 */
function generateBondNarrative(userName, userArchetype, userElem, partnerName, partnerZodiac, overallScore) {
  let title = 'The Celestial Orbit';
  let narrative = '';
  let sparkTip = '';

  if (overallScore >= 88) {
    title = 'The Harmonic Constellation';
    narrative = `When ${userName}'s ${userArchetype} energy intersects with ${partnerName}'s ${partnerZodiac.name} (${partnerZodiac.element}), a rare celestial synergy awakens. Your natural palm vitality seamlessly fuels their ${partnerZodiac.ruler}-guided vision, creating an effortless magnetic momentum that elevates both spirit and ambition.`;
    sparkTip = 'Celebrate shared milestones early. Your joint creative frequency peaks when you embark on bold, shared adventures.';
  } else if (overallScore >= 78) {
    title = 'The Alchemical Equilibrium';
    narrative = `${userName} and ${partnerName} bring contrasting cosmic elements that balance one another like celestial tides. While ${userName}'s ${userElem} essence provides grounding intention, ${partnerName}'s ${partnerZodiac.name} presence introduces inventive clarity and rhythmic depth to the partnership.`;
    sparkTip = 'Give each other space for independent orbit. Mutual independence deepens the gravity of your reunion.';
  } else {
    title = 'The Starlight Catalyst';
    narrative = `A dynamic relationship full of passion and transformative lessons. ${userName}'s biometric pulse and ${partnerName}'s ${partnerZodiac.element} spirit challenge each other to evolve beyond comfort zones, forging resilience through deep authentic honesty.`;
    sparkTip = 'Focus on transparent communication. Bridging your different elemental rhythms creates an unbreakable foundation.';
  }

  return { title, narrative, sparkTip };
}
