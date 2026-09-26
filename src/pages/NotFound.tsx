import { Link } from "react-router";
import { motion } from "framer-motion";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Seo } from "@/components/site/Seo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Page not found · NovaTools"
        description="The page you were looking for doesn't exist."
        path="/404"
      />
      <SiteHeader />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24">
        <div className="pointer-events-none absolute inset-0 bg-blueprint" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          <p className="font-mono text-sm font-semibold text-primary">404</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            That page doesn&apos;t exist. Head back home, or jump into a subject
            to keep revising.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/maths">Explore Maths</Link>
            </Button>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
