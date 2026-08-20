import { useState, useEffect } from 'react';
import styles from './Compatibility.module.css';
import { getProfile } from '../utils/profileStorage';
import { ZODIAC_SIGNS, calculateCosmicCompatibility } from '../utils/compatibilityEngine';
import {
  buildInviteUrl,
  formatShareMessage,
  saveLatestInvite,
  trackCompatEvent,
} from '../utils/compatibilityInvite';

export default function Compatibility({ onNavigate }) {
  const [profile, setProfile] = useState(() => getProfile());
  const [partnerName, setPartnerName] = useState('');
  const [selectedZodiacId, setSelectedZodiacId] = useState('leo');
  const [report, setReport] = useState(null);
  const [toast, setToast] = useState(null);
  const [inviteData, setInviteData] = useState(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const selectedZodiac = ZODIAC_SIGNS.find(z => z.id === selectedZodiacId) || ZODIAC_SIGNS[0];
  const hasHistory = profile?.hasHistory;

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const res = calculateCosmicCompatibility(profile, {
      name: partnerName,
      zodiacId: selectedZodiacId,
    });
    setReport(res);

    const url = buildInviteUrl(profile, partnerName, res.overallScore);
    const shareMsg = formatShareMessage(profile, partnerName, res.overallScore, url);
    const inviteRecord = {
      inviteUrl: url,
      shareMessage: shareMsg,
      partnerName: partnerName.trim() || selectedZodiac.name,
      compatibilityScore: res.overallScore,
      createdAt: Date.now(),
    };
    setInviteData(inviteRecord);
    saveLatestInvite(inviteRecord);
    trackCompatEvent('compatibility_result_viewed', { score: res.overallScore, partner: partnerName });
    trackCompatEvent('compatibility_invite_generated', { score: res.overallScore });
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setToast('✓ Invite copied to clipboard!');
    } else {
      setToast('✓ Invite link ready to share!');
    }
  };

  const handleShareInvite = async () => {
    if (!inviteData) return;
    trackCompatEvent('compatibility_invite_shared', { channel: 'native_or_clipboard' });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Our Cosmic Compatibility · AstroLens',
          text: inviteData.shareMessage,
          url: inviteData.inviteUrl,
        });
        setToast('✓ Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(inviteData.shareMessage);
        }
      }
    } else {
      copyToClipboard(inviteData.shareMessage);
    }
  };

  const handleWhatsAppShare = () => {
    if (!inviteData) return;
    trackCompatEvent('compatibility_invite_shared', { channel: 'whatsapp' });
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteData.shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setReport(null);
    setInviteData(null);
  };

  return (
    <div className={styles.compatPage}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>✦ CELESTIAL RESONANCE · PHASE 4A ✦</span>
          <h1 className={styles.pageTitle}>Cosmic Compatibility</h1>
          <p className={styles.subtitle}>
            Align your biometric palm aura with a partner's astrological sign to reveal your harmonic bond.
          </p>
        </div>

        <button
          className="btn-ghost"
          id="compat-back-btn"
          onClick={() => onNavigate('universe')}
        >
          ← My Universe
        </button>
      </div>

      {/* ── Empty State: User has not scanned their palm yet ── */}
      {!hasHistory ? (
        <div className={styles.emptyNoticeCard}>
          <div className={styles.emptyIcon}>🌌</div>
          <h2 className={styles.sectionTitle}>Your Universe is Not Yet Aligned</h2>
          <p className={styles.sectionDesc} style={{ margin: '0.5rem 0 1.5rem' }}>
            To calculate true harmonic compatibility, AstroLens first needs your personal palm topology,
            vitality scores, and aura archetype.
          </p>
          <button
            className="btn-primary"
            id="compat-scan-first-btn"
            onClick={() => onNavigate('scanner')}
          >
            <span>🔭</span> Scan Your Palm First
          </button>
        </div>
      ) : (
        <>
          {/* ── Two Cosmic Worlds Meeting Visual ── */}
          <div className={styles.worldsMeetingStage}>
            <div className={styles.orbsWrapper}>
              {/* User Orb */}
              <div className={styles.cosmicOrbNode}>
                <div
                  className={styles.orbSphere}
                  style={{
                    backgroundColor: 'rgba(12, 10, 40, 0.9)',
                    borderColor: profile.auraColor || '#FDE68A',
                    boxShadow: `0 0 25px ${(profile.auraColor || '#FDE68A')}55`,
                  }}
                >
                  <span>✦</span>
                </div>
                <h3 className={styles.orbNodeName}>{profile.name || 'Your Universe'}</h3>
                <span className={styles.orbNodeTag}>{profile.archetype || 'Seeker'}</span>
              </div>

              {/* Central Resonance Beam */}
              <div className={styles.resonanceBeam}>
                <div className={styles.resonanceSparkIcon}>✨</div>
                <div className={styles.resonanceBeamLine} />
              </div>

              {/* Partner Orb */}
              <div className={styles.cosmicOrbNode}>
                <div
                  className={styles.orbSphere}
                  style={{
                    backgroundColor: 'rgba(12, 10, 40, 0.9)',
                    borderColor: selectedZodiac.color,
                    boxShadow: `0 0 25px ${selectedZodiac.color}55`,
                  }}
                >
                  <span>{selectedZodiac.symbol}</span>
                </div>
                <h3 className={styles.orbNodeName}>
                  {partnerName.trim() || selectedZodiac.name}
                </h3>
                <span className={styles.orbNodeTag}>{selectedZodiac.element} · {selectedZodiac.name}</span>
              </div>
            </div>
          </div>

          {/* ── Interactive Input Form (Shown before calculation) ── */}
          {!report ? (
            <div className={styles.inputSectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Compare Your Universe With Someone</h2>
                <p className={styles.sectionDesc}>
                  Enter your partner's name and choose their zodiac sign to reveal your celestial alignment.
                </p>
              </div>

              <form onSubmit={handleCalculate}>
                <div className={styles.formGroup}>
                  <label htmlFor="partner-name-input" className={styles.label}>
                    Partner's Name (Optional)
                  </label>
                  <input
                    id="partner-name-input"
                    type="text"
                    className={styles.textInput}
                    placeholder="e.g. Aria, Alex, or Soulmate"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    maxLength={30}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Partner's Zodiac Sign</label>
                  <div className={styles.zodiacGrid}>
                    {ZODIAC_SIGNS.map((z) => {
                      const isSelected = z.id === selectedZodiacId;
                      return (
                        <button
                          key={z.id}
                          type="button"
                          id={`compat-zodiac-${z.id}`}
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
                    className="btn-primary"
                    id="reveal-compat-btn"
                  >
                    <span>✦</span> Reveal Cosmic Compatibility
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ── Compatibility Report Results View ── */
            <div className={styles.resultContainer}>
              {/* Hero Overall Score */}
              <div className={styles.heroScoreCard}>
                <div className={styles.heroLeft}>
                  <span className={styles.eyebrow}>✦ HARMONIC RESONANCE ✦</span>
                  <h2 className={styles.bondTitle}>{report.bondTitle}</h2>
                  <div className={styles.bondNames}>
                    {report.user.name} ({report.user.archetype}) × {report.partner.name} ({report.partner.zodiac.name})
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

              {/* ── Phase 4B-1 Viral Invite / Share Section ── */}
              <div className={styles.inviteSection}>
                <div className={styles.inviteCard}>
                  <div className={styles.inviteHeader}>
                    <span className={styles.inviteEyebrow}>✦ TWO UNIVERSES · ONE CONNECTION ✦</span>
                    <h3 className={styles.inviteTitle}>Share Your Cosmic Match</h3>
                    <p className={styles.inviteSub}>
                      Your cosmic match is only half the story. Invite them to discover the connection.
                    </p>
                  </div>

                  {/* Visual Match Preview */}
                  <div className={styles.invitePreviewPill}>
                    <div className={styles.previewUserGroup}>
                      <span className={styles.previewDot} style={{ background: profile.auraColor || '#FDE68A' }} />
                      <span className={styles.previewName}>{profile.name || 'Your Universe'}</span>
                    </div>
                    <span className={styles.previewSpark}>✦</span>
                    <div className={styles.previewUserGroup}>
                      <span className={styles.previewDot} style={{ background: selectedZodiac.color }} />
                      <span className={styles.previewName}>{partnerName.trim() || selectedZodiac.name}</span>
                    </div>
                    <span className={styles.previewScore}>{report.overallScore}% Resonance</span>
                  </div>

                  {/* Share Action CTAs */}
                  <div className={styles.inviteActions}>
                    <button
                      type="button"
                      id="compat-invite-main-btn"
                      className={styles.btnInvitePrimary}
                      onClick={handleShareInvite}
                    >
                      <span>✦</span> Invite Them to AstroLens
                    </button>

                    <button
                      type="button"
                      id="compat-whatsapp-btn"
                      className={styles.btnWhatsApp}
                      onClick={handleWhatsAppShare}
                    >
                      <span>💬</span> Share on WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.resultActions}>
                <button
                  className="btn-secondary"
                  id="compat-compare-again-btn"
                  onClick={handleReset}
                >
                  <span>↺</span> Compare Another Connection
                </button>
                <button
                  className="btn-ghost"
                  id="compat-return-universe-btn"
                  onClick={() => onNavigate('universe')}
                >
                  ← Return to My Universe
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Toast Feedback */}
      {toast && <div className={styles.toastNotice}>{toast}</div>}
    </div>
  );
}
