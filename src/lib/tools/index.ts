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

/** Absolute paths of every implemented tool, for the sitemap. */
export function liveToolPaths(): string[] {
  return Object.keys(REGISTRY).map((key) => `/${key}`);
}

export type { ToolDefinition } from "./types";
