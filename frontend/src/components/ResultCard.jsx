import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import styles from './ResultCard.module.css';
import ShareCard from './ShareCard';

const LINE_ICONS = { life: '❤️', head: '🧠', heart: '💜' };
const LINE_NAMES = { life: 'Life Line', head: 'Head Line', heart: 'Heart Line' };
const LINE_MEANINGS = {
  life:  'Vitality & life energy',
  head:  'Mental clarity & intellect',
  heart: 'Emotional depth & love',
};

function ProminenceBar({ score, label }) {
  const pct = Math.round(score * 100);
  const tier = pct < 30 ? 'low' : pct < 60 ? 'mid' : 'high';
  return (
    <div className={styles.barWrapper}>
      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${styles[`barFill--${tier}`]}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className={styles.barLabel}>{label}</div>
    </div>
  );
}

function AuraRing({ score, color }) {
  const radius     = 54;
  const circumference = 2 * Math.PI * radius;
  const offset     = circumference - (score / 100) * circumference;

  return (
    <div className={styles.auraRingWrapper}>
      <div style={{
        position: 'absolute',
        inset: -12,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}44 0%, ${color}10 60%, transparent 75%)`,
        pointerEvents: 'none',
      }} />
      <svg width="130" height="130" className={styles.auraRingSvg}>
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: 'stroke-dashoffset 1.5s var(--ease-out)',
          }}
        />
      </svg>
      <div className={styles.auraRingInner}>
        <span className={styles.auraScore}>{score}</span>
        <span className={styles.auraScoreLabel}>Aura</span>
      </div>
    </div>
  );
}

export default function ResultCard({ result, onRescan, onNavigate }) {
  const shareCardRef  = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied]   = useState(false);

  const { aura_score, aura_color, archetype_name, aura_hex_name,
          title, reading, career_insight, energy_insight,
          lucky_element, cta_teaser,
          life, head, heart } = result;

  // Save to localStorage history
  const saveToHistory = () => {
    const history = JSON.parse(localStorage.getItem('astrolens_history') || '[]');
    history.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      aura_score,
      aura_color,
      archetype_name,
      title,
      reading,
      life_score:  life.score,
      head_score:  head.score,
      heart_score: heart.score,
      lucky_element,
    });
    localStorage.setItem('astrolens_history', JSON.stringify(history.slice(0, 20)));
  };

  // Download share card as PNG
  const downloadCard = async () => {
    if (!shareCardRef.current || sharing) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#06000f',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `astrolens-${archetype_name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      saveToHistory();
    } finally {
      setSharing(false);
    }
  };

  // Copy link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + '?demo=true');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: nothing */
    }
  };

  // WhatsApp share
  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `✨ My AstroLens palm reading: "${title}" — I scored ${aura_score}/100 Aura!\n\nTry yours: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Web Share API
  const nativeShare = async () => {
    if (!navigator.share) return;
    await navigator.share({
      title: 'My AstroLens Palm Reading',
      text:  `${title} — Aura Score: ${aura_score}/100`,
      url:   window.location.origin,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className="btn-ghost" id="result-back-btn" onClick={onRescan}>← Scan Again</button>
        <h1 className={styles.pageTitle}>Your Reading</h1>
        <button className="btn-ghost" id="result-history-btn" onClick={() => onNavigate('history')}>
          History
        </button>
      </div>

      <div className={styles.grid}>

        {/* ── LEFT: Aura + Archetype ── */}
        <div className={styles.leftCol}>
          {/* Aura orb */}
          <div className={`glass-card ${styles.auraCard}`}>
            <div
              className={styles.auraGlow}
              style={{ background: `radial-gradient(circle, ${aura_color}55 0%, transparent 70%)` }}
              aria-hidden="true"
            />

            <AuraRing score={aura_score} color={aura_color} />

            <div className={styles.archetypeName} style={{ color: aura_color }}>
              {aura_hex_name} Aura
            </div>
            <div className={styles.archetypeTitle}>{archetype_name}</div>
            <div className={styles.luckyElement}>
              <span className="badge badge--gold">✦ {lucky_element} Element</span>
            </div>
          </div>

          {/* Palm lines */}
          <div className={`glass-card ${styles.linesCard}`}>
            <h3 className={styles.linesTitle}>Palm Line Analysis</h3>
            {['life', 'head', 'heart'].map(key => (
              <div key={key} className={styles.lineRow}>
                <div className={styles.lineHeader}>
                  <span>{LINE_ICONS[key]}</span>
                  <div>
                    <div className={styles.lineName}>{LINE_NAMES[key]}</div>
                    <div className={styles.lineMeaning}>{LINE_MEANINGS[key]}</div>
                  </div>
                </div>
                <ProminenceBar
                  score={result[key].score}
                  label={result[key].label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Reading + CTA ── */}
        <div className={styles.rightCol}>

          {/* Main reading */}
          <div className={`glass-card ${styles.readingCard}`}>
            <div className={styles.readingBadge}>
              <span className="badge badge--purple">✦ Your Palm Reading</span>
            </div>
            <h2 className={styles.readingTitle}>{title}</h2>
            <p className={styles.readingText}>{reading}</p>

            <div className={styles.divider} />

            <div className={styles.insights}>
              <div className={styles.insightItem}>
                <div className={styles.insightIcon}>💼</div>
                <div>
                  <div className={styles.insightLabel}>Career Insight</div>
                  <div className={styles.insightText}>{career_insight}</div>
                </div>
              </div>
              <div className={styles.insightItem}>
                <div className={styles.insightIcon}>⚡</div>
                <div>
                  <div className={styles.insightLabel}>Energy Insight</div>
                  <div className={styles.insightText}>{energy_insight}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AstroLive CTA */}
          <div className={`glass-card ${styles.ctaCard}`}>
            <div className={styles.ctaGlow} aria-hidden="true" />
            <div className={styles.ctaIcon}>🌟</div>
            <h3 className={styles.ctaTitle}>Want the Full Cosmic Blueprint?</h3>
            <p className={styles.ctaText}>{cta_teaser}</p>
            <a
              id="book-astrologer-btn"
              href="https://astrotalk.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-primary ${styles.ctaButton}`}
            >
              <span>📞</span>
              Book a Live Astrologer
            </a>
            <p className={styles.ctaNote}>Powered by AstroLive — Trusted by 10M+ users</p>
          </div>

          {/* Share actions */}
          <div className={`glass-card ${styles.shareCard}`}>
            <h3 className={styles.shareTitle}>✦ Share Your Aura</h3>
            <div className={styles.shareActions}>
              <button
                id="download-card-btn"
                className="btn-primary"
                onClick={downloadCard}
                disabled={sharing}
              >
                {sharing ? '⏳ Generating...' : '⬇️ Download Card'}
              </button>
              <button id="copy-link-btn" className="btn-secondary" onClick={copyLink}>
                {copied ? '✅ Copied!' : '🔗 Copy Link'}
              </button>
              <button id="whatsapp-share-btn" className={styles.whatsappBtn} onClick={shareWhatsApp}>
                <span>💬</span> WhatsApp
              </button>
              {navigator.share && (
                <button id="native-share-btn" className={styles.nativeShareBtn} onClick={nativeShare}>
                  <span>↗️</span> Share
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Off-screen share card (captured by html2canvas) */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -1 }}>
        <ShareCard ref={shareCardRef} result={result} />
      </div>
    </div>
  );
}
