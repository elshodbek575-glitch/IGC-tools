import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * IGCtools brand assets — drawn as original SVG, never an external image.
 *
 * `BrandMark` is the hexagonal badge: a dark glass plate with a cyan→blue→
 * violet→magenta gradient rim holding a glowing three-orbit atom. It carries
 * its own colours, so it does not depend on `currentColor`.
 *
 * `Wordmark` is the matching gradient wordmark with an optional letter-spaced
 * tagline underneath ("IGCSE STEM REVISION").
 */

/** Pointy-top hexagon inscribed in the 64×64 view box. */
const HEX_PATH = "M32 3 L57.1 17.5 L57.1 46.5 L32 61 L6.9 46.5 L6.9 17.5 Z";

/** Rotation of each atom orbit, in degrees. */
const ORBIT_ANGLES = [0, 60, 120];

/** Glowing nuclei on the orbits, each tinted to match the rim gradient. */
const NUCLEI: Array<{ x: number; y: number; tint: string }> = [
  { x: 22.5, y: 15.5, tint: "#38e8ff" },
  { x: 51, y: 32, tint: "#7c8cff" },
  { x: 41.5, y: 48.5, tint: "#e05cff" },
];

export function BrandMark({ className = "size-8" }: { className?: string }) {
  // `useId` keeps the gradient/filter ids unique when several marks render at
  // once (header, mobile sheet, footer, dashboard).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ring = `igc-ring-${uid}`;
  const orbit = `igc-orbit-${uid}`;
  const plate = `igc-plate-${uid}`;
  const sheen = `igc-sheen-${uid}`;
  const spec = `igc-spec-${uid}`;
  const core = `igc-core-${uid}`;
  const glow = `igc-glow-${uid}`;
  const clip = `igc-clip-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("brand-spin", className)}
      role="img"
      aria-label="IGCtools"
    >
      <defs>
        <linearGradient id={ring} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="34%" stopColor="#3b82f6" />
          <stop offset="68%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#e135f0" />
        </linearGradient>
        <linearGradient id={spec} x1="0.2" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={orbit} x1="0.05" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor="#5df0ff" />
          <stop offset="52%" stopColor="#6d8cf8" />
          <stop offset="100%" stopColor="#c04cf8" />
        </linearGradient>
        <linearGradient id={sheen} x1="0.08" y1="0" x2="0.62" y2="1">
          <stop offset="0%" stopColor="#96cdff" stopOpacity="0.2" />
          <stop offset="45%" stopColor="#96cdff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={plate} cx="0.5" cy="0.28" r="0.95">
          <stop offset="0%" stopColor="#1d2544" />
          <stop offset="62%" stopColor="#0a1020" />
          <stop offset="100%" stopColor="#04060d" />
        </radialGradient>
        <radialGradient id={core} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#d8f4ff" />
          <stop offset="75%" stopColor="#6cc9ff" />
          <stop offset="100%" stopColor="#6cc9ff" stopOpacity="0" />
        </radialGradient>
        <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <clipPath id={clip}>
          <path d={HEX_PATH} />
        </clipPath>
      </defs>

      {/* Outer bloom */}
      <path
        className="brand-halo"
        d={HEX_PATH}
        fill="none"
        stroke={`url(#${ring})`}
        strokeWidth="5"
        opacity="0.45"
        filter={`url(#${glow})`}
      />

      {/* Glass face + gloss */}
      <path d={HEX_PATH} fill={`url(#${plate})`} />
      <path d={HEX_PATH} fill={`url(#${sheen})`} />
      <path
        d={HEX_PATH}
        fill="none"
        stroke="#8fd8ff"
        strokeOpacity="0.14"
        strokeWidth="1"
        transform="translate(32 32) scale(0.87) translate(-32 -32)"
      />

      {/* Atom, held inside the hexagon. The orbits and their nuclei are one
          group so the whole atom can turn as a unit on hover (see index.css). */}
      <g clipPath={`url(#${clip})`}>
        <g className="brand-atom">
          <g filter={`url(#${glow})`} opacity="0.75">
            {ORBIT_ANGLES.map((angle) => (
              <ellipse
                key={`blur-${angle}`}
                cx="32"
                cy="32"
                rx="19"
                ry="7.6"
                fill="none"
                stroke={`url(#${orbit})`}
                strokeWidth="3"
                transform={`rotate(${angle} 32 32)`}
              />
            ))}
          </g>
          {ORBIT_ANGLES.map((angle) => (
            <ellipse
              key={angle}
              cx="32"
              cy="32"
              rx="19"
              ry="7.6"
              fill="none"
              stroke={`url(#${orbit})`}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
          {NUCLEI.map(({ x, y, tint }) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="5.6" fill={tint} opacity="0.5" filter={`url(#${glow})`} />
              <circle cx={x} cy={y} r="3.6" fill={tint} opacity="0.9" />
              <circle cx={x} cy={y} r="1.9" fill="#ffffff" />
            </g>
          ))}
        </g>

        {/* The core stays put, so the turn reads as the orbits moving around it. */}
        <g className="brand-core">
          <circle cx="32" cy="32" r="7" fill="#4cd8ff" opacity="0.45" filter={`url(#${glow})`} />
          <circle cx="32" cy="32" r="4.6" fill={`url(#${core})`} />
          <circle cx="32" cy="32" r="2.2" fill="#ffffff" />
        </g>
      </g>

      {/* Rim: dark bevel, gradient edge, then a specular highlight along the
          top-left facets so the badge reads as polished glass. */}
      <path
        d={HEX_PATH}
        fill="none"
        stroke="#05070f"
        strokeWidth="5.6"
        strokeLinejoin="round"
      />
      <path
        d={HEX_PATH}
        fill="none"
        stroke={`url(#${ring})`}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d={HEX_PATH}
        fill="none"
        stroke={`url(#${spec})`}
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * The gradient wordmark. `tagline` is passed in (rather than translated here)
 * so callers can supply the localised brand strapline.
 */
export function Wordmark({
  className,
  size = "text-lg",
  tagline,
  taglineClassName,
}: {
  className?: string;
  /** Tailwind text-size class for the wordmark itself. */
  size?: string;
  /** Letter-spaced strapline under the wordmark; omit to hide it. */
  tagline?: string;
  /** Extra classes for the strapline (used to hide it in tight headers). */
  taglineClassName?: string;
}) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "bg-linear-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text font-extrabold tracking-tight text-transparent",
          size,
        )}
      >
        IGCtools
      </span>
      {tagline ? (
        <span
          className={cn(
            "text-label mt-1 font-semibold tracking-[0.2em] text-muted-foreground uppercase",
            taglineClassName,
          )}
        >
          {tagline}
        </span>
      ) : null}
    </span>
  );
}
