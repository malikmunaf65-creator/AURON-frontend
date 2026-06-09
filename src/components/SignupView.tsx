import React, { useState, useRef, useEffect } from "react";
import { 
  User, Shield, KeyRound, CheckCircle, ArrowRight, Activity, Cpu, Mail, Sparkles, Volume2,
  ShieldCheck, Server, RefreshCw, Key, Database, CreditCard, Copy, ChevronRight, Terminal, 
  BarChart3, HelpCircle, Layers, Fingerprint, Clock, MapPin, Sliders, LogOut, Check, Zap
} from "lucide-react";
import { playClickSfx, playHoverSfx, playSuccessSfx, playErrorSfx } from "@/src/utils/audio";
import AgentIdentityView from "./AgentIdentityView";

interface SignupViewProps {
  onNavigate: (page: string) => void;
  onProfileChange?: (profile: any) => void;
  onAddHistory?: (item: any) => void;
  initialIsLogin?: boolean;
  appLanguage?: string;
}

export default function SignupView({ onNavigate, onProfileChange, onAddHistory, initialIsLogin = false, appLanguage = "English (US)" }: SignupViewProps) {
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Core Agent Enrollment Form attributes
  const [formData, setFormData] = useState({
    gridCallSign: "",
    communicationEmail: "",
    missionPurpose: "AI Development", // Default
    clearanceTier: "COMMANDER", // Commander, Researcher, Field Agent
    voicePassphrase: "Alpha Protocol Initiated"
  });

  const [calibrationOption, setCalibrationOption] = useState<string>("alpha");
  const [isRecordingPass, setIsRecordingPass] = useState(false);
  const [vocalEnrolled, setVocalEnrolled] = useState(false);
  const [enrollmentSecs, setEnrollmentSecs] = useState(0);
  const [secureSignature, setSecureSignature] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Dynamic Option lists
  const missionPurposes = [
    "Personal Authentication",
    "Security Research",
    "AI Development",
    "Enterprise Access",
    "Voice Assistant Integration"
  ];

  const clearances = ["FIELD_AGENT", "RESEARCHER", "COMMANDER"];

  // List of all registered agents (persistent database for each signup)
  const [agentDatabase, setAgentDatabase] = useState<any[]>([]);

  // Fetch logged-in user profile on component mount to support returning users
  useEffect(() => {
    // 1. Fetch registered agents from backend server database
    fetch("/api/agents/list")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAgentDatabase(data);
          try {
            localStorage.setItem("auron_agent_database", JSON.stringify(data));
          } catch(e) {}
        }
      })
      .catch(err => console.error("Error loading agent database:", err));

    // 2. Load returning agent profile if persisted locally
    try {
      const persistedUser = localStorage.getItem("auron_user_profile");
      if (persistedUser) {
        const parsed = JSON.parse(persistedUser);
        const profile = {
          username: parsed.formData.gridCallSign || parsed.formData.username || "Operator Agent",
          email: parsed.formData.communicationEmail || parsed.formData.email || "",
          clearance: parsed.formData.clearanceTier || parsed.formData.clearance || "COMMANDER",
          secureSignature: parsed.secureSignature
        };
        setUserProfile(profile);
        if (onProfileChange) {
          onProfileChange(profile);
        }
        // Redirect directly onto Profile / Dashboard My Identity
        onNavigate("identity");
      }
    } catch (e) {}
  }, []);

  const generateSignature = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let sig = "AURON-SEC-";
    for (let i = 0; i < 18; i++) {
      sig += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return sig;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSfx();
    if (!formData.gridCallSign || !formData.communicationEmail) {
      setErrorMsg("Grid Call Sign and Communication Email are mandatory security identifiers.");
      playErrorSfx();
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleStartVoiceEnrollment = () => {
    playClickSfx();
    setIsRecordingPass(true);
    setEnrollmentSecs(0);
    intervalRef.current = setInterval(() => {
      setEnrollmentSecs((prev) => {
        if (prev >= 2.5) {
          clearInterval(intervalRef.current!);
          setIsRecordingPass(false);
          setVocalEnrolled(true);
          playSuccessSfx();
          return 3.0;
        }
        return prev + 0.5;
      });
    }, 500);
  };

  const handleFinalizeSignup = async () => {
    playClickSfx();
    if (!vocalEnrolled) {
      setErrorMsg("Acoustic calibration pass must be finalized first.");
      playErrorSfx();
      return;
    }
    const signature = generateSignature();
    setSecureSignature(signature);

    const profileData = {
      formData: {
        username: formData.gridCallSign,
        email: formData.communicationEmail,
        clearance: formData.clearanceTier,
        gridCallSign: formData.gridCallSign,
        communicationEmail: formData.communicationEmail,
        clearanceTier: formData.clearanceTier,
        missionPurpose: formData.missionPurpose,
        voicePassphrase: formData.voicePassphrase
      },
      secureSignature: signature,
      joinDate: "June 2026",
      voiceprints: 12,
      accuracy: 97.3,
      successRate: 95.8,
      lastCalibration: "Just Now"
    };

    // Store voice print database entry for this signup!
    const newDbEntry = {
      username: formData.gridCallSign,
      email: formData.communicationEmail,
      gridCallSign: formData.gridCallSign,
      communicationEmail: formData.communicationEmail,
      clearanceTier: formData.clearanceTier,
      clearance: formData.clearanceTier,
      missionPurpose: formData.missionPurpose,
      voicePassphrase: formData.voicePassphrase,
      calibrationOption: calibrationOption,
      secureSignature: signature,
      joinDate: "June 2026",
      voiceprints: 12,
      accuracy: 97.3,
      successRate: 95.8,
      lastCalibration: "Just Now"
    };

    try {
      const response = await fetch("/api/agents/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDbEntry)
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to persist core enrollment signature in backend database.");
      }
      playSuccessSfx();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update database.");
      playErrorSfx();
      // Back to Step 1 to show error
      setStep(1);
      return;
    }

    const updatedDatabase = [...agentDatabase, newDbEntry];
    setAgentDatabase(updatedDatabase);

    // Save locally
    try {
      localStorage.setItem("auron_user_profile", JSON.stringify(profileData));
      localStorage.setItem("auron_agent_database", JSON.stringify(updatedDatabase));
    } catch (e) {}

    const profileSummary = {
      username: formData.gridCallSign,
      email: formData.communicationEmail,
      clearance: formData.clearanceTier,
      secureSignature: signature
    };

    setUserProfile(profileSummary);
    if (onProfileChange) {
      onProfileChange(profileSummary);
    }

    // Check if there's an offline/mystical floating digit result pending, a pending upload, or a live record pending
    const pendingUploadRecordStr = localStorage.getItem("auron_pending_upload_record");
    const pendingLiveRecordStr = localStorage.getItem("auron_pending_live_record");
    const pendingDigit = localStorage.getItem("auron_pending_mystical_digit");

    if (pendingUploadRecordStr && onAddHistory) {
      try {
        const record = JSON.parse(pendingUploadRecordStr);
        record.id = `upload_${Date.now()}`;
        record.timestamp = new Date().toLocaleTimeString();
        onAddHistory(record);
        localStorage.removeItem("auron_pending_upload_record");
        onNavigate("results");
      } catch (e) {
        onNavigate("identity");
      }
    } else if (pendingLiveRecordStr && onAddHistory) {
      try {
        const record = JSON.parse(pendingLiveRecordStr);
        record.id = `live_${Date.now()}`;
        record.timestamp = new Date().toLocaleTimeString();
        onAddHistory(record);
        localStorage.removeItem("auron_pending_live_record");
        onNavigate("results");
      } catch (e) {
        onNavigate("identity");
      }
    } else if (pendingDigit && onAddHistory) {
      localStorage.removeItem("auron_pending_mystical_digit");
      const mappingTable = [
        { eng: "zero", grk: "Miden (μηδέν)" },
        { eng: "one", grk: "Ena (ένα)" },
        { eng: "two", grk: "Dyo (δύο)" },
        { eng: "three", grk: "Tria (τρία)" },
        { eng: "four", grk: "Tessera (τέσσερα)" },
        { eng: "five", grk: "Pente (πέντε)" },
        { eng: "six", grk: "Exi (έξι)" },
        { eng: "seven", grk: "Efta (επτά)" },
        { eng: "eight", grk: "Okto (οκτώ)" },
        { eng: "nine", grk: "Ennea (εννέα)" }
      ];
      const dNum = parseInt(pendingDigit, 10);
      const matchItem = mappingTable[dNum] || { eng: "seven", grk: "Efta (επτά)" };
      
      const newRecord = {
        id: `unlocked_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        digit: dNum,
        english: matchItem.eng,
        greek: matchItem.grk,
        confidence: 0.985,
        analysis: "📡 AUTH KEY REGISTERED. Mystical floating wave node fully unlocked. Digit mapped to Greek dialect acoustic parameters successfully.",
        filename: `auron_hologram_unlocked_${pendingDigit}.wav`,
        durationSecs: 1.8,
        isLive: true,
        isMock: false
      };
      
      onAddHistory(newRecord);
      onNavigate("results");
    } else {
      // Immediately open the newly generated user profile dashboard!
      onNavigate("identity");
    }
  };

  const handleSignOut = () => {
    playClickSfx();
    try {
      localStorage.removeItem("auron_user_profile");
    } catch (e) {}
    if (onProfileChange) {
      onProfileChange(null);
    }
    setUserProfile(null);
    setFormData({
      gridCallSign: "",
      communicationEmail: "",
      missionPurpose: "AI Development",
      clearanceTier: "COMMANDER",
      voicePassphrase: "Alpha Protocol Initiated"
    });
    setCalibrationOption("alpha");
    setVocalEnrolled(false);
    setSecureSignature("");
    setStep(1);
    onNavigate("signup");
  };

  // If already logged in, show the profile view rather than registration!
  if (userProfile) {
    return (
      <AgentIdentityView 
        userProfile={userProfile} 
        onProfileChange={(newProf) => {
          setUserProfile(newProf);
          if (onProfileChange) onProfileChange(newProf);
        }}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-4 md:p-6 pt-24 md:pt-28 relative z-10 w-full mx-auto select-none transition-all duration-300 max-w-xl animate-fadeIn">
      
      <div className="w-full bg-[#1f1f26]/40 backdrop-blur-[20px] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#92dbff]/10 to-transparent blur-md pointer-events-none" />

        {/* Stepper progress indicator with three distinct steps */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-5.5 h-5.5 rounded-full font-mono text-[10px] flex items-center justify-center font-bold transition-all ${
              step >= 1 ? "bg-[#92dbff] text-[#0e0e14]" : "bg-white/5 text-white/40"
            }`}>1</span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Identity</span>
          </div>
          <div className="h-px bg-white/10 flex-grow mx-2" />
          <div className="flex items-center gap-1.5">
            <span className={`w-5.5 h-5.5 rounded-full font-mono text-[10px] flex items-center justify-center font-bold transition-all ${
              step >= 2 ? "bg-[#92dbff] text-[#0e0e14]" : "bg-white/5 text-white/40"
            }`}>2</span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Voiceprint</span>
          </div>
          <div className="h-px bg-white/10 flex-grow mx-2" />
          <div className="flex items-center gap-1.5">
            <span className={`w-5.5 h-5.5 rounded-full font-mono text-[10px] flex items-center justify-center font-bold transition-all ${
              step >= 3 ? "bg-[#92dbff] text-[#0e0e14]" : "bg-white/5 text-white/40"
            }`}>3</span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Command</span>
          </div>
        </div>

        {/* STEP 1: IDENTITY REGISTRATION */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="flex flex-col gap-5 text-left">
            <div>
              <h2 className="font-sans text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
                Agent Enrollment
              </h2>
              <p className="font-sans text-xs text-[#c7c4d8]/60 mt-1">
                Establish high-clearance neural parameters within the AURON grid.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              
              {/* Grid Call Sign (Callsign / Username) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                  Grid Call Sign
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    value={formData.gridCallSign}
                    onChange={(e) => setFormData({ ...formData, gridCallSign: e.target.value })}
                    placeholder="Enter call sign..."
                    className="w-full bg-[#131319]/50 border border-white/5 text-white font-mono text-xs p-3.5 pl-10 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* Communication Email (Secure Mail) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                  Communication Channel (Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="type"
                    required
                    value={formData.communicationEmail}
                    onChange={(e) => setFormData({ ...formData, communicationEmail: e.target.value })}
                    placeholder="agent_malik@auron.network"
                    className="w-full bg-[#131319]/50 border border-white/5 text-white font-mono text-xs p-3.5 pl-10 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* Mission Purpose */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest block">
                  Mission Purpose
                </label>
                <select
                  value={formData.missionPurpose}
                  onChange={(e) => {
                    playClickSfx();
                    setFormData({ ...formData, missionPurpose: e.target.value });
                  }}
                  className="w-full bg-[#131319]/90 border border-white/10 text-white font-mono text-xs p-3 rounded-xl focus:border-[#92dbff] focus:outline-none cursor-pointer"
                >
                  {missionPurposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>

              {/* Clearance Tier authorization */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
                  Clearance Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {clearances.map((lvl) => {
                    const isSel = formData.clearanceTier === lvl;
                    const emoji = lvl === "FIELD_AGENT" ? "🟢" : lvl === "RESEARCHER" ? "🔵" : "🟣";
                    const shortLabel = lvl === "FIELD_AGENT" ? "Field Agent" : lvl === "RESEARCHER" ? "Researcher" : "Commander";
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          playClickSfx();
                          setFormData({ ...formData, clearanceTier: lvl });
                        }}
                        className={`py-3 px-1 text-[9px] font-mono rounded-lg border uppercase tracking-wider cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                          isSel 
                            ? lvl === "FIELD_AGENT" 
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                              : lvl === "RESEARCHER"
                              ? "border-blue-500 bg-blue-500/10 text-blue-400 font-bold shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                              : "border-purple-500 bg-purple-500/10 text-purple-400 font-bold shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                            : "border-white/5 bg-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        <span className="truncate">{shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Better Tier Structure Information Box */}
                {(() => {
                  const currentTier = formData.clearanceTier;
                  const tierInfo = {
                    FIELD_AGENT: {
                      title: "Field Agent (Free)",
                      emoji: "🟢",
                      color: "text-emerald-400",
                      borderColor: "border-emerald-500/20",
                      glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.08)]",
                      bgColor: "bg-emerald-500/5",
                      perfectFor: "Students, Beginners, Portfolio visitors",
                      description: "For learning and experimentation.",
                      features: [
                        "Upload audio files",
                        "Basic digit recognition",
                        "Waveform visualization",
                        "Spectrogram visualization",
                        "Recognition confidence score",
                        "10 analyses per day",
                        "Basic results export"
                      ]
                    },
                    RESEARCHER: {
                      title: "Researcher (Premium)",
                      emoji: "🔵",
                      color: "text-blue-400",
                      borderColor: "border-blue-500/20",
                      glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.08)]",
                      bgColor: "bg-blue-500/5",
                      perfectFor: "Researchers, Final-year projects, Data scientists",
                      description: "For academic and ML research.",
                      features: [
                        "Everything in Field Agent plus:",
                        "Unlimited analyses",
                        "Feature extraction",
                        "MFCC visualization",
                        "FFT/Frequency analysis",
                        "Advanced spectrograms",
                        "Dataset comparison",
                        "Download reports",
                        "Historical analysis storage",
                        "Model performance metrics"
                      ]
                    },
                    COMMANDER: {
                      title: "Commander (Professional)",
                      emoji: "🟣",
                      color: "text-purple-400",
                      borderColor: "border-purple-500/20",
                      glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.08)]",
                      bgColor: "bg-purple-500/5",
                      perfectFor: "Universities, Research labs, Companies",
                      description: "For organizations and advanced users.",
                      features: [
                        "Everything in Researcher plus:",
                        "Team workspace",
                        "API access",
                        "Batch processing",
                        "Large dataset uploads",
                        "Custom model training",
                        "Real-time recognition",
                        "White-label reports",
                        "Priority processing",
                        "Cloud storage"
                      ]
                    }
                  }[currentTier] || {
                    title: "Commander (Professional)",
                    emoji: "🟣",
                    color: "text-purple-400",
                    borderColor: "border-purple-500/20",
                    glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.08)]",
                    bgColor: "bg-purple-500/5",
                    perfectFor: "Universities, Research labs, Companies",
                    description: "For organizations and advanced users.",
                    features: ["Everything in Researcher plus:", "Team workspace", "API access", "Batch processing", "Large dataset uploads", "Custom model training", "Real-time recognition", "White-label reports", "Priority processing", "Cloud storage"]
                  };

                  return (
                    <div className={`mt-1 border rounded-xl p-4 transition-all duration-300 ${tierInfo.bgColor} ${tierInfo.borderColor} ${tierInfo.glowColor}`}>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                        <span className={`font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${tierInfo.color}`}>
                          <span>{tierInfo.emoji}</span>
                          <span>{tierInfo.title}</span>
                        </span>
                        <span className="font-mono text-[8px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded uppercase">
                          Tier Details
                        </span>
                      </div>
                      
                      <p className="font-sans text-xs text-white/80 font-medium italic mb-3">
                        {tierInfo.description}
                      </p>

                      <div className="space-y-1 mb-4">
                        <span className="font-mono text-[8px] text-white/30 uppercase tracking-wider block">Authorized Features:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                          {tierInfo.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-1 font-sans text-[11px] text-[#c7c4d8]/85 leading-tight">
                              <span className={`shrink-0 text-[9.5px] font-bold ${tierInfo.color}`}>✓</span>
                              <span className={feature.includes("Everything in") ? "font-bold text-white text-[11.5px]" : ""}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 mt-2">
                        <span className="font-mono text-[8px] text-white/30 uppercase tracking-wider block mb-0.5">PERFECT FOR:</span>
                        <p className="font-sans text-xs text-[#92dbff] font-bold">
                          {tierInfo.perfectFor}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {errorMsg && (
              <p className="font-mono text-[10px] text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10 text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              onMouseEnter={playHoverSfx}
              className="mt-4 w-full bg-[#4f44e2] text-white font-mono text-xs font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4f44e2]/90 hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] transition cursor-pointer"
            >
              <span>Begin Voiceprint Setup</span>
              <ArrowRight className="w-4 h-4 text-[#92dbff]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="font-mono text-[10px] text-white/30 hover:text-white transition-all underline text-center mt-2"
            >
              Already registered? Agent Login.
            </button>


          </form>
        )}

        {/* STEP 2: VOICE CALIBRATION (WITH ALPHA, BETA, GAMMA SELECTION & FORCED BYPASS) */}
        {step === 2 && (
          <div className="flex flex-col gap-5 text-left">
            <div>
              <h2 className="font-sans text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
                Acoustic Identity Calibration
              </h2>
              <p className="font-sans text-xs text-[#c7c4d8]/60 mt-1 text-left">
                Auron requires a vocal passcode pattern. Select a calibration option and read the phrase below or bypass.
              </p>
            </div>

            {/* Selector for Alpha, Beta, Gamma */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest text-left">
                Select Identity Calibration Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "alpha", label: "Alpha Channel", phrase: "Alpha Protocol Initiated" },
                  { key: "beta", label: "Beta Shield", phrase: "Beta Shield Frequency Active" },
                  { key: "gamma", label: "Gamma Core", phrase: "Gamma Core Vector Stabilized" }
                ].map((item) => {
                  const isSel = calibrationOption === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        playClickSfx();
                        setCalibrationOption(item.key);
                        setFormData({
                          ...formData,
                          voicePassphrase: item.phrase
                        });
                      }}
                      className={`py-3 px-1.5 text-[10px] font-mono rounded-lg border uppercase tracking-wider cursor-pointer transition-all ${
                        isSel 
                          ? "border-[#92dbff] bg-[#92dbff]/10 text-[#92dbff] font-bold shadow-[0_0_8px_rgba(146,219,255,0.15)]" 
                          : "border-white/5 bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {item.key === "alpha" ? "▲ Alpha" : item.key === "beta" ? "◆ Beta" : "● Gamma"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#05050a]/60 border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center text-center my-1 relative overflow-hidden">
              <span className="font-mono text-[8px] text-[#92dbff] uppercase tracking-wider block mb-2">
                Say passphrase aloud
              </span>
              <p className="font-mono text-base md:text-lg font-bold bg-gradient-to-r from-[#c4c0ff] to-[#92dbff] bg-clip-text text-transparent uppercase tracking-wider">
                "{formData.voicePassphrase}"
              </p>

              <div className="h-8 w-full flex items-center justify-center gap-1 mt-4">
                {isRecordingPass ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i}
                      style={{ 
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s` 
                      }}
                      className="w-1 bg-[#ff5352] rounded-full animate-pulse"
                    />
                  ))
                ) : vocalEnrolled ? (
                  <div className="flex items-center gap-1.5 text-[#92dbff] font-mono text-xs uppercase tracking-widest">
                    <CheckCircle className="w-4 h-4 text-[#92dbff]" />
                    Biometrics Registered
                  </div>
                ) : (
                  <div className="font-mono text-[9px] text-[#c7c4d8]/20 tracking-wider">
                    MICROPHONE RECEIVER WAITING
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Force Skip / Instant Skip Button (Forcing to skip calibration) */}
              <button
                type="button"
                onClick={() => {
                  playSuccessSfx();
                  setVocalEnrolled(true);
                  // Bypasses the recording delay entirely and jumps straight onto step 3
                  setStep(3);
                }}
                onMouseEnter={playHoverSfx}
                className="w-full bg-[#14141d] border border-[#92dbff]/30 text-[#92dbff] font-mono text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#92dbff]/10 hover:shadow-[0_0_15px_rgba(146,219,255,0.2)] transition-all"
              >
                <Zap className="w-4 h-4 text-[#ffcf36] animate-pulse" />
                <span>⚡ Forcing to Bypass / Skip Calibration</span>
              </button>

              {!isRecordingPass && !vocalEnrolled ? (
                <button
                  type="button"
                  onClick={handleStartVoiceEnrollment}
                  onMouseEnter={playHoverSfx}
                  className="w-full bg-[#ff5352]/10 hover:bg-[#ff5352]/20 border border-[#ff5352]/30 text-white font-mono text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#ff5352]" />
                  <span>Interactive Voice Calibration</span>
                </button>
              ) : isRecordingPass ? (
                <div className="w-full bg-white/5 p-3.5 rounded-xl text-center font-mono text-xs uppercase tracking-wider text-[#92dbff]">
                  Analyzing vocal frequencies ({enrollmentSecs.toFixed(1)}s)
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    playClickSfx();
                    setVocalEnrolled(false);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-[#c7c4d8] font-mono text-[10px] uppercase py-2 rounded-xl transition cursor-pointer"
                >
                  Recalibrate Vocal Signature
                </button>
              )}

              {errorMsg && (
                <p className="font-mono text-[10px] text-red-400 bg-red-500/5 p-2 rounded-lg text-center">
                  {errorMsg}
                </p>
              )}

              {vocalEnrolled && (
                <button
                  onClick={() => {
                    playClickSfx();
                    setStep(3);
                  }}
                  onMouseEnter={playHoverSfx}
                  className="mt-2 w-full text-white font-mono text-xs font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-[#4f44e2] to-[#00c4fd] hover:shadow-[0_0_20px_rgba(0,196,253,0.4)] cursor-pointer"
                >
                  <span>Proceed to Command matrix</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: COMMAND AUTHORIZATION HANDSHAKE & PERSISTENT DATABASE */}
        {step === 3 && (
          <div className="flex flex-col gap-5 text-left">
            <div>
              <h2 className="font-sans text-xl md:text-2xl font-semibold text-white tracking-wide uppercase flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#92dbff]" />
                Command Authorization Portal
              </h2>
              <p className="font-sans text-xs text-[#c7c4d8]/60 mt-1">
                Final handshake validation to encrypt neural key nodes and record status inside secure persistent registries.
              </p>
            </div>

            {/* Diagnostic Box */}
            <div className="bg-[#05050a]/80 border border-white/5 rounded-xl p-4 md:p-5 text-xs font-mono space-y-3">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[#92dbff] text-[9px] uppercase tracking-wider block font-bold">SYSTEM DIAGNOSTIC STREAM</span>
              </div>
              <div className="space-y-1.5 text-[10px] text-[#c7c4d8]/75">
                <div className="flex justify-between">
                  <span>SYSTEM CALIBRATION PROFILE:</span>
                  <span className="text-[#ffcf36] uppercase font-black">▲ {calibrationOption} ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>ENROLLED BIOMETRICS:</span>
                  <span className="text-[#92dbff] truncate max-w-[200px] font-bold">"{formData.voicePassphrase}"</span>
                </div>
                <div className="flex justify-between">
                  <span>ROUTING PROTOCOL:</span>
                  <span>CIPHER-SECURE-CRYPTO-GRID</span>
                </div>
                <div className="flex justify-between">
                  <span>IDENTITY PERSISTENCE:</span>
                  <span className="text-emerald-400 font-bold">GRID_HYPER_SECURE_STORAGE</span>
                </div>
              </div>
            </div>

            {/* Persistent Database for all registered signups */}
            <div className="bg-[#14141d]/50 border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[9px] text-[#92dbff] uppercase tracking-widest font-black">
                  📦 SECURE REGISTERED AGENTS DATABASE
                </span>
                <span className="text-[9px] font-mono bg-white/5 text-white/40 px-1.5 py-0.5 rounded border border-white/5">
                  PERSISTENT LOG
                </span>
              </div>
              
              {/* Database List rendering */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {agentDatabase.map((agent: any, ind: number) => (
                  <div key={ind} className="bg-[#05050a]/50 p-2.5 rounded-lg border border-white/5 flex items-center justify-between text-[10px] font-mono gap-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold truncate max-w-[120px] uppercase">
                          {agent.gridCallSign || agent.username}
                        </span>
                        <span className="text-[8px] bg-[#92dbff]/10 text-[#92dbff] px-1 rounded font-black uppercase">
                          {agent.clearanceTier || agent.clearance || "COMMANDER"}
                        </span>
                      </div>
                      <span className="text-white/30 text-[8px] truncate">
                        {agent.communicationEmail || agent.email}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[#ffcf36] text-[8px] font-bold">
                        🎤 {agent.calibrationOption ? agent.calibrationOption.toUpperCase() : "ALPHA"} WAVE
                      </span>
                      <span className="text-white/30 text-[8px] truncate font-bold">
                        {agent.secureSignature ? agent.secureSignature.slice(-8) : "MALIK"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="font-mono text-[10px] text-red-400 bg-red-500/5 p-2 rounded-lg text-center">
                {errorMsg}
              </p>
            )}

            {/* The finalize button is moved cleanly to Step 3 */}
            <button
              onClick={handleFinalizeSignup}
              onMouseEnter={playHoverSfx}
              className="mt-2 w-full text-white font-mono text-xs font-black uppercase py-4 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-[#4f44e2] to-[#00c4fd] hover:shadow-[0_0_20px_rgba(0,196,253,0.5)] transition-all cursor-pointer"
            >
              <span>🔒 Finalize Grid Encrypt Key</span>
              <KeyRound className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSfx();
                setStep(2);
              }}
              className="font-mono text-[9px] text-[#c7c4d8]/40 hover:text-white transition text-center hover:underline"
            >
              Go back: Adjustment to Voice Calibration
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
