"""
AstroLens — /api/scan Router
==============================
Single POST endpoint that:
  1. Accepts a base64 image frame from the React frontend.
  2. Runs the full CV pipeline (cv_pipeline.py).
  3. Calls the LLM service (llm_service.py) for the reading.
  4. Returns a structured JSON response.

Also exposes a GET /api/demo endpoint that returns a pre-baked response,
useful for judges who don't have a webcam or want a quick preview.
"""

import random
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from cv_pipeline import run_pipeline
from llm_service import generate_reading

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------
class ScanRequest(BaseModel):
    image: str            # base64-encoded JPEG/PNG (with or without data-URL prefix)
    debug: bool = False   # if True, include ROI edge map in response


class LineFeature(BaseModel):
    score: float
    label: str


class ScanResponse(BaseModel):
    hand_detected: bool
    aura_score: int
    life: LineFeature
    head: LineFeature
    heart: LineFeature
    title: str
    reading: str
    career_insight: str
    energy_insight: str
    lucky_element: str
    cta_teaser: str
    aura_color: str
    archetype_name: str
    aura_hex_name: str
    roi_debug_b64: Optional[str] = None


# ---------------------------------------------------------------------------
# POST /api/scan
# ---------------------------------------------------------------------------
@router.post("/scan", response_model=ScanResponse)
async def scan_palm(request: ScanRequest):
    """
    Main scan endpoint.

    Accepts a single base64 image frame from the browser webcam,
    runs the CV + LLM pipeline, and returns the full reading.
    """
    if not request.image:
        raise HTTPException(status_code=400, detail="No image data provided.")

    # --- Step 1: CV Pipeline ---
    try:
        palm_features = run_pipeline(
            b64_image=request.image,
            include_debug_roi=request.debug,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"CV pipeline error: {exc}")

    if not palm_features.hand_detected:
        return ScanResponse(
            hand_detected=False,
            aura_score=0,
            life=LineFeature(score=0.0, label="not detected"),
            head=LineFeature(score=0.0, label="not detected"),
            heart=LineFeature(score=0.0, label="not detected"),
            title="Hand Not Detected",
            reading="Please hold your palm flat and open toward the camera, fingers slightly spread.",
            career_insight="",
            energy_insight="",
            lucky_element="",
            cta_teaser="",
            aura_color="#7b2fff",
            archetype_name="",
            aura_hex_name="",
        )

    # --- Step 2: LLM Reading ---
    try:
        reading = generate_reading(
            life_label=palm_features.line_labels["life"],
            head_label=palm_features.line_labels["head"],
            heart_label=palm_features.line_labels["heart"],
            life_score=palm_features.life_prominence,
            head_score=palm_features.head_prominence,
            heart_score=palm_features.heart_prominence,
            aura_score=palm_features.aura_score,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"LLM service error: {exc}")

    return ScanResponse(
        hand_detected=True,
        aura_score=palm_features.aura_score,
        life=LineFeature(score=palm_features.life_prominence,  label=palm_features.line_labels["life"]),
        head=LineFeature(score=palm_features.head_prominence,  label=palm_features.line_labels["head"]),
        heart=LineFeature(score=palm_features.heart_prominence, label=palm_features.line_labels["heart"]),
        title=reading.get("title", "Your Palm Reading"),
        reading=reading.get("reading", ""),
        career_insight=reading.get("career_insight", ""),
        energy_insight=reading.get("energy_insight", ""),
        lucky_element=reading.get("lucky_element", ""),
        cta_teaser=reading.get("cta_teaser", ""),
        aura_color=reading.get("aura_color", "#7b2fff"),
        archetype_name=reading.get("archetype_name", ""),
        aura_hex_name=reading.get("aura_hex_name", ""),
        roi_debug_b64=palm_features.roi_debug_b64,
    )


# ---------------------------------------------------------------------------
# GET /api/demo — pre-baked result (no webcam required)
# ---------------------------------------------------------------------------
_DEMO_RESPONSES = [
    {
        "aura_score": 78,
        "life": {"score": 0.82, "label": "deeply etched and dominant"},
        "head": {"score": 0.71, "label": "clearly pronounced"},
        "heart": {"score": 0.65, "label": "clearly pronounced"},
        "title": "The Constellation of the Bold",
        "reading": "Your Life line carves through your palm like a river refusing to be dammed — raw, unstoppable vitality that fuels every ambition you dare to chase. The Head line's unwavering clarity reveals a strategist who sees three moves ahead while the world is still reading the board. Your Heart line pulses with the quiet confidence of someone who has learned to love without losing themselves.",
        "career_insight": "Leadership is not your destination — it is simply where you naturally arrive.",
        "energy_insight": "Your energy peaks under pressure; seek challenges that match your fire.",
        "lucky_element": "Fire",
        "cta_teaser": "Your chart holds a rare planetary alignment this quarter — a live astrologer can reveal your exact timing window.",
        "aura_color": "#e63946",
        "archetype_name": "Crimson Trailblazer",
        "aura_hex_name": "Crimson",
    },
    {
        "aura_score": 65,
        "life": {"score": 0.55, "label": "moderately defined"},
        "head": {"score": 0.74, "label": "clearly pronounced"},
        "heart": {"score": 0.48, "label": "moderately defined"},
        "title": "The Quiet Mind That Moves Mountains",
        "reading": "The Head line on your palm tells the story of a philosopher disguised as an ordinary person — your thoughts travel further than most people's lifetimes. A moderately traced Life line speaks of someone who burns selectively, choosing depth over breadth in every endeavour. The universe has woven patience into your blueprint, and patience, history proves, is the rarest superpower.",
        "career_insight": "Research, strategy, and innovation are the arenas where your genius quietly dominates.",
        "energy_insight": "Solitude recharges you — guard your quiet hours like sacred temples.",
        "lucky_element": "Air",
        "cta_teaser": "There's a hidden creative breakthrough window in your transit chart — discover it with a live astrologer.",
        "aura_color": "#6610f2",
        "archetype_name": "Indigo Visionary",
        "aura_hex_name": "Indigo",
    },
]


@router.get("/demo", response_model=ScanResponse)
async def demo_reading():
    """
    Return a pre-baked reading without requiring a webcam image.
    Useful for judges reviewing the prototype, mobile devices, or demo videos.
    """
    demo = random.choice(_DEMO_RESPONSES)
    return ScanResponse(
        hand_detected=True,
        **demo,
        roi_debug_b64=None,
    )
