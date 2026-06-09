export type NavPage = "home" | "upload" | "demo" | "results" | "signup" | "about" | "research" | "faq" | "contact" | "terms" | "identity" | "command" | "login";

export interface DigitHistory {
  id: string;
  timestamp: string;
  digit: number;
  english: string;
  greek: string;
  confidence: number;
  analysis: string;
  filename: string;
  durationSecs: number;
  isLive: boolean;
  audioData?: string; // Base64 audio or blob URL for playback
  isMock: boolean;
}

export type TtsVoice = "Aetheria" | "Valkyrie_XT" | "Neon_Oracle" | "Titan_Prime" | "Kronos_Void";

export interface VoiceMetadata {
  id: TtsVoice;
  displayName: string;
  category: "female" | "male" | "alien" | "cyborg" | "android";
  genderLabel: string;
  description: string;
  geminiVoice: "Zephyr" | "Kore" | "Puck" | "Charon" | "Fenrir";
}

export const FUTURISTIC_VOICES: VoiceMetadata[] = [
  {
    id: "Aetheria",
    displayName: "🎤 Aetheria-9",
    category: "android",
    genderLabel: "Android Whisper (Female)",
    description: "Airy, whispered cybernetic female consciousness.",
    geminiVoice: "Zephyr"
  },
  {
    id: "Valkyrie_XT",
    displayName: "⚡ Valkyrie-XT",
    category: "cyborg",
    genderLabel: "Crisp Tactical (Female)",
    description: "Bright, high-frequency kinetic female tactical AI.",
    geminiVoice: "Kore"
  },
  {
    id: "Neon_Oracle",
    displayName: "🔮 Neon Oracle",
    category: "alien",
    genderLabel: "Upbeat Synth (Being)",
    description: "Fast-talking digital oracle with elevated frequency harmonics.",
    geminiVoice: "Puck"
  },
  {
    id: "Titan_Prime",
    displayName: "💀 Titan Prime",
    category: "male",
    genderLabel: "Deep Heavy (Male)",
    description: "Ultra deep, sub-bass resonant gargantuan command voice.",
    geminiVoice: "Charon"
  },
  {
    id: "Kronos_Void",
    displayName: "🌀 Kronos Void",
    category: "alien",
    genderLabel: "Brutalist Gravel (Entity)",
    description: "Gravelly, low-harmonic dark warrior cosmic entity.",
    geminiVoice: "Fenrir"
  }
];

export interface VoiceSettings {
  ttsVoice: TtsVoice;
  engineMode: "offline" | "gemini" | "alternative";
  sciFiSfx: boolean;
}

export const GREEK_ALPHABET: Record<number, { title: string; subtitle: string; color: string; hoverColor: string }> = {
  0: { title: "0", subtitle: "Init", color: "#c4c0ff", hoverColor: "rgba(196, 192, 255, 0.4)" },
  1: { title: "1", subtitle: "Alpha", color: "#92dbff", hoverColor: "rgba(146, 219, 255, 0.4)" },
  2: { title: "2", subtitle: "Beta", color: "#ffb3ae", hoverColor: "rgba(255, 179, 174, 0.4)" },
  3: { title: "3", subtitle: "Gamma", color: "#4f44e2", hoverColor: "rgba(79, 68, 226, 0.4)" },
  4: { title: "4", subtitle: "Delta", color: "#00c4fd", hoverColor: "rgba(0, 196, 253, 0.4)" },
  5: { title: "5", subtitle: "Epsln", color: "#ff5352", hoverColor: "rgba(255, 83, 82, 0.4)" },
  6: { title: "6", subtitle: "Zeta", color: "#8781ff", hoverColor: "rgba(135, 129, 255, 0.4)" },
  7: { title: "7", subtitle: "Eta", color: "#6dd2ff", hoverColor: "rgba(109, 210, 255, 0.4)" },
  8: { title: "8", subtitle: "Theta", color: "#ffdad7", hoverColor: "rgba(255, 218, 215, 0.4)" },
  9: { title: "9", subtitle: "Iota", color: "#e3dfff", hoverColor: "rgba(227, 223, 255, 0.4)" },
};
