import { useState, useEffect } from 'react';
import styles from './GrowthDashboard.module.css';
import {
  getLiveMetrics,
  getDemoBenchmarkMetrics,
  PROPOSED_TARGETS,
  PRODUCT_FUNNEL_STAGES,
} from '../utils/growthMetrics';

export default function GrowthDashboard({ onNavigate }) {
  const [useDemoMode, setUseDemoMode] = useState(false);
  const [liveData, setLiveData] = useState(() => getLiveMetrics());
  const [demoData] = useState(() => getDemoBenchmarkMetrics());

  // Reload live metrics on mount
  useEffect(() => {
    setLiveData(getLiveMetrics());
  }, []);

  const data = useDemoMode ? demoData : liveData;

  return (
    <div className={styles.dashboardPage}>
      {/* ── Top Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>✦ ASTROLENS · PRODUCT IMPACT &amp; GROWTH CONTROL ✦</span>
            <span className={`${styles.modeBadge} ${useDemoMode ? styles.modeBadgeDemo : styles.modeBadgeLive}`}>
              {useDemoMode ? 'PROTOTYPE BENCHMARK DATA' : 'LOCAL INSTANCE SIGNAL'}
            </span>
          </div>
          <h1 className={styles.pageTitle}>Growth &amp; Product Impact</h1>
          <p className={styles.subtitle}>
            Prototype metrics, longitudinal funnel telemetry, and validation targets for AstroHack evaluation.
          </p>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.toggleGroup} role="group" aria-label="Data mode selector">
            <button
              type="button"
              id="dashboard-mode-live-btn"
              className={`${styles.toggleBtn} ${!useDemoMode ? styles.toggleBtnActive : ''}`}
              onClick={() => setUseDemoMode(false)}
            >
              ● Live Local Signal
            </button>
            <button
              type="button"
              id="dashboard-mode-demo-btn"
              className={`${styles.toggleBtn} ${useDemoMode ? styles.toggleBtnActive : ''}`}
              onClick={() => setUseDemoMode(true)}
            >
              ✦ Demo Signals
            </button>
          </div>

          <div className={styles.headerNavBtns}>
            <button
              type="button"
              className="btn-ghost"
              id="dashboard-back-universe-btn"
              onClick={() => onNavigate('universe')}
            >
              ← Universe
            </button>
            <button
              type="button"
              className="btn-ghost"
              id="dashboard-home-btn"
              onClick={() => onNavigate('landing')}
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* ── Judge Note Alert ── */}
      <div className={styles.judgeNoteCard}>
        <span className={styles.judgeNoteIcon}>⚖️</span>
        <div className={styles.judgeNoteContent}>
          <strong>AstroHack Evaluation Overview:</strong> This dashboard demonstrates how AstroLens
          measures the 5 core product pillars (Acquisition, Activation, Retention, Virality, Monetization)
          using privacy-first local client telemetry and structured validation benchmarks.
        </div>
      </div>

      {/* ── EMPTY STATE NOTICE (When Live mode has zero data) ── */}
      {!useDemoMode && !liveData.hasAnyData ? (
        <div className={styles.emptyLiveCard}>
          <div className={styles.emptyIcon}>📊</div>
          <h2 className={styles.emptyTitle}>No Local Interaction Data Yet</h2>
          <p className={styles.emptyDesc}>
            Your current browser session does not contain any palm scans or profile state yet.
            Complete a reading to see live local signals, or switch to Demo Signals to view prototype cohort benchmarks.
          </p>
          <div className={styles.emptyActions}>
            <button
              type="button"
              className="btn-primary"
              id="dashboard-switch-demo-btn"
              onClick={() => setUseDemoMode(true)}
            >
              <span>✦</span> View Demo Benchmark Signals
            </button>
            <button
              type="button"
              className="btn-secondary"
              id="dashboard-scan-btn"
              onClick={() => onNavigate('scanner')}
            >
              <span>🔮</span> Scan Palm to Generate Live Data
            </button>
          </div>
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════════════
          PROPOSED NORTH STAR METRIC
          ══════════════════════════════════════════════════════════ */}
      <div className={styles.northStarCard}>
        <div className={styles.northStarGlow} aria-hidden="true" />
        <div className={styles.northStarHeader}>
          <div>
            <span className={styles.northStarBadge}>PROPOSED NORTH STAR METRIC</span>
            <h2 className={styles.northStarTitle}>Cosmically Active Users (CAU)</h2>
          </div>
          <div className={styles.northStarValueBox}>
            <span className={styles.northStarValue}>
              {useDemoMode ? data.northStar.cauPercentage : (data.northStar.isCosmicallyActive ? '100% (ACTIVE)' : '0% (INITIAL)')}
            </span>
            <span className={styles.northStarSub}>
              {useDemoMode ? `${data.northStar.cauCount} / 1,180 Profiles` : data.northStar.status}
            </span>
          </div>
        </div>
        <p className={styles.northStarExplanation}>
          <strong>Definition:</strong> A local profile that has completed at least one meaningful recurring action after the initial reading
          (Daily Pulse check-in, Compatibility invite, Timeline revisit, or Blueprint interaction).
          Measures whether AstroLens becomes a <em>recurring personal ritual</em> rather than a one-time novelty scan.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CENTRAL 8-STAGE PRODUCT LIFECYCLE FUNNEL
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>✦ LIFECYCLE CONVERSION ✦</span>
            <h2 className={styles.sectionTitle}>Product Funnel Architecture</h2>
          </div>
          <span className={styles.sectionTag}>
            {useDemoMode ? 'Estimated Cohort Progression' : 'Current Stage Progress'}
          </span>
        </div>

        <div className={styles.funnelContainer}>
          {PRODUCT_FUNNEL_STAGES.map((stage, idx) => {
            const isCompletedInLive =
              (!useDemoMode && idx === 0 && data.acquisition.totalScans > 0) ||
              (!useDemoMode && idx === 1 && data.activation.readingCompleted) ||
              (!useDemoMode && idx === 2 && data.activation.hasProfile) ||
              (!useDemoMode && idx === 3 && data.activation.pulseCompleted) ||
              (!useDemoMode && idx === 4 && data.virality.invitesGenerated > 0) ||
              (!useDemoMode && idx === 5 && data.virality.invitesShared > 0) ||
              (!useDemoMode && idx === 6 && data.monetization.blueprintUnlocked > 0) ||
              (!useDemoMode && idx === 7 && data.monetization.astroliveClicks > 0);

            return (
              <div key={stage.id} className={styles.funnelStep}>
                <div className={styles.funnelStepHeader}>
                  <div className={styles.funnelStepNum}>{idx + 1}</div>
                  <div className={styles.funnelStepInfo}>
                    <div className={styles.funnelStepName}>{stage.name}</div>
                    <div className={styles.funnelStepDesc}>{stage.desc}</div>
                  </div>
                  <div className={styles.funnelStepMetric}>
                    {useDemoMode ? (
                      <>
                        <span className={styles.funnelStepCount}>{stage.demoCount}</span>
                        <span className={styles.funnelStepPct}>{stage.demoPct}%</span>
                      </>
                    ) : (
                      <span className={isCompletedInLive ? styles.funnelLiveDone : styles.funnelLivePending}>
                        {isCompletedInLive ? '✓ Completed' : '○ Pending'}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.funnelProgressBar}>
                  <div
                    className={styles.funnelProgressFill}
                    style={{ width: useDemoMode ? `${stage.demoPct}%` : (isCompletedInLive ? '100%' : '0%') }}
                  />
                </div>
                {idx < PRODUCT_FUNNEL_STAGES.length - 1 && (
                  <div className={styles.funnelConnector} aria-hidden="true">↓</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5 CORE PRODUCT PILLARS (GRID)
          ══════════════════════════════════════════════════════════ */}
      <div className={styles.pillarsGrid}>
        {/* 1. ACQUISITION */}
        <div className={styles.pillarCard}>
          <div className={styles.pillarHeader}>
            <span className={styles.pillarIcon}>📡</span>
            <div>
              <span className={styles.pillarEyebrow}>PILLAR 01</span>
              <h3 className={styles.pillarTitle}>Acquisition</h3>
            </div>
          </div>

          <div className={styles.pillarStats}>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Total Palm Scans</span>
              <span className={styles.statVal}>{data.acquisition.totalScans}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Unique Local Profiles</span>
              <span className={styles.statVal}>{data.acquisition.uniqueProfiles}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Viral Influx (Invites)</span>
              <span className={styles.statVal}>
                {useDemoMode ? `${data.acquisition.cameViaInvite} Users` : (data.acquisition.cameViaInvite ? 'Yes' : 'None')}
              </span>
            </div>
          </div>

          <div className={styles.pillarFooter}>
            <span>Data Source: {data.acquisition.dataSourceLabel}</span>
          </div>
        </div>

        {/* 2. ACTIVATION */}
        <div className={styles.pillarCard}>
          <div className={styles.pillarHeader}>
            <span className={styles.pillarIcon}>⚡</span>
            <div>
              <span className={styles.pillarEyebrow}>PILLAR 02</span>
              <h3 className={styles.pillarTitle}>Activation</h3>
            </div>
          </div>

          <div className={styles.pillarStats}>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Reading Completion</span>
              <span className={styles.statVal}>{data.activation.rateReading}%</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Profile Name Created</span>
              <span className={styles.statVal}>{data.activation.rateProfile}%</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>First Pulse Completed</span>
              <span className={styles.statVal}>{data.activation.ratePulse}%</span>
            </div>
          </div>

          <div className={styles.pillarFooter}>
            <span>Composite Activation Score: {data.activation.activationScore}%</span>
          </div>
        </div>

        {/* 3. RETENTION */}
        <div className={styles.pillarCard}>
          <div className={styles.pillarHeader}>
            <span className={styles.pillarIcon}>🔥</span>
            <div>
              <span className={styles.pillarEyebrow}>PILLAR 03</span>
              <h3 className={styles.pillarTitle}>Retention</h3>
            </div>
          </div>

          <div className={styles.pillarStats}>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Current Pulse Streak</span>
              <span className={styles.statVal}>{data.retention.streak} Days</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Current Tier Milestone</span>
              <span className={styles.statVal}>{data.retention.pulseMilestone}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>7-Day Return Signal</span>
              <span className={styles.statVal} style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                {data.retention.returnSignal}
              </span>
            </div>
          </div>

          <div className={styles.pillarFooter}>
            <span>Habit Driver: Daily Palm Pulse</span>
          </div>
        </div>

        {/* 4. VIRALITY */}
        <div className={styles.pillarCard}>
          <div className={styles.pillarHeader}>
            <span className={styles.pillarIcon}>💫</span>
            <div>
              <span className={styles.pillarEyebrow}>PILLAR 04</span>
              <h3 className={styles.pillarTitle}>Virality</h3>
            </div>
          </div>

          <div className={styles.pillarStats}>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Compatibility Invites Made</span>
              <span className={styles.statVal}>{data.virality.invitesGenerated}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Invites Shared / Copied</span>
              <span className={styles.statVal}>{data.virality.invitesShared}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Viral Conversion Rate</span>
              <span className={styles.statVal}>
                {useDemoMode ? data.virality.connectionConversion : (data.virality.inviteConversions > 0 ? '100%' : 'Tracking')}
              </span>
            </div>
          </div>

          <div className={styles.pillarFooter}>
            <span>{data.virality.trackingNote}</span>
          </div>
        </div>

        {/* 5. MONETIZATION */}
        <div className={styles.pillarCard}>
          <div className={styles.pillarHeader}>
            <span className={styles.pillarIcon}>💎</span>
            <div>
              <span className={styles.pillarEyebrow}>PILLAR 05</span>
              <h3 className={styles.pillarTitle}>Monetization</h3>
            </div>
          </div>

          <div className={styles.pillarStats}>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Blueprint Views</span>
              <span className={styles.statVal}>{data.monetization.blueprintViews}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Checkout Opens</span>
              <span className={styles.statVal}>{data.monetization.checkoutOpens}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Digital Unlocks (₹399)</span>
              <span className={styles.statVal}>{data.monetization.blueprintUnlocked}</span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>Simulated Digital Revenue</span>
              <span className={styles.statVal} style={{ color: '#4ade80' }}>
                {data.monetization.simulatedRevenue}
              </span>
            </div>
            <div className={styles.pillarStatRow}>
              <span className={styles.statKey}>AstroLive Consultation Pipeline</span>
              <span className={styles.statVal} style={{ fontSize: '0.8rem', color: '#fde68a' }}>
                {data.monetization.astrolivePipeline}
              </span>
            </div>
          </div>

          <div className={styles.pillarFooter}>
            <span>Simulated Prototype Revenue · Not Real Financials</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          VIRAL LOOP ARCHITECTURE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>✦ VIRAL COEFFICIENT ARCHITECTURE ✦</span>
            <h2 className={styles.sectionTitle}>The Cosmic Compatibility Invite Loop</h2>
          </div>
          <span className={styles.sectionTag}>Built-in K-Factor Growth Loop</span>
        </div>

        <div className={styles.viralLoopContainer}>
          {[
            { step: '1', role: 'User A', action: 'Completes Palm Reading', icon: '✋' },
            { step: '2', role: 'User A', action: 'Runs Cosmic Compatibility', icon: '💫' },
            { step: '3', role: 'User A', action: 'Shares Personalized Invite Link', icon: '↗' },
            { step: '4', role: 'User B', action: 'Opens Invite (?compare=URL)', icon: '💌' },
            { step: '5', role: 'User B', action: 'Reveals Harmonic Connection', icon: '🔮' },
            { step: '6', role: 'User B', action: 'Becomes New AstroLens User', icon: '✨' },
          ].map((item) => (
            <div key={item.step} className={styles.viralStepCard}>
              <div className={styles.viralStepBadge}>Step {item.step}</div>
              <div className={styles.viralStepIcon}>{item.icon}</div>
              <div className={styles.viralStepRole}>{item.role}</div>
              <div className={styles.viralStepAction}>{item.action}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCT SIGNAL CARDS
          ══════════════════════════════════════════════════════════ */}
      <div className={styles.signalsGrid}>
        <div className={styles.signalCard}>
          <div className={styles.signalHeader}>
            <span className={styles.signalIcon}>✦</span>
            <span className={styles.signalTitle}>RETENTION SIGNAL</span>
          </div>
          <p className={styles.signalBody}>
            "Daily Pulse creates a morning check-in habit loop, pairing daily micro-reflection with streak milestone progression."
          </p>
        </div>

        <div className={styles.signalCard}>
          <div className={styles.signalHeader}>
            <span className={styles.signalIcon}>✦</span>
            <span className={styles.signalTitle}>VIRAL SIGNAL</span>
          </div>
          <p className={styles.signalBody}>
            "Compatibility gives users an authentic social rationale to invite a partner or friend via encoded recipient links."
          </p>
        </div>

        <div className={styles.signalCard}>
          <div className={styles.signalHeader}>
            <span className={styles.signalIcon}>✦</span>
            <span className={styles.signalTitle}>REVENUE SIGNAL</span>
          </div>
          <p className={styles.signalBody}>
            "Cosmic Blueprint converts curiosity into a ₹399 digital purchase by surfacing unresolved Key Patterns directly from palm lines."
          </p>
        </div>

        <div className={styles.signalCard}>
          <div className={styles.signalHeader}>
            <span className={styles.signalIcon}>✦</span>
            <span className={styles.signalTitle}>HUMAN ESCALATION</span>
          </div>
          <p className={styles.signalBody}>
            "AstroLive bridges automated AI readings into high-ticket live astrologer consultations (₹2,999 – ₹9,999)."
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PROPOSED TARGETS TO VALIDATE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>✦ HYPOTHESIS TESTING ✦</span>
            <h2 className={styles.sectionTitle}>Proposed Targets to Validate</h2>
          </div>
          <span className={styles.sectionTag}>Future Product Benchmarks</span>
        </div>

        <div className={styles.targetsTable}>
          {PROPOSED_TARGETS.map((t) => (
            <div key={t.metric} className={styles.targetRow}>
              <div className={styles.targetColMetric}>
                <span className={styles.targetCategory}>{t.category}</span>
                <strong>{t.metric}</strong>
              </div>
              <div className={styles.targetColGoal}>
                <span className={styles.targetPill}>{t.target}</span>
              </div>
              <div className={styles.targetColRationale}>
                {t.rationale}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.dashboardFooter}>
        <span>✦ AstroLens Growth Control · Hackathon Demonstration Architecture</span>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onNavigate('universe')}
        >
          Return to My Universe →
        </button>
      </footer>
    </div>
  );
}
