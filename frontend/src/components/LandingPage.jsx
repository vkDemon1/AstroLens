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

/* ── Modern Glassmorphism Panel Mode (SVG Frame Removed) ── */
function GrandFiligreeCanvasFrame() {
  return null;
}

/* ── Alchemical Alembic Process Diagram Components (Image 22 Style) ── */
function AlembicCardFrame() {
  return (
    <svg className={styles.alembicFrameSvg} viewBox="0 0 240 160" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="alembicGoldGrad" x1="0" y1="0" x2="240" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* Outer Curved Glass Border Hugging Edges */}
      <rect x="2" y="2" width="236" height="156" rx="12" fill="none" stroke="url(#alembicGoldGrad)" strokeWidth="1.8" />
      <rect x="5" y="5" width="230" height="150" rx="9" fill="none" stroke="#FDE68A" strokeWidth="0.6" opacity="0.4" />

      {/* Ornate Corner Sigils & Celestial Accents */}
      {/* Top-Left Sigil */}
      <circle cx="14" cy="14" r="3" fill="#FDE68A" />
      <path d="M 14 8 V 20 M 8 14 H 20" stroke="#FDE68A" strokeWidth="0.8" opacity="0.6" />

      {/* Bottom-Right Saturn Ring Sigil */}
      <circle cx="226" cy="146" r="4" stroke="#FDE68A" strokeWidth="1" fill="none" />
      <ellipse cx="226" cy="146" rx="7" ry="2" stroke="#FDE68A" strokeWidth="0.8" transform="rotate(-25 226 146)" />

      {/* Bottom-Left Crescent Moon */}
      <path d="M 15 143 A 5 5 0 1 0 19 150 A 4 4 0 1 1 15 143 Z" fill="#FDE68A" opacity="0.7" />
    </svg>
  );
}


/* ══════════════════════════════════════════════════════════
   CUSTOM CELESTIAL & COMPUTER VISION SVG ICONS (64x64)
   ══════════════════════════════════════════════════════════ */

/**
 * 1. The Palm Twin / Explorer Archetype Icon
 * Concept: "Astrolabe Constellation"
 * Intricate astrolabe dial, celestial coordinates, skeletal tracking mesh, and pulsing core star.
 */
export function AstrolabeIcon({ width = 64, height = 64, className = '', style = {} }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id="astrolabeBgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#0F172A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#070A13" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="astrolabeGoldGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="35%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="astrolabeCyanGrad" x1="15" y1="10" x2="49" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="40%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <filter id="astrolabeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark Outer Cosmos Plate */}
      <circle cx="32" cy="32" r="28.5" fill="url(#astrolabeBgGrad)" />

      {/* Outer Astrolabe Brass Coordinate Rings */}
      <circle cx="32" cy="32" r="29" stroke="url(#astrolabeGoldGrad)" strokeWidth="1.3" />
      <circle cx="32" cy="32" r="26.5" stroke="#FDE68A" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.65" />
      <circle cx="32" cy="32" r="23" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="1 4" opacity="0.4" />

      {/* Astrolabe Cardinal Axis Ticks */}
      <path
        d="M 32 3 V 6.5 M 32 57.5 V 61 M 3 32 H 6.5 M 57.5 32 H 61"
        stroke="#FDE68A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M 11.5 11.5 L 14 14 M 50 50 L 52.5 52.5 M 52.5 11.5 L 50 14 M 14 50 L 11.5 52.5"
        stroke="#FDE68A"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Celestial Orbital Ellipse (Tilted Astrolabe Ring) */}
      <ellipse
        cx="32"
        cy="32"
        rx="23.5"
        ry="9"
        stroke="url(#astrolabeCyanGrad)"
        strokeWidth="0.6"
        strokeDasharray="4 3"
        transform="rotate(-28 32 32)"
        opacity="0.45"
      />

      {/* Hand Skeletal Tracking Constellation Lines */}
      <line x1="32" y1="33" x2="32" y2="11" stroke="url(#astrolabeCyanGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      <line x1="32" y1="33" x2="22" y2="15" stroke="url(#astrolabeCyanGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <line x1="32" y1="33" x2="42" y2="16" stroke="url(#astrolabeCyanGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <line x1="22" y1="41" x2="14" y2="28" stroke="url(#astrolabeCyanGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <line x1="42" y1="16" x2="49" y2="27" stroke="url(#astrolabeCyanGrad)" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />

      {/* Palm Trunk Vector to Wrist */}
      <line x1="32" y1="33" x2="22" y2="41" stroke="url(#astrolabeCyanGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
      <line x1="22" y1="41" x2="32" y2="50" stroke="url(#astrolabeCyanGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
      <line x1="32" y1="33" x2="49" y2="27" stroke="#38BDF8" strokeWidth="0.6" strokeDasharray="2 2" strokeLinecap="round" opacity="0.4" />
      <line x1="32" y1="50" x2="49" y2="27" stroke="#38BDF8" strokeWidth="0.6" strokeDasharray="2 2" strokeLinecap="round" opacity="0.35" />

      {/* Constellation Star Nodes */}
      <circle cx="14" cy="28" r="1.8" fill="#FFF" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="22" cy="15" r="2" fill="#FFF" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="32" cy="11" r="2.2" fill="#FFF" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="42" cy="16" r="2" fill="#FFF" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="49" cy="27" r="1.8" fill="#FFF" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="22" cy="41" r="2" fill="#FFF" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="32" cy="50" r="2.5" fill="#FDE68A" stroke="#FFF" strokeWidth="0.8" filter="url(#astrolabeGlow)" />

      {/* Pulsing Core Star at Palm Center (32, 33) */}
      <g className={styles.astrolabePulseStar}>
        <circle cx="32" cy="33" r="5" fill="rgba(56, 189, 248, 0.35)" filter="url(#astrolabeGlow)" />
        <path
          d="M 32 27 Q 32 33 38 33 Q 32 33 32 39 Q 32 33 26 33 Q 32 33 32 27 Z"
          fill="#FFFBEB"
          stroke="#FDE68A"
          strokeWidth="0.4"
        />
        <circle cx="32" cy="33" r="1.8" fill="#FFF" />
      </g>
    </svg>
  );
}

/**
 * 2. The Heart Pattern Icon
 * Concept: "Sacred Geometry Heart Core"
 * Overlapping sacred geometry orbital ellipses forming a heart in negative space with intersection nodes.
 */
