import { Link } from "react-router";
import { motion } from "framer-motion";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Seo } from "@/components/site/Seo";
import { ToolSearchBar } from "@/components/site/ToolSearch";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Page not found · NovaTools"
        description="The page you were looking for doesn't exist."
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
            Page not found
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            That page doesn&apos;t exist. Search for a tool below, or head back
            home.
          </p>
          <ToolSearchBar className="mt-8 text-left" />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
