import styles from './History.module.css';

const AURA_BG = (color) =>
  `radial-gradient(circle, ${color}22 0%, transparent 70%)`;

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return 'Just now';
}

export default function History({ onNavigate }) {
  const rawHistory = localStorage.getItem('astrolens_history') || '[]';
  let history = [];
  try { history = JSON.parse(rawHistory); } catch { history = []; }

  const clearHistory = () => {
    if (confirm('Clear all reading history?')) {
      localStorage.removeItem('astrolens_history');
      window.location.reload();
    }
  };

  const deleteEntry = (id) => {
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem('astrolens_history', JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div className={styles.historyPage}>
      <div className={styles.header}>
        <button className="btn-ghost" id="history-back-btn" onClick={() => onNavigate('landing')}>
          ← Home
        </button>
        <h1 className={styles.pageTitle}>Reading History</h1>
        {history.length > 0 ? (
          <button className="btn-ghost" id="clear-history-btn" onClick={clearHistory} style={{ color: '#ff6b6b' }}>
            Clear All
          </button>
        ) : (
          <div style={{ width: 80 }} />
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔮</div>
          <h2 className={styles.emptyTitle}>No readings yet</h2>
          <p className={styles.emptyText}>
            Scan your palm to receive your first cosmic reading.
            Your history will be saved here automatically when you download a card.
          </p>
          <button className="btn-primary" id="history-scan-btn" onClick={() => onNavigate('scanner')}>
            Scan My Palm
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {history.map((entry) => (
            <div
              key={entry.id}
              className={`glass-card ${styles.entryCard}`}
              style={{ background: AURA_BG(entry.aura_color) }}
            >
              <div className={styles.entryHeader}>
                <div
                  className={styles.auraOrb}
                  style={{
                    background: `radial-gradient(circle, ${entry.aura_color}55, ${entry.aura_color}11)`,
                    boxShadow: `0 0 16px ${entry.aura_color}44`,
                  }}
                >
                  <span className={styles.auraScoreNum}>{entry.aura_score}</span>
                </div>
                <div>
                  <div className={styles.entryArchetype} style={{ color: entry.aura_color }}>
                    {entry.archetype_name}
                  </div>
                  <div className={styles.entryTime}>{timeAgo(entry.timestamp)}</div>
                </div>
                <button
                  className={styles.deleteBtn}
                  id={`delete-entry-${entry.id}`}
                  onClick={() => deleteEntry(entry.id)}
                  aria-label="Delete this reading"
                >
                  ×
                </button>
              </div>

              <h3 className={styles.entryTitle}>{entry.title}</h3>

              <div className={styles.entryBars}>
                {[
                  { label: 'Life',  score: entry.life_score },
                  { label: 'Head',  score: entry.head_score },
                  { label: 'Heart', score: entry.heart_score },
                ].map(line => (
                  <div key={line.label} className={styles.entryBar}>
                    <span className={styles.entryBarLabel}>{line.label}</span>
                    <div className={styles.entryBarTrack}>
                      <div
                        className={styles.entryBarFill}
                        style={{
                          width: `${Math.round(line.score * 100)}%`,
                          background: entry.aura_color,
                        }}
                      />
                    </div>
                    <span className={styles.entryBarPct}>{Math.round(line.score * 100)}%</span>
                  </div>
                ))}
              </div>

              <div className={styles.entryFooter}>
                <span className="badge badge--gold">✦ {entry.lucky_element}</span>
                <span className={styles.entryDate}>
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
