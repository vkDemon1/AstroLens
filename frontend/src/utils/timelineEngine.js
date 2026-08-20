/**
 * AstroLens — Cosmic Timeline Engine (Phase 6A)
 *
 * Local-first, deterministic calculation engine for longitudinal user tracking.
 * Sources reading data exclusively from 'astrolens_history' in localStorage.
 * Integrates daily pulse streak milestones from pulseStorage.
 */

import { loadPulseState, getPulseMilestoneProgress, STREAK_MILESTONES } from './pulseStorage';

const HISTORY_KEY = 'astrolens_history';

/**
 * Safely loads the raw history array from localStorage.
 * History is stored in newest-first order.
 * @returns {Array<object>}
 */
export function loadTimelineHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Formats an ISO date string into a compact cosmic date (e.g., "Aug 20" or "Aug 20, 2026").
 * @param {string|number} isoString
 * @param {boolean} includeYear
 * @returns {string}
 */
export function formatTimelineDate(isoString, includeYear = false) {
  if (!isoString) return 'Initial Scan';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Initial Scan';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      ...(includeYear ? { year: 'numeric' } : {}),
    });
  } catch {
    return 'Recent';
  }
}

/**
 * Formats an ISO date string into a detailed readable timestamp.
 * @param {string|number} isoString
 * @returns {string}
 */
export function formatFullTimelineDate(isoString) {
  if (!isoString) return 'Recorded';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recorded';
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recorded';
  }
}

/**
 * Computes Aura Evolution metrics from historical readings.
 * Stored history is newest-first, so we reverse it for chronological calculation.
 *
 * @param {Array<object>} history
 * @returns {object} Aura evolution data
 */
export function computeAuraEvolution(history = []) {
  if (!history || history.length === 0) {
    return {
      hasData: false,
      count: 0,
      current: null,
      initial: null,
      delta: 0,
      trendLabel: 'Awaiting Readings',
      trendDirection: 'neutral',
      series: [],
      flowString: '',
    };
  }

  // Reverse to get chronological order: oldest -> newest
  const chronological = [...history].reverse();
  const series = chronological.map(entry => ({
    id: entry.id || entry.timestamp,
    date: formatTimelineDate(entry.timestamp),
    score: Number(entry.aura_score) || 70,
    color: entry.aura_color || '#7b2fff',
    archetype: entry.archetype_name || 'Cosmic Seeker',
  }));

  const current = series[series.length - 1].score;
  const initial = series[0].score;
  const delta = current - initial;

  let trendLabel = 'Initial Identity';
  let trendDirection = 'neutral';

  if (series.length >= 2) {
    if (delta > 0) {
      trendLabel = `↗ Rising (+${delta})`;
      trendDirection = 'rising';
    } else if (delta < 0) {
      trendLabel = `↘ Calibrating (${delta})`;
      trendDirection = 'calibrating';
    } else {
      trendLabel = `⟷ Harmonized (±0)`;
      trendDirection = 'harmonized';
    }
  }

  const flowString = series.map(s => s.score).join(' → ');

  return {
    hasData: true,
    count: history.length,
    current,
    initial,
    delta,
    trendLabel,
    trendDirection,
    series,
    flowString,
  };
}

/**
 * Computes Line Score Evolution (Life, Head, Heart interpretation trends).
 *
 * @param {Array<object>} history
 * @returns {object} Line evolution series and deltas
 */
export function computeLineEvolution(history = []) {
  if (!history || history.length === 0) {
    return { hasData: false, life: null, head: null, heart: null };
  }

  const chronological = [...history].reverse();

  const extractLineData = (key, label) => {
    const rawScores = chronological.map(entry => {
      const val = entry[key] != null ? Number(entry[key]) : 0.7;
      return Math.round(val * 100);
    });

    const current = rawScores[rawScores.length - 1];
    const initial = rawScores[0];
    const delta = current - initial;
    const flowString = rawScores.join('% → ') + '%';

    let trend = 'steady';
    if (delta > 0) trend = 'up';
    else if (delta < 0) trend = 'down';

    return {
      label,
      current,
      initial,
      delta,
      trend,
      flowString,
      scores: rawScores,
    };
  };

  return {
    hasData: true,
    count: history.length,
    life: extractLineData('life_score', 'Life (Vitality)'),
    head: extractLineData('head_score', 'Head (Focus)'),
    heart: extractLineData('heart_score', 'Heart (Emotional Depth)'),
  };
}

/**
 * Deterministically generates the Before / Now Cosmic Shift comparison card.
 * Compares earliest reading vs latest reading.
 *
 * @param {Array<object>} history
 * @returns {object|null}
 */
