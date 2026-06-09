import { useState, useRef, useEffect } from "react";
import { Mic, Square, Sparkles, FolderUp, Activity, HelpCircle, Loader2, ExternalLink } from "lucide-react";
import { playHoverSfx, playClickSfx, playSuccessSfx, playErrorSfx } from "@/src/utils/audio";
import { DigitHistory } from "@/src/types";
import { getTranslatedPhonetic } from "@/src/utils/languages";
import { getTranslatedUI, t } from "@/src/utils/translations";

interface HomeViewProps {
  onNavigate: (page: string) => void;
  onAddHistory: (record: DigitHistory) => void;
  onResetProfile?: () => void;
  userProfile?: any;
  appLanguage?: string;
}

export default function HomeView({ 
  onNavigate, 
  onAddHistory, 
  onResetProfile, 
  userProfile,
  appLanguage = "English (US)"
}: HomeViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0.0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzerStatus, setAnalyzerStatus] = useState("");
  const [errorText, setErrorText] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Mystic Hologram Digit matrix states and handlers
  const [mysticStep, setMysticStep] = useState<"idle" | "calculating" | "ready">("idle");
  const [activeMatrixChar, setActiveMatrixChar] = useState("7");
  const [mysticFloatingDigits, setMysticFloatingDigits] = useState<{ id: number; char: string; left: number; delay: number }[]>([]);
  const [micFloatingDigits, setMicFloatingDigits] = useState<{ id: number; char: string; left: number; delay: number; color: string; scale: number; speed: number }[]>([]);
  const floatIdCounterRef = useRef(0);
  const micFloatIdCounterRef = useRef(0);

  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [micHintText, setMicHintText] = useState("RECORD");

  // Spin mic hints periodically
  useEffect(() => {
    const hints = ["RECORD", "RECORD", "TAP TO SENSE", "RECORD", "VOICE STREAM", "RECORD"];
    const interval = setInterval(() => {
      setMicHintText(hints[Math.floor(Math.random() * hints.length)]);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Interval to change the main rotating character
  useEffect(() => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "α", "β", "γ", "δ", "ε"];
    const interval = setInterval(() => {
      if (mysticStep === "idle") {
        const rand = Math.random();
        if (rand < 0.25) {
          setActiveMatrixChar("PRESS ME!");
        } else if (rand < 0.40) {
          setActiveMatrixChar("⚡ CLASSIFY ⚡");
        } else {
          setActiveMatrixChar(chars[Math.floor(Math.random() * chars.length)]);
        }
      } else if (mysticStep === "calculating") {
        const loadingTexts = ["DECODING...", "SENSING FEATS...", "RESONATING...", "NEURAL STACK..."];
        setActiveMatrixChar(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
      } else {
        setActiveMatrixChar("READY! 📡");
      }
    }, 450);

    return () => clearInterval(interval);
  }, [mysticStep]);

  // Interval to spawn individual floating digits continuously with NO STOPPING (mystical box)
  useEffect(() => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "α", "β", "γ", "δ", "ε"];
    const spawnInterval = setInterval(() => {
      const nextChar = chars[Math.floor(Math.random() * chars.length)];
      floatIdCounterRef.current += 1;
      const newDigit = {
        id: floatIdCounterRef.current,
        char: nextChar,
        left: Math.floor(Math.random() * 80) + 10, // 10% to 90%
        delay: Math.random() * 0.2
      };
      setMysticFloatingDigits((prev) => {
        const kept = prev.slice(-14); // Keep only last 15 elements to avoid leaks
        return [...kept, newDigit];
      });
    }, 280);

    return () => clearInterval(spawnInterval);
  }, []);

  // Interval to spawn individual floating digits from MICROPHONE itself continuously with NO STOPPING
  useEffect(() => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const colors = ["#92dbff", "#c4c0ff", "#ff5352", "#98ec2a", "#ffcf36"];
    
    const microphoneSpawnInterval = setInterval(() => {
      const nextChar = chars[Math.floor(Math.random() * chars.length)];
      micFloatIdCounterRef.current += 1;
      
      const direction = Math.random() > 0.5 ? 1 : -1;
      // Sideways drift distance from the center, e.g. 100px to 220px (left or right)
      const driftX = direction * (Math.floor(Math.random() * 120) + 120); 
      // Gentle vertical wave drift (e.g., small wave or slow rise/fall)
      const driftY = Math.floor(Math.random() * 80) - 40; 

      const newDigit = {
        id: micFloatIdCounterRef.current,
        char: nextChar,
        left: 50, // centered on center point
        top: 50,  // centered on center point
        delay: Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: parseFloat((Math.random() * 0.5 + 0.85).toFixed(2)), // 0.85x to 1.35x size scale
        speed: parseFloat((Math.random() * 2.0 + 3.5).toFixed(2)),  // 3.5s to 5.5s (very slow & elegant!)
        driftX,
        driftY
      };

      setMicFloatingDigits((prev) => {
        const kept = prev.slice(-24); // Keep buffer healthy since they stay on screen longer
        return [...kept, newDigit];
      });
    }, 320); // Spawn slightly less frequently to keep the visual clean with slow motion

    return () => clearInterval(microphoneSpawnInterval);
  }, []);

  const handleMysticBoxClick = () => {
    if (mysticStep === "calculating") return;
    
    playClickSfx();
    
    if (mysticStep === "idle") {
      setMysticStep("calculating");
      
      // Simulate rapid calculation
      setTimeout(() => {
        playSuccessSfx();
        setMysticStep("ready");
      }, 1500);
    } else if (mysticStep === "ready") {
      // Choose a random digit to save as results
      const chosenDigit = Math.floor(Math.random() * 10); // 0 to 9
      localStorage.setItem("auron_pending_mystical_digit", String(chosenDigit));
      
      // Temporarily sign out if signed in, to show the clean register/signup path they requested
      if (onResetProfile) {
        onResetProfile();
      }
      localStorage.removeItem("auron_user_profile");
      
      // Redirect to signup
      onNavigate("signup");
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio nodes for live visualization
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopTimer();
      stopVisualization();
    };
  }, []);

  const startTimer = () => {
    setRecordTime(0.0);
    timerRef.current = setInterval(() => {
      setRecordTime((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Setup Web Audio Visualizer
  const startVisualization = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      // Draw loop
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasCtx = canvas.getContext("2d");
      if (!canvasCtx) return;

      const draw = () => {
        if (!analyserRef.current || !canvasRef.current) return;
        animationFrameRef.current = requestAnimationFrame(draw);

        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        analyserRef.current.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = "#05050a";
        canvasCtx.fillRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.9;
          
          // Color gradient: cyan to purple
          const r = Math.floor(196 - (i / bufferLength) * 50);
          const g = Math.floor(192 + (i / bufferLength) * 30);
          const b = Math.floor(255);
          
          canvasCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
          
          // Draw symmetric vertical bars for sci-fi feel
          canvasCtx.fillRect(x, (height - barHeight) / 2, barWidth - 1, barHeight);
          x += barWidth;
        }
      };

      draw();
    } catch (err) {
      console.warn("Could not bootstrap audio visualizer:", err);
    }
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const handleStartRecording = async () => {
    playClickSfx();
    setErrorText("");
    setPermissionDenied(false);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopTimer();
        stopVisualization();
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        if (audioBlob.size < 2000) {
          setErrorText("Captured audio was too short. Please speak clearly.");
          playErrorSfx();
          return;
        }

        await processAudioForPrediction(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
      startVisualization(stream);
    } catch (err: any) {
      console.error("GetUserMedia Error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError" || err.message?.includes("Permission") || err.name?.includes("Permission")) {
        setPermissionDenied(true);
        setErrorText("Microphone permission was denied by your secure browser environment.");
      } else {
        setErrorText(`Microphone access is prohibited. Reason: ${err.message || err.name || "Access blocked"}`);
      }
      playErrorSfx();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      playClickSfx();
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioForPrediction = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setAnalyzerStatus("Acquiring raw vocal packets...");

    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      try {
        const base64DataString = reader.result as string;
        // Trim standard header
        const base64AudioPayload = base64DataString.split(",")[1];

        setAnalyzerStatus("Demuxing and mapping frequency intervals...");
        await delayTime(1200);

        setAnalyzerStatus("Feeding neural digit classification matrix...");
        const response = await fetch("/api/recognize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio: base64AudioPayload,
            mimeType: audioBlob.type || "audio/wav",
          }),
        });

        if (!response.ok) {
          throw new Error("Auron classification engine returned failure status.");
        }

        const data = await response.json();

        // Create elegant historical log
        const newRecord: DigitHistory = {
          id: `live_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          digit: typeof data.digit === "number" ? data.digit : 0,
          english: data.english || "unknown",
          greek: getTranslatedPhonetic(typeof data.digit === "number" ? data.digit : 0),
          confidence: data.confidence || 0.90,
          analysis: data.analysis || "Processed via modern zero-shot neural analyzer.",
          filename: `live_recording_${Date.now().toString().slice(-4)}.wav`,
          durationSecs: recordTime > 0 ? recordTime : 2.5,
          isLive: true,
          audioData: URL.createObjectURL(audioBlob),
          isMock: !!data.isMock
        };

        playSuccessSfx();
        
        if (!userProfile) {
          try {
            // Save to localStorage as a pending live record
            localStorage.setItem("auron_pending_live_record", JSON.stringify(newRecord));
          } catch (e) {}
          setShowSignupPopup(true);
        } else {
          onAddHistory(newRecord);
          // Redirect to results to showcase the absolute masterpiece predicted!
          onNavigate("results");
        }
      } catch (err: any) {
        console.error("Analysis failed:", err);
        setErrorText("Network latency timeout or invalid response from recognition server.");
        playErrorSfx();
      } finally {
        setIsAnalyzing(false);
      }
    };
  };

  const delayTime = (ms: number) => new Promise((r) => setTimeout(r, ms));

  return (
    <div className="flex-grow flex flex-col justify-center items-center relative py-12 px-6">
      
      {/* GLOWING MICROPHONE VIEWPORT / ANALYSIS TERMINAL */}
      <div className="relative mb-12 flex flex-col items-center">
        {isAnalyzing ? (
          /* High Tech Spinning Loading Matrix */
          <div className="w-32 h-32 rounded-full border border-primary/20 bg-[#131319]/80 backdrop-blur-xl flex flex-col items-center justify-center relative z-10 shadow-[0_0_40px_rgba(196,192,255,0.25)]">
            <div className="absolute inset-0 rounded-full border-2 border-t-[#92dbff] border-r-transparent border-b-[#c4c0ff] border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
            <Loader2 className="w-10 h-10 text-[#92dbff] animate-pulse" />
          </div>
        ) : isRecording ? (
          /* Live Acoustic Visualizer Canvas & Indicator */
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping scale-125" style={{ animationDuration: '2s' }} />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <canvas 
                ref={canvasRef} 
                width={200} 
                height={80} 
                className="w-48 h-20 rounded bg-[#05050a] border border-[#ff5352]/20 mb-3"
              />
              <button
                onClick={handleStopRecording}
                onMouseEnter={playHoverSfx}
                className="w-16 h-16 rounded-full bg-[#ff5352] flex items-center justify-center text-[#ffffff] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,83,82,0.4)] cursor-pointer"
              >
                <Square className="w-6 h-6 fill-current text-white" />
              </button>
              <div className="font-mono text-[10px] text-[#ff5352] tracking-widest mt-1 animate-pulse flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5352] inline-block animate-ping" />
                Live: {recordTime.toFixed(1)}s Spoken
              </div>
            </div>
          </div>
        ) : (
          /* Default Static Microphone Design centered appropriately */
          <div className="relative">
            {/* CONTINUOUS MIC FLOATING DIGITS STREAM (NO STOPPING) */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
              {micFloatingDigits.map((d) => (
                <span
                  key={d.id}
                  className="absolute font-mono font-bold select-none opacity-0"
                  style={{
                    left: `${d.left}%`,
                    top: `${d.top}%`,
                    color: d.color,
                    fontSize: `${11 * d.scale}px`,
                    textShadow: `0 0 10px ${d.color}`,
                    animation: `micFloat ${d.speed}s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                    animationDelay: `${d.delay}s`,
                    "--drift-x": `${d.driftX}px`,
                    "--drift-y": `${d.driftY}px`
                  } as any}
                >
                  {d.char}
                </span>
              ))}
            </div>

            {/* Pulsing visual rings mirroring the screenshot #1 */}
            <div className="absolute inset-0 bg-[#c4c0ff]/10 rounded-full animate-pulse-glow" style={{ transform: "scale(1.5)" }}></div>
            <div className="absolute inset-0 border border-[#92dbff]/30 rounded-full animate-ping" style={{ animationDuration: "3s" }}></div>
            
            <button
              onClick={handleStartRecording}
              onMouseEnter={playHoverSfx}
              className="glass-panel w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_35px_rgba(0,196,253,0.3)] hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            >
              <Mic className="w-12 h-12 md:w-16 md:h-16 text-[#c4c0ff] group-hover:text-[#92dbff] transition-colors" />
              
              {/* Pulsing indicator that sometimes says RECORD */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#92dbff]/15 border border-[#92dbff]/30 text-[#92dbff] font-mono text-[9px] px-2.5 py-0.5 rounded-full tracking-widest uppercase animate-pulse shrink-0 whitespace-nowrap shadow-[0_0_10px_rgba(146,219,255,0.2)]">
                ✦ {micHintText} ✦
              </div>
            </button>

            {/* MYSTICAL FLOATING HOLOGRAM TARGET UNIT */}
            <div 
              onClick={handleMysticBoxClick}
              className={`absolute -top-16 -right-24 md:-right-32 z-30 cursor-pointer h-16 w-32 md:w-36 rounded-xl border p-2 text-center transition-all duration-300 select-none flex flex-col justify-center items-center backdrop-blur-md ${
                mysticStep === "idle"
                  ? "bg-[#131319]/90 border-[#92dbff]/40 shadow-[0_0_15px_rgba(146,219,255,0.25)] hover:border-[#92dbff] hover:scale-105"
                  : mysticStep === "calculating"
                  ? "bg-[#ff5352]/15 border-[#ff5352]/50 shadow-[0_0_15px_rgba(255,83,82,0.35)] animate-pulse"
                  : "bg-purple-950/40 border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-bounce"
              }`}
            >
              {/* CONTINUOUS FLOATING DIGITS STREAM (NO STOPPING) */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {mysticFloatingDigits.map((d) => (
                  <span
                    key={d.id}
                    className="absolute font-mono text-[9px] font-bold text-[#c4c0ff]/60"
                    style={{
                      left: `${d.left}%`,
                      bottom: "105%",
                      animation: `mysticFloat 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
                      animationDelay: `${d.delay}s`
                    }}
                  >
                    {d.char}
                  </span>
                ))}
              </div>

              <span className="font-mono text-[7px] uppercase tracking-widest text-[#92dbff] opacity-75 block">
                {mysticStep === "idle" ? "Matrix Wave" : "DECIPHERING"}
              </span>
              <div className="font-mono text-[10px] font-bold text-white uppercase tracking-wider truncate mt-0.5 max-w-full">
                {activeMatrixChar}
              </div>
              <span className="font-mono text-[7px] text-[#c7c4d8]/60 uppercase tracking-widest block mt-0.5 animate-pulse">
                {mysticStep === "idle" ? "✦ PRESS ME ✦" : mysticStep === "calculating" ? "WAITING..." : "⚡ CLK UNLOCK ⚡"}
              </span>
            </div>

            {/* Inline styles for custom keyframes */}
            <style>{`
              @keyframes mysticFloat {
                0% {
                  transform: translateY(15px) scale(0.6);
                  opacity: 0;
                }
                15% {
                  opacity: 1;
                }
                100% {
                  transform: translateY(-55px) scale(1.3);
                  opacity: 0;
                }
              }
              @keyframes micFloat {
                0% {
                  transform: translate(-50%, -50%) translate(0, 0) scale(0.6);
                  opacity: 0;
                }
                15% {
                  opacity: 0.95;
                }
                85% {
                  opacity: 0.95;
                }
                100% {
                  transform: translate(-50%, -50%) translate(var(--drift-x, 150px), var(--drift-y, 0px)) scale(1.3);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* TYPOGRAPHY AND HEADINGS */}
      <div className="text-center max-w-4xl mx-auto mb-10">
        {isAnalyzing ? (
          <div>
            <h2 className="font-sans text-2xl md:text-3xl text-[#92dbff] font-semibold mb-2 tracking-wide uppercase font-mono tracking-widest">
              {t("Processing Vector", appLanguage)}
            </h2>
            <p className="font-mono text-xs text-[#c7c4d8] animate-pulse">
              {t(analyzerStatus, appLanguage)}
            </p>
          </div>
        ) : isRecording ? (
          <div>
            <h2 className="font-sans text-2xl md:text-3xl text-[#ff5352] font-semibold mb-2 tracking-wide uppercase font-mono tracking-widest animate-pulse">
              {t("STREAM RECORDING", appLanguage)}
            </h2>
            <p className="font-mono text-xs text-[#c7c4d8]/70">
              {t("Speak a single digit (0, 1, 2, ... 9) clearly into your microphone receptor.", appLanguage)}
            </p>
          </div>
        ) : (
          <div>
            {/* Staggered Title Reveal Words injected via inline elements */}
            <h1 className="font-sans text-4xl md:text-6xl text-white font-bold mb-6 tracking-tighter select-none">
              {t("Speak", appLanguage)}. <span className="bg-gradient-to-r from-[#c4c0ff] to-[#92dbff] bg-clip-text text-transparent">{t("Recognize", appLanguage)}</span>. {t("Understand", appLanguage)}.
            </h1>
            <p className="font-sans text-sm md:text-base text-[#c7c4d8]/75 max-w-xl mx-auto">
              {t("AI-powered digit recognition from voice in milliseconds.", appLanguage)} {t("Harness full frequency spectrogram mapping.", appLanguage)}
            </p>
          </div>
        )}

        {errorText && (
          <div className="mt-4 px-4 py-2 border border-red-500/20 bg-red-500/5 rounded text-red-400 font-mono text-[11px] max-w-md mx-auto animate-fadeIn">
            {errorText}
          </div>
        )}

        {permissionDenied && (
          <div className="mt-6 p-5 border border-[#ff5352]/20 bg-[#ff5352]/5 rounded-xl max-w-md mx-auto text-left animate-fadeIn font-sans relative">
            <div className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5352] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5352]"></span>
            </div>
            
            <h3 className="font-mono text-xs font-bold text-[#ff5352] tracking-widest uppercase mb-3 flex items-center gap-1.5">
              <span>⚠️</span> Receiver Permission Blocked
            </h3>
            
            <p className="text-xs text-[#c7c4d8] leading-relaxed mb-4">
              Your browser has blocked microphone receptor feeds. Since this application runs inside a secure sandbox iframe, standard hardware access may be blocked by your browser's security boundaries.
            </p>
            
            <div className="space-y-2 mb-5 font-mono text-[11px] text-[#c7c4d8]/80">
              <div className="flex gap-2">
                <span className="text-[#92dbff] font-bold">01.</span>
                <span>Click the **Padlock icon** (🔒) on the left side of your browser's address bar.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#92dbff] font-bold">02.</span>
                <span>Select and toggle **Microphone** to **Allow** specifically.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#92dbff] font-bold">03.</span>
                <span>Alternatively, click the button below to bypass frame restrictions and run your app directly in a top-level tab context.</span>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSfx();
                window.open(window.location.href, "_blank");
              }}
              onMouseEnter={playHoverSfx}
              className="w-full bg-[#ff5352]/10 hover:bg-[#ff5352]/20 border border-[#ff5352]/30 text-[#ff5352] font-mono text-[10px] font-bold uppercase py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Launch Receptor in New Tab
            </button>
          </div>
        )}
      </div>

      {/* CALL TO ACTIONS (VISIBLE IF NOT ACTIVELY BUSY) */}
      {!isRecording && !isAnalyzing && (
        <div className="flex flex-col items-center gap-14 mt-2 w-full animate-fadeIn">
          {/* Live Try Demo Button */}
          <button
            onClick={() => {
              playClickSfx();
              onNavigate("demo");
            }}
            onMouseEnter={playHoverSfx}
            className="glass-panel border-[#92dbff]/50 text-[#92dbff] font-mono text-xs font-bold px-12 py-4 rounded uppercase tracking-wider hover:bg-[#92dbff]/10 hover:shadow-[0_0_15px_rgba(146,219,255,0.3)] transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#92dbff]" />
            {getTranslatedUI("tryDemo", appLanguage)}
          </button>

          {/* AURON PROTOCOLS AND ROLES QUICK-GUIDE */}
          <div className="w-full max-w-4xl mt-6 border-t border-white/5 pt-8">
            <div className="text-center mb-6">
              <span className="font-mono text-[9px] font-bold text-[#92dbff] tracking-widest uppercase bg-[#92dbff]/10 px-2.5 py-1 rounded-full border border-[#92dbff]/15 animate-pulse">
                ✦ {getTranslatedUI("activeClearances", appLanguage)} ✦
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center md:text-left mt-2">
              {/* Field Agent Mini-Card */}
              <div className="bg-[#111c16]/30 border border-emerald-500/20 rounded-xl p-4 transition-all hover:border-emerald-500/40 hover:bg-[#111c16]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {getTranslatedUI("fieldAgent", appLanguage)}
                    </span>
                    <span className="font-mono text-[8px] border border-emerald-400/30 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                      FREE
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#c7c4d8]/80 leading-relaxed mb-3">
                    Acoustic uploads, basic voice spectrum parsing, and real-time visual waveforms with 10 checks per diurnal cycle.
                  </p>
                </div>
                <button
                  onClick={() => { playClickSfx(); onNavigate("signup"); }}
                  className="w-full mt-2 font-mono text-[9px] font-bold py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 uppercase transition-all cursor-pointer"
                >
                  Activate Agent Clearances
                </button>
              </div>

              {/* Researcher Mini-Card */}
              <div className="bg-[#111624]/30 border border-blue-500/20 rounded-xl p-4 transition-all hover:border-blue-500/40 hover:bg-[#111624]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-blue-400 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> {getTranslatedUI("researcher", appLanguage)}
                    </span>
                    <span className="font-mono text-[8px] border border-blue-400/30 text-blue-400 px-1.5 py-0.2 rounded font-bold">
                      ACADEMIC
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#c7c4d8]/80 leading-relaxed mb-3">
                    Everything in Field-level plus dual spectrogram models, fine-tuned phonetic acoustic datasets, and historical diagnostics logging.
                  </p>
                </div>
                <button
                  onClick={() => { playClickSfx(); onNavigate("signup"); }}
                  className="w-full mt-2 font-mono text-[9px] font-bold py-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 uppercase transition-all cursor-pointer"
                >
                  Request Research Credentials
                </button>
              </div>

              {/* Commander Mini-Card */}
              <div className="bg-[#181124]/30 border border-purple-500/20 rounded-xl p-4 transition-all hover:border-purple-500/40 hover:bg-[#181124]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" /> {getTranslatedUI("commander", appLanguage)}
                    </span>
                    <span className="font-mono text-[8px] border border-purple-400/30 text-purple-400 px-1.5 py-0.2 rounded font-bold">
                      ENTERPRISE
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#c7c4d8]/80 leading-relaxed mb-3">
                    Full workspace grid, custom secure database persistence, high-speed priority neural cluster queues, and enterprise APIs.
                  </p>
                </div>
                <button
                  onClick={() => { playClickSfx(); onNavigate("signup"); }}
                  className="w-full mt-2 font-mono text-[9px] font-bold py-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 uppercase transition-all cursor-pointer"
                >
                  Deploy Command Terminal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIGNUP INTERCEPT POPUP MODAL */}
      {showSignupPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05050a]/90 backdrop-blur-xl p-4 animate-fadeIn">
          <div className="relative max-w-md w-full bg-[#0c0c14] border border-[#ff5352]/30 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(255,83,82,0.15)] flex flex-col items-center gap-5">
            {/* Pulsing exclamation circle */}
            <div className="w-16 h-16 rounded-full bg-[#ff5352]/10 border border-[#ff5352]/40 flex items-center justify-center animate-pulse">
              <span className="text-3xl font-black text-[#ff5352]">!</span>
            </div>
            
            <div>
              <h2 className="font-sans text-xl md:text-2xl font-black text-white tracking-wide uppercase mb-2">
                The result is ready to view!
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#c7c4d8]/80 leading-relaxed">
                Your vocal acoustic digit analysis is fully calculated and ready. Complete your free signup to unlock and inspect your dynamic language acoustic profile result.
              </p>
              <div className="mt-3 text-[#ff5352] font-mono text-[10px] font-bold tracking-widest uppercase animate-pulse">
                Sign Up!
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                onClick={() => {
                  playClickSfx();
                  setShowSignupPopup(false);
                  onNavigate("signup");
                }}
                className="w-full bg-[#ff5352] hover:bg-[#ff5352]/90 hover:scale-[1.02] active:scale-[0.98] text-white font-mono text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(255,83,82,0.3)] cursor-pointer"
              >
                Sign Up! 📡
              </button>
              
              <button
                onClick={() => {
                  playClickSfx();
                  setShowSignupPopup(false);
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-[#c7c4d8]/80 hover:text-white font-mono text-[10px] py-2 rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