export function SacredHeartGeometryIcon({ width = 64, height = 64, className = '', style = {} }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id="heartBgGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#BE185D" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#831843" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heartPinkGrad" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="40%" stopColor="#F472B6" />
          <stop offset="80%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id="heartGoldGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="45%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ethereal Pink Cosmos Aura */}
      <circle cx="32" cy="32" r="28" fill="url(#heartBgGlow)" />

      {/* Sacred Mandorla / Vesica Piscis Upper Lobes */}
      <circle cx="24.5" cy="25.5" r="14" stroke="url(#heartPinkGrad)" strokeWidth="0.9" fill="none" opacity="0.45" strokeDasharray="3 2" />
      <circle cx="39.5" cy="25.5" r="14" stroke="url(#heartPinkGrad)" strokeWidth="0.9" fill="none" opacity="0.45" strokeDasharray="3 2" />

      {/* Symmetrical Dual Orbital Ellipses */}
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="url(#heartGoldGrad)" strokeWidth="0.9" fill="none" transform="rotate(45 32 32)" opacity="0.65" />
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="url(#heartGoldGrad)" strokeWidth="0.9" fill="none" transform="rotate(-45 32 32)" opacity="0.65" />

      {/* Inscribed Sacred Geometric Triangle (Base of Heart) */}
      <polygon points="32,51 16.5,23.5 47.5,23.5" stroke="#FDE68A" strokeWidth="0.75" strokeDasharray="3 2" fill="none" opacity="0.55" />

      {/* Golden Harmonic Radiance Rays */}
      <line x1="32" y1="51" x2="32" y2="21" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />

      {/* Pure Sacred Heart Continuous Vector Contour */}
      <path
        d="M 32 51 C 18 39 14 27 23 18.5 C 28.5 13.5 32 19 32 22 C 32 19 35.5 13.5 41 18.5 C 50 27 46 39 32 51 Z"
        fill="rgba(244, 114, 182, 0.16)"
        stroke="url(#heartPinkGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#heartGlow)"
      />

      {/* Glowing Geometric Energy Nodes at Key Intersections */}
      <circle cx="32" cy="51" r="2.5" fill="#FDE68A" stroke="#FFF" strokeWidth="0.8" filter="url(#heartGlow)" />
      <circle cx="16.5" cy="23.5" r="2" fill="#F472B6" stroke="#FFF" strokeWidth="0.8" />
      <circle cx="47.5" cy="23.5" r="2" fill="#F472B6" stroke="#FFF" strokeWidth="0.8" />
      <circle cx="32" cy="22" r="2" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="0.8" />
      <circle cx="23.5" cy="34.5" r="1.6" fill="#FDE68A" />
      <circle cx="40.5" cy="34.5" r="1.6" fill="#FDE68A" />

      {/* Pulsing Sacred Heart Center Core */}
      <g className={styles.sacredHeartPulse}>
        <circle cx="32" cy="32" r="4.5" fill="rgba(244, 114, 182, 0.4)" filter="url(#heartGlow)" />
        <circle cx="32" cy="32" r="2.2" fill="#FFFBEB" stroke="#F472B6" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/**
 * 3. The Cosmic Oracle / Fine Features Icon
 * Concept: "Neural Nebula Spark"
 * AI Neural Network Trinity, Toroidal Magnetic Plasma Rings, and Geometric Oracle Eye.
 */
export function NeuralNebulaIcon({ width = 64, height = 64, className = '', style = {} }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id="nebulaBgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#4338CA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nebulaPurpleGrad" x1="10" y1="12" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0ABFC" />
          <stop offset="35%" stopColor="#C084FC" />
          <stop offset="70%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="nebulaCyanIndigo" x1="16" y1="20" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="nebulaGoldAccent" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="nebulaSparkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Deep Violet Nebula Background Aura */}
      <circle cx="32" cy="32" r="28" fill="url(#nebulaBgGlow)" />

      {/* Sweeping Magnetic Field / Toroidal Plasma Rings */}
      <ellipse cx="32" cy="32" rx="27" ry="9" stroke="url(#nebulaPurpleGrad)" strokeWidth="0.8" fill="none" transform="rotate(-25 32 32)" opacity="0.55" strokeDasharray="4 2.5" />
      <ellipse cx="32" cy="32" rx="27" ry="9" stroke="#38BDF8" strokeWidth="0.75" fill="none" transform="rotate(35 32 32)" opacity="0.5" strokeDasharray="3 3" />

      {/* Outer Geometric Celestial Oracle Eye Contour */}
      <path
        d="M 6 32 C 16 16 48 16 58 32 C 48 48 16 48 6 32 Z"
        fill="rgba(79, 70, 229, 0.12)"
        stroke="url(#nebulaPurpleGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Sacred Diamond Iris Frame */}
      <polygon
        points="32,15 48,32 32,49 16,32"
        stroke="url(#nebulaGoldAccent)"
        strokeWidth="0.9"
        fill="rgba(15, 23, 42, 0.75)"
        strokeDasharray="3 2"
      />

      {/* Neural Synapse Curved Firing Axons (3-Node Network) */}
      <path d="M 32 23 Q 27 30 23.5 38" stroke="url(#nebulaCyanIndigo)" strokeWidth="1.5" strokeLinecap="round" filter="url(#nebulaSparkGlow)" />
      <path d="M 32 23 Q 37 30 40.5 38" stroke="url(#nebulaCyanIndigo)" strokeWidth="1.5" strokeLinecap="round" filter="url(#nebulaSparkGlow)" />
      <path d="M 23.5 38 Q 32 42 40.5 38" stroke="url(#nebulaPurpleGrad)" strokeWidth="1.5" strokeLinecap="round" filter="url(#nebulaSparkGlow)" />

      {/* Central Synaptic Convergent Radiance */}
      <line x1="32" y1="23" x2="32" y2="33" stroke="#FDE68A" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
      <line x1="23.5" y1="38" x2="32" y2="33" stroke="#FDE68A" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
      <line x1="40.5" y1="38" x2="32" y2="33" stroke="#FDE68A" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />

      {/* 3 Interconnected Neural Synapse Nodes */}
      <circle cx="32" cy="23" r="2.8" fill="#FFF" stroke="#38BDF8" strokeWidth="1.1" filter="url(#nebulaSparkGlow)" />
      <circle cx="23.5" cy="38" r="2.8" fill="#FFF" stroke="#C084FC" strokeWidth="1.1" filter="url(#nebulaSparkGlow)" />
      <circle cx="40.5" cy="38" r="2.8" fill="#FFF" stroke="#C084FC" strokeWidth="1.1" filter="url(#nebulaSparkGlow)" />

      {/* Central Pulsing AI Brain Spark Core */}
      <g className={styles.neuralSparkPulse}>
        <circle cx="32" cy="33" r="4.8" fill="rgba(253, 230, 138, 0.45)" filter="url(#nebulaSparkGlow)" />
        <path
          d="M 32 27 Q 32 33 38 33 Q 32 33 32 39 Q 32 33 26 33 Q 32 33 32 27 Z"
          fill="#FFF"
          stroke="#FDE68A"
          strokeWidth="0.5"
        />
        <circle cx="32" cy="33" r="1.5" fill="#1E1B4B" />
      </g>

      {/* Cardinal Plasma Sparks */}
      <circle cx="6" cy="32" r="1.4" fill="#38BDF8" />
      <circle cx="58" cy="32" r="1.4" fill="#38BDF8" />
      <circle cx="32" cy="15" r="1.4" fill="#FDE68A" />
      <circle cx="32" cy="49" r="1.4" fill="#FDE68A" />
    </svg>
  );
}

