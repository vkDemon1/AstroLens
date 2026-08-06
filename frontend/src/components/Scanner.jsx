import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './Scanner.module.css';
import { scanPalm } from '../services/api';

const GUIDE_STEPS = [
  'Hold your dominant hand up to the camera, palm facing you.',
  'Spread your fingers slightly — not too wide.',
  'Keep your hand 20–40 cm from the camera.',
  'Ensure good lighting — avoid harsh shadows on the palm.',
];

const SCAN_STEPS = [
  { label: 'Capturing frame', icon: '📷' },
  { label: 'Detecting hand landmarks', icon: '✋' },
  { label: 'Analysing palm lines', icon: '🔍' },
  { label: 'Generating your reading', icon: '✨' },
];

export default function Scanner({ onResult, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase] = useState('init');
  const [guideStep, setGuideStep] = useState(0);
  const [handHint, setHandHint] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [scanStep, setScanStep] = useState(-1);   // which SCAN_STEPS is active
  const [scanPct, setScanPct] = useState(0);    // 0–100 progress

  // Cycle through guide steps
  useEffect(() => {
    const id = setInterval(() => {
      setGuideStep(s => (s + 1) % GUIDE_STEPS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Start the webcam
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase('preview');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Please allow camera access in your browser settings and try again.'
          : `Could not access camera: ${err.message}`
      );
      setPhase('error');
    }
  }, []);

  // Stop stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Capture frame and send to backend
  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setPhase('scanning');
    setHandHint('');
    setScanStep(0);
    setScanPct(0);

    // Countdown animation
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 700));
    }
    setCountdown(null);

    // Step 0 → 1: Capture frame
    setScanStep(0);
    setScanPct(10);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();
    const base64 = canvas.toDataURL('image/jpeg', 0.92);

    // Step 1: Detecting hand
    setScanStep(1);
    setScanPct(35);
    await new Promise(r => setTimeout(r, 400));

    try {
      // Step 2: Analysing lines (fire the request)
      setScanStep(2);
      setScanPct(60);

      const resultPromise = scanPalm(base64);

      // Tick to step 3 while waiting for the API
      await new Promise(r => setTimeout(r, 700));
      setScanStep(3);
      setScanPct(85);

      const result = await resultPromise;
      setScanPct(100);
      await new Promise(r => setTimeout(r, 300));

      if (!result.hand_detected) {
        setHandHint('No hand detected — please position your open palm directly in front of the camera.');
        setPhase('preview');
        setScanStep(-1);
        setScanPct(0);
        return;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      onResult(result);
    } catch (err) {
      setErrorMsg(`Scan failed: ${err.message}`);
      setPhase('preview');
      setScanStep(-1);
      setScanPct(0);
    }
  }, [onResult]);

  return (
    <div className={styles.scanner}>
      <div className={styles.header}>
        <button className="btn-ghost" id="scanner-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1 className={styles.title}>Palm Scanner</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className={styles.main}>
        {/* Camera viewport */}
        <div className={styles.viewportWrapper}>
          <div className={`${styles.viewport} ${phase === 'scanning' ? styles.scanning : ''}`}>
            {phase === 'init' && (
              <div className={styles.initOverlay}>
                <div className={styles.cameraIcon}>📷</div>
                <p>Camera access is needed to scan your palm.</p>
                <button
                  id="enable-camera-btn"
                  className="btn-primary"
                  onClick={startCamera}
                  style={{ marginTop: '1.5rem' }}
                >
                  Enable Camera
                </button>
              </div>
            )}

            {phase === 'error' && (
              <div className={styles.initOverlay}>
                <div className={styles.cameraIcon} style={{ filter: 'grayscale(1) opacity(0.5)' }}>⚠️</div>
                <p className={styles.errorText}>{errorMsg}</p>
                <button className="btn-secondary" onClick={startCamera} style={{ marginTop: '1.5rem' }}>
                  Try Again
                </button>
              </div>
            )}

            <video
              ref={videoRef}
              className={styles.video}
              style={{ display: phase === 'preview' || phase === 'scanning' ? 'block' : 'none' }}
              playsInline
              muted
              aria-label="Live webcam feed for palm scanning"
            />

            {/* Corner overlay guides */}
            {(phase === 'preview' || phase === 'scanning') && (
              <>
                <div className={`${styles.corner} ${styles.cornerTL}`} />
                <div className={`${styles.corner} ${styles.cornerTR}`} />
                <div className={`${styles.corner} ${styles.cornerBL}`} />
                <div className={`${styles.corner} ${styles.cornerBR}`} />
                <div className={styles.crosshair} />
              </>
            )}

            {/* Scan animation */}
            {phase === 'scanning' && (
              <div className={styles.scanLine} aria-hidden="true" />
            )}

            {/* Countdown */}
            {countdown !== null && (
              <div className={styles.countdown}>{countdown}</div>
            )}
          </div>

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
        </div>

        {/* Sidebar panel */}
        <div className={styles.sidebar}>
          {/* Guide steps */}
          <div className={`glass-card ${styles.guideCard}`}>
            <h3 className={styles.guideTitle}>✦ Positioning Guide</h3>
            <div className={styles.guideSteps}>
              {GUIDE_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`${styles.guideStep} ${i === guideStep ? styles.guideStepActive : ''}`}
                >
                  <span className={styles.guideStepNum}>{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hand hint */}
          {handHint && (
            <div className={styles.handHint}>
              <span>⚠️</span> {handHint}
            </div>
          )}

          {/* Scan button */}
          {(phase === 'preview') && (
            <button
              id="capture-scan-btn"
              className={`btn-primary ${styles.scanBtn}`}
              onClick={captureAndScan}
            >
              <span>🔮</span>
              Scan My Palm
            </button>
          )}

          {phase === 'scanning' && (
            <div className={styles.scanningStatus}>
              {/* Overall progress bar */}
              <div className={styles.progressBarWrap}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${scanPct}%` }}
                />
              </div>
              <div className={styles.progressPct}>{scanPct}%</div>

              {/* Step list */}
              <div className={styles.stepList}>
                {SCAN_STEPS.map((s, i) => {
                  const isDone = i < scanStep;
                  const isActive = i === scanStep;
                  return (
                    <div
                      key={i}
                      className={`${styles.stepItem} ${isDone ? styles.stepDone : ''} ${isActive ? styles.stepActive : ''}`}
                    >
                      <div className={styles.stepDot}>
                        {isDone ? '\u2713' : isActive ? <span className={styles.stepPulse} /> : null}
                      </div>
                      <span className={styles.stepIcon}>{s.icon}</span>
                      <span className={styles.stepLabel}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Privacy note */}
          <p className={styles.privacyNote}>
            🔒 Your palm image is processed instantly and never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
