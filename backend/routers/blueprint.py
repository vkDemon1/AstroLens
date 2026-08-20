"""
AstroLens — Cosmic Blueprint Router
====================================
POST /api/blueprint
Takes the user's validated biometric palm reading and returns a rich,
personalized Gemini-generated 12-section Cosmic Blueprint with Key Pattern
and contextual AstroLive recommendation.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from llm_service import generate_blueprint_reading

router = APIRouter()


class BlueprintRequest(BaseModel):
    name: Optional[str] = Field(default="Seeker")
    archetype: Optional[str] = Field(default="Gold Luminary")
    aura_score: Optional[int] = Field(default=78)
    aura_color: Optional[str] = Field(default="#FDE68A")
    lucky_element: Optional[str] = Field(default="Fire")
    life_score: float = Field(default=0.8, ge=0, le=1)
    head_score: float = Field(default=0.72, ge=0, le=1)
    heart_score: float = Field(default=0.68, ge=0, le=1)
    reading: Optional[str] = Field(default="")
    career_insight: Optional[str] = Field(default="")
    energy_insight: Optional[str] = Field(default="")


class BlueprintResponse(BaseModel):
    source: str  # "gemini" | "fallback"
    sections: Optional[List[Dict[str, Any]]] = None
    keyPattern: Optional[Dict[str, Any]] = None
    astroliveReason: Optional[str] = None
    astrologerSpecialty: Optional[str] = None


@router.post("/blueprint", response_model=BlueprintResponse)
async def get_blueprint_reading(payload: BlueprintRequest):
    data, source = generate_blueprint_reading(payload.dict())
    if source == "gemini" and data:
        return BlueprintResponse(
            source="gemini",
            sections=data.get("sections"),
            keyPattern=data.get("keyPattern"),
            astroliveReason=data.get("astroliveReason"),
            astrologerSpecialty=data.get("astrologerSpecialty"),
        )

    # If Gemini unavailable or malformed, return source="fallback" allowing frontend single source of truth
    return BlueprintResponse(source="fallback")
