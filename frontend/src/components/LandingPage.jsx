import { useEffect, useRef, useState } from 'react';
import styles from './LandingPage.module.css';
import { getDemoReading } from '../services/api';

// Inline fallback — works with no backend running
const DEMO_FALLBACK = {
  hand_detected: true,
  aura_score: 78,
  aura_color: '#e63946',
  archetype_name: 'Crimson Trailblazer',
  aura_hex_name: 'Crimson',
  title: 'The Constellation of the Bold',
  reading: 'Your Life line carves through your palm like a river refusing to be dammed — raw, unstoppable vitality that fuels every ambition you dare to chase. The Head line\'s unwavering clarity reveals a strategist who sees three moves ahead while the world is still reading the board. Your Heart line pulses with the quiet confidence of someone who has learned to love without losing themselves.',
  career_insight: 'Leadership is not your destination — it is simply where you naturally arrive.',
  energy_insight: 'Your energy peaks under pressure; seek challenges that match your fire.',
  lucky_element: 'Fire',
  cta_teaser: 'Your chart holds a rare planetary alignment this quarter — a live astrologer can reveal your exact timing window.',
  life: { score: 0.82, label: 'deeply etched and dominant' },
  head: { score: 0.71, label: 'clearly pronounced' },
  heart: { score: 0.65, label: 'clearly pronounced' },
};

const FEATURES = [
  {
    id: 'palm',
    title: 'PALM LINE ANALYSIS',
    desc: 'AI maps your Life, Head & Heart lines in real time using MediaPipe computer vision.',
    icon: (
      <img src="/hand.png" alt="Palm Line Analysis" className={styles.handTileImg} />
    ),
  },

  {
    id: 'aura',
    title: 'AURA SCORE',
    desc: 'A composite cosmic score derived from line depth, continuity, and intersection density.',
    icon: (
      <img src="/GLOB.png" alt="Aura Score" className={styles.handTileImg} />
    ),
  },
  {
    id: 'gemini',
    title: 'GEMINI AI READING',
    desc: 'Your palm data feeds a Gemini-powered reading — personalised, mystical, and deeply accurate.',
    isHighlighted: true,
    icon: (
      <img src="/Gemini.png" alt="Gemini AI Reading" className={styles.handTileImg} />
    ),
  },
  {
    id: 'share',
    title: 'SHAREABLE CARD',
    desc: 'Download your Aura card as an image. One tap to share to Instagram, WhatsApp, or anywhere.',
    icon: (
      <img src="/Share.png" alt="Shareable Card" className={styles.handTileImg} />
    ),
  },
];

const TESTIMONIALS = [
  { name: 'Priya S.', quote: 'The reading was eerily accurate about my career transition. Shared it with 12 friends instantly!' },
  { name: 'Rohan M.', quote: 'I thought it was gimmicky but the Life line analysis blew my mind. Booked an astrologer right after.' },
  { name: 'Anya K.', quote: 'Best astrology app I\'ve ever used. The aura card looks gorgeous on Instagram.' },
];

/* ── Alchemical Alembic Process Diagram Components (Image 22 Style) ── */
function AlembicCardFrame() {
  return (
    <svg className={styles.alembicFrameSvg} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="alembicGoldGrad" x1="0" y1="0" x2="240" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* Outer Curved Glass Border */}
      <rect x="4" y="4" width="232" height="152" rx="14" fill="none" stroke="url(#alembicGoldGrad)" strokeWidth="1.8" />
      <rect x="8" y="8" width="224" height="144" rx="10" fill="none" stroke="#FDE68A" strokeWidth="0.6" opacity="0.4" />

      {/* Ornate Corner Sigils & Celestial Accents */}
      {/* Top-Left Sigil */}
      <circle cx="16" cy="16" r="3" fill="#FDE68A" />
      <path d="M 16 10 V 22 M 10 16 H 22" stroke="#FDE68A" strokeWidth="0.8" opacity="0.6" />

      {/* Bottom-Right Saturn Ring Sigil */}
      <circle cx="224" cy="144" r="4" stroke="#FDE68A" strokeWidth="1" fill="none" />
      <ellipse cx="224" cy="144" rx="7" ry="2" stroke="#FDE68A" strokeWidth="0.8" transform="rotate(-25 224 144)" />

      {/* Bottom-Left Crescent Moon */}
      <path d="M 18 140 A 5 5 0 1 0 22 147 A 4 4 0 1 1 18 140 Z" fill="#FDE68A" opacity="0.7" />
    </svg>
  );
}

