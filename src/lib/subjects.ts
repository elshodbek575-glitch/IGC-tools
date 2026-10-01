import { Atom, Cpu, Dna, FlaskConical, Sigma, type LucideIcon } from "lucide-react";

/**
 * IGCtools subject registry.
 *
 * Everything the shell needs to render a subject section lives here so the five
 * subject landing pages share one design system and only vary by accent, icon
 * and content.
 *
 * `topics` are the topic areas taken from the publicly published Cambridge
 * IGCSE and Edexcel IGCSE subject specifications (the exam boards publish these
 * freely — they list every topic and required skill). No textbook content is
 * reproduced.
 *
 * `tools` are the planned tool set for each subject. In this first version they
 * are rendered as non-interactive "planned" shells; the actual tool logic is
 * built subject by subject after the topic/tool lists are signed off.
 */

export type SyllabusTopic = {
  title: string;
  items: string[];
};

export type PlannedTool = {
  name: string;
  note: string;
};

export type Subject = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  /** CSS class that sets --subject / --subject-soft / --subject-line */
  themeClass: string;
  /** Hex accent for inline SVG / gradients */
  accent: string;
  icon: LucideIcon;
  tagline: string;
  blurb: string;
  boards: string[];
  /** Model for current tool build order */
  status: "in-progress" | "planned";
  topics: SyllabusTopic[];
  tools: PlannedTool[];
};

