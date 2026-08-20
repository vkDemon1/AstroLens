# AstroLens 🔭✨
### AI-Powered Palmistry Scanner & Longitudinal Cosmic Universe
*AstroHack 2026 Submission*

AstroLens combines real-time computer vision (**MediaPipe + OpenCV**) with generative AI (**Google Gemini**) to scan palm topology, map biometric line prominence, and generate personalized astrological readings, daily cosmic retention loops, relationship compatibility invite funnels, deep 12-section blueprints, an evolving longitudinal timeline, and a live product impact dashboard.

---

## 🚀 Live Demo & Shortcuts

| URL Parameter | Experience |
|---|---|
| *(Standard)* | Full web app with live webcam palm scanning |
| `?demo=true` | Pre-baked palm scan result (skips camera for quick judging) |
| `?compare=ENCODED` | Recipient experience for viral compatibility invites |
| `?dashboard=true` | Internal Growth & Product Impact Analytics Control Center |

---

## ✨ Product Highlights & Features

### 1. ✋ Real-Time CV Palm Scanner & Biometric Analysis
- **21-Landmark Hand Tracking**: Uses MediaPipe Hands to locate wrist, MCP, and knuckle landmarks in real-time.
- **Palm ROI Extraction**: Geometric affine normalization to a standardized $256 \times 256$ region of interest.
- **Computer Vision Pipeline**: Adaptive histogram equalization, Gaussian blur, and Canny edge contour detection.
- **Line Prominence Scoring**: Evaluates Life Line (vitality), Head Line (focus), and Heart Line (emotion) row-band prominence.
- **Aura Score & Archetype**: Dynamically computes Aura Score ($0\text{--}100$) and assigns celestial archetypes (*Crimson Trailblazer, Indigo Visionary, Gold Luminary*, etc.).

### 2. 🔮 AI-Powered Readings & Shareable Aura Cards
- **Gemini AI Structured Reading**: Contextual generative astrology reading rooted in calculated palm line metrics.
- **ResultCard**: Prominence bars, dynamic aura ring, career & energy insights, and lucky elements.
- **ShareCard & Web Share API**: High-resolution downloadable PNG cards via `html2canvas` for Instagram and WhatsApp.

### 3. 🌌 My Universe & Celestial Sanctuary
- **Cosmic Identity**: Custom astral name and biometric coordinates.
- **Harmonic Alignment Meters**: Live tracking of energetic, mental, and emotional resonance.

### 4. ⚡ Daily Cosmic Pulse (Retention Engine)
- **Morning Habit Loop**: Daily theme, personalized energy signals, mood resonance, and focus alignment.
- **Streak Milestones**: 4-tier milestone progression (**3-Day Cosmic Explorer**, **7-Day Pattern Seeker**, **14-Day Deep Observer**, **30-Day Cosmic Insider**).
- **Tomorrow Preview Teaser**: Unlocks advance celestial hints upon daily check-in completion.

### 5. 💫 Cosmic Compatibility & Viral Invite Loop
- **Partner Sign Alignment**: Harmonic resonance scoring across energy, intellect, and emotional channels.
- **Viral Invite Generator**: Encodes non-sensitive profile info into URL-safe base64 `?compare=` links.
- **Recipient Experience**: Customized landing page inviting friends/partners to scan their palm and reveal connection scores.

### 6. 📜 Premium Cosmic Blueprint & AstroLive Funnel
- **12-Section Deep Blueprint Dossier**: Multi-category breakdown (Core Energetics, Palm Line Topology, Planetary Alignments, Karmic Trajectories).
- **Key Pattern Identification**: Surfaces unresolved energetic polarities directly from palm scores.
- **Gemini AI Integration**: Deterministic fallback engine with Gemini AI deep synthesis.
- **AstroLive Monetization Funnel**: Contextual escalation into live human astrologer consultations (₹2,999 – ₹9,999).

### 7. ⏳ Cosmic Timeline (Longitudinal Journey — Phase 6A)
- **Reverse-Chronological Spine**: Visualizes the user's ongoing cosmic evolution (newest reading at the top).
- **Aura Evolution**: Chronological trajectory flow (`69 → 72 → 78`), current aura, total delta, and trend badge.
- **Palm Line Trajectory**: Interpretation trends for Life, Head, and Heart vectors over time.
- **Cosmic Shift (Before / Now)**: Side-by-side earliest vs. latest reading comparison with deterministic astral synthesis.
- **Interactive Inspection**: Detailed expandable reading cards with instant navigation to full readings.

### 8. 📊 Growth + Product Impact Dashboard (Phase 6B)
- **Internal Control Center**: Accessible via `?dashboard=true` or My Universe.
- **Proposed North Star Metric**: **Cosmically Active Users (CAU)** — measures recurring habit formation.
- **8-Stage Lifecycle Funnel**: Visual progression from initial scan through daily pulse, compatibility, blueprint, and AstroLive.
- **5 Core Metric Pillars**: Acquisition, Activation, Retention, Virality, and Monetization.
- **Viral Loop Visualization**: 6-step K-Factor invitation flow diagram.
- **Live Local vs. Demo Benchmark Toggle**: Toggle between live browser telemetry and cohort benchmark baselines.

---

## 🏗️ Architecture