/* Panel 1: Webcam / Iris Aperture Icon */
function AlembicIrisIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="21" cy="21" r="18" fill="rgba(15, 23, 42, 0.8)" stroke="#FDE68A" strokeWidth="1.8" />
      <circle cx="21" cy="21" r="12" stroke="#38BDF8" strokeWidth="1.2" />
      <circle cx="21" cy="21" r="6" fill="#FFF" />
      <path d="M 21 3 V 9 M 21 33 V 39 M 3 21 H 9 M 33 21 H 39" stroke="#FDE68A" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

/* Panel 2: MediaPipe Hand Topology Icon */
function AlembicTopologyIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="38" height="38" rx="8" fill="rgba(15, 23, 42, 0.8)" stroke="#FDE68A" strokeWidth="1.5" />
      {/* Skeleton / Landmark Mesh */}
      <g stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round">
        <line x1="21" y1="36" x2="16" y2="28" />
        <line x1="21" y1="36" x2="26" y2="28" />
        <line x1="16" y1="28" x2="11" y2="20" />
        <line x1="11" y1="20" x2="8" y2="14" />
        <line x1="16" y1="28" x2="15" y2="16" />
        <line x1="15" y1="16" x2="14" y2="8" />
        <line x1="21" y1="26" x2="21" y2="14" />
        <line x1="21" y1="14" x2="21" y2="6" />
        <line x1="26" y1="28" x2="27" y2="16" />
        <line x1="27" y1="16" x2="28" y2="8" />
        <line x1="26" y1="28" x2="32" y2="20" />
        <line x1="32" y1="20" x2="35" y2="12" />
      </g>
      {[
        { x: 21, y: 36 }, { x: 16, y: 28 }, { x: 26, y: 28 }, { x: 11, y: 20 }, { x: 8, y: 14 },
        { x: 15, y: 16 }, { x: 14, y: 8 }, { x: 21, y: 14 }, { x: 21, y: 6 }, { x: 27, y: 16 },
        { x: 28, y: 8 }, { x: 32, y: 20 }, { x: 35, y: 12 }
      ].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="1.5" fill="#FFF" />
      ))}
    </svg>
  );
}

/* Panel 3: ROI Extraction Grid Icon */
function AlembicRoiIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="38" height="38" rx="8" fill="rgba(15, 23, 42, 0.8)" stroke="#FDE68A" strokeWidth="1.5" />
      {/* Crop Handles */}
      <path d="M 10 16 V 10 H 16 M 26 10 H 32 V 16 M 32 26 V 32 H 26 M 16 32 H 10 V 26" stroke="#FDE68A" strokeWidth="2.2" strokeLinecap="round" />
      {/* Palm Triangle Grid */}
      <polygon points="21,12 13,28 29,28" fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="21" cy="12" r="2" fill="#FFF" />
      <circle cx="13" cy="28" r="2" fill="#FFF" />
      <circle cx="29" cy="28" r="2" fill="#FFF" />
    </svg>
  );
}

/* Panel 4: Canny Edge Plasma Hand Icon */
function AlembicCannyIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="38" height="38" rx="8" fill="rgba(15, 23, 42, 0.8)" stroke="#FDE68A" strokeWidth="1.5" />
      {/* Hand Contour */}
      <path d="M 14 36 C 10 28 8 20 10 12 C 12 10 14 12 16 16 C 16 9 18 6 20 6 C 22 6 24 9 24 15 C 24 8 26 5 28 5 C 30 5 32 8 32 15 C 32 10 34 8 36 9 C 38 10 36 16 34 24 C 31 32 26 36 14 36 Z" stroke="#FDE68A" strokeWidth="1" opacity="0.5" />
      {/* Plasma Crease Lines */}
      <path d="M 12 20 Q 20 24 30 20" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 4px #38BDF8)" />
      <path d="M 11 25 Q 20 25 28 30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M 18 14 Q 24 22 18 32" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 4px #FDE68A)" />
    </svg>
  );
}

