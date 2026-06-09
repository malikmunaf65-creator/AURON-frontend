import React, { useState } from "react";
import { 
  Database, Shield, Activity, Terminal, ShieldAlert, Cpu, Layers, HelpCircle, 
  TerminalSquare, RefreshCw, BarChart2, Plus, Sliders, Play, Settings2, Trash
} from "lucide-react";
import { playClickSfx, playHoverSfx, playSuccessSfx, playErrorSfx } from "@/src/utils/audio";

interface AgentProfile {
  username: string;
  email: string;
  clearance: string;
  secureSignature: string;
}

interface CommandCenterViewProps {
  userProfile: AgentProfile;
  onProfileChange: (profile: any) => void;
  onNavigate: (page: string) => void;
  appLanguage?: string;
}

export default function CommandCenterView({ userProfile, onProfileChange, onNavigate, appLanguage = "English (US)" }: CommandCenterViewProps) {
  const [commandsCount, setCommandsCount] = useState(245);
  const [selectedEpochs, setSelectedEpochs] = useState(80);
  const [modelWeightConfig, setModelWeightConfig] = useState("Acoustic-ResNet-101");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "AURON core server initialization completed on secure port...",
    "GPU grid pipeline bound at Singapore-Edge-Compute cluster.",
    "Decrypted spectrograph mapping indices for Greek phonology digits.",
    "Command channel waiting for high-fidelity vocal spectrogram frames..."
  ]);
  const [newLogInput, setNewLogInput] = useState("");

  // Simulated metrics
  const voiceprintsCount = 12;
  const accuracy = 97.3;
  const lastLogin = "2 Hours Ago";
  const securityScore = "98/100";

  // IP whitelist lists
  const [ipList, setIpList] = useState(["152.190.2.14", "104.188.92.1"]);
  const [newIp, setNewIp] = useState("");

  const handleElevateClearance = (newLevel: "RESEARCHER" | "COMMANDER") => {
    playClickSfx();
    const updated = {
      ...userProfile,
      clearance: newLevel
    };

    // Update localStorage
    try {
      const stored = localStorage.getItem("auron_user_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.formData.clearance = newLevel;
        localStorage.setItem("auron_user_profile", JSON.stringify(parsed));
      }
    } catch (e) {}

    onProfileChange(updated);
    playSuccessSfx();

    addTerminalLog(`SYSTEM PROTOCOL: Elevation success. Clearance tier upgraded to [${newLevel}].`);
  };

  const addTerminalLog = (msg: string) => {
    setConsoleLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const handleRunDiagnostic = () => {
    playClickSfx();
    addTerminalLog("Initiating full neural spectrograph network model diagnostics...");
    setTimeout(() => {
      setCommandsCount(prev => prev + 1);
      playSuccessSfx();
      addTerminalLog("Diagnostic completed: 0 anomalies, learning accuracy stabilized at 97.3%.");
    }, 1000);
  };

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSfx();
    if (!newIp) return;
    setIpList(prev => [...prev, newIp]);
    addTerminalLog(`Security network Whitelist updated. Node IP added: ${newIp}`);
    setNewIp("");
    playSuccessSfx();
  };

  const handleDeleteIp = (ip: string) => {
    playClickSfx();
    setIpList(prev => prev.filter(item => item !== ip));
    addTerminalLog(`Security network Whitelist updated. Node IP removed: ${ip}`);
    playSuccessSfx();
  };

  // Determine levels unlocked
  const isResearcher = userProfile.clearance === "RESEARCHER" || userProfile.clearance === "COMMANDER";
  const isCommander = userProfile.clearance === "COMMANDER";

  return (
    <div id="command-center-console" className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 md:pt-28 select-none animate-fadeIn text-left">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#92dbff]/25 to-indigo-500/10 rounded-2xl border border-[#92dbff]/30 shadow-[0_0_15px_rgba(146,219,255,0.15)]">
            <Activity className="w-7 h-7 text-[#92dbff] animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans text-3xl font-black text-white tracking-tight uppercase">
              Command Center
            </h1>
            <p className="font-sans text-xs text-[#c7c4d8]/60 mt-1">
              Auron Platform Central Operational Dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            TELEMETRY ONLINE
          </span>
          <span className="font-mono text-[9px] text-[#c7c4d8]/40 border border-white/10 px-3 py-1 rounded">CLEARANCE: {userProfile.clearance}</span>
        </div>
      </div>

      {/* RENDER SIX CORE REQUIREMENT METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* Card 1: VOICEPRINTS */}
        <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-[#92dbff]/25 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block leading-none">Voiceprints</span>
            <Database className="w-3.5 h-3.5 text-[#92dbff]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white block tracking-tight">{voiceprintsCount}</span>
            <span className="text-[8px] text-[#c7c4d8]/30 font-mono uppercase block mt-1">Stored biometric pass</span>
          </div>
        </div>

        {/* Card 2: ACCURACY */}
        <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-[#92dbff]/25 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block leading-none">Accuracy</span>
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-indigo-400 block tracking-tight">{accuracy}%</span>
            <span className="text-[8px] text-[#c7c4d8]/30 font-mono uppercase block mt-1">Acoustic classification</span>
          </div>
        </div>

        {/* Card 3: COMMANDS */}
        <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-[#92dbff]/25 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block leading-none">Commands</span>
            <TerminalSquare className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white block tracking-tight">{commandsCount}</span>
            <span className="text-[8px] text-[#c7c4d8]/30 font-mono uppercase block mt-1">Processed count</span>
          </div>
        </div>

        {/* Card 4: STATUS */}
        <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/25 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block leading-none">Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-4">
            <span className="text-2.5 font-bold text-emerald-400 font-mono uppercase block tracking-wider">ACTIVE</span>
            <span className="text-[8px] text-[#c7c4d8]/30 font-mono uppercase block mt-1">Nodal receiver response</span>
          </div>
        </div>

        {/* Card 5: LAST LOGIN */}
        <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-[#92dbff]/25 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block leading-none">Last Login</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-4">
            <span className="text-sm font-black text-white uppercase block leading-none select-all">{lastLogin}</span>
            <span className="text-[8px] text-[#c7c4d8]/30 font-mono uppercase block mt-1">Secured signature pass</span>
          </div>
        </div>

        {/* Card 6: SECURITY SCORE */}
        <div className="bg-[#1f1f26]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-violet-500/25 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block leading-none">Security Score</span>
            <Shield className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-violet-400 block tracking-tight">{securityScore}</span>
            <span className="text-[8px] text-[#c7c4d8]/30 font-mono uppercase block mt-1">Core Firewall Audit</span>
          </div>
        </div>
      </div>

      {/* CORE CONTROL CARDS BASED ON CLEARANCE LEVELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEVEL 1: FIELD AGENT CONTROLS - (ALWAYS UNLOCKED) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="font-mono text-xs text-[#92dbff] font-bold">LEVEL 1: FIELD AGENT</span>
              <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono uppercase ml-auto">UNLOCKED</span>
            </div>

            <p className="text-xs text-[#c7c4d8]/80 leading-relaxed font-sans">
              As a <strong>Field Agent</strong>, you have access to fundamental voice recording analysis pipelines and basic identity statistics.
            </p>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => onNavigate("upload")}
                className="w-full text-left bg-black/40 border border-white/5 rounded-lg p-3 hover:border-[#92dbff]/20 hover:bg-[#131319]/20 transition duration-200 cursor-pointer text-xs"
              >
                <div className="font-bold text-white mb-1">Upload New Recording</div>
                <div className="text-[10px] text-[#c7c4d8]/40">Provide speech samples in wav format.</div>
              </button>

              <button 
                onClick={() => onNavigate("results")}
                className="w-full text-left bg-black/40 border border-white/5 rounded-lg p-3 hover:border-[#92dbff]/20 hover:bg-[#131319]/20 transition duration-200 cursor-pointer text-xs"
              >
                <div className="font-bold text-white mb-1">View Result Ingress logs</div>
                <div className="text-[10px] text-[#c7c4d8]/40">Consult historically classified digits.</div>
              </button>

              <button 
                onClick={handleRunDiagnostic}
                className="w-full font-mono text-[10px] uppercase text-center bg-[#4f44e2] hover:bg-[#4f44e2]/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#92dbff]" />
                Run System Diagnostics
              </button>
            </div>
          </div>

          {/* Quick Info Block */}
          <div className="bg-[#1f1f26]/20 border border-white/5 p-5 rounded-2xl">
            <h4 className="font-sans text-xs font-bold text-white uppercase mb-2">SYSTEM POLICIES NOTICE</h4>
            <p className="text-white/40 text-[10px] leading-relaxed">
              Cybersecurity protocols require secure signature key rotated periodically. Change your tier using clearance modules to explore training variables or advanced whitelists.
            </p>
          </div>
        </div>

        {/* LEVEL 2: RESEARCHER ANALYTICS & TRAINING MODULE */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 overflow-hidden min-h-[300px]">
            {/* If not Researcher, show blurred overlay with elevation trigger */}
            {!isResearcher && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/85 flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                <ShieldAlert className="w-12 h-12 text-[#ff5352] mb-3 animate-pulse" />
                <h4 className="font-sans text-lg font-bold text-white uppercase tracking-wider">RESTRICTED: LEVEL 2 CLEARANCE REQUIRED</h4>
                <p className="font-sans text-xs text-[#c7c4d8]/70 max-w-sm mt-1.5 leading-relaxed">
                  Analytics Training reports, learning loops, epochs adjustments, and custom spectrogram set parameters are locked under Researcher Clearance.
                </p>
                <button
                  onClick={() => handleElevateClearance("RESEARCHER")}
                  className="mt-5 bg-[#92dbff]/10 hover:bg-[#92dbff]/20 border border-[#92dbff]/30 text-[#92dbff] font-mono text-[10.5px] font-bold uppercase px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Request Level 2 (Researcher) Clearance
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5">
              <span className="font-mono text-xs text-indigo-400 font-bold">LEVEL 2: RESEARCH OPTION MATRIX</span>
              <span className="text-[8px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.2 rounded font-mono uppercase ml-auto">UNLOCKED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left">
              {/* Plot diagram model tuning */}
              <div className="space-y-4">
                <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Spectrogram Learning curves</span>
                
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span>Train Epoch Parameters</span>
                    <div className="flex gap-1.5">
                      {[50, 80, 120].map(ep => (
                        <button
                          key={ep}
                          onClick={() => { playClickSfx(); setSelectedEpochs(ep); }}
                          className={`px-2 py-0.5 border text-[9px] rounded font-mono ${
                            selectedEpochs === ep ? "border-[#92dbff] text-[#92dbff] bg-[#92dbff]/5" : "border-white/5 text-white/40"
                          }`}
                        >
                          {ep} Ep
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span>Spectral Loss convergence</span>
                    <span className="text-emerald-400 font-bold">0.0245 Target</span>
                  </div>

                  {/* Draw a sleek bar/line chart using HTML representation */}
                  <div className="h-10 w-full flex items-end gap-1 pt-2">
                    {Array.from({ length: 15 }).map((_, i) => {
                      const dec = i / 14;
                      // Loss curve decreases smoothly
                      const lossVal = 100 - (dec * 85 + Math.random() * 8);
                      return (
                        <div 
                          key={i}
                          style={{ height: `${lossVal}%` }}
                          className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 opacity-65"
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-[#c7c4d8]/50 leading-relaxed block">
                    Training reports specify absolute convergence index on the MFCC filterbank parameter set after epoch 64 sequence run.
                  </span>
                </div>
              </div>

              {/* Training logs terminal */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Research Logs</span>
                  <button 
                    onClick={() => { playClickSfx(); setConsoleLogs([]); }}
                    className="text-red-400 hover:text-red-300 text-[9px] font-mono uppercase"
                  >
                    Clear Logs
                  </button>
                </div>

                {/* Simulated command console stream */}
                <div className="bg-[#050510]/80 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#c7c4d8] h-32 overflow-y-auto space-y-1.5 scrollbar-thin select-text">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-1 last:border-0">{log}</div>
                  ))}
                </div>

                {/* Custom command insertion */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newLogInput) return;
                    addTerminalLog(`USER EXEC: ${newLogInput}`);
                    setNewLogInput("");
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newLogInput}
                    onChange={(e) => setNewLogInput(e.target.value)}
                    placeholder="Submit command query..."
                    className="bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 font-mono text-[10px] text-white flex-grow focus:outline-none focus:border-[#92dbff]"
                  />
                  <button
                    type="submit"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] py-1 px-3 rounded uppercase cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* LEVEL 3: COMMANDER ADVANCED ADMINISTRATION & FIREWALL */}
          <div className="relative bg-[#1f1f26]/30 border border-white/5 rounded-2xl p-6 overflow-hidden min-h-[300px]">
            {/* If not Commander, show blurred overlay */}
            {!isCommander && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/85 flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                <ShieldAlert className="w-12 h-12 text-[#ff5352] mb-3 animate-pulse" />
                <h4 className="font-sans text-lg font-bold text-white uppercase tracking-wider">RESTRICTED: LEVEL 3 Clearance Required</h4>
                <p className="font-sans text-xs text-[#c7c4d8]/70 max-w-sm mt-1.5 leading-relaxed">
                  Advanced model weights administration, secure IP network Whitelists, and master key overrides are restricted to commanders.
                </p>
                <button
                  onClick={() => handleElevateClearance("COMMANDER")}
                  className="mt-5 bg-gradient-to-r from-[#4f44e2] to-[#00c4fd] hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] text-white font-mono text-[10.5px] font-bold uppercase px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Elevate Node to Level 3 (Commander) Code
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5 text-left">
              <span className="font-mono text-xs text-rose-400 font-bold">LEVEL 3: COMMANDER MATRIX</span>
              <span className="text-[8px] bg-rose-500/15 text-rose-300 border border-rose-500/20 px-1.5 py-0.2 rounded font-mono uppercase ml-auto">UNLOCKED</span>
            </div>

            {/* Ingress Network Whitelists manager */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left">
              <div className="space-y-4">
                <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Secure Firewall IP whitelist</span>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ipList.map(ip => (
                    <div key={ip} className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">● {ip}</span>
                      <button 
                        onClick={() => handleDeleteIp(ip)}
                        className="text-red-500 hover:text-red-400 font-mono text-[9px] uppercase cursor-pointer"
                        title="Revoke Whitelist"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddIp} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="e.g. 192.168.1.1..."
                    className="bg-black/50 border border-white/10 rounded-lg p-2 font-mono text-[10px] text-white flex-grow focus:outline-none focus:border-[#92dbff]"
                  />
                  <button
                    type="submit"
                    className="bg-[#92dbff]/10 hover:bg-[#92dbff]/20 border border-[#92dbff]/30 text-[#92dbff] font-mono text-[10px] px-3.5 py-2 rounded-lg cursor-pointer"
                  >
                    Whitelist
                  </button>
                </form>
              </div>

              {/* Active Admin overrides */}
              <div className="space-y-4">
                <span className="font-mono text-[8px] text-white/40 uppercase block font-bold">Master Model Overrides</span>
                
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 font-sans">
                  <div className="flex justify-between items-center text-[10px]">
                    <div>
                      <span className="text-white font-bold block leading-none">Sandbox container permission overrides</span>
                      <span className="text-[9px] text-white/30 block mt-0.5">Bypass modern browser mic bounds</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#92dbff] rounded cursor-pointer" />
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-3 border-t border-white/5">
                    <div>
                      <span className="text-white font-bold block leading-none">Acoustic Quantum Ingress Target</span>
                      <span className="text-[9px] text-white/30 block mt-0.5">Change weights matrix directory</span>
                    </div>
                    <select
                      value={modelWeightConfig}
                      onChange={(e) => {
                        playClickSfx();
                        setModelWeightConfig(e.target.value);
                        addTerminalLog(`Model Weights updated target to index: ${e.target.value}`);
                      }}
                      className="bg-black border border-white/10 text-white font-mono text-[9px] px-2 py-1 rounded focus:outline-none focus:border-[#92dbff]"
                    >
                      <option value="Acoustic-ResNet-101">ResNet-101</option>
                      <option value="Acoustic-Transformer-v4">Trans-v4</option>
                      <option value="Acoustic-Quantum-v3">Quant-v3</option>
                    </select>
                  </div>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 rounded text-[10px] text-[#c7c4d8]/70 leading-relaxed font-sans">
                  Warning: Model override settings apply system-wide instantly. Check spectrograph convergence reports before rotating active nodes.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