/* ── Panel Icon Wrappers (Backward Compatible) ── */
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

function AlembicTopologyIcon() {
  return <AstrolabeIcon width={42} height={42} />;
}

function AlembicRoiIcon() {
  return <SacredHeartGeometryIcon width={42} height={42} />;
}

function AlembicCannyIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="38" height="38" rx="8" fill="rgba(15, 23, 42, 0.8)" stroke="#FDE68A" strokeWidth="1.5" />
      <path d="M 14 36 C 10 28 8 20 10 12 C 12 10 14 12 16 16 C 16 9 18 6 20 6 C 22 6 24 9 24 15 C 24 8 26 5 28 5 C 30 5 32 8 32 15 C 32 10 34 8 36 9 C 38 10 36 16 34 24 C 31 32 26 36 14 36 Z" stroke="#FDE68A" strokeWidth="1" opacity="0.5" />
      <path d="M 12 20 Q 20 24 30 20" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 4px #38BDF8)" />
      <path d="M 11 25 Q 20 25 28 30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M 18 14 Q 24 22 18 32" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 4px #FDE68A)" />
    </svg>
  );
}

function AlembicOracleIcon() {
  return <NeuralNebulaIcon width={42} height={42} />;
}


/* ══════════════════════════════════════════════════════════
   5 MINI PRODUCT EXPERIENCES COMPONENTS
   ══════════════════════════════════════════════════════════ */

/* ── CARD 01: DAILY PALM PULSE (HABIT / RETENTION) ── */
function DailyPalmPulseExp({ onClose }) {
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'done'
  const [toast, setToast] = useState(null);

  const handleStartScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('done');
    }, 1500);
  };

  const handleShare = async () => {
    const text = "✦ My Daily Cosmic Pulse: Energy 82% | Focus 64% | Emotion 91% — 'Trust your instincts.' Discover yours on AstroLens! ✨";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Today's Cosmic Pulse", text, url: window.location.href });
        setToast('Shared successfully!');
      } catch {
        navigator.clipboard?.writeText(text);
        setToast('✓ Copied to clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(text);
      setToast('✓ Copied to clipboard!');
    }
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className={styles.expContainer}>
      <div className={styles.expHeaderRow}>
        <div className={styles.expTitleGroup}>
          <h4 className={styles.expTitle}>TODAY'S PALM PULSE</h4>
          <span className={styles.expSubtitle}>Daily Habit &amp; Cosmic Resonance</span>
        </div>
        <div className={styles.expHeaderRight}>
          <span className={`${styles.expBadge} ${styles.expBadgeCyan}`}>DAILY PULSE</span>
          <button className={styles.expCloseBtn} onClick={onClose} aria-label="Close experience">✕</button>
        </div>
      </div>

      {scanState === 'idle' && (
        <div className={styles.pulseScannerBox}>
          <div className={styles.pulseRadarGraphic}>
            <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
              <circle cx="38" cy="38" r="34" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="38" cy="38" r="24" stroke="rgba(253, 230, 138, 0.4)" strokeWidth="1.2" />
              <circle cx="38" cy="38" r="12" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="1" />
              <circle cx="38" cy="38" r="3.5" fill="#FFF" />
            </svg>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#E2E8F0', margin: '0 0 0.85rem', lineHeight: '1.4' }}>
            Check in with your cosmic energy and vital alignment.
          </p>
          <button className={styles.expActionBtn} onClick={handleStartScan}>
            <span>📡</span> SCAN TODAY'S PULSE
          </button>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className={styles.pulseScannerBox}>
          <div className={styles.pulseRadarGraphic}>
            <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
              <circle cx="38" cy="38" r="34" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="38" cy="38" r="20" fill="rgba(56, 189, 248, 0.35)" />
            </svg>
            <div className={styles.pulseScanningBeam} />
          </div>
          <p style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: '700', margin: '0' }}>
            Aligning planetary frequencies...
          </p>
          <span style={{ fontSize: '0.64rem', color: '#94A3B8', marginTop: '0.25rem' }}>
            Extracting vital biometric resonance
          </span>
        </div>
      )}

      {scanState === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <div className={styles.pulseMetricRow}>
              <span className={styles.pulseMetricLabel}>Energy</span>
              <div className={styles.pulseMetricTrack}>
                <div className={styles.pulseMetricFill} style={{ width: '82%', background: 'linear-gradient(90deg, #38BDF8, #818CF8)' }} />
              </div>
              <span className={styles.pulseMetricVal}>82%</span>
            </div>
            <div className={styles.pulseMetricRow}>
              <span className={styles.pulseMetricLabel}>Focus</span>
              <div className={styles.pulseMetricTrack}>
                <div className={styles.pulseMetricFill} style={{ width: '64%', background: 'linear-gradient(90deg, #FDE68A, #D97706)' }} />
              </div>
              <span className={styles.pulseMetricVal}>64%</span>
            </div>
            <div className={styles.pulseMetricRow}>
              <span className={styles.pulseMetricLabel}>Emotion</span>
              <div className={styles.pulseMetricTrack}>
                <div className={styles.pulseMetricFill} style={{ width: '91%', background: 'linear-gradient(90deg, #F472B6, #C084FC)' }} />
              </div>
              <span className={styles.pulseMetricVal}>91%</span>
            </div>
          </div>

          <div className={styles.pulseThemeBox}>
            <strong>Today's Theme:</strong> "Trust your instincts. A rare alignment fuels bold decisions."
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.15rem' }}>
            <button className={styles.expActionBtn} onClick={handleShare} style={{ flex: 2 }}>
              <span>↗</span> SHARE TODAY'S PULSE
            </button>
            <button className={`${styles.expActionBtn} ${styles.expActionBtnSecondary}`} onClick={handleStartScan} style={{ flex: 1 }}>
              <span>↺</span> Rescan
            </button>
          </div>

          <div className={styles.pulseNextReminder}>
            ✦ Next pulse available tomorrow at 06:00 UTC · Demo Insight
          </div>
        </div>
      )}

      {toast && <div className={styles.expToastMsg}>{toast}</div>}
    </div>
  );
}

