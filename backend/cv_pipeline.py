"""
AstroLens — Computer Vision Pipeline
======================================
Responsibilities:
  1. Decode an incoming base64/JPEG image frame.
  2. Run MediaPipe Hands to extract 21 3D hand landmarks.
  3. Isolate the palm Region of Interest (ROI) via triangle interpolation
     using Landmark 0 (Wrist), 5 (Index MCP), and 17 (Pinky MCP).
  4. Apply adaptive thresholding + Canny edge detection inside the ROI.
  5. Compute per-line prominence scores (Life, Head, Heart) and an overall
     Aura Score for downstream LLM prompting.

All functions are stateless and pure so they can be tested independently.
"""

import base64
import math
from dataclasses import dataclass
from typing import Optional, Tuple

import cv2
import mediapipe as mp
import numpy as np

# ---------------------------------------------------------------------------
# MediaPipe setup — loaded once at module import time
# ---------------------------------------------------------------------------
_mp_hands = mp.solutions.hands
_HANDS = _mp_hands.Hands(
    static_image_mode=True,       # single-frame mode (no tracking state)
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)

# ---------------------------------------------------------------------------
# Palmistry landmark indices (MediaPipe 21-point hand topology)
# ---------------------------------------------------------------------------
WRIST         = 0   # Base of palm
INDEX_MCP     = 5   # Index finger metacarpophalangeal joint
PINKY_MCP     = 17  # Pinky MCP — defines the palm triangle
MIDDLE_MCP    = 9   # Used to determine palm width midpoint
RING_MCP      = 13

# Palm line ROI horizontal scan rows (as fraction of ROI height)
# These approximate where Heart / Head / Life lines cross the palm.
HEART_LINE_ROW  = 0.28   # Upper palm crease
HEAD_LINE_ROW   = 0.48   # Mid-palm crease
LIFE_LINE_ROW   = 0.68   # Lower palm / thumb side crease


# ---------------------------------------------------------------------------
# Data container
# ---------------------------------------------------------------------------
@dataclass
class PalmFeatures:
    """Holds all extracted features for a single scan."""
    hand_detected: bool
    life_prominence: float       # 0.0 – 1.0
    head_prominence: float
    heart_prominence: float
    aura_score: int              # 0 – 100
    line_labels: dict            # human-readable labels for the LLM prompt
    roi_debug_b64: Optional[str] = None  # base64 PNG of the processed ROI


# ---------------------------------------------------------------------------
# Step 1 — Frame decoding
# ---------------------------------------------------------------------------
def decode_frame(b64_string: str) -> np.ndarray:
    """
    Convert a base64-encoded JPEG/PNG string (from the browser) into a
    BGR NumPy array that OpenCV can process.

    Args:
        b64_string: Raw base64 string (with or without the data-URL prefix).

    Returns:
        BGR image as a uint8 NumPy array.
    """
    # Strip data-URL prefix if present: "data:image/jpeg;base64,..."
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]

    image_bytes = base64.b64decode(b64_string)
    np_array = np.frombuffer(image_bytes, dtype=np.uint8)
    bgr_frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if bgr_frame is None:
        raise ValueError("Failed to decode image — ensure the payload is a valid JPEG/PNG base64 string.")

    return bgr_frame


# ---------------------------------------------------------------------------
# Step 2 — Hand landmark extraction via MediaPipe
# ---------------------------------------------------------------------------
def extract_hand_landmarks(bgr_frame: np.ndarray) -> Optional[list]:
    """
    Run MediaPipe Hands on a single BGR frame.

    Args:
        bgr_frame: OpenCV BGR image.

    Returns:
        List of 21 NormalizedLandmark objects, or None if no hand is found.
    """
    # MediaPipe expects RGB
    rgb_frame = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)

    # Apply mild Gaussian blur to reduce sensor noise before detection
    rgb_frame = cv2.GaussianBlur(rgb_frame, (5, 5), 0)

    results = _HANDS.process(rgb_frame)

    if not results.multi_hand_landmarks:
        return None

    # Return the landmark list for the first (and only) detected hand
    return results.multi_hand_landmarks[0].landmark


