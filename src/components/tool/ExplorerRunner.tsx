import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import { ResultView } from "@/components/tool/ResultView";
import { DrawingFigure } from "@/components/tool/ToolDiagram";
import { ToolPanels } from "@/components/tool/ToolPanels";
import { Button } from "@/components/ui/button";
import type { ExplorerTool, ExplorerTopic, ResultTable } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

function TopicTable({ table }: { table: ResultTable }) {
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
                    className={cn(
                      "px-4 py-2 text-sm",
                      cellIndex === 0 && "font-medium",
                    )}
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

/** Term/definition trainer built from a topic's two-column table. */
function FlashcardTrainer({ table }: { table: ResultTable }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = table.rows[index];
  const total = table.rows.length;

  return (
    <div>
      <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
        Card {index + 1} of {total}
      </p>

      <motion.div
        key={`${index}-${revealed}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4 rounded-lg border border-border bg-card px-6 py-6"
      >
        <p className="text-label text-muted-foreground uppercase">
          {table.headers[0]}
        </p>
        <p className="mt-2 text-xl font-semibold tracking-tight">
          {card?.[0]}
        </p>

        {revealed ? (
          <>
            <p className="text-label mt-6 text-muted-foreground uppercase">
              {table.headers[1]}
            </p>
            <p className="mt-2 text-sm">{card?.[1]}</p>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Try to recall the definition, then reveal it.
          </p>
        )}
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Button
          type="button"
          variant={revealed ? "outline" : "default"}
          onClick={() => setRevealed((value) => !value)}
        >
          {revealed ? "Hide definition" : "Reveal definition"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={total < 2}
          onClick={() => {
            setIndex((value) => (value - 1 + total) % total);
            setRevealed(false);
          }}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={total < 2}
          onClick={() => {
            setIndex((value) => (value + 1) % total);
            setRevealed(false);
          }}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={() => {
            setIndex(0);
            setRevealed(false);
          }}
        >
          <RotateCcw className="size-4" />
          Restart
        </Button>
      </div>
    </div>
  );
}

function TopicContent({ topic, index }: { topic: ExplorerTopic; index: number }) {
  return (
    <div>
      <ResultView
        output={{
          answerLabel: `Topic ${index + 1}`,
          answer: topic.name,
          steps: [],
        }}
      />

      <p className="mt-4 text-sm">{topic.summary}</p>

      {topic.points && topic.points.length > 0 && (
        <ul className="mt-6 space-y-4">
          {topic.points.map((point) => (
            <li key={point} className="flex items-start gap-4 text-sm">
              <span
                aria-hidden
                className="mt-2 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--subject)" }}
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {topic.mono && topic.mono.length > 0 && (
        <div className="mt-6 space-y-2 rounded-lg border border-border bg-card px-6 py-6">
          {topic.mono.map((line) => (
            <p key={line} className="font-mono text-sm break-words">
              {line}
            </p>
          ))}
        </div>
      )}

      {topic.drawing && (
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <DrawingFigure drawing={topic.drawing} />
        </div>
      )}

      {topic.table && !topic.flashcards && <TopicTable table={topic.table} />}
    </div>
  );
}

/**
 * Reference and guide tools: choose a topic on the left, read it on the right.
 * Topics can carry bullet points, formulas, tables, original diagrams or a
 * flashcard trainer.
 */
export function ExplorerRunner({ def }: { def: ExplorerTool }) {
  const [activeId, setActiveId] = useState(def.topics[0]?.id ?? "");
  const activeIndex = Math.max(
    0,
    def.topics.findIndex((topic) => topic.id === activeId),
  );
  const topic = def.topics[activeIndex] ?? def.topics[0];

  if (!topic) {
    return (
      <ToolPanels
        inputs={<p className="text-sm text-muted-foreground">No topics yet.</p>}
        result={<p className="text-sm text-muted-foreground">Nothing to show.</p>}
      />
    );
  }

  return (
    <ToolPanels
      inputs={
        <div className="flex flex-col gap-2">
          <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
            Topics
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {def.topics.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "flex items-start gap-4 rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-accent",
                  item.id === topic.id && "bg-accent",
                )}
              >
                <span
                  className="text-label w-6 shrink-0 font-mono font-semibold"
                  style={{ color: "var(--subject)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      }
      result={
        topic.flashcards && topic.table ? (
          <>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              {topic.name}
            </p>
            <div className="mt-4">
              <FlashcardTrainer table={topic.table} />
            </div>
          </>
        ) : (
          <TopicContent topic={topic} index={activeIndex} />
        )
      }
    />
  );
}
