import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * IGCtools brand assets — drawn as original SVG, never an external image.
 *
 * `BrandMark` is the hexagonal badge: a dark plate with a cyan→blue→violet→
 * magenta gradient rim holding a glowing three-orbit atom. It carries its own
 * colours, so it does not depend on `currentColor`.
 *
 * `Wordmark` is the matching gradient wordmark with an optional letter-spaced
 * tagline underneath ("IGCSE STEM REVISION").
 */

/** Pointy-top hexagon inscribed in the 64×64 view box. */
const HEX_PATH = "M32 3 L57.1 17.5 L57.1 46.5 L32 61 L6.9 46.5 L6.9 17.5 Z";

/** Rotation of each atom orbit, in degrees. */
const ORBIT_ANGLES = [0, 60, 120];

/** Glowing nuclei sitting on the orbits. */
const NUCLEI: Array<[number, number]> = [
  [22.5, 15.5],
  [51, 32],
  [41.5, 48.5],
];

export function BrandMark({ className = "size-8" }: { className?: string }) {
  // `useId` keeps the gradient/filter ids unique when several marks render at
  // once (header, mobile sheet, footer, dashboard).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ring = `igc-ring-${uid}`;
  const orbit = `igc-orbit-${uid}`;
  const plate = `igc-plate-${uid}`;
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
        <linearGradient id={orbit} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#3ee9ff" />
          <stop offset="50%" stopColor="#5b8cf7" />
          <stop offset="100%" stopColor="#b13cf5" />
        </linearGradient>
        <radialGradient id={plate} cx="0.5" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#161d36" />
          <stop offset="100%" stopColor="#070a14" />
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
        d={HEX_PATH}
        fill="none"
        stroke={`url(#${ring})`}
        strokeWidth="5"
        opacity="0.4"
        filter={`url(#${glow})`}
      />

      {/* Face */}
      <path d={HEX_PATH} fill={`url(#${plate})`} />

      {/* Atom, held inside the hexagon. The orbits and their nuclei are one
          group so the whole atom can turn as a unit on hover (see index.css). */}
      <g clipPath={`url(#${clip})`}>
        <g className="brand-atom">
          <g filter={`url(#${glow})`} opacity="0.8">
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
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
          {NUCLEI.map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3"
              fill="#fff"
              filter={`url(#${glow})`}
            />
          ))}
          {NUCLEI.map(([cx, cy]) => (
            <circle key={`solid-${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#fff" />
          ))}
        </g>
        {/* The core stays put, so the turn reads as the orbits moving around it. */}
        <circle
          className="brand-core"
          cx="32"
          cy="32"
          r="3.4"
          fill="#fff"
          filter={`url(#${glow})`}
        />
        <circle className="brand-core" cx="32" cy="32" r="3.4" fill="#fff" />
      </g>

      {/* Rim */}
      <path
        d={HEX_PATH}
        fill="none"
        stroke={`url(#${ring})`}
        strokeWidth="3.4"
        strokeLinejoin="round"
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