export const SUBJECTS: Subject[] = [
  {
    id: "maths",
    slug: "/maths",
    name: "Mathematics",
    shortName: "Maths",
    themeClass: "subject-maths",
    accent: "#6366f1",
    icon: Sigma,
    tagline: "Calculators, solvers and worked solutions for every core topic.",
    blurb:
      "From surds and simultaneous equations to circle theorems and statistics — every solver shows each step, not just the final answer.",
    boards: ["Cambridge IGCSE 0580", "Edexcel IGCSE 4MA1"],
    status: "in-progress",
    topics: [
      {
        title: "Number",
        items: [
          "Types of number, sets and Venn diagrams",
          "Powers, roots, indices and surds",
          "Fractions, decimals and percentages",
          "Ordering, standard form and estimation",
          "Limits of accuracy and rounding",
          "Ratio, proportion and rates",
          "Percentages, compound interest and growth/decay",
        ],
      },
      {
        title: "Algebra and graphs",
        items: [
          "Algebraic manipulation and factorisation",
          "Linear, quadratic and simultaneous equations",
          "Inequalities and regions",
          "Sequences and the nth term",
          "Functions, graphs and transformations",
          "Direct and inverse proportion",
        ],
      },
      {
        title: "Geometry and measures",
        items: [
          "Angle properties and circle theorems",
          "Similarity, congruence and scale",
          "Perimeter, area and volume",
          "Bearings and constructions",
          "Vectors and transformations",
        ],
      },
      {
        title: "Trigonometry",
        items: [
          "Pythagoras and SOHCAHTOA",
          "Sine and cosine rules",
          "Area of a triangle and 3D trigonometry",
          "Elevation, depression and bearings",
        ],
      },
      {
        title: "Probability and statistics",
        items: [
          "Probability of single and combined events",
          "Tree diagrams and conditional probability",
          "Averages, range and spread",
          "Charts, tables and scatter diagrams",
        ],
      },
    ],
    tools: [
      { name: "Surds & Indices Simplifier", note: "Rationalise, simplify and show the index laws used" },
      { name: "Standard Form Converter", note: "Convert and calculate in standard form with steps" },
      { name: "Fractions · Decimals · Percentages", note: "Convert between forms with full working" },
      { name: "Ratio & Proportion Solver", note: "Share, scale and solve direct/inverse proportion" },
      { name: "Compound Interest & Growth", note: "Percentages, depreciation and growth/decay" },
      { name: "Quadratic Solver", note: "Factorising, completing the square and the formula side by side" },
      { name: "Simultaneous Equations", note: "Elimination and substitution with every step" },
      { name: "Inequalities & Regions", note: "Solve and shade linear inequalities" },
      { name: "Sequences & nth Term", note: "Linear and quadratic sequences, term-to-term rules" },
      { name: "SOHCAHTOA Calculator", note: "Right-angled trig with a labelled diagram" },
      { name: "Sine & Cosine Rule", note: "Non-right triangles with an original diagram" },
      { name: "Circle Theorems Explorer", note: "Original SVG diagrams for each theorem" },
      { name: "Vectors Toolkit", note: "Add, scale and resolve vectors with components" },
      { name: "Bearings Calculator", note: "Bearings, back-bearings and distance" },
      { name: "Similar Shapes & Congruence", note: "Scale factors for length, area and volume" },
      { name: "Sets & Venn Diagrams", note: "Set notation, unions, intersections and shading" },
      { name: "Probability Calculator", note: "Single, combined and tree-diagram probability" },
      { name: "Statistics Workbench", note: "Mean, median, mode and standard deviation with working" },
      { name: "Graph Plotter", note: "Plot and read linear, quadratic and cubic graphs" },
      { name: "Formula Reference Sheet", note: "Every IGCSE formula, organised by topic" },
      { name: "Worksheet Generator", note: "Topic-based practice papers with answer keys" },
    ],
  },
  {
    id: "physics",
    slug: "/physics",
    name: "Physics",
    shortName: "Physics",
    themeClass: "subject-physics",
    accent: "#38bdf8",
    icon: Atom,
    tagline: "Motion, forces, energy and circuits — with the reasoning laid out.",
    blurb:
      "Every calculator shows the equation, the substitution and the unit reasoning, so you learn the method as well as the answer.",
    boards: ["Cambridge IGCSE 0625", "Edexcel IGCSE 4PH1"],
    status: "planned",
    topics: [
      {
        title: "Motion, forces and energy",
        items: [
          "Speed, velocity and acceleration",
          "Distance–time and velocity–time graphs",
          "Forces, Newton's laws and momentum",
          "Weight, mass, density and pressure",
          "Work, energy, power and efficiency",
          "Moments and equilibrium",
        ],
      },
      {
        title: "Thermal physics",
        items: [
          "Kinetic particle model and states of matter",
          "Specific heat capacity and latent heat",
          "Conduction, convection and radiation",
          "Thermal expansion and gas behaviour",
        ],
      },
      {
        title: "Waves",
        items: [
          "Wave properties and the wave equation",
          "Reflection, refraction and diffraction",
          "Sound and the electromagnetic spectrum",
          "Light, lenses and ray diagrams",
        ],
      },
      {
        title: "Electricity and magnetism",
        items: [
          "Charge, current and potential difference",
          "Ohm's law and resistance",
          "Series and parallel circuits",
          "Electrical power and energy transfer",
          "Magnetism, electromagnets and the motor effect",
        ],
      },
      {
        title: "Nuclear physics and space",
        items: [
          "Atomic structure and isotopes",
          "Radioactivity and half-life",
          "Nuclear fission and fusion",
          "The solar system and cosmology",
        ],
      },
    ],
    tools: [
      { name: "Physics Unit Converter", note: "Convert between SI and common units with factors shown" },
      { name: "Speed · Velocity · Acceleration", note: "Solve motion problems and read the graphs" },
      { name: "Motion Graph Reader", note: "Interpret distance–time and velocity–time graphs" },
      { name: "Force & Newton's Laws", note: "Resultant force, F = ma and momentum" },
      { name: "Weight, Mass & Gravity", note: "Weight vs mass on different bodies" },
      { name: "Density & Pressure", note: "Solids, liquids and gas pressure with steps" },
      { name: "Moments & Equilibrium", note: "Balance beams and the principle of moments" },
      { name: "Work · Energy · Power", note: "Energy transfers and efficiency" },
      { name: "Kinetic & Potential Energy", note: "KE and GPE calculations with working" },
      { name: "Ohm's Law Calculator", note: "V, I and R with the triangle method" },
      { name: "Series & Parallel Circuits", note: "Combine resistors and find branch values" },
      { name: "Electrical Power & Energy", note: "P = VI, P = I²R and energy cost" },
      { name: "Wave Equation", note: "Wave speed, frequency and wavelength" },
      { name: "Lenses & Ray Diagrams", note: "Original diagrams for converging lenses" },
      { name: "Thermal Energy Calculator", note: "Specific heat capacity and latent heat" },
      { name: "Half-life & Radioactivity", note: "Decay, activity and half-life graphs" },
      { name: "Pressure in Fluids", note: "Liquid pressure and upthrust" },
      { name: "Formula Sheet by Topic", note: "Every IGCSE physics equation, grouped" },
      { name: "Worksheet Generator", note: "Topic-based questions with answer keys" },
      { name: "Practical Skills Guide", note: "Graphs, uncertainties and apparatus notes" },
    ],
  },
  {
    id: "chemistry",
    slug: "/chemistry",
    name: "Chemistry",
    shortName: "Chemistry",
    themeClass: "subject-chemistry",
    accent: "#f59e0b",
    icon: FlaskConical,
    tagline: "Moles, equations and reactions — balanced and explained.",
    blurb:
      "Get the ratio, the moles and the units right every time with tools that show the reasoning at each stage.",
    boards: ["Cambridge IGCSE 0620", "Edexcel IGCSE 4CH1"],
    status: "planned",
    topics: [
      {
        title: "States of matter and particles",
        items: [
          "Solids, liquids and gases",
          "Kinetic particle theory and changes of state",
          "Diffusion and Brownian motion",
        ],
      },
      {
        title: "Atomic structure and bonding",
        items: [
          "Atoms, elements, isotopes and ions",
          "The periodic table and trends",
          "Ionic, covalent and metallic bonding",
          "Dot-and-cross and structural diagrams",
        ],
      },
      {
        title: "Stoichiometry and moles",
        items: [
          "Formulae and balancing equations",
          "The mole and molar mass",
          "Reacting masses and limiting reagents",
          "Concentration, solutions and titration",
          "Gas volumes and the mole",
          "Percentage yield and atom economy",
        ],
      },
      {
        title: "Physical chemistry",
        items: [
          "Chemical energetics and enthalpy changes",
          "Rates of reaction and collision theory",
          "Reversible reactions and equilibrium",
          "Redox and electrolysis",
        ],
      },
      {
        title: "Acids, bases and salts",
        items: [
          "Acids, alkalis, pH and indicators",
          "Neutralisation and preparing salts",
          "Strong and weak acids",
        ],
      },
      {
        title: "Chemistry of the elements and organic chemistry",
        items: [
          "Metals, reactivity series and extraction",
          "Air, water and the environment",
          "Fuels, alkanes, alkenes and polymers",
          "Alcohols, acids and esters",
        ],
      },
    ],
    tools: [
      { name: "Mole & Molar Mass Calculator", note: "Moles from mass, Mr and particles, with steps" },
      { name: "Equation Balancer", note: "Balance any equation and show the ratio" },
      { name: "Reacting Masses Solver", note: "Mass–mole–mass calculations, fully worked" },
      { name: "Concentration & Dilution", note: "mol/dm³, g/dm³ and dilution factors" },
      { name: "Titration Calculator", note: "Use titration results to find concentration" },
      { name: "Gas Volume Calculator", note: "Molar gas volume at RTP with working" },
      { name: "Percentage Yield", note: "Actual vs theoretical yield" },
      { name: "Atom Economy", note: "Efficiency of a reaction from its equation" },
      { name: "Empirical & Molecular Formula", note: "Find formulae from composition or masses" },
      { name: "Periodic Table Explorer", note: "Interactive original table with element data" },
      { name: "Bonding Diagram Builder", note: "Original dot-and-cross and structural diagrams" },
      { name: "Electrolysis Calculator", note: "Products at each electrode and half-equations" },
      { name: "pH & Indicator Tool", note: "Acid/alkali strength and indicator colours" },
      { name: "Rates of Reaction", note: "Concentration, temperature and surface area effects" },
      { name: "Energy Change Calculator", note: "Enthalpy of reaction and bond energies" },
      { name: "Reactivity Series Reference", note: "Metal reactions and extraction methods" },
      { name: "Organic Chemistry Guide", note: "Naming, homologous series and reactions" },
      { name: "Formula & Equation Sheet", note: "Key equations, ions and constants" },
      { name: "Worksheet Generator", note: "Topic-based questions with answer keys" },
      { name: "Practical Guide", note: "Tests for ions, gases and separation methods" },
    ],
  },
  {
    id: "biology",
    slug: "/biology",
    name: "Biology",
    shortName: "Biology",
    themeClass: "subject-biology",
    accent: "#10b981",
    icon: Dna,
    tagline: "Cells, systems and inheritance — explained step by step.",
    blurb:
      "Interactive original diagrams, genetics tools and topic glossaries that make the reasoning visible.",
    boards: ["Cambridge IGCSE 0610", "Edexcel IGCSE 4BI1"],
    status: "planned",
    topics: [
      {
        title: "Nature and variety of living organisms",
        items: [
          "Characteristics of living things",
          "Classification and the five kingdoms",
          "Using and constructing dichotomous keys",
        ],
      },
      {
        title: "Structures and functions",
        items: [
          "Cell structure and organisation",
          "Movement in and out of cells: diffusion, osmosis, active transport",
          "Biological molecules and enzymes",
          "Plant nutrition and photosynthesis",
          "Human nutrition and digestion",
          "Transport in plants and animals",
          "Gas exchange and respiration",
          "Excretion and homeostasis",
          "Coordination and response, nerves and hormones",
        ],
      },
      {
        title: "Reproduction and inheritance",
        items: [
          "Asexual and sexual reproduction",
          "Reproductive systems and fertilisation",
          "DNA, genes and chromosomes",
          "Monohybrid inheritance and Punnett squares",
          "Variation, selection and evolution",
        ],
      },
      {
        title: "Ecology and the environment",
        items: [
          "Ecosystems, energy flow and food chains",
          "Nutrient and carbon cycles",
          "Populations and human impact",
        ],
      },
      {
        title: "Use of biological resources",
        items: [
          "Selective breeding and genetic engineering",
          "Biotechnology and food production",
          "Sustainable use of resources",
        ],
      },
    ],
    tools: [
      { name: "Cell Structure Labelling", note: "Original diagrams to label for plant, animal and bacterial cells" },
      { name: "Human Organ Systems Labelling", note: "Original diagrams for digestion, breathing and circulation" },
      { name: "Enzyme Rate Calculator", note: "Temperature/pH effects with a worked interpretation" },
      { name: "Photosynthesis & Respiration", note: "Word and balanced equations with limiting factors" },
      { name: "Osmosis Calculator", note: "Predict water movement with reasoning" },
      { name: "Punnett Square Calculator", note: "Monohybrid crosses with genotype and phenotype ratios" },
      { name: "Genetics Probability", note: "Inheritance predictions with working" },
      { name: "Food Chain & Ecology Builder", note: "Build food webs and trace energy flow" },
      { name: "Classification & Taxonomy", note: "Sort organisms with a dichotomous key builder" },
      { name: "Cell Division Explainer", note: "Mitosis and meiosis step by step" },
      { name: "Enzyme & Digestion Guide", note: "Enzymes by site and substrate" },
      { name: "Transport in Plants", note: "Transpiration and translocation explained" },
      { name: "Gas Exchange Guide", note: "Surface area, diffusion and exercise effects" },
      { name: "Homeostasis Explainer", note: "Temperature and blood glucose control" },
      { name: "Reproduction Guide", note: "Fertilisation to development" },
      { name: "Variation & Selection", note: "Continuous/discontinuous variation and evolution" },
      { name: "Glossary & Flashcards", note: "Topic glossaries with a flashcard trainer" },
      { name: "Required Diagram Library", note: "Original SVG diagrams you are expected to draw" },
      { name: "Practical Skills Guide", note: "Experiments, controls and variables" },
      { name: "Worksheet Generator", note: "Topic-based questions with answer keys" },
    ],
  },
  {
    id: "computer-science",
    slug: "/computer-science",
    name: "Computer Science",
    shortName: "Computer Science",
    themeClass: "subject-computer-science",
    accent: "#a855f7",
    icon: Cpu,
    tagline: "Data, algorithms and logic — traced and explained.",
    blurb:
      "Convert, simulate and trace: every tool walks through the steps of the algorithm rather than hiding them.",
    boards: ["Cambridge IGCSE 0478", "Edexcel IGCSE 4CP0"],
    status: "planned",
    topics: [
      {
        title: "Data representation",
        items: [
          "Binary, denary and hexadecimal",
          "Binary arithmetic and shifts",
          "Text, image and sound representation",
          "Data storage, compression and file size",
        ],
      },
      {
        title: "Computer systems and networks",
        items: [
          "Hardware and the CPU fetch–decode–execute cycle",
          "Primary and secondary storage",
          "Input and output devices",
          "Networks, topologies and protocols",
          "The internet, IP addressing and security",
        ],
      },
      {
        title: "Software and security",
        items: [
          "System and application software",
          "Operating systems and utilities",
          "Cyber security threats and prevention",
        ],
      },
      {
        title: "Algorithm design and programming",
        items: [
          "Decomposition and abstraction",
          "Pseudocode, flowcharts and structured design",
          "Programming constructs and data types",
          "Arrays, records and file handling",
          "Testing, validation and trace tables",
        ],
      },
      {
        title: "Boolean logic and databases",
        items: [
          "Logic gates and truth tables",
          "Boolean expressions and circuits",
          "Databases and SQL queries",
        ],
      },
    ],
    tools: [
      { name: "Binary · Hex · Denary Converter", note: "Convert and add in every base with working" },
      { name: "Binary Arithmetic", note: "Add, subtract and shift binary numbers" },
      { name: "Data Unit Converter", note: "Bits, bytes, KiB/MiB and file sizes" },
      { name: "Logic Gate Simulator", note: "Build circuits from the six standard gates" },
      { name: "Truth Table Generator", note: "Generate truth tables from any expression" },
      { name: "Boolean Expression Simplifier", note: "Apply the laws with each step shown" },
      { name: "Pseudocode → Flowchart", note: "Turn pseudocode into an original flowchart" },
      { name: "Flowchart → Pseudocode", note: "Read a flowchart back into structured pseudocode" },
      { name: "Big-O Explainer", note: "Compare algorithm complexity with clear reasoning" },
      { name: "Sorting Visualiser", note: "Step through bubble, insertion and merge sort" },
      { name: "Searching Visualiser", note: "Linear vs binary search, traced" },
      { name: "Image as Binary", note: "See how pixels encode colour and size" },
      { name: "Sound as Binary", note: "Sample rate, bit depth and file size" },
      { name: "Compression Explainer", note: "Lossy vs lossless with worked examples" },
      { name: "Trace Table Builder", note: "Trace variables through a program" },
      { name: "Number Base Practice", note: "Conversion drills with instant feedback" },
      { name: "Networks & Protocols Guide", note: "Topologies, layers and addressing" },
      { name: "Databases & SQL Trainer", note: "SELECT, WHERE, ORDER BY and joins" },
      { name: "Programming Concepts Reference", note: "Data types, constructs and file handling" },
      { name: "Worksheet & Quiz Generator", note: "Topic-based questions with answer keys" },
    ],
  },
];