/* Panel 5: Gemini AI Brain Nebula Icon */
function AlembicOracleIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="38" height="38" rx="8" fill="rgba(15, 23, 42, 0.8)" stroke="#FDE68A" strokeWidth="1.5" />
      {/* Brain-Shaped Nebula */}
      <path d="M 15 14 C 11 14 8 18 10 23 C 8 27 12 32 16 32 C 18 32 20 30 21 28 C 22 30 24 32 26 32 C 30 32 34 27 32 23 C 34 18 31 14 27 14 C 25 14 23 15 21 17 C 19 15 17 14 15 14 Z" stroke="#C084FC" strokeWidth="1.5" fill="rgba(192, 132, 252, 0.2)" />
      {/* Core AI Star Nodes */}
      <circle cx="16" cy="20" r="1.5" fill="#FFF" />
      <circle cx="26" cy="20" r="1.5" fill="#FFF" />
      <circle cx="21" cy="24" r="2" fill="#FDE68A" />
      <path d="M 16 20 L 21 24 L 26 20" stroke="#FDE68A" strokeWidth="1" />
    </svg>
  );
}
function StatPanelFrame() {
  return (
    <svg className={styles.panelFrameSvg} viewBox="0 0 300 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="platinumFiligreeGrad" x1="0" y1="0" x2="300" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E2E8F0" />
          <stop offset="60%" stopColor="#94A3B8" />
          <stop offset="85%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
        <linearGradient id="platinumGlowBorder" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Main Curved Concave Outer Platinum Frame */}
      <path
        d="M 18 8 Q 150 1 282 8 C 291 8 293 10 293 18 L 293 152 C 293 160 291 162 282 162 Q 150 169 18 162 C 9 162 7 160 7 152 L 7 18 C 7 10 9 8 18 8 Z"
        fill="none"
        stroke="url(#platinumFiligreeGrad)"
        strokeWidth="2.2"
      />
      {/* Inner Accent Glowing Border */}
      <path
        d="M 21 12 Q 150 6 279 12 C 286 12 288 14 288 21 L 288 149 C 288 156 286 158 279 158 Q 150 164 21 158 C 14 158 12 156 12 149 L 12 21 C 12 14 14 12 21 12 Z"
        fill="none"
        stroke="url(#platinumGlowBorder)"
        strokeWidth="0.9"
        opacity="0.85"
      />

      {/* Top-Left Filigree Scroll & Star Cluster */}
      <path d="M 8 24 C 8 14 14 8 24 8 M 12 18 C 16 12 22 14 18 20 C 15 24 22 26 26 20" stroke="url(#platinumFiligreeGrad)" strokeWidth="1.3" fill="none" />
      <circle cx="12" cy="18" r="1.5" fill="#FFF" />
      <circle cx="26" cy="20" r="1.2" fill="#E2E8F0" />

      {/* Top-Right Filigree Scroll & Star Cluster */}
      <path d="M 292 24 C 292 14 286 8 276 8 M 288 18 C 284 12 278 14 282 20 C 285 24 278 26 274 20" stroke="url(#platinumFiligreeGrad)" strokeWidth="1.3" fill="none" />
      <circle cx="288" cy="18" r="1.5" fill="#FFF" />
      <circle cx="274" cy="20" r="1.2" fill="#E2E8F0" />

      {/* Bottom-Left Filigree Scroll & Star Cluster */}
      <path d="M 8 146 C 8 156 14 162 24 162 M 12 152 C 16 158 22 156 18 150 C 15 146 22 144 26 150" stroke="url(#platinumFiligreeGrad)" strokeWidth="1.3" fill="none" />
      <circle cx="12" cy="152" r="1.5" fill="#FFF" />
      <circle cx="26" cy="150" r="1.2" fill="#E2E8F0" />

      {/* Bottom-Right Filigree Scroll & Star Cluster */}
      <path d="M 292 146 C 292 156 286 162 276 162 M 288 152 C 284 158 278 156 282 150 C 285 146 278 144 274 150" stroke="url(#platinumFiligreeGrad)" strokeWidth="1.3" fill="none" />
      <circle cx="288" cy="152" r="1.5" fill="#FFF" />
      <circle cx="274" cy="150" r="1.2" fill="#E2E8F0" />

      {/* Top Center Scroll Ornament */}
      <path d="M 135 4 Q 150 1 165 4 M 140 7 Q 150 3 160 7" stroke="url(#platinumFiligreeGrad)" strokeWidth="1.1" fill="none" />
      <circle cx="150" cy="3" r="1.5" fill="#FFF" />

      {/* Bottom Center Scroll Ornament */}
      <path d="M 135 166 Q 150 169 165 166 M 140 163 Q 150 167 160 163" stroke="url(#platinumFiligreeGrad)" strokeWidth="1.1" fill="none" />
      <circle cx="150" cy="167" r="1.5" fill="#FFF" />
    </svg>
  );
}

