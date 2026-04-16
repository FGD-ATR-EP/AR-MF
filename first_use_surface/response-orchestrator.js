function localized(language, thText, enText) {
  return language === 'th' ? thText : enText;
}

function detectLanguageHint(text) {
  const thaiCount = (text.match(/[\u0E00-\u0E7F]/g) || []).length;
  const englishCount = (text.match(/[A-Za-z]/g) || []).length;

  if (!thaiCount && !englishCount) return 'unknown';
  if (thaiCount > englishCount) return 'th';
  if (englishCount > thaiCount) return 'en';
  return 'unknown';
}

export function routeLightResponse(inputText, language) {
  const normalized = inputText.trim().toLowerCase();
  const hintedLanguage = detectLanguageHint(normalized);

  const isGreeting = /^((hello|hi|hey)\b|สวัสดี|หวัดดี|ดีจ้า|โย่ว)/i.test(normalized);
  const isGratitude = /(thank|ขอบคุณ|thx|ขอบใจ)/i.test(normalized);
  const isQuestion = normalized.includes('?')
    || /^(what|how|why|when|where|who|can|could|should|do|does|is|are|อะไร|ทำไม|อย่างไร|เมื่อไร|ที่ไหน|ใคร)/i.test(normalized);

  if (hintedLanguage !== 'unknown' && hintedLanguage !== language) {
    return {
      mood: 'warm',
      status: localized(language, 'ปรับภาษาให้สอดคล้องแล้ว', 'Language adapted'),
      text: localized(
        language,
        'ฉันจะตอบเป็นภาษาที่คุณตั้งค่าไว้ แต่สามารถพิมพ์อีกภาษาหนึ่งได้เสมอ',
        'I will reply in your preferred language, and you can still type in another one anytime.',
      ),
    };
  }

  if (isGreeting) {
    return {
      mood: 'greeting',
      status: localized(language, 'กำลังก่อรูปคำทักทาย', 'Manifesting a greeting'),
      text: localized(language, 'สวัสดี ยินดีที่ได้พบคุณ', 'Hello. It is good to meet you.'),
    };
  }

  if (isGratitude) {
    return {
      mood: 'warm',
      status: localized(language, 'ตอบรับด้วยความอบอุ่น', 'Responding with warmth'),
      text: localized(language, 'ด้วยความยินดี ฉันอยู่ตรงนี้เพื่อช่วยคุณ', 'You are welcome. I am here to help.'),
    };
  }

  if (isQuestion) {
    return {
      mood: 'answer',
      status: localized(language, 'กำลังตีความคำถาม', 'Interpreting your question'),
      text: localized(
        language,
        'ฉันรับคำถามแล้ว ลองเพิ่มบริบทอีกเล็กน้อยเพื่อคำตอบที่แม่นขึ้น',
        'I received your question. Add a bit more context for a sharper answer.',
      ),
    };
  }

  return {
    mood: 'ambiguity',
    status: localized(language, 'กำลังตีความอย่างนุ่มนวล', 'Interpreting softly'),
    text: localized(
      language,
      'ฉันรับสัญญาณของคุณแล้ว คุณสามารถขยายความได้อีกนิด',
      'I received your signal. You can expand it a little for clarity.',
    ),
  };
}
