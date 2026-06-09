import { useState } from "react";
import { Scale, ShieldAlert, FileCheck, CheckCircle } from "lucide-react";
import { playClickSfx, playHoverSfx } from "@/src/utils/audio";
import { t } from "@/src/utils/translations";

interface TermsViewProps {
  appLanguage?: string;
}

export default function TermsView({ appLanguage = "English (US)" }: TermsViewProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "neural">("privacy");

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-24 md:py-28 animate-fadeIn text-center md:text-left selection:bg-[#92dbff]/20">
      
      {/* HEADER SECTION */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#92dbff]/20 bg-[#92dbff]/5 text-[#92dbff] font-mono text-[9px] uppercase tracking-widest mb-4">
          <Scale className="w-3" /> {t("legal_compliance_unit", appLanguage)}
        </div>
        <h1 className="font-sans text-4xl font-black text-white tracking-tight leading-none uppercase">
          {t("Legal", appLanguage)} <span className="bg-gradient-to-r from-[#92dbff] to-[#c4c0ff] bg-clip-text text-transparent">{t("Terms & Privacy", appLanguage)}</span>
        </h1>
        <p className="font-sans text-xs text-[#c7c4d8]/60 mt-2 max-w-lg leading-relaxed">
          {t("Standard operational protocols, neural data rights, and secure identity framework parameters for using Auron.", appLanguage)}
        </p>
      </div>

      {/* MULTI TAB NAVIGATION TABS */}
      <div className="flex border-b border-white/5 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => { playClickSfx(); setActiveTab("privacy"); }}
          onMouseEnter={playHoverSfx}
          className={`pb-3 px-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer whitespace-nowrap transition-all duration-300 relative ${
            activeTab === "privacy" ? "text-[#92dbff] font-bold" : "text-[#c7c4d8]/40 hover:text-[#c7c4d8]/80"
          }`}
        >
          {t("Privacy Policy", appLanguage)}
          {activeTab === "privacy" && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#92dbff] shadow-[0_1px_6px_#92dbff]" />}
        </button>

        <button
          onClick={() => { playClickSfx(); setActiveTab("terms"); }}
          onMouseEnter={playHoverSfx}
          className={`pb-3 px-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer whitespace-nowrap transition-all duration-300 relative ${
            activeTab === "terms" ? "text-[#92dbff] font-bold" : "text-[#c7c4d8]/40 hover:text-[#c7c4d8]/80"
          }`}
        >
          {t("Terms of Use", appLanguage)}
          {activeTab === "terms" && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#92dbff] shadow-[0_1px_6px_#92dbff]" />}
        </button>

        <button
          onClick={() => { playClickSfx(); setActiveTab("neural"); }}
          onMouseEnter={playHoverSfx}
          className={`pb-3 px-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer whitespace-nowrap transition-all duration-300 relative ${
            activeTab === "neural" ? "text-[#92dbff] font-bold" : "text-[#c7c4d8]/40 hover:text-[#c7c4d8]/80"
          }`}
        >
          {t("Neural Data Sovereign", appLanguage)}
          {activeTab === "neural" && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#92dbff] shadow-[0_1px_6px_#92dbff]" />}
        </button>
      </div>

      {/* DETAILED VIEWS */}
      <div className="bg-[#1f1f26]/20 border border-white/5 rounded-2xl p-6 md:p-8 text-left text-xs text-[#c7c4d8]/80 space-y-6 leading-relaxed max-w-3xl">
        
        {activeTab === "privacy" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#92dbff]" /> {t("Privacy Safeguard Clauses", appLanguage)}
            </h3>
            <p>
              {t("Your biometric acoustic signals are processed inside individual browser memory heaps (local thread states). No permanent voice storage is created without explicit user telemetry export events.", appLanguage)}
            </p>
            <div className="space-y-3 font-sans mt-4">
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-[#92dbff] shrink-0 mt-0.5" />
                <span><strong>{t("No Continuous Listening:", appLanguage)}</strong> {t("Microphones are only unmuted when you click \"REC\" or initialize a voice pass calibration.", appLanguage)}</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-[#92dbff] shrink-0 mt-0.5" />
                <span><strong>{t("Client-Side Processing:", appLanguage)}</strong> {t("In-browser DSP sweeps prevent third-party network sniffers from intercepting vocal metadata.", appLanguage)}</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-[#92dbff] shrink-0 mt-0.5" />
                <span><strong>{t("Browser Isolation:", appLanguage)}</strong> {t("Encased securely in sandboxed scopes, preventing cross-domain telemetry tracking.", appLanguage)}</span>
              </div>
            </div>
            <p className="text-[10px] font-mono mt-4 text-[#c7c4d8]/40">
              {t("Revised: May 2026 // Auron Grid Protocol Unit", appLanguage)}
            </p>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#c4c0ff]" /> {t("System Terms of Use", appLanguage)}
            </h3>
            <p>
              {t("By accessing the AURON classification layers, you accept the responsibility of providing active permissions inside your browser platform. Interception of synthesized oscillator arrays for malicious deep-fake vocal syntheses is strictly prohibited.", appLanguage)}
            </p>
            <p>
              {t("The system is provided on an \"as-is\" basis. Under no circumstances will AURON AI Labs be liable for delayed outputs due to hardware-based microphone blockage caused by local OS boundaries.", appLanguage)}
            </p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed">
              {t("WARNING: Accessing Commander Clearance levels (Step 3 registration) requires biometric vocal fidelity. Falsifying acoustic telemetry signals is logged as an internal system event.", appLanguage)}
            </div>
          </div>
        )}

        {activeTab === "neural" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#ff5352]" /> {t("Acoustic & Neural Space Sovereignty", appLanguage)}
            </h3>
            <p>
              {t("In accordance with international neuro-rights declarations, AURON grants standard users 100% intellectual possession of their speech patterns, formants, pitch oscillations, and temporal acoustic signatures.", appLanguage)}
            </p>
            <p>
              {t("Our dual client-gemini mapping pipeline never attempts to map psychological metadata. We process your audio *strictly* to translate Greek digits into clear analytical text and voice synthesis sweeps.", appLanguage)}
            </p>
            <div className="space-y-2 font-mono text-[10px] text-[#92dbff]">
              <div>- {t("PITCH COEFFICIENTS: Strictly local.", appLanguage)}</div>
              <div>- {t("TIMBRE CHARACTERISTICS: Retained in RAM strictly.", appLanguage)}</div>
              <div>- {t("STORAGE PATHS: LocalStorage and React Memory Pools.", appLanguage)}</div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
