import { useState, useEffect } from 'react';
import styles from './Universe.module.css';
import { getProfile, updateProfileName } from '../utils/profileStorage';
import {
  loadPulseState,
  hasCompletedToday,
  completeTodaysPulse,
  saveMoodToday,
  saveReflectionToday,
  getPulseMilestoneProgress,
  getTomorrowTeaser,
  MOOD_OPTIONS,
  REFLECTION_OPTIONS,
} from '../utils/pulseStorage';

/**
 * Format ISO timestamp into a friendly cosmic date.
 */
function formatCosmicDate(isoString) {
  if (!isoString) return 'Today';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export default function Universe({ onNavigate }) {
  const [profile, setProfile] = useState(() => getProfile());
  const [pulseState, setPulseState] = useState(() => loadPulseState());
  const [showNameModal, setShowNameModal] = useState(false);
  const [inputName, setInputName] = useState('');
  const [toast, setToast] = useState(null);

  // Reload profile & pulse state on mount
  useEffect(() => {
    const current = getProfile();
    setProfile(current);
    setPulseState(loadPulseState());
    // If user has a reading but hasn't established a name yet, prompt gracefully
    if (current.hasHistory && !current.name) {
      setShowNameModal(true);
    }
  }, []);

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    if (inputName.trim()) {
      const updated = updateProfileName(inputName);
      setProfile(updated);
    }
    setShowNameModal(false);
  };

  const openNameEdit = () => {
    setInputName(profile.name || '');
    setShowNameModal(true);
  };

  const handleCompletePulseInUniverse = () => {
    const next = completeTodaysPulse(profile.auraScore || 'guest');
    setPulseState(next);
    const updatedProfile = getProfile();
    setProfile(updatedProfile);
    setToast('✓ Today\'s Cosmic Pulse completed! Tomorrow\'s signal unlocked.');
    setTimeout(() => setToast(null), 2500);
  };

  const handleSelectMood = (moodId, icon, label) => {
    const next = saveMoodToday(moodId);
    setPulseState(next);
    setToast(`Energy set: ${icon} ${label}`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSelectReflection = (refId, label) => {
    const next = saveReflectionToday(refId);
    setPulseState(next);
    setToast(`Focus aligned on: ${label}`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSharePulse = async () => {
    const m = pulseState?.metrics;
    const streak = pulseState?.streak ?? 1;
    const moodObj = MOOD_OPTIONS.find(o => o.id === pulseState?.mood);
    const refObj = REFLECTION_OPTIONS.find(o => o.id === pulseState?.reflection);
    const moodStr = moodObj ? ` | Mood: ${moodObj.icon} ${moodObj.label}` : '';
    const refStr = refObj ? ` | Focus: ${refObj.icon} ${refObj.label}` : '';

    const text = m
      ? `✦ My Daily Cosmic Pulse (Day ${streak} streak): Energy ${m.energy}% | Focus ${m.focus}% | Emotion ${m.emotion}%${moodStr}${refStr} — "${m.theme}" Discover yours on AstroLens! ✨`
      : `✦ Check your Daily Cosmic Pulse on AstroLens! ✨`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Today's Cosmic Pulse", text, url: window.location.href });
        setToast('Shared successfully!');
      } catch {
        navigator.clipboard?.writeText(text);
        setToast('✓ Copied to clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(text);
      setToast('✓ Copied to clipboard!');
    }
    setTimeout(() => setToast(null), 2500);
  };

  const displayName = profile.name || 'Seeker';
  const isPulseDoneToday = hasCompletedToday(pulseState);
  const pulseMetrics = pulseState?.metrics;
  const streakCount = pulseState?.streak || 0;
  const milestone = getPulseMilestoneProgress(streakCount);
  const tomorrowTeaser = pulseState?.tomorrowTeaser || getTomorrowTeaser(profile.auraScore || 'guest');

  return (
    <div className={styles.universePage}>
      {/* ── Name Collection Modal ── */}
      {showNameModal && (
        <div className={styles.namePromptOverlay} role="dialog" aria-modal="true">
          <div className={styles.namePromptCard}>
            <span className={styles.namePromptIcon} aria-hidden="true">✦</span>
            <h2 className={styles.namePromptTitle}>Name Your Universe</h2>
            <p className={styles.namePromptSub}>
              What should the stars call you in your personal cosmic sanctuary?
            </p>
            <form onSubmit={handleSaveName}>
              <input
                type="text"
                className={styles.nameInput}
                placeholder="Enter your name or astral title"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                maxLength={30}
                autoFocus
              />
              <div className={styles.namePromptActions}>
                <button type="submit" className="btn-primary" id="save-universe-name-btn">
                  Enter Universe ✦
                </button>
                {profile.name && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowNameModal(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>✦ MY UNIVERSE · CELESTIAL SANCTUARY ✦</span>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>
              {profile.name ? `${profile.name}'s Universe` : 'Your Universe'}
            </h1>
            {profile.hasHistory && (
              <button
                className={styles.editNameBtn}
                onClick={openNameEdit}
                id="edit-universe-name-btn"
                aria-label="Edit your cosmic name"
              >
                <span>✎</span> {profile.name ? 'Rename' : 'Set Name'}
              </button>
            )}
          </div>
          <p className={styles.subtitle}>
            {profile.hasHistory
              ? 'Personal celestial coordinates, biometric resonance, and cosmic habit hub'
              : 'Your personal space is waiting to align with your palm lines'}
          </p>
        </div>

        <div>
          <button
            className="btn-ghost"
            id="universe-home-btn"
            onClick={() => onNavigate('landing')}
          >
            ← Home
          </button>
        </div>
      </div>

      {/* ── EMPTY STATE (No readings yet) ── */}
      {!profile.hasHistory ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOrbGlow} aria-hidden="true" />
          <div className={styles.emptyIcon} aria-hidden="true">
            <span>🌌</span>
          </div>
          <h2 className={styles.emptyTitle}>Your Universe is Waiting</h2>
          <p className={styles.emptyText}>
            Complete your first palm reading to reveal your cosmic archetype, aura resonance,
            and personal biometric coordinates. AstroLens will weave an evolving universe around you.
          </p>
          <div className={styles.emptyActions}>
            <button
              className="btn-primary"
              id="universe-reveal-btn"
              onClick={() => onNavigate('scanner')}
            >
              <span>🔭</span> Reveal My Universe
            </button>
            <button
              className="btn-secondary"
              id="universe-demo-btn"
              onClick={() => onNavigate('landing')}
            >
              Learn How It Works
            </button>
          </div>
        </div>
      ) : (
        /* ── ACTIVE UNIVERSE VIEW ── */
        <>
          {/* ══════════════════════════════════════════════════════════
              PHASE 3: DAILY COSMIC PULSE RETENTION HUB
              ══════════════════════════════════════════════════════════ */}
          <div className={styles.dailyPulseHub}>
            <div className={styles.dailyPulseHubHeader}>
              <div className={styles.dailyPulseHubTitleWrap}>
                <span className={styles.dailyPulseEyebrow}>✦ DAILY HABIT &amp; RETENTION ✦</span>
                <h3 className={styles.dailyPulseTitle}>Today's Cosmic Pulse</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  className={`${styles.pulseStatusBadge} ${
                    isPulseDoneToday ? styles.pulseStatusBadgeDone : styles.pulseStatusBadgeWaiting
                  }`}
                  id="universe-pulse-status-badge"
                >
                  {isPulseDoneToday ? '✓ Completed Today' : '⏳ Waiting for Check-in'}
                </span>
              </div>
            </div>

            <div className={styles.hubGrid}>
              {/* Left Column: Theme & Milestone Progress */}
              <div>
                <div className={styles.hubThemeBox}>
                  <strong>Today's Cosmic Theme:</strong> "
                  {pulseMetrics?.theme || 'Trust your instincts. A rare alignment fuels bold decisions.'}"
                </div>

                {/* Milestone Card */}
                <div className={styles.milestoneCard}>
                  <div className={styles.milestoneCardHeader}>
                    <span className={styles.milestoneTitleBadge}>
                      {milestone.currentMilestone ? (
                        <>
                          <span>{milestone.currentMilestone.icon}</span>
                          <span>{milestone.currentMilestone.title} ({streakCount}d)</span>
                        </>
                      ) : (
                        <>
                          <span>🔥</span>
                          <span>Day {streakCount} Streak</span>
                        </>
                      )}
                    </span>
                    <span className={styles.milestoneNextTarget}>
                      {milestone.nextMilestone
                        ? `${milestone.daysRemaining}d until ${milestone.nextMilestone.title}`
                        : 'Max Mastery Unlocked 👑'}
                    </span>
                  </div>
                  <div className={styles.milestoneProgressBar}>
                    <div
                      className={styles.milestoneProgressFill}
                      style={{ width: `${milestone.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Tomorrow Preview Teaser (Visible when completed or ready) */}
                {isPulseDoneToday && (
                  <div className={styles.tomorrowSignalCard}>
                    <span className={styles.tomorrowSignalLabel}>
                      <span>🔮</span> Tomorrow's Cosmic Signal
                    </span>
                    <p className={styles.tomorrowSignalText}>
                      "{tomorrowTeaser}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Mood & Reflection Check-in */}
              <div className={styles.hubInteractiveGroup}>
                {/* Mood Resonance */}
                <div>
                  <div className={styles.hubSectionTitle}>✦ Mood Resonance Today</div>
                  <div className={styles.hubChipsRow} style={{ marginTop: '0.35rem' }}>
                    {MOOD_OPTIONS.map((mOpt) => (
                      <button
                        key={mOpt.id}
                        id={`universe-mood-${mOpt.id}`}
                        className={`${styles.hubChip} ${pulseState?.mood === mOpt.id ? styles.hubChipActive : ''}`}
                        onClick={() => handleSelectMood(mOpt.id, mOpt.icon, mOpt.label)}
                      >
                        <span>{mOpt.icon}</span> {mOpt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reflection Focus */}
                <div>
                  <div className={styles.hubSectionTitle}>✦ Today's Reflection Focus</div>
                  <div className={styles.hubChipsRow} style={{ marginTop: '0.35rem' }}>
                    {REFLECTION_OPTIONS.map((rOpt) => (
                      <button
                        key={rOpt.id}
                        id={`universe-ref-${rOpt.id}`}
                        className={`${styles.hubChip} ${pulseState?.reflection === rOpt.id ? styles.hubChipActive : ''}`}
                        onClick={() => handleSelectReflection(rOpt.id, rOpt.label)}
                      >
                        <span>{rOpt.icon}</span> {rOpt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hub Action Footer */}
            <div className={styles.hubActionFooter}>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                {isPulseDoneToday
                  ? `✦ Day ${streakCount} streak locked in · Next pulse available tomorrow`
                  : '✦ Complete today\'s check-in to advance your streak to the next tier'}
              </span>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {!isPulseDoneToday ? (
                  <button
                    className="btn-primary"
                    id="universe-complete-pulse-btn"
                    onClick={handleCompletePulseInUniverse}
                  >
                    <span>📡</span> Complete Today's Pulse
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    id="universe-share-pulse-btn"
                    onClick={handleSharePulse}
                  >
                    <span>↗</span> Share Today's Signal
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              COSMIC IDENTITY & BIOMETRIC METRICS
              ══════════════════════════════════════════════════════════ */}
          <div className={styles.universeGrid}>
            {/* 1. Identity Hero Card */}
            <div className={styles.identityCard}>
              <div
                className={styles.identityCardGlow}
                style={{ background: `radial-gradient(circle, ${profile.auraColor}55 0%, transparent 70%)` }}
                aria-hidden="true"
              />

              <div className={styles.identityTop}>
                <div>
                  <div
                    className={styles.archetypeBadge}
                    style={{ color: profile.auraColor }}
                  >
                    ✦ {profile.auraHexName || 'COSMIC'} ARCHETYPE
                  </div>
                  <h2 className={styles.archetypeHero}>
                    {profile.archetype || 'Cosmic Trailblazer'}
                  </h2>
                  {profile.title && (
                    <div className={styles.readingTitleExcerpt}>
                      "{profile.title}"
                    </div>
                  )}
                </div>

                <div
                  className={styles.auraOrbWrap}
                  style={{
                    borderColor: profile.auraColor,
                    boxShadow: `0 0 24px ${profile.auraColor}44, inset 0 0 16px ${profile.auraColor}22`,
                  }}
                >
                  <span className={styles.auraScoreNumber}>{profile.auraScore ?? 75}</span>
                  <span className={styles.auraScoreLabel}>Aura</span>
                </div>
              </div>

              <div className={styles.identityFooter}>
                {profile.luckyElement && (
                  <span className="badge badge--gold">✦ {profile.luckyElement} Element</span>
                )}
                <span className={styles.lastActiveBadge}>
                  Aligned: {formatCosmicDate(profile.lastActiveAt)}
                </span>
              </div>
            </div>

            {/* 2. Personal Metrics Panel */}
            <div className={styles.metricsCard}>
              <div className={styles.cardSectionHeader}>
                <h3 className={styles.cardSectionTitle}>✦ Personal Cosmic Alignment</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>
                  HARMONIC RESONANCE
                </span>
              </div>

              <div className={styles.metricsList}>
                {/* Energy */}
                <div className={styles.metricRow}>
                  <div className={styles.metricMeta}>
                    <span className={styles.metricLabel}>⚡ Energy Resonance (Life)</span>
                    <span className={styles.metricValue}>{profile.energyScore ?? 75}%</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div
                      className={styles.metricFill}
                      style={{
                        width: `${profile.energyScore ?? 75}%`,
                        background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                      }}
                    />
                  </div>
                </div>

                {/* Focus */}
                <div className={styles.metricRow}>
                  <div className={styles.metricMeta}>
                    <span className={styles.metricLabel}>🧠 Mental Focus (Head)</span>
                    <span className={styles.metricValue}>{profile.focusScore ?? 70}%</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div
                      className={styles.metricFill}
                      style={{
                        width: `${profile.focusScore ?? 70}%`,
                        background: 'linear-gradient(90deg, #FDE68A, #D97706)',
                      }}
                    />
                  </div>
                </div>

                {/* Emotion */}
                <div className={styles.metricRow}>
                  <div className={styles.metricMeta}>
                    <span className={styles.metricLabel}>💜 Emotional Depth (Heart)</span>
                    <span className={styles.metricValue}>{profile.emotionScore ?? 65}%</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div
                      className={styles.metricFill}
                      style={{
                        width: `${profile.emotionScore ?? 65}%`,
                        background: 'linear-gradient(90deg, #F472B6, #C084FC)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Synchronized with biometric palm topology
                </span>
              </div>
            </div>
          </div>

          {/* ── Secondary Summary Grid (Streak & History) ── */}
          <div className={styles.secondaryGrid}>
            {/* Streak Milestone Badge Card */}
            <div className={styles.summaryCard}>
              <div>
                <div className={styles.summaryCardTop}>
                  <div className={styles.summaryIcon}>🔥</div>
                  <div>
                    <div className={styles.summaryStat}>
                      {streakCount > 0
                        ? `${streakCount} Day Streak`
                        : 'Daily Pulse Ready'}
                    </div>
                    <div className={styles.summarySub}>
                      {milestone.currentMilestone
                        ? `${milestone.currentMilestone.title} · ${milestone.currentMilestone.desc}`
                        : 'Check in daily to build your cosmic habit'}
                    </div>
                  </div>
                </div>

                {pulseState?.mood && (
                  <div style={{ fontSize: '0.78rem', color: '#38BDF8', marginBottom: '0.5rem' }}>
                    ✦ Energy State: {MOOD_OPTIONS.find(o => o.id === pulseState.mood)?.icon}{' '}
                    {MOOD_OPTIONS.find(o => o.id === pulseState.mood)?.label}
                  </div>
                )}
              </div>

              <button
                className={styles.cardActionLink}
                id="universe-pulse-link"
                onClick={() => onNavigate('landing')}
              >
                <span>✦ View Pulse on Landing</span> →
              </button>
            </div>

            {/* Reading History Summary */}
            <div className={styles.summaryCard}>
              <div>
                <div className={styles.summaryCardTop}>
                  <div className={styles.summaryIcon}>📜</div>
                  <div>
                    <div className={styles.summaryStat}>
                      {profile.totalReadings} {profile.totalReadings === 1 ? 'Reading' : 'Readings'}
                    </div>
                    <div className={styles.summarySub}>
                      Saved in your permanent local chronicle
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: '1.4' }}>
                  Your palm lines and archetype scores are preserved across all your cosmic consultations.
                </p>
              </div>

              <button
                className={styles.cardActionLink}
                id="universe-history-link"
                onClick={() => onNavigate('history')}
              >
                <span>✦ View Complete Reading History</span> →
              </button>
            </div>

            {/* Cosmic Compatibility Card (Phase 4A) */}
            <div className={styles.summaryCard}>
              <div>
                <div className={styles.summaryCardTop}>
                  <div className={styles.summaryIcon}>💫</div>
                  <div>
                    <div className={styles.summaryStat} style={{ fontSize: '1.25rem' }}>
                      Cosmic Compatibility
                    </div>
                    <div className={styles.summarySub}>
                      Compare your universe with a partner's sign
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: '1.4' }}>
                  Align your biometric aura with a partner's astrological sign to reveal your harmonic resonance across energy, mind, and heart.
                </p>
              </div>

              <button
                className={styles.cardActionLink}
                id="universe-compat-link"
                onClick={() => onNavigate('compatibility')}
              >
                <span>✦ Explore Compatibility</span> →
              </button>
            </div>
          </div>

          {/* ── Quick Actions Footer ── */}
          <div className={styles.actionsBar}>
            <span className={styles.actionsBarTitle}>
              ✦ Ready to consult the stars again, {displayName}?
            </span>
            <div className={styles.actionsBtnGroup}>
              <button
                className="btn-primary"
                id="universe-scan-again-btn"
                onClick={() => onNavigate('scanner')}
              >
                <span>🔮</span> Scan Palm Again
              </button>
              <button
                className="btn-secondary"
                id="universe-explore-btn"
                onClick={() => onNavigate('landing')}
              >
                <span>✨</span> Explore Oracle
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Feedback */}
      {toast && <div className={styles.hubToastMsg}>{toast}</div>}
    </div>
  );
}
