import { useState } from 'react';
import styles from './InviteLanding.module.css';
import { ZODIAC_SIGNS, calculateCosmicCompatibility } from '../utils/compatibilityEngine';

/**
 * AstroLens — Cosmic Compatibility Recipient Experience (Phase 4B-2)
 *
 * Dedicated landing experience rendered when a recipient opens an invite URL with ?compare=...
 *
 * @param {object} props
 * @param {object} props.inviterData - Decoded inviter payload from compatibilityInvite.js
 * @param {function} props.onNavigate - App navigation callback
 */
export default function InviteLanding({ inviterData, onNavigate }) {
  const [recipientName, setRecipientName] = useState('');
  const [selectedZodiacId, setSelectedZodiacId] = useState('leo');
  const [report, setReport] = useState(null);

  const selectedZodiac = ZODIAC_SIGNS.find(z => z.id === selectedZodiacId) || ZODIAC_SIGNS[0];
  const inviterName = inviterData?.name || 'Someone';
  const inviterArchetype = inviterData?.archetype || 'Cosmic Seeker';
  const inviterColor = inviterData?.auraColor || '#7B2FFF';
  const inviterScore = inviterData?.auraScore ?? 78;
  const inviterElement = inviterData?.luckyElement || 'Fire';

  const handleRevealConnection = (e) => {
    if (e) e.preventDefault();

    // Map inviter payload to userProfile structure expected by calculateCosmicCompatibility
    const inviterProfile = {
      name: inviterName,
      archetype: inviterArchetype,
      auraColor: inviterColor,
      auraScore: inviterScore,
      luckyElement: inviterElement,
      energyScore: inviterScore,
      focusScore: Math.max(60, inviterScore - 5),
      emotionScore: Math.max(60, inviterScore - 8),
    };

    const res = calculateCosmicCompatibility(inviterProfile, {
      name: recipientName.trim() || 'Your Universe',
      zodiacId: selectedZodiacId,
    });

    setReport(res);

    // Save minimal invite source in localStorage
    try {
      localStorage.setItem('astrolens_invite_source', JSON.stringify({
        inviterName,
        inviterArchetype,
        timestamp: Date.now(),
      }));
    } catch {
      // Ignore storage errors
    }
  };

  const handleReset = () => {
    setReport(null);
  };

  return (
    <div className={styles.invitePage}>
      {/* ── Inviter Banner / Context ── */}
      <div className={styles.inviterContext}>
        <div className={styles.inviterBadge}>
          <span>✦</span>
          <span>A COSMIC INVITATION AWAITS</span>
        </div>
        <h1 className={styles.inviteHeading}>
          <span className={styles.inviterHighlight}>{inviterName}</span> Invited You to Discover Your Connection
        </h1>
        <p className={styles.inviteSub}>
          Their palm aura and planetary archetype have already been mapped. Enter your stars below to reveal how your universes align.
        </p>
      </div>

      {/* ── Two Universes Meeting Visual Stage ── */}
      <div className={styles.meetingStage}>
        <div className={styles.orbsRow}>
          {/* Inviter Orb */}
          <div className={styles.orbNode}>
            <span className={styles.orbRole}>THEIR UNIVERSE</span>
            <div
              className={styles.orbCircle}
              style={{
                backgroundColor: 'rgba(12, 10, 40, 0.9)',
                borderColor: inviterColor,
                boxShadow: `0 0 26px ${inviterColor}55`,
              }}
            >
              <span>✦</span>
            </div>
            <h3 className={styles.orbTitle}>{inviterName}</h3>
            <span className={styles.orbArchetype}>{inviterArchetype}</span>
          </div>

          {/* Central Connection Beam */}
          <div className={styles.connectionBeam}>
            <div className={styles.beamSpark}>✨</div>
            <div className={styles.beamLine} />
          </div>

          {/* Recipient Orb */}
          <div className={styles.orbNode}>
            <span className={styles.orbRole}>YOUR UNIVERSE</span>
            <div
              className={styles.orbCircle}
              style={{
                backgroundColor: 'rgba(12, 10, 40, 0.9)',
                borderColor: selectedZodiac.color,
                boxShadow: `0 0 26px ${selectedZodiac.color}55`,
              }}
            >
              <span>{selectedZodiac.symbol}</span>
            </div>
            <h3 className={styles.orbTitle}>
              {recipientName.trim() || 'Your Name'}
            </h3>
            <span className={styles.orbArchetype}>{selectedZodiac.element} · {selectedZodiac.name}</span>
          </div>
        </div>
      </div>

      {/* ── Input Stage (Before Reveal) ── */}
      {!report ? (
        <div className={styles.inputCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Align Your Planetary Energies</h2>
            <p className={styles.sectionDesc}>
              Enter your name and select your astrological sign to unveil your celestial resonance with {inviterName}.
            </p>
          </div>

          <form onSubmit={handleRevealConnection}>
            <div className={styles.formGroup}>
              <label htmlFor="recipient-name-input" className={styles.label}>
                Your Name
              </label>
              <input
                id="recipient-name-input"
                type="text"
                className={styles.textInput}
                placeholder="e.g. Maya, Jordan, or Seeker"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Select Your Zodiac Sign</label>
              <div className={styles.zodiacGrid}>
                {ZODIAC_SIGNS.map((z) => {
                  const isSelected = z.id === selectedZodiacId;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      id={`invite-zodiac-${z.id}`}
                      className={`${styles.zodiacChip} ${isSelected ? styles.zodiacChipSelected : ''}`}
                      onClick={() => setSelectedZodiacId(z.id)}
                    >
                      <span className={styles.zodiacSymbol} style={{ color: z.color }}>
                        {z.symbol}
                      </span>
                      <div className={styles.zodiacInfo}>
                        <span className={styles.zodiacName}>{z.name}</span>
                        <span className={styles.zodiacMeta}>{z.element}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="submit"
                id="reveal-connection-btn"
                className={styles.btnRevealPrimary}
              >
                <span>✦</span> Reveal Our Cosmic Connection
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── Result Stage (After Reveal) ── */
        <div className={styles.resultContainer}>
          {/* Hero Overall Resonance Score */}
          <div className={styles.heroScoreCard}>
            <div className={styles.heroLeft}>
              <span className={styles.eyebrow}>✦ COSMIC CONNECTION UNVEILED ✦</span>
              <h2 className={styles.bondTitle}>{report.bondTitle}</h2>
              <div className={styles.bondNames}>
                {inviterName} ({inviterArchetype}) × {recipientName.trim() || 'You'} ({selectedZodiac.name})
              </div>
            </div>

            <div className={styles.scoreOrbWrap}>
              <span className={styles.scoreNumber}>{report.overallScore}%</span>
              <span className={styles.scoreLabel}>Resonance</span>
            </div>
          </div>

          {/* 4 Dimension Sub-Scores */}
          <div className={styles.subScoresGrid}>
            {Object.entries(report.subScores).map(([key, sub]) => (
              <div key={key} className={styles.subScoreCard}>
                <div className={styles.subScoreTop}>
                  <span className={styles.subScoreLabel}>{sub.label}</span>
                  <span className={styles.subScoreVal} style={{ color: sub.color }}>
                    {sub.score}%
                  </span>
                </div>
                <div className={styles.subScoreTrack}>
                  <div
                    className={styles.subScoreFill}
                    style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                  />
                </div>
                <p className={styles.subScoreDesc}>{sub.desc}</p>
              </div>
            ))}
          </div>

          {/* Cosmic Bond Narrative */}
          <div className={styles.narrativeCard}>
            <div className={styles.narrativeTitle}>✦ Celestial Bond Insight</div>
            <p className={styles.narrativeText}>{report.narrative}</p>

            <div className={styles.sparkTipBox}>
              <span>💡</span>
              <div>
                <strong>Cosmic Spark:</strong> {report.sparkTip}
              </div>
            </div>
          </div>

          {/* ── Conversion Moment: Discover Your Universe ── */}
          <div className={styles.conversionCard}>
            <h3 className={styles.conversionTitle}>✦ Discover Your Own Universe</h3>
            <p className={styles.conversionSub}>
              You've uncovered your harmonic connection with {inviterName}. Now scan your own palm to map your complete Life, Head, and Heart lines.
            </p>
            <div className={styles.conversionActions}>
              <button
                type="button"
                id="invite-reveal-universe-btn"
                className={styles.btnScanUniverse}
                onClick={() => onNavigate('scanner')}
              >
                <span>🔭</span> Reveal My Universe & Scan Palm
              </button>
            </div>
          </div>

          {/* Navigation Secondary Links */}
          <div className={styles.resultNavRow}>
            <button
              className="btn-secondary"
              id="invite-recalculate-btn"
              onClick={handleReset}
            >
              <span>↺</span> Try Another Sign
            </button>
            <button
              className="btn-ghost"
              id="invite-explore-astrolens-btn"
              onClick={() => onNavigate('landing')}
            >
              ✦ Explore AstroLens Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
