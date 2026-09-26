import type { ReactNode } from "react";
import { Copy } from "lucide-react";

import { CopyButton } from "@/components/site/CopyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PanelHeading({
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
 * The fixed two-card split every tool uses: inputs on the left, result and
 * working on the right, so nothing moves around between topics.
 */
export function ToolPanels({
  inputs,
  result,
  resultText,
}: {
  inputs: ReactNode;
  result: ReactNode;
  resultText?: string;
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card className="gap-0 py-0">
        <PanelHeading>Inputs</PanelHeading>
        <CardContent className="px-6 py-6">{inputs}</CardContent>
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
          <div className="working-panel min-h-full px-6 py-6">{result}</div>
        </CardContent>
      </Card>
    </div>
  );
}
