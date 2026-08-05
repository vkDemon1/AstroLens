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
  life:  { score: 0.82, label: 'deeply etched and dominant' },
  head:  { score: 0.71, label: 'clearly pronounced' },
  heart: { score: 0.65, label: 'clearly pronounced' },
};

const FEATURES = [
  { icon: '✋', title: 'Palm Line Analysis', desc: 'AI maps your Life, Head & Heart lines in real time using MediaPipe computer vision.' },
  { icon: '🔮', title: 'Aura Score', desc: 'A composite cosmic score derived from line depth, continuity, and intersection density.' },
  { icon: '✨', title: 'Gemini AI Reading', desc: 'Your palm data feeds a Gemini-powered reading — personalised, mystical, and deeply accurate.' },
  { icon: '📤', title: 'Shareable Card', desc: 'Download your Aura card as an image. One tap to share to Instagram, WhatsApp, or anywhere.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', quote: 'The reading was eerily accurate about my career transition. Shared it with 12 friends instantly!' },
  { name: 'Rohan M.', quote: 'I thought it was gimmicky but the Life line analysis blew my mind. Booked an astrologer right after.' },
  { name: 'Anya K.', quote: 'Best astrology app I\'ve ever used. The aura card looks gorgeous on Instagram.' },
];

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
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
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

        {/* Floating palm illustration */}
        <div className={styles.palmIllustration} aria-hidden="true">
          <div className={styles.palmOrb} />
          <div className={styles.palmIcon}>✋</div>
          <div className={styles.palmRings}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.palmRing} style={{ animationDelay: `${i * 0.6}s` }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className={styles.statsStrip}>
        {[
          { value: '21', label: 'Hand Landmarks' },
          { value: '3', label: 'Palm Lines Detected' },
          { value: '<2s', label: 'Scan Time' },
          { value: '∞', label: 'Cosmic Potential' },
        ].map(stat => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Features Grid ── */}
      <section className={`container ${styles.features}`}>
        <h2 className={`section-title ${styles.sectionHeading}`}>How AstroLens Works</h2>
        <p className={`muted-text ${styles.sectionSub}`}>
          A three-step pipeline that turns your palm into a cosmic blueprint.
        </p>

        <div className={styles.featuresGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={`glass-card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline Diagram ── */}
      <section className={`container ${styles.pipeline}`}>
        <h2 className={`section-title ${styles.sectionHeading}`}>The Technology Behind the Magic</h2>
        <div className={styles.pipelineSteps}>
          {[
            { step: '01', label: 'Webcam Capture', detail: 'Browser getUserMedia API captures your palm frame' },
            { step: '02', label: 'MediaPipe Topology', detail: '21 hand landmarks extracted and normalized' },
            { step: '03', label: 'ROI Extraction', detail: 'Palm triangle isolated using landmarks 0, 5 & 17' },
            { step: '04', label: 'Canny Edge Detection', detail: 'Adaptive thresholding reveals dominant creases' },
            { step: '05', label: 'Gemini AI Reading', detail: 'Line features prompt a personalised cosmic narrative' },
          ].map((s, i) => (
            <div key={s.step} className={styles.pipelineStep}>
              <div className={styles.pipelineNumber}>{s.step}</div>
              <div className={styles.pipelineContent}>
                <div className={styles.pipelineLabel}>{s.label}</div>
                <div className={styles.pipelineDetail}>{s.detail}</div>
              </div>
              {i < 4 && <div className={styles.pipelineArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={`container ${styles.testimonials}`}>
        <h2 className={`section-title ${styles.sectionHeading}`}>What the Stars Are Saying</h2>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={`glass-card ${styles.testimonialCard}`}>
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
