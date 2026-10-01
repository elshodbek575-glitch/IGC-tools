import { Link } from "react-router";
import { motion } from "framer-motion";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Seo } from "@/components/site/Seo";
import { ToolSearchBar } from "@/components/site/ToolSearch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={t("nf.seoTitle")}
        description={t("nf.seoDescription")}
        path="/404"
        noindex
      />
      <SiteHeader />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-lg text-center"
        >
          <p className="font-mono text-sm font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            {t("nf.title")}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("nf.body")}
          </p>
          <ToolSearchBar className="mt-8 text-left" />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/">{t("common.backHome")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/maths">{t("common.exploreMaths")}</Link>
            </Button>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
