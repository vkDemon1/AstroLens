/**
 * AstroLens — Cosmic Compatibility Invite & Viral Share Utility (Phase 4B-1)
 *
 * Provides URL-safe encoding/decoding for invite payloads, share message formatting,
 * dynamic base-aware URL generation, and local persistence.
 */

const INVITE_STORAGE_KEY = 'astrolens_compatibility_invite';
const EVENTS_STORAGE_KEY = 'astrolens_compat_events';

/**
 * Encodes minimum non-sensitive profile info into a URL-safe Base64 string.
 * Payload includes:
 *   n: User Name (trimmed, max 30 chars)
 *   a: Archetype Name
 *   s: Aura Score (0-100)
 *   c: Aura Color hex
 *   e: Lucky Element
 *   p: Partner Name (optional)
 *   r: Compatibility Score (optional)
 *   t: Timestamp (ms)
 *
 * @param {object} userProfile - Current user profile from getProfile()
 * @param {string} [partnerName] - Partner's name
 * @param {number} [score] - Calculated compatibility score
 * @returns {string} URL-safe base64 string
 */
export function encodeInvitePayload(userProfile, partnerName = '', score = null) {
  try {
    const payload = {
      n: (userProfile?.name || 'Seeker').trim().slice(0, 30),
      a: userProfile?.archetype || 'Cosmic Trailblazer',
      s: typeof userProfile?.auraScore === 'number' ? userProfile.auraScore : 78,
      c: userProfile?.auraColor || '#7B2FFF',
      e: userProfile?.luckyElement || 'Fire',
      p: partnerName ? partnerName.trim().slice(0, 30) : undefined,
      r: typeof score === 'number' ? score : undefined,
      t: Date.now(),
    };

    const json = JSON.stringify(payload);
    // Base64 with URL-safe replacement of +, /, and =
    const b64 = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return b64;
  } catch (err) {
    console.error('Failed to encode invite payload:', err);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 invite payload.
 *
 * @param {string} encodedStr - URL-safe Base64 string
 * @returns {object|null} Decoded payload object or null if invalid
 */
export function decodeInvitePayload(encodedStr) {
  if (!encodedStr || typeof encodedStr !== 'string') return null;

  try {
    let b64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = decodeURIComponent(escape(atob(b64)));
    const data = JSON.parse(json);

    if (!data || typeof data !== 'object') return null;

    return {
      name: data.n || 'Seeker',
      archetype: data.a || 'Cosmic Trailblazer',
      auraScore: typeof data.s === 'number' ? data.s : 78,
      auraColor: data.c || '#7B2FFF',
      luckyElement: data.e || 'Fire',
      partnerName: data.p || '',
      compatibilityScore: typeof data.r === 'number' ? data.r : null,
      createdAt: data.t || Date.now(),
    };
  } catch (err) {
    console.warn('Failed to decode invite payload:', err);
    return null;
  }
}

/**
 * Builds the full invite URL incorporating Vite's dynamic base URL.
 *
 * @param {object} userProfile - User profile object
 * @param {string} [partnerName] - Partner name
 * @param {number} [score] - Compatibility score
 * @returns {string} Full destination invite URL
 */
export function buildInviteUrl(userProfile, partnerName = '', score = null) {
  const origin = window.location.origin;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const encoded = encodeInvitePayload(userProfile, partnerName, score);
  return `${origin}${cleanBase}?compare=${encoded}`;
}

/**
 * Formats a celestial, concise share message.
 *
 * @param {object} userProfile
 * @param {string} partnerName
 * @param {number} score
 * @param {string} inviteUrl
 * @returns {string}
 */
export function formatShareMessage(userProfile, partnerName = '', score = null, inviteUrl = '') {
  const userName = userProfile?.name?.trim() || 'My Universe';
  const partner = partnerName?.trim() || 'Your Universe';
  const scoreDisplay = score != null ? `${score}%` : 'Harmonic';

  return `✦ I just discovered our Cosmic Compatibility on AstroLens!

${userName} + ${partner} · ${scoreDisplay} Celestial Resonance ✨

Your cosmic match is only half the story. Tap to reveal our connection:
${inviteUrl}`;
}

/**
 * Saves the latest generated invite locally.
 *
 * @param {object} inviteData - { inviteUrl, partnerName, score, createdAt }
 */
export function saveLatestInvite(inviteData) {
  try {
    const record = {
      ...inviteData,
      createdAt: inviteData.createdAt || Date.now(),
    };
    localStorage.setItem(INVITE_STORAGE_KEY, JSON.stringify(record));
  } catch (err) {
    console.warn('Could not save latest invite to localStorage:', err);
  }
}

/**
 * Retrieves the latest generated invite from localStorage.
 *
 * @returns {object|null}
 */
export function getLatestInvite() {
  try {
    const raw = localStorage.getItem(INVITE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Lightweight local event tracker for viral loop telemetry.
 *
 * @param {string} eventName
 * @param {object} [eventData]
 */
export function trackCompatEvent(eventName, eventData = {}) {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push({
      event: eventName,
      data: eventData,
      timestamp: Date.now(),
    });
    // Keep max 50 recent events to conserve space
    if (events.length > 50) events.shift();
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Silent fallback
  }
}
