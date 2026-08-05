/**
 * AstroLens API Service
 * Wraps all calls to the FastAPI backend.
 */

// In production, VITE_API_URL should point to your Railway/Render backend.
// In development, the Vite proxy handles /api -> localhost:8000.
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';

/**
 * Send a base64-encoded image frame to the palm scan endpoint.
 * @param {string} base64Image - data-URL or raw base64 string from the webcam.
 * @param {boolean} debug      - Request the ROI debug overlay image.
 * @returns {Promise<object>}  - Parsed JSON response from the backend.
 */
export async function scanPalm(base64Image, debug = false) {
  const response = await fetch(`${BASE_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, debug }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a pre-baked demo reading (no image required).
 * @returns {Promise<object>}
 */
export async function getDemoReading() {
  const response = await fetch(`${BASE_URL}/api/demo`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
