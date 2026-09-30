import {
  fail,
  fmt,
  gcd,
  mulberry32,
  num,
  parseNumbers,
  pick,
  randInt,
  sf,
  str,
  toFraction,
} from "./helpers";
import type { CalcTool, ExplorerTool, SolveOutcome, ToolDefinition, Values, WorkStep } from "./types";
import {
  buildPaper,
  clampCount,
  countField,
  paperTables,
  seedField,
  type QuestionBank,
} from "./worksheet";

/* ------------------------------------------------------------------ */
/* Shared maths helpers                                                */
/* ------------------------------------------------------------------ */

/** Write √n in the form a√b by pulling out the largest square factor. */
function simplifySurd(n: number): { a: number; b: number; squares: number[] } {
  let a = 1;
  let b = n;
  const squares: number[] = [];
  for (let i = 2; i * i <= n; i += 1) {
    if (n % (i * i) === 0) squares.push(i);
  }
  for (let i = Math.floor(Math.sqrt(n)); i >= 2; i -= 1) {
    if (n % (i * i) === 0) {
      a = i;
      b = n / (i * i);
      break;
    }
  }
  return { a, b, squares };
}

/** Format a surd in lowest terms, e.g. "3√5". */
function surdText(coefficient: number, radicand: number): string {
  if (radicand === 1) return String(coefficient);
  if (coefficient === 1) return `√${radicand}`;
  return `${coefficient}√${radicand}`;
}

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
/* 1. Surds & Indices Simplifier                                       */
/* ------------------------------------------------------------------ */

