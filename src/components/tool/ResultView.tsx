import { motion } from "framer-motion";

import { Chart } from "@/components/tool/Chart";
import { useI18n } from "@/lib/i18n";
import type { ResultTable, ToolOutput } from "@/lib/tools/types";

function DataTable({ table }: { table: ResultTable }) {
  return (
    <figure className="mt-6">
      {table.caption && (
        <figcaption className="text-label mb-2 font-semibold tracking-wide text-muted-foreground uppercase">
          {table.caption}
        </figcaption>
      )}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted/60">
              {table.headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="text-label border-b border-border px-4 py-2 font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 font-mono text-sm whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/**
 * The result and working area shared by every tool: headline answer, then the
 * numbered method so the reasoning is always visible.
 */
export function ResultView({ output }: { output: ToolOutput }) {
  const { t } = useI18n();
  return (
    <div>
      <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
        {output.answerLabel ?? t("common.answer")}
      </p>

      <motion.p
        key={output.answer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-2 font-mono text-2xl font-semibold break-words"
      >
        {output.answer}
      </motion.p>

      {output.extras && output.extras.length > 0 && (
        <ul className="mt-2 space-y-1">
          {output.extras.map((extra) => (
            <li key={extra} className="font-mono text-sm text-muted-foreground">
              {extra}
            </li>
          ))}
        </ul>
      )}

      {output.note && (
        <p className="mt-4 text-sm text-muted-foreground">{output.note}</p>
      )}

      {output.steps.length > 0 && (
        <ol className="mt-8 space-y-6">
          {output.steps.map((step, index) => (
            <motion.li
              key={`${index}-${step.title}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.2) }}
              className="flex gap-4"
            >
              <span
                className="text-label w-6 shrink-0 font-mono font-semibold"
                style={{ color: "var(--subject)" }}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{step.title}</p>
                {step.math && (
                  <p className="mt-2 font-mono text-sm break-words">{step.math}</p>
                )}
                {step.detail && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.detail}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      )}

      {output.tables?.map((table, index) => (
        <DataTable key={table.caption ?? index} table={table} />
      ))}

      {output.chart && <Chart chart={output.chart} />}
    </div>
  );
}