function HandConstellationBg() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="p1Nebula" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#818CF8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0F0C20" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="170" fill="url(#p1Nebula)" />

      {/* Silver Geometric Hand Structure & Landmark Mesh */}
      <g stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
        {/* Wrist Base */}
        <line x1="150" y1="148" x2="135" y2="128" />
        <line x1="150" y1="148" x2="165" y2="128" />

        {/* Thumb */}
        <line x1="135" y1="128" x2="118" y2="112" />
        <line x1="118" y1="112" x2="108" y2="96" />
        <line x1="108" y1="96" x2="102" y2="82" />

        {/* Index Finger */}
        <line x1="135" y1="128" x2="130" y2="92" />
        <line x1="130" y1="92" x2="128" y2="68" />
        <line x1="128" y1="68" x2="126" y2="44" />

        {/* Middle Finger */}
        <line x1="150" y1="122" x2="150" y2="86" />
        <line x1="150" y1="86" x2="150" y2="60" />
        <line x1="150" y1="60" x2="150" y2="34" />

        {/* Ring Finger */}
        <line x1="165" y1="128" x2="170" y2="92" />
        <line x1="170" y1="92" x2="172" y2="68" />
        <line x1="172" y1="68" x2="174" y2="44" />

        {/* Pinky Finger */}
        <line x1="165" y1="128" x2="186" y2="102" />
        <line x1="186" y1="102" x2="192" y2="84" />
        <line x1="192" y1="84" x2="198" y2="66" />

        {/* Palm Connections */}
        <line x1="135" y1="128" x2="165" y2="128" />
        <line x1="130" y1="92" x2="150" y2="86" />
        <line x1="150" y1="86" x2="170" y2="92" />
        <line x1="170" y1="92" x2="186" y2="102" />
        <line x1="118" y1="112" x2="130" y2="92" />
      </g>

      {/* 21 Bright Silver Star Landmark Points */}
      {[
        { x: 150, y: 148 }, { x: 135, y: 128 }, { x: 118, y: 112 }, { x: 108, y: 96 }, { x: 102, y: 82 },
        { x: 130, y: 92 }, { x: 128, y: 68 }, { x: 126, y: 44 }, { x: 150, y: 86 }, { x: 150, y: 60 },
        { x: 150, y: 34 }, { x: 170, y: 92 }, { x: 172, y: 68 }, { x: 174, y: 44 }, { x: 165, y: 128 },
        { x: 186, y: 102 }, { x: 192, y: 84 }, { x: 198, y: 66 }, { x: 150, y: 122 }, { x: 138, y: 106 }, { x: 162, y: 106 }
      ].map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r="3.4" fill="#FFFFFF" opacity="1" />
          <circle cx={pt.x} cy={pt.y} r="6.5" fill="#E2E8F0" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

function PalmLinesSwirlBg() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="p2Nebula" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#C084FC" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0F0C20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldLineGrad" x1="0" y1="0" x2="300" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#D97706" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="300" height="170" fill="url(#p2Nebula)" />

      {/* Swirling Abstract Palm Crease Lines */}
      {/* Heart Line Curve */}
      <path d="M 25 48 Q 115 18 225 54 T 240 70" stroke="url(#goldLineGrad)" strokeWidth="2.5" fill="none" opacity="0.65" />
      <path d="M 35 53 Q 125 26 215 58 T 275 82" stroke="#FFE885" strokeWidth="1.2" fill="none" opacity="0.45" />

      {/* Head Line Curve */}
      <path d="M 18 88 Q 98 62 188 98 T 275 118" stroke="url(#goldLineGrad)" strokeWidth="2.8" fill="none" opacity="0.8" />
      <path d="M 28 93 Q 108 70 178 103 T 265 123" stroke="#38BDF8" strokeWidth="1.4" fill="none" opacity="0.55" />

      {/* Life Line Arc */}
      <path d="M 68 28 Q 158 78 128 152" stroke="url(#goldLineGrad)" strokeWidth="2.4" fill="none" opacity="0.75" />
      <path d="M 78 33 Q 163 80 136 150" stroke="#F472B6" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* Accent Starlight Sparks */}
      <circle cx="128" cy="78" r="2.2" fill="#FFF" opacity="0.85" />
      <circle cx="188" cy="98" r="2.8" fill="#FDE68A" opacity="0.95" />
      <circle cx="108" cy="42" r="2" fill="#38BDF8" opacity="0.75" />
    </svg>
  );
}

