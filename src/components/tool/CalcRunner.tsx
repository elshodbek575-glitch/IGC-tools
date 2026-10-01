import { useMemo, useState } from "react";
import { AlertTriangle, RotateCcw, Wand2 } from "lucide-react";

import { ResultView } from "@/components/tool/ResultView";
import { ToolPanels } from "@/components/tool/ToolPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { hasDefaults } from "@/lib/tools/helpers";
import type { CalcTool, SolveOutcome, Values } from "@/lib/tools/types";

function fieldInputId(toolName: string, fieldId: string) {
  return `tool-${toolName}-${fieldId}`.replace(/[^a-zA-Z0-9-]/g, "-");
}

export function CalcRunner({ def }: { def: CalcTool }) {
  const { t } = useI18n();
  const initial = useMemo(() => {
    const values: Values = {};
    for (const field of def.fields) values[field.id] = field.defaultValue ?? "";
    return values;
  }, [def]);

  const [values, setValues] = useState<Values>(initial);
  const [outcome, setOutcome] = useState<SolveOutcome | null>(() =>
    hasDefaults(initial) ? def.solve(initial) : null,
  );

  const set = (id: string, value: string) =>
    setValues((previous) => ({ ...previous, [id]: value }));

  const solve = (next: Values) => setOutcome(def.solve(next));

  const resultText =
    outcome?.ok
      ? [outcome.output.answer, ...(outcome.output.extras ?? [])].join("\n")
      : undefined;

  return (
    <ToolPanels
      resultText={resultText}
      inputs={
        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            solve(values);
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {def.fields.map((field) => {
              const id = fieldInputId(def.name, field.id);
              return (
                <div key={field.id} className="flex flex-col">
                  <Label htmlFor={id}>
                    {field.label}
                    {field.unit && (
                      <span className="ml-2 font-mono text-muted-foreground">
                        {field.unit}
                      </span>
                    )}
                  </Label>

                  {field.type === "select" ? (
                    <Select
                      value={values[field.id]}
                      onValueChange={(value) => set(field.id, value)}
                    >
                      <SelectTrigger id={id} className="mt-2 w-full">
                        <SelectValue placeholder={t("calc.chooseOption")} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={id}
                      className="mt-2"
                      inputMode={field.type === "number" ? "decimal" : undefined}
                      value={values[field.id]}
                      placeholder={field.placeholder}
                      onChange={(event) => set(field.id, event.target.value)}
                    />
                  )}

                  {field.hint && (
                    <p className="text-label mt-2 text-muted-foreground">
                      {field.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button type="submit" className="gap-2">
              <Wand2 className="size-4" />
              {t("common.solve")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                setValues(initial);
                setOutcome(hasDefaults(initial) ? def.solve(initial) : null);
              }}
            >
              <RotateCcw className="size-4" />
              {t("common.reset")}
            </Button>
          </div>
        </form>
      }
      result={
        outcome === null ? (
          <p className="text-sm text-muted-foreground">
            {t("calc.emptyHint")}
          </p>
        ) : outcome.ok ? (
          <ResultView output={outcome.output} />
        ) : (
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-1 size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">
                {t("calc.cantSolve")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {outcome.error}
              </p>
            </div>
          </div>
        )
      }
    />
  );
}
