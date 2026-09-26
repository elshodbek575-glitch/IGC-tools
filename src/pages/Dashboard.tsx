import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, LogOut } from "lucide-react";

import { BrandMark } from "@/components/site/BrandMark";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { SUBJECTS } from "@/lib/subjects";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Your dashboard · NovaTools"
        description="Your NovaTools IGCSE revision workspace."
        path="/dashboard"
      />
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark className="size-8 rounded-lg" />
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
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-medium text-muted-foreground">
            Your revision workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Pick a subject to explore its syllabus topics and the tools being
            built for it. Tools will save your progress here as each subject goes
            live.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={cn("h-full", subject.themeClass)}
              >
                <Link to={subject.slug} className="group block h-full">
                  <Card className="h-full border-border/70 shadow-none transition-colors group-hover:border-[var(--subject-line)]">
                    <CardContent className="flex h-full flex-col p-5">
                      <span
                        className="flex size-10 items-center justify-center rounded-xl"
                        style={{
                          color: subject.accent,
                          backgroundColor: `color-mix(in oklab, ${subject.accent} 16%, transparent)`,
                        }}
                      >
                        <Icon className="size-5" />
                      </span>
                      <h2 className="mt-4 text-base font-semibold tracking-tight">
                        {subject.name}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                        {subject.tagline}
                      </p>
                      <span className="mt-4 flex items-center gap-1 border-t border-border/70 pt-4 text-xs font-medium text-[var(--subject)]">
                        {subject.status === "in-progress"
                          ? "Building now"
                          : "Planned"}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
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
