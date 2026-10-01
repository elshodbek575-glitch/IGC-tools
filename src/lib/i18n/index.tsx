import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  getLanguage,
  isRtl,
  LANGUAGES,
  type Language,
} from "./languages";
import { TRANSLATIONS } from "./translations";
import { en } from "./translations/en";
import type { Dict, TVars } from "./types";

const STORAGE_KEY = "novatools.locale";

function interpolate(template: string, vars?: TVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Pick the best stored/available locale, falling back to English. */
function resolveInitialLocale(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && getLanguage(stored)) return stored;
  } catch {
    // localStorage can be unavailable (private mode, embedded frames).
  }
  return DEFAULT_LOCALE;
}

type I18nContextValue = {
  locale: string;
  dir: "ltr" | "rtl";
  languages: Language[];
  setLocale: (code: string) => void;
  /** Translate a key, optionally interpolating `{placeholders}`. */
  t: (key: string, vars?: TVars) => string;
  /**
   * Translate a key that may not be in any dictionary yet, using the supplied
   * English source string as the fallback. Used for content that lives in the
   * data files (tool names and notes, subject taglines, syllabus topics) so
   * translations can be added without duplicating English into `en.ts`.
   */
  tOr: (key: string, fallback: string) => string;
  /** Localised subject name, falling back to the supplied English name. */
  subjectName: (id: string, fallback: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>(resolveInitialLocale);

  const dict = useMemo<Dict>(
    () => ({ ...en, ...(TRANSLATIONS[locale] ?? {}) }),
    [locale],
  );

  const t = useCallback(
    (key: string, vars?: TVars) => {
      const template = dict[key] ?? en[key] ?? key;
      return interpolate(template, vars);
    },
    [dict],
  );

  const tOr = useCallback(
    (key: string, fallback: string) => dict[key] ?? fallback,
    [dict],
  );

  const subjectName = useCallback(
    (id: string, fallback: string) => dict[`subject.${id}`] ?? fallback,
    [dict],
  );

  const setLocale = useCallback((code: string) => {
    if (!getLanguage(code)) return;
    setLocaleState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage failures; the choice still applies for this session.
    }
  }, []);

  // Keep <html lang> and direction in sync with the active locale.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: isRtl(locale) ? "rtl" : "ltr",
      languages: LANGUAGES,
      setLocale,
      t,
      tOr,
      subjectName,
    }),
    [locale, setLocale, t, tOr, subjectName],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

/** Convenience hook when a component only needs the translate function. */
export function useTranslation(): I18nContextValue["t"] {
  return useI18n().t;
}

export { LANGUAGES, DEFAULT_LOCALE } from "./languages";
export type { Language } from "./languages";
