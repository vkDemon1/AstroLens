import { forwardRef } from 'react';

/**
 * ShareCard v6 — per-archetype themed cards
 * html2canvas 1.4.1 rules:
 *  ✅ SVG arcs (no CSS filter)
 *  ✅ boxShadow on divs
 *  ✅ CSS transform:rotate() on divs
 *  ✅ linear/radial gradients
 *  ❌ NO CSS `filter`, NO SVG filter, NO conic-gradient
 */

/* ── Per-archetype themes ─────────────────────────────── */
const THEMES = {
  'Crimson Trailblazer': {
    bg:   'linear-gradient(158deg, #0b0007 0%, #160010 45%, #0b0007 100%)',
    glow: '#c41a30',
    ornamentType: 'wings',
  },
  'Gold Luminary': {
    bg:   'linear-gradient(158deg, #080600 0%, #130c00 45%, #080600 100%)',
    glow: '#b89000',
    ornamentType: 'crown',
  },
  'Indigo Visionary': {
    bg:   'linear-gradient(158deg, #060011 0%, #0c0022 45%, #060011 100%)',
    glow: '#5a20e0',
    ornamentType: 'eye',
  },
};
const getTheme = (name) => THEMES[name] || {
  bg:   'linear-gradient(158deg, #07000e 0%, #0e001e 45%, #07000e 100%)',
  glow: '#5a20cc',
  ornamentType: 'star',
};

/* ── Constellation data per archetype ────────────────── */
const CONSTELLATIONS = {
  'Crimson Trailblazer': {
    // Two tall vertical chains flanking the card — like twin swords / Gemini pillars
    groups: [
      {
        stars: [[65,95],[42,195],[72,298],[48,400],[78,502],[52,605],[75,705]],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
      },
      {
        stars: [[475,95],[498,195],[468,298],[492,400],[462,502],[488,605],[465,705]],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
      },
      // Small top connector
      {
        stars: [[105,52],[148,28],[185,52]],
        lines: [[0,1],[1,2]],
      },
    ],
  },
  'Gold Luminary': {
    // Crown zigzag at top + diamond clusters at bottom corners
    groups: [
      {
        stars: [[82,80],[145,36],[208,65],[268,25],[330,56],[392,25],[448,56],[505,32]],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
      },
      {
        stars: [[55,498],[100,450],[148,498],[100,548]],
        lines: [[0,1],[1,2],[2,3],[3,0]],
      },
      {
        stars: [[392,510],[440,462],[488,510],[440,558]],
        lines: [[0,1],[1,2],[2,3],[3,0]],
      },
      // Left edge 3-star
      { stars: [[28,318],[48,268],[28,218]], lines: [[0,1],[1,2]] },
    ],
  },
  'Indigo Visionary': {
    // Full Orion centred + Cassiopeia top-right + Pleiades top-left
    groups: [
      {
        // Orion — named stars
        stars: [
          [270,268], // 0 Meissa (head)
          [148,372], // 1 Betelgeuse
          [392,358], // 2 Bellatrix
          [193,478], // 3 Alnitak
          [270,492], // 4 Alnilam
          [348,478], // 5 Mintaka
          [182,625], // 6 Saiph
          [388,612], // 7 Rigel
        ],
        lines: [[0,1],[0,2],[1,3],[2,5],[3,4],[4,5],[3,6],[5,7]],
      },
      {
        // Cassiopeia W
        stars: [[332,52],[368,22],[402,46],[436,18],[470,44]],
        lines: [[0,1],[1,2],[2,3],[3,4]],
      },
      {
        // Pleiades cluster
        stars: [[52,148],[68,132],[82,155],[65,168],[90,140]],
        lines: [[0,2],[2,1],[1,4],[4,3],[3,0]],
      },
    ],
  },
};
const getConstellations = (name) =>
  CONSTELLATIONS[name] || {
    // Default — simple angular bracket pair
    groups: [
      {
        stars: [[330,48],[368,20],[406,44],[444,18],[480,44]],
        lines: [[0,1],[1,2],[2,3],[3,4]],
      },
      {
        stars: [[28,240],[52,190],[28,140]],
        lines: [[0,1],[1,2]],
      },
      {
        stars: [[512,550],[490,510],[512,470]],
        lines: [[0,1],[1,2]],
      },
    ],
  };

