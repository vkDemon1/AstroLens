import { useState, useEffect } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import LandingPage from './components/LandingPage';
import Scanner     from './components/Scanner';
import ResultCard  from './components/ResultCard';
import History     from './components/History';
import { getDemoReading } from './services/api';

const DEMO_FALLBACK = {
  hand_detected: true,
  aura_score: 78,
  aura_color: '#e63946',
  archetype_name: 'Crimson Trailblazer',
  aura_hex_name: 'Crimson',
  title: 'The Constellation of the Bold',
  reading: 'Your Life line carves through your palm like a river refusing to be dammed \u2014 raw, unstoppable vitality that fuels every ambition you dare to chase. The Head line\'s unwavering clarity reveals a strategist who sees three moves ahead while the world is still reading the board. Your Heart line pulses with the quiet confidence of someone who has learned to love without losing themselves.',
  career_insight: 'Leadership is not your destination \u2014 it is simply where you naturally arrive.',
  energy_insight: 'Your energy peaks under pressure; seek challenges that match your fire.',
  lucky_element: 'Fire',
  cta_teaser: 'Your chart holds a rare planetary alignment this quarter \u2014 a live astrologer can reveal your exact timing window.',
  life:  { score: 0.82, label: 'deeply etched and dominant' },
  head:  { score: 0.71, label: 'clearly pronounced' },
  heart: { score: 0.65, label: 'clearly pronounced' },
};

/**
 * AstroLens — Root Application
 *
 * Manages global screen state:
 *   landing → scanner → result
 *              ↑_________↓ (rescan)
 *   Any screen → history → landing
 *
 * URL ?demo=true skips the camera and loads a pre-baked reading.
 */
export default function App() {
  const [screen, setScreen]   = useState('landing');
  const [result, setResult]   = useState(null);

  // Handle ?demo=true query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      getDemoReading()
        .then(r => {
          setResult(r);
          setScreen('result');
        })
        .catch(() => {
          // Backend not running — fall back to inline demo
          setResult(DEMO_FALLBACK);
          setScreen('result');
        });
    }
  }, []);

  const navigate = (to, data = null) => {
    if (data) setResult(data);
    setScreen(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const screens = {
    landing: (
      <LandingPage
        onNavigate={navigate}
      />
    ),
    scanner: (
      <Scanner
        onResult={(r) => navigate('result', r)}
        onBack={() => navigate('landing')}
      />
    ),
    result: result ? (
      <ResultCard
        result={result}
        onRescan={() => navigate('scanner')}
        onNavigate={navigate}
      />
    ) : null,
    history: (
      <History
        onNavigate={navigate}
      />
    ),
  };

  return (
    <div className="app">
      {/* Animated cosmos canvas — constellations + meteor shower */}
      <CosmosCanvas />

      {/* Navigation */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <button
          className="nav-logo"
          id="nav-logo-btn"
          onClick={() => navigate('landing')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="logo-icon" aria-hidden="true">✦</span>
          AstroLens
        </button>

        <div className="nav-tabs" role="tablist">
          {[
            { id: 'nav-home',    label: 'Home',    to: 'landing'  },
            { id: 'nav-scan',    label: 'Scan',    to: 'scanner'  },
            { id: 'nav-history', label: 'History', to: 'history'  },
          ].map(tab => (
            <button
              key={tab.to}
              id={tab.id}
              className={`nav-tab ${screen === tab.to ? 'active' : ''}`}
              onClick={() => navigate(tab.to)}
              role="tab"
              aria-selected={screen === tab.to}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main className="page-content" role="main">
        {screens[screen]}
      </main>
    </div>
  );
}
