/**
 * AstroLens — Daily Palm Pulse & Retention Storage (Phase 3)
 *
 * Single source of truth for daily check-ins, habit streak calculations,
 * milestone tiers, mood tracking, cosmic reflections, and tomorrow previews.
 * Stored under `astrolens_pulse_state` in localStorage.
 */

const PULSE_KEY = 'astrolens_pulse_state';

export const PULSE_THEMES = [
  'Trust your instincts. A rare alignment fuels bold decisions.',
  'Stillness reveals what motion hides. Slow down before you leap.',
  'A quiet win compounds today. Protect your focus from noise.',
  'Old patterns loosen their grip. Say the thing you have been holding back.',
  'Momentum favors first movers today. Start before you feel fully ready.',
  'Your energy is best spent on one thing, not five. Choose it early.',
  "A conversation you've been avoiding is more ready than you think.",
];

export const TOMORROW_TEASERS = [
  'A subtle shift in emotional energy approaches. Watch for heartfelt synchronicities.',
  'Your mental focus vector sharpens overnight. Ideal for decisive strategic moves.',
  'Vital energy reserves build toward peak momentum by midday tomorrow.',
  'Planetary transits align for unexpected clarity on long-standing questions.',
  'A restorative harmonic wave settles over your personal aura.',
  'Intuitive cues will speak louder than logic tomorrow morning.',
  'Your life line resonance indicates renewed vitality on the horizon.',
];

export const STREAK_MILESTONES = [
  { days: 3,  title: 'Cosmic Explorer', icon: '🧭', desc: 'First celestial orbit completed' },
  { days: 7,  title: 'Pattern Seeker',  icon: '✨', desc: 'Resonance waves stabilizing' },
  { days: 14, title: 'Deep Observer',   icon: '🔮', desc: 'Attuned to deeper palm frequencies' },
  { days: 30, title: 'Cosmic Insider',  icon: '👑', desc: 'Mastery over astral rhythms' },
];

export const MOOD_OPTIONS = [
  { id: 'great',    label: 'Great',    icon: '😄' },
  { id: 'good',     label: 'Good',     icon: '🙂' },
  { id: 'neutral',  label: 'Neutral',  icon: '😐' },
  { id: 'low',      label: 'Low',      icon: '😔' },
  { id: 'restless', label: 'Restless', icon: '😤' },
];

export const REFLECTION_OPTIONS = [
  { id: 'career',        label: 'Career',        icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '❤️' },
  { id: 'creativity',    label: 'Creativity',    icon: '🎨' },
  { id: 'self',          label: 'Self',          icon: '🧘' },
  { id: 'money',         label: 'Money',         icon: '💰' },
];

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function loadPulseState() {
  try {
    return JSON.parse(localStorage.getItem(PULSE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function savePulseState(state) {
  try {
    localStorage.setItem(PULSE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — fail silently */
  }
}

function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (Math.imul(31, h) + seedStr.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateTodaysPulse(seedBase = 'guest') {
  const rand = seededRandom(String(seedBase) + todayStr());
  return {
    energy: Math.round(55 + rand() * 40),
    focus: Math.round(50 + rand() * 40),
    emotion: Math.round(55 + rand() * 40),
    theme: PULSE_THEMES[Math.floor(rand() * PULSE_THEMES.length)],
  };
}

export function getTomorrowTeaser(seedBase = 'guest') {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateStr = tomorrow.toISOString().slice(0, 10);
  const rand = seededRandom(String(seedBase) + tomorrowDateStr);
  return TOMORROW_TEASERS[Math.floor(rand() * TOMORROW_TEASERS.length)];
}

export function getPulseMilestoneProgress(streak = 0) {
  const s = Math.max(0, Number(streak) || 0);

  let currentMilestone = null;
  let nextMilestone = STREAK_MILESTONES[0];

  for (let i = 0; i < STREAK_MILESTONES.length; i++) {
    if (s >= STREAK_MILESTONES[i].days) {
      currentMilestone = STREAK_MILESTONES[i];
      nextMilestone = STREAK_MILESTONES[i + 1] || null;
    } else {
      nextMilestone = STREAK_MILESTONES[i];
      break;
    }
  }

  const prevDays = currentMilestone ? currentMilestone.days : 0;
  const targetDays = nextMilestone ? nextMilestone.days : (currentMilestone?.days || 30);
  const daysRemaining = nextMilestone ? Math.max(0, nextMilestone.days - s) : 0;

  const range = targetDays - prevDays;
  const progressWithinTier = range > 0 ? (s - prevDays) / range : 1;
  const progressPct = nextMilestone ? Math.min(100, Math.max(0, Math.round(progressWithinTier * 100))) : 100;

  return {
    currentMilestone,
    nextMilestone,
    daysRemaining,
    progressPct,
  };
}

function computeNextStreak(prevState) {
  if (!prevState || !prevState.lastDate) return 1;
  const diffDays = Math.round(
    (new Date(todayStr()) - new Date(prevState.lastDate)) / 86400000
  );
  if (diffDays === 0) return prevState.streak || 1;
  if (diffDays === 1) return (prevState.streak || 0) + 1;
  return 1;
}

export function hasCompletedToday(state) {
  return Boolean(state && state.lastDate === todayStr());
}

export function saveMoodToday(moodId) {
  const current = loadPulseState() || {};
  const updated = {
    ...current,
    mood: moodId,
  };
  savePulseState(updated);
  return updated;
}

export function saveReflectionToday(reflectionId) {
  const current = loadPulseState() || {};
  const updated = {
    ...current,
    reflection: reflectionId,
  };
  savePulseState(updated);
  return updated;
}

export function completeTodaysPulse(seedBase, mood = null, reflection = null) {
  const prev = loadPulseState();

  if (hasCompletedToday(prev)) {
    // If already completed today, update mood or reflection if specified without incrementing streak
    if (mood || reflection) {
      const updated = {
        ...prev,
        mood: mood || prev.mood,
        reflection: reflection || prev.reflection,
      };
      savePulseState(updated);
      return updated;
    }
    return prev;
  }

  const metrics = generateTodaysPulse(seedBase);
  const streak = computeNextStreak(prev);
  const tomorrowTeaser = getTomorrowTeaser(seedBase);

  const next = {
    lastDate: todayStr(),
    streak,
    metrics,
    mood: mood || prev?.mood || null,
    reflection: reflection || prev?.reflection || null,
    tomorrowTeaser,
  };

  savePulseState(next);
  return next;
}
