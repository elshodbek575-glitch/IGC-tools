import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Copy-to-clipboard control for formulas and results, with a brief inline
 * "Copied!" confirmation.
 */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const labelText = label ?? t("common.copy");

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
      aria-label={`${labelText}: ${value}`}
      className={cn("text-muted-foreground transition-colors duration-150", className)}
    >
      {copied ? (
        <>
          <Check className="size-4 text-success" />
          {t("common.copied")}
        </>
      ) : (
        <>
          <Copy className="size-4" />
          {labelText}
        </>
      )}
    </Button>
  );
}
