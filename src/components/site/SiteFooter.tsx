import { Link } from "react-router";

import { BrandMark } from "@/components/site/BrandMark";
import { SUBJECTS } from "@/lib/subjects";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark className="size-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight">
              NovaTools
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            A free IGCSE STEM revision toolkit for Mathematics, Physics,
            Chemistry, Biology and Computer Science. Every tool shows its
            working.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subjects
            </p>
            <ul className="mt-3 space-y-2">
              {SUBJECTS.map((subject) => (
                <li key={subject.id}>
                  <Link
                    to={subject.slug}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {subject.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toolkit
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/maths"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Start revising
                </Link>
              </li>
              <li>
                <Link
                  to="/#principles"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  to="/#roadmap"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} NovaTools · Built for IGCSE students.</p>
          <p className="max-w-xl sm:text-right">
            Content is written from the publicly published Cambridge and Edexcel
            IGCSE syllabus specifications. Not affiliated with or endorsed by the
            exam boards.
          </p>
        </div>
      </div>
    </footer>
  );
}
