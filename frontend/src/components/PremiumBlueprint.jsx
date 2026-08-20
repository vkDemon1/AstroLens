import { useState, useEffect } from 'react';
import styles from './PremiumBlueprint.module.css';
import {
  generateCosmicBlueprint,
  isBlueprintUnlocked,
  setBlueprintUnlocked,
  trackBlueprintEvent,
} from '../utils/blueprintEngine';

/**
 * AstroLens — Premium Cosmic Blueprint Screen (Phase 5A)
 *
 * Provides a 12-section personalized deep dossier preview, demo checkout simulation ($4.99),
 * unlocked report reveal, and high-intent AstroLive consultation bridge.
 *
 * @param {object} props
 * @param {object} props.result - User's palm reading data from scan or profile
 * @param {function} props.onNavigate - Global screen navigation callback
 */
export default function PremiumBlueprint({ result, onNavigate }) {
  const [unlocked, setUnlocked] = useState(() => isBlueprintUnlocked());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const blueprint = generateCosmicBlueprint(result);
  const { meta, sections } = blueprint;

  useEffect(() => {
    trackBlueprintEvent('blueprint_viewed', { archetype: meta.archetype, unlocked });
  }, [meta.archetype, unlocked]);

  const handleOpenCheckout = () => {
    setIsModalOpen(true);
    trackBlueprintEvent('blueprint_checkout_opened', { price: '$4.99' });
  };

  const handleConfirmPurchase = () => {
    setBlueprintUnlocked(true);
    setUnlocked(true);
    setIsModalOpen(false);
    trackBlueprintEvent('blueprint_demo_unlocked', { price: '$4.99', timestamp: Date.now() });
  };

  const handleAstroLiveClick = () => {
    trackBlueprintEvent('astrolive_cta_clicked', { source: 'blueprint_funnel' });
  };

  return (
    <div className={styles.blueprintPage}>
      {/* ── Top Nav Breadcrumb ── */}
      <div className={styles.topNav}>
        <button
          className={styles.backBtn}
          id="bp-back-btn"
          onClick={() => onNavigate('result')}
        >
          ← Return to Reading
        </button>
        <span className={styles.dossierBadge}>✦ 12-PAGE PERSONALIZED DOSSIER ✦</span>
      </div>

      {/* ── Hero Header ── */}
      <div className={styles.dossierHero}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>✦ CONFIDENTIAL ESOTERIC SYNTHESIS ✦</span>
          <h1 className={styles.dossierTitle}>The Cosmic Blueprint</h1>
          <p className={styles.dossierSubtitle}>
            Personalized deep reading mapped for <strong>{meta.name}</strong> based on palm crease geometry, elemental resonance, and planetary transits.
          </p>

          <div className={styles.metaRow}>
            <span className={styles.metaChip}>Archetype: {meta.archetype}</span>
            <span className={styles.metaChip}>Element: {meta.luckyElement}</span>
            <span className={styles.metaChip}>Compiled: {meta.generatedAt}</span>
          </div>
        </div>

        <div className={styles.heroScoreOrb}>
          <span className={styles.scoreNum}>{meta.auraScore}</span>
          <span className={styles.scoreTag}>Aura Index</span>
        </div>
      </div>

      {/* ── Status / Unlock Banner ── */}
      {!unlocked ? (
        <div className={styles.unlockBanner}>
          <div className={styles.unlockLeft}>
            <h3 className={styles.unlockTitle}>Unlock Your Complete 12-Page Blueprint</h3>
            <p className={styles.unlockDesc}>
              Preview active. Unlock full career timings, love cycles, hidden palm markings, and next 90-day forecast.
            </p>
            <div className={styles.featurePillRow}>
              <span className={styles.featurePill}>✓ 12 Detailed Sections</span>
              <span className={styles.featurePill}>✓ Career Windows</span>
              <span className={styles.featurePill}>✓ Hidden Palm Patterns</span>
              <span className={styles.featurePill}>✓ Action Guidance</span>
            </div>
          </div>

          <div className={styles.unlockRight}>
            <div className={styles.priceTag}>$4.99</div>
            <span className={styles.priceSub}>One-Time Demo Access</span>
            <button
              type="button"
              id="bp-unlock-main-btn"
              className={styles.btnUnlockPrimary}
              onClick={handleOpenCheckout}
            >
              <span>✦</span> Unlock Blueprint — $4.99
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.unlockedBanner}>
          <div className={styles.unlockedText}>
            <span>✓</span>
            <span>COSMIC BLUEPRINT FULLY UNLOCKED & PRESERVED</span>
          </div>
          <span className={styles.featurePill} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7' }}>
            Permanent Access
          </span>
        </div>
      )}

      {/* ── 12 Dossier Sections ── */}
      <div className={styles.sectionsContainer}>
        {sections.map((sec) => {
          const isSectionVisible = unlocked || sec.previewAllowed;

          return (
            <div key={sec.id} className={styles.sectionCard} id={`bp-section-${sec.id}`}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <span className={styles.sectionNumBadge}>{sec.number}</span>
                  <span className={styles.sectionIcon}>{sec.icon}</span>
                  <h3 className={styles.sectionTitleText}>{sec.title}</h3>
                </div>

                {!isSectionVisible && (
                  <span className={styles.lockPill}>🔒 LOCKED</span>
                )}
              </div>

              <div className={styles.sectionSummary}>{sec.summary}</div>

              {isSectionVisible ? (
                <>
                  <p className={styles.sectionBody}>{sec.content}</p>
                  <div className={styles.takeawayBox}>
                    <strong>Key Alignment Directive:</strong> {sec.takeaway}
                  </div>
                </>
              ) : (
                <div className={styles.lockedContentArea}>
                  <p className={`${styles.sectionBody} ${styles.blurredText}`}>
                    {sec.content}
                  </p>
                  <div className={styles.lockedOverlay}>
                    <span className={styles.lockedMessage}>✦ Section Locked in Preview Mode ✦</span>
                    <button
                      type="button"
                      className={styles.btnInlineUnlock}
                      onClick={handleOpenCheckout}
                    >
                      Unlock for $4.99 →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── AstroLive Consultation Revenue Funnel ── */}
      <div className={styles.astroliveFunnelCard}>
        <span className={styles.eyebrow}>✦ BEYOND THE BLUEPRINT · HUMAN SYNTHESIS ✦</span>
        <h2 className={styles.astroliveTitle}>Your Blueprint Identified a Rare Planetary Transition</h2>
        <p className={styles.astroliveSub}>
          Some deep life questions require an intuitive human master. Connect 1-on-1 with a verified AstroLive astrologer to overlay your exact birth coordinates onto your palm line geometry.
        </p>

        <a
          id="bp-astrolive-consult-btn"
          href="https://astrotalk.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnAstroLiveConsult}
          onClick={handleAstroLiveClick}
        >
          <span>📞</span> Talk to an AstroLive Astrologer
        </a>
        <p className={styles.astroliveNote}>Powered by AstroLive — 10M+ Consultations Worldwide</p>
      </div>

      {/* ── Demo Checkout Modal ── */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalBadge}>✦ HACKATHON DEMO CHECKOUT ✦</div>
              <h3 className={styles.modalTitle}>Unlock Your Cosmic Blueprint</h3>
            </div>

            <div className={styles.modalPriceBox}>
              <div>
                <div className={styles.modalProductName}>12-Page Personalized Dossier</div>
                <div className={styles.modalProductSub}>AstroLens Premium Edition</div>
              </div>
              <div className={styles.modalPriceAmount}>$4.99</div>
            </div>

            <div className={styles.modalFeatureList}>
              <div>✓ Full Career Timing & Vocational Windows</div>
              <div>✓ Deep Love Cycles & Emotional Resonance</div>
              <div>✓ Hidden Palm Markings & Mount Analysis</div>
              <div>✓ 90-Day Celestial Forecast & Action Mantras</div>
              <div>✓ Instant Unlocking & Permanent Local Access</div>
            </div>

            <div className={styles.modalDisclaimer}>
              💡 <strong>Demo Prototype Notice:</strong> This is an interactive hackathon demonstration of the AstroLens monetization funnel. Zero real payment or credit card details are collected.
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                id="modal-confirm-purchase-btn"
                className={styles.btnModalConfirm}
                onClick={handleConfirmPurchase}
              >
                ✦ Complete Demo Purchase ($4.99)
              </button>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