export const SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((subject) => [subject.id, subject]),
);

export function getSubject(id: string): Subject | undefined {
  return SUBJECT_MAP[id];
}

/** Turn a tool name into its URL slug, e.g. "Ohm's Law Calculator" -> "ohms-law-calculator". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ToolRef = {
  subject: Subject;
  tool: PlannedTool;
  slug: string;
  /** Subject-first, tool-second URL, e.g. /physics/ohms-law-calculator */
  path: string;
};

/** Flat index of every planned tool across all subjects, used by search and routing. */
export const ALL_TOOLS: ToolRef[] = SUBJECTS.flatMap((subject) =>
  subject.tools.map((tool) => {
    const slug = slugify(tool.name);
    return { subject, tool, slug, path: `${subject.slug}/${slug}` };
  }),
);

export function findTool(
  subjectId: string,
  toolSlug: string,
): ToolRef | undefined {
  return ALL_TOOLS.find(
    (ref) => ref.subject.id === subjectId && ref.slug === toolSlug,
  );
}

export function searchTools(query: string, limit = 8): ToolRef[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matches = ALL_TOOLS.filter((ref) => {
    const haystack = `${ref.tool.name} ${ref.tool.note} ${ref.subject.name}`.toLowerCase();
    return haystack.includes(q);
  });
  // Name matches rank above description-only matches.
  return matches
    .sort((a, b) => {
      const aName = a.tool.name.toLowerCase().includes(q) ? 0 : 1;
      const bName = b.tool.name.toLowerCase().includes(q) ? 0 : 1;
      return aName - bName;
    })
    .slice(0, limit);
}
