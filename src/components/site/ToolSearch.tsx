import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useI18n } from "@/lib/i18n";
import { ALL_TOOLS, searchTools, SUBJECTS, type ToolRef } from "@/lib/subjects";

function SubjectDot({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden
      className="size-2 shrink-0 rounded-full"
      style={{ backgroundColor: accent }}
    />
  );
}

/**
 * Inline labelled search bar for the homepage. Filters the tool catalogue as you
 * type and links straight to each tool's subject-first URL.
 */
export function ToolSearchBar({ className }: { className?: string }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchTools(query, 6), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <div className={className}>
      <label
        htmlFor="tool-search"
        className="text-label font-medium text-foreground"
      >
        {t("search.findTool")}
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="tool-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          placeholder={t("search.placeholder")}
          className="pl-11"
        />
      </div>

      {hasQuery && (
        <ul className="mt-2 overflow-hidden rounded-xl border border-border bg-card">
          {results.length === 0 ? (
            <li className="px-4 py-4 text-sm text-muted-foreground">
              {t("search.noMatch", { query: query.trim() })}
            </li>
          ) : (
            results.map((ref) => (
              <li key={ref.path}>
                <Link
                  to={ref.path}
                  className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-accent"
                >
                  <SubjectDot accent={ref.subject.accent} />
                  <span className="flex-1 text-sm">{ref.tool.name}</span>
                  <span className="text-label text-muted-foreground">
                    {ref.subject.shortName}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function CommandToolItem({
  ref,
  onSelect,
}: {
  ref: ToolRef;
  onSelect: () => void;
}) {
  return (
    <CommandItem
      onSelect={onSelect}
      /* Tool names repeat across subjects (e.g. "Worksheet Generator"), so the
         value carries the subject too — it stays unique for selection while
         remaining searchable by name. */
      value={`${ref.tool.name} ${ref.subject.shortName}`}
      keywords={[ref.subject.name, ref.tool.note]}
      className="gap-4 px-2 py-4"
    >
      <SubjectDot accent={ref.subject.accent} />
      <span className="flex-1 text-sm">{ref.tool.name}</span>
      <span className="text-label text-muted-foreground">
        {ref.subject.shortName}
      </span>
    </CommandItem>
  );
}

/** Compact search trigger for the sticky top nav; opens a command palette. */
export function ToolSearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t, subjectName } = useI18n();

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={t("header.searchAria")}
        className="gap-2 text-muted-foreground"
      >
        <Search className="size-4" />
        <span className="hidden lg:inline">{t("header.search")}</span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("search.dialogTitle")}
        description={t("search.dialogDescription")}
        className="sm:max-w-xl"
      >
        <CommandInput placeholder={t("search.inputPlaceholder")} />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>{t("search.empty")}</CommandEmpty>
          {SUBJECTS.map((subject) => (
            <CommandGroup
              key={subject.id}
              heading={subjectName(subject.id, subject.name)}
            >
              {ALL_TOOLS.filter((ref) => ref.subject.id === subject.id).map(
                (ref) => (
                  <CommandToolItem
                    key={ref.path}
                    ref={ref}
                    onSelect={() => go(ref.path)}
                  />
                ),
              )}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
