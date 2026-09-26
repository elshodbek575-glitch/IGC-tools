import { fail, fmt, mulberry32, num, pick, randInt, str } from "./helpers";
import type {
  CalcTool,
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

const G = 9.8;
const GRAVITY: Record<string, number> = {
  "9.8": G,
  "1.6": 1.6,
  "3.7": 3.7,
  "24.8": 24.8,
};

/* ------------------------------------------------------------------ */
/* 1. Physics Unit Converter                                           */
/* ------------------------------------------------------------------ */

type UnitDef = { unit: string; factor: number };

const QUANTITIES: Record<string, { label: string; base: string; units: UnitDef[] }> = {
  length: {
    label: "Length",
    base: "m",
    units: [
      { unit: "km", factor: 1000 },
      { unit: "m", factor: 1 },
      { unit: "cm", factor: 0.01 },
      { unit: "mm", factor: 0.001 },
      { unit: "µm", factor: 1e-6 },
    ],
  },
  mass: {
    label: "Mass",
    base: "kg",
    units: [
      { unit: "tonne", factor: 1000 },
      { unit: "kg", factor: 1 },
      { unit: "g", factor: 0.001 },
      { unit: "mg", factor: 1e-6 },
    ],
  },
  area: {
    label: "Area",
    base: "m²",
    units: [
      { unit: "km²", factor: 1e6 },
      { unit: "m²", factor: 1 },
      { unit: "cm²", factor: 1e-4 },
      { unit: "mm²", factor: 1e-6 },
      { unit: "hectare", factor: 10000 },
    ],
  },
  volume: {
    label: "Volume",
    base: "m³",
    units: [
      { unit: "m³", factor: 1 },
      { unit: "dm³ (litre)", factor: 0.001 },
      { unit: "cm³ (ml)", factor: 1e-6 },
    ],
  },
  speed: {
    label: "Speed",
    base: "m/s",
    units: [
      { unit: "m/s", factor: 1 },
      { unit: "km/h", factor: 1 / 3.6 },
      { unit: "mph", factor: 0.44704 },
    ],
  },
  force: {
    label: "Force",
    base: "N",
    units: [
      { unit: "kN", factor: 1000 },
      { unit: "N", factor: 1 },
    ],
  },
  energy: {
    label: "Energy",
    base: "J",
    units: [
      { unit: "kJ", factor: 1000 },
      { unit: "J", factor: 1 },
      { unit: "MJ", factor: 1e6 },
      { unit: "kWh", factor: 3.6e6 },
    ],
  },
  power: {
    label: "Power",
    base: "W",
    units: [
      { unit: "kW", factor: 1000 },
      { unit: "W", factor: 1 },
      { unit: "MW", factor: 1e6 },
    ],
  },
  pressure: {
    label: "Pressure",
    base: "Pa",
    units: [
      { unit: "Pa", factor: 1 },
      { unit: "kPa", factor: 1000 },
      { unit: "MPa", factor: 1e6 },
    ],
  },
  charge: {
    label: "Charge",
    base: "C",
    units: [
      { unit: "C", factor: 1 },
      { unit: "mC", factor: 1e-3 },
    ],
  },
  temperature: { label: "Temperature", base: "K", units: [] },
};

const unitConverter: CalcTool = {
  kind: "calc",
  name: "Physics Unit Converter",
  summary: "Convert any physics quantity into every unit you might be asked for.",
  fields: [
    {
      id: "quantity",
      label: "Quantity",
      type: "select",
      defaultValue: "speed",
      options: Object.entries(QUANTITIES).map(([value, meta]) => ({
        value,
        label: meta.label,
      })),
    },
    { id: "value", label: "Value", type: "number", defaultValue: "72" },
    {
      id: "unit",
      label: "Unit of the value you entered",
      type: "text",
      defaultValue: "km/h",
      hint: "Use the spelling from the results table, e.g. m/s, km/h, cm³ (ml).",
    },
  ],
  solve(values: Values): SolveOutcome {
    const quantity = str(values, "quantity");
    const value = num(values, "value");
    const unit = str(values, "unit");
    if (!Number.isFinite(value)) return fail("Enter a value to convert.");

    const meta = QUANTITIES[quantity];
    if (!meta) return fail("Choose a quantity.");

    if (quantity === "temperature") {
      const normalised = unit.toLowerCase().replace(/[°\s]/g, "");
      let celsius: number;
      if (normalised === "k") {
        celsius = value - 273.15;
      } else if (normalised === "f" || normalised === "°f") {
        celsius = ((value - 32) * 5) / 9;
      } else {
        celsius = value;
      }
      return {
        ok: true,
        output: {
          answer: `${fmt(celsius, 2)} °C`,
          extras: [`${fmt(celsius + 273.15, 2)} K`, `${fmt((celsius * 9) / 5 + 32, 2)} °F`],
          steps: [
            { title: "Convert the value to degrees Celsius first", math: `reading as entered: ${unit || "°C"}` },
            { title: "Kelvin = °C + 273.15", math: `${fmt(celsius, 2)} + 273.15 = ${fmt(celsius + 273.15, 2)} K` },
            { title: "Fahrenheit = °C × 9⁄5 + 32", math: `${fmt(celsius, 2)} × 9/5 + 32 = ${fmt((celsius * 9) / 5 + 32, 2)} °F` },
          ],
          note: "A change of 1 °C is the same size as a change of 1 K, which is why specific heat calculations can use either.",
        },
      };
    }

    const from = meta.units.find((entry) => entry.unit === unit);
    if (!from) {
      return fail(
        `“${unit}” is not one of the units for ${meta.label.toLowerCase()}. Try one of: ${meta.units.map((entry) => entry.unit).join(", ")}.`,
      );
    }

    const inBase = value * from.factor;
    return {
      ok: true,
      output: {
        answer: `${fmt(inBase, 6)} ${meta.base}`,
        steps: [
          {
            title: `Convert ${unit} into ${meta.base} (the SI base unit)`,
            math: `1 ${unit} = ${from.factor} ${meta.base}, so ${fmt(value)} × ${from.factor} = ${fmt(inBase, 6)} ${meta.base}`,
          },
          {
            title: "Divide by each target unit's factor to convert out again",
            math: meta.units.map((entry) => `${fmt(inBase / entry.factor, 6)} ${entry.unit}`).join(", "),
          },
        ],
        tables: [
          {
            caption: `${meta.label} in every unit`,
            headers: ["Unit", "Value"],
            rows: meta.units.map((entry) => [entry.unit, fmt(inBase / entry.factor, 6)]),
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. Speed · Velocity · Acceleration                                  */
/* ------------------------------------------------------------------ */

const motion: CalcTool = {
  kind: "calc",
  name: "Speed · Velocity · Acceleration",
  summary: "Solve speed, distance, time and acceleration problems with the rearrangement shown.",
  formula: "v = d⁄t  ·  a = (v − u)⁄t",
  fields: [
    {
      id: "mode",
      label: "Find",
      type: "select",
      defaultValue: "speed",
      options: [
        { value: "speed", label: "Average speed" },
        { value: "distance", label: "Distance travelled" },
        { value: "time", label: "Time taken" },
        { value: "acceleration", label: "Acceleration" },
      ],
    },
    { id: "distance", label: "Distance d", type: "number", defaultValue: "150", unit: "m" },
    { id: "time", label: "Time t", type: "number", defaultValue: "12", unit: "s" },
    { id: "speed", label: "Speed v", type: "number", defaultValue: "6", unit: "m/s" },
    { id: "u", label: "Initial velocity u", type: "number", defaultValue: "4", unit: "m/s" },
    { id: "final", label: "Final velocity v", type: "number", defaultValue: "18", unit: "m/s" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "acceleration") {
      const u = num(values, "u");
      const v = num(values, "final");
      const t = num(values, "time");
      if (![u, v, t].every(Number.isFinite)) return fail("Enter u, v and t.");
      if (t === 0) return fail("The time cannot be zero.");
      const a = (v - u) / t;
      return {
        ok: true,
        output: {
          answer: `a = ${fmt(a, 4)} m/s²`,
          extras: [a < 0 ? "The negative sign means it is decelerating." : "The object is speeding up."],
          steps: [
            { title: "Write the acceleration equation", math: "a = (v − u) ⁄ t" },
            { title: "Substitute", math: `a = (${fmt(v)} − ${fmt(u)}) ⁄ ${fmt(t)}` },
            { title: "Evaluate", math: `a = ${fmt(v - u)} ⁄ ${fmt(t)} = ${fmt(a, 4)} m/s²` },
          ],
        },
      };
    }

    const distance = num(values, "distance");
    const time = num(values, "time");
    const speed = num(values, "speed");

    if (mode === "speed") {
      if (!Number.isFinite(distance) || !Number.isFinite(time)) return fail("Enter the distance and the time.");
      if (time === 0) return fail("The time cannot be zero.");
      const v = distance / time;
      return {
        ok: true,
        output: {
          answer: `v = ${fmt(v, 4)} m/s`,
          extras: [`= ${fmt(v * 3.6, 4)} km/h`],
          steps: [
            { title: "Average speed is distance divided by time", math: "v = d ⁄ t" },
            { title: "Substitute", math: `v = ${fmt(distance)} ÷ ${fmt(time)}` },
            { title: "Evaluate", math: `v = ${fmt(v, 4)} m/s` },
            { title: "To convert m/s to km/h, multiply by 3.6", math: `${fmt(v, 4)} × 3.6 = ${fmt(v * 3.6, 4)} km/h` },
          ],
        },
      };
    }

    if (mode === "distance") {
      if (!Number.isFinite(speed) || !Number.isFinite(time)) return fail("Enter the speed and the time.");
      const d = speed * time;
      return {
        ok: true,
        output: {
          answer: `d = ${fmt(d, 4)} m`,
          steps: [
            { title: "Rearrange v = d ⁄ t for distance", math: "d = v × t" },
            { title: "Substitute", math: `d = ${fmt(speed)} × ${fmt(time)}` },
            { title: "Evaluate", math: `d = ${fmt(d, 4)} m` },
          ],
        },
      };
    }

    if (!Number.isFinite(distance) || !Number.isFinite(speed)) return fail("Enter the distance and the speed.");
    if (speed === 0) return fail("The speed cannot be zero if a distance was covered.");
    const t = distance / speed;
    return {
      ok: true,
      output: {
        answer: `t = ${fmt(t, 4)} s`,
        steps: [
          { title: "Rearrange v = d ⁄ t for time", math: "t = d ⁄ v" },
          { title: "Substitute", math: `t = ${fmt(distance)} ÷ ${fmt(speed)}` },
          { title: "Evaluate", math: `t = ${fmt(t, 4)} s` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. Motion Graph Reader                                              */
/* ------------------------------------------------------------------ */

const motionGraph: CalcTool = {
  kind: "calc",
  name: "Motion Graph Reader",
  summary: "Read gradients and areas off distance–time and velocity–time graphs.",
  formula: "gradient = (y₂ − y₁)⁄(x₂ − x₁)  ·  area under a v–t graph = distance",
  fields: [
    {
      id: "mode",
      label: "Type of graph",
      type: "select",
      defaultValue: "velocity",
      options: [
        { value: "distance", label: "Distance–time graph" },
        { value: "velocity", label: "Velocity–time graph" },
      ],
    },
    { id: "t1", label: "First time t₁", type: "number", defaultValue: "2", unit: "s" },
    { id: "y1", label: "Value at t₁", type: "number", defaultValue: "4", unit: "m/s" },
    { id: "t2", label: "Second time t₂", type: "number", defaultValue: "8", unit: "s" },
    { id: "y2", label: "Value at t₂", type: "number", defaultValue: "16", unit: "m/s" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const t1 = num(values, "t1");
    const y1 = num(values, "y1");
    const t2 = num(values, "t2");
    const y2 = num(values, "y2");
    if (![t1, y1, t2, y2].every(Number.isFinite)) return fail("Enter the two points on the graph.");
    if (t2 === t1) return fail("The two times must be different.");

    const gradient = (y2 - y1) / (t2 - t1);
    const isDistance = mode === "distance";

    const steps = [
      { title: "Pick two points on the line", math: `(${fmt(t1)}, ${fmt(y1)}) and (${fmt(t2)}, ${fmt(y2)})` },
      { title: "Find the changes", math: `change in time = ${fmt(t2 - t1)} s, change in ${isDistance ? "distance" : "velocity"} = ${fmt(y2 - y1)} ${isDistance ? "m" : "m/s"}` },
      {
        title: "Divide to get the gradient",
        math: `gradient = ${fmt(y2 - y1)} ⁄ ${fmt(t2 - t1)} = ${fmt(gradient, 4)}`,
      },
      {
        title: isDistance ? "On a distance–time graph the gradient is the speed" : "On a velocity–time graph the gradient is the acceleration",
        math: isDistance ? `speed = ${fmt(Math.abs(gradient), 4)} m/s` : `acceleration = ${fmt(gradient, 4)} m/s²`,
        detail: gradient === 0 ? "A flat line means it is stationary — or moving at a constant velocity." : undefined,
      },
    ];

    if (!isDistance) {
      const area = ((y1 + y2) / 2) * (t2 - t1);
      steps.push({
        title: "The area under a velocity–time graph is the distance travelled",
        math: `area of the trapezium = ½(${fmt(y1)} + ${fmt(y2)}) × ${fmt(t2 - t1)} = ${fmt(area, 4)} m`,
      });
    }

    return {
      ok: true,
      output: {
        answer: isDistance ? `speed = ${fmt(Math.abs(gradient), 4)} m/s` : `acceleration = ${fmt(gradient, 4)} m/s²`,
        extras: isDistance
          ? ["Remember the gradient of a distance–time graph gives speed."]
          : [`distance from the area = ${fmt(((y1 + y2) / 2) * (t2 - t1), 4)} m`],
        steps,
        note: isDistance
          ? "A curved distance–time graph means the speed is changing — draw a tangent to find the speed at one moment."
          : "A horizontal line means constant velocity; a line crossing zero means it changed direction.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. Force & Newton's Laws                                            */
/* ------------------------------------------------------------------ */

const force: CalcTool = {
  kind: "calc",
  name: "Force & Newton's Laws",
  summary: "Use F = ma, combine resultant forces and work out momentum.",
  formula: "F = ma  ·  p = mv",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "fma",
      options: [
        { value: "fma", label: "F = ma (find the force)" },
        { value: "accel", label: "F = ma (find the acceleration)" },
        { value: "resultant", label: "Resultant of two forces in opposite directions" },
        { value: "momentum", label: "Momentum p = mv" },
      ],
    },
    { id: "mass", label: "Mass m", type: "number", defaultValue: "1200", unit: "kg" },
    { id: "acceleration", label: "Acceleration a", type: "number", defaultValue: "2.5", unit: "m/s²" },
    { id: "force", label: "Force F", type: "number", defaultValue: "450", unit: "N" },
    { id: "forward", label: "Forward force", type: "number", defaultValue: "800", unit: "N" },
    { id: "backward", label: "Backward force", type: "number", defaultValue: "250", unit: "N" },
    { id: "velocity", label: "Velocity v", type: "number", defaultValue: "8", unit: "m/s" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const mass = num(values, "mass");
    const acceleration = num(values, "acceleration");
    const forceValue = num(values, "force");

    if (mode === "fma") {
      if (!Number.isFinite(mass) || !Number.isFinite(acceleration)) return fail("Enter the mass and the acceleration.");
      const result = mass * acceleration;
      return {
        ok: true,
        output: {
          answer: `F = ${fmt(result, 4)} N`,
          steps: [
            { title: "Newton's second law", math: "F = m × a" },
            { title: "Substitute", math: `F = ${fmt(mass)} × ${fmt(acceleration)}` },
            { title: "Evaluate", math: `F = ${fmt(result, 4)} N`, detail: "A force of 1 N gives a mass of 1 kg an acceleration of 1 m/s²." },
          ],
        },
      };
    }

    if (mode === "accel") {
      if (!Number.isFinite(forceValue) || !Number.isFinite(mass)) return fail("Enter the force and the mass.");
      if (mass === 0) return fail("The mass cannot be zero.");
      const result = forceValue / mass;
      return {
        ok: true,
        output: {
          answer: `a = ${fmt(result, 4)} m/s²`,
          steps: [
            { title: "Rearrange F = ma for acceleration", math: "a = F ⁄ m" },
            { title: "Substitute", math: `a = ${fmt(forceValue)} ÷ ${fmt(mass)}` },
            { title: "Evaluate", math: `a = ${fmt(result, 4)} m/s²` },
          ],
        },
      };
    }

    if (mode === "resultant") {
      const forward = num(values, "forward");
      const backward = num(values, "backward");
      if (![forward, backward].every(Number.isFinite)) return fail("Enter both forces.");
      const resultant = forward - backward;
      return {
        ok: true,
        output: {
          answer: `resultant = ${fmt(resultant, 4)} N ${resultant >= 0 ? "forwards" : "backwards"}`,
          steps: [
            { title: "Forces in opposite directions subtract", math: `resultant = ${fmt(forward)} − ${fmt(backward)}` },
            { title: "Evaluate", math: `= ${fmt(resultant, 4)} N` },
            {
              title: "State the direction",
              math: resultant === 0 ? "The forces balance, so there is no acceleration." : `The object accelerates ${resultant > 0 ? "in the direction of the larger force" : "opposite to the 800 N force"}.`,
            },
          ],
        },
      };
    }

    const velocity = num(values, "velocity");
    if (!Number.isFinite(mass) || !Number.isFinite(velocity)) return fail("Enter the mass and the velocity.");
    const momentum = mass * velocity;
    return {
      ok: true,
      output: {
        answer: `p = ${fmt(momentum, 4)} kg m/s`,
        steps: [
          { title: "Momentum is mass × velocity", math: "p = m × v" },
          { title: "Substitute", math: `p = ${fmt(mass)} × ${fmt(velocity)}` },
          { title: "Evaluate", math: `p = ${fmt(momentum, 4)} kg m/s` },
          { title: "Momentum is a vector", detail: "It has the same direction as the velocity, which matters in collisions." },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. Weight, Mass & Gravity                                           */
/* ------------------------------------------------------------------ */

const weight: CalcTool = {
  kind: "calc",
  name: "Weight, Mass & Gravity",
  summary: "Work out weight anywhere in the solar system and keep mass and weight straight.",
  formula: "W = mg",
  fields: [
    {
      id: "mode",
      label: "Find",
      type: "select",
      defaultValue: "weight",
      options: [
        { value: "weight", label: "Weight (from mass)" },
        { value: "mass", label: "Mass (from weight)" },
      ],
    },
    { id: "mass", label: "Mass m", type: "number", defaultValue: "60", unit: "kg" },
    { id: "weight", label: "Weight W", type: "number", defaultValue: "588", unit: "N" },
    {
      id: "g",
      label: "Gravitational field strength g",
      type: "select",
      defaultValue: "9.8",
      options: [
        { value: "9.8", label: "Earth — 9.8 N/kg" },
        { value: "1.6", label: "The Moon — 1.6 N/kg" },
        { value: "3.7", label: "Mars — 3.7 N/kg" },
        { value: "24.8", label: "Jupiter — 24.8 N/kg" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const g = GRAVITY[str(values, "g")] ?? G;
    const mode = str(values, "mode");

    if (mode === "weight") {
      const mass = num(values, "mass");
      if (!Number.isFinite(mass)) return fail("Enter a mass.");
      const result = mass * g;
      return {
        ok: true,
        output: {
          answer: `W = ${fmt(result, 4)} N`,
          steps: [
            { title: "Weight is the force of gravity on a mass", math: "W = m × g" },
            { title: "Substitute", math: `W = ${fmt(mass)} kg × ${fmt(g)} N/kg` },
            { title: "Evaluate", math: `W = ${fmt(result, 4)} N` },
            { title: "Mass does not change", detail: `The mass is still ${fmt(mass)} kg anywhere in the universe — only the weight changes.` },
          ],
        },
      };
    }

    const w = num(values, "weight");
    if (!Number.isFinite(w)) return fail("Enter a weight.");
    const mass = w / g;
    return {
      ok: true,
      output: {
        answer: `m = ${fmt(mass, 4)} kg`,
        steps: [
          { title: "Rearrange W = mg for mass", math: "m = W ⁄ g" },
          { title: "Substitute", math: `m = ${fmt(w)} N ÷ ${fmt(g)} N/kg` },
          { title: "Evaluate", math: `m = ${fmt(mass, 4)} kg` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. Density & Pressure                                               */
/* ------------------------------------------------------------------ */

const densityPressure: CalcTool = {
  kind: "calc",
  name: "Density & Pressure",
  summary: "Density, pressure on a surface and pressure in a liquid.",
  formula: "ρ = m⁄V  ·  P = F⁄A  ·  P = hρg",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "density",
      options: [
        { value: "density", label: "Density ρ = m⁄V" },
        { value: "pressure", label: "Pressure P = F⁄A" },
        { value: "liquid", label: "Pressure in a liquid P = hρg" },
      ],
    },
    { id: "mass", label: "Mass m", type: "number", defaultValue: "540", unit: "g" },
    { id: "volume", label: "Volume V", type: "number", defaultValue: "200", unit: "cm³" },
    { id: "force", label: "Force F", type: "number", defaultValue: "600", unit: "N" },
    { id: "area", label: "Area A", type: "number", defaultValue: "0.05", unit: "m²" },
    { id: "height", label: "Depth h", type: "number", defaultValue: "3", unit: "m" },
    { id: "liquidDensity", label: "Liquid density ρ", type: "number", defaultValue: "1000", unit: "kg/m³" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "density") {
      const mass = num(values, "mass");
      const volume = num(values, "volume");
      if (!Number.isFinite(mass) || !Number.isFinite(volume)) return fail("Enter the mass and the volume.");
      if (volume === 0) return fail("The volume cannot be zero.");
      const gPerCm3 = mass / volume;
      const kgPerM3 = (mass / 1000) / (volume / 1e6);
      return {
        ok: true,
        output: {
          answer: `ρ = ${fmt(gPerCm3, 4)} g/cm³ = ${fmt(kgPerM3, 4)} kg/m³`,
          steps: [
            { title: "Density is mass divided by volume", math: "ρ = m ⁄ V" },
            { title: "Substitute in g and cm³", math: `ρ = ${fmt(mass)} ÷ ${fmt(volume)} = ${fmt(gPerCm3, 4)} g/cm³` },
            {
              title: "Convert to SI if you need kg/m³",
              math: `1 g/cm³ = 1000 kg/m³, so ${fmt(gPerCm3, 4)} × 1000 = ${fmt(kgPerM3, 4)} kg/m³`,
            },
          ],
        },
      };
    }

    if (mode === "pressure") {
      const forceValue = num(values, "force");
      const area = num(values, "area");
      if (!Number.isFinite(forceValue) || !Number.isFinite(area)) return fail("Enter the force and the area.");
      if (area === 0) return fail("The area cannot be zero.");
      const pressure = forceValue / area;
      return {
        ok: true,
        output: {
          answer: `P = ${fmt(pressure, 4)} Pa`,
          extras: [`= ${fmt(pressure / 1000, 6)} kPa`, "1 Pa = 1 N/m²"],
          steps: [
            { title: "Pressure is force spread over area", math: "P = F ⁄ A" },
            { title: "Substitute", math: `P = ${fmt(forceValue)} N ÷ ${fmt(area)} m²` },
            { title: "Evaluate", math: `P = ${fmt(pressure, 4)} Pa` },
            { title: "Why sharp things cut", detail: "A smaller area gives a larger pressure for the same force — that's why a knife edge or a drawing pin works." },
          ],
        },
      };
    }

    const height = num(values, "height");
    const liquidDensity = num(values, "liquidDensity");
    if (!Number.isFinite(height) || !Number.isFinite(liquidDensity)) return fail("Enter the depth and the liquid density.");
    const pressure = height * liquidDensity * G;
    return {
      ok: true,
      output: {
        answer: `P = ${fmt(pressure, 4)} Pa`,
        steps: [
          { title: "Pressure in a liquid increases with depth", math: "P = h × ρ × g" },
          { title: "Substitute", math: `P = ${fmt(height)} m × ${fmt(liquidDensity)} kg/m³ × ${fmt(G)} N/kg` },
          { title: "Evaluate", math: `P = ${fmt(pressure, 4)} Pa` },
          { title: "Check the units", detail: "m × kg/m³ × N/kg leaves N/m², which is pascals." },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. Moments & Equilibrium                                            */
/* ------------------------------------------------------------------ */

const moments: CalcTool = {
  kind: "calc",
  name: "Moments & Equilibrium",
  summary: "Calculate moments and use the principle of moments to balance a beam.",
  formula: "moment = F × d  ·  F₁d₁ = F₂d₂",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "moment",
      options: [
        { value: "moment", label: "Calculate a moment" },
        { value: "balance", label: "Find the force that balances a beam" },
      ],
    },
    { id: "force", label: "Force F", type: "number", defaultValue: "250", unit: "N" },
    { id: "distance", label: "Perpendicular distance d", type: "number", defaultValue: "0.4", unit: "m" },
    { id: "f1", label: "Known force F₁", type: "number", defaultValue: "180", unit: "N" },
    { id: "d1", label: "Its distance d₁", type: "number", defaultValue: "0.6", unit: "m" },
    { id: "d2", label: "Distance of the balancing force d₂", type: "number", defaultValue: "0.9", unit: "m" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "moment") {
      const forceValue = num(values, "force");
      const distance = num(values, "distance");
      if (!Number.isFinite(forceValue) || !Number.isFinite(distance)) return fail("Enter the force and the perpendicular distance.");
      const result = forceValue * distance;
      return {
        ok: true,
        output: {
          answer: `moment = ${fmt(result, 4)} N m`,
          steps: [
            { title: "A moment is a turning effect", math: "moment = F × d" },
            { title: "Substitute", math: `moment = ${fmt(forceValue)} N × ${fmt(distance)} m` },
            { title: "Evaluate", math: `moment = ${fmt(result, 4)} N m` },
            { title: "Remember", detail: "d must be measured perpendicular to the line of action of the force." },
          ],
        },
      };
    }

    const f1 = num(values, "f1");
    const d1 = num(values, "d1");
    const d2 = num(values, "d2");
    if (![f1, d1, d2].every(Number.isFinite)) return fail("Enter F₁, d₁ and d₂.");
    if (d2 === 0) return fail("d₂ cannot be zero.");
    const f2 = (f1 * d1) / d2;
    return {
      ok: true,
      output: {
        answer: `F₂ = ${fmt(f2, 4)} N`,
        steps: [
          { title: "Principle of moments: anticlockwise = clockwise", math: "F₁ × d₁ = F₂ × d₂" },
          { title: "Find the known moment", math: `${fmt(f1)} × ${fmt(d1)} = ${fmt(f1 * d1, 4)} N m` },
          { title: "Rearrange for F₂", math: `F₂ = ${fmt(f1 * d1, 4)} ÷ ${fmt(d2)}` },
          { title: "Evaluate", math: `F₂ = ${fmt(f2, 4)} N` },
          { title: "Check", math: `A longer d₂ means a smaller force is needed — ${fmt(f2, 4)} N is ${f2 < f1 ? "less" : "more"} than ${fmt(f1)} N.` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. Work · Energy · Power                                            */
/* ------------------------------------------------------------------ */

const workEnergy: CalcTool = {
  kind: "calc",
  name: "Work · Energy · Power",
  summary: "Work done, power and efficiency with every rearrangement shown.",
  formula: "W = Fd  ·  P = W⁄t  ·  efficiency = useful ÷ total × 100%",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "work",
      options: [
        { value: "work", label: "Work done W = Fd" },
        { value: "power", label: "Power P = W⁄t" },
        { value: "efficiency", label: "Efficiency" },
      ],
    },
    { id: "force", label: "Force F", type: "number", defaultValue: "150", unit: "N" },
    { id: "distance", label: "Distance d", type: "number", defaultValue: "8", unit: "m" },
    { id: "work", label: "Work done / energy transferred", type: "number", defaultValue: "1200", unit: "J" },
    { id: "time", label: "Time t", type: "number", defaultValue: "6", unit: "s" },
    { id: "useful", label: "Useful energy out", type: "number", defaultValue: "360", unit: "J" },
    { id: "total", label: "Total energy in", type: "number", defaultValue: "480", unit: "J" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "work") {
      const forceValue = num(values, "force");
      const distance = num(values, "distance");
      if (!Number.isFinite(forceValue) || !Number.isFinite(distance)) return fail("Enter the force and the distance moved.");
      const result = forceValue * distance;
      return {
        ok: true,
        output: {
          answer: `W = ${fmt(result, 4)} J`,
          steps: [
            { title: "Work is done when a force moves an object", math: "W = F × d" },
            { title: "Substitute", math: `W = ${fmt(forceValue)} N × ${fmt(distance)} m` },
            { title: "Evaluate", math: `W = ${fmt(result, 4)} J` },
            { title: "What this means", detail: `${fmt(result, 4)} joules of energy were transferred to the object.` },
          ],
        },
      };
    }

    if (mode === "power") {
      const work = num(values, "work");
      const time = num(values, "time");
      if (!Number.isFinite(work) || !Number.isFinite(time)) return fail("Enter the energy and the time.");
      if (time === 0) return fail("The time cannot be zero.");
      const result = work / time;
      return {
        ok: true,
        output: {
          answer: `P = ${fmt(result, 4)} W`,
          steps: [
            { title: "Power is the rate of energy transfer", math: "P = W ⁄ t" },
            { title: "Substitute", math: `P = ${fmt(work)} J ÷ ${fmt(time)} s` },
            { title: "Evaluate", math: `P = ${fmt(result, 4)} W`, detail: "1 watt is 1 joule per second." },
          ],
        },
      };
    }

    const useful = num(values, "useful");
    const total = num(values, "total");
    if (!Number.isFinite(useful) || !Number.isFinite(total)) return fail("Enter the useful output and the total input.");
    if (total === 0) return fail("The total energy cannot be zero.");
    const efficiency = (useful / total) * 100;
    const wasted = total - useful;
    return {
      ok: true,
      output: {
        answer: `efficiency = ${fmt(efficiency, 2)}%`,
        extras: [`energy wasted = ${fmt(wasted, 4)} J`],
        steps: [
          { title: "Efficiency compares the useful output with the total input", math: "efficiency = useful ÷ total × 100" },
          { title: "Substitute", math: `efficiency = ${fmt(useful)} ÷ ${fmt(total)} × 100` },
          { title: "Evaluate", math: `= ${fmt(efficiency, 2)}%` },
          { title: "Find what was wasted", math: `${fmt(total)} − ${fmt(useful)} = ${fmt(wasted, 4)} J` },
          { title: "Energy is always conserved", detail: "The wasted energy has not disappeared — it has spread out, usually as heating." },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. Kinetic & Potential Energy                                       */
/* ------------------------------------------------------------------ */

const kinetic: CalcTool = {
  kind: "calc",
  name: "Kinetic & Potential Energy",
  summary: "Kinetic and gravitational potential energy, including energy transfers.",
  formula: "KE = ½mv²  ·  GPE = mgh",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "ke",
      options: [
        { value: "ke", label: "Kinetic energy KE = ½mv²" },
        { value: "gpe", label: "Gravitational potential energy GPE = mgh" },
        { value: "speed", label: "Speed from kinetic energy" },
        { value: "height", label: "Height from GPE" },
      ],
    },
    { id: "mass", label: "Mass m", type: "number", defaultValue: "0.5", unit: "kg" },
    { id: "speed", label: "Speed v", type: "number", defaultValue: "12", unit: "m/s" },
    { id: "height", label: "Height h", type: "number", defaultValue: "3.5", unit: "m" },
    { id: "energy", label: "Energy", type: "number", defaultValue: "36", unit: "J" },
    {
      id: "g",
      label: "Gravitational field strength g",
      type: "select",
      defaultValue: "9.8",
      options: [
        { value: "9.8", label: "Earth — 9.8 N/kg" },
        { value: "1.6", label: "The Moon — 1.6 N/kg" },
        { value: "3.7", label: "Mars — 3.7 N/kg" },
      ],
    },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const mass = num(values, "mass");
    const speed = num(values, "speed");
    const height = num(values, "height");
    const energy = num(values, "energy");
    const g = GRAVITY[str(values, "g")] ?? G;

    if (mode === "ke") {
      if (!Number.isFinite(mass) || !Number.isFinite(speed)) return fail("Enter the mass and the speed.");
      const ke = 0.5 * mass * speed * speed;
      return {
        ok: true,
        output: {
          answer: `KE = ${fmt(ke, 4)} J`,
          steps: [
            { title: "Kinetic energy depends on mass and speed", math: "KE = ½ × m × v²" },
            { title: "Square the speed first", math: `${fmt(speed)}² = ${fmt(speed * speed)}` },
            { title: "Substitute", math: `KE = ½ × ${fmt(mass)} × ${fmt(speed * speed)}` },
            { title: "Evaluate", math: `KE = ${fmt(ke, 4)} J` },
            { title: "Watch the v²", detail: "Doubling the speed gives four times the kinetic energy — this is why stopping distances rise so quickly." },
          ],
        },
      };
    }

    if (mode === "gpe") {
      if (!Number.isFinite(mass) || !Number.isFinite(height)) return fail("Enter the mass and the height.");
      const gpe = mass * g * height;
      return {
        ok: true,
        output: {
          answer: `GPE = ${fmt(gpe, 4)} J`,
          steps: [
            { title: "Gravitational potential energy depends on height", math: "GPE = m × g × h" },
            { title: "Substitute", math: `GPE = ${fmt(mass)} kg × ${fmt(g)} N/kg × ${fmt(height)} m` },
            { title: "Evaluate", math: `GPE = ${fmt(gpe, 4)} J` },
            { title: "Useful check", detail: "If the object falls, this becomes kinetic energy at the bottom (ignoring air resistance)." },
          ],
        },
      };
    }

    if (mode === "speed") {
      if (!Number.isFinite(energy) || !Number.isFinite(mass)) return fail("Enter the energy and the mass.");
      if (mass <= 0) return fail("The mass must be greater than zero.");
      const v = Math.sqrt((2 * energy) / mass);
      return {
        ok: true,
        output: {
          answer: `v = ${fmt(v, 4)} m/s`,
          steps: [
            { title: "Start from KE = ½mv²", math: "2KE = mv² → v² = 2KE ⁄ m" },
            { title: "Substitute", math: `v² = 2 × ${fmt(energy)} ÷ ${fmt(mass)} = ${fmt((2 * energy) / mass, 6)}` },
            { title: "Square root", math: `v = ${fmt(v, 4)} m/s` },
          ],
        },
      };
    }

    if (!Number.isFinite(energy) || !Number.isFinite(mass)) return fail("Enter the energy and the mass.");
    const h = energy / (mass * g);
    return {
      ok: true,
      output: {
        answer: `h = ${fmt(h, 4)} m`,
        steps: [
          { title: "Rearrange GPE = mgh", math: "h = GPE ⁄ (m × g)" },
          { title: "Substitute", math: `h = ${fmt(energy)} ÷ (${fmt(mass)} × ${fmt(g)})` },
          { title: "Evaluate", math: `h = ${fmt(h, 4)} m` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. Ohm's Law Calculator                                            */
/* ------------------------------------------------------------------ */

const ohmsLaw: CalcTool = {
  kind: "calc",
  name: "Ohm's Law Calculator",
  summary: "Fill in any two of V, I and R and the third is worked out from the triangle.",
  formula: "V = I × R",
  fields: [
    { id: "v", label: "Potential difference V (leave blank to find it)", type: "number", defaultValue: "", unit: "V" },
    { id: "i", label: "Current I (leave blank to find it)", type: "number", defaultValue: "0.5", unit: "A" },
    { id: "r", label: "Resistance R (leave blank to find it)", type: "number", defaultValue: "24", unit: "Ω" },
  ],
  solve(values: Values): SolveOutcome {
    const raw = { v: str(values, "v"), i: str(values, "i"), r: str(values, "r") };
    const blank = (Object.keys(raw) as ("v" | "i" | "r")[]).filter((key) => raw[key] === "");

    if (blank.length !== 1) {
      return fail(
        "Leave exactly one of V, I and R blank so there is one unknown to find.",
      );
    }

    const v = num(values, "v");
    const i = num(values, "i");
    const r = num(values, "r");

    if (blank[0] === "v") {
      if (!Number.isFinite(i) || !Number.isFinite(r)) return fail("Enter both I and R.");
      const result = i * r;
      return {
        ok: true,
        output: {
          answer: `V = ${fmt(result, 4)} V`,
          steps: [
            { title: "Cover V in the V–I–R triangle, leaving I × R", math: "V = I × R" },
            { title: "Substitute", math: `V = ${fmt(i)} A × ${fmt(r)} Ω` },
            { title: "Evaluate", math: `V = ${fmt(result, 4)} V` },
          ],
        },
      };
    }

    if (blank[0] === "i") {
      if (!Number.isFinite(v) || !Number.isFinite(r)) return fail("Enter both V and R.");
      if (r === 0) return fail("The resistance cannot be zero.");
      const result = v / r;
      return {
        ok: true,
        output: {
          answer: `I = ${fmt(result, 4)} A`,
          steps: [
            { title: "Cover I in the triangle, leaving V over R", math: "I = V ⁄ R" },
            { title: "Substitute", math: `I = ${fmt(v)} V ÷ ${fmt(r)} Ω` },
            { title: "Evaluate", math: `I = ${fmt(result, 4)} A` },
          ],
        },
      };
    }

    if (!Number.isFinite(v) || !Number.isFinite(i)) return fail("Enter both V and I.");
    if (i === 0) return fail("The current cannot be zero when a voltage is applied.");
    const result = v / i;
    return {
      ok: true,
      output: {
        answer: `R = ${fmt(result, 4)} Ω`,
        steps: [
          { title: "Cover R in the triangle, leaving V over I", math: "R = V ⁄ I" },
          { title: "Substitute", math: `R = ${fmt(v)} V ÷ ${fmt(i)} A` },
          { title: "Evaluate", math: `R = ${fmt(result, 4)} Ω` },
          { title: "Remember", detail: "Ohm's law only holds when the temperature stays constant." },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 11. Series & Parallel Circuits                                      */
/* ------------------------------------------------------------------ */

const circuits: CalcTool = {
  kind: "calc",
  name: "Series & Parallel Circuits",
  summary: "Combine resistors in series and in parallel, with the reciprocal working shown.",
  formula: "series: R = R₁ + R₂ + …  ·  parallel: 1⁄R = 1⁄R₁ + 1⁄R₂ + …",
  fields: [
    {
      id: "mode",
      label: "Circuit type",
      type: "select",
      defaultValue: "parallel",
      options: [
        { value: "series", label: "Series" },
        { value: "parallel", label: "Parallel" },
      ],
    },
    {
      id: "resistors",
      label: "Resistance values",
      type: "text",
      defaultValue: "6, 12",
      hint: "Separate with commas, e.g. 6, 12, 4",
    },
    { id: "supply", label: "Supply voltage (optional)", type: "number", defaultValue: "12", unit: "V" },
  ],
  solve(values: Values): SolveOutcome {
    const resistors = str(values, "resistors")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (resistors.length < 2) return fail("Enter at least two positive resistance values, separated by commas.");
    const mode = str(values, "mode");

    if (mode === "series") {
      const total = resistors.reduce((sum, value) => sum + value, 0);
      const supply = num(values, "supply");
      const steps = [
        { title: "In series the resistors are in a single loop", math: "R = R₁ + R₂ + …" },
        { title: "Add the values", math: resistors.join(" + ") + ` = ${fmt(total, 4)} Ω` },
        {
          title: "The current is the same everywhere in the loop",
          math: Number.isFinite(supply) ? `I = V ⁄ R = ${fmt(supply)} ÷ ${fmt(total, 4)} = ${fmt(supply / total, 4)} A` : "Use I = V ÷ R with the supply voltage.",
        },
        {
          title: "The p.d. splits between the resistors",
          math: Number.isFinite(supply)
            ? resistors.map((value) => `${fmt((supply / total) * value, 3)} V`).join(" + ")
            : "Add the individual p.d.s to check they total the supply.",
        },
      ];
      return {
        ok: true,
        output: {
          answer: `total R = ${fmt(total, 4)} Ω`,
          extras: Number.isFinite(supply) ? [`current = ${fmt(supply / total, 4)} A`] : undefined,
          steps,
          note: "In series, the total resistance is always bigger than the largest single resistor.",
        },
      };
    }

    const reciprocalSum = resistors.reduce((sum, value) => sum + 1 / value, 0);
    const total = 1 / reciprocalSum;
    const supply = num(values, "supply");
    const branches = Number.isFinite(supply)
      ? resistors.map((value) => `${fmt(supply, 3)} V ÷ ${fmt(value)} Ω = ${fmt(supply / value, 4)} A`)
      : [];
    const totalCurrent = Number.isFinite(supply) ? supply / total : NaN;

    return {
      ok: true,
      output: {
        answer: `total R = ${fmt(total, 4)} Ω`,
        extras: Number.isFinite(supply)
          ? [`total current = ${fmt(totalCurrent, 4)} A`, `branch currents: ${branches.join(", ")}`]
          : undefined,
        steps: [
          { title: "In parallel the reciprocals add", math: "1⁄R = 1⁄R₁ + 1⁄R₂ + …" },
          {
            title: "Write each reciprocal",
            math: resistors.map((value) => `1⁄${fmt(value)} = ${fmt(1 / value, 6)}`).join("  +  "),
          },
          { title: "Add them", math: `1⁄R = ${fmt(reciprocalSum, 6)}` },
          { title: "Flip to get R", math: `R = 1 ÷ ${fmt(reciprocalSum, 6)} = ${fmt(total, 4)} Ω` },
          ...(Number.isFinite(supply)
            ? [
                {
                  title: "Each branch gets the full supply voltage",
                  math: branches.join("; "),
                },
                {
                  title: "The branch currents add to the total current",
                  math: `total I = ${fmt(totalCurrent, 4)} A`,
                },
              ]
            : []),
        ],
        note: "In parallel the total resistance is always smaller than the smallest single resistor.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. Electrical Power & Energy                                       */
/* ------------------------------------------------------------------ */

const electricalPower: CalcTool = {
  kind: "calc",
  name: "Electrical Power & Energy",
  summary: "Power from V and I or from I²R, plus energy transferred and the cost of electricity.",
  formula: "P = VI  ·  P = I²R  ·  E = Pt",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "vi",
      options: [
        { value: "vi", label: "Power P = VI" },
        { value: "i2r", label: "Power P = I²R" },
        { value: "energy", label: "Energy transferred E = Pt" },
        { value: "cost", label: "Cost of electricity" },
      ],
    },
    { id: "v", label: "Voltage V", type: "number", defaultValue: "230", unit: "V" },
    { id: "i", label: "Current I", type: "number", defaultValue: "4", unit: "A" },
    { id: "r", label: "Resistance R", type: "number", defaultValue: "10", unit: "Ω" },
    { id: "power", label: "Power P", type: "number", defaultValue: "2000", unit: "W" },
    { id: "time", label: "Time t", type: "number", defaultValue: "1800", unit: "s" },
    { id: "hours", label: "Time in use", type: "number", defaultValue: "3", unit: "hours" },
    { id: "price", label: "Price per kWh", type: "number", defaultValue: "0.28", unit: "£" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "vi") {
      const v = num(values, "v");
      const i = num(values, "i");
      if (!Number.isFinite(v) || !Number.isFinite(i)) return fail("Enter the voltage and the current.");
      const p = v * i;
      return {
        ok: true,
        output: {
          answer: `P = ${fmt(p, 4)} W`,
          steps: [
            { title: "Electrical power is voltage times current", math: "P = V × I" },
            { title: "Substitute", math: `P = ${fmt(v)} V × ${fmt(i)} A` },
            { title: "Evaluate", math: `P = ${fmt(p, 4)} W` },
            { title: "Energy per second", detail: `${fmt(p, 4)} W means ${fmt(p, 4)} joules every second.` },
          ],
        },
      };
    }

    if (mode === "i2r") {
      const i = num(values, "i");
      const r = num(values, "r");
      if (!Number.isFinite(i) || !Number.isFinite(r)) return fail("Enter the current and the resistance.");
      const p = i * i * r;
      return {
        ok: true,
        output: {
          answer: `P = ${fmt(p, 4)} W`,
          steps: [
            { title: "Power can also be found from current and resistance", math: "P = I² × R" },
            { title: "Square the current first", math: `${fmt(i)}² = ${fmt(i * i)}` },
            { title: "Substitute", math: `P = ${fmt(i * i)} × ${fmt(r)}` },
            { title: "Evaluate", math: `P = ${fmt(p, 4)} W` },
          ],
        },
      };
    }

    const power = num(values, "power");
    const time = num(values, "time");
    if (!Number.isFinite(power) || !Number.isFinite(time)) return fail("Enter the power and the time.");
    const energy = power * time;
    return {
      ok: true,
      output: {
        answer: `E = ${fmt(energy, 4)} J`,
        extras: [`= ${fmt(energy / 1000, 4)} kJ`, `= ${fmt((power / 1000) * (time / 3600), 4)} kWh`],
        steps: [
          { title: "Energy transferred is power × time", math: "E = P × t" },
          { title: "Substitute in seconds", math: `E = ${fmt(power)} W × ${fmt(time)} s = ${fmt(energy, 4)} J` },
          { title: "Convert to kWh for electricity bills", math: `kWh = (${fmt(power)} ÷ 1000) × (${fmt(time)} ÷ 3600) = ${fmt((power / 1000) * (time / 3600), 6)} kWh` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. Wave Equation                                                   */
/* ------------------------------------------------------------------ */

const waves: CalcTool = {
  kind: "calc",
  name: "Wave Equation",
  summary: "Wave speed, frequency, wavelength and period, with each rearrangement shown.",
  formula: "v = f × λ  ·  T = 1⁄f",
  fields: [
    {
      id: "mode",
      label: "Find",
      type: "select",
      defaultValue: "speed",
      options: [
        { value: "speed", label: "Wave speed v" },
        { value: "frequency", label: "Frequency f" },
        { value: "wavelength", label: "Wavelength λ" },
        { value: "period", label: "Period T" },
      ],
    },
    { id: "frequency", label: "Frequency f", type: "number", defaultValue: "50", unit: "Hz" },
    { id: "wavelength", label: "Wavelength λ", type: "number", defaultValue: "6.8", unit: "m" },
    { id: "speed", label: "Wave speed v", type: "number", defaultValue: "340", unit: "m/s" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const f = num(values, "frequency");
    const lambda = num(values, "wavelength");
    const v = num(values, "speed");

    if (mode === "speed") {
      if (!Number.isFinite(f) || !Number.isFinite(lambda)) return fail("Enter the frequency and the wavelength.");
      const result = f * lambda;
      return {
        ok: true,
        output: {
          answer: `v = ${fmt(result, 4)} m/s`,
          extras: [`period T = ${fmt(1 / f, 6)} s`],
          steps: [
            { title: "The wave equation", math: "v = f × λ" },
            { title: "Substitute", math: `v = ${fmt(f)} Hz × ${fmt(lambda)} m` },
            { title: "Evaluate", math: `v = ${fmt(result, 4)} m/s` },
            { title: "Period is the time for one wave", math: `T = 1 ⁄ f = 1 ÷ ${fmt(f)} = ${fmt(1 / f, 6)} s` },
          ],
        },
      };
    }

    if (mode === "frequency") {
      if (!Number.isFinite(v) || !Number.isFinite(lambda)) return fail("Enter the wave speed and the wavelength.");
      if (lambda === 0) return fail("The wavelength cannot be zero.");
      const result = v / lambda;
      return {
        ok: true,
        output: {
          answer: `f = ${fmt(result, 4)} Hz`,
          steps: [
            { title: "Rearrange v = fλ for frequency", math: "f = v ⁄ λ" },
            { title: "Substitute", math: `f = ${fmt(v)} ÷ ${fmt(lambda)}` },
            { title: "Evaluate", math: `f = ${fmt(result, 4)} Hz`, detail: "Hertz means waves per second." },
          ],
        },
      };
    }

    if (mode === "wavelength") {
      if (!Number.isFinite(v) || !Number.isFinite(f)) return fail("Enter the wave speed and the frequency.");
      if (f === 0) return fail("The frequency cannot be zero.");
      const result = v / f;
      return {
        ok: true,
        output: {
          answer: `λ = ${fmt(result, 4)} m`,
          steps: [
            { title: "Rearrange v = fλ for wavelength", math: "λ = v ⁄ f" },
            { title: "Substitute", math: `λ = ${fmt(v)} ÷ ${fmt(f)}` },
            { title: "Evaluate", math: `λ = ${fmt(result, 4)} m` },
          ],
        },
      };
    }

    if (!Number.isFinite(f)) return fail("Enter the frequency to find the period.");
    if (f === 0) return fail("The frequency cannot be zero.");
    const result = 1 / f;
    return {
      ok: true,
      output: {
        answer: `T = ${fmt(result, 6)} s`,
        steps: [
          { title: "The period is the time for one complete wave", math: "T = 1 ⁄ f" },
          { title: "Substitute", math: `T = 1 ÷ ${fmt(f)} Hz` },
          { title: "Evaluate", math: `T = ${fmt(result, 6)} s` },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. Lenses & Ray Diagrams                                           */
/* ------------------------------------------------------------------ */

const lenses: CalcTool = {
  kind: "calc",
  name: "Lenses & Ray Diagrams",
  summary: "Magnification and image position for a converging lens.",
  formula: "M = image height ⁄ object height  ·  1⁄f = 1⁄u + 1⁄v",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "magnification",
      options: [
        { value: "magnification", label: "Magnification from the two heights" },
        { value: "imageHeight", label: "Image height from the magnification" },
        { value: "imageDistance", label: "Image distance from the lens formula" },
      ],
    },
    { id: "objectHeight", label: "Object height", type: "number", defaultValue: "4", unit: "cm" },
    { id: "imageHeight", label: "Image height", type: "number", defaultValue: "10", unit: "cm" },
    { id: "magnification", label: "Magnification M", type: "number", defaultValue: "2.5" },
    { id: "focal", label: "Focal length f", type: "number", defaultValue: "10", unit: "cm" },
    { id: "objectDistance", label: "Object distance u", type: "number", defaultValue: "15", unit: "cm" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");

    if (mode === "magnification") {
      const objectHeight = num(values, "objectHeight");
      const imageHeight = num(values, "imageHeight");
      if (!Number.isFinite(objectHeight) || !Number.isFinite(imageHeight)) return fail("Enter both heights.");
      if (objectHeight === 0) return fail("The object height cannot be zero.");
      const m = imageHeight / objectHeight;
      return {
        ok: true,
        output: {
          answer: `M = ${fmt(m, 4)}`,
          extras: [
            m > 1 ? "The image is larger than the object." : m < 1 ? "The image is smaller than the object." : "The image is the same size.",
            m < 0 ? "A negative magnification means the image is inverted." : "A positive value means the image is upright.",
          ],
          steps: [
            { title: "Magnification compares the heights", math: "M = image height ⁄ object height" },
            { title: "Substitute", math: `M = ${fmt(imageHeight)} ÷ ${fmt(objectHeight)}` },
            { title: "Evaluate", math: `M = ${fmt(m, 4)}` },
            { title: "What this tells you", detail: `The image is ${fmt(Math.abs(m), 4)} times the size of the object.` },
          ],
        },
      };
    }

    if (mode === "imageHeight") {
      const objectHeight = num(values, "objectHeight");
      const magnification = num(values, "magnification");
      if (!Number.isFinite(objectHeight) || !Number.isFinite(magnification)) return fail("Enter the object height and the magnification.");
      const imageHeight = objectHeight * magnification;
      return {
        ok: true,
        output: {
          answer: `image height = ${fmt(imageHeight, 4)} cm`,
          steps: [
            { title: "Rearrange M = hi ÷ ho", math: "image height = M × object height" },
            { title: "Substitute", math: `${fmt(magnification)} × ${fmt(objectHeight)}` },
            { title: "Evaluate", math: `= ${fmt(imageHeight, 4)} cm` },
          ],
        },
      };
    }

    const focal = num(values, "focal");
    const objectDistance = num(values, "objectDistance");
    if (!Number.isFinite(focal) || !Number.isFinite(objectDistance)) return fail("Enter the focal length and the object distance.");
    if (focal === 0 || objectDistance === 0) return fail("The focal length and object distance cannot be zero.");
    const imageDistance = 1 / (1 / focal - 1 / objectDistance);
    const real = imageDistance > 0;
    return {
      ok: true,
      output: {
        answer: `v = ${fmt(imageDistance, 4)} cm`,
        extras: [
          real ? "A positive value means a real image that can be caught on a screen." : "A negative value means a virtual image, seen looking through the lens.",
          `magnification = ${fmt(-imageDistance / objectDistance, 4)}`,
        ],
        steps: [
          { title: "Use the lens formula", math: "1⁄f = 1⁄u + 1⁄v" },
          { title: "Rearrange for 1⁄v", math: `1⁄v = 1⁄${fmt(focal)} − 1⁄${fmt(objectDistance)} = ${fmt(1 / focal, 6)} − ${fmt(1 / objectDistance, 6)} = ${fmt(1 / focal - 1 / objectDistance, 6)}` },
          { title: "Flip to find v", math: `v = 1 ÷ ${fmt(1 / focal - 1 / objectDistance, 6)} = ${fmt(imageDistance, 4)} cm` },
          { title: "Find the magnification", math: `M = −v ⁄ u = ${fmt(-imageDistance / objectDistance, 4)}` },
          {
            title: "Describe the image",
            detail: real
              ? "Real, inverted and can be projected onto a screen."
              : "Virtual, upright and on the same side as the object — the lens acts as a magnifying glass.",
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. Thermal Energy Calculator                                       */
/* ------------------------------------------------------------------ */

const thermal: CalcTool = {
  kind: "calc",
  name: "Thermal Energy Calculator",
  summary: "Specific heat capacity and latent heat, with the temperature change worked out first.",
  formula: "Q = mcΔT  ·  Q = mL",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "heat",
      options: [
        { value: "heat", label: "Heating up  Q = mcΔT" },
        { value: "latent", label: "Changing state  Q = mL" },
      ],
    },
    { id: "mass", label: "Mass m", type: "number", defaultValue: "2", unit: "kg" },
    { id: "c", label: "Specific heat capacity c", type: "number", defaultValue: "4200", unit: "J/kg°C" },
    { id: "t1", label: "Starting temperature", type: "number", defaultValue: "20", unit: "°C" },
    { id: "t2", label: "Final temperature", type: "number", defaultValue: "80", unit: "°C" },
    { id: "l", label: "Specific latent heat L", type: "number", defaultValue: "334000", unit: "J/kg" },
    { id: "power", label: "Heater power (optional)", type: "number", defaultValue: "2000", unit: "W" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const mass = num(values, "mass");
    const power = num(values, "power");

    if (mode === "latent") {
      const l = num(values, "l");
      if (!Number.isFinite(mass) || !Number.isFinite(l)) return fail("Enter the mass and the specific latent heat.");
      const q = mass * l;
      return {
        ok: true,
        output: {
          answer: `Q = ${fmt(q, 4)} J`,
          extras: [`= ${fmt(q / 1000, 4)} kJ`, Number.isFinite(power) ? `time at ${fmt(power)} W: ${fmt(q / power, 3)} s` : ""].filter(Boolean),
          steps: [
            { title: "Changing state needs energy but no temperature change", math: "Q = m × L" },
            { title: "Substitute", math: `Q = ${fmt(mass)} kg × ${fmt(l)} J/kg` },
            { title: "Evaluate", math: `Q = ${fmt(q, 4)} J` },
            ...(Number.isFinite(power)
              ? [{ title: "How long a heater would take", math: `t = Q ⁄ P = ${fmt(q, 4)} ÷ ${fmt(power)} = ${fmt(q / power, 3)} s` }]
              : []),
          ],
          note: "During a change of state the temperature stays constant — all the energy goes into breaking bonds.",
        },
      };
    }

    const c = num(values, "c");
    const t1 = num(values, "t1");
    const t2 = num(values, "t2");
    if (![mass, c, t1, t2].every(Number.isFinite)) return fail("Enter the mass, the specific heat capacity and both temperatures.");
    const deltaT = t2 - t1;
    const q = mass * c * deltaT;
    return {
      ok: true,
      output: {
        answer: `Q = ${fmt(q, 4)} J`,
        extras: [`ΔT = ${fmt(deltaT, 4)} °C`, `= ${fmt(q / 1000, 4)} kJ`],
        steps: [
          { title: "Work out the temperature change first", math: `ΔT = ${fmt(t2)} − ${fmt(t1)} = ${fmt(deltaT, 4)} °C` },
          { title: "Energy needed to heat something", math: "Q = m × c × ΔT" },
          { title: "Substitute", math: `Q = ${fmt(mass)} × ${fmt(c)} × ${fmt(deltaT, 4)}` },
          { title: "Evaluate", math: `Q = ${fmt(q, 4)} J` },
          { title: "If it is cooling", detail: "The same equation gives the energy released, and the answer will be negative." },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. Half-life & Radioactivity                                       */
/* ------------------------------------------------------------------ */

const halfLife: CalcTool = {
  kind: "calc",
  name: "Half-life & Radioactivity",
  summary: "Work out how much activity remains after a given time, with a decay table.",
  formula: "A = A₀ ÷ 2ⁿ  where n = time ÷ half-life",
  fields: [
    { id: "initial", label: "Initial activity A₀", type: "number", defaultValue: "800", unit: "Bq" },
    { id: "halfLife", label: "Half-life", type: "number", defaultValue: "5", unit: "years" },
    { id: "time", label: "Time elapsed", type: "number", defaultValue: "20", unit: "years" },
  ],
  solve(values: Values): SolveOutcome {
    const initial = num(values, "initial");
    const halfLife = num(values, "halfLife");
    const time = num(values, "time");
    if (![initial, halfLife, time].every(Number.isFinite)) return fail("Enter the initial activity, the half-life and the time.");
    if (halfLife <= 0) return fail("The half-life must be greater than zero.");

    const n = time / halfLife;
    const remaining = initial / Math.pow(2, n);

    const rows: string[][] = [];
    const wholeHalves = Math.min(Math.floor(n) + 1, 12);
    for (let index = 0; index <= wholeHalves; index += 1) {
      rows.push([
        String(index),
        fmt(index * halfLife, 3),
        fmt(initial / Math.pow(2, index), 4),
      ]);
    }

    return {
      ok: true,
      output: {
        answer: `A = ${fmt(remaining, 4)} Bq`,
        extras: [
          `half-lives elapsed n = ${fmt(n, 3)}`,
          `${fmt((remaining / initial) * 100, 3)}% of the original activity remains`,
        ],
        tables: [
          {
            caption: "Decay table",
            headers: ["Half-lives", "Time", "Activity (Bq)"],
            rows,
          },
        ],
        steps: [
          { title: "Count how many half-lives have passed", math: `n = ${fmt(time)} ÷ ${fmt(halfLife)} = ${fmt(n, 4)}` },
          {
            title: "Halve the activity that many times",
            math: `A = ${fmt(initial)} ÷ 2^${fmt(n, 4)}`,
          },
          { title: "Evaluate", math: `2^${fmt(n, 4)} = ${fmt(Math.pow(2, n), 6)}, so A = ${fmt(remaining, 4)} Bq` },
          {
            title: "Check against the table",
            detail: "Each row is one more half-life, so the activity should halve every step.",
          },
        ],
        note: "Half-life is the time for half the unstable nuclei to decay. It is not affected by temperature or pressure.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. Pressure in Fluids                                              */
/* ------------------------------------------------------------------ */

const fluidPressure: CalcTool = {
  kind: "calc",
  name: "Pressure in Fluids",
  summary: "Liquid pressure with depth and the upthrust on a submerged object.",
  formula: "P = hρg  ·  upthrust = ρVg",
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "depth",
      options: [
        { value: "depth", label: "Pressure at a depth" },
        { value: "upthrust", label: "Upthrust on a submerged object" },
      ],
    },
    { id: "height", label: "Depth h", type: "number", defaultValue: "12", unit: "m" },
    { id: "density", label: "Fluid density ρ", type: "number", defaultValue: "1030", unit: "kg/m³" },
    { id: "volume", label: "Displaced volume V", type: "number", defaultValue: "0.004", unit: "m³" },
  ],
  solve(values: Values): SolveOutcome {
    const mode = str(values, "mode");
    const density = num(values, "density");
    if (!Number.isFinite(density)) return fail("Enter the fluid density.");

    if (mode === "depth") {
      const height = num(values, "height");
      if (!Number.isFinite(height)) return fail("Enter the depth.");
      const p = height * density * G;
      return {
        ok: true,
        output: {
          answer: `P = ${fmt(p, 4)} Pa`,
          extras: [`= ${fmt(p / 1000, 4)} kPa`, `additional pressure from the water alone`],
          steps: [
            { title: "Pressure in a liquid depends on depth, density and gravity", math: "P = h × ρ × g" },
            { title: "Substitute", math: `P = ${fmt(height)} × ${fmt(density)} × ${fmt(G)}` },
            { title: "Evaluate", math: `P = ${fmt(p, 4)} Pa` },
            { title: "Why dams are thicker at the bottom", detail: "Pressure grows steadily with depth, so the deepest part of a dam takes the greatest force." },
          ],
        },
      };
    }

    const volume = num(values, "volume");
    if (!Number.isFinite(volume)) return fail("Enter the displaced volume.");
    const upthrust = density * volume * G;
    return {
      ok: true,
      output: {
        answer: `upthrust = ${fmt(upthrust, 4)} N`,
        extras: [`mass of fluid displaced = ${fmt(density * volume, 4)} kg`],
        steps: [
          { title: "Upthrust equals the weight of fluid pushed out of the way", math: "upthrust = ρ × V × g" },
          { title: "Substitute", math: `upthrust = ${fmt(density)} × ${fmt(volume)} × ${fmt(G)}` },
          { title: "Evaluate", math: `upthrust = ${fmt(upthrust, 4)} N` },
          {
            title: "Decide whether it floats",
            detail: "Compare the upthrust with the object's weight: if the upthrust is larger, it floats.",
          },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. Formula Sheet by Topic                                         */
/* ------------------------------------------------------------------ */

const formulaSheet: ExplorerTool = {
  kind: "explorer",
  name: "Formula Sheet by Topic",
  summary: "Every IGCSE Physics equation, grouped by topic and ready to copy.",
  topics: [
    {
      id: "motion",
      name: "Motion & forces",
      summary: "Speed, acceleration, forces and momentum.",
      mono: [
        "average speed: v = d / t",
        "acceleration: a = (v − u) / t",
        "force: F = m × a",
        "weight: W = m × g",
        "momentum: p = m × v",
        "moment: M = F × d",
        "principle of moments: F₁d₁ = F₂d₂",
        "density: ρ = m / V",
        "pressure: P = F / A",
      ],
    },
    {
      id: "energy",
      name: "Energy & power",
      summary: "Work, energy stores and efficiency.",
      mono: [
        "work done: W = F × d",
        "power: P = W / t",
        "kinetic energy: KE = ½mv²",
        "gravitational potential energy: GPE = mgh",
        "efficiency = useful output / total input × 100%",
        "energy transferred: E = P × t",
      ],
    },
    {
      id: "thermal",
      name: "Thermal physics",
      summary: "Heating, changing state and gas behaviour.",
      mono: [
        "specific heat capacity: Q = mcΔT",
        "specific latent heat: Q = mL",
        "gas pressure × volume = constant (at fixed temperature)",
        "P₁V₁ = P₂V₂",
      ],
    },
    {
      id: "waves",
      name: "Waves",
      summary: "The wave equation and the electromagnetic spectrum.",
      mono: [
        "wave speed: v = f × λ",
        "period: T = 1 / f",
        "refractive index: n = sin i / sin r",
        "law of reflection: angle of incidence = angle of reflection",
        "speed of light in a vacuum: 3.0 × 10⁸ m/s",
      ],
    },
    {
      id: "electricity",
      name: "Electricity & magnetism",
      summary: "Circuits, power and electromagnetic induction.",
      mono: [
        "Ohm's law: V = I × R",
        "charge: Q = I × t",
        "power: P = V × I,  P = I²R",
        "energy: E = P × t",
        "series resistance: R = R₁ + R₂",
        "parallel resistance: 1/R = 1/R₁ + 1/R₂",
        "transformer: V₁/V₂ = N₁/N₂",
        "efficiency of a transformer: I₁V₁ = I₂V₂ (ideal)",
      ],
    },
    {
      id: "nuclear",
      name: "Nuclear physics",
      summary: "Decay, half-life and energy from the nucleus.",
      mono: [
        "half-life: A = A₀ / 2ⁿ, where n = time / half-life",
        "fraction remaining = (½)ⁿ",
        "energy from fission and fusion: E = mc² (context only)",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 19. Worksheet Generator                                             */
/* ------------------------------------------------------------------ */

const physicsBank: QuestionBank = {
  speed: (rng) => {
    const d = randInt(rng, 40, 900);
    const t = randInt(rng, 4, 60);
    const v = d / t;
    return {
      prompt: `A cyclist travels ${d} m in ${t} s. Calculate the average speed.`,
      answer: `${v.toFixed(2)} m/s`,
      working: `v = d ÷ t = ${d} ÷ ${t} = ${v.toFixed(2)} m/s`,
    };
  },
  acceleration: (rng) => {
    const u = randInt(rng, 0, 12);
    const v = u + randInt(rng, 4, 20);
    const t = randInt(rng, 2, 12);
    const a = (v - u) / t;
    return {
      prompt: `A car speeds up from ${u} m/s to ${v} m/s in ${t} s. Find the acceleration.`,
      answer: `${a.toFixed(2)} m/s²`,
      working: `a = (v − u) ÷ t = (${v} − ${u}) ÷ ${t} = ${a.toFixed(2)} m/s²`,
    };
  },
  force: (rng) => {
    const m = randInt(rng, 2, 1500);
    const a = randInt(rng, 2, 25) / 2;
    const f = m * a;
    return {
      prompt: `Find the force needed to accelerate a mass of ${m} kg at ${a} m/s².`,
      answer: `${f.toFixed(2)} N`,
      working: `F = ma = ${m} × ${a} = ${f.toFixed(2)} N`,
    };
  },
  energy: (rng) => {
    const m = randInt(rng, 1, 60);
    const v = randInt(rng, 2, 25);
    const ke = 0.5 * m * v * v;
    return {
      prompt: `Calculate the kinetic energy of a ${m} kg object moving at ${v} m/s.`,
      answer: `${ke.toFixed(2)} J`,
      working: `KE = ½mv² = ½ × ${m} × ${v}² = ${ke.toFixed(2)} J`,
    };
  },
  ohm: (rng) => {
    const i = randInt(rng, 1, 50) / 10;
    const r = randInt(rng, 2, 60);
    const v = i * r;
    return {
      prompt: `A current of ${i} A flows through a ${r} Ω resistor. Find the potential difference.`,
      answer: `${v.toFixed(2)} V`,
      working: `V = IR = ${i} × ${r} = ${v.toFixed(2)} V`,
    };
  },
  power: (rng) => {
    const v = pick(rng, [12, 24, 230]);
    const i = randInt(rng, 1, 60) / 10;
    const p = v * i;
    return {
      prompt: `An appliance runs on ${v} V and draws ${i} A. Calculate its power.`,
      answer: `${p.toFixed(2)} W`,
      working: `P = VI = ${v} × ${i} = ${p.toFixed(2)} W`,
    };
  },
  waves: (rng) => {
    const f = randInt(rng, 20, 900);
    const lambda = randInt(rng, 1, 400) / 100;
    const v = f * lambda;
    return {
      prompt: `A wave has frequency ${f} Hz and wavelength ${lambda} m. Find its speed.`,
      answer: `${v.toFixed(2)} m/s`,
      working: `v = fλ = ${f} × ${lambda} = ${v.toFixed(2)} m/s`,
    };
  },
  density: (rng) => {
    const m = randInt(rng, 50, 900);
    const v = randInt(rng, 20, 400);
    const rho = m / v;
    return {
      prompt: `A block of mass ${m} g has volume ${v} cm³. Calculate its density.`,
      answer: `${rho.toFixed(3)} g/cm³`,
      working: `ρ = m ÷ V = ${m} ÷ ${v} = ${rho.toFixed(3)} g/cm³`,
    };
  },
  thermal: (rng) => {
    const m = randInt(rng, 1, 10);
    const c = pick(rng, [4200, 900, 1300]);
    const dT = randInt(rng, 5, 60);
    const q = m * c * dT;
    return {
      prompt: `How much energy raises ${m} kg of a material (c = ${c} J/kg°C) by ${dT} °C?`,
      answer: `${q} J`,
      working: `Q = mcΔT = ${m} × ${c} × ${dT} = ${q} J`,
    };
  },
  halfLife: (rng) => {
    const initial = pick(rng, [400, 800, 1200, 2000]);
    const halflife = pick(rng, [2, 5, 8, 10]);
    const n = randInt(rng, 1, 5);
    const remaining = initial / Math.pow(2, n);
    return {
      prompt: `A source starts at ${initial} Bq with a half-life of ${halflife} years. Find its activity after ${n * halflife} years.`,
      answer: `${remaining} Bq`,
      working: `${n * halflife} ÷ ${halflife} = ${n} half-lives, so ${initial} ÷ 2^${n} = ${remaining} Bq`,
    };
  },
};

const PHYSICS_BANK_LABELS: [string, string][] = [
  ["speed", "Speed and distance"],
  ["acceleration", "Acceleration"],
  ["force", "Forces (F = ma)"],
  ["energy", "Kinetic energy"],
  ["ohm", "Ohm's law"],
  ["power", "Electrical power"],
  ["waves", "Wave equation"],
  ["density", "Density"],
  ["thermal", "Specific heat capacity"],
  ["halfLife", "Half-life"],
];

const worksheet: CalcTool = {
  kind: "calc",
  name: "Worksheet Generator",
  summary: "Build a topic-based Physics practice paper with answers and working.",
  fields: [
    {
      id: "topic",
      label: "Topic",
      type: "select",
      defaultValue: "speed",
      options: PHYSICS_BANK_LABELS.map(([value, label]) => ({ value, label })),
    },
    countField("8"),
    seedField("1"),
  ],
  solve(values: Values): SolveOutcome {
    const topic = str(values, "topic");
    const count = clampCount(num(values, "count"));
    const seed = Number.isFinite(num(values, "seed")) ? num(values, "seed") : 1;
    const label = PHYSICS_BANK_LABELS.find(([key]) => key === topic)?.[1] ?? topic;
    const questions = buildPaper(physicsBank, topic, count, mulberry32(seed));
    if (questions.length === 0) return fail("Pick a topic to generate questions.");

    return {
      ok: true,
      output: {
        answer: `${questions.length} questions on ${label}`,
        steps: [
          { title: "Topic and length", math: `${label} · ${questions.length} questions` },
          { title: "Seeded paper", math: `seed = ${seed}` },
          { title: "Answer key included", detail: "Each answer shows the equation, the substitution and the unit." },
        ],
        tables: paperTables(questions, label),
        note: "Always show the equation, the substitution and the unit in your answer.",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. Practical Skills Guide                                          */
/* ------------------------------------------------------------------ */

const practical: ExplorerTool = {
  kind: "explorer",
  name: "Practical Skills Guide",
  summary: "Variables, graph rules, uncertainties and apparatus, all in one place.",
  topics: [
    {
      id: "variables",
      name: "Variables",
      summary: "Independent, dependent and control variables.",
      points: [
        "The independent variable is the one you deliberately change.",
        "The dependent variable is the one you measure — it should change as a result.",
        "Control variables are everything else you keep the same so the test is fair.",
      ],
      table: {
        caption: "Example: testing how a spring stretches",
        headers: ["Variable", "What it is"],
        rows: [
          ["Independent", "the load hung on the spring"],
          ["Dependent", "the extension of the spring"],
          ["Control", "same spring, same room temperature, reading at eye level"],
        ],
      },
    },
    {
      id: "fair",
      name: "Accuracy, precision & errors",
      summary: "How to describe and reduce error.",
      points: [
        "Random errors scatter above and below the true value — repeat readings and average them.",
        "Systematic errors shift every reading the same way, such as a zero error on a balance.",
        "Accuracy is how close to the true value; precision is how consistent repeated readings are.",
      ],
      mono: [
        "mean = sum of readings / number of readings",
        "percentage error = (uncertainty ÷ reading) × 100%",
      ],
    },
    {
      id: "graphs",
      name: "Graphs",
      summary: "Plotting, gradients and what the shape tells you.",
      points: [
        "Plot the independent variable on the x-axis and the dependent variable on the y-axis.",
        "Use a sharp pencil, plot the points clearly and draw a smooth best-fit line or curve.",
        "The gradient often represents a physical quantity: gradient × constant = value.",
      ],
      mono: [
        "gradient = (y₂ − y₁) / (x₂ − x₁)",
        "use a large triangle when finding a gradient",
        "y = mx + c: m is the gradient, c is the intercept",
      ],
    },
    {
      id: "uncertainty",
      name: "Uncertainties & significant figures",
      summary: "Quoting results honestly.",
      points: [
        "The uncertainty of an analogue scale is usually half the smallest division.",
        "For a digital display, use the last digit plus or minus one.",
        "Quote your final answer to the same precision as your measurements, or to 3 significant figures.",
      ],
      mono: [
        "reading = value ± uncertainty",
        "percentage uncertainty = (uncertainty ÷ value) × 100%",
      ],
    },
    {
      id: "apparatus",
      name: "Choosing apparatus",
      summary: "Which instrument to reach for, and why.",
      table: {
        caption: "Common apparatus",
        headers: ["Measuring", "Apparatus", "Why"],
        rows: [
          ["Length (small)", "vernier callipers / micrometer", "reads to 0.1 mm or better"],
          ["Length (large)", "metre rule", "long range, reads to 1 mm"],
          ["Time", "stopwatch or light gate", "light gates remove reaction time"],
          ["Liquid volume", "burette / measuring cylinder", "burette is more precise"],
          ["Temperature", "thermometer / data logger", "data logger records continuously"],
          ["Mass", "top-pan balance", "reads to 0.01 g or better"],
        ],
      },
    },
    {
      id: "safety",
      name: "Safety & method",
      summary: "Writing a method that would score full marks.",
      points: [
        "Write the method as numbered steps someone else could follow exactly.",
        "State the range and interval of the independent variable, and say how many readings you took.",
        "Repeat each reading and calculate a mean to reduce random error.",
        "Identify the main hazard and the precaution you took.",
      ],
      mono: [
        "range: e.g. 0–10 N in steps of 1 N",
        "repeats: 3 readings per value, then mean",
      ],
    },
  ],
};

export const PHYSICS_TOOLS: ToolDefinition[] = [
  unitConverter,
  motion,
  motionGraph,
  force,
  weight,
  densityPressure,
  moments,
  workEnergy,
  kinetic,
  ohmsLaw,
  circuits,
  electricalPower,
  waves,
  lenses,
  thermal,
  halfLife,
  fluidPressure,
  formulaSheet,
  worksheet,
  practical,
];
