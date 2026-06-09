import React, { useState, useEffect, useRef } from "react";
import { 
  X, User, Volume2, Cpu, Eye, EyeOff, Bell, Shield, CreditCard, 
  Trash2, Copy, Moon, Sun, Sliders, Globe, Languages, Laptop, 
  Upload, Plus, Key, RefreshCw, AlertTriangle, Calendar, Info,
  Check, CheckCircle2, ShieldAlert, KeyRound, Monitor, MapPin, 
  Clock, Download, Sparkles, FileText, ChevronRight, Lock
} from "lucide-react";
import { playClickSfx, playHoverSfx, playSuccessSfx, playErrorSfx } from "@/src/utils/audio";
import { TtsVoice, FUTURISTIC_VOICES, VoiceSettings } from "@/src/types";
import { PHONETIC_LANGUAGES } from "@/src/utils/languages";
import { getTranslatedUI, t } from "@/src/utils/translations";

interface PremiumSettingsViewProps {
  onClose: () => void;
  voiceSettings: VoiceSettings;
  onUpdateSettings: (updated: Partial<VoiceSettings>) => void;
  userProfile?: {
    username: string;
    email: string;
    clearance: string;
    secureSignature: string;
  } | null;
  onClearAllHistory?: () => void;
  appLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

type TabID = "account" | "audio_model" | "appearance" | "notifications" | "security" | "usage_billing";

export default function PremiumSettingsView({
  onClose,
  voiceSettings,
  onUpdateSettings,
  userProfile,
  onClearAllHistory,
  appLanguage,
  onLanguageChange
}: PremiumSettingsViewProps) {
  
  // Current active tab
  const [activeTab, setActiveTab] = useState<TabID>("account");
  
  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; show: boolean } | null>(null);

