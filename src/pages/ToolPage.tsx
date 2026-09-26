import { Link, useParams } from "react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ToolShell } from "@/components/site/ToolShell";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/site/Seo";
import { findTool, isToolLive } from "@/lib/subjects";

/**
 * Every tool lives at a subject-first URL: /physics/ohms-law-calculator
 *
 * The page supplies metadata and delegates layout to `ToolShell`, so each tool
 * only has to plug in its own inputs and result.
 */
export default function ToolPage() {
  const { subjectId, toolSlug } = useParams<{
    subjectId: string;
    toolSlug: string;
  }>();

  const ref =
    subjectId && toolSlug ? findTool(subjectId, toolSlug) : undefined;

  if (!ref) {
    return (
      <div className="flex min-h-screen flex-col">
        <Seo
          title="Tool not found · NovaTools"
          description="That revision tool doesn't exist."
          path="/404"
          noindex
        />
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Tool not found</h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            There&apos;s no tool at that address. Browse a subject to see every
            tool in its section.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">Back to home</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const live = isToolLive(ref);

  return (
    <>
      <Seo
        title={`${ref.tool.name} · ${ref.subject.shortName} IGCSE · NovaTools`}
        description={`${ref.tool.note} Free IGCSE ${ref.subject.shortName} revision tool with full step-by-step working.`}
        path={ref.path}
        noindex={!live}
      />
      <ToolShell subject={ref.subject} toolRef={ref} />
    </>
  );
}
