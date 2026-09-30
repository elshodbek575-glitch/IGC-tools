import {
  fail,
  fmt,
  mulberry32,
  pick,
  randInt,
  str,
} from "./helpers";
import type {
  CalcTool,
  ExplorerTool,
  SolveOutcome,
  ToolDefinition,
  Values,
  WorkStep,
} from "./types";
import {
  buildPaper,
  clampCount,
  countField,
  paperTables,
  seedField,
  type QuestionBank,
} from "./worksheet";

function requireNumbers(
  entries: { label: string; value: number }[],
): string | null {
  for (const entry of entries) {
    if (!Number.isFinite(entry.value)) {
      return `${entry.label} needs to be a number.`;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* 1. Binary · Hex · Denary Converter                                  */
/* ------------------------------------------------------------------ */

const BASE_PATTERN: Record<string, RegExp> = {
  denary: /^-?\d+$/,
  binary: /^-?[01]+$/,
  hexadecimal: /^-?[0-9a-f]+$/i,
};

const baseConverter: CalcTool = {
  kind: "calc",
  name: "Binary · Hex · Denary Converter",
  summary: "Convert between binary, denary and hexadecimal, showing each step.",
  formula: "binary 0/1 · denary 0–9 · hexadecimal 0–F",
  fields: [
    {
      id: "from",
      label: "Input base",
      type: "select",
      defaultValue: "denary",
      options: [
        { value: "denary", label: "Denary (base 10)" },
        { value: "binary", label: "Binary (base 2)" },
        { value: "hexadecimal", label: "Hexadecimal (base 16)" },
      ],
    },
    { id: "value", label: "Value", type: "text", defaultValue: "202" },
  ],
  solve(values: Values): SolveOutcome {
    const from = str(values, "from");
    const raw = str(values, "value").replace(/[\s,_]/g, "");
    if (!raw) return fail("Enter a value to convert.");
    const pattern = BASE_PATTERN[from] ?? BASE_PATTERN.denary;
    if (!pattern.test(raw)) {
      return fail(`That is not a valid ${from} value.`);
    }
    const base = from === "binary" ? 2 : from === "hexadecimal" ? 16 : 10;
    const denary = parseInt(raw, base);
    if (!Number.isFinite(denary)) return fail("That value could not be read.");
    if (denary < 0) return fail("Only non-negative values are supported.");

    const binary = denary.toString(2);
    const hex = denary.toString(16).toUpperCase();
    const octal = denary.toString(8);

    const steps: WorkStep[] = [];
    if (from === "denary") {
      steps.push({
        title: "Split the denary number into place values",
        math: `${raw} = ${[...binary]
          .map((bit, index) => `${bit}×2^${binary.length - 1 - index}`)
          .join(" + ")}`,
      });
    } else {
      const sourceBase = from === "binary" ? 2 : 16;
      steps.push({
        title: "Expand the number into powers of its base",
        math: `${raw.toUpperCase()} = ${[...raw]
          .map(
            (digit, index) =>
              `${parseInt(digit, 16)}×${sourceBase}^${raw.length - 1 - index}`,
          )
          .join(" + ")}`,
      });
      steps.push({ title: "Evaluate", math: `= ${denary} in denary` });
    }
    steps.push({
      title: "Convert the denary value to base 2 by repeated division",
      math: `${denary} ÷ 2 = ${Math.floor(denary / 2)} remainder ${
        denary % 2
      }, reading the remainders up = ${binary}`,
    });
    steps.push({
      title: "Group bits in fours for hexadecimal",
      math: binary.padStart(Math.ceil(binary.length / 4) * 4, "0").replace(/(.{4})/g, "$1 ").trim(),
    });
    steps.push({ title: "Result", math: `${denary} = ${binary}₂ = 0x${hex}` });

    return {
      ok: true,
      output: {
        answer: `${binary}₂ · ${hex}₁₆ · ${denary}₁₀`,
        answerLabel: "Conversions",
        extras: [`octal: ${octal}₈`, `bits needed: ${binary.length}`],
        steps,
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. Binary Arithmetic                                                */
/* ------------------------------------------------------------------ */

const binaryArithmetic: CalcTool = {
  kind: "calc",
  name: "Binary Arithmetic",
  summary: "Add, subtract and shift binary numbers, with the carry shown.",
  formula: "1 + 1 = 10₂ (carry 1)",
  fields: [
    {
      id: "op",
      label: "Operation",
      type: "select",
      defaultValue: "add",
      options: [
        { value: "add", label: "Add" },
        { value: "subtract", label: "Subtract (a − b)" },
        { value: "shift-left", label: "Shift left (×2)" },
        { value: "shift-right", label: "Shift right (÷2)" },
      ],
    },
    { id: "a", label: "First binary number", type: "text", defaultValue: "1011" },
    { id: "b", label: "Second binary number", type: "text", defaultValue: "0110" },
  ],
  solve(values: Values): SolveOutcome {
    const op = str(values, "op");
    const aRaw = str(values, "a").replace(/[^01]/g, "");
    const bRaw = str(values, "b").replace(/[^01]/g, "");
    if (!aRaw) return fail("Enter the first binary number using only 0s and 1s.");
    const a = parseInt(aRaw, 2);
    if (!Number.isFinite(a)) return fail("The first value must be binary.");
    const width = Math.max(aRaw.length, op === "add" || op === "subtract" ? 8 : aRaw.length);
    const steps: WorkStep[] = [];

    let result: number;
    if (op === "add" || op === "subtract") {
      if (!bRaw) return fail("Enter the second binary number.");
      const b = parseInt(bRaw, 2);
      if (!Number.isFinite(b)) return fail("The second value must be binary.");
      result = op === "add" ? a + b : a - b;
      if (result < 0) {
        return fail("Subtraction would give a negative result — IGCSE binary works with unsigned values.");
      }
      steps.push({
        title: op === "add" ? "Line the numbers up and add bit by bit" : "Subtract bit by bit, borrowing when needed",
        math: `${aRaw.padStart(width, "0")}${op === "add" ? " + " : " − "}${bRaw.padStart(width, "0")} = ${result.toString(2).padStart(width, "0")}`,
      });
      steps.push({
        title: "Check in denary",
        math: `${a} ${op === "add" ? "+" : "−"} ${b} = ${result}`,
      });
    } else {
      const left = op === "shift-left";
      result = left ? a * 2 : Math.floor(a / 2);
      steps.push({
        title: left ? "Shifting left multiplies by 2" : "Shifting right divides by 2 (integer)",
        math: `${aRaw} → ${result.toString(2)}`,
      });
      steps.push({ title: "Check in denary", math: `${a} ${left ? "× 2" : "÷ 2"} = ${result}` });
    }

    steps.push({
      title: "Result",
      math: `${result.toString(2)}₂ = ${result}₁₀`,
    });

    return {
      ok: true,
      output: {
        answer: `${result.toString(2)}₂`,
        answerLabel: "Binary result",
        extras: [`denary: ${result}`, `hex: ${result.toString(16).toUpperCase()}`],
        steps,
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. Data Unit Converter                                              */
/* ------------------------------------------------------------------ */

const UNIT_BYTES: Record<string, number> = {
  bit: 1 / 8,
  nibble: 0.5,
  byte: 1,
  KiB: 1024,
  MiB: 1024 * 1024,
  GiB: 1024 * 1024 * 1024,
  KB: 1000,
  MB: 1000 * 1000,
  GB: 1000 * 1000 * 1000,
};

const dataUnitConverter: CalcTool = {
  kind: "calc",
  name: "Data Unit Converter",
  summary: "Convert between bits, bytes, KiB/MiB/GiB and KB/MB/GB.",
  formula: "1 byte = 8 bits · 1 KiB = 1024 bytes · 1 KB = 1000 bytes",
  fields: [
    { id: "value", label: "Value", type: "number", defaultValue: "2" },
    {
      id: "from",
      label: "From unit",
      type: "select",
      defaultValue: "MiB",
      options: Object.keys(UNIT_BYTES).map((unit) => ({ value: unit, label: unit })),
    },
    {
      id: "to",
      label: "To unit",
      type: "select",
      defaultValue: "KiB",
      options: Object.keys(UNIT_BYTES).map((unit) => ({ value: unit, label: unit })),
    },
  ],
  solve(values: Values): SolveOutcome {
    const value = Number(str(values, "value"));
    const from = str(values, "from");
    const to = str(values, "to");
    const error = requireNumbers([{ label: "Value", value }]);
    if (error) return fail(error);
    const fromBytes = value * (UNIT_BYTES[from] ?? 1);
    const result = fromBytes / (UNIT_BYTES[to] ?? 1);
    return {
      ok: true,
      output: {
        answer: `${fmt(result, 6)} ${to}`,
        answerLabel: "Converted",
        extras: [`= ${fmt(fromBytes, 6)} bytes`],
        steps: [
          { title: "Convert the input to bytes", math: `${fmt(value)} ${from} = ${fmt(fromBytes, 6)} bytes` },
          { title: `Divide by the size of one ${to}`, math: `${fmt(fromBytes, 6)} ÷ ${fmt(UNIT_BYTES[to] ?? 1)} = ${fmt(result, 6)} ${to}` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. Logic Gate Simulator                                             */
/* ------------------------------------------------------------------ */

function gate(gateName: string, a: number, b: number): boolean {
  switch (gateName) {
    case "AND":
      return a === 1 && b === 1;
    case "OR":
      return a === 1 || b === 1;
    case "NAND":
      return !(a === 1 && b === 1);
    case "NOR":
      return !(a === 1 || b === 1);
    case "XOR":
      return (a === 1) !== (b === 1);
    case "NOT":
      return a === 0;
    default:
      return false;
  }
}

const logicGate: CalcTool = {
  kind: "calc",
  name: "Logic Gate Simulator",
  summary: "Feed inputs through a gate and see the output and truth table row.",
  formula: "AND · OR · NOT · NAND · NOR · XOR",
  fields: [
    {
      id: "gate",
      label: "Gate",
      type: "select",
      defaultValue: "AND",
      options: ["AND", "OR", "NOT", "NAND", "NOR", "XOR"].map((g) => ({ value: g, label: g })),
    },
    {
      id: "a",
      label: "Input A",
      type: "select",
      defaultValue: "1",
      options: [
        { value: "1", label: "1 (high)" },
        { value: "0", label: "0 (low)" },
      ],
    },
    {
      id: "b",
      label: "Input B",
      type: "select",
      defaultValue: "0",
      options: [
        { value: "1", label: "1 (high)" },
        { value: "0", label: "0 (low)" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const gateName = str(values, "gate");
    const a = Number(str(values, "a") === "1" ? 1 : 0);
    const b = Number(str(values, "b") === "1" ? 1 : 0);
    const output = gate(gateName, a, b) ? 1 : 0;
    const rows: string[][] = [];
    const single = gateName === "NOT";
    const combos = single
      ? [[0, 0], [1, 0]]
      : [[0, 0], [0, 1], [1, 0], [1, 1]];
    for (const [ra, rb] of combos) {
      rows.push([
        String(ra),
        ...(single ? [] : [String(rb)]),
        String(gate(gateName, ra, rb) ? 1 : 0),
      ]);
    }
    return {
      ok: true,
      output: {
        answer: `Q = ${output}`,
        answerLabel: `${gateName} gate output`,
        extras: [`inputs: A = ${a}${single ? "" : `, B = ${b}`}`],
        steps: [
          {
            title: "Substitute the inputs into the gate",
            math: single
              ? `NOT A = NOT ${a} = ${output}`
              : `${a} ${gateName} ${b} = ${output}`,
          },
          {
            title: "Read it off the truth table",
            math: `the highlighted row is A = ${a}${single ? "" : `, B = ${b}`} → Q = ${output}`,
          },
        ],
        tables: [
          {
            caption: `${gateName} truth table`,
            headers: single ? ["A", "Q"] : ["A", "B", "Q"],
            rows,
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. Truth Table Generator                                            */
/* ------------------------------------------------------------------ */

type Token = { type: "var" | "op" | "lparen" | "rparen"; value: string };

function tokenise(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  const source = expression;
  // A keyword only counts when a non-letter follows it, so "AND" is matched
  // as an operator while an adjacent variable (e.g. "AANDB" typo) is not.
  const matchWord = (word: string) => {
    const slice = source.slice(index, index + word.length);
    if (slice.toUpperCase() !== word) return false;
    const next = source[index + word.length] ?? "";
    return !/[A-Za-z]/.test(next);
  };
  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index += 1;
    } else if (matchWord("AND")) {
      tokens.push({ type: "op", value: "AND" });
      index += 3;
    } else if (matchWord("XOR")) {
      tokens.push({ type: "op", value: "XOR" });
      index += 3;
    } else if (matchWord("NOT")) {
      tokens.push({ type: "op", value: "NOT" });
      index += 3;
    } else if (matchWord("OR")) {
      tokens.push({ type: "op", value: "OR" });
      index += 2;
    } else if (/[A-Da-d]/.test(char)) {
      tokens.push({ type: "var", value: char.toUpperCase() });
      index += 1;
    } else if (char === "(") {
      tokens.push({ type: "lparen", value: char });
      index += 1;
    } else if (char === ")") {
      tokens.push({ type: "rparen", value: char });
      index += 1;
    } else if (char === "&" || char === "*" || char === "·") {
      tokens.push({ type: "op", value: "AND" });
      index += 1;
    } else if (char === "+" || char === "|") {
      tokens.push({ type: "op", value: "OR" });
      index += 1;
    } else if (char === "^") {
      tokens.push({ type: "op", value: "XOR" });
      index += 1;
    } else if (char === "!" || char === "~" || char === "¬") {
      tokens.push({ type: "op", value: "NOT" });
      index += 1;
    } else if (char === "0" || char === "1") {
      tokens.push({ type: "var", value: char });
      index += 1;
    } else {
      throw new Error(`Unexpected character "${char}".`);
    }
  }
  return tokens;
}

function evaluateTokens(tokens: Token[], assignment: Record<string, boolean>): boolean {
  let position = 0;
  const peek = () => tokens[position];
  const eat = () => tokens[position++];

  const parseAtom = (): boolean => {
    const token = peek();
    if (!token) throw new Error("The expression ended early.");
    if (token.type === "lparen") {
      eat();
      const value = parseOr();
      if (peek()?.type !== "rparen") throw new Error("A bracket was never closed.");
      eat();
      return value;
    }
    if (token.type === "op" && token.value === "NOT") {
      eat();
      return !parseAtom();
    }
    if (token.type === "var") {
      eat();
      if (token.value === "0") return false;
      if (token.value === "1") return true;
      if (!(token.value in assignment)) throw new Error(`Unknown variable ${token.value}.`);
      return assignment[token.value];
    }
    throw new Error("Unexpected symbol in the expression.");
  };

  const parseAnd = (): boolean => {
    let value = parseAtom();
    while (peek()?.type === "op" && peek().value === "AND") {
      eat();
      // Evaluate both sides explicitly: && would short-circuit and skip
      // consuming the right-hand operand from the token stream.
      const right = parseAtom();
      value = value && right;
    }
    return value;
  };

  const parseXor = (): boolean => {
    let value = parseAnd();
    while (peek()?.type === "op" && peek().value === "XOR") {
      eat();
      const right = parseAnd();
      value = value !== right;
    }
    return value;
  };

  const parseOr = (): boolean => {
    let value = parseXor();
    while (peek()?.type === "op" && peek().value === "OR") {
      eat();
      const right = parseXor();
      value = value || right;
    }
    return value;
  };

  const result = parseOr();
  if (position !== tokens.length) throw new Error("Part of the expression could not be read.");
  return result;
}

const truthTable: CalcTool = {
  kind: "calc",
  name: "Truth Table Generator",
  summary: "Build a full truth table from a Boolean expression using A–D.",
  formula: "Q = (A AND B) OR (NOT C)",
  fields: [
    {
      id: "expression",
      label: "Boolean expression",
      type: "text",
      defaultValue: "(A AND B) OR (NOT C)",
      hint: "Use A–D, AND, OR, NOT, XOR, and brackets.",
    },
  ],
  solve(values: Values): SolveOutcome {
    const expression = str(values, "expression");
    if (!expression) return fail("Enter a Boolean expression.");
    let tokens: Token[];
    try {
      tokens = tokenise(expression);
    } catch (err) {
      return fail((err as Error).message);
    }
    const variables = [...new Set(tokens.filter((t) => t.type === "var" && /[A-D]/.test(t.value)).map((t) => t.value))].sort();
    if (!variables.length) return fail("Use at least one variable from A to D.");

    const rows: string[][] = [];
    const total = 2 ** variables.length;
    for (let row = 0; row < total; row += 1) {
      const assignment: Record<string, boolean> = {};
      variables.forEach((name, column) => {
        assignment[name] = Boolean(row & (1 << (variables.length - 1 - column)));
      });
      let value: boolean;
      try {
        value = evaluateTokens(tokens, assignment);
      } catch (err) {
        return fail((err as Error).message);
      }
      rows.push([...variables.map((name) => (assignment[name] ? "1" : "0")), value ? "1" : "0"]);
    }

    const trueRows = rows.filter((row) => row[row.length - 1] === "1").length;
    return {
      ok: true,
      output: {
        answer: `Q = ${expression}`,
        answerLabel: "Expression",
        extras: [`true in ${trueRows} of ${total} rows`],
        steps: [
          { title: "Identify the input variables", math: variables.join(", ") },
          { title: "Work out the number of rows", math: `2^${variables.length} = ${total} rows` },
          { title: "Evaluate the expression for every combination", math: `the final column Q holds the results` },
        ],
        tables: [
          {
            caption: "Truth table",
            headers: [...variables, "Q"],
            rows,
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. Boolean Expression Simplifier                                    */
/* ------------------------------------------------------------------ */

const booleanSimplifier: ExplorerTool = {
  kind: "explorer",
  name: "Boolean Expression Simplifier",
  summary: "Apply the laws of Boolean algebra one step at a time.",
  topics: [
    {
      id: "laws",
      name: "The laws of Boolean algebra",
      summary: "Each law is a rule you can apply to rewrite an expression.",
      table: {
        caption: "Boolean laws",
        headers: ["Law", "AND form", "OR form"],
        rows: [
          ["Identity", "A · 1 = A", "A + 0 = A"],
          ["Null (annihilator)", "A · 0 = 0", "A + 1 = 1"],
          ["Idempotent", "A · A = A", "A + A = A"],
          ["Complement", "A · ¬A = 0", "A + ¬A = 1"],
          ["Double negation", "¬(¬A) = A", "—"],
          ["Commutative", "A · B = B · A", "A + B = B + A"],
          ["Associative", "A · (B · C) = (A · B) · C", "A + (B + C) = (A + B) + C"],
          ["Distributive", "A · (B + C) = A·B + A·C", "A + (B·C) = (A+B)·(A+C)"],
          ["Absorption", "A · (A + B) = A", "A + (A·B) = A"],
          ["De Morgan", "¬(A · B) = ¬A + ¬B", "¬(A + B) = ¬A · ¬B"],
        ],
      },
    },
    {
      id: "worked",
      name: "Worked simplification",
      summary: "A full simplification of Q = A·B + A·¬B.",
      mono: [
        "Q = A·B + A·¬B",
        "  = A·(B + ¬B)   (distributive)",
        "  = A·1          (complement)",
        "  = A            (identity)",
      ],
      points: [
        "Factor out the common term first.",
        "Spot complement pairs such as B + ¬B, which is always 1.",
        "Finish with an identity to remove the 1.",
      ],
    },
    {
      id: "demorgan",
      name: "De Morgan in practice",
      summary: "De Morgan lets you push a NOT through a bracket.",
      mono: [
        "¬(A · B) = ¬A + ¬B",
        "¬(A + B) = ¬A · ¬B",
      ],
      points: [
        "Flip the operator AND ↔ OR.",
        "Negate each input.",
        "De Morgan is the key to building NAND-only or NOR-only circuits.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 7. Pseudocode → Flowchart                                           */
/* ------------------------------------------------------------------ */

const pseudocodeToFlowchart: ExplorerTool = {
  kind: "explorer",
  name: "Pseudocode → Flowchart",
  summary: "Turn structured pseudocode into the flowchart shapes an examiner expects.",
  topics: [
    {
      id: "shapes",
      name: "Which shape means what",
      summary: "Cambridge and Edexcel use the same set of standard flowchart symbols.",
      table: {
        caption: "Flowchart symbols",
        headers: ["Symbol", "Meaning", "Pseudocode"],
        rows: [
          ["Oval / rounded box", "Start or stop", "START / END"],
          ["Parallelogram", "Input or output", "INPUT / OUTPUT / PRINT"],
          ["Rectangle", "Process", "assignment, calculation"],
          ["Diamond", "Decision (yes/no)", "IF / WHILE / FOR"],
          ["Rectangle with bars", "Subprogram", "PROCEDURE / FUNCTION"],
          ["Circle / connector", "Join back to another part", "loops"],
        ],
      },
    },
    {
      id: "example",
      name: "Worked example",
      summary: "Psuedocode that adds the numbers 1 to 5.",
      mono: [
        "total ← 0",
        "FOR i ← 1 TO 5",
        "    total ← total + i",
        "NEXT i",
        "OUTPUT total",
      ],
      points: [
        "The oval START leads into the rectangle total ← 0.",
        "A FOR loop is drawn as a decision diamond that exits when i > 5.",
        "The parallelogram OUTPUT ends the flow before the STOP oval.",
      ],
    },
    {
      id: "rules",
      name: "Rules that earn marks",
      summary: "Small habits that keep the diagram readable and correct.",
      points: [
        "Exactly one START and one STOP.",
        "Every arrow has a direction; do not leave dead ends.",
        "Label decision branches “yes” and “no” — marks are often tied to them.",
        "Keep process boxes for calculations, not comparisons.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 8. Flowchart → Pseudocode                                           */
/* ------------------------------------------------------------------ */

const flowchartToPseudocode: ExplorerTool = {
  kind: "explorer",
  name: "Flowchart → Pseudocode",
  summary: "Read a flowchart and write the equivalent structured pseudocode.",
  topics: [
    {
      id: "reading",
      name: "Reading a flowchart",
      summary: "Trace the flow from START and translate each shape in turn.",
      points: [
        "Follow the arrows in order from the START oval.",
        "A parallelogram becomes INPUT or OUTPUT.",
        "A rectangle becomes an assignment statement.",
        "A diamond becomes an IF (once) or a WHILE (repeatedly).",
      ],
    },
    {
      id: "loops",
      name: "Recognising loops",
      summary: "When an arrow jumps backwards, you have a loop.",
      mono: [
        "count ← 0",
        "WHILE count < 10",
        "    count ← count + 1",
        "ENDWHILE",
      ],
      points: [
        "A backward arrow from below a diamond re-tests the condition.",
        "Decide whether the condition is tested before (WHILE) or after (REPEAT).",
      ],
    },
    {
      id: "worked",
      name: "Worked translation",
      summary: "The classic 'largest of two numbers' flowchart.",
      mono: [
        "INPUT a",
        "INPUT b",
        "IF a > b THEN",
        "    OUTPUT a",
        "ELSE",
        "    OUTPUT b",
        "ENDIF",
      ],
      points: [
        "The single diamond tests a > b.",
        "Each branch is a process or output box.",
        "Both branches join back before STOP.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 9. Big-O Explainer                                                  */
/* ------------------------------------------------------------------ */

const bigO: ExplorerTool = {
  kind: "explorer",
  name: "Big-O Explainer",
  summary: "Compare algorithm complexity and see how work grows with input size.",
  topics: [
    {
      id: "orders",
      name: "Common orders of growth",
      summary: "From fastest to slowest as n grows.",
      table: {
        caption: "Time complexity",
        headers: ["Big-O", "Name", "Example algorithm"],
        rows: [
          ["O(1)", "Constant", "Looking up an array element by index"],
          ["O(log n)", "Logarithmic", "Binary search"],
          ["O(n)", "Linear", "Linear search, a single loop"],
          ["O(n log n)", "Linearithmic", "Merge sort, quick sort (average)"],
          ["O(n²)", "Quadratic", "Bubble sort, nested loops"],
          ["O(2ⁿ)", "Exponential", "Brute-force subset search"],
        ],
      },
    },
    {
      id: "nested",
      name: "Spotting nested loops",
      summary: "The number of nested loops gives a quick first guess at the order.",
      points: [
        "One loop over n items → likely O(n).",
        "A loop inside a loop → likely O(n²).",
        "Halving the problem each time (n → n/2) → O(log n).",
        "Divide-and-conquer like merge sort → O(n log n).",
      ],
    },
    {
      id: "table",
      name: "How the counts grow",
      summary: "Same input sizes, very different amounts of work.",
      table: {
        caption: "Operations for different orders",
        headers: ["n", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
        rows: [
          ["10", "≈ 3", "10", "≈ 33", "100"],
          ["100", "≈ 7", "100", "≈ 664", "10 000"],
          ["1 000", "≈ 10", "1 000", "≈ 9 966", "1 000 000"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 10. Sorting Visualiser                                              */
/* ------------------------------------------------------------------ */

const sorting: ExplorerTool = {
  kind: "explorer",
  name: "Sorting Visualiser",
  summary: "Trace bubble, insertion and merge sort on the same list.",
  topics: [
    {
      id: "bubble",
      name: "Bubble sort",
      summary: "Repeatedly swap adjacent items that are out of order.",
      mono: [
        "[5, 3, 8, 1]",
        "compare 5,3 → swap → [3, 5, 8, 1]",
        "compare 5,8 → keep  → [3, 5, 8, 1]",
        "compare 8,1 → swap → [3, 5, 1, 8]",
        "…repeat until a pass makes no swaps",
      ],
      points: ["Simple to code but O(n²) — avoid for large lists."],
    },
    {
      id: "insertion",
      name: "Insertion sort",
      summary: "Build a sorted section one item at a time.",
      mono: [
        "[5 | 3, 8, 1]  sorted | unsorted",
        "insert 3 → [3, 5 | 8, 1]",
        "insert 8 → [3, 5, 8 | 1]",
        "insert 1 → [1, 3, 5, 8]",
      ],
      points: ["Efficient for small or nearly-sorted data."],
    },
    {
      id: "merge",
      name: "Merge sort",
      summary: "Divide the list in half, sort each half, then merge.",
      mono: [
        "[5, 3, 8, 1]",
        "split → [5,3] and [8,1]",
        "sort halves → [3,5] and [1,8]",
        "merge → [1, 3, 5, 8]",
      ],
      points: ["O(n log n) — much faster than bubble sort on large lists."],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 11. Searching Visualiser                                            */
/* ------------------------------------------------------------------ */

const searching: ExplorerTool = {
  kind: "explorer",
  name: "Searching Visualiser",
  summary: "Compare linear and binary search step by step.",
  topics: [
    {
      id: "linear",
      name: "Linear search",
      summary: "Check each item in turn until you find the target.",
      mono: [
        "list = [4, 8, 15, 16, 23, 42]",
        "target = 23",
        "4 ✗  8 ✗  15 ✗  16 ✗  23 ✓",
        "found at index 4 (0-based)",
      ],
      points: ["Works on any list, sorted or not.", "O(n) — slower on long lists."],
    },
    {
      id: "binary",
      name: "Binary search",
      summary: "Halve the search area each step — but only on a sorted list.",
      mono: [
        "sorted = [4, 8, 15, 16, 23, 42]",
        "target = 23",
        "middle 16 → too small, search right",
        "middle 42 → too big, search left",
        "middle 23 → found",
      ],
      points: ["Requires the list to be sorted first.", "O(log n) — very fast."],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 12. Image as Binary                                                 */
/* ------------------------------------------------------------------ */

const imageAsBinary: CalcTool = {
  kind: "calc",
  name: "Image as Binary",
  summary: "Work out how many bits a bitmap needs and see pixels as binary.",
  formula: "file size (bits) = width × height × colour depth",
  fields: [
    { id: "width", label: "Width (pixels)", type: "number", defaultValue: "800" },
    { id: "height", label: "Height (pixels)", type: "number", defaultValue: "600" },
    {
      id: "depth",
      label: "Colour depth (bits per pixel)",
      type: "select",
      defaultValue: "24",
      options: [
        { value: "1", label: "1 bit (black & white)" },
        { value: "4", label: "4 bits (16 colours)" },
        { value: "8", label: "8 bits (256 colours)" },
        { value: "24", label: "24 bits (true colour)" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const width = Number(str(values, "width"));
    const height = Number(str(values, "height"));
    const depth = Number(str(values, "depth"));
    const error = requireNumbers([
      { label: "Width", value: width },
      { label: "Height", value: height },
    ]);
    if (error) return fail(error);
    if (width <= 0 || height <= 0) return fail("Width and height must be positive.");
    const pixels = width * height;
    const bits = pixels * depth;
    const bytes = bits / 8;
    const kib = bytes / 1024;
    return {
      ok: true,
      output: {
        answer: `${fmt(kib, 2)} KiB`,
        answerLabel: "Uncompressed file size",
        extras: [`${fmt(bits, 0)} bits · ${fmt(bytes, 0)} bytes`, `${fmt(pixels, 0)} pixels`],
        steps: [
          { title: "Count the pixels", math: `${width} × ${height} = ${fmt(pixels, 0)} pixels` },
          { title: "Multiply by the colour depth", math: `${fmt(pixels, 0)} × ${depth} = ${fmt(bits, 0)} bits` },
          { title: "Convert bits to bytes", math: `${fmt(bits, 0)} ÷ 8 = ${fmt(bytes, 0)} bytes` },
          { title: "Convert bytes to KiB", math: `${fmt(bytes, 0)} ÷ 1024 = ${fmt(kib, 2)} KiB` },
        ],
        tables: [
          {
            caption: "How colours are stored at 24-bit depth",
            headers: ["Colour", "Red", "Green", "Blue", "Binary (R,G,B)"],
            rows: [
              ["Black", "0", "0", "0", "00000000 00000000 00000000"],
              ["Red", "255", "0", "0", "11111111 00000000 00000000"],
              ["White", "255", "255", "255", "11111111 11111111 11111111"],
            ],
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. Sound as Binary                                                 */
/* ------------------------------------------------------------------ */

const soundAsBinary: CalcTool = {
  kind: "calc",
  name: "Sound as Binary",
  summary: "Find the file size of sampled sound from its rate, depth and length.",
  formula: "bits = sample rate × bit depth × channels × seconds",
  fields: [
    { id: "rate", label: "Sample rate (Hz)", type: "number", defaultValue: "44100" },
    {
      id: "depth",
      label: "Bit depth",
      type: "select",
      defaultValue: "16",
      options: [
        { value: "8", label: "8 bits" },
        { value: "16", label: "16 bits" },
        { value: "24", label: "24 bits" },
      ],
    },
    {
      id: "channels",
      label: "Channels",
      type: "select",
      defaultValue: "2",
      options: [
        { value: "1", label: "Mono (1)" },
        { value: "2", label: "Stereo (2)" },
      ],
    },
    { id: "seconds", label: "Length (seconds)", type: "number", defaultValue: "10" },
  ],
  solve(values: Values): SolveOutcome {
    const rate = Number(str(values, "rate"));
    const depth = Number(str(values, "depth"));
    const channels = Number(str(values, "channels"));
    const seconds = Number(str(values, "seconds"));
    const error = requireNumbers([
      { label: "Sample rate", value: rate },
      { label: "Length", value: seconds },
    ]);
    if (error) return fail(error);
    if (rate <= 0 || seconds <= 0) return fail("Sample rate and length must be positive.");
    const samples = rate * seconds * channels;
    const bits = samples * depth;
    const bytes = bits / 8;
    const mib = bytes / (1024 * 1024);
    return {
      ok: true,
      output: {
        answer: `${fmt(mib, 2)} MiB`,
        answerLabel: "Uncompressed file size",
        extras: [`${fmt(bits, 0)} bits · ${fmt(bytes, 0)} bytes`, `${fmt(samples, 0)} samples`],
        steps: [
          { title: "Samples per second per channel", math: `${fmt(rate, 0)} Hz × ${channels} channels = ${fmt(rate * channels, 0)} samples/s` },
          { title: "Total samples", math: `${fmt(rate * channels, 0)} × ${seconds}s = ${fmt(samples, 0)}` },
          { title: "Multiply by the bit depth", math: `${fmt(samples, 0)} × ${depth} = ${fmt(bits, 0)} bits` },
          { title: "Convert to bytes then MiB", math: `${fmt(bits, 0)} ÷ 8 = ${fmt(bytes, 0)} bytes = ${fmt(mib, 2)} MiB` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. Compression Explainer                                           */
/* ------------------------------------------------------------------ */

const compression: ExplorerTool = {
  kind: "explorer",
  name: "Compression Explainer",
  summary: "Lossy vs lossless compression, with worked examples and trade-offs.",
  topics: [
    {
      id: "compare",
      name: "Lossy vs lossless",
      summary: "Both reduce file size, but only one lets you recover the original exactly.",
      table: {
        caption: "Comparison",
        headers: ["Feature", "Lossless", "Lossy"],
        rows: [
          ["Original recoverable?", "Yes, exactly", "No — data is discarded"],
          ["Typical saving", "Modest (often 20–60%)", "Large (often 80–95%)"],
          ["Good for", "Text, code, spreadsheets", "Photos, audio, video"],
          ["Examples", "ZIP, PNG, FLAC", "JPEG, MP3, MP4"],
        ],
      },
    },
    {
      id: "rle",
      name: "Run-length encoding",
      summary: "Lossless: store a value once, followed by how many times it repeats.",
      mono: [
        "AAAAABBBCC → 5A3B2C",
        "good for flat colour, poor for noisy photos",
      ],
      points: [
        "Encode each run as count + value.",
        "Works best when long runs of the same value appear.",
      ],
    },
    {
      id: "jpeg",
      name: "Lossy in practice: JPEG and MP3",
      summary: "Lossy formats throw away detail the eye or ear is unlikely to notice.",
      points: [
        "JPEG reduces colour detail more than brightness detail.",
        "MP3 removes sounds that are masked by louder ones.",
        "Re-saving a lossy file loses more quality each time.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 15. Trace Table Builder                                             */
/* ------------------------------------------------------------------ */

const traceTable: ExplorerTool = {
  kind: "explorer",
  name: "Trace Table Builder",
  summary: "Trace variables through a program, one line at a time.",
  topics: [
    {
      id: "example",
      name: "Worked trace",
      summary: "Tracing a simple loop that sums five numbers.",
      mono: [
        "total ← 0",
        "FOR i ← 1 TO 5",
        "    total ← total + i",
        "NEXT i",
      ],
      table: {
        caption: "Trace table",
        headers: ["Line", "i", "total"],
        rows: [
          ["1", "—", "0"],
          ["3", "1", "1"],
          ["3", "2", "3"],
          ["3", "3", "6"],
          ["3", "4", "10"],
          ["3", "5", "15"],
        ],
      },
    },
    {
      id: "how",
      name: "How to build one",
      summary: "A trace table has one column per variable, plus a line or output column.",
      points: [
        "Add a column for every variable and for OUTPUT.",
        "One row per iteration or per executed line.",
        "Record values before and after each assignment.",
        "The final row shows the output of the program.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 16. Number Base Practice                                            */
/* ------------------------------------------------------------------ */

const basePractice: CalcTool = {
  kind: "calc",
  name: "Number Base Practice",
  summary: "Generate conversion drills with instant answers for revision.",
  formula: "practice binary and hexadecimal conversions",
  fields: [
    {
      id: "topic",
      label: "Practice type",
      type: "select",
      defaultValue: "denary-binary",
      options: [
        { value: "denary-binary", label: "Denary → binary" },
        { value: "binary-denary", label: "Binary → denary" },
        { value: "denary-hex", label: "Denary → hexadecimal" },
        { value: "hex-denary", label: "Hexadecimal → denary" },
      ],
    },
    countField("8"),
    seedField("1"),
  ],
  solve(values: Values): SolveOutcome {
    const topic = str(values, "topic");
    const count = clampCount(Number(str(values, "count")));
    const seed = Number(str(values, "seed")) || 1;
    const rng = mulberry32(seed);
    const rows: string[][] = [];
    for (let index = 0; index < count; index += 1) {
      const n = randInt(rng, 1, 255);
      if (topic === "denary-binary") {
        rows.push([String(n), n.toString(2)]);
      } else if (topic === "binary-denary") {
        rows.push([n.toString(2), String(n)]);
      } else if (topic === "denary-hex") {
        rows.push([String(n), n.toString(16).toUpperCase()]);
      } else {
        rows.push([n.toString(16).toUpperCase(), String(n)]);
      }
    }
    const [promptHeader, answerHeader] =
      topic === "denary-binary"
        ? ["Denary", "Binary"]
        : topic === "binary-denary"
          ? ["Binary", "Denary"]
          : topic === "denary-hex"
            ? ["Denary", "Hex"]
            : ["Hex", "Denary"];
    return {
      ok: true,
      output: {
        answer: `${count} conversion drills`,
        answerLabel: "Practice paper",
        steps: [
          { title: "Work down the left column", math: `convert each ${promptHeader} value` },
          { title: "Check against the right column", math: "cover it up until you have tried each one" },
        ],
        tables: [
          {
            caption: "Questions",
            headers: ["#", promptHeader],
            rows: rows.map((row, index) => [String(index + 1), row[0]]),
          },
          {
            caption: "Answer key",
            headers: ["#", answerHeader],
            rows: rows.map((row, index) => [String(index + 1), row[1]]),
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. Networks & Protocols Guide                                      */
/* ------------------------------------------------------------------ */

const networks: ExplorerTool = {
  kind: "explorer",
  name: "Networks & Protocols Guide",
  summary: "Topologies, addressing and the protocols you need to name.",
  topics: [
    {
      id: "topologies",
      name: "Network topologies",
      summary: "How devices are arranged, and the trade-offs of each layout.",
      table: {
        caption: "Topologies",
        headers: ["Topology", "How it works", "Trade-off"],
        rows: [
          ["Star", "All devices connect to a central switch", "Fast, but the switch is a single point of failure"],
          ["Bus", "One shared backbone cable", "Cheap, but collisions and one break stops all"],
          ["Ring", "Each device links to two neighbours", "Predictable, but a break can halt the ring"],
          ["Mesh", "Devices link to many others", "Very resilient, but costly to wire"],
        ],
      },
    },
    {
      id: "addressing",
      name: "IP and MAC addressing",
      summary: "Two addresses do different jobs on a network.",
      table: {
        caption: "Addressing",
        headers: ["Address", "Assigned by", "Purpose"],
        rows: [
          ["MAC", "Manufacturer", "Physical, fixed address of the NIC"],
          ["IP", "Network / DHCP", "Logical address so packets can be routed"],
          ["Subnet mask", "Network admin", "Splits the IP into network and host parts"],
        ],
      },
    },
    {
      id: "protocols",
      name: "Protocols to know",
      summary: "A protocol is a set of rules for sending data.",
      table: {
        caption: "Common protocols",
        headers: ["Protocol", "Full name", "Use"],
        rows: [
          ["HTTP(S)", "HyperText Transfer Protocol (Secure)", "Web pages"],
          ["FTP", "File Transfer Protocol", "Moving files"],
          ["SMTP", "Simple Mail Transfer Protocol", "Sending email"],
          ["IMAP", "Internet Message Access Protocol", "Reading email on a server"],
          ["TCP", "Transmission Control Protocol", "Reliable, ordered delivery"],
          ["UDP", "User Datagram Protocol", "Fast, no guarantee (streaming)"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 18. Databases & SQL Trainer                                         */
/* ------------------------------------------------------------------ */

const databases: ExplorerTool = {
  kind: "explorer",
  name: "Databases & SQL Trainer",
  summary: "SELECT, WHERE, ORDER BY and joins, with example tables.",
  topics: [
    {
      id: "tables",
      name: "Example tables",
      summary: "Two related tables used by every query below.",
      table: {
        caption: "Students",
        headers: ["StudentID", "Name", "Year"],
        rows: [
          ["1", "Amara", "10"],
          ["2", "Ben", "11"],
          ["3", "Chen", "10"],
        ],
      },
    },
    {
      id: "select",
      name: "SELECT and WHERE",
      summary: "Choose columns, then filter the rows.",
      mono: [
        "SELECT Name, Year FROM Students;",
        "SELECT Name FROM Students WHERE Year = 10;",
      ],
      points: [
        "SELECT lists the columns to show.",
        "FROM names the table.",
        "WHERE filters the rows with a condition.",
      ],
    },
    {
      id: "order",
      name: "ORDER BY and aggregate functions",
      summary: "Sort results and summarise them.",
      mono: [
        "SELECT Name FROM Students ORDER BY Name DESC;",
        "SELECT COUNT(*) FROM Students;",
        "SELECT Year, COUNT(*) FROM Students GROUP BY Year;",
      ],
      points: [
        "ORDER BY sorts; ASC is ascending, DESC is descending.",
        "COUNT, SUM, AVG, MIN and MAX summarise data.",
        "GROUP BY groups rows sharing a value.",
      ],
    },
    {
      id: "joins",
      name: "Joining tables",
      summary: "Links rows that share a key.",
      mono: [
        "SELECT Students.Name, Results.Score",
        "FROM Students",
        "INNER JOIN Results ON Students.StudentID = Results.StudentID;",
      ],
      points: [
        "A primary key uniquely identifies a row.",
        "A foreign key in one table points at a primary key in another.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 19. Programming Concepts Reference                                  */
/* ------------------------------------------------------------------ */

const programming: ExplorerTool = {
  kind: "explorer",
  name: "Programming Concepts Reference",
  summary: "Data types, constructs, arrays and file handling at a glance.",
  topics: [
    {
      id: "types",
      name: "Data types",
      summary: "The core types used in IGCSE pseudocode and languages.",
      table: {
        caption: "Data types",
        headers: ["Type", "Holds", "Example"],
        rows: [
          ["INTEGER", "Whole numbers", "42"],
          ["REAL", "Decimals", "3.14"],
          ["BOOLEAN", "TRUE or FALSE", "TRUE"],
          ["CHAR", "A single character", "'A'"],
          ["STRING", "Text", "\"Hello\""],
          ["DATE", "Calendar date", "01/09/2026"],
        ],
      },
    },
    {
      id: "constructs",
      name: "Control constructs",
      summary: "Sequence, selection and iteration are the three structures.",
      mono: [
        "IF score >= 50 THEN",
        "    OUTPUT \"Pass\"",
        "ELSE",
        "    OUTPUT \"Fail\"",
        "ENDIF",
        "",
        "WHILE count < 10",
        "    count ← count + 1",
        "ENDWHILE",
      ],
    },
    {
      id: "arrays",
      name: "Arrays and records",
      summary: "Store many values under one name.",
      mono: [
        "DECLARE names : ARRAY[0:4] OF STRING",
        "names[0] ← \"Amara\"",
        "FOR i ← 0 TO 4",
        "    OUTPUT names[i]",
        "NEXT i",
      ],
      points: [
        "Arrays are indexed, usually from 0.",
        "Arrays are 1D or 2D (tables).",
        "A record groups fields of different types.",
      ],
    },
    {
      id: "files",
      name: "File handling",
      summary: "Reading and writing text files line by line.",
      mono: [
        "file = OPENFILE(\"data.txt\", \"READ\")",
        "WHILE NOT EOF(file)",
        "    line = READLINE(file)",
        "ENDWHILE",
        "CLOSEFILE(file)",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 20. Worksheet & Quiz Generator                                      */
/* ------------------------------------------------------------------ */

const BANK: QuestionBank = {
  binary: (rng) => {
    const n = randInt(rng, 1, 63);
    return {
      prompt: `Convert ${n} (denary) to 8-bit binary.`,
      answer: n.toString(2).padStart(8, "0"),
      working: `Divide ${n} repeatedly by 2 and read remainders upwards.`,
    };
  },
  hex: (rng) => {
    const n = randInt(rng, 16, 255);
    return {
      prompt: `Convert ${n} (denary) to hexadecimal.`,
      answer: n.toString(16).toUpperCase(),
      working: `${n} ÷ 16 = ${Math.floor(n / 16)} remainder ${n % 16} → read downwards.`,
    };
  },
  logic: (rng) => {
    const a = pick(rng, [0, 1]);
    const b = pick(rng, [0, 1]);
    const op = pick(rng, ["AND", "OR", "XOR"]);
    const value = op === "AND" ? a && b : op === "OR" ? a || b : Boolean(a) !== Boolean(b);
    return {
      prompt: `What is the output of the ${op} gate with inputs A = ${a} and B = ${b}?`,
      answer: value ? "1" : "0",
      working: `${op} truth table → A = ${a}, B = ${b} gives Q = ${value ? 1 : 0}.`,
    };
  },
  units: (rng) => {
    const kib = randInt(rng, 1, 64);
    return {
      prompt: `How many bytes are there in ${kib} KiB?`,
      answer: String(kib * 1024),
      working: `1 KiB = 1024 bytes, so ${kib} × 1024 = ${kib * 1024}.`,
    };
  },
};

const csWorksheet: CalcTool = {
  kind: "calc",
  name: "Worksheet & Quiz Generator",
  summary: "Generate a topic quiz with a full answer key and working.",
  formula: "binary · hex · logic · units",
  fields: [
    {
      id: "topic",
      label: "Topic",
      type: "select",
      defaultValue: "binary",
      options: [
        { value: "binary", label: "Denary → binary" },
        { value: "hex", label: "Denary → hexadecimal" },
        { value: "logic", label: "Logic gates" },
        { value: "units", label: "Data units" },
      ],
    },
    countField("10"),
    seedField("1"),
  ],
  solve(values: Values): SolveOutcome {
    const topic = str(values, "topic");
    const count = clampCount(Number(str(values, "count")));
    const seed = Number(str(values, "seed")) || 1;
    const questions = buildPaper(BANK, topic, count, mulberry32(seed));
    if (!questions.length) return fail("Pick a topic to generate questions.");
    return {
      ok: true,
      output: {
        answer: `${questions.length} questions`,
        answerLabel: "Worksheet",
        steps: [
          { title: "Answer every question first", math: "work down the questions table" },
          { title: "Mark using the key", math: "the working shows the method for each answer" },
        ],
        tables: paperTables(questions, "Computer Science"),
      },
    };
  },
};

export const CS_TOOLS: ToolDefinition[] = [
  baseConverter,
  binaryArithmetic,
  dataUnitConverter,
  logicGate,
  truthTable,
  booleanSimplifier,
  pseudocodeToFlowchart,
  flowchartToPseudocode,
  bigO,
  sorting,
  searching,
  imageAsBinary,
  soundAsBinary,
  compression,
  traceTable,
  basePractice,
  networks,
  databases,
  programming,
  csWorksheet,
];
