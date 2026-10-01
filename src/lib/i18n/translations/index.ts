import type { Dict } from "../types";
import { en } from "./en";
import { SUBJECT_COPY } from "./subject-copy";
import { SUBJECT_COPY_C } from "./subject-copy-c";
import { SUBJECT_COPY_CORE } from "./subject-copy-core";
import { SUBJECT_COPY_CORE_BLURBS } from "./subject-copy-core-blurbs";
import { TIER_FULL_A } from "./tier-full-a";
import { TIER_FULL_B } from "./tier-full-b";
import { TIER_FULL_C } from "./tier-full-c";
import { TIER_CORE } from "./tier-core";

/** Locale dictionaries covering the app chrome (nav, buttons, page copy). */
const CHROME: Record<string, Dict> = {
  en,
  ...TIER_FULL_A,
  ...TIER_FULL_B,
  ...TIER_FULL_C,
  ...TIER_CORE,
};

/**
 * Content dictionaries: the worked example on the home page and the subject
 * taglines/blurbs, which otherwise live as English data in `subjects.ts` and
 * `Home.tsx`. They are layered over the chrome so a locale can supply either
 * one independently.
 */
const CONTENT: Record<string, Dict>[] = [
  SUBJECT_COPY,
  SUBJECT_COPY_C,
  SUBJECT_COPY_CORE,
  SUBJECT_COPY_CORE_BLURBS,
];

/**
 * Every locale dictionary keyed by language code. `en` is complete; other
 * locales are partial and fall back to English for missing keys — including
 * content keys, whose English source is passed to `tOr()` at the call site.
 */
export const TRANSLATIONS: Record<string, Dict> = (() => {
  const merged: Record<string, Dict> = {};
  for (const [code, dict] of Object.entries(CHROME)) {
    merged[code] = { ...dict };
  }
  for (const content of CONTENT) {
    for (const [code, dict] of Object.entries(content)) {
      merged[code] = { ...(merged[code] ?? {}), ...dict };
    }
  }
  return merged;
})();