# ---------------------------------------------------------------------------
# Step 3 — Palm ROI extraction with coordinate normalization
# ---------------------------------------------------------------------------
def extract_palm_roi(
    landmarks: list,
    frame_shape: Tuple[int, int],
) -> Tuple[np.ndarray, dict]:
    """
    Isolate the palm using a bounding box derived from the triangle formed by:
      • Landmark  0 — Wrist (base of palm)
      • Landmark  5 — Index MCP (top-left of palm)
      • Landmark 17 — Pinky MCP (top-right of palm)

    The ROI is expanded by a margin factor so we capture the full crease area.

    Normalization strategy:
      Raw landmark coordinates are given as fractions of frame width/height.
      We convert them to pixel coordinates, build a bounding rectangle around
      the triangle, and return a FIXED-SIZE crop (256 × 256) so downstream
      processing is resolution-agnostic.

    Args:
        landmarks : 21-element list of NormalizedLandmark objects.
        frame_shape: (height, width) of the source frame.

    Returns:
        roi_image : 256×256 BGR crop of the palm.
        anchor_pts: dict of pixel coords for the three anchor landmarks,
                    useful for debugging overlays.
    """
    h, w = frame_shape[:2]

    def to_px(lm):
        """Convert a NormalizedLandmark to (x, y) pixel coords."""
        return int(lm.x * w), int(lm.y * h)

    wrist_pt   = to_px(landmarks[WRIST])
    index_pt   = to_px(landmarks[INDEX_MCP])
    pinky_pt   = to_px(landmarks[PINKY_MCP])
    middle_pt  = to_px(landmarks[MIDDLE_MCP])

    # ------------------------------------------------------------------
    # Build a bounding box around the palm triangle with a 20% margin.
    # We add extra top padding so the heart line (upper palm) is captured.
    # ------------------------------------------------------------------
    all_pts = np.array([wrist_pt, index_pt, pinky_pt, middle_pt])
    x_min, y_min = all_pts.min(axis=0)
    x_max, y_max = all_pts.max(axis=0)

    palm_width  = x_max - x_min
    palm_height = y_max - y_min

    margin_x = int(palm_width  * 0.18)
    margin_y = int(palm_height * 0.18)

    # Clamp to frame boundaries
    roi_x1 = max(0, x_min - margin_x)
    roi_y1 = max(0, y_min - margin_y)
    roi_x2 = min(w, x_max + margin_x)
    roi_y2 = min(h, y_max + margin_y)

    anchor_pts = {
        "wrist" : wrist_pt,
        "index" : index_pt,
        "pinky" : pinky_pt,
        "bounds": (roi_x1, roi_y1, roi_x2, roi_y2),
    }

    return (roi_x1, roi_y1, roi_x2, roi_y2), anchor_pts


def crop_roi(bgr_frame: np.ndarray, bounds: tuple, output_size: int = 256) -> np.ndarray:
    """
    Crop the palm ROI from the frame and resize to a fixed square.
    Using a fixed output_size ensures all downstream analysis is scale-invariant.
    """
    x1, y1, x2, y2 = bounds
    cropped = bgr_frame[y1:y2, x1:x2]

    if cropped.size == 0:
        return np.zeros((output_size, output_size, 3), dtype=np.uint8)

    resized = cv2.resize(cropped, (output_size, output_size), interpolation=cv2.INTER_AREA)
    return resized