/* ── Central ornament per archetype ──────────────────── */
function Ornament({ type, color }) {
  const c = color;
  if (type === 'wings') {
    // Two curved wing arcs
    return (
      <svg width="180" height="48" viewBox="0 0 180 48" style={{ display: 'block', margin: '0 auto' }}>
        <path d="M90 24 C70 8 40 4 18 12 C35 24 60 26 88 24" stroke={c} strokeWidth="1.2" fill="none" opacity="0.45" />
        <path d="M90 24 C110 8 140 4 162 12 C145 24 120 26 92 24" stroke={c} strokeWidth="1.2" fill="none" opacity="0.45" />
        <path d="M90 24 C70 16 48 20 30 30 C48 30 68 28 90 24" stroke={c} strokeWidth="0.8" fill="none" opacity="0.25" />
        <path d="M90 24 C110 16 132 20 150 30 C132 30 112 28 90 24" stroke={c} strokeWidth="0.8" fill="none" opacity="0.25" />
        <circle cx="90" cy="24" r="3" fill={c} opacity="0.7" />
        <circle cx="90" cy="24" r="7" fill="none" stroke={c} strokeWidth="0.8" opacity="0.3" />
      </svg>
    );
  }
  if (type === 'crown') {
    // Sun-burst rays radiating from centre
    const rays = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const r1 = 10, r2 = i % 2 === 0 ? 28 : 20;
      return (
        <line key={i}
          x1={90 + r1 * Math.cos(angle)} y1={24 + r1 * Math.sin(angle)}
          x2={90 + r2 * Math.cos(angle)} y2={24 + r2 * Math.sin(angle)}
          stroke={c} strokeWidth={i % 2 === 0 ? 1.2 : 0.8} opacity={i % 2 === 0 ? 0.55 : 0.35}
        />
      );
    });
    return (
      <svg width="180" height="48" viewBox="0 0 180 48" style={{ display: 'block', margin: '0 auto' }}>
        {rays}
        <circle cx="90" cy="24" r="8" fill="none" stroke={c} strokeWidth="1" opacity="0.45" />
        <circle cx="90" cy="24" r="3" fill={c} opacity="0.75" />
      </svg>
    );
  }
  if (type === 'eye') {
    // Cosmic eye — ellipse + iris rings + pupil
    return (
      <svg width="180" height="48" viewBox="0 0 180 48" style={{ display: 'block', margin: '0 auto' }}>
        <ellipse cx="90" cy="24" rx="44" ry="18" stroke={c} strokeWidth="1" fill="none" opacity="0.4" />
        <ellipse cx="90" cy="24" rx="28" ry="16" stroke={c} strokeWidth="0.8" fill="none" opacity="0.25" />
        <circle cx="90" cy="24" r="9" fill="none" stroke={c} strokeWidth="1" opacity="0.45" />
        <circle cx="90" cy="24" r="4" fill={c} opacity="0.70" />
        <circle cx="90" cy="24" r="10" fill="none" stroke={c} strokeWidth="0.6" opacity="0.20" />
        {/* Lashes */}
        {[-40,-25,-10,10,25,40].map((dx, i) => (
          <line key={i}
            x1={90 + dx} y1={i < 3 ? 6 : 6}
            x2={90 + dx * 1.1} y2={1}
            stroke={c} strokeWidth="0.7" opacity="0.25"
          />
        ))}
      </svg>
    );
  }
  // Default: 6-pointed star outline
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * Math.PI / 180;
    return `${90 + 18 * Math.cos(a)},${24 + 18 * Math.sin(a)}`;
  }).join(' ');
  return (
    <svg width="180" height="48" viewBox="0 0 180 48" style={{ display: 'block', margin: '0 auto' }}>
      <polygon points={pts} fill="none" stroke={c} strokeWidth="1" opacity="0.45" />
      <circle cx="90" cy="24" r="3.5" fill={c} opacity="0.7" />
    </svg>
  );
}

/* ── Glow star (triple-circle, no CSS filter) ────────── */
function GlowStar({ x, y, r = 3, color = '#ffffff', op = 0.80 }) {
  return (
    <>
      <div style={{
        position:'absolute', zIndex:0, pointerEvents:'none',
        left:x - r*5, top:y - r*5, width:r*10, height:r*10,
        borderRadius:'50%', background:color, opacity:0.07,
      }}/>
      <div style={{
        position:'absolute', zIndex:0, pointerEvents:'none',
        left:x - r*2.5, top:y - r*2.5, width:r*5, height:r*5,
        borderRadius:'50%', background:color, opacity:0.16,
      }}/>
      <div style={{
        position:'absolute', zIndex:0, pointerEvents:'none',
        left:x - r, top:y - r, width:r*2, height:r*2,
        borderRadius:'50%', background:'white', opacity:op,
      }}/>
    </>
  );
}

