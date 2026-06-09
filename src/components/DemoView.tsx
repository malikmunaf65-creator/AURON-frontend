import { useState, useEffect } from "react";
import { Volume2, Activity, Play, Settings, Sparkles, Loader2 } from "lucide-react";
import { playClickSfx, playHoverSfx, speakTextOffline } from "@/src/utils/audio";
import { DigitHistory, GREEK_ALPHABET, VoiceSettings } from "@/src/types";
import { getTranslatedPhonetic } from "@/src/utils/languages";

interface DemoViewProps {
  onAddHistory: (record: DigitHistory) => void;
  voiceSettings: VoiceSettings;
  appLanguage?: string;
}

export default function DemoView({ onAddHistory, voiceSettings, appLanguage = "English (US)" }: DemoViewProps) {
  const [sysFreq, setSysFreq] = useState(432.8);
  const [activeDigit, setActiveDigit] = useState<number | null>(null);
  const [isPlayingTts, setIsPlayingTts] = useState<number | null>(null);
  const [consoleLog, setConsoleLog] = useState("Awaiting interactive input...");

  // Oscillate the frequency readout for high-tech aesthetic
  useEffect(() => {
    const handle = setInterval(() => {
      setSysFreq((prev) => {
        const offset = (Math.random() * 1.6 - 0.8);
        return parseFloat((prev + offset).toFixed(1));
      });
    }, 1500);
    return () => clearInterval(handle);
  }, []);

  const handleDigitTrigger = async (digit: number) => {
    playClickSfx();
    setActiveDigit(digit);
    const subtitle = getTranslatedPhonetic(digit);
    setConsoleLog(`Triggering sample phonetic vocalization: DIGIT ${digit} - ${subtitle}`);

    const config = GREEK_ALPHABET[digit];
    const speechText = `${digit}, ${subtitle}`;

    // Update history for prediction simulations
    const newRecord: DigitHistory = {
      id: `demo_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      digit: digit,
      english: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][digit],
      greek: subtitle,
      confidence: parseFloat((0.92 + Math.random() * 0.07).toFixed(3)),
      analysis: `Demo matrix stimulus at frequency ${sysFreq} Hz. Standard resonance detected.`,
      filename: `demo_stimulus_${subtitle.toLowerCase().replace(/\s+/g, '_')}.wav`,
      durationSecs: 1.2,
      isLive: false,
      isMock: true
    };
    onAddHistory(newRecord);

    // Call speech vocalization helper
    if (voiceSettings.engineMode === "gemini" || voiceSettings.engineMode === "alternative") {
      setIsPlayingTts(digit);
      const isAlt = voiceSettings.engineMode === "alternative";
      const voiceId = voiceSettings.ttsVoice;

      let rate = 1.0;
      if (voiceId === "Aetheria") rate = 0.90;
      else if (voiceId === "Valkyrie_XT") rate = 1.15;
      else if (voiceId === "Neon_Oracle") rate = 1.40;
      else if (voiceId === "Titan_Prime") rate = 0.72;
      else if (voiceId === "Kronos_Void") rate = 0.82;

      setConsoleLog(isAlt ? `Querying Alternative AI Model for '${voiceSettings.ttsVoice}'...` : `Querying Gemini TTS voice model '${voiceSettings.ttsVoice}'...`);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: speechText, voice: voiceSettings.ttsVoice }),
        });

        if (!res.ok) throw new Error("TTS Failure");
        const json = await res.json();
        
        // Play base64 audio directly in browser
        const audioSrc = `data:audio/wav;base64,${json.audio}`;
        const audio = new Audio(audioSrc);
        audio.playbackRate = isAlt ? (rate * 1.25) : rate;
        audio.play().catch(() => {
          // fallback to offline speech if autoplay fails
          speakTextOffline(speechText, voiceSettings.ttsVoice);
        });
        setConsoleLog(isAlt ? `Alternative AI Synth '${voiceSettings.ttsVoice}' broadcast successful.` : `Gemini TTS '${voiceSettings.ttsVoice}' synthesized successfully.`);
      } catch (err) {
        console.warn("TTS API Endpoint failed, falling back to local speech engine.");
        speakTextOffline(speechText, voiceSettings.ttsVoice);
        setConsoleLog("Fallback offline speech synthesized successfully.");
      } finally {
        setIsPlayingTts(null);
      }
    } else {
      speakTextOffline(speechText, voiceSettings.ttsVoice);
      setConsoleLog("Offline vocalization broadcast successful.");
    }

    // Brief timeout to cancel visual click scale
    setTimeout(() => {
      setActiveDigit(null);
    }, 200);
  };

  const digits = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="relative z-10 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-6 select-none animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="font-sans text-2xl md:text-4xl text-primary font-semibold mb-2 drop-shadow-[0_0_12px_rgba(196,192,255,0.4)]">
          Interactive Array
        </h1>
        <p className="font-mono text-xs text-[#c7c4d8]/70 flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4 text-[#92dbff]" />
          Test with sample audio — click any digit key
        </p>
      </div>

      {/* GLASS CONTAINER CONFIG WITH SCI-FI CORNER ACCENTS */}
      <div className="bg-[#131319]/40 backdrop-blur-2xl border border-white/5 p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-4xl relative">
        {/* Corner Accents mirroring screenshots beautifully */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#c4c0ff]/40 rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#c4c0ff]/40 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#c4c0ff]/40 rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#c4c0ff]/40 rounded-br-2xl"></div>

        {/* DIAL GRID (5 elements on desktop, 2 on tablet/mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 md:gap-5">
          {digits.map((digit) => {
            const config = GREEK_ALPHABET[digit];
            const isSelected = activeDigit === digit;
            const isPlaying = isPlayingTts === digit;

            return (
              <button
                key={digit}
                onClick={() => handleDigitTrigger(digit)}
                onMouseEnter={playHoverSfx}
                style={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isSelected ? "scale(0.95)" : "translateY(0)"
                }}
                className={`glow-${digit} neon-pill group flex flex-col items-center justify-center py-6 md:py-8 bg-[#1f1f26]/30 border border-white/5 hover:bg-[#1f1f26]/60 rounded-full cursor-pointer relative overflow-hidden`}
              >
                {/* Glowing outline on active or hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                  style={{ backgroundColor: config.color }}
                />

                {isPlaying ? (
                  <Loader2 className="w-10 h-10 md:w-14 md:h-14 text-white animate-spin my-1" />
                ) : (
                  <span 
                    className="font-sans text-4xl md:text-5xl font-bold text-white group-hover:scale-105 transition-transform duration-300"
                    style={{ textShadow: `0 0 10px rgba(255,255,255,0.15)` }}
                  >
                    {digit}
                  </span>
                )}
                
                <span className="font-mono text-[9px] text-[#c7c4d8]/40 mt-1 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                  {getTranslatedPhonetic(digit)}
                </span>
              </button>
            );
          })}
        </div>

        {/* TECHNICAL METRIC LOG READOUT PANEL */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#c7c4d8]/40 tracking-wider gap-3">
          <div className="flex gap-4 items-center">
            <span className="text-[#92dbff]">SYS.FREQ: {sysFreq} Hz</span>
            <span className="hidden md:inline-block text-white/10">|</span>
            <span className="truncate max-w-sm md:max-w-md text-left text-white/30 lowercase">
              log_trace: {consoleLog}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#92dbff] font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#92dbff] animate-ping" />
            AWAITING INPUT
          </div>
        </div>
      </div>

      {/* EMBED NEON HOVER SHADOWS AS PRESENTED IN SCREENSHOT #3 STYLING BLOCKS */}
      <style>{`
        .glow-0:hover { border-color: #c4c0ff !important; box-shadow: 0 0 20px rgba(196, 192, 255, 0.3) !important; color: #c4c0ff !important; transform: translateY(-4px) !important; }
        .glow-1:hover { border-color: #92dbff !important; box-shadow: 0 0 20px rgba(146, 219, 255, 0.3) !important; color: #92dbff !important; transform: translateY(-4px) !important; }
        .glow-2:hover { border-color: #ffb3ae !important; box-shadow: 0 0 20px rgba(255, 179, 174, 0.3) !important; color: #ffb3ae !important; transform: translateY(-4px) !important; }
        .glow-3:hover { border-color: #4f44e2 !important; box-shadow: 0 0 20px rgba(79, 68, 226, 0.25) !important; color: #c4c0ff !important; transform: translateY(-4px) !important; }
        .glow-4:hover { border-color: #00c4fd !important; box-shadow: 0 0 20px rgba(0, 196, 253, 0.3) !important; color: #00c4fd !important; transform: translateY(-4px) !important; }
        .glow-5:hover { border-color: #ff5352 !important; box-shadow: 0 0 20px rgba(255, 83, 82, 0.3) !important; color: #ff5352 !important; transform: translateY(-4px) !important; }
        .glow-6:hover { border-color: #8781ff !important; box-shadow: 0 0 20px rgba(135, 129, 255, 0.3) !important; color: #8781ff !important; transform: translateY(-4px) !important; }
        .glow-7:hover { border-color: #6dd2ff !important; box-shadow: 0 0 20px rgba(109, 210, 255, 0.3) !important; color: #6dd2ff !important; transform: translateY(-4px) !important; }
        .glow-8:hover { border-color: #ffdad7 !important; box-shadow: 0 0 20px rgba(255, 218, 215, 0.3) !important; color: #ffdad7 !important; transform: translateY(-4px) !important; }
        .glow-9:hover { border-color: #e3dfff !important; box-shadow: 0 0 20px rgba(227, 223, 255, 0.3) !important; color: #e3dfff !important; transform: translateY(-4px) !important; }
      `}</style>
    </div>
  );
}
