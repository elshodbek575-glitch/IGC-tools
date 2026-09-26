import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Copy-to-clipboard control for formulas and results, with a brief inline
 * "Copied!" confirmation.
 */
export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked in some embedded contexts; fail quietly.
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      aria-label={`${label}: ${value}`}
      className={cn("text-muted-foreground transition-colors duration-150", className)}
    >
      {copied ? (
        <>
          <Check className="size-4 text-success" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="size-4" />
          {label}
        </>
      )}
    </Button>
  );
}
