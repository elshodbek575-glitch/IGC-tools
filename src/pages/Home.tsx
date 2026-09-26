import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CircuitBoard,
  ShieldCheck,
} from "lucide-react";

import { CopyButton } from "@/components/site/CopyButton";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Seo } from "@/components/site/Seo";
import { ToolSearchBar } from "@/components/site/ToolSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ALL_TOOLS, SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

// Hover/focus transitions stay at 150–200ms; entrances use framer-motion.
const HOVER = "transition-colors duration-150";

const PRINCIPLES = [
  {
    icon: BookOpenCheck,
    title: "Every tool shows its working",
    body: "Each calculator, solver and generator reveals the full method — the formula, the substitution and the units — not just a final answer.",
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

const WORKING_STEPS = [
  { step: "1", text: "Factorise: (x − 2)(x − 3) = 0" },
  { step: "2", text: "Set each bracket equal to zero" },
  { step: "3", text: "x = 2 or x = 3" },
];

/** Static preview of the shared tool shell: input card beside a working panel. */
function ShellPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid w-full gap-6"
    >
      <Card className="gap-0 py-0">
        <div className="border-b border-border px-6 py-4">
          <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
            Inputs
          </p>
        </div>
        <CardContent className="px-6 py-6">
          <Label htmlFor="hero-equation">Quadratic equation</Label>
          <div
            id="hero-equation"
            className="mt-2 flex h-10 items-center rounded-lg border border-border bg-transparent px-4 font-mono text-sm"
          >
            x² − 5x + 6 = 0
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
            Result &amp; working
          </p>
          <CopyButton value="x = 2 or x = 3" />
        </div>
        <div className="working-panel px-6 py-6">
          <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
            Answer
          </p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-2 font-mono text-2xl font-semibold"
          >
            x = 2 or x = 3
          </motion.p>

          <ol className="mt-6 space-y-4 font-mono text-sm">
            {WORKING_STEPS.map((item, index) => (
              <motion.li
                key={item.step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + index * 0.1 }}
                className="flex gap-4 text-muted-foreground"
              >
                <span className="text-label w-6 shrink-0 text-primary">
                  {item.step}
                </span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </Card>
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
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-16">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="outline" className="text-muted-foreground">
                Cambridge &amp; Edexcel IGCSE
              </Badge>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                One revision toolkit for all five IGCSE STEM subjects.
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                NovaTools builds calculators, solvers and practice generators for
                Mathematics, Physics, Chemistry, Biology and Computer Science —
                and every one of them shows the working, not just the answer.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
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

              <ToolSearchBar className="mt-8 max-w-xl" />

              <dl className="mt-8 flex flex-wrap gap-8">
                <div>
                  <dt className="text-label text-muted-foreground">
                    Planned tools
                  </dt>
                  <dd className="mt-2 font-mono text-2xl font-semibold">
                    {ALL_TOOLS.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-muted-foreground">Subjects</dt>
                  <dd className="mt-2 font-mono text-2xl font-semibold">
                    {SUBJECTS.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-muted-foreground">
                    Uploaded to a server
                  </dt>
                  <dd className="mt-2 font-mono text-2xl font-semibold">0</dd>
                </div>
              </dl>
            </motion.div>

            <ShellPreview />
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Five subjects. Five sections.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Each subject has its own landing page listing its tools and the
              syllabus topics they map to. Jump between them any time from the
              navigation.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn("h-full", subject.themeClass)}
                >
                  <Link to={subject.slug} className="group block h-full">
                    <Card className="subject-strip h-full">
                      <CardContent className="flex h-full flex-col gap-4 px-6">
                        <div className="flex items-center justify-between gap-4">
                          <Icon
                            className="size-5"
                            style={{ color: subject.accent }}
                          />
                          <span className="text-label text-muted-foreground">
                            {subject.tools.length} tools
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {subject.name}
                        </h3>
                        <p className="flex-1 text-sm text-muted-foreground">
                          {subject.tagline}
                        </p>
                        <span
                          className={cn(
                            "flex items-center gap-2 text-sm font-medium",
                            HOVER,
                          )}
                          style={{ color: subject.accent }}
                        >
                          Open section
                          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="h-full"
            >
              <Card className="h-full border-dashed">
                <CardContent className="flex h-full flex-col gap-4 px-6">
                  <BadgeCheck className="size-5 text-muted-foreground" />
                  <h3 className="text-xl font-semibold tracking-tight">
                    Built subject by subject
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Maths is being built first, then Physics, Chemistry, Biology
                    and Computer Science. Open a section to see its topics and
                    tool list.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl text-3xl font-bold tracking-tight"
          >
            Designed for how students actually revise.
          </motion.h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col gap-4 px-6">
                      <Icon className="size-5 text-primary" />
                      <h3 className="text-xl font-semibold tracking-tight">
                        {principle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {principle.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="flex flex-col gap-6 px-6 md:flex-row md:items-start">
                <BadgeCheck className="size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Mapped to the official syllabus
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We work from the freely published Cambridge and Edexcel IGCSE
                    subject specifications — the documents that list every topic
                    and required skill. No copyrighted textbook content is used.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUBJECTS.flatMap((subject) => subject.boards).map((board) => (
                      <Badge
                        key={board}
                        variant="outline"
                        className="text-muted-foreground"
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
      <section id="roadmap" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Shipping one subject at a time.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Each subject goes live with a full set of tools before the next one
              starts, so what is on the site is always finished and reliable.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SUBJECTS.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "subject-strip rounded-xl border border-border bg-card px-6 py-6",
                    subject.themeClass,
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-label text-muted-foreground">
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
                    className="mt-6 size-5"
                    style={{ color: subject.accent }}
                  />
                  <p className="mt-4 text-sm font-semibold">{subject.shortName}</p>
                  <p className="mt-2 text-label text-muted-foreground">
                    {subject.status === "in-progress"
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
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Start revising the way exams are marked.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Pick a subject to explore its syllabus topics and the tools being
              built for it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
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
