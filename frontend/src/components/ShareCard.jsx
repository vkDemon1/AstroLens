import { forwardRef } from 'react';

/**
 * ShareCard — off-screen element captured by html2canvas.
 * Inline styles only; no CSS vars (html2canvas doesn't resolve them).
 * Card: 540 × 760px (portrait).
 */
const ShareCard = forwardRef(function ShareCard({ result }, ref) {
  const {
    aura_score, aura_color, archetype_name, aura_hex_name,
    title, reading, lucky_element, life, head, heart,
  } = result;

  const lines = [
    { label: 'Life Line',  pct: Math.round((life?.score  ?? 0) * 100), color: '#e8c84a' },
    { label: 'Head Line',  pct: Math.round((head?.score  ?? 0) * 100), color: '#a366ff' },
    { label: 'Heart Line', pct: Math.round((heart?.score ?? 0) * 100), color: '#e63946' },
  ];

  /* SVG arc helpers */
  const R   = 52;
  const CX  = 60;
  const CY  = 60;
  const circumference = 2 * Math.PI * R;
  const pct    = Math.min(aura_score, 100) / 100;
  const filled = pct * circumference;
  const gap    = circumference - filled;

  /* Star positions (deterministic pseudo-random) */
  const stars = Array.from({ length: 28 }, (_, i) => ({
    x: ((i * 137 + 43) % 480) + 30,
    y: ((i * 97  + 17) % 680) + 40,
    r: i % 3 === 0 ? 1.5 : 1,
    o: 0.2 + (i % 5) * 0.1,
  }));

  return (
    <div
      ref={ref}
      style={{
        width: '540px',
        height: '760px',
        background: 'linear-gradient(160deg, #06000f 0%, #0e0025 45%, #06000f 100%)',
        borderRadius: '24px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: '#f0e8d0',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Background nebula blobs ── */}
      <div style={{
        position: 'absolute', top: '-80px', left: '50%',
        transform: 'translateX(-50%)',
        width: '480px', height: '480px', borderRadius: '50%',
        background: `radial-gradient(circle, ${aura_color}22 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-40px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,47,255,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Star field ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.o} />
        ))}
      </svg>

      {/* ── Inner content ── */}
      <div style={{ padding: '40px 44px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <span style={{ fontSize: '1.3rem', color: '#c9a227' }}>✦</span>
          <span style={{
            fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: 700,
            letterSpacing: '0.12em', color: '#c9a227', textTransform: 'uppercase',
          }}>
            AstroLens
          </span>
        </div>

        {/* Aura score — SVG arc gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Glow filter definition */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Track ring */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            {/* Filled arc (rotated so it starts at top) */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={aura_color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${gap}`}
              transform={`rotate(-90 ${CX} ${CY})`}
              style={{ filter: `drop-shadow(0 0 6px ${aura_color})` }}
            />
            {/* Score text */}
            <text x={CX} y={CY - 6} textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, fill: '#f0e8d0' }}>
              {aura_score}
            </text>
            <text x={CX} y={CY + 14} textAnchor="middle"
              style={{ fontFamily: 'Arial, sans-serif', fontSize: '8px', letterSpacing: '2px', fill: '#9e8f9f', textTransform: 'uppercase' }}>
              AURA
            </text>
          </svg>

          {/* Aura name + archetype */}
          <div style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: aura_color, marginTop: '8px',
          }}>
            {aura_hex_name} Aura
          </div>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 700,
            marginTop: '4px', color: '#f0e8d0',
          }}>
            {archetype_name}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px', marginBottom: '20px',
          background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)',
        }} />

        {/* Title */}
        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 700,
          lineHeight: 1.35, marginBottom: '12px', textAlign: 'center', color: '#f0e8d0',
          margin: '0 0 12px',
        }}>
          {title}
        </h2>

        {/* Reading snippet */}
        <p style={{
          fontFamily: "'Arial', sans-serif", fontSize: '0.82rem', color: '#b8a899',
          lineHeight: 1.75, marginBottom: '24px', textAlign: 'center', margin: '0 0 22px',
        }}>
          {reading.split('. ')[0]}.
        </p>

        {/* Palm line bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {lines.map(l => (
            <div key={l.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#c9b8a8' }}>
                  {l.label}
                </span>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: l.color }}>
                  {l.pct}%
                </span>
              </div>
              {/* Track */}
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                {/* Fill */}
                <div style={{
                  width: `${l.pct}%`, height: '100%', borderRadius: '99px',
                  background: `linear-gradient(90deg, ${l.color}99, ${l.color})`,
                  boxShadow: `0 0 8px ${l.color}66`,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{
            padding: '5px 14px', borderRadius: '99px',
            background: 'rgba(201,162,39,0.12)',
            border: '1px solid rgba(201,162,39,0.35)',
            fontFamily: 'Arial, sans-serif', fontSize: '0.72rem',
            color: '#c9a227', fontWeight: 600, letterSpacing: '0.08em',
          }}>
            ✦ {lucky_element} Element
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '0.68rem', color: '#5c5066', letterSpacing: '0.04em' }}>
            astrolens.app
          </div>
        </div>

      </div>{/* end inner */}

      {/* Bottom edge shimmer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to top, rgba(201,162,39,0.06), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
});

export default ShareCard;
