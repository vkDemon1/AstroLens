import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════
   STAR COLOUR PALETTE
═══════════════════════════════════════════════════ */
const STAR_COLORS = [
  'rgba(255,255,255,',  // pure white — most common
  'rgba(220,235,255,',  // cool blue-white
  'rgba(180,210,255,',  // soft blue
  'rgba(255,240,180,',  // warm gold
  'rgba(255,220,120,',  // amber gold
  'rgba(200,180,255,',  // lavender
];

/* ═══════════════════════════════════════════════════
   CONSTELLATION LIBRARY
   Coords are LOCAL (0-1 relative to shape bounding box).
   They will be scaled + translated to screen coords at runtime.
═══════════════════════════════════════════════════ */
const CONSTELLATION_LIBRARY = [
  {
    name: 'Orion',
    color: [180, 140, 255],
    // local bounding: ~0.25 wide × 0.45 tall
    stars: [
      { lx: 0.15, ly: 0.00, mag: 2.4 }, // Betelgeuse
      { lx: 0.00, ly: 0.08, mag: 1.8 }, // Bellatrix
      { lx: 0.05, ly: 0.32, mag: 1.2 }, // Mintaka
      { lx: 0.12, ly: 0.35, mag: 1.4 }, // Alnilam
      { lx: 0.20, ly: 0.38, mag: 1.3 }, // Alnitak
      { lx: 0.02, ly: 0.62, mag: 1.6 }, // Saiph
      { lx: 0.25, ly: 0.58, mag: 2.6 }, // Rigel
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[4,6],[1,6]],
  },
  {
    name: 'Ursa Major',
    color: [100, 200, 255],
    stars: [
      { lx: 0.00, ly: 0.00, mag: 1.4 },
      { lx: 0.18, ly: 0.05, mag: 1.6 },
      { lx: 0.36, ly: 0.18, mag: 1.2 },
      { lx: 0.50, ly: 0.38, mag: 1.8 },
      { lx: 0.65, ly: 0.58, mag: 1.5 }, // Alioth
      { lx: 0.52, ly: 0.72, mag: 1.3 }, // Mizar
      { lx: 0.32, ly: 0.60, mag: 2.0 }, // Dubhe
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  {
    name: 'Cassiopeia',
    color: [255, 200, 100],
    stars: [
      { lx: 0.00, ly: 0.50, mag: 1.5 },
      { lx: 0.22, ly: 0.00, mag: 2.2 }, // Schedar
      { lx: 0.44, ly: 0.42, mag: 1.3 }, // Gamma Cas
      { lx: 0.66, ly: 0.08, mag: 1.6 }, // Ruchbah
      { lx: 0.88, ly: 0.55, mag: 1.4 }, // Segin
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    name: 'Scorpius',
    color: [255, 100, 100],
    stars: [
      { lx: 0.20, ly: 0.00, mag: 2.4 }, // Antares
      { lx: 0.35, ly: 0.12, mag: 1.3 },
      { lx: 0.48, ly: 0.26, mag: 1.1 },
      { lx: 0.42, ly: 0.42, mag: 1.2 },
      { lx: 0.28, ly: 0.55, mag: 1.0 },
      { lx: 0.15, ly: 0.68, mag: 1.1 },
      { lx: 0.05, ly: 0.82, mag: 1.3 },
      { lx: 0.00, ly: 1.00, mag: 1.2 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
  },
  {
    name: 'Cygnus',
    color: [120, 220, 200],
    stars: [
      { lx: 0.50, ly: 0.00, mag: 2.5 }, // Deneb
      { lx: 0.50, ly: 0.30, mag: 1.8 }, // Sadr (centre cross)
      { lx: 0.50, ly: 0.70, mag: 1.4 },
      { lx: 0.50, ly: 1.00, mag: 2.0 }, // Albireo
      { lx: 0.00, ly: 0.30, mag: 1.3 }, // wing left
      { lx: 1.00, ly: 0.30, mag: 1.3 }, // wing right
    ],
    lines: [[0,1],[1,2],[2,3],[1,4],[1,5]], // Northern Cross
  },
  {
    name: 'Lyra',
    color: [200, 255, 160],
    stars: [
      { lx: 0.50, ly: 0.00, mag: 2.6 }, // Vega — brightest
      { lx: 0.20, ly: 0.45, mag: 1.2 },
      { lx: 0.80, ly: 0.45, mag: 1.2 },
      { lx: 0.10, ly: 1.00, mag: 1.1 },
      { lx: 0.90, ly: 1.00, mag: 1.1 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[3,4],[1,2]],
  },
  {
    name: 'Leo',
    color: [255, 180, 60],
    stars: [
      { lx: 0.00, ly: 1.00, mag: 2.4 }, // Regulus
      { lx: 0.12, ly: 0.72, mag: 1.5 },
      { lx: 0.28, ly: 0.45, mag: 1.3 },
      { lx: 0.50, ly: 0.20, mag: 1.2 }, // Algieba
      { lx: 0.65, ly: 0.00, mag: 1.4 }, // Zosma
      { lx: 1.00, ly: 0.30, mag: 1.6 }, // Denebola
      { lx: 0.80, ly: 0.65, mag: 1.1 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,1]],
  },
  {
    name: 'Gemini',
    color: [150, 200, 255],
    stars: [
      { lx: 0.00, ly: 0.00, mag: 2.2 }, // Castor
      { lx: 0.20, ly: 0.00, mag: 2.4 }, // Pollux
      { lx: 0.04, ly: 0.35, mag: 1.3 },
      { lx: 0.24, ly: 0.35, mag: 1.3 },
      { lx: 0.08, ly: 0.65, mag: 1.2 },
      { lx: 0.28, ly: 0.65, mag: 1.2 },
      { lx: 0.10, ly: 1.00, mag: 1.4 }, // Alhena
      { lx: 0.30, ly: 1.00, mag: 1.1 },
    ],
    lines: [[0,2],[2,4],[4,6],[1,3],[3,5],[5,7],[6,7],[4,5]],
  },
  {
    name: 'Perseus',
    color: [220, 150, 255],
    stars: [
      { lx: 0.40, ly: 0.00, mag: 1.9 }, // Mirfak
      { lx: 0.20, ly: 0.18, mag: 1.3 },
      { lx: 0.00, ly: 0.40, mag: 1.4 }, // Algol
      { lx: 0.18, ly: 0.55, mag: 1.2 },
      { lx: 0.60, ly: 0.22, mag: 1.1 },
      { lx: 0.80, ly: 0.45, mag: 1.2 },
      { lx: 1.00, ly: 0.65, mag: 1.3 },
    ],
    lines: [[0,1],[1,2],[2,3],[0,4],[4,5],[5,6]],
  },
  {
    name: 'Aquila',
    color: [255, 220, 100],
    stars: [
      { lx: 0.50, ly: 0.00, mag: 2.3 }, // Altair
      { lx: 0.30, ly: 0.30, mag: 1.3 },
      { lx: 0.70, ly: 0.30, mag: 1.4 },
      { lx: 0.20, ly: 0.70, mag: 1.1 },
      { lx: 0.80, ly: 0.65, mag: 1.2 },
      { lx: 0.50, ly: 1.00, mag: 1.3 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
  },
];

/* ═══════════════════════════════════════════════════
   Randomly pick N constellations and assign each a
   random non-overlapping screen region on mount.
═══════════════════════════════════════════════════ */
function pickAndPlaceConstellations(W, H) {
  // Shuffle and pick 5 random constellations
  const shuffled = [...CONSTELLATION_LIBRARY].sort(() => Math.random() - 0.5);
  const chosen   = shuffled.slice(0, 5);

  // Divide screen into a 3x2 grid of cells; pick 5 of 6 cells randomly
  const cols = 3, rows = 2;
  const cells = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      cells.push({ cx: (c + 0.5) / cols, cy: (r + 0.5) / rows });
  // Shuffle cells, take 5
  const cellSlots = cells.sort(() => Math.random() - 0.5).slice(0, 5);

  return chosen.map((con, i) => {
    const cell = cellSlots[i];
    // Random scale: constellation spans 10–22% of screen width
    const scaleW = (0.10 + Math.random() * 0.12) * W;
    const scaleH = (0.10 + Math.random() * 0.12) * H;
    // Jitter position within the cell ±10%
    const jx = (Math.random() - 0.5) * 0.18;
    const jy = (Math.random() - 0.5) * 0.25;
    const originX = (cell.cx + jx) * W;
    const originY = (cell.cy + jy) * H;
    // Random slow drift rotation for each constellation individually
    const driftSpeed = (Math.random() < 0.5 ? 1 : -1) * (0.00003 + Math.random() * 0.00005);

    return { ...con, originX, originY, scaleW, scaleH, driftSpeed, rot: Math.random() * Math.PI * 2 };
  });
}

/* ═══════════════════════════════════════════════════
   Background star factory
═══════════════════════════════════════════════════ */
function makeStars(n) {
  return Array.from({ length: n }, () => {
    const t      = Math.random();
    const radius = t < 0.60  ? 0.3 + Math.random() * 0.7
                 : t < 0.88  ? 1.0 + Math.random() * 0.8
                 : t < 0.97  ? 1.8 + Math.random() * 0.8
                              : 2.6 + Math.random() * 1.0;
    const cIdx   = Math.random() < 0.55 ? 0 : Math.floor(Math.random() * STAR_COLORS.length);
    return {
      x: Math.random(), y: Math.random(), r: radius,
      color: STAR_COLORS[cIdx],
      twinkleBase:  0.25 + Math.random() * 0.35,
      twinkleRange: 0.35 + Math.random() * 0.50,
      twinkleSpeed: 0.3  + Math.random() * 2.2,
      twinklePhase: Math.random() * Math.PI * 2,
      shimmer:      Math.random() < 0.15,
      shimmerSpeed: 2.0  + Math.random() * 5.0,
      shimmerPhase: Math.random() * Math.PI * 2,
    };
  });
}

/* ═══════════════════════════════════════════════════
   Meteor factory
═══════════════════════════════════════════════════ */
function makeMeteor(W, H) {
  const angle = (12 + Math.random() * 28) * (Math.PI / 180);
  const speed = 12 + Math.random() * 16;
  return {
    x: Math.random() * W * 1.3 - W * 0.15,
    y: -20 + Math.random() * H * 0.35,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: 90 + Math.random() * 180,
    alpha:  0.9 + Math.random() * 0.1,
    width:  1.2 + Math.random() * 1.2,
  };
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function CosmosCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');

    let W, H;
    let animId;
    const meteors      = [];
    let meteorTimer    = 20 + Math.random() * 40;
    const bgStars      = makeStars(500);

    // Place constellations once per mount (fresh random layout every reload)
    let placed = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      placed = pickAndPlaceConstellations(W, H);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ─── Draw loop ─── */
    function draw(ts) {
      const time = ts / 1000;
      ctx.clearRect(0, 0, W, H);

      /* Background */
      const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
      bg.addColorStop(0,    '#010008');
      bg.addColorStop(0.35, '#060020');
      bg.addColorStop(0.7,  '#04001a');
      bg.addColorStop(1,    '#02000c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* Nebula blobs */
      [
        [0.15, 0.18, 380, 'rgba(70,20,160,0.09)'],
        [0.80, 0.28, 300, 'rgba(20,60,200,0.08)'],
        [0.48, 0.68, 350, 'rgba(110,15,140,0.08)'],
        [0.62, 0.50, 220, 'rgba(30,80,130,0.06)'],
      ].forEach(([nx, ny, nr, nc]) => {
        const ng = ctx.createRadialGradient(nx*W, ny*H, 0, nx*W, ny*H, nr);
        ng.addColorStop(0, nc); ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, W, H);
      });

      /* ── Background stars ── */
      bgStars.forEach(s => {
        let alpha = s.twinkleBase + s.twinkleRange * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase));
        if (s.shimmer) {
          alpha = Math.min(1, alpha + 0.5 * (0.5 + 0.5 * Math.sin(time * s.shimmerSpeed + s.shimmerPhase)));
        }
        alpha = Math.min(1, alpha);

        ctx.beginPath();
        ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
        ctx.fillStyle = s.color + alpha.toFixed(2) + ')';
        ctx.fill();

        if (s.r > 1.5) {
          const gr = s.r * 4;
          const g  = ctx.createRadialGradient(s.x*W, s.y*H, 0, s.x*W, s.y*H, gr);
          g.addColorStop(0, s.color + (alpha * 0.3).toFixed(2) + ')');
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(s.x*W, s.y*H, gr, 0, Math.PI*2); ctx.fill();
        }
        if (s.r > 2.5) {
          ctx.strokeStyle = s.color + (alpha * 0.25).toFixed(2) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x*W - s.r*5, s.y*H); ctx.lineTo(s.x*W + s.r*5, s.y*H);
          ctx.moveTo(s.x*W, s.y*H - s.r*5); ctx.lineTo(s.x*W, s.y*H + s.r*5);
          ctx.stroke();
        }
      });

      /* ── Randomly placed, individually rotating constellations ── */
      placed.forEach(con => {
        const [cr, cg, cb] = con.color;
        con.rot += con.driftSpeed;

        // Map local (0-1) coords → screen pixel, rotate around own centre
        const mapped = con.stars.map(s => {
          const lx = s.lx * con.scaleW - con.scaleW / 2;
          const ly = s.ly * con.scaleH - con.scaleH / 2;
          return {
            x: con.originX + lx * Math.cos(con.rot) - ly * Math.sin(con.rot),
            y: con.originY + lx * Math.sin(con.rot) + ly * Math.cos(con.rot),
            mag: s.mag,
          };
        });

        /* Lines */
        ctx.save();
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.38)`;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([5, 7]);
        con.lines.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(mapped[a].x, mapped[a].y);
          ctx.lineTo(mapped[b].x, mapped[b].y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();

        /* Star dots */
        mapped.forEach(star => {
          const starR = 1.2 + star.mag * 0.7;
          const twink = 0.6 + 0.4 * Math.sin(time * 1.5 + star.x * 0.01 + star.y * 0.01);

          const glowR = starR * 8;
          const glow  = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
          glow.addColorStop(0, `rgba(${cr},${cg},${cb},${(twink * 0.38).toFixed(2)})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(star.x, star.y, glowR, 0, Math.PI*2); ctx.fill();

          ctx.beginPath(); ctx.arc(star.x, star.y, starR, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${(twink * 0.95).toFixed(2)})`;
          ctx.fill();

          ctx.beginPath(); ctx.arc(star.x, star.y, starR + 0.8, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(twink * 0.55).toFixed(2)})`;
          ctx.lineWidth = 0.8; ctx.stroke();

          if (star.mag > 1.9) {
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(twink * 0.3).toFixed(2)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(star.x - starR*6, star.y); ctx.lineTo(star.x + starR*6, star.y);
            ctx.moveTo(star.x, star.y - starR*6); ctx.lineTo(star.x, star.y + starR*6);
            ctx.stroke();
          }
        });
      });

      /* ── Meteor shower ── */
      meteorTimer--;
      if (meteorTimer <= 0) {
        meteors.push(makeMeteor(W, H));
        meteorTimer = 28 + Math.floor(Math.random() * 90);
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.alpha -= 0.011;
        if (m.alpha <= 0 || m.x > W + 300 || m.y > H + 300) { meteors.splice(i, 1); continue; }

        const a  = Math.atan2(m.vy, m.vx);
        const tx = m.x - Math.cos(a) * m.length;
        const ty = m.y - Math.sin(a) * m.length;

        const mg = ctx.createLinearGradient(tx, ty, m.x, m.y);
        mg.addColorStop(0,    'transparent');
        mg.addColorStop(0.5,  `rgba(160,200,255,${(m.alpha*0.30).toFixed(2)})`);
        mg.addColorStop(0.85, `rgba(220,235,255,${(m.alpha*0.70).toFixed(2)})`);
        mg.addColorStop(1,    `rgba(255,255,255,${m.alpha.toFixed(2)})`);
        ctx.beginPath(); ctx.strokeStyle = mg; ctx.lineWidth = m.width;
        ctx.moveTo(tx, ty); ctx.lineTo(m.x, m.y); ctx.stroke();

        const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 8);
        hg.addColorStop(0,    `rgba(255,255,255,${m.alpha.toFixed(2)})`);
        hg.addColorStop(0.35, `rgba(180,210,255,${(m.alpha*0.7).toFixed(2)})`);
        hg.addColorStop(1,    'transparent');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(m.x, m.y, 8, 0, Math.PI*2); ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0, pointerEvents: 'none', display: 'block',
      }}
      aria-hidden="true"
    />
  );
}
