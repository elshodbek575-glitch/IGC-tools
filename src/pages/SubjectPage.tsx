import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Hourglass } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Seo } from "@/components/site/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSubject, SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

export default function SubjectPage({ subjectId }: { subjectId: string }) {
  const subject = getSubject(subjectId);

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Subject not found
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            That subject doesn&apos;t exist yet.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Back to home</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const Icon = subject.icon;
  const isBuilding = subject.status === "in-progress";
  const totalTopics = subject.topics.reduce(
    (sum, topic) => sum + topic.items.length,
    0,
  );

  return (
    <div className={cn("flex min-h-screen flex-col", subject.themeClass)}>
      <Seo
        title={`${subject.name} IGCSE Tools · NovaTools`}
        description={`${subject.tagline} Built on the ${subject.boards.join(
          " and ",
        )} specifications. ${subject.tools.length} planned tools with worked solutions.`}
        path={subject.slug}
      />
      <SiteHeader />

      {/* Subject hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[380px] w-[620px] rounded-full blur-3xl"
          style={{
            backgroundColor: `color-mix(in oklab, ${subject.accent} 18%, transparent)`,
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Link
            to="/#subjects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All subjects
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex size-12 items-center justify-center rounded-xl"
                  style={{
                    color: subject.accent,
                    backgroundColor: `color-mix(in oklab, ${subject.accent} 16%, transparent)`,
                  }}
                >
                  <Icon className="size-7" />
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1.5",
                    isBuilding
                      ? "border-[var(--subject-line)] text-[var(--subject)]"
                      : "text-muted-foreground",
                  )}
                >
                  {isBuilding ? (
                    <>
                      <Clock className="size-3.5" /> Building now
                    </>
                  ) : (
                    <>
                      <Hourglass className="size-3.5" /> Coming soon
                    </>
                  )}
                </Badge>
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                {subject.name}
                <span className="mt-2 block text-lg font-medium text-muted-foreground">
                  IGCSE revision toolkit
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground text-pretty">
                {subject.blurb}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {subject.boards.map((board) => (
                  <Badge
                    key={board}
                    variant="outline"
                    className="font-normal text-muted-foreground"
                  >
                    {board}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <a href="#tools">
                    See {subject.tools.length} planned tools
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#topics">View syllabus topics</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <Card className="border-border/70 shadow-none">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Section preview
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                      <p className="text-2xl font-bold tracking-tight">
                        {subject.tools.length}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Planned tools
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                      <p className="text-2xl font-bold tracking-tight">
                        {subject.topics.length}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Topic areas
                      </p>
                    </div>
                    <div className="col-span-2 rounded-lg border border-border/70 bg-muted/30 p-3">
                      <p className="text-2xl font-bold tracking-tight">
                        {totalTopics}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Syllabus subtopics covered
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <Check
                      className="mt-0.5 size-3.5 shrink-0"
                      style={{ color: subject.accent }}
                    />
                    Every tool will show its full working — this page is the
                    shell for the section while the tools are built.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Syllabus topics */}
      <section id="topics" className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--subject)]">
              Source of truth
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Syllabus topics we&apos;re building from.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              These topic areas come from the published {subject.boards.join(" / ")}{" "}
              specifications. Tools are mapped to these topics — not generic
              STEM ideas.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mt-10"
          >
            <Accordion
              type="multiple"
              defaultValue={[subject.topics[0]?.title ?? ""]}
              className="grid gap-3 md:grid-cols-2"
            >
              {subject.topics.map((topic, index) => (
                <AccordionItem
                  key={topic.title}
                  value={topic.title}
                  className="rounded-xl border border-border/70 bg-card px-5"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3 text-left">
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold"
                        style={{
                          color: subject.accent,
                          backgroundColor: `color-mix(in oklab, ${subject.accent} 16%, transparent)`,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">
                        {topic.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-10">
                      {topic.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                        >
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: subject.accent }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Planned tools */}
      <section id="tools" className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--subject)]">
              Planned tools
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {subject.tools.length} tools mapped to these topics.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {isBuilding
                ? "Maths leads the build. The tools below are next in line for this section."
                : `This section is queued after Maths${
                    subject.id !== "physics" ? ", Physics" : ""
                  }. Here's the tool set mapped to the topics above.`}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subject.tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                className="h-full"
              >
                <Card className="h-full border-border/70 bg-card shadow-none">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex size-9 items-center justify-center rounded-lg"
                        style={{
                          color: subject.accent,
                          backgroundColor: `color-mix(in oklab, ${subject.accent} 14%, transparent)`,
                        }}
                      >
                        <Icon className="size-5" />
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-[10px] font-medium text-muted-foreground"
                      >
                        {isBuilding ? "Up next" : "Planned"}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold tracking-tight">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tool.note}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject switcher */}
      <section className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Jump to another subject
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUBJECTS.filter((s) => s.id !== subject.id).map((other) => {
              const OtherIcon = other.icon;
              return (
                <Link
                  key={other.id}
                  to={other.slug}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-[var(--subject-line)]",
                    other.themeClass,
                  )}
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-lg"
                    style={{
                      color: other.accent,
                      backgroundColor: `color-mix(in oklab, ${other.accent} 16%, transparent)`,
                    }}
                  >
                    <OtherIcon className="size-5" />
                  </span>
                  <span className="flex-1 text-sm font-medium">
                    {other.name}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
