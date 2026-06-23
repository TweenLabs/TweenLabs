import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/**
 * User Favorites — toggle, list, and check favorited components.
 */

// ── Toggle a favorite (add if missing, remove if exists) ────────
export const toggleFavorite = mutation({
  args: {
    componentName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be signed in to favorite components.");
    }

    const userId = identity.subject;

    // Check if already favorited
    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("userId_componentName", (q) =>
        q.eq("userId", userId).eq("componentName", args.componentName),
      )
      .first();

    if (existing) {
      // Remove favorite
      await ctx.db.delete(existing._id);
      return { action: "removed" as const, componentName: args.componentName };
    }

    // Add favorite
    await ctx.db.insert("userFavorites", {
      userId,
      componentName: args.componentName,
      addedAt: Date.now(),
    });

    return { action: "added" as const, componentName: args.componentName };
  },
});

// ── Get all favorites for the current user ──────────────────────
export const getUserFavorites = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    const favorites = await ctx.db
      .query("userFavorites")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    return favorites.map((f) => ({
      componentName: f.componentName,
      addedAt: f.addedAt,
    }));
  },
});

// ── Check if a specific component is favorited ──────────────────
export const isFavorited = query({
  args: {
    componentName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const userId = identity.subject;

    const existing = await ctx.db
      .query("userFavorites")
      .withIndex("userId_componentName", (q) =>
        q.eq("userId", userId).eq("componentName", args.componentName),
      )
      .first();

    return !!existing;
  },
});
