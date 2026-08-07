import { forwardRef } from 'react';

/**
 * ShareCard — Custom Background Image Edition (Aligned)
 *  - Background PNGs already contain: ◆ ASTROLENS (top-left), Score Ring graphic (top-center),Artwork (center), Constellations (corners/sides), Element Slot & astrolens.app (bottom).
 *  - Code layout is pixel-aligned to match the PNG artwork background slots.
 */

const ShareCard = forwardRef(function ShareCard({ result }, ref) {
  const {
    aura_score = 0,
    aura_color = '#7b2fff',
    archetype_name = '',
    aura_hex_name = '',
    title = '',
    reading = '',
    lucky_element = '',
    life, head, heart,
  } = result;

  const palmLines = [
    { label: 'Life Line', pct: Math.round((life?.score ?? 0) * 100), from: '#e8c030', to: '#ffe57f' },
    { label: 'Head Line', pct: Math.round((head?.score ?? 0) * 100), from: '#9b51e0', to: '#d080ff' },
    { label: 'Heart Line', pct: Math.round((heart?.score ?? 0) * 100), from: '#eb5757', to: '#ff8a8a' },
  ];

  /* Determine background image path based on score >= 95 or archetype */
  let bgImageName = 'bg-indigo.png';
  if (aura_score >= 95) {
    bgImageName = 'bg-supreme.png';
  } else if (archetype_name === 'Crimson Trailblazer' || archetype_name === 'Rose Harmoniser') {
    bgImageName = 'bg-crimson.png';
  } else if (archetype_name === 'Gold Luminary' || archetype_name === 'Teal Empath') {
    bgImageName = 'bg-gold.png';
  } else if (archetype_name === 'Indigo Visionary' || archetype_name === 'Violet Mystic') {
    bgImageName = 'bg-indigo.png';
  }

  return (
    <div
      ref={ref}
      style={{
        width: '540px',
        height: '780px',
        background: '#070010',
        borderRadius: '24px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: '#f0e8d0',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Background PNG Image (Contains native logo, ring, artwork, constellations, footer) ── */}
      <img
        src={`/${bgImageName}`}
        alt=""
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Main Content Layer ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '0px 40px 28px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Aura Score Number & Label (Centered dead-center inside the PNG's ring graphic) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            marginTop: '92px',
            width: 120, height: 75, flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 700, color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.9)',
              lineHeight: 2,
            }}>
              {aura_score}
            </span>
            <span style={{
              fontFamily: 'Arial, sans-serif', fontSize: '7.5px', letterSpacing: '2.5px', color: '#e0d0f0',
              textTransform: 'uppercase', marginTop: 3,
              textShadow: '0 1px 4px rgba(0,0,0,0.95)',
            }}>
              AURA SCORE
            </span>
          </div>

          {/* Aura name + Archetype (Positioned cleanly below the PNG's ring graphic) */}
          <span style={{
            fontFamily: 'Arial, sans-serif', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: aura_color,
            textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)',
            marginTop: '57px',
          }}>
            {aura_hex_name} Aura
          </span>
          <span style={{
            fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 700,
            color: '#ffffff', marginTop: 4, marginBottom: '20px',
            textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.9)',
          }}>
            {archetype_name}
          </span>
        </div>

        {/* ── Glass Card 1: Title & Reading Snippet ── */}
        <div style={{
          background: 'rgba(8, 3, 20, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginTop: '30px',
          marginBottom: '14px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
        }}>
          {/* Wrapper div wraps around both text elements */}
          <div style={{ transform: 'translateY(-10px)' }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.18rem',
              fontWeight: 700,
              lineHeight: 1.35,
              textAlign: 'center',
              color: '#ffffff',
              marginBottom: 8,
              textShadow: '0 2px 6px rgba(0,0,0,0.9)',
            }}>
              {title}
            </div>
            <div style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.81rem',
              color: '#f0e6ff',
              lineHeight: 1.68,
              textAlign: 'center',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            }}>
              {reading.split('. ')[0]}.
            </div>
          </div>
        </div>

        {/* ── Glass Card 2: Palm Line Bars ── */}
        <div style={{
          background: 'rgba(8, 3, 20, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '14px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {palmLines.map(l => (
            <div key={l.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{
                  fontFamily: 'Arial, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff',
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                }}>
                  {l.label}
                </span>
                <span style={{
                  fontFamily: 'Arial, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#ffd700',
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                }}>
                  {l.pct}%
                </span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${l.pct}%`, height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${l.from}, ${l.to})`,
                  boxShadow: `0 0 8px ${l.from}aa`,
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* ── Footer: 3D Metallic Element Pill Badge ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 16px',
            borderRadius: '99px',
            background: 'linear-gradient(180deg, #d6e2ee 0%, #90a3b8 48%, #5b6c7e 100%)',
            border: '1.5px solid #c9b47e',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.7)',
          }}>
            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>
              {lucky_element === 'Water' ? '💧' : lucky_element === 'Fire' ? '🔥' : lucky_element === 'Air' ? '💨' : lucky_element === 'Earth' ? '🌿' : '✦'}
            </span>
            <span style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#1c252e',
              textShadow: '0 1px 0 rgba(255,255,255,0.4)',
              letterSpacing: '0.02em',
            }}>
              {lucky_element} Element
            </span>
          </div>
          <span style={{
            fontFamily: 'Arial, sans-serif', fontSize: '0.7rem', color: '#c0b0d0', letterSpacing: '0.06em',
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          }}>
            astrolens.app
          </span>
        </div>

      </div>
    </div>
  );
});

export default ShareCard;
