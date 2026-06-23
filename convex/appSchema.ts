import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * App-specific tables (analytics + favorites).
 * Merged into the root schema alongside Better Auth tables.
 *
 * Index design:
 * - Every field used in .withIndex() or .filter() has a covering index
 * - Compound indexes match query access patterns to eliminate full-table scans
 * - pageViews.by_session_path: enables O(1) dedup lookups
 * - pageViews.by_component: enables aggregation without scanning unrelated rows
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
    .index("by_timestamp", ["timestamp"])
    .index("by_path", ["path"])
    .index("by_component", ["componentName", "timestamp"])
    .index("by_session_path", ["sessionId", "path"])
    .index("by_userId", ["userId"]),

  // ── User favorites ──────────────────────────────────────────
  userFavorites: defineTable({
    userId: v.string(),
    componentName: v.string(),
    addedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_componentName", ["userId", "componentName"]),
};
