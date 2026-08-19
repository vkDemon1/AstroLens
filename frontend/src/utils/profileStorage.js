/**
 * AstroLens — Personal Profile Storage (Phase 2: My Universe)
 *
 * Manages local user cosmic identity, name, and aggregated metrics.
 * Local-first: uses localStorage ('astrolens_profile') and bridges seamlessly
 * with existing 'astrolens_history' and 'astrolens_pulse_state'.
 */

import { loadPulseState, hasCompletedToday } from './pulseStorage';

const PROFILE_KEY = 'astrolens_profile';
const HISTORY_KEY = 'astrolens_history';

/**
 * Reads the latest history array from localStorage.
 * @returns {Array<object>}
 */
function getStoredHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Loads the raw profile object stored under `astrolens_profile`.
 * @returns {object|null}
 */
export function loadRawProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

/**
 * Persists the profile object into localStorage.
 * @param {object} profile
 */
export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage unavailable — fail silently */
  }
}

/**
 * Retrieves the aggregated personal cosmic profile.
 * Merges raw profile metadata with live history and daily pulse state.
 * If raw profile doesn't exist yet but history does, gracefully auto-hydrates.
 *
 * @returns {object} Full profile data
 */
export function getProfile() {
  const raw = loadRawProfile() || {};
  const history = getStoredHistory();
  const pulse = loadPulseState();

  const latestReading = history.length > 0 ? history[0] : null;

  const totalReadings = history.length;
  const currentStreak = pulse?.streak || raw.currentStreak || 0;

  // Energy, focus, emotion metrics from pulse or line scores
  const energyScore =
    pulse?.metrics?.energy ??
    (latestReading?.life_score != null ? Math.round(latestReading.life_score * 100) : raw.energyScore ?? null);

  const focusScore =
    pulse?.metrics?.focus ??
    (latestReading?.head_score != null ? Math.round(latestReading.head_score * 100) : raw.focusScore ?? null);

  const emotionScore =
    pulse?.metrics?.emotion ??
    (latestReading?.heart_score != null ? Math.round(latestReading.heart_score * 100) : raw.emotionScore ?? null);

  return {
    name: raw.name || '',
    createdAt: raw.createdAt || (latestReading ? latestReading.timestamp : new Date().toISOString()),
    lastActiveAt: raw.lastActiveAt || (latestReading ? latestReading.timestamp : new Date().toISOString()),
    archetype: raw.archetype || latestReading?.archetype_name || '',
    auraHexName: raw.auraHexName || latestReading?.aura_hex_name || '',
    auraColor: raw.auraColor || latestReading?.aura_color || '#7b2fff',
    auraScore: raw.auraScore ?? latestReading?.aura_score ?? null,
    luckyElement: raw.luckyElement || latestReading?.lucky_element || '',
    title: raw.title || latestReading?.title || '',
    lifeScore: raw.lifeScore ?? latestReading?.life_score ?? null,
    headScore: raw.headScore ?? latestReading?.head_score ?? null,
    heartScore: raw.heartScore ?? latestReading?.heart_score ?? null,
    energyScore,
    focusScore,
    emotionScore,
    totalReadings,
    currentStreak,
    hasHistory: totalReadings > 0 || Boolean(raw.archetype),
    pulseTheme: pulse?.metrics?.theme || null,
    pulseMood: pulse?.mood || null,
    pulseReflection: pulse?.reflection || null,
    pulseCompletedToday: hasCompletedToday(pulse),
    pulseTomorrowTeaser: pulse?.tomorrowTeaser || null,
  };
}

/**
 * Updates or sets the user's cosmic name.
 * @param {string} name
 * @returns {object} Updated profile
 */
export function updateProfileName(name) {
  const current = getProfile();
  const updated = {
    ...current,
    name: (name || '').trim(),
    lastActiveAt: new Date().toISOString(),
  };
  saveProfile(updated);
  return updated;
}

/**
 * Updates profile state immediately when a palm scan result is produced.
 * @param {object} result - Palm scan reading result
 * @returns {object} Updated profile
 */
export function syncProfileFromReading(result) {
  if (!result) return getProfile();

  const current = getProfile();
  const history = getStoredHistory();

  const updated = {
    ...current,
    archetype: result.archetype_name || current.archetype,
    auraHexName: result.aura_hex_name || current.auraHexName,
    auraColor: result.aura_color || current.auraColor,
    auraScore: result.aura_score ?? current.auraScore,
    luckyElement: result.lucky_element || current.luckyElement,
    title: result.title || current.title,
    lifeScore: result.life?.score ?? current.lifeScore,
    headScore: result.head?.score ?? current.headScore,
    heartScore: result.heart?.score ?? current.heartScore,
    totalReadings: Math.max(current.totalReadings, history.length),
    lastActiveAt: new Date().toISOString(),
    createdAt: current.createdAt || new Date().toISOString(),
  };

  saveProfile(updated);
  return updated;
}
