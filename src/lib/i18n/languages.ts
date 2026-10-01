/**
 * The languages NovaTools can be viewed in.
 *
 * The list covers the fifty most-spoken languages in the world (by total
 * speakers) plus Uzbek. One language is active at a time; `en` is the source
 * language and the fallback for any string a locale has not translated yet.
 *
 * `nativeName` is shown in the picker so speakers recognise their own language.
 * `dir` drives the document direction for right-to-left scripts.
 */
export type Language = {
  code: string;
  /** English name, used for search and screen readers. */
  name: string;
  /** Name written in the language itself. */
  nativeName: string;
  dir: "ltr" | "rtl";
};

export const DEFAULT_LOCALE = "en";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", dir: "ltr" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", dir: "ltr" },
  { code: "th", name: "Thai", nativeName: "ไทย", dir: "ltr" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr" },
  { code: "fa", name: "Persian", nativeName: "فارسی", dir: "rtl" },
  { code: "pl", name: "Polish", nativeName: "Polski", dir: "ltr" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", dir: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", dir: "ltr" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", dir: "ltr" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ", dir: "ltr" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", dir: "ltr" },
  { code: "ro", name: "Romanian", nativeName: "Română", dir: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", dir: "ltr" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", dir: "ltr" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", dir: "rtl" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", dir: "ltr" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", dir: "ltr" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", dir: "ltr" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", dir: "ltr" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", dir: "ltr" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", dir: "ltr" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", dir: "ltr" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", dir: "ltr" },
  { code: "cs", name: "Czech", nativeName: "Čeština", dir: "ltr" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", dir: "ltr" },
  { code: "he", name: "Hebrew", nativeName: "עברית", dir: "rtl" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", dir: "ltr" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", dir: "ltr" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", dir: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", dir: "ltr" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbekcha", dir: "ltr" },
];

export const LANGUAGE_MAP: Record<string, Language> = Object.fromEntries(
  LANGUAGES.map((language) => [language.code, language]),
);

export function getLanguage(code: string): Language | undefined {
  return LANGUAGE_MAP[code];
}

export function isRtl(code: string): boolean {
  return LANGUAGE_MAP[code]?.dir === "rtl";
}