function HourglassVortexBg() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="p3Nebula" cx="65%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0F0C20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hgGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      <rect width="300" height="170" fill="url(#p3Nebula)" />

      {/* Swirling Galaxy Clockwork Vortex (Right Side) */}
      <g opacity="0.55">
        <ellipse cx="215" cy="85" rx="72" ry="36" stroke="#FDE68A" strokeWidth="1.2" strokeDasharray="6 4" transform="rotate(-15 215 85)" />
        <ellipse cx="215" cy="85" rx="52" ry="25" stroke="#38BDF8" strokeWidth="1.4" transform="rotate(-15 215 85)" />
        <ellipse cx="215" cy="85" rx="32" ry="15" stroke="#818CF8" strokeWidth="1.6" transform="rotate(-15 215 85)" />
        <circle cx="215" cy="85" r="9" fill="#FDE68A" opacity="0.65" />
      </g>

      {/* Detailed Glass & Gold Hourglass Graphic (Left Side) */}
      <g transform="translate(55, 24)">
        {/* Top Rim */}
        <ellipse cx="40" cy="12" rx="26" ry="6" fill="url(#hgGold)" stroke="#FFE885" strokeWidth="1" />
        {/* Bottom Rim */}
        <ellipse cx="40" cy="108" rx="26" ry="6" fill="url(#hgGold)" stroke="#FFE885" strokeWidth="1" />

        {/* Glass Bulbs */}
        <path d="M 16 12 C 16 45 35 55 40 60 C 45 55 64 45 64 12" fill="rgba(255,255,255,0.07)" stroke="url(#hgGold)" strokeWidth="1.5" />
        <path d="M 16 108 C 16 75 35 65 40 60 C 45 65 64 75 64 108" fill="rgba(255,255,255,0.07)" stroke="url(#hgGold)" strokeWidth="1.5" />

        {/* Golden Sand Stream */}
        <path d="M 22 28 C 22 45 36 54 40 58 C 44 54 58 45 58 28 Z" fill="#FDE68A" opacity="0.75" />
        <line x1="40" y1="58" x2="40" y2="92" stroke="#FFF" strokeWidth="1.6" strokeDasharray="3 2" opacity="0.95" />
        <path d="M 22 104 Q 40 85 58 104 Z" fill="#FDE68A" opacity="0.85" />

        {/* Pillar Support Rods */}
        <line x1="14" y1="12" x2="14" y2="108" stroke="url(#hgGold)" strokeWidth="2.8" />
        <line x1="66" y1="12" x2="66" y2="108" stroke="url(#hgGold)" strokeWidth="2.8" />
      </g>
    </svg>
  );
}

