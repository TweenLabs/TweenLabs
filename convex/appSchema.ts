import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * App-specific tables (analytics + favorites).
 * Merged into the root schema alongside Better Auth tables.
 */
export const tables = {
  // ── Page view tracking ──────────────────────────────────────
  pageViews: defineTable({
    path: v.string(),
    componentName: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.string()),
    timestamp: v.number(),
    referrer: v.optional(v.string()),
  })
    .index("path", ["path"])
    .index("componentName", ["componentName"])
    .index("timestamp", ["timestamp"])
    .index("userId", ["userId"]),

  // ── User favorites ──────────────────────────────────────────
  userFavorites: defineTable({
    userId: v.string(),
    componentName: v.string(),
    addedAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_componentName", ["userId", "componentName"]),
};
