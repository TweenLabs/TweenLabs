import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Analytics — lightweight page view tracking stored in Convex.
 *
 * - trackPageView: Records a view (deduped by sessionId+path within 30s)
 * - getPopularComponents: Returns top N components by view count
 * - getViewStats: Returns total views and unique visitors
 */

// ── Track a page view ───────────────────────────────────────────
export const trackPageView = mutation({
  args: {
    path: v.string(),
    componentName: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID if available
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject || undefined;

    // Deduplicate: skip if same session + path within last 30 seconds
    if (args.sessionId) {
      const thirtySecondsAgo = Date.now() - 30_000;
      const recent = await ctx.db
        .query("pageViews")
        .withIndex("timestamp")
        .filter((q) =>
          q.and(
            q.gt(q.field("timestamp"), thirtySecondsAgo),
            q.eq(q.field("sessionId"), args.sessionId),
            q.eq(q.field("path"), args.path),
          ),
        )
        .first();

      if (recent) return null; // Already tracked recently
    }

    return await ctx.db.insert("pageViews", {
      path: args.path,
      componentName: args.componentName,
      sessionId: args.sessionId,
      userId,
      timestamp: Date.now(),
      referrer: args.referrer,
    });
  },
});

// ── Get popular components (top N by view count) ────────────────
export const getPopularComponents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    // Fetch all page views that have a componentName
    const views = await ctx.db
      .query("pageViews")
      .withIndex("componentName")
      .filter((q) => q.neq(q.field("componentName"), undefined))
      .collect();

    // Count views per component
    const counts = new Map<string, number>();
    for (const view of views) {
      if (view.componentName) {
        counts.set(
          view.componentName,
          (counts.get(view.componentName) || 0) + 1,
        );
      }
    }

    // Sort by count descending and return top N
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
    const allViews = await ctx.db.query("pageViews").collect();

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
    const limit = args.limit ?? 50;

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
    const limit = args.limit ?? 20;

    const views = await ctx.db.query("pageViews").collect();

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
      .collect();

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
