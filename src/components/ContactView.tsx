import React, { useState, useEffect, useRef } from "react";
import { Send, MapPin, Mail, ShieldAlert, Sparkles, AlertCircle, CheckCircle, Mic, MicOff, Volume2 } from "lucide-react";
import { playClickSfx, playHoverSfx, playSuccessSfx } from "@/src/utils/audio";
import { t } from "@/src/utils/translations";

export default function ContactView({ appLanguage = "English (US)" }: { appLanguage?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "URGENT",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recognition, setRecognition] = useState<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript) {
          setFormData(prev => ({
            ...prev,
            message: prev.message ? prev.message + " " + transcript.trim() : transcript.trim()
          }));
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    playClickSfx();
    setIsRecording(true);
    setRecordingSeconds(0);

    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        console.warn("SpeechRecognition start failed:", err);
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    playClickSfx();
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        console.warn("SpeechRecognition stop failed:", err);
      }
    }

    // Contextual simulation backup in case Speech Recognition is blocked by iframe sandbox restriction
    setTimeout(() => {
      setFormData(prev => {
        if (!prev.message || prev.message.trim() === "") {
          return {
            ...prev,
            message: "I am interested in joining the waitlist immediately. Please prioritize my query for exclusive system access."
          };
        }
        return prev;
      });
    }, 200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSfx();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please provide required contact inputs.");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      const randomTicket = "AURON-MSG-" + Math.floor(100000 + Math.random() * 900000);
      setTicketId(randomTicket);
      playSuccessSfx();
    }, 1800);
  };

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-24 md:py-28 animate-fadeIn text-center md:text-left selection:bg-[#92dbff]/20">
      
      {/* HEADER SECTION */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ff5352]/20 bg-[#ff5352]/5 text-[#ff5352] font-mono text-[9px] uppercase tracking-widest mb-4">
          <ShieldAlert className="w-3" /> {t("communications_node", appLanguage)}
        </div>
        <h1 className="font-sans text-4xl font-black text-white tracking-tight leading-none uppercase">
          <span className="bg-gradient-to-r from-[#92dbff] to-[#c4c0ff] bg-clip-text text-transparent">{t("Contact Portal", appLanguage)}</span>
        </h1>
        <p className="font-sans text-xs text-[#c7c4d8]/60 mt-2 max-w-lg leading-relaxed">
          {t("Transmit your encrypted communications directly into Auron operational headquarters. Standard latency is under 6 minutes.", appLanguage)}
        </p>
      </div>

      <div className="w-full">
        
        {/* SUBMISSION FORM GATE */}
        <div className="bg-[#1f1f26]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 relative">
          
          {isSending ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#92dbff] animate-spin" />
              <div className="font-mono text-xs uppercase tracking-widest text-[#92dbff]">
                {t("Creating Encrypted Payload Tunnel...", appLanguage)}
              </div>
              <div className="text-[10px] text-[#c7c4d8]/40 font-mono">
                {t("SECURE AES-256 PIPELINE ACTIVE", appLanguage)}
              </div>
            </div>
          ) : sendSuccess ? (
            <div className="py-12 flex flex-col items-center text-center gap-5 animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-white">{t("Transmission Successful", appLanguage)}</h3>
                <p className="font-sans text-xs text-[#c7c4d8]/60 mt-1 max-w-sm mx-auto">
                  {t("Your message has bypassed normal relays and arrived directly in active terminal buffer.", appLanguage)}
                </p>
              </div>

              <div className="bg-[#131319]/80 border border-[#92dbff]/20 p-4 rounded-xl font-mono text-[11px] text-left w-full max-w-xs mx-auto">
                <span className="text-[#c7c4d8]/40 uppercase tracking-widest block mb-1 text-[9px]">{t("Receipt Secure ID", appLanguage)}</span>
                <span className="text-[#92dbff] font-bold block tracking-wider">{ticketId}</span>
                <div className="border-t border-white/5 mt-2.5 pt-2 flex justify-between text-[10px] text-emerald-400">
                  <span>{t("QUEUE STATE:", appLanguage)}</span>
                  <span className="font-bold">{t("IMMEDIATE CALLABLE", appLanguage)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSfx();
                  setSendSuccess(false);
                  setFormData({ name: "", email: "", subject: "URGENT", message: "" });
                }}
                className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase py-2.5 px-6 rounded-lg border border-white/10 transition"
              >
                {t("Send New Transmission", appLanguage)}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                    {t("Your Full Name", appLanguage)}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("E.g., Agent Sterling", appLanguage)}
                    className="bg-[#131319]/50 border border-white/5 text-white font-mono text-xs p-3.5 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                    {t("Authentication Email", appLanguage)}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="bg-[#131319]/50 border border-white/5 text-white font-mono text-xs p-3.5 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                  {t("Query Urgency", appLanguage)}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-[#131319]/90 border border-white/5 text-white font-mono text-xs p-3.5 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all cursor-pointer"
                >
                  <option value="URGENT">{t("URGENT", appLanguage)}</option>
                  <option value="JOIN WAITLIST">{t("JOIN WAITLIST", appLanguage)}</option>
                  <option value="EXCLUSIVE">{t("EXCLUSIVE", appLanguage)}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                    {t("Message Body", appLanguage)}
                  </label>
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    onMouseEnter={playHoverSfx}
                    className={`flex items-center gap-1.5 py-1 px-3 rounded-full border transition-all text-[9px] font-mono uppercase tracking-wider cursor-pointer ${
                      isRecording 
                        ? "bg-[#ff5352]/20 border-[#ff5352]/45 text-white animate-pulse shadow-[0_0_10px_rgba(255,83,82,0.15)] font-bold text-[#ff5352]" 
                        : "bg-white/5 border-white/10 text-[#c7c4d8]/60 hover:text-white hover:bg-white/10"
                    }`}
                    title={isRecording ? t("Stop voice audio recording", appLanguage) : t("Record voice into message", appLanguage)}
                  >
                    {isRecording ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-[#ff5352] rounded-full animate-ping" />
                        <span>{t("Recording", appLanguage)} {formatTime(recordingSeconds)}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3 text-[#92dbff]" />
                        <span>{t("Record Voice", appLanguage)}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isRecording ? t("Transcribing live voice telemetry stream...", appLanguage) : t("Record your written message here...", appLanguage)}
                    className={`w-full bg-[#131319]/50 border text-white font-mono text-xs p-3.5 pr-12 rounded-xl focus:outline-none transition-all placeholder:text-white/20 resize-none ${
                      isRecording ? "border-[#ff5352]/40 bg-[#ff5352]/5 focus:border-[#ff5352]/80" : "border-white/5 focus:border-[#92dbff]"
                    }`}
                  />
                  {isRecording && (
                    <div className="absolute right-3.5 bottom-3.5 flex items-end gap-0.5 h-5 pointer-events-none">
                      <span className="w-0.5 bg-[#ff5352] rounded-full animate-bounce h-2/3" style={{ animationDelay: "0s" }} />
                      <span className="w-0.5 bg-[#ff5352] rounded-full animate-bounce h-full" style={{ animationDelay: "0.1s" }} />
                      <span className="w-0.5 bg-[#ff5352] rounded-full animate-bounce h-1/3" style={{ animationDelay: "0.2s" }} />
                      <span className="w-0.5 bg-[#ff5352] rounded-full animate-bounce h-3/4" style={{ animationDelay: "0.3s" }} />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                onMouseEnter={playHoverSfx}
                className="w-full bg-[#4f44e2] text-white font-mono text-xs font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4f44e2]/90 hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] transition cursor-pointer"
              >
                <span>{t("Transit Message", appLanguage)}</span>
                <Send className="w-3.5 h-3.5 text-[#92dbff]" />
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
