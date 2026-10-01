import { Link, useParams } from "react-router";

import { Seo } from "@/components/site/Seo";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ToolShell } from "@/components/site/ToolShell";
import { CalcRunner } from "@/components/tool/CalcRunner";
import { DiagramRunner } from "@/components/tool/DiagramRunner";
import { ExplorerRunner } from "@/components/tool/ExplorerRunner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { getDefinition } from "@/lib/tools";
import { findTool } from "@/lib/subjects";

/**
 * Every tool lives at a subject-first URL: /physics/ohms-law-calculator
 *
 * The page resolves the tool, supplies its metadata and hands layout to
 * `ToolShell`, which delegates the working area to the right runner.
 */
export default function ToolPage() {
  const { t, tOr } = useI18n();
  const { subjectId, toolSlug } = useParams<{
    subjectId: string;
    toolSlug: string;
  }>();

  const ref = subjectId && toolSlug ? findTool(subjectId, toolSlug) : undefined;
  const definition = ref ? getDefinition(ref.subject.id, ref.slug) : undefined;

  if (!ref) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Seo
          title="Tool not found · IGCtools"
          description="That revision tool doesn't exist."
          path="/404"
          noindex
        />
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("tool.notFoundTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {t("tool.notFoundBody")}
          </p>
          <Button asChild className="mt-8">
            <Link to="/">{t("common.backHome")}</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const toolName = tOr(`tool.${ref.subject.id}.${ref.slug}.name`, ref.tool.name);
  const toolNote = tOr(`tool.${ref.subject.id}.${ref.slug}.note`, ref.tool.note);
  const subjectShort = tOr(
    `subject.${ref.subject.id}.short`,
    ref.subject.shortName,
  );

  return (
    <>
      <Seo
        title={`${toolName} · ${subjectShort} IGCSE · IGCtools`}
        description={`${toolNote} Free IGCSE ${subjectShort} revision tool with the full step-by-step working shown.`}
        path={ref.path}
        noindex={!definition}
      />
      <ToolShell
        subject={ref.subject}
        toolRef={ref}
        formula={definition?.kind === "calc" ? definition.formula : undefined}
      >
        {definition?.kind === "calc" && <CalcRunner def={definition} />}
        {definition?.kind === "explorer" && <ExplorerRunner def={definition} />}
        {definition?.kind === "diagram" && <DiagramRunner def={definition} />}
      </ToolShell>
    </>
  );
}
