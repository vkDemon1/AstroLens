"""
AstroLens — Cosmic Oracle Router
==================================
POST /api/oracle
Takes a category + the user's real palm scores and returns a short,
LIVE Gemini-generated oracle reading.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from llm_service import generate_oracle_reading

router = APIRouter()

VALID_CATEGORIES = {"love", "career", "money", "direction", "week"}


class OracleRequest(BaseModel):
    category: str = Field(..., description="one of: love, career, money, direction, week")
    life_score: float = Field(..., ge=0, le=1)
    head_score: float = Field(..., ge=0, le=1)
    heart_score: float = Field(..., ge=0, le=1)
    archetype_name: Optional[str] = Field(default=None)


class OracleResponse(BaseModel):
    category: str
    reading: str
    source: str  # "gemini" | "fallback"


@router.post("/oracle", response_model=OracleResponse)
async def get_oracle_reading(payload: OracleRequest):
    if payload.category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"category must be one of {sorted(VALID_CATEGORIES)}",
        )

    reading, source = generate_oracle_reading(
        category=payload.category,
        life_score=payload.life_score,
        head_score=payload.head_score,
        heart_score=payload.heart_score,
        archetype_name=payload.archetype_name,
    )
    return OracleResponse(category=payload.category, reading=reading, source=source)
