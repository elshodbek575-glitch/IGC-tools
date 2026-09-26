import type { Chart as ChartData } from "@/lib/tools/types";

const W = 340;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };

/** Minimal SVG plot used by the graph and motion tools. */
export function Chart({ chart }: { chart: ChartData }) {
  const all = chart.series.flatMap((series) => series.points);
  if (all.length < 2) return null;

  const xs = all.map((point) => point.x);
  const ys = all.map((point) => point.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(0, ...ys);
  const yMax = Math.max(0, ...ys);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const px = (x: number) =>
    PAD.left + ((x - xMin) / xSpan) * (W - PAD.left - PAD.right);
  const py = (y: number) =>
    H - PAD.bottom - ((y - yMin) / ySpan) * (H - PAD.top - PAD.bottom);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className="mt-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
          {gridLines.map((fraction) => {
            const y = PAD.top + fraction * (H - PAD.top - PAD.bottom);
            const value = yMax - fraction * ySpan;
            return (
              <g key={fraction}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 6}
                  y={y + 3}
                  fontSize="8"
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  fontFamily="var(--font-mono)"
                >
                  {Number(value.toFixed(2))}
                </text>
              </g>
            );
          })}

          <line
            x1={PAD.left}
            y1={py(0)}
            x2={W - PAD.right}
            y2={py(0)}
            stroke="var(--foreground)"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1={PAD.left}
            y1={PAD.top}
            x2={PAD.left}
            y2={H - PAD.bottom}
            stroke="var(--foreground)"
            strokeWidth="1"
            opacity="0.4"
          />

          {chart.series.map((series, index) => (
            <polyline
              key={series.label ?? index}
              points={series.points
                .map((point) => `${px(point.x)},${py(point.y)}`)
                .join(" ")}
              fill="none"
              stroke={series.highlight ? "var(--subject)" : "var(--primary)"}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ))}

          {chart.series.map((series, index) =>
            series.points.map((point, pointIndex) => (
              <circle
                key={`${index}-${pointIndex}`}
                cx={px(point.x)}
                cy={py(point.y)}
                r="2"
                fill={series.highlight ? "var(--subject)" : "var(--primary)"}
              />
            )),
          )}

          <text
            x={(W + PAD.left) / 2}
            y={H - 6}
            fontSize="9"
            textAnchor="middle"
            fill="var(--muted-foreground)"
          >
            {chart.xLabel}
          </text>
          <text
            x={10}
            y={PAD.top - 4}
            fontSize="9"
            fill="var(--muted-foreground)"
          >
            {chart.yLabel}
          </text>
        </svg>
      </div>
      {chart.series.some((series) => series.label) && (
        <figcaption className="text-label mt-2 space-y-1 text-muted-foreground">
          {chart.series.map((series, index) => (
            <span key={series.label ?? index} className="mr-4 inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{
                  backgroundColor: series.highlight
                    ? "var(--subject)"
                    : "var(--primary)",
                }}
              />
              {series.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
