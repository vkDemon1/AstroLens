import { forwardRef } from 'react';

/**
 * ShareCard — off-screen element captured by html2canvas.
 * Designed to look great as a standalone 1080×1920 Instagram story card.
 */
const ShareCard = forwardRef(function ShareCard({ result }, ref) {
  const { aura_score, aura_color, archetype_name, aura_hex_name,
          title, reading, lucky_element, life, head, heart } = result;

  const lines = [
    { label: 'Life Line',  value: Math.round(life.score  * 100) },
    { label: 'Head Line',  value: Math.round(head.score  * 100) },
    { label: 'Heart Line', value: Math.round(heart.score * 100) },
  ];

  return (
    <div
      ref={ref}
      style={{
        width: '540px',
        minHeight: '720px',
        background: 'linear-gradient(145deg, #06000f 0%, #0d0020 50%, #06000f 100%)',
        borderRadius: '20px',
        padding: '48px 40px',
        fontFamily: "'Inter', sans-serif",
        color: '#f0e8d0',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${aura_color}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <span style={{ fontSize: '1.4rem' }}>✦</span>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.1rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#c9a227',
        }}>
          AstroLens
        </span>
      </div>

      {/* Aura score circle */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `4px solid ${aura_color}`,
          boxShadow: `0 0 30px ${aura_color}55`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>
            {aura_score}
          </span>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: '#b8a899', marginTop: '2px' }}>
            AURA SCORE
          </span>
        </div>
        <div style={{ color: aura_color, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {aura_hex_name} Aura
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>
          {archetype_name}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(201,162,39,0.2)', margin: '0 0 24px' }} />

      {/* Title */}
      <h2 style={{
        fontFamily: 'Georgia, serif',
        fontSize: '1.25rem',
        fontWeight: 700,
        lineHeight: 1.3,
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        {title}
      </h2>

      {/* Reading (first sentence only for the card) */}
      <p style={{
        fontSize: '0.85rem',
        color: '#b8a899',
        lineHeight: 1.7,
        marginBottom: '28px',
        textAlign: 'center',
      }}>
        {reading.split('. ')[0]}.
      </p>

      {/* Line bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {lines.map(l => (
          <div key={l.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b8a899' }}>{l.label}</span>
              <span style={{ fontSize: '0.75rem', color: '#c9a227', fontWeight: 700 }}>{l.value}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                width: `${l.value}%`,
                height: '100%',
                background: l.value > 60
                  ? `linear-gradient(90deg, #c9a227, #e8c84a)`
                  : `linear-gradient(90deg, #7b2fff, #a366ff)`,
                borderRadius: '99px',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          padding: '4px 12px',
          borderRadius: '99px',
          background: 'rgba(201,162,39,0.15)',
          border: '1px solid rgba(201,162,39,0.3)',
          fontSize: '0.72rem',
          color: '#c9a227',
          fontWeight: 600,
          letterSpacing: '0.08em',
        }}>
          ✦ {lucky_element} Element
        </div>
        <div style={{ fontSize: '0.7rem', color: '#6b5f75' }}>
          astrolens.app
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
