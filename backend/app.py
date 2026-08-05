"""
AstroLens — FastAPI Application Entry Point
============================================
Configures CORS, registers routers, and boots the Uvicorn server.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import scan

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AstroLens API",
    description="AI-powered palmistry scanner — CV pipeline + Gemini reading generation.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server (5173) and any GitHub Pages origin
# ---------------------------------------------------------------------------
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
extra_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

origins = [
    "http://localhost:5173",   # Vite dev
    "http://localhost:3000",   # CRA fallback
    "http://127.0.0.1:5173",
    *extra_origins,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(scan.router, prefix="/api")


# ---------------------------------------------------------------------------
# Health check — useful for Railway / Render uptime monitors
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok", "service": "AstroLens API"}


# ---------------------------------------------------------------------------
# Dev entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
