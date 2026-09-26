/**
 * NovaTools tool engine — shared types.
 *
 * Every tool on the site is a data definition, not a bespoke page. Three kinds
 * cover the whole catalogue:
 *
 *  - `calc`      fields + a pure solve() that returns an answer, working steps,
 *                optional tables and an optional plot. This is where the maths lives.
 *  - `explorer`  a list of topics with original written content, for reference
 *                and guide tools (formula sheets, theory guides, protocols).
 *  - `diagram`   an original SVG schematic plus labelled parts and a quiz, for
 *                the biology labelling tools.
 *
 * Because they are pure data + pure functions, the same shell renders all of
 * them and every one shows its working.
 */

export type Values = Record<string, string>;

export type FieldOption = { value: string; label: string };

export type Field = {
  id: string;
  label: string;
  type: "number" | "text" | "select";
  placeholder?: string;
  /** Unit shown alongside the label, e.g. "m/s" */
  unit?: string;
  hint?: string;
  options?: FieldOption[];
  defaultValue?: string;
};

export type WorkStep = {
  /** Short title, e.g. "Rearrange for I" */
  title: string;
  /** The calculation itself, shown in the mono font. */
  math?: string;
  /** Plain-English explanation of the step. */
  detail?: string;
};

export type ResultTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type ChartSeries = {
  label?: string;
  points: { x: number; y: number }[];
  /** Optional second series drawn in the subject accent. */
  highlight?: boolean;
};

export type Chart = {
  xLabel: string;
  yLabel: string;
  series: ChartSeries[];
};

export type ToolOutput = {
  answerLabel?: string;
  /** The headline answer, displayed in mono. */
  answer: string;
  /** Extra answer lines, e.g. both roots. */
  extras?: string[];
  steps: WorkStep[];
  tables?: ResultTable[];
  chart?: Chart;
  note?: string;
};

export type SolveOutcome =
  | { ok: true; output: ToolOutput }
  | { ok: false; error: string };

export type CalcTool = {
  kind: "calc";
  name: string;
  summary: string;
  /** Shown in the formula strip and offered via copy-to-clipboard. */
  formula?: string;
  fields: Field[];
  solve: (values: Values) => SolveOutcome;
};

/* ------------------------------------------------------------------ */
/* Original SVG diagrams, declared as plain shapes                     */
/* ------------------------------------------------------------------ */

export type Shape =
  | {
      t: "circle";
      cx: number;
      cy: number;
      r: number;
      fill?: string;
      stroke?: string;
      width?: number;
    }
  | {
      t: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      fill?: string;
      stroke?: string;
      width?: number;
    }
  | {
      t: "path";
      d: string;
      fill?: string;
      stroke?: string;
      width?: number;
    }
  | {
      t: "text";
      x: number;
      y: number;
      s: string;
      size?: number;
      anchor?: "start" | "middle" | "end";
    };

export type Drawing = {
  viewBox: string;
  shapes: Shape[];
};

/** A labelled part of a diagram, positioned 0–100 across the drawing. */
export type DiagramPart = {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
};

export type DiagramTool = {
  kind: "diagram";
  name: string;
  summary: string;
  drawing: Drawing;
  parts: DiagramPart[];
};

export type ExplorerTopic = {
  id: string;
  name: string;
  summary: string;
  points?: string[];
  /** Lines rendered in the mono font — formulas, equations, code. */
  mono?: string[];
  table?: ResultTable;
  drawing?: Drawing;
  /** When true the explorer shows a term/definition flashcard trainer instead. */
  flashcards?: boolean;
};

export type ExplorerTool = {
  kind: "explorer";
  name: string;
  summary: string;
  topics: ExplorerTopic[];
};

export type ToolDefinition = CalcTool | ExplorerTool | DiagramTool;
