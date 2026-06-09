import React, { useState, useEffect } from "react";
import { 
  User, Shield, KeyRound, CheckCircle, ArrowRight, Activity, Cpu, Mail, Sparkles, Volume2,
  ShieldCheck, Server, RefreshCw, Key, Database, CreditCard, Copy, ChevronRight, Terminal, 
  BarChart3, HelpCircle, Layers, Fingerprint, Clock, MapPin, Sliders, LogOut, Check, Trash2, ShieldAlert,
  Settings, Bell, Smartphone, Download, CheckSquare, Square
} from "lucide-react";
import { playClickSfx, playHoverSfx, playSuccessSfx, playErrorSfx } from "@/src/utils/audio";

interface AgentProfile {
  username: string;
  email: string;
  clearance: string;
  secureSignature: string;
}

interface AgentIdentityViewProps {
  userProfile: AgentProfile;
  onProfileChange: (profile: any) => void;
  onNavigate: (page: string) => void;
  appLanguage?: string;
}

type TabType = "identity" | "voiceprint" | "security" | "settings" | "mission";

export default function AgentIdentityView({ userProfile, onProfileChange, onNavigate, appLanguage = "English (US)" }: AgentIdentityViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("identity");
  
  // Local profile reactive attributes derived or loaded
  const [avatarType, setAvatarType] = useState<"hex" | "badge" | "initial">("hex");
  const [agentStatus, setAgentStatus] = useState<"ACTIVE" | "IDLE" | "OFFLINE">("ACTIVE");
  
  // Voiceprint metrics states
  const [storedCount, setStoredCount] = useState(12);
  const [accuracy, setAccuracy] = useState(97.3);
  const [successRate, setSuccessRate] = useState(95.8);
  const [lastCalibration, setLastCalibration] = useState("3 Days Ago");
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);

  // Mission timeline state
  const [missions, setMissions] = useState([
    { id: 1, title: "Calibration Completed", desc: "Acoustic calibration pass updated to 97.3% accuracy node target.", stamp: "Just Now" },
    { id: 2, title: "Authentication Successful", desc: "Handshake verified for Operator Signature with zero frame delays.", stamp: "12 mins ago" },
    { id: 3, title: "Security Check Passed", desc: "Secure proxy whitelist routing matches Singapore edge registry.", stamp: "1 hour ago" },
    { id: 4, title: "Profile Updated", desc: "Registered security metrics and clearance channels modified.", stamp: "2 hours ago" },
    { id: 5, title: "Voiceprint Added", desc: "Vocal frequency wave segment ingested at spectral offset 1.25s.", stamp: "3 days ago" },
  ]);

  // Onboarding Checklist state
  const [checklist, setChecklist] = useState({
    createVoiceprint: true,
    completeCalibration: true,
    verifyIdentity: false,
    runAuthTest: false,
    accessCommandCenter: false
  });

  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [onboardingDismissedForever, setOnboardingDismissedForever] = useState(() => {
    try {
      return localStorage.getItem("auron_onboarding_completed_forever") === "true";
    } catch (e) {
      return false;
    }
  });

  // Automatically hide onboarding banner forever when all tasks are complete
  useEffect(() => {
    const completedAll = Object.values(checklist).every(Boolean);
    if (completedAll && !onboardingDismissedForever) {
      try {
        localStorage.setItem("auron_onboarding_completed_forever", "true");
      } catch (e) {}
      setOnboardingDismissedForever(true);
      playSuccessSfx();
    }
  }, [checklist, onboardingDismissedForever]);

  // Settings tab categories and forms
  const [selectedSettingCategory, setSelectedSettingCategory] = useState<"identity" | "security" | "voice" | "notification" | "preferences">("identity");
  const [settingsForm, setSettingsForm] = useState({
    username: userProfile.username,
    email: userProfile.email,
    password: "••••••••••••",
    mfaEnabled: true,
    sciFiSfx: true
  });

  // Calculate onboarding progress percentage
  const completedChecklistCount = Object.values(checklist).filter(Boolean).length;
  const onboardingProgress = Math.round((completedChecklistCount / 5) * 100);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState(false);
  const handleCopyKey = () => {
    playClickSfx();
    navigator.clipboard.writeText(userProfile.secureSignature);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Sign out handler
  const handleLogout = () => {
    playClickSfx();
    try {
      localStorage.removeItem("auron_user_profile");
    } catch (e) {}
    onProfileChange(null);
    onNavigate("signup");
  };

  // Regeneration of Key helper
  const handleRegenerateKey = () => {
    playClickSfx();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let sig = "AURON-SEC-";
    for (let i = 0; i < 18; i++) {
      sig += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const updated = {
      ...userProfile,
      secureSignature: sig
    };
    try {
      const stored = localStorage.getItem("auron_user_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.secureSignature = sig;
        localStorage.setItem("auron_user_profile", JSON.stringify(parsed));
      }
    } catch (e) {}
    onProfileChange(updated);
    playSuccessSfx();
    
    // Add to activity logs
    setMissions((prev) => [
      {
        id: Date.now(),
        title: "Security Credentials Reset",
        desc: `Fresh Core Matrix secure signature generated manually: ${sig.substring(0, 14)}...`,
        stamp: "Just Now"
      },
      ...prev
    ]);
  };

  // Interactive controls for voice print database
  const handleAddVoiceprint = () => {
    playClickSfx();
    setStoredCount(prev => prev + 1);
    playSuccessSfx();
    setMissions(prev => [
      { id: Date.now(), title: "Voiceprint Added", desc: "Vocal spec frequency segment ingested at target index.", stamp: "Just Now" },
      ...prev
    ]);
    if (!checklist.createVoiceprint) {
      setChecklist(prev => ({ ...prev, createVoiceprint: true }));
    }
  };

  const handleRetrain = () => {
    playClickSfx();
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setAccuracy(prev => Math.min(99.9, +(prev + 0.2).toFixed(1)));
      setSuccessRate(prev => Math.min(99.8, +(prev + 0.3).toFixed(1)));
      playSuccessSfx();
      setMissions(prev => [
        { id: Date.now(), title: "Model Retrained", desc: "AURON vocal engine retrained on spectral set models. Accuracy improved.", stamp: "Just Now" },
        ...prev
      ]);
    }, 1500);
  };

  const handleRecalibrate = () => {
    playClickSfx();
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setLastCalibration("Just Now");
      playSuccessSfx();
      setMissions(prev => [
        { id: Date.now(), title: "Calibration Completed", desc: "Acoustic calibration pass updated to 97.3% accuracy node target.", stamp: "Just Now" },
        ...prev
      ]);
      if (!checklist.completeCalibration) {
        setChecklist(prev => ({ ...prev, completeCalibration: true }));
      }
    }, 1200);
  };

  const handleDeleteVoiceprint = () => {
    playClickSfx();
    if (storedCount <= 0) {
      playErrorSfx();
      return;
    }
    setStoredCount(prev => prev - 1);
    setMissions(prev => [
      { id: Date.now(), title: "Voiceprint Deleted", desc: "Acoustic signature parameters pruned from security tables.", stamp: "Just Now" },
      ...prev
    ]);
  };

  // Toggle checklist tasks
  const toggleChecklistTask = (key: keyof typeof checklist) => {
    playClickSfx();
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    
    // Auto sync to activity log
    if (updated[key]) {
      setMissions(prev => [
        { id: Date.now(), title: "Task Accomplished", desc: `Onboarding checklist parameter checked: ${String(key)}.`, stamp: "Just now" },
        ...prev
      ]);
    }
  };

  const handleUpdateProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSfx();
    const updated = {
      ...userProfile,
      username: settingsForm.username,
      email: settingsForm.email
    };
    try {
      const stored = localStorage.getItem("auron_user_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.formData.username = settingsForm.username;
        parsed.formData.email = settingsForm.email;
        localStorage.setItem("auron_user_profile", JSON.stringify(parsed));
      }
    } catch (e) {}
    onProfileChange(updated);
    playSuccessSfx();

    setMissions(prev => [
      { id: Date.now(), title: "Profile Settings Modified", desc: `Credentials modified: ${settingsForm.username}.`, stamp: "Just Now" },
      ...prev
    ]);
  };

  return (
    <div id="agent-identity-profile-view" className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 md:pt-28 select-none animate-fadeIn transition-all duration-300">
      
      {/* 1. OVERALL SECTION HEADER / INTEGRATED IDENTITY PANEL */}
      <div className="bg-[#101017]/80 border border-white/5 rounded-2xl p-5 md:p-6 mb-8 text-left relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#92dbff]/5 to-transparent blur-xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          {/* Avatar & Basic Credentials Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-grow w-full lg:w-auto text-left">
            {/* Avatar Section */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              {avatarType === "hex" && (
                <div className="w-20 h-20 flex items-center justify-center bg-[#0d0d12]/90 border border-[#92dbff]/30 rounded-2xl relative shadow-[0_0_15px_rgba(146,219,255,0.12)] overflow-hidden">
                  <div className="absolute inset-1 rounded-xl border border-dashed border-[#92dbff]/10 animate-spin [animation-duration:40s]" />
                  <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-[#4f44e2] to-[#92dbff] p-0.5">
                    <div className="h-full w-full rounded-md bg-[#0c0c11] flex items-center justify-center text-[#92dbff]">
                      <User className="w-7 h-7" />
                    </div>
                  </div>
                </div>
              )}

              {avatarType === "badge" && (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-800 to-rose-400 p-0.5 relative shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-[#0c0c11] flex items-center justify-center p-1 overflow-hidden">
                    <ShieldCheck className="w-8 h-8 text-rose-300" />
                  </div>
                </div>
              )}

              {avatarType === "initial" && (
                <div className="w-20 h-20 rounded-2xl bg-[#4f44e2]/20 border border-[#4f44e2]/60 flex items-center justify-center text-white text-2xl font-black font-mono shadow-[0_0_10px_rgba(79,68,226,0.2)]">
                  {userProfile.username ? userProfile.username.charAt(0).toUpperCase() : "A"}
                </div>
              )}

              {/* Status indicator badge */}
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-[#101017] flex items-center justify-center ${
                agentStatus === "ACTIVE" ? "bg-emerald-500" : agentStatus === "IDLE" ? "bg-amber-400" : "bg-red-500"
              }`}>
                <Fingerprint className="w-2.5 h-2.5 text-white animate-pulse" />
              </span>
            </div>

            {/* User credentials */}
            <div className="text-center sm:text-left flex-grow space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="font-sans text-2xl font-black text-white tracking-tight uppercase">
                  {userProfile.username || "AGENT_MALIK"}
                </h1>
                <span className="text-[#92dbff] font-mono font-black text-[10px] bg-[#92dbff]/10 px-2 py-0.5 rounded border border-[#92dbff]/20 uppercase">
                  {userProfile.clearance || "COMMANDER"}
                </span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-[#c7c4d8]/60 font-mono">
                  AURON ID: GRD-{userProfile.secureSignature ? userProfile.secureSignature.slice(-6) : "MALIK"}
                </span>
              </div>
              <p className="font-sans text-xs text-[#c7c4d8]/60">{userProfile.email}</p>
              
              {/* Avatar Type Selector Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-1 pt-1.5 font-mono text-[9px]">
                <span className="text-white/30 mr-1">AVATAR STYLE:</span>
                {(["hex", "badge", "initial"] as const).map(at => (
                  <button
                    key={at}
                    onClick={() => { playClickSfx(); setAvatarType(at); }}
                    className={`px-2 py-0.5 rounded border border-white/5 transition uppercase cursor-pointer ${
                      avatarType === at 
                        ? "bg-[#92dbff]/10 border-[#92dbff]/30 text-[#92dbff] font-bold" 
                        : "bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    {at}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tactical Stats Columns Grid (Status Selectors & Signature Block) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 text-left">
            
            {/* Status Dropdowns */}
            <div className="flex flex-col gap-1.5 bg-[#05050a]/40 p-2.5 rounded-xl border border-white/5 min-w-[200px]">
              <div className="flex justify-between items-center text-[9px] font-mono text-[#c7c4d8]/40 uppercase tracking-wider">
                <span>SYSTEM STATUS</span>
                <span className={agentStatus === "ACTIVE" ? "text-emerald-400 font-bold" : agentStatus === "IDLE" ? "text-amber-400 font-bold" : "text-red-400 font-bold"}>
                  ● {agentStatus}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(["ACTIVE", "IDLE", "OFFLINE"] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => { playClickSfx(); setAgentStatus(st); }}
                    className={`text-[8px] py-1 font-mono rounded border uppercase transition-all cursor-pointer ${
                      agentStatus === st 
                        ? "border-[#92dbff] bg-[#92dbff]/15 text-[#92dbff] font-bold" 
                        : "border-white/5 bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy Signature Key */}
            <div className="flex flex-col gap-1.5 bg-[#05050a]/40 p-2.5 rounded-xl border border-white/5 min-w-[220px]">
              <div className="flex justify-between items-center text-[9px] font-mono text-[#c7c4d8]/40 uppercase tracking-wider">
                <span>SECURE SIGNATURE</span>
                <button 
                  onClick={handleRegenerateKey}
                  className="text-[8px] text-[#92dbff] hover:underline uppercase font-bold cursor-pointer"
                  title="Generate new signature"
                >
                  Regen Key
                </button>
              </div>
              <div className="text-[10px] text-[#92dbff] font-mono flex items-center justify-between gap-2 bg-black/40 p-1.5 rounded border border-white/5 select-text">
                <span className="truncate max-w-[150px] font-black">{userProfile.secureSignature || "None"}</span>
                <button
                  onClick={handleCopyKey}
                  className="text-[#92dbff] hover:text-white cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

          </div>

          {/* Unified System Controls Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
            <button 
              onClick={() => {
                playClickSfx();
                onNavigate("command");
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#4f44e2] to-blue-600 hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] text-white font-mono text-[10px] px-4 py-3 rounded-xl uppercase tracking-wider font-bold transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              Command Center
            </button>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-[#ff5352]/10 border border-[#ff5352]/20 hover:bg-[#ff5352]/20 text-[#ff5352] font-mono text-[10px] px-3.5 py-3 rounded-xl uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(255,83,82,0.1)] hover:-translate-y-0.5 active:translate-y-0"
              title="Logout Node Identity"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>

        </div>
      </div>

      {/* 2. ONBOARDING FIRST-TIME USER SEQUENCE BANNER */}
      {!onboardingDismissedForever && !onboardingDismissed && onboardingProgress < 100 && (
        <div className="w-full bg-gradient-to-r from-[#171720] via-purple-950/20 to-[#131319] border border-[#92dbff]/20 rounded-2xl p-6 relative shadow-lg text-left mb-8 animate-fadeIn overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#92dbff]/10 to-transparent blur-md pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-grow space-y-3">
              <span className="font-mono text-[8px] bg-[#92dbff]/10 text-[#92dbff] px-2.5 py-1 rounded border border-[#92dbff]/25 font-bold uppercase tracking-widest inline-block">
                SYSTEM ONBOARDING MODULE IN PLAY
              </span>
              <h2 className="font-sans text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#92dbff]" />
                WELCOME TO AURON
              </h2>
              <p className="font-sans text-xs text-[#c7c4d8]/80 leading-relaxed max-w-2xl">
                Your neural identity has been successfully registered on our security grid keyspace. Please achieve the security milestones below to lift system limits.
              </p>

              {/* Progress Bar */}
              <div className="w-full max-w-md pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#c7c4d8]/60 mb-1.5 uppercase">
                  <span>Milestone Progression</span>
                  <span className="text-[#92dbff] font-bold">{onboardingProgress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    style={{ width: `${onboardingProgress}%` }}
                    className="bg-gradient-to-r from-blue-500 via-[#4f44e2] to-[#92dbff] h-full transition-all duration-500" 
                  />
                </div>
              </div>
            </div>

            {/* Checklist Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#0c0c11]/80 border border-white/5 p-4 rounded-xl">
              <div 
                onClick={() => toggleChecklistTask("createVoiceprint")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-white text-[#c7c4d8]/70 select-none text-xs"
              >
                {checklist.createVoiceprint ? (
                  <CheckSquare className="w-4 h-4 text-[#92dbff] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <span className={checklist.createVoiceprint ? "line-through text-white/30" : "font-semibold"}>Create Voiceprint</span>
              </div>

              <div 
                onClick={() => toggleChecklistTask("completeCalibration")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-white text-[#c7c4d8]/70 select-none text-xs"
              >
                {checklist.completeCalibration ? (
                  <CheckSquare className="w-4 h-4 text-[#92dbff] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <span className={checklist.completeCalibration ? "line-through text-white/30" : "font-semibold"}>Complete Calibration</span>
              </div>

              <div 
                onClick={() => toggleChecklistTask("verifyIdentity")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-white text-[#c7c4d8]/70 select-none text-xs"
              >
                {checklist.verifyIdentity ? (
                  <CheckSquare className="w-4 h-4 text-[#92dbff] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <span className={checklist.verifyIdentity ? "line-through text-white/30" : "font-semibold"}>Verify Identity</span>
              </div>

              <div 
                onClick={() => toggleChecklistTask("runAuthTest")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-white text-[#c7c4d8]/70 select-none text-xs"
              >
                {checklist.runAuthTest ? (
                  <CheckSquare className="w-4 h-4 text-[#92dbff] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <span className={checklist.runAuthTest ? "line-through text-white/30" : "font-semibold"}>Run Authentication Test</span>
              </div>

              <div 
                onClick={() => toggleChecklistTask("accessCommandCenter")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-white text-[#c7c4d8]/70 select-none text-xs col-span-1 sm:col-span-2 lg:col-span-1"
              >
                {checklist.accessCommandCenter ? (
                  <CheckSquare className="w-4 h-4 text-[#92dbff] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <span className={checklist.accessCommandCenter ? "line-through text-white/30" : "font-semibold"}>Access Command Center</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE INTERACTIVE GRID LAYOUT - FULL WIDTH TAB MATRIX */}
      <div className="w-full">
        
        {/* ACCORDION/TAB PANELS AT FULL 12-COLUMNS RANGE */}
        <div className="w-full flex flex-col gap-6 text-left">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-px">
            <button
              onClick={() => { playClickSfx(); setActiveTab("identity"); }}
              className={`px-4 py-3 font-mono text-[10px] uppercase tracking-widest relative cursor-pointer hover:text-white transition-all whitespace-nowrap ${
                activeTab === "identity" ? "text-white font-bold" : "text-[#c7c4d8]/50"
              }`}
            >
              Overview & Verification
              {activeTab === "identity" && <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#92dbff] shadow-[0_2px_8px_#92dbff]" />}
            </button>

            <button
              onClick={() => { playClickSfx(); setActiveTab("voiceprint"); }}
              className={`px-4 py-3 font-mono text-[10px] uppercase tracking-widest relative cursor-pointer hover:text-white transition-all whitespace-nowrap ${
                activeTab === "voiceprint" ? "text-white font-bold animate-pulse" : "text-[#c7c4d8]/50"
              }`}
            >
              Voiceprints Database
              {activeTab === "voiceprint" && <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#92dbff] shadow-[0_2px_8px_#92dbff]" />}
            </button>

            <button
              onClick={() => { playClickSfx(); setActiveTab("security"); }}
              className={`px-4 py-3 font-mono text-[10px] uppercase tracking-widest relative cursor-pointer hover:text-white transition-all whitespace-nowrap ${
                activeTab === "security" ? "text-white font-bold" : "text-[#c7c4d8]/50"
              }`}
            >
              Security Center
              {activeTab === "security" && <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#92dbff] shadow-[0_2px_8px_#92dbff]" />}
            </button>

            <button
              onClick={() => { playClickSfx(); setActiveTab("settings"); }}
              className={`px-4 py-3 font-mono text-[10px] uppercase tracking-widest relative cursor-pointer hover:text-white transition-all whitespace-nowrap ${
                activeTab === "settings" ? "text-white font-bold" : "text-[#c7c4d8]/50"
              }`}
            >
              Identity Settings
              {activeTab === "settings" && <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#92dbff] shadow-[0_2px_8px_#92dbff]" />}
            </button>

            <button
              onClick={() => { playClickSfx(); setActiveTab("mission"); }}
              className={`px-4 py-3 font-mono text-[10px] uppercase tracking-widest relative cursor-pointer hover:text-white transition-all whitespace-nowrap ${
                activeTab === "mission" ? "text-white font-bold" : "text-[#c7c4d8]/50"
              }`}
            >
              Mission History
              {activeTab === "mission" && <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#92dbff] shadow-[0_2px_8px_#92dbff]" />}
            </button>
          </div>

          {/* TAB 1: OVERVIEW & VERIFICATION REPORT */}
          {activeTab === "identity" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Quick Metrics Bento Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest leading-none">Voiceprints Stored</span>
                    <Database className="w-3.5 h-3.5 text-[#92dbff]/60" />
                  </div>
                  <div className="mt-4">
                    <span className="text-xl font-black text-white block">{storedCount} Records</span>
                    <span className="text-[9px] text-[#c7c4d8]/30 block mt-1 uppercase tracking-wider font-mono">Quantum Tables synced</span>
                  </div>
                </div>

                <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest leading-none">Last Audio Calibration</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-400/60" />
                  </div>
                  <div className="mt-4">
                    <span className="text-xl font-black text-emerald-400 block">{lastCalibration}</span>
                    <span className="text-[9px] text-[#c7c4d8]/30 block mt-1 uppercase tracking-wider font-mono">Microphone state: Secure</span>
                  </div>
                </div>

                <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-widest leading-none">Verification Score</span>
                    <Key className="w-3.5 h-3.5 text-[#c4c0ff]/60" />
                  </div>
                  <div className="mt-4">
                    <span className="text-xl font-black text-[#c4c0ff] block">{accuracy}% Accuracy</span>
                    <span className="text-[9px] text-[#c7c4d8]/30 block mt-1 uppercase tracking-wider font-mono">MFA security active</span>
                  </div>
                </div>
              </div>

              {/* Explanation parameters box */}
              <div className="bg-gradient-to-r from-[#171720] to-[#131319] border border-[#92dbff]/15 p-6 rounded-2xl relative shadow-lg">
                <div className="absolute top-4 right-4 text-[9px] bg-[#92dbff]/10 text-[#92dbff] px-2 py-0.5 rounded border border-[#92dbff]/20 font-mono uppercase tracking-widest">
                  DECRYPTING ARCHITECTURE INTEL
                </div>
                <h4 className="font-sans text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Sliders className="w-4 h-4 text-[#92dbff]" /> Core Architecture & Mechanics Mapped
                </h4>
                <p className="font-sans text-xs text-[#c7c4d8]/80 leading-relaxed">
                  Under the **AURON Platform**, our scientific analysis employs high-clearance spoken acoustic algorithms. We map in-frame voice vibrations into dynamic multilingual phonetic paradigms to classify digits 0-9 with top performance.
                </p>
                <ul className="list-none space-y-3 mt-4 text-xs text-[#c7c4d8]/70">
                  <li className="flex items-start gap-2">
                    <span className="text-[#92dbff] font-bold">●</span>
                    <div>
                      <strong>Acoustic Alignment Handshake:</strong> To bypass iframe audio sandbox restrictions on modern systems, Auron routes inputs through specialized HTML5 isolated audio targets.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#92dbff] font-bold">●</span>
                    <div>
                      <strong>Feature Extraction & Spectral Analysis:</strong> Input signals are broken into Fast Fourier spectrogram vectors to predicted phonetic categories instantly.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Clearance unlocks block */}
              <div className="border border-white/5 bg-[#131319]/20 p-5 rounded-xl space-y-3">
                <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest block font-bold">CLEARANCE BENCHMARKS FOR YOUR ACCOUNT</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[9px] text-[#c7c4d8] uppercase font-bold">FIELD AGENT</span>
                      <span className="text-[9.5px] text-emerald-400">UNLOCKED</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-snug">Can upload audio files, view classified results, and edit personal parameters.</p>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[9px] text-[#c7c4d8] uppercase font-bold">RESEARCHER</span>
                      <span className={userProfile.clearance === "RESEARCHER" || userProfile.clearance === "COMMANDER" ? "text-emerald-400 text-[9.5px]" : "text-white/20 text-[9.5px]"}>
                        {userProfile.clearance === "RESEARCHER" || userProfile.clearance === "COMMANDER" ? "UNLOCKED" : "RESTRICTED"}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-snug font-sans">Full analytics dashboard access, epochs tuning, training plots, and log parameters.</p>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[9px] text-[#c7c4d8] uppercase font-bold">COMMANDER</span>
                      <span className={userProfile.clearance === "COMMANDER" ? "text-emerald-400 text-[9.5px]" : "text-white/20 text-[9.5px]"}>
                        {userProfile.clearance === "COMMANDER" ? "UNLOCKED" : "LOCKED"}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-snug font-sans">Full system telemetry dashboards, secret credential keys regeneration, model controls.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VOICEPRINT DATABASE */}
          {activeTab === "voiceprint" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h4 className="font-sans text-sm font-bold text-white uppercase tracking-wide">Voiceprint Database</h4>
                    <p className="font-sans text-xs text-[#c7c4d8]/50 mt-1">Vocal spectrogram sequences logged upon user biometrics handshake.</p>
                  </div>
                  <span className="font-mono text-[8px] bg-[#92dbff]/10 text-[#92dbff] px-2.5 py-1 rounded border border-[#92dbff]/25 font-bold uppercase tracking-widest shrink-0 self-start sm:self-auto">
                    Biometric Tables Loaded
                  </span>
                </div>

                {/* Sub Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest font-mono">Voiceprints Stored</span>
                    <span className="text-xl font-bold font-mono text-white block mt-1">{storedCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest font-mono">Recognition Accuracy</span>
                    <span className="text-xl font-bold font-mono text-[#92dbff] block mt-1">{accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest font-mono">Success Rate</span>
                    <span className="text-xl font-bold font-mono text-indigo-400 block mt-1">{successRate}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest font-mono">Last Calibration</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">{lastCalibration}</span>
                  </div>
                </div>

                {/* Voiceprint Interactive Controls Dashboard */}
                <div className="space-y-4">
                  <span className="font-mono text-[8.5px] text-white/40 uppercase tracking-widest block font-bold">Vocal Controller Keys</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddVoiceprint}
                      className="bg-[#92dbff]/10 border border-[#92dbff]/30 hover:bg-[#92dbff]/20 text-white font-mono text-[10px] uppercase. py-3 px-4 rounded-xl flex items-center justify-between transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                    >
                      <span className="font-bold">Add Voiceprint</span>
                      <PlusIcon className="w-4 h-4 text-[#92dbff]" />
                    </button>

                    <button
                      onClick={handleRetrain}
                      disabled={isRetraining}
                      className="bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-white font-mono text-[10px] uppercase py-3 px-4 rounded-xl flex items-center justify-between transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      <span className="font-bold">{isRetraining ? "Retraining Engine..." : "Retrain Model"}</span>
                      <RefreshCw className={`w-4 h-4 text-indigo-400 ${isRetraining ? "animate-spin" : ""}`} />
                    </button>

                    <button
                      onClick={handleRecalibrate}
                      disabled={isCalibrating}
                      className="bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-white font-mono text-[10px] uppercase py-3 px-4 rounded-xl flex items-center justify-between transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      <span className="font-bold">{isCalibrating ? "Calibrating..." : "Recalibrate"}</span>
                      <Cpu className={`w-4 h-4 text-emerald-400 ${isCalibrating ? "animate-pulse" : ""}`} />
                    </button>

                    <button
                      onClick={handleDeleteVoiceprint}
                      disabled={storedCount <= 0}
                      className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-white font-mono text-[10px] uppercase py-3 px-4 rounded-xl flex items-center justify-between transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      <span className="font-bold">Delete Voiceprint</span>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Spectrogram visual simulated wave */}
                <div className="bg-[#0c0c11]/80 border border-white/5 p-4 rounded-xl flex flex-col items-center">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest block self-start mb-2">Live Waveform Spectrogram Receiver</span>
                  <div className="h-16 w-full flex items-end justify-center gap-1 bg-black/40 rounded border border-white/5 overflow-hidden px-4">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const randHeight = 20 + Math.sin(i / 3) * 40 + Math.random() * 25;
                      return (
                        <div 
                          key={i}
                          style={{ height: `${randHeight}%` }}
                          className="w-1.5 bg-gradient-to-t from-[#4f44e2] to-[#92dbff] rounded-t-full opacity-60 hover:opacity-100 transition-opacity"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY CENTER */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h4 className="font-sans text-sm font-bold text-white uppercase tracking-wide">Security & Active Nodes</h4>
                    <p className="font-sans text-xs text-[#c7c4d8]/50 mt-1">Manage private API endpoints and verify failed/successful authentications.</p>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/25 flex items-center gap-1 font-bold shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" /> SECURE GRID
                  </span>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black/30 border border-white/5 p-3 rounded-lg">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-wider block">Security Score</span>
                    <span className="text-xl font-black block text-emerald-400 mt-1">98/100</span>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-lg">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-wider block">Failed Authentication Attempts</span>
                    <span className="text-xl font-bold block text-white/50 mt-1">0 Attempts</span>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-lg">
                    <span className="font-mono text-[8px] text-[#c7c4d8]/40 uppercase tracking-wider block">Last Authentication Handshake</span>
                    <span className="text-xl font-bold block text-[#c4c0ff] mt-1">Just Now</span>
                  </div>
                </div>

                {/* Secure Active Session Logs List */}
                <div className="space-y-3">
                  <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest block font-bold">Active Sessions & Devices</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-[#05050a]/40 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#92dbff]" />
                        <div className="text-left">
                          <span className="text-white text-xs font-bold block">Auron Diagnostic Console (Current Device)</span>
                          <span className="text-[10px] text-[#c7c4d8]/40 block mt-0.5">Singapore Ingress Node • 152.190.2.14 • Active Now</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-mono text-[9px] font-bold">CURRENT NODE</span>
                    </div>

                    <div className="flex justify-between items-center bg-[#05050a]/40 p-3 rounded-xl border border-white/5 opacity-60">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#c4c0ff]" />
                        <div className="text-left">
                          <span className="text-white text-xs font-bold block">Mobile Spectrum Analyzer</span>
                          <span className="text-[10px] text-[#c7c4d8]/40 block mt-0.5">Tokyo Node • 104.188.92.1 • 3 hours ago</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { playClickSfx(); playSuccessSfx(); }}
                        className="text-red-400 hover:text-red-300 font-mono text-[9px] uppercase hover:underline cursor-pointer"
                      >
                        Terminate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secure action buttons */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="font-sans text-[11px] text-[#c7c4d8]/40 text-center sm:text-left">
                    Warning: Terminating routing keys deprecates all integrated curl machines.
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleRegenerateKey}
                      className="bg-[#4f44e2]/15 border border-[#4f44e2]/30 hover:bg-[#4f44e2]/35 text-white font-mono text-[10px] px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#92dbff]" />
                      Reset Credentials
                    </button>
                    <button
                      onClick={() => { playClickSfx(); playSuccessSfx(); }}
                      className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-[#ff5352] font-mono text-[10px] px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Logout Everywhere
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IDENTITY SETTINGS SECTION */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Categories sub menu (5 required categories) */}
                <div className="md:col-span-4 flex flex-col gap-1 border-r border-white/5 pr-4 text-left">
                  <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest block mb-3 font-bold">Categories</span>
                  
                  <button
                    onClick={() => { playClickSfx(); setSelectedSettingCategory("identity"); }}
                    className={`p-3 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSettingCategory === "identity" ? "bg-[#92dbff]/10 text-[#92dbff] font-bold" : "text-[#c7c4d8]/60 hover:bg-white/5"
                    }`}
                  >
                    <span>Identity Settings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => { playClickSfx(); setSelectedSettingCategory("security"); }}
                    className={`p-3 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSettingCategory === "security" ? "bg-[#92dbff]/10 text-[#92dbff] font-bold" : "text-[#c7c4d8]/60 hover:bg-white/5"
                    }`}
                  >
                    <span>Security Settings</span>
                    <Shield className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => { playClickSfx(); setSelectedSettingCategory("voice"); }}
                    className={`p-3 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSettingCategory === "voice" ? "bg-[#92dbff]/10 text-[#92dbff] font-bold" : "text-[#c7c4d8]/60 hover:bg-white/5"
                    }`}
                  >
                    <span>Voice Settings</span>
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => { playClickSfx(); setSelectedSettingCategory("notification"); }}
                    className={`p-3 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSettingCategory === "notification" ? "bg-[#92dbff]/10 text-[#92dbff] font-bold" : "text-[#c7c4d8]/60 hover:bg-white/5"
                    }`}
                  >
                    <span>Notification Settings</span>
                    <Bell className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => { playClickSfx(); setSelectedSettingCategory("preferences"); }}
                    className={`p-3 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSettingCategory === "preferences" ? "bg-[#92dbff]/10 text-[#92dbff] font-bold" : "text-[#c7c4d8]/60 hover:bg-white/5"
                    }`}
                  >
                    <span>System Preferences</span>
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Context form details */}
                <div className="md:col-span-8 space-y-5">
                  {selectedSettingCategory === "identity" && (
                    <form onSubmit={handleUpdateProfileSettings} className="space-y-4">
                      <span className="font-mono text-[8px] text-white/40 uppercase block mb-2 font-bold select-none">Modify credentials info</span>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase">Update Agent Callsign</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.username}
                          onChange={(e) => setSettingsForm({ ...settingsForm, username: e.target.value })}
                          className="bg-black/40 border border-white/5 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#92dbff]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase">Update Communication Channel Email</label>
                        <input
                          type="email"
                          required
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="bg-black/40 border border-white/5 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#92dbff]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-[#4f44e2] hover:bg-[#4f44e2]/90 text-white font-mono text-[10px] uppercase py-2 px-4 rounded-lg cursor-pointer"
                      >
                        Keep Updates
                      </button>
                    </form>
                  )}

                  {selectedSettingCategory === "security" && (
                    <div className="space-y-4">
                      <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Secure Core Actions</span>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-bold block">Reset Password Parameters</span>
                        <p className="text-[10px] text-white/40 mt-1">Change core passwords cached on your active terminal.</p>
                      </div>

                      <div className="p-3 bg-black/40 rounded border border-white/5 flex flex-col gap-2">
                        <input 
                          type="password" 
                          placeholder="Old Password..." 
                          className="bg-black/40 border border-white/5 rounded p-2 text-xs font-mono" 
                          disabled
                        />
                        <input 
                          type="password" 
                          placeholder="New Password..." 
                          className="bg-black/40 border border-white/5 rounded p-2 text-xs font-mono" 
                          disabled
                        />
                        <span className="text-[9px] text-[#c7c4d8]/40">Security policy enforces rotation every 90 days. Custom sets are locked at this demo container level.</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => { playClickSfx(); playSuccessSfx(); }}
                          className="bg-[#92dbff]/10 border border-[#92dbff]/30 text-[#92dbff] font-mono text-[9px] uppercase px-3 py-1.5 rounded cursor-pointer"
                        >
                          Change Password
                        </button>
                        <button 
                          onClick={() => { playClickSfx(); handleRegenerateKey(); }}
                          className="bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[9px] uppercase px-3 py-1.5 rounded cursor-pointer"
                        >
                          Rotate Security Master Signature
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedSettingCategory === "voice" && (
                    <div className="space-y-4 text-xs">
                      <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Vocal Model Tunings</span>
                      <p className="text-[#c7c4d8]/60 text-xs">Adjust biometric ingestion filters and audio waveform feedback variables.</p>
                      
                      <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span>Acoustic Microphonics Target Latency</span>
                          <span className="text-[#92dbff]">42ms (Ultra performance)</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-white/5">
                          <span>Mel Frequency Cepstral Coefficients (MFCCs)</span>
                          <span className="text-emerald-400 font-bold">26 Filterbanks</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSettingCategory === "notification" && (
                    <div className="space-y-4">
                      <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Notification Parameters</span>
                      <p className="text-[#c7c4d8]/60 text-xs">Toggle desktop push notifications and critical audio security sirens.</p>
                      
                      <div className="space-y-2 bg-black/40 p-3 rounded-lg border border-white/5 text-[11px]">
                        <label className="flex items-center gap-2 select-none text-white/60">
                          <input type="checkbox" defaultChecked className="rounded accent-[#92dbff]" />
                          <span>Sound alarm siren on authentication failure</span>
                        </label>
                        <label className="flex items-center gap-2 select-none text-white/60">
                          <input type="checkbox" defaultChecked className="rounded accent-[#92dbff]" />
                          <span>Visual HUD overlay upon command detection</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedSettingCategory === "preferences" && (
                    <div className="space-y-4">
                      <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">System Preferences</span>
                      
                      <div className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <span className="text-white block font-bold">Enable Kinetic Haptics Simulation</span>
                            <span className="text-[10px] text-white/40">Flickers elements upon click</span>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded accent-[#92dbff]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Settings Export & Delete block */}
                  <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => {
                        playClickSfx();
                        playSuccessSfx();
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userProfile, null, 2));
                        const dlAnchorElem = document.createElement('a');
                        dlAnchorElem.setAttribute("href", dataStr);
                        dlAnchorElem.setAttribute("download", `auron_identity_${userProfile.username}_matrix.json`);
                        dlAnchorElem.click();
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] uppercase px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Identity Metrics
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-[#ff5352] font-mono text-[9px] uppercase px-4 py-2 rounded-lg transition-all cursor-pointer"
                    >
                      Delete Account Parameter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MISSION HISTORY ACTIVITY FEED */}
          {activeTab === "mission" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div>
                    <h4 className="font-sans text-sm font-bold text-white uppercase tracking-wide">Mission Audit Chronology</h4>
                    <p className="font-sans text-xs text-[#c7c4d8]/50 mt-1">Chronological history registry linked with unique node handshakes.</p>
                  </div>
                  <span className="font-mono text-[8px] bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/25 font-bold uppercase tracking-widest leading-none shrink-0">
                    Audit Stream Live
                  </span>
                </div>

                {/* Timeline array streams dynamically */}
                <div className="space-y-5 font-mono text-xs">
                  {missions.map((m, idx) => {
                    return (
                      <div key={m.id} className="flex items-start gap-3 border-l border-white/10 pl-4 relative text-left">
                        <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-[#121218] ${
                          idx === 0 ? "bg-emerald-400 animate-pulse" : "bg-indigo-400"
                        }`} />
                        <div>
                          <span className="text-white font-black block text-[11.5px] leading-tight flex items-center gap-1.5">
                            ✓ {m.title}
                          </span>
                          <span className="text-[#c7c4d8]/60 text-[9.5px] block tracking-wide mt-1 leading-relaxed">
                            {m.desc}
                          </span>
                          <span className="text-white/20 text-[8px] block uppercase mt-1 tracking-wider">
                            TIMESTAMP: {m.stamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Inline Plus icon simple helper
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
