import React, { useState } from "react";
import { KeyRound, Shield, User, ArrowRight, Activity, Terminal, Eye, EyeOff } from "lucide-react";
import { playClickSfx, playHoverSfx, playSuccessSfx, playErrorSfx } from "@/src/utils/audio";

interface AgentLoginViewProps {
  onLoginSuccess: (profile: any) => void;
  onNavigateToSignup: () => void;
  appLanguage?: string;
}

export default function AgentLoginView({ onLoginSuccess, onNavigateToSignup, appLanguage = "English (US)" }: AgentLoginViewProps) {
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      const stored = localStorage.getItem("auron_remember_me");
      return stored === "true"; // Default to false unless explicitly stored as "true"
    } catch {
      return false;
    }
  });

  const [emailOrCallsign, setEmailOrCallsign] = useState(() => {
    try {
      const stored = localStorage.getItem("auron_remember_me");
      if (stored === "true") {
        const storedEmail = localStorage.getItem("auron_remembered_email");
        if (storedEmail !== null) return storedEmail;
      }
    } catch {}
    return ""; // Empty by default
  });

  const [signatureKey, setSignatureKey] = useState(() => {
    try {
      const stored = localStorage.getItem("auron_remember_me");
      if (stored === "true") {
        const storedKey = localStorage.getItem("auron_remembered_key");
        if (storedKey !== null) return storedKey;
      }
    } catch {}
    return ""; // Empty by default
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSfx();
    if (!emailOrCallsign || !signatureKey) {
      setErrorMsg("Identifiers and security core signature are mandatory.");
      playErrorSfx();
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/agents/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrCallsign, signatureKey })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Access Denied: Invalid signature credentials.");
      }

      const data = await response.json();
      const dbAgent = data.agent;

      // Save credentials if Remember Me is checked
      try {
        if (rememberMe) {
          localStorage.setItem("auron_remember_me", "true");
          localStorage.setItem("auron_remembered_email", emailOrCallsign);
          localStorage.setItem("auron_remembered_key", signatureKey);
        } else {
          localStorage.setItem("auron_remember_me", "false");
          localStorage.removeItem("auron_remembered_email");
          localStorage.removeItem("auron_remembered_key");
        }
      } catch (e) {}

      const simProfile = {
        formData: {
          username: dbAgent.gridCallSign || dbAgent.username,
          email: dbAgent.communicationEmail || dbAgent.email,
          clearance: dbAgent.clearanceTier || dbAgent.clearance,
          voicePassphrase: dbAgent.voicePassphrase
        },
        secureSignature: dbAgent.secureSignature,
        joinDate: dbAgent.joinDate || "June 2026",
        voiceprints: dbAgent.voiceprints || 12,
        accuracy: dbAgent.accuracy || 97.3,
        successRate: dbAgent.successRate || 95.8,
        lastCalibration: dbAgent.lastCalibration || "Just Now"
      };

      try {
        localStorage.setItem("auron_user_profile", JSON.stringify(simProfile));
      } catch (e) {}

      playSuccessSfx();
      onLoginSuccess({
        username: simProfile.formData.username,
        email: simProfile.formData.email,
        clearance: simProfile.formData.clearance,
        secureSignature: simProfile.secureSignature,
        joinDate: simProfile.joinDate,
        voiceprints: simProfile.voiceprints,
        accuracy: simProfile.accuracy,
        successRate: simProfile.successRate,
        lastCalibration: simProfile.lastCalibration
      });

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate agent signups.");
      playErrorSfx();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1f1f26]/40 backdrop-blur-[20px] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl p-6 md:p-8 relative mx-auto my-12 animate-fadeIn">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#92dbff]/10 to-transparent blur-md pointer-events-none" />

      <div className="flex flex-col gap-4 text-center mb-6">
        <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-[#4f44e2] to-[#92dbff] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(79,68,226,0.25)]">
          <Shield className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h2 className="font-sans text-xl md:text-2xl font-semibold text-white tracking-wide">
            Agent Access Portal
          </h2>
          <p className="font-sans text-xs text-[#c7c4d8]/60 mt-1">
            Re-authenticate your vocal and secure signature metrics.
          </p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* Email or Callsign */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
            Grid Call Sign / Email
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
            <input
              type="text"
              required
              value={emailOrCallsign}
              onChange={(e) => setEmailOrCallsign(e.target.value)}
              placeholder="agent_malik or malikmunaf65@gmail.com..."
              className="w-full bg-[#131319]/50 border border-white/5 text-white font-mono text-xs p-3.5 pl-10 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Core Matrix Secret Key */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="font-mono text-[9px] text-[#c7c4d8]/40 uppercase tracking-widest">
            Core Signature Key
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
            <input
              type={showKey ? "text" : "password"}
              required
              value={signatureKey}
              onChange={(e) => setSignatureKey(e.target.value)}
              placeholder="AURON-SEC-..."
              className="w-full bg-[#131319]/50 border border-white/5 text-white font-mono text-xs p-3.5 pl-10 pr-11 rounded-xl focus:border-[#92dbff] focus:outline-none transition-all placeholder:text-white/20"
            />
            <button
              type="button"
              onClick={() => {
                playClickSfx();
                setShowKey(!showKey);
              }}
              className="absolute right-3 top-3.5 p-0.5 text-white/30 hover:text-[#92dbff] transition-all cursor-pointer focus:outline-none"
              title={showKey ? "Hide Signature Key" : "Reveal Signature Key"}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2.5 mt-1 select-none text-left pl-1">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => {
              playClickSfx();
              setRememberMe(e.target.checked);
            }}
            className="w-4 h-4 rounded border-white/10 bg-[#131319]/60 text-[#92dbff] focus:ring-0 focus:ring-offset-0 focus:outline-none accent-[#4f44e2] cursor-pointer"
          />
          <label 
            htmlFor="remember-me"
            className="font-mono text-[10px] text-[#c7c4d8]/70 uppercase tracking-wider cursor-pointer hover:text-white transition-all"
          >
            Remember Agent Profile
          </label>
        </div>

        {errorMsg && (
          <p className="font-mono text-[10px] text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10 text-center">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          onMouseEnter={playHoverSfx}
          className="mt-2 w-full bg-[#4f44e2] text-white font-mono text-xs font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4f44e2]/90 hover:shadow-[0_0_15px_rgba(79,68,226,0.3)] transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span>Handshake pending...</span>
          ) : (
            <>
              <span>Authenticate Node</span>
              <ArrowRight className="w-4 h-4 text-[#92dbff]" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onNavigateToSignup}
          className="font-mono text-[10px] text-[#c7c4d8]/50 hover:text-white transition-all underline"
        >
          No neural identity registered? Create Identity.
        </button>
      </div>
    </div>
  );
}
