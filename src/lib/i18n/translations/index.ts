import type { Dict } from "../types";
import { en } from "./en";
import { TIER_FULL_A } from "./tier-full-a";
import { TIER_FULL_B } from "./tier-full-b";
import { TIER_FULL_C } from "./tier-full-c";
import { TIER_CORE } from "./tier-core";

/**
 * Every locale dictionary keyed by language code. `en` is complete; other
 * locales are partial and fall back to English for missing keys.
 */
export const TRANSLATIONS: Record<string, Dict> = {
  en,
  ...TIER_FULL_A,
  ...TIER_FULL_B,
  ...TIER_FULL_C,
  ...TIER_CORE,
};
