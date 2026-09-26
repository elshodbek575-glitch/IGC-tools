import { Link } from "react-router";

import { BrandMark } from "@/components/site/BrandMark";
import { SUBJECTS } from "@/lib/subjects";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <BrandMark className="size-8 text-primary" />
            <span className="text-base font-bold tracking-tight">NovaTools</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A free IGCSE STEM revision toolkit for Mathematics, Physics,
            Chemistry, Biology and Computer Science. Every tool shows its
            working.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              Subjects
            </p>
            <ul className="mt-4 space-y-4">
              {SUBJECTS.map((subject) => (
                <li key={subject.id}>
                  <Link
                    to={subject.slug}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {subject.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              Toolkit
            </p>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/maths"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Start revising
                </Link>
              </li>
              <li>
                <Link
                  to="/#principles"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  to="/#roadmap"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              Account
            </p>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-label text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} NovaTools · Built for IGCSE students.</p>
          <p className="max-w-xl sm:text-right">
            Written from the publicly published Cambridge and Edexcel IGCSE
            syllabus specifications. Not affiliated with or endorsed by the exam
            boards.
          </p>
        </div>
      </div>
    </footer>
  );
}
