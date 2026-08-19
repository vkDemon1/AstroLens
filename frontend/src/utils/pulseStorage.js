/**
 * AstroLens — Daily Palm Pulse storage
 * Real localStorage-backed streak logic, same pattern as History.jsx's
 * `astrolens_history` key.
 */

const PULSE_KEY = 'astrolens_pulse_state';

const PULSE_THEMES = [
  'Trust your instincts. A rare alignment fuels bold decisions.',
  'Stillness reveals what motion hides. Slow down before you leap.',
  'A quiet win compounds today. Protect your focus from noise.',
  'Old patterns loosen their grip. Say the thing you have been holding back.',
  'Momentum favors first movers today. Start before you feel fully ready.',
  'Your energy is best spent on one thing, not five. Choose it early.',
  "A conversation you've been avoiding is more ready than you think.",
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

function savePulseState(state) {
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

function computeNextStreak(prevState) {
  if (!prevState) return 1;
  const diffDays = Math.round(
    (new Date(todayStr()) - new Date(prevState.lastDate)) / 86400000
  );
  if (diffDays === 0) return prevState.streak;
  if (diffDays === 1) return prevState.streak + 1;
  return 1;
}

export function hasCompletedToday(state) {
  return Boolean(state && state.lastDate === todayStr());
}

export function completeTodaysPulse(seedBase) {
  const prev = loadPulseState();
  if (hasCompletedToday(prev)) return prev;

  const metrics = generateTodaysPulse(seedBase);
  const streak = computeNextStreak(prev);
  const next = { lastDate: todayStr(), streak, metrics };
  savePulseState(next);
  return next;
}
