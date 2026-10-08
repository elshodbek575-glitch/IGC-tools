import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Hourglass } from "lucide-react";

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
import { useI18n } from "@/lib/i18n";
import { getSubject, slugify, SUBJECTS } from "@/lib/subjects";
import { buildStatus, isToolLive, subjectToolCounts } from "@/lib/tools";
import { cn } from "@/lib/utils";

const HOVER = "transition-colors duration-150";

export default function SubjectPage({ subjectId }: { subjectId: string }) {
  const { t, tOr, subjectName } = useI18n();
  const subject = getSubject(subjectId);

  if (!subject) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("subject.notFoundTitle")}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("subject.notFoundBody")}
          </p>
          <Button asChild className="mt-8">
            <Link to="/">{t("common.backHome")}</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const Icon = subject.icon;
  // Read the real build state out of the tool registry.
  const status = buildStatus(subjectToolCounts(subject));
  const allLive = status === "live";
  const tagline = tOr(`subject.${subject.id}.tagline`, subject.tagline);
  const blurb = tOr(`subject.${subject.id}.blurb`, subject.blurb);

  return (
    <div className={cn("flex min-h-dvh flex-col", subject.themeClass)}>
      <Seo
        title={`${subjectName(subject.id, subject.name)} IGCSE · IGCtools`}
        description={`${tagline} Built on the ${subject.boards.join(
          " and ",
        )} specifications, with ${subject.tools.length} tools that show their working.`}
        path={subject.slug}
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link
            to="/#subjects"
            className={cn(
              "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
              HOVER,
            )}
          >
            <ArrowLeft className="size-4" />
            {t("subject.allSubjects")}
          </Link>

          <div className="mt-8 grid items-start gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <Icon className="size-6" style={{ color: subject.accent }} />
                <Badge variant="outline" className="gap-2 text-muted-foreground">
                  {allLive ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      {t("common.live")}
                    </>
                  ) : status === "building" ? (
                    <>
                      <Clock className="size-3" />
                      {t("common.buildingNow")}
                    </>
                  ) : (
                    <>
                      <Hourglass className="size-3" />
                      {t("common.comingSoon")}
                    </>
                  )}
                </Badge>
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {subjectName(subject.id, subject.name)}
                <span className="mt-2 block text-xl font-medium text-muted-foreground">
                  {t("subject.revisionTools")}
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                {blurb}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {subject.boards.map((board) => (
                  <Badge
                    key={board}
                    variant="outline"
                    className="text-muted-foreground"
                  >
                    {board}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2">
                  <a href="#tools">
                    {t("subject.browseTools", { count: subject.tools.length })}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#topics">{t("subject.syllabusTopics")}</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="subject-strip">
                <CardContent className="px-6">
                  <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
                    {t("subject.atGlance")}
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <dt className="text-label text-muted-foreground">
                        {t("subject.tools")}
                      </dt>
                      <dd className="mt-2 font-mono text-2xl font-semibold">
                        {subject.tools.length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-label text-muted-foreground">
                        {t("subject.topicAreas")}
                      </dt>
                      <dd className="mt-2 font-mono text-2xl font-semibold">
                        {subject.topics.length}
                      </dd>
                    </div>
                  </dl>
                  {/* Only promise "live shells while the tools are built"
                      while something in the section is still being built. */}
                  {!allLive ? (
                    <p className="mt-6 text-sm text-muted-foreground">
                      {t("subject.glanceNote")}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Syllabus topics */}
      <section id="topics" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              {t("subject.topicsTitle")}
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              {t("subject.topicsBody", { boards: subject.boards.join(" / ") })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="mt-12"
          >
            <Accordion
              type="multiple"
              defaultValue={[subject.topics[0]?.title ?? ""]}
              className="grid gap-4 md:grid-cols-2"
            >
              {subject.topics.map((topic, index) => (
                <AccordionItem
                  key={topic.title}
                  value={topic.title}
                  className="rounded-xl border border-border bg-card px-6"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-4 text-left">
                      <span
                        className="text-label w-6 shrink-0 font-mono font-semibold"
                        style={{ color: subject.accent }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">
                        {topic.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 pl-10">
                      {topic.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-4 text-sm text-muted-foreground"
                        >
                          <span
                            aria-hidden
                            className="mt-2 size-2 shrink-0 rounded-full"
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

      {/* Tools */}
      <section id="tools" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              {t("subject.toolsMappedTitle", { count: subject.tools.length })}
            </h2>
            {!allLive ? (
              <p className="mt-4 text-base text-muted-foreground">
                {status === "building"
                  ? t("subject.toolsBuildingBody")
                  : t("subject.toolsQueuedBody")}
              </p>
            ) : null}
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subject.tools.map((tool, index) => {
              const slug = slugify(tool.name);
              return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
                className="h-full"
              >
                <Link
                  to={`${subject.slug}/${slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col gap-4 px-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-label text-muted-foreground">
                          {t("common.toolNumber", {
                            number: String(index + 1).padStart(2, "0"),
                          })}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-label text-muted-foreground"
                        >
                          {isToolLive(subject.id, slug)
                            ? t("common.live")
                            : t("common.inDevelopment")}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        {tOr(`tool.${subject.id}.${slug}.name`, tool.name)}
                      </h3>
                      <p className="flex-1 text-sm text-muted-foreground">
                        {tOr(`tool.${subject.id}.${slug}.note`, tool.note)}
                      </p>
                      <span
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium",
                          HOVER,
                        )}
                        style={{ color: subject.accent }}
                      >
                        {t("common.openTool")}
                        <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subject switcher */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("subject.jumpTitle")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUBJECTS.filter((other) => other.id !== subject.id).map((other) => {
              const OtherIcon = other.icon;
              return (
                <Link
                  key={other.id}
                  to={other.slug}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-6 hover:border-foreground/20",
                    other.themeClass,
                    HOVER,
                  )}
                >
                  <OtherIcon
                    className="size-5 shrink-0"
                    style={{ color: other.accent }}
                  />
                  <span className="flex-1 text-sm font-medium">
                    {subjectName(other.id, other.name)}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" />
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