function CosmicInfinityBg() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="p4Nebula" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0F0C20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="infGlow1" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#F472B6" />
          <stop offset="65%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <rect width="300" height="170" fill="url(#p4Nebula)" />

      {/* Ornate Multi-Layered Cosmic Infinity Loop */}
      <g transform="translate(150, 72)">
        {/* Outer Glowing Galaxy Dust Loop */}
        <path
          d="M 0 0 C -35 -40 -85 -40 -85 0 C -85 40 -35 40 0 0 C 35 -40 85 -40 85 0 C 85 40 35 40 0 0 Z"
          fill="none"
          stroke="url(#infGlow1)"
          strokeWidth="16"
          opacity="0.3"
          strokeLinecap="round"
          filter="blur(5px)"
        />
        {/* Middle Vibrant Loops */}
        <path
          d="M 0 0 C -35 -40 -85 -40 -85 0 C -85 40 -35 40 0 0 C 35 -40 85 -40 85 0 C 85 40 35 40 0 0 Z"
          fill="none"
          stroke="url(#infGlow1)"
          strokeWidth="4.5"
          opacity="0.9"
          strokeLinecap="round"
        />
        {/* Inner Starlight Core Track */}
        <path
          d="M 0 0 C -35 -40 -85 -40 -85 0 C -85 40 -35 40 0 0 C 35 -40 85 -40 85 0 C 85 40 35 40 0 0 Z"
          fill="none"
          stroke="#FFF"
          strokeWidth="1.4"
          strokeDasharray="8 6"
          opacity="0.95"
        />

        {/* Galaxy Disk inside Left Loop */}
        <ellipse cx="-55" cy="0" rx="18" ry="9" fill="#38BDF8" opacity="0.35" transform="rotate(-20 -55 0)" />
        <circle cx="-55" cy="0" r="3.5" fill="#FFF" opacity="0.95" />

        {/* Galaxy Disk inside Right Loop */}
        <ellipse cx="55" cy="0" rx="18" ry="9" fill="#F472B6" opacity="0.35" transform="rotate(20 55 0)" />
        <circle cx="55" cy="0" r="3.5" fill="#FFF" opacity="0.95" />

        {/* Central Golden Infinity Emblem */}
        <path
          d="M 0 0 C -12 -14 -28 -14 -28 0 C -28 14 -12 14 0 0 C 12 -14 28 -14 28 0 C 28 14 12 14 0 0 Z"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="3"
        />
        <circle cx="0" cy="0" r="3" fill="#FFF" />
      </g>
    </svg>
  );
}

