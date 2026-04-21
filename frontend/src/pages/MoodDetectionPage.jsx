import { AnimatePresence, motion } from 'framer-motion';
import { Camera, LoaderCircle, ScanFace, Sparkles } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';
import EmotionOrbs from '../components/ui/EmotionOrbs';
import { analyzeMood, analyzeMoodDebug, saveMood } from '../services/moodService';

function MoodDetectionPage() {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [captureMessage, setCaptureMessage] = useState('');
  const [faceReady, setFaceReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [model, setModel] = useState(null);
  const [debugResult, setDebugResult] = useState(null);

  const debugBars = useMemo(() => {
    const scores = debugResult?.grouped_scores;
    if (!scores) return [];
    return [
      { key: 'Happy', value: scores.Happy || 0, color: 'bg-emerald-400/80' },
      { key: 'Neutral', value: scores.Neutral || 0, color: 'bg-sky-400/80' },
      { key: 'Sad', value: scores.Sad || 0, color: 'bg-rose-400/80' }
    ].sort((a, b) => b.value - a.value);
  }, [debugResult]);

  const orbs = useMemo(() => {
    if (!lastResult) return [];
    return [
      { emotion: lastResult.emotion, confidence: lastResult.confidence, color: 'bg-emotion-happy' },
      { emotion: 'Confidence', confidence: lastResult.confidence, color: 'bg-emotion-neutral' },
      { emotion: 'Stability', confidence: Math.min(1, 1 - (debugBars[0]?.value || 0)), color: 'bg-emotion-sad' }
    ];
  }, [debugBars, lastResult]);

  const statusText = useMemo(() => {
    if (loading) return 'Analyzing frame...';
    if (captureMessage) return captureMessage;
    if (!lastResult) return 'Camera online. Capture a frame and run AI mood detection.';
    if (lastResult.confidence < 0.5) {
      return 'Low-confidence result. Keep your face centered with better light and try again.';
    }
    return `Detected ${lastResult.emotion} (${Math.round(lastResult.confidence * 100)}% confidence)`;
  }, [loading, captureMessage, lastResult]);

  const loadModel = async () => {
    if (model) return model;
    const loaded = await blazeface.load();
    setModel(loaded);
    setFaceReady(true);
    return loaded;
  };

  const analyzeCurrentFrame = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;

    const frameBase64 = screenshot.split(',')[1];
    setLoading(true);
    setSaved(false);
    setCaptureMessage('');

    try {
      const faceModel = await loadModel();
      const video = webcamRef.current?.video;
      if (video) {
        const predictions = await faceModel.estimateFaces(video, false);
        const hasFace = predictions.length > 0;
        setFaceDetected(hasFace);
        if (!hasFace) {
          setLastResult(null);
          setDebugResult(null);
          setCaptureMessage('No face detected. Move closer to the camera and keep your face in frame.');
          return;
        }
      }

      let result;
      try {
        const debug = await analyzeMoodDebug(frameBase64);
        setDebugResult(debug);
        result = {
          emotion: debug.emotion,
          confidence: debug.confidence
        };
      } catch {
        setDebugResult(null);
        result = await analyzeMood(frameBase64);
      }

      setLastResult(result);
      if (result.confidence < 0.5) {
        setCaptureMessage('Face detected but confidence is low. Try a front-facing pose with brighter light.');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentMood = async () => {
    if (!lastResult) return;
    await saveMood({
      emotion: lastResult.emotion,
      confidence: lastResult.confidence,
      source: 'webcam'
    });
    setSaved(true);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <div className="glass neo-border rounded-3xl p-5 lg:col-span-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-slate-100">Mood Detection Panel</h2>
            <p className="text-sm text-slate-400">
              Webcam stream is processed in-session. No raw image is stored on the backend.
            </p>
          </div>
          <div className="rounded-full border border-cyan-300/35 bg-cyan-300/10 p-2 text-cyan-100">
            <Camera size={18} />
          </div>
        </div>

        <motion.div
          animate={loading ? { boxShadow: '0 0 0 1px rgba(45,226,230,.35), 0 0 40px rgba(45,226,230,.2)' } : {}}
          className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/30 p-2"
        >
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
            className="aspect-video w-full rounded-xl object-cover"
          />

          <motion.div
            animate={loading ? { top: ['0%', '100%'], opacity: [0, 0.7, 0] } : { opacity: 0 }}
            transition={{ duration: 2.1, repeat: loading ? Infinity : 0, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-4 right-4 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
          />

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/70 px-3 py-1 text-xs backdrop-blur-xl">
            <ScanFace size={14} className={faceDetected ? 'text-teal-300' : 'text-slate-400'} />
            {faceDetected ? 'Face detected' : 'Awaiting face lock'}
          </div>
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="ripple-btn inline-flex items-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-400/15 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
            onClick={analyzeCurrentFrame}
            disabled={loading}
            type="button"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Analyze Mood
          </button>
          <button
            className="ripple-btn rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10 disabled:opacity-50"
            onClick={saveCurrentMood}
            disabled={!lastResult}
            type="button"
          >
            Save Mood
          </button>
        </div>

        <AnimatePresence>
          {saved ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-2xl border border-teal-400/25 bg-teal-400/10 px-4 py-3 text-sm text-teal-100"
            >
              Mood entry saved successfully.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid gap-4 lg:col-span-4">
        <div className="glass neo-border rounded-3xl p-5">
          <h3 className="font-display text-lg text-slate-100">Live Emotion Badge</h3>
          <p className="mt-1 text-sm text-slate-400">AI status stream and mood confidence.</p>

          <motion.div
            animate={{ scale: loading ? [1, 1.03, 1] : 1 }}
            transition={{ duration: 1.4, repeat: loading ? Infinity : 0 }}
            className="mt-4 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">Emotion</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">{lastResult?.emotion || 'Neutral'}</p>
            <p className="mt-1 text-sm text-slate-300">Confidence: {Math.round((lastResult?.confidence || 0) * 100)}%</p>
          </motion.div>

          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{statusText}</p>
            <p>Face model: {faceReady ? 'Ready' : 'Loads on first scan'}</p>
            {debugResult ? <p>Detector: {debugResult.detection_method} ({debugResult.fer_available ? 'FER ready' : 'Fallback mode'})</p> : null}
          </div>
        </div>

        <div className="glass neo-border rounded-3xl p-5">
          <h3 className="font-display text-lg text-slate-100">Emotion Orbs</h3>
          <p className="mt-1 text-sm text-slate-400">Animated confidence cues for the detected emotional mix.</p>
          <div className="mt-4">
            <EmotionOrbs items={orbs.length ? orbs : undefined} />
          </div>
        </div>

        <div className="glass neo-border rounded-3xl p-5">
          <h3 className="font-display text-lg text-slate-100">Score Buckets</h3>
          {debugResult?.grouped_scores ? (
            <div className="mt-3 space-y-2 text-xs text-slate-200">
              {debugBars.map((bar) => (
                <div key={bar.key}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span>{bar.key}</span>
                    <span>{Math.round(bar.value * 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${bar.color} transition-all duration-300`}
                      style={{ width: `${Math.max(4, Math.round(bar.value * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">Run a scan to reveal grouped model scores.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MoodDetectionPage;
