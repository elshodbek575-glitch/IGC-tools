import { useMemo, useState } from "react";
import { AlertTriangle, RotateCcw, Wand2 } from "lucide-react";

import { ResultView } from "@/components/tool/ResultView";
import { ToolPanels } from "@/components/tool/ToolPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
 * Turn whatever the student typed into one of the field's accepted values.
 * Matching gets looser in stages so "mult" finds "Multiply…" while an exact
 * value typed in full always wins.
 */
function matchOption(
  options: FieldOption[],
  typed: string,
): FieldOption | undefined {
  const q = normalise(typed);
  if (!q) return undefined;
  return (
    options.find((option) => normalise(option.value) === q) ??
    options.find((option) => normalise(option.label) === q) ??
    options.find((option) => normalise(option.value.replace(/[-_]/g, " ")) === q) ??
    options.find((option) => normalise(option.label).startsWith(q)) ??
    options.find((option) => normalise(option.value).startsWith(q)) ??
    options.find((option) => normalise(option.label).includes(q)) ??
    options.find((option) => normalise(option.value).includes(q))
  );
}

/** Short options are offered as one-tap chips; anything wordy is typed. */
function optionsAsChips(field: Field): FieldOption[] | null {
  const options = field.options ?? [];
  if (options.length === 0 || options.length > 8) return null;
  const short = options.every((option) => option.label.length <= 18);
  return short ? options : null;
}

export function CalcRunner({ def }: { def: CalcTool }) {
  const { t } = useI18n();

  const initial = useMemo(() => {
    const values: Values = {};
    for (const field of def.fields) values[field.id] = field.defaultValue ?? "";
    return values;
  }, [def]);

  /** What the student actually sees in each choice box (the readable label). */
  const initialDisplay = useMemo(() => {
    const display: Values = {};
    for (const field of def.fields) {
      const value = initial[field.id] ?? "";
      const match = field.options ? matchOption(field.options, value) : undefined;
      display[field.id] = match ? match.label : value;
    }
    return display;
  }, [def, initial]);

  const [values, setValues] = useState<Values>(initial);
  const [display, setDisplay] = useState<Values>(initialDisplay);
  const [outcome, setOutcome] = useState<SolveOutcome | null>(() =>
    hasDefaults(initial) ? def.solve(initial) : null,
  );

  /**
   * Every keystroke recalculates, the way a calculator behaves. The Solve
   * button stays for muscle memory, but it is never required.
   */
  const apply = (field: Field, stored: string, shown: string) => {
    setDisplay((previous) => ({ ...previous, [field.id]: shown }));
    const next = { ...values, [field.id]: stored };
    setValues(next);
    setOutcome(def.solve(next));
  };

  const setField = (field: Field, typed: string) => {
    const match = field.options ? matchOption(field.options, typed) : undefined;
    apply(field, match ? match.value : typed, typed);
  };

  const reset = () => {
    setValues(initial);
    setDisplay(initialDisplay);
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
              const options = field.options ?? [];
              const chips = optionsAsChips(field);

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

                  <Input
                    id={id}
                    className="mt-2"
                    autoComplete="off"
                    list={options.length > 0 ? `${id}-list` : undefined}
                    inputMode={field.type === "number" ? "decimal" : undefined}
                    value={display[field.id] ?? ""}
                    placeholder={
                      field.placeholder ??
                      (options.length > 0 ? options[0].label : undefined)
                    }
                    onChange={(event) => setField(field, event.target.value)}
                  />

                  {options.length > 0 && (
                    <datalist id={`${id}-list`}>
                      {options.map((option) => (
                        <option key={option.value} value={option.label} />
                      ))}
                    </datalist>
                  )}

                  {chips && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {chips.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            apply(field, option.value, option.label)
                          }
                          className="rounded-full border border-border px-3 py-1 text-label text-muted-foreground transition-colors duration-150 hover:border-foreground/30 hover:text-foreground"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-label mt-2 text-muted-foreground">
                    {field.hint ??
                      (options.length > 0
                        ? "Type it in — suggestions appear as you type."
                        : "")}
                  </p>
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