const surds: CalcTool = {
  kind: "calc",
  name: "Surds & Indices Simplifier",
  summary: "Simplify surds, rationalise denominators and apply the index laws.",
  formula: "√(a²b) = a√b  ·  aᵐ × aⁿ = aᵐ⁺ⁿ  ·  aᵐ ÷ aⁿ = aᵐ⁻ⁿ",
  fields: [
    {
      id: "mode",
      label: "What do you want to do?",
      type: "select",
      defaultValue: "simplify",
      options: [
        { value: "simplify", label: "Simplify a surd √n" },
        { value: "rationalise", label: "Rationalise k⁄√n" },
        { value: "indices", label: "Apply the index laws" },
      ],
    },
    { id: "n", label: "Surd √n / denominator √n", type: "number", defaultValue: "72" },
    { id: "k", label: "Numerator k", type: "number", defaultValue: "6" },
    { id: "base", label: "Base a", type: "number", defaultValue: "5" },
    { id: "m", label: "First index m", type: "number", defaultValue: "3" },
    { id: "o", label: "Second index n", type: "number", defaultValue: "4" },
    {
      id: "op",
      label: "Index operation",
      type: "select",
      defaultValue: "multiply",
      options: [
        { value: "multiply", label: "aᵐ × aⁿ" },
        { value: "divide", label: "aᵐ ÷ aⁿ" },
        { value: "power", label: "(aᵐ)ⁿ" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "indices") {
      const base = num(values, "base");
      const m = num(values, "m");
      const o = num(values, "o");
      const error = requireNumbers([
        { label: "Base a", value: base },
        { label: "First index m", value: m },
        { label: "Second index n", value: o },
      ]);
      if (error) return fail(error);

      const op = str(values, "op");
      if (op === "multiply") {
        return {
          ok: true,
          output: {
            answer: `${base}^${m + o} = ${fmt(Math.pow(base, m + o))}`,
            steps: [
              {
                title: "Same base — add the indices",
                math: `${base}^${m} × ${base}^${o} = ${base}^(${m} + ${o}) = ${base}^${m + o}`,
              },
              {
                title: "Evaluate",
                math: `${base}^${m + o} = ${fmt(Math.pow(base, m + o), 6)}`,
              },
            ],
          },
        };
      }
      if (op === "divide") {
        return {
          ok: true,
          output: {
            answer: `${base}^${m - o} = ${fmt(Math.pow(base, m - o))}`,
            steps: [
              {
                title: "Same base — subtract the indices",
                math: `${base}^${m} ÷ ${base}^${o} = ${base}^(${m} − ${o}) = ${base}^${m - o}`,
              },
              {
                title: "Evaluate",
                math: `${base}^${m - o} = ${fmt(Math.pow(base, m - o), 6)}`,
              },
            ],
          },
        };
      }
      return {
        ok: true,
        output: {
          answer: `${base}^${m * o} = ${fmt(Math.pow(base, m * o))}`,
          steps: [
            {
              title: "Power of a power — multiply the indices",
              math: `(${base}^${m})^${o} = ${base}^(${m} × ${o}) = ${base}^${m * o}`,
            },
            {
              title: "Evaluate",
              math: `${base}^${m * o} = ${fmt(Math.pow(base, m * o), 6)}`,
            },
          ],
        },
      };
    }

    const n = num(values, "n");
    if (!Number.isFinite(n) || n < 2 || !Number.isInteger(n)) {
      return fail("Enter a whole number of 2 or more under the root.");
    }

    if (mode === "rationalise") {
      const k = num(values, "k");
      if (!Number.isFinite(k) || k === 0) return fail("Enter a non-zero numerator k.");
      const { a, b } = simplifySurd(n);
      const numerator = k * a;
      const common = gcd(numerator, n);
      const top = numerator / common;
      const bottom = n / common;
      const topText = b === 1 ? String(top) : `${top}√${b}`;
      return {
        ok: true,
        output: {
          answer: bottom === 1 ? topText : `${topText} / ${bottom}`,
          steps: [
            {
              title: "Multiply top and bottom by √n",
              math: `${k}/√${n} × √${n}/√${n} = ${k}√${n} / ${n}`,
            },
            {
              title: "Simplify the surd in the numerator",
              math: `√${n} = ${surdText(a, b)}`,
            },
            {
              title: "Cancel common factors",
              math: `${k} × ${surdText(a, b)} = ${surdText(numerator, b)}; divide by ${common} → ${topText}${bottom === 1 ? "" : ` / ${bottom}`}`,
            },
            {
              title: "Check",
              detail:
                "The denominator is now a whole number, so the surd has been rationalised.",
            },
          ],
        },
      };
    }

    const { a, b, squares } = simplifySurd(n);
    return {
      ok: true,
      output: {
        answer: surdText(a, b),
        extras: [b === 1 ? `√${n} is a perfect square, so the answer is exact.` : `≈ ${fmt(Math.sqrt(n), 4)}`],          steps: [
            { title: `Square factors of ${n}`,
              math: squares.length ? squares.map((s) => `${s}² = ${s * s}`).join(", ") : "none",
            },

          {
            title: "Take out the largest square factor",
            math: `√${n} = √(${a * a} × ${b}) = √${a * a} × √${b}`,
          },
          {
            title: "Evaluate the root of the square",
            math: `= ${a} × √${b} = ${surdText(a, b)}`,
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. Standard Form Converter                                          */
/* ------------------------------------------------------------------ */

function toStandardForm(value: number): { mantissa: number; exponent: number } {
  if (value === 0) return { mantissa: 0, exponent: 0 };
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  let exponent = Math.floor(Math.log10(abs));
  let mantissa = abs / Math.pow(10, exponent);
  mantissa = Number(mantissa.toFixed(10));
  if (mantissa >= 10) {
    mantissa /= 10;
    exponent += 1;
  }
  if (mantissa < 1) {
    mantissa *= 10;
    exponent -= 1;
  }
  return { mantissa: Number((sign * mantissa).toFixed(10)), exponent };
}

const standardForm: CalcTool = {
  kind: "calc",
  name: "Standard Form Converter",
  summary: "Convert numbers to and from standard form, and multiply or divide in it.",
  formula: "A × 10ⁿ where 1 ≤ A < 10",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "convert",
      options: [
        { value: "convert", label: "Convert a number to standard form" },
        { value: "multiply", label: "Multiply two numbers in standard form" },
        { value: "divide", label: "Divide two numbers in standard form" },
      ],
    },
    {
      id: "value",
      label: "Number to convert",
      type: "number",
      defaultValue: "0.00042",
      hint: "Ordinary numbers or long decimals both work.",
    },
    { id: "a", label: "First mantissa A", type: "number", defaultValue: "3.2" },
    { id: "n", label: "First power n", type: "number", defaultValue: "5" },
    { id: "b", label: "Second mantissa B", type: "number", defaultValue: "4" },
    { id: "m", label: "Second power m", type: "number", defaultValue: "-2" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "convert") {
      const value = num(values, "value");
      if (!Number.isFinite(value)) return fail("Enter a number to convert.");
      if (value === 0) {
        return {
          ok: true,
          output: { answer: "0 = 0 × 10⁰", steps: [{ title: "Zero stays zero in standard form" }] },
        };
      }
      const { mantissa, exponent } = toStandardForm(value);
      const digits = Math.abs(exponent);
      return {
        ok: true,
        output: {
          answer: `${fmt(mantissa)} × 10^${exponent}`,
          steps: [
            {
              title: "Move the decimal point until one non-zero digit sits before it",
              math: `${fmt(value, 10)} → ${fmt(mantissa)}`,
            },
            {
              title: exponent > 0 ? "The point moved left, so the power is positive" : "The point moved right, so the power is negative",
              math: `10^${exponent} (${digits} place${digits === 1 ? "" : "s"})`,
            },
            {
              title: "Check the mantissa is between 1 and 10",
              math: `1 ≤ ${fmt(mantissa)} < 10 ✓`,
            },
          ],
        },
      };
    }

    const a = num(values, "a");
    const b = num(values, "b");
    const n = num(values, "n");
    const m = num(values, "m");
    const error = requireNumbers([
      { label: "First mantissa A", value: a },
      { label: "First power n", value: n },
      { label: "Second mantissa B", value: b },
      { label: "Second power m", value: m },
    ]);
    if (error) return fail(error);

    if (mode === "divide" && b === 0) return fail("Cannot divide by zero.");

    const mantissa = mode === "multiply" ? a * b : a / b;
    const exponent = mode === "multiply" ? n + m : n - m;
    const normalised = toStandardForm(mantissa * Math.pow(10, exponent));

    return {
      ok: true,
      output: {
        answer: `${fmt(normalised.mantissa)} × 10^${normalised.exponent}`,
        steps: [
          {
            title: mode === "multiply" ? "Multiply the mantissas and add the powers" : "Divide the mantissas and subtract the powers",
            math:
              mode === "multiply"
                ? `${fmt(a)} × ${fmt(b)} = ${fmt(a * b)} and 10^${n} × 10^${m} = 10^${exponent}`
                : `${fmt(a)} ÷ ${fmt(b)} = ${fmt(a / b)} and 10^${n} ÷ 10^${m} = 10^${exponent}`,
          },
          {
            title: "Combine",
            math: `${fmt(mantissa)} × 10^${exponent}`,
          },
          ...(normalised.mantissa === mantissa && normalised.exponent === exponent
            ? []
            : [
              {
                title: "The mantissa was not between 1 and 10, so adjust",
                math: `${fmt(normalised.mantissa)} × 10^${normalised.exponent}`,
                detail: "",
              },
              ]),
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. Fractions · Decimals · Percentages                               */
/* ------------------------------------------------------------------ */

const fdp: CalcTool = {
  kind: "calc",
  name: "Fractions · Decimals · Percentages",
  summary: "Convert between fractions, decimals and percentages with the working shown.",
  formula: "decimal = numerator ÷ denominator  ·  percentage = decimal × 100",
  fields: [
    {
      id: "mode",
      label: "Starting form",
      type: "select",
      defaultValue: "fraction",
      options: [
        { value: "fraction", label: "Fraction (e.g. 3/8)" },
        { value: "decimal", label: "Decimal (e.g. 0.375)" },
        { value: "percentage", label: "Percentage (e.g. 37.5)" },
      ],
    },
    { id: "value", label: "Value", type: "text", defaultValue: "3/8" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const raw = str(values, "value");
    let decimal: number;

    if (mode === "fraction") {
      const parts = raw.split("/");
      if (parts.length !== 2) return fail("Write the fraction as numerator/denominator, e.g. 3/8.");
      const top = Number(parts[0].trim());
      const bottom = Number(parts[1].trim());
      if (!Number.isFinite(top) || !Number.isFinite(bottom) || bottom === 0) {
        return fail("The fraction needs a numerator and a non-zero denominator.");
      }
      decimal = top / bottom;
      const common = gcd(top, bottom);
      const simplified = `${top / common}/${bottom / common}`;
      const percentage = decimal * 100;
      return {
        ok: true,
        output: {
          answer: `${fmt(decimal)} · ${fmt(percentage)}%`,
          steps: [
            { title: "Divide the numerator by the denominator", math: `${top} ÷ ${bottom} = ${fmt(decimal, 6)}` },
            ...(common > 1
              ? [
                  {
                    title: "Cancel the fraction into lowest terms",
                    math: `${top}/${bottom} = ${simplified} (divide both by ${common})`,
                    detail: "",
                  },
                ]
              : []),
            { title: "Multiply by 100 for the percentage", math: `${fmt(decimal, 6)} × 100 = ${fmt(percentage)}%` },
            { title: "Result", math: `fraction ${simplified} = decimal ${fmt(decimal, 6)} = ${fmt(percentage)}%` },
          ],
        },
      };
    }

    if (mode === "decimal") {
      const inputValue = Number(raw);
      if (!Number.isFinite(inputValue)) return fail("Enter a decimal number.");
      const fraction = toFraction(inputValue);
      const percentage = inputValue * 100;
      return {
        ok: true,
        output: {
          answer: `${fraction} · ${fmt(percentage)}%`,
          steps: [
            { title: "Write the decimal over its place value", math: `${fmt(inputValue, 6)} = ${fmt(inputValue, 6)}/1` },
            { title: "Scale to the simplest fraction", math: `= ${fraction} (lowest terms)`, detail: "" },
            { title: "Multiply by 100 for the percentage", math: `${fmt(inputValue, 6)} × 100 = ${fmt(percentage)}%` },
          ],
        },
      };
    }

    const inputPercentage = Number(raw);
    if (!Number.isFinite(inputPercentage)) return fail("Enter a percentage as a number, e.g. 37.5.");
    const pctDecimal = inputPercentage / 100;
    const fraction = toFraction(pctDecimal);
    return {
      ok: true,
      output: {
        answer: `${fmt(pctDecimal, 6)} · ${fraction}`,          steps: [
            { title: "Divide by 100 for the decimal", math: `${fmt(inputPercentage)} ÷ 100 = ${fmt(pctDecimal, 6)}` },
            { title: "Write the decimal as a fraction", math: `= ${fraction} in lowest terms`, detail: "" },
            {
              title: "Check",
              math: `${fraction} as a decimal is ${fmt(pctDecimal, 6)} ✓`,
            },
          ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. Ratio & Proportion Solver                                        */
/* ------------------------------------------------------------------ */

const ratio: CalcTool = {
  kind: "calc",
  name: "Ratio & Proportion Solver",
  summary: "Share amounts in a ratio, solve proportions and work with direct or inverse proportion.",
  formula: "share = amount ÷ total parts × each part",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "share",
      options: [
        { value: "share", label: "Share an amount in a ratio" },
        { value: "proportion", label: "Solve a proportion a : b = c : d" },
        { value: "direct", label: "Direct proportion (y = kx)" },
        { value: "inverse", label: "Inverse proportion (y = k⁄x)" },
      ],
    },
    { id: "amount", label: "Amount to share", type: "number", defaultValue: "240", unit: "£" },
    { id: "ratio", label: "Ratio", type: "text", defaultValue: "3:5", hint: "Two or more parts, e.g. 2:3 or 1:2:5." },
    { id: "a", label: "a", type: "number", defaultValue: "4" },
    { id: "b", label: "b", type: "number", defaultValue: "7" },
    { id: "c", label: "c", type: "number", defaultValue: "12" },
    { id: "x1", label: "Known x", type: "number", defaultValue: "4" },
    { id: "y1", label: "Known y", type: "number", defaultValue: "20" },
    { id: "x2", label: "New x", type: "number", defaultValue: "9" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "share") {
      const amount = num(values, "amount");
      if (!Number.isFinite(amount)) return fail("Enter the amount to share.");
    const ratioRaw = str(values, "ratio");
    const parts = ratioRaw.split(":").map((part) => Number(part.trim()));
    if (parts.length < 2 || parts.some((part) => !Number.isFinite(part) || part < 0)) {
      return fail("Write the ratio as numbers separated by colons, e.g. 3:5.");
    }
    const total = parts.reduce((sum, part) => sum + part, 0);
    if (total === 0) return fail("The ratio parts add up to zero, so nothing can be shared.");
    const unit = amount / total;
    const shares = parts.map((part) => unit * part);
      return {
        ok: true,
        output: {
          answer: shares.map((share, index) => `${fmt(share)} (part ${parts[index]})`).join(" · "),
          extras: [`One part = ${fmt(unit)}`],
          steps: [
            { title: "Add the parts", math: `${parts.join(" + ")} = ${total} parts` },
            { title: "Find the value of one part", math: `${fmt(amount)} ÷ ${total} = ${fmt(unit)}` },
            {
              title: "Multiply each part",
              math: parts.map((part) => `${part} × ${fmt(unit)} = ${fmt(unit * part)}`).join(", "),
            },
            {
              title: "Check the shares add back to the total",
              math: shares.map((share) => fmt(share)).join(" + ") + ` = ${fmt(shares.reduce((sum, share) => sum + share, 0))}`,
            },
          ],
        },
      };
    }

    if (mode === "proportion") {
      const a = num(values, "a");
      const b = num(values, "b");
      const c = num(values, "c");
      const error = requireNumbers([
        { label: "a", value: a },
        { label: "b", value: b },
        { label: "c", value: c },
      ]);
      if (error) return fail(error);
      if (a === 0) return fail("a cannot be zero.");
      const d = (b * c) / a;
      return {
        ok: true,
        output: {
          answer: `d = ${fmt(d)}`,
          steps: [
            { title: "Write the proportion as fractions", math: `${a}/${b} = ${c}/d` },
            { title: "Cross-multiply", math: `${a} × d = ${b} × ${c} = ${fmt(b * c)}` },
            { title: "Divide by a", math: `d = ${fmt(b * c)} ÷ ${a} = ${fmt(d)}` },
            { title: "Check", math: `${a} : ${b} and ${c} : ${fmt(d)} are equivalent` },
          ],
        },
      };
    }

    const x1 = num(values, "x1");
    const y1 = num(values, "y1");
    const x2 = num(values, "x2");
    const error = requireNumbers([
      { label: "Known x", value: x1 },
      { label: "Known y", value: y1 },
      { label: "New x", value: x2 },
    ]);
    if (error) return fail(error);
    if (x1 === 0 || (mode === "inverse" && x2 === 0)) return fail("x cannot be zero.");

    if (mode === "direct") {
      const k = y1 / x1;
      const y2 = k * x2;
      return {
        ok: true,
        output: {
          answer: `y = ${fmt(y2)}`,
          extras: [`k = ${fmt(k)}`, `y = ${fmt(k)}x`],
          steps: [
            { title: "Direct proportion means y = kx", math: `k = y ÷ x = ${fmt(y1)} ÷ ${fmt(x1)} = ${fmt(k)}` },
            { title: "Write the equation", math: `y = ${fmt(k)}x` },
            { title: "Substitute the new x", math: `y = ${fmt(k)} × ${fmt(x2)} = ${fmt(y2)}` },
          ],
        },
      };
    }

    const k = y1 * x1;
    const y2 = k / x2;
    return {
      ok: true,
      output: {
        answer: `y = ${fmt(y2)}`,
        extras: [`k = ${fmt(k)}`, `y = ${fmt(k)}⁄x`],
        steps: [
          { title: "Inverse proportion means y = k⁄x", math: `k = y × x = ${fmt(y1)} × ${fmt(x1)} = ${fmt(k)}` },
          { title: "Write the equation", math: `y = ${fmt(k)}⁄x` },
          { title: "Substitute the new x", math: `y = ${fmt(k)} ÷ ${fmt(x2)} = ${fmt(y2)}` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. Compound Interest & Growth                                       */
/* ------------------------------------------------------------------ */

const compound: CalcTool = {
  kind: "calc",
  name: "Compound Interest & Growth",
  summary: "Compound interest, depreciation and growth or decay with the multiplier shown.",
  formula: "A = P(1 ± r⁄100k)^(kn)",
  fields: [
    { id: "p", label: "Principal P", type: "number", defaultValue: "2500", unit: "£" },
    { id: "rate", label: "Rate r", type: "number", defaultValue: "4.5", unit: "%" },
    { id: "years", label: "Number of years n", type: "number", defaultValue: "6" },
    {
      id: "per",
      label: "Compounded",
      type: "select",
      defaultValue: "1",
      options: [
        { value: "1", label: "Annually (k = 1)" },
        { value: "2", label: "Half-yearly (k = 2)" },
        { value: "4", label: "Quarterly (k = 4)" },
        { value: "12", label: "Monthly (k = 12)" },
      ],
    },
    {
      id: "mode",
      label: "Type",
      type: "select",
      defaultValue: "growth",
      options: [
        { value: "growth", label: "Growth / compound interest" },
        { value: "decay", label: "Decay / depreciation" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const p = num(values, "p");
    const rate = num(values, "rate");
    const years = num(values, "years");
    const k = Number(str(values, "per")) || 1;
    const mode = str(values, "mode");
    const error = requireNumbers([
      { label: "Principal P", value: p },
      { label: "Rate r", value: rate },
      { label: "Number of years n", value: years },
    ]);
    if (error) return fail(error);
    if (p <= 0) return fail("The principal must be greater than zero.");

    const sign = mode === "growth" ? 1 : -1;
    const multiplier = 1 + (sign * rate) / (100 * k);
    const periods = k * years;
    const amount = p * Math.pow(multiplier, periods);
    const change = amount - p;

    return {
      ok: true,
      output: {
        answer: `${fmt(amount, 2)}`,
        extras: [
          `${mode === "growth" ? "Interest earned" : "Value lost"}: ${fmt(Math.abs(change), 2)}`,
          `Multiplier per period: ${fmt(multiplier, 6)}`,
        ],
        steps: [
          {
            title: "Write the multiplier",
            math: `1 ${mode === "growth" ? "+" : "−"} ${fmt(rate)}⁄(100 × ${k}) = ${fmt(multiplier, 6)}`,
          },
          {
            title: "Work out the number of periods",
            math: `${k} × ${fmt(years)} = ${fmt(periods)} periods`,
          },
          {
            title: "Raise the multiplier to the number of periods",
            math: `${fmt(multiplier, 6)}^${fmt(periods)} = ${fmt(Math.pow(multiplier, periods), 6)}`,
          },
          {
            title: "Multiply by the principal",
            math: `${fmt(p)} × ${fmt(Math.pow(multiplier, periods), 6)} = ${fmt(amount, 2)}`,
          },
          {
            title: "Find the change",
            math: `${fmt(amount, 2)} − ${fmt(p)} = ${fmt(change, 2)}`,
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. Quadratic Solver                                                 */
/* ------------------------------------------------------------------ */

const quadratic: CalcTool = {
  kind: "calc",
  name: "Quadratic Solver",
  summary: "Solve any quadratic three ways — factorising, completing the square and the formula.",
  formula: "x = (−b ± √(b² − 4ac)) ⁄ 2a",
  fields: [
    { id: "a", label: "a (x² coefficient)", type: "number", defaultValue: "1" },
    { id: "b", label: "b (x coefficient)", type: "number", defaultValue: "-5" },
    { id: "c", label: "c (constant)", type: "number", defaultValue: "6" },
  ],
  solve(values: Values): SolveOutcome {
    const a = num(values, "a");
    const b = num(values, "b");
    const c = num(values, "c");
    const error = requireNumbers([
      { label: "a", value: a },
      { label: "b", value: b },
      { label: "c", value: c },
    ]);
    if (error) return fail(error);
    if (a === 0) return fail("If a = 0 the equation is linear, not quadratic.");

    const discriminant = b * b - 4 * a * c;
    const equation = `${fmt(a)}x² ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}x ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))} = 0`;

    const steps = [
      {
        title: "Write in standard form and identify a, b, c",
        math: `${equation}   a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`,
      },
      {
        title: "Work out the discriminant b² − 4ac",
        math: `Δ = (${fmt(b)})² − 4(${fmt(a)})(${fmt(c)}) = ${fmt(b * b)} − ${fmt(4 * a * c)} = ${fmt(discriminant)}`,
        detail:
          discriminant > 0
            ? "Δ > 0, so there are two distinct real roots."
            : discriminant === 0
              ? "Δ = 0, so there is one repeated root."
              : "Δ < 0, so there are no real roots.",
      },
    ];

    // Method 1 — factorising (only when the roots are rational)
    const rootA = (-b + Math.sqrt(Math.max(discriminant, 0))) / (2 * a);
    const rootB = (-b - Math.sqrt(Math.max(discriminant, 0))) / (2 * a);
    const rational = discriminant >= 0 && Number.isInteger(Math.sqrt(discriminant));
    if (rational) {
      const r1 = rootA;
      const r2 = rootB;
      const factored =
        a === 1
          ? `(x ${r1 < 0 ? "+" : "−"} ${fmt(Math.abs(r1))})(x ${r2 < 0 ? "+" : "−"} ${fmt(Math.abs(r2))}) = 0`
          : `${fmt(a)}(x ${r1 < 0 ? "+" : "−"} ${fmt(Math.abs(r1))})(x ${r2 < 0 ? "+" : "−"} ${fmt(Math.abs(r2))}) = 0`;
      steps.push({
        title: "Method 1 — factorising",
        math: factored,
        detail: `The two numbers multiply to give a × c = ${fmt(a * c)} and add to give b = ${fmt(b)}.`,
      });
      steps.push({
        title: "Set each bracket to zero",
        math: `x ${r1 < 0 ? "+" : "−"} ${fmt(Math.abs(r1))} = 0 → x = ${fmt(r1)};   x ${r2 < 0 ? "+" : "−"} ${fmt(Math.abs(r2))} = 0 → x = ${fmt(r2)}`,
      });
    } else {
      steps.push({
        title: "Method 1 — factorising",
        math: "",
        detail:
          "The roots are not whole numbers or simple fractions, so this quadratic does not factorise over the integers. Use completing the square or the formula.",
      });
    }

    // Method 2 — completing the square
    const h = -b / (2 * a);
    const k = c - (b * b) / (4 * a);
    steps.push({
      title: "Method 2 — completing the square",
      math: `${fmt(a)}(x ${h < 0 ? "+" : "−"} ${fmt(Math.abs(h))})² ${k < 0 ? "−" : "+"} ${fmt(Math.abs(k))} = 0`,
      detail: `The turning point of the curve is (${fmt(h)}, ${fmt(k)}).`,
    });

    if (discriminant < 0) {
      return {
        ok: true,
        output: {
          answer: "No real roots",
          extras: [`Δ = ${fmt(discriminant)} < 0`],
          steps: [
            ...steps,
            {
              title: "Method 3 — the quadratic formula",
              math: `x = (${fmt(-b)} ± √${fmt(discriminant)}) ⁄ ${fmt(2 * a)}`,
              detail: "The square root of a negative number is not real, so the curve never crosses the x-axis.",
            },
          ],
        },
      };
    }

    // Method 3 — formula, with a simplified surd when Δ is not a perfect square
    const surd = simplifySurd(discriminant);
    const exact =
      surd.b === 1
        ? `x = (${fmt(-b)} ± ${surd.a}) ⁄ ${fmt(2 * a)}`
        : `x = (${fmt(-b)} ± ${surdText(surd.a, surd.b)}) ⁄ ${fmt(2 * a)}`;
    steps.push({
      title: "Method 3 — the quadratic formula",
      math: `x = (−(${fmt(b)}) ± √${fmt(discriminant)}) ⁄ (2 × ${fmt(a)}) = (${fmt(-b)} ± √${fmt(discriminant)}) ⁄ ${fmt(2 * a)}`,
    });
    if (surd.b !== 1) {
      steps.push({
        title: "Simplify the surd for an exact answer",
        math: `√${fmt(discriminant)} = ${surdText(surd.a, surd.b)} so ${exact}`,
      });
    }
    steps.push({
      title: "Evaluate both roots",
      math: `x = ${exact.includes("√") ? `${exact.split("=")[1]}` : ""} → x = ${fmt(rootA)} or x = ${fmt(rootB)}`,
    });

    const answer =
      discriminant === 0
        ? `x = ${fmt(rootA)} (repeated)`
        : `x = ${fmt(rootA)} or x = ${fmt(rootB)}`;

    return {
      ok: true,
      output: {
        answer,
        extras: [exact],
        steps,
        note:
          discriminant === 0
            ? "A repeated root means the curve just touches the x-axis."
            : "Always check by substituting a root back into the original equation.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. Simultaneous Equations                                          */
/* ------------------------------------------------------------------ */

const simultaneous: CalcTool = {
  kind: "calc",
  name: "Simultaneous Equations",
  summary: "Solve two linear equations by elimination and check by substitution.",
  formula: "a₁x + b₁y = c₁  ·  a₂x + b₂y = c₂",
  fields: [
    { id: "a1", label: "a₁", type: "number", defaultValue: "3" },
    { id: "b1", label: "b₁", type: "number", defaultValue: "2" },
    { id: "c1", label: "c₁", type: "number", defaultValue: "16" },
    { id: "a2", label: "a₂", type: "number", defaultValue: "2" },
    { id: "b2", label: "b₂", type: "number", defaultValue: "-1" },
    { id: "c2", label: "c₂", type: "number", defaultValue: "-1" },
  ],
  solve(values: Values): SolveOutcome {
    const a1 = num(values, "a1");
    const b1 = num(values, "b1");
    const c1 = num(values, "c1");
    const a2 = num(values, "a2");
    const b2 = num(values, "b2");
    const c2 = num(values, "c2");
    const error = requireNumbers([
      { label: "a₁", value: a1 },
      { label: "b₁", value: b1 },
      { label: "c₁", value: c1 },
      { label: "a₂", value: a2 },
      { label: "b₂", value: b2 },
      { label: "c₂", value: c2 },
    ]);
    if (error) return fail(error);

    const determinant = a1 * b2 - a2 * b1;
    if (determinant === 0) {
      return fail(
        "The determinant is zero, so these equations have no single solution — they are parallel or the same line.",
      );
    }

    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;

    const steps = [
      {
        title: "Match the y coefficients",
        math: `Eq1 × ${fmt(b2)}: ${fmt(a1 * b2)}x ${b1 * b2 < 0 ? "−" : "+"} ${fmt(Math.abs(b1 * b2))}y = ${fmt(c1 * b2)}`,
      },
      {
        title: "Eq2 × b₁",
        math: `Eq2 × ${fmt(b1)}: ${fmt(a2 * b1)}x ${b2 * b1 < 0 ? "−" : "+"} ${fmt(Math.abs(b2 * b1))}y = ${fmt(c2 * b1)}`,
      },
      {
        title: "Subtract to eliminate y",
        math: `(${fmt(a1 * b2)} − ${fmt(a2 * b1)})x = ${fmt(c1 * b2)} − ${fmt(c2 * b1)} → ${fmt(determinant)}x = ${fmt(c1 * b2 - c2 * b1)}`,
      },
      { title: "Solve for x", math: `x = ${fmt(c1 * b2 - c2 * b1)} ÷ ${fmt(determinant)} = ${fmt(x)}` },
      {
        title: "Substitute back into the first equation",
        math: `${fmt(a1)}(${fmt(x)}) + ${fmt(b1)}y = ${fmt(c1)} → ${fmt(a1 * x)} + ${fmt(b1)}y = ${fmt(c1)}`,
      },
      { title: "Solve for y", math: `y = (${fmt(c1)} − ${fmt(a1 * x)}) ÷ ${fmt(b1)} = ${fmt(y)}` },
      {
        title: "Check in the second equation",
        math: `${fmt(a2)}(${fmt(x)}) + ${fmt(b2)}(${fmt(y)}) = ${fmt(a2 * x + b2 * y)} (should be ${fmt(c2)}) ✓`,
      },
    ];

    return {
      ok: true,
      output: {
        answer: `x = ${fmt(x)}, y = ${fmt(y)}`,
        steps,
        note:
          "Elimination removes one unknown. Substitution — making one letter the subject and swapping it in — gives the same answer.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. Inequalities & Regions                                           */
/* ------------------------------------------------------------------ */

const inequalities: CalcTool = {
  kind: "calc",
  name: "Inequalities & Regions",
  summary: "Solve linear inequalities, remembering to flip the sign when dividing by a negative.",
  formula: "ax + b ⋚ c  →  x ⋚ (c − b) ⁄ a",
  fields: [
    { id: "a", label: "a (coefficient of x)", type: "number", defaultValue: "3" },
    { id: "b", label: "b (constant)", type: "number", defaultValue: "2" },
    {
      id: "sign",
      label: "Sign",
      type: "select",
      defaultValue: "<",
      options: [
        { value: "<", label: "<  less than" },
        { value: "≤", label: "≤  less than or equal to" },
        { value: ">", label: ">  greater than" },
        { value: "≥", label: "≥  greater than or equal to" },
      ],
    },
    { id: "c", label: "c (right-hand side)", type: "number", defaultValue: "11" },
  ],
  solve(values: Values): SolveOutcome {
    const a = num(values, "a");
    const b = num(values, "b");
    const c = num(values, "c");
    const sign = str(values, "sign");
    const error = requireNumbers([
      { label: "a", value: a },
      { label: "b", value: b },
      { label: "c", value: c },
    ]);
    if (error) return fail(error);
    if (a === 0) return fail("If a = 0 there is no x term to solve for.");

    const boundary = (c - b) / a;
    const flip = a < 0;
    const flipped: Record<string, string> = { "<": ">", "≤": "≥", ">": "<", "≥": "≤" };
    const finalSign = flip ? flipped[sign] : sign;

    return {
      ok: true,
      output: {
        answer: `x ${finalSign} ${fmt(boundary)}`,
        extras: [
          flip
            ? "The inequality sign flipped because we divided by a negative number."
            : "The inequality sign stays the same.",
        ],
        steps: [
          {
            title: "Start from the inequality",
            math: `${fmt(a)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))} ${sign} ${fmt(c)}`,
          },
          {
            title: `Subtract ${fmt(b)} from both sides`,
            math: `${fmt(a)}x ${sign} ${fmt(c)} − ${fmt(b)} = ${fmt(c - b)}`,
          },
          {
            title: `Divide both sides by ${fmt(a)}`,
            math: flip
              ? `Dividing by a negative flips the sign: x ${finalSign} ${fmt(boundary)}`
              : `x ${finalSign} ${fmt(c - b)} ÷ ${fmt(a)} = ${fmt(boundary)}`,
          },
          {
            title: "Check with a value",
            math: `Try x = ${fmt(boundary + (finalSign === ">" || finalSign === "≥" ? 1 : -1))} in the original inequality`,
          },
        ],
        note:
          "On a number line, use an open circle for < and >, and a filled circle for ≤ and ≥.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. Sequences & nth Term                                             */
/* ------------------------------------------------------------------ */

const sequences: CalcTool = {
  kind: "calc",
  name: "Sequences & nth Term",
  summary: "Find the nth term of arithmetic and quadratic sequences, and generate any term.",
  formula: "arithmetic: a + (n − 1)d  ·  quadratic: an² + bn + c",
  fields: [
    {
      id: "terms",
      label: "First terms of the sequence",
      type: "text",
      defaultValue: "5, 9, 13, 17, 21",
      hint: "Separate with commas.",
    },
    { id: "find", label: "Which term number do you want?", type: "number", defaultValue: "20" },
  ],
  solve(values: Values): SolveOutcome {
    const terms = parseNumbers(str(values, "terms"));
    const n = num(values, "find");
    if (terms.length < 3) return fail("Enter at least three terms so a pattern can be checked.");

    const first = terms.slice(1).map((term, index) => term - terms[index]);
    const constantFirst = first.every((difference) => difference === first[0]);

    if (constantFirst) {
      const d = first[0];
      const a = terms[0];
      const nth = (term: number) => a + (term - 1) * d;
      const value = Number.isFinite(n) ? nth(n) : undefined;
      return {
        ok: true,
        output: {
          answer: `nth term = ${fmt(d)}n ${a - d < 0 ? "−" : "+"} ${fmt(Math.abs(a - d))}`,
          extras: value !== undefined ? [`Term ${fmt(n)} = ${fmt(value)}`] : undefined,
          steps: [
            { title: "Find the first differences", math: first.join(", ") },
            {
              title: "The differences are constant, so it is arithmetic",
              math: `common difference d = ${fmt(d)}`,
            },
            {
              title: "Compare with the d-times table",
              math: `${fmt(d)}n gives ${fmt(d)}, ${fmt(2 * d)}, ${fmt(3 * d)}… so the adjustment is ${fmt(a - d)}`,
            },
            { title: "Write the nth term", math: `nth term = ${fmt(d)}n ${a - d < 0 ? "−" : "+"} ${fmt(Math.abs(a - d))}` },
            ...(value !== undefined
              ? [
                  {
                    title: `Substitute n = ${fmt(n)}`,
                    math: `${fmt(d)}(${fmt(n)}) ${a - d < 0 ? "−" : "+"} ${fmt(Math.abs(a - d))} = ${fmt(value)}`,
                  },
                ]
              : []),
          ],
        },
      };
    }

    const second = first.slice(1).map((difference, index) => difference - first[index]);
    const constantSecond = second.every((difference) => difference === second[0]);

    if (!constantSecond) {
      return fail(
        "The differences are not constant at the first or second level, so this is not a sequence we can fit yet. Check the terms you entered.",
      );
    }

    const A = second[0] / 2;
    // term(n) = A n² + B n + C, using n = 1, 2, 3
    const B = first[0] - 3 * A;
    const C = terms[0] - A - B;
    const nth = (term: number) => A * term * term + B * term + C;
    const value = Number.isFinite(n) ? nth(n) : undefined;
    const bSign = B < 0 ? "−" : "+";
    const cSign = C < 0 ? "−" : "+";

    return {
      ok: true,
      output: {
        answer: `nth term = ${fmt(A)}n² ${bSign} ${fmt(Math.abs(B))}n ${cSign} ${fmt(Math.abs(C))}`,
        extras: value !== undefined ? [`Term ${fmt(n)} = ${fmt(value)}`] : undefined,
        steps: [
          { title: "First differences", math: first.join(", ") },
          { title: "Second differences", math: second.join(", ") },
          {
            title: "Constant second difference means a quadratic",
            math: `half of ${fmt(second[0])} gives the n² coefficient: a = ${fmt(A)}`,
          },
          {
            title: "Subtract an² from the sequence to find the rest",
            math: `n=1: ${fmt(terms[0])} − ${fmt(A)} = ${fmt(terms[0] - A)} → b + c = ${fmt(terms[0] - A)}`,
          },
          {
            title: "Solve for b and c",
            math: `difference of 3a = ${fmt(3 * A)} links consecutive b + c values, giving b = ${fmt(B)}, c = ${fmt(C)}`,
          },
          {
            title: "Write the nth term and check the third term",
            math: `n=3: ${fmt(A)}(9) ${bSign} ${fmt(Math.abs(B))}(3) ${cSign} ${fmt(Math.abs(C))} = ${fmt(nth(3))} (expected ${fmt(terms[2])}) ✓`,
          },
          ...(value !== undefined
            ? [
                {
                  title: `Substitute n = ${fmt(n)}`,
                  math: `${fmt(A)}(${fmt(n * n)}) ${bSign} ${fmt(Math.abs(B))}(${fmt(n)}) ${cSign} ${fmt(Math.abs(C))} = ${fmt(value)}`,
                },
              ]
            : []),
        ],
        note: "A quadratic sequence always has a constant second difference.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. SOHCAHTOA Calculator                                            */
/* ------------------------------------------------------------------ */

type SideKey = "opposite" | "adjacent" | "hypotenuse";

const sideOptions = [
  { value: "opposite", label: "Opposite" },
  { value: "adjacent", label: "Adjacent" },
  { value: "hypotenuse", label: "Hypotenuse" },
];

function ratioFor(a: SideKey, b: SideKey): "sin" | "cos" | "tan" | null {
  const pair = [a, b].sort().join("-");
  if (pair === "hypotenuse-opposite") return "sin";
  if (pair === "adjacent-hypotenuse") return "cos";
  if (pair === "adjacent-opposite") return "tan";
  return null;
}

const sohcahtoa: CalcTool = {
  kind: "calc",
  name: "SOHCAHTOA Calculator",
  summary: "Right-angled trigonometry for finding a side or an angle, with the ratio named.",
  formula: "sin θ = O⁄H  ·  cos θ = A⁄H  ·  tan θ = O⁄A",
  fields: [
    {
      id: "mode",
      label: "Find",
      type: "select",
      defaultValue: "side",
      options: [
        { value: "side", label: "A side (I know an angle and one side)" },
        { value: "angle", label: "An angle (I know two sides)" },
      ],
    },
    { id: "angle", label: "Angle θ", type: "number", defaultValue: "38", unit: "°" },
    { id: "knownSide", label: "Known side", type: "select", defaultValue: "hypotenuse", options: sideOptions },
    { id: "knownValue", label: "Length of the known side", type: "number", defaultValue: "12", unit: "cm" },
    { id: "wantedSide", label: "Side to find", type: "select", defaultValue: "opposite", options: sideOptions },
    { id: "sideA", label: "First known side", type: "select", defaultValue: "opposite", options: sideOptions },
    { id: "valueA", label: "Length of the first side", type: "number", defaultValue: "5", unit: "cm" },
    { id: "sideB", label: "Second known side", type: "select", defaultValue: "hypotenuse", options: sideOptions },
    { id: "valueB", label: "Length of the second side", type: "number", defaultValue: "13", unit: "cm" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const toRad = (degrees: number) => (degrees * Math.PI) / 180;
    const toDeg = (radians: number) => (radians * 180) / Math.PI;

    if (mode === "side") {
      const angle = num(values, "angle");
      const known = str(values, "knownSide") as SideKey;
      const knownValue = num(values, "knownValue");
      const wanted = str(values, "wantedSide") as SideKey;
      if (!Number.isFinite(angle) || !Number.isFinite(knownValue)) {
        return fail("Enter the angle and the length of the side you know.");
      }
      if (known === wanted) return fail("The known side and the side to find must be different.");
      if (knownValue <= 0) return fail("The known side must be longer than zero.");

      const trig = ratioFor(known, wanted);
      if (!trig) return fail("Those two sides do not form a trigonometry ratio.");
      const theta = toRad(angle);

      let result: number;
      let rearrangement: string;
      if (known === "hypotenuse") {
        result = wanted === "opposite" ? knownValue * Math.sin(theta) : knownValue * Math.cos(theta);
        rearrangement = `side = hypotenuse × ${trig} θ`;
      } else if (wanted === "hypotenuse") {
        result = known === "opposite" ? knownValue / Math.sin(theta) : knownValue / Math.cos(theta);
        rearrangement = `hypotenuse = known ÷ ${trig} θ`;
      } else {
        result = known === "opposite" ? knownValue / Math.tan(theta) : knownValue * Math.tan(theta);
        rearrangement = known === "opposite" ? "adjacent = opposite ÷ tan θ" : "opposite = adjacent × tan θ";
      }

      return {
        ok: true,
        output: {
          answer: `${fmt(result)} cm`,
          extras: [`Using ${trig.toUpperCase()}`],
          steps: [
            {
              title: `Label the sides and choose ${trig.toUpperCase()}`,
              math: `SOHCAHTOA → ${trig} θ = ${trig === "sin" ? "O/H" : trig === "cos" ? "A/H" : "O/A"}`,
            },
            { title: "Rearrange for the side you want", math: rearrangement },
            {
              title: "Substitute the values",
              math: `${trig} ${fmt(angle)}° = ${fmt(Math[trig](theta), 6)}`,
            },
            { title: "Evaluate", math: `= ${fmt(result)} cm` },
          ],
        },
      };
    }

    const sideA = str(values, "sideA") as SideKey;
    const sideB = str(values, "sideB") as SideKey;
    const valueA = num(values, "valueA");
    const valueB = num(values, "valueB");
    if (!Number.isFinite(valueA) || !Number.isFinite(valueB) || valueA <= 0 || valueB <= 0) {
      return fail("Enter two positive side lengths.");
    }
    if (sideA === sideB) return fail("Choose two different sides.");

    const trig = ratioFor(sideA, sideB);
    if (!trig) return fail("Those two sides do not give a trigonometry ratio.");

    const oppositeKey: SideKey = "opposite";
    const adjacentKey: SideKey = "adjacent";
    let ratioValue: number;            if (trig === "sin") {
              const oppositeValue = sideA === oppositeKey ? valueA : valueB;
              const hypotenuseValue = sideA === "hypotenuse" ? valueA : valueB;
              if (oppositeValue > hypotenuseValue) return fail("The hypotenuse must be the longest side.");
              ratioValue = oppositeValue / hypotenuseValue;
            } else if (trig === "cos") {
              const adjacentValue = sideA === adjacentKey ? valueA : valueB;
              const hypotenuseValue = sideA === "hypotenuse" ? valueA : valueB;
              if (adjacentValue > hypotenuseValue) return fail("The hypotenuse must be the longest side.");
              ratioValue = adjacentValue / hypotenuseValue;
            } else {
              const oppositeValue = sideA === oppositeKey ? valueA : valueB;
              const adjacentValue = sideA === adjacentKey ? valueA : valueB;
              ratioValue = oppositeValue / adjacentValue;
            }

    const inverse = trig === "sin" ? Math.asin : trig === "cos" ? Math.acos : Math.atan;
    const angle = toDeg(inverse(ratioValue));

    return {
      ok: true,
      output: {
        answer: `θ = ${fmt(angle, 2)}°`,
        extras: [`Using ${trig.toUpperCase()}`],
        steps: [
          {
            title: `Label the sides and choose ${trig.toUpperCase()}`,
            math: `${trig} θ = ${trig === "sin" ? "O/H" : trig === "cos" ? "A/H" : "O/A"}`,
          },
          { title: "Substitute the two lengths", math: `${trig} θ = ${fmt(ratioValue, 6)}` },
          { title: `Use the inverse ${trig} on your calculator`, math: `θ = ${trig}⁻¹(${fmt(ratioValue, 6)})` },
          { title: "Evaluate", math: `θ = ${fmt(angle, 2)}°` },
        ],
        note: "Check the answer looks sensible: the largest angle in a right-angled triangle can only approach 90°.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 11. Sine & Cosine Rule                                              */
/* ------------------------------------------------------------------ */

const sineCosine: CalcTool = {
  kind: "calc",
  name: "Sine & Cosine Rule",
  summary: "Solve any triangle that is not right-angled, with each rearrangement shown.",
  formula: "a⁄sin A = b⁄sin B  ·  a² = b² + c² − 2bc cos A",
  fields: [
    {
      id: "mode",
      label: "What do you want to find?",
      type: "select",
      defaultValue: "cosineSide",
      options: [
        { value: "cosineSide", label: "A side, given two sides and the angle between them (cosine rule)" },
        { value: "cosineAngle", label: "An angle, given all three sides (cosine rule)" },
        { value: "sineSide", label: "A side, given a matching side and angle (sine rule)" },
        { value: "sineAngle", label: "An angle, given a matching side and angle (sine rule)" },
      ],
    },
    { id: "b", label: "Side b", type: "number", defaultValue: "7", unit: "cm" },
    { id: "c", label: "Side c", type: "number", defaultValue: "9", unit: "cm" },
    { id: "capA", label: "Angle A", type: "number", defaultValue: "52", unit: "°" },
    { id: "a", label: "Side a (opposite angle A)", type: "number", defaultValue: "8", unit: "cm" },
    { id: "capB", label: "Angle B", type: "number", defaultValue: "41", unit: "°" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    const b = num(values, "b");
    const c = num(values, "c");
    const capA = num(values, "capA");
    const a = num(values, "a");
    const capB = num(values, "capB");

    if (mode === "cosineSide") {
      const error = requireNumbers([
        { label: "Side b", value: b },
        { label: "Side c", value: c },
        { label: "Angle A", value: capA },
      ]);
      if (error) return fail(error);
      if (b <= 0 || c <= 0) return fail("The sides must be longer than zero.");
      const theta = toRad(capA);
      const aSquared = b * b + c * c - 2 * b * c * Math.cos(theta);
      if (aSquared <= 0) return fail("Those values do not make a valid triangle.");
      const side = Math.sqrt(aSquared);
      return {
        ok: true,
        output: {
          answer: `a = ${fmt(side, 3)} cm`,
          steps: [
            { title: "Use the cosine rule because we have two sides and the included angle", math: "a² = b² + c² − 2bc cos A" },
            {
              title: "Substitute the values",
              math: `a² = ${fmt(b)}² + ${fmt(c)}² − 2(${fmt(b)})(${fmt(c)})cos ${fmt(capA)}°`,
            },
            {
              title: "Evaluate each part",
              math: `a² = ${fmt(b * b)} + ${fmt(c * c)} − ${fmt(2 * b * c)} × ${fmt(Math.cos(theta), 6)}`,
            },
            { title: "Simplify", math: `a² = ${fmt(aSquared, 6)}` },
            { title: "Square root both sides", math: `a = ${fmt(side, 3)} cm` },
          ],
        },
      };
    }

    if (mode === "cosineAngle") {
      const error = requireNumbers([
        { label: "Side a (opposite angle A)", value: a },
        { label: "Side b", value: b },
        { label: "Side c", value: c },
      ]);
      if (error) return fail(error);
      if (a <= 0 || b <= 0 || c <= 0) return fail("The sides must be longer than zero.");
      const cosA = (b * b + c * c - a * a) / (2 * b * c);
      if (cosA < -1 || cosA > 1) return fail("Those three lengths cannot form a triangle.");
      const angle = toDeg(Math.acos(cosA));
      return {
        ok: true,
        output: {
          answer: `A = ${fmt(angle, 2)}°`,
          steps: [
            { title: "Rearrange the cosine rule to make cos A the subject", math: "cos A = (b² + c² − a²) ⁄ 2bc" },
            {
              title: "Substitute",
              math: `cos A = (${fmt(b)}² + ${fmt(c)}² − ${fmt(a)}²) ⁄ (2 × ${fmt(b)} × ${fmt(c)})`,
            },
            { title: "Simplify", math: `cos A = ${fmt(b * b + c * c - a * a)} ⁄ ${fmt(2 * b * c)} = ${fmt(cosA, 6)}` },
            { title: "Use the inverse cosine", math: `A = cos⁻¹(${fmt(cosA, 6)}) = ${fmt(angle, 2)}°` },
          ],
        },
      };
    }

    if (mode === "sineSide") {
      const error = requireNumbers([
        { label: "Side a (opposite angle A)", value: a },
        { label: "Angle A", value: capA },
        { label: "Angle B", value: capB },
      ]);
      if (error) return fail(error);
      if (a <= 0) return fail("Side a must be longer than zero.");
      if (capA <= 0 || capA >= 180) return fail("Angle A must be between 0° and 180°.");
      const sinA = Math.sin(toRad(capA));
      const side = (a * Math.sin(toRad(capB))) / sinA;
      return {
        ok: true,
        output: {
          answer: `b = ${fmt(side, 3)} cm`,
          steps: [
            { title: "Use the sine rule with the matching pair a and A", math: "a⁄sin A = b⁄sin B" },
            { title: "Rearrange for b", math: "b = a × sin B ⁄ sin A" },
            {
              title: "Substitute",
              math: `b = ${fmt(a)} × sin ${fmt(capB)}° ⁄ sin ${fmt(capA)}°`,
            },
            { title: "Evaluate", math: `b = ${fmt(a)} × ${fmt(Math.sin(toRad(capB)), 6)} ⁄ ${fmt(sinA, 6)} = ${fmt(side, 3)} cm` },
          ],
        },
      };
    }

    const error = requireNumbers([
      { label: "Side a (opposite angle A)", value: a },
      { label: "Side b", value: b },
      { label: "Angle A", value: capA },
    ]);
    if (error) return fail(error);
    if (a <= 0 || b <= 0) return fail("The sides must be longer than zero.");
    const sinA = Math.sin(toRad(capA));
    if (sinA === 0) return fail("Angle A cannot be 0° or 180°.");
    const sinB = (b * sinA) / a;
    if (sinB > 1) return fail("With these values no triangle exists — side b is too long for angle A.");
    const angle = toDeg(Math.asin(sinB));
    return {
      ok: true,
      output: {
        answer: `B = ${fmt(angle, 2)}°`,
        extras: [`The obtuse possibility is ${fmt(180 - angle, 2)}° — check the diagram.`],
        steps: [
          { title: "Use the sine rule with the matching pair a and A", math: "sin B ⁄ b = sin A ⁄ a" },
          { title: "Rearrange for sin B", math: "sin B = b × sin A ⁄ a" },
          { title: "Substitute", math: `sin B = ${fmt(b)} × sin ${fmt(capA)}° ⁄ ${fmt(a)} = ${fmt(sinB, 6)}` },
          { title: "Use the inverse sine", math: `B = sin⁻¹(${fmt(sinB, 6)}) = ${fmt(angle, 2)}°` },
        ],
        note: "The sine rule can give two possible angles (the ambiguous case). Use the diagram to decide which fits.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. Circle Theorems Explorer                                        */
/* ------------------------------------------------------------------ */

const circleTheorems: ExplorerTool = {
  kind: "explorer",
  name: "Circle Theorems Explorer",
  summary: "Every IGCSE circle theorem with its rule and a worked example.",
  topics: [
    {
      id: "semicircle",
      name: "Angle in a semicircle",
      summary: "The angle in a semicircle is a right angle.",
      points: [
        "If a triangle is drawn inside a circle with the diameter as one side, the angle at the circumference is 90°.",
        "This works because the angle at the centre is 180° (a straight line) and the angle at the circumference is half of it.",
      ],
      mono: ["angle at centre = 180°", "angle at circumference = ½ × 180° = 90°"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Reason", "Result"],
        rows: [["AB is a diameter, C on the circle", "Angle in a semicircle", "∠ACB = 90°"]],
      },
    },
    {
      id: "centre",
      name: "Angle at the centre",
      summary: "The angle at the centre is twice the angle at the circumference from the same arc.",
      points: [
        "Both angles must stand on the same arc, with the same two endpoints.",
        "Halve the centre angle to get the circumference angle, or double it the other way.",
      ],
      mono: ["angle at centre = 2 × angle at circumference"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Working", "Result"],
        rows: [["Angle at centre = 130°", "130 ÷ 2", "Angle at circumference = 65°"]],
      },
    },
    {
      id: "segment",
      name: "Angles in the same segment",
      summary: "Angles in the same segment subtended by the same arc are equal.",
      points: [
        "Any two angles at the circumference standing on the same chord are equal.",
        "Look for the 'bow tie' or 'butterfly' shape.",
      ],
      mono: ["∠APB = ∠AQB (same chord AB)"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Reason", "Result"],
        rows: [["∠APB = 42°", "Angles in the same segment", "∠AQB = 42°"]],
      },
    },
    {
      id: "cyclic",
      name: "Cyclic quadrilateral",
      summary: "Opposite angles of a cyclic quadrilateral add to 180°.",
      points: [
        "A cyclic quadrilateral has all four vertices on the circle.",
        "Each pair of opposite angles is supplementary.",
      ],
      mono: ["∠A + ∠C = 180°", "∠B + ∠D = 180°"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Working", "Result"],
        rows: [["∠A = 104°", "180 − 104", "∠C = 76°"]],
      },
    },
    {
      id: "tangent-radius",
      name: "Tangent and radius",
      summary: "A tangent meets the radius at 90°.",
      points: [
        "The radius drawn to the point of contact is perpendicular to the tangent.",
        "This gives you a right-angled triangle to use Pythagoras or SOHCAHTOA in.",
      ],
      mono: ["radius ⊥ tangent at the point of contact"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Reason", "Result"],
        rows: [["Tangent at P, centre O", "Tangent ⊥ radius", "∠OPQ = 90°"]],
      },
    },
    {
      id: "two-tangents",
      name: "Two tangents from a point",
      summary: "Tangents from the same external point are equal, and the line to the centre bisects the angle.",
      points: [
        "The two tangent lengths from the same point are equal.",
        "The line from the centre to that point bisects the angle between the tangents.",
      ],
      mono: ["PA = PB", "∠APO = ∠BPO"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Working", "Result"],
        rows: [["PA = 12 cm", "Tangents from a point are equal", "PB = 12 cm"]],
      },
    },
    {
      id: "alternate",
      name: "Alternate segment theorem",
      summary: "The angle between a tangent and a chord equals the angle in the alternate segment.",
      points: [
        "Identify the chord that meets the tangent, then look into the opposite segment.",
        "This is the theorem most often missed — check which segment the angle sits in.",
      ],
      mono: ["∠(tangent, chord) = ∠ in the alternate segment"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Reason", "Result"],
        rows: [["Angle between tangent and chord = 58°", "Alternate segment", "Angle in opposite segment = 58°"]],
      },
    },
    {
      id: "chords",
      name: "Perpendicular from the centre to a chord",
      summary: "A perpendicular from the centre to a chord bisects the chord.",
      points: [
        "The perpendicular distance from the centre splits the chord into two equal halves.",
        "Combine with Pythagoras: r² = d² + (half-chord)².",
      ],
      mono: ["r² = d² + (½ chord)²"],
      table: {
        caption: "Worked example",
        headers: ["Given", "Working", "Result"],
        rows: [["Radius 13 cm, distance from centre 5 cm", "13² − 5² = 144, √144 = 12", "Half chord = 12, chord = 24 cm"]],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 13. Vectors Toolkit                                                 */
/* ------------------------------------------------------------------ */

const vectors: CalcTool = {
  kind: "calc",
  name: "Vectors Toolkit",
  summary: "Add, subtract and scale column vectors, and find magnitudes and midpoints.",
  formula: "a + b = (aₓ + bₓ, a_y + b_y)  ·  |a| = √(aₓ² + a_y²)",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "add",
      options: [
        { value: "add", label: "Add two vectors" },
        { value: "subtract", label: "Subtract two vectors" },
        { value: "scalar", label: "Multiply a vector by a scalar" },
        { value: "magnitude", label: "Find the magnitude" },
        { value: "midpoint", label: "Midpoint of two points" },
      ],
    },
    { id: "ax", label: "Vector a — x component", type: "number", defaultValue: "3" },
    { id: "ay", label: "Vector a — y component", type: "number", defaultValue: "4" },
    { id: "bx", label: "Vector b — x component", type: "number", defaultValue: "-1" },
    { id: "by", label: "Vector b — y component", type: "number", defaultValue: "2" },
    { id: "k", label: "Scalar k", type: "number", defaultValue: "2" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const ax = num(values, "ax");
    const ay = num(values, "ay");
    const bx = num(values, "bx");
    const by = num(values, "by");
    const k = num(values, "k");
    const vector = (x: number, y: number) => `(${fmt(x)} ${y < 0 ? "−" : "+"} ${fmt(Math.abs(y))})`.replace(/\+/, "|").replace(/\|/, "+");
    const plain = (x: number, y: number) => `(${fmt(x)}, ${fmt(y)})`;

    if (mode === "scalar") {
      const error = requireNumbers([{ label: "Vector a — x component", value: ax }, { label: "Vector a — y component", value: ay }, { label: "Scalar k", value: k }]);
      if (error) return fail(error);
      return {
        ok: true,
        output: {
          answer: plain(k * ax, k * ay),
          steps: [
            { title: "Write the vector as a column", math: `a = ${plain(ax, ay)}` },
            { title: `Multiply each component by ${fmt(k)}`, math: `${fmt(k)} × ${fmt(ax)} = ${fmt(k * ax)},  ${fmt(k)} × ${fmt(ay)} = ${fmt(k * ay)}` },
            { title: "Result", math: `${fmt(k)}a = ${plain(k * ax, k * ay)}` },
          ],
        },
      };
    }

    if (mode === "midpoint") {
      const error = requireNumbers([
        { label: "Point A — x", value: ax },
        { label: "Point A — y", value: ay },
        { label: "Point B — x", value: bx },
        { label: "Point B — y", value: by },
      ]);
      if (error) return fail(error);
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      return {
        ok: true,
        output: {
          answer: `(${fmt(mx)}, ${fmt(my)})`,
          steps: [
            { title: "Add the coordinates of the two points", math: `A + B = (${fmt(ax + bx)}, ${fmt(ay + by)})` },
            { title: "Halve them to find the midpoint", math: `M = (${fmt(ax + bx)} ÷ 2, ${fmt(ay + by)} ÷ 2)` },
            { title: "Result", math: `M = (${fmt(mx)}, ${fmt(my)})` },
          ],
        },
      };
    }

    const error = requireNumbers([
      { label: "Vector a — x component", value: ax },
      { label: "Vector a — y component", value: ay },
      { label: "Vector b — x component", value: bx },
      { label: "Vector b — y component", value: by },
    ]);
    if (error) return fail(error);

    if (mode === "magnitude") {
      const magnitude = Math.sqrt(ax * ax + ay * ay);
      return {
        ok: true,
        output: {
          answer: `|a| = ${fmt(magnitude, 4)}`,
          steps: [
            { title: "Use Pythagoras on the components", math: `|a| = √(${fmt(ax)}² + ${fmt(ay)}²)` },
            { title: "Square each component", math: `= √(${fmt(ax * ax)} + ${fmt(ay * ay)}) = √${fmt(ax * ax + ay * ay)}` },
            { title: "Evaluate", math: `= ${fmt(magnitude, 4)}` },
          ],
        },
      };
    }

    const subtract = mode === "subtract";
    const rx = subtract ? ax - bx : ax + bx;
    const ry = subtract ? ay - by : ay + by;
    return {
      ok: true,
      output: {
        answer: plain(rx, ry),
        steps: [
          { title: "Write both vectors as columns", math: `a = ${plain(ax, ay)},  b = ${plain(bx, by)}` },
          {
            title: subtract ? "Subtract component by component" : "Add component by component",
            math: `${subtract ? "a − b" : "a + b"} = (${fmt(ax)} ${subtract ? "−" : "+"} ${fmt(bx)}, ${fmt(ay)} ${subtract ? "−" : "+"} ${fmt(by)})`,
          },
          { title: "Result", math: `= ${plain(rx, ry)}` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. Bearings Calculator                                             */
/* ------------------------------------------------------------------ */

const bearings: CalcTool = {
  kind: "calc",
  name: "Bearings Calculator",
  summary: "Find back bearings and bearings between two points, measured clockwise from north.",
  formula: "bearing = measured clockwise from north, written with three figures",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "back",
      options: [
        { value: "back", label: "Back bearing (the reverse direction)" },
        { value: "between", label: "Bearing and distance between two points" },
      ],
    },
    { id: "bearing", label: "Bearing", type: "number", defaultValue: "62", unit: "°" },
    { id: "x1", label: "Point A — easting x", type: "number", defaultValue: "0" },
    { id: "y1", label: "Point A — northing y", type: "number", defaultValue: "0" },
    { id: "x2", label: "Point B — easting x", type: "number", defaultValue: "4" },
    { id: "y2", label: "Point B — northing y", type: "number", defaultValue: "3" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const three = (value: number) => String(Math.round(value) % 360).padStart(3, "0");

    if (mode === "back") {
      const bearing = num(values, "bearing");
      if (!Number.isFinite(bearing)) return fail("Enter a bearing in degrees.");
      const normalised = ((bearing % 360) + 360) % 360;
      const back = normalised + 180 >= 360 ? normalised - 180 : normalised + 180;
      return {
        ok: true,
        output: {
          answer: `${three(back)}°`,
          extras: [`Forward bearing: ${three(normalised)}°`],
          steps: [
            { title: "A back bearing is the direction reversed", math: `${three(normalised)}° ± 180°` },
            {
              title: normalised + 180 >= 360 ? "Adding 180 would pass 360°, so subtract instead" : "Adding 180 stays within the compass",
              math: normalised + 180 >= 360 ? `${three(normalised)}° − 180° = ${three(back)}°` : `${three(normalised)}° + 180° = ${three(back)}°`,
            },
            { title: "Write it with three figures", math: `${three(back)}°` },
          ],
        },
      };
    }

    const x1 = num(values, "x1");
    const y1 = num(values, "y1");
    const x2 = num(values, "x2");
    const y2 = num(values, "y2");
    const error = requireNumbers([
      { label: "Point A — easting x", value: x1 },
      { label: "Point A — northing y", value: y1 },
      { label: "Point B — easting x", value: x2 },
      { label: "Point B — northing y", value: y2 },
    ]);
    if (error) return fail(error);

    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) return fail("A and B are the same point, so there is no bearing.");
    const distance = Math.hypot(dx, dy);
    let bearing = (Math.atan2(dx, dy) * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    const angleFromNorth = Math.abs((Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI);

    return {
      ok: true,
      output: {
        answer: `${three(bearing)}° at ${fmt(distance, 3)} units`,
        steps: [
          { title: "Find the change in x and y", math: `Δx = ${fmt(x2)} − ${fmt(x1)} = ${fmt(dx)},  Δy = ${fmt(y2)} − ${fmt(y1)} = ${fmt(dy)}` },
          { title: "Sketch the right-angled triangle and find the acute angle from north", math: `tan θ = ${fmt(Math.abs(dx))} ⁄ ${fmt(Math.abs(dy))} → θ = ${fmt(angleFromNorth, 2)}°` },
          {
            title: `${dx >= 0 ? (dy >= 0 ? "B is north-east of A, so the bearing is the angle itself" : "B is south-east of A, so the bearing is 180° − the angle") : (dy >= 0 ? "B is north-west of A, so the bearing is 360° − the angle" : "B is south-west of A, so the bearing is 180° + the angle")}`,
            math: `bearing = ${three(bearing)}°`,
          },
          { title: "Use Pythagoras for the distance", math: `d = √(${fmt(dx)}² + ${fmt(dy)}²) = √${fmt(dx * dx + dy * dy)} = ${fmt(distance, 3)}` },
        ],
        note: "Bearings are always measured clockwise from north and written with three figures.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. Similar Shapes & Congruence                                     */
/* ------------------------------------------------------------------ */

const similar: CalcTool = {
  kind: "calc",
  name: "Similar Shapes & Congruence",
  summary: "Work with length, area and volume scale factors for similar shapes.",
  formula: "area factor = k²  ·  volume factor = k³",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "factor",
      options: [
        { value: "factor", label: "Find the scale factors from two lengths" },
        { value: "area", label: "Find an area using the area factor" },
        { value: "volume", label: "Find a volume using the volume factor" },
      ],
    },
    { id: "small", label: "Length on shape A", type: "number", defaultValue: "4", unit: "cm" },
    { id: "large", label: "Matching length on shape B", type: "number", defaultValue: "10", unit: "cm" },
    { id: "areaValue", label: "Area on shape A", type: "number", defaultValue: "20", unit: "cm²" },
    { id: "volumeValue", label: "Volume on shape A", type: "number", defaultValue: "30", unit: "cm³" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const small = num(values, "small");
    const large = num(values, "large");
    const error = requireNumbers([
      { label: "Length on shape A", value: small },
      { label: "Matching length on shape B", value: large },
    ]);
    if (error) return fail(error);
    if (small <= 0) return fail("Lengths must be greater than zero.");

    const k = large / small;
    const lengthStep = {
      title: "Write the length scale factor",
      math: `k = ${fmt(large)} ⁄ ${fmt(small)} = ${fmt(k)}`,
    };

    if (mode === "factor") {
      return {
        ok: true,
        output: {
          answer: `k = ${fmt(k)}, area factor = ${fmt(k * k)}, volume factor = ${fmt(k * k * k)}`,
          steps: [
            lengthStep,
            { title: "Square the length factor for areas", math: `k² = ${fmt(k)}² = ${fmt(k * k)}` },
            { title: "Cube the length factor for volumes", math: `k³ = ${fmt(k)}³ = ${fmt(k * k * k)}` },
            {
              title: "Remember",
              detail:
                "Similar shapes have equal angles and lengths in the same ratio. Congruent shapes are similar with k = 1.",
            },
          ],
        },
      };
    }

    if (mode === "area") {
      const areaValue = num(values, "areaValue");
      if (!Number.isFinite(areaValue)) return fail("Enter the area on shape A.");
      const result = areaValue * k * k;
      return {
        ok: true,
        output: {
          answer: `${fmt(result, 3)} cm²`,
          steps: [
            lengthStep,
            { title: "Square it for the area factor", math: `k² = ${fmt(k * k, 6)}` },
            { title: "Multiply the known area", math: `${fmt(areaValue)} × ${fmt(k * k, 6)} = ${fmt(result, 3)} cm²` },
          ],
        },
      };
    }

    const volumeValue = num(values, "volumeValue");
    if (!Number.isFinite(volumeValue)) return fail("Enter the volume on shape A.");
    const result = volumeValue * k * k * k;
    return {
      ok: true,
      output: {
        answer: `${fmt(result, 3)} cm³`,
        steps: [
          lengthStep,
          { title: "Cube it for the volume factor", math: `k³ = ${fmt(k * k * k, 6)}` },
          { title: "Multiply the known volume", math: `${fmt(volumeValue)} × ${fmt(k * k * k, 6)} = ${fmt(result, 3)} cm³` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. Sets & Venn Diagrams                                            */
/* ------------------------------------------------------------------ */

const sets: CalcTool = {
  kind: "calc",
  name: "Sets & Venn Diagrams",
  summary: "Work out every region of a two-set Venn diagram from the counts.",
  formula: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
  fields: [
    { id: "u", label: "n(U) — everyone in the universal set", type: "number", defaultValue: "40" },
    { id: "na", label: "n(A)", type: "number", defaultValue: "21" },
    { id: "nb", label: "n(B)", type: "number", defaultValue: "17" },
    { id: "nab", label: "n(A ∩ B) — in both", type: "number", defaultValue: "8" },
  ],
  solve(values: Values): SolveOutcome {
    const u = num(values, "u");
    const na = num(values, "na");
    const nb = num(values, "nb");
    const nab = num(values, "nab");
    const error = requireNumbers([
      { label: "n(U)", value: u },
      { label: "n(A)", value: na },
      { label: "n(B)", value: nb },
      { label: "n(A ∩ B)", value: nab },
    ]);
    if (error) return fail(error);
    if (nab > Math.min(na, nb)) return fail("n(A ∩ B) cannot be larger than n(A) or n(B).");

    const onlyA = na - nab;
    const onlyB = nb - nab;
    const union = onlyA + onlyB + nab;
    const neither = u - union;
    if (neither < 0) return fail("These counts do not fit inside the universal set — n(A ∪ B) is larger than n(U).");

    return {
      ok: true,
      output: {
        answer: `n(A ∪ B) = ${fmt(union)}, neither = ${fmt(neither)}`,
        extras: [`A only = ${fmt(onlyA)}`, `B only = ${fmt(onlyB)}`, `Both = ${fmt(nab)}`],
        tables: [
          {
            caption: "Venn diagram regions",
            headers: ["Region", "Meaning", "Count"],
            rows: [
              ["A ∩ B", "in A and in B", fmt(nab)],
              ["A only", "in A but not B", fmt(onlyA)],
              ["B only", "in B but not A", fmt(onlyB)],
              ["(A ∪ B)′", "in neither", fmt(neither)],
              ["Total", "n(U)", fmt(union + neither)],
            ],
          },
        ],
        steps: [
          { title: "Start with the overlap in the middle", math: `A ∩ B = ${fmt(nab)}` },
          { title: "Take the overlap away from A to get A only", math: `${fmt(na)} − ${fmt(nab)} = ${fmt(onlyA)}` },
          { title: "Do the same for B", math: `${fmt(nb)} − ${fmt(nab)} = ${fmt(onlyB)}` },
          { title: "Add the three inner regions for the union", math: `${fmt(onlyA)} + ${fmt(nab)} + ${fmt(onlyB)} = ${fmt(union)}` },
          {
            title: "Subtract from the universal set for the outside",
            math: `${fmt(u)} − ${fmt(union)} = ${fmt(neither)}`,
          },
          { title: "Check with the union formula", math: `n(A ∪ B) = ${fmt(na)} + ${fmt(nb)} − ${fmt(nab)} = ${fmt(union)} ✓` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. Probability Calculator                                          */
/* ------------------------------------------------------------------ */

const probability: CalcTool = {
  kind: "calc",
  name: "Probability Calculator",
  summary: "Single events, complements, combined events and two-stage tree diagrams.",
  formula: "P(A′) = 1 − P(A)  ·  P(A and B) = P(A) × P(B)  ·  P(A or B) = P(A) + P(B) − P(A ∩ B)",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "complement",
      options: [
        { value: "complement", label: "P(not A) — the complement" },
        { value: "and", label: "P(A and B) — independent events" },
        { value: "or", label: "P(A or B) — mutually exclusive" },
        { value: "tree", label: "Two-stage tree diagram" },
      ],
    },
    { id: "pa", label: "P(A)", type: "number", defaultValue: "0.3" },
    { id: "pb", label: "P(B)", type: "number", defaultValue: "0.4" },
    { id: "pbGivenA", label: "P(B given A)", type: "number", defaultValue: "0.7" },
    { id: "pbGivenNotA", label: "P(B given not A)", type: "number", defaultValue: "0.2" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const pa = num(values, "pa");
    const pb = num(values, "pb");
    if (!Number.isFinite(pa) || pa < 0 || pa > 1) return fail("P(A) must be between 0 and 1.");
    const paFraction = toFraction(pa);

    if (mode === "complement") {
      const complement = 1 - pa;
      return {
        ok: true,
        output: {
          answer: `P(A′) = ${fmt(complement, 4)} = ${toFraction(complement)}`,
          steps: [
            { title: "The probabilities of an event and its complement add to 1", math: `P(A) + P(A′) = 1` },
            { title: "Subtract", math: `P(A′) = 1 − ${fmt(pa)} = ${fmt(complement, 4)}` },
            { title: "As a fraction", math: `${paFraction} of the outcomes are A, so ${toFraction(complement)} are not` },
          ],
        },
      };
    }

    if (!Number.isFinite(pb) || pb < 0 || pb > 1) return fail("P(B) must be between 0 and 1.");

    if (mode === "and") {
      const both = pa * pb;
      return {
        ok: true,
        output: {
          answer: `P(A and B) = ${fmt(both, 4)} = ${toFraction(both)}`,
          steps: [
            { title: "For independent events, multiply", math: `P(A and B) = P(A) × P(B)` },
            { title: "Substitute", math: `${fmt(pa)} × ${fmt(pb)} = ${fmt(both, 6)}` },
            { title: "As a fraction", math: `= ${toFraction(both)}` },
          ],
        },
      };
    }

    if (mode === "or") {
      const either = pa + pb;
      if (either > 1) {
        return fail(
          "P(A) + P(B) is greater than 1, so these events cannot be mutually exclusive. Use P(A or B) = P(A) + P(B) − P(A ∩ B) instead.",
        );
      }
      return {
        ok: true,
        output: {
          answer: `P(A or B) = ${fmt(either, 4)} = ${toFraction(either)}`,
          steps: [
            { title: "Mutually exclusive events cannot both happen, so add", math: `P(A or B) = P(A) + P(B)` },
            { title: "Substitute", math: `${fmt(pa)} + ${fmt(pb)} = ${fmt(either, 6)}` },
            { title: "As a fraction", math: `= ${toFraction(either)}` },
          ],
        },
      };
    }

    const pbGivenA = num(values, "pbGivenA");
    const pbGivenNotA = num(values, "pbGivenNotA");
    if (!Number.isFinite(pbGivenA) || !Number.isFinite(pbGivenNotA)) {
      return fail("Enter both conditional probabilities for the tree diagram.");
    }
    const bothA = pa * pbGivenA;
    const aThenNotB = pa * (1 - pbGivenA);
    const notAThenB = (1 - pa) * pbGivenNotA;
    const neither = (1 - pa) * (1 - pbGivenNotA);
    const total = bothA + aThenNotB + notAThenB + neither;

    return {
      ok: true,
      output: {
        answer: `P(A and B) = ${fmt(bothA, 4)}`,
        extras: [`P(A and not B) = ${fmt(aThenNotB, 4)}`, `P(not A and B) = ${fmt(notAThenB, 4)}`, `P(not A and not B) = ${fmt(neither, 4)}`],
        tables: [
          {
            caption: "Tree diagram outcomes",
            headers: ["First", "Second", "Multiply", "Probability"],
            rows: [
              ["A", "B", `${fmt(pa)} × ${fmt(pbGivenA)}`, fmt(bothA, 4)],
              ["A", "not B", `${fmt(pa)} × ${fmt(1 - pbGivenA)}`, fmt(aThenNotB, 4)],
              ["not A", "B", `${fmt(1 - pa)} × ${fmt(pbGivenNotA)}`, fmt(notAThenB, 4)],
              ["not A", "not B", `${fmt(1 - pa)} × ${fmt(1 - pbGivenNotA)}`, fmt(neither, 4)],
            ],
          },
        ],
        steps: [
          { title: "The first branch splits with P(A) and P(not A)", math: `P(A) = ${fmt(pa)}, P(not A) = ${fmt(1 - pa)}` },
          { title: "The second branch is conditional", math: `P(B given A) = ${fmt(pbGivenA)}, P(B given not A) = ${fmt(pbGivenNotA)}` },
          { title: "Multiply along each pair of branches", math: `${fmt(pa)} × ${fmt(pbGivenA)} = ${fmt(bothA, 6)}` },
          { title: "Add the probabilities of the outcomes you want" },
          { title: "Check all four outcomes add to 1", math: `${fmt(total, 6)} ✓` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. Statistics Workbench                                            */
/* ------------------------------------------------------------------ */

const statistics: CalcTool = {
  kind: "calc",
  name: "Statistics Workbench",
  summary: "Mean, median, mode, range and standard deviation with the deviation table shown.",
  formula: "mean = Σx ⁄ n  ·  σ = √(Σ(x − x̄)² ⁄ n)",
  fields: [
    {
      id: "data",
      label: "Data values",
      type: "text",
      defaultValue: "12, 15, 11, 15, 18, 14, 15, 10",
      hint: "Separate with commas.",
    },
  ],
  solve(values: Values): SolveOutcome {
    const data = parseNumbers(str(values, "data"));
    if (data.length < 2) return fail("Enter at least two numbers.");
    if (data.some((value) => !Number.isFinite(value))) return fail("Every value must be a number.");

    const n = data.length;
    const sum = data.reduce((total, value) => total + value, 0);
    const mean = sum / n;
    const sorted = [...data].sort((a, b) => a - b);
    const middle = Math.floor(n / 2);
    const median = n % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;

    const counts = new Map<number, number>();
    for (const value of sorted) counts.set(value, (counts.get(value) ?? 0) + 1);
    const highest = Math.max(...counts.values());
    const modes = highest > 1 ? [...counts.entries()].filter(([, count]) => count === highest).map(([value]) => value) : [];

    const squared = data.map((value) => (value - mean) ** 2);
    const sumSquared = squared.reduce((total, value) => total + value, 0);
    const populationSd = Math.sqrt(sumSquared / n);
    const sampleSd = n > 1 ? Math.sqrt(sumSquared / (n - 1)) : NaN;

    return {
      ok: true,
      output: {
        answer: `mean = ${fmt(mean)}, median = ${fmt(median)}, mode = ${modes.length ? modes.join(", ") : "none"}`,
        extras: [
          `range = ${fmt(sorted[n - 1] - sorted[0])}`,
          `standard deviation (population) = ${fmt(populationSd, 4)}`,
          `standard deviation (sample) = ${fmt(sampleSd, 4)}`,
        ],
        tables: [
          {
            caption: "Working for the standard deviation",
            headers: ["x", "x − mean", "(x − mean)²"],
            rows: data.map((value, index) => [
              fmt(value),
              fmt(value - mean, 3),
              fmt(squared[index], 3),
            ]),
          },
        ],
        steps: [
          { title: "Add up all the values", math: `Σx = ${fmt(sum)}` },
          { title: "Divide by how many there are", math: `mean x̄ = ${fmt(sum)} ÷ ${fmt(n)} = ${fmt(mean)}` },
          { title: "Put the values in order for the median", math: sorted.map((value) => fmt(value)).join(", ") },
          {
            title: n % 2 === 1 ? "An odd count, so the median is the middle value" : "An even count, so average the two middle values",
            math: n % 2 === 1 ? `median = ${fmt(median)}` : `median = (${fmt(sorted[middle - 1])} + ${fmt(sorted[middle])}) ÷ 2 = ${fmt(median)}`,
          },
          {
            title: modes.length ? "The mode is the most frequent value" : "No value repeats, so there is no mode",
            math: modes.length ? `mode = ${modes.join(", ")}` : "no mode",
          },
          {
            title: "Square each deviation and add them",
            math: `Σ(x − x̄)² = ${fmt(sumSquared, 4)}`,
          },
          {
            title: "Divide and square root for the standard deviation",
            math: `σ = √(${fmt(sumSquared, 4)} ÷ ${fmt(n)}) = ${fmt(populationSd, 4)}`,
          },
        ],
        note: "Use the population standard deviation when your data is the whole set; use the sample version when it is a sample of something larger.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. Graph Plotter                                                   */
/* ------------------------------------------------------------------ */

const graph: CalcTool = {
  kind: "calc",
  name: "Graph Plotter",
  summary: "Plot linear, quadratic and cubic graphs, with intercepts and roots worked out.",
  formula: "y = ax² + bx + c",
  fields: [
    {
      id: "mode",
      label: "Type of graph",
      type: "select",
      defaultValue: "quadratic",
      options: [
        { value: "linear", label: "Linear  y = mx + c" },
        { value: "quadratic", label: "Quadratic  y = ax² + bx + c" },
        { value: "cubic", label: "Cubic  y = ax³ + bx² + cx + d" },
      ],
    },
    { id: "a", label: "a (or m for a line)", type: "number", defaultValue: "1" },
    { id: "b", label: "b (or c for a line)", type: "number", defaultValue: "-2" },
    { id: "c", label: "c", type: "number", defaultValue: "-3" },
    { id: "d", label: "d (cubic only)", type: "number", defaultValue: "0" },
    { id: "from", label: "Plot from x =", type: "number", defaultValue: "-4" },
    { id: "to", label: "Plot to x =", type: "number", defaultValue: "4" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const a = num(values, "a");
    const b = num(values, "b");
    const c = num(values, "c");
    const d = num(values, "d");
    const from = num(values, "from");
    const to = num(values, "to");
    const error = requireNumbers([
      { label: "a (or m for a line)", value: a },
      { label: "b (or c for a line)", value: b },
      ...(mode === "quadratic" ? [{ label: "c", value: c }] : []),
      { label: "Plot from x =", value: from },
      { label: "Plot to x =", value: to },
    ]);
    if (error) return fail(error);
    if (to <= from) return fail("The upper x value must be greater than the lower one.");

    const evaluate = (x: number) => {
      if (mode === "linear") return a * x + b;
      if (mode === "quadratic") return a * x * x + b * x + c;
      return a * x * x * x + b * x * x + c * x + d;
    };

    const samples = 17;
    const step = (to - from) / (samples - 1);
    const points = Array.from({ length: samples }, (_, index) => {
      const x = Number((from + index * step).toFixed(4));
      return { x, y: Number(evaluate(x).toFixed(4)) };
    });

    const table = {
      caption: "Table of values",
      headers: ["x", "y"],
      rows: points
        .filter((_, index) => index % 2 === 0)
        .map((point) => [fmt(point.x, 3), fmt(point.y, 3)]),
    };

    const steps: WorkStep[] = [
      {
        title: "Write the equation of the graph",
        math:
          mode === "linear"
            ? `y = ${fmt(a)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}`
            : mode === "quadratic"
              ? `y = ${fmt(a)}x² ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}x ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}`
              : `y = ${fmt(a)}x³ ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}x² ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}x ${d < 0 ? "−" : "+"} ${fmt(Math.abs(d))}`,
      },
      {
        title: "Substitute x values to build the table",
        math: `x = ${fmt(from, 3)} → y = ${fmt(points[0].y, 3)};   x = 0 → y = ${fmt(evaluate(0), 3)};   x = ${fmt(to, 3)} → y = ${fmt(points[samples - 1].y, 3)}`,
      },
    ];

    let answer = "";
    const extras: string[] = [];

    if (mode === "linear") {
      answer = `gradient = ${fmt(a)}, y-intercept = ${fmt(b)}`;
      extras.push(`x-intercept: x = ${fmt(-b / a, 4)}`);
      steps.push({ title: "Read the gradient and intercept from y = mx + c", math: `m = ${fmt(a)}, c = ${fmt(b)}` });
      steps.push({ title: "Set y = 0 for the x-intercept", math: `0 = ${fmt(a)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))} → x = ${fmt(-b / a, 4)}` });
    } else if (mode === "quadratic") {
      const discriminant = b * b - 4 * a * c;
      const vertexX = -b / (2 * a);
      const vertexY = evaluate(vertexX);
      answer = `y-intercept ${fmt(c)}, turning point (${fmt(vertexX, 3)}, ${fmt(vertexY, 3)})`;
      steps.push({ title: "The y-intercept is the constant term", math: `x = 0 → y = ${fmt(c)}` });
      steps.push({
        title: "The turning point sits at x = −b ⁄ 2a",
        math: `x = −(${fmt(b)}) ⁄ (2 × ${fmt(a)}) = ${fmt(vertexX, 3)}, giving y = ${fmt(vertexY, 3)}`,
        detail: a > 0 ? "a > 0 so the curve is a minimum (a 'smile')." : "a < 0 so the curve is a maximum (a 'frown').",
      });
      if (discriminant >= 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        extras.push(`roots: x = ${fmt(root1, 4)}${discriminant === 0 ? " (repeated)" : ` and x = ${fmt(root2, 4)}`}`);
        steps.push({
          title: "Solve y = 0 for the roots",
          math: `x = (${fmt(b * -1)} ± √${fmt(discriminant)}) ⁄ ${fmt(2 * a)} → x = ${fmt(root1, 4)} or x = ${fmt(root2, 4)}`,
        });
      } else {
        steps.push({
          title: "Set y = 0 for the roots",
          math: `Δ = ${fmt(discriminant)} < 0, so the curve never crosses the x-axis and there are no real roots`,
        });
      }
    } else {
      answer = `y-intercept ${fmt(d)}`;
      const integerRoots: number[] = [];
      for (let x = Math.min(from, -12); x <= Math.max(to, 12); x += 1) {
        if (Math.abs(evaluate(x)) < 1e-9) integerRoots.push(x);
      }
      if (integerRoots.length) {
        extras.push(`integer roots: x = ${integerRoots.join(", ")}`);
        steps.push({ title: "Find where the curve crosses the x-axis", math: `y = 0 at x = ${integerRoots.join(", ")}` });
      } else {
        steps.push({ title: "Crossings of the x-axis", detail: "There are no integer roots in this range — read them off the plot." });
      }
      steps.push({ title: "The y-intercept is the constant term", math: `x = 0 → y = ${fmt(d)}` });
    }

    return {
      ok: true,
      output: {
        answer,
        extras,
        steps,
        tables: [table],
        chart: {
          xLabel: "x",
          yLabel: "y",
          series: [{ label: "y", points }],
        },
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. Formula Reference Sheet                                         */
/* ------------------------------------------------------------------ */

const formulaSheet: ExplorerTool = {
  kind: "explorer",
  name: "Formula Reference Sheet",
  summary: "Every IGCSE Maths formula, organised by topic and ready to copy.",
  topics: [
    {
      id: "number",
      name: "Number",
      summary: "Percentages, ratio, standard form and the index laws.",
      mono: [
        "percentage change = (change ÷ original) × 100",
        "compound interest: A = P(1 + r/100)ⁿ",
        "simple interest: I = PRT/100",
        "standard form: A × 10ⁿ where 1 ≤ A < 10",
        "aᵐ × aⁿ = aᵐ⁺ⁿ;  aᵐ ÷ aⁿ = aᵐ⁻ⁿ;  (aᵐ)ⁿ = aᵐⁿ",
        "a⁰ = 1;  a⁻ⁿ = 1/aⁿ;  a^(1/2) = √a",
        "ratio: share = amount ÷ total parts × part",
      ],
    },
    {
      id: "algebra",
      name: "Algebra",
      summary: "Expanding, factorising, solving and rearranging.",
      mono: [
        "quadratic formula: x = (−b ± √(b² − 4ac)) / 2a",
        "discriminant: Δ = b² − 4ac",
        "completing the square: a(x + b/2a)² + c − b²/4a",
        "(a + b)² = a² + 2ab + b²",
        "(a − b)² = a² − 2ab + b²",
        "a² − b² = (a + b)(a − b)",
        "nth term (arithmetic): a + (n − 1)d",
        "direct proportion: y = kx;  inverse: y = k/x",
      ],
    },
    {
      id: "geometry",
      name: "Geometry & measures",
      summary: "Area, volume, circles and angles.",
      mono: [
        "circle: A = πr², C = 2πr",
        "arc length = (θ/360) × 2πr",
        "sector area = (θ/360) × πr²",
        "cylinder: V = πr²h",
        "cone: V = ⅓πr²h",
        "sphere: V = 4/3 πr³",
        "prism: V = area of cross-section × length",
        "density: ρ = m/V",
        "angle sum of a polygon = (n − 2) × 180°",
      ],
    },
    {
      id: "trigonometry",
      name: "Trigonometry",
      summary: "Right-angled and non-right-angled triangles.",
      mono: [
        "Pythagoras: a² + b² = c²",
        "sin θ = O/H,  cos θ = A/H,  tan θ = O/A",
        "sine rule: a/sin A = b/sin B = c/sin C",
        "cosine rule: a² = b² + c² − 2bc cos A",
        "cos A = (b² + c² − a²) / 2bc",
        "area of a triangle = ½ab sin C",
        "exact values: sin 30° = ½, cos 60° = ½, tan 45° = 1",
      ],
    },
    {
      id: "probability",
      name: "Probability",
      summary: "Single, combined and conditional probability.",
      mono: [
        "P(A′) = 1 − P(A)",
        "P(A and B) = P(A) × P(B) for independent events",
        "P(A or B) = P(A) + P(B) for mutually exclusive events",
        "P(A or B) = P(A) + P(B) − P(A ∩ B)",
        "expected number of successes = probability × number of trials",
      ],
    },
    {
      id: "statistics",
      name: "Statistics",
      summary: "Averages, spread and correlation.",
      mono: [
        "mean = Σx / n",
        "median = middle value of the ordered list",
        "mode = most frequent value",
        "range = largest − smallest",
        "interquartile range = UQ − LQ",
        "standard deviation: σ = √(Σ(x − x̄)² / n)",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 21. Worksheet Generator                                             */
/* ------------------------------------------------------------------ */

const mathsBank: QuestionBank = {
  surds: (rng) => {
    const n = pick(rng, [8, 12, 18, 20, 24, 27, 32, 45, 48, 50, 72, 98]);
    const { a, b } = simplifySurd(n);
    const answer = surdText(a, b);
    return {
      prompt: `Simplify √${n}`,
      answer,
      working: `√${n} = √(${a * a} × ${b}) = ${answer}`,
    };
  },
  standardForm: (rng) => {
    const value = pick(rng, [0.0034, 0.0000062, 45000, 128000, 0.075, 9200000]);
    const { mantissa, exponent } = toStandardForm(value);
    return {
      prompt: `Write ${value} in standard form`,
      answer: `${mantissa} × 10^${exponent}`,
      working: `Move the decimal point so the mantissa is between 1 and 10.`,
    };
  },
  percentages: (rng) => {
    const amount = randInt(rng, 40, 480);
    const pct = pick(rng, [15, 20, 35, 42, 8, 65]);
    const answer = (amount * pct) / 100;
    return {
      prompt: `Find ${pct}% of ${amount}`,
      answer: String(answer),
      working: `${pct}% = ${pct}/100, so ${amount} × ${pct}/100 = ${answer}`,
    };
  },
  ratio: (rng) => {
    const a = randInt(rng, 2, 7);
    const b = randInt(rng, 2, 7);
    const unit = randInt(rng, 4, 25);
    const total = (a + b) * unit;
    return {
      prompt: `Share ${total} in the ratio ${a}:${b}`,
      answer: `${a * unit} and ${b * unit}`,
      working: `${a} + ${b} = ${a + b} parts, one part = ${total} ÷ ${a + b} = ${unit}`,
    };
  },
  solveLinear: (rng) => {
    const a = randInt(rng, 2, 9);
    const x = randInt(rng, -8, 12);
    const b = randInt(rng, -12, 12);
    const c = a * x + b;
    return {
      prompt: `Solve ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}`,
      answer: `x = ${x}`,
      working: `${a}x = ${c} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${c - b}, x = ${c - b} ÷ ${a} = ${x}`,
    };
  },
  factorise: (rng) => {
    const r1 = randInt(rng, -9, 9);
    const r2 = randInt(rng, -9, 9);
    const b = -(r1 + r2);
    const c = r1 * r2;
    return {
      prompt: `Factorise x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${c < 0 ? "−" : "+"} ${Math.abs(c)}`,
      answer: `(x ${r1 < 0 ? "+" : "−"} ${Math.abs(r1)})(x ${r2 < 0 ? "+" : "−"} ${Math.abs(r2)})`,
      working: `Two numbers that multiply to ${c} and add to ${-b}: ${-r1} and ${-r2}`,
    };
  },
  simultaneous: (rng) => {
    const x = randInt(rng, -6, 8);
    const y = randInt(rng, -6, 8);
    const a1 = randInt(rng, 1, 5);
    const b1 = randInt(rng, 1, 5);
    const a2 = randInt(rng, 1, 5);
    const b2 = -randInt(rng, 1, 5);
    return {
      prompt: `Solve ${a1}x + ${b1}y = ${a1 * x + b1 * y} and ${a2}x − ${Math.abs(b2)}y = ${a2 * x + b2 * y}`,
      answer: `x = ${x}, y = ${y}`,
      working: `Eliminate y, then substitute back to find the other unknown.`,
    };
  },
  sequences: (rng) => {
    const a = randInt(rng, 2, 12);
    const d = randInt(rng, 2, 9);
    const n = randInt(rng, 8, 25);
    return {
      prompt: `The sequence starts ${a}, ${a + d}, ${a + 2 * d}. Find the ${n}th term.`,
      answer: String(a + (n - 1) * d),
      working: `nth term = ${d}n + ${a - d}, so term ${n} = ${a + (n - 1) * d}`,
    };
  },
  trigonometry: (rng) => {
    const angle = randInt(rng, 20, 70);
    const hypotenuse = randInt(rng, 6, 20);
    const answer = hypotenuse * Math.sin((angle * Math.PI) / 180);
    return {
      prompt: `In a right-angled triangle the hypotenuse is ${hypotenuse} cm and one angle is ${angle}°. Find the opposite side.`,
      answer: `${answer.toFixed(3)} cm`,
      working: `opposite = hypotenuse × sin θ = ${hypotenuse} × sin ${angle}° = ${answer.toFixed(3)}`,
    };
  },
  probability: (rng) => {
    const red = randInt(rng, 2, 9);
    const blue = randInt(rng, 2, 9);
    const total = red + blue;
    return {
      prompt: `A bag has ${red} red and ${blue} blue counters. Find P(red), then P(not red).`,
      answer: `${red}/${total} and ${blue}/${total}`,
      working: `P(red) = ${red}/${total}; P(not red) = 1 − ${red}/${total} = ${blue}/${total}`,
    };
  },
  statistics: (rng) => {
    const data = Array.from({ length: 7 }, () => randInt(rng, 3, 25));
    const sum = data.reduce((total, value) => total + value, 0);
    const mean = sum / data.length;
    const sorted = [...data].sort((a, b) => a - b);
    return {
      prompt: `Find the mean, median and range of ${data.join(", ")}`,
      answer: `mean = ${mean.toFixed(2)}, median = ${sorted[3]}, range = ${sorted[6] - sorted[0]}`,
      working: `Σx = ${sum}, n = 7, mean = ${mean.toFixed(2)}`,
    };
  },
};

const MATHS_BANK_LABELS: [string, string][] = [
  ["surds", "Surds"],
  ["standardForm", "Standard form"],
  ["percentages", "Percentages"],
  ["ratio", "Ratio"],
  ["solveLinear", "Solving linear equations"],
  ["factorise", "Factorising quadratics"],
  ["simultaneous", "Simultaneous equations"],
  ["sequences", "Sequences"],
  ["trigonometry", "Trigonometry"],
  ["probability", "Probability"],
  ["statistics", "Statistics"],
];

const worksheet: CalcTool = {
  kind: "calc",
  name: "Worksheet Generator",
  summary: "Build a topic-based practice paper with a full answer key and working.",
  fields: [
    {
      id: "topic",
      label: "Topic",
      type: "select",
      defaultValue: "surds",
      options: MATHS_BANK_LABELS.map(([value, label]) => ({ value, label })),
    },
    countField("8"),
    seedField("1"),
  ],
  solve(values: Values): SolveOutcome {
    const topic = str(values, "topic");
    const count = clampCount(num(values, "count"));
    const seed = Number.isFinite(num(values, "seed")) ? num(values, "seed") : 1;
    const label = MATHS_BANK_LABELS.find(([key]) => key === topic)?.[1] ?? topic;
    const questions = buildPaper(mathsBank, topic, count, mulberry32(seed));
    if (questions.length === 0) return fail("Pick a topic to generate questions.");

    return {
      ok: true,
      output: {
        answer: `${questions.length} questions on ${label}`,
        steps: [
          { title: "Choose the topic and the number of questions", math: `${label} · ${questions.length} questions` },
          { title: "Generate the paper from the seed", math: `seed = ${seed} (change it for a fresh paper on the same topic)` },
          { title: "Every question comes with its answer and the working", detail: "Use the answer key below to mark your attempt." },
        ],
        tables: paperTables(questions, label),
        note: "Print or copy the question table, work through it, then check the answer key.",
      },
    };
  },
};

export const MATHS_TOOLS: ToolDefinition[] = [
  surds,
  standardForm,
  fdp,
  ratio,
  compound,
  quadratic,
  simultaneous,
  inequalities,
  sequences,
  sohcahtoa,
  sineCosine,
  circleTheorems,
  vectors,
  bearings,
  similar,
  sets,
  probability,
  statistics,
  graph,
  formulaSheet,
  worksheet,
];
