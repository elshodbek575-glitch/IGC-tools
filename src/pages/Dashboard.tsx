import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, LogOut } from "lucide-react";

import { BrandMark } from "@/components/site/BrandMark";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { t, tOr, subjectName } = useI18n();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={t("dash.seoTitle")}
        description={t("dash.seoDescription")}
        path="/dashboard"
        noindex
      />

      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark className="size-8 text-primary" />
            <span className="text-sm font-bold tracking-tight">NovaTools</span>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            {t("common.signOut")}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dash.welcome")}
            {user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            {t("dash.body")}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn("h-full", subject.themeClass)}
              >
                <Link to={subject.slug} className="group block h-full">
                  <Card className="subject-strip h-full">
                    <CardContent className="flex h-full flex-col gap-4 px-6">
                      <Icon
                        className="size-5"
                        style={{ color: subject.accent }}
                      />
                      <h2 className="text-xl font-semibold tracking-tight">
                        {subjectName(subject.id, subject.name)}
                      </h2>
                      <p className="flex-1 text-sm text-muted-foreground">
                        {tOr(`subject.${subject.id}.tagline`, subject.tagline)}
                      </p>
                      <span className="flex items-center gap-2 border-t border-border pt-4 text-sm font-medium">
                        <span style={{ color: subject.accent }}>
                          {subject.status === "in-progress"
                            ? t("common.buildingNow")
                            : t("common.planned")}
                        </span>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
