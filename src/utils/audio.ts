// Sci-Fi Sound Synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Some browsers need standard webkitAudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a futuristic cursor hover blip
 */
export function playHoverSfx() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Cute retro sine sweep
    osc.type = "sine";
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(600, startTime);
    osc.frequency.exponentialRampToValueAtTime(1000, startTime + 0.08);

    gain.gain.setValueAtTime(0.015, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    osc.start(startTime);
    osc.stop(startTime + 0.08);
  } catch (e) {
    // Ignore autoplay blocks or limitations
  }
}

/**
 * Play a futuristic touch action feedback
 */
export function playClickSfx() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(800, startTime);
    osc.frequency.exponentialRampToValueAtTime(350, startTime + 0.15);

    gain.gain.setValueAtTime(0.06, startTime);
    gain.gain.linearRampToValueAtTime(0.0001, startTime + 0.15);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  } catch (e) {
    // Ignore autoplay blocks
  }
}

/**
 * Play a resonant success sweep upon digit prediction completion
 */
export function playSuccessSfx() {
  try {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime;

    // Harmonized futuristic sweep
    [440, 554, 659, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      const devTime = startTime + idx * 0.04;
      
      osc.frequency.setValueAtTime(freq, devTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, devTime + 0.3);

      gain.gain.setValueAtTime(0.02, devTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, devTime + 0.3);

      osc.start(devTime);
      osc.stop(devTime + 0.3);
    });
  } catch (e) {
    // Ignore autoplay blocks
  }
}

/**
 * Play a digital error signal alarm
 */
export function playErrorSfx() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sawtooth";
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(180, startTime);
    osc.frequency.linearRampToValueAtTime(100, startTime + 0.25);

    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.linearRampToValueAtTime(0.0001, startTime + 0.25);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  } catch (e) {
    // Ignore autoplay blocks
  }
}

/**
 * Robust offline-first speech synthesis fallback
 * Standard window.speechSynthesis vocalizing
 */
export function speakTextOffline(message: string, voiceType: string = "Aetheria") {
  if (!("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop active voices
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Assign rates and pitches for diverse acoustic spectrum
    // Neon_Oracle = Puck (high pitched), Titan_Prime = Charon (deepest), Kronos_Void = Fenrir (gravelly, low pitch), Valkyrie_XT = Kore (high female), Aetheria = Zephyr (soft female whisper)
    if (voiceType === "Neon_Oracle") {
      utterance.pitch = 1.45;
      utterance.rate = 1.18;
    } else if (voiceType === "Titan_Prime") {
      utterance.pitch = 0.55;
      utterance.rate = 0.75;
    } else if (voiceType === "Kronos_Void") {
      utterance.pitch = 0.68;
      utterance.rate = 0.82;
    } else if (voiceType === "Valkyrie_XT") {
      utterance.pitch = 1.25;
      utterance.rate = 1.05;
    } else { // Aetheria
      utterance.pitch = 0.95;
      utterance.rate = 0.92;
    }

    const voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter(v => v.lang.startsWith("en-") || v.lang.startsWith("en_"));

    // Categorize accessible voices for realistic selection
    const femaleVoices = enVoices.filter(v => 
      v.name.toLowerCase().includes("female") || 
      v.name.toLowerCase().includes("zira") || 
      v.name.toLowerCase().includes("samantha") || 
      v.name.toLowerCase().includes("hazel") ||
      v.name.toLowerCase().includes("moira") ||
      v.name.toLowerCase().includes("karen") ||
      v.name.toLowerCase().includes("tessa") ||
      v.name.toLowerCase().includes("mimi") ||
      v.name.toLowerCase().includes("susan") ||
      v.name.toLowerCase().includes("natural") && v.name.toLowerCase().includes("female")
    );

    const maleVoices = enVoices.filter(v => 
      v.name.toLowerCase().includes("male") || 
      v.name.toLowerCase().includes("david") || 
      v.name.toLowerCase().includes("george") || 
      v.name.toLowerCase().includes("ravi") || 
      v.name.toLowerCase().includes("mark") || 
      v.name.toLowerCase().includes("daniel") ||
      v.name.toLowerCase().includes("richard") ||
      v.name.toLowerCase().includes("natural") && v.name.toLowerCase().includes("male")
    );

    let selectedVoice: SpeechSynthesisVoice | null = null;
    
    if (voiceType === "Aetheria" || voiceType === "Valkyrie_XT") {
      // Find a female system voice
      selectedVoice = femaleVoices[0] || enVoices.find(v => v.name.toLowerCase().includes("female")) || enVoices[0];
    } else if (voiceType === "Titan_Prime" || voiceType === "Kronos_Void") {
      // Find a male system voice
      selectedVoice = maleVoices[0] || enVoices.find(v => v.name.toLowerCase().includes("male")) || enVoices[0];
    } else {
      // Neon_Oracle: fallback to any playful or standard Google voice
      selectedVoice = enVoices.find(v => v.name.toLowerCase().includes("google")) || enVoices[1] || enVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("SpeechSynthesis error:", e);
  }
}