export function computeCosmicShift(history = []) {
  if (!history || history.length < 2) return null;

  // Stored history is newest-first:
  // history[0] is latest reading
  // history[history.length - 1] is earliest reading
  const latest = history[0];
  const earliest = history[history.length - 1];

  const earliestAura = Number(earliest.aura_score) || 70;
  const latestAura = Number(latest.aura_score) || 70;
  const auraDiff = latestAura - earliestAura;

  const earliestLife = Math.round((earliest.life_score ?? 0.7) * 100);
  const latestLife = Math.round((latest.life_score ?? 0.7) * 100);
  const lifeDiff = latestLife - earliestLife;

  const earliestHead = Math.round((earliest.head_score ?? 0.7) * 100);
  const latestHead = Math.round((latest.head_score ?? 0.7) * 100);
  const headDiff = latestHead - earliestHead;

  const earliestHeart = Math.round((earliest.heart_score ?? 0.7) * 100);
  const latestHeart = Math.round((latest.heart_score ?? 0.7) * 100);
  const heartDiff = latestHeart - earliestHeart;

  // Deterministic astrological synthesis narrative
  let narrative = '';
  if (lifeDiff > 0 && headDiff > 0) {
    narrative = `Your latest palm interpretation reveals advancing vitality (+${lifeDiff}%) and heightened strategic focus (+${headDiff}%), indicating a powerful growth cycle.`;
  } else if (heartDiff > 0 && lifeDiff >= 0) {
    narrative = `Your emotional depth resonance has expanded (+${heartDiff}%), infusing your cosmic blueprint with deeper intuitive clarity and relational strength.`;
  } else if (headDiff > 0 && heartDiff >= 0) {
    narrative = `Your mental clarity (+${headDiff}%) has deepened in harmony with your emotional vector, bringing greater discernment to major life decisions.`;
  } else if (auraDiff > 0) {
    narrative = `Your overall astral aura has ascended by +${auraDiff} points, reflecting stabilized resonance across your primary palm lines.`;
  } else if (auraDiff < 0 || lifeDiff < 0) {
    narrative = `Your palm lines reflect a restful calibration cycle, recalibrating inner focus and conserving energy for an upcoming celestial phase.`;
  } else {
    narrative = `Your celestial coordinates demonstrate steady energetic equilibrium, preserving harmonic balance across life, intellect, and emotion.`;
  }

  return {
    earliest: {
      date: formatFullTimelineDate(earliest.timestamp),
      compactDate: formatTimelineDate(earliest.timestamp),
      archetype: earliest.archetype_name || 'Cosmic Seeker',
      aura: earliestAura,
      life: earliestLife,
      head: earliestHead,
      heart: earliestHeart,
      color: earliest.aura_color || '#7b2fff',
      element: earliest.lucky_element || 'Aether',
    },
    latest: {
      date: formatFullTimelineDate(latest.timestamp),
      compactDate: formatTimelineDate(latest.timestamp),
      archetype: latest.archetype_name || 'Cosmic Seeker',
      aura: latestAura,
      life: latestLife,
      head: latestHead,
      heart: latestHeart,
      color: latest.aura_color || '#7b2fff',
      element: latest.lucky_element || 'Aether',
    },
    diffs: {
      aura: auraDiff,
      life: lifeDiff,
      head: headDiff,
      heart: heartDiff,
    },
    narrative,
  };
}

/**
 * Extracts Daily Pulse streak milestone achievements.
 * Uses existing pulseStorage functions and milestones.
 *
 * @returns {object} Milestone overview for timeline
 */
export function getTimelineMilestoneData() {
  const pulse = loadPulseState();
  const streak = pulse?.streak || 0;
  const progress = getPulseMilestoneProgress(streak);

  const milestonesWithStatus = STREAK_MILESTONES.map(m => ({
    ...m,
    isUnlocked: streak >= m.days,
    isActive: progress.currentMilestone?.days === m.days,
  }));

  return {
    streak,
    currentMilestone: progress.currentMilestone,
    nextMilestone: progress.nextMilestone,
    daysRemaining: progress.daysRemaining,
    progressPct: progress.progressPct,
    milestones: milestonesWithStatus,
  };
}

/**
 * Maps a stored history entry back to a complete reading result object
 * that ResultCard expects when onNavigate('result', result) is called.
 *
 * @param {object} entry
 * @returns {object} Full reading result
 */
export function mapEntryToReadingResult(entry) {
  if (!entry) return null;

  return {
    hand_detected: true,
    aura_score: Number(entry.aura_score) || 75,
    aura_color: entry.aura_color || '#7b2fff',
    archetype_name: entry.archetype_name || 'Cosmic Seeker',
    aura_hex_name: entry.aura_hex_name || '',
    title: entry.title || 'Personal Celestial Reading',
    reading: entry.reading || 'Your palm lines reveal a unique celestial harmony etched into your hand topology.',
    career_insight: entry.career_insight || 'Your path expands through focused dedication and strategic alignment.',
    energy_insight: entry.energy_insight || 'Harmonize your inner fire with mindful pacing to sustain peak momentum.',
    lucky_element: entry.lucky_element || 'Aether',
    cta_teaser: entry.cta_teaser || 'Your palm holds deep planetary alignments ready to unfold.',
    life: {
      score: entry.life_score != null ? Number(entry.life_score) : 0.75,
      label: 'interpreted from chronicle',
    },
    head: {
      score: entry.head_score != null ? Number(entry.head_score) : 0.70,
      label: 'interpreted from chronicle',
    },
    heart: {
      score: entry.heart_score != null ? Number(entry.heart_score) : 0.65,
      label: 'interpreted from chronicle',
    },
  };
}
