import { forwardRef } from 'react';

/**
 * ShareCard v5
 * html2canvas 1.4.1 rules:
 *  ✅ SVG arc — strokeDasharray, NO CSS filter on SVG elements
 *  ✅ boxShadow on divs (for glow)
 *  ✅ CSS transform:rotate() on divs (constellation lines)
 *  ✅ linear-gradient / radial-gradient
 *  ❌ NO CSS `filter` anywhere
 *  ❌ NO conic-gradient
 */
const ShareCard = forwardRef(function ShareCard({ result }, ref) {
  const {
    aura_score   = 0,
    aura_color   = '#7b2fff',
    archetype_name = '',
    aura_hex_name  = '',
    title        = '',
    reading      = '',
    lucky_element = '',
    life, head, heart,
  } = result;

  const palmLines = [
    { label: 'Life Line',  pct: Math.round((life?.score  ?? 0) * 100), from: '#e8c030', to: '#f5d84a' },
    { label: 'Head Line',  pct: Math.round((head?.score  ?? 0) * 100), from: '#7b2fff', to: '#b87fff' },
    { label: 'Heart Line', pct: Math.round((heart?.score ?? 0) * 100), from: '#d93040', to: '#f06070' },
  ];

  /* SVG ring */
  const R    = 56;
  const CX   = 70;
  const CY   = 70;
  const circ = 2 * Math.PI * R;
  const pct  = Math.min(Math.max(aura_score, 0), 100);
  const dash = (pct / 100) * circ;
  const gap  = circ - dash;

  /* ────────────────────────────────────────
     Constellation helpers (pure CSS divs)
     No CSS filter — glow via double-layered circles
  ──────────────────────────────────────── */
  const Star = ({ x, y, r = 2.5, op = 0.65, glowR = 6, glowOp = 0.18 }) => (
    <>
      {/* Glow halo */}
      <div style={{
        position: 'absolute', zIndex: 0,
        left: x - glowR, top: y - glowR,
        width: glowR * 2, height: glowR * 2,
        borderRadius: '50%',
        background: 'rgba(200,210,255,0.25)',
        opacity: glowOp,
        pointerEvents: 'none',
      }} />
      {/* Core */}
      <div style={{
        position: 'absolute', zIndex: 0,
        left: x - r, top: y - r,
        width: r * 2, height: r * 2,
        borderRadius: '50%',
        background: 'white',
        opacity: op,
        pointerEvents: 'none',
      }} />
    </>
  );

  const Line = ({ x1, y1, x2, y2, op = 0.22 }) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len   = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return (
      <div style={{
        position: 'absolute', zIndex: 0,
        left: x1, top: y1,
        width: len, height: 1.5,
        background: `rgba(180,190,255,${op})`,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        pointerEvents: 'none',
      }} />
    );
  };

  /* ── Orion (large, centred, spans full card height) ──
     Card: 540 × 780. Safe column: x 100–440.
     Content z-index:1 sits above (z:0) so overlap is fine.
  */
  // Named star positions [x, y]
  const OR = {
    meissa:     [270, 268],   // head
    betelgeuse: [150, 372],   // left shoulder
    bellatrix:  [388, 358],   // right shoulder
    alnitak:    [195, 478],   // left belt
    alnilam:    [270, 492],   // centre belt
    mintaka:    [348, 476],   // right belt
    saiph:      [185, 625],   // left foot
    rigel:      [385, 610],   // right foot
  };

  /* ── Cassiopeia (top-right W, big & bright) ── */
  const CA = [
    [330, 55], [364, 28], [398, 52], [432, 24], [468, 50],
  ];

  /* ── Small Pleiades cluster (top-left, above logo zone is x<100) —
     place at upper-left quadrant away from logo row
  */
  const PL = [
    [52, 148], [68, 132], [82, 155], [65, 168], [90, 140],
    [40, 165], [75, 178],
  ];

  return (
    <div
      ref={ref}
      style={{
        width: '540px',
        height: '780px',
        background: 'linear-gradient(158deg, #060011 0%, #0c0022 48%, #060011 100%)',
        borderRadius: '24px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: '#f0e8d0',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Nebula blobs ── */}
      <div style={{
        position: 'absolute', zIndex: 0,
        top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '560px', height: '560px', borderRadius: '50%',
        background: `radial-gradient(circle, ${aura_color}24 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', zIndex: 0,
        bottom: '-80px', right: '-60px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,40,240,0.18) 0%, transparent 64%)',
        pointerEvents: 'none',
      }} />

      {/* ── Orion ── */}
      {/* Lines */}
      <Line x1={OR.meissa[0]}     y1={OR.meissa[1]}     x2={OR.betelgeuse[0]} y2={OR.betelgeuse[1]} op={0.30} />
      <Line x1={OR.meissa[0]}     y1={OR.meissa[1]}     x2={OR.bellatrix[0]}  y2={OR.bellatrix[1]}  op={0.30} />
      <Line x1={OR.betelgeuse[0]} y1={OR.betelgeuse[1]} x2={OR.alnitak[0]}    y2={OR.alnitak[1]}    op={0.28} />
      <Line x1={OR.bellatrix[0]}  y1={OR.bellatrix[1]}  x2={OR.mintaka[0]}    y2={OR.mintaka[1]}    op={0.28} />
      <Line x1={OR.alnitak[0]}    y1={OR.alnitak[1]}    x2={OR.alnilam[0]}    y2={OR.alnilam[1]}    op={0.32} />
      <Line x1={OR.alnilam[0]}    y1={OR.alnilam[1]}    x2={OR.mintaka[0]}    y2={OR.mintaka[1]}    op={0.32} />
      <Line x1={OR.alnitak[0]}    y1={OR.alnitak[1]}    x2={OR.saiph[0]}      y2={OR.saiph[1]}      op={0.26} />
      <Line x1={OR.mintaka[0]}    y1={OR.mintaka[1]}    x2={OR.rigel[0]}      y2={OR.rigel[1]}      op={0.26} />
      {/* Stars */}
      <Star x={OR.meissa[0]}     y={OR.meissa[1]}     r={3} op={0.75} glowR={9}  glowOp={0.22} />
      <Star x={OR.betelgeuse[0]} y={OR.betelgeuse[1]} r={4} op={0.85} glowR={12} glowOp={0.26} />
      <Star x={OR.bellatrix[0]}  y={OR.bellatrix[1]}  r={3} op={0.75} glowR={9}  glowOp={0.22} />
      <Star x={OR.alnitak[0]}    y={OR.alnitak[1]}    r={3} op={0.80} glowR={9}  glowOp={0.22} />
      <Star x={OR.alnilam[0]}    y={OR.alnilam[1]}    r={3} op={0.80} glowR={9}  glowOp={0.22} />
      <Star x={OR.mintaka[0]}    y={OR.mintaka[1]}    r={3} op={0.80} glowR={9}  glowOp={0.22} />
      <Star x={OR.saiph[0]}      y={OR.saiph[1]}      r={3} op={0.75} glowR={9}  glowOp={0.20} />
      <Star x={OR.rigel[0]}      y={OR.rigel[1]}      r={4} op={0.85} glowR={12} glowOp={0.26} />

      {/* ── Cassiopeia ── */}
      {CA.map(([x,y],i,a) => i < a.length-1
        ? <Line key={`cl${i}`} x1={x} y1={y} x2={a[i+1][0]} y2={a[i+1][1]} op={0.30} />
        : null
      )}
      {CA.map(([x,y],i) => (
        <Star key={`cs${i}`} x={x} y={y} r={i===2?3.5:2.5} op={i===2?0.85:0.70} glowR={i===2?10:8} glowOp={0.22} />
      ))}

      {/* ── Pleiades cluster ── */}
      {PL.map(([x,y],i) => (
        <Star key={`pl${i}`} x={x} y={y} r={i===0||i===2?2:1.5} op={0.55} glowR={5} glowOp={0.14} />
      ))}

      {/* ── Scattered field stars ── */}
      {[
        [500,105],[518,280],[524,430],[510,560],[30,310],
        [25,420],[28,530],[290,760],[415,762],[135,728],
      ].map(([x,y],i) => (
        <Star key={`f${i}`} x={x} y={y} r={1.2} op={0.28} glowR={3} glowOp={0.08} />
      ))}

      {/* ── Content layer ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '38px 44px 36px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '20px' }}>
          <div style={{
            width: 12, height: 12,
            background: '#c9a227',
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'Georgia, serif', fontSize: '0.95rem', fontWeight: 700,
            letterSpacing: '0.14em', color: '#c9a227', textTransform: 'uppercase',
          }}>AstroLens</span>
        </div>

        {/* Aura ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            boxShadow: `0 0 36px ${aura_color}44, 0 0 12px ${aura_color}28`,
            marginBottom: 12,
            flexShrink: 0,
          }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              {/* Track */}
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
              {/* Arc — NO CSS filter */}
              <circle
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={aura_color}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(-90 ${CX} ${CY})`}
              />
              {/* Score */}
              <text x={CX} y={CY - 9} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily:'Georgia,serif', fontSize:'28px', fontWeight:700, fill:'#f0e8d0' }}>
                {aura_score}
              </text>
              <text x={CX} y={CY + 14} textAnchor="middle"
                style={{ fontFamily:'Arial,sans-serif', fontSize:'7.5px', letterSpacing:'2.5px', fill:'#7a6e8a' }}>
                AURA SCORE
              </text>
            </svg>
          </div>

          <span style={{
            fontFamily: 'Arial, sans-serif', fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: aura_color,
          }}>
            {aura_hex_name} Aura
          </span>
          <span style={{
            fontFamily: 'Georgia, serif', fontSize: '1.18rem', fontWeight: 700,
            color: '#f0e8d0', marginTop: 4,
          }}>
            {archetype_name}
          </span>
        </div>

        {/* Divider */}
        <div style={{
          height: 1, marginBottom: 14,
          background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.55), transparent)',
        }} />

        {/* Title */}
        <div style={{
          fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 700,
          lineHeight: 1.38, textAlign: 'center', color: '#f0e8d0', marginBottom: 9,
        }}>
          {title}
        </div>

        {/* Reading snippet */}
        <div style={{
          fontFamily: 'Arial, sans-serif', fontSize: '0.79rem', color: '#9e8e8a',
          lineHeight: 1.78, textAlign: 'center', marginBottom: 14,
        }}>
          {reading.split('. ')[0]}.
        </div>

        {/* Orion's Belt separator */}
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:14, alignItems:'center' }}>
          {[0.28, 0.50, 0.28].map((op,i) => (
            <div key={i} style={{
              width: i===1?5:4, height: i===1?5:4, borderRadius:'50%',
              background: `rgba(201,162,39,${op})`,
            }} />
          ))}
        </div>

        {/* Palm line bars */}
        <div style={{ display:'flex', flexDirection:'column', gap:13, marginBottom:16 }}>
          {palmLines.map(l => (
            <div key={l.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontFamily:'Arial,sans-serif', fontSize:'0.77rem', fontWeight:600, color:'#c0b0a0' }}>
                  {l.label}
                </span>
                <span style={{ fontFamily:'Arial,sans-serif', fontSize:'0.77rem', fontWeight:700, color: l.to }}>
                  {l.pct}%
                </span>
              </div>
              {/* Track */}
              <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
                {/* Fill — starts bright, not dark */}
                <div style={{
                  width:`${l.pct}%`, height:'100%', borderRadius:99,
                  background: `linear-gradient(90deg, ${l.from}, ${l.to})`,
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex:1 }} />

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{
            padding:'5px 15px', borderRadius:99,
            background:'rgba(201,162,39,0.11)',
            border:'1px solid rgba(201,162,39,0.30)',
            fontFamily:'Arial,sans-serif', fontSize:'0.72rem',
            color:'#c9a227', fontWeight:600, letterSpacing:'0.09em',
          }}>
            {lucky_element} Element
          </div>
          <span style={{ fontFamily:'Arial,sans-serif', fontSize:'0.67rem', color:'#3e3450', letterSpacing:'0.06em' }}>
            astrolens.app
          </span>
        </div>
      </div>

      {/* Bottom aura tint */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:110,
        background:`linear-gradient(to top, ${aura_color}12, transparent)`,
        pointerEvents:'none', zIndex:0,
      }} />
    </div>
  );
});

export default ShareCard;
