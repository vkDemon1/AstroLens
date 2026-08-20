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
from typing import Optional, Tuple

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Gemini client initialisation
# ---------------------------------------------------------------------------
_API_KEY = os.getenv("GEMINI_API_KEY", "")
_MODEL   = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

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


def _select_archetype(life: float, head: float, heart: float) -> Tuple[str, dict]:
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


# ═══════════════════════════════════════════════════════════════════════════
# ORACLE — live Cosmic Oracle feature (POST /api/oracle)
# ═══════════════════════════════════════════════════════════════════════════

_ORACLE_CATEGORY_TOPICS = {
    "love":      "romantic connection and emotional compatibility",
    "career":    "professional trajectory and career decisions",
    "money":     "financial prosperity and material abundance",
    "direction": "life direction and an upcoming major decision",
    "week":      "the energy and opportunities of the week ahead",
}

_ORACLE_FALLBACKS = {
    "love":      "Your heart line points toward a bond built on honesty rather than intensity. Let this one unfold at its own pace rather than forcing the timeline.",
    "career":    "Your head line favors deliberate strategy over speed right now. The slower, more careful path is the one that compounds into something lasting.",
    "money":     "Diversified effort serves you better than a single big bet this season. Small, steady moves quietly outperform the dramatic ones.",
    "direction": "A fork in your path is closer than it feels. Trust the option that unsettles you slightly — that's usually the real one.",
    "week":      "Momentum builds in the middle of this week. Use the early days to prepare quietly rather than push loudly.",
}


def _build_oracle_prompt(category, life_score, head_score, heart_score, archetype_name):
    topic = _ORACLE_CATEGORY_TOPICS.get(category, category)
    archetype_line = f" Their aura archetype is {archetype_name}." if archetype_name else ""
    return f"""You are AstroLens's Cosmic Oracle. A user is asking about {topic}.
Their palm scan measured: Life line {life_score:.2f}, Head line {head_score:.2f}, Heart line {heart_score:.2f} (each 0-1).{archetype_line}

Write EXACTLY 2 sentences. Reference whichever line score is highest and connect
it specifically to {topic} — be concrete, not generic. Mystical but useful tone,
like a sharp friend who happens to read palms. No preamble, no markdown, no
quotation marks — output just the 2 sentences of prose."""


def generate_oracle_reading(category, life_score, head_score, heart_score, archetype_name=None) -> Tuple[str, str]:
    """Returns (reading_text, source) where source is 'gemini' or 'fallback'."""
    if _API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name=_MODEL,
                generation_config=genai.GenerationConfig(
                    temperature=0.9,
                    max_output_tokens=120,
                ),
            )
            prompt = _build_oracle_prompt(category, life_score, head_score, heart_score, archetype_name)
            response = model.generate_content(prompt)
            text = (response.text or "").strip()
            if text:
                return text, "gemini"
        except Exception as exc:
            print(f"[llm_service] Oracle generation error: {exc}. Using fallback.")

    return _ORACLE_FALLBACKS.get(
        category,
        "The cosmic signal is faint right now — try again in a moment.",
    ), "fallback"


# ═══════════════════════════════════════════════════════════════════════════
# BLUEPRINT — AI Deep Cosmic Blueprint (POST /api/blueprint)
# ═══════════════════════════════════════════════════════════════════════════

def _build_blueprint_prompt(payload: dict) -> str:
    name = payload.get("name", "Seeker")
    archetype = payload.get("archetype", "Gold Luminary")
    aura_score = payload.get("aura_score", 78)
    aura_color = payload.get("aura_color", "#FDE68A")
    lucky_element = payload.get("lucky_element", "Fire")
    life_score = payload.get("life_score", 0.8)
    head_score = payload.get("head_score", 0.72)
    heart_score = payload.get("heart_score", 0.68)
    reading = payload.get("reading", "")
    career_insight = payload.get("career_insight", "")
    energy_insight = payload.get("energy_insight", "")

    return f"""You are AstroLens's Master Astrological AI Synthesizer.
Generate a deeply personalized 12-section Cosmic Blueprint dossier for {name} based on their palm analysis.

User Profile:
- Archetype: {archetype} (Aura Score: {aura_score}/100, Aura Color: {aura_color})
- Lucky Element: {lucky_element}
- Biometric Prominence: Life Line ({life_score:.2f}), Head Line ({head_score:.2f}), Heart Line ({heart_score:.2f})
- Core Reading: "{reading}"
- Career Insight: "{career_insight}"
- Energy Insight: "{energy_insight}"

Rules:
1. Maintain AstroLens's mystical, cosmic, and empowering tone (reflections and symbolic interpretation).
2. Avoid generic filler. Use the exact archetype, scores, and elemental attributes provided.
3. Return EXACTLY 12 sections with IDs: identity, life, career, love, energy, hidden, strengths, growth, window, lucky, guidance, astrolive.
4. Each section must have:
   - "id": string
   - "number": string ("01" to "12")
   - "title": string
   - "icon": string (emoji)
   - "summary": string (1 concise sentence)
   - "content": string (2-3 vivid sentences)
   - "takeaway": string (1 punchy actionable directive)
5. Surface ONE dominant "keyPattern" object:
   - "title": string
   - "description": string (explain the core tension or gift between their highest and secondary palm scores)
   - "category": "career" | "love" | "energy" | "direction"
   - "primaryDomain": string
   - "recommendedFocus": string
6. Provide "astroliveReason": string (1-2 sentences explaining why a live human astrologer can synthesize this specific pattern with their exact birth chart)
7. Provide "astrologerSpecialty": string (e.g. "Career & Direction Astrologer", "Relationship & Synastry Astrologer", or "Vedic Life Purpose Astrologer")
8. Return ONLY valid JSON with keys: "sections", "keyPattern", "astroliveReason", "astrologerSpecialty".
"""


def generate_blueprint_reading(payload: dict) -> Tuple[Optional[dict], str]:
    """
    Generates a structured 12-section Blueprint using Gemini.
    Returns (result_dict, "gemini") on success or (None, "fallback") on failure.
    """
    if _API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name=_MODEL,
                generation_config=genai.GenerationConfig(
                    temperature=0.85,
                    response_mime_type="application/json",
                    max_output_tokens=4096,
                ),
            )
            prompt = _build_blueprint_prompt(payload)
            response = model.generate_content(prompt)
            raw_text = (response.text or "").strip()
            data = json.loads(raw_text)

            if isinstance(data, dict) and "sections" in data and len(data["sections"]) == 12:
                return data, "gemini"
            else:
                print(f"[llm_service] Blueprint output missing valid sections. Structure: {list(data.keys()) if isinstance(data, dict) else type(data)}")
        except Exception as exc:
            print(f"[llm_service] Blueprint Gemini generation error: {exc}. Deferring to fallback.")

    return None, "fallback"


