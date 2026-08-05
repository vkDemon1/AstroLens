"""
AstroLens — Gemini LLM Service
================================
Transforms raw palm line features into a compelling, shareable astrological
reading using Google's Gemini API.

The prompt is carefully structured so the model returns valid JSON every time
(using response_mime_type="application/json" in the Gemini config).
"""

import json
import os
import random
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Gemini client initialisation
# ---------------------------------------------------------------------------
_API_KEY = os.getenv("GEMINI_API_KEY", "")
_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if _API_KEY:
    genai.configure(api_key=_API_KEY)

# ---------------------------------------------------------------------------
# Aura colour palette — mapped to dominant personality archetypes
# ---------------------------------------------------------------------------
AURA_ARCHETYPES = {
    "Indigo Visionary":    {"color": "#6610f2", "hex_name": "Indigo",  "trait": "visionary intuition"},
    "Violet Mystic":       {"color": "#7b2fff", "hex_name": "Violet",  "trait": "deep spiritual connection"},
    "Crimson Trailblazer": {"color": "#e63946", "hex_name": "Crimson", "trait": "bold, unstoppable drive"},
    "Gold Luminary":       {"color": "#c9a227", "hex_name": "Gold",    "trait": "radiant wisdom and leadership"},
    "Teal Empath":         {"color": "#2ec4b6", "hex_name": "Teal",    "trait": "healing empathy and clarity"},
    "Rose Harmoniser":     {"color": "#e040fb", "hex_name": "Rose",    "trait": "magnetic warmth and creativity"},
}


def _select_archetype(life: float, head: float, heart: float) -> dict:
    """
    Deterministically select an aura archetype based on which palm line is
    most dominant. Ties are broken by a hash of the three scores.
    """
    dominant = max(("life", life), ("head", head), ("heart", heart), key=lambda x: x[1])[0]
    aura_score = (life + head + heart) / 3.0

    if dominant == "life":
        return ("Crimson Trailblazer" if aura_score > 0.6 else "Gold Luminary",
                AURA_ARCHETYPES["Crimson Trailblazer" if aura_score > 0.6 else "Gold Luminary"])
    elif dominant == "head":
        return ("Indigo Visionary" if aura_score > 0.5 else "Teal Empath",
                AURA_ARCHETYPES["Indigo Visionary" if aura_score > 0.5 else "Teal Empath"])
    else:
        return ("Violet Mystic" if aura_score > 0.55 else "Rose Harmoniser",
                AURA_ARCHETYPES["Violet Mystic" if aura_score > 0.55 else "Rose Harmoniser"])


# ---------------------------------------------------------------------------
# Prompt builder
# ---------------------------------------------------------------------------
def _build_prompt(
    life_label: str,
    head_label: str,
    heart_label: str,
    aura_score: int,
    archetype_name: str,
    aura_trait: str,
) -> str:
    return f"""You are AstroLens, an expert AI palm reader and astrology guide.
A user has just scanned their palm. The computer vision analysis reveals:

  • Life Line:  {life_label}
  • Head Line:  {head_label}
  • Heart Line: {heart_label}
  • Aura Score: {aura_score}/100
  • Aura Archetype: {archetype_name} — characterised by {aura_trait}

Your task: Generate a personalised palm reading in JSON format. Follow these rules exactly:
1. The "reading" must be EXACTLY 3 sentences. Each sentence is vivid, mystical, and highly shareable on social media.
2. Focus on career ambitions, energy levels, and emotional depth.
3. "title" is a poetic 4-6 word headline that captures the essence of the reading.
4. "career_insight" is one concise sentence (max 15 words) about their professional path.
5. "energy_insight" is one concise sentence (max 15 words) about their life energy.
6. "lucky_element" is a single word (e.g., Fire, Water, Air, Earth, Ether).
7. "cta_teaser" is a single sentence (max 20 words) that creates curiosity and entices the user to book a live astrologer call for more detail.
8. Do NOT use generic platitudes. Be specific to the line characteristics provided.
9. Return ONLY valid JSON. No markdown. No explanation.

Required JSON schema:
{{
  "title": "string",
  "reading": "string (exactly 3 sentences)",
  "career_insight": "string",
  "energy_insight": "string",
  "lucky_element": "string",
  "cta_teaser": "string"
}}"""


# ---------------------------------------------------------------------------
# Fallback readings — used when API key is not set (demo / testing mode)
# ---------------------------------------------------------------------------
_FALLBACK_READINGS = [
    {
        "title": "The Stars Align For You",
        "reading": "Your Life line carves a deep, unbroken arc of pure vitality — a soul built for extraordinary endurance. The Head line's steady clarity suggests a mind that cuts through chaos with surgical precision. Where others hesitate, the universe has written your name in constellations of bold action.",
        "career_insight": "A breakthrough awaits those who trust their instincts above all doubt.",
        "energy_insight": "Your reserves run deep — channel them before the new moon rises.",
        "lucky_element": "Fire",
        "cta_teaser": "Your full cosmic blueprint holds three more hidden pivots — a live astrologer can reveal them.",
    },
    {
        "title": "Echoes of an Ancient Soul",
        "reading": "The gentle tracing of your Heart line speaks of someone who loves with a rare, quiet depth that reshapes everyone it touches. Your Head line's introspective curve reveals a philosopher-king or queen, constantly searching for truth behind the veil of the obvious. The cosmos marks you as a bridge between worlds.",
        "career_insight": "Creative fields and healing arts are where your legacy quietly waits.",
        "energy_insight": "Stillness is your superpower — protect your energy with sacred boundaries.",
        "lucky_element": "Water",
        "cta_teaser": "There's a hidden timing window in your chart — book a live reading to discover it.",
    },
]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
def generate_reading(
    life_label: str,
    head_label: str,
    heart_label: str,
    life_score: float,
    head_score: float,
    heart_score: float,
    aura_score: int,
) -> dict:
    """
    Generate a structured palm reading via the Gemini API.

    Args:
        life_label  : Human-readable Life line prominence (e.g., "clearly pronounced").
        head_label  : Human-readable Head line prominence.
        heart_label : Human-readable Heart line prominence.
        life_score  : Numeric Life line score (0–1).
        head_score  : Numeric Head line score (0–1).
        heart_score : Numeric Heart line score (0–1).
        aura_score  : Composite Aura Score (0–100).

    Returns:
        dict with keys: title, reading, career_insight, energy_insight,
                        lucky_element, cta_teaser, aura_color, archetype_name.
    """
    archetype_name, archetype_data = _select_archetype(life_score, head_score, heart_score)

    # --- Try the real Gemini API ---
    if _API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name=_MODEL,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.85,
                    max_output_tokens=512,
                ),
            )
            prompt = _build_prompt(
                life_label=life_label,
                head_label=head_label,
                heart_label=heart_label,
                aura_score=aura_score,
                archetype_name=archetype_name,
                aura_trait=archetype_data["trait"],
            )
            response = model.generate_content(prompt)
            reading_data = json.loads(response.text)

            reading_data["aura_color"]      = archetype_data["color"]
            reading_data["archetype_name"]  = archetype_name
            reading_data["aura_hex_name"]   = archetype_data["hex_name"]
            return reading_data

        except Exception as exc:
            # Log and fall through to the fallback
            print(f"[llm_service] Gemini API error: {exc}. Using fallback reading.")

    # --- Fallback (no API key or API error) ---
    fallback = random.choice(_FALLBACK_READINGS).copy()
    fallback["aura_color"]     = archetype_data["color"]
    fallback["archetype_name"] = archetype_name
    fallback["aura_hex_name"]  = archetype_data["hex_name"]
    return fallback