  const triggerToast = (msg: string) => {
    setToast({ message: msg, show: true });
    // Sound synthesis
    playSuccessSfx();
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, show: false } : null);
    }, 2500);
  };

  // Avatar Upload simulation
  const [avatar, setAvatar] = useState<string>("/placeholder_avatar.png");
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        triggerToast("Avatar updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile data
  const [displayName, setDisplayName] = useState(userProfile?.username ? `Commander ${userProfile.username.replace("agent_", "")}` : "Commander Munaf");
  const [email, setEmail] = useState(userProfile?.email || "malikmunaf65@gmail.com");
  const [memberDate] = useState("March 2026");
  const [auronId] = useState(userProfile?.secureSignature || "AURON-SEC-MALIK2026X");
  const [isEditingProfileName, setIsEditingProfileName] = useState(false);

  // OTP Verification Simulation State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpPending, setOtpPending] = useState(false);

  const handleRequestOtp = () => {
    if (!email.includes("@")) {
      playErrorSfx();
      triggerToast("Error: Provide a valid communication node email.");
      return;
    }
    playClickSfx();
    setOtpPending(true);
    setTimeout(() => {
      setOtpSent(true);
      setOtpPending(false);
      triggerToast("Temporal OTP broadcast sent to email terminal.");
    }, 1000);
  };

  const handleVerifyOtp = () => {
    playClickSfx();
    if (otpCode === "8594" || otpCode.length === 4) {
      setOtpVerified(true);
      setOtpSent(false);
      triggerToast("OTP Validated successfully. Email address bound!");
    } else {
      playErrorSfx();
      triggerToast("Invalid authorization sequence code.");
    }
  };

  // Password Input / Strength Meter Settings
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const getPasswordStrength = () => {
    if (!password) return { label: "Empty", score: 0, color: "bg-white/10" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: "Fragile (Weak)", score: 20, color: "bg-red-500" };
    if (score <= 4) return { label: "Secured (Medium)", score: 60, color: "bg-yellow-500" };
    return { label: "Fortified (Strong)", score: 100, color: "bg-emerald-500" };
  };

  // Two-Factor Auth State
  const [twoFactorToken, setTwoFactorToken] = useState(() => {
    try {
      const val = localStorage.getItem("auron_two_factor_auth");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });

  // Dropdown options
  const [timezone, setTimezone] = useState(() => {
    try {
      return localStorage.getItem("auron_timezone") || "UTC (GMT +00:00)";
    } catch {
      return "UTC (GMT +00:00)";
    }
  });
  const [language, setLanguage] = useState(() => {
    try {
      return appLanguage || localStorage.getItem("auron_language") || "English (US)";
    } catch {
      return "English (US)";
    }
  });

  useEffect(() => {
    if (appLanguage && appLanguage !== language) {
      setLanguage(appLanguage);
    }
  }, [appLanguage]);

  // ------------------------------------
  // AUDIO & MODEL TAB
  // ------------------------------------
  const [micInput, setMicInput] = useState(() => {
    try {
      return localStorage.getItem("auron_mic_input") || "Default System Micro-Array Grid";
    } catch {
      return "Default System Micro-Array Grid";
    }
  });
  const [sampleRate, setSampleRate] = useState(() => {
    try {
      return localStorage.getItem("auron_audio_sample") || "16000Hz";
    } catch {
      return "16000Hz";
    }
  });
  const [modelSelector, setModelSelector] = useState(() => {
    try {
      return localStorage.getItem("auron_model_selector") || "v2.0 Beta";
    } catch {
      return "v2.0 Beta";
    }
  });
  const [confidence, setConfidence] = useState(() => {
    try {
      const val = localStorage.getItem("auron_audio_confidence");
      return val ? parseInt(val, 10) : 70;
    } catch {
      return 70;
    }
  });
  const [noiseCancellation, setNoiseCancellation] = useState(() => {
    try {
      const val = localStorage.getItem("auron_noise_cancellation");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });
  const [autoPredict, setAutoPredict] = useState(() => {
    try {
      const val = localStorage.getItem("auron_auto_predict");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });

  // ------------------------------------
  // APPEARANCE TAB
  // ------------------------------------
  const [appThemeMode, setAppThemeMode] = useState<"dark" | "light" | "system">(() => {
    try {
      return (localStorage.getItem("auron_appearance_theme") as any) || "dark";
    } catch {
      return "dark";
    }
  });
  const [accentColor, setAccentColor] = useState<"violet" | "cyan" | "red" | "green">(() => {
    try {
      return (localStorage.getItem("auron_appearance_accent") as any) || "violet";
    } catch {
      return "violet";
    }
  });
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(() => {
    try {
      return (localStorage.getItem("auron_appearance_size") as any) || "medium";
    } catch {
      return "medium";
    }
  });
  const [compactView, setCompactView] = useState(() => {
    try {
      const val = localStorage.getItem("auron_compact_view");
      return val !== null ? val === "true" : false;
    } catch {
      return false;
    }
  });
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    try {
      const val = localStorage.getItem("auron_animations_enabled");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });

  // ------------------------------------
  // NOTIFICATIONS TAB
  // ------------------------------------
  const [notifyEmail, setNotifyEmail] = useState(() => {
    try {
      const val = localStorage.getItem("auron_notify_email");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });
  const [notifyPredictionComplete, setNotifyPredictionComplete] = useState(() => {
    try {
      const val = localStorage.getItem("auron_notify_prediction");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(() => {
    try {
      const val = localStorage.getItem("auron_notify_weekly");
      return val !== null ? val === "true" : false;
    } catch {
      return false;
    }
  });
  const [notifyMaintenanceAlerts, setNotifyMaintenanceAlerts] = useState(() => {
    try {
      const val = localStorage.getItem("auron_notify_maintenance");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });
  const [notifyModelUpdates, setNotifyModelUpdates] = useState(() => {
    try {
      const val = localStorage.getItem("auron_notify_model_updates");
      return val !== null ? val === "true" : true;
    } catch {
      return true;
    }
  });

  // ------------------------------------
  // SECURITY STATE
  // ------------------------------------
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Chrome / Intel Mac (Primary Matrix Node)", location: "Singapore, SG", time: "Active Now", active: true },
    { id: "s2", device: "Auron Terminal Shell v1.4", location: "Mumbai, IN", time: "2 Hours Ago", active: true },
    { id: "s3", device: "Safari / iPhone 15 Pro", location: "Dubai, AE", time: "Yesterday", active: true }
  ]);
  const [loginHistory] = useState([
    { date: "2026-06-08 12:44", ip: "103.15.22.4", status: "Success", location: "Singapore" },
    { date: "2026-06-08 10:12", ip: "103.15.22.4", status: "Success", location: "Singapore" },
    { date: "2026-06-07 19:30", ip: "182.44.18.9", status: "Success", location: "Mumbai, IN" },
    { date: "2026-06-06 14:15", ip: "94.200.12.1", status: "Denied (Failed Signature)", location: "Dubai, AE" },
    { date: "2026-06-05 08:02", ip: "94.200.12.1", status: "Success", location: "Dubai, AE" }
  ]);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState("auron_live_ak_92dbff_sec_commander_859438058989_x");

  const handleRegenerateApiKey = () => {
    playClickSfx();
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789_";
    let randomStr = "";
    for (let i = 0; i < 20; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(`auron_live_ak_${randomStr}_x`);
    triggerToast("Enterprise API key regenerated!");
  };

  // Danger zone confirmation flow
  const [dangerConfirmModal, setDangerConfirmModal] = useState<"history" | "reset" | "delete" | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handleRevokeSession = (sessionId: string) => {
    playClickSfx();
    setSessions(sessions.filter(s => s.id !== sessionId));
    triggerToast("Matrix session authentication revoked.");
  };

  const handleWipeHistory = () => {
    if (onClearAllHistory) {
      onClearAllHistory();
    }
    setDangerConfirmModal(null);
    triggerToast("Vector analysis cache purged completely.");
  };

  const handleResetAccount = () => {
    playClickSfx();
    triggerToast("Account settings returned to default. Matrix system rebooted.");
    setDangerConfirmModal(null);
  };

  const handleDeleteAccount = async () => {
    playClickSfx();
    if (deleteConfirmationText === "DELETE") {
      triggerToast("Account terminated permanently. Session clearing...");
      setDangerConfirmModal(null);
      
      try {
        if (userProfile?.secureSignature) {
          await fetch("/api/agents/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              signatureKey: userProfile.secureSignature,
              emailOrCallsign: userProfile.email
            })
          });
        }
      } catch (err) {
        console.error("Failed to delete agent from server-side database:", err);
      }

      // Fast, instantaneous wipe and reload
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } else {
      playErrorSfx();
      triggerToast("Verification locked. String mismatch.");
    }
  };

  // ------------------------------------
  // USAGE & BILLING
  // ------------------------------------
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [freeUsage, setFreeUsage] = useState(7);
  const [cardHolder, setCardHolder] = useState("Commander Munaf");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvc, setCardCvc] = useState("•••");
  const [cardZip, setCardZip] = useState("10001");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");

  // Real copy clipboard logic
  const handleCopyText = (text: string, title: string) => {
    playClickSfx();
    navigator.clipboard.writeText(text);
    triggerToast(`${title} copied to grid memory!`);
  };

  // Keep first render tracked to avoid spamming toast on initial load
  const isFirstRender = useRef(true);

  // Auto-save settings on state change
  useEffect(() => {
    try {
      localStorage.setItem("auron_appearance_accent", accentColor);
      localStorage.setItem("auron_appearance_size", fontSize);
      localStorage.setItem("auron_appearance_theme", appThemeMode);
      localStorage.setItem("auron_audio_sample", sampleRate);
      localStorage.setItem("auron_audio_confidence", confidence.toString());
      localStorage.setItem("auron_mic_input", micInput);
      localStorage.setItem("auron_model_selector", modelSelector);
      localStorage.setItem("auron_noise_cancellation", noiseCancellation.toString());
      localStorage.setItem("auron_auto_predict", autoPredict.toString());
      localStorage.setItem("auron_compact_view", compactView.toString());
      localStorage.setItem("auron_animations_enabled", animationsEnabled.toString());
      localStorage.setItem("auron_notify_email", notifyEmail.toString());
      localStorage.setItem("auron_notify_prediction", notifyPredictionComplete.toString());
      localStorage.setItem("auron_notify_weekly", notifyWeeklyReport.toString());
      localStorage.setItem("auron_notify_maintenance", notifyMaintenanceAlerts.toString());
      localStorage.setItem("auron_notify_model_updates", notifyModelUpdates.toString());
      localStorage.setItem("auron_two_factor_auth", twoFactorToken.toString());
      localStorage.setItem("auron_timezone", timezone);
      localStorage.setItem("auron_language", language);
      if (onLanguageChange) {
        onLanguageChange(language);
      }
    } catch (e) {}

    // Update parent's voice settings
    const updatedVoiceSettings: Partial<VoiceSettings> = {
      ttsVoice: voiceSettings.ttsVoice
    };
    onUpdateSettings(updatedVoiceSettings);

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      // Toast notification for auto-save feedback
      triggerToast("Telemetry configuration auto-saved!");
    }
  }, [
    accentColor,
    fontSize,
    appThemeMode,
    sampleRate,
    confidence,
    voiceSettings.ttsVoice,
    micInput,
    modelSelector,
    noiseCancellation,
    autoPredict,
    compactView,
    animationsEnabled,
    notifyEmail,
    notifyPredictionComplete,
    notifyWeeklyReport,
    notifyMaintenanceAlerts,
    notifyModelUpdates,
    twoFactorToken,
    timezone,
    language
  ]);

  // Global handle save callback
  const handleSaveAllSettings = () => {
    triggerToast("All telemetry signals synchronized!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05050a] text-white flex flex-col md:flex-row overflow-hidden animate-fadeIn select-none">
      
      {/* LEFT NAVIGATION SIDEBAR (Glow styling, glassmorphism blur) */}
      <div className="w-full md:w-64 bg-[#0d0d14]/90 border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0">
        
        {/* App Branding & Back Button */}
        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#05050a]/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#bf3bf4] animate-pulse" />
            <span className="font-mono text-xs font-black tracking-widest text-[#92dbff]">
              {t("SYSTEM MATRIX", appLanguage)}
            </span>
          </div>
          <button
            onClick={() => {
              playClickSfx();
              onClose();
            }}
            className="md:hidden p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation items for tabs */}
        <div className="flex md:flex-col gap-1 p-3 md:p-4 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 md:grow leading-none select-none scrollbar-none scroll-smooth">
          <button
            onClick={() => { playClickSfx(); setActiveTab("account"); }}
            onMouseEnter={playHoverSfx}
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full ${
              activeTab === "account" 
                ? "bg-gradient-to-r from-[#bf3bf4]/15 to-[#3b82f6]/5 text-white border-l-2 border-[#bf3bf4] font-semibold"
                : "text-white/40 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === "account" ? "text-[#bf3bf4]" : ""}`} />
            <span>{t("Account", appLanguage)}</span>
          </button>

          <button
            onClick={() => { playClickSfx(); setActiveTab("audio_model"); }}
            onMouseEnter={playHoverSfx}
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full ${
              activeTab === "audio_model" 
                ? "bg-gradient-to-r from-[#bf3bf4]/15 to-[#3b82f6]/5 text-white border-l-2 border-[#bf3bf4] font-semibold"
                : "text-white/40 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${activeTab === "audio_model" ? "text-[#bf3bf4]" : ""}`} />
            <span>{t("Audio & Model", appLanguage)}</span>
          </button>

          <button
            onClick={() => { playClickSfx(); setActiveTab("appearance"); }}
            onMouseEnter={playHoverSfx}
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full ${
              activeTab === "appearance" 
                ? "bg-gradient-to-r from-[#bf3bf4]/15 to-[#3b82f6]/5 text-white border-l-2 border-[#bf3bf4] font-semibold"
                : "text-white/40 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            <Moon className={`w-4 h-4 ${activeTab === "appearance" ? "text-[#bf3bf4]" : ""}`} />
            <span>{t("Appearance", appLanguage)}</span>
          </button>

          <button
            onClick={() => { playClickSfx(); setActiveTab("notifications"); }}
            onMouseEnter={playHoverSfx}
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full ${
              activeTab === "notifications" 
                ? "bg-gradient-to-r from-[#bf3bf4]/15 to-[#3b82f6]/5 text-white border-l-2 border-[#bf3bf4] font-semibold"
                : "text-white/40 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            <Bell className={`w-4 h-4 ${activeTab === "notifications" ? "text-[#bf3bf4]" : ""}`} />
            <span>{t("Notifications", appLanguage)}</span>
          </button>

          <button
            onClick={() => { playClickSfx(); setActiveTab("security"); }}
            onMouseEnter={playHoverSfx}
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full ${
              activeTab === "security" 
                ? "bg-gradient-to-r from-[#bf3bf4]/15 to-[#3b82f6]/5 text-white border-l-2 border-[#bf3bf4] font-semibold"
                : "text-white/40 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            <Shield className={`w-4 h-4 ${activeTab === "security" ? "text-[#bf3bf4]" : ""}`} />
            <span>{t("Security", appLanguage)}</span>
          </button>

          <button
            onClick={() => { playClickSfx(); setActiveTab("usage_billing"); }}
            onMouseEnter={playHoverSfx}
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full ${
              activeTab === "usage_billing" 
                ? "bg-gradient-to-r from-[#bf3bf4]/15 to-[#3b82f6]/5 text-white border-l-2 border-[#bf3bf4] font-semibold"
                : "text-white/40 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            <CreditCard className={`w-4 h-4 ${activeTab === "usage_billing" ? "text-[#bf3bf4]" : ""}`} />
            <span>{t("Usage & Billing", appLanguage)}</span>
          </button>
        </div>

        {/* Back control & Desktop exit button */}
        <div className="hidden md:block p-4 border-t border-white/5 bg-[#05050a]/60">
          <button
            onClick={() => {
              playClickSfx();
              onClose();
            }}
            className="w-full bg-[#131319] hover:bg-white/5 border border-white/5 text-white/50 hover:text-white font-mono text-[10px] uppercase py-2.5 rounded-lg text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <X size={12} />
            <span>{t("Exit Option Matrix", appLanguage)}</span>
          </button>
        </div>
      </div>

      {/* RIGHT DISPLAY VIEWPORT (Scrollable settings container) */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-12 md:px-12 md:pt-8 md:pb-16 flex flex-col relative bg-[#05050a]">
        
        {/* Absolute Background Ambient Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#bf3bf4]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3b82f6]/5 blur-[120px] pointer-events-none rounded-full" />

        {/* CLOSE CORNER FOR DESKTOP */}
        <button
          onClick={() => {
            playClickSfx();
            onClose();
          }}
          className="hidden md:flex absolute top-6 right-10 p-2.5 bg-[#131319]/80 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded-full transition duration-150 cursor-pointer z-20 items-center justify-center shadow-lg"
          title="Return to AURON Command Console"
        >
          <X className="w-5 h-5" />
        </button>

        {/* DYNAMIC PROGRESSIVE GLOBAL PROFILE HEADING SECTION */}
        <div className="relative mb-8 bg-gradient-to-r from-[#14141d]/85 to-[#0e0e15]/70 border border-white/5 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#bf3bf4]/10 to-transparent blur-md pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative">
            
            {/* Circular Avatar with upload hover overlay */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full border-2 border-[#bf3bf4]/40 overflow-hidden bg-[#1c1c24] flex items-center justify-center shadow-lg shadow-[#bf3bf4]/10 relative">
                {avatar && avatar !== "/placeholder_avatar.png" ? (
                  <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#bf3bf4]/20 to-[#3b82f6]/20 flex items-center justify-center font-sans font-black text-2xl text-white">
                    {displayName ? displayName.charAt(10) || displayName.charAt(0) : "M"}
                  </div>
                )}
                
                {/* Upload overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-4 h-4 text-white" />
                  <span className="font-mono text-[8px] text-white/85 tracking-tighter mt-1 uppercase">Upload</span>
                  <input type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />
                </label>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-[#bf3bf4] hover:bg-[#bf3bf4]/90 rounded-full flex items-center justify-center text-white border border-[#05050a] cursor-pointer shadow-md">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile fields and tags */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5 justify-center sm:justify-start">
                <h1 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2 justify-center sm:justify-start">
                  {displayName}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="font-mono text-[8px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase font-bold">
                    🛡️ Verified Commander
                  </span>
                </div>
              </div>

              {/* Email with verified badge */}
              <div className="flex items-center gap-1.5 justify-center sm:justify-start text-[#c7c4d8]/75 text-xs font-sans mb-3">
                <span>{email}</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-0.5 rounded-full" title="Active bound Node">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-white/20 font-mono text-[9px]">|</span>
                <span className="text-white/30 text-[10px] font-mono">Member since {memberDate}</span>
              </div>

              {/* AURON ID with instant copy */}
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <div className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-white/40">AURON-ID ✦</span>
                  <span className="text-[#92dbff] select-all uppercase tracking-wide">{auronId}</span>
                  <button
                    onClick={() => handleCopyText(auronId, "Auron security ID")}
                    className="p-0.5 text-white/30 hover:text-white transition cursor-pointer"
                    title="Copy to terminal clipboard"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                {/* Edit profile launcher button */}
                <button
                  onClick={() => {
                    playClickSfx();
                    triggerToast("Launcher: Profile modification overlay activated.");
                  }}
                  className="bg-gradient-to-r from-[#bf3bf4] to-[#4f44e2] hover:shadow-[0_0_15px_rgba(191,59,244,0.35)] text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-lg transition duration-200 cursor-pointer active:scale-95"
                >
                  Edit Profile
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* CONTAINER FOR ACTIVE TAB OPTIONS */}
        <div className="flex-1 flex flex-col gap-6 p-1 relative min-h-[300px] mb-24">
          
          {/* ========================================================================= */}
          {/* TAB 1: ACCOUNT SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === "account" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Card - Profile Attributes */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <User className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Profile Identity Controls</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      Change Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#1c1c24]/50 border border-white/5 font-mono text-xs text-white p-3.5 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all placeholder:text-white/20"
                      placeholder="Display Name"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      Binding Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setOtpVerified(false);
                          setOtpSent(false);
                        }}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 font-sans text-xs text-white p-3.5 pr-28 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all"
                        placeholder="Email Node Address"
                      />
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={otpPending || otpVerified}
                        className="absolute right-2 top-2 px-3 py-1.5 bg-[#bf3bf4]/15 hover:bg-[#bf3bf4]/25 border border-[#bf3bf4]/30 text-[#bf3bf4] font-mono text-[9px] uppercase tracking-wider rounded-lg transition cursor-pointer disabled:opacity-50"
                      >
                        {otpVerified ? "Bound ✅" : otpPending ? "Processing" : "Verify Node"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Email OTP Validation Prompt */}
                {otpSent && !otpVerified && (
                  <div className="mt-4 p-4 bg-[#bf3bf4]/5 border border-[#bf3bf4]/25 rounded-xl animate-scaleIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-[9px] text-[#bf3bf4] uppercase tracking-wider block font-bold mb-1">
                          📡 System Temporal Passcode Entry Required
                        </span>
                        <p className="font-sans text-[11px] text-[#c7c4d8]/75">
                          Type any 4-digit code (e.g. <strong className="text-white">8594</strong>) to simulate valid verification handshake.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-20 bg-black/40 border border-white/10 p-2 text-center font-mono text-xs rounded-lg text-white font-bold focus:border-[#bf3bf4] focus:outline-none"
                          placeholder="0000"
                        />
                        <button
                          onClick={handleVerifyOtp}
                          className="px-4 py-2 bg-[#bf3bf4] hover:bg-[#bf3bf4]/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card - Password Control Panel */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Lock className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Administrative Password Sequence</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      New Security Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 font-mono text-xs text-white p-3.5 pr-11 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all placeholder:text-white/20"
                        placeholder="••••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => { playClickSfx(); setShowPassword(!showPassword); }}
                        className="absolute right-3.5 top-3.5 text-white/35 hover:text-white transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Interactive Password Strength meter */}
                    {password && (
                      <div className="mt-2 text-left">
                        <div className="flex justify-between items-center mb-1 text-[9px] font-mono">
                          <span className="text-white/40">STRATEGIC VULNERABILITY LEVEL:</span>
                          <span className={getPasswordStrength().score === 100 ? "text-emerald-400 font-bold" : "text-yellow-400"}>
                            {getPasswordStrength().label}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrength().color}`}
                            style={{ width: `${getPasswordStrength().score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2FA Toggle switch */}
                  <div className="flex flex-col gap-2 justify-center pl-0.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-white tracking-wide block uppercase font-bold">
                          Multi-Factor Authentication (2FA)
                        </span>
                        <span className="text-white/40 text-[9px] font-sans leading-none">
                          Authorized voiceprints bound to login checks
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          ON (Forced)
                        </span>
                        <button
                          onClick={() => {
                            playClickSfx();
                            setTwoFactorToken(!twoFactorToken);
                            triggerToast(`Two-Factor Authenticator is locked to ON state for commander clearance safety.`);
                          }}
                          className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer ${
                            twoFactorToken ? "bg-gradient-to-r from-[#bf3bf4] to-[#00c4fd]" : "bg-white/10"
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                            twoFactorToken ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card - Preferences */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Globe className="w-4 h-4 text-[#bf3bf4]" />
                  <span>{t("Geo-Temporal Coordinates", appLanguage)}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      {t("System Timezone Vector", appLanguage)}
                    </label>
                    <div className="relative">
                      <select
                        value={timezone}
                        onChange={(e) => { playClickSfx(); setTimezone(e.target.value); }}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 text-xs text-white p-3.5 pr-10 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all appearance-none cursor-pointer font-sans"
                      >
                        <option value="UTC (GMT +00:00)">UTC (GMT +00:00) — {t("Tactical Standard", appLanguage)}</option>
                        <option value="EST (GMT -05:00)">EST (GMT -05:00) — {t("New York Hub", appLanguage)}</option>
                        <option value="GMT (GMT +01:00)">GMT (GMT +01:00) — {t("London Core", appLanguage)}</option>
                        <option value="SGT (GMT +08:00)">SGT (GMT +08:00) — {t("Asia Containment", appLanguage)}</option>
                        <option value="PST (GMT -08:00)">PST (GMT -08:00) — {t("Pacific Grid", appLanguage)}</option>
                      </select>
                      <span className="absolute right-3.5 top-4.5 pointer-events-none text-white/50">▼</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      {t("Phonetic Language Paradigm", appLanguage)}
                    </label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => { playClickSfx(); setLanguage(e.target.value); }}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 text-xs text-white p-3.5 pr-10 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all appearance-none cursor-pointer font-sans"
                      >
                        {PHONETIC_LANGUAGES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — {t(item.desc, appLanguage)}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3.5 top-4.5 pointer-events-none text-white/50">▼</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#bf3bf4] font-bold uppercase tracking-widest pl-0.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#bf3bf4] animate-pulse"></span> {t("App UI Language Settings", appLanguage)}
                    </label>
                    <div className="relative">
                      <select
                        value={appLanguage || "English (US)"}
                        onChange={(e) => {
                          const val = e.target.value;
                          playClickSfx();
                          if (onLanguageChange) {
                            onLanguageChange(val);
                          }
                        }}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 text-xs text-white p-3.5 pr-10 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all appearance-none cursor-pointer font-sans"
                      >
                        {PHONETIC_LANGUAGES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3.5 top-4.5 pointer-events-none text-white/50">▼</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AUDIO & MODEL SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === "audio_model" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Card: Acoustic Capture Parameters */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Volume2 className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Acoustic Capture Parameters</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Mic input dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      Microphone Sensor Array Device
                    </label>
                    <div className="relative font-sans">
                      <select
                        value={micInput}
                        onChange={(e) => { playClickSfx(); setMicInput(e.target.value); }}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 text-xs text-white p-3.5 pr-10 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Default System Micro-Array Grid">Default System Micro-Array Grid</option>
                        <option value="Auron Acoustic Condenser v4">Auron Acoustic Condenser Hifi v4</option>
                        <option value="Integrated Mobile Microphone Capsule">Integrated Mobile Microphone Capsule</option>
                      </select>
                      <span className="absolute right-3.5 top-4.5 pointer-events-none text-white/50">▼</span>
                    </div>
                  </div>

                  {/* Sample Rate selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5 block">
                      Phonetic Capture Sample Rate
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["8000Hz", "16000Hz", "44100Hz"].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => { playClickSfx(); setSampleRate(rate); }}
                          className={`py-3.5 rounded-xl border text-[10px] font-mono tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                            sampleRate === rate 
                              ? "border-[#bf3bf4] bg-[#bf3bf4]/10 text-white font-bold"
                              : "border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:text-white"
                          }`}
                        >
                          {rate}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card - Engine and Model parameters */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Cpu className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Auron Deep Neural Networks</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Model version */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      Classifier Core Model Variant
                    </label>
                    <div className="relative font-sans">
                      <select
                        value={modelSelector}
                        onChange={(e) => { playClickSfx(); setModelSelector(e.target.value); }}
                        className="w-full bg-[#1c1c24]/50 border border-white/5 text-xs text-white p-3.5 pr-10 rounded-xl focus:border-[#bf3bf4] focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="v2.0 Beta">AURON v2.0 Beta — Dynamic Spectrogram Transformer</option>
                        <option value="v1.4">AURON v1.4 — Production Acoustic Weighting</option>
                      </select>
                      <span className="absolute right-3.5 top-4.5 pointer-events-none text-white/50">▼</span>
                    </div>
                  </div>

                  {/* Confidence Threshold slider */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center pl-0.5">
                      <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest">
                        Decision Gate Cutoff (Confidence)
                      </label>
                      <span className="font-mono text-xs font-bold text-[#92dbff]">
                        {confidence}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] text-white/20">0%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={confidence}
                        onChange={(e) => { setConfidence(parseInt(e.target.value)); }}
                        className="flex-1 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#bf3bf4]"
                      />
                      <span className="font-mono text-[9px] text-white/20">100%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/5">
                  
                  {/* Noise cancellation toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-white tracking-wide block uppercase font-bold">
                        Noise Cancellation Shield
                      </span>
                      <span className="text-white/40 text-[9px] font-sans">
                        Bandpass filtering and baseline hum containment
                      </span>
                    </div>
                    <button
                      onClick={() => { playClickSfx(); setNoiseCancellation(!noiseCancellation); }}
                      className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer shrink-0 ${
                        noiseCancellation ? "bg-gradient-to-r from-[#bf3bf4] to-[#00c4fd]" : "bg-white/10"
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                        noiseCancellation ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Auto-predict on upload toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-white tracking-wide block uppercase font-bold">
                        Upload Ingest Handshake
                      </span>
                      <span className="text-white/40 text-[9px] font-sans">
                        Auto-execute spectrogram predictions instantly
                      </span>
                    </div>
                    <button
                      onClick={() => { playClickSfx(); setAutoPredict(!autoPredict); }}
                      className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer shrink-0 ${
                        autoPredict ? "bg-gradient-to-r from-[#bf3bf4] to-[#00c4fd]" : "bg-white/10"
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                        autoPredict ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                </div>

              </div>
              
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: APPEARANCE */}
          {/* ========================================================================= */}
          {activeTab === "appearance" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Moon className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Sub-Grid Appearance Paradigm</span>
                </h3>

                {/* Dark/Light/System Toggle Switcher pill */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      Visual Luminosity Preset
                    </label>
                    <div className="bg-black/50 border border-white/5 p-1 rounded-2xl flex max-w-sm relative">
                      {[
                        { id: "dark", label: "Midnight Void", icon: Moon },
                        { id: "light", label: "Luminous", icon: Sun },
                        { id: "system", label: "Ambient", icon: Laptop }
                      ].map((theme) => {
                        const isMatch = appThemeMode === theme.id;
                        const ThemeIcon = theme.icon;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => { playClickSfx(); setAppThemeMode(theme.id as any); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-mono text-[9px] uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                              isMatch 
                                ? "bg-gradient-to-r from-[#bf3bf4] to-[#3b82f6] text-white font-bold shadow-[0_0_12px_rgba(191,59,244,0.2)]"
                                : "text-white/40 hover:text-white"
                            }`}
                          >
                            <ThemeIcon className="w-3.5 h-3.5" />
                            <span>{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accent Color picker */}
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                    <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                      Quantum Chromatic Accent
                    </label>
                    
                    <div className="flex gap-3">
                      {[
                        { id: "violet", label: "Violet Void", hex: "bg-[#bf3bf4]", shadow: "shadow-[#bf3bf4]/20" },
                        { id: "cyan", label: "Cyan Flare", hex: "bg-[#00c4fd]", shadow: "shadow-[#00c4fd]/20" },
                        { id: "red", label: "Crimson Sector", hex: "bg-[#ff5352]", shadow: "shadow-[#ff5352]/20" },
                        { id: "green", label: "Apex Leaf", hex: "bg-[#4ade80]", shadow: "shadow-[#4ade80]/20" }
                      ].map((col) => {
                        const isMatch = accentColor === col.id;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => { playClickSfx(); setAccentColor(col.id as any); }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                              isMatch 
                                ? "border-white/20 bg-white/5 text-white font-bold"
                                : "border-white/5 hover:border-white/10 text-white/50"
                            }`}
                            title={col.label}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full ${col.hex} shadow-md ${isMatch ? col.shadow : ""}`} />
                            <span>{col.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Size switcher */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] text-[#c7c4d8]/60 uppercase tracking-widest pl-0.5">
                        Display Typographical Scale
                      </label>
                      <div className="bg-black/50 border border-white/5 p-1 rounded-xl flex">
                        {[
                          { id: "small", label: "S" },
                          { id: "medium", label: "M" },
                          { id: "large", label: "L" }
                        ].map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => { playClickSfx(); setFontSize(sz.id as any); }}
                            className={`flex-1 py-2 font-mono text-[10px] rounded-lg transition ${
                              fontSize === sz.id 
                                ? "bg-white/10 text-[#92dbff] font-bold"
                                : "text-white/40 hover:text-white"
                            }`}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles cluster */}
                    <div className="flex flex-col gap-3 justify-center">
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-white tracking-wide block uppercase font-bold">
                            Compact Ingest Grid
                          </span>
                          <span className="text-white/40 text-[9px] font-sans">
                            Consolidate result matrix padding scales
                          </span>
                        </div>
                        <button
                          onClick={() => { playClickSfx(); setCompactView(!compactView); }}
                          className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer sink-0 ${
                            compactView ? "bg-gradient-to-r from-[#bf3bf4] to-[#00c4fd]" : "bg-white/10"
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                            compactView ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-white tracking-wide block uppercase font-bold">
                            Quantum Motion Dynamics
                          </span>
                          <span className="text-white/40 text-[9px] font-sans">
                            Render high fidelity micro-state transitions
                          </span>
                        </div>
                        <button
                          onClick={() => { playClickSfx(); setAnimationsEnabled(!animationsEnabled); }}
                          className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer sink-0 ${
                            animationsEnabled ? "bg-gradient-to-r from-[#bf3bf4] to-[#00c4fd]" : "bg-white/10"
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                            animationsEnabled ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: NOTIFICATIONS */}
          {/* ========================================================================= */}
          {activeTab === "notifications" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Bell className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Sub-Grid Transmission Protocol</span>
                </h3>

                <div className="space-y-4">
                  {[
                    { state: notifyEmail, set: setNotifyEmail, title: "Subsegment Email Transmissions", desc: "Broadcast spectrogram digests directly to the active email address endpoint." },
                    { state: notifyPredictionComplete, set: setNotifyPredictionComplete, title: "Synthesis Ready Beep Alerts", desc: "Instant audio and push signals when deep classification parameters converge." },
                    { state: notifyWeeklyReport, set: setNotifyWeeklyReport, title: "Weekly Convergence Metrics", desc: "Synthesize global acoustic performance reviews." },
                    { state: notifyMaintenanceAlerts, set: setNotifyMaintenanceAlerts, title: "System Maintenance Broadcasts", desc: "Urgent announcements regarding core network updates." },
                    { state: notifyModelUpdates, set: setNotifyModelUpdates, title: "Neural Model Variant Updates", desc: "Receive real-time push alerts of new deep model parameters releases." }
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/[0.02] last:border-0">
                      <div className="pr-4">
                        <span className="font-mono text-[10px] text-white tracking-wide block uppercase font-bold">
                          {notif.title}
                        </span>
                        <span className="text-white/40 text-[9px] font-sans leading-relaxed">
                          {notif.desc}
                        </span>
                      </div>
                      <button
                        onClick={() => { playClickSfx(); notif.set(!notif.state); }}
                        className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer shrink-0 ${
                          notif.state ? "bg-gradient-to-r from-[#bf3bf4] to-[#00c4fd]" : "bg-white/10"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                          notif.state ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SECURITY */}
          {/* ========================================================================= */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* API Key panel */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Key className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Developer Credentials (API Handshake)</span>
                </h3>

                <p className="font-sans text-[11px] text-[#c7c4d8]/60 mb-4 leading-normal">
                  Interface with deep neural networks directly. These credentials have commander security authorization.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest pl-0.5">
                    Live Enterprise API Key
                  </label>
                  <div className="flex items-center gap-2 bg-[#1c1c24]/50 border border-white/5 rounded-xl p-2 pl-3.5 relative overflow-hidden">
                    <span className="font-mono text-xs text-white/90 select-all truncate flex-1 tracking-wider pr-16">
                      {apiKeyVisible ? apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </span>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => { playClickSfx(); setApiKeyVisible(!apiKeyVisible); }}
                        className="p-1.5 text-white/40 hover:text-[#92dbff] transition cursor-pointer"
                        title={apiKeyVisible ? "Hide key content" : "Reveal core credentials"}
                      >
                        {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleCopyText(apiKey, "Auron API Secret Key")}
                        className="p-1.5 text-white/40 hover:text-[#92dbff] transition cursor-pointer"
                        title="Copy to terminal memory"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleRegenerateApiKey}
                        className="p-1.5 text-white/40 hover:text-[#ff5352] transition cursor-pointer"
                        title="Cycle core signatures"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Monitor className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Authorized Matrix Sessions</span>
                </h3>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/30 border border-white/[0.03] rounded-xl p-3.5 gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-white/70 mt-0.5">
                          <Monitor className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-mono text-xs text-white block font-bold leading-normal">
                            {sess.device}
                          </span>
                          <span className="font-mono text-[9px] text-[#c7c4d8]/55 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[#00c4fd]"><MapPin className="w-2.5 h-2.5" /> {sess.location}</span>
                            <span className="flex items-center gap-1 text-white/30"><Clock className="w-2.5 h-2.5" /> {sess.time}</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-lg transition shrink-0 cursor-pointer text-center"
                      >
                        Revoke Access
                      </button>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="font-mono text-[10px] text-center text-white/30 py-3">All nodes deactivated.</p>
                  )}
                </div>
              </div>

              {/* Historical Log list */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <ShieldAlert className="w-4 h-4 text-[#bf3bf4]" />
                  <span>Signature Handshake Audit Log</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 font-mono text-[9px] text-white/40 uppercase tracking-widest">
                        <th className="pb-2.5 font-bold">Temporal Stamp</th>
                        <th className="pb-2.5 font-bold">Grid IP Anchor</th>
                        <th className="pb-2.5 font-bold">Locality</th>
                        <th className="pb-2.5 font-bold text-right">Handshake Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[11px] divide-y divide-white/[0.02]">
                      {loginHistory.map((hist, index) => (
                        <tr key={index} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 text-white/70">{hist.date}</td>
                          <td className="py-2.5 text-white/50">{hist.ip}</td>
                          <td className="py-2.5 text-[#00c4fd]/70">{hist.location}</td>
                          <td className="py-2.5 text-right font-bold">
                            <span className={hist.status === "Success" ? "text-emerald-400" : "text-red-400 animate-pulse"}>
                              {hist.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-500/20 bg-red-500/[0.03] rounded-xl p-5 mt-4">
                <h3 className="font-sans text-xs font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-red-500/10 pb-2">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  <span>Terminal Breach Zone (Irreversible Controls)</span>
                </h3>

                <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-500/5 pb-3">
                    <div>
                      <span className="font-mono text-xs text-white block uppercase font-bold mb-1">
                        Purge Acoustic Predictive History
                      </span>
                      <p className="font-sans text-[10px] text-[#c7c4d8]/60 leading-normal">
                        Completely remove all past voice predictions, analysis matrix charts, and audio blocks.
                      </p>
                    </div>
                    <button
                      onClick={() => { playClickSfx(); setDangerConfirmModal("history"); }}
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Purge History Cache
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-500/5 pb-3">
                    <div>
                      <span className="font-mono text-xs text-white block uppercase font-bold mb-1">
                        System Configuration Wipe
                      </span>
                      <p className="font-sans text-[10px] text-[#c7c4d8]/60 leading-normal">
                        Revert visual presets, preferences, model gates, and vocal synthesis host anchors back to defaults.
                      </p>
                    </div>
                    <button
                      onClick={() => { playClickSfx(); setDangerConfirmModal("reset"); }}
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Reset Configuration Settings
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-white block uppercase font-bold mb-1">
                        Force Terminal Account Destruction
                      </span>
                      <p className="font-sans text-[10px] text-[#c7c4d8]/60 leading-normal">
                        Wipe all registered credentials, cloud signatures, licenses, billing matrices and close connection forever.
                      </p>
                    </div>
                    <button
                      onClick={() => { playClickSfx(); setDangerConfirmModal("delete"); setDeleteConfirmationText(""); }}
                      className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-mono text-[9px] uppercase tracking-wider rounded-lg transition cursor-pointer font-bold shadow-lg shadow-red-500/10"
                    >
                      Delete Agent Account
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: USAGE & BILLING */}
          {/* ========================================================================= */}
          {activeTab === "usage_billing" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Stats matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Tactical Predictions (Today)", count: "14 Ingests", change: "+12.4% vs Baseline" },
                  { label: "Monthly Bandwidth Accumulator", count: "182 / 200 Limit", change: "91% Allocated" },
                  { label: "Historical Node Runs", count: "2,492 Classified", change: "97.35% Avg Accuracy" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#101017]/85 border border-white/5 rounded-xl p-4 text-left">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-wider block mb-1">
                      {stat.label}
                    </span>
                    <span className="font-sans text-lg font-bold text-white block mb-1">
                      {stat.count}
                    </span>
                    <span className="font-mono text-[8.5px] text-[#00c4fd] block font-bold">
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar and Plan structure */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md text-left">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                  Free Sector Bandwidth Allocation
                </h3>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5 font-mono text-[10px]">
                    <span className="text-white/40">GUEST INGEST PROTOCOLS COMPLETED:</span>
                    <span className="text-[#bf3bf4] font-bold">7 / 10 FREE RUNS</span>
                  </div>
                  {/* Animated progress bar */}
                  <div className="w-full h-2.5 bg-black/50 border border-white/5 rounded-full overflow-hidden p-0.5 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-shimmer pointer-events-none" style={{ backgroundSize: "200% 100%" }} />
                    <div 
                      className="h-full bg-gradient-to-r from-[#bf3bf4] via-[#4f44e2] to-[#00c4fd] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  
                  {/* Free Plan */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[9px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded uppercase font-bold">
                          Current Node
                        </span>
                        <span className="font-sans text-lg font-black text-white">$0</span>
                      </div>
                      <h4 className="font-mono text-xs uppercase text-[#92dbff] font-bold mb-2">Free Allocation Class</h4>
                      <ul className="space-y-1 bg-white/[0.01] p-2 rounded-lg border border-white/[0.02]">
                        <li className="font-sans text-[10px] text-[#c7c4d8]/60 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#bf3bf4]" /> 10 analysis uploads / month
                        </li>
                        <li className="font-sans text-[10px] text-[#c7c4d8]/60 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#bf3bf4]" /> Standard baseline latency values
                        </li>
                        <li className="font-sans text-[10px] text-[#c7c4d8]/60 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#bf3bf4]" /> Offline synthesis engines only
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pro Plan */}
                  <div className="bg-gradient-to-br from-[#1c1232]/80 to-[#0e0a1b]/80 border-2 border-[#bf3bf4]/40 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-[0_0_20px_rgba(191,59,244,0.1)]">
                    <div className="absolute top-0 right-0 bg-[#bf3bf4] text-black font-mono text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                      Recommended
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[9px] bg-gradient-to-r from-[#bf3bf4]/30 to-[#00c4fd]/30 text-white border border-[#bf3bf4]/40 px-2 py-0.5 rounded uppercase font-bold">
                          Premium Access
                        </span>
                        <span className="font-sans text-lg font-black text-white">$5<span className="text-[10px] text-white/40">/mo</span></span>
                      </div>
                      
                      <h4 className="font-mono text-xs uppercase text-[#bf3bf4] font-bold mb-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Certified Agent Pro</span>
                      </h4>
                      
                      <ul className="space-y-1 bg-black/40 p-2 rounded-lg border border-[#bf3bf4]/10 mb-4">
                        <li className="font-sans text-[10px] text-[#c7c4d8]/80 flex items-center gap-1.5">
                          <span className="text-[#bf3bf4]">✦</span> Unlimited high-fidelity predictions
                        </li>
                        <li className="font-sans text-[10px] text-[#c7c4d8]/80 flex items-center gap-1.5">
                          <span className="text-[#bf3bf4]">✦</span> Developer API credentials activation
                        </li>
                        <li className="font-sans text-[10px] text-[#c7c4d8]/80 flex items-center gap-1.5">
                          <span className="text-[#bf3bf4]">✦</span> Exclusive prebuilt neural voice agents
                        </li>
                        <li className="font-sans text-[10px] text-[#c7c4d8]/80 flex items-center gap-1.5">
                          <span className="text-[#bf3bf4]">✦</span> High-priority queue processing speeds
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => { playClickSfx(); triggerToast("Redirecting payment gateways... Locked in Certified Agent Pro plan."); }}
                      className="w-full bg-[#bf3bf4] hover:bg-[#bf3bf4]/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider py-2.5 rounded-lg text-center transition cursor-pointer shadow-lg shadow-[#bf3bf4]/15"
                    >
                      Cycle Plan: Upgrade to Pro
                    </button>
                  </div>

                </div>
              </div>

              {/* Stochastic Stripe Card Form and Invoices */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md text-left">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                  Stripe-Secured Integration Gateway
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); playClickSfx(); triggerToast("Card details tokenized successfully."); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest pl-0.5">Card Holder</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-xs text-white p-3 rounded-lg focus:border-[#bf3bf4] focus:outline-none"
                        placeholder="Commander Name"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest pl-0.5">Card Token sequence</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-xs text-white p-3 rounded-lg focus:border-[#bf3bf4] focus:outline-none"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest pl-0.5">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-xs text-white p-3 rounded-lg focus:border-[#bf3bf4] focus:outline-none text-center"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest pl-0.5">CVC Shield Code</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-xs text-white p-3 rounded-lg focus:border-[#bf3bf4] focus:outline-none text-center"
                        placeholder="•••"
                        maxLength={3}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest pl-0.5">Postal Zip Code</label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-xs text-white p-3 rounded-lg focus:border-[#bf3bf4] focus:outline-none text-center"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#4f44e2] to-[#bf3bf4] hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] text-white font-mono text-[9px] uppercase tracking-wider py-2 px-5 rounded-lg transition duration-200 cursor-pointer active:scale-95"
                    >
                      Update Secure Card Gateway
                    </button>
                  </div>
                </form>
              </div>

              {/* Historical Billing table */}
              <div className="bg-[#101017]/85 border border-white/5 rounded-xl p-5 backdrop-blur-md text-left">
                <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                  Invoice and Transmission Ledger
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase tracking-widest">
                        <th className="pb-2.5">Invoice-ID</th>
                        <th className="pb-2.5">Temporal Stamp</th>
                        <th className="pb-2.5">Billing Interval</th>
                        <th className="pb-2.5">Amount Paid</th>
                        <th className="pb-2.5 text-right">Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {[
                        { id: "AUR-INV-2026-004", date: "2026-06-01", cycle: "Pro Plan (Monthly)", cost: "$5.00 USD" },
                        { id: "AUR-INV-2026-003", date: "2026-05-01", cycle: "Pro Plan (Monthly)", cost: "$5.00 USD" },
                        { id: "AUR-INV-2026-002", date: "2026-04-01", cycle: "Pro Plan (Monthly)", cost: "$5.00 USD" },
                        { id: "AUR-INV-2026-001", date: "2026-03-01", cycle: "Activation Provisioning", cost: "$15.00 USD" }
                      ].map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 text-[#92dbff] font-bold">{inv.id}</td>
                          <td className="py-2.5 text-white/50">{inv.date}</td>
                          <td className="py-2.5 text-white/60">{inv.cycle}</td>
                          <td className="py-2.5 font-bold text-emerald-400">{inv.cost}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => { playClickSfx(); triggerToast("Downloading Temporal Certificate PDF..."); }}
                              className="p-1 hover:text-[#92dbff] text-white/30 transition cursor-pointer"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>



      </div>

      {/* DUMP / DETONATE CONFIRMATION MODAL OVERLAYS */}
      {dangerConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-[#16161f] border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-2xl p-6 md:p-8 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />
            
            <div className="text-center flex flex-col gap-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h4 className="font-sans text-base md:text-lg font-bold text-white uppercase tracking-wider">
                  Critical Handshake Authorization Required
                </h4>
                <p className="font-mono text-[9px] text-red-400 block mt-1 uppercase tracking-widest font-bold">
                  Irreversible Security Event Warning
                </p>
              </div>

              {dangerConfirmModal === "history" && (
                <>
                  <p className="font-sans text-xs text-[#c7c4d8]/75 leading-relaxed">
                    This step will wipe all classified greek audio analysis transcripts from your workspace logs completely.
                  </p>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={() => setDangerConfirmModal(null)}
                      className="flex-1 bg-white/5 hover:bg-white/10 font-mono text-xs text-white/70 rounded-xl py-3 cursor-pointer"
                    >
                      Abort Clear
                    </button>
                    <button
                      onClick={handleWipeHistory}
                      className="flex-1 bg-red-500 hover:bg-red-600 font-mono text-xs text-white font-bold rounded-xl py-3 cursor-pointer shadow-lg shadow-red-500/15"
                    >
                      Wipe Logs Now
                    </button>
                  </div>
                </>
              )}

              {dangerConfirmModal === "reset" && (
                <>
                  <p className="font-sans text-xs text-[#c7c4d8]/75 leading-relaxed">
                    This will delete all customized sample rates, sliders, chromatic colors and voice selectors.
                  </p>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={() => setDangerConfirmModal(null)}
                      className="flex-1 bg-white/5 hover:bg-white/10 font-mono text-xs text-white/70 rounded-xl py-3 cursor-pointer"
                    >
                      Abort Reset
                    </button>
                    <button
                      onClick={handleResetAccount}
                      className="flex-1 bg-red-500 hover:bg-red-600 font-mono text-xs text-white font-bold rounded-xl py-3 cursor-pointer shadow-lg shadow-red-500/15"
                    >
                      Reset Core Settings
                    </button>
                  </div>
                </>
              )}

              {dangerConfirmModal === "delete" && (
                <>
                  <p className="font-sans text-xs text-[#c7c4d8]/75 leading-relaxed">
                    All registered credentials, local database caches, custom agent signatures and voice parameters will be deleted from Server Storage instantly.
                  </p>
                  
                  <div className="bg-black/35 p-3 rounded-lg border border-red-500/15 text-left flex flex-col gap-2">
                    <label className="font-mono text-[9px] text-red-400 uppercase tracking-wider font-bold">
                      Type "DELETE" below to authorize:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmationText}
                      onChange={(e) => setDeleteConfirmationText(e.target.value)}
                      className="w-full bg-black/60 border border-white/5 p-2 font-mono text-xs text-center text-red-400 font-bold focus:border-red-500 focus:outline-none placeholder:text-red-500/20"
                      placeholder="DELETE"
                    />
                  </div>

                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={() => setDangerConfirmModal(null)}
                      className="flex-1 bg-white/5 hover:bg-white/10 font-mono text-xs text-white/70 rounded-xl py-3 cursor-pointer"
                    >
                      Abort Deletion
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmationText !== "DELETE"}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-30 font-mono text-xs text-white font-bold rounded-xl py-3 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-red-600/15"
                    >
                      Decommission Account
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER POPUP */}
      {toast && toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown pointer-events-none select-none">
          <div className="bg-[#101017]/95 border-2 border-[#bf3bf4]/40 text-white font-mono text-xs px-6 py-4.5 rounded-full flex items-center gap-3 shadow-[0_12px_45px_rgba(191,59,244,0.3)] backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-[#00c4fd]" />
            <span className="font-bold tracking-wider">{toast.message}</span>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION TRACK (Pill switcher layout) */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-[#0d0d14]/90 border-t border-white/5 py-1 px-2 z-40 overflow-x-auto flex justify-around scrollbar-none gap-1 bg-opacity-95 backdrop-blur-md">
        {[
          { id: "account", label: "Account", icon: User },
          { id: "audio_model", label: "Nodes", icon: Volume2 },
          { id: "appearance", label: "Visual", icon: Moon },
          { id: "notifications", label: "Comms", icon: Bell },
          { id: "security", label: "Lock", icon: Shield },
          { id: "usage_billing", label: "Ledger", icon: CreditCard }
        ].map((mobTab) => {
          const ThemeIcon = mobTab.icon;
          const isSel = activeTab === mobTab.id;
          return (
            <button
              key={mobTab.id}
              onClick={() => { playClickSfx(); setActiveTab(mobTab.id as any); }}
              className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                isSel ? "text-[#bf3bf4]" : "text-white/30"
              }`}
            >
              <ThemeIcon className="w-4 h-4" />
              <span className="text-[8px] font-mono uppercase tracking-wider font-bold">{mobTab.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
