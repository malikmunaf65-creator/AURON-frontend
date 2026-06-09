import { useState } from "react";
import { HelpCircle, ChevronRight, ChevronDown, CheckCircle, Activity, Shield } from "lucide-react";
import { playClickSfx, playHoverSfx } from "@/src/utils/audio";
import { t } from "@/src/utils/translations";

interface FaqViewProps {
  appLanguage?: string;
}

export default function FaqView({ appLanguage = "English (US)" }: FaqViewProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is AURON and how does it recognize voice audio?",
      a: "AURON is a futuristic Acoustic Digit Recognition Engine. It allows you to record speech or upload audio file fragments, instantly processing the audio buffer to classify Greek numerical digits (0-9) inside milliseconds. It includes local synthesis soundwaves and offline and on-demand Gemini AI fallback pathways."
    },
    {
      q: "How do I fix microphone errors ('Microphone permission was denied')?",
      a: "Since this application runs inside a secure, sandboxed browser iframe, standard hardware feeds may sometimes be restricted. To solve this, click the lock icon (🔒) beside the browser URL bar to allow Microphone permission, or click 'Launch Receptor in New Tab' to run outside the nested iframe structure."
    },
    {
      q: "What are the five prebuilt AI voice configurations (Aetheria, Valkyrie_XT, Neon_Oracle, Titan_Prime, Kronos_Void)?",
      a: "They represent distinct prebuilt neural entities configured to voice alerts: Aetheria-9 is an airy, whispered cybernetic female consciousness; Valkyrie-XT is a bright, high-frequency female tactical AI; Neon Oracle is a fast-talking synth guardian; Titan Prime is an ultra-deep, sub-bass resonant gargantuan command voice (male); and Kronos Void is a gravelly, low-harmonic dark warrior cosmic entity."
    },
    {
      q: "Does AURON work without an internet connection?",
      a: "Yes! By switching your 'Engine Mode' to 'Offline Client Engine' in the Top Navbar configuration panel, all audio metrics are computed strictly locally. Your vocal data is processed directly inside your browser frame, avoiding cloud trips entirely."
    },
    {
      q: "Can I upload pre-recorded audio fragments?",
      a: "Absolutely. Head over to the 'Upload' tab, where you can drag and drop standard .wav, .mp3, or .m4a files. The engine will read the file, analyze frequencies, classify raw digits, and play the translated output dynamically."
    },
    {
      q: "Is my recorded voice data safe on AURON?",
      a: "We prioritize security. Recorded speech clips are saved strictly as short-lived memory blobs inside your browser session. They are never sent to external servers unless you enable active cloud computing, ensuring maximum digital sovereignty."
    }
  ];

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-24 md:py-28 animate-fadeIn text-center md:text-left selection:bg-[#92dbff]/20">
      
      {/* HEADER SECTION */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#c4c0ff]/20 bg-[#c4c0ff]/5 text-[#c4c0ff] font-mono text-[9px] uppercase tracking-widest mb-4">
          <HelpCircle className="w-3" /> {t("system_documentation_faq", appLanguage)}
        </div>
        <h1 className="font-sans text-4xl font-black text-white tracking-tight leading-none uppercase">
          {t("Frequently", appLanguage)} <span className="bg-gradient-to-r from-[#92dbff] to-[#c4c0ff] bg-clip-text text-transparent">{t("Asked Questions", appLanguage)}</span>
        </h1>
        <p className="font-sans text-xs text-[#c7c4d8]/60 mt-2 max-w-lg leading-relaxed">
          {t("Quick resolutions, configuration guides, and architectural clarifications regarding the Auron Neural Framework.", appLanguage)}
        </p>
      </div>

      {/* FREQUENTLY ASKED ACCORDIONS */}
      <div className="space-y-4 max-w-3xl">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-[#1f1f26]/20 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => {
                  playClickSfx();
                  setOpenIdx(isOpen ? null : idx);
                }}
                onMouseEnter={playHoverSfx}
                className="w-full flex items-center justify-between p-5 text-left font-sans font-semibold text-xs md:text-sm text-white hover:bg-white/5 transition-colors cursor-pointer animate-none"
              >
                <span className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] ${isOpen ? "text-[#92dbff]" : "text-[#c7c4d8]/40"}`}>
                    {(idx + 1).toString().padStart(2, "0")}.
                  </span>
                  <span>{t(faq.q, appLanguage)}</span>
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-[#92dbff] shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                )}
              </button>

              {/* SMOOTH COLLAPSIBLE DETAILS */}
              {isOpen && (
                <div className="px-5 pb-6 pt-1 text-xs text-[#c7c4d8]/80 leading-relaxed border-t border-white/5 bg-[#131319]/25 animate-fadeIn">
                  <div className="pl-6 relative">
                    <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#92dbff] to-transparent rounded-full" />
                    {t(faq.a, appLanguage)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
