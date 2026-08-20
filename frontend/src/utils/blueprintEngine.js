/**
 * AstroLens — Deterministic Cosmic Blueprint Generator (Phase 5B)
 *
 * Generates a comprehensive 12-section personalized deep reading, Key Pattern,
 * and contextual AstroLive recommendation based on the user's existing reading data.
 * Purely client-side, 100% offline-compatible, single source of truth for fallback.
 */

const STORAGE_KEY_BLUEPRINT = 'astrolens_blueprint_state';
const STORAGE_KEY_EVENTS = 'astrolens_blueprint_events';

/**
 * Deterministically generates a 12-section Cosmic Blueprint dossier.
 *
 * @param {object} readingData - Existing palm reading data
 * @returns {object} Structured 12-section Cosmic Blueprint with Key Pattern
 */
export function generateCosmicBlueprint(readingData) {
  const data = readingData || {};

  const name = (data.name || 'Seeker').trim();
  const archetype = data.archetype_name || data.archetype || 'Gold Luminary';
  const auraScore = data.aura_score ?? data.auraScore ?? 78;
  const auraColor = data.aura_color || data.auraColor || '#FDE68A';
  const luckyElement = data.lucky_element || data.luckyElement || 'Fire';
  const lifeScore = Math.round((data.life?.score ?? data.life_score ?? 0.8) * 100);
  const headScore = Math.round((data.head?.score ?? data.head_score ?? 0.72) * 100);
  const heartScore = Math.round((data.heart?.score ?? data.heart_score ?? 0.68) * 100);
  const baseReading = data.reading || 'Your palm reveals deep ancestral currents aligning with celestial momentum.';
  const careerInsight = data.career_insight || 'Strategic leadership flows naturally when clarity meets ambition.';
  const energyInsight = data.energy_insight || 'Your energy peaks during periods of intentional creative focus.';

  // Determine dominant pattern category
  let keyPattern = {
    title: 'The Strategic Execution Polarity',
    description: `Your strongest unresolved pattern is the creative tension between visionary planning (${headScore}% Head Line) and energetic pacing (${lifeScore}% Life Line).`,
    category: 'career',
    primaryDomain: 'Career & Leadership',
    recommendedFocus: 'Protect uninterrupted morning execution windows when your strategic clarity peaks.',
  };
  let astroliveReason = 'Your Head line indicates a major vocational transition and strategic timing window approaching in the next 90 days.';
  let astrologerSpecialty = 'Career & Direction Astrologer';

  if (heartScore >= headScore && heartScore >= lifeScore) {
    keyPattern = {
      title: 'The Empathic Boundary Synthesis',
      description: `Your primary cosmic signature revolves around balancing profound emotional depth (${heartScore}% Heart Line) with energetic self-sovereignty.`,
      category: 'love',
      primaryDomain: 'Love & Emotional Dynamics',
      recommendedFocus: 'Communicate your boundaries early in partnerships to prevent energetic over-extension.',
    };
    astroliveReason = 'Your Heart line curvature reveals a transformative relationship cycle that benefits from personal synastry analysis.';
    astrologerSpecialty = 'Relationship & Synastry Astrologer';
  } else if (lifeScore >= headScore && lifeScore >= heartScore) {
    keyPattern = {
      title: 'The Sovereign Vitality Rhythm',
      description: `Your core energetic pattern is high constitutional stamina (${lifeScore}% Life Line) that requires intentional recovery to avoid sudden burnout.`,
      category: 'energy',
      primaryDomain: 'Vitality & Life Purpose',
      recommendedFocus: 'Anchor your week around deliberate stillness and natural outdoor cycles.',
    };
    astroliveReason = 'Your Life line depth indicates an upcoming life direction milestone where planetary transits strongly accelerate outcomes.';
    astrologerSpecialty = 'Vedic Life Purpose Astrologer';
  }

  return {
    source: 'fallback',
    meta: {
      name,
      archetype,
      auraScore,
      auraColor,
      luckyElement,
      generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      version: '12-Page Personalized Dossier',
    },
    keyPattern,
    astroliveReason,
    astrologerSpecialty,
    sections: [
      {
        id: 'identity',
        number: '01',
        title: 'Cosmic Identity & Aura Genesis',
        icon: '🌌',
        previewAllowed: true,
        summary: `Your energetic signature resonates at ${auraScore}/100 within the ${archetype} archetype.`,
        content: `${baseReading} Your palm radiates an ethereal ${auraColor} frequency, classifying you within the ${archetype} lineage. This cosmic matrix reflects individuals who act as vital conduits between strategic intellect and transformative emotional intuition. Your baseline aura density demonstrates a natural resistance to ambient psychic noise, allowing you to anchor sovereign decisions in high-velocity environments.`,
        takeaway: `Your sovereign energy field is strongest when aligned with authentic purpose rather than external validation.`,
      },
      {
        id: 'life',
        number: '02',
        title: 'Life Pattern & Vitality Flow',
        icon: '🌊',
        previewAllowed: true,
        summary: `Vitality index evaluated at ${lifeScore}% with profound continuity along the thenar eminence.`,
        content: `The primary curve of your Life line reveals an expansive energetic radius. At ${lifeScore}% prominence, your constitutional stamina is anchored in the ${luckyElement} element. You experience regenerative cycles in rhythmic waves rather than linear burns. Key bifurcations indicate major historical turning points where resilience turned impending fatigue into sovereign self-mastery.`,
        takeaway: `Honor your recovery cycles: your greatest breakthroughs follow deliberate stillness.`,
      },
      {
        id: 'career',
        number: '03',
        title: 'Career Timing & Vocational Trajectory',
        icon: '🧭',
        previewAllowed: false,
        summary: `Mental clarity rated at ${headScore}% with strong strategic focalization.`,
        content: `${careerInsight} Your Head line extends with decisive trajectory across the Martian plain, signaling an architectural mindset capable of structuring long-term systems. Over the coming quarters, an astrological transit indicates a convergence between your technical mastery and public leadership. You are entering an execution window where calculated risks yield disproportionate leverage.`,
        takeaway: `Focus on high-leverage decisions; delegate administrative friction to preserve visionary bandwidth.`,
      },
      {
        id: 'love',
        number: '04',
        title: 'Love & Emotional Bond Cycles',
        icon: '💜',
        previewAllowed: false,
        summary: `Heart line resonance measured at ${heartScore}% emotional depth.`,
        content: `Your Heart line exhibits an ascending arc toward the Mount of Jupiter, signifying a rare balance between passionate vulnerability and healthy self-preservation. In partnerships, you require both intellectual symmetry and unhurried emotional safety. When past emotional armor is transmuted into conscious boundaries, your magnetic attraction triples.`,
        takeaway: `True intimacy deepens when you share your unfinished thoughts rather than just polished conclusions.`,
      },
      {
        id: 'energy',
        number: '05',
        title: 'Energy & Focus Spectrum',
        icon: '⚡',
        previewAllowed: false,
        summary: `Cognitive rhythm optimized for high-intensity focal sprints.`,
        content: `${energyInsight} Biometric crease density shows that your nervous system processes sensory input at accelerated speed. To prevent energetic depletion, implement the 'Rule of Three': identify your three non-negotiable daily objectives and guard your morning hours from reactive digital demands.`,
        takeaway: `Protect the first 90 minutes of your day as sacred creative territory.`,
      },
      {
        id: 'hidden',
        number: '06',
        title: 'Hidden Palm Patterns & Minor Marks',
        icon: '👁️',
        previewAllowed: false,
        summary: `Micro-creases reveal an intuitive 'Healer’s Stigmata' and Apollo ray formation.`,
        content: `Deep within the palm topology, secondary micro-lines form a rare triangular nodal intersection beneath your ring finger (Mount of Apollo). In classical esoteric palmistry, this geometry marks individuals who possess an uncanny sixth sense for spotting unseen patterns, hidden motives, and cultural shifts months before the mainstream.`,
        takeaway: `Trust your immediate visceral instincts in interpersonal first impressions—they are statistically infallible for your archetype.`,
      },
      {
        id: 'strengths',
        number: '07',
        title: 'Core Astrological Strengths',
        icon: '🛡️',
        previewAllowed: false,
        summary: `Three foundational pillars defining your cosmic constitution.`,
        content: `1. **Sovereign Vision:** An innate refusal to conform to broken conventions.\n2. **Alchemical Resilience:** The rare capacity to convert setbacks into creative fuel.\n3. **Empathetic Command:** Leading others not through dominance, but through magnetic resonance and unshakeable clarity.`,
        takeaway: `Lean into your sovereign vision when collaborative consensus threatens to dilute your vision.`,
      },
      {
        id: 'growth',
        number: '08',
        title: 'Growth Friction & Shadow Work',
        icon: '⚖️',
        previewAllowed: false,
        summary: `Addressing the shadow polarity of hyper-independence.`,
        content: `Every luminary archetype contends with a specific blind spot: your tendency toward hyper-independence. Because your Head line is so clearly formed (${headScore}%), you frequently assume doing everything yourself is faster than explaining it. This creates unnecessary cognitive bottlenecking. Learning to trust trusted collaborators is your primary soul evolution this year.`,
        takeaway: `Delegation is not loss of control; it is the deliberate multiplication of your impact.`,
      },
      {
        id: 'window',
        number: '09',
        title: 'Upcoming Cosmic Alignment Window',
        icon: '🪐',
        previewAllowed: false,
        summary: `Next 90-Day celestial window indicates heightened manifestation potential.`,
        content: `Planetary transits intersecting your ${luckyElement} elemental matrix point to a significant 90-day gateway. Between weeks 3 and 7 of this cycle, planetary aspects favor signing contracts, initiating bold creative ventures, and redefining relationship terms. Avoid lingering in passive indecision during this golden window.`,
        takeaway: `Mark your calendar: your highest leverage action should be executed before the next solar inflection point.`,
      },
      {
        id: 'lucky',
        number: '10',
        title: 'Elemental Mastery & Lucky Frequencies',
        icon: '🔥',
        previewAllowed: false,
        summary: `Harmonic resonance tuned to ${luckyElement} element and solar hours.`,
        content: `Your elemental ruler is **${luckyElement}**. To synchronize your physical body with this cosmic current:\n• **Peak Power Hours:** Dawn (6:00 AM – 8:30 AM) and Solar Noon.\n• **Harmonic Gemstone Frequencies:** Citrine, Sunstone, or Deep Amethyst.\n• **Power Colors:** Radiant Gold (#FDE68A), Celestial Cyan (#38BDF8), and Royal Purple.`,
        takeaway: `Surround your workspace with natural sunlight and warm tones to instantly recalibrate your focus.`,
      },
      {
        id: 'guidance',
        number: '11',
        title: 'Action Guidance & Daily Mantras',
        icon: '📜',
        previewAllowed: false,
        summary: `Directives to anchor your highest cosmic potential daily.`,
        content: `• **Morning Declaration:** "My thoughts are clear, my energy is sovereign, and my path is unfolding in divine order."\n• **Midday Realignment:** Step away from all screens for 4 minutes of uninterrupted breathing.\n• **Evening Reflection:** Acknowledge one uncompromised truth you spoke today.`,
        takeaway: `Consistency in micro-habits builds an impenetrable energetic fortress.`,
      },
      {
        id: 'astrolive',
        number: '12',
        title: 'AstroLive Master Astrologer Recommendation',
        icon: '🌟',
        previewAllowed: true,
        summary: `A rare palm configuration warrants a personalized live chart synthesis.`,
        content: `Your palm lines present a rare intersection between the Mount of Mercury and your Life line. While AI provides precise topological readings, a certified human astrologer can synthesize your exact birth time, planetary transits, and Vedic Dasha periods to provide time-stamped life predictions.`,
        takeaway: `Connect with a verified AstroLive astrologer to unlock your complete astrological birth chart overlay.`,
      },
    ],
  };
}

