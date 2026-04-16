const THAI_REGEX = /[\u0E00-\u0E7F]/;
const ENGLISH_REGEX = /[A-Za-z]/;

function detectFromBrowser() {
  const locales = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || 'en'];
  return locales.some((locale) => locale.toLowerCase().startsWith('th')) ? 'th' : 'en';
}

function detectFromCharacters(text) {
  if (!text) return { language: 'unknown', confidence: 0 };

  const thaiChars = (text.match(/[\u0E00-\u0E7F]/g) || []).length;
  const englishChars = (text.match(/[A-Za-z]/g) || []).length;
  const signal = thaiChars + englishChars;

  if (!signal) return { language: 'unknown', confidence: 0 };

  if (thaiChars > englishChars) {
    return { language: 'th', confidence: thaiChars / signal };
  }

  if (englishChars > thaiChars) {
    return { language: 'en', confidence: englishChars / signal };
  }

  if (THAI_REGEX.test(text)) return { language: 'th', confidence: 0.55 };
  if (ENGLISH_REGEX.test(text)) return { language: 'en', confidence: 0.55 };
  return { language: 'unknown', confidence: 0 };
}

function optionalLocalDetector(text, enabled, profile) {
  if (!enabled || profile === 'none' || !text) {
    return { language: 'unknown', confidence: 0 };
  }

  const normalized = text.trim().toLowerCase();

  if (/(สวัสดี|หวัดดี|ขอบคุณ|ครับ|ค่ะ|ช่วย|อะไร|ทำไม|อย่างไร)/.test(normalized)) {
    return { language: 'th', confidence: 0.84 };
  }

  if (/\b(hello|hi|hey|thanks|thank you|please|what|how|why|where|can you)\b/.test(normalized)) {
    return { language: 'en', confidence: 0.84 };
  }

  return { language: 'unknown', confidence: 0 };
}

export function createLanguageLayer(settings) {
  const state = {
    sessionLanguageMemory: settings.sessionLanguageMemory || 'en',
  };

  function resolveLanguage(inputText) {
    if (settings.languagePreference !== 'auto') {
      state.sessionLanguageMemory = settings.languagePreference;
      settings.sessionLanguageMemory = settings.languagePreference;
      return settings.languagePreference;
    }

    const browserLanguage = detectFromBrowser();
    const charDetection = detectFromCharacters(inputText);
    const localDetection = optionalLocalDetector(inputText, settings.useLocalDetector, settings.localModelProfile);

    let resolvedLanguage = state.sessionLanguageMemory || browserLanguage;

    if (charDetection.confidence >= 0.58 && charDetection.language !== 'unknown') {
      resolvedLanguage = charDetection.language;
    }

    if (localDetection.confidence >= charDetection.confidence && localDetection.language !== 'unknown') {
      resolvedLanguage = localDetection.language;
    }

    state.sessionLanguageMemory = resolvedLanguage;
    settings.sessionLanguageMemory = resolvedLanguage;

    return resolvedLanguage;
  }

  return {
    detectFromBrowser,
    detectFromCharacters,
    resolveLanguage,
  };
}
