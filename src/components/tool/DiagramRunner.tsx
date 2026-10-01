import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";

import { DrawingFigure } from "@/components/tool/ToolDiagram";
import { ToolPanels } from "@/components/tool/ToolPanels";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { DiagramTool } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

export function DiagramRunner({ def }: { def: DiagramTool }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"reference" | "quiz">("quiz");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const part = def.parts[index];
  const isCorrect = picked === part?.name;

  const options = useMemo(() => {
    if (!part) return [];
    const others = def.parts.filter((item) => item.id !== part.id).map((item) => item.name);
    const start = index % Math.max(others.length, 1);
    const chosen = others.slice(start).concat(others.slice(0, start)).slice(0, 3);
    const all = [part.name, ...chosen];
    const offset = index % all.length;
    return all.slice(offset).concat(all.slice(0, offset));
  }, [def.parts, index, part]);

  const markers = def.parts.map((item, itemIndex) => ({
    id: item.id,
    x: item.x,
    y: item.y,
    label: String(itemIndex + 1),
    active: item.id === part?.id,
  }));

  const next = () => {
    setIndex((value) => (value + 1) % def.parts.length);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setSolvedCount(0);
    setAttempts(0);
  };

  return (
    <ToolPanels
      inputs={
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              {t("diagram.mode")}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Button
                type="button"
                variant={mode === "quiz" ? "default" : "outline"}
                onClick={() => setMode("quiz")}
              >
                {t("diagram.labelQuiz")}
              </Button>
              <Button
                type="button"
                variant={mode === "reference" ? "default" : "outline"}
                onClick={() => setMode("reference")}
              >
                {t("diagram.showLabels")}
              </Button>
            </div>
          </div>

          {mode === "quiz" ? (
            <div>
              <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
                {t("diagram.whichPart", { number: index + 1 })}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {options.map((option) => {
                  const chosen = picked === option;
                  const correct = option === part.name;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setPicked(option);
                        setAttempts((value) => value + 1);
                        if (correct && picked !== option) {
                          setSolvedCount((value) => value + 1);
                        }
                      }}
                      className={cn(
                        "rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-accent",
                        chosen &&
                          correct &&
                          "border-success/60 bg-success/10 text-success",
                        chosen &&
                          !correct &&
                          "border-destructive/60 bg-destructive/10 text-destructive",
                      )}
                    >
                      <span className="flex items-center gap-4">
                        {chosen ? (
                          correct ? (
                            <Check className="size-4 shrink-0" />
                          ) : (
                            <X className="size-4 shrink-0" />
                          )
                        ) : (
                          <span aria-hidden className="size-4 shrink-0" />
                        )}
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {isCorrect && (
                  <Button type="button" onClick={next}>
                    {t("diagram.nextPart")}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2"
                  onClick={restart}
                >
                  <RotateCcw className="size-4" />
                  {t("diagram.restartQuiz")}
                </Button>
              </div>

              <p className="text-label mt-4 text-muted-foreground">
                {t("diagram.settled", {
                  solved: solvedCount,
                  total: def.parts.length,
                  attempts,
                })}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
                {t("diagram.labelledParts")}
              </p>
              <ol className="mt-4 flex flex-col gap-4">
                {def.parts.map((item, itemIndex) => (
                  <li key={item.id} className="flex gap-4">
                    <span
                      className="text-label w-6 shrink-0 font-mono font-semibold"
                      style={{ color: "var(--subject)" }}
                    >
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {item.name}
                      </span>
                      <span className="mt-2 block text-sm text-muted-foreground">
                        {item.role}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      }
      result={
        <div>
          <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
            {t("diagram.diagram")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "quiz"
              ? t("diagram.hintQuiz")
              : t("diagram.hintReference")}
          </p>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-lg border border-border bg-card p-6"
          >
            <DrawingFigure
              drawing={def.drawing}
              markers={mode === "quiz" ? [markers[index]].filter(Boolean) : undefined}
            />
          </motion.div>

          {mode === "quiz" && part && (
            <p className="text-label mt-4 text-muted-foreground">
              {picked && isCorrect
                ? `${part.name} — ${part.role}`
                : picked
                  ? t("diagram.wrong")
                  : t("diagram.choose")}
            </p>
          )}
        </div>
      }
    />
  );
}
