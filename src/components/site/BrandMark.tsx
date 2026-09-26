/**
 * NovaTools brand mark — an original SVG "nova" spark inside an orbit.
 *
 * Drawn flat and single-colour so it inherits `currentColor`: the accent is used
 * for key icons only, never as a background fill. Not sourced from any external
 * asset.
 */
export function BrandMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      role="img"
      aria-label="NovaTools"
    >
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="5"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.6"
        transform="rotate(-28 16 16)"
      />
      <path
        d="M16 5c1 5.2 2.6 6.8 7.8 7.8-5.2 1-6.8 2.6-7.8 7.8-1-5.2-2.6-6.8-7.8-7.8C13.4 11.8 15 10.2 16 5Z"
        fill="currentColor"
      />
      <circle cx="25.5" cy="9" r="1.8" fill="currentColor" />
    </svg>
  );
}
