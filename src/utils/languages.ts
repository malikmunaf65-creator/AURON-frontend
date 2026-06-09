/**
 * Phonetic Language Paradigms for the AURON auditory intelligence platform.
 * Provides real-time mapping of digit values (0-9) to various tactical language phonetics.
 */

export interface LanguageParadigm {
  id: string;
  name: string;
  desc: string;
  isPremium?: boolean;
}

export const PHONETIC_LANGUAGES: LanguageParadigm[] = [
  { id: "English (US)", name: "English (US)", desc: "Integrated Vocalizations" },
  { id: "Greek (Classical)", name: "Greek (Classical)", desc: "Direct Lexicon Format" },
  { id: "Spanish (Castilian)", name: "Spanish (Castilian)", desc: "Southern Grid Sync" },
  { id: "French (Parisian)", name: "French (Parisian)", desc: "European Signal Node" },
  { id: "German (Berlin Core)", name: "German (Berlin Core)", desc: "Northern Sector Frequency" },
  { id: "Japanese (Neo-Tokyo)", name: "Japanese (Neo-Tokyo)", desc: "Eastern Sector Output" },
  { id: "Latin (Imperator)", name: "Latin (Imperator)", desc: "Ancient Matrix Format" },
  { id: "Sanskrit (Vedic Grid)", name: "Sanskrit (Vedic Grid)", desc: "High-Resonance Vibrations" },
  { id: "Mandarin (Dragon Matrix)", name: "Mandarin (Dragon Matrix)", desc: "Celestial Wave Decoder" },
  { id: "Italian (Milano Node)", name: "Italian (Milano Node)", desc: "Mediterranean Pulse" }
];

export const DIGIT_TRANS_MAP: Record<string, Record<number, string>> = {
  "English (US)": {
    0: "Zero (Null)",
    1: "One (Alpha)",
    2: "Two (Bravo)",
    3: "Three (Charlie)",
    4: "Four (Delta)",
    5: "Five (Echo)",
    6: "Six (Foxtrot)",
    7: "Seven (Golf)",
    8: "Eight (Hotel)",
    9: "Nine (India)"
  },
  "Greek (Classical)": {
    0: "Ouden (Init)",
    1: "Heis (Alpha)",
    2: "Duo (Beta)",
    3: "Treis (Gamma)",
    4: "Tettares (Delta)",
    5: "Pente (Epsilon)",
    6: "Hex (Zeta)",
    7: "Hepta (Eta)",
    8: "Okto (Theta)",
    9: "Ennea (Iota)"
  },
  "French (Parisian)": {
    0: "Zéro (Néant)",
    1: "Un (Unité)",
    2: "Deux (Double)",
    3: "Trois (Trio)",
    4: "Quatre (Quad)",
    5: "Cinq (Quint)",
    6: "Six (Hex)",
    7: "Sept (Sept)",
    8: "Huit (Octave)",
    9: "Neuf (Nouveau)"
  },
  "Japanese (Neo-Tokyo)": {
    0: "Rei (Zero)",
    1: "Ichi (Sho)",
    2: "Ni (Gekko)",
    3: "San (Mitsu)",
    4: "Yon (Shin)",
    5: "Go (Gyo)",
    6: "Roku (Ryu)",
    7: "Nana (Sei)",
    8: "Hachi (Rin)",
    9: "Kyu (Kyu)"
  },
  "Spanish (Castilian)": {
    0: "Cero (Nulo)",
    1: "Uno (Primero)",
    2: "Dos (Segundo)",
    3: "Tres (Tercero)",
    4: "Cuatro (Cuarto)",
    5: "Cinco (Quinto)",
    6: "Seis (Sexto)",
    7: "Siete (Séptimo)",
    8: "Ocho (Octavo)",
    9: "Nueve (Noveno)"
  },
  "German (Berlin Core)": {
    0: "Null (Keins)",
    1: "Eins (Prim)",
    2: "Zwei (Duo)",
    3: "Drei (Trio)",
    4: "Vier (Quart)",
    5: "Fünf (Quint)",
    6: "Sechs (Hexas)",
    7: "Sieben (Sept)",
    8: "Acht (Okto)",
    9: "Neun (Nov)"
  },
  "Latin (Imperator)": {
    0: "Nihil (Nullum)",
    1: "Unus (Primus)",
    2: "Duo (Secundus)",
    3: "Tres (Tertius)",
    4: "Quattuor (Quartus)",
    5: "Quinque (Quintus)",
    6: "Sex (Sextus)",
    7: "Septem (Septimus)",
    8: "Octo (Octavus)",
    9: "Novem (Nonus)"
  },
  "Sanskrit (Vedic Grid)": {
    0: "Shunya (Kha)",
    1: "Ekam (Pratham)",
    2: "Dve (Dvitiyam)",
    3: "Trini (Tritiyam)",
    4: "Chatvari (Chaturtham)",
    5: "Pancha (Panchamam)",
    6: "Shat (Shashtam)",
    7: "Sapta (Saptamam)",
    8: "Ashta (Ashtamam)",
    9: "Nava (Navamam)"
  },
  "Mandarin (Dragon Matrix)": {
    0: "Líng (Wú)",
    1: "Yī (Shǎ)",
    2: "Èr (Shuāng)",
    3: "Sān (Cái)",
    4: "Sì (Xiàng)",
    5: "Wǔ (Xíng)",
    6: "Liù (Hé)",
    7: "Qī (Xīng)",
    8: "Bā (Guà)",
    9: "Jiǔ (Zhī)"
  },
  "Italian (Milano Node)": {
    0: "Zero (Nullo)",
    1: "Uno (Primo)",
    2: "Due (Secondo)",
    3: "Tre (Tre)",
    4: "Quattro (Quarto)",
    5: "Cinque (Quinto)",
    6: "Sei (Sesto)",
    7: "Sette (Settimo)",
    8: "Otto (Ottavo)",
    9: "Nove (Novello)"
  }
};

/**
 * Gets the current configured language from LocalStorage
 */
export function getCurrentLanguage(): string {
  try {
    return localStorage.getItem("auron_language") || "English (US)";
  } catch {
    return "English (US)";
  }
}

/**
 * Maps a single digit to its phonetic equivalent in the selected language.
 * Falls back to English (US) if translation misses, and then to absolute digit string.
 */
export function getTranslatedPhonetic(digit: number, langOverride?: string): string {
  const activeLang = langOverride || getCurrentLanguage();
  
  // Find match
  const langKey = Object.keys(DIGIT_TRANS_MAP).find(
    k => k.toLowerCase() === activeLang.toLowerCase() || activeLang.toLowerCase().includes(k.toLowerCase())
  ) || "English (US)";

  const translationGroup = DIGIT_TRANS_MAP[langKey] || DIGIT_TRANS_MAP["English (US)"];
  return translationGroup[digit] ?? digit.toString();
}
