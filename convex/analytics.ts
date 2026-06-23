import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Analytics — lightweight page view tracking stored in Convex.
 *
 * Production considerations:
 * - All queries use `.take()` with hard limits to prevent OOM on large tables
 * - Deduplication uses indexed scan with bounded time window
 * - Input validation prevents excessively long strings
 */

// ── Constants ───────────────────────────────────────────────────
const MAX_PATH_LENGTH = 512;
const MAX_REFERRER_LENGTH = 1024;
const MAX_SESSION_ID_LENGTH = 128;
const DEDUP_WINDOW_MS = 30_000;
const SCAN_LIMIT = 10_000; // Hard ceiling for any .collect() scan

// ── Track a page view ───────────────────────────────────────────
export const trackPageView = mutation({
  args: {
    path: v.string(),
    componentName: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Input validation — truncate oversized strings, never reject
    const path = args.path.slice(0, MAX_PATH_LENGTH);
    const sessionId = args.sessionId?.slice(0, MAX_SESSION_ID_LENGTH);
    const referrer = args.referrer?.slice(0, MAX_REFERRER_LENGTH);
    const componentName = args.componentName?.slice(0, 64);

    // Get authenticated user ID if available
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? undefined;

    // Deduplicate: skip if same session + path within last 30 seconds
    if (sessionId) {
      const cutoff = Date.now() - DEDUP_WINDOW_MS;
      const recent = await ctx.db
        .query("pageViews")
        .withIndex("timestamp")
        .filter((q) =>
          q.and(
            q.gt(q.field("timestamp"), cutoff),
            q.eq(q.field("sessionId"), sessionId),
            q.eq(q.field("path"), path),
          ),
        )
        .first();

      if (recent) return null;
    }

    return await ctx.db.insert("pageViews", {
      path,
      componentName,
      sessionId,
      userId,
      timestamp: Date.now(),
      referrer,
    });
  },
});

// ── Get popular components (top N by view count) ────────────────
export const getPopularComponents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 10), 50);

    // Use bounded scan to prevent OOM on large tables
    const views = await ctx.db
      .query("pageViews")
      .withIndex("componentName")
      .filter((q) => q.neq(q.field("componentName"), undefined))
      .take(SCAN_LIMIT);

    const counts = new Map<string, number>();
    for (const view of views) {
      if (view.componentName) {
        counts.set(
          view.componentName,
          (counts.get(view.componentName) || 0) + 1,
        );
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
  handler: async (ctx) => {
    // Bounded scan — count up to SCAN_LIMIT for stats
    const allViews = await ctx.db
      .query("pageViews")
      .withIndex("timestamp")
      .order("desc")
      .take(SCAN_LIMIT);

    const uniqueSessionIds = new Set<string>();
    const uniqueUserIds = new Set<string>();

    for (const view of allViews) {
      if (view.sessionId) uniqueSessionIds.add(view.sessionId);
      if (view.userId) uniqueUserIds.add(view.userId);
    }

    return {
      totalViews: allViews.length,
      uniqueVisitors: uniqueSessionIds.size,
      authenticatedUsers: uniqueUserIds.size,
    };
  },
});

// ── Get recent page views ───────────────────────────────────────
export const getRecentViews = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 50), 200);

    const views = await ctx.db
      .query("pageViews")
      .withIndex("timestamp")
      .order("desc")
      .take(limit);

    return views.map((v) => ({
      path: v.path,
      componentName: v.componentName,
      timestamp: v.timestamp,
      userId: v.userId,
      referrer: v.referrer,
    }));
  },
});

// ── Get top pages by view count ─────────────────────────────────
export const getTopPages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 20), 100);

    // Bounded scan
    const views = await ctx.db
      .query("pageViews")
      .withIndex("timestamp")
      .order("desc")
      .take(SCAN_LIMIT);

    const counts = new Map<string, number>();
    for (const view of views) {
      counts.set(view.path, (counts.get(view.path) || 0) + 1);
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
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("timestamp")
      .filter((q) => q.gt(q.field("timestamp"), thirtyDaysAgo))
      .take(SCAN_LIMIT);

    const dayCounts = new Map<string, number>();
    for (const view of views) {
      const day = new Date(view.timestamp).toISOString().split("T")[0];
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    }

    return Array.from(dayCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, viewCount]) => ({ date, viewCount }));
  },
});
