import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ChevronDown, LayoutDashboard, Menu } from "lucide-react";

import { BrandMark } from "@/components/site/BrandMark";
import { ThemeToggle } from "@/components/site/ThemeToggle";
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

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          isActive && "text-foreground",
        )
      }
    >
      {children}
    </NavLink>
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
  const onSubjectsRoute = SUBJECTS.some((s) => s.slug === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark className="size-8 rounded-lg" />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">NovaTools</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              IGCSE STEM
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/">Home</NavItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1 px-3 text-sm font-medium text-muted-foreground hover:text-foreground",
                  onSubjectsRoute && "text-foreground",
                )}
              >
                Subjects
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                IGCSE subjects
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SUBJECTS.map((subject) => {
                const Icon = subject.icon;
                return (
                  <DropdownMenuItem key={subject.id} asChild>
                    <Link to={subject.slug} className="cursor-pointer gap-3">
                      <span
                        className="flex size-7 items-center justify-center rounded-md"
                        style={{
                          color: subject.accent,
                          backgroundColor: `color-mix(in oklab, ${subject.accent} 16%, transparent)`,
                        }}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">
                          {subject.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {subject.boards[0]}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-1.5">
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
            <SheetContent side="right" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BrandMark className="size-7 rounded-md" />
                  NovaTools
                </SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex flex-col gap-1 px-4 pb-6">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  Home
                </Link>
                <p className="px-3 pt-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Subjects
                </p>
                {SUBJECTS.map((subject) => {
                  const Icon = subject.icon;
                  return (
                    <Link
                      key={subject.id}
                      to={subject.slug}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent",
                        pathname === subject.slug && "bg-accent",
                      )}
                    >
                      <span
                        className="flex size-7 items-center justify-center rounded-md"
                        style={{
                          color: subject.accent,
                          backgroundColor: `color-mix(in oklab, ${subject.accent} 16%, transparent)`,
                        }}
                      >
                        <Icon className="size-4" />
                      </span>
                      {subject.name}
                    </Link>
                  );
                })}
                <div className="mt-3 px-1">
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