/* ── CARD 02: PALM TWIN (STRUCTURAL VIRALITY) ── */
function PalmTwinExp({ onClose }) {
  const [activeNode, setActiveNode] = useState(null);
  const [toast, setToast] = useState(null);

  const landmarks = [
    { id: 0, x: 21, y: 34, name: 'Wrist Anchor' },
    { id: 4, x: 8, y: 16, name: 'Thumb Tip' },
    { id: 8, x: 14, y: 8, name: 'Index Apex' },
    { id: 12, x: 21, y: 6, name: 'Middle Apex' },
    { id: 16, x: 28, y: 8, name: 'Ring Apex' },
    { id: 20, x: 35, y: 13, name: 'Pinky Apex' },
    { id: 9, x: 21, y: 20, name: 'Palm Center' }
  ];

  const handleChallengeFriend = async () => {
    const text = "✦ My Palm Archetype is 73% Explorer! What's yours? Discover your Palm Twin on AstroLens: https://astrolens.app ✨";
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Palm Twin Archetype", text, url: window.location.href });
        setToast('Challenge sent!');
      } catch {
        navigator.clipboard?.writeText(text);
        setToast('✓ Challenge link copied to clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(text);
      setToast('✓ Challenge link copied to clipboard!');
    }
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className={styles.expContainer}>
      <div className={styles.expHeaderRow}>
        <div className={styles.expTitleGroup}>
          <h4 className={styles.expTitle}>PALM TWIN ARCHETYPE</h4>
          <span className={styles.expSubtitle}>Viral Personality Discovery</span>
        </div>
        <div className={styles.expHeaderRight}>
          <span className={styles.expBadge}>VIRAL MATCH</span>
          <button className={styles.expCloseBtn} onClick={onClose} aria-label="Close experience">✕</button>
        </div>
      </div>

      <div className={styles.twinArchetypeBox}>
        <div className={styles.twinNameHeader}>
          <div>
            <span style={{ fontSize: '0.66rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Palm Twin</span>
            <div className={styles.twinHeroName}>THE EXPLORER 🧭</div>
          </div>
          <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AstrolabeIcon width={48} height={48} />
          </div>
        </div>

        {/* Breakdown percentages */}
        <div className={styles.twinPercGrid}>
          <div className={styles.twinPercItem} style={{ borderColor: 'rgba(56, 189, 248, 0.35)', background: 'rgba(56, 189, 248, 0.08)' }}>
            <div className={styles.twinPercVal} style={{ color: '#38BDF8' }}>73%</div>
            <div className={styles.twinPercLabel}>Explorer</div>
          </div>
          <div className={styles.twinPercItem}>
            <div className={styles.twinPercVal} style={{ color: '#FDE68A' }}>18%</div>
            <div className={styles.twinPercLabel}>Visionary</div>
          </div>
          <div className={styles.twinPercItem}>
            <div className={styles.twinPercVal} style={{ color: '#C084FC' }}>9%</div>
            <div className={styles.twinPercLabel}>Strategist</div>
          </div>
        </div>

        {/* Shareable Card Preview Box */}
        <div className={styles.twinShareCardPreview}>
          <div style={{ fontWeight: '800', color: '#FDE68A', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>✦ MY PALM ARCHETYPE ✦</div>
          <div>"Driven by curiosity and kinetic vital momentum."</div>
          <div style={{ fontSize: '0.64rem', color: '#94A3B8', marginTop: '0.25rem' }}>Who is your cosmic palm twin? Challenge them below:</div>
        </div>

        <button className={styles.expActionBtn} onClick={handleChallengeFriend}>
          <span>⚡</span> CHALLENGE A FRIEND
        </button>
      </div>

      {toast && <div className={styles.expToastMsg}>{toast}</div>}
    </div>
  );
}

/* ── CARD 03: HIDDEN PALM PATTERNS (PROGRESSION / EXPLORATION) ── */
function HiddenPatternsExp({ onClose }) {
  const [activeZone, setActiveZone] = useState('heart');
  const [unlocked, setUnlocked] = useState({ heart: true, head: true, life: true, fate: false, hidden: false });
  const [toast, setToast] = useState(null);

  const zones = [
    { id: 'heart', name: 'Heart', icon: '❤️', desc: 'Emotional depth & instinctual empathy frequencies.' },
    { id: 'head', name: 'Head', icon: '🧠', desc: 'Strategic clarity & adaptive problem-solving vectors.' },
    { id: 'life', name: 'Life', icon: '⚡', desc: 'Kinetic vitality & grounded physical endurance.' },
    { id: 'fate', name: 'Fate', icon: '🧭', desc: 'Directional synchronicity & pivotal life crossroads.' },
    { id: 'hidden', name: 'Hidden', icon: '✨', desc: 'Metaphysical intuition imprint active under high pressure.' }
  ];

  const handleSelectZone = (zoneId) => {
    setActiveZone(zoneId);
    if (!unlocked[zoneId]) {
      setUnlocked(prev => ({ ...prev, [zoneId]: true }));
      setToast(`✦ Unlocked ${zoneId.toUpperCase()} pattern!`);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const unlockedCount = Object.values(unlocked).filter(Boolean).length;

  return (
    <div className={styles.expContainer}>
      <div className={styles.expHeaderRow}>
        <div className={styles.expTitleGroup}>
          <h4 className={styles.expTitle}>HIDDEN PALM PATTERNS</h4>
          <span className={styles.expSubtitle}>ROI Progression &amp; Deep Imprints</span>
        </div>
        <div className={styles.expHeaderRight}>
          <span className={`${styles.expBadge} ${styles.expBadgeCyan}`}>LENS SCAN</span>
          <button className={styles.expCloseBtn} onClick={onClose} aria-label="Close experience">✕</button>
        </div>
      </div>

      <div className={styles.patternsInteractiveArea}>
        {/* Sacred Geometry Heart ROI graphic */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ width: 85, height: 80, background: 'rgba(10, 15, 35, 0.95)', borderRadius: '10px', border: '1px solid rgba(244, 114, 182, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)' }}>
            <SacredHeartGeometryIcon width={76} height={72} />
          </div>


          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '800', color: '#FDE68A', textTransform: 'uppercase', marginBottom: '0.2rem', fontSize: '0.74rem' }}>
              {zones.find(z => z.id === activeZone)?.icon} {zones.find(z => z.id === activeZone)?.name} Pattern
            </div>
            <div style={{ color: '#E2E8F0', lineHeight: '1.4', fontSize: '0.72rem' }}>
              {zones.find(z => z.id === activeZone)?.desc}
            </div>
          </div>
        </div>

        {/* Zone chips selector */}
        <div className={styles.patternZonesGrid}>
          {zones.map(z => (
            <button
              key={z.id}
              className={`${styles.patternZoneChip} ${activeZone === z.id ? styles.patternZoneChipActive : ''} ${!unlocked[z.id] ? styles.patternZoneChipLocked : ''}`}
              onClick={() => handleSelectZone(z.id)}
            >
              {unlocked[z.id] ? '✓' : '🔒'} {z.name}
            </button>
          ))}
        </div>

        {/* Progress tracker */}
        <div className={styles.discoveryProgressBar}>
          <span>PROGRESSION: {unlockedCount} / 5 DISCOVERED</span>
          <span style={{ color: unlockedCount === 5 ? '#34D399' : '#FDE68A', fontWeight: '800' }}>
            {unlockedCount === 5 ? '✦ ALL UNLOCKED' : `${Math.round((unlockedCount / 5) * 100)}%`}
          </span>
        </div>
      </div>

      <button className={`${styles.expActionBtn} ${styles.expActionBtnSecondary}`} onClick={() => setUnlocked({ heart: true, head: true, life: true, fate: false, hidden: false })}>
        <span>↺</span> EXPLORE AGAIN
      </button>

      {toast && <div className={styles.expToastMsg}>{toast}</div>}
    </div>
  );
}

/* ── CARD 04: PALM EVOLUTION (RETENTION / JOURNEY) ── */
function PalmEvolutionExp({ onClose }) {
  const [era, setEra] = useState('present'); // 'past' | 'present' | 'future'
  const [toast, setToast] = useState(null);

  const eraData = {
    past: {
      label: 'Past · 3 Yrs Ago',
      life: '+4%',
      focus: 'Baseline',
      heart: '+7%',
      story: 'Formative foundation. Early energy focused on establishing stability.',
      color: '#F59E0B'
    },
    present: {
      label: 'Present · Today',
      life: '+12%',
      focus: '+8%',
      heart: '+16%',
      story: 'Current kinetic peak. Enhanced Life line clarity fuels bold expansion.',
      color: '#38BDF8'
    },
    future: {
      label: 'Future · +1 Year',
      life: '+24%',
      focus: '+19%',
      heart: '+28%',
      story: 'Projected alignment. Deeper heart crease resonance indicates lasting clarity.',
      color: '#C084FC'
    }
  };

  const current = eraData[era];

  const handleSaveMoment = () => {
    setToast('✓ Saved to Palm Journey — Moment 01!');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className={styles.expContainer}>
      <div className={styles.expHeaderRow}>
        <div className={styles.expTitleGroup}>
          <h4 className={styles.expTitle}>PALM EVOLUTION TIMELINE</h4>
          <span className={styles.expSubtitle}>Longitudinal Cosmic Journey</span>
        </div>
        <div className={styles.expHeaderRight}>
          <span className={`${styles.expBadge} ${styles.expBadgePurple}`}>MOMENT 01</span>
          <button className={styles.expCloseBtn} onClick={onClose} aria-label="Close experience">✕</button>
        </div>
      </div>

      <div className={styles.evolutionSliderWrap}>
        {/* Timeline Slider Buttons */}
        <div className={styles.evolutionTimeTrack}>
          <button
            className={`${styles.evolutionEraBtn} ${era === 'past' ? styles.evolutionEraBtnActive : ''}`}
            onClick={() => setEra('past')}
          >
            PAST (3 Yrs)
          </button>
          <div style={{ height: 2, flex: 1, background: 'rgba(253, 230, 138, 0.25)', margin: '0 0.4rem' }} />
          <button
            className={`${styles.evolutionEraBtn} ${era === 'present' ? styles.evolutionEraBtnActive : ''}`}
            onClick={() => setEra('present')}
          >
            PRESENT (Now)
          </button>
          <div style={{ height: 2, flex: 1, background: 'rgba(253, 230, 138, 0.25)', margin: '0 0.4rem' }} />
          <button
            className={`${styles.evolutionEraBtn} ${era === 'future' ? styles.evolutionEraBtnActive : ''}`}
            onClick={() => setEra('future')}
          >
            FUTURE (+1 Yr)
          </button>
        </div>

        {/* Dynamic Palm Morph Visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.65)', borderRadius: '8px', padding: '0.6rem 0.75rem', border: '1px solid rgba(253, 230, 138, 0.2)' }}>
          <div style={{ width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 42 42" fill="none">
              <rect x="2" y="2" width="38" height="38" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke={current.color} strokeWidth="1.2" />
              {/* Heart line */}
              <path
                d={era === 'past' ? "M 12 21 Q 20 25 28 22" : era === 'present' ? "M 12 20 Q 20 24 30 20" : "M 12 18 Q 20 22 32 18"}
                stroke="#38BDF8"
                strokeWidth={era === 'future' ? '2.4' : '1.8'}
                strokeLinecap="round"
              />
              {/* Head line */}
              <path
                d={era === 'past' ? "M 11 26 Q 20 26 26 31" : era === 'present' ? "M 11 25 Q 20 25 28 30" : "M 11 24 Q 20 23 30 28"}
                stroke="#FFF"
                strokeWidth={era === 'future' ? '2.2' : '1.6'}
                strokeLinecap="round"
              />
              {/* Life line */}
              <path
                d={era === 'past' ? "M 18 15 Q 22 22 18 30" : era === 'present' ? "M 18 14 Q 24 22 18 32" : "M 18 13 Q 26 22 18 35"}
                stroke="#FDE68A"
                strokeWidth={era === 'future' ? '2.5' : '2'}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.68rem', color: current.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {current.label}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#E2E8F0', lineHeight: '1.4', marginTop: '0.2rem' }}>
              {current.story}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.evolutionMetricsGrid}>
          <div className={styles.evolutionMetricCol}>
            <div className={styles.evolutionMetricTitle}>Life Pattern</div>
            <div className={styles.evolutionMetricShift} style={{ color: '#FDE68A' }}>{current.life}</div>
          </div>
          <div className={styles.evolutionMetricCol}>
            <div className={styles.evolutionMetricTitle}>Focus Pattern</div>
            <div className={styles.evolutionMetricShift} style={{ color: '#FFF' }}>{current.focus}</div>
          </div>
          <div className={styles.evolutionMetricCol}>
            <div className={styles.evolutionMetricTitle}>Heart Pattern</div>
            <div className={styles.evolutionMetricShift} style={{ color: '#38BDF8' }}>{current.heart}</div>
          </div>
        </div>

        <button className={styles.expActionBtn} onClick={handleSaveMoment}>
          <span>✦</span> SAVE THIS MOMENT (MOMENT 01)
        </button>
      </div>

      {toast && <div className={styles.expToastMsg}>{toast}</div>}
    </div>
  );
}