export default function LandingPage({ onNavigate }) {
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemo = async () => {
    try {
      const data = await getDemoReading();
      onNavigate('result', data);
    } catch {
      // Backend unavailable — use inline demo data so the UI still works
      onNavigate('result', DEMO_FALLBACK);
    }
  };

  return (
    <div className={styles.landing}>

      {/* ── Hero Section ── */}
      <section
        className={styles.hero}
        ref={heroRef}
      >
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className="badge badge--purple">✦ AI-Powered</span>
            <span className="badge badge--gold">AstroHack 2026</span>
          </div>

          <h1 className={`display-title ${styles.heroTitle}`}>
            Your Palm Holds<br />
            the Cosmos
          </h1>

          <p className={styles.heroSubtitle}>
            AstroLens reads your hand in real time — mapping your Life, Head, and Heart lines
            to generate a personalised astrological reading powered by computer vision and AI.
          </p>

          <div className={styles.heroCta}>
            <button
              id="scan-palm-btn"
              className="btn-primary"
              onClick={() => onNavigate('scanner')}
            >
              <span>🔭</span>
              Scan My Palm
            </button>
            <button
              id="demo-btn"
              className="btn-secondary"
              onClick={handleDemo}
            >
              View Demo Reading
            </button>
          </div>

          <p className={styles.heroNote}>
            No account needed · Instant results · 100% private
          </p>
        </div>

        {/* Floating cosmic palm illustration */}
        <div className={styles.palmIllustration} aria-hidden="true">
          <img
            src="/cosmic_hand.png"
            alt="Cosmic hand"
            className={styles.cosmicHandImg}
          />
        </div>
      </section>

      {/* ── Ornate Cosmic Stats Panels (Refactored from text-only band) ── */}
      <section className={styles.statsSection}>
        <div className={styles.statsPanelsContainer}>
          {/* Horizontal Connecting Gold Thread */}
          <div className={styles.connectingThread} aria-hidden="true">
            <svg width="100%" height="4" viewBox="0 0 1200 4" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="1200" y2="2" stroke="url(#threadGrad)" strokeWidth="2" strokeDasharray="6 6" />
              <defs>
                <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#E8C84A" stopOpacity="0" />
                  <stop offset="20%" stopColor="#E8C84A" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#2EC4B6" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#E8C84A" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#E8C84A" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Panel 1: 21 HAND LANDMARKS */}
          <div className={styles.statPanel}>
            <StatPanelFrame />
            <div className={styles.statPanelBg}>
              <HandConstellationBg />
            </div>
            <div className={styles.statPanelContent}>
              <span className={styles.statValueGold}>21</span>
              <span className={styles.statLabelGold}>HAND LANDMARKS</span>
            </div>
          </div>

          {/* Panel 2: 3 PALM LINES DETECTED */}
          <div className={styles.statPanel}>
            <StatPanelFrame />
            <div className={styles.statPanelBg}>
              <PalmLinesSwirlBg />
            </div>
            <div className={styles.statPanelContent}>
              <span className={styles.statValueGold}>3</span>
              <span className={styles.statLabelGold}>PALM LINES DETECTED</span>
            </div>
          </div>

          {/* Panel 3: <2s SCAN TIME */}
          <div className={styles.statPanel}>
            <StatPanelFrame />
            <div className={styles.statPanelBg}>
              <HourglassVortexBg />
            </div>
            <div className={styles.statPanelContent}>
              <span className={styles.statValueGold}>&lt;2s</span>
              <span className={styles.statLabelGold}>SCAN TIME</span>
            </div>
          </div>

          {/* Panel 4: COSMIC POTENTIAL */}
          <div className={styles.statPanel}>
            <StatPanelFrame />
            <div className={styles.statPanelBg}>
              <CosmicInfinityBg />
            </div>
            <div className={styles.statPanelContent}>
              <span className={styles.statLabelGoldSolo}>COSMIC POTENTIAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className={`container ${styles.features}`}>
        <h2 className={`section-title ${styles.sectionHeading}`}>HOW ASTROLENS WORKS</h2>
        <p className={`muted-text ${styles.sectionSub}`}>
          A four-step pipeline that turns your palm into a cosmic blueprint.
        </p>

        <div className={styles.featuresGrid}>
          {FEATURES.map((f, index) => (
            <div key={f.title} className={styles.cardContainer}>
              <div
                className={`glass-card ${styles.featureCard} ${f.isHighlighted ? styles.highlightedCard : ''}`}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
              {index < FEATURES.length - 1 && (
                <div className={styles.chevronArrow} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="arrowGrad" x1="9" y1="6" x2="15" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E8C84A" />
                        <stop offset="1" stopColor="#2EC4B6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Alchemical Alembic 5-Step Process Diagram ── */}
      <section className={styles.alembicSection}>
        {/* ── Soft Photographic Aurora Glow Layer ── */}
        <div className={styles.auroraContainer}>
          <div className={`${styles.auroraGlow} ${styles.auroraGlowTealLeft}`} />
          <div className={`${styles.auroraGlow} ${styles.auroraGlowEmeraldMid}`} />
          <div className={`${styles.auroraGlow} ${styles.auroraGlowPurpleRight}`} />
          <div className={`${styles.auroraGlow} ${styles.auroraGlowVioletMid}`} />
        </div>

        <div className={styles.alembicCanvas}>
          {/* Main Title Header Banner */}
          <div className={styles.alembicHeaderWrap}>
            <h2 className={styles.alembicTitle}>THE TECHNOLOGY BEHIND THE MAGIC</h2>
          </div>

          {/* Background Stardust Trail Connecting All 5 Sigil Circles */}
          <svg className={styles.alembicStardustTrailSvg} viewBox="0 0 1200 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 100 245 C 220 220 320 280 440 250 C 560 220 660 270 780 240 C 900 210 1000 260 1100 230"
              stroke="url(#stardustStreamGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            <defs>
              <linearGradient id="stardustStreamGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#FDE68A" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#FDE68A" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          {/* 5 Alchemical Alembic Panels */}
          <div className={styles.alembicGrid}>
            {[
              {
                step: '01',
                title: 'THE INITIATING IRIS',
                subtext: 'Webcam Capture | Browser getUserMedia API captures your palm frame',
                icon: <AlembicIrisIcon />,
                offsetClass: styles.alembicCardStep1,
              },
              {
                step: '02',
                title: 'THE CELESTIAL PATTERN',
                subtext: 'MediaPipe Topology | 21 hand landmarks extracted and normalized',
                icon: <AlembicTopologyIcon />,
                offsetClass: styles.alembicCardStep2,
              },
              {
                step: '03',
                title: 'THE SACRED GEOMETRY',
                subtext: 'ROI Extraction | Palm triangle isolated using landmarks 0, 5 & 17',
                icon: <AlembicRoiIcon />,
                offsetClass: styles.alembicCardStep3,
              },
              {
                step: '04',
                title: 'THE LINES OF DESTINY',
                subtext: 'Canny Edge Detection | Adaptive thresholding reveals dominant creases',
                icon: <AlembicCannyIcon />,
                offsetClass: styles.alembicCardStep4,
              },
              {
                step: '05',
                title: 'THE COSMIC ORACLE',
                subtext: 'Gemini AI Reading | Line features prompt a personalised cosmic narrative',
                icon: <AlembicOracleIcon />,
                offsetClass: styles.alembicCardStep5,
              },
            ].map(p => (
              <div key={p.step} className={`${styles.alembicCardWrap} ${p.offsetClass}`}>
                {/* Numbered Sigil Circle (Attached on left) */}
                <div className={styles.alembicSigilCircle}>
                  <span>{p.step}</span>
                </div>

                {/* Glass Alembic Panel Body */}
                <div className={styles.alembicGlassPanel}>
                  <AlembicCardFrame />
                  {/* Top-Right Icon */}
                  <div className={styles.alembicCardIconWrap}>{p.icon}</div>

                  {/* Panel Content */}
                  <div className={styles.alembicCardContent}>
                    <h3 className={styles.alembicCardTitle}>{p.title}</h3>
                    <div className={styles.alembicDividerBar} />
                    <p className={styles.alembicCardSubtext}>{p.subtext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={`container ${styles.testimonials}`}>
        <h2 className={`section-title ${styles.sectionHeading}`}>What the Stars Are Saying</h2>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={`glass-card ${styles.testimonialCard}`}>
              {/* Isolated Starburst Layer (Prevents Container Pulsing) */}
              <div className={styles.testimonialStarsOverlay} aria-hidden="true">
                <span className={`${styles.star} ${styles.star1}`} />
                <span className={`${styles.star} ${styles.star2}`} />
                <span className={`${styles.star} ${styles.star3}`} />
                <span className={`${styles.star} ${styles.star4}`} />
                <span className={`${styles.star} ${styles.star5}`} />
              </div>
              <div className={styles.testimonialStars}>★★★★★</div>
              <p className={styles.testimonialQuote}>"{t.quote}"</p>
              <div className={styles.testimonialName}>— {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaGlow} aria-hidden="true" />
        <h2 className="display-title">Ready to Read Your Destiny?</h2>
        <p className={`muted-text ${styles.finalCtaSub}`}>
          Open your palm. Let the cosmos speak.
        </p>
        <button
          id="final-scan-btn"
          className="btn-primary"
          onClick={() => onNavigate('scanner')}
          style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
        >
          <span>🔭</span>
          Begin Palm Scan
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>✦ AstroLens</div>
        <p className={styles.footerText}>
          Built for AstroHack 2026 · Powered by MediaPipe, OpenCV & Gemini AI
        </p>
        <p className={styles.footerText} style={{ marginTop: '0.25rem' }}>
          © 2026 AstroLens — For AstroLive Challenge
        </p>
      </footer>
    </div>
  );
}