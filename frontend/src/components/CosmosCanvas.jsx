import { useEffect, useRef } from 'react';

/* ─── Star colour palette ─── */
const STAR_COLORS = [
  'rgba(255,255,255,',   // pure white  — most common
  'rgba(220,235,255,',   // cool blue-white
  'rgba(180,210,255,',   // soft blue
  'rgba(255,240,180,',   // warm gold
  'rgba(255,220,120,',   // amber gold
  'rgba(200,180,255,',   // lavender
];

/* ─── Constellation definitions (0–1 normalised coords) ─── */
const CONSTELLATIONS = [
  {
    name: 'Orion',
    color: [180, 140, 255],
    stars: [
      { x: 0.11, y: 0.17, mag: 2.4 },  // Betelgeuse — big
      { x: 0.09, y: 0.27, mag: 1.8 },  // Bellatrix
      { x: 0.105, y: 0.37, mag: 1.2 }, // Mintaka
      { x: 0.125, y: 0.39, mag: 1.4 }, // Alnilam
      { x: 0.145, y: 0.41, mag: 1.3 }, // Alnitak
      { x: 0.085, y: 0.52, mag: 1.6 }, // Saiph
      { x: 0.165, y: 0.50, mag: 2.6 }, // Rigel — biggest
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[4,6],[1,6]],
  },
  {
    name: 'Ursa Major',
    color: [100, 200, 255],
    stars: [
      { x: 0.55, y: 0.07, mag: 1.4 },
      { x: 0.62, y: 0.09, mag: 1.6 },
      { x: 0.68, y: 0.13, mag: 1.2 },
      { x: 0.73, y: 0.19, mag: 1.8 },
      { x: 0.77, y: 0.25, mag: 1.5 },
      { x: 0.71, y: 0.30, mag: 1.3 },
      { x: 0.64, y: 0.28, mag: 2.0 }, // Dubhe — prominent
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  {
    name: 'Cassiopeia',
    color: [255, 200, 100],
    stars: [
      { x: 0.79, y: 0.56, mag: 1.5 },
      { x: 0.84, y: 0.48, mag: 2.2 }, // Schedar — brightest
      { x: 0.88, y: 0.55, mag: 1.3 },
      { x: 0.93, y: 0.49, mag: 1.6 },
      { x: 0.975, y: 0.57, mag: 1.4 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    name: 'Scorpius',
    color: [255, 130, 130],
    stars: [
      { x: 0.28, y: 0.60, mag: 2.4 }, // Antares — vivid red giant
      { x: 0.33, y: 0.64, mag: 1.3 },
      { x: 0.37, y: 0.69, mag: 1.1 },
      { x: 0.35, y: 0.75, mag: 1.2 },
      { x: 0.31, y: 0.79, mag: 1.0 },
      { x: 0.27, y: 0.84, mag: 1.1 },
      { x: 0.24, y: 0.88, mag: 1.3 },
      { x: 0.28, y: 0.92, mag: 1.2 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
  },
];

/* ─── Build background star array ─── */
function makeStars(n) {
  return Array.from({ length: n }, () => {
    // Logarithmic distribution — many faint, few bright
    const t = Math.random();
    const radius = t < 0.6  ? 0.3 + Math.random() * 0.7   // faint  (60 %)
                 : t < 0.88 ? 1.0 + Math.random() * 0.8   // medium (28 %)
                 : t < 0.97 ? 1.8 + Math.random() * 0.8   // bright (9 %)
                            : 2.6 + Math.random() * 1.0;  // prominent (3 %)
    const colorIdx = Math.random() < 0.55 ? 0            // mostly white
                   : Math.floor(Math.random() * STAR_COLORS.length);
    return {
      x: Math.random(),
      y: Math.random(),
      r: radius,
      color: STAR_COLORS[colorIdx],
      // Each star has independent twinkle params
      twinkleBase:  0.25 + Math.random() * 0.35,   // minimum opacity floor
      twinkleRange: 0.35 + Math.random() * 0.50,   // how much it fluctuates
      twinkleSpeed: 0.3  + Math.random() * 2.2,    // Hz
      twinklePhase: Math.random() * Math.PI * 2,
      // Occasional "shimmer" pulse
      shimmer:      Math.random() < 0.15,
      shimmerSpeed: 2.0 + Math.random() * 5.0,
      shimmerPhase: Math.random() * Math.PI * 2,
    };
  });
}

/* ─── Meteor factory ─── */
function makeMeteor(W, H) {
  const angleDeg = 12 + Math.random() * 28;   // 12–40° downward
  const angle    = angleDeg * (Math.PI / 180);
  const speed    = 12 + Math.random() * 16;
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

export default function CosmosCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let animId;
    let rotation = 0;
    const meteors = [];
    let meteorTimer = 20 + Math.random() * 40;

    // Build stars once
    const bgStars = makeStars(500);

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ─── Main draw loop ─── */
    function draw(ts) {
      const time = ts / 1000;
      ctx.clearRect(0, 0, W, H);

      /* Background gradient */
      const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
      bg.addColorStop(0,   '#010008');
      bg.addColorStop(0.35,'#060020');
      bg.addColorStop(0.7, '#04001a');
      bg.addColorStop(1,   '#02000c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* Nebula clouds */
      [
        [0.15, 0.18, 380, 'rgba(70,20,160,0.09)'],
        [0.80, 0.28, 300, 'rgba(20,60,200,0.08)'],
        [0.48, 0.68, 350, 'rgba(110,15,140,0.08)'],
        [0.62, 0.50, 220, 'rgba(30,80,130,0.06)'],
      ].forEach(([nx, ny, nr, nc]) => {
        const ng = ctx.createRadialGradient(nx*W, ny*H, 0, nx*W, ny*H, nr);
        ng.addColorStop(0, nc);
        ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, W, H);
      });

      /* ── Background stars with per-star twinkling ── */
      bgStars.forEach(s => {
        let alpha = s.twinkleBase + s.twinkleRange *
          (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase));

        // shimmer burst for select stars
        if (s.shimmer) {
          const burst = 0.5 + 0.5 * Math.sin(time * s.shimmerSpeed + s.shimmerPhase);
          alpha = Math.min(1, alpha + burst * 0.5);
        }
        alpha = Math.min(1, alpha);

        // draw star
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + alpha.toFixed(2) + ')';
        ctx.fill();

        // soft glow for brighter stars
        if (s.r > 1.5) {
          const glowR = s.r * 4;
          const glow  = ctx.createRadialGradient(s.x*W, s.y*H, 0, s.x*W, s.y*H, glowR);
          glow.addColorStop(0, s.color + (alpha * 0.3).toFixed(2) + ')');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x*W, s.y*H, glowR, 0, Math.PI*2);
          ctx.fill();
        }

        // cross-spike for the biggest stars
        if (s.r > 2.5) {
          ctx.strokeStyle = s.color + (alpha * 0.25).toFixed(2) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x*W - s.r*5, s.y*H);
          ctx.lineTo(s.x*W + s.r*5, s.y*H);
          ctx.moveTo(s.x*W, s.y*H - s.r*5);
          ctx.lineTo(s.x*W, s.y*H + s.r*5);
          ctx.stroke();
        }
      });

      /* ── Rotating constellations ── */
      const pivotX = W * 0.50;
      const pivotY = H * 0.38;
      rotation += 0.000065;

      CONSTELLATIONS.forEach(con => {
        const [cr, cg, cb] = con.color;

        const mapped = con.stars.map(s => {
          const ox = s.x * W - pivotX;
          const oy = s.y * H - pivotY;
          return {
            x: pivotX + ox * Math.cos(rotation) - oy * Math.sin(rotation),
            y: pivotY + ox * Math.sin(rotation) + oy * Math.cos(rotation),
            mag: s.mag,
          };
        });

        /* Connecting lines — subtle dashed */
        ctx.save();
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.35)`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([5, 7]);
        con.lines.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(mapped[a].x, mapped[a].y);
          ctx.lineTo(mapped[b].x, mapped[b].y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();

        /* Constellation star dots + glow */
        mapped.forEach(star => {
          const starR = 1.2 + star.mag * 0.7;   // bigger for brighter mag
          const twink = 0.6 + 0.4 * Math.sin(time * 1.5 + star.x + star.y);

          // large outer glow
          const glowR = starR * 8;
          const glow  = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
          glow.addColorStop(0, `rgba(${cr},${cg},${cb},${(twink * 0.35).toFixed(2)})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowR, 0, Math.PI*2);
          ctx.fill();

          // bright white core
          ctx.beginPath();
          ctx.arc(star.x, star.y, starR, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${(twink * 0.95).toFixed(2)})`;
          ctx.fill();

          // colour tint ring
          ctx.beginPath();
          ctx.arc(star.x, star.y, starR + 1, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(twink * 0.55).toFixed(2)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // cross-spike for prominent stars (mag > 2)
          if (star.mag > 1.9) {
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(twink * 0.3).toFixed(2)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(star.x - starR*6, star.y);
            ctx.lineTo(star.x + starR*6, star.y);
            ctx.moveTo(star.x, star.y - starR*6);
            ctx.lineTo(star.x, star.y + starR*6);
            ctx.stroke();
          }
        });
      });

      /* ── Meteor shower ── */
      meteorTimer--;
      if (meteorTimer <= 0) {
        meteors.push(makeMeteor(W, H));
        meteorTimer = 30 + Math.floor(Math.random() * 90);
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x     += m.vx;
        m.y     += m.vy;
        m.alpha -= 0.011;

        if (m.alpha <= 0 || m.x > W + 300 || m.y > H + 300) {
          meteors.splice(i, 1);
          continue;
        }

        const angle = Math.atan2(m.vy, m.vx);
        const tx    = m.x - Math.cos(angle) * m.length;
        const ty    = m.y - Math.sin(angle) * m.length;

        // tail gradient
        const mg = ctx.createLinearGradient(tx, ty, m.x, m.y);
        mg.addColorStop(0,   'transparent');
        mg.addColorStop(0.5, `rgba(160,200,255,${(m.alpha * 0.30).toFixed(2)})`);
        mg.addColorStop(0.85,`rgba(220,235,255,${(m.alpha * 0.70).toFixed(2)})`);
        mg.addColorStop(1,   `rgba(255,255,255,${m.alpha.toFixed(2)})`);
        ctx.beginPath();
        ctx.strokeStyle = mg;
        ctx.lineWidth   = m.width;
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // glowing head
        const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 8);
        hg.addColorStop(0,   `rgba(255,255,255,${m.alpha.toFixed(2)})`);
        hg.addColorStop(0.35,`rgba(180,210,255,${(m.alpha*0.7).toFixed(2)})`);
        hg.addColorStop(1,   'transparent');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 8, 0, Math.PI*2);
        ctx.fill();
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
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
}

