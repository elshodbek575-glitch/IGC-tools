import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight, FlaskConical } from "lucide-react";

import { CopyButton } from "@/components/site/CopyButton";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ToolPanels } from "@/components/tool/ToolPanels";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import type { Subject, ToolRef } from "@/lib/subjects";
import { cn } from "@/lib/utils";

export type ToolShellProps = {
  subject: Subject;
  toolRef: ToolRef;
  /** Formula displayed in the formula strip. */
  formula?: string;
  /** The tool runner. Falls back to the in-development placeholder panels. */
  children?: ReactNode;
};

/**
 * The shared layout every individual tool page reuses: header, breadcrumb,
 * formula strip, the two-card input/result split and the footer. A tool only
 * supplies its own `children` (a calc, explorer or diagram runner).
 */
export function ToolShell({
  subject,
  toolRef,
  formula,
  children,
}: ToolShellProps) {
  const { tool, slug } = toolRef;
  const { t, tOr, subjectName } = useI18n();
  const Icon = subject.icon;
  // Tool catalogue copy is translated when a locale provides it, otherwise the
  // English source in `subjects.ts` is used as-is.
  const toolName = tOr(`tool.${subject.id}.${slug}.name`, tool.name);
  const toolNote = tOr(`tool.${subject.id}.${slug}.note`, tool.note);

  return (
    <div className={cn("flex min-h-dvh flex-col", subject.themeClass)}>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label={t("shell.breadcrumb")}>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="transition-colors duration-150 hover:text-foreground"
              >
                {t("common.home")}
              </Link>
            </li>
            <ChevronRight className="size-4" />
            <li>
              <Link
                to={subject.slug}
                className="transition-colors duration-150 hover:text-foreground"
              >
                {subjectName(subject.id, subject.name)}
              </Link>
            </li>
            <ChevronRight className="size-4" />
            <li className="text-foreground">{toolName}</li>
          </ol>
        </nav>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Icon className="size-6" style={{ color: subject.accent }} />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {toolName}
            </h1>
            <Badge variant="outline" className="text-muted-foreground">
              {children ? t("common.live") : t("common.inDevelopment")}
            </Badge>
          </div>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            {toolNote}
          </p>
        </header>

        {formula && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-4">
            <div className="min-w-0">
              <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
                {t("common.formula")}
              </p>
              <p className="mt-2 truncate font-mono text-sm">{formula}</p>
            </div>
            <CopyButton value={formula} />
          </div>
        )}

        {children ?? (
          <ToolPanels
            inputs={<ToolInputPlaceholder />}
            result={<ToolResultPlaceholder />}
          />
        )}

        <section className="mt-12 rounded-xl border border-border bg-card px-6 py-6">
          <div className="flex items-start gap-4">
            <FlaskConical className="mt-1 size-5 shrink-0 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {t("shell.workingTitle")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("shell.workingBody")}
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Placeholder shown only if a tool has no implementation yet. */
function ToolInputPlaceholder() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="tool-input-placeholder">
          {t("shell.placeholderLabel")}
        </Label>
        <input
          id="tool-input-placeholder"
          disabled
          placeholder={t("shell.placeholderInput")}
          className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-4 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {t("shell.placeholderNote")}
      </p>
    </div>
  );
}

function ToolResultPlaceholder() {
  const { t } = useI18n();
  return (
    <p className="text-sm text-muted-foreground">
      {t("shell.placeholderResult")}
    </p>
  );
}
