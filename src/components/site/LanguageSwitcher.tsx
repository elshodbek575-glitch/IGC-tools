import { useState } from "react";
import { Check, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Language picker for the shared site shell. Lists every supported language by
 * its native name and persists the choice for the next visit.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, languages, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const current =
    languages.find((language) => language.code === locale) ?? languages[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={t("header.selectLanguage")}
          className={cn("gap-2 text-muted-foreground", className)}
        >
          <Globe className="size-4" />
          <span className="hidden max-w-24 truncate md:inline">
            {current.nativeName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 w-60 overflow-y-auto">
        <DropdownMenuLabel className="text-label text-muted-foreground">
          {t("header.language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <button
            key={language.code}
            type="button"
            dir={language.dir}
            onClick={() => {
              setLocale(language.code);
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center justify-between gap-4 rounded-sm px-2 py-2 text-sm transition-colors duration-150 hover:bg-accent",
              language.code === locale && "bg-accent",
            )}
          >
            <span className="flex min-w-0 flex-col items-start">
              <span className="truncate font-medium">{language.nativeName}</span>
              <span
                className="truncate text-label text-muted-foreground"
                dir="ltr"
              >
                {language.name}
              </span>
            </span>
            {language.code === locale && (
              <Check className="size-4 shrink-0 text-primary" />
            )}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
