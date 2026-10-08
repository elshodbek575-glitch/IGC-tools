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
import type {
  CalcTool,
  Field,
  FieldOption,
  SolveOutcome,
  Values,
} from "@/lib/tools/types";

function fieldInputId(toolName: string, fieldId: string) {
  return `tool-${toolName}-${fieldId}`.replace(/[^a-zA-Z0-9-]/g, "-");
}

function normalise(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Resolve a stored field value to the option it refers to. Definitions may name
 * either the option's machine value or its readable label in `defaultValue`, so
 * both are accepted before the match gets loose.
 */
function matchOption(
  options: FieldOption[],
  typed: string,
): FieldOption | undefined {
  const q = normalise(typed);
  if (!q) return undefined;
  return (
    options.find((option) => normalise(option.value) === q) ??
    options.find((option) => normalise(option.label) === q)
  );
}

/**
 * A `select` field with options is a real dropdown — a closed set of choices is
 * picked, never typed. Everything else (numbers, and wordy text like a formula
 * or a data list) stays a typed input.
 */
function choices(field: Field): FieldOption[] | null {
  const options = field.options ?? [];
  return field.type === "select" && options.length > 0 ? options : null;
}

export function CalcRunner({ def }: { def: CalcTool }) {
  const { t } = useI18n();

  /** Stored values. For a select field this is always an option's `value`. */
  const initial = useMemo(() => {
    const values: Values = {};
    for (const field of def.fields) {
      const fallback = field.defaultValue ?? "";
      const options = choices(field);
      values[field.id] = options
        ? (matchOption(options, fallback)?.value ?? "")
        : fallback;
    }
    return values;
  }, [def]);

  const [values, setValues] = useState<Values>(initial);
  const [outcome, setOutcome] = useState<SolveOutcome | null>(() =>
    hasDefaults(initial) ? def.solve(initial) : null,
  );

  /**
   * Every change recalculates, the way a calculator behaves. The Solve button
   * stays for muscle memory, but it is never required.
   */
  const apply = (id: string, stored: string) => {
    const next = { ...values, [id]: stored };
    setValues(next);
    setOutcome(def.solve(next));
  };

  const reset = () => {
    setValues(initial);
    setOutcome(hasDefaults(initial) ? def.solve(initial) : null);
  };

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
            setOutcome(def.solve(values));
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {def.fields.map((field) => {
              const id = fieldInputId(def.name, field.id);
              const options = choices(field);

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

                  {options ? (
                    <Select
                      value={values[field.id] || undefined}
                      onValueChange={(next) => apply(field.id, next)}
                    >
                      <SelectTrigger id={id} className="mt-2 w-full">
                        <SelectValue placeholder={t("calc.chooseOption")} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
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
                      autoComplete="off"
                      inputMode={field.type === "number" ? "decimal" : undefined}
                      value={values[field.id] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(event) => apply(field.id, event.target.value)}
                    />
                  )}

                  {field.hint ? (
                    <p className="text-label mt-2 text-muted-foreground">
                      {field.hint}
                    </p>
                  ) : null}
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
              onClick={reset}
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
