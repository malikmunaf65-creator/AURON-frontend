import { useState, useEffect } from "react";
import { NavPage, DigitHistory, VoiceSettings, FUTURISTIC_VOICES, TtsVoice } from "@/src/types";
import { playClickSfx, playHoverSfx } from "@/src/utils/audio";
import { Settings, X, Sliders, Volume2, Cpu, Check, ArrowRight } from "lucide-react";
import SoundwaveBg from "@/src/components/SoundwaveBg";
import TopNavBar from "@/src/components/TopNavBar";
import HomeView from "@/src/components/HomeView";
import UploadView from "@/src/components/UploadView";
import DemoView from "@/src/components/DemoView";
import ResultsView from "@/src/components/ResultsView";
import SignupView from "@/src/components/SignupView";
import AboutView from "@/src/components/AboutView";
import FaqView from "@/src/components/FaqView";
import ContactView from "@/src/components/ContactView";
import TermsView from "@/src/components/TermsView";
import AgentLoginView from "@/src/components/AgentLoginView";
import AgentIdentityView from "@/src/components/AgentIdentityView";
import CommandCenterView from "@/src/components/CommandCenterView";
import PremiumSettingsView from "@/src/components/PremiumSettingsView";

// Initial realistic records to seed the results dashboard wonderfully
const DEFAULT_HISTORY: DigitHistory[] = [
  {
    id: "seed_1",
    timestamp: "10:12:45 AM",
    digit: 3,
    english: "three",
    greek: "Gamma",
    confidence: 0.965,
    analysis: "Excellent resonance pattern mapped to vocal frequency 432Hz. Zero anomalies reported in spectroscopic Fourier transforms.",
    filename: "sample_vocal_gamma.wav",
    durationSecs: 1.4,
    isLive: true,
    isMock: false
  },
  {
    id: "seed_2",
    timestamp: "10:15:20 AM",
    digit: 5,
    english: "five",
    greek: "Epsln",
    confidence: 0.92,
    analysis: "Strong sibilant vocalized at offset interval. Neural network predicted outcome Alpha code with absolute high-entropy confidence.",
    filename: "uploaded_subject_delta.wav",
    durationSecs: 2.1,
    isLive: false,
    isMock: true
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>("home");
  const [history, setHistory] = useState<DigitHistory[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appLanguage, setAppLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem("auron_language") || "English (US)";
    } catch {
      return "English (US)";
    }
  });

  const handleLanguageChange = (newLang: string) => {
    setAppLanguage(newLang);
    try {
      localStorage.setItem("auron_language", newLang);
    } catch (e) {}
  };

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem("auron_voice_settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      ttsVoice: "Aetheria",
      engineMode: "offline",
      sciFiSfx: true
    };
  });
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    clearance: string;
    secureSignature: string;
  } | null>(null);

  // Load userProfile on mounting
  useEffect(() => {
    try {
      const persistedUser = localStorage.getItem("auron_user_profile");
      if (persistedUser) {
        const parsed = JSON.parse(persistedUser);
        setUserProfile({
          username: parsed.formData.username,
          email: parsed.formData.email,
          clearance: parsed.formData.clearance,
          secureSignature: parsed.secureSignature
        });
      }
    } catch (e) {}
  }, []);

  const [scrollVibrating, setScrollVibrating] = useState(false);
  const [clickVibrating, setClickVibrating] = useState(false);

  // Monitor scrolling vectors and human click interactions to trigger physical kinetic vibrations
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setScrollVibrating(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollVibrating(false);
      }, 150);
    };

    const handleClick = () => {
      setClickVibrating(true);
      const clickTimeout = setTimeout(() => {
        setClickVibrating(false);
      }, 300);
      return () => clearTimeout(clickTimeout);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Helper function to animate scroll vectors smoothly inside the long Home view
  const scrollToSection = (id: string) => {
    setCurrentPage("home");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Load history from localStorage on mounting
  useEffect(() => {
    try {
      const cached = localStorage.getItem("auron_history");
      if (cached) {
        setHistory(JSON.parse(cached));
      } else {
        setHistory(DEFAULT_HISTORY);
        localStorage.setItem("auron_history", JSON.stringify(DEFAULT_HISTORY));
      }
    } catch (e) {
      setHistory(DEFAULT_HISTORY);
    }
  }, []);

  const handleAddHistory = (item: DigitHistory) => {
    setHistory((prev) => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem("auron_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("auron_history");
    } catch (e) {}
  };

  const handleUpdateSettings = (updated: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem("auron_voice_settings", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleLoginSuccess = (profile: any, fallbackPage: NavPage = "identity") => {
    setUserProfile(profile);
    const pendingUpload = localStorage.getItem("auron_pending_upload_record");
    if (pendingUpload) {
      try {
        const record = JSON.parse(pendingUpload);
        record.id = `upload_${Date.now()}`;
        record.timestamp = new Date().toLocaleTimeString();
        handleAddHistory(record);
        localStorage.removeItem("auron_pending_upload_record");
        setCurrentPage("results");
        return;
      } catch (e) {
        console.error("Failed parsing pending upload on login:", e);
      }
    }
    setCurrentPage(fallbackPage);
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white overflow-x-hidden flex flex-col relative font-sans select-none selection:bg-[#92dbff]/20">
      
      {/* Living Atmospheric background */}
      <SoundwaveBg />

      {/* Top Navbar */}
      <TopNavBar 
        currentPage={currentPage}
        appLanguage={appLanguage}
        onLanguageChange={handleLanguageChange}
        onNavigate={(page) => {
          playClickSfx();
          if (["about", "faq"].includes(page)) {
            scrollToSection(`${page}-section`);
          } else {
            if (!userProfile && (page === "demo")) {
              setCurrentPage("signup");
            } else {
              setCurrentPage(page as NavPage);
              if (page === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }
        }}
        onOpenSettings={() => {
          playClickSfx();
          setSettingsOpen(true);
        }}
        historyCount={history.length}
        userProfile={userProfile}
      />

      {/* Primary views section frame container spacer */}
      <main className="flex-grow flex flex-col relative z-10">
        {currentPage === "home" && (
          <div className="flex flex-col w-full">
            {/* Core Mic / Demo Trigger Section */}
            <div id="hero-section" className="w-full">
              <HomeView 
                onNavigate={(page) => {
                  playClickSfx();
                  if (!userProfile && (page === "demo")) {
                    setCurrentPage("signup");
                  } else {
                    setCurrentPage(page as NavPage);
                  }
                }}
                onAddHistory={handleAddHistory}
                onResetProfile={() => setUserProfile(null)}
                userProfile={userProfile}
                appLanguage={appLanguage}
              />
            </div>

            {/* About Us Section */}
            <div id="about-section" className="w-full border-t border-white/5 bg-[#131319]/20 py-12 scroll-mt-20">
              <AboutView 
                onNavigate={(page) => {
                  playClickSfx();
                  if (!userProfile && (page === "demo")) {
                    setCurrentPage("signup");
                  } else {
                    setCurrentPage(page as NavPage);
                  }
                }}
                appLanguage={appLanguage}
              />
            </div>

            {/* FAQ Section */}
            <div id="faq-section" className="w-full border-t border-white/5 py-12 scroll-mt-20 bg-[#05050a]/40">
              <FaqView appLanguage={appLanguage} />
            </div>
          </div>
        )}
        
        {currentPage === "upload" && (
          <UploadView 
            onNavigate={(page) => setCurrentPage(page as NavPage)}
            onAddHistory={handleAddHistory}
            userProfile={userProfile}
            appLanguage={appLanguage}
          />
        )}

        {currentPage === "demo" && (
          <DemoView 
            onAddHistory={handleAddHistory}
            voiceSettings={voiceSettings}
            appLanguage={appLanguage}
          />
        )}

        {currentPage === "results" && (
          <ResultsView 
            history={history}
            onClearHistory={handleClearHistory}
            voiceSettings={voiceSettings}
            appLanguage={appLanguage}
          />
        )}

        {currentPage === "signup" && (
          userProfile ? (
            <AgentIdentityView 
              userProfile={userProfile}
              onProfileChange={(profile) => setUserProfile(profile)}
              onNavigate={(page) => setCurrentPage(page as NavPage)}
              appLanguage={appLanguage}
            />
          ) : (
            <SignupView 
              onNavigate={(page) => setCurrentPage(page as NavPage)}
              onProfileChange={(profile) => setUserProfile(profile)}
              onAddHistory={handleAddHistory}
              appLanguage={appLanguage}
            />
          )
        )}

        {currentPage === "login" && (
          userProfile ? (
            <AgentIdentityView 
              userProfile={userProfile}
              onProfileChange={(profile) => setUserProfile(profile)}
              onNavigate={(page) => setCurrentPage(page as NavPage)}
              appLanguage={appLanguage}
            />
          ) : (
            <AgentLoginView 
              onLoginSuccess={(profile) => handleLoginSuccess(profile, "identity")}
              onNavigateToSignup={() => setCurrentPage("signup")}
              appLanguage={appLanguage}
            />
          )
        )}

        {currentPage === "identity" && (
          userProfile ? (
            <AgentIdentityView 
              userProfile={userProfile}
              onProfileChange={(profile) => setUserProfile(profile)}
              onNavigate={(page) => setCurrentPage(page as NavPage)}
              appLanguage={appLanguage}
            />
          ) : (
            <AgentLoginView 
              onLoginSuccess={(profile) => handleLoginSuccess(profile, "identity")}
              onNavigateToSignup={() => setCurrentPage("signup")}
              appLanguage={appLanguage}
            />
          )
        )}

        {currentPage === "command" && (
          userProfile ? (
            <CommandCenterView 
              userProfile={userProfile}
              onProfileChange={(profile) => setUserProfile(profile)}
              onNavigate={(page) => setCurrentPage(page as NavPage)}
              appLanguage={appLanguage}
            />
          ) : (
            <AgentLoginView 
              onLoginSuccess={(profile) => handleLoginSuccess(profile, "command")}
              onNavigateToSignup={() => setCurrentPage("signup")}
              appLanguage={appLanguage}
            />
          )
        )}

        {currentPage === "about" && (
          <AboutView 
            onNavigate={(page) => setCurrentPage(page as NavPage)}
            appLanguage={appLanguage}
          />
        )}

        {currentPage === "faq" && (
          <FaqView appLanguage={appLanguage} />
        )}

        {currentPage === "contact" && (
          <ContactView appLanguage={appLanguage} />
        )}

        {currentPage === "terms" && (
          <TermsView appLanguage={appLanguage} />
        )}
      </main>

      {/* SYSTEM OPTION MATRIX CONFIGURATION DIALOG POPUP */}
      {settingsOpen && (
        <PremiumSettingsView
          voiceSettings={voiceSettings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setSettingsOpen(false)}
          userProfile={userProfile}
          onClearAllHistory={() => setHistory([])}
          appLanguage={appLanguage}
          onLanguageChange={handleLanguageChange}
        />
      )}



      {/* FOOTER */}
      <footer className="py-8 border-t border-white/5 bg-[#05050a]/80 backdrop-blur-md relative z-10 select-none">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex flex-col gap-6">
          
          {/* Footer Navigation Grid / Cluster */}
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 border-b border-white/5 pb-6">
            <div 
              onClick={() => { playClickSfx(); setCurrentPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onMouseEnter={playHoverSfx}
              className="font-sans font-black tracking-widest text-[#c4c0ff] cursor-pointer hover:opacity-80 transition-opacity"
            >
              AURON AI
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-wider justify-center">
              <button 
                onClick={() => { playClickSfx(); scrollToSection("about-section"); }}
                onMouseEnter={playHoverSfx}
                className="transition cursor-pointer text-[#c7c4d8]/50 hover:text-[#92dbff]"
              >
                About Us
              </button>
              <button 
                onClick={() => { playClickSfx(); setCurrentPage("contact"); }}
                onMouseEnter={playHoverSfx}
                className={`transition cursor-pointer ${currentPage === "contact" ? "text-[#92dbff]" : "text-[#c7c4d8]/50 hover:text-[#92dbff]"}`}
              >
                Contact Nodes
              </button>
              <button 
                onClick={() => { playClickSfx(); setCurrentPage("terms"); }}
                onMouseEnter={playHoverSfx}
                className={`transition cursor-pointer ${currentPage === "terms" ? "text-[#92dbff]" : "text-[#c7c4d8]/50 hover:text-[#92dbff]"}`}
              >
                Privacy & Terms
              </button>
            </div>
          </div>

          {/* Copyright Area */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/30">
            <span>AURON DECRPYTING ENGINE CORE v1.4</span>
            <span>© 2026 AURON AI. All rights reserved.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