/* ── CARD 05: ASK THE COSMIC ORACLE (MONETIZATION FUNNEL) ── */
function CosmicOracleExp({ onClose }) {
  const [selectedCat, setSelectedCat] = useState('career');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = [
    { id: 'love', name: '❤️ LOVE', reading: 'Your heart crease indicates deep emotional resonance. A harmonious connection arrives when you stay true to your personal sovereignty.' },
    { id: 'career', name: '💼 CAREER', reading: 'Your line geometry reveals a trajectory shaped by strategic perseverance rather than repetition. You thrive when resolving ambiguity.' },
    { id: 'money', name: '💰 MONEY', reading: 'Your destiny arc indicates prosperous expansion through diversified creative endeavors rather than singular rigid channels.' },
    { id: 'direction', name: '🧭 DIRECTION', reading: 'The bifurcation on your Head line signals a pivotal decision point. Trust the unconventional road; it aligns with your vital core.' },
    { id: 'week', name: '✨ THIS WEEK', reading: 'A high-energy surge initiates mid-week. Channel this kinetic focus into launching what you have hesitated to begin.' },
  ];

  const handleSelectCat = (catId) => {
    setIsSynthesizing(true);
    setSelectedCat(catId);
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 900);
  };

  const handleFunnelAction = (tierName) => {
    if (tierName === 'deep') {
      setToast('✦ Unlocked Demo: 12-Page AI Palmistry Deep Blueprint ($4.99 value)!');
    } else if (tierName === 'astrologer') {
      setToast('✦ Connecting to Verified AstroLive Astrologer... (Demo Funnel)');
    }
    setTimeout(() => setToast(null), 2500);
  };

  const currentReading = categories.find(c => c.id === selectedCat);

  return (
    <div className={styles.expContainer}>
      <div className={styles.expHeaderRow}>
        <div className={styles.expTitleGroup}>
          <h4 className={styles.expTitle}>ASK THE COSMIC ORACLE</h4>
          <span className={styles.expSubtitle}>Gemini AI Divination Funnel</span>
        </div>
        <div className={styles.expHeaderRight}>
          <span className={`${styles.expBadge} ${styles.expBadgePurple}`}>AI ORACLE</span>
          <button className={styles.expCloseBtn} onClick={onClose} aria-label="Close experience">✕</button>
        </div>
      </div>

      {/* Category selector */}
      <div className={styles.oracleCategoryGrid}>
        {categories.map(c => (
          <button
            key={c.id}
            className={`${styles.oracleCategoryBtn} ${selectedCat === c.id ? styles.oracleCategoryBtnActive : ''}`}
            onClick={() => handleSelectCat(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Reading container */}
      <div className={styles.oracleReadingBox}>
        {isSynthesizing ? (
          <div style={{ textAlign: 'center', padding: '0.6rem 0.2rem' }}>
            <div style={{ fontSize: '0.88rem', color: '#C084FC', marginBottom: '0.2rem' }}>✦ AI SYNTHESIS IN PROGRESS ✦</div>
            <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>Cross-referencing palm vectors with planetary transits...</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.64rem', color: '#FDE68A', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
              DEMO ORACLE READING · {currentReading?.name}
            </div>
            <p style={{ margin: '0', fontSize: '0.74rem', color: '#F8FAFC', lineHeight: '1.45' }}>
              "{currentReading?.reading}"
            </p>
          </div>
        )}
      </div>

      {/* 3-Tier Monetization Funnel */}
      <div>
        <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
          Explore Full Consultation Funnel:
        </div>
        <div className={styles.oracleFunnelGrid}>
          <button className={`${styles.funnelBtn} ${styles.funnelBtnFree}`} onClick={() => setToast('✓ 1 Free Insight Used')}>
            Free Insight
          </button>
          <button className={`${styles.funnelBtn} ${styles.funnelBtnDeep}`} onClick={() => handleFunnelAction('deep')}>
            🔮 Deep ($4.99)
          </button>
          <button className={`${styles.funnelBtn} ${styles.funnelBtnLive}`} onClick={() => handleFunnelAction('astrologer')}>
            📞 Live Astrologer
          </button>
        </div>
      </div>

      {toast && <div className={styles.expToastMsg}>{toast}</div>}
    </div>
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
        <g key={i} className={styles.pulseNodeDot} style={{ animationDelay: `${(i * 0.12) % 2.4}s` }}>
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
      <path className={styles.scanningPalmLine} d="M 25 48 Q 115 18 225 54 T 240 70" stroke="url(#goldLineGrad)" strokeWidth="2.5" fill="none" opacity="0.65" />
      <path className={styles.scanningPalmLine} d="M 35 53 Q 125 26 215 58 T 275 82" stroke="#FFE885" strokeWidth="1.2" fill="none" opacity="0.45" />

      {/* Head Line Curve */}
      <path className={styles.scanningPalmLine} d="M 18 88 Q 98 62 188 98 T 275 118" stroke="url(#goldLineGrad)" strokeWidth="2.8" fill="none" opacity="0.8" />
      <path className={styles.scanningPalmLine} d="M 28 93 Q 108 70 178 103 T 265 123" stroke="#38BDF8" strokeWidth="1.4" fill="none" opacity="0.55" />

      {/* Life Line Arc */}
      <path className={styles.scanningPalmLine} d="M 68 28 Q 158 78 128 152" stroke="url(#goldLineGrad)" strokeWidth="2.4" fill="none" opacity="0.75" />
      <path className={styles.scanningPalmLine} d="M 78 33 Q 163 80 136 150" stroke="#F472B6" strokeWidth="1.2" fill="none" opacity="0.5" />

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
        <ellipse className={styles.flowDataRing} cx="215" cy="85" rx="72" ry="36" stroke="#FDE68A" strokeWidth="1.2" transform="rotate(-15 215 85)" />
        <ellipse className={styles.flowDataRing} cx="215" cy="85" rx="52" ry="25" stroke="#38BDF8" strokeWidth="1.4" transform="rotate(-15 215 85)" />
        <ellipse className={styles.flowDataRing} cx="215" cy="85" rx="32" ry="15" stroke="#818CF8" strokeWidth="1.6" transform="rotate(-15 215 85)" />
        <circle className={styles.radarPingDot} cx="215" cy="85" r="9" fill="#FDE68A" opacity="0.65" />
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
        <path className={styles.pulseSandStream} d="M 22 28 C 22 45 36 54 40 58 C 44 54 58 45 58 28 Z" fill="#FDE68A" opacity="0.75" />
        <line className={styles.sandDropLine} x1="40" y1="58" x2="40" y2="92" stroke="#FFF" strokeWidth="1.6" opacity="0.95" />
        <path className={styles.pulseSandStream} d="M 22 104 Q 40 85 58 104 Z" fill="#FDE68A" opacity="0.85" />

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
          className={styles.flowInfinityPath}
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
  const alembicRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [cardTilts, setCardTilts] = useState({});
  const [activeCard, setActiveCard] = useState(null); // '01' | '02' | '03' | '04' | '05' | null
  const [discoveryStep, setDiscoveryStep] = useState(null); // null | 0 | 1 | 2 | 3 | 4 | 5

  const handleCardMouseMove = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setCardTilts((prev) => ({
      ...prev,
      [index]: { rotateX, rotateY, isHovered: true }
    }));
  };

  const handleCardMouseLeave = (index) => {
    setCardTilts((prev) => ({
      ...prev,
      [index]: { rotateX: 0, rotateY: 0, isHovered: false }
    }));
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCard(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* ── Guided Card-by-Card Discovery Scroll Trigger ── */
  useEffect(() => {
    if (!alembicRef.current || discoveryStep !== null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && discoveryStep === null) {
          setDiscoveryStep(0);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(alembicRef.current);
    return () => observer.disconnect();
  }, [discoveryStep]);



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
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <StatPanelFrame />
                <div className={styles.statPanelBg}>
                  <HandConstellationBg />
                </div>
                <div className={styles.statPanelContent}>
                  <span className={styles.statValueGold}>21</span>
                  <span className={styles.statLabelGold}>HAND LANDMARKS</span>
                </div>
              </div>
              <div className={styles.cardBack}>
                <StatPanelFrame />
                <div className={styles.statBackContent}>
                  <h4 className={styles.statBackTitle}>HAND LANDMARKS</h4>
                  <p className={styles.statBackDesc}>
                    Mapping 21 distinct nodal coordinates across the metacarpals and phalanges for precise tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: 3 PALM LINES DETECTED */}
          <div className={styles.statPanel}>
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <StatPanelFrame />
                <div className={styles.statPanelBg}>
                  <PalmLinesSwirlBg />
                </div>
                <div className={styles.statPanelContent}>
                  <span className={styles.statValueGold}>3</span>
                  <span className={styles.statLabelGold}>PALM LINES DETECTED</span>
                </div>
              </div>
              <div className={styles.cardBack}>
                <StatPanelFrame />
                <div className={styles.statBackContent}>
                  <h4 className={styles.statBackTitle}>PALM LINES DETECTED</h4>
                  <p className={styles.statBackDesc}>
                    Adaptive Canny thresholding isolating Life, Head, and Heart crease vectors in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: <2s SCAN TIME */}
          <div className={styles.statPanel}>
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <StatPanelFrame />
                <div className={styles.statPanelBg}>
                  <HourglassVortexBg />
                </div>
                <div className={styles.statPanelContent}>
                  <span className={styles.statValueGold}>&lt;2s</span>
                  <span className={styles.statLabelGold}>SCAN TIME</span>
                </div>
              </div>
              <div className={styles.cardBack}>
                <StatPanelFrame />
                <div className={styles.statBackContent}>
                  <h4 className={styles.statBackTitle}>SCAN TIME</h4>
                  <p className={styles.statBackDesc}>
                    Ultra-fast WebGL plasma processing delivering full Palmistry &amp; Aura readouts in under 2s.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 4: COSMIC POTENTIAL */}
          <div className={styles.statPanel}>
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <StatPanelFrame />
                <div className={styles.statPanelBg}>
                  <CosmicInfinityBg />
                </div>
                <div className={styles.statPanelContent}>
                  <span className={styles.statLabelGoldSolo}>COSMIC POTENTIAL</span>
                </div>
              </div>
              <div className={styles.cardBack}>
                <StatPanelFrame />
                <div className={styles.statBackContent}>
                  <h4 className={styles.statBackTitle}>COSMIC POTENTIAL</h4>
                  <p className={styles.statBackDesc}>
                    Gemini AI Engine synthesizing palm geometry into deep, personalized cosmic destiny insights.
                  </p>
                </div>
              </div>
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
          {FEATURES.map((f, index) => {
            const tilt = cardTilts[index] || { rotateX: 0, rotateY: 0, isHovered: false };
            const transformStyle = tilt.isHovered
              ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';

            return (
              <div key={f.title} className={styles.cardContainer}>
                <div
                  className={`glass-card ${styles.featureCard} ${f.isHighlighted ? styles.highlightedCard : ''}`}
                  onMouseMove={(e) => handleCardMouseMove(index, e)}
                  onMouseLeave={() => handleCardMouseLeave(index)}
                  style={{ transform: transformStyle }}
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
            );
          })}
        </div>
      </section>

      {/* ── Alchemical Alembic 5-Step Process Diagram ── */}
      <section ref={alembicRef} className={styles.alembicSection}>

        {/* ── Soft Photographic Aurora Glow Layer ── */}
        <div className={styles.auroraContainer}>
          <div className={`${styles.auroraGlow} ${styles.auroraGlowTealLeft}`} />
          <div className={`${styles.auroraGlow} ${styles.auroraGlowEmeraldMid}`} />
          <div className={`${styles.auroraGlow} ${styles.auroraGlowPurpleRight}`} />
          <div className={`${styles.auroraGlow} ${styles.auroraGlowVioletMid}`} />
        </div>

        <div className={styles.alembicCanvas}>

          {/* Ornate Gold Filigree Canvas Frame SVG Overlay */}
          <GrandFiligreeCanvasFrame />

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

          {/* 5 Alchemical Alembic Panels — In-Place Anchored Card Expansion */}
          <div className={styles.alembicGrid}>
            {[
              {
                step: '01',
                title: 'THE INITIATING IRIS',
                subtext: 'Webcam Capture | Browser getUserMedia API captures your palm frame',
                icon: <AlembicIrisIcon />,
                offsetClass: styles.alembicCardStep1,
                activeClass: styles.activeCard01,
                hintText: '✦ DAILY PULSE',
                renderExp: (onClose) => <DailyPalmPulseExp onClose={onClose} />,
              },
              {
                step: '02',
                title: 'THE CELESTIAL PATTERN',
                subtext: 'MediaPipe Topology | 21 hand landmarks extracted and normalized',
                icon: <AlembicTopologyIcon />,
                offsetClass: styles.alembicCardStep2,
                activeClass: styles.activeCard02,
                hintText: '✦ PALM TWIN',
                renderExp: (onClose) => <PalmTwinExp onClose={onClose} />,
              },
              {
                step: '03',
                title: 'THE SACRED GEOMETRY',
                subtext: 'ROI Extraction | Palm triangle isolated using landmarks 0, 5 & 17',
                icon: <AlembicRoiIcon />,
                offsetClass: styles.alembicCardStep3,
                activeClass: styles.activeCard03,
                hintText: '✦ HIDDEN PATTERNS',
                renderExp: (onClose) => <HiddenPatternsExp onClose={onClose} />,
              },
              {
                step: '04',
                title: 'THE LINES OF DESTINY',
                subtext: 'Canny Edge Detection | Adaptive thresholding reveals dominant creases',
                icon: <AlembicCannyIcon />,
                offsetClass: styles.alembicCardStep4,
                activeClass: styles.activeCard04,
                hintText: '✦ PALM EVOLUTION',
                renderExp: (onClose) => <PalmEvolutionExp onClose={onClose} />,
              },
              {
                step: '05',
                title: 'THE COSMIC ORACLE',
                subtext: 'Gemini AI Reading | Line features prompt a personalised cosmic narrative',
                icon: <AlembicOracleIcon />,
                offsetClass: styles.alembicCardStep5,
                activeClass: styles.activeCard05,
                hintText: '✦ ASK ORACLE',
                renderExp: (onClose) => <CosmicOracleExp onClose={onClose} />,
              },
            ].map((p, index) => {
              const isActive = activeCard === p.step;
              const isDimmed = activeCard !== null && !isActive;
              const isDiscoveryActive = discoveryStep === index && activeCard === null;
              const stepClass = styles[`discoveryStep${index}`] || '';

              return (
                <div
                  key={p.step}
                  className={`${styles.alembicCardWrap} ${p.offsetClass} ${stepClass} ${isActive ? styles.cardWrapActive : ''} ${isDimmed ? styles.cardWrapDimmed : ''}`}
                >
                  {/* Soft Atmospheric Colored Cosmic Aura BEHIND Card */}
                  <div
                    className={`${styles.discoveryAura} ${isDiscoveryActive ? styles.discoveryAuraActive : ''}`}
                    aria-hidden="true"
                  />

                  {/* Floating "CLICK ME" / "TAP ME" Indicator over Card 01 only */}
                  {discoveryStep === 0 && index === 0 && !isActive && (
                    <div className={styles.cardDiscoveryClickMe} role="status" aria-label="Click me to explore">
                      <span className={styles.clickMeTextDesktop}>CLICK ME</span>
                      <span className={styles.clickMeTextMobile}>TAP ME</span>
                      <div className={styles.clickMeArrowDown} aria-hidden="true" />
                    </div>
                  )}


                  {isActive ? (
                    /* In-Place Expanded Interactive Card */
                    <div
                      className={`${styles.alembicActiveCardPanel} ${p.activeClass}`}
                      role="region"
                      aria-label={`${p.title} active experience`}
                    >
                      {/* Numbered Sigil Circle (Attached on outer left edge of active card) */}
                      <div className={styles.alembicSigilCircle}>
                        <span>{p.step}</span>
                      </div>

                      {p.renderExp(() => setActiveCard(null))}
                    </div>
                  ) : (
                    /* Default Glass Alembic Panel Body */
                    <div
                      className={`${styles.alembicGlassPanel} ${isDiscoveryActive ? styles.discoveryCardActive : ''}`}
                      onClick={() => {
                        setActiveCard(p.step);
                        if (discoveryStep !== null && discoveryStep === index) {
                          setDiscoveryStep(index + 1);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveCard(p.step);
                          if (discoveryStep !== null && discoveryStep === index) {
                            setDiscoveryStep(index + 1);
                          }
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${p.title} interactive experience`}
                    >
                      {/* Numbered Sigil Circle (Attached on outer left edge of default card) */}
                      <div className={styles.alembicSigilCircle}>
                        <span>{p.step}</span>
                      </div>

                      <AlembicCardFrame />

                      {/* Top-Right Icon */}
                      <div className={styles.alembicCardIconWrap}>{p.icon}</div>

                      {/* Panel Content */}
                      <div className={styles.alembicCardContent}>
                        <h3 className={styles.alembicCardTitle}>{p.title}</h3>
                        <div className={styles.alembicDividerBar} />
                        <p className={styles.alembicCardSubtext}>{p.subtext}</p>
                        <div className={styles.cardActionHint}>
                          <span>{p.hintText}</span>
                          <span className={styles.cardActionHintArrow}>→</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* ── Final CTA — Cosmic Gateway Portal ── */}
      <section className={styles.finalCta} aria-label="Begin your cosmic journey">
        <div className={styles.finalCtaContainer}>

          {/* ── Left Side: Text header + CTA Button ── */}
          <div className={styles.gateTextBlock}>
            <p className={styles.gateEyebrow}>✦ YOUR COSMIC JOURNEY AWAITS ✦</p>
            <h2 className={styles.gateHeading}>
              Ready to Read<br />Your Destiny?
            </h2>
            <p className={styles.gateSubtitle}>Open your palm. Let the cosmos speak.</p>

            {/* ── BEGIN PALM SCAN CTA Button ── */}
            <button
              id="final-scan-btn"
              className={styles.gateBtn}
              onClick={() => onNavigate('scanner')}
              aria-label="Begin Palm Scan — enter the cosmic portal"
            >
              <span className={styles.gateBtnShine} aria-hidden="true" />
              <span className={styles.gateBtnText}>✦ BEGIN PALM SCAN →</span>
            </button>
          </div>

          {/* ── Right Side: THE PORTAL — Cosmic Palm Gateway ── */}
          <div className={styles.gateScene}>
            <div className={styles.portalWrap}>
              <img
                src="/Portal4.png"
                alt="Cosmic Palm Portal"
                className={styles.cosmicPortalImg}
              />
            </div>
          </div>

        </div>{/* end finalCtaContainer */}
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