/* ── Constellation line ──────────────────────────────── */
function ConLine({ x1, y1, x2, y2, color, op = 0.30 }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len   = Math.sqrt(dx*dx + dy*dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return (
    <div style={{
      position:'absolute', zIndex:0, pointerEvents:'none',
      left:x1, top:y1, width:len, height:1.5,
      background:color, opacity:op,
      transformOrigin:'0 50%',
      transform:`rotate(${angle}deg)`,
    }}/>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const ShareCard = forwardRef(function ShareCard({ result }, ref) {
  const {
    aura_score    = 0,
    aura_color    = '#7b2fff',
    archetype_name = '',
    aura_hex_name  = '',
    title          = '',
    reading        = '',
    lucky_element  = '',
    life, head, heart,
  } = result;

  const palmLines = [
    { label:'Life Line',  pct: Math.round((life?.score  ?? 0) * 100), from:'#c9a000', to:'#f0d040' },
    { label:'Head Line',  pct: Math.round((head?.score  ?? 0) * 100), from:'#7b2fff', to:'#b87fff' },
    { label:'Heart Line', pct: Math.round((heart?.score ?? 0) * 100), from:'#c0182c', to:'#f05060' },
  ];

  /* SVG ring dimensions */
  const R = 56, CX = 70, CY = 70;
  const circ = 2 * Math.PI * R;
  const pct  = Math.min(Math.max(aura_score, 0), 100);
  const dash = (pct / 100) * circ;
  const gap  = circ - dash;

  /* Theme & constellations */
  const theme = getTheme(archetype_name);
  const constData = getConstellations(archetype_name);
  const starColor = aura_color;
  const lineColor = `rgba(${hexToRgb(aura_color)},0.55)`;

  return (
    <div
      ref={ref}
      style={{
        width: '540px', height: '780px',
        background: theme.bg,
        borderRadius: '24px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: '#f0e8d0',
        position: 'relative', overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Nebula blobs ── */}
      <div style={{
        position:'absolute', zIndex:0,
        top:'-100px', left:'50%', transform:'translateX(-50%)',
        width:'560px', height:'560px', borderRadius:'50%',
        background:`radial-gradient(circle, ${aura_color}28 0%, transparent 65%)`,
        pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute', zIndex:0,
        bottom:'-80px', right:'-60px',
        width:'380px', height:'380px', borderRadius:'50%',
        background:`radial-gradient(circle, ${theme.glow}22 0%, transparent 65%)`,
        pointerEvents:'none',
      }}/>

      {/* ── Constellations ── */}
      {constData.groups.map((group, gi) => (
        group.lines.map(([a, b], li) => (
          <ConLine
            key={`l-${gi}-${li}`}
            x1={group.stars[a][0]} y1={group.stars[a][1]}
            x2={group.stars[b][0]} y2={group.stars[b][1]}
            color={lineColor} op={1}
          />
        ))
      ))}
      {constData.groups.map((group, gi) => (
        group.stars.map(([x, y], si) => (
          <GlowStar
            key={`s-${gi}-${si}`}
            x={x} y={y}
            r={si === 0 && gi === 0 ? 3.5 : 2.5}
            color={starColor}
            op={0.90}
          />
        ))
      ))}

      {/* Scattered dim field stars */}
      {[[200,55],[510,160],[520,330],[515,500],[25,455],[30,560],[280,762],[420,755]].map(([x,y],i)=>(
        <GlowStar key={`f${i}`} x={x} y={y} r={1.2} color="#aaaaff" op={0.30}/>
      ))}

      {/* Bottom aura tint */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:110,
        background:`linear-gradient(to top, ${aura_color}14, transparent)`,
        pointerEvents:'none', zIndex:0,
      }}/>

      {/* ── Content (z:1) ── */}
      <div style={{
        position:'relative', zIndex:1,
        padding:'38px 44px 36px',
        height:'100%', boxSizing:'border-box',
        display:'flex', flexDirection:'column',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'18px' }}>
          <div style={{ width:12, height:12, background:'#c9a227', transform:'rotate(45deg)', flexShrink:0 }}/>
          <span style={{
            fontFamily:'Georgia,serif', fontSize:'0.95rem', fontWeight:700,
            letterSpacing:'0.14em', color:'#c9a227', textTransform:'uppercase',
          }}>AstroLens</span>
        </div>

        {/* Aura ring — clean circular glow with radial-gradient */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'12px' }}>
          <div style={{
            width:140, height:140, borderRadius:'50%', marginBottom:12, flexShrink:0,
            position: 'relative',
          }}>
            {/* Round circular glow behind the ring */}
            <div style={{
              position: 'absolute', inset: -16, borderRadius: '50%',
              background: `radial-gradient(circle, ${aura_color}55 0%, ${aura_color}15 55%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'relative', zIndex: 1 }}>
              {/* Outer glow arc */}
              <circle cx={CX} cy={CY} r={R}
                fill="none" stroke={aura_color} strokeWidth="20" strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(-90 ${CX} ${CY})`}
                opacity="0.12"
              />
              {/* Mid glow arc */}
              <circle cx={CX} cy={CY} r={R}
                fill="none" stroke={aura_color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(-90 ${CX} ${CY})`}
                opacity="0.20"
              />
              {/* Track */}
              <circle cx={CX} cy={CY} r={R}
                fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"
              />
              {/* Main arc */}
              <circle cx={CX} cy={CY} r={R}
                fill="none" stroke={aura_color} strokeWidth="8" strokeLinecap="round"
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

          {/* Aura name + archetype */}
          <span style={{
            fontFamily:'Arial,sans-serif', fontSize:'0.68rem', fontWeight:700,
            letterSpacing:'0.16em', textTransform:'uppercase', color:aura_color,
          }}>{aura_hex_name} Aura</span>
          <span style={{
            fontFamily:'Georgia,serif', fontSize:'1.18rem', fontWeight:700,
            color:'#f0e8d0', marginTop:4,
          }}>{archetype_name}</span>
        </div>

        {/* Archetype ornament */}
        <div style={{ marginBottom:10 }}>
          <Ornament type={theme.ornamentType} color={aura_color} />
        </div>

        {/* Divider */}
        <div style={{
          height:1, marginBottom:12,
          background:'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)',
        }}/>

        {/* Title */}
        <div style={{
          fontFamily:'Georgia,serif', fontSize:'1.12rem', fontWeight:700,
          lineHeight:1.38, textAlign:'center', color:'#f0e8d0', marginBottom:9,
        }}>{title}</div>

        {/* Reading */}
        <div style={{
          fontFamily:'Arial,sans-serif', fontSize:'0.78rem', color:'#9e8e8a',
          lineHeight:1.78, textAlign:'center', marginBottom:13,
        }}>{reading.split('. ')[0]}.</div>

        {/* Orion's belt dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:13, alignItems:'center' }}>
          {[0.28, 0.50, 0.28].map((op,i) => (
            <div key={i} style={{
              width:i===1?5:4, height:i===1?5:4, borderRadius:'50%',
              background:`rgba(201,162,39,${op})`,
            }}/>
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
                <span style={{ fontFamily:'Arial,sans-serif', fontSize:'0.77rem', fontWeight:700, color:l.to }}>
                  {l.pct}%
                </span>
              </div>
              <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
                <div style={{
                  width:`${l.pct}%`, height:'100%', borderRadius:99,
                  background:`linear-gradient(90deg, ${l.from}, ${l.to})`,
                }}/>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex:1 }}/>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{
            padding:'5px 15px', borderRadius:99,
            background:'rgba(201,162,39,0.11)',
            border:'1px solid rgba(201,162,39,0.28)',
            fontFamily:'Arial,sans-serif', fontSize:'0.72rem',
            color:'#c9a227', fontWeight:600, letterSpacing:'0.09em',
          }}>{lucky_element} Element</div>
          <span style={{ fontFamily:'Arial,sans-serif', fontSize:'0.67rem', color:'#3e3450', letterSpacing:'0.06em' }}>
            astrolens.app
          </span>
        </div>

      </div>
    </div>
  );
});

/* ── Utility: hex color → "r,g,b" string ── */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3
    ? h.split('').map(c => c+c).join('')
    : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export default ShareCard;