# ---------------------------------------------------------------------------
# Step 4 — Palm line detection via edge analysis
# ---------------------------------------------------------------------------
def detect_palm_lines(roi_image: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Detect dominant palm creases within the ROI using a pipeline of:
      1. Convert to grayscale
      2. Histogram equalisation (improves crease contrast regardless of skin tone)
      3. Gaussian blur (removes high-freq texture noise)
      4. Adaptive thresholding (handles uneven lighting across the palm)
      5. Canny edge detection

    Args:
        roi_image: 256×256 BGR crop of the palm.

    Returns:
        edges      : Binary edge map (same size as roi_image).
        gray_eq    : Equalised grayscale image (useful for visualisation).
    """
    # --- Grayscale conversion ---
    gray = cv2.cvtColor(roi_image, cv2.COLOR_BGR2GRAY)

    # --- Histogram equalisation — makes the pipeline skin-tone agnostic ---
    gray_eq = cv2.equalizeHist(gray)

    # --- Gaussian blur — kernel size tuned for palm crease scale at 256px ---
    blurred = cv2.GaussianBlur(gray_eq, (7, 7), 1.5)

    # --- Adaptive threshold — handles shadows and uneven palm lighting ---
    thresh = cv2.adaptiveThreshold(
        blurred,
        maxValue=255,
        adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        thresholdType=cv2.THRESH_BINARY_INV,
        blockSize=15,    # neighbourhood size (must be odd)
        C=4,             # constant subtracted from mean
    )

    # --- Morphological closing to connect broken crease segments ---
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    thresh_closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)

    # --- Canny edge detection ---
    # Lower threshold set conservatively so shallow lines are preserved.
    edges = cv2.Canny(thresh_closed, threshold1=30, threshold2=90)

    return edges, gray_eq


# ---------------------------------------------------------------------------
# Step 5 — Feature extraction & Aura Score computation
# ---------------------------------------------------------------------------
def _scan_horizontal_band(edge_map: np.ndarray, row_fraction: float, band_thickness: float = 0.06) -> float:
    """
    Measure edge density in a horizontal band of the edge map.
    Each palm line (Heart, Head, Life) runs roughly horizontally, so we
    scan a thin horizontal strip at the known row fraction.

    Args:
        edge_map      : Binary edge map (256×256).
        row_fraction  : Vertical position of the line (0 = top, 1 = bottom).
        band_thickness: Height of the scan band as a fraction of ROI height.

    Returns:
        Density ratio: edge pixels / total pixels in the band (0.0 – 1.0).
    """
    h, w = edge_map.shape
    y_center = int(row_fraction * h)
    half_band = max(1, int(band_thickness * h // 2))

    y_start = max(0, y_center - half_band)
    y_end   = min(h, y_center + half_band)

    band = edge_map[y_start:y_end, :]
    total_pixels = band.size
    if total_pixels == 0:
        return 0.0

    edge_pixels = np.count_nonzero(band)
    return edge_pixels / total_pixels


def _contour_score(edge_map: np.ndarray) -> float:
    """
    Find all contours and compute a normalised total length score.
    Longer, more connected contours indicate prominent, deep palm lines.

    Returns a score in [0.0, 1.0].
    """
    contours, _ = cv2.findContours(edge_map, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return 0.0

    total_arc = sum(cv2.arcLength(c, closed=False) for c in contours)

    # Normalise against the maximum plausible arc length for a 256×256 image
    max_arc = 256 * 4.0   # perimeter of the full image
    return min(total_arc / max_arc, 1.0)


def _prominence_label(score: float) -> str:
    """Map a 0–1 score to a human-readable palmistry descriptor."""
    if score < 0.15:
        return "faint and broken"
    elif score < 0.30:
        return "lightly traced"
    elif score < 0.50:
        return "moderately defined"
    elif score < 0.70:
        return "clearly pronounced"
    else:
        return "deeply etched and dominant"


def compute_line_features(edges: np.ndarray) -> dict:
    """
    Calculate prominence scores for the three primary palmistry lines.

    Palmistry convention (for a right hand, palm facing up):
      • Heart Line — highest horizontal crease (~top 30% of palm)
      • Head  Line — middle crease (~mid-palm)
      • Life  Line — curved crease near the thumb base (~lower palm)

    Each score is a blend of:
      - Horizontal band edge density (how many edge pixels cross that row)
      - Global contour arc score (overall crease connectivity)

    Returns:
        dict with keys: life, head, heart (float 0–1), plus labels.
    """
    # --- Per-line band density ---
    heart_density = _scan_horizontal_band(edges, HEART_LINE_ROW)
    head_density  = _scan_horizontal_band(edges, HEAD_LINE_ROW)
    life_density  = _scan_horizontal_band(edges, LIFE_LINE_ROW)

    # --- Global contour score (shared structural quality) ---
    global_arc = _contour_score(edges)

    # --- Weighted blend: 70% band-specific, 30% global arc ---
    heart_score = 0.70 * float(np.clip(heart_density / 0.25, 0, 1)) + 0.30 * global_arc
    head_score  = 0.70 * float(np.clip(head_density  / 0.25, 0, 1)) + 0.30 * global_arc
    life_score  = 0.70 * float(np.clip(life_density  / 0.25, 0, 1)) + 0.30 * global_arc

    # Clip final values to [0, 1]
    heart_score = float(np.clip(heart_score, 0.0, 1.0))
    head_score  = float(np.clip(head_score,  0.0, 1.0))
    life_score  = float(np.clip(life_score,  0.0, 1.0))

    return {
        "heart": heart_score,
        "head" : head_score,
        "life" : life_score,
        "heart_label": _prominence_label(heart_score),
        "head_label" : _prominence_label(head_score),
        "life_label" : _prominence_label(life_score),
        "global_arc" : global_arc,
    }


def compute_aura_score(features: dict) -> int:
    """
    Compute a composite Aura Score (0–100) from palm line features.

    Formula (weighted):
      • Life Line  × 0.40  — vitality and life energy
      • Head Line  × 0.35  — mental clarity and purpose
      • Heart Line × 0.25  — emotional depth
    """
    raw = (
        features["life"]  * 0.40 +
        features["head"]  * 0.35 +
        features["heart"] * 0.25
    )
    # Scale to 0–100, with a minimum of 10 so even faint hands get a score
    score = int(np.clip(raw * 100, 10, 100))
    return score


# ---------------------------------------------------------------------------
# Master pipeline function — called by the API router
# ---------------------------------------------------------------------------
def run_pipeline(b64_image: str, include_debug_roi: bool = False) -> PalmFeatures:
    """
    Full CV pipeline: decode → detect landmarks → extract ROI → detect lines → score.

    Args:
        b64_image        : Base64-encoded JPEG/PNG from the browser.
        include_debug_roi: If True, attach a base64 PNG of the processed ROI
                          (useful for the frontend debug overlay).

    Returns:
        PalmFeatures dataclass with all computed values.
    """
    # --- Decode ---
    bgr_frame = decode_frame(b64_image)

    # --- Landmark detection ---
    landmarks = extract_hand_landmarks(bgr_frame)
    if landmarks is None:
        return PalmFeatures(
            hand_detected=False,
            life_prominence=0.0,
            head_prominence=0.0,
            heart_prominence=0.0,
            aura_score=0,
            line_labels={},
        )

    # --- ROI extraction ---
    bounds, anchor_pts = extract_palm_roi(landmarks, bgr_frame.shape)
    roi_image = crop_roi(bgr_frame, bounds)

    # --- Line detection ---
    edges, gray_eq = detect_palm_lines(roi_image)

    # --- Feature extraction ---
    features = compute_line_features(edges)
    aura_score = compute_aura_score(features)

    # --- Optional debug ROI (base64 PNG of the Canny output) ---
    debug_b64 = None
    if include_debug_roi:
        edges_rgb = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
        _, buffer = cv2.imencode(".png", edges_rgb)
        debug_b64 = "data:image/png;base64," + base64.b64encode(buffer).decode("utf-8")

    return PalmFeatures(
        hand_detected=True,
        life_prominence=features["life"],
        head_prominence=features["head"],
        heart_prominence=features["heart"],
        aura_score=aura_score,
        line_labels={
            "life" : features["life_label"],
            "head" : features["head_label"],
            "heart": features["heart_label"],
        },
        roi_debug_b64=debug_b64,
    )
