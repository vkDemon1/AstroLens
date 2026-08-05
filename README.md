# AstroLens 🔭✨
### AI-Powered Palmistry Scanner — AstroHack 2026 Submission

AstroLens uses real-time computer vision (MediaPipe + OpenCV) and generative AI (Gemini) to scan your palm and deliver a personalised astrological reading — with a shareable Aura card.

---

## Demo

> Add `?demo=true` to any URL to get a pre-baked reading without a webcam.

---

## Architecture

```
AstroLens/
├── backend/          FastAPI + Python CV pipeline
│   ├── app.py          Entry point, CORS
│   ├── cv_pipeline.py  MediaPipe → ROI → Canny → features
│   ├── llm_service.py  Gemini API reading generation
│   ├── routers/
│   │   └── scan.py     POST /api/scan  |  GET /api/demo
│   ├── requirements.txt
│   ├── Dockerfile
│   └── railway.toml
└── frontend/         React + Vite
    ├── src/
    │   ├── App.jsx
    │   ├── index.css   Design system (dark cosmic theme)
    │   ├── components/
    │   │   ├── StarField.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── Scanner.jsx
    │   │   ├── ResultCard.jsx
    │   │   ├── ShareCard.jsx
    │   │   └── History.jsx
    │   └── services/api.js
    └── vite.config.js  (proxy /api → localhost:8000)
```

---

## Quickstart

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run
python app.py
# → http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Your Google AI Studio API key | required |
| `GEMINI_MODEL`   | Gemini model to use | `gemini-2.0-flash` |
| `ALLOWED_ORIGINS`| Comma-separated production origins | — |

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

---

## Deployment

### Backend → Railway

1. Connect your GitHub repo to Railway
2. Set root directory to `backend/`
3. Add `GEMINI_API_KEY` in Railway environment variables
4. Deploy — Railway uses the included `Dockerfile`

### Frontend → GitHub Pages

```bash
cd frontend
npm run build
# Push dist/ to gh-pages branch or use GitHub Actions
```

Set `VITE_API_URL` in your GitHub Pages environment to point to your Railway backend URL.

---

## CV Pipeline

```
Webcam frame (JPEG base64)
       ↓
MediaPipe Hands — 21 3D landmarks
       ↓
Palm ROI extraction — Triangle: Wrist(0) + Index MCP(5) + Pinky MCP(17)
       ↓
256×256 normalized crop
       ↓
Histogram equalisation → Gaussian blur → Adaptive threshold → Canny edges
       ↓
Horizontal band scanning (Heart/Head/Life row fractions)
+ Contour arc scoring
       ↓
Weighted prominence scores → Aura Score (0–100)
       ↓
Gemini API — structured JSON reading
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Vanilla CSS |
| Backend | FastAPI (Python 3.11+) |
| CV Engine | MediaPipe `mp.solutions.hands` + OpenCV |
| LLM | Google Gemini API |
| Sharing | html2canvas, Web Share API |
| Storage | localStorage |
| Deployment | Railway (backend) + GitHub Pages (frontend) |

---

## Judging Notes

- **Virality**: Shareable Aura card (PNG download + WhatsApp/Instagram share)
- **USP**: Real-time CV palm analysis — no other mainstream astrology app does this
- **Revenue**: "Book a Live Astrologer" CTA with AstroLive integration
- **Retention**: Reading history saved in localStorage; every result is unique
- **Demo mode**: `?demo=true` URL works without a webcam for easy judging

---

*Built for AstroHack 2026 · Powered by MediaPipe, OpenCV & Gemini AI*
