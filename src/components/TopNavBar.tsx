import { NavPage } from "@/src/types";
import { 
  Menu, X, Settings, Home, Upload, Zap, BarChart3, User, Terminal, Fingerprint, Languages 
} from "lucide-react";
import { useState } from "react";
import { playClickSfx, playHoverSfx } from "@/src/utils/audio";
import { PHONETIC_LANGUAGES } from "@/src/utils/languages";
import { getTranslatedUI, t } from "@/src/utils/translations";

interface TopNavBarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenSettings?: () => void;
  historyCount: number;
  userProfile?: {
    username: string;
    email: string;
    clearance: string;
    secureSignature: string;
  } | null;
  appLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function TopNavBar({
  currentPage,
  onNavigate,
  onOpenSettings,
  historyCount,
  userProfile,
  appLanguage = "English (US)",
  onLanguageChange,
}: TopNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Links enriched with appropriate cyber/modern Lucide icon components for crisp vectors
  const links = userProfile
    ? [
        { name: "Home", value: "home" as NavPage, icon: Home, accent: "#92dbff" },
        { name: "Upload", value: "upload" as NavPage, icon: Upload, accent: "#ff5352" },
        { name: "Demo", value: "demo" as NavPage, icon: Zap, accent: "#ffcf36" },
        { name: "Results", value: "results" as NavPage, icon: BarChart3, accent: "#4f44e2" },
        { name: "My Identity", value: "identity" as NavPage, icon: Fingerprint, accent: "#c4c0ff" },
        { name: "Command Center", value: "command" as NavPage, icon: Terminal, accent: "#00c4fd" },
      ]
    : [
        { name: "Home", value: "home" as NavPage, icon: Home, accent: "#92dbff" },
        { name: "Upload", value: "upload" as NavPage, icon: Upload, accent: "#ff5352" },
        { name: "Demo", value: "demo" as NavPage, icon: Zap, accent: "#ffcf36" },
        { name: "Results", value: "results" as NavPage, icon: BarChart3, accent: "#4f44e2" },
        { name: "Signup Portal", value: "signup" as NavPage, icon: User, accent: "#c4c0ff" },
      ];

  const handleLinkClick = (val: NavPage) => {
    playClickSfx();
    onNavigate(val);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop TopNavBar Component */}
      <nav id="auron-system-navbar" className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d12]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-[1440px] mx-auto w-full gap-4">
          
          {/* Brand AURON on the Left */}
          <div 
            onClick={() => handleLinkClick("home")}
            onMouseEnter={playHoverSfx}
            className="font-sans font-black tracking-widest text-xl bg-gradient-to-r from-white via-[#c4c0ff] to-[#92dbff] bg-clip-text text-transparent hover:drop-shadow-[0_0_8px_rgba(146,219,255,0.5)] transition-all duration-300 cursor-pointer select-none shrink-0"
          >
            AURON
          </div>

          {/* Spaced out Navigation Layout - Designed in highly presentable, compact tactical boxes */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-grow justify-end">
            <ul className="flex items-center gap-1.5 lg:gap-2 font-mono text-[10px] uppercase tracking-wider">
              {links.map((link) => {
                const isActive = currentPage === link.value;
                const IconComponent = link.icon;
                return (
                  <li key={link.value} className="shrink-0">
                    <button
                      onClick={() => handleLinkClick(link.value)}
                      onMouseEnter={playHoverSfx}
                      style={{
                        borderColor: isActive ? `${link.accent}50` : undefined,
                        backgroundColor: isActive ? `${link.accent}12` : undefined,
                        color: isActive ? link.accent : undefined,
                        boxShadow: isActive ? `0 0 10px ${link.accent}1e` : undefined,
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.8 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer hover:shadow-md ${
                        isActive 
                          ? "font-extrabold" 
                          : "bg-[#14141d]/30 border-white/5 text-[#c7c4d8]/65 hover:bg-[#161622]/60 hover:border-white/15 hover:text-white"
                      }`}
                    >
                      <IconComponent 
                        className="w-3.5 h-3.5 shrink-0" 
                        style={{ color: isActive ? link.accent : "#c7c4d8" }} 
                      />
                      <span>{t(link.name, appLanguage)}</span>
                      
                      {link.value === "results" && historyCount > 0 && (
                        <span 
                          style={{ backgroundColor: link.accent }}
                          className="px-1.5 py-[1px] text-[8px] text-black font-black rounded-md ml-1 animate-pulse"
                        >
                          {historyCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Optional System Settings Trigger */}
            {onOpenSettings && (
              <div className="shrink-0 border-l border-white/10 pl-2 lg:pl-3">
                <button
                  onClick={() => {
                    playClickSfx();
                    onOpenSettings();
                  }}
                  onMouseEnter={playHoverSfx}
                  className="p-1 px-2.5 rounded-lg border border-white/5 bg-[#14141d]/30 hover:bg-[#92dbff]/10 hover:border-[#92dbff]/30 text-[#92dbff] transition group cursor-pointer"
                  title="System Configuration"
                >
                  <Settings className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-45" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => {
              playClickSfx();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden text-[#92dbff] focus:outline-none cursor-pointer p-2 rounded-lg bg-white/5 border border-white/10"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Redesigned to also respect beautiful vector icons and boxed layout */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-[#0c0c12]/95 backdrop-blur-2xl md:hidden animate-fadeIn flex flex-col justify-start py-5 px-4 space-y-4 overflow-y-auto">
          <div className="border-b border-white/5 pb-2">
            <span className="font-mono text-[8px] text-[#92dbff] tracking-widest uppercase block font-bold">OPERATIONAL PROTOCOL</span>
          </div>
          
          <ul className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-wider w-full">
            {links.map((link) => {
              const isActive = currentPage === link.value;
              const IconComponent = link.icon;
              return (
                <li key={link.value} className="w-full">
                  <button
                    onClick={() => handleLinkClick(link.value)}
                    style={{
                      borderColor: isActive ? `${link.accent}40` : undefined,
                      backgroundColor: isActive ? `${link.accent}10` : undefined,
                      color: isActive ? link.accent : undefined,
                    }}
                    className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 transition ${
                      isActive 
                        ? "font-bold" 
                        : "bg-[#14141d]/40 border-white/5 text-[#c7c4d8]/80 hover:bg-[#181825]/40"
                    }`}
                  >
                    <IconComponent 
                      className="w-4 h-4 shrink-0" 
                      style={{ color: isActive ? link.accent : "#c7c4d8" }} 
                    />
                    <span className="font-bold flex-grow">{t(link.name, appLanguage)}</span>
                    
                    {link.value === "results" && historyCount > 0 && (
                      <span className="px-2 py-0.5 text-[9px] bg-[#92dbff] text-[#0e0e14] rounded-md font-bold">
                        {historyCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {onOpenSettings && (
            <div className="pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  playClickSfx();
                  onOpenSettings();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#14141d]/50 border border-white/10 text-[#c7c4d8] py-3 rounded-lg font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5"
              >
                ⚙️ SYSTEM CONFIGURATION MATRIX
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

