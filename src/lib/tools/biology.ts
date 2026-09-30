import {
  fail,
  fmt,
  mulberry32,
  num,
  randInt,
  str,
} from "./helpers";
import type {
  CalcTool,
  Drawing,
  ExplorerTool,
  SolveOutcome,
  ToolDefinition,
  Values,
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
/* Original SVG drawings                                               */
/* ------------------------------------------------------------------ */

const CYTOPLASM = "rgba(120,180,255,0.18)";
const MEMBRANE = "#3b82f6";
const NUCLEUS = "#8b5cf6";
const ORGANELLE = "#10b981";

const animalCell: Drawing = {
  viewBox: "0 0 100 100",
  shapes: [
    { t: "circle", cx: 50, cy: 50, r: 40, fill: CYTOPLASM, stroke: MEMBRANE, width: 1.5 },
    { t: "circle", cx: 42, cy: 44, r: 14, fill: "rgba(139,92,246,0.25)", stroke: NUCLEUS, width: 1.5 },
    { t: "circle", cx: 42, cy: 44, r: 5, fill: NUCLEUS, stroke: NUCLEUS, width: 1 },
    { t: "path", d: "M66 30 C74 26 80 34 74 38 C70 41 64 38 66 30 Z", fill: "rgba(16,185,129,0.25)", stroke: ORGANELLE, width: 1.5 },
    { t: "path", d: "M30 70 C38 66 44 74 38 79 C33 82 27 78 30 70 Z", fill: "rgba(16,185,129,0.25)", stroke: ORGANELLE, width: 1.5 },
    { t: "circle", cx: 62, cy: 62, r: 2.2, fill: ORGANELLE },
    { t: "circle", cx: 68, cy: 56, r: 2.2, fill: ORGANELLE },
    { t: "circle", cx: 24, cy: 50, r: 2.2, fill: ORGANELLE },
  ],
};

const plantCell: Drawing = {
  viewBox: "0 0 100 100",
  shapes: [
    { t: "rect", x: 8, y: 12, w: 84, h: 76, rx: 8, fill: "rgba(16,185,129,0.15)", stroke: "#059669", width: 2 },
    { t: "rect", x: 13, y: 17, w: 74, h: 66, rx: 6, fill: CYTOPLASM, stroke: MEMBRANE, width: 1.5 },
    { t: "rect", x: 34, y: 30, w: 34, h: 40, rx: 8, fill: "rgba(59,130,246,0.2)", stroke: "#2563eb", width: 1.5 },
    { t: "circle", cx: 24, cy: 30, r: 9, fill: "rgba(139,92,246,0.25)", stroke: NUCLEUS, width: 1.5 },
    { t: "path", d: "M70 26 C78 22 84 30 78 34 C74 37 68 34 70 26 Z", fill: "rgba(16,185,129,0.35)", stroke: "#047857", width: 1.5 },
    { t: "path", d: "M70 62 C78 58 84 66 78 70 C74 73 68 70 70 62 Z", fill: "rgba(16,185,129,0.35)", stroke: "#047857", width: 1.5 },
    { t: "path", d: "M20 62 C28 58 34 66 28 70 C24 73 18 70 20 62 Z", fill: "rgba(16,185,129,0.35)", stroke: "#047857", width: 1.5 },
  ],
};

const breathingSystem: Drawing = {
  viewBox: "0 0 100 100",
  shapes: [
    { t: "rect", x: 47, y: 8, w: 6, h: 26, rx: 2, fill: "rgba(59,130,246,0.2)", stroke: MEMBRANE, width: 1.5 },
    { t: "path", d: "M50 34 L34 48", stroke: MEMBRANE, width: 2.5, fill: "none" },
    { t: "path", d: "M50 34 L66 48", stroke: MEMBRANE, width: 2.5, fill: "none" },
    { t: "path", d: "M34 40 C16 44 12 70 24 84 C36 92 46 76 44 58 C43 46 42 38 34 40 Z", fill: "rgba(244,114,182,0.22)", stroke: "#db2777", width: 1.5 },
    { t: "path", d: "M66 40 C84 44 88 70 76 84 C64 92 54 76 56 58 C57 46 58 38 66 40 Z", fill: "rgba(244,114,182,0.22)", stroke: "#db2777", width: 1.5 },
    { t: "path", d: "M18 90 C34 84 66 84 82 90", stroke: "#f59e0b", width: 2.5, fill: "none" },
    { t: "text", x: 50, y: 12, s: "trachea", size: 5 },
  ],
};

/* ------------------------------------------------------------------ */
/* 1. Cell Structure Labelling                                         */
/* ------------------------------------------------------------------ */

const cellLabelling = {
  kind: "diagram" as const,
  name: "Cell Structure Labelling",
  summary: "Label the parts of an animal cell, then try the quiz.",
  drawing: animalCell,
  parts: [
    { id: "membrane", name: "Cell membrane", role: "Controls what enters and leaves the cell.", x: 50, y: 9 },
    { id: "cytoplasm", name: "Cytoplasm", role: "Jelly-like fluid where reactions take place.", x: 80, y: 60 },
    { id: "nucleus", name: "Nucleus", role: "Contains the genetic material and controls the cell.", x: 42, y: 44 },
    { id: "mitochondria", name: "Mitochondria", role: "Site of respiration, releasing energy.", x: 72, y: 33 },
    { id: "ribosomes", name: "Ribosomes", role: "Where proteins are synthesised.", x: 64, y: 63 },
  ],
};

/* ------------------------------------------------------------------ */
/* 2. Human Organ Systems Labelling                                    */
/* ------------------------------------------------------------------ */

const organLabelling = {
  kind: "diagram" as const,
  name: "Human Organ Systems Labelling",
  summary: "Label the breathing system and learn what each part does.",
  drawing: breathingSystem,
  parts: [
    { id: "trachea", name: "Trachea (windpipe)", role: "Carries air from the mouth to the bronchi.", x: 50, y: 14 },
    { id: "bronchus", name: "Bronchus", role: "A branch of the trachea leading to one lung.", x: 36, y: 47 },
    { id: "lung", name: "Lung", role: "Where gas exchange happens across the alveoli.", x: 81, y: 62 },
    { id: "alveolus", name: "Alveolus", role: "Tiny air sac with a large surface area for diffusion.", x: 24, y: 78 },
    { id: "diaphragm", name: "Diaphragm", role: "Muscle that changes the volume of the chest.", x: 50, y: 92 },
  ],
};

/* ------------------------------------------------------------------ */
/* 3. Enzyme Rate Calculator                                           */
/* ------------------------------------------------------------------ */

const enzymeRate: CalcTool = {
  kind: "calc",
  name: "Enzyme Rate Calculator",
  summary: "See how temperature and pH move an enzyme away from its optimum.",
  formula: "activity falls away from the optimum; high temperature denatures the enzyme",
  fields: [
    {
      id: "variable",
      label: "Change which condition?",
      type: "select",
      defaultValue: "temperature",
      options: [
        { value: "temperature", label: "Temperature (°C)" },
        { value: "ph", label: "pH" },
      ],
    },
    { id: "optimum", label: "Optimum temp (°C) or pH", type: "number", defaultValue: "37" },
    { id: "actual", label: "Actual temp (°C) or pH", type: "number", defaultValue: "37" },
  ],
  solve(values: Values): SolveOutcome {
    const variable = str(values, "variable");
    const optimum = num(values, "optimum");
    const actual = num(values, "actual");
    const error = requireNumbers([
      { label: "Optimum", value: optimum },
      { label: "Actual value", value: actual },
    ]);
    if (error) return fail(error);

    const temp = variable === "temperature";
    const distance = Math.abs(actual - optimum);
    const spread = temp ? 12 : 2.5;
    let activity = Math.max(0, Math.exp(-((distance / spread) ** 2)));
    let note = "";
    if (temp && actual > optimum + 8) {
      activity = 0;
      note = "Above roughly 45 °C the enzyme is denatured — the active site changes shape and the reaction stops.";
    } else if (!temp) {
      note = "pH away from the optimum changes the charges in the active site, slowing or stopping the reaction.";
    }
    const percent = activity * 100;

    return {
      ok: true,
      output: {
        answer: `${fmt(percent, 1)}% of maximum rate`,
        answerLabel: "Relative activity",
        extras: [`optimum ${temp ? `${fmt(optimum)} °C` : `pH ${fmt(optimum)}`}`, `actual ${temp ? `${fmt(actual)} °C` : `pH ${fmt(actual)}`}`],
        note,
        steps: [
          { title: "Find how far the value is from the optimum", math: `${temp ? "|ΔT|" : "|ΔpH|"} = |${fmt(actual)} − ${fmt(optimum)}| = ${fmt(distance, 2)}` },
          { title: "Rate of reaction peaks at the optimum", math: "at the optimum the rate is 100%" },
          { title: "Convert the shape of the curve to an activity", math: `activity ≈ ${fmt(percent, 1)}%` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. Photosynthesis & Respiration                                     */
/* ------------------------------------------------------------------ */

const photosynthesis: ExplorerTool = {
  kind: "explorer",
  name: "Photosynthesis & Respiration",
  summary: "Word and balanced equations, limiting factors and the link between the two.",
  topics: [
    {
      id: "equations",
      name: "The equations",
      summary: "Learn both the word and balanced equations.",
      mono: [
        "Photosynthesis:",
        "  carbon dioxide + water → glucose + oxygen",
        "  6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂   (light energy, chlorophyll)",
        "",
        "Aerobic respiration:",
        "  glucose + oxygen → carbon dioxide + water",
        "  C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O   (releases energy)",
      ],
    },
    {
      id: "limiting",
      name: "Limiting factors",
      summary: "Photosynthesis is slowed by whichever factor is in shortest supply.",
      points: [
        "Light intensity — more light increases the rate up to a plateau.",
        "Carbon dioxide concentration — usually the limiting factor in the day.",
        "Temperature — enzymes control the rate; too hot denatures them.",
        "Chlorophyll / leaf area — how much light can be captured.",
      ],
    },
    {
      id: "compare",
      name: "Photosynthesis vs respiration",
      summary: "They are almost opposites, but both use enzymes.",
      table: {
        caption: "Comparison",
        headers: ["Feature", "Photosynthesis", "Respiration"],
        rows: [
          ["Energy", "Light energy absorbed", "Energy released"],
          ["Gas taken in", "Carbon dioxide", "Oxygen (aerobic)"],
          ["Gas released", "Oxygen", "Carbon dioxide"],
          ["Where", "Chloroplasts", "Mitochondria"],
          ["When", "Only in light", "All the time"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 5. Osmosis Calculator                                               */
/* ------------------------------------------------------------------ */

const osmosis: CalcTool = {
  kind: "calc",
  name: "Osmosis Calculator",
  summary: "Compare solute concentrations and predict which way water moves.",
  formula: "water moves from a dilute solution to a concentrated solution",
  fields: [
    { id: "outside", label: "Solute concentration outside the cell (%)", type: "number", defaultValue: "0.5" },
    { id: "inside", label: "Solute concentration inside the cell (%)", type: "number", defaultValue: "1.0" },
  ],
  solve(values: Values): SolveOutcome {
    const outside = num(values, "outside");
    const inside = num(values, "inside");
    const error = requireNumbers([
      { label: "Outside concentration", value: outside },
      { label: "Inside concentration", value: inside },
    ]);
    if (error) return fail(error);

    let answer: string;
    let detail: string;
    let effect: string;
    if (Math.abs(outside - inside) < 1e-9) {
      answer = "No net movement of water";
      detail = "The solutions are the same concentration, so the cell is in equilibrium.";
      effect = "Cell size stays the same";
    } else if (outside < inside) {
      answer = "Water moves into the cell";
      detail = "The outside solution is more dilute, so water moves in by osmosis.";
      effect = "Animal cell may burst; plant cell becomes turgid";
    } else {
      answer = "Water moves out of the cell";
      detail = "The outside solution is more concentrated, so water leaves the cell.";
      effect = "Animal cell shrinks; plant cell becomes plasmolysed (flaccid)";
    }

    return {
      ok: true,
      output: {
        answer,
        answerLabel: "Net water movement",
        extras: [`outside ${fmt(outside, 3)}% · inside ${fmt(inside, 3)}%`, effect],
        note: detail,
        steps: [
          { title: "Compare the concentrations", math: `outside ${fmt(outside, 3)}% vs inside ${fmt(inside, 3)}%` },
          { title: "Water moves down the concentration gradient", math: "from the more dilute (higher water potential) side to the more concentrated side" },
          { title: "Predict the effect on the cell", math: effect },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. Punnett Square Calculator                                        */
/* ------------------------------------------------------------------ */

function gametes(genotype: string): string[] | null {
  const clean = genotype.trim().replace(/[^A-Za-z]/g, "");
  if (clean.length !== 2) return null;
  return [clean[0], clean[1]];
}

const punnett: CalcTool = {
  kind: "calc",
  name: "Punnett Square Calculator",
  summary: "Cross two genotypes and read the genotype and phenotype ratios.",
  formula: "Aa × Aa → 1 AA : 2 Aa : 1 aa",
  fields: [
    { id: "parent1", label: "Parent 1 genotype", type: "text", defaultValue: "Aa" },
    { id: "parent2", label: "Parent 2 genotype", type: "text", defaultValue: "Aa" },
    {
      id: "dominant",
      label: "Dominant phenotype name",
      type: "text",
      defaultValue: "dominant trait",
    },
    {
      id: "recessive",
      label: "Recessive phenotype name",
      type: "text",
      defaultValue: "recessive trait",
    },
  ],
  solve(values: Values): SolveOutcome {
    const p1 = str(values, "parent1");
    const p2 = str(values, "parent2");
    const g1 = gametes(p1);
    const g2 = gametes(p2);
    if (!g1 || !g2) return fail("Each parent genotype must have exactly two letters, e.g. Aa.");
    const dominantName = str(values, "dominant") || "dominant trait";
    const recessiveName = str(values, "recessive") || "recessive trait";

    const cells: string[][] = [];
    const counts: Record<string, number> = {};
    for (const left of g1) {
      const row: string[] = [];
      for (const top of g2) {
        const genotype = [left, top]
          .sort((a, b) => {
            const aUpper = a === a.toUpperCase();
            const bUpper = b === b.toUpperCase();
            if (aUpper !== bUpper) return aUpper ? -1 : 1;
            return a.localeCompare(b);
          })
          .join("");
        row.push(genotype);
        counts[genotype] = (counts[genotype] ?? 0) + 1;
      }
      cells.push(row);
    }

    const total = 4;
    const genotypeRows = Object.entries(counts).map(([genotype, count]) => [
      genotype,
      String(count),
      `${count}/4`,
    ]);
    const dominantCount = Object.entries(counts)
      .filter(([genotype]) => genotype.includes(genotype[0].toUpperCase()))
      .reduce((sum, [, count]) => sum + count, 0);
    const recessiveCount = total - dominantCount;

    return {
      ok: true,
      output: {
        answer: `${dominantCount} : ${recessiveCount} ${dominantName} : ${recessiveName}`,
        answerLabel: "Phenotype ratio",
        extras: Object.entries(counts).map(([genotype, count]) => `${genotype} × ${count}`),
        steps: [
          { title: "Split each parent into gametes", math: `${p1} → ${g1.join(", ")}   |   ${p2} → ${g2.join(", ")}` },
          { title: "Combine the gametes in the grid", math: cells.map((row) => row.join(" ")).join("   ") },
          { title: "Count the genotypes", math: Object.entries(counts).map(([g, c]) => `${g} = ${c}/4`).join(", ") },
          { title: "Group by phenotype", math: `${dominantName} = ${dominantCount}/4, ${recessiveName} = ${recessiveCount}/4` },
        ],
        tables: [
          {
            caption: "Punnett square",
            headers: ["", ...g2],
            rows: cells.map((row, index) => [g1[index], ...row]),
          },
          {
            caption: "Genotype ratio",
            headers: ["Genotype", "Count", "Fraction"],
            rows: genotypeRows,
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. Genetics Probability                                             */
/* ------------------------------------------------------------------ */

const geneticsProbability: CalcTool = {
  kind: "calc",
  name: "Genetics Probability",
  summary: "Predict the chance of an offspring showing a particular characteristic.",
  formula: "probability = favourable outcomes ÷ total outcomes",
  fields: [
    { id: "parent1", label: "Parent 1 genotype", type: "text", defaultValue: "Aa" },
    { id: "parent2", label: "Parent 2 genotype", type: "text", defaultValue: "Aa" },
    {
      id: "wanted",
      label: "Offspring you want",
      type: "select",
      defaultValue: "dominant",
      options: [
        { value: "dominant", label: "Show the dominant characteristic" },
        { value: "recessive", label: "Show the recessive characteristic" },
        { value: "heterozygous", label: "Be heterozygous (carrier)" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const g1 = gametes(str(values, "parent1"));
    const g2 = gametes(str(values, "parent2"));
    if (!g1 || !g2) return fail("Each parent genotype must have exactly two letters, e.g. Aa.");
    const wanted = str(values, "wanted");
    const offspring: string[] = [];
    for (const left of g1) {
      for (const top of g2) {
        offspring.push(
          [left, top]
            .sort((a, b) => {
              const aUpper = a === a.toUpperCase();
              const bUpper = b === b.toUpperCase();
              if (aUpper !== bUpper) return aUpper ? -1 : 1;
              return a.localeCompare(b);
            })
            .join(""),
        );
      }
    }
    const matches = offspring.filter((genotype) => {
      if (wanted === "dominant") return genotype.includes(genotype[0].toUpperCase());
      if (wanted === "recessive") return genotype === genotype.toLowerCase();
      return genotype[0] !== genotype[1];
    });
    const probability = matches.length / offspring.length;
    return {
      ok: true,
      output: {
        answer: `${fmt(probability * 100, 1)}%`,
        answerLabel: "Probability",
        extras: [`${matches.length} of ${offspring.length} possible outcomes`],
        steps: [
          { title: "Write every possible offspring genotype", math: offspring.join(", ") },
          { title: "Count the outcomes that match", math: `${matches.length} outcomes (${matches.join(", ") || "none"})` },
          { title: "Divide by the total", math: `${matches.length} ÷ ${offspring.length} = ${fmt(probability, 3)} = ${fmt(probability * 100, 1)}%` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. Food Chain & Ecology Builder                                     */
/* ------------------------------------------------------------------ */

const ecology: ExplorerTool = {
  kind: "explorer",
  name: "Food Chain & Ecology Builder",
  summary: "Energy flow, food webs and the words used to describe feeding relationships.",
  topics: [
    {
      id: "chain",
      name: "Building a food chain",
      summary: "The arrow shows the direction energy travels — towards the eater.",
      mono: [
        "grass → grasshopper → frog → snake",
        "producer  →  primary  →  secondary  →  tertiary",
        "            consumer    consumer     consumer",
      ],
      points: [
        "Producers make their own food by photosynthesis.",
        "Each arrow points from the organism being eaten to the eater.",
        "Energy is lost at every level, so chains are short.",
      ],
    },
    {
      id: "losses",
      name: "Why energy is lost",
      summary: "Only about 10% of energy passes to the next level.",
      points: [
        "Respiration and movement release energy as heat.",
        "Some material is never eaten or is indigestible.",
        "Excretion and egestion remove energy from the chain.",
      ],
    },
    {
      id: "words",
      name: "Ecology vocabulary",
      summary: "Precise definitions earn marks.",
      table: {
        caption: "Key terms",
        headers: ["Term", "Meaning"],
        rows: [
          ["Population", "All the organisms of one species in an area"],
          ["Community", "All the populations living together"],
          ["Ecosystem", "The community plus its physical environment"],
          ["Habitat", "Where an organism lives"],
          ["Niche", "The role a species plays in its ecosystem"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 9. Classification & Taxonomy                                        */
/* ------------------------------------------------------------------ */

const classification: ExplorerTool = {
  kind: "explorer",
  name: "Classification & Taxonomy",
  summary: "The five kingdoms and how to build a dichotomous key.",
  topics: [
    {
      id: "kingdoms",
      name: "The five kingdoms",
      summary: "Sort living things using their key features.",
      table: {
        caption: "Kingdoms",
        headers: ["Kingdom", "Key features", "Examples"],
        rows: [
          ["Animals", "Multicellular, no cell wall, feed on others", "Humans, insects, fish"],
          ["Plants", "Multicellular, cellulose cell wall, photosynthesis", "Trees, mosses, ferns"],
          ["Fungi", "Chitin cell wall, feed on dead material", "Mushrooms, yeast"],
          ["Protoctists", "Mostly single-celled, have a nucleus", "Amoeba, algae"],
          ["Prokaryotes", "No nucleus, single-celled", "Bacteria"],
        ],
      },
    },
    {
      id: "key",
      name: "Dichotomous keys",
      summary: "A series of paired questions that narrow down an organism.",
      mono: [
        "1a  Has fur ........................ go to 2",
        "1b  Does not have fur .............. go to 3",
        "2a  Lives in water ................. otter",
        "2b  Lives on land .................. fox",
      ],
      points: [
        "Each step has exactly two choices.",
        "Every choice must be clear and observable.",
        "Keep working until you reach a single organism.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 10. Cell Division Explainer                                         */
/* ------------------------------------------------------------------ */

const cellDivision: ExplorerTool = {
  kind: "explorer",
  name: "Cell Division Explainer",
  summary: "Mitosis and meiosis compared step by step.",
  topics: [
    {
      id: "mitosis",
      name: "Mitosis",
      summary: "One cell divides into two genetically identical cells.",
      mono: [
        "parent (diploid) → 2 identical daughter cells",
        "used for growth and repair",
      ],
      points: [
        "Produces diploid cells with the same chromosome number.",
        "No variation between the daughter cells.",
      ],
    },
    {
      id: "meiosis",
      name: "Meiosis",
      summary: "One cell divides into four gametes with half the chromosomes.",
      mono: [
        "parent (diploid) → 4 gametes (haploid)",
        "used to make sperm, eggs and pollen",
      ],
      points: [
        "Halves the chromosome number so fertilisation can restore it.",
        "Crossing over and independent assortment create variation.",
      ],
    },
    {
      id: "compare",
      name: "At a glance",
      summary: "The differences most questions ask about.",
      table: {
        caption: "Mitosis vs meiosis",
        headers: ["Feature", "Mitosis", "Meiosis"],
        rows: [
          ["Daughter cells", "2", "4"],
          ["Chromosome number", "Same (diploid)", "Halved (haploid)"],
          ["Variation", "None", "Yes"],
          ["Purpose", "Growth and repair", "Gametes / sexual reproduction"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 11. Enzyme & Digestion Guide                                        */
/* ------------------------------------------------------------------ */

const digestion: ExplorerTool = {
  kind: "explorer",
  name: "Enzyme & Digestion Guide",
  summary: "Which enzyme works where, and on what.",
  topics: [
    {
      id: "enzymes",
      name: "Digestive enzymes",
      summary: "Each enzyme is specific to its substrate.",
      table: {
        caption: "Enzymes",
        headers: ["Enzyme", "Where", "Breaks down", "Into"],
        rows: [
          ["Amylase", "Mouth, small intestine", "Starch", "Maltose (sugar)"],
          ["Protease", "Stomach, small intestine", "Proteins", "Amino acids"],
          ["Lipase", "Small intestine", "Fats", "Fatty acids + glycerol"],
        ],
      },
    },
    {
      id: "conditions",
      name: "Conditions in the gut",
      summary: "Enzymes need the right temperature and pH.",
      points: [
        "The stomach is acidic (pH ~2) — protease works best there.",
        "The small intestine is alkaline to suit amylase and lipase.",
        "Bile neutralises stomach acid and emulsifies fats.",
      ],
    },
    {
      id: "lock",
      name: "The lock-and-key idea",
      summary: "Shape matters — this explains specificity.",
      points: [
        "The substrate fits the enzyme's active site like a key in a lock.",
        "Only the correct substrate will fit.",
        "Denaturing changes the active site shape so the substrate no longer fits.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 12. Transport in Plants                                             */
/* ------------------------------------------------------------------ */

const plantTransport: ExplorerTool = {
  kind: "explorer",
  name: "Transport in Plants",
  summary: "Transpiration, translocation and the factors that change them.",
  topics: [
    {
      id: "xylem-phloem",
      name: "Xylem and phloem",
      summary: "Two transport tissues with different jobs.",
      table: {
        caption: "Transport tissues",
        headers: ["Tissue", "Transports", "Direction"],
        rows: [
          ["Xylem", "Water and mineral ions", "Root to leaves (one way)"],
          ["Phloem", "Sugars and amino acids", "Both directions (translocation)"],
        ],
      },
    },
    {
      id: "transpiration",
      name: "Transpiration",
      summary: "Loss of water vapour from the leaves pulls water up the plant.",
      points: [
        "Faster in bright light, warm, dry and windy conditions.",
        "Stomata open to let carbon dioxide in — water escapes at the same time.",
        "Guard cells open and close the stomata to control water loss.",
      ],
    },
    {
      id: "factors",
      name: "Investigating the rate",
      summary: "Use a potometer to measure water uptake.",
      table: {
        caption: "Effect of changing conditions",
        headers: ["Change", "Effect on transpiration", "Reason"],
        rows: [
          ["Brighter light", "Increases", "Stomata open wider"],
          ["Higher temperature", "Increases", "Particles move and evaporate faster"],
          ["More wind", "Increases", "Removes humid air, keeping a gradient"],
          ["Higher humidity", "Decreases", "Smaller concentration gradient"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 13. Gas Exchange Guide                                              */
/* ------------------------------------------------------------------ */

const gasExchange: ExplorerTool = {
  kind: "explorer",
  name: "Gas Exchange Guide",
  summary: "Surface area, diffusion and what happens during exercise.",
  topics: [
    {
      id: "alveoli",
      name: "Adaptations of the alveoli",
      summary: "Features designed to make diffusion fast.",
      points: [
        "Enormous surface area — millions of alveoli.",
        "Very thin walls (one cell thick) for a short diffusion path.",
        "Rich blood supply maintains a steep concentration gradient.",
        "Moist lining so gases dissolve before diffusing.",
      ],
    },
    {
      id: "exercise",
      name: "Exercise",
      summary: "The body responds to a higher demand for oxygen.",
      table: {
        caption: "Responses to exercise",
        headers: ["Change", "Effect"],
        rows: [
          ["Breathing rate increases", "More oxygen in, more carbon dioxide out"],
          ["Breathing depth increases", "Larger volume moved per breath"],
          ["Heart rate increases", "Faster delivery of oxygen and glucose"],
          ["Arterioles to muscles widen", "More blood to the working muscles"],
        ],
      },
    },
    {
      id: "anaerobic",
      name: "Anaerobic respiration",
      summary: "Respiration without oxygen produces lactic acid.",
      mono: ["glucose → lactic acid (+ a little energy)"],
      points: [
        "Releases much less energy than aerobic respiration.",
        "Lactic acid builds up and causes muscle fatigue.",
        "An oxygen debt must be repaid afterwards.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 14. Homeostasis Explainer                                           */
/* ------------------------------------------------------------------ */

const homeostasis: ExplorerTool = {
  kind: "explorer",
  name: "Homeostasis Explainer",
  summary: "Temperature and blood glucose control, and why it matters.",
  topics: [
    {
      id: "temperature",
      name: "Controlling body temperature",
      summary: "Thermoregulation keeps core temperature near 37 °C.",
      table: {
        caption: "Responses to temperature change",
        headers: ["Condition", "Response", "Effect"],
        rows: [
          ["Too hot", "Vasodilation, sweating", "More heat lost"],
          ["Too hot", "Hairs lie flat", "Less insulation"],
          ["Too cold", "Vasoconstriction, shivering", "Less heat lost, more heat made"],
          ["Too cold", "Hairs stand up", "Traps insulating air"],
        ],
      },
    },
    {
      id: "glucose",
      name: "Controlling blood glucose",
      summary: "Insulin and glucagon keep glucose in a narrow range.",
      mono: [
        "glucose too high → insulin released → liver stores glucose as glycogen",
        "glucose too low  → glucagon released → liver releases glucose",
      ],
      points: [
        "Type 1 diabetes: the pancreas makes too little insulin.",
        "Type 2 diabetes: the body no longer responds well to insulin.",
      ],
    },
    {
      id: "negative",
      name: "Negative feedback",
      summary: "The same loop underlies every example of homeostasis.",
      points: [
        "A receptor detects a change from the normal level.",
        "A coordination centre processes it.",
        "An effector responds to bring the level back.",
        "The response reverses the original change — hence 'negative'.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 15. Reproduction Guide                                              */
/* ------------------------------------------------------------------ */

const reproduction: ExplorerTool = {
  kind: "explorer",
  name: "Reproduction Guide",
  summary: "Reproductive systems, fertilisation and development.",
  topics: [
    {
      id: "systems",
      name: "Reproductive systems",
      summary: "The structures and their functions.",
      table: {
        caption: "Key structures",
        headers: ["Structure", "System", "Function"],
        rows: [
          ["Testes", "Male", "Produce sperm and testosterone"],
          ["Sperm duct", "Male", "Carries sperm to the urethra"],
          ["Ovaries", "Female", "Release eggs and produce oestrogen"],
          ["Oviduct", "Female", "Site of fertilisation"],
          ["Uterus", "Female", "Where the embryo develops"],
        ],
      },
    },
    {
      id: "fertilisation",
      name: "Fertilisation and development",
      summary: "From gametes to a baby.",
      mono: [
        "sperm nucleus + egg nucleus → zygote (diploid)",
        "zygote → embryo → fetus → birth",
      ],
      points: [
        "The placenta exchanges nutrients, oxygen and waste.",
        "The amniotic fluid cushions and protects the fetus.",
        "The umbilical cord connects the fetus to the placenta.",
      ],
    },
    {
      id: "plants",
      name: "Reproduction in plants",
      summary: "Pollination leads to fertilisation and seed formation.",
      points: [
        "Pollination is the transfer of pollen from anther to stigma.",
        "Fertilisation follows when the pollen nucleus fuses with the egg cell.",
        "The ovule becomes the seed and the ovary becomes the fruit.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 16. Variation & Selection                                           */
/* ------------------------------------------------------------------ */

const variation: ExplorerTool = {
  kind: "explorer",
  name: "Variation & Selection",
  summary: "Continuous and discontinuous variation, and how evolution works.",
  topics: [
    {
      id: "types",
      name: "Types of variation",
      summary: "Variation can be plotted in different ways.",
      table: {
        caption: "Continuous vs discontinuous",
        headers: ["Feature", "Continuous", "Discontinuous"],
        rows: [
          ["Values", "Any value in a range", "Distinct categories"],
          ["Graph", "Line / histogram", "Bar chart"],
          ["Controlled by", "Many genes + environment", "Usually one or few genes"],
          ["Examples", "Height, mass, hand span", "Blood group, eye colour"],
        ],
      },
    },
    {
      id: "natural",
      name: "Natural selection",
      summary: "The mechanism behind evolution, in four steps.",
      mono: [
        "1. Variation exists in the population",
        "2. Some variants are better suited to the environment",
        "3. Those individuals survive and reproduce",
        "4. Their alleles become more common over generations",
      ],
    },
    {
      id: "evidence",
      name: "Evidence for evolution",
      summary: "Several independent lines of evidence agree.",
      points: [
        "Fossils show gradual change over time.",
        "Antibiotic resistance in bacteria is evolution happening now.",
        "Similar structures in different species suggest common ancestry.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 17. Glossary & Flashcards                                           */
/* ------------------------------------------------------------------ */

const glossary: ExplorerTool = {
  kind: "explorer",
  name: "Glossary & Flashcards",
  summary: "Flip through the key IGCSE Biology terms.",
  topics: [
    {
      id: "cells",
      name: "Cells and transport",
      summary: "Terms about cell structure and movement of substances.",
      flashcards: true,
      table: {
        caption: "Term / definition",
        headers: ["Term", "Definition"],
        rows: [
          ["Diffusion", "Net movement of particles from high to low concentration"],
          ["Osmosis", "Diffusion of water through a partially permeable membrane"],
          ["Active transport", "Movement of particles against a concentration gradient using energy"],
          ["Enzyme", "A biological catalyst made of protein"],
          ["Denaturation", "Loss of enzyme shape at high temperature or wrong pH"],
          ["Turgid", "A plant cell swollen with water"],
        ],
      },
    },
    {
      id: "genetics",
      name: "Genetics and inheritance",
      summary: "Terms about DNA, alleles and inheritance.",
      flashcards: true,
      table: {
        caption: "Term / definition",
        headers: ["Term", "Definition"],
        rows: [
          ["Gene", "A length of DNA that codes for a protein"],
          ["Allele", "A version of a gene"],
          ["Genotype", "The alleles an organism has"],
          ["Phenotype", "The visible characteristics of an organism"],
          ["Homozygous", "Two identical alleles for a gene"],
          ["Heterozygous", "Two different alleles for a gene"],
        ],
      },
    },
    {
      id: "ecology",
      name: "Ecology",
      summary: "Terms about organisms and their environment.",
      flashcards: true,
      table: {
        caption: "Term / definition",
        headers: ["Term", "Definition"],
        rows: [
          ["Producer", "An organism that makes its own food by photosynthesis"],
          ["Consumer", "An organism that feeds on other organisms"],
          ["Decomposer", "An organism that breaks down dead material"],
          ["Population", "All the organisms of one species in a habitat"],
          ["Biodiversity", "The variety of species in an ecosystem"],
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 18. Required Diagram Library                                        */
/* ------------------------------------------------------------------ */

const diagramLibrary: ExplorerTool = {
  kind: "explorer",
  name: "Required Diagram Library",
  summary: "Original diagrams you may be asked to draw, with the labels to include.",
  topics: [
    {
      id: "animal",
      name: "Animal cell",
      summary: "Draw a rounded shape with the nucleus, cytoplasm and membrane labelled.",
      drawing: animalCell,
      points: [
        "Cell membrane — controls entry and exit.",
        "Cytoplasm — where reactions occur.",
        "Nucleus — holds the genetic material.",
        "Mitochondria — site of respiration.",
      ],
    },
    {
      id: "plant",
      name: "Plant cell",
      summary: "A regular rectangle with a cell wall, vacuole and chloroplasts.",
      drawing: plantCell,
      points: [
        "Cell wall — made of cellulose, gives support.",
        "Permanent vacuole — holds cell sap.",
        "Chloroplasts — contain chlorophyll for photosynthesis.",
        "Always show the cell wall thicker than the membrane.",
      ],
    },
    {
      id: "breathing",
      name: "Breathing system",
      summary: "Trachea, bronchi, lungs and diaphragm.",
      drawing: breathingSystem,
      points: [
        "Ring the trachea with cartilage, drawn as a series of C shapes.",
        "Show two bronchi branching into each lung.",
        "Label the diaphragm as a curved muscle below the lungs.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 19. Practical Skills Guide                                          */
/* ------------------------------------------------------------------ */

const practical: ExplorerTool = {
  kind: "explorer",
  name: "Practical Skills Guide",
  summary: "Variables, controls and the experiments IGCSE asks you to describe.",
  topics: [
    {
      id: "variables",
      name: "Variables and controls",
      summary: "Every experiment has three types of variable.",
      table: {
        caption: "Variables",
        headers: ["Variable", "Meaning", "Example"],
        rows: [
          ["Independent", "The one you change", "Temperature of water"],
          ["Dependent", "The one you measure", "Time for starch to disappear"],
          ["Control", "The ones you keep the same", "Volume of water, pH"],
        ],
      },
    },
    {
      id: "food-tests",
      name: "Food tests",
      summary: "Identify nutrients with the standard reagents.",
      table: {
        caption: "Food tests",
        headers: ["Nutrient", "Reagent", "Positive result"],
        rows: [
          ["Starch", "Iodine solution", "Blue-black"],
          ["Reducing sugar", "Benedict's solution, warm", "Blue → brick red"],
          ["Protein", "Biuret reagent", "Blue → lilac"],
          ["Lipid", "Ethanol then water", "Milky white emulsion"],
        ],
      },
    },
    {
      id: "experiments",
      name: "Core experiments",
      summary: "Experiments you should be able to describe and evaluate.",
      points: [
        "Investigating enzyme rate using starch and amylase.",
        "Investigating osmosis using potato cylinders and salt solutions.",
        "Investigating photosynthesis with pondweed and light intensity.",
        "Investigating respiration using a respirometer or hydrogencarbonate indicator.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 20. Worksheet Generator                                             */
/* ------------------------------------------------------------------ */

const BANK: QuestionBank = {
  punnett: (rng) => {
    const first = pickGenotype(rng);
    const second = pickGenotype(rng);
    const offspring = cross(first, second);
    const dominant = offspring.filter((g) => g.includes("A")).length;
    return {
      prompt: `Cross ${first} with ${second}. How many of the 4 offspring would be expected to show the dominant characteristic?`,
      answer: `${dominant} out of 4`,
      working: `Gametes: ${first} → ${first[0]},${first[1]}; ${second} → ${second[0]},${second[1]}. Grid gives ${offspring.join(", ")} → ${dominant}/4 dominant.`,
    };
  },
  osmosis: (rng) => {
    const outside = randInt(rng, 1, 5) / 10;
    const inside = randInt(rng, 1, 10) / 10;
    const direction = outside < inside ? "into the cell" : outside > inside ? "out of the cell" : "no net movement";
    return {
      prompt: `A cell with cytoplasm concentration ${inside}% is placed in a solution of ${outside}%. Which way does water move?`,
      answer: direction,
      working: `Water moves from the more dilute solution to the more concentrated one: outside ${outside}% vs inside ${inside}% → ${direction}.`,
    };
  },
  enzyme: (rng) => {
    const optimum = 37;
    const actual = randInt(rng, 5, 70);
    const distance = Math.abs(actual - optimum);
    const result = distance <= 3 ? "near maximum rate" : actual > 45 ? "denatured, no reaction" : "slower rate";
    return {
      prompt: `An enzyme has an optimum of ${optimum} °C. Describe the rate at ${actual} °C.`,
      answer: result,
      working: `Distance from optimum = ${distance} °C. ${result}.`,
    };
  },
};

function pickGenotype(rng: () => number): string {
  const options = ["AA", "Aa", "aa"];
  return options[randInt(rng, 0, 2)];
}

function cross(first: string, second: string): string[] {
  const result: string[] = [];
  for (const a of first) {
    for (const b of second) {
      result.push(
        [a, b]
          .sort((x, y) => (x === x.toUpperCase() && y !== y.toUpperCase() ? -1 : 1))
          .join(""),
      );
    }
  }
  return result;
}

const biologyWorksheet: CalcTool = {
  kind: "calc",
  name: "Worksheet Generator",
  summary: "Generate a biology practice paper with a full answer key.",
  formula: "genetics · osmosis · enzymes",
  fields: [
    {
      id: "topic",
      label: "Topic",
      type: "select",
      defaultValue: "punnett",
      options: [
        { value: "punnett", label: "Punnett squares" },
        { value: "osmosis", label: "Osmosis" },
        { value: "enzyme", label: "Enzymes" },
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
          { title: "Answer every question", math: "show your working" },
          { title: "Mark with the key", math: "the working column explains each answer" },
        ],
        tables: paperTables(questions, "Biology"),
      },
    };
  },
};

export const BIOLOGY_TOOLS: ToolDefinition[] = [
  cellLabelling,
  organLabelling,
  enzymeRate,
  photosynthesis,
  osmosis,
  punnett,
  geneticsProbability,
  ecology,
  classification,
  cellDivision,
  digestion,
  plantTransport,
  gasExchange,
  homeostasis,
  reproduction,
  variation,
  glossary,
  diagramLibrary,
  practical,
  biologyWorksheet,
];
