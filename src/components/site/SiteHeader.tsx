import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ChevronDown, LayoutDashboard, Menu } from "lucide-react";

import { BrandMark } from "@/components/site/BrandMark";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ToolSearchDialog } from "@/components/site/ToolSearch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const navItemClass = (isActive: boolean) =>
  cn(
    "rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground",
    isActive && "bg-accent text-foreground",
  );

function SubjectLink({
  subject,
  onNavigate,
  active,
}: {
  subject: (typeof SUBJECTS)[number];
  onNavigate?: () => void;
  active: boolean;
}) {
  const Icon = subject.icon;
  return (
    <Link
      to={subject.slug}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-accent",
        active && "bg-accent",
      )}
    >
      <Icon className="size-4" style={{ color: subject.accent }} />
      {subject.name}
    </Link>
  );
}

function AuthAction({ className }: { className?: string }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        Sign in
      </Button>
    );
  }

  return (
    <Button asChild size="sm" variant={isAuthenticated ? "outline" : "default"}>
      <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
        {isAuthenticated ? (
          <>
            <LayoutDashboard className="size-4" />
            Dashboard
          </>
        ) : (
          "Sign in"
        )}
      </Link>
    </Button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onSubjectsRoute = SUBJECTS.some(
    (subject) =>
      pathname === subject.slug || pathname.startsWith(`${subject.slug}/`),
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark className="size-8 text-primary" />
          <span className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">NovaTools</span>
            <span className="text-label text-muted-foreground">
              IGCSE STEM
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={({ isActive }) => navItemClass(isActive)}>
            Home
          </NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 px-4 text-sm font-medium text-muted-foreground hover:text-foreground",
                  onSubjectsRoute && "bg-accent text-foreground",
                )}
              >
                Subjects
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-label text-muted-foreground">
                IGCSE subjects
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SUBJECTS.map((subject) => {
                const Icon = subject.icon;
                return (
                  <DropdownMenuItem key={subject.id} asChild>
                    <Link to={subject.slug} className="gap-4 px-4 py-3">
                      <Icon
                        className="size-4"
                        style={{ color: subject.accent }}
                      />
                      <span className="flex flex-1 items-center justify-between gap-2">
                        <span className="text-sm font-medium">
                          {subject.name}
                        </span>
                        <span className="text-label text-muted-foreground">
                          {subject.tools.length} tools
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <ToolSearchDialog />
          <ThemeToggle />
          <AuthAction className="hidden sm:inline-flex" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BrandMark className="size-6 text-primary" />
                  NovaTools
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 pb-8">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-accent"
                >
                  Home
                </Link>
                <p className="text-label mt-2 px-4 font-semibold tracking-wide text-muted-foreground uppercase">
                  Subjects
                </p>
                {SUBJECTS.map((subject) => (
                  <SubjectLink
                    key={subject.id}
                    subject={subject}
                    onNavigate={() => setOpen(false)}
                    active={pathname.startsWith(subject.slug)}
                  />
                ))}
                <div className="mt-4">
                  <AuthAction className="w-full" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
