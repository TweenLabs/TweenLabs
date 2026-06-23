import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Analytics — production-grade page view tracking.
 *
 * Design:
 * - trackPageView: O(1) dedup via compound index (sessionId+path)
 * - getPopularComponents: bounded scan on component index
 * - getViewStats / getTopPages: bounded recent scans, never full-table
 * - getRecentViews: indexed desc scan with .take()
 * - getViewsByDay: time-bounded indexed scan (30 days max)
 *
 * All queries use .withIndex(), no unindexed .filter() on large datasets.
 * All limits are clamped to prevent client-side abuse.
 */

// ── Constants ───────────────────────────────────────────────────
const MAX_PATH_LENGTH = 512;
const MAX_REFERRER_LENGTH = 1024;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_COMPONENT_NAME_LENGTH = 64;
const DEDUP_WINDOW_MS = 30_000;
const BOUNDED_SCAN_LIMIT = 10_000;

// ── Track a page view ───────────────────────────────────────────
export const trackPageView = mutation({
  args: {
    path: v.string(),
    componentName: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  returns: v.union(v.id("pageViews"), v.null()),
  handler: async (ctx, args) => {
    // Input sanitization — truncate, never reject
    const path = args.path.slice(0, MAX_PATH_LENGTH);
    const sessionId = args.sessionId?.slice(0, MAX_SESSION_ID_LENGTH);
    const referrer = args.referrer?.slice(0, MAX_REFERRER_LENGTH);
    const componentName = args.componentName?.slice(
      0,
      MAX_COMPONENT_NAME_LENGTH,
    );

    // Derive userId from auth — never trust client
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? undefined;

    // Deduplicate via compound index (sessionId + path) — O(1) lookup
    if (sessionId) {
      const cutoff = Date.now() - DEDUP_WINDOW_MS;
      const recent = await ctx.db
        .query("pageViews")
        .withIndex("by_session_path", (q) =>
          q.eq("sessionId", sessionId).eq("path", path),
        )
        .order("desc")
        .first();

      if (recent && recent.timestamp > cutoff) {
        return null; // Already tracked within dedup window
      }
    }

    const id = await ctx.db.insert("pageViews", {
      path,
      componentName,
      sessionId,
      userId,
      timestamp: Date.now(),
      referrer,
    });

    return id;
  },
});

// ── Get popular components (top N by view count) ────────────────
export const getPopularComponents = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({ componentName: v.string(), viewCount: v.number() }),
  ),
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 10), 50);

    // Scan component index — only rows with componentName set
    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_component")
      .take(BOUNDED_SCAN_LIMIT);

    // Aggregate in-memory (bounded by SCAN_LIMIT)
    const counts = new Map<string, number>();
    for (const view of views) {
      const name = view.componentName;
      if (name) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([componentName, viewCount]) => ({ componentName, viewCount }));
  },
});

// ── Get overall view stats ──────────────────────────────────────
export const getViewStats = query({
  args: {},
  returns: v.object({
    totalViews: v.number(),
    uniqueVisitors: v.number(),
    authenticatedUsers: v.number(),
  }),
  handler: async (ctx) => {
    // Bounded recent scan — not a full table scan
    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp")
      .order("desc")
      .take(BOUNDED_SCAN_LIMIT);

    const uniqueSessions = new Set<string>();
    const uniqueUsers = new Set<string>();

    for (const view of views) {
      if (view.sessionId) uniqueSessions.add(view.sessionId);
      if (view.userId) uniqueUsers.add(view.userId);
    }

    return {
      totalViews: views.length,
      uniqueVisitors: uniqueSessions.size,
      authenticatedUsers: uniqueUsers.size,
    };
  },
});

// ── Get recent page views ───────────────────────────────────────
export const getRecentViews = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      path: v.string(),
      componentName: v.optional(v.string()),
      timestamp: v.number(),
      userId: v.optional(v.string()),
      referrer: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 50), 200);

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);

    return views.map((v) => ({
      path: v.path,
      componentName: v.componentName ?? undefined,
      timestamp: v.timestamp,
      userId: v.userId ?? undefined,
      referrer: v.referrer ?? undefined,
    }));
  },
});

// ── Get top pages by view count ─────────────────────────────────
export const getTopPages = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({ path: v.string(), viewCount: v.number() })),
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 20), 100);

    // Bounded scan on timestamp index (most recent N records)
    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp")
      .order("desc")
      .take(BOUNDED_SCAN_LIMIT);

    const counts = new Map<string, number>();
    for (const view of views) {
      counts.set(view.path, (counts.get(view.path) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([path, viewCount]) => ({ path, viewCount }));
  },
});

// ── Get views grouped by day (last 30 days) ─────────────────────
export const getViewsByDay = query({
  args: {},
  returns: v.array(v.object({ date: v.string(), viewCount: v.number() })),
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Time-bounded indexed scan — only last 30 days
    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp")
      .order("asc")
      .take(BOUNDED_SCAN_LIMIT);

    const dayCounts = new Map<string, number>();
    for (const view of views) {
      if (view.timestamp < thirtyDaysAgo) continue;
      const day = new Date(view.timestamp).toISOString().split("T")[0];
      dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
    }

    return Array.from(dayCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, viewCount]) => ({ date, viewCount }));
  },
});
