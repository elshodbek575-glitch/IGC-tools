import type { Subject } from "@/lib/subjects";
import { slugify } from "@/lib/subjects";

import { BIOLOGY_TOOLS } from "./biology";
import { CHEMISTRY_TOOLS } from "./chemistry";
import { CS_TOOLS } from "./computer-science";
import { MATHS_TOOLS } from "./maths";
import { PHYSICS_TOOLS } from "./physics";
import type { ToolDefinition } from "./types";

/**
 * Every implemented tool, keyed by "subjectId/tool-slug".
 *
 * Tools are added subject by subject; any tool without a definition still gets
 * its page, showing the in-development shell.
 */
const REGISTRY: Record<string, ToolDefinition> = {};

function register(subjectId: string, tools: ToolDefinition[]) {
  for (const tool of tools) {
    REGISTRY[`${subjectId}/${slugify(tool.name)}`] = tool;
  }
}

register("maths", MATHS_TOOLS);
register("physics", PHYSICS_TOOLS);
register("chemistry", CHEMISTRY_TOOLS);
register("biology", BIOLOGY_TOOLS);
register("computer-science", CS_TOOLS);

export function getDefinition(
  subjectId: string,
  toolSlug: string,
): ToolDefinition | undefined {
  return REGISTRY[`${subjectId}/${toolSlug}`];
}

export function isToolLive(subjectId: string, toolSlug: string): boolean {
  return Boolean(getDefinition(subjectId, toolSlug));
}

/**
 * How many of a subject's tools are actually implemented. Status badges read
 * from the registry rather than from a hand-written "planned" flag, so a label
 * can never drift out of step with what a tool page really does.
 */
export function subjectToolCounts(subject: Subject): {
  live: number;
  total: number;
} {
  const live = subject.tools.filter((tool) =>
    isToolLive(subject.id, slugify(tool.name)),
  ).length;
  return { live, total: subject.tools.length };
}

/** Coarse build state for a subject, derived from its tool counts. */
export type BuildStatus = "live" | "building" | "planned";

export function buildStatus({ live, total }: { live: number; total: number }): BuildStatus {
  if (total > 0 && live === total) return "live";
  return live > 0 ? "building" : "planned";
}

/** Absolute paths of every implemented tool, for the sitemap. */
export function liveToolPaths(): string[] {
  return Object.keys(REGISTRY).map((key) => `/${key}`);
}

export type { ToolDefinition } from "./types";
