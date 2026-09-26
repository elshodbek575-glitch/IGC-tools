import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CircuitBoard,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Seo } from "@/components/site/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const inView = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-80px" },
  variants: fadeUp,
};

const PRINCIPLES = [
  {
    icon: BookOpenCheck,
    title: "Every tool shows its working",
    body: "Each calculator, solver and generator reveals the full method — equations, substitutions and reasoning — not a bare final answer.",
  },
  {
    icon: ShieldCheck,
    title: "Original content only",
    body: "Questions, explanations and diagrams are written and drawn from scratch. Diagrams are original SVG, never textbook images.",
  },
  {
    icon: CircuitBoard,
    title: "Runs entirely in your browser",
    body: "Tools run client-side like the rest of the site. Nothing is uploaded or stored on a server, so revision is instant and private.",
  },
];

const ROADMAP = ["Maths", "Physics", "Chemistry", "Biology", "Computer Science"];

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
      <Card className="border-border/70 shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Quadratic Solver</p>
                <p className="text-xs text-muted-foreground">
                  Maths · worked solution
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Step by step
            </Badge>
          </div>

          <div className="mt-5 rounded-lg border border-border/70 bg-muted/40 p-4">
            <p className="font-mono text-sm text-foreground">
              x² − 5x + 6 = 0
            </p>
            <div className="mt-3 space-y-2.5 font-mono text-xs leading-5 text-muted-foreground">
              <p>
                <span className="mr-2 text-primary">1</span>Factorise: (x − 2)(x
                − 3) = 0
              </p>
              <p>
                <span className="mr-2 text-primary">2</span>Set each bracket to
                zero
              </p>
              <p>
                <span className="mr-2 text-primary">3</span>x = 2 or x = 3
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              <Check className="size-3.5" />
              Roots: x = 2, x = 3
            </div>
          </div>
        </CardContent>
      </Card>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-3 -top-4 rounded-lg border border-border/70 bg-background px-3 py-2 text-xs font-medium shadow-none"
      >
        <span className="text-[color:#f59e0b]">●</span> Balanced equations
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 -left-3 rounded-lg border border-border/70 bg-background px-3 py-2 text-xs font-medium shadow-none"
      >
        <span className="text-[color:#38bdf8]">●</span> Motion graphs
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="NovaTools · IGCSE STEM Revision Toolkit"
        description="Free IGCSE revision tools for Mathematics, Physics, Chemistry, Biology and Computer Science. Every tool shows its working — built on the Cambridge and Edexcel syllabuses."
        path="/"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="gap-1.5 border-primary/30 bg-primary/5 text-primary"
              >
                <Sparkles className="size-3.5" />
                Cambridge &amp; Edexcel IGCSE
              </Badge>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Revise all five STEM subjects in one place.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground text-pretty">
                NovaTools is a revision toolkit for IGCSE Mathematics, Physics,
                Chemistry, Biology and Computer Science. Every tool shows its
                working, so you learn the method — not just the answer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/maths">
                    Start with Maths
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#subjects">Browse subjects</a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Worked solutions
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Original content
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> 100% in-browser
                </span>
              </div>
            </motion.div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <motion.div {...inView} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              The toolkit
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Five subjects. One consistent toolkit.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Each subject has its own section with a shared design system and
              its own colour accent. Jump between them any time from the nav.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn("h-full", subject.themeClass)}
                >
                  <Link to={subject.slug} className="group block h-full">
                    <Card className="h-full border-border/70 shadow-none transition-colors group-hover:border-[var(--subject-line)]">
                      <CardContent className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between">
                          <span
                            className="flex size-11 items-center justify-center rounded-xl"
                            style={{
                              color: subject.accent,
                              backgroundColor: `color-mix(in oklab, ${subject.accent} 16%, transparent)`,
                            }}
                          >
                            <Icon className="size-6" />
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-medium",
                              subject.status === "in-progress"
                                ? "border-[var(--subject-line)] text-[var(--subject)]"
                                : "text-muted-foreground",
                            )}
                          >
                            {subject.status === "in-progress"
                              ? "In progress"
                              : "Planned"}
                          </Badge>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold tracking-tight">
                          {subject.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                          {subject.tagline}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
                          <span>{subject.tools.length} planned tools</span>
                          <span className="flex items-center gap-1 font-medium text-[var(--subject)]">
                            Open
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="h-full"
            >
              <Card className="flex h-full flex-col justify-center border-dashed border-border/70 bg-muted/30 shadow-none">
                <CardContent className="p-5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MousePointerClick className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    Built subject by subject
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Maths is being built first, then Physics, Chemistry, Biology
                    and Computer Science. Open a subject to see the topics and
                    tools in the works.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <motion.div {...inView} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Designed for how students actually revise.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="h-full"
                >
                  <Card className="h-full border-border/70 shadow-none">
                    <CardContent className="p-5">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-6" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold tracking-tight">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {principle.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="mt-5"
          >
            <Card className="border-border/70 bg-muted/30 shadow-none">
              <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BadgeCheck className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Mapped to the official syllabus
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We work from the freely published Cambridge and Edexcel IGCSE
                    subject specifications — the documents that list every topic
                    and required skill. No copyrighted textbook content is used.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUBJECTS.flatMap((s) => s.boards).map((board) => (
                      <Badge
                        key={board}
                        variant="outline"
                        className="font-normal text-muted-foreground"
                      >
                        {board}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <motion.div {...inView} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Roadmap
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Shipping one subject at a time.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Each subject goes live with a full set of tools before the next one
              starts, so what is on the site is always finished and reliable.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SUBJECTS.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className={cn(
                    "rounded-xl border border-border/70 bg-card p-4",
                    subject.themeClass,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {index + 1}
                    </span>
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        subject.status === "in-progress" && "animate-pulse",
                      )}
                      style={{ backgroundColor: subject.accent }}
                    />
                  </div>
                  <Icon
                    className="mt-4 size-6"
                    style={{ color: subject.accent }}
                  />
                  <p className="mt-3 text-sm font-semibold">
                    {subject.shortName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ROADMAP[index] === "Maths"
                      ? "Building now"
                      : "Queued next"}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl"
          >
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Start revising the way exams are marked.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Pick a subject to explore its syllabus topics and the tools being
              built for it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/maths">
                  Explore Maths
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/physics">Explore Physics</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
