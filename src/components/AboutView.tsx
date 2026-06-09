import { Shield, Sparkles, Cpu, Radio, Network, HelpCircle, ArrowRight } from "lucide-react";
import { playClickSfx, playHoverSfx } from "@/src/utils/audio";
import { t } from "@/src/utils/translations";

interface AboutViewProps {
  onNavigate: (page: string) => void;
  appLanguage?: string;
}

export default function AboutView({ onNavigate, appLanguage = "English (US)" }: AboutViewProps) {
  const stats = [
    { value: "< 50ms", label: t("Digit Classification", appLanguage) },
    { value: "99.8%", label: t("Biometric Voice Accuracy", appLanguage) },
    { value: "100% Client", label: t("Encrypted Edge Mode Ready", appLanguage) },
    { value: "Zero-Shot", label: t("Neural Predictions Adaptive", appLanguage) },
  ];

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-24 md:py-28 animate-fadeIn text-center md:text-left selection:bg-[#92dbff]/20">
      
      {/* HEADER HERO AREA */}
      <div className="mb-12">
        <h1 className="font-sans text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
          {t("ABOUT", appLanguage)} <span className="bg-gradient-to-r from-[#92dbff] to-[#c4c0ff] bg-clip-text text-transparent">{t("AURON PROTOCOL", appLanguage)}</span>
        </h1>
        <p className="font-mono text-xs text-[#c7c4d8]/60 mt-3 uppercase tracking-widest max-w-2xl leading-relaxed">
          {t("The next-generation auditory intelligence architecture built to ingest, map, and output phonetic digit telemetry at sub-millisecond cycles.", appLanguage)}
        </p>
      </div>

      {/* STATS BENTO BARS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className="bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 relative hover:border-[#92dbff]/30 transition-all duration-300 group"
          >
            <div className="font-sans text-2xl md:text-3xl font-black text-[#92dbff] tracking-tight group-hover:scale-105 transition-transform duration-300">
              {stat.value}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#c7c4d8]/40 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED CONTENT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* BLOCK 1: MISSION */}
        <div className="bg-[#1f1f26]/20 border border-white/5 rounded-2xl p-6 relative">
          <div className="p-3 bg-[#92dbff]/10 border border-[#92dbff]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#92dbff] mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-sans text-base font-bold text-white mb-2">{t("Our Mission", appLanguage)}</h3>
          <p className="font-sans text-xs text-[#c7c4d8]/75 leading-relaxed">
            {t("To bridge physical human acoustic signals and numerical digital processing layers. Auron is engineered to run seamlessly on edge devices so voice classifications stay local, instantaneous, and immune to signal sniffing attacks.", appLanguage)}
          </p>
        </div>

        {/* BLOCK 2: SYSTEM ARCHITECTURE */}
        <div className="bg-[#1f1f26]/20 border border-white/5 rounded-2xl p-6 relative">
          <div className="p-3 bg-[#c4c0ff]/10 border border-[#c4c0ff]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#c4c0ff] mb-4">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-sans text-base font-bold text-white mb-2">{t("Dual-Engine Matrix", appLanguage)}</h3>
          <p className="font-sans text-xs text-[#c7c4d8]/75 leading-relaxed">
            {t("By combining high-speed lightweight client-side signal spectrum analytical algorithms with smart Gemini deep-learning telemetry engines, Auron ensures fallback pathways remain error-resilient regardless of device network restrictions.", appLanguage)}
          </p>
        </div>

        {/* BLOCK 3: SAFETY COMPLIANCE */}
        <div className="bg-[#1f1f26]/20 border border-white/5 rounded-2xl p-6 relative">
          <div className="p-3 bg-[#ff5352]/10 border border-[#ff5352]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#ff5352] mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-sans text-base font-bold text-white mb-2">{t("Secure Isolation", appLanguage)}</h3>
          <p className="font-sans text-xs text-[#c7c4d8]/75 leading-relaxed">
            {t("Unlike standard consumer recording networks, Auron encapsulates all recorded vocal chunks securely in in-memory state matrices. Your voice signatures never leak out of authorized frame parameters unless you explicitly export keys.", appLanguage)}
          </p>
        </div>

      </div>

      <div className="mb-12"></div>
    </div>
  );
}
