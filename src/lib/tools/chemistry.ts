import {
  fail,
  fmt,
  gcd,
  mulberry32,
  num,
  parseNumbers,
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
/* Formula parsing (shared by the balancer and moles tools)            */
/* ------------------------------------------------------------------ */

function parseFormula(input: string): Record<string, number> | null {
  const s = input.replace(/\s+/g, "");
  if (!s) return null;
  let i = 0;
  const stack: Record<string, number>[] = [{}];

  const readNumber = () => {
    let digits = "";
    while (i < s.length && /\d/.test(s[i])) {
      digits += s[i];
      i += 1;
    }
    return digits ? parseInt(digits, 10) : 1;
  };

  while (i < s.length) {
    const ch = s[i];
    if (ch === "(" || ch === "[") {
      i += 1;
      stack.push({});
    } else if (ch === ")" || ch === "]") {
      i += 1;
      const multiplier = readNumber();
      const group = stack.pop();
      if (!group || stack.length === 0) return null;
      const parent = stack[stack.length - 1];
      for (const [element, count] of Object.entries(group)) {
        parent[element] = (parent[element] ?? 0) + count * multiplier;
      }
    } else if (/[A-Z]/.test(ch)) {
      i += 1;
      let element = ch;
      while (i < s.length && /[a-z]/.test(s[i])) {
        element += s[i];
        i += 1;
      }
      const count = readNumber();
      const current = stack[stack.length - 1];
      current[element] = (current[element] ?? 0) + count;
    } else {
      return null;
    }
  }

  if (stack.length !== 1) return null;
  return stack[0];
}

/* ------------------------------------------------------------------ */
/* 1. Mole & Molar Mass Calculator                                     */
/* ------------------------------------------------------------------ */

const ATOMIC_MASS: Record<string, number> = {
  H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20,
  Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39,
  Ca: 40, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137,
};

function molarMass(formula: string): number | null {
  const counts = parseFormula(formula);
  if (!counts) return null;
  let total = 0;
  for (const [element, count] of Object.entries(counts)) {
    const mass = ATOMIC_MASS[element];
    if (mass === undefined) return null;
    total += mass * count;
  }
  return total;
}

const mole: CalcTool = {
  kind: "calc",
  name: "Mole & Molar Mass Calculator",
  summary: "Find moles, mass or relative formula mass from any of the others.",
  formula: "moles = mass ÷ Mr   ·   n = m / Mr",
  fields: [
    {
      id: "mode",
      label: "What do you want to find?",
      type: "select",
      defaultValue: "moles",
      options: [
        { value: "moles", label: "Moles (from mass and Mr)" },
        { value: "mass", label: "Mass (from moles and Mr)" },
        { value: "mr", label: "Mr of a formula (from its formula)" },
        { value: "particles", label: "Number of particles (from moles)" },
      ],
    },
    { id: "formula", label: "Formula (optional)", type: "text", defaultValue: "H2O" },
    { id: "mass", label: "Mass (g)", type: "number", defaultValue: "36" },
    { id: "mr", label: "Mr", type: "number", defaultValue: "18" },
    { id: "moles", label: "Moles (mol)", type: "number", defaultValue: "2" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const formula = str(values, "formula");
    const AVOGADRO = 6.02e23;

    if (mode === "mr") {
      if (!formula) return fail("Enter a formula such as H2O or Ca(OH)2.");
      const mr = molarMass(formula);
      if (mr === null) return fail("That formula could not be read. Check the element symbols and brackets.");
      const counts = parseFormula(formula) ?? {};
      const parts = Object.entries(counts)
        .map(([element, count]) => `${element} ×${count} (${ATOMIC_MASS[element]})`)
        .join(" + ");
      return {
        ok: true,
        output: {
          answer: `Mr = ${fmt(mr, 2)}`,
          answerLabel: "Relative formula mass",
          steps: [
            { title: "Find each element's relative atomic mass", math: parts },
            { title: "Add the contributions", math: `Mr = ${fmt(mr, 2)}` },
          ],
        },
      };
    }

    const formulaMr = formula ? molarMass(formula) : null;
    const mrValue = formulaMr ?? Number(str(values, "mr"));

    if (mode === "moles") {
      const mass = num(values, "mass");
      const error = requireNumbers([
        { label: "Mass", value: mass },
        { label: "Mr", value: mrValue },
      ]);
      if (error) return fail(error);
      if (mrValue === 0) return fail("Mr must not be zero.");
      const moles = mass / mrValue;
      return {
        ok: true,
        output: {
          answer: `${fmt(moles, 4)} mol`,
          answerLabel: "Moles",
          steps: [
            { title: "Use n = m ÷ Mr", math: `n = ${fmt(mass, 2)} ÷ ${fmt(mrValue, 2)}` },
            { title: "Evaluate", math: `n = ${fmt(moles, 4)} mol` },
          ],
        },
      };
    }

    if (mode === "mass") {
      const mol = num(values, "moles");
      const error = requireNumbers([
        { label: "Moles", value: mol },
        { label: "Mr", value: mrValue },
      ]);
      if (error) return fail(error);
      const mass = mol * mrValue;
      return {
        ok: true,
        output: {
          answer: `${fmt(mass, 3)} g`,
          answerLabel: "Mass",
          steps: [
            { title: "Rearrange n = m ÷ Mr to m = n × Mr", math: `m = ${fmt(mol, 3)} × ${fmt(mrValue, 2)}` },
            { title: "Evaluate", math: `m = ${fmt(mass, 3)} g` },
          ],
        },
      };
    }

    const mol = num(values, "moles");
    const error = requireNumbers([{ label: "Moles", value: mol }]);
    if (error) return fail(error);
    const particles = mol * AVOGADRO;
    return {
      ok: true,
      output: {
        answer: `${particles.toExponential(3)} particles`,
        answerLabel: "Number of particles",
        steps: [
          { title: "Multiply moles by Avogadro's number", math: `N = ${fmt(mol, 3)} × 6.02 × 10²³` },
          { title: "Evaluate", math: `N = ${particles.toExponential(3)}` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. Equation Balancer                                                */
/* ------------------------------------------------------------------ */

const balancer: CalcTool = {
  kind: "calc",
  name: "Equation Balancer",
  summary: "Balance a chemical equation and show the mole ratio.",
  formula: "atoms of each element must match on both sides",
  fields: [
    {
      id: "equation",
      label: "Equation",
      type: "text",
      defaultValue: "Fe + O2 -> Fe2O3",
      hint: "Use + between formulas and -> between sides.",
    },
  ],
  solve(values: Values): SolveOutcome {
    const raw = str(values, "equation").replace(/[=]/g, "->");
    if (!raw.includes("->")) return fail("Use -> to separate the reactants from the products.");
    const [left, right] = raw.split("->");
    const reactants = left.split("+").map((part) => part.trim()).filter(Boolean);
    const products = right.split("+").map((part) => part.trim()).filter(Boolean);
    const species = [...reactants, ...products];
    if (species.length < 2) return fail("Enter at least one reactant and one product.");
    if (species.length > 5) return fail("Keep the balancer to five species or fewer.");

    const counts = species.map((formula) => parseFormula(formula));
    if (counts.some((count) => count === null)) {
      return fail("One of the formulas could not be read. Check the brackets and symbols.");
    }
    const maps = counts as Record<string, number>[];
    const elements = [...new Set(maps.flatMap((map) => Object.keys(map)))];

    const sign = (index: number) => (index < reactants.length ? 1 : -1);
    const balances = (coeffs: number[]) =>
      elements.every((element) => {
        let total = 0;
        maps.forEach((map, index) => {
          total += sign(index) * (map[element] ?? 0) * coeffs[index];
        });
        return total === 0;
      });

    const limit = species.length <= 4 ? 20 : 12;
    const found: number[] | null = null;
    let solution: number[] | null = found;

    const search = (depth: number, current: number[]) => {
      if (solution) return;
      if (depth === species.length) {
        if (balances(current)) solution = [...current];
        return;
      }
      for (let value = 1; value <= limit && !solution; value += 1) {
        current.push(value);
        search(depth + 1, current);
        current.pop();
      }
    };
    search(0, []);

    if (!solution) {
      return fail("Could not balance that equation. Check the formulas or try a simpler reaction.");
    }

    const coefficients: number[] = solution;
    let divisor = coefficients[0];
    for (const value of coefficients) divisor = gcd(divisor, value);
    const simplified = coefficients.map((value) => value / divisor);

    const format = (index: number) =>
      `${simplified[index] === 1 ? "" : simplified[index]}${species[index]}`;
    const balanced = `${reactants.map((_, index) => format(index)).join(" + ")} → ${products
      .map((_, index) => format(index + reactants.length))
      .join(" + ")}`;

    const steps: WorkStep[] = [
      { title: "Write a coefficient in front of each formula", math: species.join(" + ") },
    ];
    for (const element of elements) {
      const parts = maps
        .map((map, index) => (map[element] ? `${sign(index) === 1 ? "" : "−"}${map[element] * simplified[index]}` : null))
        .filter(Boolean);
      steps.push({
        title: `Balance the ${element} atoms`,
        math: `${parts.join(" + ")} = 0`,
      });
    }
    steps.push({ title: "Divide by the highest common factor", math: `coefficients ÷ ${divisor} = ${simplified.join(" : ")}` });
    steps.push({ title: "Balanced equation", math: balanced });

    return {
      ok: true,
      output: {
        answer: balanced,
        answerLabel: "Balanced equation",
        extras: [`mole ratio ${simplified.join(" : ")}`],
        steps,
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. Reacting Masses Solver                                           */
/* ------------------------------------------------------------------ */

const reactingMasses: CalcTool = {
  kind: "calc",
  name: "Reacting Masses Solver",
  summary: "Mass–mole–mass calculations between two substances, fully worked.",
  formula: "mass B = (mass A ÷ Mr A) × (ratio B ÷ ratio A) × Mr B",
  fields: [
    { id: "massA", label: "Mass of A (g)", type: "number", defaultValue: "4" },
    { id: "mrA", label: "Mr of A", type: "number", defaultValue: "2" },
    { id: "ratioA", label: "Mole ratio of A", type: "number", defaultValue: "1" },
    { id: "mrB", label: "Mr of B", type: "number", defaultValue: "18" },
    { id: "ratioB", label: "Mole ratio of B", type: "number", defaultValue: "2" },
  ],
  solve(values: Values): SolveOutcome {
    const massA = num(values, "massA");
    const mrA = num(values, "mrA");
    const ratioA = num(values, "ratioA");
    const mrB = num(values, "mrB");
    const ratioB = num(values, "ratioB");
    const error = requireNumbers([
      { label: "Mass of A", value: massA },
      { label: "Mr of A", value: mrA },
      { label: "Mole ratio of A", value: ratioA },
      { label: "Mr of B", value: mrB },
      { label: "Mole ratio of B", value: ratioB },
    ]);
    if (error) return fail(error);
    if (mrA === 0 || ratioA === 0) return fail("Mr and ratio of A must not be zero.");
    const molesA = massA / mrA;
    const molesB = (molesA * ratioB) / ratioA;
    const massB = molesB * mrB;
    return {
      ok: true,
      output: {
        answer: `${fmt(massB, 3)} g`,
        answerLabel: "Mass of B",
        extras: [`moles A = ${fmt(molesA, 4)} mol`, `moles B = ${fmt(molesB, 4)} mol`],
        steps: [
          { title: "Convert the mass of A to moles", math: `n(A) = ${fmt(massA, 3)} ÷ ${fmt(mrA, 3)} = ${fmt(molesA, 4)} mol` },
          { title: "Use the mole ratio from the equation", math: `n(B) = ${fmt(molesA, 4)} × ${fmt(ratioB)} ÷ ${fmt(ratioA)} = ${fmt(molesB, 4)} mol` },
          { title: "Convert moles of B to mass", math: `m(B) = ${fmt(molesB, 4)} × ${fmt(mrB, 3)} = ${fmt(massB, 3)} g` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. Concentration & Dilution                                         */
/* ------------------------------------------------------------------ */

const concentration: CalcTool = {
  kind: "calc",
  name: "Concentration & Dilution",
  summary: "Find concentration, moles or volume, and work out dilution factors.",
  formula: "c = n ÷ V   ·   c₁V₁ = c₂V₂",
  fields: [
    {
      id: "mode",
      label: "Calculation",
      type: "select",
      defaultValue: "concentration",
      options: [
        { value: "concentration", label: "Concentration from moles and volume" },
        { value: "moles", label: "Moles from concentration and volume" },
        { value: "volume", label: "Volume from moles and concentration" },
        { value: "dilution", label: "Dilution (c₁V₁ = c₂V₂)" },
      ],
    },
    { id: "moles", label: "Moles (mol)", type: "number", defaultValue: "0.5" },
    { id: "volume", label: "Volume (dm³)", type: "number", defaultValue: "2" },
    { id: "conc", label: "Concentration (mol/dm³)", type: "number", defaultValue: "0.25" },
    { id: "c1", label: "c₁ — stock concentration", type: "number", defaultValue: "2" },
    { id: "v1", label: "V₁ — stock volume (dm³)", type: "number", defaultValue: "0.1" },
    { id: "v2", label: "V₂ — final volume (dm³)", type: "number", defaultValue: "0.5" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "concentration") {
      const mol = num(values, "moles");
      const volume = num(values, "volume");
      const error = requireNumbers([
        { label: "Moles", value: mol },
        { label: "Volume", value: volume },
      ]);
      if (error) return fail(error);
      if (volume === 0) return fail("Volume must not be zero.");
      const result = mol / volume;
      return {
        ok: true,
        output: {
          answer: `${fmt(result, 4)} mol/dm³`,
          answerLabel: "Concentration",
          steps: [
            { title: "Use c = n ÷ V", math: `c = ${fmt(mol, 4)} ÷ ${fmt(volume, 4)}` },
            { title: "Evaluate", math: `c = ${fmt(result, 4)} mol/dm³` },
          ],
        },
      };
    }

    if (mode === "moles") {
      const conc = num(values, "conc");
      const volume = num(values, "volume");
      const error = requireNumbers([
        { label: "Concentration", value: conc },
        { label: "Volume", value: volume },
      ]);
      if (error) return fail(error);
      const result = conc * volume;
      return {
        ok: true,
        output: {
          answer: `${fmt(result, 4)} mol`,
          answerLabel: "Moles",
          steps: [
            { title: "Rearrange to n = c × V", math: `n = ${fmt(conc, 4)} × ${fmt(volume, 4)}` },
            { title: "Evaluate", math: `n = ${fmt(result, 4)} mol` },
          ],
        },
      };
    }

    if (mode === "volume") {
      const mol = num(values, "moles");
      const conc = num(values, "conc");
      const error = requireNumbers([
        { label: "Moles", value: mol },
        { label: "Concentration", value: conc },
      ]);
      if (error) return fail(error);
      if (conc === 0) return fail("Concentration must not be zero.");
      const result = mol / conc;
      return {
        ok: true,
        output: {
          answer: `${fmt(result, 4)} dm³`,
          answerLabel: "Volume",
          steps: [
            { title: "Rearrange to V = n ÷ c", math: `V = ${fmt(mol, 4)} ÷ ${fmt(conc, 4)}` },
            { title: "Evaluate", math: `V = ${fmt(result, 4)} dm³ = ${fmt(result * 1000, 1)} cm³` },
          ],
        },
      };
    }

    const c1 = num(values, "c1");
    const v1 = num(values, "v1");
    const v2 = num(values, "v2");
    const error = requireNumbers([
      { label: "c₁", value: c1 },
      { label: "V₁", value: v1 },
      { label: "V₂", value: v2 },
    ]);
    if (error) return fail(error);
    if (v2 === 0) return fail("The final volume must not be zero.");
    const c2 = (c1 * v1) / v2;
    return {
      ok: true,
      output: {
        answer: `${fmt(c2, 4)} mol/dm³`,
        answerLabel: "Diluted concentration",
        extras: [`dilution factor = ${fmt(v2 / v1, 3)}`],
        steps: [
          { title: "Use c₁V₁ = c₂V₂", math: `${fmt(c1)} × ${fmt(v1)} = c₂ × ${fmt(v2)}` },
          { title: "Rearrange for c₂", math: `c₂ = ${fmt(c1 * v1, 4)} ÷ ${fmt(v2, 4)} = ${fmt(c2, 4)} mol/dm³` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. Titration Calculator                                             */
/* ------------------------------------------------------------------ */

const titration: CalcTool = {
  kind: "calc",
  name: "Titration Calculator",
  summary: "Use titration results and the equation ratio to find a concentration.",
  formula: "c_A V_A / n_A = c_B V_B / n_B",
  fields: [
    { id: "cKnown", label: "Known concentration (mol/dm³)", type: "number", defaultValue: "0.1" },
    { id: "vKnown", label: "Known volume (cm³)", type: "number", defaultValue: "25" },
    { id: "ratioKnown", label: "Mole ratio of known", type: "number", defaultValue: "1" },
    { id: "vUnknown", label: "Unknown volume (cm³)", type: "number", defaultValue: "20" },
    { id: "ratioUnknown", label: "Mole ratio of unknown", type: "number", defaultValue: "1" },
  ],
  solve(values: Values): SolveOutcome {
    const cKnown = num(values, "cKnown");
    const vKnown = num(values, "vKnown");
    const rKnown = num(values, "ratioKnown");
    const vUnknown = num(values, "vUnknown");
    const rUnknown = num(values, "ratioUnknown");
    const error = requireNumbers([
      { label: "Known concentration", value: cKnown },
      { label: "Known volume", value: vKnown },
      { label: "Known ratio", value: rKnown },
      { label: "Unknown volume", value: vUnknown },
      { label: "Unknown ratio", value: rUnknown },
    ]);
    if (error) return fail(error);
    if (vUnknown === 0 || rKnown === 0) return fail("Volumes and ratios must not be zero.");
    // Convert cm³ to dm³ by dividing by 1000 (cancels through the formula).
    const molesKnown = (cKnown * vKnown) / 1000;
    const molesUnknown = (molesKnown * rUnknown) / rKnown;
    const cUnknown = molesUnknown / (vUnknown / 1000);
    return {
      ok: true,
      output: {
        answer: `${fmt(cUnknown, 4)} mol/dm³`,
        answerLabel: "Unknown concentration",
        extras: [`moles of known = ${fmt(molesKnown, 5)} mol`],
        steps: [
          { title: "Convert the known volume to dm³", math: `${fmt(vKnown)} cm³ ÷ 1000 = ${fmt(vKnown / 1000, 4)} dm³` },
          { title: "Find the moles of the known solution", math: `n = ${fmt(cKnown, 4)} × ${fmt(vKnown / 1000, 4)} = ${fmt(molesKnown, 5)} mol` },
          { title: "Use the mole ratio", math: `n(unknown) = ${fmt(molesKnown, 5)} × ${fmt(rUnknown)} ÷ ${fmt(rKnown)} = ${fmt(molesUnknown, 5)} mol` },
          { title: "Divide by the unknown volume", math: `c = ${fmt(molesUnknown, 5)} ÷ ${fmt(vUnknown / 1000, 4)} = ${fmt(cUnknown, 4)} mol/dm³` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. Gas Volume Calculator                                            */
/* ------------------------------------------------------------------ */

const gasVolume: CalcTool = {
  kind: "calc",
  name: "Gas Volume Calculator",
  summary: "Convert between moles and gas volume at room temperature and pressure.",
  formula: "volume (dm³) = moles × 24   (at RTP)",
  fields: [
    {
      id: "mode",
      label: "Find",
      type: "select",
      defaultValue: "volume",
      options: [
        { value: "volume", label: "Volume from moles" },
        { value: "moles", label: "Moles from volume" },
      ],
    },
    { id: "moles", label: "Moles (mol)", type: "number", defaultValue: "0.25" },
    { id: "volume", label: "Volume (dm³)", type: "number", defaultValue: "6" },
    {
      id: "molar",
      label: "Molar gas volume (dm³/mol)",
      type: "select",
      defaultValue: "24",
      options: [
        { value: "24", label: "24 dm³/mol (RTP)" },
        { value: "22.4", label: "22.4 dm³/mol (STP)" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const molar = Number(str(values, "molar"));
    if (mode === "volume") {
      const mol = num(values, "moles");
      const error = requireNumbers([{ label: "Moles", value: mol }]);
      if (error) return fail(error);
      const volume = mol * molar;
      return {
        ok: true,
        output: {
          answer: `${fmt(volume, 4)} dm³`,
          answerLabel: "Gas volume",
          extras: [`= ${fmt(volume * 1000, 1)} cm³`],
          steps: [
            { title: "Multiply moles by the molar gas volume", math: `V = ${fmt(mol, 4)} × ${molar}` },
            { title: "Evaluate", math: `V = ${fmt(volume, 4)} dm³` },
          ],
        },
      };
    }
    const volume = num(values, "volume");
    const error = requireNumbers([{ label: "Volume", value: volume }]);
    if (error) return fail(error);
    const mol = volume / molar;
    return {
      ok: true,
      output: {
        answer: `${fmt(mol, 5)} mol`,
        answerLabel: "Moles",
        steps: [
          { title: "Divide the volume by the molar gas volume", math: `n = ${fmt(volume, 4)} ÷ ${molar}` },
          { title: "Evaluate", math: `n = ${fmt(mol, 5)} mol` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. Percentage Yield                                                 */
/* ------------------------------------------------------------------ */

const percentageYield: CalcTool = {
  kind: "calc",
  name: "Percentage Yield",
  summary: "Compare the actual yield with the theoretical yield.",
  formula: "% yield = (actual ÷ theoretical) × 100",
  fields: [
    { id: "actual", label: "Actual yield (g)", type: "number", defaultValue: "15" },
    { id: "theoretical", label: "Theoretical yield (g)", type: "number", defaultValue: "20" },
  ],
  solve(values: Values): SolveOutcome {
    const actual = num(values, "actual");
    const theoretical = num(values, "theoretical");
    const error = requireNumbers([
      { label: "Actual yield", value: actual },
      { label: "Theoretical yield", value: theoretical },
    ]);
    if (error) return fail(error);
    if (theoretical === 0) return fail("The theoretical yield must not be zero.");
    const percent = (actual / theoretical) * 100;
    return {
      ok: true,
      output: {
        answer: `${fmt(percent, 2)}%`,
        answerLabel: "Percentage yield",
        extras: [`lost: ${fmt(theoretical - actual, 3)} g`],
        steps: [
          { title: "Divide the actual yield by the theoretical yield", math: `${fmt(actual, 3)} ÷ ${fmt(theoretical, 3)} = ${fmt(actual / theoretical, 4)}` },
          { title: "Multiply by 100", math: `${fmt(actual / theoretical, 4)} × 100 = ${fmt(percent, 2)}%` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. Atom Economy                                                     */
/* ------------------------------------------------------------------ */

const atomEconomy: CalcTool = {
  kind: "calc",
  name: "Atom Economy",
  summary: "Work out how much of the reactant mass ends up in the useful product.",
  formula: "% atom economy = (Mr of useful product ÷ total Mr of reactants) × 100",
  fields: [
    { id: "productMr", label: "Mr of useful product", type: "number", defaultValue: "44" },
    { id: "reactantTotal", label: "Total Mr of all reactants", type: "number", defaultValue: "60" },
  ],
  solve(values: Values): SolveOutcome {
    const productMr = num(values, "productMr");
    const reactantTotal = num(values, "reactantTotal");
    const error = requireNumbers([
      { label: "Mr of product", value: productMr },
      { label: "Total Mr of reactants", value: reactantTotal },
    ]);
    if (error) return fail(error);
    if (reactantTotal === 0) return fail("The total reactant mass must not be zero.");
    const percent = (productMr / reactantTotal) * 100;
    return {
      ok: true,
      output: {
        answer: `${fmt(percent, 2)}%`,
        answerLabel: "Atom economy",
        extras: [`waste: ${fmt(reactantTotal - productMr, 3)} per formula unit`],
        steps: [
          { title: "Divide product Mr by reactant Mr", math: `${fmt(productMr)} ÷ ${fmt(reactantTotal)} = ${fmt(productMr / reactantTotal, 4)}` },
          { title: "Multiply by 100", math: `${fmt(productMr / reactantTotal, 4)} × 100 = ${fmt(percent, 2)}%` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. Empirical & Molecular Formula                                    */
/* ------------------------------------------------------------------ */

const empiricalFormula: CalcTool = {
  kind: "calc",
  name: "Empirical & Molecular Formula",
  summary: "Turn percentage composition into an empirical and molecular formula.",
  formula: "divide % by Ar → divide by the smallest → scale to whole numbers",
  fields: [
    {
      id: "composition",
      label: "Composition",
      type: "text",
      defaultValue: "Fe:70, O:30",
      hint: "element:percentage pairs separated by commas, e.g. C:40, H:6.7, O:53.3",
    },
    { id: "mr", label: "Molecular Mr (optional, 0 to skip)", type: "number", defaultValue: "0" },
  ],
  solve(values: Values): SolveOutcome {
    const raw = str(values, "composition");
    const pairs = raw.split(",").map((piece) => piece.trim()).filter(Boolean);
    if (!pairs.length) return fail("Enter element:percentage pairs, e.g. Fe:70, O:30.");
    const entries: { element: string; percent: number }[] = [];
    for (const pair of pairs) {
      const [element, percentRaw] = pair.split(":").map((part) => part.trim());
      const percent = Number(percentRaw);
      if (!element || !ATOMIC_MASS[element] || !Number.isFinite(percent)) {
        return fail(`Could not read "${pair}". Use element:percentage with a known symbol.`);
      }
      entries.push({ element, percent });
    }

    const ratios = entries.map((entry) => ({
      element: entry.element,
      moles: entry.percent / ATOMIC_MASS[entry.element],
    }));
    const smallest = Math.min(...ratios.map((ratio) => ratio.moles));
    const divided = ratios.map((ratio) => ratio.moles / smallest);
    // Scale by a multiplier to reach whole numbers.
    let multiplier = 1;
    for (const value of divided) {
      for (let m = 1; m <= 6; m += 1) {
        if (Math.abs(value * m - Math.round(value * m)) < 0.08) {
          multiplier = Math.max(multiplier, m);
          break;
        }
      }
    }
    const whole = divided.map((value) => Math.max(1, Math.round(value * multiplier)));

    const empirical = entries
      .map((entry, index) => `${entry.element}${whole[index] > 1 ? whole[index] : ""}`)
      .join("");
    const empiricalMass = entries.reduce(
      (total, entry, index) => total + ATOMIC_MASS[entry.element] * whole[index],
      0,
    );

    const mr = num(values, "mr");
    const steps: WorkStep[] = [
      {
        title: "Divide each percentage by its relative atomic mass",
        math: ratios.map((ratio) => `${ratio.element}: ${fmt(ratio.moles, 3)}`).join(", "),
      },
      {
        title: "Divide each result by the smallest",
        math: `${divided.map((value, index) => `${ratios[index].element}: ${fmt(value, 3)}`).join(", ")}`,
      },
      {
        title: `Scale to whole numbers (× ${multiplier})`,
        math: entries.map((entry, index) => `${entry.element}: ${whole[index]}`).join(", "),
      },
      { title: "Empirical formula", math: empirical },
    ];

    let answer = empirical;
    if (Number.isFinite(mr) && mr > 0) {
      const factor = mr / empiricalMass;
      const rounded = Math.max(1, Math.round(factor));
      const molecular = entries
        .map((entry, index) => `${entry.element}${whole[index] * rounded > 1 ? whole[index] * rounded : ""}`)
        .join("");
      steps.push({ title: "Compare Mr with the empirical mass", math: `Mr ÷ empirical mass = ${fmt(mr)} ÷ ${fmt(empiricalMass, 2)} = ${fmt(factor, 3)}` });
      steps.push({ title: "Multiply the formula by that factor", math: molecular });
      answer = molecular;
    }

    return {
      ok: true,
      output: {
        answer,
        answerLabel: Number.isFinite(mr) && mr > 0 ? "Molecular formula" : "Empirical formula",
        extras: [`empirical formula ${empirical}`, `empirical mass = ${fmt(empiricalMass, 2)}`],
        steps,
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. Periodic Table Explorer                                         */
/* ------------------------------------------------------------------ */

const periodic: ExplorerTool = {
  kind: "explorer",
  name: "Periodic Table Explorer",
  summary: "Original element data for the first 20 elements plus common metals.",
  topics: [
    {
      id: "first20",
      name: "First 20 elements",
      summary: "Symbol, atomic number and relative atomic mass.",
      table: {
        caption: "Elements 1–20",
        headers: ["Z", "Symbol", "Name", "Ar"],
        rows: [
          ["1", "H", "Hydrogen", "1"], ["2", "He", "Helium", "4"],
          ["3", "Li", "Lithium", "7"], ["4", "Be", "Beryllium", "9"],
          ["5", "B", "Boron", "11"], ["6", "C", "Carbon", "12"],
          ["7", "N", "Nitrogen", "14"], ["8", "O", "Oxygen", "16"],
          ["9", "F", "Fluorine", "19"], ["10", "Ne", "Neon", "20"],
          ["11", "Na", "Sodium", "23"], ["12", "Mg", "Magnesium", "24"],
          ["13", "Al", "Aluminium", "27"], ["14", "Si", "Silicon", "28"],
          ["15", "P", "Phosphorus", "31"], ["16", "S", "Sulfur", "32"],
          ["17", "Cl", "Chlorine", "35.5"], ["18", "Ar", "Argon", "40"],
          ["19", "K", "Potassium", "39"], ["20", "Ca", "Calcium", "40"],
        ],
      },
    },
    {
      id: "metals",
      name: "Common transition metals",
      summary: "Metals that turn up again and again in IGCSE questions.",
      table: {
        caption: "Transition metals",
        headers: ["Symbol", "Name", "Ar"],
        rows: [
          ["Fe", "Iron", "56"], ["Cu", "Copper", "63.5"],
          ["Zn", "Zinc", "65"], ["Ag", "Silver", "108"],
          ["Ba", "Barium", "137"],
        ],
      },
    },
    {
      id: "ions",
      name: "Common ions",
      summary: "Charges you must be able to recall for formula writing.",
      table: {
        caption: "Ion charges",
        headers: ["Ion", "Formula", "Charge"],
        rows: [
          ["Sodium", "Na⁺", "+1"], ["Magnesium", "Mg²⁺", "+2"],
          ["Aluminium", "Al³⁺", "+3"], ["Chloride", "Cl⁻", "−1"],
          ["Oxide", "O²⁻", "−2"], ["Hydroxide", "OH⁻", "−1"],
          ["Nitrate", "NO₃⁻", "−1"], ["Sulfate", "SO₄²⁻", "−2"],
          ["Carbonate", "CO₃²⁻", "−2"], ["Ammonium", "NH₄⁺", "+1"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 11. Bonding Diagram Builder                                         */
/* ------------------------------------------------------------------ */

const bonding: ExplorerTool = {
  kind: "explorer",
  name: "Bonding Diagram Builder",
  summary: "Dot-and-cross and structural diagrams explained with worked examples.",
  topics: [
    {
      id: "ionic",
      name: "Ionic bonding",
      summary: "Electrons are transferred from a metal to a non-metal.",
      mono: [
        "Na → Na⁺ + e⁻",
        "Cl + e⁻ → Cl⁻",
        "Na⁺ and Cl⁻ attract → giant ionic lattice",
      ],
      points: [
        "Metals lose electrons to form positive ions.",
        "Non-metals gain electrons to form negative ions.",
        "Draw square brackets around each ion with its charge.",
      ],
    },
    {
      id: "covalent",
      name: "Covalent bonding",
      summary: "Non-metal atoms share pairs of electrons.",
      mono: [
        "H• + •H → H:H   (single bond)",
        "O::O           (double bond)",
        "N:::N          (triple bond)",
      ],
      points: [
        "Show only the outer-shell electrons.",
        "One shared pair = single bond, two = double, three = triple.",
        "Each atom ends with a full outer shell.",
      ],
    },
    {
      id: "metallic",
      name: "Metallic bonding",
      summary: "Positive ions in a sea of delocalised electrons.",
      points: [
        "Explains why metals conduct electricity and heat.",
        "Explains malleability — layers of ions can slide.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 12. Electrolysis Calculator                                         */
/* ------------------------------------------------------------------ */

const electrolysis: ExplorerTool = {
  kind: "explorer",
  name: "Electrolysis Calculator",
  summary: "Products at each electrode for common electrolytes, with half-equations.",
  topics: [
    {
      id: "molten",
      name: "Molten compounds",
      summary: "With no water present the ions simply discharge.",
      table: {
        caption: "Molten electrolytes",
        headers: ["Electrolyte", "Cathode (−)", "Anode (+)"],
        rows: [
          ["Molten lead(II) bromide", "Lead (Pb)", "Bromine (Br₂)"],
          ["Molten sodium chloride", "Sodium (Na)", "Chlorine (Cl₂)"],
          ["Molten aluminium oxide", "Aluminium (Al)", "Oxygen (O₂)"],
        ],
      },
    },
    {
      id: "aqueous",
      name: "Aqueous solutions",
      summary: "Water competes, so the rules of discharge decide the products.",
      table: {
        caption: "Aqueous electrolytes",
        headers: ["Electrolyte", "Cathode (−)", "Anode (+)"],
        rows: [
          ["Dilute sulfuric acid", "Hydrogen (H₂)", "Oxygen (O₂)"],
          ["Copper(II) sulfate (inert electrodes)", "Copper (Cu)", "Oxygen (O₂)"],
          ["Brine (concentrated NaCl)", "Hydrogen (H₂)", "Chlorine (Cl₂)"],
        ],
      },
    },
    {
      id: "rules",
      name: "Rules of discharge",
      summary: "The order in which ions are released at each electrode.",
      points: [
        "Cathode: the least reactive metal ion is discharged (or hydrogen).",
        "Anode: halide ions are discharged before hydroxide; otherwise oxygen forms.",
        "Reactive metals (Na, K, Ca, Mg, Al) are never discharged from aqueous solution.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 13. pH & Indicator Tool                                             */
/* ------------------------------------------------------------------ */

const phTool: CalcTool = {
  kind: "calc",
  name: "pH & Indicator Tool",
  summary: "Find the pH of an acid or alkali and the colour each indicator shows.",
  formula: "pH = −log₁₀[H⁺]",
  fields: [
    {
      id: "mode",
      label: "Find pH from",
      type: "select",
      defaultValue: "hplus",
      options: [
        { value: "hplus", label: "Hydrogen ion concentration [H⁺] (mol/dm³)" },
        { value: "conc", label: "Acid concentration and strength" },
      ],
    },
    { id: "hplus", label: "[H⁺] (mol/dm³)", type: "number", defaultValue: "0.01" },
    { id: "conc", label: "Concentration (mol/dm³)", type: "number", defaultValue: "0.1" },
    {
      id: "strength",
      label: "Strength",
      type: "select",
      defaultValue: "strong",
      options: [
        { value: "strong", label: "Strong acid (fully dissociated)" },
        { value: "weak", label: "Weak acid (partly dissociated)" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    let hplus: number;
    let note = "";
    if (mode === "hplus") {
      hplus = num(values, "hplus");
      const error = requireNumbers([{ label: "[H⁺]", value: hplus }]);
      if (error) return fail(error);
    } else {
      const conc = num(values, "conc");
      const error = requireNumbers([{ label: "Concentration", value: conc }]);
      if (error) return fail(error);
      const strong = str(values, "strength") === "strong";
      hplus = strong ? conc : conc * 0.01;
      note = strong
        ? "A strong acid dissociates fully, so [H⁺] equals the acid concentration."
        : "A weak acid only partly dissociates — this uses an approximate [H⁺] for comparison.";
    }
    if (hplus <= 0) return fail("The concentration must be greater than zero.");
    const ph = -Math.log10(hplus);
    const acidic = ph < 7;
    return {
      ok: true,
      output: {
        answer: `pH = ${fmt(ph, 2)}`,
        answerLabel: "pH",
        extras: [acidic ? "acidic" : ph > 7 ? "alkaline" : "neutral", `[H⁺] = ${hplus.toExponential(2)} mol/dm³`],
        note,
        steps: [
          { title: "Take the hydrogen ion concentration", math: `[H⁺] = ${hplus.toExponential(2)} mol/dm³` },
          { title: "Use pH = −log₁₀[H⁺]", math: `pH = −log₁₀(${hplus.toExponential(2)})` },
          { title: "Evaluate", math: `pH = ${fmt(ph, 2)}` },
        ],
        tables: [
          {
            caption: "Indicator colours",
            headers: ["Indicator", "Acid colour", "Alkali colour"],
            rows: [
              ["Litmus", "Red", "Blue"],
              ["Methyl orange", "Red", "Yellow"],
              ["Phenolphthalein", "Colourless", "Pink"],
              ["Thymolphthalein", "Colourless", "Blue"],
            ],
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. Rates of Reaction                                               */
/* ------------------------------------------------------------------ */

const rates: ExplorerTool = {
  kind: "explorer",
  name: "Rates of Reaction",
  summary: "How concentration, temperature, surface area and catalysts change the rate.",
  topics: [
    {
      id: "collision",
      name: "Collision theory",
      summary: "Particles must collide with enough energy to react.",
      points: [
        "More frequent collisions → faster rate.",
        "More energetic collisions (above activation energy) → faster rate.",
        "A catalyst lowers the activation energy.",
      ],
    },
    {
      id: "factors",
      name: "Factors and their effect",
      summary: "Each factor changes the rate for a reason you must state.",
      table: {
        caption: "Factors affecting rate",
        headers: ["Factor", "Change", "Why the rate changes"],
        rows: [
          ["Concentration", "Increase", "More particles in the same volume → more collisions"],
          ["Pressure (gas)", "Increase", "Particles closer together → more collisions"],
          ["Temperature", "Increase", "Faster particles and more exceed the activation energy"],
          ["Surface area", "Increase (smaller pieces)", "More surface exposed for collisions"],
          ["Catalyst", "Add", "Lowers activation energy, so more collisions succeed"],
        ],
      },
    },
    {
      id: "graphs",
      name: "Reading rate graphs",
      summary: "The gradient of a mass (or volume) against time graph is the rate.",
      mono: [
        "steepest gradient = fastest rate",
        "curve flattens = reaction slowing",
        "flat line = reaction finished",
      ],
      points: [
        "Compare rates by comparing the initial gradients.",
        "The final plateau shows the same amount of product if the same mass was used.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 15. Energy Change Calculator                                        */
/* ------------------------------------------------------------------ */

const energyChange: CalcTool = {
  kind: "calc",
  name: "Energy Change Calculator",
  summary: "Find the enthalpy change from bond energies.",
  formula: "ΔH = energy of bonds broken − energy of bonds formed",
  fields: [
    { id: "broken", label: "Energy to break bonds (kJ/mol)", type: "number", defaultValue: "2648" },
    { id: "formed", label: "Energy released forming bonds (kJ/mol)", type: "number", defaultValue: "3450" },
  ],
  solve(values: Values): SolveOutcome {
    const broken = num(values, "broken");
    const formed = num(values, "formed");
    const error = requireNumbers([
      { label: "Bonds broken", value: broken },
      { label: "Bonds formed", value: formed },
    ]);
    if (error) return fail(error);
    const delta = broken - formed;
    const exothermic = delta < 0;
    return {
      ok: true,
      output: {
        answer: `ΔH = ${fmt(delta, 1)} kJ/mol`,
        answerLabel: "Enthalpy change",
        extras: [exothermic ? "exothermic (releases energy)" : delta > 0 ? "endothermic (absorbs energy)" : "thermally neutral"],
        steps: [
          { title: "Add up the energy needed to break bonds", math: `+${fmt(broken, 1)} kJ/mol` },
          { title: "Add up the energy released forming bonds", math: `−${fmt(formed, 1)} kJ/mol` },
          { title: "Subtract", math: `ΔH = ${fmt(broken, 1)} − ${fmt(formed, 1)} = ${fmt(delta, 1)} kJ/mol` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. Reactivity Series Reference                                     */
/* ------------------------------------------------------------------ */

const reactivity: ExplorerTool = {
  kind: "explorer",
  name: "Reactivity Series Reference",
  summary: "Metal reactions, extraction methods and displacement.",
  topics: [
    {
      id: "series",
      name: "The reactivity series",
      summary: "Most reactive at the top; each metal displaces those below it.",
      table: {
        caption: "Reactivity series",
        headers: ["Metal", "Reaction with water", "Extraction method"],
        rows: [
          ["Potassium", "Violent", "Electrolysis"],
          ["Sodium", "Vigorous", "Electrolysis"],
          ["Calcium", "Steady", "Electrolysis"],
          ["Magnesium", "Slow with cold water", "Electrolysis"],
          ["Aluminium", "Very slow", "Electrolysis"],
          ["Zinc", "With steam", "Reduction with carbon"],
          ["Iron", "With steam", "Reduction with carbon"],
          ["Lead", "—", "Reduction with carbon"],
          ["Copper", "None", "Found native / reduction"],
          ["Silver", "None", "Found native"],
          ["Gold", "None", "Found native"],
        ],
      },
    },
    {
      id: "displacement",
      name: "Displacement reactions",
      summary: "A more reactive metal takes the place of a less reactive one.",
      mono: [
        "Zn + CuSO₄ → ZnSO₄ + Cu   (grey solid, blue colour fades)",
        "Cu + ZnSO₄ → no reaction",
      ],
      points: [
        "The more reactive metal transfers electrons to the less reactive metal ion.",
        "No reaction happens if the metal is less reactive than the one in solution.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 17. Organic Chemistry Guide                                         */
/* ------------------------------------------------------------------ */

const organic: ExplorerTool = {
  kind: "explorer",
  name: "Organic Chemistry Guide",
  summary: "Homologous series, naming rules and key reactions.",
  topics: [
    {
      id: "series",
      name: "Homologous series",
      summary: "Families with the same general formula and similar reactions.",
      table: {
        caption: "Series",
        headers: ["Series", "General formula", "Example", "Functional group"],
        rows: [
          ["Alkanes", "CₙH₂ₙ₊₂", "Methane CH₄", "Single bonds only"],
          ["Alkenes", "CₙH₂ₙ", "Ethene C₂H₄", "C=C double bond"],
          ["Alcohols", "CₙH₂ₙ₊₁OH", "Ethanol C₂H₅OH", "−OH"],
          ["Carboxylic acids", "CₙH₂ₙ₊₁COOH", "Ethanoic acid CH₃COOH", "−COOH"],
          ["Esters", "—", "Ethyl ethanoate", "−COO−"],
        ],
      },
    },
    {
      id: "reactions",
      name: "Key reactions",
      summary: "The named reactions you are expected to write.",
      mono: [
        "combustion:  CH₄ + 2O₂ → CO₂ + 2H₂O",
        "addition:    C₂H₄ + Br₂ → C₂H₄Br₂",
        "esterification: ethanol + ethanoic acid → ethyl ethanoate + water",
      ],
    },
    {
      id: "naming",
      name: "Naming organic compounds",
      summary: "Count the carbons, then find the functional group.",
      table: {
        caption: "Carbon prefixes",
        headers: ["Carbons", "Prefix"],
        rows: [
          ["1", "meth-"], ["2", "eth-"], ["3", "prop-"], ["4", "but-"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 18. Formula & Equation Sheet                                        */
/* ------------------------------------------------------------------ */

const formulaSheet: ExplorerTool = {
  kind: "explorer",
  name: "Formula & Equation Sheet",
  summary: "Key equations, ions and constants for IGCSE Chemistry.",
  topics: [
    {
      id: "moles",
      name: "Moles and concentration",
      summary: "The formulas that solve most calculation questions.",
      mono: [
        "n = m ÷ Mr",
        "n = c × V      (V in dm³)",
        "volume of gas = n × 24 dm³   (RTP)",
        "% yield = (actual ÷ theoretical) × 100",
        "% atom economy = (Mr product ÷ Mr reactants) × 100",
      ],
    },
    {
      id: "constants",
      name: "Constants",
      summary: "Values you may be given, and must use consistently.",
      table: {
        caption: "Constants",
        headers: ["Quantity", "Value"],
        rows: [
          ["Avogadro constant", "6.02 × 10²³ /mol"],
          ["Molar gas volume (RTP)", "24 dm³/mol"],
          ["Molar gas volume (STP)", "22.4 dm³/mol"],
          ["1 dm³", "1000 cm³"],
        ],
      },
    },
    {
      id: "tests",
      name: "Tests for ions and gases",
      summary: "Results you must quote exactly in practical questions.",
      table: {
        caption: "Quick tests",
        headers: ["Substance", "Test", "Positive result"],
        rows: [
          ["Hydrogen", "Lit splint", "Squeaky pop"],
          ["Oxygen", "Glowing splint", "Relights the splint"],
          ["Carbon dioxide", "Bubble through limewater", "Turns milky"],
          ["Chlorine", "Damp litmus paper", "Bleaches it white"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 19. Worksheet Generator                                             */
/* ------------------------------------------------------------------ */

const BANK: QuestionBank = {
  moles: (rng) => {
    const mr = randInt(rng, 10, 100);
    const mass = mr * randInt(rng, 1, 4);
    const moles = mass / mr;
    return {
      prompt: `How many moles are there in ${mass} g of a substance with Mr = ${mr}?`,
      answer: `${moles} mol`,
      working: `n = m ÷ Mr = ${mass} ÷ ${mr} = ${moles}.`,
    };
  },
  concentration: (rng) => {
    const moles = randInt(rng, 1, 10) / 10;
    const volume = randInt(rng, 1, 5) / 2;
    const conc = moles / volume;
    return {
      prompt: `Find the concentration when ${moles} mol is dissolved to make ${volume} dm³ of solution.`,
      answer: `${Number(conc.toFixed(3))} mol/dm³`,
      working: `c = n ÷ V = ${moles} ÷ ${volume} = ${Number(conc.toFixed(3))}.`,
    };
  },
  yield: (rng) => {
    const theoretical = randInt(rng, 20, 80);
    const actual = randInt(rng, 10, theoretical);
    const percent = (actual / theoretical) * 100;
    return {
      prompt: `The theoretical yield is ${theoretical} g but only ${actual} g is made. Find the percentage yield.`,
      answer: `${Number(percent.toFixed(1))}%`,
      working: `(${actual} ÷ ${theoretical}) × 100 = ${Number(percent.toFixed(1))}%.`,
    };
  },
  gas: (rng) => {
    const moles = randInt(rng, 1, 8) / 4;
    const volume = moles * 24;
    return {
      prompt: `What volume does ${moles} mol of a gas occupy at RTP?`,
      answer: `${Number(volume.toFixed(2))} dm³`,
      working: `V = n × 24 = ${moles} × 24 = ${Number(volume.toFixed(2))} dm³.`,
    };
  },
};

const chemistryWorksheet: CalcTool = {
  kind: "calc",
  name: "Worksheet Generator",
  summary: "Generate a chemistry practice paper with a full answer key.",
  formula: "moles · concentration · yield · gas volume",
  fields: [
    {
      id: "topic",
      label: "Topic",
      type: "select",
      defaultValue: "moles",
      options: [
        { value: "moles", label: "Mole calculations" },
        { value: "concentration", label: "Concentration" },
        { value: "yield", label: "Percentage yield" },
        { value: "gas", label: "Gas volumes" },
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
          { title: "Attempt every question", math: "show the formula, substitution and units" },
          { title: "Mark with the key", math: "the working column shows each step" },
        ],
        tables: paperTables(questions, "Chemistry"),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. Practical Guide                                                 */
/* ------------------------------------------------------------------ */

const practical: ExplorerTool = {
  kind: "explorer",
  name: "Practical Guide",
  summary: "Separation methods, qualitative tests and good practical technique.",
  topics: [
    {
      id: "separation",
      name: "Separation methods",
      summary: "Choose the method to match the mixture.",
      table: {
        caption: "Separation techniques",
        headers: ["Method", "Used for", "Basis"],
        rows: [
          ["Filtration", "Insoluble solid + liquid", "Particle size"],
          ["Crystallisation", "Soluble solid from solution", "Evaporation then cooling"],
          ["Simple distillation", "Solvent from a solution", "Boiling point"],
          ["Fractional distillation", "Miscible liquids", "Different boiling points"],
          ["Chromatography", "Dyes and pigments", "Different solubilities"],
        ],
      },
    },
    {
      id: "tests",
      name: "Qualitative tests",
      summary: "Identify ions, gases and water quickly.",
      table: {
        caption: "Tests",
        headers: ["Substance", "Reagent", "Result"],
        rows: [
          ["Cation: Cu²⁺", "Sodium hydroxide", "Blue precipitate"],
          ["Cation: Fe²⁺", "Sodium hydroxide", "Green precipitate"],
          ["Cation: Fe³⁺", "Sodium hydroxide", "Red-brown precipitate"],
          ["Anion: Cl⁻", "Acidified silver nitrate", "White precipitate"],
          ["Anion: SO₄²⁻", "Acidified barium chloride", "White precipitate"],
          ["Water", "Anhydrous copper(II) sulfate", "White → blue"],
        ],
      },
    },
    {
      id: "technique",
      name: "Good technique",
      summary: "Small details that gain and lose marks.",
      points: [
        "Read the burette or thermometer at eye level, to the bottom of the meniscus.",
        "Rinse apparatus with the solution it will hold, not water.",
        "Repeat titrations until you get concordant results within 0.10 cm³.",
        "Record units on every measurement and use a suitable number of significant figures.",
      ],
    },
  ],
};

export const CHEMISTRY_TOOLS: ToolDefinition[] = [
  mole,
  balancer,
  reactingMasses,
  concentration,
  titration,
  gasVolume,
  percentageYield,
  atomEconomy,
  empiricalFormula,
  periodic,
  bonding,
  electrolysis,
  phTool,
  rates,
  energyChange,
  reactivity,
  organic,
  formulaSheet,
  chemistryWorksheet,
  practical,
];
