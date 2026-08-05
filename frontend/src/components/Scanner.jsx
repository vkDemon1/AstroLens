import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './Scanner.module.css';
import { scanPalm } from '../services/api';

const GUIDE_STEPS = [
  'Hold your dominant hand up to the camera, palm facing you.',
  'Spread your fingers slightly — not too wide.',
  'Keep your hand 20–40 cm from the camera.',
  'Ensure good lighting — avoid harsh shadows on the palm.',
];

export default function Scanner({ onResult, onBack }) {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);

  const [phase, setPhase]         = useState('init');   // init | preview | scanning | error
  const [guideStep, setGuideStep] = useState(0);
  const [handHint, setHandHint]   = useState('');
  const [errorMsg, setErrorMsg]   = useState('');
  const [countdown, setCountdown] = useState(null);

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
          width:  { ideal: 1280 },
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

    // Countdown animation
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 700));
    }
    setCountdown(null);

    // Draw video frame to canvas and export as base64 JPEG
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Mirror the frame (webcam is usually mirrored; un-mirror for CV)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    const base64 = canvas.toDataURL('image/jpeg', 0.92);

    try {
      const result = await scanPalm(base64);

      if (!result.hand_detected) {
        setHandHint('No hand detected — please position your open palm directly in front of the camera.');
        setPhase('preview');
        return;
      }

      // Stop camera before navigating away
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      onResult(result);
    } catch (err) {
      setErrorMsg(`Scan failed: ${err.message}`);
      setPhase('preview');
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
              <div className={styles.scanningSpinner} />
              <span className="shimmer-text">Analysing your cosmic blueprint...</span>
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