```
AstroLens/
├── backend/                  FastAPI + Python CV Pipeline
│   ├── app.py                Entry point, CORS & routing
│   ├── cv_pipeline.py        MediaPipe → ROI → Canny → edge scoring
│   ├── llm_service.py        Google Gemini API structured reading generation
│   ├── routers/
│   │   ├── scan.py           POST /api/scan  |  GET /api/demo
│   │   └── blueprint.py      POST /api/blueprint (Gemini Deep Dossier)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── railway.toml
└── frontend/                 React 19 + Vite
    ├── src/
    │   ├── App.jsx           Root routing & navigation controller
    │   ├── index.css         Global design system & cosmic tokens
    │   ├── components/
    │   │   ├── CosmosCanvas.jsx      Interactive celestial background canvas
    │   │   ├── StarField.jsx         Constellation particle layer
    │   │   ├── LandingPage.jsx       Hero presentation & Card 01 Aurora system
    │   │   ├── Scanner.jsx           Webcam capture & palm landmark overlay
    │   │   ├── ResultCard.jsx        Reading presentation & aura ring
    │   │   ├── ShareCard.jsx         High-res shareable image generator
    │   │   ├── History.jsx           Local reading history chronicle
    │   │   ├── Universe.jsx          My Universe & Cosmic Timeline
    │   │   ├── Compatibility.jsx     Cosmic compatibility & viral invite creator
    │   │   ├── InviteLanding.jsx     Viral recipient compare landing page
    │   │   ├── PremiumBlueprint.jsx  12-section dossier & AstroLive funnel
    │   │   └── GrowthDashboard.jsx   Product impact & growth control center
    │   ├── utils/
    │   │   ├── profileStorage.js     Local cosmic identity persistence
    │   │   ├── pulseStorage.js       Daily palm pulse retention engine
    │   │   ├── compatibilityEngine.js Astrological resonance calculation
    │   │   ├── compatibilityInvite.js URL-safe base64 invite encode/decode
    │   │   ├── blueprintEngine.js    12-section deterministic dossier builder
    │   │   ├── timelineEngine.js     Cosmic timeline & evolution calculations
    │   │   └── growthMetrics.js      Local telemetry & product metrics aggregator
    │   └── services/api.js           Backend API client with fallback handling
    └── vite.config.js
```

---

## ⚡ Quickstart

### 1. Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# Run FastAPI dev server
python app.py
# → http://localhost:8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
# → http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable | Description | Default | Required |
|---|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key | — | Yes (for live AI generation) |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.0-flash` | No |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowed origins | `*` | No |
| `VITE_API_URL` | Backend endpoint for frontend | `http://localhost:8000` | No |

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

---

## 🧠 Computer Vision & AI Pipeline

```
Webcam Frame (JPEG base64)
       ↓
MediaPipe Hands (21 3D Landmarks)
       ↓
Palm ROI Triangle: Wrist(0) + Index MCP(5) + Pinky MCP(17)
       ↓
Affine Transformation → 256×256 Normalized Crop
       ↓
CLAHE Equalization → Gaussian Blur → Adaptive Threshold → Canny Edges
       ↓
Horizontal Band Scanning (Heart / Head / Life Line Prominence)
       ↓
Contour Arc Scoring → Weighted Prominence Calculation
       ↓
Aura Score (0–100) + Dominant Archetype Determination
       ↓
Google Gemini Generative AI (Structured JSON Astrology Dossier)
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Vanilla CSS (Design Tokens, Glassmorphism, CSS Gradients) |
| **Backend** | FastAPI, Python 3.11+, Uvicorn |
| **Computer Vision** | MediaPipe (`mp.solutions.hands`), OpenCV (`cv2`), NumPy |
| **AI / LLM** | Google Gemini API (`gemini-2.0-flash`) |
| **Sharing & Canvas** | html2canvas, Web Share API, HTML5 Canvas 2D |
| **Storage & Privacy** | Local-First (`localStorage`), Zero Tracking Cookies, Zero Remote Telemetry |
| **Quality & Linter** | Oxlint, Vite Production Bundler |

---

## 🏆 AstroHack Judging Matrix

| Pillar | How AstroLens Addresses It |
|---|---|
| **Novelty & USP** | Real-time CV palm analysis using MediaPipe + OpenCV edge extraction — translates physical palm line geometry into generative AI astrology. |
| **Virality** | Dual-share loop: downloadable Aura image cards + base64 encoded `?compare=` viral compatibility links with custom recipient onboarding. |
| **Retention** | Daily Palm Pulse morning check-in ritual with 4-tier streak milestones and Longitudinal Cosmic Timeline evolution tracking. |
| **Monetization** | Two-tier revenue model: ₹399 digital Cosmic Blueprint unlock + ₹2,999–₹9,999 contextual AstroLive astrologer consultation escalation. |
| **Product Impact** | Built-in Growth Dashboard (`?dashboard=true`) demonstrating North Star metric (Cosmically Active Users), 8-stage funnel, and validation targets. |
| **Demo Friendliness** | Instant `?demo=true` mode for camera-less testing + `?dashboard=true` for analytics inspection. |

---

*Built for AstroHack 2026 · Powered by MediaPipe, OpenCV & Google Gemini AI*