/**
 * Retrieves the saved unified blueprint state from localStorage.
 *
 * @returns {object|null}
 */
export function getSavedBlueprintState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BLUEPRINT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Checks if the user has unlocked the Blueprint locally.
 *
 * @returns {boolean}
 */
export function isBlueprintUnlocked() {
  const state = getSavedBlueprintState();
  return Boolean(state && state.unlocked);
}

/**
 * Saves or updates the unified blueprint state to localStorage.
 *
 * @param {object} partialState - State updates to merge
 */
export function saveBlueprintState(partialState = {}) {
  try {
    const existing = getSavedBlueprintState() || {};
    const updated = {
      ...existing,
      ...partialState,
      price: '₹399',
      mode: 'demo-prototype',
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_BLUEPRINT, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not persist blueprint state:', err);
  }
}

/**
 * Sets unlocked state to true and preserves existing dossier data.
 */
export function setBlueprintUnlocked(unlocked = true) {
  saveBlueprintState({
    unlocked,
    unlockedAt: Date.now(),
  });
}

/**
 * Logs lightweight local events for monetization telemetry.
 *
 * @param {string} eventName
 * @param {object} [eventData]
 */
export function trackBlueprintEvent(eventName, eventData = {}) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    const events = raw ? JSON.parse(raw) : [];
    events.push({
      event: eventName,
      data: eventData,
      timestamp: Date.now(),
    });
    if (events.length > 50) events.shift();
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch {
    // Ignore storage errors
  }
}
