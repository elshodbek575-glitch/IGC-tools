import type { ResultTable } from "./types";

export type GenQuestion = { prompt: string; answer: string; working?: string };

/** A named set of question generators, one per topic. */
export type QuestionBank = Record<
  string,
  (rng: () => number) => GenQuestion
>;

export const MIN_QUESTIONS = 4;
export const MAX_QUESTIONS = 20;

export function buildPaper(
  bank: QuestionBank,
  topicKey: string,
  count: number,
  rng: () => number,
): GenQuestion[] {
  const generate = bank[topicKey];
  if (!generate) return [];
  const questions: GenQuestion[] = [];
  for (let index = 0; index < count; index += 1) {
    questions.push(generate(rng));
  }
  return questions;
}

/** Questions in one table, answers and working in a second. */
export function paperTables(
  questions: GenQuestion[],
  label: string,
): ResultTable[] {
  return [
    {
      caption: `${label} — questions`,
      headers: ["#", "Question"],
      rows: questions.map((question, index) => [
        String(index + 1),
        question.prompt,
      ]),
    },
    {
      caption: "Answer key (with working)",
      headers: ["#", "Answer", "Working"],
      rows: questions.map((question, index) => [
        String(index + 1),
        question.answer,
        question.working ?? "—",
      ]),
    },
  ];
}

export function countField(defaultValue: string) {
  return {
    id: "count",
    label: "Number of questions",
    type: "number" as const,
    defaultValue,
    hint: `Between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}.`,
  };
}

export function seedField(defaultValue = "1") {
  return {
    id: "seed",
    label: "Paper seed",
    type: "number" as const,
    defaultValue,
    hint: "Change the seed for a fresh paper on the same topic.",
  };
}

/** Clamp the requested question count into the supported range. */
export function clampCount(value: number): number {
  if (!Number.isFinite(value)) return MIN_QUESTIONS;
  return Math.max(MIN_QUESTIONS, Math.min(MAX_QUESTIONS, Math.round(value)));
}
