import type { Drawing, Shape } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

const DEFAULT_FILL = "var(--muted)";
const DEFAULT_STROKE = "var(--border)";

function renderShape(shape: Shape, key: number) {
  switch (shape.t) {
    case "circle":
      return (
        <circle
          key={key}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={shape.fill ?? DEFAULT_FILL}
          stroke={shape.stroke ?? DEFAULT_STROKE}
          strokeWidth={shape.width ?? 1}
        />
      );
    case "rect":
      return (
        <rect
          key={key}
          x={shape.x}
          y={shape.y}
          width={shape.w}
          height={shape.h}
          rx={shape.rx ?? 6}
          fill={shape.fill ?? DEFAULT_FILL}
          stroke={shape.stroke ?? DEFAULT_STROKE}
          strokeWidth={shape.width ?? 1}
        />
      );
    case "path":
      return (
        <path
          key={key}
          d={shape.d}
          fill={shape.fill ?? DEFAULT_FILL}
          stroke={shape.stroke ?? DEFAULT_STROKE}
          strokeWidth={shape.width ?? 1}
        />
      );
    case "text":
      return (
        <text
          key={key}
          x={shape.x}
          y={shape.y}
          fontSize={shape.size ?? 9}
          textAnchor={shape.anchor ?? "middle"}
          fill="var(--foreground)"
          opacity={0.75}
          fontFamily="var(--font-mono)"
        >
          {shape.s}
        </text>
      );
    default:
      return null;
  }
}

/**
 * Renders an original IGCtools diagram. Every diagram on the site is declared
 * as plain shape data and drawn here — nothing is sourced from a textbook.
 */
export function DrawingFigure({
  drawing,
  markers,
  className,
}: {
  drawing: Drawing;
  /** Optional numbered markers pinned to diagram parts (0–100 coordinates). */
  markers?: { id: string; x: number; y: number; label: string; active?: boolean }[];
  className?: string;
}) {
  return (
    <svg
      viewBox={drawing.viewBox}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Original IGCtools diagram"
    >
      {drawing.shapes.map(renderShape)}
      {markers?.map((marker) => (
        <g key={marker.id}>
          <circle
            cx={marker.x}
            cy={marker.y}
            r={7}
            fill={marker.active ? "var(--subject)" : "var(--card)"}
            stroke={marker.active ? "var(--subject)" : "var(--border)"}
            strokeWidth={1.5}
          />
          <text
            x={marker.x}
            y={marker.y + 3.5}
            fontSize={8}
            textAnchor="middle"
            fill={marker.active ? "var(--card)" : "var(--muted-foreground)"}
            fontFamily="var(--font-mono)"
          >
            {marker.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
