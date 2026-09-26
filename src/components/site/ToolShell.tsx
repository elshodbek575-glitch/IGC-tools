import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight, Clock, Copy, FlaskConical } from "lucide-react";

import { CopyButton } from "@/components/site/CopyButton";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Subject, ToolRef } from "@/lib/subjects";
import { cn } from "@/lib/utils";

export type ToolShellProps = {
  subject: Subject;
  toolRef: ToolRef;
  /** Form / controls for the tool. */
  inputs?: ReactNode;
  /** The result + step-by-step working. */
  result?: ReactNode;
  /** Formula displayed in the formula strip. */
  formula?: string;
  /** Plain-text answer, offered through the copy button once a tool is live. */
  resultText?: string;
};

/** Section heading used inside the input and result cards. */
function PanelHeading({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <h2 className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
        {children}
      </h2>
      {action}
    </div>
  );
}

/**
 * The shared layout every individual tool page reuses.
 *
 * Header, breadcrumb, input card, result/working panel and footer are fixed
 * here so each tool only has to supply its own `inputs` and `result`.
 */
export function ToolShell({
  subject,
  toolRef,
  inputs,
  result,
  formula,
  resultText,
}: ToolShellProps) {
  const { tool } = toolRef;
  const Icon = subject.icon;

  return (
    <div className={cn("flex min-h-screen flex-col", subject.themeClass)}>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="transition-colors duration-150 hover:text-foreground"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="size-4" />
            <li>
              <Link
                to={subject.slug}
                className="transition-colors duration-150 hover:text-foreground"
              >
                {subject.name}
              </Link>
            </li>
            <ChevronRight className="size-4" />
            <li className="text-foreground">{tool.name}</li>
          </ol>
        </nav>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Icon className="size-6" style={{ color: subject.accent }} />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {tool.name}
            </h1>
            <Badge variant="outline" className="gap-2 text-muted-foreground">
              <Clock className="size-3" />
              In development
            </Badge>
          </div>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            {tool.note}
          </p>
        </header>

        {formula && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-4">
            <div className="min-w-0">
              <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
                Formula
              </p>
              <p className="mt-2 truncate font-mono text-sm">{formula}</p>
            </div>
            <CopyButton value={formula} />
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="gap-0 py-0">
            <PanelHeading>Inputs</PanelHeading>
            <CardContent className="px-6 py-6">
              {inputs ?? <ToolInputPlaceholder />}
            </CardContent>
          </Card>

          <Card className="gap-0 py-0">
            <PanelHeading
              action={
                resultText ? (
                  <CopyButton value={resultText} label="Copy result" />
                ) : (
                  <Button variant="ghost" size="sm" disabled>
                    <Copy className="size-4" />
                    Copy
                  </Button>
                )
              }
            >
              Result &amp; working
            </PanelHeading>
            <CardContent className="px-0 py-0">
              <div className="working-panel px-6 py-6">
                {result ?? <ToolResultPlaceholder />}
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-12 rounded-xl border border-border bg-card px-6 py-6">
          <div className="flex items-start gap-4">
            <FlaskConical className="mt-1 size-5 shrink-0 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Built to show its working
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                When this tool ships it will lay out the method step by step —
                the formula, the substitution and the units — above the final
                answer. The layout above is the shared shell every tool uses, so
                nothing moves around between topics.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Placeholder shown until a tool's own inputs are wired in. */
function ToolInputPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="tool-input-placeholder">Value</Label>
        <input
          id="tool-input-placeholder"
          disabled
          placeholder="Inputs arrive with the tool"
          className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-4 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Inputs for this tool appear here, with labels above each field and the
        accent focus ring on the active one.
      </p>
    </div>
  );
}

/** Placeholder shown until a tool's own result and working are wired in. */
function ToolResultPlaceholder() {
  return (
    <div>
      <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
        Answer
      </p>
      <p className="mt-2 font-mono text-2xl font-semibold">—</p>

      <ol className="mt-6 space-y-4 font-mono text-sm">
        <li className="flex gap-4 text-muted-foreground">
          <span className="text-label w-6 shrink-0" style={{ color: "var(--subject)" }}>
            1
          </span>
          <span>Formula — stated with the symbols defined</span>
        </li>
        <li className="flex gap-4 text-muted-foreground">
          <span className="text-label w-6 shrink-0" style={{ color: "var(--subject)" }}>
            2
          </span>
          <span>Substitution — values placed into the formula</span>
        </li>
        <li className="flex gap-4 text-muted-foreground">
          <span className="text-label w-6 shrink-0" style={{ color: "var(--subject)" }}>
            3
          </span>
          <span>Working — arithmetic with units carried through</span>
        </li>
      </ol>

      <p className="mt-6 text-sm text-muted-foreground">
        Every step is shown above the answer, and results can be copied with the
        button on the panel heading.
      </p>
    </div>
  );
}
